
import { motion } from "framer-motion";
import AppLayout from "@/components/AppLayout";
import SteganoForm from "@/components/SteganoForm";

const Index = () => {
  return (
    <AppLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="text-center mb-10 max-w-2xl mx-auto"
        >
          <h2 className="text-4xl font-bold tracking-tight mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Secure Message Steganography
          </h2>
          <p className="text-muted-foreground text-lg">
            Hide your messages within images using advanced steganography. 
            Your secrets remain invisible to the naked eye.
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="w-full"
        >
          <div className="glass-card dark:bg-card/30 rounded-xl shadow-lg mx-auto backdrop-blur-sm">
            <SteganoForm />
          </div>
        </motion.div>
      </motion.div>
    </AppLayout>
  );
};

export default Index;
