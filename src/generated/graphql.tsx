import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
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

export function useCreateConversationMutation() {
  return Urql.useMutation<CreateConversationMutation, CreateConversationMutationVariables>(CreateConversationDocument);
};
export const DeleteConversationDocument = gql`
    mutation DeleteConversation($deleteConversationId: String!) {
  DeleteConversation(id: $deleteConversationId)
}
    `;

export function useDeleteConversationMutation() {
  return Urql.useMutation<DeleteConversationMutation, DeleteConversationMutationVariables>(DeleteConversationDocument);
};
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

export function useLoginMutation() {
  return Urql.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument);
};
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

export function useRegistrationsMutation() {
  return Urql.useMutation<RegistrationsMutation, RegistrationsMutationVariables>(RegistrationsDocument);
};
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

export function useGetConversationQuery(options: Omit<Urql.UseQueryArgs<GetConversationQueryVariables>, 'query'>) {
  return Urql.useQuery<GetConversationQuery>({ query: GetConversationDocument, ...options });
};
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

export function useGetConversationsQuery(options?: Omit<Urql.UseQueryArgs<GetConversationsQueryVariables>, 'query'>) {
  return Urql.useQuery<GetConversationsQuery>({ query: GetConversationsDocument, ...options });
};
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

export function useGetmeQuery(options?: Omit<Urql.UseQueryArgs<GetmeQueryVariables>, 'query'>) {
  return Urql.useQuery<GetmeQuery>({ query: GetmeDocument, ...options });
};