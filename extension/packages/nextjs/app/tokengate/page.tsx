"use client";

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useScaffoldContract, useScaffoldReadContract } from "~~/hooks/scaffold-eth";

const TokenGatedPage: React.FC = () => {
  const { address } = useAccount();
  const [hasAccess, setHasAccess] = useState(false);
  const [tokenBalance, setTokenBalance] = useState<bigint>(BigInt(0));
  const { data: tokenGateContract } = useScaffoldContract({
    contractName: "TokenGateContract",
  });

  const { data: requiredBalance } = useScaffoldReadContract({
    contractName: "TokenGateContract",
    functionName: "requiredBalance",
  });

  useEffect(() => {
    const checkAccess = async () => {
      if (tokenGateContract && address) {
        const access: boolean = await tokenGateContract.read.hasAccess([address]);
        setHasAccess(access);

        const balance: bigint = await tokenGateContract.read.getTokenBalance([address]);
        setTokenBalance(balance);
      }
    };
    checkAccess();
  }, [tokenGateContract, address]);

  if (!address) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="alert alert-warning shadow-lg">
            <div>
              <span>Please connect your wallet to access this page.</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-full max-w-md">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body text-center">
              <h2 className="card-title text-error w-full flex justify-center">Access Denied</h2>
              <p>You do not have the required tokens to access this page.</p>
              <p>Your current balance: {tokenBalance.toString()}</p>
              <p>Required balance: {requiredBalance ? requiredBalance.toString() : "Loading..."}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center">
        <div className="card w-96 bg-base-100 shadow-xl">
          <div className="card-body">
            <h1 className="card-title text-success">Welcome to the Token Gated Page</h1>
            <p>This content is only visible to token holders.</p>
            <p>Your current balance: {tokenBalance.toString()}</p>
            {/* Add your gated content here */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenGatedPage;
