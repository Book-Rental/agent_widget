import { useState } from "react";
import { FiMenu } from "react-icons/fi";
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

  return (
    <div className="flex min-h-screen">

      <Sidebar
        navigateTo={navigateTo}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      <main className="flex-1">

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileOpen(true)}
          className="p-4 md:hidden"
        >
          <FiMenu size={24} />
        </button>


        <div className="p-5">
          {children}
        </div>

      </main>

    </div>
  );
};

export default DashboardLayout;