import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { diagnosis, history, allergies, medications } = await req.json()

  const prompt = `
You are a helpful medical assistant. Based on the following patient details, suggest appropriate prescriptions. 
Only include common prescription drugs — no diagnosis, no disclaimers.

Diagnosis/Symptoms: ${diagnosis}
Medical History: ${history}
Allergies: ${allergies}
Current Medications: ${medications}

Respond with a list of medications and dosage recommendations.
`

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.5,
        max_tokens: 300,
      }),
    })

    const data = await response.json()
    const reply = data.choices?.[0]?.message?.content || 'No recommendation available.'

    return NextResponse.json({ prescription: reply })
  } catch (err) {
    console.error('GPT error:', err)
    return NextResponse.json({ error: 'Failed to generate prescription' }, { status: 500 })
  }
}
