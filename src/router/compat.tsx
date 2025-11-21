"use client";

import React, { useEffect } from "react";
import NextLink from "next/link";
import {
  useRouter,
  usePathname,
  useSearchParams,
  useParams as useNextParams,
} from "next/navigation";

/**
 * Minimal compatibility layer to run existing components that used react-router-dom
 * on Next.js App Router without changing their code substantially.
 * - useNavigate: returns a function navigate(to, { replace? })
 * - useParams: returns route params object
 * - useLocation: returns { pathname, search, hash }
 * - Link: supports both `to` (RRD) and `href` (Next) props
 * - Navigate: component that redirects on mount
 * - Outlet: passthrough wrapper
 */

export function useNavigate() {
  const router = useRouter();
  return (to: string | number, opts?: { replace?: boolean }) => {
    if (typeof to === "number") {
      if (to === -1) router.back();
      else router.back();
      return;
    }
    if (opts?.replace) router.replace(to);
    else router.push(to);
  };
}

export function useParams<T extends Record<string, string>>() {
  // Next's useParams returns a ReadonlyObject
  return useNextParams() as unknown as T;
}

export function useLocation() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  return {
    pathname,
    search: searchParams.toString() ? `?${searchParams.toString()}` : "",
    hash: "",
  };
}

type LinkProps = Omit<React.ComponentProps<typeof NextLink>, "href"> & {
  to?: string;
  href?: string;
};
export function Link(props: LinkProps) {
  const { to, href, ...rest } = props;
  const resolved = (to ?? href) || "";
  return <NextLink href={resolved} {...rest} />;
}

export function Navigate({ to, replace = false }: { to: string; replace?: boolean }) {
  const router = useRouter();
  useEffect(() => {
    if (replace) router.replace(to);
    else router.push(to);
  }, [to, replace, router]);
  return null;
}

export function Outlet({ children }: { children?: React.ReactNode }) {
  return <>{children}</>;
}
