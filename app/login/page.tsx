// Importa o componente Link do módulo "next/link"
import Link from "next/link";

// Importa as funções headers e cookies do módulo "next/headers"
import { headers, cookies } from "next/headers";

// Importa a função createClient do módulo "@/utils/supabase/server"
import { createClient } from "@/utils/supabase/server";

// Importa a função redirect do módulo "next/navigation"
import { redirect } from "next/navigation";

// Declaração do componente funcional Login que recebe a propriedade searchParams
export default function Login({
  searchParams,
}: {
  searchParams: { message: string };
}) {
  // Função assíncrona signIn para lidar com o processo de autenticação
  const signIn = async (formData: FormData) => {
    // Marca a função como sendo executada no lado do servidor
    "use server";

    // Obtém o email e senha do formulário
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // Obtém o cookieStore da requisição
    const cookieStore = cookies();

    // Cria uma instância do cliente Supabase usando o cookieStore
    const supabase = createClient(cookieStore);

    // Realiza a autenticação do usuário com o Supabase usando o email e senha
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    // Se houver um erro, redireciona para a página de login com uma mensagem
    if (error) {
      return redirect("/login?message=Could not authenticate user");
    }

    // Redireciona para a página inicial se a autenticação for bem-sucedida
    return redirect("/");
  };

  // Função assíncrona signUp para lidar com o processo de registro
  const signUp = async (formData: FormData) => {
    // Marca a função como sendo executada no lado do servidor
    "use server";

    // Obtém a origem da requisição
    const origin = headers().get("origin");

    // Obtém o email e senha do formulário
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // Obtém o cookieStore da requisição
    const cookieStore = cookies();

    // Cria uma instância do cliente Supabase usando o cookieStore
    const supabase = createClient(cookieStore);

    // Realiza o registro do usuário com o Supabase usando o email e senha
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
      },
    });

    // Se houver um erro, redireciona para a página de login com uma mensagem
    if (error) {
      return redirect("/login?message=Could not authenticate user");
    }

    // Redireciona para a página de login com uma mensagem informativa
    return redirect("/login?message=Check email to continue sign in process");
  };

  // Retorna o JSX que representa a interface do componente Login
  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
      {/* Link para a página inicial */}
      <Link
        href="/"
        className="absolute left-8 top-8 py-2 px-4 rounded-md no-underline text-foreground bg-btn-background hover:bg-btn-background-hover flex items-center group text-sm"
      >
        {/* Ícone e texto "Back" para navegação de volta */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>{" "}
        Voltar
      </Link>

      {/* Formulário de login */}
      <form
        className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground"
        action={signIn}
      >
        {/* Campo de email */}
        <label className="text-md" htmlFor="email">
          Email
        </label>
        <input
          className="rounded-md px-4 py-2 bg-inherit border mb-6"
          name="email"
          placeholder="you@example.com"
          required
        />

        {/* Campo de senha */}
        <label className="text-md" htmlFor="password">
          Senha
        </label>
        <input
          className="rounded-md px-4 py-2 bg-inherit border mb-6"
          type="password"
          name="password"
          placeholder="••••••••"
          required
        />

        {/* Botão de login */}
        <button className="bg-green-700 rounded-md px-4 py-2 text-foreground mb-2">
          Login
        </button>

        {/* Botão de registro */}
        <button
          formAction={signUp}
          className="border border-foreground/20 rounded-md px-4 py-2 text-foreground mb-2"
        >
          Registrar
        </button>

        {/* Exibe a mensagem de busca se houver */}
        {searchParams?.message && (
          <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center">
            {searchParams.message}
          </p>
        )}
      </form>
    </div>
  );
}
