
import React, { useRef, useState } from 'react';
import Header from '@/components/Header';
import TextInput from '@/components/TextInput';
import MindMapCanvas from '@/components/MindMapCanvas';
import { MindMapData } from '@/types/mindmap';
import { generateMindMap, exportMindMap } from '@/services/mindMapService';
import { toast } from "sonner";

const Index = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [mindMapData, setMindMapData] = useState<MindMapData | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  
  const handleGenerate = async (text: string) => {
    setLoading(true);
    try {
      const data = await generateMindMap(text);
      setMindMapData(data);
      toast.success("Mind map created successfully!");
    } catch (error) {
      console.error("Error generating mind map:", error);
      toast.error("Failed to generate mind map");
    } finally {
      setLoading(false);
    }
  };
  
  const handleExport = async () => {
    if (!mindMapData) {
      toast.error("No mind map to export");
      return;
    }
    
    try {
      // Find the SVG element in the MindMapCanvas component
      const svg = document.querySelector('svg');
      if (!svg) {
        throw new Error('SVG element not found');
      }
      
      const url = await exportMindMap(svg);
      
      // Create a download link
      const link = document.createElement('a');
      link.href = url;
      link.download = 'mindmap.svg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Mind map exported successfully!");
    } catch (error) {
      console.error("Error exporting mind map:", error);
      toast.error("Failed to export mind map");
    }
  };
  
  return (
    <div className="flex flex-col h-screen">
      <Header onExport={handleExport} />
      <div className="flex flex-col md:flex-row gap-4 p-4 h-full overflow-hidden">
        <div className="w-full md:w-1/3 flex flex-col gap-4">
          <TextInput onGenerate={handleGenerate} isLoading={loading} />
          {mindMapData && (
            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-semibold mb-2">Instructions</h3>
              <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                <li>Drag nodes to rearrange the mind map</li>
                <li>Click on a node to select it</li>
                <li>Use mouse wheel to zoom in/out</li>
                <li>Click and drag the background to pan</li>
              </ul>
            </div>
          )}
        </div>
        <div className="w-full md:w-2/3 h-full min-h-[400px]">
          <MindMapCanvas data={mindMapData} />
        </div>
      </div>
    </div>
  );
};

export default Index;
