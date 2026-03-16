"use client"

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  reason: z.enum(['Study', 'Borrow/Return', 'Research', 'Computer Use', 'Meeting', 'Others']),
  college: z.enum(['CAS', 'CBA', 'CED', 'CEAS', 'CHM', 'CON', 'LAW', 'Graduate School']),
  employeeStatus: z.enum(['Student', 'Faculty', 'Staff']),
});

export function CheckInForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      toast({
        title: "Check-in Successful",
        description: `Welcome to NEU Library, ${values.name}!`,
      });
    }, 1500);
  }

  if (isSubmitted) {
    return (
      <Card className="max-w-md mx-auto border-2 border-accent bg-accent/5">
        <CardContent className="pt-10 pb-10 text-center space-y-4">
          <div className="bg-accent/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="h-10 w-10 text-accent" />
          </div>
          <h2 className="text-3xl font-headline font-bold text-primary">Welcome to NEU Library!</h2>
          <p className="text-muted-foreground">Your check-in has been recorded successfully. Have a productive session!</p>
          <Button 
            variant="outline" 
            className="mt-6"
            onClick={() => {
              setIsSubmitted(false);
              form.reset();
            }}
          >
            New Check-in
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-lg mx-auto shadow-xl">
      <CardHeader className="bg-primary text-primary-foreground rounded-t-lg">
        <CardTitle className="font-headline text-2xl">Visitor Log</CardTitle>
        <CardDescription className="text-primary-foreground/70">Please fill out your details to enter the library.</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reason for Visit</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select reason" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Study">Study</SelectItem>
                        <SelectItem value="Borrow/Return">Borrow/Return</SelectItem>
                        <SelectItem value="Research">Research</SelectItem>
                        <SelectItem value="Computer Use">Computer Use</SelectItem>
                        <SelectItem value="Meeting">Meeting</SelectItem>
                        <SelectItem value="Others">Others</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="employeeStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Student">Student</SelectItem>
                        <SelectItem value="Faculty">Faculty (Teacher)</SelectItem>
                        <SelectItem value="Staff">Staff</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="college"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>College / Affiliation</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your college" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="CAS">College of Arts and Sciences (CAS)</SelectItem>
                      <SelectItem value="CBA">College of Business Administration (CBA)</SelectItem>
                      <SelectItem value="CED">College of Education (CED)</SelectItem>
                      <SelectItem value="CEAS">College of Eng. and Architecture (CEAS)</SelectItem>
                      <SelectItem value="CHM">College of Hospitality Management (CHM)</SelectItem>
                      <SelectItem value="CON">College of Nursing (CON)</SelectItem>
                      <SelectItem value="LAW">College of Law (LAW)</SelectItem>
                      <SelectItem value="Graduate School">Graduate School</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Recording Check-in...
                </>
              ) : "Complete Check-in"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
