type SidebarProps = {
  navigateTo: (path: string) => void;
};

const Sidebar = ({ navigateTo }: SidebarProps) => {
  return (
    <div className="w-[220px] h-screen border-r bg-white p-5">
      <h2 className="font-bold text-lg mb-6">
        Agent Dashboard
      </h2>

      <div className="flex flex-col gap-3">

        {/* <button
          onClick={() => navigateTo("/dashboard")}
          className="text-left"
        >
          Dashboard
        </button> */}

        <button
          onClick={() => navigateTo("/agent/pickup-orders")}
          className="text-left"
        >
          Orders
        </button>
        
          <button
          onClick={() => navigateTo("/agent/pickup-orders")}
          className="text-left"
        >
          PickUp Orders
        </button>
        <button
          onClick={() => navigateTo("/agent/delivery-orders")}
          className="text-left"
        >
          Delivered Orders
        </button>

        {/* <button
          onClick={() => navigateTo("/delivery-details")}
          className="text-left"
        >
          Delivery Details
        </button> */}

      </div>
    </div>
  );
};

export default Sidebar;