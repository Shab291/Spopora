import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { backend_url } from "../App";
import uploadIcon from "../assets/upload_icon.png";
import { useAdminContext } from "../context/adminContext";

const CreateCampaign = () => {
  const { token } = useAdminContext();

  const [formData, setFormData] = useState({
    subject: "",
    content: "",
    templateType: "basic",
    scheduledFor: "",
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [testEmail, setTestEmail] = useState("");
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const fileInputRef = useRef(null);

  // Clean up object URLs on component unmount
  useEffect(() => {
    return () => {
      imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, [imagePreviews]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    // Check if files were selected
    if (files.length === 0) return;

    // Check if we're exceeding the 5 file limit
    if (imageFiles.length + files.length > 5) {
      toast.error("Maximum 5 images allowed");
      return;
    }

    // Check file sizes (max 5MB each)
    const oversizedFiles = files.filter((file) => file.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      toast.error(
        `Some files exceed 5MB limit: ${oversizedFiles
          .map((f) => f.name)
          .join(", ")}`
      );
      return;
    }

    // Create previews for selected images
    const newPreviews = files.map((file) => URL.createObjectURL(file));

    setImageFiles((prev) => [...prev, ...files]);
    setImagePreviews((prev) => [...prev, ...newPreviews]);

    // Reset the file input to allow selecting the same files again
    e.target.value = "";
  };

  const removeImage = (index) => {
    const newFiles = [...imageFiles];
    const newPreviews = [...imagePreviews];

    // Revoke the object URL to prevent memory leaks
    URL.revokeObjectURL(newPreviews[index]);

    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);

    setImageFiles(newFiles);
    setImagePreviews(newPreviews);
  };

  const clearAllImages = () => {
    // Revoke all object URLs to prevent memory leaks
    imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));

    setImageFiles([]);
    setImagePreviews([]);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate scheduled date is not in the past
    if (formData.scheduledFor && new Date(formData.scheduledFor) < new Date()) {
      toast.error("Scheduled date cannot be in the past");
      return;
    }

    // Validate image placeholders
    if (formData.content.includes("[image:")) {
      const imageIndices = [
        ...formData.content.matchAll(/\[image:(\d+)\]/g),
      ].map((match) => parseInt(match[1]));

      const invalidIndices = imageIndices.filter(
        (index) => index >= imageFiles.length
      );

      if (invalidIndices.length > 0) {
        toast.error(`Invalid image references: ${invalidIndices.join(", ")}`);
        return;
      }
    }

    setIsCreating(true);

    try {
      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append("subject", formData.subject);
      formDataToSend.append("content", formData.content);
      formDataToSend.append("templateType", formData.templateType);

      if (formData.scheduledFor) {
        formDataToSend.append("scheduledFor", formData.scheduledFor);
      }

      // Append image files (backend expects field name "images")
      imageFiles.forEach((file) => {
        formDataToSend.append("images", file); // Field name must be "images" to match multer config
      });

      // Debug: Log what's being sent
      console.log("FormData contents:");
      for (let [key, value] of formDataToSend.entries()) {
        if (value instanceof File) {
          console.log(`${key}:`, value.name, value.type, value.size);
        } else {
          console.log(`${key}:`, value);
        }
      }

      const config = {
        headers: {
          token,
          "Content-Type": "multipart/form-data",
        },
      };

      const response = await axios.post(
        `${backend_url}/api/campaigns/create`,
        formDataToSend,
        config
      );

      console.log("Create Campaign Response:", response);
      toast.success("Campaign created successfully");

      // Reset form
      setFormData({
        subject: "",
        content: "",
        templateType: "basic",
        scheduledFor: "",
      });

      // Clear images and revoke URLs
      clearAllImages();
    } catch (error) {
      console.error("Create campaign error:", error);

      // More detailed error logging
      if (error.response) {
        console.error("Server response:", error.response.data);
        console.error("Status:", error.response.status);
        console.error("Headers:", error.response.headers);
      } else if (error.request) {
        console.error("No response received:", error.request);
      } else {
        console.error("Error message:", error.message);
      }

      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Error creating campaign";
      toast.error(`Error: ${errorMessage}`);
    } finally {
      setIsCreating(false);
    }
  };

  const handleSendTest = async () => {
    if (!testEmail) {
      toast.error("Please enter a test email address");
      return;
    }

    if (!formData.subject || !formData.content) {
      toast.error("Please fill in subject and content before sending a test");
      return;
    }

    setIsSendingTest(true);
    try {
      // Create FormData for test email with files
      const formDataToSend = new FormData();
      formDataToSend.append("subject", formData.subject);
      formDataToSend.append("content", formData.content);
      formDataToSend.append("testEmail", testEmail);
      formDataToSend.append("templateType", formData.templateType);

      // Append image files (field name must be "images")
      imageFiles.forEach((file) => {
        formDataToSend.append("images", file);
      });

      const config = {
        headers: {
          token,
          "Content-Type": "multipart/form-data",
        },
      };

      await axios.post(
        `${backend_url}/api/campaigns/sendTest`,
        formDataToSend,
        config
      );

      toast.success("Test email sent successfully");
      setTestEmail(""); // Clear test email after sending
    } catch (error) {
      console.error("Test email error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Error sending test email";
      toast.error(`Error: ${errorMessage}`);
    } finally {
      setIsSendingTest(false);
    }
  };

  // Add image placeholder syntax to content
  const addImagePlaceholder = (index) => {
    const placeholder = `[image:${index}]`;
    setFormData((prev) => ({
      ...prev,
      content: prev.content + placeholder,
    }));
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Create New Campaign</h2>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subject *
            </label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
              required
              placeholder="Enter email subject"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Template Type
            </label>
            <select
              name="templateType"
              value={formData.templateType}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="basic">Basic</option>
              <option value="promotional">Promotional</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content *
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              rows="10"
              className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
              required
              placeholder="Enter your email content. Use [image:0], [image:1], etc. to place images."
            />
            <div className="mt-2 text-sm text-gray-500">
              <p>
                Use <code>[image:0]</code>, <code>[image:1]</code>, etc. in your
                content to position images.
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Schedule For (optional)
            </label>
            <input
              type="datetime-local"
              name="scheduledFor"
              value={formData.scheduledFor}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload Images (Optional) - Max 5 images, 5MB each
            </label>
            <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              <img src={uploadIcon} alt="Upload" className="w-5 h-5 mr-2" />
              Select Images
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="sr-only"
                accept="image/*"
                onChange={handleImageChange}
                disabled={imageFiles.length >= 5}
              />
            </label>

            {imageFiles.length > 0 && (
              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-medium text-gray-700">
                    {imageFiles.length} image(s) selected (Max: 5)
                  </p>
                  <button
                    type="button"
                    onClick={clearAllImages}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Clear all
                  </button>
                </div>

                {/* Insert Image Placeholders Section */}
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Insert Image Placeholders:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {imagePreviews.map((_, index) => (
                      <button
                        type="button"
                        key={index}
                        onClick={() => addImagePlaceholder(index)}
                        className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300"
                      >
                        Insert [image:{index}]
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div
                      key={index}
                      className="relative border rounded-lg overflow-hidden group"
                    >
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                          title="Remove image"
                          aria-label="Remove image"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                      <div className="p-2 bg-white">
                        <p className="text-xs text-gray-600 truncate">
                          {imageFiles[index].name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(imageFiles[index].size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Send Test Email
          </label>
          <div className="flex items-center">
            <input
              type="email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              placeholder="Enter test email address"
              className="flex-1 px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 mr-2"
            />
            <button
              type="button"
              onClick={handleSendTest}
              disabled={isSendingTest || !formData.subject || !formData.content}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSendingTest ? "Sending..." : "Send Test"}
            </button>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => {
              setFormData({
                subject: "",
                content: "",
                templateType: "basic",
                scheduledFor: "",
              });
              clearAllImages();
            }}
            className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          >
            Reset Form
          </button>
          <button
            type="submit"
            disabled={isCreating || !formData.subject || !formData.content}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCreating ? "Creating..." : "Create Campaign"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCampaign;
