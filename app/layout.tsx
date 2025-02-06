import { Toaster } from "@/components/ui/toaster"
import { Vollkorn, Open_Sans } from "next/font/google"
import "./globals.css"
import type React from "react" // Import React

const vollkorn = Vollkorn({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-vollkorn",
})

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${vollkorn.variable} ${openSans.variable} font-open-sans bg-background`}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}

