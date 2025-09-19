import { useState, useCallback, useRef } from "react";
import { FaCheck, FaPlus, FaMinus } from "react-icons/fa6";
import uploadIcon from "../assets/upload_icon.png";
import axios from "axios";
import { backend_url } from "../App";
import { toast } from "react-toastify";
import { useAdminContext } from "../context/adminContext";
import { Editor } from "@tinymce/tinymce-react";

const Add = () => {
  const editorRef = useRef(null);
  const { token } = useAdminContext();

  const [images, setImages] = useState({
    image1: null,
    image2: null,
    image3: null,
    image4: null,
  });
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [details, setDetails] = useState("");
  const [price, setPrice] = useState("10");
  const [category, setCategory] = useState("Headphones");
  const [popular, setPopular] = useState(false);
  const [featured, setFeatured] = useState(false);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [volumes, setVolumes] = useState([]);
  const [specifications, setSpecifications] = useState({});
  const [volumePricing, setVolumePricing] = useState({});
  const [newSize, setNewSize] = useState("");
  const [newVolume, setNewVolume] = useState("");
  const [specKey, setSpecKey] = useState("");
  const [specValue, setSpecValue] = useState("");
  const [newVolumeKey, setNewVolumeKey] = useState("");
  const [newVolumePrice, setNewVolumePrice] = useState("");

  const handleImageChange = (e, key) => {
    setImages((prev) => ({ ...prev, [key]: e.target.files[0] }));
  };

  const handleColorSelect = (color) => {
    setColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const addSize = () => {
    if (newSize.trim() && !sizes.includes(newSize.trim())) {
      setSizes([...sizes, newSize.trim()]);
      setNewSize("");
    }
  };

  const removeSize = (sizeToRemove) => {
    setSizes(sizes.filter((size) => size !== sizeToRemove));
  };

  const addVolume = () => {
    if (newVolume.trim() && !volumes.includes(newVolume.trim())) {
      setVolumes([...volumes, newVolume.trim()]);
      setNewVolume("");
    }
  };

  const removeVolume = (volumeToRemove) => {
    setVolumes(volumes.filter((volume) => volume !== volumeToRemove));
  };

  const addSpecification = () => {
    if (specKey.trim() && specValue.trim()) {
      setSpecifications({
        ...specifications,
        [specKey.trim()]: specValue.trim(),
      });
      setSpecKey("");
      setSpecValue("");
    }
  };

  const removeSpecification = (keyToRemove) => {
    const newSpecs = { ...specifications };
    delete newSpecs[keyToRemove];
    setSpecifications(newSpecs);
  };

  const addVolumePrice = () => {
    if (
      newVolumeKey.trim() &&
      newVolumePrice.trim() &&
      !volumePricing[newVolumeKey.trim()]
    ) {
      setVolumePricing({
        ...volumePricing,
        [newVolumeKey.trim()]: parseFloat(newVolumePrice.trim()),
      });
      setNewVolumeKey("");
      setNewVolumePrice("");
    }
  };

  const removeVolumePrice = (keyToRemove) => {
    const newVolumePricing = { ...volumePricing };
    delete newVolumePricing[keyToRemove];
    setVolumePricing(newVolumePricing);
  };

  const onSubmitHandler = useCallback(
    async (e) => {
      e.preventDefault();

      try {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description);
        formData.append("details", details);
        formData.append("price", price);
        formData.append("category", category);
        formData.append("popular", JSON.stringify(popular));
        formData.append("featured", JSON.stringify(featured));
        formData.append("colors", JSON.stringify(colors));

        // Add volume pricing for volume-based categories
        const volumeBasedCategories = ["liquids", "Perfumes", "cosmetics"];
        if (
          volumeBasedCategories.includes(category) &&
          Object.keys(volumePricing).length > 0
        ) {
          formData.append("volumePricing", JSON.stringify(volumePricing));
        }

        // Add new attributes if they have values
        if (sizes.length > 0) {
          formData.append("sizes", JSON.stringify(sizes));
        }
        if (volumes.length > 0) {
          formData.append("volumes", JSON.stringify(volumes));
        }
        if (Object.keys(specifications).length > 0) {
          formData.append("specifications", JSON.stringify(specifications));
        }

        Object.keys(images).forEach((key) => {
          if (images[key]) formData.append(key, images[key]);
        });

        const response = await axios.post(
          `${backend_url}/api/product/add`,
          formData,
          { headers: { token } }
        );

        if (response.data.success) {
          toast.success(response.data.message);
          // Reset form
          setName("");
          setDescription("");
          setDetails("");
          setPrice("10");
          setPopular(false);
          setFeatured(false);
          setImages({ image1: null, image2: null, image3: null, image4: null });
          setColors([]);
          setSizes([]);
          setVolumes([]);
          setSpecifications({});
          setVolumePricing({});
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            "Something went wrong while adding product"
        );
      }
    },
    [
      name,
      description,
      details,
      price,
      category,
      popular,
      featured,
      colors,
      sizes,
      volumes,
      specifications,
      volumePricing,
      images,
      token,
    ]
  );

  // Determine which attribute sections to show based on category
  const showSizes = ["Mens Wear", "Women Wear", "Watches"].includes(category);
  const showVolumes = ["Perfumes", "cosmetics", "liquids"].includes(category);
  const showSpecifications = [
    "Headphones",
    "Electronics",
    "Speakers",
    "Watches",
    "Headphones",
    "Watches",
  ].includes(category);

  return (
    <div className="px-2 sm:px-8 mt-2 min-h-screen pb-8">
      <h3 className="bold-28 mb-6">Add Product</h3>
      <form
        className="flex flex-col gap-y-4 medium-14 lg:w-[777px]"
        onSubmit={onSubmitHandler}
      >
        <div className="w-full">
          <h5 className="font-semibold mb-1">Product Name</h5>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Product Name"
            className="px-3 py-2 ring-1 ring-slate-300 rounded bg-white w-full max-w-lg outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <h5 className="font-semibold mb-1">Product Short Description</h5>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Product Description"
            rows={4}
            className="px-3 py-2 ring-1 ring-slate-300 rounded bg-white w-full max-w-lg resize-none outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <h5 className="font-semibold mb-1">Complete Details</h5>
          <Editor
            apiKey="rrirqsye2il7nsfs9pc9wpz3qp37nwkb5r8spc7ehsertp8k"
            onInit={(_evt, editor) => (editorRef.current = editor)}
            value={details}
            onEditorChange={(newValue) => setDetails(newValue)}
            initialValue="<p>Complete Product Details.</p>"
            init={{
              height: 500,
              menubar: true,
              plugins: [
                "a11ychecker",
                "advlist",
                "advcode",
                "advtable",
                "autolink",
                "checklist",
                "lists",
                "link",
                "image",
                "charmap",
                "preview",
                "anchor",
                "searchreplace",
                "visualblocks",
                "powerpaste",
                "fullscreen",
                "formatpainter",
                "insertdatetime",
                "media",
                "table",
                "help",
                "wordcount",
              ],
              toolbar:
                "undo redo | image | preview | casechange blocks | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist checklist outdent indent | removeformat | a11ycheck code table help",
            }}
          />
        </div>

        {/* CATEGORIES & PRICE */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <h5 className="font-semibold mb-1">Category</h5>
            <select
              className="w-full px-3 py-2 text-gray-700 ring-1 ring-slate-300 bg-white rounded focus:ring-2 focus:ring-blue-500"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="Headphones">Headphones</option>
              <option value="Mens Wear">Mens Clothing</option>
              <option value="Women Wear">Women Clothing</option>
              <option value="Perfumes">Perfumes</option>
              <option value="Cosmetics">Cosmetics</option>
              <option value="Speakers">Speakers</option>
              <option value="Ladies Bags">Ladies Bags</option>
              <option value="Watches">Watches</option>
              <option value="Electronics">Electronics</option>
              <option value="liquids">Liquids</option>
              <option value="accessories">Accessories</option>
            </select>
          </div>
          <div>
            <h5 className="font-semibold mb-1">
              {["liquids", "Perfumes", "cosmetics"].includes(category)
                ? "Base Price ($)"
                : "Product Price ($)"}
            </h5>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="10"
              min="1"
              step="0.01"
              className="px-3 py-2 ring-1 bg-white rounded w-32 ring-slate-300 outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            {["liquids", "Perfumes", "cosmetics"].includes(category) && (
              <div className="text-sm text-gray-500 mt-1">
                Default price if no volume is selected
              </div>
            )}
          </div>
        </div>

        {/* COLORS */}
        <div>
          <h5 className="font-semibold mb-2">Product Colors</h5>
          <div className="flex gap-2 flex-wrap">
            {[
              "black",
              "white",
              "red",
              "blue",
              "gold",
              "green",
              "purple",
              "pink",
              "gray",
              "brown",
            ].map((item, i) => (
              <button
                type="button"
                key={i}
                style={{ background: item }}
                onClick={() => handleColorSelect(item)}
                className={`h-8 w-8 rounded-full ring-2 ring-offset-2 flex items-center justify-center ${
                  colors.includes(item) ? "ring-slate-800" : "ring-slate-300"
                }`}
                title={item}
              >
                {colors.includes(item) && (
                  <FaCheck
                    style={{
                      color:
                        item === "white" || item === "gold" ? "black" : "white",
                    }}
                    size={14}
                  />
                )}
              </button>
            ))}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            Selected: {colors.join(", ") || "None"}
          </div>
        </div>

        {/* SIZES (Conditional) */}
        {showSizes && (
          <div>
            <h5 className="font-semibold mb-2">Product Sizes</h5>
            <div className="flex gap-2 items-center mb-2">
              <input
                type="text"
                value={newSize}
                onChange={(e) => setNewSize(e.target.value)}
                placeholder="Add size (e.g., S, M, L, XL)"
                className="px-3 py-1 ring-1 ring-slate-300 rounded bg-white outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={addSize}
                className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
              >
                <FaPlus />
              </button>
            </div>
            <div className="flex gap-2 flex-wrap">
              {sizes.map((size, index) => (
                <div
                  key={index}
                  className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-2"
                >
                  <span>{size}</span>
                  <button
                    type="button"
                    onClick={() => removeSize(size)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaMinus size={12} />
                  </button>
                </div>
              ))}
              {sizes.length === 0 && (
                <span className="text-gray-500 text-sm">
                  No sizes added yet
                </span>
              )}
            </div>
          </div>
        )}

        {/* VOLUMES (Conditional) */}
        {showVolumes && (
          <div>
            <h5 className="font-semibold mb-2">Product Volumes</h5>
            <div className="flex gap-2 items-center mb-2">
              <input
                type="text"
                value={newVolume}
                onChange={(e) => setNewVolume(e.target.value)}
                placeholder="Add volume (e.g., 50ml, 100ml)"
                className="px-3 py-1 ring-1 ring-slate-300 rounded bg-white outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={addVolume}
                className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
              >
                <FaPlus />
              </button>
            </div>
            <div className="flex gap-2 flex-wrap">
              {volumes.map((volume, index) => (
                <div
                  key={index}
                  className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-2"
                >
                  <span>{volume}</span>
                  <button
                    type="button"
                    onClick={() => removeVolume(volume)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaMinus size={12} />
                  </button>
                </div>
              ))}
              {volumes.length === 0 && (
                <span className="text-gray-500 text-sm">
                  No volumes added yet
                </span>
              )}
            </div>
          </div>
        )}

        {/* VOLUME PRICING (Conditional) */}
        {showVolumes && (
          <div>
            <h5 className="font-semibold mb-2">Volume-Based Pricing</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
              <input
                type="text"
                value={newVolumeKey}
                onChange={(e) => setNewVolumeKey(e.target.value)}
                placeholder="Volume (e.g., 50ml)"
                className="px-3 py-1 ring-1 ring-slate-300 rounded bg-white outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                value={newVolumePrice}
                onChange={(e) => setNewVolumePrice(e.target.value)}
                placeholder="Price ($)"
                min="0.01"
                step="0.01"
                className="px-3 py-1 ring-1 ring-slate-300 rounded bg-white outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="button"
              onClick={addVolumePrice}
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 mb-2"
            >
              Add Volume Price
            </button>
            <div className="mt-2">
              {Object.entries(volumePricing).map(([volume, price], index) => (
                <div
                  key={index}
                  className="bg-gray-100 px-3 py-1 rounded flex items-center justify-between mb-1"
                >
                  <span className="font-medium">{volume}:</span>
                  <span>${price}</span>
                  <button
                    type="button"
                    onClick={() => removeVolumePrice(volume)}
                    className="text-red-500 hover:text-red-700 ml-2"
                  >
                    <FaMinus size={12} />
                  </button>
                </div>
              ))}
              {Object.keys(volumePricing).length === 0 && (
                <span className="text-gray-500 text-sm">
                  No volume pricing added yet
                </span>
              )}
            </div>
          </div>
        )}

        {/* SPECIFICATIONS (Conditional) */}
        {showSpecifications && (
          <div>
            <h5 className="font-semibold mb-2">Product Specifications</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
              <input
                type="text"
                value={specKey}
                onChange={(e) => setSpecKey(e.target.value)}
                placeholder="Specification key (e.g., Material)"
                className="px-3 py-1 ring-1 ring-slate-300 rounded bg-white outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                value={specValue}
                onChange={(e) => setSpecValue(e.target.value)}
                placeholder="Specification value (e.g., Leather)"
                className="px-3 py-1 ring-1 ring-slate-300 rounded bg-white outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="button"
              onClick={addSpecification}
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 mb-2"
            >
              Add Specification
            </button>
            <div className="mt-2">
              {Object.entries(specifications).map(([key, value], index) => (
                <div
                  key={index}
                  className="bg-gray-100 px-3 py-1 rounded flex items-center justify-between mb-1"
                >
                  <span className="font-medium">{key}:</span>
                  <span>{value}</span>
                  <button
                    type="button"
                    onClick={() => removeSpecification(key)}
                    className="text-red-500 hover:text-red-700 ml-2"
                  >
                    <FaMinus size={12} />
                  </button>
                </div>
              ))}
              {Object.keys(specifications).length === 0 && (
                <span className="text-gray-500 text-sm">
                  No specifications added yet
                </span>
              )}
            </div>
          </div>
        )}

        {/* IMAGES */}
        <div>
          <h5 className="font-semibold mb-2">Product Images</h5>
          <div className="flex gap-4 flex-wrap">
            {["image1", "image2", "image3", "image4"].map((imgKey, i) => (
              <label key={i} htmlFor={imgKey} className="cursor-pointer">
                <div className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden">
                  <img
                    src={
                      images[imgKey]
                        ? URL.createObjectURL(images[imgKey])
                        : uploadIcon
                    }
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <input
                  type="file"
                  id={imgKey}
                  hidden
                  onChange={(e) => handleImageChange(e, imgKey)}
                  accept="image/*"
                />
                <div className="text-xs text-center mt-1 text-gray-500">
                  Image {i + 1}
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* POPULAR CHECKBOX */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            onChange={() => setPopular((prev) => !prev)}
            checked={popular}
            id="popular"
            className="w-4 h-4"
          />
          <label htmlFor="popular" className="cursor-pointer">
            Mark as Popular Product
          </label>
        </div>

        {/* FEATURED CHECKBOX */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            onChange={() => setFeatured((prev) => !prev)}
            checked={featured}
            id="featured"
            className="w-4 h-4"
          />
          <label htmlFor="featured" className="cursor-pointer">
            Mark as Featured Product
          </label>
        </div>

        <button type="submit" className="btn-dark mt-4 max-w-44 py-3">
          Add Product
        </button>
      </form>
    </div>
  );
};

export default Add;
