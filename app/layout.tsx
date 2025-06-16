import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from './providers'
import React from 'react'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SWiM | AI-Powered Marketing & Business Solutions',
  description: 'Transform your business with AI-powered marketing, workflow automation, and custom SaaS solutions. Founder-led team of AI specialists delivering transparent, results-driven implementations for B2B companies.',
  keywords: 'AI marketing, workflow automation, B2B SaaS development, data intelligence, AI strategy consulting',
  authors: [{ name: 'SWiM Agency' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  openGraph: {
    title: 'SWiM | AI-Powered Marketing & Business Solutions',
    description: 'Transform your business with AI-powered marketing, workflow automation, and custom SaaS solutions.',
    url: 'https://swimsolutions.ai',
    siteName: 'SWiM Agency',
    type: 'website',
    images: [{
      url: '/og-image.png',
      width: 1200,
      height: 630,
      alt: 'SWiM Agency - AI-Powered Marketing Solutions'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SWiM | AI-Powered Marketing & Business Solutions',
    description: 'Transform your business with AI-powered marketing, workflow automation, and custom SaaS solutions.',
    images: ['/og-image.png']
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}