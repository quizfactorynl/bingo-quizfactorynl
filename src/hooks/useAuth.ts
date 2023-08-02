import { API_ROUTES } from "@/lib/constant";
import { useEffect, useState } from "react";

export function useJWTAuth() {
  const [loading, setLoading] = useState(false);
  const [isValid, setIsValid] = useState<boolean>(false);

  useEffect(() => {
    fetch(API_ROUTES.auth)
      .then((res) => {
        setLoading(false);
        setIsValid(res.ok);
      })
      .catch((err) => {
        setIsValid(false);
        setLoading(false);
      });
  }, []);

  return [isValid, loading];
}
