export const CANVAS_WIDTH = 600;
export const CANVAS_HEIGHT = 800;

export const DEFAULT_PATTERN_PROMPT = "赛博朋克霓虹雨";

export const DIFFICULTY_COLORS = {
  Easy: 'text-[#39ff14] border-[#39ff14] drop-shadow-[0_0_5px_#39ff14]',
  Normal: 'text-[#00ffff] border-[#00ffff] drop-shadow-[0_0_5px_#00ffff]',
  Hard: 'text-[#fcee0a] border-[#fcee0a] drop-shadow-[0_0_5px_#fcee0a]',
  Lunatic: 'text-[#ff00ff] border-[#ff00ff] drop-shadow-[0_0_8px_#ff00ff]',
};

// Player Constants
export const PLAYER_SPEED = 5;
export const PLAYER_FOCUS_SPEED = 2.5;
export const PLAYER_DASH_SPEED = 12; // Fast movement
export const PLAYER_DASH_DURATION = 15; // Frames (~0.25s)
export const PLAYER_DASH_COOLDOWN = 120; // Frames (~2s)

export const PLAYER_HITBOX_RADIUS = 3; // The actual kill zone (very small)
export const PLAYER_VISUAL_RADIUS = 8;
export const PLAYER_START_X = CANVAS_WIDTH / 2;
export const PLAYER_START_Y = CANVAS_HEIGHT - 100;