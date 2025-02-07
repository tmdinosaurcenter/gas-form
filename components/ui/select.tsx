import * as React from "react"

export function Select({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select {...props} className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring focus:ring-blue-500">
      {children}
    </select>
  )
}

export function SelectTrigger({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button {...props} className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring focus:ring-blue-500">
      {children}
    </button>
  )
}

export function SelectContent({ children }: { children: React.ReactNode }) {
  return <div className="absolute bg-white shadow-md rounded-md p-2">{children}</div>
}

export function SelectItem({ children, ...props }: React.OptionHTMLAttributes<HTMLOptionElement>) {
  return <option {...props}>{children}</option>
}

export function SelectValue({ children }: { children: React.ReactNode }) {
  return <span>{children}</span>
}

