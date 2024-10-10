"use client";
import React from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import banner1 from "@/assets/images/CVO-V2-T1-1100x220.webp";
import banner2 from "@/assets/images/BANNER (2).webp";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const JobBannerCarousel: React.FC = () => {
  const [api, setApi] = React.useState<CarouselApi>();

  return (
    <div className="mt-4 relative">
      <Carousel
        opts={{
          align: "start",
          slidesToScroll: 1,
          loop: true,
        }}
        className="w-full overflow-hidden rounded-[10px]"
        setApi={setApi}
      >
        <CarouselContent>
          <CarouselItem className="pl-0">
            <Image
              src={banner1}
              alt="banner1"
              width={1140}
              height={234}
              className="w-full"
            />
          </CarouselItem>
          <CarouselItem className="pl-0">
            <Image
              src={banner2}
              alt="banner2"
              width={1140}
              height={234}
              className="w-full"
            />
          </CarouselItem>
        </CarouselContent>
      </Carousel>
      <button
        onClick={() => api?.scrollPrev()}
        className="absolute top-1/2 -translate-y-1/2 bg-white left-[-20px] text-[18px] w-10 h-10 flex items-center justify-center rounded-full text-[#00b14f] cursor-pointer hover:bg-[#00b14f] hover:text-white z-10 shadow-[0_6px_16px_rgba(0,0,0,0.08)] transition-all duration-300"
      >
        <IoIosArrowBack />
      </button>
      <button
        onClick={() => api?.scrollNext()}
        className="absolute top-1/2 -translate-y-1/2 bg-white right-[-20px] text-[18px] w-10 h-10 flex items-center justify-center rounded-full text-[#00b14f] cursor-pointer hover:bg-[#00b14f] hover:text-white z-10 shadow-[0_6px_16px_rgba(0,0,0,0.08)] transition-all duration-300"
      >
        <IoIosArrowForward />
      </button>
    </div>
  );
};

export default JobBannerCarousel;
