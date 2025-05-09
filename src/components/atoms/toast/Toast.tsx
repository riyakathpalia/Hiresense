import React from "react";

export interface ToastProps {
  title: string; // The title of the toast
  description?: string; // Optional description for the toast
  action?: React.ReactNode; // Optional action element (e.g., a button)
}

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