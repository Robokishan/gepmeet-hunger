import { useRouter } from "next/router";
import { useEffect } from "react";
import { useGetmeQuery } from "../generated/graphql";

export const useIsAuth = () => {
  const [{ data, fetching: loading }] = useGetmeQuery();
  const router = useRouter();
  useEffect(() => {
    if (!loading && !data?.me) {
      router.replace("/login?next=" + router.pathname);
    }
  }, [loading, data, router]);
};
