import config from "@/config";
import { getUserFromToken } from "@/lib/user";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

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
      <div className="flex h-16 items-center justify-between w-full px-8">
        <Link href="/" className="text-xl font-bold flex gap-2 items-center">
          <Image src="/logo.svg" alt="Logo" width={20} height={20} />
          {config.appName}
        </Link>
      </div>
      <div className="flex-1 flex items-center justify-center">{children}</div>
    </div>
  );
}
