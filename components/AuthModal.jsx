import React, { useEffect } from "react";
import { useRouter } from "next/router";

const AuthModal = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (router.pathname === "/auth") {
      setIsOpen(true);
    }
  }, [router]);

  return <Modal open={isOpen}>fsdfsf</Modal>;
};

export default AuthModal;
