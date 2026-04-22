export class Camera {
  constructor(width, height) {
    this.x = 0;
    this.y = 0;
    this.width = width;
    this.height = height;
    this.smoothing = 0.08;
    this.targetX = 0;
    this.targetY = 0;
  }

  follow(targetX, targetY) {
    this.targetX = targetX - this.width / 2;
    this.targetY = targetY - this.height / 2;

    this.x += (this.targetX - this.x) * this.smoothing;
    this.y += (this.targetY - this.y) * this.smoothing;

    // Clamp to level bounds (will be updated by level)
    // For now, no clamping
  }

  setBounds(minX, maxX, minY, maxY) {
    this.minX = minX;
    this.maxX = maxX;
    this.maxY = maxY;
    this.minY = minY;
  }
}
