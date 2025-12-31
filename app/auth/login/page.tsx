import { SignIn } from '@clerk/nextjs';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <p className="text-sm text-blue-800">
            <strong>✓ OAuth Réparé:</strong> Le problème Google OAuth a été résolu.
            Vous pouvez maintenant vous connecter avec Google sans problème!
          </p>
        </div>
        <SignIn
          appearance={{
            elements: {
              rootBox: 'mx-auto',
              card: 'shadow-lg',
            },
          }}
          routing="path"
          path="/auth/login"
          signUpUrl="/auth/register"
        />
      </div>
    </div>
  );
}
