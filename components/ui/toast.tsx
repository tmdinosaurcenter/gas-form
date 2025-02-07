"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export const Toast = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return <div className={cn("fixed bottom-5 right-5 bg-gray-800 text-white p-3 rounded-lg shadow-lg", className)}>{children}</div>
}

export const ToastTitle = ({ children }: { children: React.ReactNode }) => {
  return <strong className="block font-bold">{children}</strong>
}

export const ToastDescription = ({ children }: { children: React.ReactNode }) => {
  return <p className="text-sm">{children}</p>
}

export const ToastClose = ({ onClick }: { onClick: () => void }) => {
  return (
    <button onClick={onClick} className="absolute top-2 right-2 text-gray-400 hover:text-gray-200">
      ✖
    </button>
  )
}

export const ToastViewport = () => {
  return <div className="fixed bottom-0 right-0 w-80 flex flex-col gap-2 p-4" />
}
