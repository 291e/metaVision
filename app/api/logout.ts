import { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	res.setHeader(
		"Set-Cookie",
		serialize("token", "", {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			path: "/",
			maxAge: -1, // 쿠키 즉시 만료
		})
	);

	res.status(200).json({ message: "Logged out" });
}
