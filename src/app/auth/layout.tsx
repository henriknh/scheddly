import { getUserFromToken } from "@/lib/user";
import { redirect } from "next/navigation";
import { Footer } from "@/components/root/Footer";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUserFromToken();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen w-full flex flex-col">
      <div className="flex-1 flex items-center justify-center">{children}</div>
      <Footer />
    </div>
  );
}
