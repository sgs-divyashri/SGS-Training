import { BenefitsType, SelectedPage } from "@/shared/types";
import Benefit from "./benefit";
import { useNavigate } from "react-router-dom";
import {
  HomeModernIcon,
  UserGroupIcon,
  AcademicCapIcon,
} from "@heroicons/react/24/solid";
import AbstractWaves from "@/assets/AbstractWaves.png"
import ActionButton from "@/shared/ActionButton";

const benefits: Array<BenefitsType> = [
  {
    icon: <HomeModernIcon className="h-6 w-6" />,
    title: "State of the Art Facilities",
    description: "Welcome to art facilities",
  },
  {
    icon: <UserGroupIcon className="h-6 w-6" />,
    title: "100's of Diverse Classes",
    description: "Welcome to art facilities",
  },
  {
    icon: <AcademicCapIcon className="h-6 w-6" />,
    title: "Expert and Pro Trainers",
    description: "Welcome to art facilities",
  },
];

type Props = {
  setSelectedPage: (value: SelectedPage) => void;
};

const Benefits = ({ setSelectedPage }: Props) => {
  const navigate = useNavigate();
  const onClick = async () => {
    setSelectedPage(SelectedPage.Benefits);
    navigate("/benefits");
  };
  return (
    <section
      id="benefits"
      className="mx-auto min-h-full w-5/6 py-20"
      onClick={onClick}
    >
      <div className="md:my-5 md:w-3/5">
        <h1 className="basis-3/5 font-montserrat text-3xl font-bold text-red-950">
          MORE THAN JUST A GYM
        </h1>
        <p className="my-5 text-sm">
          We provide world class fitness equipment, trainers and classes to get
          you to your ultimate fitness goals with ease. We provide true care
          into each and every member.
        </p>
      </div>

      {/* Benefits */}
      <div className="md:flex items-center justify-between gap-8 mt-5">
        {benefits.map((benefit: BenefitsType) => (
          <Benefit
            key={benefit.title}
            icon={benefit.icon}
            title={benefit.title}
            description={benefit.description}
            setSelectedPage={setSelectedPage}
          />
        ))}
      </div>

      {/* Graphics & Description */}
      <div className="mt-16 items-center justify-between gap-20 md:mt-28 md:flex">
        {/* Graphic */}
        <img src={AbstractWaves} alt="abstract waves" className="mx-auto h-120 w-80 my-2" />

        {/* Description */}
        <div>
          {/* Title */}
          <div className="relative">
            <div className="before:absolute before:-top-20 before:-left-20 before:content-abstractwaves">
              <h1 className="basis-3/5 font-montserrat text-3xl font-bold text-red-950">
                MILLIONS OF HAPPY MEMBERS GETTING {" "}
                <span className="text-red-400">FIT</span>.
              </h1>
            </div>
          </div>

          {/* Description */}
          <div>
            <p className="my-5">After months of looking for a gym that focuses more on overall health and less on short-term gains, I was recommended EvoGym. True to it’s name </p>
            <p className="mb-5">Thank you for helping me get the most out of the limited time I have at the gym! I would recommend everyone to join fitness 9 to chase your goals for perfect body. The trainers and staff here are well disciplined.</p>
          </div>

          {/* Button */}
          <div className="relative mt-16">
            <ActionButton setSelectedPage={setSelectedPage}>Join Now</ActionButton>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Benefits;
