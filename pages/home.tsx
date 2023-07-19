import { onAuthStateChanged } from "firebase/auth";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { userState } from '../utilities/atoms';
import { auth } from "../utilities/firebase";

const Home: NextPage = () => {
  const router = useRouter();
  const [user, setUser] = useRecoilState(userState);

  const goToLogin = () => {
    router.push("/login")
  }

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        const uid = currentUser.uid;
        setUser(uid)
      } else {
        goToLogin();
      }
    });
  }, [setUser])

  return (
    <>
      {user && <p>we good</p>}
    </>
  )
}

export default Home;