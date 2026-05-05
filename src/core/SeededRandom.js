// Seeded random for daily challenge reproducibility
export class SeededRandom {
  constructor(seed) {
    this.seed = seed;
    this.current = seed;
  }

  next() {
    this.current = (this.current * 1103515245 + 12345) & 0x7fffffff;
    return this.current / 0x7fffffff;
  }

  nextInt(min, max) {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  nextFloat(min, max) {
    return this.next() * (max - min) + min;
  }

  shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(this.next() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  pick(arr) {
    return arr[Math.floor(this.next() * arr.length)];
  }

  chance(prob) {
    return this.next() < prob;
  }

  // Get today's daily seed
  static todaySeed() {
    const now = new Date();
    const str = `${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}`;
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  }

  // Get leaderboard key for today
  static leaderboardKey() {
    const now = new Date();
    return `ash_daily_${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}`;
  }
}
