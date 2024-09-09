"use client";

import React, { createContext, useState, useContext, useEffect, useRef } from "react";
import { setCookie, getCookie } from "cookies-next";
import {
  verifyHumanBehavior,
  generateOTP,
  storeOTP,
  initUserEventTracking,
} from "@/lib/HumanVerification";

interface HumanVerificationContextType {
  isVerified: boolean;
  isLoading: boolean;
  showVerification: boolean;
  error: string | null;
  submitVerification: (code: string) => Promise<void>;
  initiateVerification: () => void;
  success: boolean | null;
}

const HumanVerificationContext = createContext<
  HumanVerificationContextType | undefined
>(undefined);

export const useHumanVerification = () => {
  const context = useContext(HumanVerificationContext);
  if (!context) {
    throw new Error(
      "useHumanVerification must be used within a HumanVerificationProvider"
    );
  }
  return context;
};

export const HumanVerificationProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean | null>(null);
  const otpGeneratedRef = useRef(false); // Use a ref to track OTP generation

  useEffect(() => {
    if (typeof window !== 'undefined' && !otpGeneratedRef.current) {
      const verifiedCookie = getCookie('human-verified');
      if (verifiedCookie === 'true') {
        setIsVerified(true);
      } else {
        const otp = generateOTP();
        // console.log(otp);
        storeOTP(otp);
        otpGeneratedRef.current = true; // Set ref to indicate OTP has been generated
        const stopTracking = initUserEventTracking();
        return () => stopTracking();
      }
    }
  }, []);

  const submitVerification = async (code: string) => {
    setIsLoading(true);
    setError(null);

    try {
    //   console.log(code);
      const isHuman = await verifyHumanBehavior(code);
      if (isHuman) {
        setIsVerified(true);
        setShowVerification(false);
        setCookie("human-verified", "true", { maxAge: 60 * 60 * 24 });
        setSuccess(true);
      } else {
        setError("Verification failed. Please try again.");
        setSuccess(false);
      }
    } catch (err) {
      setError("An error occurred during verification. Please try again.");
      console.error("Verification Error:", err);
    }

    setIsLoading(false);
  };

  const initiateVerification = () => {
    if (!isVerified) {
      setShowVerification(true);
    }
  };



  return (
    <HumanVerificationContext.Provider
      value={{
        isVerified,
        isLoading,
        showVerification,
        error,
        submitVerification,
        initiateVerification,
        success,
        
      }}
    >
      {children}
    </HumanVerificationContext.Provider>
  );
};
