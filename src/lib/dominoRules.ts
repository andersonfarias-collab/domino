import { DominoTile, GameState, GameMove, Player, PlayedTile, GameBoard } from "@/types/game";

// Generate all domino tiles (0-0 to 6-6)
export const generateAllDominoes = (): DominoTile[] => {
  const dominoes: DominoTile[] = [];
  let id = 0;
  
  for (let i = 0; i <= 6; i++) {
    for (let j = i; j <= 6; j++) {
      dominoes.push({
        id: `domino-${id++}`,
        top: i,
        bottom: j,
      });
    }
  }
  
  return dominoes;
};

// Shuffle array using Fisher-Yates algorithm
export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Deal tiles to players
export const dealTiles = (players: Player[], tilesPerPlayer: number = 7): { players: Player[], boneyard: DominoTile[] } => {
  const allDominoes = shuffleArray(generateAllDominoes());
  const totalTilesNeeded = players.length * tilesPerPlayer;
  
  const updatedPlayers = players.map((player, index) => ({
    ...player,
    tiles: allDominoes.slice(index * tilesPerPlayer, (index + 1) * tilesPerPlayer)
  }));
  
  const boneyard = allDominoes.slice(totalTilesNeeded);
  
  return { players: updatedPlayers, boneyard };
};

// Find player with highest double to start
export const findStartingPlayer = (players: Player[]): number => {
  let highestDouble = -1;
  let startingPlayerIndex = 0;
  
  players.forEach((player, playerIndex) => {
    player.tiles.forEach(tile => {
      if (tile.top === tile.bottom && tile.top > highestDouble) {
        highestDouble = tile.top;
        startingPlayerIndex = playerIndex;
      }
    });
  });
  
  // If no doubles found, find highest tile value
  if (highestDouble === -1) {
    let highestValue = -1;
    players.forEach((player, playerIndex) => {
      player.tiles.forEach(tile => {
        const tileValue = tile.top + tile.bottom;
        if (tileValue > highestValue) {
          highestValue = tileValue;
          startingPlayerIndex = playerIndex;
        }
      });
    });
  }
  
  return startingPlayerIndex;
};

// Check if a tile can be played on the board
export const canPlayTile = (tile: DominoTile, board: GameBoard): { canPlay: boolean, positions: ('left' | 'right')[] } => {
  if (board.tiles.length === 0) {
    return { canPlay: true, positions: ['left'] };
  }
  
  const positions: ('left' | 'right')[] = [];
  
  // Check left end
  if (tile.top === board.leftEnd || tile.bottom === board.leftEnd) {
    positions.push('left');
  }
  
  // Check right end
  if (tile.top === board.rightEnd || tile.bottom === board.rightEnd) {
    positions.push('right');
  }
  
  return { canPlay: positions.length > 0, positions };
};

// Get valid moves for a player
export const getValidMoves = (player: Player, board: GameBoard): { tile: DominoTile, positions: ('left' | 'right')[] }[] => {
  return player.tiles
    .map(tile => ({ tile, ...canPlayTile(tile, board) }))
    .filter(move => move.canPlay)
    .map(move => ({ tile: move.tile, positions: move.positions }));
};

// Play a tile on the board
export const playTile = (tile: DominoTile, position: 'left' | 'right', board: GameBoard, playerId: string): GameBoard => {
  const newTile: PlayedTile = {
    ...tile,
    playerId,
    position: board.tiles.length,
    isFlipped: false
  };
  
  let newLeftEnd = board.leftEnd;
  let newRightEnd = board.rightEnd;
  let tiles = [...board.tiles];
  
  if (board.tiles.length === 0) {
    // First tile
    tiles = [newTile];
    newLeftEnd = tile.top;
    newRightEnd = tile.bottom;
  } else if (position === 'left') {
    // Add to left end
    if (tile.bottom === board.leftEnd) {
      newLeftEnd = tile.top;
    } else if (tile.top === board.leftEnd) {
      newLeftEnd = tile.bottom;
      newTile.isFlipped = true;
    }
    tiles.unshift(newTile);
  } else {
    // Add to right end
    if (tile.top === board.rightEnd) {
      newRightEnd = tile.bottom;
    } else if (tile.bottom === board.rightEnd) {
      newRightEnd = tile.top;
      newTile.isFlipped = true;
    }
    tiles.push(newTile);
  }
  
  return {
    tiles,
    leftEnd: newLeftEnd,
    rightEnd: newRightEnd
  };
};

// Remove tile from player's hand
export const removeTileFromPlayer = (player: Player, tileId: string): Player => {
  return {
    ...player,
    tiles: player.tiles.filter(tile => tile.id !== tileId)
  };
};

// Check if game is over
export const checkGameOver = (players: Player[], validMovesExist: boolean): { isOver: boolean, winner: string | null, reason: string } => {
  // Check if any player has no tiles left
  const playerWithNoTiles = players.find(player => player.tiles.length === 0);
  if (playerWithNoTiles) {
    return {
      isOver: true,
      winner: playerWithNoTiles.id,
      reason: 'no_tiles'
    };
  }
  
  // Check if game is blocked (no valid moves)
  if (!validMovesExist) {
    // Find player with lowest tile sum
    const playerSums = players.map(player => ({
      id: player.id,
      sum: player.tiles.reduce((sum, tile) => sum + tile.top + tile.bottom, 0)
    }));
    
    const lowestSum = Math.min(...playerSums.map(p => p.sum));
    const winner = playerSums.find(p => p.sum === lowestSum);
    
    return {
      isOver: true,
      winner: winner?.id || null,
      reason: 'blocked'
    };
  }
  
  return { isOver: false, winner: null, reason: '' };
};

// Simple AI strategy
export const getAIMove = (player: Player, board: GameBoard): GameMove | null => {
  const validMoves = getValidMoves(player, board);
  
  if (validMoves.length === 0) {
    return null;
  }
  
  // Strategy: Play the tile with highest points first, prefer doubles
  const bestMove = validMoves.reduce((best, current) => {
    const currentValue = current.tile.top + current.tile.bottom;
    const bestValue = best.tile.top + best.tile.bottom;
    const currentIsDouble = current.tile.top === current.tile.bottom;
    const bestIsDouble = best.tile.top === best.tile.bottom;
    
    if (currentIsDouble && !bestIsDouble) return current;
    if (!currentIsDouble && bestIsDouble) return best;
    if (currentValue > bestValue) return current;
    
    return best;
  });
  
  return {
    tile: bestMove.tile,
    position: bestMove.positions[0], // Take first available position
  };
};

// Calculate player score (sum of remaining tiles)
export const calculatePlayerScore = (player: Player): number => {
  return player.tiles.reduce((sum, tile) => sum + tile.top + tile.bottom, 0);
};