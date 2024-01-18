// Importa a função `createClient` do módulo `supabase` localizado no diretório "@/utils/supabase/server"
import { createClient } from "@/utils/supabase/server";

// Importa a classe `NextResponse` do módulo "next/server"
import { NextResponse } from "next/server";

// Importa o objeto `cookies` do módulo "next/headers"
import { cookies } from "next/headers";

// Define uma função assíncrona chamada `GET` que recebe um objeto `Request` como parâmetro
export async function GET(request: Request) {
  // A rota `/auth/callback` é necessária para o fluxo de autenticação no lado do servidor implementado
  // pelo pacote Auth Helpers. Ela troca um código de autenticação pela sessão do usuário.
  // https://supabase.com/docs/guides/auth/auth-helpers/nextjs#managing-sign-in-with-code-exchange
  const requestUrl = new URL(request.url);

  // Obtém o código de autenticação da consulta da URL
  const code = requestUrl.searchParams.get("code");

  // Se houver um código de autenticação na URL
  if (code) {
    // Obtém os cookies da requisição
    const cookieStore = cookies();

    // Cria uma instância do cliente Supabase usando os cookies
    const supabase = createClient(cookieStore);

    // Troca o código de autenticação pela sessão do usuário
    await supabase.auth.exchangeCodeForSession(code);
  }

  // URL para redirecionamento após a conclusão do processo de login
  return NextResponse.redirect(requestUrl.origin);
}

