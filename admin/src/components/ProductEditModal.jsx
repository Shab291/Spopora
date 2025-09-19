// components/ProductEditModal.jsx
import { useState, useEffect, useRef } from "react";
import { FaCheck, FaPlus, FaMinus, FaTimes } from "react-icons/fa";
import uploadIcon from "../assets/upload_icon.png";
import axios from "axios";
import { backend_url } from "../App";
import { toast } from "react-toastify";
import { Editor } from "@tinymce/tinymce-react";

const ProductEditModal = ({ productId, token, onClose, onProductUpdated }) => {
  const editorRef = useRef(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    details: "",
    price: "",
    category: "",
    popular: false,
    featured: false,
    colors: [],
    sizes: [],
    volumes: [],
    specifications: {},
  });
  const [images, setImages] = useState({});
  const [newColor, setNewColor] = useState("");
  const [newSize, setNewSize] = useState("");
  const [newVolume, setNewVolume] = useState("");
  const [specKey, setSpecKey] = useState("");
  const [specValue, setSpecValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState(null);

  // Fetch product data when modal opens
  useEffect(() => {
    if (productId) {
      fetchProductData();
    }
  }, [productId]);

  const fetchProductData = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`${backend_url}/api/product/single`, {
        productId: productId,
      });

      if (response.data.success) {
        const productData = response.data.product;
        setProduct(productData);
        setFormData({
          name: productData.name || "",
          description: productData.description || "",
          details: productData.details || "",
          price: productData.price || "",
          category: productData.category || "",
          popular: productData.popular || false,
          featured: productData.featured || false,
          colors: productData.colors || [],
          sizes: productData.sizes || [],
          volumes: productData.volumes || [],
          specifications: productData.specifications || {},
        });
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to load product data");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e, key) => {
    setImages((prev) => ({ ...prev, [key]: e.target.files[0] }));
  };

  const addColor = () => {
    if (newColor.trim() && !formData.colors.includes(newColor.trim())) {
      setFormData((prev) => ({
        ...prev,
        colors: [...prev.colors, newColor.trim()],
      }));
      setNewColor("");
    }
  };

  const removeColor = (colorToRemove) => {
    setFormData((prev) => ({
      ...prev,
      colors: prev.colors.filter((color) => color !== colorToRemove),
    }));
  };

  const addSize = () => {
    if (newSize.trim() && !formData.sizes.includes(newSize.trim())) {
      setFormData((prev) => ({
        ...prev,
        sizes: [...prev.sizes, newSize.trim()],
      }));
      setNewSize("");
    }
  };

  const removeSize = (sizeToRemove) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.filter((size) => size !== sizeToRemove),
    }));
  };

  const addVolume = () => {
    if (newVolume.trim() && !formData.volumes.includes(newVolume.trim())) {
      setFormData((prev) => ({
        ...prev,
        volumes: [...prev.volumes, newVolume.trim()],
      }));
      setNewVolume("");
    }
  };

  const removeVolume = (volumeToRemove) => {
    setFormData((prev) => ({
      ...prev,
      volumes: prev.volumes.filter((volume) => volume !== volumeToRemove),
    }));
  };

  const addSpecification = () => {
    if (specKey.trim() && specValue.trim()) {
      setFormData((prev) => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          [specKey.trim()]: specValue.trim(),
        },
      }));
      setSpecKey("");
      setSpecValue("");
    }
  };

  const removeSpecification = (keyToRemove) => {
    const newSpecs = { ...formData.specifications };
    delete newSpecs[keyToRemove];
    setFormData((prev) => ({ ...prev, specifications: newSpecs }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = new FormData();

      // Add simple fields directly (no JSON.stringify)
      submitData.append("name", formData.name);
      submitData.append("description", formData.description);
      submitData.append("details", formData.details);
      submitData.append("price", formData.price);
      submitData.append("category", formData.category);
      submitData.append("popular", formData.popular.toString());
      submitData.append("featured", formData.featured.toString());

      // Only stringify array and object fields
      submitData.append("colors", JSON.stringify(formData.colors));
      submitData.append("sizes", JSON.stringify(formData.sizes));
      submitData.append("volumes", JSON.stringify(formData.volumes));
      submitData.append(
        "specifications",
        JSON.stringify(formData.specifications)
      );

      submitData.append("productId", productId);

      Object.keys(images).forEach((key) => {
        if (images[key]) submitData.append(key, images[key]);
      });

      const response = await axios.put(
        `${backend_url}/api/product/update`,
        submitData,
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success("Product updated successfully");
        if (onProductUpdated) {
          onProductUpdated(response.data.product);
        }
        onClose();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  if (!productId) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold">Edit Product</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes size={24} />
          </button>
        </div>

        {loading && !product ? (
          <div className="p-8 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Basic Information */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block font-semibold mb-2">Product Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold mb-2">Price</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">
                Complete Details
              </label>
              <Editor
                apiKey="rrirqsye2il7nsfs9pc9wpz3qp37nwkb5r8spc7ehsertp8k"
                onInit={(_evt, editor) => (editorRef.current = editor)}
                value={formData.details}
                onEditorChange={(newValue) =>
                  handleInputChange("details", newValue)
                }
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

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block font-semibold mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    handleInputChange("category", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="Headphones">Headphones</option>
                  <option value="Mens Wear">Mens Wear</option>
                  <option value="Women Wear">Women Wear</option>
                  <option value="Perfumes">Perfumes</option>
                  <option value="cosmetics">Cosmetics</option>
                  <option value="Speakers">Speakers</option>
                  <option value="Ladies Bags">Ladies Bags</option>
                  <option value="Watches">Watches</option>
                  <option value="Electronics">Electronics</option>
                  <option value="liquids">Liquids</option>
                  <option value="accessories">Accessories</option>
                </select>
              </div>
              {/* Popular Product CheckBox */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.popular}
                  onChange={(e) =>
                    handleInputChange("popular", e.target.checked)
                  }
                  id="popular"
                  className="mr-2"
                />
                <label htmlFor="popular" className="font-semibold">
                  Mark as Popular
                </label>
              </div>
              {/* Featured Product CheckBox */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) =>
                    handleInputChange("featured", e.target.checked)
                  }
                  id="featured"
                  className="mr-2"
                />
                <label htmlFor="popular" className="font-semibold">
                  Mark as Featured
                </label>
              </div>
            </div>

            {/* Attributes Sections */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Colors */}
              <div>
                <label className="block font-semibold mb-2">Colors</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newColor}
                    onChange={(e) => setNewColor(e.target.value)}
                    placeholder="Add color"
                    className="flex-1 px-3 py-1 border border-gray-300 rounded-md"
                  />
                  <button
                    type="button"
                    onClick={addColor}
                    className="px-3 py-1 bg-blue-500 text-white rounded-md"
                  >
                    <FaPlus />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.colors.map((color, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded"
                    >
                      <div
                        style={{ backgroundColor: color }}
                        className="w-4 h-4 rounded"
                      ></div>
                      <span>{color}</span>
                      <button
                        type="button"
                        onClick={() => removeColor(color)}
                        className="text-red-500"
                      >
                        <FaMinus size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sizes */}
              <div>
                <label className="block font-semibold mb-2">Sizes</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newSize}
                    onChange={(e) => setNewSize(e.target.value)}
                    placeholder="Add size"
                    className="flex-1 px-3 py-1 border border-gray-300 rounded-md"
                  />
                  <button
                    type="button"
                    onClick={addSize}
                    className="px-3 py-1 bg-blue-500 text-white rounded-md"
                  >
                    <FaPlus />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.sizes.map((size, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded"
                    >
                      <span>{size}</span>
                      <button
                        type="button"
                        onClick={() => removeSize(size)}
                        className="text-red-500"
                      >
                        <FaMinus size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Volumes and Specifications */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Volumes */}
              <div>
                <label className="block font-semibold mb-2">Volumes</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newVolume}
                    onChange={(e) => setNewVolume(e.target.value)}
                    placeholder="Add volume"
                    className="flex-1 px-3 py-1 border border-gray-300 rounded-md"
                  />
                  <button
                    type="button"
                    onClick={addVolume}
                    className="px-3 py-1 bg-blue-500 text-white rounded-md"
                  >
                    <FaPlus />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.volumes.map((volume, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded"
                    >
                      <span>{volume}</span>
                      <button
                        type="button"
                        onClick={() => removeVolume(volume)}
                        className="text-red-500"
                      >
                        <FaMinus size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Specifications */}
              <div>
                <label className="block font-semibold mb-2">
                  Specifications
                </label>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <input
                    type="text"
                    value={specKey}
                    onChange={(e) => setSpecKey(e.target.value)}
                    placeholder="Key"
                    className="px-3 py-1 border border-gray-300 rounded-md"
                  />
                  <input
                    type="text"
                    value={specValue}
                    onChange={(e) => setSpecValue(e.target.value)}
                    placeholder="Value"
                    className="px-3 py-1 border border-gray-300 rounded-md"
                  />
                </div>
                <button
                  type="button"
                  onClick={addSpecification}
                  className="mb-2 px-3 py-1 bg-blue-500 text-white rounded-md"
                >
                  Add Specification
                </button>
                <div className="space-y-1">
                  {Object.entries(formData.specifications).map(
                    ([key, value], index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-gray-100 px-2 py-1 rounded"
                      >
                        <span className="font-medium">{key}:</span>
                        <span>{value}</span>
                        <button
                          type="button"
                          onClick={() => removeSpecification(key)}
                          className="text-red-500"
                        >
                          <FaMinus size={12} />
                        </button>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Images */}
            <div>
              <label className="block font-semibold mb-2">Update Images</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {["image1", "image2", "image3", "image4"].map(
                  (imgKey, index) => (
                    <label key={index} className="cursor-pointer">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-2 text-center">
                        <img
                          src={
                            images[imgKey]
                              ? URL.createObjectURL(images[imgKey])
                              : product?.image?.[index] || uploadIcon
                          }
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-contain rounded mb-2"
                        />
                        <span className="text-sm text-gray-600">
                          Image {index + 1}
                        </span>
                        <input
                          type="file"
                          onChange={(e) => handleImageChange(e, imgKey)}
                          className="hidden"
                          accept="image/*"
                        />
                      </div>
                    </label>
                  )
                )}
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 justify-end pt-6 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
              >
                {loading ? "Updating..." : "Update Product"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProductEditModal;
