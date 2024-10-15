// import Image from "next/image";
// import Link from "next/link";
// import React from "react";
// import { formatToTimeAgo, formatToWon } from "../lib/utils";

// interface ListProductProps {
//   id: string;
//   title: string;
//   item_name: string;
//   item_number: string;
//   original_photos: { url: string }[];
//   createdAt: Date;
// }

// export default function ListProduct({
//   id,
//   title,
//   item_name,
//   item_number,
//   original_photos,
//   createdAt,
// }: ListProductProps) {
//   return (
//     <Link
//       href={`/products/${id}`}
//       className="flex flex-col gap-5 w-full border-2 rounded-2xl p-2"
//     >
//       <div className="relative size-60 rounded-md overflow-hidden">
//         <Image
//           className="object-cover"
//           fill
//           src={original_photos[0]?.url || "/placeholder.jpg"}
//           alt={title}
//         />
//       </div>
//       <div className="flex justify-between *:text-neutral-800">
//         <span className="text-lg">{title}</span>
//         <span className="text-lg text-neutral-500">
//           {formatToTimeAgo(createdAt.toString())}
//         </span>
//       </div>
//       <div className="text-sm text-neutral-600">
//         {item_name} - {item_number}
//       </div>
//     </Link>
//   );
// }
