'use client';

import React, { useState, useEffect, useCallback } from 'react';
import ReactFlow, {
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Node,
  Edge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  Connection,
  NodeMouseHandler,
  useReactFlow,
} from 'reactflow';

import 'reactflow/dist/style.css';
import NodeLinker from './NodeLinker';
import CustomProcessNode from './CustomProcessNode';
import type { ComponentType } from 'react';

const nodeTypes = { customProcessNode: CustomProcessNode as ComponentType<any> };

const defaultInitialNodes: Node[] = [
  { id: 'start', position: { x: 50, y: 50 }, data: { label: 'Inicio' }, type: 'customProcessNode' },
];

interface ProcessMapperProps {
  initialNodes?: Node[];
  initialEdges?: Edge[];
  onDiagramChange: (nodes: Node[], edges: Edge[]) => void;
}

const ProcessMapper = ({ initialNodes, initialEdges, onDiagramChange }: ProcessMapperProps) => {
  const [nodes, setNodes] = useState<Node[]>(initialNodes && initialNodes.length > 0 ? initialNodes : defaultInitialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges || []);

  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [isLinkerOpen, setIsLinkerOpen] = useState(false);

  const { fitView } = useReactFlow();

  useEffect(() => {
    // If the process data is loaded, update the diagram
    if (initialNodes && initialNodes.length > 0) {
      setNodes(initialNodes);
    } else {
      setNodes(defaultInitialNodes);
    }
    if (initialEdges) setEdges(initialEdges);

    // Fit view to ensure all nodes are visible on load
    fitView();
  }, [initialNodes, initialEdges, fitView]);

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => {
      const newNodes = applyNodeChanges(changes, nodes);
      setNodes(newNodes);
      onDiagramChange(newNodes, edges);
    },
    [nodes, edges, onDiagramChange]
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => {
      const newEdges = applyEdgeChanges(changes, edges);
      setEdges(newEdges);
      onDiagramChange(nodes, newEdges);
    },
    [edges, nodes, onDiagramChange]
  );

  const onConnect: OnConnect = useCallback(
    (connection: Connection) => {
      const newEdges = addEdge(connection, edges);
      setEdges(newEdges);
      onDiagramChange(nodes, newEdges);
    },
    [edges, nodes, onDiagramChange]
  );

  const onNodeDoubleClick: NodeMouseHandler = useCallback((event, node) => {
    setSelectedNode(node);
    setIsLinkerOpen(true);
  }, []);

  const handleLinkerSave = useCallback((nodeId: string, linkedIds: Record<string, string[]>) => {
    setNodes(prevNodes =>
      prevNodes.map(node =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, ...linkedIds } }
          : node
      )
    );
    // Also update the parent form's state
    onDiagramChange(nodes.map(node =>
      node.id === nodeId
        ? { ...node, data: { ...node.data, ...linkedIds } }
        : node
    ), edges);
  }, [nodes, edges, onDiagramChange]);

  const handleNodeLabelChange = useCallback((nodeId: string, newLabel: string) => {
    setNodes(prevNodes =>
      prevNodes.map(node =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, label: newLabel } }
          : node
      )
    );
    // Also update the parent form's state
    onDiagramChange(nodes.map(node =>
      node.id === nodeId
        ? { ...node, data: { ...node.data, label: newLabel } }
        : node
    ), edges);
  }, [nodes, edges, onDiagramChange]);

  const addActivityNode = useCallback(() => {
    const newNode: Node = {
      id: `node_${Date.now()}_${Math.floor(Math.random() * 1000)}`, // More robust ID
      position: { x: Math.random() * 250, y: Math.random() * 250 },
      data: { label: `Actividad ${nodes.length + 1}` },
      type: 'customProcessNode',
    };
    const newNodes = [...nodes, newNode];
    setNodes(newNodes);
    onDiagramChange(newNodes, edges);
  }, [nodes, edges, onDiagramChange]);

  const handleNodeDelete = useCallback((nodeId: string) => {
    setNodes(prevNodes => prevNodes.filter(node => node.id !== nodeId));
    setEdges(prevEdges => prevEdges.filter(edge => edge.source !== nodeId && edge.target !== nodeId));
    onDiagramChange(nodes.filter(node => node.id !== nodeId), edges.filter(edge => edge.source !== nodeId && edge.target !== nodeId));
  }, [nodes, edges, onDiagramChange]);

  return (
    <div style={{ height: '500px', border: '1px solid #ddd', borderRadius: '8px', position: 'relative' }}>
      <ReactFlow
        nodes={nodes.map(node => ({
          ...node,
          data: { ...node.data, onChange: handleNodeLabelChange, onDelete: handleNodeDelete },
        }))}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDoubleClick={onNodeDoubleClick}
        nodeTypes={nodeTypes}
        fitView
      >
        <Controls />
        <Background />
      </ReactFlow>

      <button 
        type="button" 
        onClick={addActivityNode} 
        className="feature-button" 
        style={{ position: 'absolute', bottom: 10, left: 10, zIndex: 1000 }}
      >
        Añadir Actividad
      </button>

      {isLinkerOpen && selectedNode && (
        <NodeLinker
          node={selectedNode}
          onClose={() => setIsLinkerOpen(false)}
          onSave={handleLinkerSave}
        />
      )}
    </div>
  );
};

export default ProcessMapper;
