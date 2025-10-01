'use client';

/// <reference types="react" />
import React, { useState } from 'react';
import { ApolloProvider, gql, useMutation, useQuery } from '@apollo/client';
import { createApolloClient } from '../lib/apollo';
import { useAuth } from '../lib/AuthProvider';

const TODOS = gql`
  query {
    todos {
      id
      title
      completed
    }
  }
`;
const CREATE = gql`
  mutation ($title: String!) {
    createTodo(title: $title) {
      id
      title
      completed
    }
  }
`;
const TOGGLE = gql`
  mutation ($id: ID!) {
    toggleTodo(id: $id) {
      id
      title
      completed
    }
  }
`;
const DELETE = gql`
  mutation ($id: ID!) {
    deleteTodo(id: $id)
  }
`;

function TodoList() {
  const {
    isAuthenticated,
    user,
    loading: authLoading,
    refreshAuth,
  } = useAuth();

  // Only run the query if user is authenticated
  const { data, loading, error } = useQuery(TODOS, {
    fetchPolicy: 'cache-and-network',
    skip: !isAuthenticated,
    errorPolicy: 'ignore', // Ignore errors when not authenticated
    notifyOnNetworkStatusChange: false,
  });
  const [createTodo] = useMutation(CREATE, {
    refetchQueries: [{ query: TODOS }],
    errorPolicy: 'all',
    onCompleted: (data) => {
      console.log('Todo created successfully:', data);
    },
    onError: (error) => {
      console.error('Todo creation error:', error);

      // Check if it's an authentication error and user is still authenticated
      if (
        isAuthenticated &&
        (error.message.includes('Invalid token') ||
          error.message.includes('Unauthorized') ||
          error.message.includes('Authentication'))
      ) {
        console.log('Authentication error detected, attempting token refresh');
        // Try to refresh the authentication state first
        refreshAuth();
        // Don't reload immediately - let the user try again
        console.log(
          'Please try adding the todo again after authentication refresh'
        );
      } else if (!isAuthenticated) {
        console.log('User not authenticated, skipping auth error handling');
      }
    },
    update: (cache, { data }) => {
      if (data?.createTodo) {
        const existingTodos = cache.readQuery({ query: TODOS }) as {
          todos: any[];
        } | null;
        cache.writeQuery({
          query: TODOS,
          data: {
            todos: [...(existingTodos?.todos || []), data.createTodo],
          },
        });
      }
    },
  });
  const [toggleTodo] = useMutation(TOGGLE);
  const [deleteTodo] = useMutation(DELETE, {
    refetchQueries: [{ query: TODOS }],
  });
  const [title, setTitle] = useState('');

  if (authLoading) {
    return (
      <div className='flex items-center justify-center py-16'>
        <div className='animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600'></div>
        <span className='ml-3 text-lg text-gray-600'>
          Initializing authentication...
        </span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className='text-center py-16 px-8'>
        <div className='max-w-lg mx-auto'>
          <div className='mb-8'>
            <div className='w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6'>
              <svg
                className='w-10 h-10 text-blue-600'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
                style={{ width: '40px', height: '40px' }}
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                />
              </svg>
            </div>
            <h2 className='text-3xl font-bold text-gray-900 mb-4'>
              Welcome to Todo App
            </h2>
            <p className='text-lg text-gray-600 mb-8'>
              Please log in with Keycloak to access your todos and experience
              secure SSO functionality.
            </p>
          </div>
          <div className='bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6'>
            <h3 className='font-semibold text-blue-900 mb-4 text-lg'>
              Keycloak SSO Features:
            </h3>
            <ul className='text-blue-800 space-y-2 text-left'>
              <li className='flex items-center'>
                <svg
                  className='w-5 h-5 text-blue-600 mr-3'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                  style={{ width: '20px', height: '20px' }}
                >
                  <path
                    fillRule='evenodd'
                    d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                    clipRule='evenodd'
                  />
                </svg>
                Single Sign-On across applications
              </li>
              <li className='flex items-center'>
                <svg
                  className='w-5 h-5 text-blue-600 mr-3'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                  style={{ width: '20px', height: '20px' }}
                >
                  <path
                    fillRule='evenodd'
                    d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                    clipRule='evenodd'
                  />
                </svg>
                Secure token-based authentication
              </li>
              <li className='flex items-center'>
                <svg
                  className='w-5 h-5 text-blue-600 mr-3'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                  style={{ width: '20px', height: '20px' }}
                >
                  <path
                    fillRule='evenodd'
                    d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                    clipRule='evenodd'
                  />
                </svg>
                User profile management
              </li>
              <li className='flex items-center'>
                <svg
                  className='w-5 h-5 text-blue-600 mr-3'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                  style={{ width: '20px', height: '20px' }}
                >
                  <path
                    fillRule='evenodd'
                    d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                    clipRule='evenodd'
                  />
                </svg>
                Session management
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  if (loading && !data)
    return (
      <div className='bg-white rounded-lg shadow-md border border-gray-200 p-6'>
        <div className='text-center py-8'>
          <p className='text-gray-500'>Loading todos...</p>
        </div>
      </div>
    );

  // Only show errors if user is authenticated and there's a real error (not auth-related)
  if (error && isAuthenticated) {
    const isAuthError =
      error.message.includes('No token provided') ||
      error.message.includes('Unauthorized') ||
      error.message.includes('Authentication') ||
      error.message.includes('token');

    if (!isAuthError) {
      return (
        <div className='bg-white rounded-lg shadow-md border border-gray-200 p-6'>
          <div className='text-center py-8'>
            <p className='text-red-500'>Error: {error.message}</p>
          </div>
        </div>
      );
    }
  }

  const todos = data?.todos ?? [];
  console.log('Current todos:', todos);
  console.log('Data from query:', data);

  return (
    <div className='bg-white rounded-lg shadow-md border border-gray-200 p-6'>
      <div className='max-w-4xl mx-auto'>
        {/* Header Section */}
        <div className='mb-8'>
          <div className='flex items-center mb-4'>
            <div className='w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mr-4'>
              <span className='text-white font-bold text-lg'>
                {(user?.preferred_username || user?.name || 'U')
                  .charAt(0)
                  .toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className='text-2xl font-bold text-gray-900'>
                {user?.preferred_username || user?.name}'s Todos
              </h2>
              <p className='text-sm text-gray-600 mt-1'>
                ✓ Authenticated via Keycloak SSO • {user?.email}
              </p>
            </div>
          </div>
        </div>

        {/* Add Todo Form */}
        <div className='mb-6'>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const t = title.trim();
              if (!t) return;

              try {
                console.log('Creating todo with title:', t);
                const result = await createTodo({ variables: { title: t } });
                console.log('Todo created successfully:', result);
                setTitle('');
              } catch (error) {
                console.error('Error creating todo:', error);
                // Don't show error to user if it's a token issue
                const errorMessage =
                  error instanceof Error ? error.message : String(error);
                if (
                  errorMessage &&
                  !errorMessage.includes('No token provided')
                ) {
                  alert('Error creating todo: ' + errorMessage);
                }
              }
            }}
            className='flex gap-3'
          >
            <div className='flex-1'>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder='What needs to be done?'
                className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none'
              />
            </div>
            <button
              type='submit'
              className='px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors'
            >
              Add Todo
            </button>
          </form>
        </div>

        {/* Todo List */}
        <div className='space-y-4'>
          {todos.length === 0 ? (
            <div className='text-center py-8'>
              <p className='text-gray-500'>
                No todos yet. Add your first todo above!
              </p>
            </div>
          ) : (
            todos.map((t: any, index: number) => (
              <div
                key={t.id}
                className={`flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-md ${
                  t.completed ? 'opacity-60' : ''
                }`}
              >
                <input
                  type='checkbox'
                  checked={t.completed}
                  onChange={() =>
                    toggleTodo({
                      variables: { id: t.id },
                      optimisticResponse: {
                        toggleTodo: {
                          ...t,
                          completed: !t.completed,
                          __typename: 'Todo',
                        },
                      },
                    })
                  }
                  className='w-4 h-4 text-blue-600 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500'
                />
                <span
                  className={`flex-1 text-sm ${
                    t.completed ? 'line-through text-gray-500' : 'text-gray-900'
                  }`}
                >
                  {t.title}
                </span>
                <button
                  onClick={() => deleteTodo({ variables: { id: t.id } })}
                  aria-label='Delete todo'
                  className='px-2 py-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors border border-gray-200 hover:border-red-200'
                >
                  <span className='text-sm font-bold'>×</span>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Stats Footer */}
        {todos.length > 0 && (
          <div className='mt-4 pt-4 border-t border-gray-200'>
            <div className='flex items-center justify-between text-xs text-gray-500'>
              <span>
                {todos.filter((t: any) => !t.completed).length} active
              </span>
              <span>
                {todos.filter((t: any) => t.completed).length} completed
              </span>
              <span>{todos.length} total</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TodoClient() {
  const client = createApolloClient();

  return (
    <ApolloProvider client={client}>
      <TodoList />
    </ApolloProvider>
  );
}
