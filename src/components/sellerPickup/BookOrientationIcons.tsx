interface IconProps {
  className?: string;
}

export const FrontCoverIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="4" y="2" width="16" height="20" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
    <rect x="8" y="7" width="8" height="6" rx="0.5" stroke="currentColor" strokeWidth="1.2" />
    <line x1="8" y1="16" x2="16" y2="16" stroke="currentColor" strokeWidth="1.2" />
  </svg>
);

export const BackCoverIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="4" y="2" width="16" height="20" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
    <line x1="7" y1="6" x2="17" y2="6" stroke="currentColor" strokeWidth="1.2" />
    <line x1="7" y1="9" x2="17" y2="9" stroke="currentColor" strokeWidth="1.2" />
    <line x1="7" y1="12" x2="13" y2="12" stroke="currentColor" strokeWidth="1.2" />
    <rect x="8" y="16" width="5" height="4" stroke="currentColor" strokeWidth="1.2" />
  </svg>
);

export const SpineIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="9" y="2" width="6" height="20" rx="1" stroke="currentColor" strokeWidth="1.5" />
    <line x1="12" y1="6" x2="12" y2="18" stroke="currentColor" strokeWidth="1.2" />
  </svg>
);