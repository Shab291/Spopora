import banner4 from "../assets/banner-4.png";
import Marquee from "../components/Marquee";

const Banner2 = () => {
  return (
    /* Main Container */
    <div className="pt-6 pb-6">
      <div className="relative">
        <img src={banner4} alt="styleBanner" className="w-full h-[580px]" />
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
          <Marquee
            text="Style. Class. Quality. Delivered Daily."
            textColor="white"
            backgroundColor="rgba(0, 0, 0, 0.3)"
            fontSize="2.5rem"
            className="uppercase"
          />
        </div>
      </div>
    </div>
  );
};

export default Banner2;
