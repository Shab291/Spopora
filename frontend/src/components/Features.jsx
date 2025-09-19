import { GiLindenLeaf } from "react-icons/gi";
import { FaRegHeart } from "react-icons/fa";
import { SlLock } from "react-icons/sl";

const Features = () => {
  return (
    <div className="mt-10  border-t-[1px] border-b-[1px] border-slate-200">
      {/* Container */}

      <div className="max-padding-container !pl-16 flexBetween gap-4 rounded-2xl p-8">
        <div className="flex flex-col items-center gap-3">
          <GiLindenLeaf size={35} />
          <div>
            <h3 className="medium-24 uppercase text-center">
              Choose Your Style
            </h3>
            <p className="text-center text-wrap">
              Explore our premium collection of luxury watches and accessories.
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-3">
          <FaRegHeart size={35} />
          <div>
            <h3 className="medium-24 uppercase text-center">Fast Shipping</h3>
            <p className="text-center text-wrap">
              We dispatch quickly so you get it faster! Place your order easily
              — no delays, no hassle.
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-3">
          <SlLock size={35} />
          <div>
            <h3 className="medium-24 uppercase text-center">
              Pay Securely Online
            </h3>
            <p className="text-center text-wrap">
              Enjoy smooth checkout with end-to-end payment protection.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
