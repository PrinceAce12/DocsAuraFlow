import React from 'react'

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  className?: string
}

interface SelectItemProps {
  value: string
  children: React.ReactNode
}

export const Select: React.FC<SelectProps> = ({ className = '', children, ...props }) => {
  return (
    <select
      className={`flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
    </select>
  )
}

export const SelectItem: React.FC<SelectItemProps> = ({ value, children }) => {
  return <option value={value}>{children}</option>
}

export const SelectContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>
}

export const SelectTrigger: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
  return <div className={className}>{children}</div>
}

export const SelectValue: React.FC<{ placeholder?: string }> = ({ placeholder }) => {
  return <span>{placeholder}</span>
}
