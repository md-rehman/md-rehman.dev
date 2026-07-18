import React, { useEffect, useRef, useState } from "react";
import p5Types, { Vector } from "p5";
import { P5Sketch } from "@atoms";
import { VIBRANT_COLORS } from "../../../../constants/colors";

export const TRACK_ALPHA = 0.1;

class Ball {
  point?: Vector;
  pos: Vector;
  force?: Vector;
  resistance?: Vector;
  mouseForce?: Vector;
  mouse?: Vector;
  vel?: Vector;
  acc?: Vector;
  dAcc?: Vector;
  p5: p5Types;
  color: string;
  trailBuffer: p5Types.Graphics;

  constructor(p5: p5Types) {
    this.p5 = p5;
    this.pos = this.p5.createVector(this.p5.width / 2, this.p5.height / 2);
    this.color = VIBRANT_COLORS[Math.floor(Math.random() * VIBRANT_COLORS.length)] || "#ffffff";
    this.trailBuffer = p5.createGraphics(window.innerWidth, window.innerHeight);
    this.trailBuffer.clear(0, 0, 0, 0);
  }
  changeColor() {
    this.color = VIBRANT_COLORS[Math.floor(Math.random() * VIBRANT_COLORS.length)] || "#ffffff";
  }

  // STEP: Creation
  create() {
    this.force = undefined;
    this.mouseForce = undefined;
    if (this.p5.dist(this.p5.mouseX, this.p5.mouseY, this.pos.x, this.pos.y) > 20) {
      this.trailBuffer.clear(0, 0, 0, 0);
    }
  }
  stretch() {
    const mouse = this.p5.createVector(this.p5.mouseX, this.p5.mouseY);
    this.mouseForce = this.pos.copy();
    this.mouseForce.sub(mouse);
  }

  // STEP: Motion
  release() {
    if (this.mouseForce) {
      this.force = this.mouseForce.copy().mult(0.1);
      this.resistance = this.force.copy().mult(-0.01);
    }
  }
  update() {
    if (this.force && this.resistance) {
      const timeScale = (this.p5.deltaTime || 16.666) / 16.666;
      if (this.force.magSq() <= this.resistance.magSq() * timeScale) {
        this.force.set(0, 0);
        this.resistance.set(0, 0);
      } else {
        this.force.add(this.resistance.copy().mult(timeScale));
      }
      this.pos.add(this.force.copy().mult(timeScale));

      const r = 10;
      if (this.pos.x > this.p5.width - r) {
        this.pos.x = this.p5.width - r;
        this.force.x *= -1;
        this.resistance.x *= -1;
      } else if (this.pos.x < r) {
        this.pos.x = r;
        this.force.x *= -1;
        this.resistance.x *= -1;
      }

      if (this.pos.y > this.p5.height - r) {
        this.pos.y = this.p5.height - r;
        this.force.y *= -1;
        this.resistance.y *= -1;
      } else if (this.pos.y < r) {
        this.pos.y = r;
        this.force.y *= -1;
        this.resistance.y *= -1;
      }
    }
  }
  render() {
    if (this.force && this.force.magSq() > 0) {
      const c = this.p5.color(this.color);
      c.setAlpha(255 * TRACK_ALPHA);
      this.trailBuffer.noStroke();
      this.trailBuffer.fill(c);
      this.trailBuffer.circle(this.pos.x, this.pos.y, 20);
    }

    this.p5.background(17, 24, 39);
    this.p5.image(this.trailBuffer, 0, 0);

    if (this.mouseForce && !this.force) {
      this.p5.push();
      this.p5.stroke("#ef4444");
      this.p5.strokeWeight(2);
      this.p5.fill("#ef4444");
      this.p5.translate(this.pos.x, this.pos.y);
      this.p5.line(0, 0, this.mouseForce.x, this.mouseForce.y);

      const angle = this.mouseForce.heading();
      const arrowSize = 7;
      this.p5.translate(this.mouseForce.x, this.mouseForce.y);
      this.p5.rotate(angle);
      this.p5.triangle(-arrowSize, arrowSize / 2, -arrowSize, -arrowSize / 2, 0, 0);
      this.p5.pop();
    }

    this.p5.noStroke();
    this.p5.fill(this.color);
    this.p5.circle(this.pos.x, this.pos.y, 20);
  }
}

export const BallShooter: React.FC = () => {
  const ballRef = useRef<Ball | null>(null);

  const mousePressed = (p5: p5Types) => {
    if (!ballRef.current) return;
    if (p5.mouseButton === p5.RIGHT) {
      ballRef.current.changeColor();
      return;
    }
    ballRef.current.create();
  };
  const mouseDragged = (e: p5Types) => {
    if (!ballRef.current) return;
    ballRef.current.stretch();
  };
  const mouseReleased = (e: p5Types) => {
    if (!ballRef.current) return;
    ballRef.current.release();
  };

  const windowResized = (p5: p5Types) => {
    p5.resizeCanvas(window.innerWidth, window.innerHeight);
    if (ballRef.current) {
      const newBuffer = p5.createGraphics(window.innerWidth, window.innerHeight);
      newBuffer.image(ballRef.current.trailBuffer, 0, 0);
      ballRef.current.trailBuffer = newBuffer;
    }
  };

  function setup(p5: p5Types, canvasParentRef: Element): void {
    p5.createCanvas(window.innerWidth, window.innerHeight).parent(
      canvasParentRef,
    );
    p5.background(17, 24, 39);
    p5.noStroke();
    ballRef.current = new Ball(p5);
  }

  const draw = (p5: p5Types) => {
    if (!ballRef.current) return;
    ballRef.current.update();
    ballRef.current.render();
  };

  return (
    <P5Sketch
      setup={setup}
      draw={draw}
      mousePressed={mousePressed}
      mouseDragged={mouseDragged}
      mouseReleased={mouseReleased}
      windowResized={windowResized}
    />
  );
};
