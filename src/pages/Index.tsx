
import { motion } from "framer-motion";
import Header from "@/components/Header";
import SteganoForm from "@/components/SteganoForm";
import Footer from "@/components/Footer";
import { ThemeToggle } from "@/components/ThemeToggle";

const Index = () => {
  return (
    <motion.div 
      className="min-h-screen flex flex-col items-center bg-gradient-to-b from-background to-primary/5 dark:from-background dark:to-primary/10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      
      <Header />
      
      <main className="flex-1 w-full max-w-screen-xl px-4 py-6 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="text-center mb-10 max-w-2xl"
        >
          <h2 className="text-3xl font-light tracking-tight mb-2">
            Hide your messages in plain sight
          </h2>
          <p className="text-muted-foreground">
            Use steganography to conceal secret messages within ordinary images.
            Only those who know can extract the hidden information.
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="w-full"
        >
          <div className="glass-card rounded-xl shadow-lg mx-auto">
            <SteganoForm />
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-16 max-w-2xl text-center space-y-6"
        >
          <h3 className="text-xl font-medium">How it works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 rounded-lg bg-card/80 shadow-sm">
              <div className="bg-primary/10 rounded-full h-10 w-10 flex items-center justify-center mx-auto mb-4">
                <span className="text-primary font-medium">1</span>
              </div>
              <h4 className="font-medium mb-2">Upload</h4>
              <p className="text-sm text-muted-foreground">
                Upload any image that will serve as the carrier for your message
              </p>
            </div>
            
            <div className="p-4 rounded-lg bg-card/80 shadow-sm">
              <div className="bg-primary/10 rounded-full h-10 w-10 flex items-center justify-center mx-auto mb-4">
                <span className="text-primary font-medium">2</span>
              </div>
              <h4 className="font-medium mb-2">Encode</h4>
              <p className="text-sm text-muted-foreground">
                Enter your secret message and encode it into the image
              </p>
            </div>
            
            <div className="p-4 rounded-lg bg-card/80 shadow-sm">
              <div className="bg-primary/10 rounded-full h-10 w-10 flex items-center justify-center mx-auto mb-4">
                <span className="text-primary font-medium">3</span>
              </div>
              <h4 className="font-medium mb-2">Share</h4>
              <p className="text-sm text-muted-foreground">
                Download and share the image. Only those who know can extract the message
              </p>
            </div>
          </div>
        </motion.div>
      </main>
      
      <Footer />
    </motion.div>
  );
};

export default Index;
