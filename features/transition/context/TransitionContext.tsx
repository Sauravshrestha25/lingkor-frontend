"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";

interface TransitionContextType {
  isTransitioning: boolean;
  targetPath: string | null;
  navigateWithTransition: (href: string) => void;
  markTransitionDone: () => void;
}

const TransitionContext = createContext<TransitionContextType>({
  isTransitioning: false,
  targetPath: null,
  navigateWithTransition: () => {},
  markTransitionDone: () => {},
});

export function usePageTransition() {
  return useContext(TransitionContext);
}

export function TransitionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const currentPathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [targetPath, setTargetPath] = useState<string | null>(null);
  const navigatingTo = useRef<string | null>(null);
  const isTransitioningRef = useRef(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Mirrored in an effect, not during render: writing a ref while rendering is a
  // React rule violation (and a lint error) because a render can be thrown away and
  // re-run, leaving the ref describing a state that never committed.
  useEffect(() => {
    isTransitioningRef.current = isTransitioning;
  }, [isTransitioning]);

  const markTransitionDone = useCallback(() => {
    setIsTransitioning(false);
    setTargetPath(null);
    navigatingTo.current = null;
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const navigateWithTransition = useCallback(
    (href: string) => {
      if (isTransitioningRef.current || navigatingTo.current === href) {
        return;
      }

      // Check if href is same as current page
      const currentUrl =
        typeof window !== "undefined"
          ? window.location.pathname + window.location.search
          : currentPathname;
      if (href === currentUrl || href === currentPathname) {
        return;
      }

      navigatingTo.current = href;
      setTargetPath(href);
      setIsTransitioning(true);

      // Trigger router prefetch
      try {
        router.prefetch(href);
      } catch {
        // ignore prefetch errors
      }

      // Safety timeout failsafe: unlock after 5s if anything halts
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        markTransitionDone();
      }, 5000);
    },
    [currentPathname, markTransitionDone, router],
  );

  // Global capture click interceptor for internal links
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      // Ignore right clicks or clicks with modifier keys
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
        return;
      }

      const target = e.target as HTMLElement | null;
      if (!target) return;

      const anchor = target.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      // Ignore external links, downloads, anchors/hashes, tel/mailto
      if (
        href.startsWith("http://") ||
        href.startsWith("https://") ||
        href.startsWith("//") ||
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        anchor.getAttribute("target") === "_blank" ||
        anchor.hasAttribute("download")
      ) {
        return;
      }

      // Ignore non-navigation or internal hash links
      if (href.startsWith("/#") || href.includes("#")) {
        const [path] = href.split("#");
        if (path === "" || path === currentPathname) {
          return;
        }
      }

      // Prevent default immediate jump and trigger seamless painted transition
      e.preventDefault();
      e.stopPropagation();
      navigateWithTransition(href);
    };

    document.addEventListener("click", handleDocumentClick, true);

    return () => {
      document.removeEventListener("click", handleDocumentClick, true);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentPathname, navigateWithTransition]);

  return (
    <TransitionContext.Provider
      value={{
        isTransitioning,
        targetPath,
        navigateWithTransition,
        markTransitionDone,
      }}
    >
      {children}
    </TransitionContext.Provider>
  );
}
