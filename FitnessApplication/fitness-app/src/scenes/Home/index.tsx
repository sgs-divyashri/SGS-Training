import { SelectedPage } from "@/shared/types";
import { motion } from "framer-motion";
import useMediaQuery from "@/hooks/useMediaQuery";
import ActionButton from "@/shared/ActionButton";
import HomePageText from "@/assets/HomePageText.png";
import FitnessImage from "@/assets/Fitness-Image.png";
import EvolveText from "@/assets/EvolveText.png"
import { Link } from "react-router-dom";

type Props = {
  setSelectedPage: (value: SelectedPage) => void;
};

const Home = ({ setSelectedPage }: Props) => {
  const isAboveMediumScreens = useMediaQuery("(min-width: 1060px)");
  return (
    <section id="home" className="bg-red-100 gap-16 py-10 md:h-full md:pb-0">
      <div className="md:flex mx-auto w-5/6 max-w-7xl items-center justify-center md:h-5/6 gap-10 ">
        {/* Main header */}
        <div className="z-10 mt-32 md:basis-3/5">
          {/* Headings */}
          <motion.div className="md:-mt-20" initial="hidden" whileInView="visible" viewport={{once: true, amount: 0.5}} transition={{duration: 0.5}} variants={{hidden: {opacity: 0, x:-50}, visible: {opacity:1, x:0}}}>
            <div className="relative">
              <div>
                <img src={EvolveText} alt="Evolve" className="absolute top-0 left-10 h-[120px] w-auto opacity-30 -z-10 pointer-events-none select-none" />
                <img src={HomePageText} alt="home-page-text" className="z-10 relative"/>
              </div>
            </div>
            <p className="relative z-10 mt-10">
              Unrivaled Gym. Unparalleled Training Fitness Classes. World Class
              Studios to get the Body Shapes That you Dream of.. Get Your Dream
              Body Now.
            </p>
          </motion.div>
          {/* Actions */}
          <motion.div className="mt-5 flex items-center gap-8" initial="hidden" whileInView="visible" viewport={{once: true, amount: 0.5}} transition={{delay: 0.2, duration: 0.5}} variants={{hidden: {opacity: 0, x:-50}, visible: {opacity:1, x:0}}}>
            <ActionButton setSelectedPage={setSelectedPage}>
              Join Now
            </ActionButton>
            <Link
              to='/contact'
              className="text-sm font-bold text-red-300 underline hover:text-red-500"
              onClick={() => setSelectedPage(SelectedPage.ContactUs)}
              // href={`#${SelectedPage.ContactUs}`}
            >
              <p className="mt-3">Learn More</p>
            </Link>
          </motion.div>
        </div>

        {/* Image */}
        <div className="relative md:basis-2/5 flex justify-center">
          <img
            src={FitnessImage} 
            alt="Fitness Image"
            className="h-[360px] w-auto object-contain drop-shadow-md mt-32"
          />
        </div>
      </div>
    </section>
  );
};

export default Home;
