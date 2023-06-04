import { Disclosure } from "@headlessui/react";
import NavLogo from "./NavLogo";
import DesktopNavMenu from "./DesktopNavMenu";
import NavHamburgerButton from "./NavHamburgerButton";
import MobileNavMenu from "./MobileNavMenu";
import LogInButton from "./LogInButton";
import LogOutButton from "./LogOutButton";
import facade from "../../ApiFacade";
import UsernameButton from "./UsernameButton";
import RoleButton from "./RoleButton";
import SignUpButton from "./SignUpButton";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function Navbar({ username, role }) {
  const [navigation, setNavigation] = useState([]);
  const location = useLocation();

  useEffect(() => {
    if (facade.loggedIn()) {
      if (role === "admin") {
        setNavigation([
          { name: "Dashboard", href: "/", current: location.pathname === "/" },
          { name: "Exercises", href: "/exercises", current: location.pathname === "/exercises" },
          { name: "Workouts", href: "/workouts", current: location.pathname === "/workouts" },
        ]);
      } else if (role === "user") {
        setNavigation([
          { name: "Dashboard", href: "/", current: location.pathname === "/" },
          { name: "Workouts", href: "/workouts", current: location.pathname === "/workouts" },
          { name: "Activity", href: "/activity", current: location.pathname === "/activity" },
        ]);
      }
    } else {
      setNavigation([
        { name: "Home", href: "/", current: location.pathname === "/" },
        { name: "About", href: "/about", current: location.pathname === "/about" },
      ]);
    }
  }, [location.pathname, role]);

  return (
    <Disclosure as="nav" className="bg-gray-800">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center">
                <NavLogo />
                <DesktopNavMenu navigation={navigation} />
              </div>
              {facade.loggedIn() ? (
                <div className="flex gap-6">
                  <RoleButton role={role} />
                  <UsernameButton username={username} />
                  <LogOutButton />
                </div>
              ) : (
                <div className="flex gap-6">
                  <SignUpButton />
                  <LogInButton />
                </div>
              )}
            </div>
            <NavHamburgerButton open={open} />
          </div>

          <MobileNavMenu open={open} navigation={navigation} />
        </>
      )}
    </Disclosure>
  );
}
