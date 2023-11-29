import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils";

const headingVariants = cva("", {
    variants: {
        size: {
            default: "text-3xl",
            1: 'text-3xl',
            2: 'text-2xl',
            3: 'text-xl',
            4: 'text-lg',
            sm: "text-lg",
            md: "text-xl",
            lg: "text-2xl",
            xl: "text-3xl",
        }
    },
    defaultVariants: {
        size: "default",
    },
});

const compMap = {
    1: "h1",
    2: "h2",
    3: "h3",
    4: "h4",
    default: "h1",
    xl: "h1",
    lg: "h2",
    md: "h3",
    sm: "h4",
} as const;

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement>, VariantProps<typeof headingVariants> { }

const Heading: React.FC<HeadingProps> = React.forwardRef<HTMLHeadingElement, HeadingProps>(({ children, size, className, ...props }, ref) => {
    const Comp = compMap[size ?? 'default'] ?? compMap.default;

    return <Comp className={cn(headingVariants({ size, className }))} ref={ref} {...props}>{children}</Comp>;
});
Heading.displayName = "Heading";

export {
    Heading,
    headingVariants
};
