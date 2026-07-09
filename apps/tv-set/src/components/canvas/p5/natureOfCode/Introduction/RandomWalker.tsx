import React, { useEffect, useRef, useState } from "react";
import p5Types from "p5"; //Import this for typechecking and intellisense
import { Walker } from "./walker";
import dynamic from "next/dynamic";
import { P5Sketch } from "@atoms";
import { createRandomWalkerSketches } from "./randomWalkerSketches";

interface ComponentProps {
  //Your component props
}

export const RandomWalker: React.FC<ComponentProps> = (
  props: ComponentProps,
) => {
  const [walker, setWalker] = useState<Walker | null>(null);

  useEffect(() => {
    const w = new Walker(window.innerWidth / 2, window.innerHeight / 2, 8);
    setWalker(w);
  }, []);

  if (walker === null) return null;

  const { randomWalkerSetup, randomWalkerDraw } = createRandomWalkerSketches(walker);

  const setup = (p5: any, canvasParentRef: Element) => {
    randomWalkerSetup(p5, canvasParentRef);
  };

  const draw = (p5: any) => {
    randomWalkerDraw(p5);
  };

  return <P5Sketch setup={setup} draw={draw} />;
};

// Shankar suman socity, shiv shakti chock, bakrai nagar, near garwa hotel
