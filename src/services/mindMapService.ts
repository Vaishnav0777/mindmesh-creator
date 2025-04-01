
import { MindMapData } from '@/types/mindmap';

// Simple helper to generate unique IDs
const generateId = (): string => Math.random().toString(36).substr(2, 9);

// This is a mock service that would be replaced with a real AI service in production
export const generateMindMap = async (text: string): Promise<MindMapData> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Basic processing: split by paragraphs and periods
  const paragraphs = text.split(/\n+/).filter(p => p.trim().length > 0);
  
  // If no clear paragraphs, split by periods
  let topics = paragraphs.length > 1 
    ? paragraphs.map(p => p.trim())
    : text.split(/\.|\!|\?/).filter(s => s.trim().length > 0).map(s => s.trim());
  
  // Ensure we don't have too many nodes
  if (topics.length > 12) {
    topics = topics.slice(0, 12);
  } else if (topics.length < 3) {
    // Add some dummy subtopics if input is too short
    const words = text.split(/\s+/).filter(w => w.length > 3);
    while (topics.length < 3 && words.length > 0) {
      topics.push(words.splice(0, 1)[0]);
    }
  }
  
  // Create main topic (root node)
  const rootId = generateId();
  let mainTopic = text.split(/\s+/).slice(0, 5).join(' ');
  if (mainTopic.length > 30) {
    mainTopic = mainTopic.substring(0, 30) + '...';
  }
  
  // Create nodes
  const nodes = [
    {
      id: rootId,
      label: mainTopic,
      isRoot: true
    }
  ];
  
  // Create links
  const links: { source: string; target: string }[] = [];
  
  // Process each topic and create subtopics
  topics.forEach((topic) => {
    if (topic.length < 3) return; // Skip very short topics
    
    // Truncate long topics
    const topicLabel = topic.length > 40 ? topic.substring(0, 40) + '...' : topic;
    
    // Create topic node
    const topicId = generateId();
    nodes.push({
      id: topicId,
      label: topicLabel
    });
    
    // Link to root
    links.push({
      source: rootId,
      target: topicId
    });
    
    // 50% chance to create a subtopic
    if (Math.random() > 0.5 && topic.length > 10) {
      const words = topic.split(/\s+/).filter(w => w.length > 3);
      if (words.length > 3) {
        const subtopicLabel = words.slice(-3).join(' ');
        const subtopicId = generateId();
        
        nodes.push({
          id: subtopicId,
          label: subtopicLabel
        });
        
        links.push({
          source: topicId,
          target: subtopicId
        });
      }
    }
  });
  
  // Add some random cross-connections (not from/to root)
  const nonRootNodes = nodes.filter(n => !n.isRoot);
  if (nonRootNodes.length > 3) {
    for (let i = 0; i < Math.min(3, Math.floor(nonRootNodes.length / 2)); i++) {
      const randomSource = nonRootNodes[Math.floor(Math.random() * nonRootNodes.length)].id;
      const randomTarget = nonRootNodes[Math.floor(Math.random() * nonRootNodes.length)].id;
      
      // Avoid self-links and duplicates
      if (randomSource !== randomTarget && 
          !links.some(l => 
            (l.source === randomSource && l.target === randomTarget) || 
            (l.source === randomTarget && l.target === randomSource)
          )) {
        links.push({
          source: randomSource,
          target: randomTarget
        });
      }
    }
  }
  
  // Assign some colors to nodes
  const colors = [
    '#0EA5E9', // Blue
    '#8B5CF6', // Purple
    '#F97316', // Orange
    '#10B981', // Green
    '#EC4899'  // Pink
  ];
  
  nodes.forEach((node, index) => {
    if (!node.isRoot) {
      node.color = colors[index % colors.length];
    }
  });
  
  return { nodes, links };
};

// Function to export mind map as image
export const exportMindMap = (svgElement: SVGSVGElement | null): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!svgElement) {
      reject(new Error('SVG element not found'));
      return;
    }
    
    try {
      // Create a copy of the SVG
      const svgCopy = svgElement.cloneNode(true) as SVGSVGElement;
      
      // Set proper dimensions
      svgCopy.setAttribute('width', svgElement.clientWidth.toString());
      svgCopy.setAttribute('height', svgElement.clientHeight.toString());
      
      // Convert to string
      const svgString = new XMLSerializer().serializeToString(svgCopy);
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml' });
      
      resolve(URL.createObjectURL(svgBlob));
    } catch (error) {
      reject(error);
    }
  });
};
