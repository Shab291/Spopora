import banner3 from "../assets/banner-3.png";

const Banner = () => {
  return (
    <section className="">
      <div className="flex flex-col sm:flex-row flex-wrap gap-y-10 pt-2">
        <div className="flex-2">
          <img src={banner3} />
        </div>
        <div className="flex-1 bg-[#e8d5c7] pl-10 place-content-center">
          <div>
            <h1 className="text-black bold-28">Bold Sound. Bold Style.</h1>
            <p className="text-black">
              Step into the future of music with wireless headphones featuring
              immersive stereo sound, customizable LED lighting, and a sleek,
              comfortable design — perfect for gamers, creators, and music
              lovers alike.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
