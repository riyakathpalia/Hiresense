"use client"
import { WelcomePageTemplate } from "@/components/templates/Welcome-Page-Template/WelcomePageTemplate";
import { ensureGuestId } from "@/utils/userAgent";
import { useEffect } from "react";



export default function WelcomePage() {
  useEffect(() => {
    ensureGuestId();
  }, []);
  return (<>
    <WelcomePageTemplate />
  </>
  );
}
// export default function Home() {