
import React from 'react';
import { Button } from "@/components/ui/button";
import { Download, Github, Settings } from "lucide-react";

interface HeaderProps {
  onExport: () => void;
}

const Header: React.FC<HeaderProps> = ({ onExport }) => {
  return (
    <header className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-mindmap-main to-mindmap-secondary text-transparent bg-clip-text">
            MindMesh Creator
          </h1>
          <p className="text-sm text-muted-foreground">
            AI-Powered Mind Map Generator
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onExport}
          className="flex items-center gap-1"
        >
          <Download className="w-4 h-4" />
          Export
        </Button>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <Settings className="w-4 h-4" />
          Settings
        </Button>
        <Button variant="outline" size="icon" asChild>
          <a href="https://github.com/" target="_blank" rel="noopener noreferrer">
            <Github className="w-4 h-4" />
          </a>
        </Button>
      </div>
    </header>
  );
};

export default Header;
