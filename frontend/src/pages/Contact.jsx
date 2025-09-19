import {
  FaFacebookSquare,
  FaInstagramSquare,
  FaLinkedin,
  FaGithubSquare,
  FaEnvelope,
  FaPhoneSquareAlt,
  FaPaperPlane,
} from "react-icons/fa";
import logoWhite from "../assets/logos/logo-white.png";
import { FaSquareXTwitter, FaLocationDot } from "react-icons/fa6";
import Title from "../components/Title";
import Footer from "../components/Footer";

const Contact = () => {
  return (
    <div className="pt-24 mb-2 py-15 px-4 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-6xl mx-auto">
        <Title title1={"Get In"} title2={"Touch"} />

        <div className="pt-2 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
            <img src={logoWhite} alt="logo" width={170} />

            <h3 className="text-2xl pt-2 font-semibold mb-4 text-[#FD0DAA]">
              Contact Information
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Feel free to reach out for collaborations or just to say hello!
            </p>

            <div className="flex items-start gap-4 mb-6">
              <div className="p-2 bg-indigo-100 rounded-full text-[#FD0DAA]">
                <FaEnvelope className="text-xl" />
              </div>
              <div>
                <h4 className="font-medium text-gray-800">Email</h4>
                <a
                  href="mailto:support@spopora.com"
                  className="text-gray-600 hover:text-[#FD0DAA] transition-colors"
                >
                  support@spopora.com
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4 mb-6">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-full text-[#FD0DAA]">
                <FaPhoneSquareAlt className="text-xl" />
              </div>
              <div>
                <h4 className="font-medium text-gray-800 ">Phone</h4>
                <a
                  href="tel:+923334030427"
                  className="text-gray-600 dark:text-gray-400 hover:text-[#FD0DAA] transition-colors"
                >
                  +44 20 7123 4567
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4 mb-8">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-full text-[#FD0DAA]">
                <FaLocationDot className="text-xl" />
              </div>
              <div>
                <h4 className="font-medium text-gray-800 dark:text-gray-200">
                  Location
                </h4>
                <p className="text-gray-600 dark:text-gray-400 hover:text-[#FD0DAA]">
                  London, United Kingdom
                </p>
              </div>
            </div>

            <div className="mb-8">
              <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-4">
                Follow Us
              </h4>
              <div className="flex gap-4">
                <a
                  href="https://www.facebook.com/deviloooda"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-[#FD0DAA]  transition-colors text-2xl"
                  aria-label="Facebook"
                >
                  <FaFacebookSquare />
                </a>
                <a
                  href="https://www.instagram.com/shabwebdev/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-[#FD0DAA] transition-colors text-2xl"
                  aria-label="Instagram"
                >
                  <FaInstagramSquare />
                </a>
                <a
                  href="https://www.x.com/@shab291"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-[#FD0DAA] transition-colors text-2xl"
                  aria-label="Twitter"
                >
                  <FaSquareXTwitter />
                </a>
                <a
                  href="https://www.linkedin.com/in/shahbaz-siddique-7abb3436/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-[#FD0DAA] transition-colors text-2xl"
                  aria-label="LinkedIn"
                >
                  <FaLinkedin />
                </a>
                <a
                  href="https://github.com/yourusername"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-[#FD0DAA] transition-colors text-2xl"
                  aria-label="GitHub"
                >
                  <FaGithubSquare />
                </a>
              </div>
            </div>

            <div className="flex flex-wrap gap-4"></div>
          </div>

          {/* Contact Form */}
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
            <form
              id="contactForm"
              action="https://formspree.io/f/mbloggdp"
              method="POST"
              className="space-y-6"
            >
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  id="name"
                  placeholder=" "
                  required
                  autoComplete="name"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#FD0DAA] focus:border-transparent bg-transparent peer"
                />
                <label
                  htmlFor="name"
                  className="absolute left-4 -top-2.5 bg-white dark:bg-gray-800 px-2 text-indigo-600 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-[#FD0DAA]"
                >
                  Name
                </label>
              </div>

              <div className="relative">
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder=" "
                  required
                  autoComplete="email"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#FD0DAA] focus:border-transparent bg-transparent peer"
                />
                <label
                  htmlFor="email"
                  className="absolute left-4 -top-2.5 bg-white dark:bg-gray-800 px-2 text-indigo-600 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-[#FD0DAA]"
                >
                  Email
                </label>
              </div>

              <div className="relative">
                <input
                  type="text"
                  name="subject"
                  id="subject"
                  placeholder=" "
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#FD0DAA] focus:border-transparent bg-transparent peer"
                />
                <label
                  htmlFor="subject"
                  className="absolute left-4 -top-2.5 bg-white dark:bg-gray-800 px-2 text-indigo-600 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-[#FD0DAA]"
                >
                  Subject
                </label>
              </div>

              <div className="relative">
                <textarea
                  name="message"
                  id="message"
                  placeholder=" "
                  required
                  rows="5"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#FD0DAA] focus:border-transparent bg-transparent peer resize-y min-h-[120px]"
                ></textarea>
                <label
                  htmlFor="message"
                  className="absolute left-4 -top-2.5 bg-white dark:bg-gray-800 px-2 text-indigo-600 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-[#FD0DAA]"
                >
                  Message
                </label>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-[#FD0DAA] hover:bg-[#bc127e] text-white py-3 px-6 rounded-lg transition-colors"
              >
                <span>Send Message</span>
                <FaPaperPlane className="transition-transform group-hover:translate-x-1" />
              </button>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Contact;
