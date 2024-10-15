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
    "\n\tmutation uploadProduct($original_photo: [String], $title: String!) {\n\t\tuploadProduct(original_photo: $original_photo, title: $title) {\n\t\t\tsuccess\n\t\t\tmessage\n\t\t}\n\t}\n": types.UploadProductDocument,
    "\n\tmutation deleteProduct($id: String!) {\n\t\tdeleteProduct(id: $id) {\n\t\t\tsuccess\n\t\t\tmessage\n\t\t}\n\t}\n": types.DeleteProductDocument,
    "\n\tmutation editProduct($id: String!, $title: String!) {\n\t\teditProduct(id: $id, title: $title) {\n\t\t\tsuccess\n\t\t\tmessage\n\t\t}\n\t}\n": types.EditProductDocument,
    "\n\tquery allProduct($offset: Int!) {\n\t\tallProduct(offset: $offset) {\n\t\t\tid\n\t\t\ttitle\n\t\t\toriginal_photo\n\t\t\tresult_texture\n\t\t\tresult_mtl\n\t\t\tresult_obj\n\t\t\tresult_usda\n\t\t\tcreatedAt\n\t\t\tupdatedAt\n\t\t}\n\t}\n": types.AllProductDocument,
    "\n\tquery getMyProduct($offset: Int!) {\n\t\tgetMyProduct(offset: $offset) {\n\t\t\tid\n\t\t\ttitle\n\t\t\toriginal_photo\n\t\t\tresult_texture\n\t\t\tresult_mtl\n\t\t\tresult_obj\n\t\t\tresult_usda\n\t\t\tcreatedAt\n\t\t\tupdatedAt\n\t\t}\n\t}\n": types.GetMyProductDocument,
    "\n\tquery productDetail($id: String!) {\n\t\tproductDetail(id: $id) {\n\t\t\tid\n\t\t\ttitle\n\t\t\toriginal_photo\n\t\t\tresult_ao\n\t\t\tresult_disp\n\t\t\tresult_normal\n\t\t\tresult_roughness\n\t\t\tresult_texture\n\t\t\tresult_mtl\n\t\t\tresult_obj\n\t\t\tresult_usda\n\t\t\tcreatedAt\n\t\t\tupdatedAt\n\t\t}\n\t}\n": types.ProductDetailDocument,
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
export function graphql(source: "\n\tmutation uploadProduct($original_photo: [String], $title: String!) {\n\t\tuploadProduct(original_photo: $original_photo, title: $title) {\n\t\t\tsuccess\n\t\t\tmessage\n\t\t}\n\t}\n"): (typeof documents)["\n\tmutation uploadProduct($original_photo: [String], $title: String!) {\n\t\tuploadProduct(original_photo: $original_photo, title: $title) {\n\t\t\tsuccess\n\t\t\tmessage\n\t\t}\n\t}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\tmutation deleteProduct($id: String!) {\n\t\tdeleteProduct(id: $id) {\n\t\t\tsuccess\n\t\t\tmessage\n\t\t}\n\t}\n"): (typeof documents)["\n\tmutation deleteProduct($id: String!) {\n\t\tdeleteProduct(id: $id) {\n\t\t\tsuccess\n\t\t\tmessage\n\t\t}\n\t}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\tmutation editProduct($id: String!, $title: String!) {\n\t\teditProduct(id: $id, title: $title) {\n\t\t\tsuccess\n\t\t\tmessage\n\t\t}\n\t}\n"): (typeof documents)["\n\tmutation editProduct($id: String!, $title: String!) {\n\t\teditProduct(id: $id, title: $title) {\n\t\t\tsuccess\n\t\t\tmessage\n\t\t}\n\t}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\tquery allProduct($offset: Int!) {\n\t\tallProduct(offset: $offset) {\n\t\t\tid\n\t\t\ttitle\n\t\t\toriginal_photo\n\t\t\tresult_texture\n\t\t\tresult_mtl\n\t\t\tresult_obj\n\t\t\tresult_usda\n\t\t\tcreatedAt\n\t\t\tupdatedAt\n\t\t}\n\t}\n"): (typeof documents)["\n\tquery allProduct($offset: Int!) {\n\t\tallProduct(offset: $offset) {\n\t\t\tid\n\t\t\ttitle\n\t\t\toriginal_photo\n\t\t\tresult_texture\n\t\t\tresult_mtl\n\t\t\tresult_obj\n\t\t\tresult_usda\n\t\t\tcreatedAt\n\t\t\tupdatedAt\n\t\t}\n\t}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\tquery getMyProduct($offset: Int!) {\n\t\tgetMyProduct(offset: $offset) {\n\t\t\tid\n\t\t\ttitle\n\t\t\toriginal_photo\n\t\t\tresult_texture\n\t\t\tresult_mtl\n\t\t\tresult_obj\n\t\t\tresult_usda\n\t\t\tcreatedAt\n\t\t\tupdatedAt\n\t\t}\n\t}\n"): (typeof documents)["\n\tquery getMyProduct($offset: Int!) {\n\t\tgetMyProduct(offset: $offset) {\n\t\t\tid\n\t\t\ttitle\n\t\t\toriginal_photo\n\t\t\tresult_texture\n\t\t\tresult_mtl\n\t\t\tresult_obj\n\t\t\tresult_usda\n\t\t\tcreatedAt\n\t\t\tupdatedAt\n\t\t}\n\t}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\tquery productDetail($id: String!) {\n\t\tproductDetail(id: $id) {\n\t\t\tid\n\t\t\ttitle\n\t\t\toriginal_photo\n\t\t\tresult_ao\n\t\t\tresult_disp\n\t\t\tresult_normal\n\t\t\tresult_roughness\n\t\t\tresult_texture\n\t\t\tresult_mtl\n\t\t\tresult_obj\n\t\t\tresult_usda\n\t\t\tcreatedAt\n\t\t\tupdatedAt\n\t\t}\n\t}\n"): (typeof documents)["\n\tquery productDetail($id: String!) {\n\t\tproductDetail(id: $id) {\n\t\t\tid\n\t\t\ttitle\n\t\t\toriginal_photo\n\t\t\tresult_ao\n\t\t\tresult_disp\n\t\t\tresult_normal\n\t\t\tresult_roughness\n\t\t\tresult_texture\n\t\t\tresult_mtl\n\t\t\tresult_obj\n\t\t\tresult_usda\n\t\t\tcreatedAt\n\t\t\tupdatedAt\n\t\t}\n\t}\n"];
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