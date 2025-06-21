'use client'

import { useState } from 'react'
import { Download, User, MapPin, Phone, Mail, Briefcase, GraduationCap, Award, Plus, Trash2, Eye } from 'lucide-react'
import { HeaderAd, InContentAd, FooterAd } from '@/components/AdSense'

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

export default function ResumeBuilder() {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    summary: ''
  })

  const [experiences, setExperiences] = useState<Experience[]>([])
  const [education, setEducation] = useState<Education[]>([])
  const [skills, setSkills] = useState<Skill[]>([])
  const [template, setTemplate] = useState('modern')
  const [isGenerating, setIsGenerating] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)

  const addExperience = () => {
    const newExp: Experience = {
      id: Date.now().toString(),
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    }
    setExperiences([...experiences, newExp])
  }

  const updateExperience = (id: string, field: keyof Experience, value: any) => {
    setExperiences(experiences.map(exp => 
      exp.id === id ? { ...exp, [field]: value } : exp
    ))
  }

  const removeExperience = (id: string) => {
    setExperiences(experiences.filter(exp => exp.id !== id))
  }

  const addEducation = () => {
    const newEdu: Education = {
      id: Date.now().toString(),
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      current: false
    }
    setEducation([...education, newEdu])
  }

  const updateEducation = (id: string, field: keyof Education, value: any) => {
    setEducation(education.map(edu => 
      edu.id === id ? { ...edu, [field]: value } : edu
    ))
  }

  const removeEducation = (id: string) => {
    setEducation(education.filter(edu => edu.id !== id))
  }

  const addSkill = () => {
    const newSkill: Skill = {
      id: Date.now().toString(),
      name: '',
      level: 'Intermediate'
    }
    setSkills([...skills, newSkill])
  }

  const updateSkill = (id: string, field: keyof Skill, value: string) => {
    setSkills(skills.map(skill => 
      skill.id === id ? { ...skill, [field]: value } : skill
    ))
  }

  const removeSkill = (id: string) => {
    setSkills(skills.filter(skill => skill.id !== id))
  }

  const generateResume = async () => {
    setIsGenerating(true)
    try {
      const resumeData = {
        personalInfo,
        experiences,
        education,
        skills,
        template
      }

      const response = await fetch('/api/generate-resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resumeData),
      })

      if (!response.ok) {
        throw new Error('Failed to generate resume')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${personalInfo.fullName.replace(/\s+/g, '_')}_Resume.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Error generating resume:', error)
      alert('Error generating resume. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const isFormValid = () => {
    return personalInfo.fullName && personalInfo.email && 
           (experiences.length > 0 || education.length > 0)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4">
      {/* Header Ad */}
      <HeaderAd />
      
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Resume Builder
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Create a professional resume with our easy-to-use builder. Choose from modern templates and download as PDF.
          </p>
        </div>

        {/* In-content Ad */}
        <div className="mb-8">
          <InContentAd />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Personal Information */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center mb-6">
                <User className="text-blue-600 mr-3" size={24} />
                <h2 className="text-2xl font-bold text-gray-800">Personal Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={personalInfo.fullName}
                    onChange={(e) => setPersonalInfo({...personalInfo, fullName: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="John Doe"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={personalInfo.email}
                    onChange={(e) => setPersonalInfo({...personalInfo, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="john@example.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={personalInfo.phone}
                    onChange={(e) => setPersonalInfo({...personalInfo, phone: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={personalInfo.location}
                    onChange={(e) => setPersonalInfo({...personalInfo, location: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="New York, NY"
                  />
                </div>
              </div>
              
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Professional Summary
                </label>
                <textarea
                  value={personalInfo.summary}
                  onChange={(e) => setPersonalInfo({...personalInfo, summary: e.target.value})}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="A brief summary of your professional background and key achievements..."
                />
              </div>
            </div>

            {/* Work Experience */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <Briefcase className="text-blue-600 mr-3" size={24} />
                  <h2 className="text-2xl font-bold text-gray-800">Work Experience</h2>
                </div>
                <button
                  onClick={addExperience}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus size={20} className="mr-2" />
                  Add Experience
                </button>
              </div>

              {experiences.map((exp) => (
                <div key={exp.id} className="border border-gray-200 rounded-lg p-6 mb-4">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Experience Entry</h3>
                    <button
                      onClick={() => removeExperience(exp.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Company Name"
                    />
                    <input
                      type="text"
                      value={exp.position}
                      onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Job Title"
                    />
                    <input
                      type="month"
                      value={exp.startDate}
                      onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <div className="flex items-center space-x-2">
                      <input
                        type="month"
                        value={exp.endDate}
                        onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                        disabled={exp.current}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                      />
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={exp.current}
                          onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)}
                          className="mr-2"
                        />
                        Current
                      </label>
                    </div>
                  </div>
                  <textarea
                    value={exp.description}
                    onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Describe your responsibilities and achievements..."
                  />
                </div>
              ))}
            </div>

            {/* Education */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <GraduationCap className="text-blue-600 mr-3" size={24} />
                  <h2 className="text-2xl font-bold text-gray-800">Education</h2>
                </div>
                <button
                  onClick={addEducation}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus size={20} className="mr-2" />
                  Add Education
                </button>
              </div>

              {education.map((edu) => (
                <div key={edu.id} className="border border-gray-200 rounded-lg p-6 mb-4">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Education Entry</h3>
                    <button
                      onClick={() => removeEducation(edu.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Institution Name"
                    />
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Degree (e.g., Bachelor's, Master's)"
                    />
                    <input
                      type="text"
                      value={edu.field}
                      onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Field of Study"
                    />
                    <div className="flex items-center space-x-2">
                      <input
                        type="month"
                        value={edu.startDate}
                        onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <span className="text-gray-500">to</span>
                      <input
                        type="month"
                        value={edu.endDate}
                        onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                        disabled={edu.current}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                      />
                    </div>
                    <label className="flex items-center col-span-2">
                      <input
                        type="checkbox"
                        checked={edu.current}
                        onChange={(e) => updateEducation(edu.id, 'current', e.target.checked)}
                        className="mr-2"
                      />
                      Currently enrolled
                    </label>
                  </div>
                </div>
              ))}
            </div>

            {/* Skills */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <Award className="text-blue-600 mr-3" size={24} />
                  <h2 className="text-2xl font-bold text-gray-800">Skills</h2>
                </div>
                <button
                  onClick={addSkill}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus size={20} className="mr-2" />
                  Add Skill
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {skills.map((skill) => (
                  <div key={skill.id} className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg">
                    <input
                      type="text"
                      value={skill.name}
                      onChange={(e) => updateSkill(skill.id, 'name', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Skill name"
                    />
                    <select
                      value={skill.level}
                      onChange={(e) => updateSkill(skill.id, 'level', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                      <option value="Expert">Expert</option>
                    </select>
                    <button
                      onClick={() => removeSkill(skill.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Template Selection */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Choose Template</h3>
              <div className="space-y-3">
                {[
                  { value: 'modern', label: 'Modern', description: 'Clean and professional' },
                  { value: 'classic', label: 'Classic', description: 'Traditional format' },
                  { value: 'minimal', label: 'Minimal', description: 'Simple and elegant' },
                  { value: 'creative', label: 'Creative', description: 'Unique and stylish' }
                ].map((temp) => (
                  <label key={temp.value} className="flex items-start cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="template"
                      value={temp.value}
                      checked={template === temp.value}
                      onChange={(e) => setTemplate(e.target.value)}
                      className="mr-3 mt-1"
                    />
                    <div>
                      <span className="capitalize font-medium text-gray-900">{temp.label}</span>
                      <p className="text-sm text-gray-500">{temp.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Generate Resume */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <button
                onClick={generateResume}
                disabled={!isFormValid() || isGenerating}
                className="w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Download className="mr-2" size={20} />
                    Generate Resume
                  </>
                )}
              </button>
              {!isFormValid() && (
                <p className="text-sm text-red-600 mt-2 text-center">
                  Please fill in required fields and add at least one experience or education entry.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Footer Ad */}
        <div className="mt-12">
          <FooterAd />
        </div>
      </div>
    </div>
  )
}
