import React, { useState } from "react";
import SignInStep1 from "./SignInStep1";
import SignInStep2 from "./SignInStep2";

type Props = {
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
}
const OTPLogin: React.FC<Props> = ({ step, setStep }) => {
  const [email, setEmail] = useState<string>("");
  const [verifying, setVerifying] = useState<boolean>(false);

  return (
    <div className="flex-1 flex flex-col justify-center gap-4 lg:text-lg w-[90vw] md:w-[70vw] lg:w-[40vw] xl:w-[30vw]">
      {step === 1 && (
        <SignInStep1
          email={email}
          setEmail={setEmail}
          verifying={verifying}
          setVerifying={setVerifying}
          setStep={setStep}
        />
      )}
      {step === 2 && (
        <SignInStep2
          email={email}
          verifying={verifying}
          setVerifying={setVerifying}
          setStep={setStep}
        />
      )}
    </div>
  );
};

export default OTPLogin;