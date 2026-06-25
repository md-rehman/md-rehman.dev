"use client";

import React from "react";
import dynamic from "next/dynamic";

const DynamicP5 = dynamic(
  /* @ts-ignore */
  () => import("react-p5").then((mod) => mod.default),
  {
    ssr: false,
  },
);

export const P5Sketch = (props: any) => {
  return <DynamicP5 {...props} />;
};
