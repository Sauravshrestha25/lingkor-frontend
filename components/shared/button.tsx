"use client";

import * as React from "react";
import { motion, type HTMLMotionProps } from "motion/react";

import { Slot, type WithAsChild } from "./animate-slot";
import { cn } from "@/lib/utils";

function ButtonArtwork() {
  const ref = React.useRef<SVGSVGElement>(null);
  const [size, setSize] = React.useState({ width: 100, height: 44 });
  React.useLayoutEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (width > 0 && height > 0) setSize({ width, height });
    });
    observer.observe(svg);
    return () => observer.disconnect();
  }, []);
  const { width, height } = size;
  const middle = height / 2;
  const radius = Math.min(middle - 1, width / 2);
  return (
    <svg ref={ref} className="brand-button-outline" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" fill="none" aria-hidden="true" focusable="false">
      <path pathLength="1" d={`M0 ${middle} A${radius} ${middle - 1} 0 0 1 ${radius} 1 H${width - radius} A${radius} ${middle - 1} 0 0 1 ${width} ${middle}`} />
      <path pathLength="1" d={`M${width} ${middle} A${radius} ${middle - 1} 0 0 1 ${width - radius} ${height - 1} H${radius} A${radius} ${middle - 1} 0 0 1 0 ${middle}`} />
    </svg>
  );
}

function buttonContent(children: React.ReactNode) {
  return <><ButtonArtwork /><span className="brand-button-content">{children}</span></>;
}

type ButtonProps = WithAsChild<
  Omit<HTMLMotionProps<"button">, "children"> & {
    children?: React.ReactNode;
    hoverScale?: number;
    tapScale?: number;
  }
>;

function Button({
  hoverScale = 1,
  tapScale = 0.98,
  asChild = false,
  className,
  children,
  ...props
}: ButtonProps) {
  const Component = asChild ? Slot : motion.button;
  const content = asChild && React.isValidElement<{ children?: React.ReactNode }>(children)
    ? React.cloneElement(children, {}, buttonContent(children.props.children))
    : buttonContent(children);

  return (
    <Component
      whileTap={{ scale: tapScale }}
      whileHover={{ scale: hoverScale }}
      {...props}
      className={cn("relative brand-button", className)}
    >
      {content}
    </Component>
  );
}

export { Button, type ButtonProps };
