import { registerAllCodecs, Codec, popup, xmlUtils, GraphDataModel, ModelXmlSerializer, Graph, PanningHandler } from "@maxgraph/core";
import { div } from "framer-motion/client";
import { useEffect, useRef } from "react";


export interface MaxGraphCodecProps {

}

export const MaxGraphCodec: React.FC<MaxGraphCodecProps> = ({
    ...props
}: MaxGraphCodecProps) => {
    let graph: Graph;
    const divRef = useRef(null);
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
        const sourceObject = graph.getDataModel(); // your object
        const encoder = new Codec();
        const node = encoder.encode(sourceObject);
        const encodedXml = xmlUtils.getPrettyXml(node);
        console.log("Encoded XML", encodedXml);
    }

    const fnEncodeMxgraph = () => {
        const model = graph.getDataModel();
        const xml = new ModelXmlSerializer(model).export({
            pretty: true
        });
        console.log("Hasil XML", xml);
    }

    const fnDecodeMxgraph = () => {
        // const model = new GraphDataModel();
        const model = graph.getDataModel();
        graph.resizeContainer = false;
        try {
            new ModelXmlSerializer(model).import(mxGraphModelAsXml);
            console.log("model mxgraph", model);
        }
        catch (e) {
            console.error("Kesalahan membaca XML :", e);
            alert("Kesalahan membaca XML : " + e);
        }
    }

    const fnDecode = () => {
        const xml = '...'; // your XML string
        const targetObject = {}; // object to decode into
        const decoder = new Codec();
        const doc = xmlUtils.parseXml(xml);
        new Codec(doc).decode(doc.documentElement, targetObject);
    }

    const fnInitializeMxgraph = () => {
        graph = new Graph(divRef.current as unknown as HTMLElement);
        graph.centerZoom = true;
        graph.setTooltips(true);
        graph.setEnabled(true);

        const style = graph.getStylesheet().getDefaultEdgeStyle();
        style.edgeStyle = 'elbowEdgeStyle';

        const panningHandler = graph.getPlugin<PanningHandler>('PanningHandler');
        panningHandler.useLeftButtonForPanning = true;
        panningHandler.ignoreCell = true;
        graph.container.style.cursor = 'move';
        graph.setPanning(true);
        // InternalEvent.disableContextMenu(container);
    }

    useEffect(() => {
        registerAllCodecs(false);
        fnInitializeMxgraph();
        fnDecodeMxgraph();
    });

    return (
        <>
            <div>
                <button onClick={fnEncodeMxgraph}>Simpan</button>
            </div>
            <div ref={divRef} className="h-[100vh] w-full">
            </div>
        </>

    );
}