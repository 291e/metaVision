import { gql } from "@apollo/client";

export const GET_MY_QUERY = gql`
	query getMyInfo {
		getMyInfo {
			id
			email
			password
			# product {
			#   id
			#   title
			#   original_photo
			#   result_texture
			#   result_mtl
			#   result_obj
			#   result_usda
			#   createdAt
			#   updatedAt
			# }
			freeCoupon
			isAdmin
			isSubscribed
			createdAt
			updatedAt
		}
	}
`;