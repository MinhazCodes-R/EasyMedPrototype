// app/api/records/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function GET(req: NextRequest, context: { params: { id: string } }) {
  const { id } = context.params

  try {
    const res = await pool.query('SELECT * FROM medical_records WHERE id = $1', [id])
    const record = res.rows[0]

    if (!record) {
      return NextResponse.json({ error: 'Record not found' }, { status: 404 })
    }

    return NextResponse.json(record)
  } catch (err) {
    console.error('DB error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, context: { params: { id: string } }) {
  const { id } = context.params
  const body = await req.json()

  const {
    name, dob, gender, height, weight, bloodType,
    allergies, medicalHistory, medications,
    diagnosis, prescribedMeds,
  } = body

  try {
    await pool.query(
      `UPDATE medical_records SET
        name=$1, dob=$2, gender=$3, height=$4, weight=$5,
        blood_type=$6, allergies=$7, medical_history=$8,
        medications=$9, diagnosis=$10, prescribed_meds=$11
      WHERE id=$12`,
      [
        name, dob, gender, height, weight, bloodType,
        allergies, medicalHistory, medications,
        diagnosis, prescribedMeds, id,
      ]
    )

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('DB update error:', err)
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }
}
