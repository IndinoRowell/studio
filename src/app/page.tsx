import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { User, ShieldCheck, Library, CheckCircle } from "lucide-react";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function Home() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-library');

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Library className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold font-headline text-primary">NEULib Connect</h1>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow">
        <section className="relative h-[40vh] md:h-[50vh] flex items-center justify-center overflow-hidden">
          {heroImage && (
            <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              fill
              className="object-cover opacity-20"
              priority
              data-ai-hint="university campus"
            />
          )}
          <div className="container mx-auto px-4 text-center z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium mb-4 animate-pulse">
              <CheckCircle className="h-3 w-3" />
              System Online & Ready
            </div>
            <h2 className="text-4xl md:text-6xl font-headline font-bold text-primary mb-4">
              New Era University
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8 font-body">
              Your gateway to academic excellence and scholarly resources. Please select your portal to proceed.
            </p>
          </div>
        </section>

        {/* Role Selection */}
        <section className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="hover:shadow-lg transition-all border-2 hover:border-accent">
              <CardHeader className="text-center">
                <div className="mx-auto bg-accent/10 p-4 rounded-full w-fit mb-4">
                  <User className="h-10 w-10 text-accent" />
                </div>
                <CardTitle className="font-headline text-2xl">Visitor Portal</CardTitle>
                <CardDescription>Check-in for your visit and explore resources</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <Link href="/check-in" className="w-full">
                  <Button className="w-full bg-accent hover:bg-accent/90">
                    Visitor Check-in
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all border-2 hover:border-primary">
              <CardHeader className="text-center">
                <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                  <ShieldCheck className="h-10 w-10 text-primary" />
                </div>
                <CardTitle className="font-headline text-2xl">Admin Dashboard</CardTitle>
                <CardDescription>Manage logs, view statistics, and gain insights</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <Link href="/login" className="w-full">
                  <Button className="w-full bg-primary hover:bg-primary/90">
                    Administrator Login
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} NEULib Connect. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
