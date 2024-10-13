"use client";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { ICompany } from "@/types/backend";
import Image from "next/image";
import React from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import Autoplay from "embla-carousel-autoplay";
import { Skeleton } from "@/components/ui/skeleton";

interface CompanyCarouselContentProps {
  companies: ICompany[];
}

const CompanyCarouselContent: React.FC<CompanyCarouselContentProps> = ({
  companies,
}) => {
  const [api, setApi] = React.useState<CarouselApi>();

  React.useEffect(() => {
    if (!api) {
      return;
    }
  }, [api]);

  const CompanySkeleton = () => (
    <CarouselItem className="md:basis-1/2 lg:basis-1/4 pl-5">
      <Card className="border border-solid border-[#dee0e2]">
        <CardContent className="flex flex-col items-center justify-center rounded-xl px-4 py-5 w-[270px] min-h-[184px]">
          <Skeleton className="w-24 h-24 rounded-full" />
          <Skeleton className="h-4 w-3/4 mt-4" />
        </CardContent>
      </Card>
    </CarouselItem>
  );

  return (
    <Carousel
      opts={{
        align: "start",
        slidesToScroll: 4,
        loop: true,
      }}
      plugins={[
        Autoplay({
          delay: 3000,
        }),
      ]}
      className="w-full"
      setApi={setApi}
    >
      <div className="flex items-center justify-between text-[#212f3f] text-[16px] pb-4">
        <div className="text-[#00b14f] flex items-center text-2xl font-semibold gap-4">
          <h2>Top Công ty hàng đầu</h2>
        </div>
        <div className="flex items-center justify-center gap-[11px]">
          <span
            onClick={() => api?.scrollPrev()}
            className={`text-[16px] border border-solid w-8 flex items-center justify-center rounded-[50%] aspect-square border-[#00b14f] text-[#00b14f] cursor-pointer hover:bg-[#00b14f] hover:text-white`}
          >
            <IoIosArrowBack />
          </span>
          <span
            onClick={() => api?.scrollNext()}
            className={`text-[16px] border border-solid w-8 flex items-center justify-center rounded-[50%] aspect-square border-[#00b14f] text-[#00b14f] cursor-pointer hover:bg-[#00b14f] hover:text-white`}
          >
            <IoIosArrowForward />
          </span>
        </div>
      </div>
      <CarouselContent>
        {companies.length > 0 ? (
          companies.map((company: ICompany, index: number) => (
            <CarouselItem
              key={index}
              className="md:basis-1/2 lg:basis-1/4 pl-5"
            >
              <Card className="border border-solid border-[#dee0e2] hover:border-[#33c172] transition-colors duration-200 hover:shadow-hoverCardCompany">
                <CardContent className="flex flex-col items-center justify-center rounded-xl px-4 py-5 w-[270px] min-h-[184px]">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_URL_BACKEND}/images/company/${company?.logo}`}
                    alt={`${company?.name}`}
                    width={96}
                    height={96}
                    className="w-[96px] h-[96px] object-contain align-middle"
                  />
                  <h3 className="text-sm text-[#212f3f] font-bold text-center mt-2 w-full min-h-[40px] uppercase">
                    {company?.name}
                  </h3>
                </CardContent>
              </Card>
            </CarouselItem>
          ))
        ) : (
          <>
            <CompanySkeleton />
            <CompanySkeleton />
            <CompanySkeleton />
            <CompanySkeleton />
          </>
        )}
      </CarouselContent>
    </Carousel>
  );
};

export default CompanyCarouselContent;
