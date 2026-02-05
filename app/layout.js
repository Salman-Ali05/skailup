import "./globals.css";
import LayoutWrapper from "./layout-wrapper";
import { UserProvider } from "./utils/contexts/userContext";

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
          </LayoutWrapper>
        </UserProvider>
      </body>
    </html>
  );
}
