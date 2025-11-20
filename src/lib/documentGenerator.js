import { jsPDF } from 'jspdf'

export const generateSamplePDF = (title, content = '') => {
  const doc = new jsPDF()
  const date = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  // Header
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.text('Kashflow Kathy Tax Services', 105, 20, { align: 'center' })
  
  // Subtitle
  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  doc.text('Cost Segregation & Tax Strategy Specialists', 105, 28, { align: 'center' })
  doc.text('kathy@costseg.tax | (555) 123-4567', 105, 35, { align: 'center' })
  
  // Line
  doc.setLineWidth(0.5)
  doc.line(20, 40, 190, 40)
  
  // Date
  doc.setFontSize(10)
  doc.text(`Date: ${date}`, 20, 48)
  
  // Title
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text(title, 20, 60)
  
  // Content
  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  const contentText = content || `
This is a sample document generated for demonstration purposes.

This document demonstrates the capabilities of the Kashflow Kathy CRM system
to generate and manage professional documents for tax services, cost segregation
studies, and R&D tax credit analyses.

Key Features:
• Professional document generation
• Automated formatting
• Client information integration
• Real-time PDF creation

For actual client documents, this content would be replaced with specific
client information, analysis results, and personalized recommendations.

Thank you for using Kashflow Kathy Tax Services!
  `.trim()
  
  const lines = doc.splitTextToSize(contentText, 170)
  doc.text(lines, 20, 75)
  
  // Footer
  const pageCount = doc.internal.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(9)
    doc.setTextColor(128, 128, 128)
    doc.text(
      `© ${new Date().getFullYear()} Kashflow Kathy Tax Services - Page ${i} of ${pageCount}`,
      105,
      285,
      { align: 'center' }
    )
  }
  
  return doc
}

export const generateCostSegReport = (propertyData = {}) => {
  const doc = generateSamplePDF('Cost Segregation Study Report')
  
  doc.addPage()
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('Executive Summary', 20, 20)
  
  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  doc.text([
    'Property Information:',
    `Property Type: ${propertyData.propertyType || 'Commercial Building'}`,
    `Purchase Price: $${(propertyData.propertyCost || 1250000).toLocaleString()}`,
    `Study Date: ${new Date().toLocaleDateString()}`,
    '',
    'Estimated Tax Benefits:',
    `5-Year Accelerated Depreciation: $${(propertyData.acceleratedDep || 425000).toLocaleString()}`,
    `Bonus Depreciation: $${(propertyData.bonusDep || 187000).toLocaleString()}`,
    `Estimated Tax Savings (Year 1): $${(propertyData.taxSavings || 125000).toLocaleString()}`,
    '',
    'This study has been prepared in accordance with IRS guidelines and',
    'court-tested cost segregation methodologies.'
  ], 20, 35)
  
  return doc
}

export const generateProposal = (clientName, serviceName, amount) => {
  const doc = generateSamplePDF(`Service Proposal - ${serviceName}`)
  
  doc.setFontSize(12)
  doc.text(`Client: ${clientName}`, 20, 90)
  doc.text(`Service: ${serviceName}`, 20, 100)
  doc.text(`Investment: $${amount.toLocaleString()}`, 20, 110)
  
  doc.text([
    '',
    'Scope of Services:',
    '• Initial consultation and property analysis',
    '• Comprehensive cost segregation study',
    '• IRS-compliant documentation',
    '• Tax form preparation support',
    '• Ongoing consultation',
    '',
    'Timeline: 4-6 weeks from engagement',
    '',
    'This proposal is valid for 14 days from the date above.'
  ], 20, 125)
  
  return doc
}

export const downloadDocument = (doc, filename) => {
  doc.save(filename)
}

// Generate sample spreadsheet data as CSV (can be opened in Excel)
export const generateSampleSpreadsheet = (title, data) => {
  let csv = `${title}\nGenerated: ${new Date().toLocaleDateString()}\n\n`
  
  if (data && data.headers && data.rows) {
    csv += data.headers.join(',') + '\n'
    data.rows.forEach(row => {
      csv += row.join(',') + '\n'
    })
  } else {
    // Default sample data
    csv += 'Property,Purchase Date,Cost Basis,Accelerated Dep,Tax Savings\n'
    csv += 'Office Building,2024-01-15,$1250000,$425000,$125000\n'
    csv += 'Retail Space,2024-03-22,$850000,$315000,$89000\n'
    csv += 'Warehouse,2024-06-10,$2100000,$780000,$235000\n'
  }
  
  return csv
}

export const downloadSpreadsheet = (csv, filename) => {
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  window.URL.revokeObjectURL(url)
}
