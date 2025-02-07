"use client"

import { Toast, ToastClose, ToastDescription, ToastTitle, ToastViewport } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"

export function Toaster() {
  const { message } = useToast()

  return message ? (
    <Toast>
      <ToastTitle>Notification</ToastTitle>
      <ToastDescription>{message}</ToastDescription>
      <ToastClose onClick={() => console.log("Close Toast")} />
      <ToastViewport />
    </Toast>
  ) : null
}
