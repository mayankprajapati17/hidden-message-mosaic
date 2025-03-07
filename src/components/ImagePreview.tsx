
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Image as ImageIcon } from "lucide-react";

interface ImagePreviewProps {
  imageUrl: string | null;
  altText?: string;
  className?: string;
}

const ImagePreview = ({ imageUrl, altText = "Preview image", className = "" }: ImagePreviewProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    setIsLoaded(false);
    setError(false);
  }, [imageUrl]);

  return (
    <div className={`relative overflow-hidden rounded-xl ${className}`}>
      <AnimatePresence mode="wait">
        {!imageUrl && (
          <motion.div
            key="placeholder"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center bg-secondary/50 w-full h-[300px] rounded-xl"
          >
            <ImageIcon className="h-16 w-16 text-muted-foreground/40" />
            <p className="text-muted-foreground mt-4 text-sm">No image selected</p>
          </motion.div>
        )}

        {imageUrl && !isLoaded && !error && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-secondary/50"
          >
            <div className="h-8 w-8 rounded-full border-2 border-primary border-r-transparent animate-spin" />
          </motion.div>
        )}

        {imageUrl && (
          <motion.div
            key="image"
            initial={{ opacity: 0 }}
            animate={{ opacity: isLoaded ? 1 : 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full aspect-auto"
          >
            <img
              src={imageUrl}
              alt={altText}
              className={`w-full h-auto max-h-[300px] object-contain rounded-xl ${
                isLoaded ? "" : "blur-up"
              }`}
              onLoad={() => setIsLoaded(true)}
              onError={() => setError(true)}
            />
          </motion.div>
        )}

        {error && (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center bg-destructive/10 w-full h-[300px] rounded-xl"
          >
            <ImageIcon className="h-16 w-16 text-destructive/40" />
            <p className="text-destructive mt-4 text-sm">Failed to load image</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ImagePreview;
