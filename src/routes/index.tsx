import { createFileRoute } from "@tanstack/react-router";
import { EarthPhysicsArena } from "@/components/EarthPhysicsArena";

export const Route = createFileRoute("/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Field Lab Command — Unit 6 Earth Physics" },
      { name: "description", content: "A full-screen two-team Earth Physics simulation for sound, seismic layers, tectonics, and eclipses." },
      { property: "og:title", content: "Field Lab Command — Unit 6 Earth Physics" },
      { property: "og:description", content: "Explore five animated Earth Physics challenges in a live classroom lab." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: EarthPhysicsArena,
});
