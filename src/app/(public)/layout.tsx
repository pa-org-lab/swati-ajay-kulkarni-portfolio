import { Toaster } from "react-hot-toast";
import Footer from "@/frontend/components/public/common/Footer";
import Navbar from "@/frontend/components/public/common/Navbar";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4500,
          style: {
            background: "#2b1f18",
            color: "#ffffff",
            fontSize: "13.5px",
            borderRadius: "14px",
            boxShadow: "0 10px 30px rgba(43,31,24,0.22)",
            padding: "12px 18px",
          },
          success: {
            iconTheme: {
              primary: "#c2654d",
              secondary: "#ffffff",
            },
          },
        }}
      />
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
