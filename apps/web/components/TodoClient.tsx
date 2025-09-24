'use client';

import { ApolloProvider, gql, useMutation, useQuery } from '@apollo/client';
import { createApolloClient } from '../lib/apollo';
import { useState } from 'react';
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
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const { data, loading, error } = useQuery(TODOS, {
    fetchPolicy: 'cache-and-network',
    skip: !isAuthenticated,
  });
  const [createTodo] = useMutation(CREATE, { refetchQueries: [{ query: TODOS }] });
  const [toggleTodo] = useMutation(TOGGLE);
  const [deleteTodo] = useMutation(DELETE, { refetchQueries: [{ query: TODOS }] });
  const [title, setTitle] = useState('');

  if (authLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Initializing authentication...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to Todo App</h2>
          <p className="text-gray-600 mb-6">
            Please log in with Keycloak to access your todos and experience SSO functionality.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Keycloak SSO Features:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Single Sign-On across applications</li>
              <li>• Secure token-based authentication</li>
              <li>• User profile management</li>
              <li>• Session management</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  if (loading && !data) return <p className="text-center py-8">Loading todos...</p>;
  if (error) return <p className="text-center py-8 text-red-600">Error: {error.message}</p>;

  const todos = data?.todos ?? [];

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{user?.preferred_username || user?.name}'s Todos</h2>
        <p className="text-gray-600">Authenticated via Keycloak SSO • {user?.email}</p>
      </div>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const t = title.trim();
          if (!t) return;
          await createTodo({ variables: { title: t } });
          setTitle('');
        }}
        style={{ display: 'flex', gap: 8, marginBottom: 16 }}
      >
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a todo…"
          style={{ flex: 1, padding: '10px 12px', border: '1px solid #ddd', borderRadius: 8 }}
        />
        <button
          type="submit"
          style={{
            padding: '10px 14px',
            borderRadius: 8,
            border: '1px solid #222',
            background: '#111',
            color: 'white',
          }}
        >
          Add
        </button>
      </form>

      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 8 }}>
        {todos.map((t: any) => (
          <li
            key={t.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: 12,
              border: '1px solid #eee',
              borderRadius: 10,
            }}
          >
            <input
              type="checkbox"
              checked={t.completed}
              onChange={() =>
                toggleTodo({
                  variables: { id: t.id },
                  optimisticResponse: { toggleTodo: { ...t, completed: !t.completed, __typename: 'Todo' } },
                })
              }
            />
            <span style={{ textDecoration: t.completed ? 'line-through' : 'none', flex: 1 }}>{t.title}</span>
            <button
              onClick={() => deleteTodo({ variables: { id: t.id } })}
              aria-label="Delete"
              style={{ border: '1px solid #ddd', background: 'white', borderRadius: 8, padding: '6px 10px' }}
            >
              🗑
            </button>
          </li>
        ))}
      </ul>
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
