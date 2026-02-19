import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useState } from "react";
import { useNotification } from "../context/NotificationContext";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import { AddToQueue } from "@mui/icons-material";
import LogoutIcon from "@mui/icons-material/Logout";
import { getRole } from "../auth/auth";
import { useOptionalAdminNotification } from "../context/adminNotificationContext";

const navClasses = ({ isActive }: { isActive: boolean }) =>
  isActive
    ? "text-pink-600 underline underline-offset-4 decoration-pink-500 decoration-2"
    : "text-gray-700 hover:underline underline-offset-4";

export const NavBar = () => {
  const { count } = useCart();
  const { cnt } = useNotification();
  const notif = useOptionalAdminNotification();
  const adminCnt = notif?.adminCount;
  const navigate = useNavigate();
  const role = getRole();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/", { replace: true });
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-white shadow border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="mr-4 text-gray-700 hover:text-black"
          >
            <MenuRoundedIcon />
          </button>

          <div className="font-bold text-gray-900">Amazon</div>

          <div className="ml-auto flex items-center gap-6">
            {role === "Admin" ? (
              ""
            ) : (
              <button
                className="relative w-6 h-6 text-gray-700 hover:text-gray-900"
                onClick={() => navigate("/cart")}
                title="Cart"
              >
                {/* Cart Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 576 512"
                  fill="currentColor"
                >
                  <path d="M96 0C107.5 0 117.4 8.19 119.6 19.51L121.1 32H541.8C562.1 32 578.3 52.25 572.6 72.66L518.6 264.7C514.7 278.5 502.1 288 487.8 288H170.7L179.9 336H488C501.3 336 512 346.7 512 360C512 373.3 501.3 384 488 384H159.1C148.5 384 138.6 375.8 136.4 364.5L76.14 48H24C10.75 48 0 37.25 0 24C0 10.75 10.75 0 24 0H96zM128 464C128 437.5 149.5 416 176 416C202.5 416 224 437.5 224 464C224 490.5 202.5 512 176 512C149.5 512 128 490.5 128 464zM512 464C512 490.5 490.5 512 464 512C437.5 512 416 490.5 416 464C416 437.5 437.5 416 464 416C490.5 416 512 437.5 512 464z" />
                </svg>

                {/* Badge */}
                {count > 0 && (
                  <span
                    className="absolute bottom-3 left-4 min-w-[18px] h-[18px] px-1 rounded-full bg-pink-600 text-white text-[11px] text-center"
                    title={`${count} items in cart`}
                  >
                    {count > 99 ? "99+" : count}
                  </span>
                )}
              </button>
            )}

            {role === "Admin" ? (
              <button
                className="relative w-5 h-5 text-gray-700 hover:text-gray-900"
                onClick={() => navigate("/admin-notification")}
                title="Notifications"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                  fill="currentColor"
                >
                  <path d="M224 0c-17.7 0-32 14.3-32 32l0 3.2C119 50 64 114.6 64 192l0 21.7c0 48.1-16.4 94.8-46.4 132.4L7.8 358.3C2.7 364.6 0 372.4 0 380.5 0 400.1 15.9 416 35.5 416l376.9 0c19.6 0 35.5-15.9 35.5-35.5 0-8.1-2.7-15.9-7.8-22.2l-9.8-12.2C400.4 308.5 384 261.8 384 213.7l0-21.7c0-77.4-55-142-128-156.8l0-3.2c0-17.7-14.3-32-32-32zM162 464c7.1 27.6 32.2 48 62 48s54.9-20.4 62-48l-124 0z" />
                </svg>

                {adminCnt! > 0 && (
                  <span
                    className="absolute -bottom-1 -right-3 min-w-[18px] h-[18px] px-1 rounded-full bg-yellow-500 text-white text-[11px] text-center"
                    title={`${adminCnt} Notifications`}
                  >
                    {adminCnt! > 99 ? "99+" : adminCnt}
                  </span>
                )}
              </button>
            ) : (
              <button
                className="relative w-5 h-5 text-gray-700 hover:text-gray-900"
                onClick={() => navigate("/notification")}
                title="Notifications"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                  fill="currentColor"
                >
                  <path d="M224 0c-17.7 0-32 14.3-32 32l0 3.2C119 50 64 114.6 64 192l0 21.7c0 48.1-16.4 94.8-46.4 132.4L7.8 358.3C2.7 364.6 0 372.4 0 380.5 0 400.1 15.9 416 35.5 416l376.9 0c19.6 0 35.5-15.9 35.5-35.5 0-8.1-2.7-15.9-7.8-22.2l-9.8-12.2C400.4 308.5 384 261.8 384 213.7l0-21.7c0-77.4-55-142-128-156.8l0-3.2c0-17.7-14.3-32-32-32zM162 464c7.1 27.6 32.2 48 62 48s54.9-20.4 62-48l-124 0z" />
                </svg>

                {cnt > 0 && (
                  <span
                    className="absolute -bottom-1 -right-3 min-w-[18px] h-[18px] px-1 rounded-full bg-yellow-500 text-white text-[11px] text-center"
                    title={`${cnt} Notifications`}
                  >
                    {cnt > 99 ? "99+" : cnt}
                  </span>
                )}
              </button>
            )}

            <button
              onClick={handleLogout}
              className="flex items-center gap-1 hover:text-red-600"
            >
              <LogoutIcon fontSize="small" />
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="pt-14 flex">
        <div
          className={
            "fixed top-14 left-0 h-[calc(100vh-3.5rem)] border-r border-gray-200 bg-white z-30 overflow-hidden"
          }
          style={{
            width: sidebarOpen ? "12rem" : 0,
            transition: "width 200ms ease",
          }}
        >
          <Sidebar width="100%" className="h-full">
            <Menu>
              <MenuItem
                icon={<HomeOutlinedIcon />}
                component={<NavLink to="/home" className={navClasses} />}
              >
                Home
              </MenuItem>
              {role === "Admin" ? (
                <Menu>
                  <MenuItem
                    icon={<AddToQueue />}
                    component={
                      <NavLink to="/add-products" className={navClasses} />
                    }
                  >
                    Add Products
                  </MenuItem>
                  <MenuItem
                    icon={<CategoryOutlinedIcon />}
                    component={
                      <NavLink to="/categories" className={navClasses} />
                    }
                  >
                    Add Categories
                  </MenuItem>
                </Menu>
              ) : (
                <MenuItem
                  icon={<HistoryOutlinedIcon />}
                  component={<NavLink to="/orders" className={navClasses} />}
                >
                  Order History
                </MenuItem>
              )}
            </Menu>
          </Sidebar>
        </div>
      </div>

      <div className="px-14">
        <main
          className="max-w-6xl mx-auto px-4 py-2"
          style={{
            marginLeft: sidebarOpen ? "12rem" : 0,
            transition: "margin-left 200ms ease",
          }}
        >
          <Outlet />
        </main>
      </div>
    </>
  );
};
