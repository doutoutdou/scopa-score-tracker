interface IconProps {
  className?: string;
}

export function TrophyIcon({ className = "w-6 h-6" }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8 3H16V8C16 10.2091 14.2091 12 12 12C9.79086 12 8 10.2091 8 8V3Z"
        fill="currentColor"
        opacity="0.2"
      />
      <path
        d="M8 3H16V8C16 10.2091 14.2091 12 12 12C9.79086 12 8 10.2091 8 8V3Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 5H18C19.1046 5 20 5.89543 20 7C20 8.10457 19.1046 9 18 9H16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M8 5H6C4.89543 5 4 5.89543 4 7C4 8.10457 4.89543 9 6 9H8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M12 12V16M9 21H15M9 16H15V21H9V16Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
