'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Upload, FileText, Download, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface FormField {
  name: string;
  type: string;
  value: string;
}

export default function PdfFormFillerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === 'application/pdf') {
        setFile(droppedFile);
        setError(null);
        analyzeForm(droppedFile);
      } else {
        setError('Please upload a PDF file');
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile);
        setError(null);
        analyzeForm(selectedFile);
      } else {
        setError('Please upload a PDF file');
      }
    }
  };

  const analyzeForm = async (pdfFile: File) => {
    setIsAnalyzing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', pdfFile);

      const response = await fetch('/api/analyze-pdf-form', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to analyze PDF form');
      }

      const data = await response.json();
      setFormFields(data.fields || []);
    } catch (error) {
      console.error('Error analyzing form:', error);
      setError('Failed to analyze PDF form. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFieldChange = (index: number, value: string) => {
    const updatedFields = [...formFields];
    updatedFields[index].value = value;
    setFormFields(updatedFields);
  };

  const handleFillForm = async () => {
    if (!file) return;

    setIsProcessing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('fields', JSON.stringify(formFields));

      const response = await fetch('/api/fill-pdf-form', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to fill PDF form');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `filled-${file.name}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error filling form:', error);
      setError('Failed to fill PDF form. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">PDF Form Filler</h1>
          <p className="text-gray-600">Upload a PDF form and fill it out digitally</p>
        </div>

        <div className="grid gap-6">
          {/* File Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload PDF Form
              </CardTitle>
              <CardDescription>
                Upload a PDF form to analyze and fill out
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  dragActive
                    ? 'border-blue-400 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <div className="space-y-2">
                  <p className="text-lg font-medium text-gray-900">
                    Drop your PDF form here, or click to browse
                  </p>
                  <p className="text-sm text-gray-500">
                    Supports PDF files up to 10MB
                  </p>
                </div>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 cursor-pointer"
                >
                  Choose File
                </label>
              </div>

              {file && (
                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-800">
                    <strong>Selected:</strong> {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Form Fields */}
          {(isAnalyzing || formFields.length > 0) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Form Fields
                </CardTitle>
                <CardDescription>
                  {isAnalyzing
                    ? 'Analyzing PDF form fields...'
                    : `Found ${formFields.length} form fields`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isAnalyzing ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-2 text-gray-600">Analyzing form...</span>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {formFields.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">
                        No fillable form fields found in this PDF.
                      </p>
                    ) : (
                      <>
                        {formFields.map((field, index) => (
                          <div key={index} className="space-y-2">
                            <Label htmlFor={`field-${index}`} className="text-sm font-medium">
                              {field.name}
                            </Label>
                            {field.type === 'text' || field.type === 'textfield' ? (
                              <Input
                                id={`field-${index}`}
                                type="text"
                                placeholder={`Enter ${field.name}`}
                                value={field.value}
                                onChange={(e) => handleFieldChange(index, e.target.value)}
                              />
                            ) : field.type === 'textarea' ? (
                              <Textarea
                                id={`field-${index}`}
                                placeholder={`Enter ${field.name}`}
                                value={field.value}
                                onChange={(e) => handleFieldChange(index, e.target.value)}
                                rows={3}
                              />
                            ) : (
                              <Input
                                id={`field-${index}`}
                                type="text"
                                placeholder={`Enter ${field.name}`}
                                value={field.value}
                                onChange={(e) => handleFieldChange(index, e.target.value)}
                              />
                            )}
                          </div>
                        ))}
                        
                        <div className="pt-4">
                          <Button
                            onClick={handleFillForm}
                            disabled={isProcessing}
                            className="w-full"
                          >
                            {isProcessing ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Filling Form...
                              </>
                            ) : (
                              <>
                                <Download className="h-4 w-4 mr-2" />
                                Fill Form & Download
                              </>
                            )}
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
