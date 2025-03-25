/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Upload: { input: any; output: any; }
};

export type Adjustment = {
  __typename?: 'Adjustment';
  id: Scalars['String']['output'];
  meanError: Scalars['Float']['output'];
  product?: Maybe<Product>;
  rmse: Scalars['Float']['output'];
  standardDeviationOfError: Scalars['Float']['output'];
  transformationMatrix?: Maybe<Array<Maybe<Scalars['Float']['output']>>>;
};

export type Asset = {
  __typename?: 'Asset';
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isPublic: Scalars['Boolean']['output'];
  meanError?: Maybe<Scalars['Float']['output']>;
  original_photo: Array<Scalars['String']['output']>;
  result_adjustment?: Maybe<Scalars['String']['output']>;
  result_ao?: Maybe<Scalars['String']['output']>;
  result_disp?: Maybe<Scalars['String']['output']>;
  result_gltf?: Maybe<Scalars['String']['output']>;
  result_mtl?: Maybe<Scalars['String']['output']>;
  result_normal?: Maybe<Scalars['String']['output']>;
  result_obj?: Maybe<Scalars['String']['output']>;
  result_roughness?: Maybe<Scalars['String']['output']>;
  result_texture?: Maybe<Scalars['String']['output']>;
  result_usda?: Maybe<Scalars['String']['output']>;
  result_usdz?: Maybe<Scalars['String']['output']>;
  rmse?: Maybe<Scalars['Float']['output']>;
  standardDeviationOfError?: Maybe<Scalars['Float']['output']>;
  title: Scalars['String']['output'];
  transformationMatrix: Array<Scalars['Float']['output']>;
  updatedAt: Scalars['String']['output'];
  user?: Maybe<User>;
  userId?: Maybe<Scalars['String']['output']>;
};

export type EditProfileResult = {
  __typename?: 'EditProfileResult';
  message?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type LoginMutationResponse = {
  __typename?: 'LoginMutationResponse';
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
  token?: Maybe<Scalars['String']['output']>;
};

export type LoginResult = {
  __typename?: 'LoginResult';
  message?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
  token?: Maybe<Scalars['String']['output']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createAccount: MutationResponse;
  deleteAccount: MutationResponse;
  deleteAsset?: Maybe<Scalars['Boolean']['output']>;
  deleteProduct: MutationResponse;
  editAsset?: Maybe<Asset>;
  editProduct: MutationResponse;
  editProfile: MutationResponse;
  login: LoginMutationResponse;
  resetPassword: ResetPasswordResult;
  uploadProduct: UploadProductResult;
};


export type MutationCreateAccountArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type MutationDeleteAccountArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type MutationDeleteAssetArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteProductArgs = {
  id: Scalars['String']['input'];
};


export type MutationEditAssetArgs = {
  id: Scalars['ID']['input'];
  isPublic?: InputMaybe<Scalars['Boolean']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};


export type MutationEditProductArgs = {
  id: Scalars['String']['input'];
  title?: InputMaybe<Scalars['String']['input']>;
};


export type MutationEditProfileArgs = {
  password?: InputMaybe<Scalars['String']['input']>;
};


export type MutationLoginArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type MutationResetPasswordArgs = {
  email: Scalars['String']['input'];
};


export type MutationUploadProductArgs = {
  alignment?: InputMaybe<Scalars['Boolean']['input']>;
  original_photo?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  title: Scalars['String']['input'];
};

export type MutationResponse = {
  __typename?: 'MutationResponse';
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type Product = {
  __typename?: 'Product';
  createdAt: Scalars['String']['output'];
  id: Scalars['String']['output'];
  meanError?: Maybe<Scalars['Float']['output']>;
  original_photo?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  result_adjustment?: Maybe<Scalars['String']['output']>;
  result_ao?: Maybe<Scalars['String']['output']>;
  result_disp?: Maybe<Scalars['String']['output']>;
  result_gltf?: Maybe<Scalars['String']['output']>;
  result_mtl?: Maybe<Scalars['String']['output']>;
  result_normal?: Maybe<Scalars['String']['output']>;
  result_obj?: Maybe<Scalars['String']['output']>;
  result_roughness?: Maybe<Scalars['String']['output']>;
  result_texture?: Maybe<Scalars['String']['output']>;
  result_usda?: Maybe<Scalars['String']['output']>;
  rmse?: Maybe<Scalars['Float']['output']>;
  standardDeviationOfError?: Maybe<Scalars['Float']['output']>;
  title: Scalars['String']['output'];
  transformationMatrix?: Maybe<Array<Maybe<Scalars['Float']['output']>>>;
  updatedAt: Scalars['String']['output'];
  user: User;
};

export type Query = {
  __typename?: 'Query';
  allAsset?: Maybe<Array<Maybe<Asset>>>;
  allProduct?: Maybe<Array<Maybe<Product>>>;
  assetDetail?: Maybe<Asset>;
  getAllUsers?: Maybe<Array<Maybe<User>>>;
  getMyAsset?: Maybe<Array<Maybe<Asset>>>;
  getMyInfo?: Maybe<User>;
  getMyProduct?: Maybe<Array<Maybe<Product>>>;
  productDetail?: Maybe<Product>;
};


export type QueryAllAssetArgs = {
  offset: Scalars['Int']['input'];
};


export type QueryAllProductArgs = {
  offset: Scalars['Int']['input'];
};


export type QueryAssetDetailArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetAllUsersArgs = {
  offset: Scalars['Int']['input'];
};


export type QueryGetMyAssetArgs = {
  offset: Scalars['Int']['input'];
};


export type QueryGetMyProductArgs = {
  offset: Scalars['Int']['input'];
};


export type QueryProductDetailArgs = {
  id: Scalars['String']['input'];
};

export type ResetPasswordResult = {
  __typename?: 'ResetPasswordResult';
  message?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type UploadProductResult = {
  __typename?: 'UploadProductResult';
  id?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  result_ao?: Maybe<Scalars['String']['output']>;
  result_disp?: Maybe<Scalars['String']['output']>;
  result_mtl?: Maybe<Scalars['String']['output']>;
  result_normal?: Maybe<Scalars['String']['output']>;
  result_obj?: Maybe<Scalars['String']['output']>;
  result_roughness?: Maybe<Scalars['String']['output']>;
  result_texture?: Maybe<Scalars['String']['output']>;
  result_usda?: Maybe<Scalars['String']['output']>;
  result_usdz?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
  title?: Maybe<Scalars['String']['output']>;
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['String']['output'];
  email: Scalars['String']['output'];
  freeCoupon: Scalars['Int']['output'];
  id: Scalars['String']['output'];
  isAdmin: Scalars['Boolean']['output'];
  isSubscribed: Scalars['Boolean']['output'];
  password: Scalars['String']['output'];
  product?: Maybe<Array<Maybe<Product>>>;
  updatedAt: Scalars['String']['output'];
};

export type UploadProductMutationVariables = Exact<{
  original_photo?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>> | InputMaybe<Scalars['String']['input']>>;
  title: Scalars['String']['input'];
}>;


export type UploadProductMutation = { __typename?: 'Mutation', uploadProduct: { __typename?: 'UploadProductResult', success: boolean, message?: string | null } };

export type DeleteProductMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type DeleteProductMutation = { __typename?: 'Mutation', deleteProduct: { __typename?: 'MutationResponse', success: boolean, message: string } };

export type EditProductMutationVariables = Exact<{
  id: Scalars['String']['input'];
  title: Scalars['String']['input'];
}>;


export type EditProductMutation = { __typename?: 'Mutation', editProduct: { __typename?: 'MutationResponse', success: boolean, message: string } };

export type AllProductQueryVariables = Exact<{
  offset: Scalars['Int']['input'];
}>;


export type AllProductQuery = { __typename?: 'Query', allProduct?: Array<{ __typename?: 'Product', id: string, title: string, original_photo?: Array<string | null> | null, result_texture?: string | null, result_mtl?: string | null, result_obj?: string | null, result_usda?: string | null, result_gltf?: string | null, createdAt: string, updatedAt: string } | null> | null };

export type GetMyProductQueryVariables = Exact<{
  offset: Scalars['Int']['input'];
}>;


export type GetMyProductQuery = { __typename?: 'Query', getMyProduct?: Array<{ __typename?: 'Product', id: string, title: string, original_photo?: Array<string | null> | null, result_texture?: string | null, result_mtl?: string | null, result_obj?: string | null, result_usda?: string | null, result_gltf?: string | null, createdAt: string, updatedAt: string } | null> | null };

export type ProductDetailQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type ProductDetailQuery = { __typename?: 'Query', productDetail?: { __typename?: 'Product', id: string, title: string, original_photo?: Array<string | null> | null, result_ao?: string | null, result_disp?: string | null, result_normal?: string | null, result_roughness?: string | null, result_texture?: string | null, result_mtl?: string | null, result_obj?: string | null, result_usda?: string | null, result_gltf?: string | null, createdAt: string, updatedAt: string } | null };

export type CreateAccountMutationVariables = Exact<{
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type CreateAccountMutation = { __typename?: 'Mutation', createAccount: { __typename?: 'MutationResponse', success: boolean, message: string } };

export type LoginMutationVariables = Exact<{
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'LoginMutationResponse', success: boolean, token?: string | null, message: string } };

export type EditProfileMutationVariables = Exact<{
  password?: InputMaybe<Scalars['String']['input']>;
}>;


export type EditProfileMutation = { __typename?: 'Mutation', editProfile: { __typename?: 'MutationResponse', success: boolean, message: string } };

export type ResetPasswordMutationVariables = Exact<{
  email: Scalars['String']['input'];
}>;


export type ResetPasswordMutation = { __typename?: 'Mutation', resetPassword: { __typename?: 'ResetPasswordResult', success: boolean, message?: string | null } };

export type DeleteAccountMutationVariables = Exact<{
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type DeleteAccountMutation = { __typename?: 'Mutation', deleteAccount: { __typename?: 'MutationResponse', success: boolean, message: string } };

export type GetMyInfoQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMyInfoQuery = { __typename?: 'Query', getMyInfo?: { __typename?: 'User', id: string, email: string, password: string, freeCoupon: number, isAdmin: boolean, isSubscribed: boolean, createdAt: string, updatedAt: string } | null };

export type GetAllUsersQueryVariables = Exact<{
  offset: Scalars['Int']['input'];
}>;


export type GetAllUsersQuery = { __typename?: 'Query', getAllUsers?: Array<{ __typename?: 'User', id: string, email: string, password: string, freeCoupon: number, isAdmin: boolean, isSubscribed: boolean, createdAt: string, updatedAt: string } | null> | null };


export const UploadProductDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"uploadProduct"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"original_photo"}},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"title"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uploadProduct"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"original_photo"},"value":{"kind":"Variable","name":{"kind":"Name","value":"original_photo"}}},{"kind":"Argument","name":{"kind":"Name","value":"title"},"value":{"kind":"Variable","name":{"kind":"Name","value":"title"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<UploadProductMutation, UploadProductMutationVariables>;
export const DeleteProductDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteProduct"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteProduct"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<DeleteProductMutation, DeleteProductMutationVariables>;
export const EditProductDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"editProduct"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"title"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"editProduct"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"title"},"value":{"kind":"Variable","name":{"kind":"Name","value":"title"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<EditProductMutation, EditProductMutationVariables>;
export const AllProductDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"allProduct"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"allProduct"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"original_photo"}},{"kind":"Field","name":{"kind":"Name","value":"result_texture"}},{"kind":"Field","name":{"kind":"Name","value":"result_mtl"}},{"kind":"Field","name":{"kind":"Name","value":"result_obj"}},{"kind":"Field","name":{"kind":"Name","value":"result_usda"}},{"kind":"Field","name":{"kind":"Name","value":"result_gltf"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<AllProductQuery, AllProductQueryVariables>;
export const GetMyProductDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getMyProduct"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getMyProduct"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"original_photo"}},{"kind":"Field","name":{"kind":"Name","value":"result_texture"}},{"kind":"Field","name":{"kind":"Name","value":"result_mtl"}},{"kind":"Field","name":{"kind":"Name","value":"result_obj"}},{"kind":"Field","name":{"kind":"Name","value":"result_usda"}},{"kind":"Field","name":{"kind":"Name","value":"result_gltf"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<GetMyProductQuery, GetMyProductQueryVariables>;
export const ProductDetailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"productDetail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"productDetail"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"original_photo"}},{"kind":"Field","name":{"kind":"Name","value":"result_ao"}},{"kind":"Field","name":{"kind":"Name","value":"result_disp"}},{"kind":"Field","name":{"kind":"Name","value":"result_normal"}},{"kind":"Field","name":{"kind":"Name","value":"result_roughness"}},{"kind":"Field","name":{"kind":"Name","value":"result_texture"}},{"kind":"Field","name":{"kind":"Name","value":"result_mtl"}},{"kind":"Field","name":{"kind":"Name","value":"result_obj"}},{"kind":"Field","name":{"kind":"Name","value":"result_usda"}},{"kind":"Field","name":{"kind":"Name","value":"result_gltf"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<ProductDetailQuery, ProductDetailQueryVariables>;
export const CreateAccountDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createAccount"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createAccount"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<CreateAccountMutation, CreateAccountMutationVariables>;
export const LoginDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"login"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"login"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<LoginMutation, LoginMutationVariables>;
export const EditProfileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"editProfile"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"editProfile"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<EditProfileMutation, EditProfileMutationVariables>;
export const ResetPasswordDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"resetPassword"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"resetPassword"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<ResetPasswordMutation, ResetPasswordMutationVariables>;
export const DeleteAccountDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteAccount"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteAccount"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<DeleteAccountMutation, DeleteAccountMutationVariables>;
export const GetMyInfoDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getMyInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getMyInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"password"}},{"kind":"Field","name":{"kind":"Name","value":"freeCoupon"}},{"kind":"Field","name":{"kind":"Name","value":"isAdmin"}},{"kind":"Field","name":{"kind":"Name","value":"isSubscribed"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<GetMyInfoQuery, GetMyInfoQueryVariables>;
export const GetAllUsersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getAllUsers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getAllUsers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"password"}},{"kind":"Field","name":{"kind":"Name","value":"freeCoupon"}},{"kind":"Field","name":{"kind":"Name","value":"isAdmin"}},{"kind":"Field","name":{"kind":"Name","value":"isSubscribed"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<GetAllUsersQuery, GetAllUsersQueryVariables>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Upload: { input: any; output: any; }
};

export type Adjustment = {
  __typename?: 'Adjustment';
  id: Scalars['String']['output'];
  meanError: Scalars['Float']['output'];
  product?: Maybe<Product>;
  rmse: Scalars['Float']['output'];
  standardDeviationOfError: Scalars['Float']['output'];
  transformationMatrix?: Maybe<Array<Maybe<Scalars['Float']['output']>>>;
};

export type Asset = {
  __typename?: 'Asset';
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isPublic: Scalars['Boolean']['output'];
  meanError?: Maybe<Scalars['Float']['output']>;
  original_photo: Array<Scalars['String']['output']>;
  result_adjustment?: Maybe<Scalars['String']['output']>;
  result_ao?: Maybe<Scalars['String']['output']>;
  result_disp?: Maybe<Scalars['String']['output']>;
  result_gltf?: Maybe<Scalars['String']['output']>;
  result_mtl?: Maybe<Scalars['String']['output']>;
  result_normal?: Maybe<Scalars['String']['output']>;
  result_obj?: Maybe<Scalars['String']['output']>;
  result_roughness?: Maybe<Scalars['String']['output']>;
  result_texture?: Maybe<Scalars['String']['output']>;
  result_usda?: Maybe<Scalars['String']['output']>;
  result_usdz?: Maybe<Scalars['String']['output']>;
  rmse?: Maybe<Scalars['Float']['output']>;
  standardDeviationOfError?: Maybe<Scalars['Float']['output']>;
  title: Scalars['String']['output'];
  transformationMatrix: Array<Scalars['Float']['output']>;
  updatedAt: Scalars['String']['output'];
  user?: Maybe<User>;
  userId?: Maybe<Scalars['String']['output']>;
};

export type EditProfileResult = {
  __typename?: 'EditProfileResult';
  message?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type LoginMutationResponse = {
  __typename?: 'LoginMutationResponse';
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
  token?: Maybe<Scalars['String']['output']>;
};

export type LoginResult = {
  __typename?: 'LoginResult';
  message?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
  token?: Maybe<Scalars['String']['output']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createAccount: MutationResponse;
  deleteAccount: MutationResponse;
  deleteAsset?: Maybe<Scalars['Boolean']['output']>;
  deleteProduct: MutationResponse;
  editAsset?: Maybe<Asset>;
  editProduct: MutationResponse;
  editProfile: MutationResponse;
  login: LoginMutationResponse;
  resetPassword: ResetPasswordResult;
  uploadProduct: UploadProductResult;
};


export type MutationCreateAccountArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type MutationDeleteAccountArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type MutationDeleteAssetArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteProductArgs = {
  id: Scalars['String']['input'];
};


export type MutationEditAssetArgs = {
  id: Scalars['ID']['input'];
  isPublic?: InputMaybe<Scalars['Boolean']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};


export type MutationEditProductArgs = {
  id: Scalars['String']['input'];
  title?: InputMaybe<Scalars['String']['input']>;
};


export type MutationEditProfileArgs = {
  password?: InputMaybe<Scalars['String']['input']>;
};


export type MutationLoginArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type MutationResetPasswordArgs = {
  email: Scalars['String']['input'];
};


export type MutationUploadProductArgs = {
  alignment?: InputMaybe<Scalars['Boolean']['input']>;
  original_photo?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  title: Scalars['String']['input'];
};

export type MutationResponse = {
  __typename?: 'MutationResponse';
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type Product = {
  __typename?: 'Product';
  createdAt: Scalars['String']['output'];
  id: Scalars['String']['output'];
  meanError?: Maybe<Scalars['Float']['output']>;
  original_photo?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  result_adjustment?: Maybe<Scalars['String']['output']>;
  result_ao?: Maybe<Scalars['String']['output']>;
  result_disp?: Maybe<Scalars['String']['output']>;
  result_gltf?: Maybe<Scalars['String']['output']>;
  result_mtl?: Maybe<Scalars['String']['output']>;
  result_normal?: Maybe<Scalars['String']['output']>;
  result_obj?: Maybe<Scalars['String']['output']>;
  result_roughness?: Maybe<Scalars['String']['output']>;
  result_texture?: Maybe<Scalars['String']['output']>;
  result_usda?: Maybe<Scalars['String']['output']>;
  rmse?: Maybe<Scalars['Float']['output']>;
  standardDeviationOfError?: Maybe<Scalars['Float']['output']>;
  title: Scalars['String']['output'];
  transformationMatrix?: Maybe<Array<Maybe<Scalars['Float']['output']>>>;
  updatedAt: Scalars['String']['output'];
  user: User;
};

export type Query = {
  __typename?: 'Query';
  allAsset?: Maybe<Array<Maybe<Asset>>>;
  allProduct?: Maybe<Array<Maybe<Product>>>;
  assetDetail?: Maybe<Asset>;
  getAllUsers?: Maybe<Array<Maybe<User>>>;
  getMyAsset?: Maybe<Array<Maybe<Asset>>>;
  getMyInfo?: Maybe<User>;
  getMyProduct?: Maybe<Array<Maybe<Product>>>;
  productDetail?: Maybe<Product>;
};


export type QueryAllAssetArgs = {
  offset: Scalars['Int']['input'];
};


export type QueryAllProductArgs = {
  offset: Scalars['Int']['input'];
};


export type QueryAssetDetailArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetAllUsersArgs = {
  offset: Scalars['Int']['input'];
};


export type QueryGetMyAssetArgs = {
  offset: Scalars['Int']['input'];
};


export type QueryGetMyProductArgs = {
  offset: Scalars['Int']['input'];
};


export type QueryProductDetailArgs = {
  id: Scalars['String']['input'];
};

export type ResetPasswordResult = {
  __typename?: 'ResetPasswordResult';
  message?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type UploadProductResult = {
  __typename?: 'UploadProductResult';
  id?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  result_ao?: Maybe<Scalars['String']['output']>;
  result_disp?: Maybe<Scalars['String']['output']>;
  result_mtl?: Maybe<Scalars['String']['output']>;
  result_normal?: Maybe<Scalars['String']['output']>;
  result_obj?: Maybe<Scalars['String']['output']>;
  result_roughness?: Maybe<Scalars['String']['output']>;
  result_texture?: Maybe<Scalars['String']['output']>;
  result_usda?: Maybe<Scalars['String']['output']>;
  result_usdz?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
  title?: Maybe<Scalars['String']['output']>;
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['String']['output'];
  email: Scalars['String']['output'];
  freeCoupon: Scalars['Int']['output'];
  id: Scalars['String']['output'];
  isAdmin: Scalars['Boolean']['output'];
  isSubscribed: Scalars['Boolean']['output'];
  password: Scalars['String']['output'];
  product?: Maybe<Array<Maybe<Product>>>;
  updatedAt: Scalars['String']['output'];
};

export type UploadProductMutationVariables = Exact<{
  original_photo?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>> | InputMaybe<Scalars['String']['input']>>;
  title: Scalars['String']['input'];
}>;


export type UploadProductMutation = { __typename?: 'Mutation', uploadProduct: { __typename?: 'UploadProductResult', success: boolean, message?: string | null } };

export type DeleteProductMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type DeleteProductMutation = { __typename?: 'Mutation', deleteProduct: { __typename?: 'MutationResponse', success: boolean, message: string } };

export type EditProductMutationVariables = Exact<{
  id: Scalars['String']['input'];
  title: Scalars['String']['input'];
}>;


export type EditProductMutation = { __typename?: 'Mutation', editProduct: { __typename?: 'MutationResponse', success: boolean, message: string } };

export type AllProductQueryVariables = Exact<{
  offset: Scalars['Int']['input'];
}>;


export type AllProductQuery = { __typename?: 'Query', allProduct?: Array<{ __typename?: 'Product', id: string, title: string, original_photo?: Array<string | null> | null, result_texture?: string | null, result_mtl?: string | null, result_obj?: string | null, result_usda?: string | null, result_gltf?: string | null, createdAt: string, updatedAt: string } | null> | null };

export type GetMyProductQueryVariables = Exact<{
  offset: Scalars['Int']['input'];
}>;


export type GetMyProductQuery = { __typename?: 'Query', getMyProduct?: Array<{ __typename?: 'Product', id: string, title: string, original_photo?: Array<string | null> | null, result_texture?: string | null, result_mtl?: string | null, result_obj?: string | null, result_usda?: string | null, result_gltf?: string | null, createdAt: string, updatedAt: string } | null> | null };

export type ProductDetailQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type ProductDetailQuery = { __typename?: 'Query', productDetail?: { __typename?: 'Product', id: string, title: string, original_photo?: Array<string | null> | null, result_ao?: string | null, result_disp?: string | null, result_normal?: string | null, result_roughness?: string | null, result_texture?: string | null, result_mtl?: string | null, result_obj?: string | null, result_usda?: string | null, result_gltf?: string | null, createdAt: string, updatedAt: string } | null };

export type CreateAccountMutationVariables = Exact<{
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type CreateAccountMutation = { __typename?: 'Mutation', createAccount: { __typename?: 'MutationResponse', success: boolean, message: string } };

export type LoginMutationVariables = Exact<{
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'LoginMutationResponse', success: boolean, token?: string | null, message: string } };

export type EditProfileMutationVariables = Exact<{
  password?: InputMaybe<Scalars['String']['input']>;
}>;


export type EditProfileMutation = { __typename?: 'Mutation', editProfile: { __typename?: 'MutationResponse', success: boolean, message: string } };

export type ResetPasswordMutationVariables = Exact<{
  email: Scalars['String']['input'];
}>;


export type ResetPasswordMutation = { __typename?: 'Mutation', resetPassword: { __typename?: 'ResetPasswordResult', success: boolean, message?: string | null } };

export type DeleteAccountMutationVariables = Exact<{
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type DeleteAccountMutation = { __typename?: 'Mutation', deleteAccount: { __typename?: 'MutationResponse', success: boolean, message: string } };

export type GetMyInfoQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMyInfoQuery = { __typename?: 'Query', getMyInfo?: { __typename?: 'User', id: string, email: string, password: string, freeCoupon: number, isAdmin: boolean, isSubscribed: boolean, createdAt: string, updatedAt: string } | null };

export type GetAllUsersQueryVariables = Exact<{
  offset: Scalars['Int']['input'];
}>;


export type GetAllUsersQuery = { __typename?: 'Query', getAllUsers?: Array<{ __typename?: 'User', id: string, email: string, password: string, freeCoupon: number, isAdmin: boolean, isSubscribed: boolean, createdAt: string, updatedAt: string } | null> | null };


export const UploadProductDocument = gql`
    mutation uploadProduct($original_photo: [String], $title: String!) {
  uploadProduct(original_photo: $original_photo, title: $title) {
    success
    message
  }
}
    `;
export type UploadProductMutationFn = Apollo.MutationFunction<UploadProductMutation, UploadProductMutationVariables>;

/**
 * __useUploadProductMutation__
 *
 * To run a mutation, you first call `useUploadProductMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUploadProductMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [uploadProductMutation, { data, loading, error }] = useUploadProductMutation({
 *   variables: {
 *      original_photo: // value for 'original_photo'
 *      title: // value for 'title'
 *   },
 * });
 */
export function useUploadProductMutation(baseOptions?: Apollo.MutationHookOptions<UploadProductMutation, UploadProductMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UploadProductMutation, UploadProductMutationVariables>(UploadProductDocument, options);
      }
export type UploadProductMutationHookResult = ReturnType<typeof useUploadProductMutation>;
export type UploadProductMutationResult = Apollo.MutationResult<UploadProductMutation>;
export type UploadProductMutationOptions = Apollo.BaseMutationOptions<UploadProductMutation, UploadProductMutationVariables>;
export const DeleteProductDocument = gql`
    mutation deleteProduct($id: String!) {
  deleteProduct(id: $id) {
    success
    message
  }
}
    `;
export type DeleteProductMutationFn = Apollo.MutationFunction<DeleteProductMutation, DeleteProductMutationVariables>;

/**
 * __useDeleteProductMutation__
 *
 * To run a mutation, you first call `useDeleteProductMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteProductMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteProductMutation, { data, loading, error }] = useDeleteProductMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteProductMutation(baseOptions?: Apollo.MutationHookOptions<DeleteProductMutation, DeleteProductMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteProductMutation, DeleteProductMutationVariables>(DeleteProductDocument, options);
      }
export type DeleteProductMutationHookResult = ReturnType<typeof useDeleteProductMutation>;
export type DeleteProductMutationResult = Apollo.MutationResult<DeleteProductMutation>;
export type DeleteProductMutationOptions = Apollo.BaseMutationOptions<DeleteProductMutation, DeleteProductMutationVariables>;
export const EditProductDocument = gql`
    mutation editProduct($id: String!, $title: String!) {
  editProduct(id: $id, title: $title) {
    success
    message
  }
}
    `;
export type EditProductMutationFn = Apollo.MutationFunction<EditProductMutation, EditProductMutationVariables>;

/**
 * __useEditProductMutation__
 *
 * To run a mutation, you first call `useEditProductMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEditProductMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [editProductMutation, { data, loading, error }] = useEditProductMutation({
 *   variables: {
 *      id: // value for 'id'
 *      title: // value for 'title'
 *   },
 * });
 */
export function useEditProductMutation(baseOptions?: Apollo.MutationHookOptions<EditProductMutation, EditProductMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<EditProductMutation, EditProductMutationVariables>(EditProductDocument, options);
      }
export type EditProductMutationHookResult = ReturnType<typeof useEditProductMutation>;
export type EditProductMutationResult = Apollo.MutationResult<EditProductMutation>;
export type EditProductMutationOptions = Apollo.BaseMutationOptions<EditProductMutation, EditProductMutationVariables>;
export const AllProductDocument = gql`
    query allProduct($offset: Int!) {
  allProduct(offset: $offset) {
    id
    title
    original_photo
    result_texture
    result_mtl
    result_obj
    result_usda
    result_gltf
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useAllProductQuery__
 *
 * To run a query within a React component, call `useAllProductQuery` and pass it any options that fit your needs.
 * When your component renders, `useAllProductQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAllProductQuery({
 *   variables: {
 *      offset: // value for 'offset'
 *   },
 * });
 */
export function useAllProductQuery(baseOptions: Apollo.QueryHookOptions<AllProductQuery, AllProductQueryVariables> & ({ variables: AllProductQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AllProductQuery, AllProductQueryVariables>(AllProductDocument, options);
      }
export function useAllProductLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AllProductQuery, AllProductQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AllProductQuery, AllProductQueryVariables>(AllProductDocument, options);
        }
export function useAllProductSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<AllProductQuery, AllProductQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<AllProductQuery, AllProductQueryVariables>(AllProductDocument, options);
        }
export type AllProductQueryHookResult = ReturnType<typeof useAllProductQuery>;
export type AllProductLazyQueryHookResult = ReturnType<typeof useAllProductLazyQuery>;
export type AllProductSuspenseQueryHookResult = ReturnType<typeof useAllProductSuspenseQuery>;
export type AllProductQueryResult = Apollo.QueryResult<AllProductQuery, AllProductQueryVariables>;
export const GetMyProductDocument = gql`
    query getMyProduct($offset: Int!) {
  getMyProduct(offset: $offset) {
    id
    title
    original_photo
    result_texture
    result_mtl
    result_obj
    result_usda
    result_gltf
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useGetMyProductQuery__
 *
 * To run a query within a React component, call `useGetMyProductQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMyProductQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMyProductQuery({
 *   variables: {
 *      offset: // value for 'offset'
 *   },
 * });
 */
export function useGetMyProductQuery(baseOptions: Apollo.QueryHookOptions<GetMyProductQuery, GetMyProductQueryVariables> & ({ variables: GetMyProductQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMyProductQuery, GetMyProductQueryVariables>(GetMyProductDocument, options);
      }
export function useGetMyProductLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMyProductQuery, GetMyProductQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMyProductQuery, GetMyProductQueryVariables>(GetMyProductDocument, options);
        }
export function useGetMyProductSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetMyProductQuery, GetMyProductQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetMyProductQuery, GetMyProductQueryVariables>(GetMyProductDocument, options);
        }
export type GetMyProductQueryHookResult = ReturnType<typeof useGetMyProductQuery>;
export type GetMyProductLazyQueryHookResult = ReturnType<typeof useGetMyProductLazyQuery>;
export type GetMyProductSuspenseQueryHookResult = ReturnType<typeof useGetMyProductSuspenseQuery>;
export type GetMyProductQueryResult = Apollo.QueryResult<GetMyProductQuery, GetMyProductQueryVariables>;
export const ProductDetailDocument = gql`
    query productDetail($id: String!) {
  productDetail(id: $id) {
    id
    title
    original_photo
    result_ao
    result_disp
    result_normal
    result_roughness
    result_texture
    result_mtl
    result_obj
    result_usda
    result_gltf
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useProductDetailQuery__
 *
 * To run a query within a React component, call `useProductDetailQuery` and pass it any options that fit your needs.
 * When your component renders, `useProductDetailQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProductDetailQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useProductDetailQuery(baseOptions: Apollo.QueryHookOptions<ProductDetailQuery, ProductDetailQueryVariables> & ({ variables: ProductDetailQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ProductDetailQuery, ProductDetailQueryVariables>(ProductDetailDocument, options);
      }
export function useProductDetailLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ProductDetailQuery, ProductDetailQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ProductDetailQuery, ProductDetailQueryVariables>(ProductDetailDocument, options);
        }
export function useProductDetailSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<ProductDetailQuery, ProductDetailQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ProductDetailQuery, ProductDetailQueryVariables>(ProductDetailDocument, options);
        }
export type ProductDetailQueryHookResult = ReturnType<typeof useProductDetailQuery>;
export type ProductDetailLazyQueryHookResult = ReturnType<typeof useProductDetailLazyQuery>;
export type ProductDetailSuspenseQueryHookResult = ReturnType<typeof useProductDetailSuspenseQuery>;
export type ProductDetailQueryResult = Apollo.QueryResult<ProductDetailQuery, ProductDetailQueryVariables>;
export const CreateAccountDocument = gql`
    mutation createAccount($email: String!, $password: String!) {
  createAccount(email: $email, password: $password) {
    success
    message
  }
}
    `;
export type CreateAccountMutationFn = Apollo.MutationFunction<CreateAccountMutation, CreateAccountMutationVariables>;

/**
 * __useCreateAccountMutation__
 *
 * To run a mutation, you first call `useCreateAccountMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateAccountMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createAccountMutation, { data, loading, error }] = useCreateAccountMutation({
 *   variables: {
 *      email: // value for 'email'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useCreateAccountMutation(baseOptions?: Apollo.MutationHookOptions<CreateAccountMutation, CreateAccountMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateAccountMutation, CreateAccountMutationVariables>(CreateAccountDocument, options);
      }
export type CreateAccountMutationHookResult = ReturnType<typeof useCreateAccountMutation>;
export type CreateAccountMutationResult = Apollo.MutationResult<CreateAccountMutation>;
export type CreateAccountMutationOptions = Apollo.BaseMutationOptions<CreateAccountMutation, CreateAccountMutationVariables>;
export const LoginDocument = gql`
    mutation login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    success
    token
    message
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
 *      email: // value for 'email'
 *      password: // value for 'password'
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
export const EditProfileDocument = gql`
    mutation editProfile($password: String) {
  editProfile(password: $password) {
    success
    message
  }
}
    `;
export type EditProfileMutationFn = Apollo.MutationFunction<EditProfileMutation, EditProfileMutationVariables>;

/**
 * __useEditProfileMutation__
 *
 * To run a mutation, you first call `useEditProfileMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEditProfileMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [editProfileMutation, { data, loading, error }] = useEditProfileMutation({
 *   variables: {
 *      password: // value for 'password'
 *   },
 * });
 */
export function useEditProfileMutation(baseOptions?: Apollo.MutationHookOptions<EditProfileMutation, EditProfileMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<EditProfileMutation, EditProfileMutationVariables>(EditProfileDocument, options);
      }
export type EditProfileMutationHookResult = ReturnType<typeof useEditProfileMutation>;
export type EditProfileMutationResult = Apollo.MutationResult<EditProfileMutation>;
export type EditProfileMutationOptions = Apollo.BaseMutationOptions<EditProfileMutation, EditProfileMutationVariables>;
export const ResetPasswordDocument = gql`
    mutation resetPassword($email: String!) {
  resetPassword(email: $email) {
    success
    message
  }
}
    `;
export type ResetPasswordMutationFn = Apollo.MutationFunction<ResetPasswordMutation, ResetPasswordMutationVariables>;

/**
 * __useResetPasswordMutation__
 *
 * To run a mutation, you first call `useResetPasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useResetPasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [resetPasswordMutation, { data, loading, error }] = useResetPasswordMutation({
 *   variables: {
 *      email: // value for 'email'
 *   },
 * });
 */
export function useResetPasswordMutation(baseOptions?: Apollo.MutationHookOptions<ResetPasswordMutation, ResetPasswordMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ResetPasswordMutation, ResetPasswordMutationVariables>(ResetPasswordDocument, options);
      }
export type ResetPasswordMutationHookResult = ReturnType<typeof useResetPasswordMutation>;
export type ResetPasswordMutationResult = Apollo.MutationResult<ResetPasswordMutation>;
export type ResetPasswordMutationOptions = Apollo.BaseMutationOptions<ResetPasswordMutation, ResetPasswordMutationVariables>;
export const DeleteAccountDocument = gql`
    mutation deleteAccount($email: String!, $password: String!) {
  deleteAccount(email: $email, password: $password) {
    success
    message
  }
}
    `;
export type DeleteAccountMutationFn = Apollo.MutationFunction<DeleteAccountMutation, DeleteAccountMutationVariables>;

/**
 * __useDeleteAccountMutation__
 *
 * To run a mutation, you first call `useDeleteAccountMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteAccountMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteAccountMutation, { data, loading, error }] = useDeleteAccountMutation({
 *   variables: {
 *      email: // value for 'email'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useDeleteAccountMutation(baseOptions?: Apollo.MutationHookOptions<DeleteAccountMutation, DeleteAccountMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteAccountMutation, DeleteAccountMutationVariables>(DeleteAccountDocument, options);
      }
export type DeleteAccountMutationHookResult = ReturnType<typeof useDeleteAccountMutation>;
export type DeleteAccountMutationResult = Apollo.MutationResult<DeleteAccountMutation>;
export type DeleteAccountMutationOptions = Apollo.BaseMutationOptions<DeleteAccountMutation, DeleteAccountMutationVariables>;
export const GetMyInfoDocument = gql`
    query getMyInfo {
  getMyInfo {
    id
    email
    password
    freeCoupon
    isAdmin
    isSubscribed
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useGetMyInfoQuery__
 *
 * To run a query within a React component, call `useGetMyInfoQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMyInfoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMyInfoQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetMyInfoQuery(baseOptions?: Apollo.QueryHookOptions<GetMyInfoQuery, GetMyInfoQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMyInfoQuery, GetMyInfoQueryVariables>(GetMyInfoDocument, options);
      }
export function useGetMyInfoLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMyInfoQuery, GetMyInfoQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMyInfoQuery, GetMyInfoQueryVariables>(GetMyInfoDocument, options);
        }
export function useGetMyInfoSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetMyInfoQuery, GetMyInfoQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetMyInfoQuery, GetMyInfoQueryVariables>(GetMyInfoDocument, options);
        }
export type GetMyInfoQueryHookResult = ReturnType<typeof useGetMyInfoQuery>;
export type GetMyInfoLazyQueryHookResult = ReturnType<typeof useGetMyInfoLazyQuery>;
export type GetMyInfoSuspenseQueryHookResult = ReturnType<typeof useGetMyInfoSuspenseQuery>;
export type GetMyInfoQueryResult = Apollo.QueryResult<GetMyInfoQuery, GetMyInfoQueryVariables>;
export const GetAllUsersDocument = gql`
    query getAllUsers($offset: Int!) {
  getAllUsers(offset: $offset) {
    id
    email
    password
    freeCoupon
    isAdmin
    isSubscribed
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useGetAllUsersQuery__
 *
 * To run a query within a React component, call `useGetAllUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllUsersQuery({
 *   variables: {
 *      offset: // value for 'offset'
 *   },
 * });
 */
export function useGetAllUsersQuery(baseOptions: Apollo.QueryHookOptions<GetAllUsersQuery, GetAllUsersQueryVariables> & ({ variables: GetAllUsersQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllUsersQuery, GetAllUsersQueryVariables>(GetAllUsersDocument, options);
      }
export function useGetAllUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllUsersQuery, GetAllUsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllUsersQuery, GetAllUsersQueryVariables>(GetAllUsersDocument, options);
        }
export function useGetAllUsersSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetAllUsersQuery, GetAllUsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAllUsersQuery, GetAllUsersQueryVariables>(GetAllUsersDocument, options);
        }
export type GetAllUsersQueryHookResult = ReturnType<typeof useGetAllUsersQuery>;
export type GetAllUsersLazyQueryHookResult = ReturnType<typeof useGetAllUsersLazyQuery>;
export type GetAllUsersSuspenseQueryHookResult = ReturnType<typeof useGetAllUsersSuspenseQuery>;
export type GetAllUsersQueryResult = Apollo.QueryResult<GetAllUsersQuery, GetAllUsersQueryVariables>;