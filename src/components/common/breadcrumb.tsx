interface BreadcrumbProps {
  label: string;
  href?: string;
}

export function Breadcrumb({ label, href }: BreadcrumbProps) {
  return (
    <span className="breadcrumb hidden" data-label={label} data-href={href} />
  );
}
