"use client";

import { useEffect, useState } from "react";
import { GREETINGS, randomOf } from "@/lib/humor";

// This page is statically generated, so picking a random line during render
// would bake in the same greeting forever. Instead render a fixed default
// on the server/first paint, then swap in a random one client-side.
export default function Greeting() {
  const [text, setText] = useState(GREETINGS[0]);

  useEffect(() => {
    setText(randomOf(GREETINGS));
  }, []);

  return <h1 className="mt-1 text-3xl font-bold text-brand-ink sm:text-4xl">{text}</h1>;
}
