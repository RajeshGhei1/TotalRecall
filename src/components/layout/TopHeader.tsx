
import React from 'react';
import UserProfileMenu from './UserProfileMenu';
import { SessionTimeoutWarning } from './SessionTimeoutWarning';

const TopHeader = () => {
  return (
    <>
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-end">
          <UserProfileMenu />
        </div>
      </header>
      <SessionTimeoutWarning />
    </>
  );
};

export default TopHeader;
