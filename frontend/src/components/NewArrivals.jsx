import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import Title from "./Title";
import Items from "./Items";
import { useShopContext } from "../context/ShopContext";
// Import Swiper styles
import "swiper/css";

const NewArrivals = () => {
  const [newProducts, setNewProducts] = useState([]);
  const { products } = useShopContext();

  useEffect(() => {
    const data = products.slice(0, 8);
    setNewProducts(data);
  }, [products]);

  return (
    <section>
      <div className=" max-padding-container pt-2">
        <div className="heading">
          <Title title1={"New"} title2={"Arrivals"} />
        </div>
        <Swiper
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          breakpoints={{
            300: {
              slidesPerView: 1,
              spaceBetween: 20,
            },
            666: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            900: {
              slidesPerView: 3,
              spaceBetween: 20,
            },
            1300: {
              slidesPerView: 3,
              spaceBetween: 20,
            },
          }}
          modules={[Autoplay]}
          className="swiper"
        >
          {newProducts.map((product) => (
            <SwiperSlide key={product.id} className="swiper-slide">
              <Items product={product} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default NewArrivals;
