import { WEAPONS } from '../gameplay/weapons.js';

export class WeaponSwitch {
  constructor(player) {
    this.player = player;
    // Dual weapon slots
    this.slots = ['pistol', null]; // [primary, secondary]
    this.currentSlot = 0;
  }

  setSlots(primary, secondary) {
    this.slots[0] = primary;
    this.slots[1] = secondary;
    if (this.player) {
      this.player.currentWeapon = primary;
    }
  }

  switchWeapon() {
    if (!this.slots[1]) return; // No secondary weapon
    this.currentSlot = this.currentSlot === 0 ? 1 : 0;
    const newWeapon = this.slots[this.currentSlot];
    if (this.player) {
      this.player.currentWeapon = newWeapon;
      this._applyWeaponStats(newWeapon);
    }
    return newWeapon;
  }

  _applyWeaponStats(weaponId) {
    if (!this.player) return;
    const weapon = WEAPONS[weaponId];
    if (!weapon) return;

    if (weapon.type === 'melee') {
      this.player.isMelee = true;
      this.player.meleeDamage = weapon.damage;
      this.player.chargeTime = weapon.chargeTime;
      this.player.energyCost = weapon.energyCost;
    } else {
      this.player.isMelee = false;
      this.player.bulletDamage = weapon.damage;
      this.player.bulletSpeed = weapon.speed;
      this.player.shootInterval = weapon.interval;
    }
  }

  currentWeapon() {
    return this.slots[this.currentSlot];
  }

  render(ctx) {
    if (!this.player) return;
    const weaponId = this.currentWeapon();
    const weapon = WEAPONS[weaponId];
    if (!weapon) return;

    const x = ctx.canvas.width - 120;
    const y = 50;

    // Weapon slot 1
    ctx.fillStyle = this.currentSlot === 0 ? '#ff6b35' : '#333';
    ctx.fillRect(x, y, 50, 50);
    ctx.strokeStyle = '#ff6b35';
    ctx.strokeRect(x, y, 50, 50);
    ctx.fillStyle = '#fff';
    ctx.font = '10px Courier New';
    ctx.textAlign = 'center';
    ctx.fillText('1', x + 25, y + 20);
    ctx.fillText(weapon.type === 'melee' ? '近' : '射', x + 25, y + 38);

    // Weapon slot 2
    const weapon2 = WEAPONS[this.slots[1]];
    ctx.fillStyle = this.currentSlot === 1 ? '#ff6b35' : '#333';
    ctx.fillRect(x + 55, y, 50, 50);
    ctx.strokeStyle = '#ff6b35';
    ctx.strokeRect(x + 55, y, 50, 50);
    ctx.fillStyle = '#fff';
    ctx.fillText('2', x + 80, y + 20);
    ctx.fillText(weapon2 ? (weapon2.type === 'melee' ? '近' : '射') : '-', x + 80, y + 38);

    // Switch hint
    ctx.fillStyle = '#888';
    ctx.font = '11px Courier New';
    ctx.fillText('[Q]切换武器', x, y + 70);

    ctx.textAlign = 'left';
  }
}
