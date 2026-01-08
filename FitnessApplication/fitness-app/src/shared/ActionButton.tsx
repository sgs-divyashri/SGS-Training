import { Link } from "react-router-dom";
import { SelectedPage } from "./types";

type Props = {
    children: React.ReactNode;
    setSelectedPage: (value: SelectedPage) => void;
}

const ActionButton = ({children, setSelectedPage}: Props) => {
  return (
    <Link to="/contact" className="rounded-md bg-red-400 px-2 py-1 hover:bg-red-500 hover:text-white" onClick={() => setSelectedPage(SelectedPage.ContactUs)}>
        {children}
    </Link>
  )
}

export default ActionButton