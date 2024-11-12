// components/P5Wrapper.tsx
import { useEffect, useRef, useState } from "react";
import { type Sketch } from "@p5-wrapper/react";
import { NextReactP5Wrapper } from "@p5-wrapper/next";

interface P5WrapperProps {
  sketch: (p: Sketch) => void;
}

export const P5Wrapper = NextReactP5Wrapper;
