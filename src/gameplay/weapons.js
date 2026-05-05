// Weapon Upgrade System - Each weapon has 3 upgrade levels per character
export const WEAPON_UPGRADES = {
  pistol: {
    name: '制式手枪',
    upgrades: [
      { level: 1, damage: 10, speed: 500, interval: 0.12, desc: '基础伤害' },
      { level: 2, damage: 14, speed: 550, interval: 0.10, desc: '伤害+40%, 射速+' },
      { level: 3, damage: 18, speed: 600, interval: 0.08, desc: '伤害+80%, 射速++' },
    ],
  },
  echo_blade: {
    name: '回响双刃',
    upgrades: [
      { level: 1, damage: 15, chargeTime: 0.8, energyCost: 15, desc: '基础' },
      { level: 2, damage: 20, chargeTime: 0.65, energyCost: 12, desc: '伤害+, 蓄力-' },
      { level: 3, damage: 28, chargeTime: 0.5, energyCost: 10, desc: '最大强化' },
    ],
  },
  scatter_gun: {
    name: '散弹枪',
    upgrades: [
      { level: 1, damage: 8, pellets: 5, spread: 0.3, ammo: 30, desc: '5发' },
      { level: 2, damage: 10, pellets: 7, spread: 0.35, ammo: 40, desc: '+2弹药, 伤害+' },
      { level: 3, damage: 14, pellets: 9, spread: 0.4, ammo: 50, desc: '全面强化' },
    ],
  },
  resonance_cannon: {
    name: '共振炮',
    upgrades: [
      { level: 1, damage: 40, chargeTime: 1.0, energyCost: 25, desc: '基础' },
      { level: 2, damage: 55, chargeTime: 0.8, energyCost: 30, desc: '伤害+, 范围+' },
      { level: 3, damage: 75, chargeTime: 0.6, energyCost: 35, desc: '毁灭形态' },
    ],
  },
};

// Get weapon stats at upgrade level
export function getWeaponStats(weaponId, upgradeLevel = 1) {
  const base = WEAPONS[weaponId];
  const upgrades = WEAPON_UPGRADES[weaponId];
  if (!base || !upgrades) return base;

  const upgrade = upgrades.upgrades[Math.min(upgradeLevel - 1, 2)];
  return {
    ...base,
    ...upgrade,
  };
}

// Weapons system - dual weapon slots with Q switch
export const WEAPONS = {
  pistol: {
    id: 'pistol',
    name: '制式手枪',
    type: 'ranged',
    damage: 10,
    speed: 500,
    interval: 0.12,
    ammo: -1, // infinite
    unlocked: true,
  },
  echo_blade: {
    id: 'echo_blade',
    name: '回响双刃',
    type: 'melee',
    damage: 15,
    speed: 0, // melee range
    chargeTime: 0.8, // for charge attack
    energyCost: 15,
    unlocked: false, // unlocked through story
  },
  // Roguelite unlockable weapons
  scatter_gun: {
    id: 'scatter_gun',
    name: '散弹枪',
    type: 'ranged',
    damage: 8,
    speed: 400,
    interval: 0.4,
    pellets: 5,
    spread: 0.3,
    ammo: 30,
    unlocked: false,
  },
  resonance_cannon: {
    id: 'resonance_cannon',
    name: '共振炮',
    type: 'ranged',
    damage: 40,
    speed: 300,
    interval: 1.0,
    energyCost: 25,
    unlocked: false,
  },
};

export function getUnlockedWeapons(unlockedList = ['pistol']) {
  const result = {};
  for (const id in WEAPONS) {
    const w = WEAPONS[id];
    result[id] = { ...w, unlocked: w.unlocked || unlockedList.includes(id) };
  }
  return result;
}
