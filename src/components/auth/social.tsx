import { FaGithub, FaGoogle } from "react-icons/fa6";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GithubAuthProvider, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/firebase";
import FillLoading from "../shared/fillLoading";

const Social = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const onGoogle = () => {
    setIsLoading(true);
    const googleProvider = new GoogleAuthProvider();
    signInWithPopup(auth, googleProvider)
      .then(() => {
        navigate("/");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  const onGithub = () => {
    setIsLoading(true);
    const githubProvider = new GithubAuthProvider();
    signInWithPopup(auth, githubProvider)
      .then(() => {
        navigate("/");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  return (
    <>
      {isLoading && <FillLoading />}
      <Separator className="-my-1" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <Button aria-label="icon github" className="h-11 " variant={"secondary"} disabled={isLoading} onClick={onGithub}>
          <FaGithub />
          <span>Sign in with Github</span>
        </Button>
        <Button aria-label="icon google" className="h-11" variant={"destructive"} disabled={isLoading} onClick={onGoogle}>
          <FaGoogle />
          <span>Sign in with Google</span>
        </Button>
      </div>
    </>
  );
};

export default Social;
