"use client";

import { motion } from "framer-motion";

type StatCardProps = {
  label: string;
  value: string | number;
  subtext?: string;
};

export default function StatCard({ label, value, subtext }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 p-6 backdrop-blur"
    >
      <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">{label}</p>
      <p className="mt-2 text-4xl font-semibold text-black dark:text-white tracking-tight">{value}</p>
      {subtext && (
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">{subtext}</p>
      )}
    </motion.div>
  );
}