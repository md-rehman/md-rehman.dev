"use client";

import { TvSetNavigator } from "../components";
import { channels } from "@constants";

export default function Home() {
  return <TvSetNavigator config={channels} />;
}
