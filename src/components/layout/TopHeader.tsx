
import React from 'react';
import UserProfileMenu from './UserProfileMenu';
import { SessionTimeoutWarning } from './SessionTimeoutWarning';

const TopHeader = () => {
  return (
    <>
      <UserProfileMenu />
      <SessionTimeoutWarning />
    </>
  );
};

export default TopHeader;
