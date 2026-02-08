import { useState } from "react";
import { ImageIcon, Maximize2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SnapshotThumbnailProps {
  imageUrl: string | null;
}

export function SnapshotThumbnail({ imageUrl }: SnapshotThumbnailProps) {
  const [expanded, setExpanded] = useState(false);

  if (!imageUrl) {
    return (
      <div className="rounded-lg border border-border bg-card/50 flex items-center justify-center h-24 w-36 shrink-0">
        <div className="flex flex-col items-center gap-1 text-muted-foreground">
          <ImageIcon className="w-5 h-5" />
          <span className="text-[10px]">No image</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <motion.button
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative group rounded-lg border border-border overflow-hidden h-24 w-36 shrink-0 cursor-pointer hover:border-primary/50 transition-colors"
        onClick={() => setExpanded(true)}
        aria-label="View full screenshot"
      >
        <img
          src={imageUrl}
          alt="Original Zwift screenshot"
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Maximize2 className="w-4 h-4 text-foreground" />
        </div>
      </motion.button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
            onClick={() => setExpanded(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-4xl max-h-[90vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setExpanded(false)}
                className="absolute -top-3 -right-3 z-10 rounded-full bg-card border border-border p-1.5 hover:bg-accent transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
              <img
                src={imageUrl}
                alt="Original Zwift screenshot"
                className="w-full h-full object-contain rounded-lg border border-border"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
