import { Outlet } from "react-router-dom";
import NavbarApp from "../shared/NavbarApp";

export default function Layout() {
  return (
    <>
      <NavbarApp />
      <Outlet />
    </>
  );
}