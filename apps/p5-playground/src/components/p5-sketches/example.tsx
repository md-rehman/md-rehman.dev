import { type Sketch } from "@p5-wrapper/react";
import { P5Wrapper } from "../index";

export const exampleSketch: Sketch = (p5) => {
  p5.setup = () => p5.createCanvas(600, 400, p5.WEBGL);

  p5.draw = () => {
    p5.background(0, 0, 0, 100);
    p5.normalMaterial();
    p5.push();
    p5.rotateZ(p5.frameCount * 0.01);
    p5.rotateX(p5.frameCount * 0.01);
    p5.rotateY(p5.frameCount * 0.01);
    p5.plane(100);
    p5.pop();
  };
};

const Blah = () => {
  return <P5Wrapper sketch={exampleSketch} />;
};

export default Blah;
