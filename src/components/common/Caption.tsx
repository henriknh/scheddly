import { cn } from "@/lib/utils";

interface CaptionProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
  className?: string;
}

export function Caption({ children, className, ...props }: CaptionProps) {
  return (
    <p className={cn("text-xs text-muted-foreground", className)} {...props}>
      {children}
    </p>
  );
}
