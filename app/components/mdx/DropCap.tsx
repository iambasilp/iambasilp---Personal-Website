export default function DropCap({ children }: { children: React.ReactNode }) {
  return (
    <div className="first-letter:text-6xl first-letter:font-serif first-letter:text-[#2C2C2A] dark:first-letter:text-[#E4E3DF] first-letter:mr-3 first-letter:float-left first-letter:mt-1">
      {children}
    </div>
  )
}
