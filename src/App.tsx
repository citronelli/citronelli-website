import { Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { legacyRedirects } from './data/site';
import { AboutPage } from './pages/AboutPage';
import { BlogArticlePage } from './pages/BlogArticlePage';
import { BlogPage } from './pages/BlogPage';
import { BrandDetailPage } from './pages/BrandDetailPage';
import { BrandsPage } from './pages/BrandsPage';
import { CareerPage } from './pages/CareerPage';
import { ContactPage } from './pages/ContactPage';
import { EinsatzbereichDetailPage } from './pages/EinsatzbereichDetailPage';
import { EinsatzbereichePage } from './pages/EinsatzbereichePage';
import { HomePage } from './pages/HomePage';
import { LegalPage } from './pages/LegalPage';
import { NotFoundPage } from './pages/NotFoundPage';

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="work" element={<BrandsPage />} />
        <Route path="work/:slug" element={<BrandDetailPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="career" element={<CareerPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="einsatzbereiche" element={<EinsatzbereichePage />} />
        <Route path="einsatzbereiche/:slug" element={<EinsatzbereichDetailPage />} />
        <Route path="blog" element={<BlogPage />} />
        <Route path="blog/:slug" element={<BlogArticlePage />} />
        <Route path="imprint" element={<LegalPage kind="imprint" />} />
        <Route path="privacy" element={<LegalPage kind="privacy" />} />
        {Object.entries(legacyRedirects).map(([from, to]) => (
          <Route key={from} path={from} element={<Navigate to={to} replace />} />
        ))}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
