import Link from 'next/link'
import pool from '@/lib/db'
import Header from '@/components/ui/header'

type Patient = {
  id: number
  name: string
  dob: string | Date
  gender: string
}

export default async function DoctorsPage() {
  const res = await pool.query(
    'SELECT id, name, dob, gender FROM medical_records ORDER BY id ASC'
  )
  const patients: Patient[] = res.rows

  return (
    <>
    <Header></Header>
    <div className="min-h-screen bg-gray-50 p-10">
      <h1 className="text-3xl font-bold mb-8">Patient Records</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {patients.map((patient) => {
          // Format DOB to YYYY-MM-DD
          const formattedDob =
            typeof patient.dob === 'string'
              ? patient.dob
              : new Date(patient.dob).toISOString().split('T')[0]

          return (
            <Link
              key={patient.id}
              href={`/doctors/medical-records/${patient.id}`}
            >
              <div className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition cursor-pointer">
                <h2 className="text-xl font-semibold mb-2">{patient.name}</h2>
                <p className="text-gray-600 text-sm">DOB: {formattedDob}</p>
                <p className="text-gray-600 text-sm">Gender: {patient.gender}</p>
              </div>
            </Link>
          )
        })}
      </div>
    </div>

    </>
  )
}
