// components/no-ssr.tsx
import { useEffect, useState } from "react";

interface NoSSRProps {
  children: React.ReactNode; // Explicitly define children prop type
}

const NoSSR: React.FC<NoSSRProps> = ({ children }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return <>{children}</>;
};

export default NoSSR;
