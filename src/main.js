import { Game } from './core/Game.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

canvas.width = 960;
canvas.height = 540;

const game = new Game(canvas, ctx);

document.getElementById('start-btn').addEventListener('click', () => {
  document.getElementById('start-screen').style.display = 'none';
  game.start();
});

document.getElementById('restart-btn').addEventListener('click', () => {
  document.getElementById('game-over-screen').style.display = 'none';
  game.start();
});
