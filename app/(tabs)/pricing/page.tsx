"use client";

import { CheckIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import back from "@/public/partner/partnerBack.png";
import Image from "next/image";

export default function Live() {
	const [showModar, setShowModar] = useState(false);

	const handleDeleteClick = () => {
		setShowModar(true);
	};

	const handleCheckClick = () => {
		setShowModar(false);
	};

	return (
		<div className="relative pt-12">
			<div className=" z-30 ">
				<div className="flex flex-col items-center text-black">
					{showModar && (
						<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
							<div className="bg-white p-6 rounded-md">
								<p className="text-lg mb-4">준비 중 입니다.</p>
								<div className="flex justify-end">
									<button className="px-4 py-2 mr-2 bg-gray-300 rounded" onClick={handleCheckClick}>
										확인
									</button>
								</div>
							</div>
						</div>
					)}
					<span className="font-semibold text-2xl z-20">메타 비전 요금제 및 가격</span>
					<span className="z-20">비지니스에 따라 적합한 플랜을 선택하세요.</span>
				</div>
				<div className="grid grid-cols-1 gap-10 my-10 md:grid-cols-2 xl:grid-cols-3">
					<div className="px-5">
						<div className="flex bg-white flex-col items-center w-full border-[1px] border-neutral-100 shadow-lg rounded-3xl">
							<div className="py-10 px-8 flex flex-col gap-5 w-full border-b-[1px] border-neutral-300 mb-6">
								<div className="text-xl flex flex-col">
									<span className="font-[550]">Basic</span>
									<span>영원히 무료</span>
								</div>
								<span>
									가장 쉽게 Meta Vision을 사용해 보세요. <br /> 결제가 필요하지 않습니다.
								</span>
								<span className="font-semibold text-2xl self-end pt-3 text-right">
									무료 사용 <br /> <span className="text-blue-500">KRW 0</span>
								</span>
							</div>

							<div className="flex flex-col w-full px-8 gap-5 items-center pb-10 py-5">
								<span className="font-medium text-2xl">주요 기능</span>
								<ul className="*:flex *:items-center *:gap-2 *:py-2 self-start">
									<li>
										<XMarkIcon className="size-6 text-red-500" />
										Meta Vision S/W 지원
									</li>
									<li>
										<CheckIcon className="size-6 text-blue-500" />
										Meta Vision App 지원(Android, IOS)
									</li>
									<li>
										<CheckIcon className="size-6 text-blue-500" />
										자유로운 공유(HTML, GIF, MP4)
									</li>
									<li>
										<CheckIcon className="size-6 text-blue-500" />
										Meta Vision Web Viewer 지원
									</li>
								</ul>
								<span className="text-neutral-600 pb-2">* Meta Vision 20개 데이터를 제공합니다.</span>
								<button
									onClick={handleDeleteClick}
									className="hover:scale-105 rounded-md text-2xl text-white bg-blue-400 px-7 py-2">
									무료 시작
								</button>
							</div>
						</div>
					</div>

					<div className="px-5">
						<div className="flex flex-col items-center w-full border-[1px] border-neutral-100 shadow-lg rounded-3xl">
							<div className="py-10 px-8 flex flex-col gap-5 w-full border-b-[1px] border-neutral-300 mb-6">
								<div className="text-xl">
									<span className="font-[550]">Business</span>
								</div>
								<span>
									모든 필수 기능이 필요한 개인 또는 <br /> 중소기업에 적합합니다 결제가 필요합니다
								</span>
								<div className="font-semibold text-2xl self-end pt-3 flex flex-col items-end">
									<span>최저 가격</span>
									<span className="text-blue-500 text-right">
										KRW 10,000/월 <br /> KRW 100,000/년
									</span>
								</div>
							</div>

							<div className="flex flex-col w-full px-8 gap-5 items-center pb-10 py-5">
								<span className="font-medium text-xl">주요 기능</span>
								<ul className="*:flex *:items-center *:gap-2 *:py-2 self-start">
									<li>
										<CheckIcon className="size-6 text-blue-500" />
										Meta Vision S/W 지원
									</li>
									<li>
										<CheckIcon className="size-6 text-blue-500" />
										Meta Vision App 지원(Android, IOS)
									</li>
									<li>
										<CheckIcon className="size-6 text-blue-500" />
										자유로운 공유(HTML, GIF, MP4)
									</li>
									<li>
										<CheckIcon className="size-6 text-blue-500" />
										Meta Vision Web Viewer 지원
									</li>
								</ul>
								<span className="text-neutral-600 pb-2">* Meta Vision 100개 데이터를 제공합니다.</span>
								<button
									onClick={handleDeleteClick}
									className="hover:scale-105 rounded-md text-2xl text-white bg-blue-400 px-7 py-2">
									선택
								</button>
							</div>
						</div>
					</div>

					<div className="px-5">
						<div className="flex flex-col items-center w-full border-[1px] border-neutral-100 shadow-lg rounded-3xl">
							<div className="py-10 pb-12 px-8 flex flex-col gap-5 w-full border-b-[1px] border-neutral-300 mb-6">
								<div className="text-xl">
									<span className="font-[550]">Enterprise</span>
								</div>
								<span>
									대용량 데이터, 확장성 및 추가 기능이 필요한 <br /> 개인 및 기업이나 자체 사이트를
									운영 중인 <br /> 기업에 적합합니다. 영업팀에 문의해 주세요.
								</span>
								<div className="font-semibold text-2xl self-end pt-3 flex flex-col items-end">
									<span>영업팀에 문의하세요.</span>
									<span className="text-blue-500 text-xl">metabank.ask@gmail.com</span>
								</div>
							</div>

							<div className="flex flex-col w-full px-8 gap-5 items-center pb-10 py-5">
								<span className="font-medium text-xl">주요 기능</span>
								<ul className="*:flex *:items-center *:gap-2 *:py-2 self-start">
									<li>
										<CheckIcon className="size-6 text-blue-500" />
										Meta Vision S/W 지원
									</li>
									<li>
										<CheckIcon className="size-6 text-blue-500" />
										Meta Vision App 지원(Android, IOS)
									</li>
									<li>
										<CheckIcon className="size-6 text-blue-500" />
										자유로운 공유(HTML, GIF, MP4)
									</li>
									<li>
										<CheckIcon className="size-6 text-blue-500" />
										Meta Vision Web Viewer 지원
									</li>
								</ul>
								<span className="text-neutral-600 pb-2">* Meta Vision 무제한 데이터를 제공합니다.</span>
								<button className="text-2xl text-white bg-blue-400 px-7 py-2 hover:scale-105 rounded-md">
									<a href="mailto:metabank.ask@gmail.com">영업팀 문의</a>
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
