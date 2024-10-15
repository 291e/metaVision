// "use server";
// import { z } from "zod";
// import fs from "fs/promises";
// import prisma from "@/lib/prisma"; // db를 prisma로 변경
// import getSession from "@/lib/session";
// import { redirect } from "next/navigation";

// const productSchema = z.object({
//   photo: z.string({
//     required_error: "사진은 필수입니다.",
//   }),
//   title: z.string({
//     required_error: "제목은 필수입니다.",
//   }),
//   item_number: z.string({
//     required_error: "아이템 번호는 필수입니다.",
//   }),
//   item_name: z.string({
//     required_error: "아이템 이름은 필수입니다.",
//   }),
// });

// export async function uploadProduct(_: any, formData: FormData) {
//   const data = {
//     photo: formData.get("photo"),
//     title: formData.get("title"),
//     item_number: formData.get("item_number"),
//     item_name: formData.get("item_name"),
//   };

//   // 사진 파일 저장
//   if (data.photo instanceof File) {
//     const photoData = await data.photo.arrayBuffer();
//     await fs.writeFile(`./public/${data.photo.name}`, Buffer.from(photoData));
//     data.photo = `/${data.photo.name}`;
//   }

//   // 데이터 검증
//   const result = productSchema.safeParse(data);
//   if (!result.success) {
//     return result.error.flatten();
//   } else {
//     const session = await getSession();
//     if (session.id) {
//       const product = await prisma.product.create({
//         data: {
//           title: result.data.title,
//           item_number: result.data.item_number,
//           item_name: result.data.item_name,
//           original_photos: {
//             create: {
//               url: result.data.photo,
//             },
//           },
//           user: {
//             connect: {
//               id: session.id,
//             },
//           },
//         },
//         select: {
//           id: true,
//         },
//       });
//       return redirect(`/products/${product.id}`);
//     } else {
//       throw new Error("User is not authenticated");
//     }
//   }
// }
