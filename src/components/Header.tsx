
import { motion } from "framer-motion";
import { Lock } from "lucide-react";

const Header = () => {
  return (
    <motion.header 
      className="py-6 px-4 w-full flex justify-center items-center"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="flex items-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="rounded-full p-2 bg-primary/10 mr-3"
        >
          <Lock className="w-5 h-5 text-primary" />
        </motion.div>
        <div>
          <motion.h1 
            className="text-2xl font-light tracking-tight"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Hidden
            <span className="font-medium text-primary ml-1">Message</span>
          </motion.h1>
          <motion.p 
            className="text-xs text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            Secure message encoding in images
          </motion.p>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
