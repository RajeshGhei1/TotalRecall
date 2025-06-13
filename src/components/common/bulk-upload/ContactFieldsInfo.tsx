
import React from 'react';

const ContactFieldsInfo: React.FC = () => {
  return (
    <div className="bg-blue-50 p-4 rounded-lg">
      <h4 className="font-medium text-blue-900 mb-2">Business Contact Fields:</h4>
      <div className="grid grid-cols-2 gap-4 text-sm text-blue-800">
        <div>
          <strong>Required Fields:</strong>
          <ul className="mt-1 space-y-1">
            <li>• full_name</li>
            <li>• email (company email)</li>
          </ul>
          
          <strong className="block mt-3">Contact Information:</strong>
          <ul className="mt-1 space-y-1">
            <li>• phone</li>
            <li>• location</li>
            <li>• personal_email</li>
          </ul>
          
          <strong className="block mt-3">Business Information:</strong>
          <ul className="mt-1 space-y-1">
            <li>• role</li>
            <li>• company_name</li>
            <li>• reports_to_name</li>
            <li>• direct_reports</li>
            <li>• current_title</li>
            <li>• current_company</li>
          </ul>
        </div>
        <div>
          <strong>Social Media:</strong>
          <ul className="mt-1 space-y-1">
            <li>• linkedin_url</li>
            <li>• twitter_url</li>
            <li>• facebook_url</li>
            <li>• instagram_url</li>
          </ul>
          
          <strong className="block mt-3">Professional Details:</strong>
          <ul className="mt-1 space-y-1">
            <li>• experience_years</li>
            <li>• skills (comma-separated)</li>
            <li>• notes</li>
            <li>• availability_date</li>
            <li>• desired_salary</li>
            <li>• resume_url</li>
            <li>• portfolio_url</li>
          </ul>
          
          <p className="text-xs text-blue-600 mt-3">
            <strong>Note:</strong> Company relationships and reporting structures will be processed based on company_name, reports_to_name, and direct_reports fields.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactFieldsInfo;
