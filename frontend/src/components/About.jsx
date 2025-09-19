import Title from "./Title";
import TestimonialImg from "../assets/testimonial.png";
import { TbLocation } from "react-icons/tb";
import {
  RiAdminLine,
  RiSecurePaymentLine,
  RiSoundModuleLine,
} from "react-icons/ri";
import { FaQuoteLeft, FaUsers } from "react-icons/fa";
import aboutBanner from "../assets/about.png";

const About = () => {
  const features = [
    {
      icon: RiSecurePaymentLine,
      title: "Fast & Secure",
      description: "Optimized Performance",
      iconClass: "text-blue-600",
    },
    {
      icon: RiSoundModuleLine,
      title: "Advance Filtering",
      description: "Find Items Quickly",
      iconClass: "text-purple-600",
    },
    {
      icon: FaUsers,
      title: "User Reviews",
      description: "Rating & feedback",
      iconClass: "text-green-600",
    },
    {
      icon: TbLocation,
      title: "Order Tracking",
      description: "Live Order Status",
      iconClass: "text-red-600",
    },
    {
      icon: RiAdminLine,
      title: "Admin Dashboard",
      description: "Manage Store easily",
      iconClass: "text-yellow-600",
    },
  ];

  return (
    <section className="max-padding-container">
      <div className="flex flex-col md:flex-row gap-8 md:gap-12 pt-16">
        {/* TESTIMONIAL */}
        <div className="flex-1 flex flex-col items-center text-center p-6 bg-gray-50 rounded-xl shadow-sm">
          <Title
            title1="People"
            title2="Says"
            para="What People Say About Us"
            title1Styles="text-2xl font-bold"
          />

          <div className="mt-8 flex flex-col items-center">
            <img
              src={TestimonialImg}
              alt="John Doe, CEO at TechStack"
              loading="lazy"
              width={100}
              height={100}
              className="rounded-full border-4 border-white shadow-md"
            />
            <h3 className="mt-4 text-xl font-semibold">John Doe</h3>
            <p className="text-gray-600">CEO at TechStack</p>

            <div className="mt-6 text-gray-500">
              <FaQuoteLeft size={24} className="mx-auto" />
              <p className="mt-4 max-w-md">
                "Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Beatae, molestias. Modi doloribus fugit quod cum impedit nihil
                praesentium ratione quibusdam?"
              </p>
            </div>
          </div>
        </div>

        {/* BANNER */}
        <div className="flex-[2] relative rounded-2xl overflow-hidden min-h-[300px]">
          <img
            src={aboutBanner}
            alt="Company showcase"
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <div className="bg-white/90 p-6 rounded-xl text-center backdrop-blur-sm">
              <h4 className="text-lg font-semibold mb-2">
                Top view in this week
              </h4>
              <h2 className="text-3xl font-bold text-primary">TRENDING</h2>
            </div>
          </div>
        </div>

        {/* FEATURES */}
        <div className="flex-1 p-6 bg-gray-50 rounded-xl shadow-sm">
          <Title title1="About" title2="Us" className="mb-8" />

          <div className="space-y-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-4">
                <div
                  className={`p-3 rounded-full ${feature.iconClass} bg-opacity-20`}
                >
                  <feature.icon size={25} className="shrink-0" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{feature.title}</h3>
                  <p className="text-gray-600 mt-1">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
