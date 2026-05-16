export default async function sitemap() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://blog-craft-ai-pi.vercel.app';
  const apiUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://ai-blogs-with-super-admin.vercel.app';
  
  try {
    const blogsResponse = await fetch(`${apiUrl}/api/blog/all`, {
      next: { revalidate: 3600 }
    });
    
    let blogs = [];
    if (blogsResponse.ok) {
      const blogsData = await blogsResponse.json();
      blogs = blogsData.blogs || [];
    }

    const blogEntries = blogs.map((blog) => ({
      url: `${siteUrl}/blogs/${blog.slug}`,
      lastModified: blog.updatedAt || blog.date || new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

    return [
      { url: siteUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
      ...blogEntries,
    ];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return [
      { url: siteUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    ];
  }
}