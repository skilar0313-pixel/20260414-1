let bubbles = [];
let anemones = []; // 用來儲存水草資料的陣列
let popSound;

function preload() {
  popSound = loadSound('pop.mp3');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // Initialize bubbles
  for (let i = 0; i < 50; i++) {
    bubbles.push(new Bubble());
  }

  // Initialize anemones with random properties
  // 在 setup 中先產生好水草的屬性，確保每株水草的樣子固定
  colorMode(HSB); 
  for(let i = 0; i < 60; i++){ // 產生 60 株水草，數量多一點製造重疊感
    anemones.push({
      x: random(width),             // 隨機 X 位置，造成互疊效果
      h: height * 0.4,              // 高度固定為螢幕的 4/10
      w: random(15, 50),            // 隨機粗細
      c: color(random(360), 80, 90, 0.6), // 隨機顏色 (HSB)，並帶有透明度
      rid: random(1000)             // 隨機的 noise 種子
    });
  }
  colorMode(RGB); // 切換回 RGB 以便繪製背景
}

function draw() {
  background(100, 180, 255); // Water blue background

  // Draw and update bubbles
  for (let b of bubbles) {
    b.move();
    b.display();
  }

  // Draw anemones from the bottom of the screen
  push();
  translate(0, height); // Move origin to bottom-left
  
  for (let a of anemones) {
    anemone(a.x, a.rid, a.c, a.h, a.w);
  }
  pop();
}

function anemone(xx, rid, clr, h, w) { 
  strokeWeight(w);
  stroke(clr);
  noFill();
  beginShape();
  curveVertex(xx, 0);
  curveVertex(xx, 0);

  // 計算滑鼠互動：當滑鼠靠近水草時產生推力，模擬撥動效果
  let xDiff = mouseX - xx;
  let mForce = 0;
  if (abs(xDiff) < 200) { // 設定感應距離為 200px
    // 距離越近推力越大，方向與滑鼠位置相反（產生排斥力）
    mForce = map(abs(xDiff), 0, 200, 100, 0) * (xDiff > 0 ? -1 : 1);
  }

  for (let i = 0; i < h; i += 10) {
    let deltaFactor = map(i, 0, 50, 0, 1, true);
    let heightFactor = i / h; // 越接近頂端，受滑鼠推力的影響越大
    let sway = (noise(i / 400, frameCount / 100, rid) - 0.5) * 200;
    // 自然擺動 (sway) + 滑鼠互動 (mForce * heightFactor)
    curveVertex(xx + (sway + mForce * heightFactor) * deltaFactor, -i);
  }
  endShape();
}

class Bubble {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.size = random(5, 15);
    this.speed = random(1, 3);
  }
  move() {
    this.y -= this.speed; // Move up
    this.x += random(-1, 1); // Slight wiggle
    if (this.y < -this.size) this.y = height + this.size; // Reset at bottom
  }
  display() {
    noStroke();
    fill(255, 150); // Semi-transparent white
    circle(this.x, this.y, this.size);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function mousePressed() {
  popSound.play();
}
