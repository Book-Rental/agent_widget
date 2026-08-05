import {
  FiChevronDown,
  FiChevronUp,
  FiPackage,
  FiTruck,
  FiX,
} from "react-icons/fi";
import { useState } from "react";

type SidebarProps = {
  navigateTo: (path: string) => void;
  mobileOpen: boolean;
  onClose: () => void;
};

type NavItem = {
  label: string;
  path: string;
  icon: React.ReactNode;
};

const ORDER_ITEMS: NavItem[] = [
  {
    label: "Pickup Orders",
    path: "/agent/pickup-orders",
    icon: <FiPackage size={16} />,
  },
  {
    label: "Delivered Orders",
    path: "/agent/delivery-orders",
    icon: <FiTruck size={16} />,
  },
];

const Sidebar = ({
  navigateTo,
  mobileOpen,
  onClose,
}: SidebarProps) => {
  const [ordersOpen, setOrdersOpen] = useState(true);
  const [activePath, setActivePath] = useState(window.location.pathname);

  const handleNavigation = (path: string) => {
    setActivePath(path);
    navigateTo(path);
    onClose();
  };

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed left-0 right-0 top-16 bottom-0 z-40 bg-black/40 backdrop-blur-[1px] md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed
          left-0
          top-16
          z-[60]
          h-[calc(100vh-4rem)]
          w-[240px]
          bg-white
          shadow-[2px_0_8px_rgba(0,0,0,0.08)]
          transition-transform
          duration-300
          md:static
          md:z-auto
          md:h-auto
          md:translate-x-0
          ${
            mobileOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        {/* Header */}
        <div className="mb-8 flex items-center justify-between px-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-600 text-sm font-bold text-white">
              A
            </div>

            <h2 className="text-base font-bold text-slate-900">
              Agent Dashboard
            </h2>
          </div>


          {/* Close mobile */}
          <button
            className="md:hidden"
            onClick={onClose}
          >
            <FiX size={20}/>
          </button>

        </div>


        {/* Navigation */}
        <div className="flex flex-col gap-1 px-5">

          <button
            onClick={() => setOrdersOpen(!ordersOpen)}
            className="
              flex items-center justify-between
              rounded-md p-2
              text-sm font-semibold
              text-slate-700
              hover:bg-slate-50
            "
          >
            Orders

            {
              ordersOpen
                ? <FiChevronUp size={18}/>
                : <FiChevronDown size={18}/>
            }

          </button>


          {
            ordersOpen && (
              <div className="flex flex-col gap-1 pl-2 pt-1">

                {
                  ORDER_ITEMS.map(
                    ({
                      label,
                      path,
                      icon
                    }) => {

                      const active =
                        activePath === path;


                      return (
                        <button
                          key={path}
                          onClick={() =>
                            handleNavigation(path)
                          }
                          className={`
                            flex items-center gap-2
                            rounded-md
                            border-l-2
                            p-2 pl-3
                            text-sm

                            ${
                              active
                              ?
                              "border-blue-600 bg-blue-50 text-blue-600 font-medium"
                              :
                              "border-transparent text-slate-600 hover:bg-slate-50"
                            }
                          `}
                        >
                          {icon}
                          {label}
                        </button>
                      );

                    }
                  )

                }

              </div>
            )
          }

        </div>

      </aside>
    </>
  );
};


export default Sidebar;