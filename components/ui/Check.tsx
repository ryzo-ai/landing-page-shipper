export default function Check({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      width={20}
      height={20}
      aria-hidden="true"
      className={`flex-shrink-0 ${className}`}
    >
      <circle cx="10" cy="10" r="10" fill="currentColor" opacity="0.14" />
      <path d="M6 10.3l2.6 2.6L14.2 7.4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
