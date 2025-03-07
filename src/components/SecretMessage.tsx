
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Check, EyeOff, Eye, Lock } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

interface SecretMessageProps {
  message: string;
  setMessage: (message: string) => void;
  mode: "encode" | "decode";
  onClear?: () => void;
  encryptionKey?: string;
  setEncryptionKey?: (key: string) => void;
  useEncryption?: boolean;
  setUseEncryption?: (use: boolean) => void;
}

const SecretMessage = ({ 
  message, 
  setMessage, 
  mode, 
  onClear,
  encryptionKey = "",
  setEncryptionKey = () => {},
  useEncryption = false,
  setUseEncryption = () => {}
}: SecretMessageProps) => {
  const [copied, setCopied] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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

  const toggleEncryption = () => {
    setUseEncryption(!useEncryption);
    if (!useEncryption) {
      toast.info("Encryption enabled. Your message will be encrypted before hiding.");
    } else {
      toast.info("Encryption disabled");
    }
  };

  return (
    <motion.div 
      className="w-full space-y-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center">
        <Label htmlFor="message" className="text-sm font-medium">
          {label}
        </Label>
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
      
      {/* Encryption Option - Only visible in encode mode */}
      {isEncode && (
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Lock className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="use-encryption" className="text-sm font-medium cursor-pointer">
                Encrypt message before hiding
              </Label>
            </div>
            <Switch 
              id="use-encryption" 
              checked={useEncryption} 
              onCheckedChange={toggleEncryption}
            />
          </div>
          
          {useEncryption && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="pt-2"
            >
              <Label htmlFor="encryption-key" className="text-sm font-medium mb-1.5 block">
                Encryption Key (Password)
              </Label>
              <div className="relative">
                <Input 
                  id="encryption-key"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter a strong password" 
                  value={encryptionKey}
                  onChange={(e) => setEncryptionKey(e.target.value)}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Remember this key! You'll need it to decode the message.
              </p>
            </motion.div>
          )}
        </div>
      )}
      
      {/* Decryption Key Input - Only visible in decode mode */}
      {mode === "decode" && useEncryption && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className="pt-2"
        >
          <Label htmlFor="decryption-key" className="text-sm font-medium mb-1.5 block">
            Decryption Key
          </Label>
          <div className="relative">
            <Input 
              id="decryption-key"
              type={showPassword ? "text" : "password"}
              placeholder="Enter the password to decrypt" 
              value={encryptionKey}
              onChange={(e) => setEncryptionKey(e.target.value)}
              className="pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full px-3"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Eye className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>
          </div>
        </motion.div>
      )}
      
      {isEncode && (
        <p className="text-xs text-muted-foreground">
          {message.length} characters • Max recommended: 1000
        </p>
      )}
    </motion.div>
  );
};

export default SecretMessage;
