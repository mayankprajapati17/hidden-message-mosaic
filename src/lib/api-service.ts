
import {
  encodeMessage,
  decodeMessage,
  imageToImageData,
  imageDataToURL,
  hasEncodedMessage
} from "./steganography";

// Define interface for API responses
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Define interface for encoding request
export interface EncodeRequest {
  image: HTMLImageElement;
  message: string;
}

// Define interface for decoding request
export interface DecodeRequest {
  image: HTMLImageElement;
}

/**
 * Steganography API service
 * This service provides an API-like interface for steganography operations
 * that could be replaced with actual HTTP requests in the future
 */
export const steganographyApi = {
  /**
   * Encode a message into an image
   * @param request - The encode request containing image and message
   * @returns A promise that resolves to an API response with the encoded image URL
   */
  encodeImage: async (
    request: EncodeRequest
  ): Promise<ApiResponse<string>> => {
    try {
      console.log("API: Encoding message into image");
      
      // Process the image and encode the message
      const imageData = imageToImageData(request.image);
      const encodedImageData = encodeMessage(imageData, request.message);
      
      // Always use PNG for best cross-device compatibility (lossless format)
      const encodedImageUrl = imageDataToURL(encodedImageData);
      
      return {
        success: true,
        data: encodedImageUrl,
      };
    } catch (error: any) {
      console.error("API Error - Encode:", error);
      return {
        success: false,
        error: error.message || "Failed to encode message",
      };
    }
  },

  /**
   * Decode a message from an image
   * @param request - The decode request containing the image
   * @returns A promise that resolves to an API response with the decoded message
   */
  decodeImage: async (
    request: DecodeRequest
  ): Promise<ApiResponse<string>> => {
    try {
      console.log("API: Decoding message from image");
      
      // Process the image
      const imageData = imageToImageData(request.image);
      
      // Check if the image has an encoded message before attempting to decode
      if (!hasEncodedMessage(imageData)) {
        return {
          success: false,
          error: "This image doesn't appear to contain a hidden message. Please try with an image that has been encoded using this tool.",
        };
      }
      
      // Proceed with decoding
      const extractedMessage = decodeMessage(imageData);
      
      if (!extractedMessage) {
        return {
          success: false,
          error: "No hidden message found in this image",
        };
      }
      
      return {
        success: true,
        data: extractedMessage,
      };
    } catch (error: any) {
      console.error("API Error - Decode:", error);
      return {
        success: false,
        error: error.message || "Failed to decode message",
      };
    }
  },
};
