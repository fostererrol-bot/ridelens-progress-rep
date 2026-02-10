import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download, Share, CheckCircle, Smartphone } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function InstallPage() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent;
    setIsIOS(/iPad|iPhone|iPod/.test(ua));

    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setIsInstalled(true);
    setDeferredPrompt(null);
  };

  if (isInstalled) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <CheckCircle className="w-16 h-16 text-primary mb-4" />
        <h1 className="text-2xl font-bold mb-2">RideLens is installed!</h1>
        <p className="text-muted-foreground">Open it from your home screen for the best experience.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 max-w-md mx-auto">
      <Smartphone className="w-16 h-16 text-primary mb-4" />
      <h1 className="text-2xl font-bold mb-2">Install RideLens</h1>
      <p className="text-muted-foreground mb-8">
        Add RideLens to your home screen for quick access, offline support, and a native app experience.
      </p>

      {deferredPrompt ? (
        <Button size="lg" onClick={handleInstall} className="gap-2">
          <Download className="w-5 h-5" />
          Install App
        </Button>
      ) : isIOS ? (
        <div className="space-y-4 text-left bg-muted/50 rounded-xl p-6">
          <p className="font-medium text-center">To install on iOS:</p>
          <ol className="space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-2">
              <span className="font-bold text-foreground">1.</span>
              Tap the <Share className="w-4 h-4 inline text-primary" /> Share button in Safari
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-foreground">2.</span>
              Scroll down and tap <strong className="text-foreground">"Add to Home Screen"</strong>
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-foreground">3.</span>
              Tap <strong className="text-foreground">"Add"</strong> to confirm
            </li>
          </ol>
        </div>
      ) : (
        <div className="space-y-4 text-left bg-muted/50 rounded-xl p-6">
          <p className="font-medium text-center">To install:</p>
          <ol className="space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-2">
              <span className="font-bold text-foreground">1.</span>
              Open the browser menu (⋮)
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-foreground">2.</span>
              Tap <strong className="text-foreground">"Install app"</strong> or <strong className="text-foreground">"Add to Home Screen"</strong>
            </li>
          </ol>
        </div>
      )}
    </div>
  );
}
