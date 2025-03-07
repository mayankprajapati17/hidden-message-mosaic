
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";

interface SecretMessageProps {
  message: string;
  setMessage: (message: string) => void;
  mode: "encode" | "decode";
  onClear?: () => void;
}

const SecretMessage = ({ message, setMessage, mode, onClear }: SecretMessageProps) => {
  const [copied, setCopied] = useState(false);
  const isEncode = mode === "encode";
  const label = isEncode ? "Secret Message" : "Decoded Message";
  const placeholder = isEncode
    ? "Enter the message you want to hide..."
    : "Decoded message will appear here...";

  useEffect(() => {
    let timer: number;
    if (copied) {
      timer = window.setTimeout(() => setCopied(false), 2000);
    }
    return () => clearTimeout(timer);
  }, [copied]);

  const handleCopy = () => {
    if (!message) return;
    
    navigator.clipboard.writeText(message)
      .then(() => {
        setCopied(true);
        toast.success("Message copied to clipboard");
      })
      .catch(err => {
        console.error("Failed to copy: ", err);
        toast.error("Failed to copy message");
      });
  };

  const handleClear = () => {
    if (onClear) {
      onClear();
    } else {
      setMessage("");
    }
    toast.info("Message cleared");
  };

  return (
    <motion.div 
      className="w-full space-y-2"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center">
        <label htmlFor="message" className="text-sm font-medium">
          {label}
        </label>
        <div className="flex space-x-2">
          {message && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="h-6 px-2"
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-green-500" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
                <span className="ml-1 text-xs">{copied ? "Copied" : "Copy"}</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClear}
                className="h-6 px-2 text-xs"
              >
                Clear
              </Button>
            </>
          )}
        </div>
      </div>
      <Textarea
        id="message"
        placeholder={placeholder}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="min-h-[100px] resize-none focus:ring-1 focus:ring-primary/30 transition-all"
        readOnly={mode === "decode" && !onClear}
      />
      {isEncode && (
        <p className="text-xs text-muted-foreground">
          {message.length} characters • Max recommended: 1000
        </p>
      )}
    </motion.div>
  );
};

export default SecretMessage;
