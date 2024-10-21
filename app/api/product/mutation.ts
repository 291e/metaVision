import { gql } from "@apollo/client";

export const UPLOAD_PRODUCT_MUTATION = gql`
  mutation uploadProduct($original_photo: [String], $title: String!) {
    uploadProduct(original_photo: $original_photo, title: $title) {
      success
      message
    }
  }
`;
export const DELETE_PRODUCT_MUTATION = gql`
  mutation deleteProduct($id: String!) {
    deleteProduct(id: $id) {
      success
      message
    }
  }
`;
export const EDIT_PRODUCT_MUTATION = gql`
  mutation editProduct($id: String!, $title: String!) {
    editProduct(id: $id, title: $title) {
      success
      message
    }
  }
`;
