interface IconProps {
  className?: string;
}

export function CardStackIcon({ className = "w-6 h-6" }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="3"
        y="8"
        width="12"
        height="16"
        rx="2"
        fill="currentColor"
        opacity="0.2"
        transform="rotate(-10 9 16)"
      />
      <rect
        x="5"
        y="6"
        width="12"
        height="16"
        rx="2"
        fill="currentColor"
        opacity="0.3"
        transform="rotate(-5 11 14)"
      />
      <rect
        x="7"
        y="4"
        width="12"
        height="16"
        rx="2"
        stroke="currentColor"
        strokeWidth="2"
        fill="currentColor"
        fillOpacity="0.1"
      />
      <path
        d="M11 9L13 11L11 13"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
