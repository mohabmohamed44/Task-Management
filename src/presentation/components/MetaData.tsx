import type { SEOProps } from '@/domain/entities/SeoProps';
import { Helmet } from 'react-helmet-async';

const SITE_URL = 'https://prioritize.netlify.app';
const DEFAULT_IMAGE = '/og-image.png'; // Add a default OG image to your public folder

export default function MetaData({
  title,
  description,
  path,
  image = DEFAULT_IMAGE,
  type = 'website',
  noIndex = false,
}: SEOProps) {
  const fullTitle = `${title} | Prioritize`;
  const canonicalUrl = `${SITE_URL}${path}`;
  const imageUrl = image.startsWith('http') ? image : `${SITE_URL}${image}`;

  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="author" content="Prioritize" />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Facebook / Open Graph tags */}
      <meta property="og:site_name" content="Prioritize" />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={imageUrl} />

      {/* Twitter tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />

      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': type === 'article' ? 'Article' : 'WebPage',
          name: fullTitle,
          description: description,
          url: canonicalUrl,
          ...(type === 'website' && {
            '@type': 'SoftwareApplication',
            applicationCategory: 'ProductivityApplication',
            operatingSystem: 'All',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'EGP',
            },
          }),
        })}
      </script>
    </Helmet>
  );
}