import { PageTransition } from '../components/PageTransition';

const craftPillars = [
  {
    title: 'Thiết kế bắt đầu từ cảm nhận',
    body: 'Mỗi phác thảo được dựng lên từ cách món trang sức chạm vào cơ thể, phản chiếu ánh sáng và hòa vào nhịp sống hằng ngày của người đeo.',
  },
  {
    title: 'Hoàn thiện bằng độ chính xác',
    body: 'Độ cong, bề mặt và các chuyển tiếp nhỏ được tinh chỉnh nhiều lần để tổng thể luôn thanh thoát, cân bằng và bền bỉ theo thời gian.',
  },
] as const;

const artisanStories = [
  {
    name: 'Nghệ nhân Lan Anh',
    role: 'Phát triển bề mặt kim loại',
    story:
      'Lan Anh dành nhiều thời gian cho giai đoạn đánh bóng thủ công, nơi từng lớp sáng mờ được cân chỉnh để món trang sức có chiều sâu nhưng vẫn mềm mại khi nhìn gần.',
  },
  {
    name: 'Nghệ nhân Minh Quân',
    role: 'Dựng khối và cân tỷ lệ',
    story:
      'Với Minh Quân, một thiết kế đẹp phải đứng vững ở mọi góc nhìn. Anh tập trung vào các tỷ lệ rất nhỏ để nhẫn, dây chuyền hay khuyên tai luôn có cảm giác nhẹ và thanh khi lên dáng.',
  },
  {
    name: 'Nghệ nhân Thu Vân',
    role: 'Kiểm tra hoàn thiện cuối',
    story:
      'Thu Vân là người xem lại từng chi tiết trước khi một thiết kế rời xưởng. Chị kiểm tra độ đều của bề mặt, cảm giác tiếp xúc và độ mượt ở những điểm chạm trực tiếp lên da.',
  },
] as const;

const processMoments = [
  'Phác thảo được phát triển từ chuyển động và tỷ lệ trên cơ thể.',
  'Bề mặt kim loại được thử nhiều mức sáng để tìm đúng cá tính của thiết kế.',
  'Khâu hoàn thiện cuối cùng tập trung vào cảm giác đeo, không chỉ là hình thức.',
] as const;

export function CraftPage() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-white pb-20 pt-28 lg:pt-32">
        <section className="border-b border-border bg-[linear-gradient(180deg,rgba(18,42,66,0.05),rgba(255,255,255,0.95))]">
          <div className="mx-auto grid max-w-[1800px] gap-10 px-6 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-end lg:py-24">
            <div className="max-w-3xl">
              <p className="mb-4 text-sm uppercase tracking-[0.35em] text-foreground/68">Chế tác</p>
              <h1 className="font-sterling text-[40px] leading-tight text-primary lg:text-[58px]">
                Những thiết kế được hoàn thiện từ sự cân bằng giữa kỹ thuật, cảm xúc và đôi tay của người nghệ nhân.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-foreground/86 lg:text-lg">
                Oriven xem chế tác là hành trình làm rõ cá tính của từng thiết kế, từ lựa chọn tỷ lệ, bề mặt đến trải nghiệm khi đeo. Mỗi
                công đoạn đều được nhìn như một phần của câu chuyện, không chỉ là bước sản xuất.
              </p>
            </div>

            <div className="rounded-sm border border-white/50 bg-white/70 p-6 shadow-[0_24px_60px_rgba(17,33,45,0.08)] backdrop-blur">
              <p className="text-xs uppercase tracking-[0.24em] text-foreground/60">Tinh thần xưởng chế tác</p>
              <div className="mt-6 space-y-4">
                {processMoments.map((moment) => (
                  <div key={moment} className="border-l border-primary/25 pl-4">
                    <p className="text-sm leading-7 text-foreground/80">{moment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1800px] px-6 py-16 lg:py-24">
          <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="mb-3 text-sm uppercase tracking-[0.3em] text-foreground/65">Chuyển động của xưởng</p>
              <h2 className="font-sterling text-[32px] text-primary lg:text-[48px]">Nhịp làm việc phía sau mỗi thiết kế.</h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-foreground/82">
              Video ghi lại cách một thiết kế đi từ bàn phác thảo, qua các bước dựng khối và hoàn thiện bề mặt trước khi trở thành món trang
              sức hoàn chỉnh.
            </p>
          </div>

          <div className="overflow-hidden rounded-sm bg-primary">
            <video
              className="h-full max-h-[720px] w-full object-cover"
              src="/chetac.mp4"
              autoPlay
              muted
              loop
              controls
              playsInline
              preload="metadata"
            />
          </div>
        </section>

        <section className="mx-auto max-w-[1200px] px-6 py-4 lg:py-8">
          <div className="grid gap-6 md:grid-cols-2">
            {craftPillars.map((section) => (
              <article key={section.title} className="border border-border bg-muted/20 p-6 lg:p-8">
                <p className="text-xs uppercase tracking-[0.22em] text-foreground/60">Chế tác</p>
                <h2 className="mt-4 font-sterling text-[28px] text-primary">{section.title}</h2>
                <p className="mt-4 text-sm leading-7 text-foreground/82 lg:text-base">{section.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-t border-border bg-primary/[0.03]">
          <div className="mx-auto max-w-[1800px] px-6 py-16 lg:py-24">
            <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <p className="mb-3 text-sm uppercase tracking-[0.3em] text-foreground/65">Câu chuyện nghệ nhân</p>
                <h2 className="font-sterling text-[32px] text-primary lg:text-[48px]">
                  Mỗi món trang sức mang theo dấu chạm của nhiều đôi tay.
                </h2>
              </div>
              <p className="max-w-xl text-sm leading-7 text-foreground/82">
                Sau mỗi thiết kế là những người dành sự kiên nhẫn cho từng độ cong, độ sáng và cảm giác hoàn thiện. Chính những khác biệt nhỏ
                đó tạo nên cá tính của Oriven.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {artisanStories.map((artisan) => (
                <article key={artisan.name} className="flex h-full flex-col justify-between border border-border bg-white p-7">
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-foreground/58">{artisan.role}</p>
                    <h3 className="mt-4 font-sterling text-[28px] text-primary">{artisan.name}</h3>
                    <p className="mt-5 text-sm leading-7 text-foreground/80">{artisan.story}</p>
                  </div>
                  <div className="mt-8 border-t border-border pt-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-foreground/55">Xưởng chế tác Oriven</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
}
