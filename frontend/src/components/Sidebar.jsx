import { Link, useLocation } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { BellIcon, HomeIcon, ShipWheelIcon, UsersIcon } from "lucide-react";

const Sidebar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const currentPath = location.pathname;

  const navLinks = [
    { to: "/", label: "Home", icon: <HomeIcon className="size-5 text-base-content opacity-70" /> },
    { to: "/friends", label: "Friends", icon: <UsersIcon className="size-5 text-base-content opacity-70" /> },
    { to: "/notifications", label: "Notifications", icon: <BellIcon className="size-5 text-base-content opacity-70" /> },
  ];

  return (
    <aside className="w-64 bg-base-200 border-r border-base-300 hidden lg:flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="p-5 border-b border-base-300">
        <Link to="/" className="flex items-center gap-2.5">
          <ShipWheelIcon className="size-9 text-primary" />
          <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
            TalkToGod
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
              currentPath === link.to ? "btn-active" : ""
            }`}
          >
            {link.icon}
            <span>{link.label}</span>
          </Link>
        ))}
      </nav>

      {/* User Profile */}
      <Link to="/profile">
        <div className="p-4 border-t border-base-300 mt-auto hover:bg-base-300 transition-colors rounded-lg">
          <div className="flex items-center gap-3">
            <div className="avatar">
              <div className="w-10 rounded-full overflow-hidden">
                <img src={authUser?.profilePic || "https://via.placeholder.com/40"} alt="User Avatar" />
              </div>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm truncate">{authUser?.fullName}</p>
              <p className="text-xs text-success flex items-center gap-1">
                <span className="size-2 rounded-full bg-success inline-block" />
                Online
              </p>
            </div>
          </div>
        </div>
      </Link>
    </aside>
  );
};

export default Sidebar;
