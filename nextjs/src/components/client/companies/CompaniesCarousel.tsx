import companyApiRequest from "@/apiRequests/company";
import CompanyCarouselContent from "./CompanyCarouselContent";

const CompaniesCarousel = async () => {
  try {
    const response = await companyApiRequest.callFetchCompany(
      "current=1&pageSize=20"
    );
    const companies = response?.data?.result;

    return (
      <div className="container pt-6 mb-10">
        <CompanyCarouselContent companies={companies ?? []} />
      </div>
    );
  } catch (error) {
    console.error("Error fetching companies:", error);
    return <div>Error loading companies</div>; // Thêm thông báo lỗi
  }
};

export default CompaniesCarousel;
