import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
} from "@heroui/react";

import { Link, useNavigate } from "react-router";
import { useContext } from "react";
import { tokenContext } from "../Context/TokenContext.jsx";

export default function NavbarComponent() {
  let { userToken, userData, setToken } = useContext(tokenContext);
  const navigate = useNavigate();

  function handleAction(key) {
    if (key === "settings") {
      navigate("/profile");
    } else if (key === "change-password") {
      navigate("/change-password");
    } else if (key === "logout") {
      localStorage.removeItem("token");
      setToken(null);
      navigate("/auth/login");
    }
  }

  return (
    <Navbar>
      <NavbarBrand>
        <p className="font-bold text-purple-700 text-2xl">LinkedPost</p>
      </NavbarBrand>

      <NavbarContent as="div" justify="end">
        <NavbarItem>
          <Link to="/" className="text-purple-700 font-bold">
            Home
          </Link>
        </NavbarItem>
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Avatar
              isBordered
              as="button"
              className="transition-transform"
              color="secondary"
              name={userData?.name || "User"}
              size="sm"
              src={userData?.photo}
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat" onAction={handleAction}>
            <DropdownItem key="profile" className="h-14 gap-2" isReadOnly>
              <p className="font-semibold">{userData?.name}</p>
              <p className="font-semibold text-sm text-gray-500">{userData?.email}</p>
            </DropdownItem>
            <DropdownItem key="settings">
              Profile
            </DropdownItem>
            <DropdownItem key="change-password">
              Change Password
            </DropdownItem>
            <DropdownItem key="logout" color="danger">
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>
    </Navbar>
  );
}
