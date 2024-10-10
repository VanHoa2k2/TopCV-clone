import companyApiRequest from "@/apiRequests/company";
import CompanyCarouselContent from "./CompanyCarouselContent";

const CompaniesCarousel = async () => {
  const response = await companyApiRequest.callFetchCompany(
    "current=1&pageSize=20"
  );
  const companies = response?.data?.result;

  return (
    <div className="container pt-6 mb-10">
      <CompanyCarouselContent companies={companies ?? []} />
    </div>
  );
};

export default CompaniesCarousel;
