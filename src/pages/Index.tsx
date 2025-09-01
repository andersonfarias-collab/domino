import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Domino } from "@/components/Domino";
import { Play, Users, Bot, Trophy, Crown } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Background */}
      <div 
        className="fixed inset-0 opacity-30"
        style={{ background: "var(--gradient-hero)" }}
      />
      
      <div className="relative z-10">
        {/* Header */}
        <header className="container mx-auto px-4 py-6">
          <nav className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex gap-1">
                <Domino topDots={6} bottomDots={1} className="w-6 h-12" />
                <Domino topDots={3} bottomDots={4} className="w-6 h-12" />
              </div>
              <h1 className="text-2xl font-bold">Dominó Online</h1>
            </div>
            
            <Button variant="outline" className="border-primary/50 hover:bg-primary/10">
              Entrar com Google
            </Button>
          </nav>
        </header>

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Dominó Clássico
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Desafie amigos ou enfrente nossa IA em partidas emocionantes do jogo de dominó mais amado do Brasil
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                size="lg" 
                onClick={() => navigate("/lobby")}
                className="text-lg px-8 py-4"
                style={{ boxShadow: "var(--shadow-elegant)" }}
              >
                <Play className="w-5 h-5 mr-2" />
                Jogar Agora
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => navigate("/lobby")}
                className="text-lg px-8 py-4 border-primary/50 hover:bg-primary/10"
              >
                <Users className="w-5 h-5 mr-2" />
                Criar Sala
              </Button>
            </div>

            {/* Decorative dominoes */}
            <div className="flex justify-center gap-4 mb-20">
              <Domino topDots={6} bottomDots={6} className="animate-pulse" />
              <Domino topDots={5} bottomDots={4} isHorizontal className="animate-pulse delay-100" />
              <Domino topDots={3} bottomDots={2} className="animate-pulse delay-200" />
              <Domino topDots={1} bottomDots={0} isHorizontal className="animate-pulse delay-300" />
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="container mx-auto px-4 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Modos de Jogo</h2>
            <p className="text-xl text-muted-foreground">
              Escolha sua forma favorita de jogar
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="bg-card/80 backdrop-blur-sm border-game-table-border hover:bg-card/90 transition-all duration-300">
              <CardContent className="p-8 text-center">
                <Bot className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-semibold mb-3">Contra IA</h3>
                <p className="text-muted-foreground mb-6">
                  Enfrente nossa inteligência artificial com diferentes níveis de dificuldade
                </p>
                <Button 
                  onClick={() => navigate("/game")}
                  className="w-full"
                >
                  Jogar vs IA
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-card/80 backdrop-blur-sm border-game-table-border hover:bg-card/90 transition-all duration-300">
              <CardContent className="p-8 text-center">
                <Users className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-semibold mb-3">Multijogador</h3>
                <p className="text-muted-foreground mb-6">
                  Jogue com até 3 amigos online em tempo real
                </p>
                <Button 
                  onClick={() => navigate("/lobby")}
                  variant="outline"
                  className="w-full border-primary/50 hover:bg-primary/10"
                >
                  Criar Sala
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-card/80 backdrop-blur-sm border-game-table-border hover:bg-card/90 transition-all duration-300">
              <CardContent className="p-8 text-center">
                <Trophy className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-semibold mb-3">Torneios</h3>
                <p className="text-muted-foreground mb-6">
                  Participe de torneios e conquiste o topo do ranking
                </p>
                <Button 
                  variant="outline"
                  className="w-full border-primary/50 hover:bg-primary/10"
                  disabled
                >
                  Em Breve
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* How to Play */}
        <section className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-8">Como Jogar</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <h3 className="text-xl font-semibold">Distribua as Peças</h3>
                <p className="text-muted-foreground">
                  Cada jogador recebe 7 peças de dominó aleatoriamente
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-2xl font-bold text-primary">2</span>
                </div>
                <h3 className="text-xl font-semibold">Faça a Jogada</h3>
                <p className="text-muted-foreground">
                  Conecte as peças pelas pontas com números iguais
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                  <Crown className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Vença o Jogo</h3>
                <p className="text-muted-foreground">
                  O primeiro a jogar todas as peças ou com menor soma vence
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border/50 mt-20">
          <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
            <p>&copy; 2024 Dominó Online. Feito com ❤️ para amantes do dominó.</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;