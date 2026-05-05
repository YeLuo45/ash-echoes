// Character Story Fragment System - Each character has 3 story fragments
// Fragments are collected through gameplay and unlock character lore

export const CHARACTER_STORIES = {
  even: {
    id: 'even',
    name: '艾文',
    fragments: [
      {
        id: 'even_1',
        title: '序章：废墟之子',
        content: '在回响纪元爆发前，艾文只是废墟中一个普通的搜索者。那天，他在地下遗迹中发现了第一块共振碎片，命运从此改变...',
        unlockCondition: { type: 'chapter_start', chapter: 1 },
        unlocked: false,
      },
      {
        id: 'even_2',
        title: '双刃之路',
        content: '回响双刃选择了他。在无数次生死边缘的磨练中，艾文学会了将回响能量灌注刀刃，让每一次斩击都带有毁灭性的共振冲击...',
        unlockCondition: { type: 'chapter_complete', chapter: 2 },
        unlocked: false,
      },
      {
        id: 'even_3',
        title: '最终真相',
        content: '当艾文站在深渊之心，他终于明白：回响不是灾变，而是古老文明留下的火种。而他，必须成为将火种延续下去的那个人...',
        unlockCondition: { type: 'chapter_complete', chapter: 3 },
        unlocked: false,
      },
    ],
  },
  ren: {
    id: 'ren',
    name: '莲',
    fragments: [
      {
        id: 'ren_1',
        title: '深渊来信',
        content: '莲来自深渊的最底层，那里没有光，只有无尽的回响侵蚀。她的家族世代守护着一把被封印的双刃——直到那一天，封印破裂...',
        unlockCondition: { type: 'chapter_complete', chapter: 2 },
        unlocked: false,
      },
      {
        id: 'ren_2',
        title: '血与剑',
        content: '双刃上流淌的不是普通的血，而是回响能量的液态形态。莲的每一次攻击都会在敌人身上留下难以愈合的伤口，持续侵蚀着生命...',
        unlockCondition: { type: 'chapter_start', chapter: 3 },
        unlocked: false,
      },
      {
        id: 'ren_3',
        title: '静流之名',
        content: '当所有人都在喧嚣中争夺回响之力时，莲静静站在深渊的边缘。她不需要证明什么——她的剑，就是最好的回答...',
        unlockCondition: { type: 'boss_defeat', chapter: 3, bossId: 'boss_eternal_guardian' },
        unlocked: false,
      },
    ],
  },
  rong: {
    id: 'rong',
    name: '熔',
    fragments: [
      {
        id: 'rong_1',
        title: '裂解之始',
        content: '熔曾是回廊研究院的首席科学家。当回响实验失控时，他用自己的身体吸收了过载的能量——代价是肉体与共振炮永久融合...',
        unlockCondition: { type: 'chapter_complete', chapter: 3 },
        unlocked: false,
      },
      {
        id: 'rong_2',
        title: '毁灭的代价',
        content: '共振炮不只是武器，更是熔身体的一部分。每一次发射都像是在燃烧自己的生命，但为了终结回响，他别无选择...',
        unlockCondition: { type: 'chapter_start', chapter: 3 },
        unlocked: false,
      },
      {
        id: 'rong_3',
        title: '最终裂解',
        content: '在永恒守护者面前，熔终于释放了他一直封印的力量。共振炮达到了前所未有的过载状态——足以撕裂时空本身...',
        unlockCondition: { type: 'boss_defeat', chapter: 3, bossId: 'boss_eternal_guardian' },
        unlocked: false,
      },
    ],
  },
};

// Check and update fragment unlock status based on game state
export function updateStoryFragments(characterId, gameState, saveProgress) {
  const story = CHARACTER_STORIES[characterId];
  if (!story) return;

  for (const fragment of story.fragments) {
    if (fragment.unlocked) continue;

    const cond = fragment.unlockCondition;
    switch (cond.type) {
      case 'chapter_start':
        // Fragment unlocks when chapter starts
        if (gameState.currentChapter >= cond.chapter) {
          fragment.unlocked = true;
        }
        break;
      case 'chapter_complete':
        if (saveProgress?.chapters?.[cond.chapter]?.complete) {
          fragment.unlocked = true;
        }
        break;
      case 'boss_defeat':
        if (saveProgress?.chapters?.[cond.chapter]?.bosses?.[cond.bossId]) {
          fragment.unlocked = true;
        }
        break;
    }
  }
}

// Get unlocked count
export function getUnlockedFragmentCount(characterId) {
  const story = CHARACTER_STORIES[characterId];
  if (!story) return 0;
  return story.fragments.filter(f => f.unlocked).length;
}

// Get total count
export function getTotalFragmentCount(characterId) {
  const story = CHARACTER_STORIES[characterId];
  if (!story) return 0;
  return story.fragments.length;
}

// Load story state from save
export function loadStoryState(characterId, saveData) {
  const story = CHARACTER_STORIES[characterId];
  if (!story) return;
  if (saveData?.storyFragments?.[characterId]) {
    for (const fragment of story.fragments) {
      if (saveData.storyFragments[characterId].includes(fragment.id)) {
        fragment.unlocked = true;
      }
    }
  }
}

// Save story state
export function saveStoryState(characterId) {
  const story = CHARACTER_STORIES[characterId];
  if (!story) return {};
  return {
    [characterId]: story.fragments.filter(f => f.unlocked).map(f => f.id),
  };
}
