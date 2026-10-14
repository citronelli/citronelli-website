import { usePageMeta } from '../hooks/usePageMeta';
import { pageMeta, summarize } from '../data/meta';
import { Navigate, useParams } from 'react-router-dom';
import { BlogCard } from '../components/common/BlogCard';
import { RichText } from '../components/common/RichText';
import { DetailLayout } from '../components/detail/DetailLayout';
import { FactList } from '../components/detail/FactList';
import { findBlogPost, formatDate, nextBlogPosts } from '../data/blog';
import { getRichText } from '../data/richtext';
import './BlogArticlePage.css';

/** Blogartikel /blog/:slug. Texte aus reference/html extrahiert; fehlender Text wird offengelegt. */
export function BlogArticlePage() {
  const { slug = '' } = useParams();
  const post = findBlogPost(slug);
  const blocks = post ? getRichText(`blog/${post.slug}`) : undefined;
  const firstParagraph = blocks?.find((b) => b.type === 'p' && 'content' in b);
  usePageMeta(
    post?.title,
    firstParagraph && 'content' in firstParagraph
      ? summarize(firstParagraph.content.map((seg) => seg.text).join(''))
      : (post?.title ?? pageMeta.blog.description),
  );
  if (!post) return <Navigate to="/blog" replace />;

  const facts = [{ label: 'Publiziert', value: formatDate(post.date), dateTime: post.date as string | undefined }];
  if (post.author) facts.push({ label: 'Autor', value: post.author, dateTime: undefined });

  return (
    <DetailLayout
      variant="blog"
      image={post.image}
      imagePosition={post.imagePosition}
      title={post.title}
      aside={<FactList variant="stacked" facts={facts} />}
      after={
        <section className="blog-article__next" aria-labelledby="next-blog">
          <h2 id="next-blog" className="t-label">
            Nächster Beitrag
          </h2>
          <ul className="blog-article__next-list">
            {nextBlogPosts(post.slug).map((next, index) => (
              <li key={next.slug} className={index > 0 ? 'hide-mobile' : undefined}>
                <BlogCard post={next} />
              </li>
            ))}
          </ul>
        </section>
      }
    >
      {blocks && post.hasDetailSource ? (
        <RichText blocks={blocks} className="blog-article__text" />
      ) : (
        <div className="blog-article__missing" role="note">
          <p className="blog-article__missing-badge t-label">In Arbeit</p>
          <p className="t-body">Der Beitragstext liegt in der erfassten Quelle nicht vor und wird nachgereicht.</p>
        </div>
      )}
    </DetailLayout>
  );
}
