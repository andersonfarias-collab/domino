import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GameTable } from "@/components/GameTable";
import { Domino } from "@/components/Domino";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Users, Bot, SkipForward, Trophy } from "lucide-react";
import { useDominoGame } from "@/hooks/useDominoGame";
import { canPlayTile } from "@/lib/dominoRules";
import { cn } from "@/lib/utils";

const Game = () => {
  const navigate = useNavigate();
  const {
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
    isPlayerTurn,
    validMoves
  } = useDominoGame();

  const [showValidPositions, setShowValidPositions] = useState(false);
  const humanPlayer = getPlayer("player");
  const aiPlayer = getPlayer("ai");
  const stats = getGameStats();

  useEffect(() => {
    if (gameState.status === 'waiting') {
      startNewGame();
    }
  }, [gameState.status, startNewGame]);

  const handleTileClick = (tileId: string) => {
    if (!isPlayerTurn || gameState.status !== 'playing') return;

    if (selectedTile === tileId) {
      // Deselect tile
      setSelectedTile(null);
      setShowValidPositions(false);
    } else {
      // Select tile and show valid positions
      setSelectedTile(tileId);
      const tile = humanPlayer?.tiles.find(t => t.id === tileId);
      if (tile) {
        const { canPlay } = canPlayTile(tile, gameState.board);
        setShowValidPositions(canPlay);
      }
    }
  };

  const handleBoardClick = (position: 'left' | 'right') => {
    if (!selectedTile || !isPlayerTurn) return;

    const tile = humanPlayer?.tiles.find(t => t.id === selectedTile);
    if (tile) {
      const success = makeMove(tile, position);
      if (success) {
        setShowValidPositions(false);
      }
    }
  };

  const renderBoardTile = (tile: any, index: number) => {
    const isHorizontal = index % 2 === 0;
    return (
      <Domino
        key={tile.id}
        topDots={tile.isFlipped ? tile.bottom : tile.top}
        bottomDots={tile.isFlipped ? tile.top : tile.bottom}
        isHorizontal={isHorizontal}
        className="mx-1"
      />
    );
  };

  const getGameStatusMessage = () => {
    switch (gameState.status) {
      case 'playing':
        return isPlayerTurn ? "Sua vez!" : "Vez da IA...";
      case 'finished':
        const winner = getPlayer(gameState.winner || "");
        return winner ? `${winner.name} venceu!` : "Empate!";
      case 'blocked':
        const winner2 = getPlayer(gameState.winner || "");
        return `Jogo travado! ${winner2 ? winner2.name + ' venceu!' : 'Empate!'}`;
      default:
        return "Aguarde...";
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="text-foreground hover:text-primary"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <Badge variant={isPlayerTurn ? "default" : "secondary"}>
                Você: {humanPlayer?.tiles.length || 0}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-muted-foreground" />
              <Badge variant={!isPlayerTurn && gameState.status === 'playing' ? "default" : "secondary"}>
                IA: {aiPlayer?.tiles.length || 0}
              </Badge>
            </div>
            {gameState.boneyard.length > 0 && (
              <div className="text-sm text-muted-foreground">
                Monte: {gameState.boneyard.length}
              </div>
            )}
          </div>

          <div className="flex gap-2">
            {isPlayerTurn && !canCurrentPlayerMove() && gameState.status === 'playing' && (
              <Button onClick={passTurn} variant="outline" size="sm">
                <SkipForward className="w-4 h-4 mr-2" />
                Passar
              </Button>
            )}
            <Button onClick={startNewGame} variant="outline">
              Novo Jogo
            </Button>
          </div>
        </div>
      </div>

      {/* Game Area */}
      <div className="max-w-7xl mx-auto">
        <GameTable>
          {/* Board */}
          <div className="flex justify-center items-center mb-8">
            <div className="relative">
              {/* Valid position indicators */}
              {showValidPositions && selectedTile && gameState.board.tiles.length > 0 && (
                <>
                  <button
                    onClick={() => handleBoardClick('left')}
                    className="absolute -left-16 top-1/2 -translate-y-1/2 w-12 h-12 bg-primary/20 border-2 border-primary border-dashed rounded-lg flex items-center justify-center hover:bg-primary/30 transition-colors"
                  >
                    <span className="text-xs font-semibold text-primary">L</span>
                  </button>
                  <button
                    onClick={() => handleBoardClick('right')}
                    className="absolute -right-16 top-1/2 -translate-y-1/2 w-12 h-12 bg-primary/20 border-2 border-primary border-dashed rounded-lg flex items-center justify-center hover:bg-primary/30 transition-colors"
                  >
                    <span className="text-xs font-semibold text-primary">R</span>
                  </button>
                </>
              )}
              
              <div className="flex flex-wrap gap-2 p-6 bg-game-table/30 rounded-lg min-h-[120px] min-w-[300px] max-w-5xl">
                {gameState.board.tiles.length === 0 ? (
                  <div className="w-full text-center text-muted-foreground py-8">
                    {selectedTile && gameState.board.tiles.length === 0 ? (
                      <button
                        onClick={() => handleBoardClick('left')}
                        className="px-6 py-3 bg-primary/20 border-2 border-primary border-dashed rounded-lg hover:bg-primary/30 transition-colors"
                      >
                        Clique para jogar a primeira peça
                      </button>
                    ) : (
                      "Selecione uma peça para começar"
                    )}
                  </div>
                ) : (
                  gameState.board.tiles.map((tile, index) => renderBoardTile(tile, index))
                )}
              </div>
              
              {/* Board ends display */}
              {gameState.board.tiles.length > 0 && (
                <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                  <span>Esquerda: {gameState.board.leftEnd}</span>
                  <span>Direita: {gameState.board.rightEnd}</span>
                </div>
              )}
            </div>
          </div>

          {/* Game Status */}
          <div className="text-center mb-6">
            <Card className="inline-block px-6 py-3 bg-card/90">
              <div className="flex items-center gap-3">
                {gameState.status === 'finished' && (
                  <Trophy className="w-5 h-5 text-primary" />
                )}
                <p className="text-lg font-semibold">
                  {getGameStatusMessage()}
                </p>
              </div>
              {gameState.status === 'finished' && (
                <div className="mt-2 text-sm text-muted-foreground">
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    {stats.playerScores.map(player => (
                      <div key={player.id} className="text-center">
                        <div className="font-medium">{player.name}</div>
                        <div className="text-xs">
                          Peças: {player.tilesLeft} | Pontos: {player.score}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </div>
        </GameTable>

        {/* Player Hand */}
        <div className="mt-6 p-6 bg-card/50 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Suas Peças</h3>
            {selectedTile && (
              <p className="text-sm text-muted-foreground">
                Peça selecionada - {gameState.board.tiles.length === 0 ? 'clique no tabuleiro' : 'clique em L ou R'}
              </p>
            )}
          </div>
          
          <div className="flex flex-wrap justify-center gap-3">
            {humanPlayer?.tiles.map((tile) => {
              const isValidTile = validMoves.some(move => move.tile.id === tile.id);
              const isSelected = selectedTile === tile.id;
              
              return (
                <div key={tile.id} className="relative">
                  <Domino
                    topDots={tile.top}
                    bottomDots={tile.bottom}
                    isSelected={isSelected}
                    onClick={() => handleTileClick(tile.id)}
                    className={cn(
                      "transition-all duration-200",
                      isPlayerTurn && isValidTile 
                        ? "hover:scale-110 cursor-pointer" 
                        : "opacity-70 cursor-not-allowed",
                      isSelected && "ring-2 ring-primary ring-offset-2"
                    )}
                  />
                  {isValidTile && isPlayerTurn && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full"></div>
                  )}
                </div>
              );
            }) || []}
          </div>
          
          {!isPlayerTurn && gameState.status === 'playing' && (
            <p className="text-center mt-4 text-sm text-muted-foreground">
              Aguarde sua vez...
            </p>
          )}
          
          {isPlayerTurn && validMoves.length === 0 && gameState.status === 'playing' && (
            <p className="text-center mt-4 text-sm text-destructive">
              Nenhuma jogada válida disponível - clique em "Passar"
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Game;