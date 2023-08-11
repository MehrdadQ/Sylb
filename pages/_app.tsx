import 'bootstrap/dist/css/bootstrap.min.css';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { RecoilRoot } from 'recoil';
import { createGlobalStyle } from 'styled-components';
import '../styles/globals.css';
import { auth } from '../utilities/firebase';
import LoadingIcon from "../public/loading.svg";
import Image from 'next/image';


const GlobalStyle = createGlobalStyle`
  body {
    background: #2D3748;
  }
`

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user && !['/', '/login', '/signup'].includes(router.pathname)) {
        router.push('/login');
      } else {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (isLoading) {
    return (
      <div style={{display: "flex", width: "100%", height: "100vh", justifyContent: "center"}}>
        <Image src={LoadingIcon} alt='loading' style={{width: "48px", height: 'auto'}}/>
      </div>
    )
  }

  return (
    <RecoilRoot>
      <GlobalStyle/>
      <Component {...pageProps} />
    </RecoilRoot>
  )
}

export default MyApp
