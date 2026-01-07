import { SelectedPage } from "@/shared/types";
import useMediaQuery from "@/hooks/useMediaQuery";
import ActionButton from "@/shared/ActionButton";
import AnchorLink from "react-anchor-link-smooth-scroll";
import HomePageText from "@/assets/HomePageText.png";
import FitnessImage from "@/assets/Fitness-Image.png";

type Props = {
  setSelectedPage: (value: SelectedPage) => void;
};

const Home = ({ setSelectedPage }: Props) => {
  const isAboveMediumScreens = useMediaQuery("(min-width: 1060px)");
  return (
    <section id="home" className="gap-16 bg-gray-100 py-10 md:h-full md:pb-0">
      <div>
        {/* Main header */}
        <div>
          {/* Headings */}
          <div>
            <div>
              <div>
                <img src={HomePageText} alt="home-page-text" className="mix-blend-multiply" />
              </div>
            </div>
            <p>
              Unrivaled Gym. Unparalleled Training Fitness Classes. World Class
              Studios to get the Body Shapes That you Dream of.. Get Your Dream
              Body Now.
            </p>
          </div>
          {/* Actions */}
          <div>
            <ActionButton setSelectedPage={setSelectedPage}>Join Now</ActionButton>
            <AnchorLink className="text-sm font-bold text-red-300 underline hover:text-red-500" onClick={() => setSelectedPage(SelectedPage.ContactUs)} href={`#${SelectedPage.ContactUs}`}></AnchorLink>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
