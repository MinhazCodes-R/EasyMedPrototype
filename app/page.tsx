'use client'

import Link from 'next/link'
import Header from '@/components/ui/header'

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 px-8 py-20 flex flex-col items-center justify-center text-center">
        <div className="max-w-4xl">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-6">
            🏥 Welcome to MedTrack
          </h1>
          <p className="text-lg text-gray-700 mb-8">
            MedTrack is your hospital’s secure and intelligent medical record management system. Designed for doctors, healthcare providers, and patients, our platform ensures that all patient records are tracked, updated, and protected — with strict confidentiality.
          </p>
          <p className="text-md text-gray-600 mb-12">
            🔒 All records are encrypted and only accessible by authorized hospital staff and patients. We value privacy and ensure compliance with all medical data security standards.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
            <Link href="/doctors">
              <button className="bg-blue-600 text-white text-lg px-6 py-3 rounded shadow hover:bg-blue-700 transition">
                Access Patient Records
              </button>
            </Link>
            <Link href="/about">
              <button className="bg-white text-blue-600 border border-blue-600 text-lg px-6 py-3 rounded shadow hover:bg-blue-50 transition">
                Learn More
              </button>
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
