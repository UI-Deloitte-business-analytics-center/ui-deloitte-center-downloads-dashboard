import "../styles/globals.scss";
import type { AppProps } from "next/app";
import { withPasswordProtect } from "next-password-protect";

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

// Before: export default App;
export default process.env.PASSWORD_PROTECT
  ? withPasswordProtect(MyApp)
  : MyApp;
