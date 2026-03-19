import { DM_Sans, Playfair_Display } from 'next/font/google'
import './globals.css'

const dm = DM_Sans({ subsets: ['latin'], variable: '--font-dm', display: 'swap' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair', display: 'swap' })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${dm.variable} ${playfair.variable} font-[var(--font-dm)]`}>
        {children}
      </body>
    </html>
  )
}
