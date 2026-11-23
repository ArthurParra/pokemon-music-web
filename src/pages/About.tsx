import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

const ENDPOINTS = [
  { method: 'GET', path: '/musicas', description: 'Lista todas as músicas' },
  { method: 'POST', path: '/musicas', description: 'Cadastra uma música' },
  { method: 'PUT', path: '/musicas/:id', description: 'Atualiza uma música' },
  { method: 'DELETE', path: '/musicas/:id', description: 'Remove uma música' },
];

export default function About() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Sobre o projeto</h1>
        <p className="text-muted-foreground">
          Interface web para catalogar as músicas dos jogos de Pokémon, consumindo a Pokémon Music
          API.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>API consumida</CardTitle>
          <CardDescription>
            URL base: <code>{API_URL}</code>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            {ENDPOINTS.map((endpoint) => (
              <li key={`${endpoint.method}-${endpoint.path}`} className="flex gap-3">
                <code className="w-16 font-semibold">{endpoint.method}</code>
                <code className="w-32">{endpoint.path}</code>
                <span className="text-muted-foreground">{endpoint.description}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
