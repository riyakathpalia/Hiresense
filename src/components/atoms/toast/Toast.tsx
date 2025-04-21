import React from "react"
import { ToastProps } from "@/components/ui/toast"

const Toast: React.FC<ToastProps> = ({ title, description, action }) => {
  return (
    <div className="toast">
      <strong>{title}</strong>
      <p>{description}</p>
      {action}
    </div>
  )
}

export default Toast