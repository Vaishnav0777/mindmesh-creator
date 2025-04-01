
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";

interface TextInputProps {
  onGenerate: (text: string) => void;
  isLoading: boolean;
}

const TextInput: React.FC<TextInputProps> = ({ onGenerate, isLoading }) => {
  const [text, setText] = useState<string>('');

  const handleSubmit = () => {
    if (!text.trim()) {
      toast.error("Please enter some text to generate a mind map");
      return;
    }
    
    onGenerate(text);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-mindmap-main" />
          Generate Mind Map
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder="Enter your text, notes, or concepts here..."
          className="min-h-40 p-4"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button 
          onClick={handleSubmit} 
          disabled={isLoading || !text.trim()}
          className="bg-gradient-to-r from-mindmap-main to-mindmap-secondary"
        >
          {isLoading ? "Generating..." : "Generate Mind Map"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TextInput;
