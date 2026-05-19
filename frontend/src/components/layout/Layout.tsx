import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Social } from "@/types/social";

// this static data will become dynamic and come from server
const socials: Social[] = [
  { label: "Instagram", link: "#" },
  { label: "YouTube", link: "#" },
];

export default function Layout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg)] text-text-primary">
      <Navbar socials={socials} />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer socials={socials} />
    </div>
  );
}
