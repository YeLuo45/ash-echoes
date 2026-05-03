// 8 Passive Skills system
export const PASSIVE_SKILLS = {
  // ID: { name, description, effect, unlocked }
  iron_will: {
    id: 'iron_will',
    name: '钢铁意志',
    desc: '受到伤害时，伤害降低15%',
    effect: { damageReduction: 0.15 },
    unlocked: true, // Initially unlocked
  },
  swift_echo: {
    id: 'swift_echo',
    name: '迅捷回响',
    desc: '移动速度+20%',
    effect: { speedMultiplier: 1.2 },
    unlocked: true, // Initially unlocked
  },
  resonance_boost: {
    id: 'resonance_boost',
    name: '共振增幅',
    desc: '共振能量上限+30',
    effect: { maxResonanceBonus: 30 },
    unlocked: false,
  },
  vital_strike: {
    id: 'vital_strike',
    name: '致命一击',
    desc: '子弹伤害+25%',
    effect: { damageBonus: 0.25 },
    unlocked: false,
  },
  echo_mastery: {
    id: 'echo_mastery',
    name: '回响精通',
    desc: '技能冷却-25%',
    effect: { cooldownReduction: 0.25 },
    unlocked: false,
  },
  rapid_fire: {
    id: 'rapid_fire',
    name: '快速射击',
    desc: '射击间隔-30%',
    effect: { shootIntervalReduction: 0.3 },
    unlocked: false,
  },
  dash_master: {
    id: 'dash_master',
    name: '闪避大师',
    desc: '闪避冷却-40%，闪避无敌+50%',
    effect: { dashCooldownReduction: 0.4, invincibleBonus: 0.5 },
    unlocked: false,
  },
  corruption_shield: {
    id: 'corruption_shield',
    name: '侵蚀护盾',
    desc: '回响侵蚀累积-50%',
    effect: { corruptionReduction: 0.5 },
    unlocked: false,
  },
};

export function applyPassiveEffect(passiveId, player) {
  const passive = PASSIVE_SKILLS[passiveId];
  if (!passive) return;

  const effect = passive.effect;
  if (effect.damageReduction) {
    player.damageReduction = (player.damageReduction || 0) + effect.damageReduction;
  }
  if (effect.speedMultiplier) {
    player.speed *= effect.speedMultiplier;
  }
  if (effect.maxResonanceBonus) {
    player.maxResonance += effect.maxResonanceBonus;
  }
  if (effect.damageBonus) {
    player.damageBonus = (player.damageBonus || 0) + effect.damageBonus;
  }
  if (effect.cooldownReduction) {
    player.skillCooldown *= (1 - effect.cooldownReduction);
  }
  if (effect.shootIntervalReduction) {
    player.shootInterval *= (1 - effect.shootIntervalReduction);
  }
  if (effect.dashCooldownReduction) {
    player.dashCooldown *= (1 - effect.dashCooldownReduction);
  }
  if (effect.invincibleBonus) {
    player.invincibleDuration = (player.invincibleDuration || 0.5) + effect.invincibleBonus;
  }
  if (effect.corruptionReduction) {
    player.corruptionReduction = (player.corruptionReduction || 0) + effect.corruptionReduction;
  }
}

export function getUnlockedPassives(unlockedList = []) {
  const result = {};
  for (const id in PASSIVE_SKILLS) {
    const p = PASSIVE_SKILLS[id];
    result[id] = { ...p, unlocked: p.unlocked || unlockedList.includes(id) };
  }
  return result;
}
