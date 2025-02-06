import { ButtonHTMLAttributes } from "react"

export function Button(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button {...props} className="px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary transition-colors" />
}

