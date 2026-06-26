export interface ControlBindings {
  left: string;
  right: string;
  jump: string;
  action: string;
}

export const DEFAULT_CONTROLS: ControlBindings = {
  left: 'a',
  right: 'd',
  jump: 'w',
  action: 's',
};

export const CONTROL_LABELS: Record<keyof ControlBindings, string> = {
  left: 'เดินซ้าย (Move Left)',
  right: 'เดินขวา (Move Right)',
  jump: 'เดินขึ้น / เดินหน้า (Move Up / Forward)',
  action: 'เดินลง / เดินถอยหลัง (Move Down / Backward)',
};

export type GameState = 'MENU' | 'OPTIONS' | 'PLAYING' | 'GAMEOVER' | 'VICTORY';

export interface ScoreBoard {
  score: number;
  highScore: number;
  kratipCollected: number;
  ghostsPacified: number;
}
