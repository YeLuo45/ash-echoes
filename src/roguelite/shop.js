import { WEAPONS } from '../gameplay/weapons.js';
import { PASSIVE_SKILLS } from '../gameplay/passives.js';

export class Shop {
  constructor() {
    this.items = [];
  }

  open(items, player, saveManager) {
    this.items = items;
    this.isOpen = true;
    this.player = player;
    this.saveManager = saveManager;
  }

  buy(item) {
    const cost = item.price;
    if (this.player.ash < cost) return false;

    this.player.ash -= cost;

    if (item.type === 'weapon') {
      // Grant weapon unlock or fragments
      const weaponData = WEAPONS[item.id];
      if (!weaponData) return false;
      this.player.unlockedWeapons = this.player.unlockedWeapons || ['pistol'];
      if (!this.player.unlockedWeapons.includes(item.id)) {
        this.player.unlockedWeapons.push(item.id);
      }
    } else if (item.type === 'passive') {
      this.player.unlockedPassives = this.player.unlockedPassives || [];
      if (!this.player.unlockedPassives.includes(item.id)) {
        this.player.unlockedPassives.push(item.id);
      }
    } else if (item.type === 'heal') {
      this.player.hp = Math.min(this.player.hp + item.amount, this.player.maxHp);
    } else if (item.type === 'buff') {
      this._applyBuff(item);
    }

    // Remove purchased item
    const idx = this.items.indexOf(item);
    if (idx !== -1) this.items.splice(idx, 1);

    return true;
  }

  _applyBuff(item) {
    if (item.id === 'damage_up') {
      this.player.damageBonus = (this.player.damageBonus || 0) + 0.2;
    } else if (item.id === 'speed_up') {
      this.player.speed *= 1.15;
    } else if (item.id === 'resonance_up') {
      this.player.maxResonance += 20;
    }
    this.player.buffs = this.player.buffs || [];
    this.player.buffs.push({ ...item, remainingTime: item.duration * 60 }); // frames
  }

  render(ctx) {
    if (!this.isOpen) return;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
    ctx.fillRect(200, 100, 560, 340);

    ctx.strokeStyle = '#ff6b35';
    ctx.lineWidth = 2;
    ctx.strokeRect(200, 100, 560, 340);

    ctx.fillStyle = '#ff6b35';
    ctx.font = 'bold 18px Courier New';
    ctx.fillText('回响商店', 420, 130);

    ctx.fillStyle = '#ff9f1c';
    ctx.font = '14px Courier New';
    ctx.fillText(`ASH: ${this.player.ash}`, 220, 160);

    let y = 190;
    for (const item of this.items) {
      let label = '';
      if (item.type === 'weapon') label = `[武器] ${WEAPONS[item.id]?.name || item.id}`;
      else if (item.type === 'passive') label = `[被动] ${PASSIVE_SKILLS[item.id]?.name || item.id}`;
      else if (item.type === 'heal') label = `[回复] +${item.amount} HP`;
      else if (item.type === 'buff') label = `[增益] ${item.id}`;

      const canAfford = this.player.ash >= item.price;
      ctx.fillStyle = canAfford ? '#fff' : '#666';
      ctx.fillText(`${label} - ${item.price} Ash`, 220, y);
      y += 25;
    }

    ctx.fillStyle = '#888';
    ctx.font = '12px Courier New';
    ctx.fillText('按 1-9 购买对应物品 | ESC 关闭', 220, 420);
  }

  close() {
    this.isOpen = false;
  }
}
