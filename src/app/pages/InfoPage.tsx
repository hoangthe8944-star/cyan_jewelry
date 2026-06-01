import { PageTransition } from '../components/PageTransition';

interface InfoPageProps {
  eyebrow: string;
  title: string;
  lead: string;
  sections: Array<{
    title: string;
    body: string;
  }>;
}

export function InfoPage({ eyebrow, title, lead, sections }: InfoPageProps) {
  return (
    <PageTransition>
      <div className="min-h-screen bg-white pb-20 pt-28 lg:pt-32">
        <section className="border-b border-border bg-[linear-gradient(180deg,rgba(18,42,66,0.05),rgba(255,255,255,0.95))]">
          <div className="mx-auto max-w-[1200px] px-6 py-16 lg:py-24">
            <p className="mb-4 text-sm uppercase tracking-[0.35em] text-foreground/68">{eyebrow}</p>
            <h1 className="max-w-4xl font-sterling text-[38px] leading-tight text-primary lg:text-[54px]">
              {title}
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-foreground/86 lg:text-lg">{lead}</p>
          </div>
        </section>

        <section className="mx-auto max-w-[1200px] px-6 py-16 lg:py-24">
          <div className="grid gap-6 md:grid-cols-2">
            {sections.map((section) => (
              <article key={section.title} className="border border-border bg-muted/20 p-6 lg:p-8">
                <p className="text-xs uppercase tracking-[0.22em] text-foreground/60">{eyebrow}</p>
                <h2 className="mt-4 font-sterling text-[28px] text-primary">{section.title}</h2>
                <p className="mt-4 text-sm leading-7 text-foreground/82 lg:text-base">{section.body}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </PageTransition>
  );
}
