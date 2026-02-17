import "./globals.css";
import LayoutWrapper from "./layout-wrapper";
import { UserProvider } from "./utils/contexts/userContext";
import Script from "next/script";

export const metadata = {
  title: "Skailup",
  description: "L'application de gestion pour les incubateurs",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        <UserProvider>
          <LayoutWrapper>
            {children}
            <Script
              type="module"
              src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js"
            />
            <Script
              nomodule
              src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js"
            />
          </LayoutWrapper>
        </UserProvider>
      </body>
    </html>
  );
}
