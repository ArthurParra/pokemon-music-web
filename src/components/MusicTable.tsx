import { Music, Pencil, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatDuration } from '@/lib/format';
import { CATEGORY_LABELS } from '@/types/pokemon-music';
import type { PokemonMusic } from '@/types/pokemon-music';

interface MusicTableProps {
  musics: PokemonMusic[];
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
  onCreate: () => void;
  onEdit: (music: PokemonMusic) => void;
  onDelete: (music: PokemonMusic) => void;
}

export default function MusicTable({
  musics,
  isLoading,
  error,
  onRetry,
  onCreate,
  onEdit,
  onDelete,
}: MusicTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Catálogo</CardTitle>
        <CardDescription>Todas as músicas cadastradas na API.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="space-y-3" aria-busy="true" aria-label="Carregando músicas">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-10 w-full" />
            ))}
          </div>
        )}

        {!isLoading && error && (
          <div className="flex flex-col items-center gap-3 py-10 text-center">
            <p className="font-medium">Não foi possível carregar as músicas</p>
            <p className="text-sm text-muted-foreground">{error}</p>
            <Button variant="outline" onClick={onRetry}>
              Tentar novamente
            </Button>
          </div>
        )}

        {!isLoading && !error && musics.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-12 text-center">
            <Music className="h-10 w-10 text-muted-foreground" />
            <p className="font-medium">Nenhuma música cadastrada</p>
            <p className="text-sm text-muted-foreground">
              Comece cadastrando a primeira trilha sonora do catálogo.
            </p>
            <Button onClick={onCreate}>Cadastrar música</Button>
          </div>
        )}

        {!isLoading && !error && musics.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Compositor</TableHead>
                <TableHead>Jogo</TableHead>
                <TableHead>Geração</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Duração</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {musics.map((music) => (
                <TableRow key={music.id}>
                  <TableCell className="font-medium">{music.title}</TableCell>
                  <TableCell>{music.composer}</TableCell>
                  <TableCell>{music.game}</TableCell>
                  <TableCell>{music.generation}ª</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{CATEGORY_LABELS[music.category]}</Badge>
                  </TableCell>
                  <TableCell>{formatDuration(music.duration)}</TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => onEdit(music)}>
                        <Pencil />
                        Editar
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => onDelete(music)}>
                        <Trash2 />
                        Excluir
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
