import { useCallback, useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { contactNav, mainNav } from '../../data/site';
import { images } from '../../data/images';
import { AppearWords } from '../common/AppearWords';
import './Header.css';

const DESKTOP_QUERY = '(min-width: 1200px)';
const FOCUSABLE = 'a[href], button:not([disabled])';

export function Header() {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const headerRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const firstMenuLinkRef = useRef<HTMLAnchorElement>(null);
  const location = useLocation();

  const close = useCallback((returnFocus: boolean) => {
    setOpen(false);
    if (returnFocus) toggleRef.current?.focus();
  }, []);

  // Seitenwechsel schließt das Menü.
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Beim Öffnen: Fokus auf ersten Menüpunkt, Seite nicht scrollbar.
  useEffect(() => {
    if (!open) return;
    document.body.classList.add('is-scroll-locked');
    firstMenuLinkRef.current?.focus();
    return () => document.body.classList.remove('is-scroll-locked');
  }, [open]);

  // Wechsel auf Desktop-Breite schließt das mobile Menü.
  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_QUERY);
    const onChange = () => {
      if (mq.matches) setOpen(false);
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // Escape schließt das Menü, Tab bleibt innerhalb des Headers.
  const onKeyDown = (event: ReactKeyboardEvent<HTMLElement>) => {
    if (!open) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      close(true);
      return;
    }
    if (event.key !== 'Tab' || !headerRef.current) return;
    const focusable = Array.from(headerRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
      (el) => el.offsetParent !== null,
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const menuItems = [...mainNav, contactNav];

  return (
    <header ref={headerRef} className={`site-header${open ? ' is-open' : ''}`} onKeyDown={onKeyDown}>
      <div className="site-header__bar">
        <div className="site-header__logo">
          <Link to="/" aria-label="Quellfrisch – Startseite">
            <img src={images.logoQuellfrisch} alt="" width={585} height={171} />
          </Link>
        </div>

        <div className="site-header__items">
          <nav className="site-header__nav hide-tablet hide-mobile" aria-label="Hauptnavigation">
            <ul className="site-header__list">
              {mainNav.map((item, index) => (
                <li key={item.path}>
                  <NavLink to={item.path} className="site-header__link t-label">
                    <AppearWords text={item.label} startDelay={0.1 + index * 0.05} />
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
          <div className="site-header__end">
            <NavLink to={contactNav.path} className="site-header__link t-label hide-tablet hide-mobile">
              <AppearWords text={contactNav.label} startDelay={0.2} />
            </NavLink>
            <button
              ref={toggleRef}
              type="button"
              className="site-header__toggle t-label hide-desktop"
              aria-expanded={open}
              aria-controls={menuId}
              onClick={() => (open ? close(false) : setOpen(true))}
            >
              Menü
            </button>
          </div>
        </div>
      </div>

      <nav id={menuId} className="mobile-menu hide-desktop" aria-label="Menü" hidden={!open}>
        <ul className="mobile-menu__list">
          {menuItems.map((item, index) => (
            <li key={item.path} className="mobile-menu__item" style={{ animationDelay: `${0.2 + index * 0.03}s` }}>
              <NavLink
                ref={index === 0 ? firstMenuLinkRef : undefined}
                to={item.path}
                className="mobile-menu__link t-heading"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
