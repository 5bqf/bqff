import { ArrowRight, Play, CheckCircle2 } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-20 overflow-hidden">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-brand-100/60 to-brand-50/20 blur-3xl" />
        <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-brand-100/40 to-accent-100/30 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Text content */}
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-200/60 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
              全新 2.0 版本已发布
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight leading-[1.1]">
              让你的团队
              <br />
              <span className="text-gradient">高效协作</span>
              ，轻松管理
            </h1>

            <p className="mt-6 text-lg text-slate-600 leading-relaxed max-w-lg">
              FlowSaaS 提供一站式项目管理、团队协作和数据分析工具，帮助你的团队减少 40% 的重复工作，专注于真正重要的事情。
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#signup"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-base font-semibold text-white bg-brand-600 hover:bg-brand-700 shadow-lg shadow-brand-200 transition-all duration-200 hover:shadow-xl hover:shadow-brand-200 active:scale-[0.98] cursor-pointer"
              >
                开始免费试用
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#demo"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-base font-semibold text-slate-700 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all duration-200 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-slate-700" />
                观看演示
              </a>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-5 text-sm text-slate-500">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                无需信用卡
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                14 天免费试用
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                随时取消
              </span>
            </div>
          </div>

          {/* Dashboard mockup */}
          <div className="relative lg:ml-4">
            <div className="glass-card rounded-2xl p-2 shadow-xl">
              <div className="bg-white rounded-xl overflow-hidden border border-slate-100">
                {/* Mock header */}
                <div className="flex items-center gap-2 px-4 py-2.5 border-b border-slate-100 bg-slate-50/50">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  </div>
                  <span className="text-[10px] text-slate-400 ml-2">FlowSaaS Dashboard</span>
                </div>

                <div className="p-4 space-y-3.5">
                  {/* Stats row */}
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: '活跃项目', val: '28', sub: '+12%' },
                      { label: '团队成员', val: '156', sub: '+8%' },
                      { label: '完成任务', val: '2.4k', sub: '+24%' },
                    ].map(s => (
                      <div key={s.label} className="bg-slate-50 rounded-lg p-2.5">
                        <div className="text-[10px] text-slate-500">{s.label}</div>
                        <div className="text-lg font-bold text-slate-900">{s.val}</div>
                        <div className="text-[10px] text-emerald-600 font-medium">{s.sub}</div>
                      </div>
                    ))}
                  </div>

                  {/* Chart bars */}
                  <div className="flex items-end gap-2 h-24">
                    {[35, 55, 40, 70, 60, 85, 50, 65, 75, 55, 90, 80].map((h, i) => (
                      <div key={i} className="flex-1 flex flex-col justify-end">
                        <div
                          className="rounded-sm bg-gradient-to-t from-brand-500 to-brand-400 transition-all duration-500"
                          style={{ height: `${h}%` }}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Task list */}
                  <div className="space-y-2">
                    {[
                      { title: '新功能开发', status: '进行中', color: 'bg-brand-100 text-brand-700' },
                      { title: '用户界面设计', status: '审核中', color: 'bg-amber-100 text-amber-700' },
                      { title: '性能优化', status: '已完成', color: 'bg-emerald-100 text-emerald-700' },
                    ].map((t, i) => (
                      <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors duration-150">
                        <span className={`w-1.5 h-1.5 rounded-full ${i === 0 ? 'bg-brand-500' : i === 1 ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                        <span className="text-sm text-slate-700 flex-1">{t.title}</span>
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${t.color}`}>{t.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Floating card */}
            <div className="absolute -bottom-6 -left-6 glass-card rounded-xl px-4 py-3 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                    <path d="M9 12l2 2 4-4" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-900">团队效率</div>
                  <div className="text-xs text-emerald-600 font-medium">提升 40%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
