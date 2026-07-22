"use client";

import { SignIn } from "@clerk/nextjs";

export const ClientSignIn = () => {
    return <SignIn routing="hash" />;
};
