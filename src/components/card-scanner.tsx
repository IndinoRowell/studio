
'use client';

import { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Scan, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export function CardScanner() {
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isScanning, setIsScanning] = useState(true);
  const [scanComplete, setScanComplete] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const getCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        // Simulate a successful scan after 4 seconds of feed
        setTimeout(() => {
          setIsScanning(false);
          setScanComplete(true);
          toast({
            title: "Card Recognized",
            description: "Access granted. Redirecting to dashboard...",
          });
          
          // Stop the stream
          stream.getTracks().forEach(track => track.stop());

          // Redirect to admin after a brief success animation
          setTimeout(() => {
            router.push('/admin');
          }, 1500);
        }, 4000);

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
      // Cleanup: stop tracks if component unmounts
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [router, toast]);

  return (
    <Card className="overflow-hidden border-2 border-primary/20 bg-muted/30">
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
              <div className="w-64 h-40 border-2 border-accent rounded-lg relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-accent/80 animate-[scan_2s_ease-in-out_infinite] shadow-[0_0_15px_rgba(51,133,204,0.8)]"></div>
              </div>
            </div>
            <div className="absolute bottom-4 left-0 right-0 text-center">
              <div className="inline-flex items-center gap-2 bg-black/60 text-white px-4 py-2 rounded-full text-sm backdrop-blur-md">
                <Loader2 className="h-3 w-3 animate-spin" />
                Align card within frame
              </div>
            </div>
          </div>
        )}

        {scanComplete && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-green-500/20 z-30 backdrop-blur-[2px]">
            <CheckCircle2 className="h-16 w-16 text-green-500 animate-bounce" />
            <span className="mt-4 font-headline font-bold text-green-700 bg-white/80 px-4 py-1 rounded-full text-lg">
              AUTHORIZED
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
  );
}
