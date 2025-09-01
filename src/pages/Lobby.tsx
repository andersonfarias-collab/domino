import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Bot, Users, Crown, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Lobby = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [roomCode, setRoomCode] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [copied, setCopied] = useState(false);

  const generateRoomCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const createRoom = () => {
    const code = generateRoomCode();
    setRoomCode(code);
    toast({
      title: "Sala criada!",
      description: `Código da sala: ${code}`,
    });
  };

  const joinRoom = () => {
    if (!roomCode.trim()) {
      toast({
        title: "Erro",
        description: "Digite o código da sala.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Entrando na sala...",
      description: `Código: ${roomCode}`,
    });
  };

  const copyRoomCode = async () => {
    try {
      await navigator.clipboard.writeText(roomCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Código copiado!",
        description: "Compartilhe com seus amigos.",
      });
    } catch (err) {
      toast({
        title: "Erro ao copiar",
        description: "Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Background gradient */}
      <div 
        className="fixed inset-0 opacity-20"
        style={{ background: "var(--gradient-hero)" }}
      />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="text-foreground hover:text-primary mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-2">Escolha seu Jogo</h1>
            <p className="text-xl text-muted-foreground">
              Jogue contra IA ou desafie amigos
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto grid gap-8 md:grid-cols-2">
          {/* Play vs AI */}
          <Card className="bg-card/90 backdrop-blur-sm border-game-table-border">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Bot className="w-8 h-8 text-primary" />
                <div>
                  <CardTitle className="text-2xl">Jogar vs IA</CardTitle>
                  <CardDescription>
                    Desafie nossa inteligência artificial
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="player-name">Seu nome</Label>
                <Input
                  id="player-name"
                  placeholder="Digite seu nome"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                />
              </div>
              <Button 
                onClick={() => navigate("/game")}
                className="w-full"
                size="lg"
              >
                <Bot className="w-4 h-4 mr-2" />
                Começar Partida
              </Button>
            </CardContent>
          </Card>

          {/* Multiplayer */}
          <Card className="bg-card/90 backdrop-blur-sm border-game-table-border">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Users className="w-8 h-8 text-primary" />
                <div>
                  <CardTitle className="text-2xl">Multijogador</CardTitle>
                  <CardDescription>
                    Jogue com até 3 amigos online
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {!roomCode ? (
                <>
                  <Button 
                    onClick={createRoom}
                    className="w-full"
                    size="lg"
                    variant="outline"
                  >
                    <Crown className="w-4 h-4 mr-2" />
                    Criar Sala
                  </Button>
                  
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-2 text-muted-foreground">
                        ou
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="room-code">Código da sala</Label>
                    <Input
                      id="room-code"
                      placeholder="Digite o código"
                      value={roomCode}
                      onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                    />
                  </div>
                  
                  <Button 
                    onClick={joinRoom}
                    className="w-full"
                    size="lg"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Entrar na Sala
                  </Button>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="text-center p-6 bg-game-table/20 rounded-lg">
                    <h3 className="text-xl font-semibold mb-2">Sala Criada!</h3>
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <code className="text-2xl font-mono bg-muted px-4 py-2 rounded">
                        {roomCode}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={copyRoomCode}
                      >
                        {copied ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Compartilhe este código com seus amigos
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Jogadores na sala</Label>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                        <Crown className="w-4 h-4 text-primary" />
                        <span>Você (Host)</span>
                      </div>
                      <div className="text-sm text-muted-foreground text-center py-4">
                        Aguardando outros jogadores...
                      </div>
                    </div>
                  </div>

                  <Button 
                    onClick={() => navigate("/game")}
                    className="w-full"
                    size="lg"
                    disabled
                  >
                    Aguardando jogadores...
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Lobby;