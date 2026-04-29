"use client";

import { ComponentType, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isLoggedIn } from "@/lib/auth-client";

export default function withAuthGuard<P extends object>(
  WrappedComponent: ComponentType<P>,
) {
  function GuardedComponent(props: P) {
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
      if (!isLoggedIn()) {
        router.replace("/auth/login");
        return;
      }
      setAuthorized(true);
    }, [router]);

    if (!authorized) {
      return null;
    }

    return <WrappedComponent {...props} />;
  }

  GuardedComponent.displayName = `withAuthGuard(${WrappedComponent.displayName || WrappedComponent.name || "Component"})`;

  return GuardedComponent;
}
