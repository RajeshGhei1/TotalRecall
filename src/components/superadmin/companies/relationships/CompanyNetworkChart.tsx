
import React, { useCallback, useMemo } from 'react';
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  MiniMap,
  ReactFlowProvider,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building, Target, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { useCompanyNetwork } from '@/hooks/useCompanyRelationships';

interface CompanyNodeData {
  label: string;
  company: any;
  isRoot: boolean;
}

interface RelationshipEdgeData {
  relationship: any;
  label: string;
  percentage?: number;
}

const CompanyNode = ({ data }: { data: CompanyNodeData }) => {
  return (
    <div className={`px-4 py-2 shadow-md rounded-md border-2 min-w-[150px] ${
      data.isRoot 
        ? 'bg-blue-100 border-blue-500' 
        : 'bg-white border-gray-300 hover:border-gray-400'
    }`}>
      <div className="flex items-center gap-2">
        <Building className="h-4 w-4 text-gray-600" />
        <div className="font-semibold text-sm">{data.label}</div>
      </div>
      {data.company?.industry && (
        <div className="text-xs text-gray-500 mt-1">{data.company.industry}</div>
      )}
      {data.isRoot && (
        <Badge variant="secondary" className="mt-1 text-xs">
          <Target className="h-3 w-3 mr-1" />
          Focus
        </Badge>
      )}
    </div>
  );
};

const RelationshipEdge = ({ data }: { data: RelationshipEdgeData }) => {
  return (
    <div className="bg-white px-2 py-1 rounded shadow-sm border text-xs">
      <div className="font-medium">{data.label}</div>
      {data.percentage && (
        <div className="text-gray-500">{data.percentage}%</div>
      )}
    </div>
  );
};

const nodeTypes = {
  companyNode: CompanyNode,
};

const edgeTypes = {
  relationshipEdge: RelationshipEdge,
};

interface CompanyNetworkChartProps {
  companyId: string;
  depth?: number;
  height?: string;
}

const CompanyNetworkChart: React.FC<CompanyNetworkChartProps> = ({ 
  companyId, 
  depth = 2,
  height = "500px" 
}) => {
  const { data: networkData, isLoading, error } = useCompanyNetwork(companyId, depth);
  
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Auto-layout nodes in a hierarchical structure
  const layoutNodes = useCallback((nodes: Node[]) => {
    const rootNode = nodes.find(n => n.data.isRoot);
    if (!rootNode) return nodes;

    // Simple hierarchical layout
    const positioned = [...nodes];
    const rootIndex = positioned.findIndex(n => n.id === rootNode.id);
    
    // Position root node at center
    positioned[rootIndex] = {
      ...rootNode,
      position: { x: 400, y: 200 }
    };

    // Position other nodes in a circle around root
    const otherNodes = positioned.filter(n => n.id !== rootNode.id);
    const angleStep = (2 * Math.PI) / Math.max(otherNodes.length, 1);
    const radius = 200;

    otherNodes.forEach((node, index) => {
      const angle = index * angleStep;
      const x = 400 + radius * Math.cos(angle);
      const y = 200 + radius * Math.sin(angle);
      
      const nodeIndex = positioned.findIndex(n => n.id === node.id);
      positioned[nodeIndex] = {
        ...node,
        position: { x, y }
      };
    });

    return positioned;
  }, []);

  // Update nodes and edges when data changes
  React.useEffect(() => {
    if (networkData) {
      const layoutedNodes = layoutNodes(networkData.nodes);
      setNodes(layoutedNodes);
      setEdges(networkData.edges);
    }
  }, [networkData, layoutNodes, setNodes, setEdges]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const resetView = useCallback(() => {
    if (networkData) {
      const layoutedNodes = layoutNodes(networkData.nodes);
      setNodes(layoutedNodes);
    }
  }, [networkData, layoutNodes, setNodes]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Company Network</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-2 text-sm text-gray-500">Loading network...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !networkData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Company Network</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No network data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Company Relationship Network</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={resetView}>
              <RotateCcw className="h-4 w-4 mr-1" />
              Reset View
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div style={{ width: '100%', height }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            fitView
            attributionPosition="top-right"
          >
            <Controls />
            <MiniMap />
            <Background variant="dots" gap={12} size={1} />
          </ReactFlow>
        </div>
        
        <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 border-2 border-blue-500 bg-blue-100 rounded"></div>
            <span>Focus Company</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 border-2 border-gray-300 bg-white rounded"></div>
            <span>Related Company</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-6 h-0.5 bg-gray-400"></div>
            <span>Relationship</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const CompanyNetworkChartWrapper: React.FC<CompanyNetworkChartProps> = (props) => (
  <ReactFlowProvider>
    <CompanyNetworkChart {...props} />
  </ReactFlowProvider>
);

export default CompanyNetworkChartWrapper;
