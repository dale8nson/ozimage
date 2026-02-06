"use client";

import React, { RefObject } from "react";
import { cn } from "@/lib/utils";
import { motion, MotionValue, useTransform } from "motion/react";

interface CardProps {
  id: number;
  className?: string;
  progress: MotionValue;
  range: number[];
  targetScale: number;
  children?: React.ReactNode;
}

export default function ParallaxCardEffect({
  id,
  className,
  progress,
  range,
  targetScale,

  children
}: CardProps) {
  const scale = useTransform(progress, range, [1, targetScale]);

  return (
    <div className="sticky top-8 flex h-full w-full items-start justify-center">
      <motion.div
        style={{
          scale,
          top: `calc(-90px * ${id * 30}px)`
        }}
        className={className}
        >
        {children}
      </motion.div>
    </div>
  );
}
