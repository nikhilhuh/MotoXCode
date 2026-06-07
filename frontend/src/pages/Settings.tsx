import React from "react";
import GoogleLoginButton from "@/components/auth/GoogleLoginButton";
import { useUser } from "@/context/UserContext";

const Settings: React.FC = () => {
  const { userDetails } = useUser();

  if (!userDetails) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-gray-500">Please sign in to access settings.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-8">Account Settings</h1>
      
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Linked Accounts</h2>
        <p className="text-gray-600 mb-6">
          Connect your Google account to enable quick sign-in without a password.
        </p>

        <div className="flex items-center space-x-4 border border-gray-200 p-4 rounded-md">
          <div className="flex-1">
            <h3 className="font-medium text-gray-900">Google</h3>
            <p className="text-sm text-gray-500">
              {userDetails.googleId ? "Account linked" : "Not connected"}
            </p>
          </div>
          <div>
            {!userDetails.googleId ? (
              <GoogleLoginButton action="link" />
            ) : (
              <span className="text-green-600 font-medium">Connected</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
