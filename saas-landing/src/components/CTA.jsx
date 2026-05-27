import { ArrowRight } from 'lucide-react'

export default function CTA() {
  return (
    <section id="pricing" className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="relative rounded-3xl bg-gradient-to-br from-brand-600 via-brand-700 to-brand-800 overflow-hidden">
          {/* Decorative elements */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/3" />
            <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-white/20 rounded-full" />
            <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-white/15 rounded-full" />
          </div>

          <div className="relative px-8 py-16 md:px-16 md:py-20 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              准备好提升团队效率了吗？
            </h2>
            <p className="mt-4 text-lg text-brand-100 max-w-lg mx-auto">
              立即开始 14 天免费试用，无需信用卡，零风险体验完整功能。
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <a
                href="#signup"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-semibold text-brand-700 bg-white hover:bg-brand-50 shadow-lg transition-all duration-200 hover:shadow-xl active:scale-[0.98] cursor-pointer"
              >
                免费注册试用
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-semibold text-white border border-white/30 hover:bg-white/10 transition-all duration-200 cursor-pointer"
              >
                联系销售团队
              </a>
            </div>

            <p className="mt-6 text-sm text-brand-200">
              无需信用卡 · 14 天免费试用 · 数据随时导出
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
