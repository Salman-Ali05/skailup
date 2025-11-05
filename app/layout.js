import "./globals.css";
import LayoutWrapper from "./layout-wrapper";

export const metadata = {
  title: "Skailup",
  description: "L'application de gestion pour les incubateurs",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
