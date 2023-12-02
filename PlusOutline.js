let r;
var d = e=>{
    if (!r) {
        const t = ({size: o=24, ...n},s)=>e.createElement("svg", {
            fill: "none",
            viewBox: "0 0 24 24",
            stroke: "currentColor",
            width: o,
            height: o,
            ref: s,
            ...n
        }, e.createElement("path", {
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeWidth: 2,
            d: "M12 6v6m0 0v6m0-6h6m-6 0H6"
        }));
        r = e.forwardRef(t)
    }
    return r
}
;
export {d as default};
