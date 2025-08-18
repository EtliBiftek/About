/*
  Breakout (Brick Breaker) - Vanilla JS + Canvas

  Architecture overview
  - Config: All tunable constants live at the top for easy balancing.
  - Game state: Plain objects for paddle, ball, bricks, score, and lifecycle flags.
  - Systems: Input, Physics/Collisions, Renderer, Audio, Persistence (high score).
  - Loop: requestAnimationFrame-driven game loop with fixed-update-ish behaviour.
  - Expansion friendly: Clear separation of concerns and helper utilities.
*/

// =========================
// Config (tweak-friendly)
// =========================
const CONFIG = {
    // Canvas internal resolution (game units). CSS scales it.
    canvasWidth: 480,
    canvasHeight: 640,

    // Paddle
    paddleWidth: 80, // chosen to give good coverage without being too forgiving
    paddleHeight: 12,
    paddleSpeed: 6, // px per frame via keyboard

    // Ball
    ballRadius: 8,
    ballSpeed: 3.2, // base speed; tuned for ~fast but controllable gameplay
    ballSpeedMax: 7.0,

    // Bricks
    brick: {
        rows: 5,
        cols: 8,
        width: 50,
        height: 20,
        padding: 8,
        offsetTop: 60,
        offsetLeft: 20,
    },

    // Gameplay
    startingLives: 3,

    // Audio (set to false to disable all sounds)
    audioEnabled: true,
};

// Brick colors by row index
const BRICK_ROW_COLORS = [
    '#d32f2f', // red
    '#f57c00', // orange
    '#388e3c', // green
    '#1976d2', // blue
    '#7b1fa2', // purple
];

// =========================
// Canvas & Context
// =========================
/** @type {HTMLCanvasElement} */
const canvas = document.getElementById('game');
/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext('2d');

// =========================
// Utility functions
// =========================
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const randRange = (min, max) => Math.random() * (max - min) + min;

function now() {
    return performance.now();
}

// =========================
// Audio (WebAudio minimal beeps)
// =========================
const AudioSystem = (() => {
    let audioContext = null;
    function getCtx() {
        if (!CONFIG.audioEnabled) return null;
        if (!audioContext) {
            try { audioContext = new (window.AudioContext || window.webkitAudioContext)(); }
            catch { /* ignore if not available */ }
        }
        return audioContext;
    }

    function beep({ frequency = 440, duration = 0.05, type = 'sine', gain = 0.05 } = {}) {
        const ctx = getCtx();
        if (!ctx) return;
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        oscillator.type = type;
        oscillator.frequency.value = frequency;
        gainNode.gain.value = gain;
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        oscillator.start();
        oscillator.stop(ctx.currentTime + duration);
    }

    return {
        paddle: () => beep({ frequency: 340, duration: 0.05, type: 'square', gain: 0.05 }),
        brick: () => beep({ frequency: 560, duration: 0.06, type: 'triangle', gain: 0.05 }),
        wall: () => beep({ frequency: 260, duration: 0.04, type: 'square', gain: 0.04 }),
        lose: () => beep({ frequency: 140, duration: 0.2, type: 'sawtooth', gain: 0.06 }),
        win: () => beep({ frequency: 720, duration: 0.25, type: 'triangle', gain: 0.06 }),
    };
})();

// =========================
// Input
// =========================
const input = {
    left: false,
    right: false,
    mouseX: null,
};

window.addEventListener('keydown', (e) => {
    if (e.code === 'ArrowLeft') input.left = true;
    if (e.code === 'ArrowRight') input.right = true;
    if (e.code === 'Space') launchBall();
    if (e.code === 'KeyR') restart();
});

window.addEventListener('keyup', (e) => {
    if (e.code === 'ArrowLeft') input.left = false;
    if (e.code === 'ArrowRight') input.right = false;
});

// Mouse controls: map clientX to canvas space respecting CSS scaling
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    input.mouseX = (e.clientX - rect.left) * scaleX;
});

canvas.addEventListener('mousedown', () => {
    launchBall();
});

// =========================
// High score persistence
// =========================
const HighScore = (() => {
    const KEY = 'breakout_high_score_v1';
    function read() {
        const raw = localStorage.getItem(KEY);
        const n = raw ? Number(raw) : 0;
        return Number.isFinite(n) ? n : 0;
    }
    function write(score) {
        try { localStorage.setItem(KEY, String(score)); } catch { /* ignore */ }
    }
    return { read, write };
})();

// =========================
// Game State
// =========================
const state = {
    paddle: { x: CONFIG.canvasWidth / 2 - CONFIG.paddleWidth / 2, y: CONFIG.canvasHeight - 40, width: CONFIG.paddleWidth, height: CONFIG.paddleHeight },
    ball: { x: CONFIG.canvasWidth / 2, y: CONFIG.canvasHeight / 2, radius: CONFIG.ballRadius, dx: 0, dy: 0, onPaddle: true },
    bricks: [], // 2D array of brick objects { x, y, width, height, alive, hits }
    score: 0,
    lives: CONFIG.startingLives,
    highScore: HighScore.read(),
    running: true,
    won: false,
    lost: false,
    lastTimeMs: now(),
};

// Initialize bricks layout
function resetBricks() {
    const b = CONFIG.brick;
    const bricks = [];
    for (let r = 0; r < b.rows; r++) {
        bricks[r] = [];
        for (let c = 0; c < b.cols; c++) {
            const x = b.offsetLeft + c * (b.width + b.padding);
            const y = b.offsetTop + r * (b.height + b.padding);
            bricks[r][c] = {
                x,
                y,
                width: b.width,
                height: b.height,
                alive: true,
                hits: 1, // single-hit bricks by default; easy extension to multi-hit
                color: BRICK_ROW_COLORS[r % BRICK_ROW_COLORS.length],
            };
        }
    }
    state.bricks = bricks;
}

function centerBallOnPaddle() {
    state.ball.x = state.paddle.x + state.paddle.width / 2;
    state.ball.y = state.paddle.y - state.ball.radius - 1;
}

function resetBallOnPaddle() {
    state.ball.dx = 0;
    state.ball.dy = 0;
    state.ball.onPaddle = true;
    centerBallOnPaddle();
}

function restart() {
    state.score = 0;
    state.lives = CONFIG.startingLives;
    state.won = false;
    state.lost = false;
    state.running = true;
    resetBricks();
    resetBallOnPaddle();
}

function launchBall() {
    if (!state.ball.onPaddle || state.lost || state.won) return;
    // Randomize initial angle within a forward cone
    const angle = randRange(-Math.PI / 4, Math.PI / 4); // -45..45 deg
    state.ball.dx = Math.cos(angle) * CONFIG.ballSpeed;
    state.ball.dy = -Math.sin(Math.PI / 2 - angle) * CONFIG.ballSpeed - CONFIG.ballSpeed; // ensure upward
    // Normalize speed to CONFIG.ballSpeed
    const len = Math.hypot(state.ball.dx, state.ball.dy);
    if (len > 0) {
        state.ball.dx = (state.ball.dx / len) * CONFIG.ballSpeed;
        state.ball.dy = (state.ball.dy / len) * CONFIG.ballSpeed;
    }
    state.ball.onPaddle = false;
}

// =========================
// Collision helpers
// =========================
function circleIntersectsRect(cx, cy, radius, rx, ry, rw, rh) {
    // Clamp circle center to rectangle bounds
    const closestX = clamp(cx, rx, rx + rw);
    const closestY = clamp(cy, ry, ry + rh);
    const dx = cx - closestX;
    const dy = cy - closestY;
    return (dx * dx + dy * dy) <= radius * radius;
}

// Reflect ball against a rectangle given the hit direction.
function reflectBallFromRect(ball, rect) {
    // Compute overlap by checking penetration depths to each side
    const prevX = ball.x - ball.dx;
    const prevY = ball.y - ball.dy;
    const fromLeft = prevX <= rect.x;
    const fromRight = prevX >= rect.x + rect.width;
    const fromTop = prevY <= rect.y;
    const fromBottom = prevY >= rect.y + rect.height;

    let flippedX = false;
    let flippedY = false;
    // Prefer flipping axis with smaller penetration; fallback to both
    const overlapLeft = Math.abs((ball.x + ball.radius) - rect.x);
    const overlapRight = Math.abs((rect.x + rect.width) - (ball.x - ball.radius));
    const overlapTop = Math.abs((ball.y + ball.radius) - rect.y);
    const overlapBottom = Math.abs((rect.y + rect.height) - (ball.y - ball.radius));

    const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);
    if (minOverlap === overlapLeft || minOverlap === overlapRight) {
        ball.dx = -ball.dx; flippedX = true;
    }
    if (minOverlap === overlapTop || minOverlap === overlapBottom) {
        ball.dy = -ball.dy; flippedY = true;
    }
    if (!flippedX && !flippedY) ball.dy = -ball.dy; // fallback
}

// Paddle-specific reflection: adjust angle based on hit position
function reflectFromPaddle(ball, paddle) {
    const hitPos = (ball.x - (paddle.x + paddle.width / 2)) / (paddle.width / 2);
    const clamped = clamp(hitPos, -1, 1); // -1 .. 1
    const maxBounce = Math.PI / 3; // 60 degrees
    const angle = clamped * maxBounce; // -60..60 degrees from vertical

    const speed = Math.min(CONFIG.ballSpeedMax, Math.hypot(ball.dx, ball.dy) * 1.03);
    ball.dx = speed * Math.sin(angle);
    ball.dy = -Math.abs(speed * Math.cos(angle));
}

// =========================
// Update (physics + game logic)
// =========================
function update() {
    if (!state.running) return;

    // Paddle movement from keyboard
    if (input.left && !input.right) state.paddle.x -= CONFIG.paddleSpeed;
    if (input.right && !input.left) state.paddle.x += CONFIG.paddleSpeed;

    // Paddle movement from mouse (wins over keyboard when mouse moves)
    if (input.mouseX !== null) {
        state.paddle.x = input.mouseX - state.paddle.width / 2;
    }

    // Constrain paddle to canvas
    state.paddle.x = clamp(state.paddle.x, 0, CONFIG.canvasWidth - state.paddle.width);

    // Stick ball to paddle if onPaddle
    if (state.ball.onPaddle) {
        centerBallOnPaddle();
    } else {
        // Move ball
        state.ball.x += state.ball.dx;
        state.ball.y += state.ball.dy;
    }

    // Collisions: walls
    if (!state.ball.onPaddle) {
        if (state.ball.x - state.ball.radius <= 0) {
            state.ball.x = state.ball.radius;
            state.ball.dx = Math.abs(state.ball.dx);
            AudioSystem.wall();
        } else if (state.ball.x + state.ball.radius >= CONFIG.canvasWidth) {
            state.ball.x = CONFIG.canvasWidth - state.ball.radius;
            state.ball.dx = -Math.abs(state.ball.dx);
            AudioSystem.wall();
        }
        if (state.ball.y - state.ball.radius <= 0) {
            state.ball.y = state.ball.radius;
            state.ball.dy = Math.abs(state.ball.dy);
            AudioSystem.wall();
        }
    }

    // Collisions: paddle
    const p = state.paddle;
    if (!state.ball.onPaddle && circleIntersectsRect(state.ball.x, state.ball.y, state.ball.radius, p.x, p.y, p.width, p.height) && state.ball.dy > 0) {
        // Position the ball just above the paddle to prevent sinking
        state.ball.y = p.y - state.ball.radius - 0.1;
        reflectFromPaddle(state.ball, p);
        AudioSystem.paddle();
    }

    // Collisions: bricks
    if (!state.ball.onPaddle) {
        const b = state.ball;
        outer: for (let r = 0; r < state.bricks.length; r++) {
            const row = state.bricks[r];
            for (let c = 0; c < row.length; c++) {
                const brick = row[c];
                if (!brick.alive) continue;
                if (circleIntersectsRect(b.x, b.y, b.radius, brick.x, brick.y, brick.width, brick.height)) {
                    reflectBallFromRect(b, brick);
                    brick.hits -= 1;
                    if (brick.hits <= 0) {
                        brick.alive = false;
                        state.score += 1;
                        AudioSystem.brick();
                    } else {
                        AudioSystem.wall();
                    }
                    break outer; // handle one brick per frame to avoid chain reactions
                }
            }
        }
    }

    // Lose life if ball below bottom
    if (state.ball.y - state.ball.radius > CONFIG.canvasHeight) {
        state.lives -= 1;
        AudioSystem.lose();
        if (state.lives <= 0) {
            state.lost = true;
            state.running = false;
        }
        resetBallOnPaddle();
    }

    // Win if all bricks cleared
    const allCleared = state.bricks.every(row => row.every(bk => !bk.alive));
    if (allCleared && !state.won) {
        state.won = true;
        state.running = false;
        AudioSystem.win();
    }

    // High score
    if (state.score > state.highScore) {
        state.highScore = state.score;
        HighScore.write(state.highScore);
    }
}

// =========================
// Render
// =========================
function drawHUD() {
    ctx.save();
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.font = '14px system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial';
    ctx.textBaseline = 'top';
    // Ensure we don't inherit textAlign from other draws
    ctx.textAlign = 'left';
    ctx.fillText(`Skor: ${state.score}`, 12, 8);
    const livesText = `Can: ${state.lives}  Rekor: ${state.highScore}`;
    ctx.textAlign = 'right';
    ctx.fillText(livesText, CONFIG.canvasWidth - 12, 8);
    ctx.restore();
}

function drawPaddle() {
    ctx.fillStyle = '#e0f7fa';
    const { x, y, width, height } = state.paddle;
    ctx.fillRect(x, y, width, height);
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(state.ball.x, state.ball.y, state.ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#fff59d';
    ctx.fill();
}

function drawBricks() {
    for (let r = 0; r < state.bricks.length; r++) {
        for (let c = 0; c < state.bricks[r].length; c++) {
            const brick = state.bricks[r][c];
            if (!brick.alive) continue;
            ctx.fillStyle = brick.color;
            ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
        }
    }
}

function drawMessages() {
    if (!state.won && !state.lost && state.ball.onPaddle) {
        ctx.fillStyle = 'rgba(255,255,255,0.95)';
        ctx.font = 'bold 16px system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Başlatmak için Boşluk veya Tıkla', CONFIG.canvasWidth / 2, CONFIG.canvasHeight / 2 - 16);
    }
    if (state.won || state.lost) {
        ctx.fillStyle = 'rgba(255,255,255,0.98)';
        ctx.font = 'bold 22px system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const text = state.won ? 'Kazandın!' : 'Oyun Bitti';
        ctx.fillText(text, CONFIG.canvasWidth / 2, CONFIG.canvasHeight / 2 - 10);
        ctx.font = '16px system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial';
        ctx.fillText('Yeniden başlatmak için R', CONFIG.canvasWidth / 2, CONFIG.canvasHeight / 2 + 16);
    }
}

function render() {
    // Clear
    ctx.clearRect(0, 0, CONFIG.canvasWidth, CONFIG.canvasHeight);

    // Background vignette overlay (subtle)
    const grd = ctx.createLinearGradient(0, 0, 0, CONFIG.canvasHeight);
    grd.addColorStop(0, 'rgba(255,255,255,0.02)');
    grd.addColorStop(1, 'rgba(0,0,0,0.05)');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, CONFIG.canvasWidth, CONFIG.canvasHeight);

    drawBricks();
    drawPaddle();
    drawBall();
    drawHUD();
    drawMessages();
}

// =========================
// Game Loop
// =========================
function tick() {
    const t = now();
    const dt = t - state.lastTimeMs;
    state.lastTimeMs = t;

    // We keep the update simple; the speeds are defined per frame.
    update(dt);
    render();
    requestAnimationFrame(tick);
}

// =========================
// Bootstrapping
// =========================
function boot() {
    // Ensure canvas internal size matches config (in case HTML changed)
    canvas.width = CONFIG.canvasWidth;
    canvas.height = CONFIG.canvasHeight;

    resetBricks();
    resetBallOnPaddle();

    const restartBtn = document.getElementById('restartBtn');
    restartBtn.addEventListener('click', restart);

    requestAnimationFrame(tick);
}

boot();

// =========================
// Chosen constants printout
// =========================
console.log('[Breakout Config]', {
    ballSpeed: CONFIG.ballSpeed,
    ballRadius: CONFIG.ballRadius,
    paddle: { width: CONFIG.paddleWidth, height: CONFIG.paddleHeight, speed: CONFIG.paddleSpeed },
    bricks: { rows: CONFIG.brick.rows, cols: CONFIG.brick.cols, size: { width: CONFIG.brick.width, height: CONFIG.brick.height }, padding: CONFIG.brick.padding },
});