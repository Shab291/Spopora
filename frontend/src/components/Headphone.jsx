import { useState, useEffect } from "react";
import { useShopContext } from "../context/ShopContext";
import Title from "./Title";
import Items from "./Items";

const Headphone = () => {
  const [headphoneProduct, setHeadphoneProduct] = useState([]);
  const { products } = useShopContext();

  useEffect(() => {
    const data = products.filter((item) => item.category === "Headphones");
    setHeadphoneProduct(data);
  }, [products]);

  return (
    <div className="max-padding-container pt-6">
      <Title title1={"Headphones"} title2={"Items"} />

      <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {headphoneProduct.slice(0, 8).map((product, index) => (
          <div key={index} className="grid-item">
            <Items product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Headphone;
