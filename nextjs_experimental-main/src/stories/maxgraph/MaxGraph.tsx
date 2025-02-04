import React, { useEffect } from 'react';
import { useRef } from 'react';
import { type CellStyle, Graph, InternalEvent } from '@maxgraph/core';
import { MaxGraphCodec } from './MaxGraph.codec';
import { MaxGraphEditor } from './MaxGraph.editor';

type User = {
  name: string;
};

export interface MaxGraphProps {
  /** INFO : maxGraph only works with bundler like Webpack.*/
  Description?: void,
  mode?: "codec" | "basic" | "editor",
  /** Content - Connect from certain id to another id tasks. **Must provide id for link itself */
  links?: { id: number, source: number, target: number, type: "e2e" | "e2s" | "s2s" }[]
}


export const MaxGraph: React.FC<MaxGraphProps> = ({
  links = [{ id: 1, source: 20, target: 21, type: "e2e" }],
  mode = "basic",
  ...props
}: MaxGraphProps) => {
  const myRef = useRef(null);

  useEffect(() => {
    const container = myRef.current as unknown as HTMLElement;
    // Disables the built-in context menu
    // InternalEvent.disableContextMenu(container);
    console.log("container", container);
    if (container) {


      const graph = new Graph(container);
      graph.setPanning(true);
      // Gets the default parent for inserting new cells. This
      // is normally the first child of the root (ie. layer 0).
      const parent = graph.getDefaultParent();

      graph.batchUpdate(() => {
        const vertex01 = graph.insertVertex({
          parent,
          position: [10, 10],
          size: [100, 100],
          value: 'rectangle',
        });
        const vertex02 = graph.insertVertex({
          parent,
          position: [350, 90],
          size: [50, 50],
          style: {
            fillColor: 'orange',
            shape: 'ellipse',
            verticalAlign: 'top',
            verticalLabelPosition: 'bottom',
          },
          value: 'ellipse',
        });
        graph.insertEdge({
          parent,
          source: vertex01,
          target: vertex02,
          value: 'edge',
          style: {
            edgeStyle: 'orthogonalEdgeStyle',
            rounded: true,
          },
        });
      });
    }
  });

  const fnViewMode = () => {
    switch (mode) {
      case 'codec':
        return <MaxGraphCodec />;
      case "basic":
        return <article ref={myRef} className="h-[100vh] w-[100vh]">
              </article>;
      case 'editor':
        return <MaxGraphEditor />;
      default:
        return <div>Unknown status.</div>;
    }
  }


  return (
    fnViewMode()
  );
};
