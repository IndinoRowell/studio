"use client"

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/form-provider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  reason: z.enum(['Study', 'Borrow/Return', 'Research', 'Computer Use', 'Meeting', 'Others']),
  college: z.enum([
    'Accountancy', 'Agriculture', 'Arts and Sciences', 'Business Administration', 
    'Communication', 'Criminology', 'Education', 'Engineering and Architecture', 
    'Informatics and Computing Studies', 'Law', 'Music', 'International Relations', 
    'Medicine', 'Nursing', 'Medical Technology', 'Physical Therapy', 
    'Respiratory Therapy', 'Midwifery', 'Graduate Studies', 'Basic Education'
  ]),
  employeeStatus: z.enum(['Student', 'Faculty', 'Staff']),
});

export function CheckInForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const db = useFirestore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    
    const logData = {
      ...values,
      timestamp: serverTimestamp(),
    };

    addDoc(collection(db, 'logs'), logData)
      .then(() => {
        setIsLoading(false);
        setIsSubmitted(true);
        toast({
          title: "Check-in Successful",
          description: `Welcome to NEU Library, ${values.name}!`,
        });
      })
      .catch(async (error) => {
        setIsLoading(false);
        const permissionError = new FirestorePermissionError({
          path: '/logs',
          operation: 'create',
          requestResourceData: logData,
        });
        errorEmitter.emit('permission-error', permissionError);
      });
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
                      <SelectItem value="Accountancy">College of Accountancy</SelectItem>
                      <SelectItem value="Agriculture">College of Agriculture</SelectItem>
                      <SelectItem value="Arts and Sciences">College of Arts and Sciences</SelectItem>
                      <SelectItem value="Business Administration">College of Business Administration</SelectItem>
                      <SelectItem value="Communication">College of Communication</SelectItem>
                      <SelectItem value="Criminology">College of Criminology</SelectItem>
                      <SelectItem value="Education">College of Education</SelectItem>
                      <SelectItem value="Engineering and Architecture">College of Engineering and Architecture</SelectItem>
                      <SelectItem value="Informatics and Computing Studies">College of Informatics and Computing Studies</SelectItem>
                      <SelectItem value="Law">College of Law</SelectItem>
                      <SelectItem value="Music">College of Music</SelectItem>
                      <SelectItem value="International Relations">School of International Relations</SelectItem>
                      <SelectItem value="Medicine">College of Medicine</SelectItem>
                      <SelectItem value="Nursing">College of Nursing</SelectItem>
                      <SelectItem value="Medical Technology">College of Medical Technology</SelectItem>
                      <SelectItem value="Physical Therapy">College of Physical Therapy</SelectItem>
                      <SelectItem value="Respiratory Therapy">College of Respiratory Therapy</SelectItem>
                      <SelectItem value="Midwifery">College of Midwifery</SelectItem>
                      <SelectItem value="Graduate Studies">School of Graduate Studies</SelectItem>
                      <SelectItem value="Basic Education">Basic Education</SelectItem>
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
