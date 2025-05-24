
import React from "react";
import NavItem from "./NavItem";
import { 
  Home, 
  Settings, 
  Users, 
  Building,
  Briefcase,
  UserRound
} from "lucide-react";

const TenantAdminNav = () => {
  return (
    <nav className="p-4 space-y-2">
      <NavItem
        href="/tenant-admin/dashboard"
        icon={Home}
        label="Dashboard"
      />
      <NavItem
        href="/tenant-admin/users"
        icon={Users}
        label="Users"
      />
      <NavItem
        href="/tenant-admin/talent"
        icon={UserRound}
        label="Talent"
      />
      <NavItem
        href="/tenant-admin/contacts"
        icon={UserRound}
        label="Contacts"
      />
      <NavItem
        href="/tenant-admin/companies"
        icon={Building}
        label="Companies"
      />
      <NavItem
        href="/tenant-admin/jobs"
        icon={Briefcase}
        label="Jobs"
      />
      <NavItem
        href="/tenant-admin/settings"
        icon={Settings}
        label="Settings"
      />
    </nav>
  );
};

export default TenantAdminNav;
