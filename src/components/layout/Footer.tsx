import { Link } from 'react-router-dom';
import { footerNav } from '../../data/site';
import { images } from '../../data/images';
import './Footer.css';

interface ColumnProps {
  heading: string;
  items: { label: string; path: string }[];
  className?: string;
}

function FooterColumn({ heading, items, className }: ColumnProps) {
  return (
    <div className={['site-footer__column', className].filter(Boolean).join(' ')}>
      <p className="t-label">{heading}</p>
      <ul className="site-footer__items">
        {items.map((item) => (
          <li key={item.label}>
            <Link to={item.path} className="site-footer__link t-label-regular">
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  const { content, legal, social, copyright } = footerNav;
  return (
    <footer className="site-footer">
      <div className="site-footer__container">
        <div className="site-footer__top">
          <div className="site-footer__left">
            <FooterColumn {...content} />
          </div>
          <div className="site-footer__right">
            <FooterColumn {...legal} />
            <div className="site-footer__column">
              <p className="t-label">{social.heading}</p>
              <ul className="site-footer__items">
                {social.items.map((item) => (
                  <li key={item.label}>
                    <a href={item.href} className="site-footer__link t-label-regular" target="_blank" rel="noreferrer">
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="site-footer__bottom">
          <Link to="/" className="site-footer__logo" aria-label="Quellfrisch – Startseite">
            <img src={images.logoQuellfrisch} alt="" width={585} height={171} loading="lazy" />
          </Link>
          <p className="site-footer__copyright">{copyright}</p>
        </div>
      </div>
    </footer>
  );
}
