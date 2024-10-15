// useUser.ts
"use client";

import { useQuery } from "@apollo/client";
import { GetMyInfoQuery } from "../gql/graphql";
import { GET_MY_QUERY } from "../api/user/query";
import { isLoggedInVar } from "@/lib/apolloClient";

export default function useUser() {
	const isLoggedIn = isLoggedInVar();

	const { data, loading, error, refetch } = useQuery<GetMyInfoQuery>(GET_MY_QUERY, {
		skip: !isLoggedIn,
		fetchPolicy: "network-only",
	});

	return { data, loading, error, refetch };
}
