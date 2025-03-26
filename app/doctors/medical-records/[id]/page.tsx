'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Header from '@/components/ui/header'
import debounce from 'lodash/debounce'

export default function MedicalRecordsPage() {
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    gender: '',
    height: '',
    weight: '',
    bloodType: '',
    allergies: '',
    medicalHistory: '',
    medications: '',
    diagnosis: '',
    prescribedMeds: '',
  })
  const [aiDiagnosis, setAiDiagnosis] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<string[]>([])

  const autoSave = useCallback(
    debounce(async (updatedData) => {
      await fetch(`/api/records/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      })
    }, 600),
    [id]
  )

  const handleChange = (e) => {
    const { name, value } = e.target
    const updated = { ...formData, [name]: value }
    setFormData(updated)
    autoSave(updated)
  }

  const fetchDiagnosis = async () => {
    setAiLoading(true)
    const res = await fetch('/api/ai/recommend', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        diagnosis: formData.diagnosis,
        history: formData.medicalHistory,
        allergies: formData.allergies,
        medications: formData.medications,
      }),
    })
    const data = await res.json()
    setAiDiagnosis(data.prescription)
    setAiLoading(false)
  }

  const fetchMedicationSuggestions = useCallback(
    debounce(async (term: string) => {
      if (!term) return setSearchResults([])
      try {
        const res = await fetch(`https://rxnav.nlm.nih.gov/REST/drugs.json?name=${term}`)
        const data = await res.json()
        const suggestions = data?.drugGroup?.conceptGroup?.flatMap((group: any) =>
          group.conceptProperties?.map((c: any) => c.name)
        ) || []
        setSearchResults(Array.from(new Set(suggestions)))
      } catch (err) {
        console.error('Error fetching medications:', err)
      }
    }, 500),
    []
  )

  useEffect(() => {
    fetchMedicationSuggestions(searchTerm)
  }, [searchTerm])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/records/${id}`)
        const data = await res.json()
        setFormData({
          name: data.name || '',
          dob: data.dob?.split('T')[0] || '',
          gender: data.gender || '',
          height: data.height || '',
          weight: data.weight || '',
          bloodType: data.blood_type || '',
          allergies: data.allergies || '',
          medicalHistory: data.medical_history || '',
          medications: data.medications || '',
          diagnosis: data.diagnosis || '',
          prescribedMeds: data.prescribed_meds || '',
        })
        setLoading(false)
      } catch (err) {
        console.error('Error fetching medical record:', err)
      }
    }

    fetchData()
  }, [id])

  if (loading) return <div className="p-10">Loading patient record...</div>

  const inputFields = [
    { label: 'Patient Name', name: 'name', type: 'text' },
    { label: 'Date of Birth', name: 'dob', type: 'date' },
    { label: 'Gender', name: 'gender', type: 'text' },
    { label: 'Height (cm)', name: 'height', type: 'number' },
    { label: 'Weight (kg)', name: 'weight', type: 'number' },
    { label: 'Blood Type', name: 'bloodType', type: 'text' },
    { label: 'Allergies', name: 'allergies', type: 'text' },
  ]

  return (
    <>
      <Header />
      <div className="min-h-screen p-16 bg-gray-50">
        <h1 className="text-3xl font-semibold mb-8">Medical Record: {formData.name}</h1>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-4">
            {inputFields.map(({ label, name, type }) => (
              <div key={name} className="flex flex-col">
                <label htmlFor={name} className="text-sm font-medium text-gray-700 mb-1">
                  {label}
                </label>
                <input
                  type={type}
                  name={name}
                  id={name}
                  value={(formData as any)[name]}
                  onChange={handleChange}
                  className="border rounded-md p-2 focus:outline-none focus:ring focus:border-blue-300"
                />
              </div>
            ))}

            <div className="flex flex-col">
              <label htmlFor="medicalHistory" className="text-sm font-medium text-gray-700 mb-1">
                Medical History
              </label>
              <textarea
                name="medicalHistory"
                id="medicalHistory"
                value={formData.medicalHistory}
                onChange={handleChange}
                className="border rounded-md p-2 h-24 focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="medications" className="text-sm font-medium text-gray-700 mb-1">
                Current Medications
              </label>
              <textarea
                name="medications"
                id="medications"
                value={formData.medications}
                onChange={handleChange}
                className="border rounded-md p-2 h-24 focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div className="bg-white shadow rounded-md p-4">
              <h2 className="text-lg font-semibold mb-2">Current Diagnosis / Symptoms</h2>
              <textarea
                name="diagnosis"
                value={formData.diagnosis}
                onChange={handleChange}
                placeholder="Enter symptoms or diagnosis..."
                className="w-full border rounded-md p-2 h-40 focus:outline-none focus:ring focus:border-blue-300"
              />

              <button
                type="button"
                onClick={fetchDiagnosis}
                className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
              >
                {aiLoading ? 'Analyzing...' : 'Run Diagnosis'}
              </button>

              {aiDiagnosis && (
                <div className="mt-4 p-4 bg-gray-100 border rounded text-sm whitespace-pre-wrap">
                  <strong>AI Recommendation:</strong><br />
                  {aiDiagnosis}
                </div>
              )}
            </div>

            <div className="bg-white shadow rounded-md p-4">
              <h2 className="text-lg font-semibold mb-2">Prescribed Medication</h2>

              <input
                type="text"
                placeholder="Search medications..."
                className="w-full border p-2 rounded-md focus:outline-none focus:ring"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchResults.length > 0 && (
                <ul className="mt-1 border bg-white rounded max-h-32 overflow-y-auto shadow text-sm">
                  {searchResults.map((med, idx) => (
                    <li
                      key={idx}
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          prescribedMeds: prev.prescribedMeds
                            ? `${prev.prescribedMeds}, ${med}`
                            : med,
                        }))
                        setSearchTerm('')
                        setSearchResults([])
                      }}
                      className="p-2 hover:bg-blue-100 cursor-pointer"
                    >
                      {med}
                    </li>
                  ))}
                </ul>
              )}

              <textarea
                name="prescribedMeds"
                value={formData.prescribedMeds}
                onChange={handleChange}
                placeholder="Enter prescribed drugs, dosage, etc."
                className="w-full border rounded-md p-2 h-40 focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>
          </div>
        </form>
      </div>
    </>
  )
}