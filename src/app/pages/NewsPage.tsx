import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Calendar, Tag } from 'lucide-react';
import { motion } from 'motion/react';

import { resolveMediaUrl, storefrontApi } from '../api';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { PageTransition } from '../components/PageTransition';
import type { EditorialSummary } from '../lib/types';

export function NewsPage() {
  const [editorials, setEditorials] = useState<EditorialSummary[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string>('Tất cả');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    storefrontApi
      .getEditorials()
      .then(setEditorials)
      .catch((err: Error) => {
        setEditorials([]);
        setError(err.message);
      })
      .finally(() => setIsLoading(false));
  }, []);

  // Extract unique topics from available editorials
  const topics = ['Tất cả', ...Array.from(new Set(editorials.flatMap((e) => e.topics || [])))];

  // Filter based on chosen category tab
  const filteredEditorials = selectedTopic === 'Tất cả' 
    ? editorials 
    : editorials.filter((e) => e.topics && e.topics.includes(selectedTopic));

  const featuredStory = filteredEditorials[0];
  const remainingStories = filteredEditorials.slice(1);

  return (
    <PageTransition>
      <div className="min-h-screen bg-white text-[#11212D] pb-24 pt-28 lg:pt-36">
        <div className="mx-auto max-w-[1400px] px-6">
          {/* Header Section */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-xs uppercase tracking-[0.3em] text-[#A36B31] font-semibold mb-3"
            >
              Góc báo chí & Biên tập
            </motion.p>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-sterling text-[36px] sm:text-[48px] lg:text-[56px] leading-tight text-[#11212D] mb-6"
            >
              Cảm Hứng & Sáng Tạo
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-gray-500 text-base lg:text-lg leading-relaxed font-light"
            >
              Nơi chia sẻ những câu chuyện thương hiệu, nguồn cảm hứng nghệ thuật đằng sau mỗi tạo tác trang sức và phong cách sống thượng lưu cùng Oriven.
            </motion.p>
            <div className="h-[1px] w-20 bg-gradient-to-r from-transparent via-[#A36B31]/30 to-transparent mx-auto mt-6" />
          </div>

          {/* Error Message */}
          {error && (
            <div className="max-w-xl mx-auto border border-red-100 bg-red-50/50 rounded-xl px-6 py-4 text-sm text-red-600 text-center mb-10">
              Không thể tải nội dung tin tức: {error}
            </div>
          )}

          {/* Topics Category Tabs */}
          {!error && !isLoading && editorials.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mb-12 border-b border-[#F0ECE3] pb-6">
              {topics.map((topic) => (
                <button
                  key={topic}
                  type="button"
                  onClick={() => setSelectedTopic(topic)}
                  className={`px-5 py-2 text-xs md:text-sm font-semibold rounded-full uppercase tracking-wider transition-all duration-300 ${
                    selectedTopic === topic
                      ? 'bg-[#11212D] text-white shadow-md'
                      : 'bg-[#FAF9F5] text-gray-500 hover:bg-[#F0ECE3] hover:text-[#11212D]'
                  }`}
                >
                  {topic}
                </button>
              ))}
            </div>
          )}

          {/* Loading Skeletons */}
          {!error && isLoading && (
            <div className="space-y-12">
              <div className="grid gap-8 lg:grid-cols-12 items-center">
                <div className="lg:col-span-7 h-[420px] rounded-2xl bg-gray-100 animate-pulse" />
                <div className="lg:col-span-5 space-y-4">
                  <div className="h-4 w-28 bg-gray-100 rounded animate-pulse" />
                  <div className="h-10 w-full bg-gray-100 rounded animate-pulse" />
                  <div className="h-10 w-4/5 bg-gray-100 rounded animate-pulse" />
                  <div className="h-20 w-full bg-gray-100 rounded animate-pulse" />
                </div>
              </div>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="space-y-4">
                    <div className="h-[220px] rounded-xl bg-gray-100 animate-pulse" />
                    <div className="h-4 w-20 bg-gray-100 rounded animate-pulse" />
                    <div className="h-6 w-full bg-gray-100 rounded animate-pulse" />
                    <div className="h-16 w-full bg-gray-100 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {!error && !isLoading && filteredEditorials.length === 0 && (
            <div className="max-w-md mx-auto border border-dashed border-[#DCD7CC] rounded-2xl bg-[#FAF9F5] px-6 py-16 text-center shadow-sm">
              <BookOpen className="mx-auto text-[#A36B31] mb-4 stroke-1" size={48} />
              <h2 className="font-sterling text-2xl text-[#11212D] mb-2">Chưa có bài viết nào</h2>
              <p className="text-sm text-gray-500 font-light">
                Các câu chuyện thương hiệu thuộc chủ đề này đang được nghệ nhân Oriven chuẩn bị và sẽ sớm xuất hiện.
              </p>
            </div>
          )}

          {/* Main Content Showcase */}
          {!error && !isLoading && featuredStory && (
            <div className="space-y-16">
              {/* Featured Post Card */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="grid gap-8 lg:grid-cols-12 items-center overflow-hidden rounded-2xl border border-[#F0ECE3] bg-[#FAF9F5] shadow-[0_12px_40px_rgba(163,107,49,0.02)] p-6 lg:p-8 hover:shadow-[0_16px_48px_rgba(163,107,49,0.05)] transition-all duration-300"
              >
                <div className="lg:col-span-7 relative overflow-hidden rounded-xl group aspect-video min-h-[300px]">
                  <ImageWithFallback
                    src={resolveMediaUrl(featuredStory.coverMedia)}
                    alt={featuredStory.title}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 bg-[#11212D]/80 text-white backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
                    <Tag size={12} />
                    Nổi bật
                  </div>
                </div>

                <div className="lg:col-span-5 flex flex-col justify-center space-y-5 lg:pl-4">
                  <div className="flex items-center gap-4 text-xs text-gray-400 font-medium">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      Mới cập nhật
                    </span>
                    {featuredStory.topics[0] && (
                      <span className="bg-[#EAE5D9] text-[#A36B31] px-2.5 py-0.5 rounded-full uppercase tracking-wider text-[10px] font-semibold">
                        {featuredStory.topics[0]}
                      </span>
                    )}
                  </div>

                  <h2 className="font-sterling text-3xl sm:text-4xl lg:text-5xl leading-tight text-[#11212D] hover:text-[#A36B31] transition-colors duration-300">
                    <Link to={`/news/${featuredStory.slug}`}>{featuredStory.title}</Link>
                  </h2>

                  <p className="text-sm md:text-base text-gray-500 leading-relaxed font-light">
                    {featuredStory.summary || 'Khám phá thế giới nghệ thuật chế tác trang sức cao cấp và nguồn cảm hứng sáng tạo đột phá từ Oriven.'}
                  </p>

                  <div>
                    <Link
                      to={`/news/${featuredStory.slug}`}
                      className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-semibold text-[#11212D] hover:text-[#A36B31] transition-all duration-300 group"
                    >
                      Đọc câu chuyện này
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </motion.div>

              {/* Remaining Stories Grid */}
              {remainingStories.length > 0 && (
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {remainingStories.map((editorial, idx) => (
                    <motion.article
                      key={editorial.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: idx * 0.1 }}
                      className="group flex flex-col justify-between overflow-hidden rounded-xl border border-[#F0ECE3] bg-white p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className="space-y-4">
                        {/* Article Cover */}
                        <div className="relative overflow-hidden rounded-lg aspect-[16/10] mb-4">
                          <ImageWithFallback
                            src={resolveMediaUrl(editorial.coverMedia)}
                            alt={editorial.title}
                            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        </div>

                        {/* Article Meta */}
                        <div className="flex items-center justify-between text-[11px] text-gray-400">
                          <span className="uppercase tracking-widest text-[#A36B31] font-semibold">
                            {editorial.topics[0] || 'Biên tập'}
                          </span>
                        </div>

                        {/* Article Title */}
                        <h3 className="font-sterling text-[22px] md:text-[24px] leading-tight text-[#11212D] transition-colors duration-300 group-hover:text-[#A36B31]">
                          <Link to={`/news/${editorial.slug}`}>{editorial.title}</Link>
                        </h3>

                        {/* Article Summary */}
                        <p className="text-xs md:text-sm text-gray-500 leading-relaxed font-light line-clamp-3">
                          {editorial.summary || 'Tìm hiểu nguồn gốc thiết kế độc bản cùng kỹ năng thủ công đỉnh cao chế tạo nên sản phẩm này.'}
                        </p>
                      </div>

                      {/* Read Link */}
                      <div className="mt-6 pt-4 border-t border-[#F8F6F0]">
                        <Link
                          to={`/news/${editorial.slug}`}
                          className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-[#11212D] group-hover:text-[#A36B31] transition-all duration-300"
                        >
                          Đọc bài viết
                          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                        </Link>
                      </div>
                    </motion.article>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
