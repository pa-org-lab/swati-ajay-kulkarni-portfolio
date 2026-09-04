import Footer from "@/frontend/components/public/common/Footer";
import Navbar from "@/frontend/components/public/common/Navbar";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
