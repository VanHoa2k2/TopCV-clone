import CompaniesCarousel from "@/components/client/companies/CompaniesCarousel";
import CompaniesCarouselSkeleton from "@/components/client/companies/CompaniesCarouselSkeleton";
import SectionHeader from "@/components/client/home/sectionHeader/SectionHeader";
import BestJobs from "@/components/client/jobs/BestJobs";
import { Suspense } from "react";

export default function Home() {
  return (
    <main>
      <SectionHeader />
      <BestJobs />
      <Suspense fallback={<CompaniesCarouselSkeleton />}>
        <CompaniesCarousel />
      </Suspense>
    </main>
  );
}
