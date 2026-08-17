import { useEffect, useState } from "react";
// import { FiMenu } from "react-icons/fi";
import Sidebar from "../components/Sidebar";

type Props = {
  children: React.ReactNode;
  navigateTo: (path: string) => void;
};

const DashboardLayout = ({
  children,
  navigateTo,
}: Props) => {

  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleToggle = () => setMobileOpen((prev) => !prev);
    window.addEventListener("toggle-mobile-sidebar", handleToggle);
    return () => window.removeEventListener("toggle-mobile-sidebar", handleToggle);
  }, []);

  return (
    <div className="flex min-h-screen">

      <Sidebar
        navigateTo={navigateTo}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      <main
        className={`
          flex-1
          transition-all
          duration-300
          ${mobileOpen ? "pointer-events-none" : ""}
          md:pointer-events-auto
        `}
      >

        {/* Mobile Menu Button */}
        {/* <button
          onClick={() => setMobileOpen(true)}
          className="p-4 md:hidden"
        >
          <FiMenu size={24} />
        </button> */}


        <div
          className={`
            px-5
            pb-5
            pt-6
            md:pt-5
            transition-opacity
            duration-300
            ${mobileOpen ? "opacity-60" : "opacity-100"}
          `}
        >
          {children}
        </div>

      </main>

    </div>
  );
};

export default DashboardLayout;