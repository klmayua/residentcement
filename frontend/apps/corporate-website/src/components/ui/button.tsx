import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-on-primary hover:opacity-90 active:scale-95",
        gold: "text-on-primary hover:opacity-90 active:scale-95 shadow-glow",
        destructive:
          "bg-error text-on-error hover:bg-error/90",
        outline:
          "border border-outline-variant/30 bg-transparent hover:bg-surface-container-high text-foreground",
        secondary:
          "bg-secondary-container text-on-secondary-container hover:bg-secondary-container/80",
        ghost: "hover:bg-surface-container-high text-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-6 py-2",
        sm: "h-9 px-4 text-xs",
        lg: "h-12 px-8 text-base",
        icon: "h-10 w-10",
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
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"

    // Apply gold gradient for gold variant
    const style = variant === 'gold' ? {
      background: 'linear-gradient(45deg, #745B17, #C5A55A)',
    } : undefined

    return (
      <Comp
        className={cn(buttonVariants({ variant: variant === 'gold' ? 'default' : variant, size, className }))}
        ref={ref}
        style={style}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
