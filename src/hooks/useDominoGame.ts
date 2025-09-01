import { useState, useCallback, useEffect } from "react";
import { GameState, Player, GameMove, DominoTile } from "@/types/game";
import { 
  dealTiles, 
  findStartingPlayer, 
  getValidMoves, 
  playTile, 
  removeTileFromPlayer, 
  checkGameOver,
  getAIMove,
  calculatePlayerScore
} from "@/lib/dominoRules";
import { useToast } from "@/hooks/use-toast";

export const useDominoGame = (playerName: string = "Jogador") => {
  const { toast } = useToast();
  
  const [gameState, setGameState] = useState<GameState>({
    players: [],
    currentPlayerIndex: 0,
    board: { tiles: [], leftEnd: 0, rightEnd: 0 },
    status: 'waiting',
    winner: null,
    boneyard: [],
    lastMove: null,
    passCount: 0
  });

  const [selectedTile, setSelectedTile] = useState<string | null>(null);

  // Initialize game
  const startNewGame = useCallback(() => {
    const players: Player[] = [
      { id: "player", name: playerName, tiles: [], isAI: false },
      { id: "ai", name: "IA", tiles: [], isAI: true }
    ];

    const { players: playersWithTiles, boneyard } = dealTiles(players);
    const startingPlayerIndex = findStartingPlayer(playersWithTiles);

    setGameState({
      players: playersWithTiles,
      currentPlayerIndex: startingPlayerIndex,
      board: { tiles: [], leftEnd: 0, rightEnd: 0 },
      status: 'playing',
      winner: null,
      boneyard,
      lastMove: null,
      passCount: 0
    });

    setSelectedTile(null);

    const startingPlayer = playersWithTiles[startingPlayerIndex];
    toast({
      title: "Novo jogo iniciado!",
      description: `${startingPlayer.name} começa a partida.`,
    });
  }, [playerName, toast]);

  // Check if current player can make any moves
  const canCurrentPlayerMove = useCallback((): boolean => {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    if (!currentPlayer) return false;
    
    const validMoves = getValidMoves(currentPlayer, gameState.board);
    return validMoves.length > 0;
  }, [gameState]);

  // Pass turn to next player
  const passTurn = useCallback(() => {
    setGameState(prev => {
      const nextPlayerIndex = (prev.currentPlayerIndex + 1) % prev.players.length;
      const newPassCount = prev.passCount + 1;
      
      // Check if all players passed (game blocked)
      if (newPassCount >= prev.players.length) {
        const gameOver = checkGameOver(prev.players, false);
        return {
          ...prev,
          status: 'blocked' as const,
          winner: gameOver.winner,
          passCount: newPassCount
        };
      }
      
      return {
        ...prev,
        currentPlayerIndex: nextPlayerIndex,
        passCount: newPassCount
      };
    });

    toast({
      title: "Jogada passada",
      description: "Não há jogadas válidas disponíveis.",
    });
  }, [toast]);

  // Make a move
  const makeMove = useCallback((tile: DominoTile, position: 'left' | 'right') => {
    if (gameState.status !== 'playing') return false;

    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    if (!currentPlayer || currentPlayer.isAI) return false;

    const validMoves = getValidMoves(currentPlayer, gameState.board);
    const validMove = validMoves.find(move => 
      move.tile.id === tile.id && move.positions.includes(position)
    );

    if (!validMove) {
      toast({
        title: "Jogada inválida",
        description: "Esta peça não pode ser jogada nesta posição.",
        variant: "destructive"
      });
      return false;
    }

    setGameState(prev => {
      const newBoard = playTile(tile, position, prev.board, currentPlayer.id);
      const updatedPlayer = removeTileFromPlayer(currentPlayer, tile.id);
      const updatedPlayers = prev.players.map(p => 
        p.id === currentPlayer.id ? updatedPlayer : p
      );

      // Check if game is over
      const gameOver = checkGameOver(updatedPlayers, true);
      
      return {
        ...prev,
        players: updatedPlayers,
        board: newBoard,
        currentPlayerIndex: gameOver.isOver ? prev.currentPlayerIndex : (prev.currentPlayerIndex + 1) % prev.players.length,
        status: gameOver.isOver ? 'finished' : 'playing',
        winner: gameOver.winner,
        lastMove: { playerId: currentPlayer.id, tile, position },
        passCount: 0 // Reset pass count on successful move
      };
    });

    setSelectedTile(null);
    return true;
  }, [gameState, toast]);

  // AI move logic
  const makeAIMove = useCallback(() => {
    if (gameState.status !== 'playing') return;

    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    if (!currentPlayer || !currentPlayer.isAI) return;

    const aiMove = getAIMove(currentPlayer, gameState.board);
    
    if (!aiMove) {
      // AI cannot move, pass turn
      setTimeout(() => passTurn(), 1000);
      return;
    }

    setTimeout(() => {
      setGameState(prev => {
        const newBoard = playTile(aiMove.tile, aiMove.position, prev.board, currentPlayer.id);
        const updatedPlayer = removeTileFromPlayer(currentPlayer, aiMove.tile.id);
        const updatedPlayers = prev.players.map(p => 
          p.id === currentPlayer.id ? updatedPlayer : p
        );

        // Check if game is over
        const gameOver = checkGameOver(updatedPlayers, true);
        
        return {
          ...prev,
          players: updatedPlayers,
          board: newBoard,
          currentPlayerIndex: gameOver.isOver ? prev.currentPlayerIndex : (prev.currentPlayerIndex + 1) % prev.players.length,
          status: gameOver.isOver ? 'finished' : 'playing',
          winner: gameOver.winner,
          lastMove: { playerId: currentPlayer.id, tile: aiMove.tile, position: aiMove.position },
          passCount: 0
        };
      });

      toast({
        title: "IA jogou",
        description: `IA jogou ${aiMove.tile.top}-${aiMove.tile.bottom}`,
      });
    }, 1500);
  }, [gameState, passTurn, toast]);

  // Handle AI turns
  useEffect(() => {
    if (gameState.status === 'playing') {
      const currentPlayer = gameState.players[gameState.currentPlayerIndex];
      if (currentPlayer && currentPlayer.isAI) {
        makeAIMove();
      }
    }
  }, [gameState.currentPlayerIndex, gameState.status, makeAIMove]);

  // Get current player
  const getCurrentPlayer = useCallback(() => {
    return gameState.players[gameState.currentPlayerIndex];
  }, [gameState]);

  // Get player by ID
  const getPlayer = useCallback((id: string) => {
    return gameState.players.find(p => p.id === id);
  }, [gameState.players]);

  // Get game statistics
  const getGameStats = useCallback(() => {
    return {
      totalTilesPlayed: gameState.board.tiles.length,
      boneyardSize: gameState.boneyard.length,
      playerScores: gameState.players.map(player => ({
        id: player.id,
        name: player.name,
        tilesLeft: player.tiles.length,
        score: calculatePlayerScore(player)
      }))
    };
  }, [gameState]);

  return {
    gameState,
    selectedTile,
    setSelectedTile,
    startNewGame,
    makeMove,
    passTurn,
    canCurrentPlayerMove,
    getCurrentPlayer,
    getPlayer,
    getGameStats,
    // Computed values
    isPlayerTurn: !getCurrentPlayer()?.isAI,
    validMoves: getCurrentPlayer() ? getValidMoves(getCurrentPlayer(), gameState.board) : []
  };
};