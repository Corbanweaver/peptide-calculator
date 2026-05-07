"use client";

import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

export function PwaRegistration() {
  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (
      process.env.NODE_ENV !== "production" ||
      !("serviceWorker" in navigator)
    ) {
      return;
    }

    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Keep registration quiet. The app should still work as a normal site.
      });
    });
  }, []);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
    };
  }, []);

  if (!installPrompt || dismissed) {
    return null;
  }

  const handleInstall = async () => {
    await installPrompt.prompt();
    const choice = await installPrompt.userChoice;

    trackEvent("pwa_install_prompt", {
      outcome: choice.outcome,
      platform: choice.platform,
    });

    setInstallPrompt(null);
  };

  return (
    <div className="fixed inset-x-3 bottom-3 z-50 mx-auto flex max-w-md items-center gap-3 rounded-2xl border border-sky-100 bg-white/95 p-3 text-sm text-slate-700 shadow-[0_18px_55px_rgba(14,165,233,0.18)] ring-1 ring-white/70 backdrop-blur">
      <div className="min-w-0 flex-1">
        <div className="font-semibold text-slate-950">Install PeptiCalc</div>
        <div className="text-xs leading-5 text-slate-500">
          Add the calculator to your home screen.
        </div>
      </div>
      <button
        type="button"
        onClick={handleInstall}
        className="inline-flex h-9 items-center gap-2 rounded-full bg-slate-950 px-3 text-xs font-semibold text-white"
      >
        <Download size={14} aria-hidden="true" />
        Install
      </button>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        className="grid h-9 w-9 place-items-center rounded-full bg-slate-50 text-slate-500 ring-1 ring-slate-100"
        aria-label="Dismiss install prompt"
      >
        <X size={14} aria-hidden="true" />
      </button>
    </div>
  );
}
