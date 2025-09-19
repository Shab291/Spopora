import { useRef, useEffect } from "react";

const ImageMagnifier = ({
  src,
  width = 550,
  height = 550,
  alt = "Sample Image",
  zoomLevel = 2,
}) => {
  const imgRef = useRef(null);
  const magnifierRef = useRef(null);

  useEffect(() => {
    const img = imgRef.current;
    const magnifier = magnifierRef.current;

    if (!img || !magnifier) return;

    const handleMouseMove = (e) => {
      const pos = getCursorPos(e, img);
      const x = pos.x;
      const y = pos.y;

      if (x > 0 && y > 0 && x < img.width && y < img.height) {
        magnifier.style.display = "block";
        magnifier.style.backgroundImage = `url('${src}')`;
        magnifier.style.backgroundSize = `${img.width * zoomLevel}px ${
          img.height * zoomLevel
        }px`;
        magnifier.style.left = `${x - magnifier.offsetWidth / 2}px`;
        magnifier.style.top = `${y - magnifier.offsetHeight / 2}px`;
        magnifier.style.backgroundPosition = `-${
          x * zoomLevel - magnifier.offsetWidth / 5
        }px -${y * zoomLevel - magnifier.offsetHeight / 5}px`;
      } else {
        magnifier.style.display = "none";
      }
    };

    const handleMouseLeave = () => {
      if (magnifier) magnifier.style.display = "none";
    };

    img.addEventListener("mousemove", handleMouseMove);
    img.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      img.removeEventListener("mousemove", handleMouseMove);
      img.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [src, zoomLevel]);

  const getCursorPos = (e, img) => {
    const rect = img.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  return (
    <div className="container">
      <div className="img-magnifier-container">
        <img
          ref={imgRef}
          id="myImage"
          src={src}
          width={width}
          height={height}
          alt={alt}
        />
        <div ref={magnifierRef} className="magnifier" id="magnifier" />
      </div>
    </div>
  );
};

// CSS (can be placed in a separate CSS file or using styled-components)
const styles = `
 

.img-magnifier-container{
  display: inline-block;
  position: relative;
 
}
  .magnifier {
    position: absolute;
    border: 3px solid #000;
    border-radius: 50%;
    cursor: none;
    width: 150px;
    height: 150px;
    display: none;
    pointer-events: none;
    background-repeat: no-repeat;
    background-size: 200%;
  }


`;

// Add styles to the head
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default ImageMagnifier;
