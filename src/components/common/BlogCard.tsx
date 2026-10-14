import { Link } from 'react-router-dom';
import { formatDate } from '../../data/blog';
import type { BlogPost } from '../../data/blog';
import './BlogCard.css';

/** Blogteaser (Komponente .framer-i3IdE). */
export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link to={post.path} className="blog-card">
      <span className="blog-card__media">
        <img
          src={post.image}
          alt=""
          loading="lazy"
          className="blog-card__image"
          style={{ objectPosition: post.imagePosition }}
        />
      </span>
      <span className="blog-card__content">
        <time className="t-body" dateTime={post.date}>
          {formatDate(post.date)}
        </time>
        <span className="blog-card__title t-body">{post.title}</span>
      </span>
    </Link>
  );
}
