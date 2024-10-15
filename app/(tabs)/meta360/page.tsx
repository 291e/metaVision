"use client";

import { useMutation, useQuery, useReactiveVar } from "@apollo/client";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef, ChangeEvent, FormEvent, useMemo } from "react";
import { ALL_PRODUCT_QUERY } from "../../api/product/query";
import { GET_MY_QUERY } from "../../api/user/query";
import { DELETE_PRODUCT_MUTATION } from "@/app/api/product/mutation";
import { TrashIcon } from "@heroicons/react/24/solid";
import {
	DeleteProductMutation,
	DeleteProductMutationVariables,
	GetMyInfoQuery,
	AllProductQuery,
	type Product,
	AllProductQueryVariables,
} from "@/app/gql/graphql";
import banner from "@/public/blue.png";
import { isLoggedInVar } from "@/lib/apolloClient";

export default function Product() {
	const router = useRouter();
	const searchParams = useSearchParams();

	// URL에서 페이지 번호 가져오기
	const pageParam = searchParams.get("page");
	const initialPage = pageParam ? parseInt(pageParam, 10) : 1;

	const [products, setProducts] = useState<Product[]>([]);
	const [page, setPage] = useState(initialPage);
	const [isLastPage, setIsLastPage] = useState(false);

	// 검색 상태 관리
	const [searchItemName, setSearchItemName] = useState<string>("");

	// 삭제 확인 모달 상태 관리
	const [showConfirm, setShowConfirm] = useState(false);
	const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

	// 상품 목록 컨테이너의 참조 생성
	const productListRef = useRef<HTMLDivElement>(null);

	// 사용자 정보 가져오기
	const { data: userData, loading: userLoading, error: userError } = useQuery<GetMyInfoQuery>(GET_MY_QUERY);

	const isLoggedIn = useReactiveVar(isLoggedInVar);

	// 상품 삭제 뮤테이션
	const [deleteProductMutation] = useMutation<DeleteProductMutation, DeleteProductMutationVariables>(
		DELETE_PRODUCT_MUTATION,
		{
			onCompleted: async (data) => {
				if (data.deleteProduct.success) {
					console.log("Product deleted");
					// 상품 목록 갱신
					await refetch();
				} else {
					console.log("Failed to delete product:", data.deleteProduct.message);
				}
			},
		}
	);

	const deleteProduct = (id: string) => {
		deleteProductMutation({
			variables: { id },
		});
	};

	// 쿼리 변수 설정
	const itemsPerPage = 16;
	const offset = (page - 1) * itemsPerPage;

	// 상품 데이터 가져오기
	const { data, loading, error, refetch } = useQuery<AllProductQuery, AllProductQueryVariables>(ALL_PRODUCT_QUERY, {
		variables: { offset },
		fetchPolicy: "cache-and-network",
	});

	// 상품 데이터 상태 관리 및 스크롤 위치 조정
	useEffect(() => {
		if (data?.allProduct) {
			const fetchedProducts = data.allProduct.filter((product): product is Product => product !== null);

			if (fetchedProducts.length < itemsPerPage) {
				setIsLastPage(true);
			} else {
				setIsLastPage(false);
			}

			setProducts(fetchedProducts);
		}
	}, [data?.allProduct, itemsPerPage]);

	useEffect(() => {
		refetch();
	}, [isLoggedIn, refetch]);

	// 페이지 변경 시 URL 쿼리 파라미터 업데이트
	useEffect(() => {
		const params = new URLSearchParams();
		params.set("page", page.toString());

		if (searchItemName) {
			params.set("item_name", searchItemName);
		} else {
			params.delete("item_name");
		}

		router.replace(`?${params.toString()}`);
	}, [page, searchItemName, router]);

	// 페이지 변경 핸들러
	const handlePageChange = (pageNum: number) => {
		setPage(pageNum);
		setIsLastPage(false);
	};

	// 삭제 버튼 클릭 핸들러
	const handleDeleteClick = (productId: string) => {
		setSelectedProductId(productId);
		setShowConfirm(true);
	};

	// 삭제 확인 모달에서 'Y' 버튼 클릭 핸들러
	const handleConfirmDelete = () => {
		if (selectedProductId) {
			deleteProduct(selectedProductId);
			setShowConfirm(false);
			setSelectedProductId(null);
		}
	};

	// 삭제 확인 모달에서 'N' 버튼 클릭 핸들러
	const handleCancelDelete = () => {
		setShowConfirm(false);
		setSelectedProductId(null);
	};

	// 검색 폼 제출 핸들러
	const handleSearchSubmit = (e: FormEvent) => {
		e.preventDefault();
		// 페이지를 1로 리셋하고, refetch를 트리거
		setPage(1);
		setIsLastPage(false);
		refetch({
			offset: 0,
		});
	};

	// 검색어가 있는 경우 필터링된 상품 리스트 생성
	const filteredProducts = useMemo(() => {
		return products.filter((product) => product.title.toLowerCase().includes(searchItemName.toLowerCase()));
	}, [products, searchItemName]);

	if (loading || userLoading) {
		return <h1>로딩 중...</h1>;
	}

	if (error || userError) {
		return <h1>에러 발생: {error?.message || userError?.message}</h1>;
	}

	return (
		<div className="relative h-full">
			{/* 배너 */}
			<div className="flex justify-center">
				<Image src={banner} alt="Banner" width={0} height={0} />
			</div>

			{/* 삭제 확인 모달 */}
			{showConfirm && (
				<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
					<div className="bg-white p-6 rounded-md">
						<p className="text-lg mb-4">정말 삭제하실 겁니까?</p>
						<div className="flex justify-end">
							<button className="px-4 py-2 mr-2 bg-gray-300 rounded" onClick={handleCancelDelete}>
								N
							</button>
							<button className="px-4 py-2 bg-red-500 text-white rounded" onClick={handleConfirmDelete}>
								Y
							</button>
						</div>
					</div>
				</div>
			)}

			{/* 상품 목록 */}
			<div
				ref={productListRef} // 참조 연결
				className="p-5 grid grid-cols-4 max-2xl:grid-cols-4 max-xl:grid-cols-2 max-sm:grid-cols-1 transition-all transform items-center gap-5">
				{filteredProducts.length === 0 ? (
					<p className="text-center text-gray-500 col-span-full">검색 결과가 없습니다.</p>
				) : (
					filteredProducts.map((product) => (
						<div key={product.id} className="relative flex flex-col gap-5 w-full rounded-2xl p-2 shadow-md">
							{userData?.getMyInfo?.isAdmin && (
								<button
									onClick={() => handleDeleteClick(product.id)}
									className="absolute top-2 right-2 z-10 w-10 h-10 bg-meta rounded-md flex justify-center items-center"
									aria-label={`Delete ${product.title}`}>
									<TrashIcon className="w-7 h-7 max-lg:w-5 max-lg:h-5 text-white" />
								</button>
							)}
							<Link
								href={`/meta360/${product.id}`}
								className="relative size-60 rounded-md mx-auto overflow-hidden">
								{product.original_photo &&
									product.original_photo.length > 0 &&
									product.original_photo[0] && (
										<Image
											className="object-cover"
											width={360} // 1080 / 3
											height={640} // 1920 / 3
											src={product.original_photo[0]}
											alt={product.title}
											priority
										/>
									)}
							</Link>
							<div className="flex justify-center text-neutral-800">
								<span className="text-lg">{product.title}</span>
							</div>
						</div>
					))
				)}
			</div>

			{/* 검색 폼 */}
			<div className="flex justify-center my-4">
				<form onSubmit={handleSearchSubmit} className="flex items-center gap-4">
					<input
						type="text"
						placeholder="아이템 이름 검색"
						value={searchItemName}
						onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchItemName(e.target.value)}
						className="border border-gray-300 rounded px-4 py-2 w-64"
					/>
					<button type="submit" className="px-4 py-2 bg-meta text-white rounded">
						검색
					</button>
				</form>
			</div>

			{/* 페이징 */}
			<div className="flex justify-center mt-4">
				<button
					type="button"
					className={`my-2 px-4 py-2 rounded hover:scale-110 transition-transform ${
						isLastPage ? "bg-gray-200 text-gray-800 cursor-not-allowed" : "bg-meta text-white"
					}`}
					onClick={() => {
						if (!isLastPage) {
							handlePageChange(page + 1);
						}
					}}
					disabled={isLastPage}>
					Next
				</button>
			</div>
		</div>
	);
}
