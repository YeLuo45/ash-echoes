// Character Configuration System - 3 Characters: 艾文/莲/熔
export const CHARACTERS = {
  even: {
    id: 'even',
    name: '艾文',
    title: '回响猎人',
    desc: '废墟中成长的老练猎人，擅长精准射击与回响脉冲',
    accentColor: '#ff6b35',
    bgColor: '#1a0f0a',
    initialWeapon: 'pistol',
    coreMechanic: 'resonance_pulse',
    coreDesc: '回响脉冲可对周围敌人造成伤害与击退',
    stats: {
      hp: 100,
      maxHp: 100,
      resonance: 100,
      maxResonance: 100,
      speed: 200,
      damage: 10,
    },
    // Skill point gain per level
    skillPointsPerChapter: 2,
  },
  ren: {
    id: 'ren',
    name: '莲',
    title: '静流剑士',
    desc: '来自深渊的冷静剑客，双刃流血的输出者',
    accentColor: '#00d4ff',
    bgColor: '#0a1a1f',
    initialWeapon: 'echo_blade',
    coreMechanic: 'bleed_stack',
    coreDesc: '双刃命中叠加流血效果，持续损失生命',
    stats: {
      hp: 85,
      maxHp: 85,
      resonance: 80,
      maxResonance: 80,
      speed: 220,
      damage: 15,
    },
    skillPointsPerChapter: 2,
  },
  rong: {
    id: 'rong',
    name: '熔',
    title: '裂解使者',
    desc: '回廊的幸存者，共振炮的毁灭性操控者',
    accentColor: '#9b59b6',
    bgColor: '#120a1a',
    initialWeapon: 'resonance_cannon',
    coreMechanic: 'explosion',
    coreDesc: '共振炮命中引发范围爆炸，伤害递增',
    stats: {
      hp: 120,
      maxHp: 120,
      resonance: 150,
      maxResonance: 150,
      speed: 160,
      damage: 20,
    },
    skillPointsPerChapter: 2,
  },
};

// Character unlock requirements
export const CHARACTER_UNLOCKS = {
  even: { type: 'default', requirement: null },
  ren: { type: 'chapter_complete', chapter: 2 },
  rong: { type: 'chapter_complete', chapter: 3 },
};

// Check if character is unlocked based on save data
export function isCharacterUnlocked(characterId, saveProgress) {
  const unlock = CHARACTER_UNLOCKS[characterId];
  if (!unlock) return false;

  if (unlock.type === 'default') return true;
  if (unlock.type === 'chapter_complete') {
    const chapterData = saveProgress?.chapters?.[unlock.chapter];
    return chapterData?.complete === true;
  }
  return false;
}

// Get default character
export function getDefaultCharacterId() {
  return 'even';
}

// Get all character IDs in unlock order
export function getCharacterUnlockOrder() {
  return ['even', 'ren', 'rong'];
}
