import { useState, useEffect, useRef } from "react";

const Marquee = ({
  text = "Spopora Deals. Authentic Feel. Always Affordable.",
  speed = 80,
  backgroundColor = "",
  textColor = "#ecf0f1",
  fontSize = "1.2rem",
  padding = "12px",
  containerStyle = {},
  contentStyle = {},
  repeatCount = 10,
  className = "",
}) => {
  const [containerWidth, setContainerWidth] = useState(0);
  const [contentWidth, setContentWidth] = useState(0);
  const containerRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current && contentRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
        setContentWidth(contentRef.current.scrollWidth);
      }
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);

    return () => {
      window.removeEventListener("resize", updateWidth);
    };
  }, [text, repeatCount]);

  // Generate repeated text
  const marqueeText = Array(repeatCount)
    .fill(text)
    .join(" \u00A0\u00A0\u00A0\u00A0 ");

  const duration = contentWidth / speed;

  return (
    <div
      className={className}
      style={{
        maxWidth: "100%",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "",
        ...containerStyle,
      }}
    >
      <div
        ref={containerRef}
        style={{
          overflow: "hidden",
          whiteSpace: "nowrap",
          position: "relative",
          backgroundColor,
          padding,
          ...contentStyle,
        }}
      >
        <div
          ref={contentRef}
          style={{
            display: "inline-block",
            paddingLeft: "100%",
            animation: `marquee ${duration}s linear infinite`,
            color: textColor,
            fontSize,
          }}
        >
          {marqueeText}
        </div>

        <style>
          {`
            @keyframes marquee {
              0% {
                transform: translate(0, 0);
              }
              100% {
                transform: translate(-${contentWidth}px, 0);
              }
            }
          `}
        </style>
      </div>
    </div>
  );
};

export default Marquee;
