function setup() {
  // make canvas cover the entire browser window
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(220);

  // circle properties
  fill('pink');
  stroke('green');
  strokeWeight(4);
  const r = min(width, height) * 0.4; // make circle really big (40% of smaller dimension)
  const cx = width / 2;
  const cy = height / 2;
  circle(cx, cy, r * 2);

  // draw two very small filled rectangles inside the circle like eyes
  fill('black');
  noStroke();
  const eyeW = r * 0.15; // smaller relative to radius
  const eyeH = r * 0.2;
  const eyeOffsetX = r * 0.3;
  const eyeY = cy - r * 0.2; // move eyes up a bit
  rect(cx - eyeOffsetX - eyeW / 2, eyeY - eyeH / 2, eyeW, eyeH);
  rect(cx + eyeOffsetX - eyeW / 2, eyeY - eyeH / 2, eyeW, eyeH);

  // draw pupils that track the mouse position
  fill('white');
  noStroke();
  const pupilSize = min(eyeW, eyeH) * 0.5;
  // helper to compute constrained pupil position inside an eye box
  function pupilPos(eyeCenterX) {
    let dx = mouseX - eyeCenterX;
    let dy = mouseY - eyeY;
    // limit movement to within the eye rectangle
    let maxX = (eyeW - pupilSize) / 2;
    let maxY = (eyeH - pupilSize) / 2;
    dx = constrain(dx, -maxX, maxX);
    dy = constrain(dy, -maxY, maxY);
    return {x: eyeCenterX + dx, y: eyeY + dy};
  }
  const leftPupil = pupilPos(cx - eyeOffsetX);
  const rightPupil = pupilPos(cx + eyeOffsetX);
  circle(leftPupil.x, leftPupil.y, pupilSize);
  circle(rightPupil.x, rightPupil.y, pupilSize);

  // draw a smiling mouth as an arc inside the circle
  noFill();
  stroke('black');
  strokeWeight(3);
  const mouthRadius = r * 0.6;
  arc(cx, cy + r * 0.2, mouthRadius * 2, mouthRadius, 0, PI);
}

function windowResized() {
  // keep canvas full-window if the browser resizes
  resizeCanvas(windowWidth, windowHeight);
}
