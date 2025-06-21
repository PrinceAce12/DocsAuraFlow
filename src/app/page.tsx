"use client";

import Link from 'next/link';
import { HeaderAd, InContentAd, FooterAd } from '../components/AdSense';

export default function Home() {
  const features = [
    {
      title: "Document Converters",
      description: "Convert between different document formats",
      icon: "📄",
      tools: [
        { name: "PDF to Word", href: "/pdf-to-word", desc: "Convert PDF files to editable Word documents" },
        { name: "Word to PDF", href: "/word-to-pdf", desc: "Convert Word documents to PDF format" },
        { name: "Text to Word", href: "/text-to-word", desc: "Create Word documents from plain text" },
        { name: "PDF Form Filler", href: "/pdf-form-filler", desc: "Fill and edit PDF forms online" }
      ]
    },
    {
      title: "Image Tools",
      description: "Professional image processing and enhancement",
      icon: "🖼️",
      tools: [
        { name: "Image Converter", href: "/image-converter", desc: "Convert between all image formats" },
        { name: "AI Upscaler", href: "/ai-upscaler", desc: "Enhance image quality with AI" },
        { name: "Background Remover", href: "/remove-background", desc: "Remove backgrounds with precision" },
        { name: "Image Editor", href: "/image-editor", desc: "Edit and customize your images" }
      ]
    },
    {
      title: "Resume Builder",
      description: "Create professional resumes with sleek designs",
      icon: "📋",
      tools: [
        { name: "Resume Templates", href: "/resume-builder", desc: "Choose from modern templates" },
        { name: "Custom Builder", href: "/resume-builder?mode=custom", desc: "Build from scratch" }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
      {/* Header */}
      <header className="border-b border-white/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">DS</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                DocsAuraFlow
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        {/* Header Ad */}
        <div className="border-t border-white/10">
          <HeaderAd />
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            DocsAuraFlow
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> - Free Online Tools</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-12">
            Convert PDF to Word, enhance images with AI upscaler, remove backgrounds, create professional resumes, and more - all free online tools in one place.
          </p>
          
          {/* Hero Ad */}
          <div className="mb-12">
            <InContentAd />
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">15+</div>
              <div className="text-gray-600 dark:text-gray-300">Tools Available</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">100%</div>
              <div className="text-gray-600 dark:text-gray-300">Free to Use</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">AI</div>
              <div className="text-gray-600 dark:text-gray-300">Powered</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">No</div>
              <div className="text-gray-600 dark:text-gray-300">Registration</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="space-y-16">
            {features.map((category, categoryIndex) => (
              <div key={categoryIndex} className="">
                <div className="text-center mb-12">
                  <div className="text-6xl mb-4">{category.icon}</div>
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    {category.title}
                  </h3>
                  <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                    {category.description}
                  </p>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {category.tools.map((tool, toolIndex) => (
                    <Link key={toolIndex} href={tool.href}>
                      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-white/20">
                        <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                          {tool.name}
                        </h4>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                          {tool.desc}
                        </p>
                        <div className="flex items-center text-blue-600 dark:text-blue-400 font-medium">
                          Try it now
                          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                
                {/* Inter-section Ad */}
                {categoryIndex === 1 && (
                  <div className="mt-16">
                    <InContentAd />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Highlight */}
      <section className="py-20 bg-white/50 dark:bg-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose Our Suite?
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Professional-grade tools that deliver exceptional results
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Lightning Fast</h4>
              <p className="text-gray-600 dark:text-gray-300">Process your files in seconds with our optimized algorithms and modern infrastructure.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">High Quality</h4>
              <p className="text-gray-600 dark:text-gray-300">Professional results that maintain original quality and formatting integrity.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 002 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Privacy First</h4>
              <p className="text-gray-600 dark:text-gray-300">Your files are processed securely and deleted immediately after conversion.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/20">
        <div className="container mx-auto px-4 text-center">
          {/* Footer Ad */}
          <div className="mb-8">
            <FooterAd />
          </div>
          
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">DS</span>
            </div>
            <span className="text-lg font-semibold text-gray-900 dark:text-white">
              Document & Image Suite
            </span>
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            Professional document and image processing tools, completely free.
          </p>
        </div>
      </footer>
    </div>
  );
}
