/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n  mutation uploadProduct($original_photo: [String], $title: String!) {\n    uploadProduct(original_photo: $original_photo, title: $title) {\n      success\n      message\n    }\n  }\n": types.UploadProductDocument,
    "\n  mutation deleteProduct($id: String!) {\n    deleteProduct(id: $id) {\n      success\n      message\n    }\n  }\n": types.DeleteProductDocument,
    "\n  mutation editProduct($id: String!, $title: String!) {\n    editProduct(id: $id, title: $title) {\n      success\n      message\n    }\n  }\n": types.EditProductDocument,
    "\n  query allProduct($offset: Int!) {\n    allProduct(offset: $offset) {\n      id\n      title\n      original_photo\n      result_texture\n      result_mtl\n      result_obj\n      result_usda\n      result_gltf\n      createdAt\n      updatedAt\n    }\n  }\n": types.AllProductDocument,
    "\n  query getMyProduct($offset: Int!) {\n    getMyProduct(offset: $offset) {\n      id\n      title\n      original_photo\n      result_texture\n      result_mtl\n      result_obj\n      result_usda\n      result_gltf\n      createdAt\n      updatedAt\n    }\n  }\n": types.GetMyProductDocument,
    "\n  query productDetail($id: String!) {\n    productDetail(id: $id) {\n      id\n      title\n      original_photo\n      result_ao\n      result_disp\n      result_normal\n      result_roughness\n      result_texture\n      result_mtl\n      result_obj\n      result_usda\n      result_gltf\n      createdAt\n      updatedAt\n    }\n  }\n": types.ProductDetailDocument,
    "\n\tmutation createAccount($email: String!, $password: String!) {\n\t\tcreateAccount(email: $email, password: $password) {\n\t\t\tsuccess\n\t\t\tmessage\n\t\t}\n\t}\n": types.CreateAccountDocument,
    "\n\tmutation login($email: String!, $password: String!) {\n\t\tlogin(email: $email, password: $password) {\n\t\t\tsuccess\n\t\t\ttoken\n\t\t\tmessage\n\t\t}\n\t}\n": types.LoginDocument,
    "\n\tmutation editProfile($password: String) {\n\t\teditProfile(password: $password) {\n\t\t\tsuccess\n\t\t\tmessage\n\t\t}\n\t}\n": types.EditProfileDocument,
    "\n\tmutation resetPassword($email: String!) {\n\t\tresetPassword(email: $email) {\n\t\t\tsuccess\n\t\t\tmessage\n\t\t}\n\t}\n": types.ResetPasswordDocument,
    "\n\tmutation deleteAccount($email: String!, $password: String!) {\n\t\tdeleteAccount(email: $email, password: $password) {\n\t\t\tsuccess\n\t\t\tmessage\n\t\t}\n\t}\n": types.DeleteAccountDocument,
    "\n\tquery getMyInfo {\n\t\tgetMyInfo {\n\t\t\tid\n\t\t\temail\n\t\t\tpassword\n\t\t\t# product {\n\t\t\t#   id\n\t\t\t#   title\n\t\t\t#   original_photo\n\t\t\t#   result_texture\n\t\t\t#   result_mtl\n\t\t\t#   result_obj\n\t\t\t#   result_usda\n\t\t\t#   createdAt\n\t\t\t#   updatedAt\n\t\t\t# }\n\t\t\tfreeCoupon\n\t\t\tisAdmin\n\t\t\tisSubscribed\n\t\t\tcreatedAt\n\t\t\tupdatedAt\n\t\t}\n\t}\n": types.GetMyInfoDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation uploadProduct($original_photo: [String], $title: String!) {\n    uploadProduct(original_photo: $original_photo, title: $title) {\n      success\n      message\n    }\n  }\n"): (typeof documents)["\n  mutation uploadProduct($original_photo: [String], $title: String!) {\n    uploadProduct(original_photo: $original_photo, title: $title) {\n      success\n      message\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation deleteProduct($id: String!) {\n    deleteProduct(id: $id) {\n      success\n      message\n    }\n  }\n"): (typeof documents)["\n  mutation deleteProduct($id: String!) {\n    deleteProduct(id: $id) {\n      success\n      message\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation editProduct($id: String!, $title: String!) {\n    editProduct(id: $id, title: $title) {\n      success\n      message\n    }\n  }\n"): (typeof documents)["\n  mutation editProduct($id: String!, $title: String!) {\n    editProduct(id: $id, title: $title) {\n      success\n      message\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query allProduct($offset: Int!) {\n    allProduct(offset: $offset) {\n      id\n      title\n      original_photo\n      result_texture\n      result_mtl\n      result_obj\n      result_usda\n      result_gltf\n      createdAt\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  query allProduct($offset: Int!) {\n    allProduct(offset: $offset) {\n      id\n      title\n      original_photo\n      result_texture\n      result_mtl\n      result_obj\n      result_usda\n      result_gltf\n      createdAt\n      updatedAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getMyProduct($offset: Int!) {\n    getMyProduct(offset: $offset) {\n      id\n      title\n      original_photo\n      result_texture\n      result_mtl\n      result_obj\n      result_usda\n      result_gltf\n      createdAt\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  query getMyProduct($offset: Int!) {\n    getMyProduct(offset: $offset) {\n      id\n      title\n      original_photo\n      result_texture\n      result_mtl\n      result_obj\n      result_usda\n      result_gltf\n      createdAt\n      updatedAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query productDetail($id: String!) {\n    productDetail(id: $id) {\n      id\n      title\n      original_photo\n      result_ao\n      result_disp\n      result_normal\n      result_roughness\n      result_texture\n      result_mtl\n      result_obj\n      result_usda\n      result_gltf\n      createdAt\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  query productDetail($id: String!) {\n    productDetail(id: $id) {\n      id\n      title\n      original_photo\n      result_ao\n      result_disp\n      result_normal\n      result_roughness\n      result_texture\n      result_mtl\n      result_obj\n      result_usda\n      result_gltf\n      createdAt\n      updatedAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\tmutation createAccount($email: String!, $password: String!) {\n\t\tcreateAccount(email: $email, password: $password) {\n\t\t\tsuccess\n\t\t\tmessage\n\t\t}\n\t}\n"): (typeof documents)["\n\tmutation createAccount($email: String!, $password: String!) {\n\t\tcreateAccount(email: $email, password: $password) {\n\t\t\tsuccess\n\t\t\tmessage\n\t\t}\n\t}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\tmutation login($email: String!, $password: String!) {\n\t\tlogin(email: $email, password: $password) {\n\t\t\tsuccess\n\t\t\ttoken\n\t\t\tmessage\n\t\t}\n\t}\n"): (typeof documents)["\n\tmutation login($email: String!, $password: String!) {\n\t\tlogin(email: $email, password: $password) {\n\t\t\tsuccess\n\t\t\ttoken\n\t\t\tmessage\n\t\t}\n\t}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\tmutation editProfile($password: String) {\n\t\teditProfile(password: $password) {\n\t\t\tsuccess\n\t\t\tmessage\n\t\t}\n\t}\n"): (typeof documents)["\n\tmutation editProfile($password: String) {\n\t\teditProfile(password: $password) {\n\t\t\tsuccess\n\t\t\tmessage\n\t\t}\n\t}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\tmutation resetPassword($email: String!) {\n\t\tresetPassword(email: $email) {\n\t\t\tsuccess\n\t\t\tmessage\n\t\t}\n\t}\n"): (typeof documents)["\n\tmutation resetPassword($email: String!) {\n\t\tresetPassword(email: $email) {\n\t\t\tsuccess\n\t\t\tmessage\n\t\t}\n\t}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\tmutation deleteAccount($email: String!, $password: String!) {\n\t\tdeleteAccount(email: $email, password: $password) {\n\t\t\tsuccess\n\t\t\tmessage\n\t\t}\n\t}\n"): (typeof documents)["\n\tmutation deleteAccount($email: String!, $password: String!) {\n\t\tdeleteAccount(email: $email, password: $password) {\n\t\t\tsuccess\n\t\t\tmessage\n\t\t}\n\t}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\tquery getMyInfo {\n\t\tgetMyInfo {\n\t\t\tid\n\t\t\temail\n\t\t\tpassword\n\t\t\t# product {\n\t\t\t#   id\n\t\t\t#   title\n\t\t\t#   original_photo\n\t\t\t#   result_texture\n\t\t\t#   result_mtl\n\t\t\t#   result_obj\n\t\t\t#   result_usda\n\t\t\t#   createdAt\n\t\t\t#   updatedAt\n\t\t\t# }\n\t\t\tfreeCoupon\n\t\t\tisAdmin\n\t\t\tisSubscribed\n\t\t\tcreatedAt\n\t\t\tupdatedAt\n\t\t}\n\t}\n"): (typeof documents)["\n\tquery getMyInfo {\n\t\tgetMyInfo {\n\t\t\tid\n\t\t\temail\n\t\t\tpassword\n\t\t\t# product {\n\t\t\t#   id\n\t\t\t#   title\n\t\t\t#   original_photo\n\t\t\t#   result_texture\n\t\t\t#   result_mtl\n\t\t\t#   result_obj\n\t\t\t#   result_usda\n\t\t\t#   createdAt\n\t\t\t#   updatedAt\n\t\t\t# }\n\t\t\tfreeCoupon\n\t\t\tisAdmin\n\t\t\tisSubscribed\n\t\t\tcreatedAt\n\t\t\tupdatedAt\n\t\t}\n\t}\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;