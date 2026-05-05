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

    // Row 1: Chapters 1-3
    this._drawChapter(ctx, 100, 110, this.chapters[0], () => onSelect(1));
    this._drawChapter(ctx, 340, 110, this.chapters[1], () => onSelect(2));
    this._drawChapter(ctx, 580, 110, this.chapters[2], () => onSelect(3));

    // Row 2: Chapters 4-6
    this._drawChapter(ctx, 100, 310, this.chapters[3], () => onSelect(4));
    this._drawChapter(ctx, 340, 310, this.chapters[4], () => onSelect(5));
    this._drawChapter(ctx, 580, 310, this.chapters[5], () => onSelect(6));

    // Back button
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(340, 510, 280, 50);
    ctx.strokeStyle = '#555';
    ctx.lineWidth = 1;
    ctx.strokeRect(340, 510, 280, 50);
    ctx.fillStyle = '#888';
    ctx.font = '13px Courier New';
    ctx.textAlign = 'center';
    ctx.fillText('[ 返 回 ]', cw / 2, 537);

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
