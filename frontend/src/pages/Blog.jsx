import { blogs } from "../assets/data";
import Footer from "../components/Footer";

const Blog = () => {
  return (
    <section className="mt-16">
      <div className="max-padding-container ">
        <div className="">
          {/* Container */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 gap-y-14 pb-16">
            {blogs.slice(0, 8).map((blog) => (
              <div key={blog.title} className="relative">
                <img src={blog.image} alt="Blog-Image" className="rounded-xl" />
                {/* Info */}
                <p className="medium-14 mt-6  text-red-900">{blog.category}</p>
                <h4 className="h4 pr-4 mb-1 line-clamp-1">{blog.title}</h4>
                <p className="line-clamp-2">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Excepturi nisi fugit quam praesentium dolorum.
                </p>
                <button className="underline mt-2 bold-14">
                  Continue Reading
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </section>
  );
};

export default Blog;
