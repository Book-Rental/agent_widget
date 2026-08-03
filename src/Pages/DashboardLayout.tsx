import Sidebar from "../components/Sidebar";

type Props = {
  children: React.ReactNode;
  navigateTo: (path:string)=>void;
};


const DashboardLayout = ({
  children,
  navigateTo
}: Props) => {

  return (
    <div className="flex min-h-screen">
      <Sidebar
        navigateTo={navigateTo}
      />
      <main className="flex-1 p-5">
        {children}
      </main>

    </div>
  );
};


export default DashboardLayout;