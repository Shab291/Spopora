import { useShopContext } from "../context/ShopContext";
import Title from "./Title";
import Items from "../components/Items";
import { useEffect, useState } from "react";

const RelatedProducts = ({ category }) => {
  const { products } = useShopContext();
  const [relatedProduct, setRelatedProduct] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      let filtered = products.slice();

      filtered = filtered.filter((item) => category === item.category);

      setRelatedProduct(filtered.slice(0, 5));
    }
  }, [products]);
  return (
    <section className="max-padding-container pt-10">
      <div className="heading">
        <Title title1={"Related"} title2={"Products"} />
      </div>
      <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-8">
        {relatedProduct.map((product, index) => (
          <div key={index} className="grid-item">
            <Items product={product} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default RelatedProducts;
