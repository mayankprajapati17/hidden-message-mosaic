
// Simple steganography implementation for hiding messages in images

// Function to encode a message into an image
export const encodeMessage = (
  imageData: ImageData,
  message: string
): ImageData => {
  // Convert the message to a binary string including a terminator
  const binaryMessage = textToBinary(message) + "00000000"; // Add null terminator
  
  // Create a copy of the image data to modify
  const encodedData = new Uint8ClampedArray(imageData.data);
  
  // Check if message is too long for the image
  if (binaryMessage.length > encodedData.length / 4) {
    throw new Error("Message is too large for this image");
  }

  let messageIndex = 0;
  
  // Encode each bit of the message into the LSB of the image data
  for (let i = 0; i < encodedData.length; i += 4) {
    if (messageIndex < binaryMessage.length) {
      // Modify only the blue channel for minimal visual change
      encodedData[i + 2] = (encodedData[i + 2] & 0xFE) | parseInt(binaryMessage[messageIndex], 2);
      messageIndex++;
    } else {
      break;
    }
  }

  // Add a signature to mark this as an encoded image (in metadata bits)
  // Use the first few pixels to store a simple signature
  const signature = "STEG"; // Simple signature
  for (let i = 0; i < signature.length; i++) {
    const charCode = signature.charCodeAt(i);
    // Store in alpha channel of initial pixels (unlikely to be visible)
    encodedData[i * 4 + 3] = (encodedData[i * 4 + 3] & 0xF0) | (charCode & 0x0F);
  }

  // Return a new ImageData object with the encoded message
  return new ImageData(encodedData, imageData.width, imageData.height);
};

// Function to check if an image has our steganography signature
export const hasEncodedMessage = (imageData: ImageData): boolean => {
  const data = imageData.data;
  const signature = "STEG";
  
  // Check for our signature in the first few pixels
  for (let i = 0; i < signature.length; i++) {
    const charCode = signature.charCodeAt(i);
    const storedValue = data[i * 4 + 3] & 0x0F;
    
    if (storedValue !== (charCode & 0x0F)) {
      return false;
    }
  }
  
  return true;
};

// Function to decode a message from an image
export const decodeMessage = (imageData: ImageData): string => {
  const data = imageData.data;
  
  // First check if this image has our signature
  if (!hasEncodedMessage(imageData)) {
    throw new Error("This image doesn't appear to contain an encoded message");
  }
  
  let binaryMessage = "";
  let byteBuffer = "";
  let nullCount = 0;
  
  // Extract the LSB from each byte of the image data (blue channel)
  for (let i = 0; i < data.length; i += 4) {
    const bit = data[i + 2] & 1; // Extract LSB from blue channel
    byteBuffer += bit;
    
    // Process each byte (8 bits)
    if (byteBuffer.length === 8) {
      // Check for null terminator (all zeros)
      if (byteBuffer === "00000000") {
        nullCount++;
        // Found the end of the message
        if (nullCount === 1) break;
      } else {
        nullCount = 0;
      }
      
      binaryMessage += byteBuffer;
      byteBuffer = "";
    }
  }

  // Convert binary message back to text
  return binaryToText(binaryMessage);
};

// Helper function to convert text to binary
const textToBinary = (text: string): string => {
  let binary = "";
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i);
    const byte = charCode.toString(2).padStart(8, "0");
    binary += byte;
  }
  return binary;
};

// Helper function to convert binary to text
const binaryToText = (binary: string): string => {
  let text = "";
  for (let i = 0; i < binary.length; i += 8) {
    const byte = binary.substring(i, i + 8);
    if (byte === "00000000") break; // Stop at null terminator
    const charCode = parseInt(byte, 2);
    text += String.fromCharCode(charCode);
  }
  return text;
};

// Function to create an ImageData object from an image element
export const imageToImageData = (
  image: HTMLImageElement,
  maxWidth: number = 800
): ImageData => {
  // Create a canvas to draw the image
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  
  if (!ctx) {
    throw new Error("Could not create canvas context");
  }
  
  // Calculate new dimensions to maintain aspect ratio but limit width
  let width = image.width;
  let height = image.height;
  
  if (width > maxWidth) {
    const ratio = maxWidth / width;
    width = maxWidth;
    height = Math.floor(height * ratio);
  }
  
  // Set canvas size and draw image
  canvas.width = width;
  canvas.height = height;
  ctx.drawImage(image, 0, 0, width, height);
  
  // Get image data
  return ctx.getImageData(0, 0, width, height);
};

// Function to create an image URL from ImageData
export const imageDataToURL = (imageData: ImageData): string => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  
  if (!ctx) {
    throw new Error("Could not create canvas context");
  }
  
  // Set canvas size and put image data
  canvas.width = imageData.width;
  canvas.height = imageData.height;
  ctx.putImageData(imageData, 0, 0);
  
  // Get data URL - use PNG format for lossless compression to preserve encoded data
  return canvas.toDataURL("image/png");
};

// Function to load an image from a file
export const loadImageFromFile = (file: File): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      const image = new Image();
      
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error("Failed to load image"));
      
      if (event.target?.result) {
        image.src = event.target.result as string;
      } else {
        reject(new Error("Failed to read file"));
      }
    };
    
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
};
