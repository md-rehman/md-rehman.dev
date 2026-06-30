"use client";

import React, { useRef, useEffect } from "react";
import { P5Sketch } from "@atoms";
import { canvas } from "../utils";

interface ComponentProps { }

const STAR_COLORS = [
  { color: "#ffffff", probability: 0.8 },  // White (80%)
  { color: "#ffe9c4", probability: 0.05 }, // Warm white (5%)
  { color: "#d4fbff", probability: 0.05 }, // Pale blue (5%)
  { color: "#ffb56b", probability: 0.05 }, // Orange/amber (5%)
  { color: "#8c9cff", probability: 0.05 }  // Blue/purple (5%)
] as const;

function getRandomColor(p5: any): string {
  const rand = p5.random();
  let cumulative = 0;
  for (const starColor of STAR_COLORS) {
    cumulative += starColor.probability;
    if (rand <= cumulative) {
      return starColor.color;
    }
  }
  return STAR_COLORS[0].color;
}

class Star {
  x: number;
  y: number;
  z: number;
  pz: number;
  color: string;

  constructor(p5: any) {
    this.x = p5.random(-p5.width, p5.width);
    this.y = p5.random(-p5.height, p5.height);
    this.z = p5.random(p5.width);
    this.pz = this.z;
    this.color = getRandomColor(p5);
  }

  update(p5: any, speed: number) {
    this.z = this.z - speed;
    if (this.z < 1) {
      this.z = p5.width;
      this.x = p5.random(-p5.width, p5.width);
      this.y = p5.random(-p5.height, p5.height);
      this.pz = this.z;
    }
  }

  show(p5: any) {
    p5.fill(this.color);
    p5.noStroke();

    let sx = p5.map(this.x / this.z, 0, 1, 0, p5.width);
    let sy = p5.map(this.y / this.z, 0, 1, 0, p5.height);
    let r = p5.map(this.z, 0, p5.width, 8, 0);
    p5.ellipse(sx, sy, r, r);

    let px = p5.map(this.x / this.pz, 0, 1, 0, p5.width);
    let py = p5.map(this.y / this.pz, 0, 1, 0, p5.height);
    p5.stroke(this.color);
    p5.line(px, py, sx, sy);
    this.pz = this.z;
  }
}

export const Hyperdrive: React.FC<ComponentProps> = () => {
  const starsRef = useRef<Star[]>([]);

  const setup = (p5: any, canvasParentRef: Element) => {
    p5.createCanvas(window.innerWidth, window.innerHeight).parent(
      canvasParentRef
    );
    starsRef.current = [];
    for (let i = 0; i < 800; i++) {
      starsRef.current.push(new Star(p5));
    }
  };

  const draw = (p5: any) => {
    let speed = 20;
    if (p5.mouseX > 0 || p5.mouseY > 0) {
      speed = p5.map(p5.mouseX, 0, p5.width, 5, 50);
    }

    p5.background(0);
    p5.translate(p5.width / 2, p5.height / 2);

    for (const star of starsRef.current) {
      star.update(p5, speed);
      star.show(p5);
    }

    // Demonstrate canvas.log
    canvas.log(p5, "Current Speed:", speed.toFixed(2));
    canvas.log(p5, "Stars Count:", starsRef.current.length);
  };

  return <P5Sketch setup={setup} draw={draw} />;
};
