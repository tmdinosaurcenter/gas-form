import * as React from "react"

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={`border border-gray-300 rounded-lg shadow-md p-4 ${className}`}>{children}</div>
}

export function CardHeader({ children }: { children: React.ReactNode }) {
  return <div className="border-b border-gray-200 pb-2 mb-4 font-semibold">{children}</div>
}

export function CardTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-xl font-bold">{children}</h2>
}

export function CardContent({ children }: { children: React.ReactNode }) {
  return <div className="mt-2">{children}</div>
}

