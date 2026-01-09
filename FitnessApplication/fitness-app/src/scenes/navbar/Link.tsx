import { NavLink } from "react-router-dom";
import { SelectedPage } from "@/shared/types";

type Props = {
  page: string;
  selectedPage: SelectedPage;
  setSelectedPage: (value: SelectedPage) => void;
};

const routeFor = (page: Props["page"]): string => {
  switch (page) {
    case "Home":
      return "/";
    case "Benefits":
      return "/benefits";
    case "Our Classes":
      return "/class";
    case "Contact Us":
      return "/contact";
    default:
      return "/";
  }
};

const Link = ({ page, selectedPage, setSelectedPage }: Props) => {
  const to = routeFor(page);
  const pageKey = page.toLowerCase().replace(/ /g, "") as SelectedPage;
  // const lowerCasePage = page.toLowerCase().replace(/ /g, "") as SelectedPage;
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `${
          isActive || selectedPage === pageKey
            ? "underline underline-offset-4 decoration-pink-500 decoration-2"
            : "hover:underline underline-offset-4"
        } transition duration-300`
      }
      onClick={() => setSelectedPage(pageKey)}
    >
      {page}
    </NavLink>
  );
};

export default Link;