import React, { useRef, useEffect, useState, useCallback } from 'react';
import { PatternConfig, Bullet, EmitterConfig, GameState } from '../types';
import * as Constants from '../constants';

export const useGameEngine = (
  canvasRef: React.RefObject<HTMLCanvasElement>,
  pattern: PatternConfig | null,
  isPlaying: boolean
) => {
  const [gameState, setGameState] = useState<GameState>({ 
    bulletCount: 0, 
    fps: 0,
    score: 0,
    isGameOver: false,
    timeSurvived: 0,
    dashCooldown: 0
  });

  const bulletsRef = useRef<Bullet[]>([]);
  const frameRef = useRef<number>(0);
  const requestRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const scoreRef = useRef<number>(0);
  const isGameOverRef = useRef<boolean>(false);
  
  // Player State
  const playerPosRef = useRef({ x: Constants.PLAYER_START_X, y: Constants.PLAYER_START_Y });
  const keysRef = useRef<Set<string>>(new Set());
  
  // Dash State
  const dashTimerRef = useRef<number>(0); // > 0 means currently dashing (invincible)
  const dashCooldownRef = useRef<number>(0); // > 0 means cooldown active

  // Input Event Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => keysRef.current.add(e.code);
    const handleKeyUp = (e: KeyboardEvent) => keysRef.current.delete(e.code);

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Reset Game
  const resetGame = useCallback(() => {
    bulletsRef.current = [];
    frameRef.current = 0;
    scoreRef.current = 0;
    isGameOverRef.current = false;
    playerPosRef.current = { x: Constants.PLAYER_START_X, y: Constants.PLAYER_START_Y };
    dashTimerRef.current = 0;
    dashCooldownRef.current = 0;

    setGameState({
      bulletCount: 0,
      fps: 0,
      score: 0,
      isGameOver: false,
      timeSurvived: 0,
      dashCooldown: 0
    });
    
    // Clear canvas immediately
    if (canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
            ctx.clearRect(0, 0, Constants.CANVAS_WIDTH, Constants.CANVAS_HEIGHT);
            // Updated to match new Void Black theme
            ctx.fillStyle = '#050505';
            ctx.fillRect(0, 0, Constants.CANVAS_WIDTH, Constants.CANVAS_HEIGHT);
        }
    }
  }, [canvasRef]);

  // Reset when pattern changes
  useEffect(() => {
    resetGame();
  }, [pattern, resetGame]);

  const spawnBullets = useCallback((emitter: EmitterConfig, currentFrame: number) => {
    // Check delay
    if (emitter.delay && currentFrame < emitter.delay) return;
    
    // Check lifetime
    const activeTime = currentFrame - (emitter.delay || 0);
    if (emitter.lifetime && activeTime > emitter.lifetime) return;

    // Check frequency
    if (activeTime % Math.max(1, Math.floor(emitter.frequency)) !== 0) return;

    const centerX = Constants.CANVAS_WIDTH / 2;
    const centerY = Constants.CANVAS_HEIGHT / 4; // Boss position roughly

    const count = emitter.bulletCount;
    let baseAngle = emitter.angleOffset + (emitter.angleIncrement * activeTime);
    
    for (let i = 0; i < count; i++) {
      let angle = 0;
      let speed = emitter.speed + (Math.random() * (emitter.speedVariance || 0));

      switch (emitter.type) {
        case 'ring':
          angle = baseAngle + (360 / count) * i;
          break;
        case 'spiral':
          angle = baseAngle + (360 / count) * i;
          break;
        case 'flower':
           angle = baseAngle + (360 / count) * i + Math.sin(activeTime * 0.05) * 20;
           break;
        case 'spread':
          const spreadRange = 60;
          const start = baseAngle - spreadRange / 2;
          angle = start + (spreadRange / (count > 1 ? count - 1 : 1)) * i;
          break;
        case 'aimed':
          // Aim at actual player position
          const targetX = playerPosRef.current.x;
          const targetY = playerPosRef.current.y;
          const aimAngle = Math.atan2(targetY - centerY, targetX - centerX) * (180 / Math.PI);
          const aimSpread = 30;
          angle = aimAngle + (Math.random() - 0.5) * aimSpread;
          break;
        case 'random':
          angle = Math.random() * 360;
          break;
        default:
          angle = baseAngle;
      }

      const rad = (angle * Math.PI) / 180;
      
      bulletsRef.current.push({
        x: centerX,
        y: centerY,
        vx: Math.cos(rad) * speed,
        vy: Math.sin(rad) * speed,
        color: emitter.color,
        shape: emitter.shape,
        size: emitter.size,
        rotation: angle,
        rotationSpeed: (Math.random() - 0.5) * 10
      });
    }
  }, []);

  const update = useCallback((time: number) => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    // FPS Calculation
    const delta = time - lastTimeRef.current;
    lastTimeRef.current = time;
    const fps = delta > 0 ? Math.round(1000 / delta) : 60;

    // 0. Game Logic - Dash & Movement
    if (!isGameOverRef.current) { 
        const keys = keysRef.current;
        
        // Handle Dash Trigger
        if (keys.has('KeyX') && dashCooldownRef.current <= 0) {
            dashTimerRef.current = Constants.PLAYER_DASH_DURATION;
            dashCooldownRef.current = Constants.PLAYER_DASH_COOLDOWN;
        }

        // Update Timers
        if (dashTimerRef.current > 0) dashTimerRef.current--;
        if (dashCooldownRef.current > 0) dashCooldownRef.current--;

        // Determine Speed
        let currentSpeed = Constants.PLAYER_SPEED;
        if (dashTimerRef.current > 0) {
            currentSpeed = Constants.PLAYER_DASH_SPEED;
        } else if (keys.has('ShiftLeft') || keys.has('ShiftRight')) {
            currentSpeed = Constants.PLAYER_FOCUS_SPEED;
        }
        
        // Movement
        const pos = playerPosRef.current;
        let dx = 0;
        let dy = 0;
        
        if (keys.has('ArrowUp') || keys.has('KeyW')) dy -= 1;
        if (keys.has('ArrowDown') || keys.has('KeyS')) dy += 1;
        if (keys.has('ArrowLeft') || keys.has('KeyA')) dx -= 1;
        if (keys.has('ArrowRight') || keys.has('KeyD')) dx += 1;

        // Normalize diagonal movement
        if (dx !== 0 && dy !== 0) {
            const length = Math.sqrt(dx * dx + dy * dy);
            dx /= length;
            dy /= length;
        }

        pos.x += dx * currentSpeed;
        pos.y += dy * currentSpeed;

        // Clamp to screen
        pos.x = Math.max(10, Math.min(Constants.CANVAS_WIDTH - 10, pos.x));
        pos.y = Math.max(10, Math.min(Constants.CANVAS_HEIGHT - 10, pos.y));
    }

    // 1. Clear Canvas with Fade Effect (Void Black)
    // We use a very low opacity black to create trails, but the base is 050505
    ctx.fillStyle = 'rgba(5, 5, 5, 0.4)'; 
    ctx.fillRect(0, 0, Constants.CANVAS_WIDTH, Constants.CANVAS_HEIGHT);

    // 2. Draw Boss
    const bossX = Constants.CANVAS_WIDTH / 2;
    const bossY = Constants.CANVAS_HEIGHT / 4;
    
    // Boss Glow
    const gradient = ctx.createRadialGradient(bossX, bossY, 5, bossX, bossY, 40);
    gradient.addColorStop(0, '#ffffff');
    gradient.addColorStop(0.5, '#39ff14'); // Acid Green
    gradient.addColorStop(1, 'rgba(57, 255, 20, 0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(bossX, bossY, 40, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(bossX, bossY + Math.sin(time * 0.005) * 5, 10, 0, Math.PI * 2);
    ctx.stroke();

    // 3. Logic dependent on Pattern & Playing state
    if (pattern && isPlaying && !isGameOverRef.current) {
        pattern.emitters.forEach(emitter => spawnBullets(emitter, frameRef.current));
        frameRef.current++;
        scoreRef.current++;
    }

    // 4. Update and Draw Bullets
    if (bulletsRef.current.length > 0) {
        bulletsRef.current = bulletsRef.current.filter(b => 
            b.x > -50 && b.x < Constants.CANVAS_WIDTH + 50 &&
            b.y > -50 && b.y < Constants.CANVAS_HEIGHT + 50
        );

        const playerX = playerPosRef.current.x;
        const playerY = playerPosRef.current.y;
        const hitboxR = Constants.PLAYER_HITBOX_RADIUS;
        const isDashing = dashTimerRef.current > 0;
        
        let collisionDetected = false;

        bulletsRef.current.forEach(b => {
            if (isPlaying && !isGameOverRef.current) {
                b.x += b.vx;
                b.y += b.vy;
                b.rotation += b.rotationSpeed;
            }

            // Draw Bullet
            ctx.save();
            ctx.translate(b.x, b.y);
            ctx.rotate((b.rotation * Math.PI) / 180);
            
            // Fade bullets if dashing to indicate invincibility phase
            ctx.globalAlpha = isDashing ? 0.5 : 1.0;
            ctx.fillStyle = b.color;
            ctx.beginPath();
            
            switch (b.shape) {
                case 'circle': ctx.arc(0, 0, b.size, 0, Math.PI * 2); break;
                case 'rect': ctx.fillRect(-b.size, -b.size, b.size * 2, b.size * 2); break;
                case 'diamond':
                    ctx.moveTo(0, -b.size * 1.5);
                    ctx.lineTo(b.size, 0);
                    ctx.lineTo(0, b.size * 1.5);
                    ctx.lineTo(-b.size, 0);
                    break;
                case 'star':
                    for(let i=0; i<5; i++){
                        ctx.lineTo(Math.cos((18+i*72)/180*Math.PI)*b.size, Math.sin((18+i*72)/180*Math.PI)*b.size);
                        ctx.lineTo(Math.cos((54+i*72)/180*Math.PI)*b.size/2, Math.sin((54+i*72)/180*Math.PI)*b.size/2);
                    }
                    break;
            }
            ctx.fill();
            ctx.restore();

            // Collision Detection
            if (!isGameOverRef.current && pattern && isPlaying && !isDashing) {
                const dx = b.x - playerX;
                const dy = b.y - playerY;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < b.size + hitboxR - 1) {
                    collisionDetected = true;
                }
            }
        });

        if (collisionDetected) {
            isGameOverRef.current = true;
            // CRITICAL FIX: Force update immediately when game over occurs.
            // This bypasses the frameRef modulo check which might fail if frameRef freezes on a non-mod-5 number.
            setGameState(prev => ({
                ...prev,
                isGameOver: true,
                score: scoreRef.current * 10
            }));
        }
    }

    // 5. Draw Player
    const playerX = playerPosRef.current.x;
    const playerY = playerPosRef.current.y;
    const hitboxR = Constants.PLAYER_HITBOX_RADIUS;
    const isDashing = dashTimerRef.current > 0;

    if (!isGameOverRef.current || Math.floor(Date.now() / 100) % 2 === 0) { 
        ctx.save();
        ctx.translate(playerX, playerY);
        
        // Dash Visual Effects
        if (isDashing) {
            // After-image or Glow
            ctx.shadowColor = '#fff';
            ctx.shadowBlur = 15;
            ctx.globalAlpha = 0.8;
            ctx.fillStyle = '#fff';
        } else {
            ctx.fillStyle = '#00ffff'; // Electric Cyan
        }
        
        // Player Sprite - Changed to a triangle shape for more "Ship" feel
        ctx.beginPath();
        ctx.moveTo(0, -12);
        ctx.lineTo(-10, 10);
        ctx.lineTo(0, 5);
        ctx.lineTo(10, 10);
        ctx.closePath();
        ctx.fill();

        // Focus Hitbox / Cooldown Ring
        const isFocus = keysRef.current.has('ShiftLeft') || keysRef.current.has('ShiftRight');
        
        if (isFocus || isDashing) {
            ctx.beginPath();
            ctx.fillStyle = isDashing ? '#fff' : '#ff0055'; 
            ctx.arc(0, 0, hitboxR, 0, Math.PI * 2);
            ctx.fill();
        } else {
            // Core
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(0, 0, 2, 0, Math.PI * 2);
            ctx.fill();
        }

        // Draw Cooldown Ring if recovering (Visual aid on player)
        if (dashCooldownRef.current > 0 && !isDashing) {
            const pct = 1 - (dashCooldownRef.current / Constants.PLAYER_DASH_COOLDOWN);
            ctx.strokeStyle = `rgba(255, 255, 255, 0.5)`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(0, 0, 15, -Math.PI/2, (-Math.PI/2) + (Math.PI * 2 * pct));
            ctx.stroke();
        }

        ctx.restore();
    }

    // 6. Update Stats
    // Only run normal updates if game is NOT over.
    // If game IS over, we handled the state update explicitly in the collision block above.
    if ((frameRef.current % 5 === 0 || !pattern) && !isGameOverRef.current) {
        setGameState({ 
            bulletCount: bulletsRef.current.length, 
            fps,
            score: scoreRef.current * 10,
            isGameOver: isGameOverRef.current,
            timeSurvived: Math.floor(scoreRef.current / 60),
            dashCooldown: Math.max(0, 1 - (dashCooldownRef.current / Constants.PLAYER_DASH_COOLDOWN))
        });
    }

    requestRef.current = requestAnimationFrame(update);
  }, [canvasRef, pattern, isPlaying, spawnBullets]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(update);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [update]);

  return { 
      gameState, 
      resetGame 
  };
};