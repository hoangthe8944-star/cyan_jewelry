"use client";

import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      style={
        {
          "--normal-bg": "rgba(255, 255, 255, 0.96)",
          "--normal-text": "var(--foreground)",
          "--normal-border": "rgba(163, 107, 49, 0.28)",
          "--success-bg": "rgba(255, 255, 255, 0.98)",
          "--success-text": "var(--foreground)",
          "--success-border": "rgba(163, 107, 49, 0.4)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast:
            "border border-[rgba(163,107,49,0.28)] bg-[rgba(255,255,255,0.96)] text-foreground shadow-[0_18px_50px_rgba(17,33,45,0.16)] backdrop-blur-md",
          title: "text-sm font-medium tracking-[0.08em] text-primary uppercase",
          description: "text-sm text-slate-600",
          actionButton:
            "bg-primary text-white hover:bg-secondary rounded-none px-3 py-2 text-xs uppercase tracking-[0.18em]",
          cancelButton:
            "bg-white text-primary border border-[rgba(17,33,45,0.14)] hover:bg-muted rounded-none px-3 py-2 text-xs uppercase tracking-[0.18em]",
          success:
            "border-l-4 border-l-accent bg-[linear-gradient(135deg,rgba(255,255,255,0.98),rgba(232,236,235,0.92))]",
          error:
            "border-l-4 border-l-destructive bg-[linear-gradient(135deg,rgba(255,255,255,0.98),rgba(255,241,242,0.95))]",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
