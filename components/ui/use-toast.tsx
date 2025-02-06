import { useState } from "react";

export function useToast() {
  const [message, setMessage] = useState<string | null>(null);

  const toast = ({ title, description, variant }: { title: string; description: string; variant?: "default" | "destructive" }) => {
    console.log(`${variant === "destructive" ? "[ERROR]" : "[INFO]"} ${title}: ${description}`);
    setMessage(`${title}: ${description}`);
    setTimeout(() => setMessage(null), 3000);
  };

  return { toast, message };
}

