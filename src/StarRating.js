import { useState } from "react";

const Container = {
  display: "flex",
  alignItems: "center",
  gap: "16px",
};
const StarStyle = {
  display: "flex",
  gap: "4px",
};

const Text = {
  lineHight: "1",
  margin: "0px",
};
export default function StarRating({
  maxLength = 5,
  color = "#FFFF00",
  size = 32,
  ratings = [],
  onUserRating,
}) {
  const [rating, setRating] = useState(ratings);
  const [tempRating, setTempRating] = useState(0);
  function handleRating(rating) {
    setRating(rating);
    onUserRating(rating);
  }
  return (
    <div style={Container}>
      <div style={StarStyle}>
        {Array.from({ length: maxLength }, (_, ele) => (
          <Star
            key={ele}
            onRate={() => handleRating(ele + 1)}
            onMouseIn={() => setTempRating(ele + 1)}
            onMouseOut={() => setTempRating(0)}
            full={tempRating ? tempRating >= ele + 1 : rating >= ele + 1}
            color={color}
            size={size}
          />
        ))}
      </div>
      <p style={Text}>
        {ratings.length === maxLength
          ? ratings[tempRating ? tempRating - 1 : rating - 1]
          : tempRating || rating || ""}
      </p>
    </div>
  );
}
function Star({ onRate, full, onMouseIn, onMouseOut, color, size }) {
  const Star = {
    display: "block",
    width: `${size}px`,
    height: `${size}px`,
    cursor: "pointer",
  };
  return (
    <span
      style={Star}
      role="button"
      onClick={onRate}
      onMouseEnter={onMouseIn}
      onMouseLeave={onMouseOut}
    >
      {full ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill={color}
          stroke={color}
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke={color}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="{2}"
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
      )}
    </span>
  );
}
