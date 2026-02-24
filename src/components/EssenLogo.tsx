export default function EssenLogo({ className = "", size = 32 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Green hexagon (back, offset) */}
      <path
        d="M30 8L40.39 14V26L30 32L19.61 26V14L30 8Z"
        fill="#38dcab"
      />
      {/* Purple hexagon (front) */}
      <path
        d="M20 14L30.39 20V32L20 38L9.61 32V20L20 14Z"
        fill="#763df2"
      />
    </svg>
  );
}
