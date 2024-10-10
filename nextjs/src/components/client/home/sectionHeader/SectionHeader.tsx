import ContentLeft from "./ContentLeft";
import ContentRight from "./ContentRight";

const SectionHeader = () => {
  return (
    <div className="bg-section-header bg-full bg-no-repeat py-8">
      <div className="container">
        <div className="flex gap-[27px] h-[365px]">
          <ContentLeft />
          <ContentRight />
        </div>
      </div>
    </div>
  );
};

export default SectionHeader;
