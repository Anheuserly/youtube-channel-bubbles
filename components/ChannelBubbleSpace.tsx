"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Channel = {
  name: string;
  handle: string;
};

type Bubble = Channel & {
  id: number;
  x: number;
  y: number;
  size: number;
  vx: number;
  vy: number;
};

const CHANNELS: Channel[] = [
  { name: "Anil Saini Business Coach", handle: "anilsainibusinesscoach" },
  { name: "Anil Saini Fire Academy", handle: "AnilSainiFireAcademy" },
  { name: "Pure Veg Satvik Rasoi", handle: "purevegsatvikrasoi06" },
  { name: "Dark Queen Edits", handle: "darkqueen_edits" },
  { name: "Jivika", handle: "jivika-f2o" },
  { name: "Kitchen With Shabnam", handle: "kitchenwithshabnam1" },
  { name: "Poonam's Attire", handle: "PoonamsAttire06" },
  { name: "Ikram Khan", handle: "ikram.khan862" },
  { name: "Shani Nirala Vlogs", handle: "ShaniNiralaVlogs" },
  { name: "Upasana's Home Flame", handle: "UpasanasHomeFlame" },
  { name: "Morena SAMP", handle: "MorenaSAMP" },
  { name: "Antony", handle: "Antony_1802" },
  { name: "FARHAT Ki DUNIA", handle: "FARHATKiDUNIA9505" },
  { name: "its Rabi Noma", handle: "itsRabiNoma" },
  {
    name: "Dhananjay Explains Official",
    handle: "DhananjayExplainsOfficial",
  },
  { name: "Aprel Records", handle: "AprelRecords" },
  { name: "jellytimi", handle: "jellytimi7264" },
];

function getAvatarUrl(handle: string) {
  return `https://unavatar.io/youtube/${encodeURIComponent(handle)}`;
}

function getInitials(name: string) {
  const words = name
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  return `${words[0]?.[0] ?? "Y"}${words[1]?.[0] ?? ""}`.toUpperCase();
}

function createBubbles(): Bubble[] {
  if (typeof window === "undefined") return [];

  const width = window.innerWidth;
  const height = window.innerHeight;

  return CHANNELS.map((channel, index) => {
    const size =
      index === 0
        ? 112 + Math.random() * 12
        : 72 + Math.random() * 23;

    const angle =
      (index / CHANNELS.length) * Math.PI * 2 +
      (Math.random() - 0.5) * 0.35;

    const radiusX = Math.max(100, width * (0.24 + Math.random() * 0.17));
    const radiusY = Math.max(90, height * (0.22 + Math.random() * 0.18));

    const x = Math.max(
      12,
      Math.min(
        width - size - 12,
        width / 2 + Math.cos(angle) * radiusX - size / 2
      )
    );

    const y = Math.max(
      12,
      Math.min(
        height - size - 12,
        height / 2 + Math.sin(angle) * radiusY - size / 2
      )
    );

    return {
      ...channel,
      id: index,
      x,
      y,
      size,
      vx: (Math.random() - 0.5) * 0.06,
      vy: (Math.random() - 0.5) * 0.06,
    };
  });
}

export default function ChannelBubbleSpace() {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [ready, setReady] = useState(false);
  const [explodingId, setExplodingId] = useState<number | null>(null);

  const animationRef = useRef<number | null>(null);

  const draggingRef = useRef<{
    id: number;
    pointerId: number;
    offsetX: number;
    offsetY: number;
    startX: number;
    startY: number;
    moved: boolean;
  } | null>(null);

  useEffect(() => {
    setBubbles(createBubbles());
    setReady(true);
  }, []);

  const keepInside = useCallback((bubble: Bubble) => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    return {
      ...bubble,
      x: Math.max(8, Math.min(width - bubble.size - 8, bubble.x)),
      y: Math.max(8, Math.min(height - bubble.size - 8, bubble.y)),
    };
  }, []);

  useEffect(() => {
    if (!ready) return;

    let previous = performance.now();

    const animate = (time: number) => {
      const delta = Math.min(time - previous, 32);
      previous = time;

      setBubbles((current) =>
        current.map((bubble) => {
          if (draggingRef.current?.id === bubble.id) {
            return bubble;
          }

          const next = {
            ...bubble,
            x: bubble.x + bubble.vx * delta,
            y: bubble.y + bubble.vy * delta,
          };

          if (
            next.x <= 8 ||
            next.x >= window.innerWidth - next.size - 8
          ) {
            next.vx *= -1;
          }

          if (
            next.y <= 8 ||
            next.y >= window.innerHeight - next.size - 8
          ) {
            next.vy *= -1;
          }

          return keepInside(next);
        })
      );

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [ready, keepInside]);

  useEffect(() => {
    const handleResize = () => {
      setBubbles((current) => current.map(keepInside));
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [keepInside]);

  const handlePointerDown = (
    event: React.PointerEvent<HTMLDivElement>,
    bubble: Bubble
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();

    draggingRef.current = {
      id: bubble.id,
      pointerId: event.pointerId,
      offsetX: event.clientX - rect.left,
      offsetY: event.clientY - rect.top,
      startX: event.clientX,
      startY: event.clientY,
      moved: false,
    };

    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (
    event: React.PointerEvent<HTMLDivElement>
  ) => {
    const drag = draggingRef.current;

    if (!drag || drag.pointerId !== event.pointerId) return;

    const distance = Math.hypot(
      event.clientX - drag.startX,
      event.clientY - drag.startY
    );

    if (distance > 7) {
      drag.moved = true;
    }

    setBubbles((current) =>
      current.map((bubble) => {
        if (bubble.id !== drag.id) return bubble;

        return keepInside({
          ...bubble,
          x: event.clientX - drag.offsetX,
          y: event.clientY - drag.offsetY,
        });
      })
    );
  };

  const handlePointerUp = (
    event: React.PointerEvent<HTMLDivElement>,
    bubble: Bubble
  ) => {
    const drag = draggingRef.current;

    if (!drag || drag.pointerId !== event.pointerId) return;

    draggingRef.current = null;

    if (drag.moved) return;

    setExplodingId(bubble.id);

    window.setTimeout(() => {
      window.open(
        `https://www.youtube.com/@${bubble.handle}`,
        "_blank",
        "noopener,noreferrer"
      );
    }, 220);

    window.setTimeout(() => {
      setExplodingId(null);
    }, 650);
  };

  return (
    <main className="bubble-space">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <div className="ambient ambient-three" />

      <div className="stars" />

      <div className="bubble-world">
        {bubbles.map((bubble) => (
          <div
            key={bubble.id}
            className={`channel-bubble ${
              explodingId === bubble.id ? "is-exploding" : ""
            } ${bubble.id === 0 ? "is-featured" : ""}`}
            style={{
              width: bubble.size,
              height: bubble.size,
              transform: `translate3d(${bubble.x}px, ${bubble.y}px, 0)`,
            }}
            onPointerDown={(event) =>
              handlePointerDown(event, bubble)
            }
            onPointerMove={handlePointerMove}
            onPointerUp={(event) =>
              handlePointerUp(event, bubble)
            }
            onPointerCancel={() => {
              draggingRef.current = null;
            }}
            title={bubble.name}
          >
            <div className="bubble-shell">
              <img
                className="channel-avatar"
                src={getAvatarUrl(bubble.handle)}
                alt=""
                draggable={false}
                onError={(event) => {
                  const target = event.currentTarget;

                  if (target.dataset.fallback === "true") return;

                  target.dataset.fallback = "true";

                  const svg = `
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
                      <defs>
                        <linearGradient id="bubbleGradient" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stop-color="#34405d"/>
                          <stop offset="100%" stop-color="#0c101b"/>
                        </linearGradient>
                      </defs>
                      <circle cx="100" cy="100" r="100" fill="url(#bubbleGradient)"/>
                      <text
                        x="100"
                        y="116"
                        text-anchor="middle"
                        font-family="Arial,sans-serif"
                        font-size="58"
                        font-weight="700"
                        fill="white"
                      >
                        ${getInitials(bubble.name)}
                      </text>
                    </svg>
                  `;

                  target.src =
                    "data:image/svg+xml;charset=utf-8," +
                    encodeURIComponent(svg);
                }}
              />

              <span className="bubble-highlight" />
              <span className="bubble-reflection" />
            </div>

            <span className="channel-label">{bubble.name}</span>
          </div>
        ))}
      </div>

      <div className="space-mark">CHANNEL SPACE</div>
    </main>
  );
}