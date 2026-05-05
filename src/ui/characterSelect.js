// Character Selection UI - Main menu character selection screen
import { CHARACTERS, isCharacterUnlocked, getCharacterUnlockOrder } from '../gameplay/characters.js';
import { SaveManager } from '../core/SaveManager.js';

export class CharacterSelect {
  constructor(saveManager) {
    this.saveManager = saveManager;
    this.selectedCharacter = null;
    this.characters = CHARACTERS;
    this.onSelect = null;
  }

  render(ctx, canvas, onSelect) {
    const cw = canvas.width;
    const ch = canvas.height;
    this.onSelect = onSelect;

    // Background
    ctx.fillStyle = 'rgba(10, 10, 20, 0.97)';
    ctx.fillRect(0, 0, cw, ch);

    // Title
    ctx.fillStyle = '#ff6b35';
    ctx.font = 'bold 28px Courier New';
    ctx.textAlign = 'center';
    ctx.fillText('选择角色', cw / 2, 50);

    ctx.font = '12px Courier New';
    ctx.fillStyle = '#666';
    ctx.fillText('选择你的角色开始冒险', cw / 2, 75);

    const saveProgress = this.saveManager.loadClassicProgress();
    const order = getCharacterUnlockOrder();
    const unlockedCount = order.filter(id => isCharacterUnlocked(id, saveProgress)).length;

    // Draw character cards
    let cx = 80;
    for (const charId of order) {
      const char = this.characters[charId];
      const unlocked = isCharacterUnlocked(charId, saveProgress);
      this._drawCharacterCard(ctx, cx, 110, char, unlocked, charId === 'even');
      cx += 280;
    }

    // Instructions
    ctx.fillStyle = '#555';
    ctx.font = '12px Courier New';
    ctx.fillText('[点击角色选择] | [按 ESC 返回]', cw / 2, ch - 30);

    ctx.textAlign = 'left';
    this._handleClick(canvas);
  }

  _drawCharacterCard(ctx, x, y, char, unlocked, isSelected) {
    const cardW = 240;
    const cardH = 340;

    // Card background
    ctx.fillStyle = unlocked ? char.bgColor : '#0a0a0f';
    ctx.fillRect(x, y, cardW, cardH);

    // Border
    ctx.strokeStyle = isSelected ? char.accentColor : (unlocked ? '#333' : '#222');
    ctx.lineWidth = isSelected ? 3 : 2;
    ctx.strokeRect(x, y, cardW, cardH);

    if (!unlocked) {
      // Locked overlay
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.fillRect(x, y, cardW, cardH);

      ctx.fillStyle = '#555';
      ctx.font = 'bold 48px Courier New';
      ctx.textAlign = 'center';
      ctx.fillText('🔒', x + cardW / 2, y + cardH / 2 - 20);

      ctx.font = '12px Courier New';
      ctx.fillText('未解锁', x + cardW / 2, y + cardH / 2 + 20);

      const unlock = char.id === 'ren' ? '第2章通关' : (char.id === 'rong' ? '第3章通关' : '');
      if (unlock) {
        ctx.fillStyle = '#666';
        ctx.font = '11px Courier New';
        ctx.fillText(unlock, x + cardW / 2, y + cardH / 2 + 40);
      }
      ctx.textAlign = 'left';
      return;
    }

    // Character avatar area
    ctx.fillStyle = char.accentColor;
    ctx.font = 'bold 60px Courier New';
    ctx.textAlign = 'center';
    ctx.fillText(char.name.charAt(0), x + cardW / 2, y + 80);

    // Name
    ctx.fillStyle = char.accentColor;
    ctx.font = 'bold 20px Courier New';
    ctx.fillText(char.name, x + cardW / 2, y + 115);

    // Title
    ctx.fillStyle = '#888';
    ctx.font = '12px Courier New';
    ctx.fillText(char.title, x + cardW / 2, y + 138);

    // Divider
    ctx.strokeStyle = char.accentColor;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x + 20, y + 155);
    ctx.lineTo(x + cardW - 20, y + 155);
    ctx.stroke();

    // Description
    ctx.fillStyle = '#aaa';
    ctx.font = '11px Courier New';
    ctx.textAlign = 'left';
    const lines = this._wrapText(char.desc, 18);
    let ly = y + 175;
    for (const line of lines) {
      ctx.fillText(line, x + 15, ly);
      ly += 16;
    }

    // Stats preview
    ctx.font = '11px Courier New';
    ctx.fillStyle = '#666';
    ctx.fillText('初始武器: ' + char.initialWeapon, x + 15, y + 245);
    ctx.fillText('核心机制: ' + char.coreMechanic, x + 15, y + 263);

    // Core mechanic desc
    ctx.fillStyle = char.accentColor;
    ctx.fillText(char.coreDesc, x + 15, y + 285);

    // Select indicator
    if (isSelected) {
      ctx.fillStyle = char.accentColor;
      ctx.font = '12px Courier New';
      ctx.textAlign = 'center';
      ctx.fillText('[ 已选中 ]', x + cardW / 2, y + cardH - 20);
    } else {
      ctx.fillStyle = '#444';
      ctx.font = '11px Courier New';
      ctx.textAlign = 'center';
      ctx.fillText('[ 点击选择 ]', x + cardW / 2, y + cardH - 20);
    }

    ctx.textAlign = 'left';
  }

  _wrapText(text, maxChars) {
    const words = text.split('');
    const lines = [];
    let current = '';
    for (const char of words) {
      current += char;
      if (current.length >= maxChars) {
        lines.push(current);
        current = '';
      }
    }
    if (current) lines.push(current);
    return lines;
  }

  _handleClick(canvas) {
    const handler = (e) => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      const saveProgress = this.saveManager.loadClassicProgress();
      const order = getCharacterUnlockOrder();

      let cx = 80;
      for (const charId of order) {
        if (mx >= cx && mx <= cx + 240 && my >= 110 && my <= 450) {
          if (isCharacterUnlocked(charId, saveProgress)) {
            canvas.removeEventListener('click', handler);
            if (this.onSelect) {
              this.onSelect(charId);
            }
            return;
          }
        }
        cx += 280;
      }

      // ESC to go back
      const escHandler = (ev) => {
        if (ev.key === 'Escape') {
          document.removeEventListener('keydown', escHandler);
          canvas.removeEventListener('click', handler);
        }
      };
      document.addEventListener('keydown', escHandler);
    };
    canvas.addEventListener('click', handler);
  }
}
