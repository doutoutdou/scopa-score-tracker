interface IconProps {
  className?: string;
  style?: React.CSSProperties;
}

export function PlayCardIcon({ className = "w-6 h-6", style }: IconProps) {
  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="4"
        y="4"
        width="16"
        height="16"
        rx="2"
        fill="currentColor"
        opacity="0.1"
        stroke="currentColor"
        strokeWidth="2"
      />
      <text
        x="12"
        y="16"
        fontSize="12"
        fill="currentColor"
        textAnchor="middle"
        fontWeight="bold"
      >
        A
      </text>
      <path
        d="M8 8L10 11L8 14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.5"
      />
    </svg>
  );
}
