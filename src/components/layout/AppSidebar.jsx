import { useCallback } from "react";
import { Link, useLocation } from "react-router";
import { GridIcon, HorizontaLDots } from "../../icons";
import { useSidebar } from "../../context/SidebarContext";

const navItems = [
  {
    icon: <GridIcon />,
    name: "Dashboard",
    path: "/dashboard",
  },
  {
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
        <polyline points="10 9 9 9 8 9"></polyline>
      </svg>
    ),
    name: "Grievances",
    path: "/grievances",
  },
];

const AppSidebar = () => {
  const {
    isExpanded,
    isMobileOpen,
    isHovered,
    setIsHovered,
    toggleMobileSidebar,
  } = useSidebar();
  const location = useLocation();

  const isActive = useCallback(
    (path) => location.pathname === path,
    [location.pathname],
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 left-0 bg-[#F8FAFC] dark:bg-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-slate-200 dark:border-gray-800
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
              ? "w-[290px]"
              : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Logo */}
      <div
        className={`items-center h-[80px] border-b border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-900 ${
          isMobileOpen
            ? "hidden"
            : !isExpanded && !isHovered
              ? "flex justify-center"
              : "flex justify-between px-8"
        }`}
      >
        <Link to="/" className="flex items-center gap-3 group">
          {/* <div className="flex items-center justify-center transition-all duration-300 shadow-lg w-11 h-11 rounded-2xl bg-gradient-to-br from-brand-600 to-indigo-700 shadow-brand-500/30 group-hover:rotate-6">
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
            </svg>
          </div> */}
          <img src="logo.png" alt="" className="flex items-center justify-center transition-all duration-300 w-15 h-15 rounded-2xl shadow-brand-500/30 " />
          {(isExpanded || isHovered || isMobileOpen) && (
            <div className="flex flex-col">
              <h1 className="text-xl font-black text-slate-800 dark:text-white tracking-tight leading-none mb-0.5">
                Portal{" "}
                <span className="text-brand-600 dark:text-brand-400">
                  Officer
                </span>
              </h1>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                <p className="text-[10px] text-slate-400 dark:text-gray-500 font-bold uppercase tracking-[1px]">
                  Online Now
                </p>
              </div>
            </div>
          )}
        </Link>
      </div>

      {/* Nav */}
      <div className="flex flex-col flex-grow px-4 overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="py-8">
          <div className="flex flex-col gap-6">
            <div>
              <h2
                className={`mb-5 text-[11px] font-bold uppercase tracking-[1.5px] text-slate-400 dark:text-gray-600 flex leading-none ${!isExpanded && !isHovered && !isMobileOpen ? "lg:justify-center" : "px-4"}`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Main Menu"
                ) : (
                  <HorizontaLDots className="size-5" />
                )}
              </h2>

              <ul className="flex flex-col gap-2">
                {navItems.map((nav) => (
                  <li key={nav.name}>
                    <Link
                      to={nav.path}
                      onClick={() => isMobileOpen && toggleMobileSidebar()}
                      className={`flex items-center w-full gap-3 px-4 py-3.5 font-bold rounded-2xl transition-all duration-200 group text-sm ${
                        isActive(nav.path)
                          ? "bg-brand-600 dark:bg-brand-500 text-white shadow-lg shadow-brand-600/20 border border-brand-500"
                          : "text-slate-500 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800 hover:shadow-sm hover:text-slate-900 dark:hover:text-white"
                      } ${!isExpanded && !isHovered && !isMobileOpen ? "justify-center px-0" : ""}`}
                    >
                      <span
                        className={`transition-colors duration-200 ${isActive(nav.path) ? "text-white" : "text-slate-400 dark:text-gray-600 group-hover:text-slate-600 dark:group-hover:text-gray-300"}`}
                      >
                        {nav.icon}
                      </span>
                      {(isExpanded || isHovered || isMobileOpen) && (
                        <span>{nav.name}</span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </nav>
      </div>

      {/* Support Desk */}
      {(isExpanded || isHovered || isMobileOpen) && (
        <div className="p-5 mx-2 mb-8 rounded-[24px] bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 shadow-sm relative overflow-hidden group">
          <div className="absolute w-16 h-16 transition-transform duration-500 rounded-full opacity-50 -right-4 -top-4 bg-brand-50 dark:bg-gray-900 group-hover:scale-150"></div>
          <p className="text-[10px] text-brand-600 dark:text-brand-400 font-black uppercase tracking-wider mb-1 relative">
            Support Desk
          </p>
          <p className="text-[11px] text-slate-500 dark:text-gray-400 leading-tight font-bold relative">
            Need help resolving a grievance?
          </p>
          <button className="mt-4 w-full py-3 bg-slate-900 dark:bg-gray-950 hover:bg-slate-800 dark:hover:bg-black text-white text-[11px] font-black rounded-xl transition-all active:scale-95 shadow-lg shadow-slate-200 dark:shadow-none uppercase tracking-wider">
            Contact Admin
          </button>
        </div>
      )}
    </aside>
  );
};

export default AppSidebar;
