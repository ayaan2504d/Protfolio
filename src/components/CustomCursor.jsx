import { useEffect, useState } from "react";

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(hover: hover) and (pointer: fine)");
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setEnabled(media.matches && !motionPreference.matches);

    update();
    media.addEventListener("change", update);
    motionPreference.addEventListener("change", update);
    return () => {
      media.removeEventListener("change", update);
      motionPreference.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return undefined;
    const cursor = document.querySelector(".custom-cursor");
    const move = (event) => {
      cursor.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
      cursor.dataset.visible = "true";
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [enabled]);

  if (!enabled) return null;

  return <span className="custom-cursor" aria-hidden="true" />;
}
