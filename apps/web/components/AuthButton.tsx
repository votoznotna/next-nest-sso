'use client';

import { useAuth } from '../lib/AuthProvider';

export default function AuthButton() {
  const { isAuthenticated, user, login, logout, loading } = useAuth();

  // Simple logout function
  const handleLogout = () => {
    try {
      // Use the logout function from useAuth which calls Keycloak's logout method
      logout();
    } catch (error) {
      console.error('Logout error:', error);
      // Fallback to logout page if direct logout fails
      window.location.href = '/logout';
    }
  };

  if (loading) {
    return (
      <div className='flex items-center space-x-2'>
        <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600'></div>
        <span>Loading...</span>
      </div>
    );
  }

  // Show authenticated state with user info and logout button
  if (isAuthenticated) {
    return (
      <div className='flex items-center space-x-4'>
        <div className='flex items-center space-x-2'>
          <div className='w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium'>
            {user?.preferred_username?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className='flex flex-col'>
            <span className='text-sm font-medium text-gray-900'>
              {user?.preferred_username || user?.name || 'User'}
            </span>
            <span className='text-xs text-gray-500'>
              {user?.email || 'Authenticated'}
            </span>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className='px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
        >
          Logout
        </button>
      </div>
    );
  }

  // Show login button when not authenticated
  return (
    <div className='flex items-center space-x-2'>
      <button
        onClick={login}
        className='px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
      >
        Login with Keycloak
      </button>
    </div>
  );
}
