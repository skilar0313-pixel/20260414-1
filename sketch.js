let settlements = [];
let bgStars = [];
let meteors = [];
let spaceCats = [];
const NUM_WEEKS = 6; // 定義週數，方便後續維護

function setup() {
  // 使用視窗寬高建立畫布
  createCanvas(windowWidth, windowHeight);
  
  // 初始化背景星空（這些星星會浮在你的底圖上閃爍）
  initBackgroundStars();

  // 初始化 6 週的生態聚落位置與資料
  initSettlements();
  
  // 初始化幾隻太空貓
  initSpaceCats();
}

// 初始化背景閃爍星點的資料
function initBackgroundStars() {
  bgStars = []; // 清空陣列
  for (let i = 0; i < 200; i++) {
    bgStars.push({
      x: random(width),
      y: random(height),
      size: random(1, 3),
      opacity: random(100, 255)
    });
  }
}

// 初始化星星選單的資料，並將其平均分散
function initSettlements() {
  settlements = []; // 清空陣列
  // 定義星星排列的範圍，這裡使用畫面寬度的 10% 到 90%
  let startX = width * 0.1;
  let endX = width * 0.9;
  
  for (let i = 0; i < NUM_WEEKS; i++) {
    // 【修正：平均分散邏輯】
    // 使用 map 函數將索引值 i (0~5) 均勻映射到 startX 到 endX 的範圍內
    let xPos = map(i, 0, NUM_WEEKS - 1, startX, endX);
    
    // 如果只有一顆星星（防止 map 報錯），可以改用：
    // let xPos = (NUM_WEEKS > 1) ? map(i, 0, NUM_WEEKS - 1, startX, endX) : width / 2;

    settlements.push({
      x: xPos,
      y: height * 0.45, // 微調高度，讓它們浮在銀河上方（原本是 height/2 + sin）
      label: "第 " + (i + 1) + " 週",
      url: "week" + (i + 1) + "/index.html",
      size: 45, // 稍微放大一點點
      color: color(255, 255, 220, 200) // 淡淡奶油黃色
    });
  }
}

// 初始化太空貓的資料
function initSpaceCats() {
  spaceCats = [];
  for (let i = 0; i < 8; i++) {
    spaceCats.push({
      x: random(width),
      y: random(height),
      size: random(30, 50),
      speedX: random(-0.5, 0.5),
      speedY: random(-0.5, 0.5),
      angle: random(TWO_PI),
      rotSpeed: random(-0.01, 0.01)
    });
  }
}

// 當瀏覽器視窗大小改變時，自動調整畫布
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  // 【重要：自適應】當視窗大小改變時，重新計算星星選單的位置
  initSettlements();
  initSpaceCats();
}

function draw() {
  // 重要：清除畫布，讓底層的 CSS 背景圖顯現出來
  clear(); 
  
  // 繪製原本程式產生的閃爍星點（疊加在圖片上）
  drawBackgroundStars();
  
  // 更新與繪製流星
  updateAndDrawMeteors();

  // 更新與繪製太空貓
  updateAndDrawCats();

  // 繪製星系選單
  for (let s of settlements) {
    drawSettlement(s);
  }

  // 滑鼠游標提示
  checkHover();
}

// 繪製背景閃爍星點
function drawBackgroundStars() {
  for (let s of bgStars) {
    // 讓星星產生淡入淡出的閃爍效果，配合 x 座標產生隨機感
    let finalOpacity = s.opacity * (0.5 + 0.5 * sin(frameCount * 0.02 + s.x));
    fill(255, finalOpacity);
    noStroke();
    ellipse(s.x, s.y, s.size);
  }
}

// 流星邏輯
function updateAndDrawMeteors() {
  // 隨機產生流星 (機率性)
  if (random(1) < 0.02) {
    meteors.push({
      x: random(width),
      y: 0,
      vx: random(4, 8),
      vy: random(4, 8),
      len: random(10, 30),
      opacity: 255
    });
  }

  for (let i = meteors.length - 1; i >= 0; i--) {
    let m = meteors[i];
    m.x += m.vx;
    m.y += m.vy;
    m.opacity -= 5; // 逐漸消失

    if (m.opacity <= 0 || m.x > width || m.y > height) {
      meteors.splice(i, 1);
      continue;
    }

    stroke(255, 255, 200, m.opacity);
    strokeWeight(2);
    line(m.x, m.y, m.x - m.vx * 2, m.y - m.vy * 2);
  }
}

// 太空貓邏輯
function updateAndDrawCats() {
  for (let c of spaceCats) {
    // 移動
    c.x += c.speedX;
    c.y += c.speedY;
    c.angle += c.rotSpeed;

    // 邊界反彈
    if (c.x < 0 || c.x > width) c.speedX *= -1;
    if (c.y < 0 || c.y > height) c.speedY *= -1;

    push();
    translate(c.x, c.y);
    rotate(c.angle);
    noStroke();
    
    // 繪製貓咪頭部
    fill(200, 200, 210, 180); // 淺灰色半透明
    ellipse(0, 0, c.size, c.size * 0.8);
    
    // 繪製耳朵
    let earSize = c.size * 0.3;
    triangle(-c.size * 0.4, -c.size * 0.1, 
             -c.size * 0.2, -c.size * 0.5, 
             0, -c.size * 0.2);
    triangle(c.size * 0.4, -c.size * 0.1, 
             c.size * 0.2, -c.size * 0.5, 
             0, -c.size * 0.2);
             
    // 眼睛
    fill(255, 255, 0); // 黃色眼睛
    ellipse(-c.size * 0.15, -c.size * 0.05, c.size * 0.1);
    ellipse(c.size * 0.15, -c.size * 0.05, c.size * 0.1);
    
    // 鼻子
    fill(255, 150, 150);
    ellipse(0, 0.05, c.size * 0.08, c.size * 0.05);

    // 加上一點點太空光暈
    noFill();
    stroke(255, 50);
    strokeWeight(1);
    ellipse(0, 0, c.size * 1.2, c.size * 1.0);
    
    pop();
  }
}

// 繪製漂浮的星星形狀
function drawSettlement(s) {
  push();
  // 增加上下漂浮的動態感（幅度 15 像素）
  let floatingY = s.y + sin(frameCount * 0.03 + s.x) * 15;
  translate(s.x, floatingY); 
  
  // 星星本體
  fill(s.color);
  stroke(255, 180); // 淡淡的描邊
  strokeWeight(2);
  
  // 繪製星星（radius1=內徑, radius2=外徑）
  starShape(0, 0, s.size * 0.5, s.size, 5);
  
  // 繪製文字標籤
  fill(255);
  noStroke();
  textAlign(CENTER);
  textSize(18); // 稍微放大字體
  text(s.label, 0, s.size + 25); // 將文字放在星星下方
  pop();
}

// 繪製多角星星形狀的輔助函數
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

// 檢查滑鼠是否懸停在星星上
function checkHover() {
  let isHovering = false;
  for (let s of settlements) {
    // 記得計算漂浮後的 y 位置，否則判定會不精準
    let floatingY = s.y + sin(frameCount * 0.03 + s.x) * 15;
    let d = dist(mouseX, mouseY, s.x, floatingY);
    // 使用星星的大小作為點擊範圍判定
    if (d < s.size) {
      isHovering = true;
      break;
    }
  }
  // 切換滑鼠游標為「手型」或「箭頭」
  cursor(isHovering ? HAND : ARROW);
}

// 滑鼠點擊事件
function mousePressed() {
  for (let s of settlements) {
    // 記得計算漂浮後的 y 位置
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
        win.style.display = 'block'; // 顯示彈出視窗
      }
    }
  }
}