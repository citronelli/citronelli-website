import { useEffect, useRef } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { images } from '../../data/images';
import './LogoPortal.css';

const LOGO_WIDTH = 1427;
const LOGO_HEIGHT = 1102;
/** Schwarzes Quadrat im Logo, gemessen in qf_logo_neu.png (Pixel). */
const SQUARE = { x: 284, y: 62, size: 856 };
/** Obere Kante des Q und Unterkante des Schriftzugs, bezogen aufs Quadrat (Anteil der Kantenlänge). */
const Q_TOP = 0.43;
const LOGO_BOTTOM = 1.144;
/** Zoomziel: rein schwarze Fläche oben links im Quadrat (Anteil der Kantenlänge). */
const TARGET = 0.2;
/** Drehung über die Zoomstrecke; negativ = nach links. */
const ROTATION = -90;

/** Abschnitte des Scrollfortschritts (0–1). */
const FRONT_FADE_END = 0.1;
const FILL_FADE_START = 0.6;
const FILL_FADE_END = 0.85;
const ZOOM_END = 0.9;

const HEADER_STATE_ATTR = 'data-header-state';

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

interface LogoPortalProps {
  /** Inhalt über dem Logo; wird zu Beginn des Zooms ausgeblendet. */
  front: ReactNode;
  /** Scrollstrecke des Zooms in Bildschirmhöhen. */
  scrollLength?: number;
}

/**
 * Einstieg mit Scroll-Zoom ins schwarze Quadrat des Logos, bis der Bildschirm schwarz ist.
 * Das Logo dreht sich dabei um das Zoomziel 90° nach links.
 * Das Q ist im PNG transparent; die schwarze Fläche liegt daher hinter dem Logo und blendet
 * erst während des Zooms ein. Bei prefers-reduced-motion bleibt das Logo statisch (ohne Zoom).
 */
export function LogoPortal({ front, scrollLength = 2.5 }: LogoPortalProps) {
  const rootRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const frontRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    const logo = logoRef.current;
    const fill = fillRef.current;
    const frontLayer = frontRef.current;
    if (!root || !stage || !logo || !fill || !frontLayer) return;

    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const html = document.documentElement;
    let frame = 0;
    let headerState: string | null = null;
    let geometry = { originY: 0, side: 0, maxScale: 1, barHeight: 0 };

    const setHeaderState = (next: string | null) => {
      if (next === headerState) return;
      headerState = next;
      if (next) html.setAttribute(HEADER_STATE_ATTR, next);
      else html.removeAttribute(HEADER_STATE_ATTR);
    };

    const reset = () => {
      setHeaderState(null);
      for (const el of [logo, fill, frontLayer]) el.removeAttribute('style');
    };

    const measure = () => {
      const fit = Math.min(logo.offsetWidth / LOGO_WIDTH, logo.offsetHeight / LOGO_HEIGHT);
      const side = SQUARE.size * fit;
      const left = logo.offsetLeft + (logo.offsetWidth - LOGO_WIDTH * fit) / 2 + SQUARE.x * fit;
      const top = logo.offsetTop + (logo.offsetHeight - LOGO_HEIGHT * fit) / 2 + SQUARE.y * fit;
      const originX = left + TARGET * side;
      const originY = top + TARGET * side;

      fill.style.left = `${left}px`;
      fill.style.top = `${top}px`;
      fill.style.width = `${side}px`;
      fill.style.height = `${side}px`;
      fill.style.transformOrigin = `${TARGET * side}px ${TARGET * side}px`;
      logo.style.transformOrigin = `${originX - logo.offsetLeft}px ${originY - logo.offsetTop}px`;

      const { clientWidth: width, clientHeight: height } = stage;
      const near = TARGET * side;
      const far = (1 - TARGET) * side;
      // Endlage nach der Drehung: Die obere Quadratkante zeigt nach links, die rechte nach oben.
      const cover = Math.max(originX / near, (height - originY) / near, (width - originX) / far, originY / far);
      const qGone = (width - originX) / ((Q_TOP - TARGET) * side);
      geometry = {
        originY,
        side,
        maxScale: Math.max(cover, qGone) * 1.02,
        barHeight: document.querySelector('.site-header__bar')?.clientHeight ?? 0,
      };
    };

    const update = () => {
      frame = 0;
      const { originY, side, maxScale, barHeight } = geometry;
      const bounds = root.getBoundingClientRect();
      const distance = bounds.height - stage.offsetHeight;
      const progress = distance > 0 ? clamp01(-bounds.top / distance) : 0;

      // Exponentiell, damit der Zoom über die ganze Strecke gleich schnell wirkt.
      const zoom = clamp01(progress / ZOOM_END);
      const scale = maxScale ** zoom;
      const angle = ROTATION * zoom;
      const fillOpacity = clamp01((progress - FILL_FADE_START) / (FILL_FADE_END - FILL_FADE_START));
      const frontOpacity = 1 - clamp01(progress / FRONT_FADE_END);

      const transform = `rotate(${angle}deg) scale(${scale})`;
      logo.style.transform = transform;
      fill.style.transform = transform;
      fill.style.opacity = String(fillOpacity);
      logo.style.visibility = fillOpacity >= 1 ? 'hidden' : 'visible';
      frontLayer.style.opacity = String(frontOpacity);
      frontLayer.style.visibility = frontOpacity <= 0 ? 'hidden' : 'visible';

      // Header: aus, sobald das Logo ihn erreicht; invertiert erst, wenn alles schwarz ist.
      const radians = (angle * Math.PI) / 180;
      const near = -TARGET * side * scale;
      const logoTop = Math.min(
        ...[near, (1 - TARGET) * side * scale].flatMap((x) =>
          [near, (LOGO_BOTTOM - TARGET) * side * scale].map((y) => originY + x * Math.sin(radians) + y * Math.cos(radians)),
        ),
      );
      if (bounds.bottom <= barHeight) setHeaderState(null);
      else if (fillOpacity >= 1 && zoom >= 1) setHeaderState('dark');
      else setHeaderState(logoTop < barHeight ? 'hidden' : null);
    };

    const requestUpdate = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    const refresh = () => {
      if (motion.matches) {
        reset();
        return;
      }
      measure();
      update();
    };

    const onScroll = () => {
      if (!motion.matches) requestUpdate();
    };

    refresh();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', refresh);
    motion.addEventListener('change', refresh);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', refresh);
      motion.removeEventListener('change', refresh);
      setHeaderState(null);
    };
  }, []);

  return (
    <section
      ref={rootRef}
      className="hero logo-portal"
      id="hero"
      aria-label="Einführung"
      style={{ '--portal-length': scrollLength } as CSSProperties}
    >
      <div ref={stageRef} className="logo-portal__stage">
        <div ref={fillRef} className="logo-portal__fill" aria-hidden="true" />
        <img
          ref={logoRef}
          className="logo-portal__logo"
          src={images.logoQuellfrischHero}
          alt="Quellfrisch Logo"
          width={LOGO_WIDTH}
          height={LOGO_HEIGHT}
          fetchPriority="high"
        />
        <div ref={frontRef} className="logo-portal__front">
          {front}
        </div>
      </div>
    </section>
  );
}
