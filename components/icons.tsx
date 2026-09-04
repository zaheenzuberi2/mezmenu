import type { SVGProps } from "react";

/**
 * Small hand-picked outline icons, sized to inherit colour and fit a 1.5px
 * stroke at 24-28px. No icon library - keeps the bundle light and the style
 * consistent with the rest of the app.
 */
type IconProps = SVGProps<SVGSVGElement>;

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function PhoneEditIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="6" y="2.5" width="12" height="19" rx="2.5" />
      <path d="M9 18.5h6" />
      <path d="M13.5 7.5 17 11l-4.8 4.8-3-.4.4-3Z" />
    </svg>
  );
}

export function QrPrintIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="3" width="7" height="7" rx="1.2" />
      <rect x="14" y="3" width="7" height="7" rx="1.2" />
      <rect x="3" y="14" width="7" height="7" rx="1.2" />
      <path d="M15 15h2.5v2.5" />
      <path d="M20.5 15v2.5h-2.5" />
      <path d="M15 20.5h2.5" />
    </svg>
  );
}

export function WhatsAppOrderIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 20.5 5.3 16A8 8 0 1 1 8 18.7Z" />
      <path d="M9 10.2c0 2.6 2.2 4.8 4.8 4.8" strokeWidth={1.8} />
      <path d="M9.3 9.2c-.3-.7.2-1.4.9-1.4.5 0 .9.4.9.9 0 .5.2 1 .6 1.4l.4.4c.4.4.9.6 1.4.6.5 0 .9.4.9.9 0 .7-.7 1.2-1.4.9-1.7-.6-3.1-2-3.7-3.7Z" />
    </svg>
  );
}

export function PriceTagIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12.5 3H5a2 2 0 0 0-2 2v7.5a2 2 0 0 0 .6 1.4l8 8a2 2 0 0 0 2.8 0l6.5-6.5a2 2 0 0 0 0-2.8l-8-8a2 2 0 0 0-.4-.6Z" />
      <circle cx="8.2" cy="8.2" r="1.4" />
    </svg>
  );
}

export function SoldOutIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5v5.5l3.5 2" />
      <path d="M5 5l14 14" strokeWidth={1.8} />
    </svg>
  );
}

export function NoCommissionIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6 4h9.5c2 0 3.2 2.3 2 4L14 12l3.5 4c1.2 1.7 0 4-2 4H6" />
      <path d="M6 8.5h7" />
      <path d="M6 12h5" />
    </svg>
  );
}

export function TableNumberIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3 8h18l-2 3H5Z" />
      <path d="M6 11v9" />
      <path d="M18 11v9" />
      <path d="M9.5 17h1.6l1.4-2.2h1.6" />
    </svg>
  );
}

export function PrinterSlashIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M7 8V4h8v4" />
      <path d="M7 17h8v4H7Z" />
      <path d="M5 8h14a2 2 0 0 1 2 2v4.5a2 2 0 0 1-2 2H17" />
      <path d="M7 16.5H5a2 2 0 0 1-2-2V10a2 2 0 0 1 1.2-1.8" />
      <path d="M3 3l18 18" strokeWidth={1.8} />
    </svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M4 10.5l4 4 8-9" />
    </svg>
  );
}
