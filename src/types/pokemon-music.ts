export const MUSIC_CATEGORIES = ['route', 'battle', 'town', 'gym', 'other'] as const;

export type MusicCategory = (typeof MUSIC_CATEGORIES)[number];

export const CATEGORY_LABELS: Record<MusicCategory, string> = {
  route: 'Rota',
  battle: 'Batalha',
  town: 'Cidade',
  gym: 'Ginásio',
  other: 'Outra',
};

// Estrutura retornada pela API (Pokémon Music API)
export interface PokemonMusic {
  id: number;
  title: string;
  composer: string;
  game: string;
  generation: number;
  category: MusicCategory;
  duration: number; // em segundos
  createdAt: string;
  updatedAt: string;
}

// Dados enviados no POST e no PUT
export type PokemonMusicInput = Omit<PokemonMusic, 'id' | 'createdAt' | 'updatedAt'>;
