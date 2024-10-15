"use client";

import { ArrowRightCircleIcon, MinusCircleIcon } from "@heroicons/react/24/solid";
import { useState } from "react";

export default function CloseOpen() {
	const [open, setOpen] = useState(false);

	const handleOpenToggle = () => {
		setOpen(!open);
	};

	return (
		<>
			{!open ? (
				<>
					<button className="flex items-center gap-2" onClick={handleOpenToggle}>
						<span>모델 종류 접기</span>
						<MinusCircleIcon className="w-5 h-5" />
					</button>
					<div className="grid grid-cols-3 grid-rows-3 py-6 *:shadow-md *:rounded-lg *:flex *:justify-center *:items-center gap-4 *:text-meta *:p-4 animate-fade-in">
						<span>운동화</span>
						<span>자동차 및 차량</span>
						<span>건축 자재</span>
						<span>사람</span>
						<span>자연 및 식물</span>
						<span>가구 및 가전제품</span>
						<span>장소 및 여행</span>
						<span>캐릭터 및 생물</span>
						<span>예술</span>
						<button className="text-meta w-full shadow-md col-span-3">
							<div className="flex gap-4 items-center">
								<p>모델 둘러보기</p>
								<ArrowRightCircleIcon className="size-5" />
							</div>
						</button>
					</div>
				</>
			) : (
				<button className="flex items-center gap-2" onClick={handleOpenToggle}>
					<span>모델 종류 더보기</span>
					<ArrowRightCircleIcon className="w-5 h-5" />
				</button>
			)}
		</>
	);
}
