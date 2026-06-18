export default function Highlight({ children }: { children: React.ReactNode }) {
  return (
    <mark className="bg-yellow-200/60 dark:bg-yellow-900/40 text-inherit rounded px-1.5 py-0.5 font-medium">
      {children}
    </mark>
  )
}
