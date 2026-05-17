import companyApiRequest from "@/apiRequests/company";
import CompanyCarouselContent from "./CompanyCarouselContent";

const CompaniesCarousel = async () => {
  try {
    const response = await companyApiRequest.callFetchCompany(
      "current=1&pageSize=20",
      { cache: "no-store" }
    );
    console.log("[Server] Companies API response:", response);
    const companies = response?.data?.result;
    console.log("[Server] companies result:", companies);
    return (
      <div className="container pt-6 mb-10">
        <CompanyCarouselContent companies={companies ?? []} />
      </div>
    );
  } catch (error) {
    console.error("[Server] Error fetching companies:", error);
    return <div>Error loading companies</div>;
  }
};

export default CompaniesCarousel;
