import { SignIn } from "@clerk/nextjs";
import Logo from "@/components/custom/Logo";

export default function SignInPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#09090b] px-4 py-8">
      <div className="mb-8">
        <Logo size="lg" variant="dark" href="/" />
      </div>
      <SignIn />
    </main>
  );
}
