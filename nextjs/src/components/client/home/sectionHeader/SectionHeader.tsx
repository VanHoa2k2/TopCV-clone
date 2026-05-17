import ContentLeft from "./ContentLeft";
import ContentRight from "./ContentRight";
import ContentRightSkeleton from "./ContentRightSkeleton";
import { Suspense } from "react";

const SectionHeader = () => {
  return (
    <div className="bg-section-header bg-full bg-no-repeat py-8">
      <div className="container">
        <div className="flex gap-[27px] lg:h-[365px]">
          <ContentLeft />
          <Suspense fallback={<ContentRightSkeleton />}>
            <ContentRight />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default SectionHeader;
