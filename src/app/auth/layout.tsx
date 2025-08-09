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
    <>
      <div className="fixed top-0 left-0 right-0 w-full z-50 pt-sat">
        <div className="flex items-center gap-2 h-16 px-8">
          <Link href="/" className="text-xl font-bold flex gap-2 items-center">
            <Image src="/logo.svg" alt="Logo" width={20} height={20} />
            {config.appName}
          </Link>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="absolute inset-0 -z-10">
          <Image
            src="/hero-bg.svg"
            alt=""
            fill
            className="object-cover"
            priority
          />
        </div>
        {children}
      </div>
    </>
  );
}
