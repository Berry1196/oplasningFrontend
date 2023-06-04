import { Link } from "react-router-dom";
import facade from "../../ApiFacade";

export default function LogOutButton() {
  const logout = () => {
    facade.logout();
  };

  return (
    <a href="/" className="rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500" onClick={logout}>
      Log out
    </a>
  );
}
