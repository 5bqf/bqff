import { Star } from 'lucide-react'

const testimonials = [
  {
    quote: 'FlowSaaS 彻底改变了我们团队的协作方式。项目管理变得前所未有的简单，数据看板让我们能够实时掌握业务脉搏。',
    author: '陈明远',
    role: 'CTO · 云帆科技',
    avatar: 'CM',
    rating: 5,
  },
  {
    quote: '界面简洁直观，功能强大。我们从几个分散的工具迁移到 FlowSaaS，团队效率提升了近 40%，这是实实在在的提升。',
    author: '李心怡',
    role: '产品总监 · 星辰网络',
    avatar: 'LX',
    rating: 5,
  },
  {
    quote: '作为一家快速成长的初创公司，我们需要一个灵活且功能齐全的管理工具。FlowSaaS 完美地满足了我们的需求。',
    author: '张伟',
    role: 'CEO · 极光数据',
    avatar: 'ZW',
    rating: 5,
  },
]

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-24 bg-slate-100/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-sm font-semibold text-brand-600 tracking-wider uppercase">客户评价</span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            来自<span className="text-gradient">优秀团队</span>的信任
          </h2>
          <p className="mt-4 text-lg text-slate-500">
            超过 2000 个团队已经在使用 FlowSaaS 提升工作效率。
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map(t => (
            <div key={t.author} className="glass-card rounded-2xl p-8 cursor-pointer">
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <blockquote className="text-slate-600 leading-relaxed mb-6">
                "{t.quote}"
              </blockquote>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-sm font-semibold text-brand-700">
                  {t.avatar}
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-900">{t.author}</div>
                  <div className="text-xs text-slate-500">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trusted companies */}
        <div className="mt-16 pt-16 border-t border-slate-200/60">
          <p className="text-center text-xs font-medium text-slate-400 uppercase tracking-wider mb-8">
            受到全球 2000+ 团队的信任
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6 opacity-40">
            {['Acme Corp', 'TechFlow', 'NovaTech', 'ScaleUp', 'DataBridge', 'CloudNine'].map(name => (
              <span key={name} className="text-lg font-bold text-slate-600 tracking-tight">
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
