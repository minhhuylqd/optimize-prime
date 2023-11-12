import Image from "next/image";

import logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default function Home() {
  const { userId } = auth();

  if (userId) {
    redirect("/notes");
  }

  return (
    <main className="flex h-screen flex-col items-center justify-center gap-5">
      <div className="flex items-center gap-4">
        <Image src={logo} width={100} height={100} alt="OP logo" />
        <span className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          Optimize Prime
        </span>
      </div>
      <p className="max-w-prose text-center">
        Your entrepreneurial vice-captain.
      </p>
      <Button size="lg" asChild>
        <Link href="/notes">Getting Started</Link>
      </Button>
    </main>
  );
}
