import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { ArrowLeft } from 'lucide-react';

import { resolveMediaUrl, storefrontApi } from '../api';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { PageTransition } from '../components/PageTransition';
import type { EditorialDetail, EditorialSectionBlock, MediaAsset } from '../lib/types';

function hasText(value?: string | null) {
  return Boolean(value && /\S/.test(value));
}

function getSectionText(section: EditorialSectionBlock) {
  return section.content ?? section.body ?? '';
}

function getSectionMedia(section: EditorialSectionBlock) {
  if (!section.media) {
    return [];
  }

  return Array.isArray(section.media) ? section.media : [section.media];
}

function sortSections(sections: EditorialSectionBlock[]) {
  return [...sections].sort((left, right) => (left.displayOrder ?? 999) - (right.displayOrder ?? 999));
}

function SectionMediaGallery({
  items,
  altFallback,
}: {
  items: MediaAsset[];
  altFallback: string;
}) {
  if (items.length === 0) {
    return null;
  }

  if (items.length === 1) {
    return (
      <div className="overflow-hidden rounded-sm bg-muted">
        <ImageWithFallback
          src={resolveMediaUrl(items[0])}
          alt={altFallback}
          className="max-h-[560px] w-full object-cover"
        />
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {items.map((media, index) => (
        <div key={`${media.url}-${index}`} className="overflow-hidden rounded-sm bg-muted">
          <ImageWithFallback
            src={resolveMediaUrl(media)}
            alt={`${altFallback} ${index + 1}`}
            className="h-full min-h-[240px] w-full object-cover"
          />
        </div>
      ))}
    </div>
  );
}

export function NewsDetailPage() {
  const { slug } = useParams();
  const [editorial, setEditorial] = useState<EditorialDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      return;
    }

    setIsLoading(true);
    setError(null);

    storefrontApi
      .getEditorialBySlug(slug)
      .then(setEditorial)
      .catch((err: Error) => {
        setEditorial(null);
        setError(err.message);
      })
      .finally(() => setIsLoading(false));
  }, [slug]);

  return (
    <PageTransition>
      <div className="min-h-screen bg-white pb-20 pt-28 lg:pt-32">
        <div className="mx-auto max-w-[1400px] px-6">
          <Link
            to="/news"
            className="mb-8 inline-flex items-center gap-2 text-sm text-foreground/70 transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại News
          </Link>

          {error ? (
            <div className="border border-red-200 bg-red-50 px-6 py-4 text-sm text-red-600">
              Không thể tải bài viết: {error}
            </div>
          ) : null}

          {!error && isLoading ? (
            <div className="space-y-6">
              <div className="h-12 w-2/3 animate-pulse bg-muted" />
              <div className="h-[420px] animate-pulse bg-muted" />
              <div className="space-y-3">
                <div className="h-4 w-full animate-pulse bg-muted" />
                <div className="h-4 w-full animate-pulse bg-muted" />
                <div className="h-4 w-4/5 animate-pulse bg-muted" />
              </div>
            </div>
          ) : null}

          {!error && !isLoading && editorial ? (
            <article>
              <div className="border-b border-border pb-10">
                <p className="mb-4 text-sm uppercase tracking-[0.3em] text-foreground/60">
                  {editorial.topics[0] ?? 'Editorial'}
                </p>
                <h1 className="max-w-4xl font-sterling text-[40px] leading-tight text-primary lg:text-[58px]">
                  {editorial.title}
                </h1>
                {hasText(editorial.summary) ? (
                  <p className="mt-6 max-w-3xl text-base leading-8 text-foreground/82 lg:text-lg">
                    {editorial.summary}
                  </p>
                ) : null}
              </div>

              <div className="mt-10 overflow-hidden rounded-sm bg-muted">
                <ImageWithFallback
                  src={resolveMediaUrl(editorial.coverMedia)}
                  alt={editorial.title}
                  className="max-h-[620px] min-h-[320px] w-full object-cover"
                />
              </div>

              <div className="mx-auto mt-12 max-w-4xl space-y-10">
                {hasText(editorial.body) ? (
                  <div className="whitespace-pre-wrap text-[17px] leading-9 text-foreground/88">
                    {editorial.body}
                  </div>
                ) : null}

                {sortSections(editorial.sections).map((section, index) => {
                  const sectionText = getSectionText(section);
                  const sectionMedia = getSectionMedia(section);

                  return (
                    <section key={`${section.heading ?? 'section'}-${index}`} className="space-y-5">
                      {hasText(section.heading) ? (
                        <h2 className="font-sterling text-[30px] text-primary lg:text-[38px]">{section.heading}</h2>
                      ) : null}

                      <SectionMediaGallery
                        items={sectionMedia}
                        altFallback={section.heading ?? editorial.title}
                      />

                      {hasText(sectionText) ? (
                        <div className="whitespace-pre-wrap text-[16px] leading-8 text-foreground/84">
                          {sectionText}
                        </div>
                      ) : null}
                    </section>
                  );
                })}
              </div>
            </article>
          ) : null}
        </div>
      </div>
    </PageTransition>
  );
}
