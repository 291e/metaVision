import { gql } from "@apollo/client";

export const ALL_PRODUCT_QUERY = gql`
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
export const MY_PRODUCT_QUERY = gql`
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

export const PRODUCT_DETAIL_QUERY = gql`
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
