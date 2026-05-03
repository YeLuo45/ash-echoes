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
