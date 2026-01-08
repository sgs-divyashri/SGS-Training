import { SelectedPage } from "@/shared/types"
import { useForm } from "react-hook-form"
import ContactPageGrapgicImage from "@/assets/ContactPageGraphicImage.jpg"
import { motion } from "framer-motion"


type ContactFormValues = {
  name: string;
  email: string;
  message: string;
};


type Props = {
    setSelectedPage: (value: SelectedPage) => void
}

const ContactUs = ({setSelectedPage}: Props) => {
    const {register, trigger, formState: {errors}} = useForm<ContactFormValues>({
         mode: "onSubmit",
    })
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        const isValid = await trigger();
        if(!isValid) {
            e.preventDefault();
        }
    }
}

const Contact = ({setSelectedPage}: Props) => {
  return (
    <section id="contact-us" className="mx-auto w-5/6 pt-24 pb-32">
        <div>
            <motion.div className="md:-w-3/5" initial="hidden" whileInView="visible" viewport={{once: true, amount: 0.5}} transition={{duration: 0.5}} variants={{hidden: {opacity: 0, x:-50}, visible: {opacity:1, x:0}}}>
                <h1 className="basis-3/5 font-montserrat text-3xl font-bold text-red-950">
                    <span className="text-red-400">JOIN NOW</span>
                    TO GET IN SHAPE
                </h1>
                <p className="my-5">
                    Word Hard. Stay Fit. Stay Healthy.
                </p>
            </motion.div>

            {/* Form & Image */}
            <div className="mt-10 just-between gap-8 md:flex">
                <motion.div className="mt-10 basis-3/5 md:mt-0" initial="hidden" whileInView="visible" viewport={{once: true, amount: 0.5}} transition={{duration: 0.5}} variants={{hidden: {opacity: 0, y:50}, visible: {opacity:1, y:0}}}>
                    <form target="_blank" onSubmit={onSubmit} action="https://formsubmit.co/divya0301shri@gmail.com" method="POST">
                        
                    </form>
                </motion.div>
            </div>
        </div>
    </section>
  )
}

export default Contact