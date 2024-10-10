import React from "react";
import ContentLeft from "./_components/ContentLeft";
import ContentRight from "../../components/client/manage-avatar/ContentRight";

const PersonalInfo = () => {
  return (
    <div className="bg-[#f0f0f0]">
      <div className="container pt-6">
        <div className="flex">
          <ContentLeft />
          <ContentRight />
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo;
