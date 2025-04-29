
import { useState, useRef, ChangeEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import ImagePreview from "./ImagePreview";
import SecretMessage from "./SecretMessage";
import {
  Upload,
  Download,
  Lock,
  Unlock,
  Image as ImageIcon,
  ArrowRight,
  Copy,
} from "lucide-react";
import { loadImageFromFile } from "@/lib/steganography";
import { steganographyApi } from "@/lib/api-service";

const SteganoForm = () => {
  const [activeTab, setActiveTab] = useState<"encode" | "decode">("encode");
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [decodedMessage, setDecodedMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await processImageFile(files[0]);
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      await processImageFile(files[0]);
    }
  };

  const processImageFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    try {
      const image = await loadImageFromFile(file);
      setOriginalImage(image);
      setProcessedImage(null);
      
      if (activeTab === "decode") {
        // Automatically try to decode when in decode mode
        handleDecode(image);
      } else {
        toast.success("Image loaded successfully");
      }
    } catch (error) {
      console.error("Error loading image:", error);
      toast.error("Failed to load image");
    }
  };

  const handleClickUpload = () => {
    fileInputRef.current?.click();
  };

  const handleEncode = async () => {
    if (!originalImage) {
      toast.error("Please upload an image first");
      return;
    }

    if (!message.trim()) {
      toast.error("Please enter a message to hide");
      return;
    }

    setIsProcessing(true);
    
    try {
      // Call the API service to encode the message
      const response = await steganographyApi.encodeImage({
        image: originalImage,
        message: message
      });
      
      if (response.success && response.data) {
        setProcessedImage(response.data);
        toast.success("Message encoded successfully");
      } else {
        toast.error(response.error || "Failed to encode message");
      }
    } catch (error: any) {
      console.error("Error encoding message:", error);
      toast.error(error.message || "Failed to encode message");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDecode = async (img?: HTMLImageElement) => {
    const imageToUse = img || originalImage;
    
    if (!imageToUse) {
      toast.error("Please upload an image first");
      return;
    }

    setIsProcessing(true);
    
    try {
      // Call the API service to decode the message
      const response = await steganographyApi.decodeImage({
        image: imageToUse
      });
      
      if (response.success && response.data) {
        setDecodedMessage(response.data);
        toast.success("Message decoded successfully");
      } else {
        setDecodedMessage("");
        toast.error(response.error || "No hidden message found in this image");
      }
    } catch (error: any) {
      console.error("Error decoding message:", error);
      toast.error("Failed to decode message");
      setDecodedMessage("");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!processedImage) return;
    
    // Create a link element
    const link = document.createElement("a");
    link.href = processedImage;
    link.download = "hidden-message.png"; // Force PNG format for lossless compression
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Image downloaded as PNG for best compatibility");
  };

  const handleCopyToClipboard = () => {
    if (!decodedMessage) return;
    
    navigator.clipboard.writeText(decodedMessage)
      .then(() => toast.success("Message copied to clipboard"))
      .catch(() => toast.error("Failed to copy message"));
  };

  const handleTabChange = (value: string) => {
    setProcessedImage(null);
    setDecodedMessage("");
    setActiveTab(value as "encode" | "decode");
  };

  const resetForm = () => {
    setOriginalImage(null);
    setProcessedImage(null);
    setMessage("");
    setDecodedMessage("");
  };

  return (
    <div className="w-full max-w-3xl">
      <Tabs 
        defaultValue="encode" 
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="encode" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            <span>Encode</span>
          </TabsTrigger>
          <TabsTrigger value="decode" className="flex items-center gap-2">
            <Unlock className="h-4 w-4" />
            <span>Decode</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="encode" className="space-y-6 mt-2">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Image Upload Area */}
            <div 
              className={`
                border-2 border-dashed rounded-xl p-6 transition-all
                ${dragActive ? "border-primary bg-primary/5" : "border-border"} 
                ${originalImage ? "border-green-400/50" : ""}
              `}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              
              <div className="flex flex-col items-center justify-center space-y-4">
                {!originalImage ? (
                  <>
                    <div className="rounded-full bg-primary/10 p-3">
                      <ImageIcon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium">Drag & drop an image here</p>
                      <p className="text-xs text-muted-foreground">
                        or <button onClick={handleClickUpload} className="text-primary hover:underline">browse</button> to upload
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Supports: PNG, JPG, GIF, WEBP (PNG recommended for best results)
                    </p>
                  </>
                ) : (
                  <>
                    <ImagePreview 
                      imageUrl={originalImage ? originalImage.src : null} 
                      altText="Original image"
                      className="w-full"
                    />
                    <div className="flex justify-center space-x-2 w-full">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleClickUpload}
                        className="text-xs"
                      >
                        <Upload className="h-3.5 w-3.5 mr-1" />
                        Change Image
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            {/* Message Input */}
            {originalImage && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.3 }}
              >
                <SecretMessage 
                  message={message} 
                  setMessage={setMessage} 
                  mode="encode"
                />
              </motion.div>
            )}
            
            {/* Actions */}
            {originalImage && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="flex flex-col space-y-4"
              >
                <Button
                  onClick={handleEncode}
                  disabled={isProcessing || !message.trim()}
                  className="w-full"
                >
                  {isProcessing ? (
                    <div className="flex items-center">
                      <div className="h-4 w-4 rounded-full border-2 border-white border-r-transparent animate-spin mr-2" />
                      Processing...
                    </div>
                  ) : (
                    <>
                      <Lock className="h-4 w-4 mr-2" />
                      Encode Message
                    </>
                  )}
                </Button>
                
                {/* Result section */}
                <AnimatePresence>
                  {processedImage && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4 mt-4"
                    >
                      <Separator />
                      <div>
                        <Label className="text-sm font-medium">Encoded Image</Label>
                        <p className="text-xs text-muted-foreground mb-2">Download this image and share it with someone who has this app</p>
                        <ImagePreview 
                          imageUrl={processedImage} 
                          altText="Encoded image"
                          className="mt-2 border border-green-200/50"
                        />
                      </div>
                      
                      <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        <Button 
                          onClick={handleDownload} 
                          variant="outline"
                          className="w-full"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download Encoded Image (PNG)
                        </Button>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </motion.div>
        </TabsContent>

        <TabsContent value="decode" className="space-y-6 mt-2">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Image Upload Area */}
            <div 
              className={`
                border-2 border-dashed rounded-xl p-6 transition-all
                ${dragActive ? "border-primary bg-primary/5" : "border-border"} 
                ${originalImage ? "border-green-400/50" : ""}
              `}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              
              <div className="flex flex-col items-center justify-center space-y-4">
                {!originalImage ? (
                  <>
                    <div className="rounded-full bg-primary/10 p-3">
                      <ImageIcon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium">Drag & drop an image to decode</p>
                      <p className="text-xs text-muted-foreground">
                        or <button onClick={handleClickUpload} className="text-primary hover:underline">browse</button> to upload
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      For best results, use images encoded with this app
                    </p>
                  </>
                ) : (
                  <>
                    <ImagePreview 
                      imageUrl={originalImage ? originalImage.src : null} 
                      altText="Image to decode"
                      className="w-full"
                    />
                    <div className="flex justify-center space-x-2 w-full">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleClickUpload}
                        className="text-xs"
                      >
                        <Upload className="h-3.5 w-3.5 mr-1" />
                        Change Image
                      </Button>
                      <Button 
                        variant="default" 
                        size="sm" 
                        onClick={() => handleDecode()}
                        disabled={isProcessing}
                        className="text-xs"
                      >
                        {isProcessing ? 
                          <div className="h-3.5 w-3.5 rounded-full border-2 border-white border-r-transparent animate-spin mr-1" /> :
                          <Unlock className="h-3.5 w-3.5 mr-1" />
                        }
                        Decode
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            {/* Decoded Message */}
            <AnimatePresence>
              {originalImage && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <SecretMessage 
                    message={decodedMessage} 
                    setMessage={setDecodedMessage} 
                    mode="decode"
                  />
                  
                  {decodedMessage && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopyToClipboard}
                      className="w-full"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy to Clipboard
                    </Button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SteganoForm;
