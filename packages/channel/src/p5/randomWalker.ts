import { Walker } from "./walker";

export const createRandomWalkerSketches = (walker: Walker | null) => {
  const randomWalkerSetup = (p5: any, canvasParentRef?: Element) => {
    p5.background(220, 200, 100);
    let cnv;
    if (canvasParentRef) {
      cnv = p5.createCanvas(window.innerWidth, window.innerHeight).parent(canvasParentRef);
    } else {
      cnv = p5.createCanvas(window.innerWidth, window.innerHeight);
    }
    cnv.mousePressed((event: any) => {});
  };

  const randomWalkerDraw = (p5: any) => {
    if (!walker) return;
    walker.step(p5, {
      max: { x: window.innerWidth, y: window.innerHeight },
      min: { x: 0, y: 0 },
    });
    walker.render(p5);
  };

  return { randomWalkerSetup, randomWalkerDraw };
};
