"use client";

import { useId, useLayoutEffect, useRef, useState } from "react";

/**
 * The side strip from the client's mockup, rebuilt from the artwork it was made from.
 *
 * The mockup strip is `public/images/art/knot-filled.png` turned a quarter turn,
 * drawn bolder, cropped to 437 of its 493 units across, and stacked end to end —
 * each copy 1483 units further down and 18 across (fitted to the mockup strip,
 * NCC 0.95 including the join). `PATH` is that PNG traced 1:1 in its own 1515×550 canvas.
 *
 * The artwork is not a repeating tile, so the joins are the drawing's own cut ends,
 * exactly as in the mockup; the bold stroke and the small size are what hide them.
 * The 18-unit drift is kept too: three copies (≈3.4× the strip's width each) fit before
 * the crop runs out of drawing on the left; past that the left edge thins by 18 units
 * a copy.
 */
const PATH =
  "M16.5 46L16 74.8L17.2 76L18.8 76L255.8 252L290.5 278L293.2 281.8L360.2 192L364.8 188.5L364.5 187L336.2 167L334.8 171.8L287.2 234.5L217 182.8L217 180.2L315 48.2L317 47.8L316.8 46L276.2 46L276.2 48.8L273 49.2L188.8 163.8L188.5 161.2L180.8 155L81.2 82L34.8 46ZM114.5 46L114 48.8L115.2 50L175.2 94.2L177.8 93.5L193 71.8L196 69.8L194.8 67L174.8 52.2L171.2 51L166.8 46ZM489.5 46L489.5 48.8L517.5 69L519 71.2L461.8 148L460.2 148L359 72L356 77.8L338 101.2L339.8 102.5L342.5 101L439.5 173L441.2 175.8L311 350.2L309 355L56.2 168L18.5 139.8L17.8 138L16 138.2L16 179.8L17.2 181L19 181L28.8 188L288 381L209 488.2L204.2 486L153.2 448L150.2 444L147.2 445.5L147 447.8L133 466.8L129 469.5L131.2 473L188.8 515.2L175 534.2L171 537.2L171 538.8L213.8 539L215 537.8L216.2 533.5L240 501.2L427.2 249.8L442.8 260L511.2 311.8L513 310.8L513 308.2L527 289.5L529.2 286.8L531 286.8L530.8 284.5L448.2 223.8L448 221.5L542.8 94.8L543.5 92.8L542 91.2L543.2 89L955 394.2L952.2 394.5L950 397.2L892 475.5L892.2 477.8L896.8 479L915.8 493.2L917.2 496L918.8 496L1020.2 358.2L1025 353.8L1025 351.2L1022.2 351L998.2 332.5L975 364.5L972.2 366L727 183.8L815 64.2L827 48.2L829 47.8L829 46.2L785.2 46L786 48.8L766.5 74L733 49L732.8 46L675.2 46L675.2 48L678.8 49.2L747 100.2L709 152.8L699.8 163.5L546.5 50L544.8 46ZM924.5 46L885 99.2L886.2 102L911 120.2L912.8 119.8L915 114.2L964 48.2L966 47.8L965.8 46ZM1051.5 46L1050 50.8L938.2 200.8L837.8 126L836 126.5L817.5 152.2L1099 361.5L1099 363.8L970.2 536.2L970.2 539L1012 538.8L1012 535.5L1018 527.2L1179 311.8L1178.8 310L1176.5 310L1152.5 291L1119.2 335.5L965 221L1093 48L1092.8 46ZM1175.5 46L1174.8 48.8L1056.8 207.8L1050 216.8L1047.8 217.2L1048.2 221L1050.8 221L1057.8 226L1073.2 239L1075 238.8L1102 201.2L1105.8 198.2L1178.5 253L1181.8 254L1185 251.5L1201 228.2L1126.2 173L1125 170.2L1211.8 54.5L1489.2 261L1493 261.8L1493 221.2L1490.2 221L1489.5 219.2L1424.8 171L1421.8 170L1421.5 172L1419 170.8L1490 74.5L1492 74.8L1493 72.8L1492.8 46L1468 46.2L1468 49.8L1394.5 148.2L1255.8 46ZM1218.5 137L1200.2 160.5L1199.8 162.8L1293 232L1243 300.8L1234.8 311.5L1232 311.2L1232.2 313L1260.5 333.8L1263 328.2L1320.8 252L1489.2 378L1493 378.8L1493 338.2L1491.8 337L1489.2 336.8L1473.2 325L1222.8 138ZM565.2 168.2L546 193.2L545 197L631.8 261L632 262.8L434 529.5L430 534.8L427 536.5L427 538.8L469.8 539L470.2 535.2L548.8 430.5L690.8 535.2L693.2 539L748.8 539L748.8 537L575.2 409L569 404L569 402.5L658.5 282L662.8 284L766.2 361.2L786.5 334L785.8 333L784.2 333.8L772.2 325L574.5 178L566 171.5ZM16.5 247L16 287.8L99 348.8L19 457.8L16 460.2L16 513.8L18 514L125.2 369L172.2 404L175.2 403.8L193 379.8L193 377.2ZM459.5 335.2L311.8 534.8L309 536.2L309.2 539L348.8 539L352 537.8L352 535.2L363 520.2L486 355.8L482.8 352L464.2 339L461.8 335.2ZM829.8 365.2L767 449.8L697.5 398.5L696.2 398.5L677 425.8L679.5 426L695.8 438L827.8 536L830.2 539L883.8 539L884 537.2L881.8 535L793.8 469.8L856 385.8L855.8 384L853.5 384ZM1219.5 372L1108 522.8L1096 537.2L1096.2 539L1136.8 539L1225.8 419.8L1225.2 417L1384.8 535L1386.2 539L1442 538.8L1441.8 536.2L1224.8 375L1221.8 374L1221 376L1219.5 375.8L1221 373.8L1221 372.2ZM1351.8 377L1335 399.8L1333.8 401L1330.2 400L1332 404L1335.5 405L1490.2 520.8L1492.8 521L1493 480.2L1489.2 478.8L1354.8 378ZM1229.5 491.5L1212.8 515.8L1210 517L1211.2 520L1213.8 520.2L1238.2 539L1291 538.8L1290.5 536Z";

// PNG canvas → quarter-turned, cropped to the ink: (x, y) → (y − 46, 1493 − x).
const TURN = "matrix(0 -1 1 0 -46 1493)";
const TILE_H = 1483;
const DRIFT = 18;
const WINDOW_X = 44;
const WINDOW_W = 437;

type InfinitePatternProps = {
  color?: string;
  opacity?: number;
  /** Extra stroke around the traced bars, in artwork units (the mockup reads as ~6). */
  bold?: number;
  className?: string;
};

export function InfinitePattern({
  color = "#E8C8BE",
  opacity = 1,
  bold = 6,
  className,
}: InfinitePatternProps) {
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const w = Math.ceil(entry.contentRect.width);
      const h = Math.ceil(entry.contentRect.height);
      setSize((s) => (s.w === w && s.h === h ? s : { w, h }));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const unitsTall = size.w ? (size.h * WINDOW_W) / size.w : 0;
  const copies = Math.ceil(unitsTall / TILE_H) + 1;

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={className}
      style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden", opacity }}
    >
      {size.w > 0 && (
        <svg
          width={size.w}
          height={size.h}
          viewBox={`${WINDOW_X} 0 ${WINDOW_W} ${unitsTall}`}
          preserveAspectRatio="xMinYMin slice"
          style={{ display: "block" }}
        >
          <defs>
            <path
              id={id}
              d={PATH}
              transform={TURN}
              fill={color}
              stroke={color}
              strokeWidth={bold * 2}
              strokeLinejoin="miter"
              strokeMiterlimit={2}
            />
          </defs>
          {Array.from({ length: copies }, (_, k) => (
            <use key={k} href={`#${id}`} x={DRIFT * k} y={TILE_H * k} />
          ))}
        </svg>
      )}
    </div>
  );
}
