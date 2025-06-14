
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "relative inline-flex items-center justify-center whitespace-nowrap rounded-2xl text-sm font-semibold ring-offset-background transition-all duration-500 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent-200 disabled:pointer-events-none disabled:opacity-50 transform hover:scale-105 active:scale-95 overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-accent-500 via-accent-600 to-purple-600 text-white hover:from-accent-600 hover:via-accent-700 hover:to-purple-700 shadow-elegant hover:shadow-modern",
        destructive: "bg-gradient-to-r from-error-500 to-red-600 text-white hover:from-error-600 hover:to-red-700 shadow-elegant hover:shadow-modern",
        outline: "border-2 border-accent-200 bg-white text-accent-700 hover:bg-gradient-to-r hover:from-accent-50 hover:to-purple-50 hover:border-accent-400 shadow-soft hover:shadow-elegant",
        secondary: "bg-gradient-to-r from-primary-100 to-primary-150 text-primary-800 hover:from-primary-200 hover:to-primary-250 shadow-soft hover:shadow-elegant",
        ghost: "text-primary-700 hover:bg-gradient-to-r hover:from-accent-50 hover:to-purple-50 hover:text-accent-600",
        link: "text-accent-600 underline-offset-4 hover:underline hover:text-accent-700",
      },
      size: {
        default: "h-14 px-8 py-4",
        sm: "h-12 rounded-xl px-6 text-sm",
        lg: "h-16 rounded-2xl px-12 text-base",
        icon: "h-14 w-14",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {children}
        {/* Effet de brillance au survol */}
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 -translate-x-full hover:translate-x-full transform" style={{ transition: 'transform 0.8s ease-out, opacity 0.3s ease-out' }}></span>
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
