
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <motion.footer 
      className="py-6 px-4 mt-10 text-center text-sm text-muted-foreground"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.5 }}
    >
      <p>Hidden Message • Steganography Tool • {new Date().getFullYear()}</p>
      <p className="mt-1 text-xs">
        Messages are encoded directly in your browser. No data is sent to any server.
      </p>
    </motion.footer>
  );
};

export default Footer;
