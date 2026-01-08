import Image1 from "@/assets/Image1.webp"
import Image2 from "@/assets/Image2.jpg"
import Image3 from "@/assets/Image3.jpg"
import Image4 from "@/assets/Image4.jpg"
import Image5 from "@/assets/Image5.jpg"
import Image6 from "@/assets/Image6.webp"
import { ClassType, SelectedPage } from "@/shared/types"
import Class from "./Class"

const classes: Array<ClassType> = [
    {
        name: "Yoga Classes",
        description: "",
        image: Image1
    },
    {
        name: "Ab Core Classes",
        description: "",
        image: Image2
    },
    {
        name: "Fitness Training Classes",
        description: "",
        image: Image3
    },
    {
        name: "Weight Training Classes",
        description: "",
        image: Image4
    },
    {
        name: "Adventure Classes",
        description: "",
        image: Image5
    },
    {
        name: "Zumba Classes",
        description: "",
        image: Image6
    }
]

type Props = {
    setSelectedPage: (value: SelectedPage) => void;
}

const OurClasses = ({setSelectedPage}: Props) => {
  return (
    <section id="our-classes" className="w-full bg-red-100 py-40">
        <div>
            <h1 className="mx-5 basis-3/5 font-montserrat text-3xl font-bold text-red-950">OUR CLASSES</h1>
            <p className="mx-5 py-5">Body maintenance changes from individual to individual. Therefore, we personalize exercises for our clientele and check on their training pattern. So, a set of exercises are given each and every day in the total week resulting in an inevitable fat loss.</p>
        </div>
        <div className="mt-10 h-[353px] w-full overflow-x-auto overflow-y-hidden">
            <ul className="w-[2800px] whitespace-nowrap">
                {classes.map((item: ClassType, index) => (
                    <Class key={`${item.name}-${index}`} name={item.name} description={item.description ?? ""} image={item.image} />
                ))}
            </ul>
        </div>
    </section>
  )
}

export default OurClasses