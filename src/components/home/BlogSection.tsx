import { blogPosts } from '../../data/blog';
import { BlogCard } from '../common/BlogCard';
import { Reveal } from '../common/Reveal';
import './BlogSection.css';

/** Blogbereich der Startseite: drei neueste Teaser (Tablet zeigt laut Quelle nur zwei). */
export function BlogSection() {
  const teasers = blogPosts.slice(0, 3);
  return (
    <section className="blog-section" aria-labelledby="blog-heading">
      <Reveal className="blog-section__header">
        <div className="blog-section__title-row">
          <h2 id="blog-heading" className="t-heading">
            Blog
          </h2>
          <p className="t-heading">({blogPosts.length})</p>
        </div>
        <p className="blog-section__intro t-body">
          Wir teilen Einblicke in die Getränkewelt, die Entwicklung unserer Marken und die Ideen, die Quellfrisch
          bewegen.
        </p>
      </Reveal>
      <Reveal className="blog-section__cards">
        <ul className="blog-section__list">
          {teasers.map((post, index) => (
            <li key={post.slug} className={`blog-section__item${index === 2 ? ' hide-tablet' : ''}`}>
              <Reveal y={60} delay={index * 0.08}>
                <BlogCard post={post} />
              </Reveal>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
