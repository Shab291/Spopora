import { useShopContext } from "../context/ShopContext";
import Title from "./Title";
import Items from "./Items";
import { useEffect, useState } from "react";

const PopularProducts = () => {
  const [popularProduct, setPopularProduct] = useState([]);
  const { products } = useShopContext();

  useEffect(() => {
    const data = products.filter((item) => item.popular);
    setPopularProduct(data);
  }, [products]);

  return (
    <section className="max-padding-container pt-2">
      {/* TITLE-CONTAINER */}
      <Title title1={"Popular"} title2={"Collection"} />

      {/* PRODUCT-CONTAINER */}

      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {popularProduct.map((product) => (
          <div key={product._id}>
            <Items product={product} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default PopularProducts;
