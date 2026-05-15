"use client"

import { type ReactNode } from 'react'
import { Navbar } from './navbar'
import { Footer } from './footer'

interface MainLayoutProps {
  children: ReactNode
  showFooter?: boolean
}

export function MainLayout({ children, showFooter = true }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      {showFooter && <Footer />}
    </div>
  )
}
