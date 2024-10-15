// "use client";

// import { useQuery } from "@apollo/client";
// import ListProduct from "./list-product";
// import { useEffect, useRef, useState } from "react";
// import { AllProductQuery, AllProductQueryVariables } from "../app/gql/graphql";
// import { ALL_PRODUCT_QUERY } from "../app/api/product/query";

// interface Product {
//   id: string;
//   title: string;
//   item_name: string;
//   item_number: string;
//   original_photos: { url: string }[];
//   createdAt: Date;
// }

// interface ProductListProps {
//   initialProducts: Product[];
// }

// export default function ProductList({ initialProducts }: ProductListProps) {
//   const [products, setProducts] = useState(initialProducts);
//   const [isLoading, setIsLoading] = useState(false);
//   const [page, setPage] = useState(0);
//   const [isLastPage, setIsLastPage] = useState(false);
//   const trigger = useRef<HTMLSpanElement>(null);
//   const { data, loading } = useQuery<AllProductQuery, AllProductQueryVariables>(
//     ALL_PRODUCT_QUERY,
//     {
//       variables: {
//         offset: 0,
//       },
//     }
//   );

//   useEffect(() => {
//     if (isLastPage || isLoading) return; // 로딩 중이거나 마지막 페이지라면 더 이상 요청하지 않음

//     const observer = new IntersectionObserver(
//       async (
//         entries: IntersectionObserverEntry[],
//         observer: IntersectionObserver
//       ) => {
//         const element = entries[0];
//         if (element.isIntersecting && trigger.current) {
//           observer.unobserve(trigger.current);
//           setIsLoading(true);
//           // const newProducts = await getMoreProducts(page + 1);
//           // if (newProducts.length !== 0) {
//           //   setPage((prev) => prev + 1);
//           //   setProducts((prev) => [...prev, ...newProducts]);
//           // } else {
//           //   setIsLastPage(true);
//           // }
//           setIsLoading(false);
//         }
//       },
//       {
//         threshold: 1.0,
//       }
//     );
//     if (trigger.current) {
//       observer.observe(trigger.current);
//     }
//     return () => {
//       observer.disconnect();
//     };
//   }, [page, isLastPage, isLoading]); // isLastPage와 isLoading을 의존성 배열에 추가

//   return (
//     <div className="p-5 grid grid-cols-2 items-center gap-5">
//       {products.map((product) => (
//         <ListProduct key={product.id} {...product} />
//       ))}

//       {!isLastPage && (
//         <span
//           ref={trigger}
//           className="text-sm font-semibold bg-meta w-fit mx-auto px-3 py-2 rounded-md hover:opacity-90 hover:scale-95"
//         >
//           {isLoading ? "로딩 중" : "Load more"}
//         </span>
//       )}
//     </div>
//   );
// }
