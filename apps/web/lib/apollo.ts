'use client';

import { ApolloClient, InMemoryCache, HttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { getToken } from './auth';

export function createApolloClient() {
  const uri = process.env.NEXT_PUBLIC_GRAPHQL_URL || process.env.GRAPHQL_URL || 'http://localhost:4000/graphql';

  const httpLink = new HttpLink({
    uri,
    fetchOptions: { credentials: 'include' as const },
  });

  const authLink = setContext((_, { headers }) => {
    const token = getToken();
    return {
      headers: {
        ...headers,
        ...(token && { authorization: `Bearer ${token}` }),
      },
    };
  });

  return new ApolloClient({
    link: from([authLink, httpLink]),
    cache: new InMemoryCache(),
  });
}
