
import { motion } from "framer-motion";
import Header from "@/components/Header";
import SteganoForm from "@/components/SteganoForm";
import Footer from "@/components/Footer";
import { MoonIcon, SunIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

const Index = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-secondary/20 dark:from-background dark:to-background">
      <Header />
      
      <main className="flex-1 w-full max-w-screen-xl px-4 py-6 mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          {/* Theme Toggle */}
          <div className="absolute right-4 top-4 z-10">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-full"
            >
              <SunIcon className="h-5 w-5 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
              <MoonIcon className="absolute h-5 w-5 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>

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
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
