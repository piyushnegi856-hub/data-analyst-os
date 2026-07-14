"use client";

import { Loader2 } from "lucide-react";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isPending: boolean;
  optimisticLabel?: string;
  variant?: "primary" | "ghost";
}

export function LoadingButton({ 
  isPending, 
  optimisticLabel, 
  children, 
  variant = "primary",
  className = "",
  ...props 
}: Props) {
  const baseClass = variant === "primary" ? "btn-primary" : "btn-ghost";
  
  return (
    <button
      {...props}
      disabled={isPending || props.disabled}
      className={`${baseClass} ${className}`}
      style={{
        pointerEvents: isPending ? "none" : "auto",
        ...props.style
      }}
    >
      {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
      {isPending && optimisticLabel ? optimisticLabel : children}
    </button>
  );
}
