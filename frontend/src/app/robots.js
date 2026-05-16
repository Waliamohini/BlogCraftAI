export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://ai-blogs-with-super-admin.vercel.app';
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/_next/',
          '/uploads/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
} 