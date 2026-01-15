interface IconProps {
  className?: string;
}

export function BroomIcon({ className = "w-6 h-6" }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9 22L3 18L7 12L13 16L9 22Z"
        fill="currentColor"
        opacity="0.3"
      />
      <path
        d="M7 12L10 2L12 2.5L9 12.5L7 12Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 2L14 4M12 4L16 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
