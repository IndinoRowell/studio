'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, User as UserIcon, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useAuth } from '@/firebase';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid university email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export function UserLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setIsLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
      router.push('/user');
    } catch (error: any) {
      let message = "Login failed. Please check your credentials.";
      
      if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        message = "Incorrect password. Please try again.";
      } else if (error.code === 'auth/user-not-found') {
        message = "No account found with this email.";
      }

      setError(message);
      toast({
        variant: 'destructive',
        title: "Login Error",
        description: message,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="border-2 border-accent/10">
      <CardContent className="pt-6 space-y-6">
        {error && (
          <Alert variant="destructive" className="animate-in fade-in slide-in-from-top-1">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Login Failed</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Library ID / Email</FormLabel>
                  <FormControl>
                    <Input placeholder="student@neu.edu.ph" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full gap-2 bg-accent hover:bg-accent/90" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <UserIcon className="h-4 w-4" />
              )}
              Sign In to Library
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
