import { SelectedPage } from "@/shared/types";
import { JSX } from "react";
import { Link } from "react-router-dom";

type Props = {
  icon: JSX.Element;
  title: string;
  description: string;
  setSelectedPage: (value: SelectedPage) => void;
};

const Benefit = ({ icon, title, description, setSelectedPage }: Props) => {
  return (
    <div className="mt-5 rounded-md border-2 border-white-100 px-5 py-16 text-center">
      <div className="mb-4 flex justify-center">
        <div className="rounded-full border-2 border-white-500 px-4">{icon}</div>
      </div>
      <h4 className="font-bold">{title}</h4>
      <p className="my-3">{description}</p>
      <Link
        to="/contact"
        className="text-sm font-bold text-red-300 underline hover:text-red-500"
        onClick={() => setSelectedPage(SelectedPage.ContactUs)}
      >
        <p className="mt-3">Learn More</p>
      </Link>
    </div>
  );
};

export default Benefit;
