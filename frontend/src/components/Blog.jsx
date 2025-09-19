import { blogs } from "../assets/data";

const Blog = () => {
  return (
    <section className="max-padding-container">
      {/* CONTAINER */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pt-16 pb-10">
        {blogs.slice(0, 4).map((blog) => (
          <div key={blog.title} className="relative">
            <img src={blog.image} alt="Blog-Image" className="rounded-xl" />
            {/* Info */}
            <p className="medium-14 mt-6  text-red-900">{blog.category}</p>
            <h5 className="h4 pr-4 mb-1 line-clamp-1">{blog.title}</h5>
            <p className="line-clamp-2">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi
              nisi fugit quam praesentium dolorum.
            </p>
            <button className="underline mt-2 bold-14">Continue Reading</button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Blog;
