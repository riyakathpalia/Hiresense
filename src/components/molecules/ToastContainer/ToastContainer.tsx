import React from "react"
import { useToast } from "@/lib/hooks/useToast"
import Toast from "@/components/atoms/Toast"

const ToastContainer = () => {
  const { toasts } = useToast()

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} />
      ))}
    </div>
  )
}

export default ToastContainer