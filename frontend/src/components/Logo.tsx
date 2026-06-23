export default function Logo({ className = 'w-8 h-8' }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="logo-grad" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#06b6d4" />
          <stop offset="1" stopColor="#14b8a6" />
        </linearGradient>
      </defs>
      {/* left stem */}
      <path d="M8 6V34" stroke="url(#logo-grad)" strokeWidth="5" strokeLinecap="round" />
      {/* bowl */}
      <path d="M8 6C24 6 28 14 20 22" stroke="url(#logo-grad)" strokeWidth="5" strokeLinecap="round" />
      {/* checkmark leg */}
      <path d="M20 22L27 31L36 12" stroke="url(#logo-grad)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
