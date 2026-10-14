"""
Extrahiert Langtexte (Blogartikel, Impressum, Datenschutz) aus den erfassten Original-HTML-Dateien
in strukturierte JSON-Daten. Wortlaut bleibt unverändert; Framer-Zeichen-Spans werden zusammengeführt.

Benötigt das (nicht versionierte) Referenzpaket. Aufruf:
  QF_REFERENCE=/pfad/zum/referenzpaket python3 -I scripts/extract-richtext.py
"""
import json, os, re
from html.parser import HTMLParser

ROOT = os.environ.get('QF_REFERENCE') or os.path.join(os.path.dirname(__file__), '..', '..')
HTML = os.path.join(ROOT, 'reference', 'html')
OUT = os.path.join(os.path.dirname(__file__), '..', 'src', 'data', 'generated')

SOURCES = {
    'blog/wellnesshotels': ('blog__wellnesshotels.html', 'fgvene'),
    'blog/spakonzept': ('blog__spakonzept.html', 'fgvene'),
    'blog/speisebegleitung': ('blog__speisebegleitung.html', 'fgvene'),
    'blog/zutatenwissen': ('blog__zutatenwissen.html', 'fgvene'),
    'blog/produktentwicklung': ('blog__produktentwicklung.html', 'fgvene'),
    'imprint': ('imprint.html', '1pz6vz1'),
    'privacy': ('privacy.html', 'cj8o5j'),
}


class Extractor(HTMLParser):
    """Liest das erste Element mit der Zielklasse und wandelt es in Blöcke um."""

    def __init__(self, cls):
        super().__init__(convert_charrefs=True)
        self.cls = 'framer-' + cls
        self.depth = 0
        self.active = False
        self.done = False
        self.blocks = []
        self.block = None
        self.list = None
        self.marks = []  # aktive Inline-Auszeichnungen: ('strong'|'em'|'a', href)

    def _push_text(self, text):
        if self.block is None or not text:
            return
        mark = {}
        for kind, href in self.marks:
            if kind == 'a':
                mark['href'] = href
            else:
                mark[kind] = True
        segs = self.block['content']
        if segs and isinstance(segs[-1], dict) and segs[-1].get('marks') == mark:
            segs[-1]['text'] += text
        else:
            segs.append({'text': text, 'marks': mark})

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if self.done:
            return
        if not self.active:
            if self.cls in (a.get('class') or '').split():
                self.active = True
                self.depth = 0
            else:
                return
        if tag not in ('br', 'img', 'input'):
            self.depth += 1
        if tag in ('h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'):
            if self.list is not None and self.block is not None and self.block.get('inList'):
                return  # <p> innerhalb eines <li>
            self.block = {'type': tag, 'content': []}
        elif tag in ('ul', 'ol'):
            self.list = {'type': tag, 'items': []}
        elif tag == 'li':
            self.block = {'type': 'li', 'content': [], 'inList': True}
        elif tag == 'br':
            if self.block is not None:
                self.block['content'].append({'text': '\n', 'marks': {}})
        elif tag in ('strong', 'b'):
            self.marks.append(('strong', None))
        elif tag in ('em', 'i'):
            self.marks.append(('em', None))
        elif tag == 'a':
            self.marks.append(('a', a.get('href')))

    def handle_endtag(self, tag):
        if not self.active or self.done:
            return
        self.depth -= 1
        if tag in ('strong', 'b', 'em', 'i', 'a') and self.marks:
            self.marks.pop()
        elif tag in ('h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p') and self.block and not self.block.get('inList'):
            self._close_block()
        elif tag == 'li' and self.block:
            self.block.pop('inList', None)
            self.list['items'].append(clean(self.block['content']))
            self.block = None
        elif tag in ('ul', 'ol') and self.list is not None:
            self.blocks.append(self.list)
            self.list = None
        if self.depth <= 0:
            self.active = False
            self.done = True

    def _close_block(self):
        content = clean(self.block['content'])
        if content:
            self.blocks.append({'type': self.block['type'], 'content': content})
        self.block = None

    def handle_data(self, data):
        if self.active and not self.done:
            self._push_text(data)


def clean(segs):
    out = []
    for s in segs:
        text = s['text'].replace(' ', ' ')
        if not text:
            continue
        seg = {'text': text}
        seg.update(s['marks'])
        if out and {k: v for k, v in out[-1].items() if k != 'text'} == {k: v for k, v in seg.items() if k != 'text'}:
            out[-1]['text'] += text
        else:
            out.append(seg)
    # führende/abschließende Leerzeichen und Umbrüche entfernen
    while out and not out[0]['text'].strip():
        out.pop(0)
    while out and not out[-1]['text'].strip():
        out.pop()
    if out:
        out[0]['text'] = out[0]['text'].lstrip()
        out[-1]['text'] = out[-1]['text'].rstrip()
    return out


# Redaktionelle Korrekturen (Abschlussdurchgang): Verweise auf nicht vorhandene Zutatenseiten entfernen.
# Nur Streichungen, keine neuen Inhalte.
EDITS = {
    'blog/zutatenwissen': [
        ('Auf unseren Zutatenseiten stellen wir die verwendeten Säfte näher vor. ', ''),
    ],
    'blog/produktentwicklung': [
        ('Auf unseren Zutatenseiten stellen wir die Säfte näher vor. Damit möchten wir nachvollziehbar machen, welche Ausgangsprodukte hinter Citronelli stehen.', ''),
    ],
}


def apply_edits(key, blocks):
    for old, new in EDITS.get(key, []):
        hits = 0
        for block in blocks:
            for seg in block.get('content', []):
                if old in seg['text']:
                    seg['text'] = seg['text'].replace(old, new)
                    hits += 1
        if hits != 1:
            raise SystemExit(f'Korrektur für {key} nicht eindeutig: {old[:40]}')
    return [b for b in blocks if 'items' in b or ''.join(s['text'] for s in b['content']).strip()]


def main():
    os.makedirs(OUT, exist_ok=True)
    result = {}
    for key, (file, cls) in SOURCES.items():
        with open(os.path.join(HTML, file), encoding='utf-8') as fh:
            p = Extractor(cls)
            p.feed(fh.read())
        result[key] = apply_edits(key, p.blocks)
        print(f'{key}: {len(p.blocks)} Blöcke')
    with open(os.path.join(OUT, 'richtext.json'), 'w', encoding='utf-8') as fh:
        json.dump(result, fh, ensure_ascii=False, indent=1)


if __name__ == '__main__':
    main()
