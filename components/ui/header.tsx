import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-white shadow-sm px-6 py-3 w-full">
      <nav className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Left: Brand + Nav */}
        <div className="flex items-center gap-10">
          <Link href="/" className="text-xl font-bold text-blue-600">
            MedTrack
          </Link>

          <ul className="flex gap-6 text-sm font-medium text-gray-700">
            <li>
              <Link href="/" className="hover:text-blue-500 transition">Home</Link>
            </li>
            <li>
              <Link href="/my-records" className="hover:text-blue-500 transition">My Medical Records</Link>
            </li>
            <li>
              <Link href="/doctors" className="hover:text-blue-500 transition">Doctors</Link>
            </li>
          </ul>
        </div>

        {/* Right: Login */}
        <div>
          <Link href="/login" className="text-sm text-blue-600 font-medium hover:underline">
            Login
          </Link>
        </div>
      </nav>
    </header>
  )
}
