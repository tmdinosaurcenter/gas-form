import * as React from "react"

export function Select({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select {...props} className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring focus:ring-blue-500">
      {children}
    </select>
  )
}

