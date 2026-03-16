import { CheckInForm } from "@/components/check-in-form";
import { Library, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CheckInPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="p-4 flex items-center justify-between">
        <Link href="/">
          <Button variant="ghost" className="gap-2">
            <ChevronLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <Library className="h-5 w-5 text-primary" />
          <span className="font-headline font-bold text-primary">NEULib</span>
        </div>
      </header>
      
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full">
          <CheckInForm />
        </div>
      </main>
    </div>
  );
}
