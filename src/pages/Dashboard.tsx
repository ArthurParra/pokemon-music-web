import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import DeleteMusicDialog from '@/components/DeleteMusicDialog';
import MusicFormDialog from '@/components/MusicFormDialog';
import MusicTable from '@/components/MusicTable';
import StatsCards from '@/components/StatsCards';
import { Button } from '@/components/ui/button';
import {
  createMusic,
  deleteMusic,
  listMusics,
  updateMusic,
} from '@/services/pokemonMusicService';
import type { PokemonMusic, PokemonMusicInput } from '@/types/pokemon-music';

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Ocorreu um erro inesperado.';
}

export default function Dashboard() {
  const [musics, setMusics] = useState<PokemonMusic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const [formOpen, setFormOpen] = useState(false);
  const [editingMusic, setEditingMusic] = useState<PokemonMusic | null>(null);
  const [musicToDelete, setMusicToDelete] = useState<PokemonMusic | null>(null);

  // GET: carregamento inicial da lista
  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await listMusics();
        if (!cancelled) setMusics(data);
      } catch (error) {
        if (!cancelled) {
          const message = getErrorMessage(error);
          setLoadError(message);
          toast.error(message);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  function handleRetry() {
    setIsLoading(true);
    setLoadError(null);
    setReloadKey((current) => current + 1);
  }

  function openCreate() {
    setEditingMusic(null);
    setFormOpen(true);
  }

  function openEdit(music: PokemonMusic) {
    setEditingMusic(music);
    setFormOpen(true);
  }

  // POST (criar) ou PUT (atualizar)
  async function handleSubmit(data: PokemonMusicInput) {
    try {
      if (editingMusic) {
        const updated = await updateMusic(editingMusic.id, data);
        setMusics((current) => current.map((item) => (item.id === updated.id ? updated : item)));
        toast.success('Música atualizada com sucesso!');
      } else {
        const created = await createMusic(data);
        setMusics((current) => [...current, created]);
        toast.success('Música cadastrada com sucesso!');
      }
      setFormOpen(false);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  }

  // DELETE
  async function handleConfirmDelete() {
    if (!musicToDelete) return;

    try {
      await deleteMusic(musicToDelete.id);
      setMusics((current) => current.filter((item) => item.id !== musicToDelete.id));
      toast.success('Música excluída com sucesso!');
      setMusicToDelete(null);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Músicas dos jogos de Pokémon</h1>
          <p className="text-muted-foreground">
            Catálogo de trilhas sonoras da franquia, conectado à Pokémon Music API.
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus />
          Nova música
        </Button>
      </div>

      <StatsCards musics={musics} isLoading={isLoading} />

      <MusicTable
        musics={musics}
        isLoading={isLoading}
        error={loadError}
        onRetry={handleRetry}
        onCreate={openCreate}
        onEdit={openEdit}
        onDelete={(music) => setMusicToDelete(music)}
      />

      <MusicFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        music={editingMusic}
        onSubmit={handleSubmit}
      />

      <DeleteMusicDialog
        music={musicToDelete}
        onCancel={() => setMusicToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
