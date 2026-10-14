import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import './RichText.css';

export interface RichSegment {
  text: string;
  href?: string;
  strong?: boolean;
  em?: boolean;
}

export type RichBlock =
  | { type: 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'; content: RichSegment[] }
  | { type: 'ul' | 'ol'; items: RichSegment[][] };

function Segments({ segments }: { segments: RichSegment[] }) {
  return (
    <>
      {segments.map((seg, i) => {
        let node: React.ReactNode = seg.text;
        if (seg.strong) node = <strong>{node}</strong>;
        if (seg.em) node = <em>{node}</em>;
        if (seg.href) {
          const internal = seg.href.startsWith('/') || seg.href.startsWith('./');
          node = internal ? (
            <Link to={seg.href.replace(/^\.\//, '/')}>{node}</Link>
          ) : (
            <a href={seg.href} target="_blank" rel="noreferrer">
              {node}
            </a>
          );
        }
        return <Fragment key={i}>{node}</Fragment>;
      })}
    </>
  );
}

/**
 * Langtext aus strukturierten Blöcken (aus dem Originalquelltext extrahiert, siehe scripts/extract-richtext.py).
 * Überschriften im Fließtext werden eine Ebene unter der Seitenüberschrift ausgegeben.
 */
export function RichText({ blocks, className }: { blocks: RichBlock[]; className?: string }) {
  return (
    <div className={['rich-text', className].filter(Boolean).join(' ')}>
      {blocks.map((block, i) => {
        if ('items' in block) {
          const List = block.type;
          return (
            <List key={i} className="rich-text__list">
              {block.items.map((item, j) => (
                <li key={j}>
                  <Segments segments={item} />
                </li>
              ))}
            </List>
          );
        }
        const Tag = block.type === 'p' ? 'p' : block.type === 'h3' ? 'h2' : 'h3';
        return (
          <Tag key={i} className={`rich-text__${block.type}`}>
            <Segments segments={block.content} />
          </Tag>
        );
      })}
    </div>
  );
}
