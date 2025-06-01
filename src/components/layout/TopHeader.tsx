
import React from 'react';
import { useLocation } from 'react-router-dom';
import UserProfileMenu from './UserProfileMenu';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { useAdminContext } from '@/hooks/useAdminContext';
import { ScrollArea } from '@/components/ui/scroll-area';

const TopHeader = () => {
  const location = useLocation();
  const { adminType } = useAdminContext();

  // Generate breadcrumbs from the current path
  const generateBreadcrumbs = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs = [];

    // Add root based on admin type
    if (pathSegments[0] === 'superadmin') {
      breadcrumbs.push({ label: 'Super Admin', href: '/superadmin/dashboard' });
      pathSegments.shift(); // Remove 'superadmin' from segments
    } else if (pathSegments[0] === 'tenant-admin') {
      breadcrumbs.push({ label: 'Tenant Admin', href: '/tenant-admin/dashboard' });
      pathSegments.shift(); // Remove 'tenant-admin' from segments
    }

    // Add remaining segments
    let currentPath = adminType === 'super_admin' ? '/superadmin' : '/tenant-admin';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const label = segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      breadcrumbs.push({
        label,
        href: currentPath,
        isLast: index === pathSegments.length - 1
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <header className="hidden md:flex items-center justify-between px-4 lg:px-6 py-3 lg:py-4 bg-white border-b border-gray-200">
      <div className="flex items-center min-w-0 flex-1">
        <ScrollArea className="w-full">
          <Breadcrumb>
            <BreadcrumbList className="flex-nowrap">
              {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={crumb.href}>
                  <BreadcrumbItem className="whitespace-nowrap">
                    {crumb.isLast ? (
                      <span className="font-medium text-gray-900 text-sm lg:text-base">{crumb.label}</span>
                    ) : (
                      <BreadcrumbLink 
                        href={crumb.href} 
                        className="text-gray-600 hover:text-gray-900 text-sm lg:text-base"
                      >
                        {crumb.label}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
                </React.Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </ScrollArea>
      </div>
      
      <div className="flex items-center ml-4">
        <UserProfileMenu />
      </div>
    </header>
  );
};

export default TopHeader;
