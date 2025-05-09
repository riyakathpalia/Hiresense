// "use client"
// import { createContext, useContext } from "react";
// import { useToast } from "@/lib/hooks/useToast";
// import ToastContainer from "@/components/molecules/ToastContainer/ToastContainer";

// const ToastContext = createContext(null)

// export const ToastProvider = ({ children }) => {
//   const toastMethods = useToast()

//   return (
//     <ToastContext.Provider value={toastMethods}>
//       {children}
//       <ToastContainer />
//     </ToastContext.Provider>
//   )
// }

// export const useToastContext = () => useContext(ToastContext)