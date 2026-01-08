import { SelectedPage } from "@/shared/types";
import { useForm } from "react-hook-form";
import ContactPageGrapgicImage from "@/assets/ContactPageGraphicImage.jpg";
import { motion } from "framer-motion";
import EvolveText from "@/assets/EvolveText.png";

type ContactFormValues = {
  name: string;
  email: string;
  message: string;
};

type Props = {
  setSelectedPage: (value: SelectedPage) => void;
};

const Contact = ({ setSelectedPage }: Props) => {
  const inputStyles = `mb-5 w-full rounded-lg bg-red-300 px-3 py-3 placeholder-white`;
  const {
    register,
    trigger,
    formState: { errors },
  } = useForm<ContactFormValues>({
    mode: "onSubmit",
  });
  const onHandleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    const isValid = await trigger();
    if (!isValid) {
      e.preventDefault();
    }
  };

  return (
    <section id="contact-us" className="mx-auto w-5/6 pt-24 pb-32">
      <div>
        <motion.div
          className="md:-w-3/5"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
          variants={{
            hidden: { opacity: 0, x: -50 },
            visible: { opacity: 1, x: 0 },
          }}
        >
          <h1 className="basis-3/5 font-montserrat text-3xl font-bold text-red-950">
            <span className="text-red-400">JOIN NOW </span>
            TO GET IN SHAPE
          </h1>
          <p className="mt-2">Word Hard. Stay Fit. Stay Healthy.</p>
        </motion.div>

        {/* Form & Image */}
        <div className="mt-10 just-between gap-8 md:flex">
          <motion.div
            className="mt-10 basis-3/5 md:mt-0"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5 }}
            variants={{
              hidden: { opacity: 0, y: 50 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <form
              target="_blank"
              onSubmit={onHandleSubmit}
              action="https://formsubmit.co/divya0301shri@gmail.com"
              method="POST"
            >
              <input
                className={inputStyles}
                type="text"
                placeholder="Enter Name"
                {...register("name", {
                  required: true,
                  maxLength: 100,
                })}
              />
              {errors.name && (
                <p className="mb-1 text-red-400">
                  {errors.name.type === "required" && "This field is required."}
                  {errors.name.type === "maxLength" &&
                    "Max Length is 100 characters."}
                </p>
              )}
              <input
                className={inputStyles}
                type="text"
                placeholder="Enter Email"
                {...register("email", {
                  required: true,
                  pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                })}
              />
              {errors.email && (
                <p className="mb-1 text-red-400">
                  {errors.email.type === "required" &&
                    "This field is required."}
                  {errors.email.type === "pattern" && "Invalid Email address."}
                </p>
              )}
              <textarea
                className={inputStyles}
                rows={4}
                cols={50}
                placeholder="Enter Message"
                {...register("message", {
                  maxLength: 200,
                })}
              />
              {errors.message && (
                <p className="mb-1 text-red-400">
                  {errors.message.type === "maxLength" &&
                    "Max Length is 200 characters."}
                </p>
              )}
              <button
                type="submit"
                className="mt-7 rounded-lg bg-red-400 px-10 py-3 transition duration-500 hover:text-white"
              >
                Submit
              </button>
            </form>
          </motion.div>

          <motion.div
            className="relative mt-16 basis-2/5 md:mt-0"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5 }}
            variants={{
              hidden: { opacity: 0, y: 50 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <div className="relative">
              <img
                src={ContactPageGrapgicImage}
                alt="Graphics"
                className="w-full rounded-lg object-cover"
              />

              <div className="absolute inset-0 z-20 flex items-center justify-center">
                <img
                  src={EvolveText}
                  alt="Evolve"
                  className="w-[90%] my-5 opacity-60 transition-opacity duration-500 hover:opacity-90 -translate-y-2"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
