import React, { useEffect, useRef, useState } from "react";
import p5Types, { Vector } from "p5"; //Import this for typechecking and intellisense
import { P5Sketch } from "@atoms";
import { VIBRANT_COLORS } from "../../../../constants/colors";

class Mover {
  pos: Vector;
  vel: Vector;
  acc: Vector;
  color: string;
  constructor(p5: p5Types, x: number, y: number) {
    this.pos = p5.createVector(x, y);
    // Give initial velocity so it orbits instead of falling straight in
    this.vel = p5.createVector(0, 5);
    this.acc = p5.createVector(0, 0);
    this.color = VIBRANT_COLORS[Math.floor(Math.random() * VIBRANT_COLORS.length)] || "#ffffff";
  }
  update(p5: p5Types) {
    // Re-use `this.acc` instead of allocating new vectors every frame to reduce GC pressure
    this.acc.set(p5.mouseX - this.pos.x, p5.mouseY - this.pos.y);
    let distance = this.acc.mag();
    
    // Constrain distance so things don't get out of hand
    distance = p5.constrain(distance, 5, 25);
    
    this.acc.normalize();
    
    // Calculate gravitational strength (G * m1 * m2 / d^2)
    let G = 150;
    let strength = G / (distance * distance);
    this.acc.mult(strength);
    
    // Apply acceleration to velocity, and velocity to position
    this.vel.add(this.acc);
    this.vel.limit(10); // Prevent the planet from flying off too fast
    this.pos.add(this.vel);
  }
  renderRect(p5: p5Types, size: number) {
    p5.rect(this.pos.x, this.pos.y, size, size);
  }
  renderCircle(p5: p5Types, size: number) {
    // p5.background("rgba(17,24,39,0.1)");
    p5.background(17, 24, 39, 160);
    p5.noStroke();
    p5.fill(this.color);
    p5.circle(this.pos.x, this.pos.y, size);
  }
}

let mover: Mover;

export const MotionBasic: React.FC = () => {
  // const [mover, setMover] = useState<Mover | null>();
  const [isSSR, setIsSSR] = useState<boolean>(true);
  useEffect(() => {
    setIsSSR(false);
  }, []);
  if (isSSR) return null;

  const setup = (p5: p5Types, canvasParentRef: Element) => {
    p5.createCanvas(window.innerWidth, window.innerHeight).parent(
      canvasParentRef,
    );
    mover = new Mover(p5, p5.width / 2, p5.height / 2);
    // let temp = new Mover(p5, p5.width / 2, p5.height / 2);
    // setMover(temp);
  };

  const draw = (p5: p5Types) => {
    mover.update(p5);
    // mover.render(p5);
    // mover.renderRect(p5, 8);
    mover.renderCircle(p5, 8);
  };

  return <P5Sketch setup={setup} draw={draw} />;
};
