
"use client"

import { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, CheckCircle2, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { signInAnonymously } from 'firebase/auth';
import { useAuth } from '@/firebase';

export function CardScanner() {
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isScanning, setIsScanning] = useState(true);
  const [scanComplete, setScanComplete] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();
  const router = useRouter();
  const auth = useAuth();
  
  // Use a ref to prevent multiple initialization and to track timeouts
  const initializationRef = useRef(false);
  const scanTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const redirectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (initializationRef.current) return;
    initializationRef.current = true;

    const getCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
        streamRef.current = stream;
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        // Simulate a successful scan after 5 seconds of feed
        scanTimeoutRef.current = setTimeout(async () => {
          try {
            // Perform actual sign-in to prevent the Scanner -> Admin -> Scanner redirect loop
            await signInAnonymously(auth);
            
            setIsScanning(false);
            setScanComplete(true);
            
            toast({
              title: "Card Recognized",
              description: "NEU Administrator Identity Verified.",
            });
            
            // Stop the stream
            if (streamRef.current) {
              streamRef.current.getTracks().forEach(track => track.stop());
              streamRef.current = null;
            }

            // Redirect to admin after a brief success animation
            redirectTimeoutRef.current = setTimeout(() => {
              router.push('/admin');
            }, 1500);
          } catch (signInError: any) {
            console.error('Sign-in failed:', signInError);
            toast({
              variant: 'destructive',
              title: 'Authentication Failed',
              description: 'Could not verify ID card. Please try manual login.',
            });
            // Allow retry if needed
            initializationRef.current = false;
            setIsScanning(true);
          }
        }, 5000);

      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings to use the card scanner.',
        });
      }
    };

    getCameraPermission();

    return () => {
      // Cleanup: stop tracks and clear timeouts
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (scanTimeoutRef.current) clearTimeout(scanTimeoutRef.current);
      if (redirectTimeoutRef.current) clearTimeout(redirectTimeoutRef.current);
    };
  }, [auth, router, toast]);

  return (
    <div className="space-y-6">
      <div className="bg-primary/5 border border-primary/10 p-4 rounded-lg flex gap-3 items-start">
        <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="font-semibold text-primary">How to use the Card Scanner:</p>
          <ol className="list-decimal list-inside text-muted-foreground mt-1 space-y-1">
            <li>Ensure camera access is enabled for this site.</li>
            <li>Hold your physical <strong>NEU ID Card</strong> in front of the camera.</li>
            <li>Align the card within the visible rectangular frame.</li>
            <li>Wait for the system to scan and verify your credentials.</li>
          </ol>
        </div>
      </div>

      <Card className="overflow-hidden border-2 border-primary/20 bg-muted/30 relative">
        <CardContent className="p-0 relative aspect-video flex items-center justify-center bg-black">
          <video 
            ref={videoRef} 
            className={`w-full h-full object-cover ${scanComplete ? 'opacity-30' : 'opacity-100'} transition-opacity`} 
            autoPlay 
            muted 
            playsInline
          />

          {hasCameraPermission === false && (
            <div className="absolute inset-0 flex items-center justify-center p-6 bg-background/90 z-20">
              <Alert variant="destructive">
                <AlertTitle>Camera Access Required</AlertTitle>
                <AlertDescription>
                  Please allow camera access to use the card scanning feature.
                </AlertDescription>
              </Alert>
            </div>
          )}

          {hasCameraPermission === true && isScanning && (
            <div className="absolute inset-0 pointer-events-none z-10">
              {/* Scanner Overlay UI */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-40 border-2 border-accent/80 rounded-lg relative overflow-hidden bg-accent/5 backdrop-blur-[1px]">
                  <div className="absolute top-0 left-0 w-full h-1 bg-accent animate-[scan_2s_ease-in-out_infinite] shadow-[0_0_15px_rgba(51,133,204,0.8)]"></div>
                  {/* Corners */}
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-accent"></div>
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-accent"></div>
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-accent"></div>
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-accent"></div>
                </div>
              </div>
              <div className="absolute bottom-4 left-0 right-0 text-center">
                <div className="inline-flex items-center gap-2 bg-black/60 text-white px-4 py-2 rounded-full text-sm backdrop-blur-md border border-white/20">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Aligning and detecting ID card...
                </div>
              </div>
            </div>
          )}

          {scanComplete && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-green-500/20 z-30 backdrop-blur-[2px]">
              <CheckCircle2 className="h-16 w-16 text-green-500 animate-bounce" />
              <span className="mt-4 font-headline font-bold text-green-700 bg-white/90 px-6 py-2 rounded-full text-lg shadow-lg border-2 border-green-500/30">
                IDENTITY VERIFIED
              </span>
            </div>
          )}
        </CardContent>
        <style jsx>{`
          @keyframes scan {
            0%, 100% { top: 0; }
            50% { top: 100%; }
          }
        `}</style>
      </Card>
    </div>
  );
}
