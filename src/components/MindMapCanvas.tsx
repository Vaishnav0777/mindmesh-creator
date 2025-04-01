
import React, { useEffect, useRef, useState } from 'react';
import { Card } from "@/components/ui/card";
import * as d3 from 'd3';
import { MindMapNode, MindMapLink } from '@/types/mindmap';
import { toast } from "sonner";

interface MindMapCanvasProps {
  data: {
    nodes: MindMapNode[];
    links: MindMapLink[];
  } | null;
}

const MindMapCanvas: React.FC<MindMapCanvasProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [transform, setTransform] = useState<d3.ZoomTransform | null>(null);

  useEffect(() => {
    if (!data || !svgRef.current) return;
    
    const svg = d3.select(svgRef.current);
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;
    
    // Clear previous content
    svg.selectAll("*").remove();
    
    // Create zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on("zoom", (event) => {
        g.attr("transform", event.transform.toString());
        setTransform(event.transform);
      });
    
    svg.call(zoom);
    
    // Reset zoom if needed
    if (!transform) {
      svg.call(zoom.transform, d3.zoomIdentity.translate(width / 2, height / 2).scale(0.8));
    }
    
    // Create the main group element that will contain all nodes and links
    const g = svg.append("g");
    
    // Create the simulation
    const simulation = d3.forceSimulation(data.nodes)
      .force("link", d3.forceLink(data.links).id((d: any) => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-500))
      .force("center", d3.forceCenter(0, 0))
      .force("collide", d3.forceCollide().radius(60));
    
    // Create the links
    const links = g.append("g")
      .selectAll("line")
      .data(data.links)
      .enter()
      .append("line")
      .attr("class", "mindmap-connection")
      .attr("marker-end", "url(#arrow)");
    
    // Create nodes
    const nodes = g.append("g")
      .selectAll(".node")
      .data(data.nodes)
      .enter()
      .append("g")
      .attr("class", "node")
      .call(d3.drag<SVGGElement, MindMapNode>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));
    
    // Add rectangle to each node
    nodes.append("foreignObject")
      .attr("width", (d) => Math.max(100, d.label.length * 8 + 20))
      .attr("height", 50)
      .attr("x", (d) => -(Math.max(100, d.label.length * 8 + 20)) / 2)
      .attr("y", -25)
      .append("xhtml:div")
      .attr("class", (d) => `mindmap-node ${selectedNode === d.id ? 'mindmap-node-selected' : ''}`)
      .style("width", "100%")
      .style("height", "100%")
      .style("display", "flex")
      .style("align-items", "center")
      .style("justify-content", "center")
      .style("overflow", "hidden")
      .style("text-overflow", "ellipsis")
      .style("text-align", "center")
      .style("font-weight", (d) => d.isRoot ? "bold" : "normal")
      .style("background-color", (d) => d.color || (d.isRoot ? "#0EA5E9" : "#FFFFFF"))
      .style("color", (d) => d.isRoot ? "#FFFFFF" : "#333333")
      .html((d) => d.label)
      .on("click", (event, d) => {
        event.stopPropagation();
        setSelectedNode(d.id);
        toast(`Selected: ${d.label}`);
      });
      
    // Add tick event
    simulation.on("tick", () => {
      links
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      nodes.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });
    
    // Drag functions
    function dragstarted(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }
    
    function dragged(event: any, d: any) {
      d.fx = event.x;
      d.fy = event.y;
    }
    
    function dragended(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
    
    // Clear selection when clicking outside nodes
    svg.on("click", () => {
      setSelectedNode(null);
    });
    
    return () => {
      simulation.stop();
    };
  }, [data, selectedNode, transform]);

  if (!data) {
    return (
      <Card className="w-full h-full flex items-center justify-center bg-muted/30 border-dashed">
        <p className="text-muted-foreground">
          Enter text and press generate to create a mind map
        </p>
      </Card>
    );
  }

  return (
    <Card className="w-full h-full overflow-hidden p-0">
      <svg
        ref={svgRef}
        className="w-full h-full"
        style={{ cursor: 'grab' }}
      />
    </Card>
  );
};

export default MindMapCanvas;
