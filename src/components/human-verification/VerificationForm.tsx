"use client";

import React, { useState, useEffect } from "react";
import { useHumanVerification } from "./HumanVerificationProvider";
import {
  Loader2,
  Shield,
  Sun,
  Moon,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { getStoredOTP } from "@/lib/HumanVerification";

export function VerificationForm() {
  const { isLoading, submitVerification, error } = useHumanVerification();
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationStatus, setVerificationStatus] = useState<"idle" | "success" | "error">("idle");
  const { theme, setTheme } = useTheme();
  const [displayOTP, setDisplayOTP] = useState<string>("");
  const router = useRouter();

  // Retrieve OTP from local storage on mount
  useEffect(()=>{
    const otp = getStoredOTP();
    setDisplayOTP(otp || "");
  },[])

  // Handle OTP submission
  const handleSubmit = async () => {
    if (verificationCode.length === 6) {
      setVerificationStatus("idle");
      try {
        await submitVerification(verificationCode);
        console.log(error)
        if (error) {
          setVerificationStatus("success");
          router.replace("/");
        } else {
          setVerificationStatus("error");
        }
      } catch (error) {
        setVerificationStatus("error");
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-full items-center justify-center p-6 bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800 text-neutral-900 dark:text-neutral-100 transition-all duration-300">
      {/* Theme toggle button */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute top-4 right-4"
      >
        <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          className="rounded-full w-10 h-10"
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>
      </motion.div>

      {/* Verification form */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-none p-8 space-y-6 border border-neutral-200 dark:border-neutral-700">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold text-center flex md:flex-row flex-col items-center justify-center gap-3 mb-2">
              <Shield className="h-8 w-8 text-purple-600" />
              Human Verification
            </h1>
            <p className="text-center text-neutral-600 font-thin mx-2 dark:text-neutral-400">
              Please enter the code below to verify your identity.
            </p>
          </motion.div>

          {/* Display the OTP */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center space-y-4 py-4"
          >
            <div className="flex items-center justify-center space-x-2">
              {displayOTP.split("").map((digit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-center w-10 h-12 bg-neutral-300/10 rounded-md border border-neutral-300/20 dark:bg-neutral-100/20 dark:border-neutral-400/30 text-neutral-900 dark:text-neutral-300"
                >
                  <span className="text-2xl font-bold">{digit}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* OTP Input */}
          <div className="flex items-center justify-center py-4">
            <InputOTP
              value={verificationCode}
              onChange={setVerificationCode}
              maxLength={6}
              disabled={isLoading}
              className="gap-2"
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          {/* Verify button with a single loader */}
          <Button
            onClick={handleSubmit}
            disabled={isLoading || verificationCode.length !== 6}
            className="w-full h-12 text-lg text-white font-medium rounded-xl transition-all duration-200 bg-purple-600 hover:bg-purple-600/90 flex items-center justify-center"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              "Verify"
            )}
          </Button>

          {/* Status message */}
          <AnimatePresence mode="wait">
            {verificationStatus !== "idle" && (
              <motion.div
                key={verificationStatus}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className={`flex items-center justify-center gap-2 p-3 rounded-lg ${
                  verificationStatus === "success"
                    ? "bg-green-200 dark:bg-green-900/30 font-semibold text-green-700 dark:text-green-300"
                    : "bg-red-200 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                }`}
              >
                {verificationStatus === "success" ? (
                  <>
                    <CheckCircle2 className="h-5 w-5" />
                    Verification successful!
                  </>
                ) : (
                  <>
                    <XCircle className="h-5 w-5" />
                    Verification failed. Please try again.
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
