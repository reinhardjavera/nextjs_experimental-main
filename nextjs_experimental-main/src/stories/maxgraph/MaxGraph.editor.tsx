import {
    Cell,
    type CellStyle,
    Client,
    type ConnectionHandler,
    DomHelpers,
    DragSource,
    Geometry,
    gestureUtils,
    Graph,
    GraphDataModel,
    ImageBox,
    MaxToolbar,
    Point,
    RubberBandHandler,
    cellArrayUtils,
    getDefaultPlugins,

    registerAllCodecs, Codec, popup, xmlUtils, ModelXmlSerializer, PanningHandler, load, MaxXmlRequest, Editor
} from '@maxgraph/core';
import {
    globalTypes,
    globalValues,
    rubberBandTypes,
    rubberBandValues,
} from './shared/args';
import {
    configureExpandedAndCollapsedImages,
    configureImagesBasePath,
    createGraphContainer,
} from './shared/configure';
import '@maxgraph/core/css/common.css'; // style required by RubberBand

import { div } from "framer-motion/client";
import { useEffect, useRef } from "react";


export interface MaxGraphEditorProps {

}

export const MaxGraphEditor: React.FC<MaxGraphEditorProps> = ({
    ...props
}: MaxGraphEditorProps) => {
    let graph: Graph;
    const divRef = useRef<HTMLDivElement>(null);
    const mxGraphModelAsXml = `<mxGraphModel>
    <root>
        <mxCell id="0"/>
        <mxCell id="1" parent="0"/>
        <mxCell id="2" vertex="1" parent="1" value="Vertex #2">
        <mxGeometry x="380" y="20" width="140" height="30" as="geometry"/>
        </mxCell>
        <mxCell id="3" vertex="1" parent="1" value="Vertex #3">
        <mxGeometry x="200" y="80" width="380" height="30" as="geometry">
            <mxPoint x="1" y="1" as="offset"/>
        </mxGeometry>
        </mxCell>
        <mxCell id="7" edge="1" source="2" target="3" parent="1" value="Edge #7">
        <mxGeometry as="geometry">
            <Array as="points">
            <Object x="420" y="60"/>
            </Array>
        </mxGeometry>
        </mxCell>
    </root>
    </mxGraphModel>
    `;

    const fnEncode = () => {
        const sourceObject = {}; // your object
        const encoder = new Codec();
        const node = encoder.encode(sourceObject);
        const encodedXml = xmlUtils.getPrettyXml(node);
    }

    // const fnDecodeMxgraph = () => {
    //     // const model = new GraphDataModel();
    //     const model = graph.getDataModel();
    //     graph.resizeContainer = true;
    //     try {
    //         new ModelXmlSerializer(model).import(mxGraphModelAsXml);
    //         console.log("model mxgraph", model);
    //     }
    //     catch (e) {
    //         console.error("Kesalahan membaca XML :", e);
    //         alert("Kesalahan membaca XML : " + e);
    //     }
    // }

    const fnDecode = () => {
        const xml = '...'; // your XML string
        const targetObject = {}; // object to decode into
        const decoder = new Codec();
        const doc = xmlUtils.parseXml(xml);
        new Codec(doc).decode(doc.documentElement, targetObject);
    }

    const fnInitializeMxgraph = () => {
        configureImagesBasePath();
        const div = document.createElement('div');
        div.style.display = 'flex';
        div.style.flexDirection = 'column-reverse';

        const toolbarAndGraphParentContainer = document.createElement('div');
        toolbarAndGraphParentContainer.style.display = 'flex';
        div.appendChild(toolbarAndGraphParentContainer);

        const tbContainer = document.createElement('div');
        tbContainer.style.display = 'flex';
        tbContainer.style.flexDirection = 'column';
        tbContainer.style.marginRight = '.5rem';

        toolbarAndGraphParentContainer.appendChild(tbContainer);

        const toolbar = new MaxToolbar(tbContainer);
        toolbar.enabled = false;

        const args = {
            width: 300,
            height: 300,
            rubberBand: true
        }
        const container = createGraphContainer([300, 300]);
        toolbarAndGraphParentContainer.appendChild(container);

        const plugins = getDefaultPlugins();
        if (args.rubberBand) plugins.push(RubberBandHandler);

        const model = new GraphDataModel();
        const graph = new Graph(container, model, plugins);
        configureExpandedAndCollapsedImages(graph);
        graph.dropEnabled = true;

        const connectionHandler = graph.getPlugin<ConnectionHandler>('ConnectionHandler');
        connectionHandler.connectImage = new ImageBox(
            `${""}maxgraph/images/connector.gif`,
            // `${Client.imageBasePath}/maxgraph/connector.gif`,
            16,
            16
        );

        DragSource.prototype.getDropTarget = function (
            graph: Graph,
            x: number,
            y: number,
            _evt: MouseEvent
        ) {
            let cell = graph.getCellAt(x, y);
            if (cell && !graph.isValidDropTarget(cell)) {
                cell = null;
            }
            return cell;
        };

        // Enables new connections in the graph
        graph.setConnectable(true);
        graph.setMultigraph(true);


        // graph = new Graph(divRef.current as unknown as HTMLElement);
        const dataURI = `data:text/xml;charset=utf-8;base64,PEVkaXRvcj4NCiAgPHVpPg0KICAgIDxzdHlsZXNoZWV0IG5hbWU9ImV4YW1wbGVzL2VkaXRvcnMvY3NzL3Byb2Nlc3MuY3NzIi8+DQogIDwvdWk+DQo8L0VkaXRvcj4=`;
        const config = load(dataURI).getDocumentElement();
        console.log("CFG load", config);
        const editor = new Editor(config!);
        console.log("Editor load", editor);

        editor.setGraphContainer(divRef.current as unknown as HTMLElement);

        const doc = xmlUtils.parseXml(mxGraphModelAsXml);
        var node = doc.documentElement;
        editor.readGraphModel(node);


        const addToolbarItem = (
            graph: Graph,
            toolbar: MaxToolbar,
            prototype: Cell,
            image: string,
            title?: string
        ) => {
            // Function that is executed when the image is dropped on
            // the graph. The cell argument points to the cell under
            // the mousepointer if there is one.
            const funct = (graph: Graph, evt: MouseEvent, cell: Cell | null) => {
                graph.stopEditing(false);

                const pt = graph.getPointForEvent(evt);
                const cellToImport = cellArrayUtils.cloneCell(prototype);
                if (!cellToImport) return;

                if (cellToImport.geometry) {
                    cellToImport.geometry.x = pt.x;
                    cellToImport.geometry.y = pt.y;

                    if (cellToImport.isEdge()) {
                        cellToImport.geometry.sourcePoint = new Point(pt.x, pt.y);
                        cellToImport.geometry.targetPoint = new Point(
                            pt.x + cellToImport.geometry.width,
                            pt.y + cellToImport.geometry.height
                        );
                    }
                }

                graph.setSelectionCells(graph.importCells([cellToImport], 0, 0, cell));
            };

            // Creates the image which is used as the drag icon (preview)
            const img = toolbar.addMode(title, image, funct, '');
            gestureUtils.makeDraggable(img, graph, funct);
        }


        const addCell = (
            isVertex: boolean,
            icon: string,
            w: number,
            h: number,
            style: CellStyle
        ) => {
            const cell = new Cell(null, new Geometry(0, 0, w, h), style);
            cell.setVertex(isVertex);
            cell.setEdge(!isVertex);
            addToolbarItem(graph, toolbar, cell, icon, !isVertex ? 'Edge' : undefined);

        }

        const addVertex = (icon: string, w: number, h: number, style: CellStyle) => {
            addCell(true, icon, w, h, style);
            // addCell(true, icon, w,h, {shape: "", })
        }

        const addToolbarLine = () => {
            const hr = document.createElement('hr');
            hr.style.maxHeight = '0';
            hr.style.minWidth = '100%';
            hr.setAttribute('size', '1');
            tbContainer.appendChild(hr);
        }

        const addEdge = (icon: string, w: number, h: number, style: CellStyle) => {
            addCell(false, icon, w, h, style);
        }

        addVertex('maxgraph/images/swimlane.gif', 120, 160, { shape: 'swimlane', startSize: 20 });
        addVertex('maxgraph/images/rectangle.gif', 100, 40, {});
        addVertex('maxgraph/images/rounded.gif', 100, 40, { rounded: true });
        addVertex('maxgraph/images/ellipse.gif', 40, 40, { shape: 'ellipse' });
        addVertex('maxgraph/images/rhombus.gif', 40, 40, { shape: 'rhombus' });
        addVertex('maxgraph/images/triangle.gif', 40, 40, { shape: 'triangle' });
        addVertex('maxgraph/images/cylinder.gif', 40, 40, { shape: 'cylinder' });
        addVertex('maxgraph/images/actor.gif', 30, 40, { shape: 'actor' });
        addToolbarLine();
        addEdge('maxgraph/images/entity.gif', 50, 50, {});
        addToolbarLine();

        const button = DomHelpers.button('Create toolbar entry from selection', (evt) => {
            if (!graph.isSelectionEmpty()) {
                // Creates a copy of the selection array to preserve its state
                const cells = graph.getSelectionCells();
                const bounds = graph.getView().getBounds(cells);

                // Function that is executed when the image is dropped on
                // the graph. The cell argument points to the cell under
                // the mousepointer if there is one.
                const funct = (graph: Graph, _evt: MouseEvent, cell: Cell | null) => {
                    graph.stopEditing(false);

                    const pt = graph.getPointForEvent(evt);
                    const dx = pt.x - (bounds?.x ?? 0);
                    const dy = pt.y - (bounds?.y ?? 0);

                    graph.setSelectionCells(graph.importCells(cells, dx, dy, cell));
                };

                // Creates the image which is used as the drag icon (preview)
                const img = toolbar.addMode(null, 'maxgraph/images/outline.gif', funct, '');
                gestureUtils.makeDraggable(img, graph, funct);
            }
        });

        button.style.marginBottom = '1rem';
        button.style.alignSelf = 'flex-start';
        div.appendChild(button);

        // graph.centerZoom = true;
        // graph.setTooltips(true);
        // graph.setEnabled(true);

        // const style = graph.getStylesheet().getDefaultEdgeStyle();
        // style.edgeStyle = 'elbowEdgeStyle';

        // const panningHandler = graph.getPlugin<PanningHandler>('PanningHandler');
        // panningHandler.useLeftButtonForPanning = true;
        // panningHandler.ignoreCell = true;
        // graph.container.style.cursor = 'move';
        // graph.setPanning(true);

        (divRef.current!).appendChild(div);
    }



    useEffect(() => {
        // registerAllCodecs(false);
        fnInitializeMxgraph();
        // fnDecodeMxgraph();
    });

    return (
        <>
            <button>Tombol</button>
            <div ref={divRef} className="h-[100vh] w-full">
            </div>
        </>

    );
}