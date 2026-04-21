let capture;
let pg; // 宣告繪圖緩衝區
let bubbles = []; // 存放泡泡的陣列
let saveBtn; // 儲存按鈕

function setup() {
  // 建立全螢幕畫布
  createCanvas(windowWidth, windowHeight);
  
  // 取得攝影機影像
  capture = createCapture(VIDEO);
  
  // 隱藏預設出現在畫布下方的 HTML5 影片元件，只在畫布內繪製
  capture.hide();

  // 建立一個繪圖緩衝區，大小設定為畫布寬高的 60%
  pg = createGraphics(windowWidth * 0.6, windowHeight * 0.6);

  // 初始化泡泡
  for (let i = 0; i < 20; i++) {
    bubbles.push(new Bubble());
  }

  // 建立儲存按鈕
  saveBtn = createButton('儲存影像');
  saveBtn.mousePressed(saveImage);
  updateButtonPosition();
}

function draw() {
  // 設定背景顏色為 e7c6ff
  background('#e7c6ff');
  
  // 計算影像寬高 (全螢幕的 60%)
  let videoW = width * 0.6;
  let videoH = height * 0.6;
  
  // 計算置中座標
  let x = (width - videoW) / 2;
  let y = (height - videoH) / 2;
  
  // 更新 createGraphics 緩衝區的內容
  pg.push();
  pg.clear(); // 清除上一幀內容，保持緩衝區乾淨（或透明）
  pg.translate(pg.width, 0);
  pg.scale(-1, 1); // 同樣實作鏡像翻轉，確保內容一致
  pg.image(capture, 0, 0, pg.width, pg.height);
  pg.pop();

  // 修正左右顛倒問題（實作水平翻轉鏡像）
  push(); 
  // 將原點移動到影像預定位置的右邊緣
  translate(x + videoW, y);
  // 水平翻轉座標軸：-1 代表 X 軸方向反轉
  scale(-1, 1);
  // 由於座標軸已翻轉，從 (0, 0) 開始繪製即可顯示在正確位置
  image(capture, 0, 0, videoW, videoH);
  pop();

  // 將 pg 緩衝區的內容顯示在「視訊畫面的上方」
  // 這裡將 Y 座標稍微往上移（減去位移量），並縮小顯示以做出層次感
  image(pg, x + videoW * 0.1, y - 60, videoW * 0.8, videoH * 0.8);

  // 繪製與更新泡泡
  for (let b of bubbles) {
    b.move();
    b.display();
  }
}

// 當視窗大小改變時，自動調整畫布大小以維持全螢幕
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  // 同步調整緩衝區的大小
  pg.resizeCanvas(windowWidth * 0.6, windowHeight * 0.6);
  updateButtonPosition();
}

// 更新按鈕位置，使其顯示在視訊畫面的右下方
function updateButtonPosition() {
  let videoW = width * 0.6;
  let videoH = height * 0.6;
  let x = (width - videoW) / 2;
  let y = (height - videoH) / 2;
  // 將按鈕放在視訊右下角偏移一點的位置
  saveBtn.position(x + videoW - 80, y + videoH + 20);
}

// 執行存檔
function saveImage() {
  saveCanvas('my_capture', 'png');
}

// 泡泡類別
class Bubble {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = random(width);
    this.y = height + random(100, 500);
    this.size = random(10, 40);
    this.speed = random(1, 3);
  }

  move() {
    this.y -= this.speed;
    this.x += sin(frameCount * 0.05 + this.size) * 0.5; // 輕微左右晃動
    if (this.y < -this.size) this.reset(); // 飄出螢幕後重置
  }

  display() {
    noStroke();
    fill(255, 255, 255, 150); // 半透明白色
    circle(this.x, this.y, this.size);
    fill(255, 255, 255, 200);
    circle(this.x - this.size * 0.2, this.y - this.size * 0.2, this.size * 0.3); // 光澤感
  }
}