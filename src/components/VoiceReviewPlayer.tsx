import { useState, useRef, useEffect } from "react";
import { Mic, Play, Pause, Loader2, Volume2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import type { FullSnapshot } from "@/types/zwift";

interface VoiceReviewPlayerProps {
  currentSnap: FullSnapshot;
  previousSnap: FullSnapshot | null;
}

type PlayerState = "idle" | "generating" | "ready" | "playing" | "paused";

export function VoiceReviewPlayer({ currentSnap, previousSnap }: VoiceReviewPlayerProps) {
  const [playerState, setPlayerState] = useState<PlayerState>("idle");
  const [reviewText, setReviewText] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      if (progressInterval.current) clearInterval(progressInterval.current);
    };
  }, []);

  // Reset when snapshots change
  useEffect(() => {
    audioRef.current?.pause();
    audioRef.current = null;
    setPlayerState("idle");
    setReviewText(null);
    setProgress(0);
  }, [currentSnap?.snapshot?.id, previousSnap?.snapshot?.id]);

  const generateReview = async () => {
    setPlayerState("generating");
    setReviewText(null);
    setProgress(0);

    try {
      const { data, error } = await supabase.functions.invoke("ride-voice-review", {
        body: {
          currentSnap: {
            snapshot: currentSnap.snapshot,
            performance: currentSnap.performance,
            fitness: currentSnap.fitness,
            training: currentSnap.training,
            progress: currentSnap.progress,
            rideMenu: currentSnap.rideMenu,
          },
          previousSnap: previousSnap
            ? {
                snapshot: previousSnap.snapshot,
                performance: previousSnap.performance,
                fitness: previousSnap.fitness,
                training: previousSnap.training,
                progress: previousSnap.progress,
                rideMenu: previousSnap.rideMenu,
              }
            : null,
        },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      const { reviewText: text, audioBase64 } = data;
      setReviewText(text);

      // Decode base64 audio and create blob URL
      const audioBytes = Uint8Array.from(atob(audioBase64), (c) => c.charCodeAt(0));
      const blob = new Blob([audioBytes], { type: "audio/mpeg" });
      const url = URL.createObjectURL(blob);

      const audio = new Audio(url);
      audioRef.current = audio;

      audio.onended = () => {
        setPlayerState("ready");
        setProgress(0);
        if (progressInterval.current) clearInterval(progressInterval.current);
      };

      audio.onpause = () => {
        if (progressInterval.current) clearInterval(progressInterval.current);
      };

      setPlayerState("ready");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to generate voice review");
      setPlayerState("idle");
    }
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (playerState === "playing") {
      audio.pause();
      setPlayerState("paused");
    } else {
      audio.play();
      setPlayerState("playing");

      progressInterval.current = setInterval(() => {
        if (!audio.duration) return;
        setProgress((audio.currentTime / audio.duration) * 100);
      }, 100);
    }
  };

  const handleRegenerate = () => {
    audioRef.current?.pause();
    audioRef.current = null;
    setPlayerState("idle");
    setReviewText(null);
    setProgress(0);
    generateReview();
  };

  const isGenerating = playerState === "generating";
  const isPlaying = playerState === "playing";
  const hasAudio = playerState === "ready" || playerState === "playing" || playerState === "paused";

  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-3">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center w-7 h-7 rounded-full bg-primary/10">
          <Mic className="w-3.5 h-3.5 text-primary" />
        </div>
        <div>
          <p className="text-sm font-semibold leading-none">AI Voice Review</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            {previousSnap ? "Comparing latest vs previous ride" : "Review of current ride"}
          </p>
        </div>
        {hasAudio && (
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto h-7 w-7 text-muted-foreground hover:text-foreground"
            onClick={handleRegenerate}
            title="Regenerate review"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </Button>
        )}
      </div>

      {/* Player / Generate button */}
      {playerState === "idle" && (
        <Button
          onClick={generateReview}
          size="sm"
          className="w-full gap-2"
        >
          <Volume2 className="w-4 h-4" />
          Generate Voice Review
        </Button>
      )}

      {isGenerating && (
        <div className="flex items-center gap-2 justify-center py-2 text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-xs">Generating AI review…</span>
        </div>
      )}

      <AnimatePresence>
        {hasAudio && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-2"
          >
            {/* Waveform / progress bar */}
            <div
              className="relative h-1.5 rounded-full bg-muted overflow-hidden cursor-pointer"
              onClick={(e) => {
                const audio = audioRef.current;
                if (!audio?.duration) return;
                const rect = e.currentTarget.getBoundingClientRect();
                const ratio = (e.clientX - rect.left) / rect.width;
                audio.currentTime = ratio * audio.duration;
                setProgress(ratio * 100);
              }}
            >
              <motion.div
                className="absolute inset-y-0 left-0 bg-primary rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Play/Pause button */}
            <Button
              onClick={togglePlay}
              size="sm"
              variant="outline"
              className="w-full gap-2"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4" /> Pause
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" /> Play Review
                </>
              )}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Review transcript */}
      <AnimatePresence>
        {reviewText && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <p className="text-[11px] text-muted-foreground leading-relaxed italic border-t border-border pt-3">
              "{reviewText}"
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
