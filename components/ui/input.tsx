import { InputHTMLAttributes } from "react"

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring focus:ring-blue-500" />
}

