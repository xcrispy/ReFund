import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "@rainbow-me/rainbowkit/styles.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import {
  injectedWallet,
  rainbowWallet,
  metaMaskWallet,
  coinbaseWallet,
  walletConnectWallet,
  trustWallet,
  ledgerWallet,
} from "@rainbow-me/rainbowkit/wallets";
import "@fortawesome/fontawesome-free/css/all.min.css";

import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { BrowserRouter as Router } from "react-router-dom";
import { MoralisProvider } from "react-moralis";
import { CartProvider } from "./context/CartContext";

const { chains, provider } = configureChains(
  [chain.polygonMumbai],
  [
    alchemyProvider({ apiKey: "2CjGw9Qa34v-UXMLq_aFG1AkD9monu47" }),
    publicProvider(),
  ]
);

/*const { connectors } = getDefaultWallets({
  appName: "ReFund",
  chains,
});
*/

const connectors = connectorsForWallets([
  {
    groupName: "Suggested",
    wallets: [
      injectedWallet({ chains }),
      rainbowWallet({ chains }),
      metaMaskWallet({ chains }),
      coinbaseWallet({ chains, appName: "ReFund" }),
      walletConnectWallet({ chains }),
      ledgerWallet({
        chains: chains,
        infuraId: process.env.REACT_APP_INFURA_ID,
      }),
      trustWallet({ chains }),
    ],
  },
]);

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider
        showRecentTransactions={true}
        coolMode={true}
        modalSize="compact"
        chains={chains}
      >
        <MoralisProvider
          serverUrl={process.env.REACT_APP_SERVER_URL}
          appId={process.env.REACT_APP_APPLICATION_ID}
        >
          <Router>
            <CartProvider>
              <App />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />

              <div className="footer">
                <p>
                  &copy; {new Date().getFullYear()} Copyright:{" "}
                  <a className="text-light" href="https://regfund.vercel.app/">
                    ReFund made by crispy
                  </a>
                </p>
              </div>
            </CartProvider>
          </Router>
        </MoralisProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
