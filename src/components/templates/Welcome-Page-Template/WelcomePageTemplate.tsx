"use client"
import HowItWorks from "@/components/organisms/Welcome-Page-HowItWorks/HowIrWorks";
import CallToAction from "@/components/organisms/Welcome-Page-CallToAction/CallToAction";
import HeroSection from "@/components/organisms/Welcome-Page-HeroSection/HeroSection";
import Navbar from "@/components/molecules/NavBar/NavBar";
import { WelcomePageFeatures } from "@/components/organisms/Welcome-Page-Features/WelcomePageFeatures";

export const WelcomePageTemplate = () => {
    return (
        <>
            <Navbar />
            <HeroSection />
            <WelcomePageFeatures />
            <HowItWorks />
            <CallToAction />
        </>
    );
};


