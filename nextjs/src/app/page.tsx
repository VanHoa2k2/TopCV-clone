import CompaniesCarousel from "@/components/client/companies/CompaniesCarousel";
import SectionHeader from "@/components/client/home/sectionHeader/SectionHeader";
import BestJobs from "@/components/client/jobs/BestJobs";

export default function Home() {
  return (
    <main>
      <SectionHeader />
      <BestJobs />
      <CompaniesCarousel />
    </main>
  );
}
