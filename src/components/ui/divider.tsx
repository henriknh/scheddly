"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface DividerProps {
  orientation?: "horizontal" | "vertical";
  text?: string;
  className?: string;
  textClassName?: string;
}

const Divider = React.forwardRef<HTMLDivElement, DividerProps>(
  (
    { orientation = "horizontal", text, className, textClassName, ...props },
    ref
  ) => {
    if (orientation === "vertical") {
      return (
        <div
          ref={ref}
          className={cn("h-full w-[1px] bg-border shrink-0", className)}
          {...props}
        />
      );
    }

    // Horizontal divider
    if (text) {
      return (
        <div
          ref={ref}
          className={cn("relative flex items-center", className)}
          {...props}
        >
          <div className="flex-grow h-[1px] bg-border" />
          <span
            className={cn("px-3 text-sm text-muted-foreground", textClassName)}
          >
            {text}
          </span>
          <div className="flex-grow h-[1px] bg-border" />
        </div>
      );
    }

    // Horizontal divider without text
    return (
      <div
        ref={ref}
        className={cn("h-[1px] w-full bg-border shrink-0", className)}
        {...props}
      />
    );
  }
);

Divider.displayName = "Divider";

export { Divider };
