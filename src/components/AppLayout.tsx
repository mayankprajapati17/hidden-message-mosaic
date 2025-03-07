
import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { MoonIcon, SunIcon, Lock, Unlock, Settings, Info, Image as ImageIcon } from "lucide-react";
import Footer from "@/components/Footer";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gradient-to-br from-background to-secondary/20 dark:from-background dark:to-background/80">
      {/* Sidebar */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="lg:w-64 lg:min-h-screen glass-card dark:bg-card/30 lg:rounded-r-2xl flex flex-col"
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-border/20">
          <div className="flex items-center">
            <div className="rounded-full p-2 bg-primary/10 mr-3">
              <Lock className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-light tracking-tight">
                Hidden<span className="font-medium text-primary ml-1">Message</span>
              </h1>
              <p className="text-xs text-muted-foreground">
                Secure steganography platform
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar Menu */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <TooltipProvider>
              <li>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-left font-normal bg-primary/5"
                    >
                      <Lock className="mr-2 h-4 w-4" />
                      <span>Encode Message</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Hide messages in images</p>
                  </TooltipContent>
                </Tooltip>
              </li>
              
              <li>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-left font-normal"
                    >
                      <Unlock className="mr-2 h-4 w-4" />
                      <span>Decode Message</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Extract hidden messages</p>
                  </TooltipContent>
                </Tooltip>
              </li>
              
              <li>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-left font-normal"
                    >
                      <ImageIcon className="mr-2 h-4 w-4" />
                      <span>My Images</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>View your encoded images</p>
                  </TooltipContent>
                </Tooltip>
              </li>
              
              <li>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-left font-normal"
                    >
                      <Info className="mr-2 h-4 w-4" />
                      <span>About Steganography</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Learn how it works</p>
                  </TooltipContent>
                </Tooltip>
              </li>
              
              <li>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-left font-normal"
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Configure application settings</p>
                  </TooltipContent>
                </Tooltip>
              </li>
            </TooltipProvider>
          </ul>
        </nav>

        {/* Theme Toggle in Sidebar Footer */}
        <div className="p-4 border-t border-border/20">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
              <>
                <SunIcon className="h-4 w-4 mr-2" />
                <span>Light Mode</span>
              </>
            ) : (
              <>
                <MoonIcon className="h-4 w-4 mr-2" />
                <span>Dark Mode</span>
              </>
            )}
          </Button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <main className="flex-1 w-full max-w-screen-xl px-4 py-6 mx-auto">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default AppLayout;
