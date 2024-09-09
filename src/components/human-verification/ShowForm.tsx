"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; 
import { useHumanVerification } from './HumanVerificationProvider';
import { VerificationForm } from './VerificationForm';
import { Loader2 } from 'lucide-react';

const ShowForm = () => {
  const { showVerification, isVerified } = useHumanVerification();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleVerificationCheck = () => {
      if (!isVerified) {
        router.replace('/human-verification');
      }
      setLoading(false); 
    };

    const timeoutId = setTimeout(handleVerificationCheck, 1000);

    return () => clearTimeout(timeoutId);
  }, [isVerified, router]);

  if (loading) {
    return (
      <div className="flex fixed z-10 items-center justify-center w-screen dark:bg-neutral-900 bg-neutral-100 h-screen">
        <Loader2 className="animate-spin dark:text-neutral-100 text-neutral-900" size={48} />
      </div>
    );
  }

  // If verification is required, show the VerificationForm
  return showVerification ? <VerificationForm /> : null;
};

export default ShowForm;
