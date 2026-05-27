import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { name: '功能', href: '#features' },
  { name: '评价', href: '#testimonials' },
  { name: '定价', href: '#pricing' },
  { name: '文档', href: '#docs' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className={`fixed top-4 left-4 right-4 z-50 transition-all duration-300 ${
        scrolled
          ? 'glass-card rounded-2xl shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2.5 font-bold text-xl text-slate-900 tracking-tight">
          <span className="w-9 h-9 rounded-lg bg-brand-600 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </span>
          FlowSaaS
        </a>

        <ul className="hidden md:flex items-center gap-1">
          {navLinks.map(link => (
            <li key={link.name}>
              <a
                href={link.href}
                className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors duration-200"
              >
                {link.name}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center gap-3">
          <a href="#login" className="text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors duration-200">
            登录
          </a>
          <a
            href="#signup"
            className="inline-flex items-center px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 shadow-lg shadow-brand-200 transition-all duration-200 hover:shadow-xl hover:shadow-brand-200 active:scale-[0.98]"
          >
            免费试用
          </a>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors duration-200"
          aria-label={open ? '关闭菜单' : '打开菜单'}
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-slate-200/60 px-4 py-3 space-y-1">
          {navLinks.map(link => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors duration-200"
            >
              {link.name}
            </a>
          ))}
          <div className="flex gap-2 pt-2 border-t border-slate-200/60 mt-2">
            <a
              href="#login"
              className="flex-1 text-center px-4 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors duration-200"
            >
              登录
            </a>
            <a
              href="#signup"
              className="flex-1 text-center px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 transition-colors duration-200"
            >
              免费试用
            </a>
          </div>
        </div>
      )}
    </nav>
  )
}
