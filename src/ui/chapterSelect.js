import { SaveManager } from '../core/SaveManager.js';
import { ALL_CHAPTERS } from '../story/chapters.js';

export class ChapterSelect {
  constructor(saveManager) {
    this.saveManager = saveManager;
    this.chapters = ALL_CHAPTERS;
  }

  render(ctx, onSelect) {
    const canvas = ctx.canvas;
    const cw = canvas.width;
    const ch = canvas.height;

    ctx.fillStyle = 'rgba(10, 10, 20, 0.95)';
    ctx.fillRect(0, 0, cw, ch);

    // Title
    ctx.fillStyle = '#ff6b35';
    ctx.font = 'bold 28px Courier New';
    ctx.textAlign = 'center';
    ctx.fillText('选择章节', cw / 2, 60);

    ctx.textAlign = 'left';
    ctx.font = '13px Courier New';

    // Chapter 1
    this._drawChapter(ctx, 100, 120, this.chapters[0], () => onSelect(1));
    // Chapter 2
    this._drawChapter(ctx, 340, 120, this.chapters[1], () => onSelect(2));
    // Chapter 3
    this._drawChapter(ctx, 580, 120, this.chapters[2], () => onSelect(3));

    // Roguelite mode button
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(340, 320, 280, 80);
    ctx.strokeStyle = '#9b59b6';
    ctx.lineWidth = 2;
    ctx.strokeRect(340, 320, 280, 80);
    ctx.fillStyle = '#9b59b6';
    ctx.font = 'bold 16px Courier New';
    ctx.textAlign = 'center';
    ctx.fillText('Roguelite冒险', cw / 2, 355);
    ctx.font = '12px Courier New';
    ctx.fillStyle = '#888';
    ctx.fillText('无限关卡 + 永久解锁', cw / 2, 375);
    ctx.fillText('每日挑战', cw / 2, 392);

    // Click handlers
    this._handleClick(cw, ch, onSelect);

    ctx.textAlign = 'left';
  }

  _drawChapter(ctx, x, y, chapter, onClick) {
    const progress = this.saveManager.loadClassicProgress();
    const chapterProgress = progress?.chapters?.[chapter.id];
    const unlocked = !chapterProgress || chapter.id === 1;

    ctx.fillStyle = unlocked ? '#1a1a2e' : '#0a0a0f';
    ctx.fillRect(x, y, 200, 160);
    ctx.strokeStyle = unlocked ? chapter.accentColor : '#333';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, 200, 160);

    ctx.fillStyle = unlocked ? chapter.accentColor : '#555';
    ctx.font = 'bold 14px Courier New';
    ctx.fillText(`第${chapter.id}章`, x + 15, y + 25);
    ctx.font = '18px Courier New';
    ctx.fillText(chapter.name, x + 15, y + 50);

    ctx.font = '11px Courier New';
    ctx.fillStyle = '#888';
    ctx.fillText(`主题: ${chapter.theme}`, x + 15, y + 75);
    ctx.fillText(`关卡: ${chapter.levels?.length || 0}`, x + 15, y + 92);

    if (chapterProgress) {
      const levelsDone = chapterProgress.lastLevel || 0;
      ctx.fillStyle = '#ff9f1c';
      ctx.fillText(`进度: ${levelsDone}/${chapter.levels?.length || 0}`, x + 15, y + 110);
    } else if (unlocked) {
      ctx.fillStyle = '#00d4ff';
      ctx.fillText('未挑战', x + 15, y + 110);
    } else {
      ctx.fillStyle = '#666';
      ctx.fillText('未解锁', x + 15, y + 110);
    }

    // Level count
    ctx.fillStyle = '#666';
    ctx.fillText(`[点击进入]`, x + 60, y + 140);
  }

  _handleClick(cw, ch, onSelect) {
    // Note: actual click handling done in game via button elements
  }
}
