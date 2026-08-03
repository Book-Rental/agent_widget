import { useState } from "react";

export const useAgentLocation = (
  coordinates?: number[]
) => {

  const [distance,setDistance] =
    useState<number|null>(null);

  const [eta,setEta] =
    useState<number|null>(null);

  const [loading,setLoading] =
    useState(true);

    // existing useEffect

  return {
    distance,
    eta,
    loading
  };

};