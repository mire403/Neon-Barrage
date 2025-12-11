export type Difficulty = 'Easy' | 'Normal' | 'Hard' | 'Lunatic';

export type EmitterType = 'ring' | 'spiral' | 'spread' | 'aimed' | 'flower' | 'random';
export type BulletShape = 'circle' | 'diamond' | 'star' | 'rect';

export interface EmitterConfig {
  type: EmitterType;
  frequency: number; // Frames between shots
  bulletCount: number; // Bullets per shot
  speed: number;
  speedVariance?: number;
  angleOffset: number; // Starting angle in degrees
  angleIncrement: number; // Rotation per frame (for spiral/spin)
  color: string;
  shape: BulletShape;
  size: number;
  lifetime?: number; // Frames the emitter is active
  delay?: number; // Frames before starting
}

export interface PatternConfig {
  name: string;
  description: string;
  difficulty: Difficulty;
  emitters: EmitterConfig[];
}

export interface Bullet {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  shape: BulletShape;
  size: number;
  rotation: number;
  rotationSpeed: number;
}

export interface GameState {
  bulletCount: number;
  fps: number;
  score: number;
  isGameOver: boolean;
  timeSurvived: number; // in seconds
  dashCooldown: number; // 0 to 1 normalized
}

export interface GameStats {
  bulletCount: number;
  fps: number;
}
