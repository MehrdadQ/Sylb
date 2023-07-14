import 'bootstrap/dist/css/bootstrap.min.css';
import type { AppProps } from 'next/app';
import 'react-toastify/dist/ReactToastify.css';
import { RecoilRoot } from 'recoil';
import { createGlobalStyle } from 'styled-components';
import '../styles/globals.css';

const GlobalStyle = createGlobalStyle`
  body {
    background: #2D3748;
  }
`

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <GlobalStyle/>
      <Component {...pageProps} />
    </RecoilRoot>
  )
}

export default MyApp
