import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Social } from "@/types/social";
import { cmsService } from "@/services";

export default function Layout() {
  const { pathname } = useLocation();
  const [socials, setSocials] = useState<Social[]>([]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  useEffect(() => {
    async function hydrateSocials() {
      const data = await cmsService.fetchSocials();
      setSocials(data);
    }
    hydrateSocials();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg)] text-text-primary relative" style={{ position: "relative" }}>
      <Navbar socials={socials} />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer socials={socials} />
    </div>
  );
}
