const FormatPrice = ({ price }) => {
  return Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "USD", // Changed to proper currency code
    maximumFractionDigits: 2,
  }).format(price); // Added format() call with price parameter
};

export default FormatPrice;
