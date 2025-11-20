import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function generateFollowUpEmail(contactData, conversationHistory) {
  const prompt = `Generate a professional follow-up email for a cost segregation lead.
  
Contact: ${contactData.name}
Company: ${contactData.company || 'Not provided'}
Last interaction: ${contactData.lastCommunication || 'Initial contact'}
Property details: ${contactData.propertyType || 'Not specified'} - $${contactData.propertyCost || 'Not specified'}

Conversation history:
${conversationHistory}

Write a friendly, professional email that:
1. References their property and situation
2. Offers value and next steps
3. Is concise (under 150 words)
4. Includes a clear call to action`

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
    max_tokens: 300,
  })

  return response.choices[0].message.content
}

export async function generateSMSFollowUp(contactData) {
  const prompt = `Generate a brief, friendly follow-up text message for a cost segregation lead.
  
Contact: ${contactData.name}
Status: ${contactData.status}
Last contact: ${contactData.lastCommunication}

Keep it under 160 characters, professional but warm, with a clear next step.`

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
    max_tokens: 50,
  })

  return response.choices[0].message.content
}

export async function generateConversationSummary(conversationLog) {
  const prompt = `Summarize this conversation with a cost segregation lead in 2-3 sentences:

${conversationLog}

Focus on: key pain points, property details discussed, and next actions.`

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.5,
    max_tokens: 150,
  })

  return response.choices[0].message.content
}

export async function recommendRnDEligibility(companyData) {
  const prompt = `Based on this company data, assess R&D tax credit eligibility:

Company: ${companyData.company}
Industry: ${companyData.industry || 'Not specified'}
Payroll: $${companyData.payroll || 'Not specified'}
Activities: ${companyData.activities || 'Not specified'}

Provide: 
1. Eligibility score (0-100)
2. Key qualifying factors
3. Estimated credit range
4. Recommended next steps

Format as JSON.`

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.3,
    max_tokens: 300,
  })

  return JSON.parse(response.choices[0].message.content)
}

export async function generateSocialCaption(platform, topic, contentType = 'educational') {
  const prompt = `Create a ${platform} post about ${topic} for a cost segregation specialist.

Content type: ${contentType}
Tone: Professional, approachable, value-driven
Include: Relevant hashtags for ${platform}

${platform === 'LinkedIn' ? 'Length: 100-150 words' : ''}
${platform === 'Instagram' ? 'Include 15-20 relevant hashtags' : ''}
${platform === 'TikTok' ? 'Hook-first, under 100 words' : ''}
${platform === 'Twitter/X' ? 'Under 280 characters' : ''}`

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.8,
    max_tokens: 250,
  })

  return response.choices[0].message.content
}

export default openai
