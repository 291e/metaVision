// "use client";

// import { isLoggedInVar, tokenVar } from "@/lib/apolloClient";
// import { useEffect } from "react";

// export default function LoginStateManager() {
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     console.log("token: ", token);
//     if (token) {
//       isLoggedInVar(true);
//       tokenVar(token);
//     } else {
//       isLoggedInVar(false);
//       tokenVar("");
//     }
//   }, []); // 컴포넌트 마운트 시 실행, 빈 배열로 두어 첫 렌더링에서만 실행
// }
