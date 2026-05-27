const footerLinks = {
  产品: ['功能介绍', '定价方案', '更新日志', 'API 文档'],
  解决方案: ['项目管理', '团队协作', '数据分析', '自动化'],
  资源: ['帮助中心', '开发者文档', '社区论坛', '视频教程'],
  公司: ['关于我们', '人才招聘', '联系销售', '合作伙伴'],
}

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <a href="#" className="flex items-center gap-2.5 font-bold text-xl text-slate-900 tracking-tight mb-4">
              <span className="w-9 h-9 rounded-lg bg-brand-600 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
              </span>
              FlowSaaS
            </a>
            <p className="text-sm text-slate-500 leading-relaxed">
              高效的 SaaS 管理平台，帮助团队更智能地工作。
            </p>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">{title}</h4>
              <ul className="space-y-3">
                {links.map(link => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-slate-500 hover:text-slate-900 transition-colors duration-200"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between pt-8 border-t border-slate-100">
          <p className="text-sm text-slate-400">
            &copy; {new Date().getFullYear()} FlowSaaS. All rights reserved.
          </p>
          <div className="flex items-center gap-6 mt-4 sm:mt-0">
            <a href="#" className="text-sm text-slate-400 hover:text-slate-600 transition-colors duration-200">隐私政策</a>
            <a href="#" className="text-sm text-slate-400 hover:text-slate-600 transition-colors duration-200">服务条款</a>
            <a href="#" className="text-sm text-slate-400 hover:text-slate-600 transition-colors duration-200">Cookie 设置</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
