import { useState } from 'react';
import type * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CATEGORY_LABELS, MUSIC_CATEGORIES } from '@/types/pokemon-music';
import type { MusicCategory, PokemonMusic, PokemonMusicInput } from '@/types/pokemon-music';

interface FormValues {
  title: string;
  composer: string;
  game: string;
  generation: string;
  category: MusicCategory | '';
  duration: string;
}

type FormErrors = Partial<Record<keyof FormValues, string>>;

type TextField = 'title' | 'composer' | 'game';

const TEXT_FIELDS: { name: TextField; label: string; placeholder: string }[] = [
  { name: 'title', label: 'Título', placeholder: 'Ex.: Pallet Town Theme' },
  { name: 'composer', label: 'Compositor', placeholder: 'Ex.: Junichi Masuda' },
  { name: 'game', label: 'Jogo de origem', placeholder: 'Ex.: Pokémon Red/Blue' },
];

const GENERATIONS = Array.from({ length: 9 }, (_, index) => index + 1);

function toFormValues(music: PokemonMusic | null): FormValues {
  if (!music) {
    return { title: '', composer: '', game: '', generation: '', category: '', duration: '' };
  }
  return {
    title: music.title,
    composer: music.composer,
    game: music.game,
    generation: String(music.generation),
    category: music.category,
    duration: String(music.duration),
  };
}

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};
  if (!values.title.trim()) errors.title = 'Informe o título.';
  if (!values.composer.trim()) errors.composer = 'Informe o compositor.';
  if (!values.game.trim()) errors.game = 'Informe o jogo de origem.';
  if (!values.generation) errors.generation = 'Selecione a geração.';
  if (!values.category) errors.category = 'Selecione a categoria.';

  const duration = Number(values.duration);
  if (!Number.isInteger(duration) || duration <= 0) {
    errors.duration = 'Informe a duração em segundos (número inteiro positivo).';
  }
  return errors;
}

interface MusicFormProps {
  music: PokemonMusic | null;
  onSubmit: (data: PokemonMusicInput) => Promise<void>;
  onCancel: () => void;
}

function MusicForm({ music, onSubmit, onCancel }: MusicFormProps) {
  const [values, setValues] = useState<FormValues>(() => toFormValues(music));
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationErrors = validate(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        title: values.title.trim(),
        composer: values.composer.trim(),
        game: values.game.trim(),
        generation: Number(values.generation),
        category: values.category as MusicCategory,
        duration: Number(values.duration),
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {TEXT_FIELDS.map((field) => (
        <div key={field.name} className="space-y-2">
          <Label htmlFor={field.name}>{field.label}</Label>
          <Input
            id={field.name}
            name={field.name}
            value={values[field.name]}
            onChange={handleChange}
            placeholder={field.placeholder}
            aria-invalid={Boolean(errors[field.name])}
          />
          {errors[field.name] && <p className="text-sm text-destructive">{errors[field.name]}</p>}
        </div>
      ))}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="generation">Geração</Label>
          <Select
            value={values.generation}
            onValueChange={(value) => setValues((current) => ({ ...current, generation: value }))}
          >
            <SelectTrigger
              id="generation"
              className="w-full"
              aria-invalid={Boolean(errors.generation)}
            >
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              {GENERATIONS.map((generation) => (
                <SelectItem key={generation} value={String(generation)}>
                  Geração {generation}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.generation && <p className="text-sm text-destructive">{errors.generation}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Categoria</Label>
          <Select
            value={values.category}
            onValueChange={(value) =>
              setValues((current) => ({ ...current, category: value as MusicCategory }))
            }
          >
            <SelectTrigger id="category" className="w-full" aria-invalid={Boolean(errors.category)}>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              {MUSIC_CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {CATEGORY_LABELS[category]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category && <p className="text-sm text-destructive">{errors.category}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="duration">Duração (em segundos)</Label>
        <Input
          id="duration"
          name="duration"
          type="number"
          min={1}
          value={values.duration}
          onChange={handleChange}
          placeholder="Ex.: 95"
          aria-invalid={Boolean(errors.duration)}
        />
        {errors.duration && <p className="text-sm text-destructive">{errors.duration}</p>}
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Salvando...' : music ? 'Salvar alterações' : 'Cadastrar'}
        </Button>
      </DialogFooter>
    </form>
  );
}

interface MusicFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  music: PokemonMusic | null;
  onSubmit: (data: PokemonMusicInput) => Promise<void>;
}

export default function MusicFormDialog({
  open,
  onOpenChange,
  music,
  onSubmit,
}: MusicFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{music ? 'Editar música' : 'Nova música'}</DialogTitle>
          <DialogDescription>
            {music
              ? 'Altere os dados da música e salve.'
              : 'Preencha os dados para cadastrar uma nova música.'}
          </DialogDescription>
        </DialogHeader>
        <MusicForm
          key={music?.id ?? 'new'}
          music={music}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
