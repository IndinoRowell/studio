import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { User, ShieldCheck, Library, CheckCircle } from "lucide-react";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default async function Home(props: {
  params: Promise<any>;
  searchParams: Promise<any>;
}) {
  const params = await props.params;
  const searchParams = await props.searchParams;
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
            <Link href="/user/login">
              <Button variant="ghost">User Sign In</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow">
        <section className="relative h-[65vh] flex items-center justify-center overflow-hidden">
          {heroImage && (
            <>
              <Image
                src={heroImage.imageUrl}
                alt={heroImage.description}
                fill
                className="object-cover"
                priority
                data-ai-hint="university campus"
              />
              {/* Overlay for Contrast */}
              <div className="absolute inset-0 bg-black/50 z-0" />
            </>
          )}
          <div className="container mx-auto px-4 text-center z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100/90 text-green-800 text-xs font-medium mb-6 backdrop-blur-sm shadow-sm">
              <CheckCircle className="h-3 w-3" />
              System Online
            </div>
            <h2 className="text-5xl md:text-7xl font-headline font-bold text-white mb-6 drop-shadow-lg">
              New Era University
            </h2>
            <p className="text-xl text-white/95 max-w-2xl mx-auto mb-10 font-body drop-shadow-md">
              Your gateway to academic excellence and scholarly resources. Please select your portal to proceed.
            </p>
          </div>
        </section>

        {/* Role Selection */}
        <section className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
            <Card className="hover:shadow-xl transition-all border-2 hover:border-accent group bg-card">
              <CardHeader className="text-center">
                <div className="mx-auto bg-accent/10 p-6 rounded-full w-fit mb-4 group-hover:scale-110 transition-transform">
                  <User className="h-12 w-12 text-accent" />
                </div>
                <CardTitle className="font-headline text-3xl">User Portal</CardTitle>
                <CardDescription className="text-base">Access your library account, check-in, and view history</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <Link href="/user/login" className="w-full">
                  <Button className="w-full h-12 text-lg bg-accent hover:bg-accent/90">
                    User Login
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-all border-2 hover:border-primary group bg-card">
              <CardHeader className="text-center">
                <div className="mx-auto bg-primary/10 p-6 rounded-full w-fit mb-4 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="h-12 w-12 text-primary" />
                </div>
                <CardTitle className="font-headline text-3xl">Admin Dashboard</CardTitle>
                <CardDescription className="text-base">Manage logs, view statistics, and gain insights</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <Link href="/login" className="w-full">
                  <Button className="w-full h-12 text-lg bg-primary hover:bg-primary/90">
                    Administrator Login
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t py-10">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 NEULib Connect. Dedicated to Excellence.</p>
        </div>
      </footer>
    </div>
  );
}
