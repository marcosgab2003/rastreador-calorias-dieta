'use client';

import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Mail, Lock, User, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [configured, setConfigured] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setConfigured(isSupabaseConfigured());
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!configured || !supabase) {
      setError('Supabase não está configurado. Configure as variáveis de ambiente primeiro.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        // Login
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        if (data.user) {
          router.push('/');
          router.refresh();
        }
      } else {
        // Cadastro
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name: name,
            },
          },
        });

        if (error) throw error;

        if (data.user) {
          // Redirecionar para onboarding
          router.push('/');
          router.refresh();
        }
      }
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (!configured) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto h-16 w-16 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
              <AlertCircle className="h-10 w-10 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">Configuração Necessária</CardTitle>
              <CardDescription>
                O Supabase precisa ser configurado para usar autenticação
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="bg-orange-50 dark:bg-orange-900/20 text-orange-800 dark:text-orange-200 p-4 rounded-lg space-y-2">
              <p className="font-medium">Para usar login e cadastro:</p>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li>Clique no banner laranja que aparece no topo</li>
                <li>Ou vá em Configurações → Integrações</li>
                <li>Conecte sua conta Supabase</li>
              </ol>
            </div>

            <Button
              onClick={() => router.push('/')}
              variant="outline"
              className="w-full"
            >
              Voltar para Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto h-16 w-16 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
            <Activity className="h-10 w-10 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">FitTrack</CardTitle>
            <CardDescription>
              {isLogin ? 'Entre na sua conta' : 'Crie sua conta gratuitamente'}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleAuth} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Seu nome"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                  minLength={6}
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
              disabled={loading}
            >
              {loading ? 'Carregando...' : isLogin ? 'Entrar' : 'Criar Conta'}
            </Button>

            <div className="text-center text-sm">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                }}
                className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 font-medium"
              >
                {isLogin ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Entre'}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
