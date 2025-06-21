import { NextRequest, NextResponse } from 'next/server'
import PDFDocument from 'pdfkit'

interface PersonalInfo {
  fullName: string
  email: string
  phone: string
  location: string
  summary: string
}

interface Experience {
  id: string
  company: string
  position: string
  startDate: string
  endDate: string
  current: boolean
  description: string
}

interface Education {
  id: string
  institution: string
  degree: string
  field: string
  startDate: string
  endDate: string
  current: boolean
}

interface Skill {
  id: string
  name: string
  level: string
}

interface ResumeData {
  personalInfo: PersonalInfo
  experiences: Experience[]
  education: Education[]
  skills: Skill[]
  template: string
}

function formatDate(dateString: string): string {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long' 
  })
}

function addModernTemplate(doc: PDFKit.PDFDocument, data: ResumeData) {
  const { personalInfo, experiences, education, skills } = data
  
  // Header with name and contact info
  doc.fillColor('#2563eb')
  doc.fontSize(28)
  doc.font('Helvetica-Bold')
  doc.text(personalInfo.fullName, 50, 50)
  
  doc.fillColor('#6b7280')
  doc.fontSize(12)
  doc.font('Helvetica')
  
  let yPos = 90
  const contactInfo = [
    personalInfo.email,
    personalInfo.phone,
    personalInfo.location
  ].filter(Boolean)
  
  doc.text(contactInfo.join(' • '), 50, yPos)
  yPos += 30
  
  // Professional Summary
  if (personalInfo.summary) {
    doc.fillColor('#1f2937')
    doc.fontSize(14)
    doc.font('Helvetica-Bold')
    doc.text('PROFESSIONAL SUMMARY', 50, yPos)
    yPos += 20
    
    doc.fillColor('#374151')
    doc.fontSize(11)
    doc.font('Helvetica')
    doc.text(personalInfo.summary, 50, yPos, { width: 500, align: 'justify' })
    yPos += doc.heightOfString(personalInfo.summary, { width: 500 }) + 20
  }
  
  // Work Experience
  if (experiences.length > 0) {
    doc.fillColor('#1f2937')
    doc.fontSize(14)
    doc.font('Helvetica-Bold')
    doc.text('WORK EXPERIENCE', 50, yPos)
    yPos += 20
    
    experiences.forEach((exp) => {
      if (yPos > 700) {
        doc.addPage()
        yPos = 50
      }
      
      doc.fillColor('#2563eb')
      doc.fontSize(12)
      doc.font('Helvetica-Bold')
      doc.text(exp.position, 50, yPos)
      
      doc.fillColor('#6b7280')
      doc.fontSize(11)
      doc.font('Helvetica')
      const dateRange = `${formatDate(exp.startDate)} - ${exp.current ? 'Present' : formatDate(exp.endDate)}`
      doc.text(dateRange, 400, yPos, { width: 150, align: 'right' })
      yPos += 15
      
      doc.fillColor('#374151')
      doc.fontSize(11)
      doc.font('Helvetica-Bold')
      doc.text(exp.company, 50, yPos)
      yPos += 15
      
      if (exp.description) {
        doc.fillColor('#4b5563')
        doc.fontSize(10)
        doc.font('Helvetica')
        doc.text(exp.description, 50, yPos, { width: 500, align: 'justify' })
        yPos += doc.heightOfString(exp.description, { width: 500 }) + 15
      }
      
      yPos += 10
    })
  }
  
  // Education
  if (education.length > 0) {
    if (yPos > 650) {
      doc.addPage()
      yPos = 50
    }
    
    doc.fillColor('#1f2937')
    doc.fontSize(14)
    doc.font('Helvetica-Bold')
    doc.text('EDUCATION', 50, yPos)
    yPos += 20
    
    education.forEach((edu) => {
      if (yPos > 700) {
        doc.addPage()
        yPos = 50
      }
      
      doc.fillColor('#2563eb')
      doc.fontSize(12)
      doc.font('Helvetica-Bold')
      doc.text(`${edu.degree} in ${edu.field}`, 50, yPos)
      
      doc.fillColor('#6b7280')
      doc.fontSize(11)
      doc.font('Helvetica')
      const dateRange = `${formatDate(edu.startDate)} - ${edu.current ? 'Present' : formatDate(edu.endDate)}`
      doc.text(dateRange, 400, yPos, { width: 150, align: 'right' })
      yPos += 15
      
      doc.fillColor('#374151')
      doc.fontSize(11)
      doc.font('Helvetica')
      doc.text(edu.institution, 50, yPos)
      yPos += 25
    })
  }
  
  // Skills
  if (skills.length > 0) {
    if (yPos > 650) {
      doc.addPage()
      yPos = 50
    }
    
    doc.fillColor('#1f2937')
    doc.fontSize(14)
    doc.font('Helvetica-Bold')
    doc.text('SKILLS', 50, yPos)
    yPos += 20
    
    const skillsByLevel = skills.reduce((acc, skill) => {
      if (!acc[skill.level]) acc[skill.level] = []
      acc[skill.level].push(skill.name)
      return acc
    }, {} as Record<string, string[]>)
    
    Object.entries(skillsByLevel).forEach(([level, skillNames]) => {
      doc.fillColor('#2563eb')
      doc.fontSize(11)
      doc.font('Helvetica-Bold')
      doc.text(`${level}:`, 50, yPos)
      
      doc.fillColor('#4b5563')
      doc.fontSize(10)
      doc.font('Helvetica')
      doc.text(skillNames.join(', '), 120, yPos, { width: 430 })
      yPos += 15
    })
  }
}

function addClassicTemplate(doc: PDFKit.PDFDocument, data: ResumeData) {
  const { personalInfo, experiences, education, skills } = data
  
  // Header
  doc.fillColor('#000000')
  doc.fontSize(24)
  doc.font('Helvetica-Bold')
  doc.text(personalInfo.fullName, 50, 50)
  
  doc.fillColor('#666666')
  doc.fontSize(10)
  doc.font('Helvetica')
  
  let yPos = 80
  const contactInfo = [
    personalInfo.email,
    personalInfo.phone,
    personalInfo.location
  ].filter(Boolean)
  
  doc.text(contactInfo.join(' | '), 50, yPos)
  yPos += 30
  
  // Professional Summary
  if (personalInfo.summary) {
    doc.fillColor('#000000')
    doc.fontSize(12)
    doc.font('Helvetica-Bold')
    doc.text('SUMMARY', 50, yPos)
    yPos += 15
    
    doc.fillColor('#333333')
    doc.fontSize(10)
    doc.font('Helvetica')
    doc.text(personalInfo.summary, 50, yPos, { width: 500, align: 'justify' })
    yPos += doc.heightOfString(personalInfo.summary, { width: 500 }) + 20
  }
  
  // Work Experience
  if (experiences.length > 0) {
    doc.fillColor('#000000')
    doc.fontSize(12)
    doc.font('Helvetica-Bold')
    doc.text('EXPERIENCE', 50, yPos)
    yPos += 20
    
    experiences.forEach((exp) => {
      if (yPos > 700) {
        doc.addPage()
        yPos = 50
      }
      
      doc.fillColor('#000000')
      doc.fontSize(11)
      doc.font('Helvetica-Bold')
      doc.text(exp.position, 50, yPos)
      
      doc.fillColor('#666666')
      doc.fontSize(10)
      doc.font('Helvetica')
      const dateRange = `${formatDate(exp.startDate)} - ${exp.current ? 'Present' : formatDate(exp.endDate)}`
      doc.text(dateRange, 400, yPos, { width: 150, align: 'right' })
      yPos += 12
      
      doc.fillColor('#333333')
      doc.fontSize(10)
      doc.font('Helvetica-Bold')
      doc.text(exp.company, 50, yPos)
      yPos += 12
      
      if (exp.description) {
        doc.fillColor('#333333')
        doc.fontSize(9)
        doc.font('Helvetica')
        doc.text(exp.description, 50, yPos, { width: 500, align: 'justify' })
        yPos += doc.heightOfString(exp.description, { width: 500 }) + 10
      }
      
      yPos += 8
    })
  }
  
  // Education
  if (education.length > 0) {
    if (yPos > 650) {
      doc.addPage()
      yPos = 50
    }
    
    doc.fillColor('#000000')
    doc.fontSize(12)
    doc.font('Helvetica-Bold')
    doc.text('EDUCATION', 50, yPos)
    yPos += 20
    
    education.forEach((edu) => {
      if (yPos > 700) {
        doc.addPage()
        yPos = 50
      }
      
      doc.fillColor('#000000')
      doc.fontSize(11)
      doc.font('Helvetica-Bold')
      doc.text(`${edu.degree} in ${edu.field}`, 50, yPos)
      
      doc.fillColor('#666666')
      doc.fontSize(10)
      doc.font('Helvetica')
      const dateRange = `${formatDate(edu.startDate)} - ${edu.current ? 'Present' : formatDate(edu.endDate)}`
      doc.text(dateRange, 400, yPos, { width: 150, align: 'right' })
      yPos += 12
      
      doc.fillColor('#333333')
      doc.fontSize(10)
      doc.font('Helvetica')
      doc.text(edu.institution, 50, yPos)
      yPos += 20
    })
  }
  
  // Skills
  if (skills.length > 0) {
    if (yPos > 650) {
      doc.addPage()
      yPos = 50
    }
    
    doc.fillColor('#000000')
    doc.fontSize(12)
    doc.font('Helvetica-Bold')
    doc.text('SKILLS', 50, yPos)
    yPos += 20
    
    const allSkills = skills.map(skill => `${skill.name} (${skill.level})`).join(', ')
    doc.fillColor('#333333')
    doc.fontSize(10)
    doc.font('Helvetica')
    doc.text(allSkills, 50, yPos, { width: 500 })
  }
}

function addMinimalTemplate(doc: PDFKit.PDFDocument, data: ResumeData) {
  const { personalInfo, experiences, education, skills } = data
  
  // Header with name and contact info
  doc.fillColor('#000000')
  doc.fontSize(32)
  doc.font('Helvetica-Light')
  doc.text(personalInfo.fullName, 50, 50)
  
  doc.fontSize(10)
  doc.font('Helvetica')
  
  let yPos = 90
  const contactInfo = [
    personalInfo.email,
    personalInfo.phone,
    personalInfo.location
  ].filter(Boolean)
  
  doc.text(contactInfo.join('  ·  '), 50, yPos)
  yPos += 40
  
  // Professional Summary
  if (personalInfo.summary) {
    doc.fontSize(11)
    doc.font('Helvetica')
    doc.text(personalInfo.summary, 50, yPos, { width: 500, align: 'justify' })
    yPos += doc.heightOfString(personalInfo.summary, { width: 500 }) + 30
  }
  
  // Work Experience
  if (experiences.length > 0) {
    doc.fontSize(11)
    doc.font('Helvetica-Bold')
    doc.text('Experience', 50, yPos)
    yPos += 20
    
    experiences.forEach((exp) => {
      if (yPos > 700) {
        doc.addPage()
        yPos = 50
      }
      
      doc.fontSize(11)
      doc.font('Helvetica-Bold')
      doc.text(exp.position, 50, yPos)
      doc.text(exp.company, 250, yPos)
      
      const dateRange = `${formatDate(exp.startDate)} – ${exp.current ? 'Present' : formatDate(exp.endDate)}`
      doc.font('Helvetica')
      doc.text(dateRange, 400, yPos, { width: 150, align: 'right' })
      yPos += 15
      
      if (exp.description) {
        doc.fontSize(10)
        doc.font('Helvetica')
        doc.text(exp.description, 50, yPos, { width: 500, align: 'justify' })
        yPos += doc.heightOfString(exp.description, { width: 500 }) + 15
      }
      
      yPos += 15
    })
  }
  
  // Education
  if (education.length > 0) {
    if (yPos > 650) {
      doc.addPage()
      yPos = 50
    }
    
    doc.fontSize(11)
    doc.font('Helvetica-Bold')
    doc.text('Education', 50, yPos)
    yPos += 20
    
    education.forEach((edu) => {
      if (yPos > 700) {
        doc.addPage()
        yPos = 50
      }
      
      doc.fontSize(11)
      doc.font('Helvetica-Bold')
      doc.text(`${edu.degree}, ${edu.field}`, 50, yPos)
      doc.text(edu.institution, 250, yPos)
      
      const dateRange = `${formatDate(edu.startDate)} – ${edu.current ? 'Present' : formatDate(edu.endDate)}`
      doc.font('Helvetica')
      doc.text(dateRange, 400, yPos, { width: 150, align: 'right' })
      yPos += 25
    })
  }
  
  // Skills
  if (skills.length > 0) {
    if (yPos > 650) {
      doc.addPage()
      yPos = 50
    }
    
    doc.fontSize(11)
    doc.font('Helvetica-Bold')
    doc.text('Skills', 50, yPos)
    yPos += 20
    
    const allSkills = skills.map(skill => skill.name).join(', ')
    doc.fontSize(10)
    doc.font('Helvetica')
    doc.text(allSkills, 50, yPos, { width: 500 })
  }
}

function addCreativeTemplate(doc: PDFKit.PDFDocument, data: ResumeData) {
  const { personalInfo, experiences, education, skills } = data
  
  // Creative header with colored accent
  doc.fillColor('#4f46e5')
  doc.rect(0, 0, 600, 100)
  doc.fill()
  
  doc.fillColor('#ffffff')
  doc.fontSize(32)
  doc.font('Helvetica-Bold')
  doc.text(personalInfo.fullName, 50, 30)
  
  doc.fontSize(12)
  doc.font('Helvetica')
  
  let yPos = 70
  const contactInfo = [
    personalInfo.email,
    personalInfo.phone,
    personalInfo.location
  ].filter(Boolean)
  
  doc.text(contactInfo.join(' • '), 50, yPos)
  yPos = 120
  
  // Professional Summary
  if (personalInfo.summary) {
    doc.fillColor('#4f46e5')
    doc.fontSize(14)
    doc.font('Helvetica-Bold')
    doc.text('About', 50, yPos)
    yPos += 20
    
    doc.fillColor('#1f2937')
    doc.fontSize(11)
    doc.font('Helvetica')
    doc.text(personalInfo.summary, 50, yPos, { width: 500, align: 'justify' })
    yPos += doc.heightOfString(personalInfo.summary, { width: 500 }) + 30
  }
  
  // Work Experience
  if (experiences.length > 0) {
    doc.fillColor('#4f46e5')
    doc.fontSize(14)
    doc.font('Helvetica-Bold')
    doc.text('Experience', 50, yPos)
    yPos += 20
    
    experiences.forEach((exp) => {
      if (yPos > 700) {
        doc.addPage()
        yPos = 50
      }
      
      doc.circle(50, yPos + 5, 3)
      doc.fillColor('#4f46e5')
      doc.fill()
      
      doc.fillColor('#1f2937')
      doc.fontSize(12)
      doc.font('Helvetica-Bold')
      doc.text(exp.position, 65, yPos)
      
      doc.fillColor('#6b7280')
      doc.fontSize(11)
      doc.font('Helvetica')
      const dateRange = `${formatDate(exp.startDate)} - ${exp.current ? 'Present' : formatDate(exp.endDate)}`
      doc.text(dateRange, 400, yPos, { width: 150, align: 'right' })
      yPos += 15
      
      doc.fillColor('#4f46e5')
      doc.fontSize(11)
      doc.font('Helvetica')
      doc.text(exp.company, 65, yPos)
      yPos += 15
      
      if (exp.description) {
        doc.fillColor('#374151')
        doc.fontSize(10)
        doc.font('Helvetica')
        doc.text(exp.description, 65, yPos, { width: 485, align: 'justify' })
        yPos += doc.heightOfString(exp.description, { width: 485 }) + 15
      }
      
      yPos += 10
    })
  }
  
  // Education
  if (education.length > 0) {
    if (yPos > 650) {
      doc.addPage()
      yPos = 50
    }
    
    doc.fillColor('#4f46e5')
    doc.fontSize(14)
    doc.font('Helvetica-Bold')
    doc.text('Education', 50, yPos)
    yPos += 20
    
    education.forEach((edu) => {
      if (yPos > 700) {
        doc.addPage()
        yPos = 50
      }
      
      doc.circle(50, yPos + 5, 3)
      doc.fillColor('#4f46e5')
      doc.fill()
      
      doc.fillColor('#1f2937')
      doc.fontSize(12)
      doc.font('Helvetica-Bold')
      doc.text(`${edu.degree} in ${edu.field}`, 65, yPos)
      
      doc.fillColor('#6b7280')
      doc.fontSize(11)
      doc.font('Helvetica')
      const dateRange = `${formatDate(edu.startDate)} - ${edu.current ? 'Present' : formatDate(edu.endDate)}`
      doc.text(dateRange, 400, yPos, { width: 150, align: 'right' })
      yPos += 15
      
      doc.fillColor('#4f46e5')
      doc.fontSize(11)
      doc.font('Helvetica')
      doc.text(edu.institution, 65, yPos)
      yPos += 25
    })
  }
  
  // Skills
  if (skills.length > 0) {
    if (yPos > 650) {
      doc.addPage()
      yPos = 50
    }
    
    doc.fillColor('#4f46e5')
    doc.fontSize(14)
    doc.font('Helvetica-Bold')
    doc.text('Skills', 50, yPos)
    yPos += 20
    
    skills.forEach((skill) => {
      doc.fillColor('#374151')
      doc.fontSize(11)
      doc.font('Helvetica')
      doc.text(`• ${skill.name} (${skill.level})`, 50, yPos)
      yPos += 15
    })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data: ResumeData = await request.json()
    
    // Validate required fields
    if (!data.personalInfo.fullName || !data.personalInfo.email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      )
    }
    
    if (data.experiences.length === 0 && data.education.length === 0) {
      return NextResponse.json(
        { error: 'At least one experience or education entry is required' },
        { status: 400 }
      )
    }
    
    // Create PDF document
    const doc = new PDFDocument({
      size: 'A4',
      margins: { top: 50, bottom: 50, left: 50, right: 50 }
    })
    
    // Apply template
    switch (data.template) {
      case 'classic':
        addClassicTemplate(doc, data)
        break
      case 'minimal':
        addMinimalTemplate(doc, data)
        break
      case 'creative':
        addCreativeTemplate(doc, data)
        break
      default:
        addModernTemplate(doc, data)
    }
    
    // Generate PDF buffer
    const chunks: Uint8Array[] = []
    doc.on('data', (chunk) => chunks.push(chunk))
    
    const pdfBuffer = await new Promise<Buffer>((resolve) => {
      doc.on('end', () => {
        resolve(Buffer.concat(chunks))
      })
      doc.end()
    })
    
    // Return PDF
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${data.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.pdf"`,
      },
    })
  } catch (error) {
    console.error('Error generating resume:', error)
    return NextResponse.json(
      { error: 'Failed to generate resume' },
      { status: 500 }
    )
  }
}
