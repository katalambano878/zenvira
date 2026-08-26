import Link from 'next/link';
import { notFound } from 'next/navigation';
import { sanitizeHtml } from '@/lib/sanitize';
import { query, queryOne } from '@/lib/db';
import { PAGE_HEROES } from '@/lib/furniture-images';

export const dynamic = 'force-dynamic';

function formatDate(date: string | null) {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

async function fetchPost(id: string) {
  const { isDatabaseConfigured } = await import('@/lib/db');
  if (!isDatabaseConfigured()) return null;
  return queryOne(
    `SELECT id, title, slug, excerpt, content, featured_image, published_at, tags
     FROM blog_posts
     WHERE (slug = $1 OR id::text = $1) AND status = 'published'::blog_status
     LIMIT 1`,
    [id]
  );
}

export default async function BlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let post: Awaited<ReturnType<typeof fetchPost>> = null;
  try {
    post = await fetchPost(id);
  } catch {
    notFound();
  }

  if (!post) {
    notFound();
  }

  type RelatedRow = { id: string; title: string; featured_image?: string | null; tags?: string[] | null };

  const relatedResult = await query<RelatedRow>(
    `SELECT id, title, slug, featured_image, tags
     FROM blog_posts
     WHERE status = 'published'::blog_status AND id <> $1::uuid
     ORDER BY published_at DESC NULLS LAST
     LIMIT 2`,
    [post.id]
  );

  const relatedPosts =
    relatedResult.rows.map((p) => ({
      id: p.id,
      title: p.title,
      image: p.featured_image || PAGE_HEROES.blog,
      category: p.tags?.[0] || 'General',
    })) ?? [];

  const heroImage = (post.featured_image as string | null) || PAGE_HEROES.blog;
  const category = (post.tags as string[] | null)?.[0] || 'General';
  const published = formatDate(post.published_at as string | null);

  return (
    <div className="min-h-screen bg-white">
      <div className="relative h-96 bg-gray-900">
        <img src={heroImage} alt={post.title as string} className="w-full h-full object-cover opacity-50" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="inline-block bg-store-gold text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
              {category}
            </span>
            <h1 className="text-5xl font-bold text-white mb-6">{post.title as string}</h1>
            {published && (
              <div className="flex items-center justify-center gap-6 text-white/80">
                <span className="flex items-center gap-2">
                  <i className="ri-calendar-line"></i>
                  {published}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <article className="prose prose-lg max-w-none">
          <div
            className="text-gray-600 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(String(post.content || '')) }}
            style={{ fontSize: '1.125rem', lineHeight: '1.8' }}
          />
        </article>

        {relatedPosts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Related Articles</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {relatedPosts.map((relatedPost: { id: string; title: string; image: string; category: string }) => (
                <Link
                  key={relatedPost.id}
                  href={`/blog/${relatedPost.id}`}
                  className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all cursor-pointer"
                >
                  <div className="relative h-48">
                    <img src={relatedPost.image} alt={relatedPost.title} className="w-full h-full object-cover" />
                    <span className="absolute top-4 left-4 bg-store-gold text-white px-3 py-1 rounded-full text-xs font-medium">
                      {relatedPost.category}
                    </span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 leading-tight">{relatedPost.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="mt-12 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-store-gold font-medium hover:gap-3 transition-all"
          >
            <i className="ri-arrow-left-line"></i>
            Back to Blog
          </Link>
        </div>
      </div>
    </div>
  );
}
