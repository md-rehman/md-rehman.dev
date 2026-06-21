export const tvStaticSetup = (p5: any, canvasParentRef?: Element) => {
  if (canvasParentRef) {
    p5.createCanvas(window.innerWidth, window.innerHeight).parent(canvasParentRef);
  } else {
    p5.createCanvas(window.innerWidth, window.innerHeight);
  }
  p5.pixelDensity(0.7);
  p5.frameRate(60);
  p5.background(0);
};

export const tvStaticDraw = (p5: any) => {
  p5.loadPixels();
  for (let y = 0; y < p5.height; y++) {
    for (let x = 0; x < p5.width; x++) {
      let index = (x + y * p5.width) * 4;
      p5.pixels[index + 0] = 0;
      p5.pixels[index + 1] = 0;
      p5.pixels[index + 2] = 0;
      p5.pixels[index + 3] = p5.random([0, 50, 100, 150, 200, 255]);
    }
  }
  p5.updatePixels();
};
