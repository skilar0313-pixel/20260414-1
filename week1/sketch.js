let shapes = [];
let song = null;
let amplitude = null;
let fileInput;
let statusP;
let points = [
  [-3, 5],
  [5, 6],
  [-5, -4],
  [4, -3],
  [0, 6]
];

function preload() {
  // 嘗試預載指定檔案，並使用 success / error 回呼來偵測問題
  const url = 'midnight-quirk-255361.mp3';
  try {
    loadSound(url,
      // success
      (s) => { song = s; },
      // whileLoading (可省略)
      undefined,
      // error
      (err) => { console.warn('loadSound 錯誤：無法載入', url, err); }
    );
  } catch (e) {
    console.warn('loadSound 例外', e);
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  amplitude = new p5.Amplitude();

  strokeWeight(2);

  for (let i = 0; i < 10; i++) {
    let s = {};
    s.x = random(0, width);
    s.y = random(0, height);
    s.dx = random(-3, 3);
    s.dy = random(-3, 3);
    s.scale = random(0.4, 4);
    // 馬卡龍色系調色盤
    const palette = ['#FFB3BA', '#FFDFBA', '#FFFFBA', '#BAFFC9', '#BAE1FF', '#E6C9FF', '#FFD1DC'];
    s.color = color(random(palette));
    // 以經典心形參數方程產生頂點，儲存在 shape.points
    let baseSize = random(3, 6); // 心形基底大小（縮小）
    s.points = [];
    for (let t = 0; t < TWO_PI; t += 0.2) {
      let x = 16 * pow(sin(t), 3);
      let y = 13 * cos(t) - 5 * cos(2 * t) - 2 * cos(3 * t) - cos(4 * t);
      s.points.push([x * baseSize, -y * baseSize]);
    }
    shapes.push(s);
  }

  // DOM: 讓使用者可以上傳本機音檔作為替代
  fileInput = createFileInput(handleFile);
  fileInput.position(10, 10);
  statusP = createP('載入預設音檔中... 如果失敗，請上傳音檔或把檔案放到專案根目錄。');
  statusP.position(10, 40);
  // 隱藏左上角的 DOM 文字與輸入，但保留上傳功能
  fileInput.hide();
  statusP.hide();

  // 如果 preload 成功取得 song，延後設定 amplitude input 並播放
  if (song) {
    amplitude.setInput(song);
    song.onended(() => { /* 可處理結束事件 */ });
    try { song.loop(); statusP.html('已載入並播放預設音檔'); } catch (e) { console.warn(e); }
  } else {
    statusP.html('預設音檔未載入（404 或其他問題），請上傳音檔以播放');
  }

  // 簡易 global error 監聽，可捕捉到靜態資源載入錯誤（包含音檔 404）
  window.addEventListener('error', (ev) => {
    const target = ev && ev.target;
    if (target && target.src && (target.src.indexOf('.mp3') >= 0 || target.src.indexOf('.wav') >= 0)) {
      console.error('資源載入錯誤（可能 404）：', target.src);
      if (statusP) statusP.html('偵測到音檔載入錯誤：' + target.src);
    }
  }, true);
}

function handleFile(file) {
  if (!file || !file.type) { statusP.html('無效檔案'); return; }
  if (file.type.indexOf('audio') === 0) {
    statusP.html('載入上傳檔案...');
    loadSound(file.data, (s) => {
      if (song && song.isPlaying()) song.stop();
      song = s;
      amplitude.setInput(song);
      song.loop();
      statusP.html('已載入並播放上傳的音檔');
    }, undefined, (err) => {
      console.error('載入上傳檔案失敗', err);
      statusP.html('載入上傳檔案失敗，請嘗試其他檔案');
    });
  } else {
    statusP.html('請上傳音訊檔案 (mp3, wav 等)');
  }
}

function draw() {
  background('#ffcdb2');

  let level = amplitude.getLevel();
  let sizeFactor = map(level, 0, 1, 0.5, 2);

  for (let shape of shapes) {
    // 位置更新
    shape.x += shape.dx;
    shape.y += shape.dy;

    // 邊緣反彈
    if (shape.x < 0 || shape.x > width) shape.dx *= -1;
    if (shape.y < 0 || shape.y > height) shape.dy *= -1;

    // 外觀
    fill(shape.color);
    stroke(shape.color);

    // 繪製
    push();
    translate(shape.x, shape.y);
    scale(shape.scale * sizeFactor);
    beginShape();
    for (let p of shape.points) {
      vertex(p[0], p[1]);
    }
    endShape(CLOSE);
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function mousePressed() {
  // 點擊切換播放/暫停，並顯示錯誤訊息如果尚未載入
  if (!song) {
    if (statusP) statusP.html('尚未載入音檔，請上傳或放入預設檔案');
    return;
  }
  if (song.isPlaying()) {
    song.pause();
  } else {
    try { song.loop(); } catch (e) { console.warn('播放時發生錯誤', e); }
  }
}
