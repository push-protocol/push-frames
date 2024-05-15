"use client";

import {PrivyProvider} from "@privy-io/react-auth";

export default function PrivyAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PrivyProvider
      appId="clw1qy2880ibzbcs9vf5r40ug"
      config={{
        // Customize Privy's appearance in your app
        appearance: {
          theme: "light",
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}
