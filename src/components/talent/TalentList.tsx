
import React from "react";
// Import the new modular Talent Database
import TalentDatabase from '@/modules/talent-database';

const TalentList: React.FC = () => {
  return <TalentDatabase view="search" showFilters={true} allowAdd={true} />;
};

export default TalentList;
