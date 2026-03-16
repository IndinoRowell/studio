
'use client';

import { useState } from 'react';
import { CardScanner } from "@/components/card-scanner";
import { ManualLogin } from "@/components/manual-login";
import { Library, ChevronLeft, CreditCard, UserCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState("scanner");

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="p-4 flex items-center justify-between border-b bg-white/50 backdrop-blur-sm">
        <Link href="/">
          <Button variant="ghost" className="gap-2">
            <ChevronLeft className="h-4 w-4" />
            Back
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <Library className="h-5 w-5 text-primary" />
          <span className="font-headline font-bold text-primary">NEULib</span>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-headline font-bold text-primary">System Access</h1>
            <p className="text-muted-foreground">Scan your ID card or sign in manually</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="scanner" className="gap-2">
                <CreditCard className="h-4 w-4" />
                Card Scanner
              </TabsTrigger>
              <TabsTrigger value="manual" className="gap-2">
                <UserCircle className="h-4 w-4" />
                Manual Login
              </TabsTrigger>
            </TabsList>

            <TabsContent value="scanner" className="mt-6">
              <CardScanner />
            </TabsContent>

            <TabsContent value="manual" className="mt-6">
              <ManualLogin />
            </TabsContent>
          </Tabs>

          <p className="text-center text-xs text-muted-foreground">
            By signing in, you agree to the Library's terms of service and usage policies.
          </p>
        </div>
      </main>
    </div>
  );
}
