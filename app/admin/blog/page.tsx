'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function AdminBlogPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedPosts, setSelectedPosts] = useState<number[]>([]);

  const posts: Array<{
    id: number;
    title: string;
    slug: string;
    author: string;
    category: string;
    image: string;
    excerpt: string;
    status: string;
    views: number;
    comments: number;
    publishDate: string;
    featured: boolean;
  }> = [];

  const statusColors: any = {
    'Published': 'bg-store-gold/15 text-store-gold',
    'Draft': 'bg-gray-100 text-gray-700',
    'Scheduled': 'bg-store-gold/15 text-store-gold'
  };

  const handleSelectAll = () => {
    if (selectedPosts.length === posts.length) {
      setSelectedPosts([]);
    } else {
      setSelectedPosts(posts.map(p => p.id));
    }
  };

  const handleSelectPost = (postId: number) => {
    if (selectedPosts.includes(postId)) {
      setSelectedPosts(selectedPosts.filter(id => id !== postId));
    } else {
      setSelectedPosts([...selectedPosts, postId]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Blog Posts</h1>
          <p className="text-gray-600 mt-1">Create and manage your blog content</p>
        </div>
        <Link href="/admin/blog/new" className="bg-store-gold hover:bg-store-goldDark text-white px-6 py-3 rounded-lg font-semibold transition-colors whitespace-nowrap">
          <i className="ri-add-line mr-2"></i>
          New Post
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border-2 border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">Total Posts</p>
          <p className="text-2xl font-bold text-gray-900">{posts.length}</p>
        </div>
        <div className="bg-white rounded-xl border-2 border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">Published</p>
          <p className="text-2xl font-bold text-store-gold">{posts.filter(p => p.status === 'Published').length}</p>
        </div>
        <div className="bg-white rounded-xl border-2 border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">Total Views</p>
          <p className="text-2xl font-bold text-gray-900">{posts.reduce((sum, p) => sum + p.views, 0).toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl border-2 border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">Comments</p>
          <p className="text-2xl font-bold text-store-gold">{posts.reduce((sum, p) => sum + p.comments, 0)}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <select className="px-4 py-2 pr-8 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-store-gold focus:border-store-gold font-medium cursor-pointer">
                <option>All Status</option>
                <option>Published</option>
                <option>Draft</option>
                <option>Scheduled</option>
              </select>
              <select className="px-4 py-2 pr-8 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-store-gold focus:border-store-gold font-medium cursor-pointer">
                <option>All Categories</option>
                <option>Interior Design</option>
                <option>Home Styling</option>
                <option>Sustainability</option>
                <option>Gift Ideas</option>
              </select>
              <select className="px-4 py-2 pr-8 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-store-gold focus:border-store-gold font-medium cursor-pointer">
                <option>Sort by Date</option>
                <option>Sort by Views</option>
                <option>Sort by Comments</option>
              </select>
            </div>
            <div className="flex border-2 border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`w-10 h-10 flex items-center justify-center transition-colors ${
                  viewMode === 'grid' ? 'bg-store-gold text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <i className="ri-grid-line text-xl"></i>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`w-10 h-10 flex items-center justify-center border-l-2 border-gray-300 transition-colors ${
                  viewMode === 'list' ? 'bg-store-gold text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <i className="ri-list-check text-xl"></i>
              </button>
            </div>
          </div>
        </div>

        {selectedPosts.length > 0 && (
          <div className="p-4 bg-store-gold/10 border-b border-store-gold/30 flex items-center justify-between">
            <p className="text-store-goldDark font-semibold">
              {selectedPosts.length} post{selectedPosts.length > 1 ? 's' : ''} selected
            </p>
            <div className="flex items-center space-x-2">
              <button className="px-4 py-2 bg-store-gold hover:bg-store-gold text-white rounded-lg text-sm font-medium transition-colors whitespace-nowrap">
                Publish
              </button>
              <button className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors whitespace-nowrap">
                Draft
              </button>
              <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors whitespace-nowrap">
                Delete
              </button>
            </div>
          </div>
        )}

        {viewMode === 'grid' ? (
          <div className="p-6">
            {posts.length === 0 ? (
              <div className="py-16 text-center text-gray-500">
                <i className="ri-article-line text-5xl text-gray-300 mb-4"></i>
                <p className="font-medium text-gray-900 mb-1">No blog posts yet</p>
                <p className="text-sm">Create your first post to get started.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
              <div key={post.id} className="border-2 border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={selectedPosts.includes(post.id)}
                    onChange={() => handleSelectPost(post.id)}
                    className="absolute top-3 left-3 w-5 h-5 text-store-gold border-gray-300 rounded focus:ring-store-gold cursor-pointer z-10"
                  />
                  <div className="aspect-video bg-gray-100 overflow-hidden">
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                  </div>
                  {post.featured && (
                    <span className="absolute top-3 right-3 bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap">
                      Featured
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-store-gold">{post.category}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[post.status]}`}>
                      {post.status}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{post.title}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-4 pb-4 border-b border-gray-200">
                    <span className="flex items-center">
                      <i className="ri-eye-line mr-1"></i>
                      {post.views}
                    </span>
                    <span className="flex items-center">
                      <i className="ri-chat-3-line mr-1"></i>
                      {post.comments}
                    </span>
                    <span className="whitespace-nowrap">{post.publishDate}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Link
                      href={`/admin/blog/${post.id}`}
                      className="flex-1 bg-store-gold hover:bg-store-goldDark text-white py-2 rounded-lg text-sm font-medium text-center transition-colors whitespace-nowrap"
                    >
                      Edit Post
                    </Link>
                    <button className="w-9 h-9 flex items-center justify-center border-2 border-gray-300 text-gray-700 hover:border-store-gold hover:text-store-gold rounded-lg transition-colors">
                      <i className="ri-eye-line"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
              </div>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="py-4 px-6">
                    <input
                      type="checkbox"
                      checked={selectedPosts.length === posts.length}
                      onChange={handleSelectAll}
                      className="w-4 h-4 text-store-gold border-gray-300 rounded focus:ring-store-gold cursor-pointer"
                    />
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Post</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Author</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Category</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Views</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Comments</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Status</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <input
                        type="checkbox"
                        checked={selectedPosts.includes(post.id)}
                        onChange={() => handleSelectPost(post.id)}
                        className="w-4 h-4 text-store-gold border-gray-300 rounded focus:ring-store-gold cursor-pointer"
                      />
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-20 h-14 bg-gray-100 rounded-lg overflow-hidden">
                          <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <Link href={`/admin/blog/${post.id}`} className="font-semibold text-gray-900 hover:text-store-gold">
                            {post.title}
                          </Link>
                          <p className="text-sm text-gray-500 mt-1">{post.publishDate}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-700">{post.author}</td>
                    <td className="py-4 px-4 text-gray-700">{post.category}</td>
                    <td className="py-4 px-4 font-semibold text-gray-900">{post.views}</td>
                    <td className="py-4 px-4 font-semibold text-gray-900">{post.comments}</td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${statusColors[post.status]}`}>
                        {post.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <Link
                          href={`/admin/blog/${post.id}`}
                          className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-store-gold hover:bg-store-gold/10 rounded-lg transition-colors"
                        >
                          <i className="ri-edit-line text-lg"></i>
                        </Link>
                        <button className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-store-gold hover:bg-store-gold/10 rounded-lg transition-colors">
                          <i className="ri-eye-line text-lg"></i>
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors">
                          <i className="ri-delete-bin-line text-lg"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="p-6 border-t border-gray-200 flex items-center justify-between">
          <p className="text-gray-600">Showing {posts.length} posts</p>
          <div className="flex items-center space-x-2">
            <button className="w-10 h-10 flex items-center justify-center border-2 border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
              <i className="ri-arrow-left-s-line text-xl text-gray-600"></i>
            </button>
            <button className="w-10 h-10 flex items-center justify-center bg-store-gold text-white rounded-lg font-semibold">1</button>
            <button className="w-10 h-10 flex items-center justify-center border-2 border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
              <i className="ri-arrow-right-s-line text-xl text-gray-600"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
