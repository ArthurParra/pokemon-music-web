import { Clock, Gamepad2, Music } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatTotalDuration } from '@/lib/format';
import type { PokemonMusic } from '@/types/pokemon-music';

interface StatsCardsProps {
  musics: PokemonMusic[];
  isLoading: boolean;
}

interface Stat {
  title: string;
  value: string;
  icon: LucideIcon;
}

export default function StatsCards({ musics, isLoading }: StatsCardsProps) {
  const totalSeconds = musics.reduce((sum, music) => sum + music.duration, 0);
  const distinctGames = new Set(musics.map((music) => music.game)).size;

  const stats: Stat[] = [
    { title: 'Total de músicas', value: String(musics.length), icon: Music },
    { title: 'Jogos diferentes', value: String(distinctGames), icon: Gamepad2 },
    { title: 'Duração total', value: formatTotalDuration(totalSeconds), icon: Clock },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {stats.map(({ title, value, icon: Icon }) => (
        <Card key={title}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-sm font-medium text-muted-foreground">
              {title}
              <Icon className="h-4 w-4" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <p className="text-2xl font-bold">{value}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
