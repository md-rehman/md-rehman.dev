let lastFrame = -1;
let logY = 0;

export const canvas = {
  log: (p5: any, ...args: any[]) => {
    if (!p5) return;
    
    if (p5.frameCount !== lastFrame) {
      lastFrame = p5.frameCount;
      logY = 0;
    }
    
    const text = args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ');
    
    p5.push();
    p5.resetMatrix(); // Reset any transformations like translate() or rotate()
    
    p5.textSize(16);
    p5.textAlign(p5.LEFT, p5.BOTTOM);
    
    // Optional background for readability
    const textW = p5.textWidth(text);
    p5.noStroke();
    p5.fill(0, 0, 0, 150);
    p5.rect(10, p5.height - 10 - logY - 20, textW + 10, 24, 4);

    // Text itself
    p5.fill(0, 255, 0); // Hacker green
    p5.text(text, 15, p5.height - 10 - logY - 4);
    
    logY += 26; // Stack upwards
    p5.pop();
  }
};
