import Image from "next/image";
import shoose from "@/public/solution/shoose.gif";
import solution from "@/public/solution/solutionTag.svg";
import meta360 from "@/public/solution/meta_360_sw.svg";
import meta_1 from "@/public/solution/meta360_1.svg";
import meta_2 from "@/public/solution/meta360_2.svg";
import meta_3 from "@/public/solution/meta360_3.svg";
import meta_4 from "@/public/solution/meta360_4.svg";
import meta_arrow from "@/public/solution/meta_arrow.svg";
import solution_1 from "@/public/solution/solution_1.svg";
import solution_2 from "@/public/solution/solution_2.svg";
import solution_3 from "@/public/solution/solution_3.svg";
import bg from "@/public/solution/bg.svg";
import banner from "@/public/solution/banner.svg";

export default function Solution() {
	return (
		<div>
			<div className="relative h-[209px] w-full transition-all sm:h-[400px] ">
				<div className="flex mx-auto justify-between w-full h-full md:max-w-[870px] lg:max-w-[1100px] xl:max-w-[1300px]">
					<div className="absolute z-10 flex flex-col items-start justify-center py-7 px-10 lg:pt-10">
						<span className="font-semibold text-lg text-white mb-1 sm:mb-4 sm:text-3xl max-w-[380px]">
							360도 회전 인터랙션 딥 러닝 기반 소프트웨어
						</span>

						<div className="justify-center pt-2 flex">
							<span className="flex flex-col text-neutral-200 gap-1 sm:gap-2 w-full items-start sm:text-lg max-w-[400px] lg:max-w-full text-xs">
								<span className="text-neutral-100">
									메타비전은 메타뱅크 코퍼레이션에서 개발한 혁신적인 3D 모델 복원 소프트웨어입니다.
								</span>
								<span className="">
									사진 계측 기술을 기반으로 하며, 카메라에 포착된 여러 사진을 활용하여{" "}
									<br className="hidden lg:block" /> 소프트웨어 알고리즘을 통해 3D 모델링 데이터를
									복원합니다.
								</span>
								<span className="">
									메타비전은 결과의 정확성을 높이고 사용자 편의성을 향상시킵니다.
								</span>
							</span>
						</div>
					</div>

					<div className="absolute items-center h-full z-10 w-full hidden md:flex justify-end md:max-w-[870px] lg:max-w-[1100px] xl:max-w-[1300px]">
						<Image className="lg:scale-125" src={shoose} alt="meta" width={400} height={200} />
					</div>
				</div>
				<Image src={bg} className="object-cover object-center" fill alt="meta" />
			</div>

			<div className="relative z-20 lg:block hidden">
				<div className="flex flex-col absolute -top-10 w-full items-center px-4 lg:px-14 text-xs md:text-sm lg:text-base">
					<div className="flex w-full justify-center *:odd:items-end *:py-10 *:justify-between *:px-6 *:max-md:py-4 *:max-md:px-4">
						<div className="bg-neutral-100 max-w-[500px] max-h-[320px] text-black  flex flex-1 flex-col gap-10">
							<span className="w-full">360도 PC/모바일용 Meta360 소프트웨어 무료 제공</span>
							<Image
								className="size-14 md:size-16 lg:size-20"
								src={solution_1}
								alt="meta360"
								width={0}
								height={0}
							/>
						</div>
						<div className="bg-neutral-50 max-w-[500px] max-h-[320px] text-black flex flex-1 flex-col odd:items-end gap-10 shadow-md">
							<span className="w-full">딥 러닝 기반 자동 크롭 지원</span>
							<Image
								className="size-14 md:size-16 lg:size-20"
								src={solution_2}
								alt="meta360"
								width={0}
								height={0}
							/>
						</div>
						<div className="bg-neutral-100 max-w-[500px] max-h-[320px] text-black flex flex-1 flex-col gap-10">
							<span className="w-full">GIF 애니메이션 만들기</span>
							<Image
								className="size-14 md:size-16 lg:size-20"
								src={solution_3}
								alt="meta360"
								width={0}
								height={0}
							/>
						</div>
					</div>

					<div className="lg:flex w-full justify-center *:odd:items-end *:py-10 *:justify-between *:px-6 *:max-md:py-4 *:max-md:px-4">
						<div className="bg-neutral-50 max-w-[500px] max-h-[320px] text-black flex flex-1 flex-col gap-10 odd:items-end shadow-md">
							<span className="w-full">HTML 기반 360도 회전 상호 작용</span>
							<Image
								className="size-14 md:size-16 lg:size-20"
								src={solution_1}
								alt="meta360"
								width={0}
								height={0}
							/>
						</div>
						<div className="bg-neutral-100 max-w-[500px] max-h-[320px] text-black flex flex-1 flex-col gap-10 items-end shadow-md">
							<span className="w-full">realmeta3d.com 에서 게시를 지원</span>
							<Image
								className="size-14 md:size-16 lg:size-20"
								src={solution_2}
								alt="meta360"
								width={0}
								height={0}
							/>
						</div>
						<div className="bg-neutral-50 max-w-[500px] max-h-[320px] text-black flex flex-1 flex-col gap-10 odd:items-end shadow-md">
							<span className="w-full">촬영 및 제작 프로세스 무료 비디오 지원</span>
							<Image
								className="size-14 md:size-16 lg:size-20"
								src={solution_3}
								alt="meta360"
								width={0}
								height={0}
							/>
						</div>
					</div>
				</div>
			</div>

			<div className="flex flex-col lg:hidden items-center text-center gap-8 px-5 bg-neutral-50 pt-10 pb-5">
				<span>
					<span className="text-meta">메타 비전</span>은 주로 온라인에서 제품을 시각화하기 위해 설계된 <br />{" "}
					소프트웨어 및 솔루션입니다.
				</span>
				<span>
					쇼핑몰 딥러닝 기술을 기반으로 이미지를 자동으로 정리하고 <br /> GIF 애니메이션과 HTML 기반의 360도
					회전 인터랙션을 <br /> 쉽고 빠르게 생성할 수 있습니다.
				</span>
			</div>

			<div className="relative w-full h-full lg:hidden">
				<div className="absolute top-0 h-full flex justify-center items-center w-full   max-h-[182px]">
					<span className="text-white text-2xl md:text-4xl">메타비전 솔루션</span>
				</div>
				<Image src={banner} className="object-cover w-full   max-h-[120px]" width={0} height={0} alt="meta" />
			</div>

			<div className="flex flex-col items-center py-10 gap-10 lg:flex-row lg:justify-around w-full lg:mt-[410px]">
				<Image className="object-cover p-7 lg:max-w-[556px]" src={meta360} alt="meta" width={0} height={0} />
				<div className="text-black w-full px-7 text-center md:text-lg max-w-[800px] lg:max-w-[620px]">
					<span className="text-meta">Meta Vision</span>은 주로 온라인에서 제품을 시각화하기 위해 설계된
					소프트웨어 및 솔루션입니다. <br /> <br className="hidden lg:block" /> 쇼핑몰 딥러닝 기술을 기반으로
					이미지를 자동으로 정리하고 GIF 애니메이션과 HTML 기반의 360도 회전 인터랙션을 쉽고 빠르게 생성할 수
					있습니다.
				</div>
			</div>

			<div className="relative w-full h-full hidden lg:block">
				<div className="absolute top-0 h-full flex justify-center items-center w-full   max-h-[182px]">
					<span className="text-white text-2xl md:text-4xl">메타비전 솔루션</span>
				</div>
				<Image src={banner} className="object-cover w-full   max-h-[120px]" width={0} height={0} alt="meta" />
			</div>

			<div className="flex flex-col py-10 shadow-[0_20px_20px_-5px_rgba(0,0,0,0.5)]  *:text-center">
				<div className="flex flex-col items-center justify-center h-full rounded-t-3xl shadow-[0_-5px_5px_-5px_rgba(0,0,0,0.2)] p-8 gap-2 sm:gap-4 md:gap-6">
					<Image className="scale-75" src={meta_1} alt="meta" width={0} height={0} />
					<div className="flex flex-col items-center text-black text-lg">
						<span className="text-meta text-xl pb-2 md:text-2xl md:pb-6">1. 사진</span>
						<div className="flex flex-col items-center text-base md:text-lg">
							<span className="font-[550]">1단계 모델 캡처:</span>
							<span>2D 데이터를 위한 다각도 촬영</span>
						</div>
					</div>
					<Image className="scale-50" src={meta_arrow} alt="meta" width={0} height={0} />
				</div>
				<div className="flex flex-col items-center justify-center h-full rounded-t-2xl shadow-[0_-5px_5px_-5px_rgba(0,0,0,0.2)] p-8 gap-2 sm:gap-4 md:gap-6">
					<Image className="scale-75" src={meta_2} alt="meta" width={0} height={0} />
					<div className="flex flex-col items-center text-black text-base md:text-lg">
						<span className="text-meta text-xl pb-2 md:text-2xl md:pb-6">2. 메타360 소프트웨어</span>
						<span className="font-[550]">2단계 &apos;메타 360&apos;에 사진 업로드:</span>
						<span>자동 복원을 위해 메타비전 360에 사진을 업로드합니다.</span>
					</div>
					<Image className="scale-50" src={meta_arrow} alt="meta" width={0} height={0} />
				</div>
				<div className="flex flex-col items-center justify-center h-full rounded-t-2xl shadow-[0_-5px_5px_-5px_rgba(0,0,0,0.2)] p-8 gap-2 sm:gap-4 md:gap-6">
					<Image className="scale-75" src={meta_3} alt="meta" width={0} height={0} />
					<div className="flex flex-col items-center -mt-3 text-black text-base md:text-lg">
						<span className="text-meta text-xl pb-2 md:text-2xl md:pb-6">3. 3D 자동 복원</span>
						<span className="font-[550]">3단계 완료 확인:</span>
						<span>메타비전 360 S/W를 통해 완성된 2D 데이터를 최종적으로 확인합니다.</span>
					</div>
					<Image className="scale-50" src={meta_arrow} alt="meta" width={0} height={0} />
				</div>
				<div className="flex flex-col items-center justify-center h-full rounded-t-2xl shadow-[0_-5px_5px_-5px_rgba(0,0,0,0.2)] p-8 gap-2 sm:gap-4 md:gap-6">
					<Image className="" src={meta_4} alt="meta" width={0} height={0} />
					<div className="flex flex-col items-center text-black text-base md:text-lg">
						<span className="text-meta text-xl pb-2 md:text-2xl md:pb-6">4. 공유</span>
						<span className="font-[550]">4단계 2D 모델 업로드:</span>
						<span>metabank360 웹사이트에 접속해서 공유합니다.</span>
					</div>
				</div>
			</div>
		</div>
	);
}