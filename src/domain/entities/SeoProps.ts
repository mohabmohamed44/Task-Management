export interface SEOProps {
    title: string;
    description: string;
    path: string;           // e.g., "/weekly-goals"
    image?: string;         // OG image URL
    type?: 'website' | 'article';
    noIndex?: boolean;      // For private pages
}