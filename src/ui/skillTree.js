// Skill Tree UI - Displays character skill tree with upgrade interface
import { SKILL_TREES } from '../gameplay/skillTree.js';
import { CHARACTERS } from '../gameplay/characters.js';
import { SkillTreeManager, SkillPointManager } from '../gameplay/skillTree.js';

export class SkillTreeUI {
  constructor(skillTreeManager, characterId) {
    this.stm = skillTreeManager;
    this.characterId = characterId;
    this.character = CHARACTERS[characterId];
    this.skillPoints = 0;
    this.onClose = null;
    this.onUpgrade = null;
  }

  setSkillPoints(points) {
    this.skillPoints = points;
  }

  render(ctx, canvas, onClose, onUpgrade) {
    const cw = canvas.width;
    const ch = canvas.height;
    this.onClose = onClose;
    this.onUpgrade = onUpgrade;

    // Background panel
    ctx.fillStyle = 'rgba(10, 10, 20, 0.97)';
    ctx.fillRect(0, 0, cw, ch);

    // Header
    ctx.fillStyle = this.character.accentColor;
    ctx.font = 'bold 22px Courier New';
    ctx.textAlign = 'center';
    ctx.fillText(`${this.character.name} - 技能树`, cw / 2, 40);

    // Skill points display
    ctx.fillStyle = '#00d4ff';
    ctx.font = '14px Courier New';
    ctx.fillText(`可用技能点: ${this.skillPoints}`, cw / 2, 65);

    // Draw skill tree
    const treeX = 80;
    const treeY = 100;
    const skillW = 140;
    const skillH = 70;
    const tierGapX = 180;
    const layerGapY = 90;

    // Group skills by tier
    const tiers = [[], [], []];
    for (const skill of this.stm.getSkillsForCharacter(this.characterId)) {
      tiers[skill.tier - 1].push(skill);
    }

    // Draw tiers
    for (let t = 0; t < 3; t++) {
      const tierSkills = tiers[t];
      const tierX = treeX + t * tierGapX;

      // Tier label
      ctx.fillStyle = this.character.accentColor;
      ctx.font = '12px Courier New';
      ctx.textAlign = 'center';
      ctx.fillText(`T${t + 1}`, tierX + skillW / 2, treeY - 10);

      for (let i = 0; i < tierSkills.length; i++) {
        const skill = tierSkills[i];
        const sx = tierX;
        const sy = treeY + i * layerGapY;
        this._drawSkillNode(ctx, sx, sy, skillW, skillH, skill);
      }
    }

    // Legend
    ctx.fillStyle = '#555';
    ctx.font = '11px Courier New';
    ctx.textAlign = 'left';
    ctx.fillText('◆ 已加点  ◇ 可加点  ☆ 需前置  [点击加点]', 80, ch - 50);

    // Close button
    ctx.fillStyle = '#333';
    ctx.fillRect(cw / 2 - 60, ch - 40, 120, 30);
    ctx.fillStyle = '#888';
    ctx.font = '12px Courier New';
    ctx.textAlign = 'center';
    ctx.fillText('[ 关闭 ]', cw / 2, ch - 20);

    ctx.textAlign = 'left';
    this._handleClick(canvas);
  }

  _drawSkillNode(ctx, x, y, w, h, skill) {
    const isMaxed = skill.currentLevel >= skill.maxLevel;
    const canUpgrade = skill.canUnlock && this.skillPoints >= skill.cost && !isMaxed;

    // Node background
    ctx.fillStyle = isMaxed ? '#1a3a2a' : (canUpgrade ? '#1a2a3a' : '#1a1a2e');
    ctx.fillRect(x, y, w, h);

    // Border color
    ctx.strokeStyle = isMaxed ? '#00ff88' : (canUpgrade ? this.character.accentColor : '#333');
    ctx.lineWidth = canUpgrade ? 2 : 1;
    ctx.strokeRect(x, y, w, h);

    // Skill icon
    ctx.fillStyle = isMaxed ? '#00ff88' : (skill.currentLevel > 0 ? this.character.accentColor : '#555');
    ctx.font = 'bold 18px Courier New';
    ctx.textAlign = 'center';
    ctx.fillText(skill.icon, x + 25, y + 25);

    // Skill name
    ctx.fillStyle = isMaxed ? '#00ff88' : '#fff';
    ctx.font = 'bold 12px Courier New';
    ctx.fillText(skill.name, x + w / 2 + 10, y + 20);

    // Level
    ctx.fillStyle = '#888';
    ctx.font = '11px Courier New';
    ctx.fillText(`Lv.${skill.currentLevel}/${skill.maxLevel}`, x + w / 2 + 10, y + 38);

    // Cost
    if (!isMaxed) {
      ctx.fillStyle = canUpgrade ? '#ff6b35' : '#666';
      ctx.fillText(`消耗: ${skill.cost}点`, x + w / 2 + 10, y + 55);
    } else {
      ctx.fillStyle = '#00ff88';
      ctx.fillText('已满级', x + w / 2 + 10, y + 55);
    }

    // Description
    ctx.fillStyle = '#888';
    ctx.font = '10px Courier New';
    ctx.textAlign = 'left';
    ctx.fillText(skill.desc, x + 8, y + h + 14);
  }

  _handleClick(canvas) {
    const handler = (e) => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      const cw = canvas.width;
      const ch = canvas.height;

      // Close button
      if (mx >= cw / 2 - 60 && mx <= cw / 2 + 60 && my >= ch - 40 && my <= ch - 10) {
        canvas.removeEventListener('click', handler);
        if (this.onClose) this.onClose();
        return;
      }

      // Skill nodes
      const treeX = 80;
      const treeY = 100;
      const skillW = 140;
      const skillH = 70;
      const tierGapX = 180;
      const layerGapY = 90;

      const tiers = [[], [], []];
      for (const skill of this.stm.getSkillsForCharacter(this.characterId)) {
        tiers[skill.tier - 1].push(skill);
      }

      for (let t = 0; t < 3; t++) {
        const tierX = treeX + t * tierGapX;
        for (let i = 0; i < tiers[t].length; i++) {
          const sx = tierX;
          const sy = treeY + i * layerGapY;
          if (mx >= sx && mx <= sx + skillW && my >= sy && my <= sy + skillH) {
            const skill = tiers[t][i];
            if (skill.canUnlock && this.skillPoints >= skill.cost && skill.currentLevel < skill.maxLevel) {
              canvas.removeEventListener('click', handler);
              if (this.onUpgrade) {
                this.onUpgrade(skill.id);
              }
              return;
            }
          }
        }
      }
    };
    canvas.addEventListener('click', handler);
  }
}
