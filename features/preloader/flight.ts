// Where the logo flies to: the navbar's own logo slot, measured at runtime.

export function flightTo(navLogo: HTMLElement | null) {
  const target =
    (prop: "x" | "y" | "scale") => (_i: number, el: HTMLElement) => {
      if (!navLogo)
        return prop === "scale"
          ? 0.25
          : prop === "y"
            ? -window.innerHeight * 0.38
            : 0;
      const from = el.getBoundingClientRect();
      const to = navLogo.getBoundingClientRect();
      if (prop === "scale") return to.width / from.width;
      if (prop === "x")
        return to.left + to.width / 2 - (from.left + from.width / 2);
      return to.top + to.height / 2 - (from.top + from.height / 2);
    };
  return { x: target("x"), y: target("y"), scale: target("scale") };
}
