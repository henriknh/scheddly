export default function TeamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="container space-y-4 py-4">{children}</div>;
}
