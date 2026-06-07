import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { useFeedback } from "@/context/FeedbackContext";
import { apiClient } from "@/services/apiClient";
import { env } from "@/config/env.config";

declare global {
  interface Window {
    google?: any;
    __mxcGoogleAuthInitialized?: boolean;
    __mxcGoogleAuthCallback?: (response: any) => void;
  }
}

interface GoogleLoginButtonProps {
  isSignUp?: boolean;
  action?: "signin" | "signup" | "link";
}

const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({
  isSignUp,
  action,
}) => {
  const navigate = useNavigate();
  const { setUserDetails } = useUser();
  const { showError, showSuccess } = useFeedback();
  const [scriptLoaded, setScriptLoaded] = useState<boolean>(false);
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return () => {
      // Force clear any lingering third-party implicit or federated credential tokens cached in memory on unmount
      if (window.google?.accounts?.id) {
        window.google.accounts.id.cancel();
      }
    };
  }, []);

  const handleGoogleCredentialResponse = async (response: any) => {
    const credential = response?.credential;

    if (!credential) {
      showError(
        "Google authentication returned no credential. Please try again.",
      );
      return;
    }

    // Validate the existence of the 3-segment JSON Web Token
    const segments = credential.split(".");
    if (segments.length !== 3) {
      showError("Invalid Google credential format. Please try again.");
      return;
    }

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
      const userWithToken = { ...user, token };
      setUserDetails(userWithToken);
      localStorage.setItem("userDetails", JSON.stringify(userWithToken));

      showSuccess(
        action === "link"
          ? "Successfully linked Google account!"
          : "Successfully signed in with Google!",
      );
      if (action !== "link") {
        navigate("/");
      }
    } catch (err: any) {
      const errMsg =
        err?.response?.data?.message ?? "Google flow failed. Please try again.";
      showError(errMsg);
    }
  };

  // Constantly bind the global callback proxy to the latest closure
  window.__mxcGoogleAuthCallback = handleGoogleCredentialResponse;

  // Monitor Google library script availability
  useEffect(() => {
    const checkScript = () => {
      if (window.google?.accounts?.id) {
        setScriptLoaded(true);
        if (window.__mxcGoogleAuthInitialized) {
          return;
        }
        window.google.accounts.id.initialize({
          client_id: env.VITE_GOOGLE_CLIENT_ID,
          callback: (res: any) => window.__mxcGoogleAuthCallback?.(res),
        });
        window.__mxcGoogleAuthInitialized = true;
      }
    };

    checkScript();

    // In case the script is loading asynchronously
    const interval = setInterval(() => {
      if (window.google?.accounts?.id) {
        checkScript();
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isSignUp, action]);

  // DOM container rendering lifecycle
  useEffect(() => {
    if (scriptLoaded && buttonRef.current && window.google?.accounts?.id) {
      // Force-clear the internal DOM container to wipe old React StrictMode duplicates
      buttonRef.current.innerHTML = "";

      window.google.accounts.id.renderButton(buttonRef.current, {
        type: "standard",
        theme: "outline",
        size: "large",
        shape: "rectangular",
        text: action === "link" ? "continue_with" : "continue_with",
      });
    }
  }, [scriptLoaded, buttonRef]);

  return (
    <div className="w-full flex justify-center py-2">
      <div id="googleButtonContainer" ref={buttonRef} className="w-full"></div>
    </div>
  );
};

export default GoogleLoginButton;
