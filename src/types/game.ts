export interface DominoTile {
  id: string;
  top: number;
  bottom: number;
}

export interface Player {
  id: string;
  name: string;
  tiles: DominoTile[];
  isAI: boolean;
}

export interface PlayedTile extends DominoTile {
  playerId: string;
  position: number;
  isFlipped?: boolean;
}

export interface GameBoard {
  tiles: PlayedTile[];
  leftEnd: number;
  rightEnd: number;
}

export type GameStatus = 'waiting' | 'playing' | 'finished' | 'blocked';

export interface GameState {
  players: Player[];
  currentPlayerIndex: number;
  board: GameBoard;
  status: GameStatus;
  winner: string | null;
  boneyard: DominoTile[];
  lastMove: {
    playerId: string;
    tile: DominoTile;
    position: 'left' | 'right';
  } | null;
  passCount: number;
}

export interface GameMove {
  tile: DominoTile;
  position: 'left' | 'right';
  flip?: boolean;
}

export interface GameRules {
  maxPlayers: number;
  tilesPerPlayer: number;
  canDrawFromBoneyard: boolean;
  maxBoneyardDraw: number;
}