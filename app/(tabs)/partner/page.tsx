import Image from "next/image";
import partnerBack from "@/public/partner/partnerBack.png";
import partner from "@/public/partner/partner.png";

export default function Partner() {
  return (
    <div className="relative pb-52 max-sm:pb-32">
      <div className="flex justify-center items-center">
        <Image src={partnerBack} alt="Partner" width={0} height={0} />
        <Image
          className="absolute z-10 top-0  scale-75 max-sm:scale-90"
          src={partner}
          alt="Partner"
          width={0}
          height={0}
        />
      </div>
    </div>
  );
}
