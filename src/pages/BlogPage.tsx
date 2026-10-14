import { usePageMeta } from '../hooks/usePageMeta';
import { pageMeta } from '../data/meta';
import { BlogCard } from '../components/common/BlogCard';
import { CardGrid } from '../components/common/CardGrid';
import { PageHeading } from '../components/common/PageHeading';
import { Reveal } from '../components/common/Reveal';
import { blogPosts } from '../data/blog';
import './ListingPage.css';

/** Blogübersicht /blog (Screenshots 30–31). Die in der Quelle unsichtbare Überschrift wird hier sichtbar gezeigt. */
export function BlogPage() {
  usePageMeta(pageMeta.blog.title, pageMeta.blog.description);
  return (
    <div className="listing-page listing-page--blog">
      <div className="listing-page__heading">
        <PageHeading title="Blog" count={blogPosts.length} />
      </div>
      <CardGrid variant="blog" label="Blogbeiträge">
        {blogPosts.map((post, index) => (
          <li key={post.slug}>
            <Reveal y={60} delay={(index % 2) * 0.08}>
              <BlogCard post={post} />
            </Reveal>
          </li>
        ))}
      </CardGrid>
    </div>
  );
}
