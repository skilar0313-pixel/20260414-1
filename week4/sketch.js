let inputElement, sliderElement, btnElement, btnRotate, colorPicker, selectElement, iframeEl, randomValue = 0, rotationMode = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  inputElement = createInput('Hello');
  inputElement.position(10, 10);
  inputElement.size(180, 20);
  sliderElement = createSlider(10, 50, 20, 0.01);
  sliderElement.position(200, 10);
  btnElement = createButton("瘋狂");
  btnElement.position(380, 10);
  btnElement.mousePressed(goCrazy);
  btnElement.style("border-color", 'green');
  btnElement.style("border-width", '10px');
  btnElement.style("color", 'green');
  btnElement.style("font-size", '18px');
  btnRotate = createButton("旋轉");
  btnRotate.position(470, 10);
  btnRotate.mousePressed(toggleRotation);
  colorPicker = createColorPicker('#ed225d');
  colorPicker.position(560, 10);

  selectElement = createSelect();
  selectElement.position(640, 10);
  selectElement.option('請選擇網站', '');
  selectElement.option('淡江教育科技官網', '淡江教育科技官網');
  selectElement.option('淡江大學官網', '淡江大學官網');
  selectElement.changed(openLink);

  iframeEl = createElement('iframe');
  iframeEl.style('border', 'none');
  iframeEl.style('display', 'none');
  updateIframeDimensions(); // 調整 iframe 大小與位置
}

function draw() {
  background(220);

  // 上方黑色標題欄
  noStroke();
  fill(0);
  rect(0, 0, width, 30);
  fill(255);
  textSize(18);
  textAlign(CENTER, CENTER);
  text('414730092許詠鈐', width / 2, 15);

  const originalTxts = inputElement.value();
  const txts = toFancyText(originalTxts);
  textSize(sliderElement.value());
  fill(colorPicker.value());

  // 讓文字充滿整個畫布（從 UI 下面開始），橫向與縱向都重複排列
  let tw = textWidth(txts);
  if (tw > 0) {
    let topOffset = 40; // UI 區域高度（按鈕在最上方一排）
    let lineHeight = textSize() + 10;
    for (let y = topOffset; y < height; y += lineHeight) {
      for (let x = 0; x < width; x += tw + 10) {
        push();
        translate(x + random(-randomValue, randomValue), y + random(-randomValue, randomValue));
        if (rotationMode) {
          rotate(frameCount * 0.01);
        }
        text(txts, 0, 0);
        pop();
      }
    }
  }
}

function goCrazy() {
  if (randomValue > 0) {
    randomValue = 0;
  } else {
    randomValue = 10;
  }
}

function toggleRotation() {
  rotationMode = !rotationMode;
}

function toFancyText(str) {
  const mapping = {
    'a': '𝗮', 'b': '𝗯', 'c': '𝗰', 'd': '𝗱', 'e': '𝗲', 'f': '𝗳', 'g': '𝗴', 'h': '𝗵', 'i': '𝗶', 'j': '𝗷', 'k': '𝗸', 'l': '𝗹', 'm': '𝗺', 'n': '𝗻', 'o': '𝗼', 'p': '𝗽', 'q': '𝗾', 'r': '𝗿', 's': '𝘀', 't': '𝘁', 'u': '𝘂', 'v': '𝘃', 'w': '𝘄', 'x': '𝘅', 'y': '𝘆', 'z': '𝘇',
    'A': '𝗔', 'B': '𝗕', 'C': '𝗖', 'D': '𝗗', 'E': '𝗘', 'F': '𝗙', 'G': '𝗚', 'H': '𝗛', 'I': '𝗜', 'J': '𝗝', 'K': '𝗞', 'L': '𝗟', 'M': '𝗠', 'N': '𝗡', 'O': '𝗢', 'P': '𝗣', 'Q': '𝗤', 'R': '𝗥', 'S': '𝗦', 'T': '𝗧', 'U': '𝗨', 'V': '𝗩', 'W': '𝗪', 'X': '𝗫', 'Y': '𝗬', 'Z': '𝗭',
    '0': '𝟬', '1': '𝟭', '2': '𝟮', '3': '𝟯', '4': '𝟰', '5': '𝟱', '6': '𝟲', '7': '𝟳', '8': '𝟴', '9': '𝟵'
  };
  // 使用正規表示式來一次性替換所有匹配的字元
  return str.replace(/[A-Za-z0-9]/g, char => mapping[char] || char);
}

function openLink() {
  const label = selectElement.value();
  const urlMap = {
    '淡江教育科技官網': 'https://www.et.tku.edu.tw/',
    '淡江大學官網': 'https://www.tku.edu.tw/'
  };
  const url = urlMap[label];
  if (url) {
    iframeEl.attribute('src', url);
    iframeEl.style('display', 'block');
  } else {
    iframeEl.style('display', 'none');
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  updateIframeDimensions();
}

function updateIframeDimensions() {
  const topOffset = 40; // UI 介面高度
  const iframeW = windowWidth * 0.8; // 寬度為視窗的 80%
  const availableHeight = windowHeight - topOffset;
  const iframeH = availableHeight * 0.8; // 高度為可用區域的 80%
  const iframeX = (windowWidth - iframeW) / 2; // 水平置中
  const iframeY = topOffset + (availableHeight - iframeH) / 2; // 垂直置中
  iframeEl.position(iframeX, iframeY);
  iframeEl.size(iframeW, iframeH);
}
