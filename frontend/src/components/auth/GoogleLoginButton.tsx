import React from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { useFeedback } from "@/context/FeedbackContext";
import { apiClient } from "@/services/apiClient";
import { useGoogleLogin } from "@react-oauth/google";
import { FcGoogle } from "react-icons/fc";
import axios from "axios";

interface GoogleLoginButtonProps {
  isSignUp?: boolean;
  action?: "signin" | "signup" | "link";
}

const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({
  isSignUp,
  action,
}) => {
  const navigate = useNavigate();
  const { userDetails, setUserDetails } = useUser();
  const { showError, showSuccess } = useFeedback();

  const handleGoogleCredentialResponse = async (credential: string) => {
    try {
      let endpoint = `/auth/google`;
      let payload: any = { id_token: credential, isSignUp: isSignUp };

      if (action === "link") {
        endpoint = `/auth/link-google`;
        payload = { id_token: credential };
      } else if (action === "signup") {
        payload = { id_token: credential, isSignUp: true };
      } else if (action === "signin") {
        payload = { id_token: credential, isSignUp: false };
      }

      const apiResponse = await apiClient.post(endpoint, payload);

      const { user, token } = apiResponse.data;
      const finalToken = token || userDetails?.token;
      const userWithToken = { ...user, token: finalToken };
      setUserDetails(userWithToken);
      localStorage.setItem("userDetails", JSON.stringify(userWithToken));

      showSuccess(
        action === "link"
          ? "Successfully linked Google account!"
          : `You are signed in as ${user.username}`,
      );
      if (action !== "link") {
        navigate("/");
      }
    } catch (err: any) {
        if (axios.isAxiosError(err) && err.response) {
          showError(err.response.data.message || "Backend operation failed.");
        } else if (err instanceof Error) {
          showError(err.message);
        } else {
          showError("An unexpected error occurred.");
        }
      }
  };

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      handleGoogleCredentialResponse(tokenResponse.access_token);
    },
    onError: () => {
      showError("Google authentication failed or was cancelled.");
    },
  });

  return (
    <div className="w-full flex justify-center py-2">
      <button
        onClick={() => login()}
        type="button"
        className="w-full flex items-center justify-center gap-3 py-3 px-6 rounded-xl bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 hover:border-white/20 transition-all hover:scale-[1.02] active:scale-95 shadow-sm hover:shadow-md cursor-pointer"
      >
        <FcGoogle className="w-6 h-6 shrink-0" />
        <span>Continue with Google</span>
      </button>
    </div>
  );
};

export default GoogleLoginButton;
