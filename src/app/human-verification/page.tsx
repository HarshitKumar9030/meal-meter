import React from 'react';
import { HumanVerificationProvider } from '@/components/human-verification/HumanVerificationProvider';
import { VerificationForm } from '@/components/human-verification/VerificationForm';

export default function HumanVerificationPage() {
  return (
    <HumanVerificationProvider>
      <VerificationForm />
    </HumanVerificationProvider>
  );
}