
'use client';

import { useState } from 'react';
import { UserLogin } from "@/components/user-login";
import { UserRegister } from "@/components/user-register";
import { Library, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function UserLoginPage() {
  const [activeTab, setActiveTab] = useState("login");

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
            <h1 className="text-3xl font-headline font-bold text-primary">
              {activeTab === 'login' ? 'User Login' : 'Create Account'}
            </h1>
            <p className="text-muted-foreground">Access your NEU Library account</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Sign In</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="mt-6">
              <UserLogin />
            </TabsContent>

            <TabsContent value="register" className="mt-6">
              <UserRegister />
            </TabsContent>
          </Tabs>

          <p className="text-center text-xs text-muted-foreground">
            Use your student or faculty credentials to access the library portal.
          </p>
        </div>
      </main>
    </div>
  );
}
