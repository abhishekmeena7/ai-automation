import { Navigate, Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useState } from "react";
import { MenuIcon } from "lucide-react";
import { useAuth } from "../context/authContext";
import ThemeToggle from "./ThemeToggle";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/accounts": "Social Accounts",
  "/schedular": "Post Schedular ",
  "/ai-composer": "AI Composer",
};

const Layout = () => {

  const {isAuthenticated,isLoading} = useAuth()


    const location  = useLocation();

    const title = pageTitles[location.pathname] || "SocialAI"

  const [isMobileOpen, setisMobileOpen] = useState(false);


  if(isLoading){
    return(
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="size-8 border-4 border-red-500 border-t-transparent"/>
      </div>
    )
  }

  if(!isAuthenticated){
    return <Navigate to="/login" replace />
  }




  return (
    <div className="flex h-screen bg-slate-50">
      {/* mobie overlay   */}

      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden"
          onClick={() => setisMobileOpen(false)}
        />
      )}

      <Sidebar isOpen={isMobileOpen} setIsOpen={setisMobileOpen} />

      <div className="min-w-0 flex-1 flex flex-col overflow-hidden">
        {/* top bar */}
        <header className="min-h-16 bg-white border-b border-slate-200 flex items-center px-4 md:px-8 gap-4">
          <button
            className="md:hidden p-2 -ml-2 text-slate-500"
            onClick={() => setisMobileOpen(true)}
          >
            <MenuIcon className="size-6" />
          </button>
          <div>
            <h1 className="text-slate-900">{title}</h1>
            <p className="text-sm text-slate-400 hidden sm:block">
              manage and automate your social media presence
            </p>
          </div>
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4 sm:p-6 md:p-8 xl:p-12">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
