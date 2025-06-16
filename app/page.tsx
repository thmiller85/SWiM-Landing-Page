import React from 'react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-8">
          SWiM | AI-Powered Marketing & Business Solutions
        </h1>
        <p className="text-xl text-center max-w-3xl mx-auto">
          Transform your business with AI-powered marketing, workflow automation, and custom SaaS solutions. 
          Founder-led team of AI specialists delivering transparent, results-driven implementations for B2B companies.
        </p>
        <div className="text-center mt-8">
          <a href="/admin/login" className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors">
            Admin Dashboard
          </a>
        </div>
      </div>
    </div>
  )
}