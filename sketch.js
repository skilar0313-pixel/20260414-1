let settlements = [];
let bgStars = [];

function setup() {
  createCanvas(windowWidth, windowHeight); // 修改為視窗寬高
  
  // 初始化背景星空
  for (let i = 0; i < 200; i++) {
    bgStars.push({
      x: random(width),
      y: random(height),
      size: random(1, 3),
      opacity: random(100, 255)
    });
  }

  // 初始化 6 週的生態聚落位置與資料
  for (let i = 0; i < 6; i++) {
    settlements.push({
      x: (width / 7) * (i + 1),
      y: height / 2 + sin(i) * 50,
      label: "第 " + (i + 1) + " 週",
      url: "week" + (i + 1) + "/index.html", // 假設您的檔案路徑規則
      size: 40,
      color: color(255, 255, 200, 200)
    });
  }
}

function windowResized() {
  // 當瀏覽器視窗大小改變時，自動調整畫布
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  // 深邃星空漸層背景
  drawSpaceBackground();
  
  // 繪製閃爍背景星
  drawBackgroundStars();
  
  // 繪製生態聚落（作業選單）
  for (let s of settlements) {
    drawSettlement(s);
  }

  // 滑鼠游標提示
  checkHover();
}

function drawSpaceBackground() {
  for (let y = 0; y < height; y++) {
    let inter = map(y, 0, height, 0, 1);
    let c = lerpColor(color(5, 5, 15), color(20, 10, 40), inter);
    stroke(c);
    line(0, y, width, y);
  }
}

function drawBackgroundStars() {
  for (let s of bgStars) {
    fill(255, s.opacity * (0.5 + 0.5 * sin(frameCount * 0.02 + s.x)));
    noStroke();
    ellipse(s.x, s.y, s.size);
  }
}

function drawSettlement(s) {
  push();
  translate(s.x, s.y + sin(frameCount * 0.03 + s.x) * 15); // 微幅漂浮感
  fill(s.color);
  stroke(255, 200);
  strokeWeight(2);
  
  // 繪製星星形狀
  starShape(0, 0, s.size * 0.5, s.size, 5);
  
  fill(255);
  noStroke();
  textAlign(CENTER);
  text(s.label, 0, s.size + 15);
  pop();
}

function starShape(x, y, radius1, radius2, npoints) {
  let angle = TWO_PI / npoints;
  let halfAngle = angle / 2.0;
  beginShape();
  for (let a = -HALF_PI; a < TWO_PI - HALF_PI; a += angle) {
    let sx = x + cos(a) * radius2;
    let sy = y + sin(a) * radius2;
    vertex(sx, sy);
    sx = x + cos(a + halfAngle) * radius1;
    sy = y + sin(a + halfAngle) * radius1;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}

function checkHover() {
  let isHovering = false;
  for (let s of settlements) {
    let floatingY = s.y + sin(frameCount * 0.03 + s.x) * 15;
    let d = dist(mouseX, mouseY, s.x, floatingY);
    if (d < s.size) {
      isHovering = true;
      break;
    }
  }
  // 切換滑鼠游標樣式
  if (isHovering) cursor(HAND);
  else cursor(ARROW);
}

function mousePressed() {
  for (let s of settlements) {
    let floatingY = s.y + sin(frameCount * 0.03 + s.x) * 15;
    let d = dist(mouseX, mouseY, s.x, floatingY);
    if (d < s.size) {
      // 尋找視窗容器與 iframe 並更新內容與顯示
      let win = document.getElementById('window-container');
      let iframe = document.getElementById('display-frame');
      let title = document.getElementById('window-title');
      if (win && iframe) {
        iframe.src = s.url;
        if (title) title.innerText = "正在觀測：" + s.label + " 星系";
        win.style.display = 'block';
      }
    }
  }
}
