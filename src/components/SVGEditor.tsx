import React, { useState, useEffect } from 'react';

import './../App.css';

const SVGEditor: React.FC = () => {
    const scale = 1;

    const [position, setPosition] = useState<{x:number, y:number}>({x: 30, y: 30});
    const [offset, setOffset] = useState<{x:number, y:number}>({x: 0, y: 0});
    const [size, setSize] = useState<{w:number, h:number}>({w: 300, h: 300});
    
    const [isResizing, setResizing] = useState(false);
    const [isMoving, setMoving] = useState(false);

    useEffect(() => {

    });

    const toSVGPoint = (px: number, py: number): SVGPoint => {
        let svg: SVGSVGElement = document.getElementsByClassName('svg-editor')[0] as SVGSVGElement;
        let point: SVGPoint = svg.createSVGPoint();
        point.x = px * (1.0 / scale);
        point.y = py * (1.0 / scale);
        point = point.matrixTransform((svg.getScreenCTM() as SVGMatrix).inverse());

        return point;
    };

    const onResizeMouseDown = (ev: React.MouseEvent<SVGElement, MouseEvent>) => {
        let point: SVGPoint = toSVGPoint(ev.clientX, ev.clientY);

        setOffset(offs => {
            return {
                x: point.x,
                y: point.y
            } 
         });

        let target = ev.target as SVGElement;
        if (target.classList.contains('resizeable')) {
            setResizing(true);
        } else if (target.classList.contains('moveable')) {
            setMoving(true);
        }
    };

    const onResizeMouseMove = (ev: React.MouseEvent<SVGElement, MouseEvent>) => {
        if (isResizing) {
            let point: SVGPoint = toSVGPoint(ev.clientX, ev.clientY);

            setSize(s => { 
                return { 
                    w: point.x - position.x + (10/2), 
                    h: point.y - position.y + (10/2) 
                }});
        } else if (isMoving) {
            let point: SVGPoint = toSVGPoint(ev.clientX, ev.clientY);

            setPosition(pos => {
                return {
                    x: pos.x + (point.x - offset.x),
                    y: pos.y + (point.y - offset.y)
                }
            });
            setOffset(offs => {
               return {
                   x: point.x,
                   y: point.y
               } 
            });
        }
    };

    const onResizeMouseUp = (ev: React.MouseEvent<SVGElement, MouseEvent>) => {
        if (isResizing) setResizing(false);
        if (isMoving) setMoving(false);
    };

    return (
        <svg className="svg-editor" width="500" height="500" viewBox="0 0 500 500"
            preserveAspectRatio="xMinYMin meet" 
            onMouseDown={onResizeMouseDown}
            onMouseMove={onResizeMouseMove}
            onMouseUp={onResizeMouseUp}>
            <g transform={`scale(${scale})`}>
                <g transform={`translate(${position.x},${position.y})`}>
                    <rect width={size.w} height={size.h} style={{fill:'rgb(192,192,192)'}}></rect>
                    <rect 
                        width={size.w} 
                        height="20" 
                        className="moveable"
                        style={{fill:'rgb(0,0,0)', cursor: 'grab'}}></rect>
                    <rect 
                        x={size.w - 10} 
                        y={size.h - 10} 
                        width="10" 
                        height="10" 
                        className="resizeable"
                        style={{fill:'rgb(0,0,0)', cursor: 'nwse-resize'}}
                        ></rect>
                </g>
            </g>
        </svg>
    );
}

export default SVGEditor;