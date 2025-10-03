import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center space-y-8">
        <h1 className="text-4xl font-bold">
          🎬 Festival Films Courts de Dinan
        </h1>
        <h2 className="text-2xl text-gray-600">Gestion des Bénévoles</h2>
        <p className="text-lg text-gray-500">19-23 novembre 2025</p>

        <div className="flex gap-4 justify-center mt-8">
          <Link href="/auth/login">
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Se connecter
            </button>
          </Link>
          <Link href="/auth/register">
            <button className="px-6 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
              S&apos;inscrire
            </button>
          </Link>
        </div>

        <div className="mt-12 p-6 bg-green-50 rounded-lg max-w-2xl">
          <h3 className="text-xl font-semibold text-green-800 mb-2">
            ✅ Phase 0 Terminée !
          </h3>
          <p className="text-green-700">
            Le projet est configuré avec succès. Prochaine étape : Phase 1 -
            Authentification & Profils
          </p>
          <div className="mt-4 text-left text-sm text-green-600 space-y-1">
            <p>✓ Next.js 14+ avec TypeScript</p>
            <p>✓ Tailwind CSS + shadcn/ui</p>
            <p>✓ Configuration Firebase</p>
            <p>✓ Types TypeScript</p>
            <p>✓ Validations Zod</p>
            <p>✓ Structure de dossiers</p>
          </div>
        </div>
      </div>
    </main>
  );
}
