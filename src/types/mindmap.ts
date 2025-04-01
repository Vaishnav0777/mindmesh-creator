
export interface MindMapNode {
  id: string;
  label: string;
  color?: string;
  isRoot?: boolean;
  x?: number;
  y?: number;
}

export interface MindMapLink {
  source: string;
  target: string;
  value?: number;
}

export interface MindMapData {
  nodes: MindMapNode[];
  links: MindMapLink[];
}
