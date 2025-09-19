import { useState, useEffect } from "react";
import { useShopContext } from "../context/ShopContext";
import Title from "./Title";
import Items from "./Items";

const Watches = () => {
  const [watchesProduct, setWatchesProduct] = useState([]);
  const { products } = useShopContext();

  useEffect(() => {
    const data = products.filter((item) => item.category === "Watches");
    setWatchesProduct(data);
  }, [products]);

  return (
    <div className="max-padding-container pt-6">
      <Title title1={"Watch"} title2={"Items"} />

      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {watchesProduct.slice(0, 8).map((product, index) => (
          <div key={index} className="grid-item">
            <Items product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Watches;
