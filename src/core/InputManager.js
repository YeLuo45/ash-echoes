export class InputManager {
  constructor() {
    this.keys = {};
    this.justPressed = {};
    this.previousKeys = {};
  }

  keydown(e) {
    const key = e.key.toLowerCase();
    if (!this.keys[key]) {
      this.justPressed[key] = true;
    }
    this.keys[key] = true;

    // Prevent scrolling
    if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' ', 'j', 'k'].includes(key)) {
      e.preventDefault();
    }
  }

  keyup(e) {
    const key = e.key.toLowerCase();
    this.keys[key] = false;
  }

  update() {
    this.justPressed = {};
    for (const key in this.keys) {
      if (this.keys[key]) {
        this.justPressed[key] = !this.previousKeys[key];
      }
    }
    this.previousKeys = { ...this.keys };
  }

  isDown(key) {
    return this.keys[key.toLowerCase()] || false;
  }

  isJustPressed(key) {
    return this.justPressed[key.toLowerCase()] || false;
  }

  isLeft() {
    return this.isDown('a') || this.isDown('arrowleft');
  }

  isRight() {
    return this.isDown('d') || this.isDown('arrowright');
  }

  isUp() {
    return this.isDown('w') || this.isDown('arrowup');
  }

  isDownKey() {
    return this.isDown('s') || this.isDown('arrowdown');
  }

  isDash() {
    return this.isJustPressed(' ');
  }

  isShoot() {
    return this.isDown('j');
  }

  isSkill() {
    return this.isJustPressed('k');
  }
}
