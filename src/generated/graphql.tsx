import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any;
};

export type Conversation = {
  __typename?: 'Conversation';
  description: Scalars['String'];
  id: Scalars['String'];
  members?: Maybe<Array<Permission>>;
  title: Scalars['String'];
};

export type ConversationInput = {
  description: Scalars['String'];
  title: Scalars['String'];
};

export type FieldError = {
  __typename?: 'FieldError';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type LoginInput = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  CreateConversation: Conversation;
  DeleteConversation: Scalars['Boolean'];
  RemoveFromConversation: Scalars['Boolean'];
  deleteUser: Scalars['Boolean'];
  login: UserResponse;
  registration: RegistrationResponse;
};


export type MutationCreateConversationArgs = {
  options: ConversationInput;
};


export type MutationDeleteConversationArgs = {
  id: Scalars['String'];
};


export type MutationRemoveFromConversationArgs = {
  id: Scalars['String'];
};


export type MutationDeleteUserArgs = {
  id: Scalars['String'];
};


export type MutationLoginArgs = {
  options: LoginInput;
};


export type MutationRegistrationArgs = {
  options: RegistrationInput;
};

export type Permission = {
  __typename?: 'Permission';
  conversation: Conversation;
  id: Scalars['String'];
  type: Scalars['String'];
  user: User;
};

export type Query = {
  __typename?: 'Query';
  AddToConversation: Conversation;
  EditConversation: Conversation;
  GetConversation: Conversation;
  GetConversations: Array<Conversation>;
  me: User;
  user: Array<User>;
};


export type QueryAddToConversationArgs = {
  id: Scalars['String'];
};


export type QueryEditConversationArgs = {
  id: Scalars['String'];
};


export type QueryGetConversationArgs = {
  conversationid: Scalars['String'];
};

export type RegistrationInput = {
  details: Scalars['String'];
  email: Scalars['String'];
  name: Scalars['String'];
  password: Scalars['String'];
  username: Scalars['String'];
};

export type RegistrationResponse = {
  __typename?: 'RegistrationResponse';
  errors?: Maybe<Array<FieldError>>;
  user?: Maybe<RegistrationUser>;
};

export type RegistrationUser = {
  __typename?: 'RegistrationUser';
  email: Scalars['String'];
  name: Scalars['String'];
};

export type Token = {
  __typename?: 'Token';
  access_token: Scalars['String'];
  expires_in: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['DateTime'];
  details?: Maybe<Scalars['String']>;
  email: Scalars['String'];
  id: Scalars['String'];
  name: Scalars['String'];
  updatedAt: Scalars['DateTime'];
  username: Scalars['String'];
  verified: Scalars['String'];
};

export type UserAuth = {
  __typename?: 'UserAuth';
  email: Scalars['String'];
  name: Scalars['String'];
  token: Token;
};

export type UserResponse = {
  __typename?: 'UserResponse';
  errors?: Maybe<Array<FieldError>>;
  user?: Maybe<UserAuth>;
};

export type CreateConversationMutationVariables = Exact<{
  options: ConversationInput;
}>;


export type CreateConversationMutation = { __typename?: 'Mutation', CreateConversation: { __typename?: 'Conversation', id: string, title: string, description: string } };

export type DeleteConversationMutationVariables = Exact<{
  deleteConversationId: Scalars['String'];
}>;


export type DeleteConversationMutation = { __typename?: 'Mutation', DeleteConversation: boolean };

export type LoginMutationVariables = Exact<{
  options: LoginInput;
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'UserResponse', user?: { __typename?: 'UserAuth', email: string, token: { __typename?: 'Token', access_token: string, expires_in: string } } | null, errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null } };

export type RegistrationsMutationVariables = Exact<{
  options: RegistrationInput;
}>;


export type RegistrationsMutation = { __typename?: 'Mutation', registration: { __typename?: 'RegistrationResponse', user?: { __typename?: 'RegistrationUser', name: string } | null, errors?: Array<{ __typename?: 'FieldError', message: string, field: string }> | null } };

export type GetConversationQueryVariables = Exact<{
  conversationid: Scalars['String'];
}>;


export type GetConversationQuery = { __typename?: 'Query', GetConversation: { __typename?: 'Conversation', id: string, title: string, description: string, members?: Array<{ __typename?: 'Permission', user: { __typename?: 'User', id: string, name: string } }> | null } };

export type GetConversationsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetConversationsQuery = { __typename?: 'Query', GetConversations: Array<{ __typename?: 'Conversation', description: string, id: string, title: string, members?: Array<{ __typename?: 'Permission', type: string, user: { __typename?: 'User', name: string } }> | null }> };

export type GetmeQueryVariables = Exact<{ [key: string]: never; }>;


export type GetmeQuery = { __typename?: 'Query', me: { __typename?: 'User', name: string, email: string, username: string, details?: string | null } };


export const CreateConversationDocument = gql`
    mutation CreateConversation($options: ConversationInput!) {
  CreateConversation(options: $options) {
    id
    title
    description
  }
}
    `;
export type CreateConversationMutationFn = Apollo.MutationFunction<CreateConversationMutation, CreateConversationMutationVariables>;

/**
 * __useCreateConversationMutation__
 *
 * To run a mutation, you first call `useCreateConversationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateConversationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createConversationMutation, { data, loading, error }] = useCreateConversationMutation({
 *   variables: {
 *      options: // value for 'options'
 *   },
 * });
 */
export function useCreateConversationMutation(baseOptions?: Apollo.MutationHookOptions<CreateConversationMutation, CreateConversationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateConversationMutation, CreateConversationMutationVariables>(CreateConversationDocument, options);
      }
export type CreateConversationMutationHookResult = ReturnType<typeof useCreateConversationMutation>;
export type CreateConversationMutationResult = Apollo.MutationResult<CreateConversationMutation>;
export type CreateConversationMutationOptions = Apollo.BaseMutationOptions<CreateConversationMutation, CreateConversationMutationVariables>;
export const DeleteConversationDocument = gql`
    mutation DeleteConversation($deleteConversationId: String!) {
  DeleteConversation(id: $deleteConversationId)
}
    `;
export type DeleteConversationMutationFn = Apollo.MutationFunction<DeleteConversationMutation, DeleteConversationMutationVariables>;

/**
 * __useDeleteConversationMutation__
 *
 * To run a mutation, you first call `useDeleteConversationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteConversationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteConversationMutation, { data, loading, error }] = useDeleteConversationMutation({
 *   variables: {
 *      deleteConversationId: // value for 'deleteConversationId'
 *   },
 * });
 */
export function useDeleteConversationMutation(baseOptions?: Apollo.MutationHookOptions<DeleteConversationMutation, DeleteConversationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteConversationMutation, DeleteConversationMutationVariables>(DeleteConversationDocument, options);
      }
export type DeleteConversationMutationHookResult = ReturnType<typeof useDeleteConversationMutation>;
export type DeleteConversationMutationResult = Apollo.MutationResult<DeleteConversationMutation>;
export type DeleteConversationMutationOptions = Apollo.BaseMutationOptions<DeleteConversationMutation, DeleteConversationMutationVariables>;
export const LoginDocument = gql`
    mutation login($options: LoginInput!) {
  login(options: $options) {
    user {
      email
      token {
        access_token
        expires_in
      }
    }
    errors {
      field
      message
    }
  }
}
    `;
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      options: // value for 'options'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, options);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const RegistrationsDocument = gql`
    mutation Registrations($options: RegistrationInput!) {
  registration(options: $options) {
    user {
      name
    }
    errors {
      message
      field
    }
  }
}
    `;
export type RegistrationsMutationFn = Apollo.MutationFunction<RegistrationsMutation, RegistrationsMutationVariables>;

/**
 * __useRegistrationsMutation__
 *
 * To run a mutation, you first call `useRegistrationsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegistrationsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registrationsMutation, { data, loading, error }] = useRegistrationsMutation({
 *   variables: {
 *      options: // value for 'options'
 *   },
 * });
 */
export function useRegistrationsMutation(baseOptions?: Apollo.MutationHookOptions<RegistrationsMutation, RegistrationsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RegistrationsMutation, RegistrationsMutationVariables>(RegistrationsDocument, options);
      }
export type RegistrationsMutationHookResult = ReturnType<typeof useRegistrationsMutation>;
export type RegistrationsMutationResult = Apollo.MutationResult<RegistrationsMutation>;
export type RegistrationsMutationOptions = Apollo.BaseMutationOptions<RegistrationsMutation, RegistrationsMutationVariables>;
export const GetConversationDocument = gql`
    query GetConversation($conversationid: String!) {
  GetConversation(conversationid: $conversationid) {
    id
    title
    description
    members {
      user {
        id
        name
      }
    }
  }
}
    `;

/**
 * __useGetConversationQuery__
 *
 * To run a query within a React component, call `useGetConversationQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetConversationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetConversationQuery({
 *   variables: {
 *      conversationid: // value for 'conversationid'
 *   },
 * });
 */
export function useGetConversationQuery(baseOptions: Apollo.QueryHookOptions<GetConversationQuery, GetConversationQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetConversationQuery, GetConversationQueryVariables>(GetConversationDocument, options);
      }
export function useGetConversationLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetConversationQuery, GetConversationQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetConversationQuery, GetConversationQueryVariables>(GetConversationDocument, options);
        }
export type GetConversationQueryHookResult = ReturnType<typeof useGetConversationQuery>;
export type GetConversationLazyQueryHookResult = ReturnType<typeof useGetConversationLazyQuery>;
export type GetConversationQueryResult = Apollo.QueryResult<GetConversationQuery, GetConversationQueryVariables>;
export const GetConversationsDocument = gql`
    query getConversations {
  GetConversations {
    description
    id
    title
    members {
      type
      user {
        name
      }
    }
  }
}
    `;

/**
 * __useGetConversationsQuery__
 *
 * To run a query within a React component, call `useGetConversationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetConversationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetConversationsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetConversationsQuery(baseOptions?: Apollo.QueryHookOptions<GetConversationsQuery, GetConversationsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetConversationsQuery, GetConversationsQueryVariables>(GetConversationsDocument, options);
      }
export function useGetConversationsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetConversationsQuery, GetConversationsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetConversationsQuery, GetConversationsQueryVariables>(GetConversationsDocument, options);
        }
export type GetConversationsQueryHookResult = ReturnType<typeof useGetConversationsQuery>;
export type GetConversationsLazyQueryHookResult = ReturnType<typeof useGetConversationsLazyQuery>;
export type GetConversationsQueryResult = Apollo.QueryResult<GetConversationsQuery, GetConversationsQueryVariables>;
export const GetmeDocument = gql`
    query Getme {
  me {
    name
    email
    username
    details
  }
}
    `;

/**
 * __useGetmeQuery__
 *
 * To run a query within a React component, call `useGetmeQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetmeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetmeQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetmeQuery(baseOptions?: Apollo.QueryHookOptions<GetmeQuery, GetmeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetmeQuery, GetmeQueryVariables>(GetmeDocument, options);
      }
export function useGetmeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetmeQuery, GetmeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetmeQuery, GetmeQueryVariables>(GetmeDocument, options);
        }
export type GetmeQueryHookResult = ReturnType<typeof useGetmeQuery>;
export type GetmeLazyQueryHookResult = ReturnType<typeof useGetmeLazyQuery>;
export type GetmeQueryResult = Apollo.QueryResult<GetmeQuery, GetmeQueryVariables>;