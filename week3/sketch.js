function setup() {
	createCanvas(windowWidth, windowHeight);
	background('pink');
}

function draw() {
	
	colorMode(HSB); //色相:0-360，飽和度0-100，亮度 0-100
	// 畫滿整個螢幕的許多圓，顏色每幀隨機改變
	var spacing = 60; // 圓圈間距
	for (var x = spacing/2; x < width; x += spacing) {
		for (var y = spacing/2; y < height; y += spacing) {
			var h = random(360);
			var s = random(100);
			var b = random(100);
			fill(h, s, b);
			ellipse(x, y, spacing * 0.8, spacing * 0.8);
		}
	}
}
