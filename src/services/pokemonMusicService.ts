import type { PokemonMusic, PokemonMusicInput } from '@/types/pokemon-music';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: options.body ? { 'Content-Type': 'application/json' } : undefined,
    });
  } catch {
    throw new Error('Não foi possível conectar à API. Verifique se o servidor está em execução.');
  }

  if (!response.ok) {
    let message = `Erro ${response.status} ao se comunicar com a API.`;
    try {
      const body = (await response.json()) as { error?: string };
      if (body.error) message = body.error;
    } catch {
      // resposta sem JSON: mantém a mensagem padrão
    }
    throw new Error(message);
  }

  return (await response.json()) as T;
}

export function listMusics(): Promise<PokemonMusic[]> {
  return request<PokemonMusic[]>('/musicas');
}

export function createMusic(data: PokemonMusicInput): Promise<PokemonMusic> {
  return request<PokemonMusic>('/musicas', { method: 'POST', body: JSON.stringify(data) });
}

export function updateMusic(id: number, data: PokemonMusicInput): Promise<PokemonMusic> {
  return request<PokemonMusic>(`/musicas/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}

export function deleteMusic(id: number): Promise<{ message: string }> {
  return request<{ message: string }>(`/musicas/${id}`, { method: 'DELETE' });
}
