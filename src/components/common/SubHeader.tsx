import { cn } from "@/lib/utils";

interface SubHeaderProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
  className?: string;
}

export function SubHeader({ children, className, ...props }: SubHeaderProps) {
  return (
    <h3
      className={cn("text-sm font-medium tracking-tight", className)}
      {...props}
    >
      {children}
    </h3>
  );
}
