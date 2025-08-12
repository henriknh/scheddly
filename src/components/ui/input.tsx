import * as React from "react";

import { cn } from "@/lib/utils";

type BaseInputProps = Omit<React.ComponentProps<"input">, "prefix">; // omit native HTML 'prefix' attr type

type InputProps = BaseInputProps & {
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  prefixClassName?: string;
  suffixClassName?: string;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      prefix,
      suffix,
      prefixClassName,
      suffixClassName,
      disabled,
      ...props
    },
    ref
  ) => {
    const hasAffix = prefix != null || suffix != null;

    if (!hasAffix) {
      return (
        <input
          type={type}
          className={cn(
            "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            className
          )}
          ref={ref}
          disabled={disabled}
          {...props}
        />
      );
    }

    return (
      <div
        className={cn(
          "flex h-9 w-full items-center rounded-md border border-input bg-transparent shadow-sm transition-colors focus-within:ring-1 focus-within:ring-ring",
          disabled && "cursor-not-allowed opacity-50"
        )}
      >
        {prefix != null && prefix !== false && (
          <span
            className={cn(
              "pl-3 text-sm text-muted-foreground whitespace-nowrap select-none",
              prefixClassName
            )}
          >
            {prefix}
          </span>
        )}
        <input
          type={type}
          className={cn(
            "flex-1 bg-transparent px-3 py-1 text-base placeholder:text-muted-foreground focus:outline-none md:text-sm",
            className
          )}
          ref={ref}
          disabled={disabled}
          {...props}
        />
        {suffix != null && suffix !== false && (
          <span
            className={cn(
              "pr-3 text-sm text-muted-foreground whitespace-nowrap select-none",
              suffixClassName
            )}
          >
            {suffix}
          </span>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
