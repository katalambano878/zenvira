'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import PageHero from '@/components/PageHero';
import { PAGE_HEROES } from '@/lib/furniture-images';

function formatDate(date: string | null) {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  featured_image: string | null;
  published_at: string | null;
  tags: string[] | null;
};

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/storefront/blog');
        const data = await res.json();
        setPosts(Array.isArray(data) ? data : []);
      } catch {
        setPosts([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const formattedPosts = posts.map((post) => ({
    id: post.id,
    title: post.title,
    excerpt: post.excerpt || '',
    image: post.featured_image || PAGE_HEROES.blog,
    category: post.tags?.[0] || 'General',
    date: formatDate(post.published_at),
    readTime: '—',
    author: 'Staff',
  }));

  const featuredPost = formattedPosts[0] ?? null;
  const latestPosts = featuredPost ? formattedPosts.slice(1) : formattedPosts;

  return (
    <div className="min-h-screen bg-white">
      <PageHero
        title="Our Blog"
        subtitle="Articles and updates from our team. Publish posts in the admin to populate this page."
        backgroundImage={PAGE_HEROES.blog}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {loading ? (
          <div className="py-20 text-center text-gray-500">Loading posts...</div>
        ) : formattedPosts.length === 0 ? (
          <div className="py-20 text-center">
            <i className="ri-article-line text-6xl text-gray-300 mb-4"></i>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No posts yet</h2>
            <p className="text-gray-600 max-w-md mx-auto mb-8">
              Blog posts appear here once published from the admin panel.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-store-gold text-white px-6 py-3 rounded-full font-medium hover:bg-store-goldDark transition-colors"
            >
              Browse the shop
              <i className="ri-arrow-right-line"></i>
            </Link>
          </div>
        ) : (
          <>
            {featuredPost && (
              <Link href={`/blog/${featuredPost.id}`} className="block mb-16 hover:opacity-90 transition-opacity cursor-pointer">
                <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow">
                  <div className="grid md:grid-cols-2 gap-0">
                    <div className="relative h-96 md:h-auto">
                      <img
                        src={featuredPost.image}
                        alt={featuredPost.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-6 left-6">
                        <span className="bg-store-gold text-white px-4 py-2 rounded-full text-sm font-medium">
                          Featured
                        </span>
                      </div>
                    </div>
                    <div className="p-12 flex flex-col justify-center">
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                        <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full font-medium">
                          {featuredPost.category}
                        </span>
                        <span>{featuredPost.date}</span>
                      </div>
                      <h2 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
                        {featuredPost.title}
                      </h2>
                      <p className="text-gray-600 text-lg leading-relaxed mb-6">
                        {featuredPost.excerpt}
                      </p>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-store-gold/15 rounded-full flex items-center justify-center">
                          <i className="ri-user-line text-store-gold"></i>
                        </div>
                        <span className="text-gray-900 font-medium">{featuredPost.author}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            )}

            {latestPosts.length > 0 && (
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Latest Articles</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {latestPosts.map((post) => (
                    <Link
                      key={post.id}
                      href={`/blog/${post.id}`}
                      className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all cursor-pointer"
                    >
                      <div className="relative h-64">
                        <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="p-6">
                        <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                          <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full font-medium text-xs">
                            {post.category}
                          </span>
                          <span className="text-xs">{post.date}</span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight">{post.title}</h3>
                        <p className="text-gray-600 mb-4 leading-relaxed text-sm">{post.excerpt}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
