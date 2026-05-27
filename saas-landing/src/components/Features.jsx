import { Layers, BarChart3, Shield, Zap, Users2, Globe } from 'lucide-react'

const features = [
  {
    icon: Layers,
    title: '项目管理',
    desc: '看板、列表、甘特图多种视图，适应任何工作流程，让项目进度一目了然。',
  },
  {
    icon: Users2,
    title: '团队协作',
    desc: '实时多人协作编辑、评论与通知，团队沟通无缝衔接，减少信息孤岛。',
  },
  {
    icon: BarChart3,
    title: '数据分析',
    desc: '内置智能报表引擎，自动生成可视化洞察，驱动数据化决策。',
  },
  {
    icon: Shield,
    title: '安全可靠',
    desc: 'SOC 2 认证，端到端加密，SSO 单点登录，保障企业数据安全合规。',
  },
  {
    icon: Zap,
    title: '自动化流程',
    desc: '拖拽式自动化规则，将重复性工作交给系统，释放团队创造力。',
  },
  {
    icon: Globe,
    title: '全球化支持',
    desc: '支持 12 种语言，多时区协作，全球 CDN 加速，随时随地访问。',
  },
]

export default function Features() {
  return (
    <section id="features" className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-sm font-semibold text-brand-600 tracking-wider uppercase">核心功能</span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            一个平台，满足所有
            <span className="text-gradient">工作需求</span>
          </h2>
          <p className="mt-4 text-lg text-slate-500">
            无需在多个工具之间切换，FlowSaaS 将项目管理、协作和分析整合在一起。
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="group relative bg-white rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-lg hover:border-slate-200 transition-all duration-300 cursor-pointer"
              style={{ transitionDelay: `${i * 50}ms` }}
            >
              <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center mb-5 group-hover:bg-brand-100 transition-colors duration-300">
                <f.icon className="w-6 h-6 text-brand-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">{f.title}</h3>
              <p className="text-slate-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
