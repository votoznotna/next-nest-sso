import TodoClient from '../components/TodoClient';
import { AuthProvider } from '../lib/AuthProvider';
import AuthButton from '../components/AuthButton';

export default function Page() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <h1 className="text-3xl font-bold text-gray-900">Todo App with Keycloak SSO</h1>
              <AuthButton />
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <TodoClient />
        </main>
      </div>
    </AuthProvider>
  );
}
