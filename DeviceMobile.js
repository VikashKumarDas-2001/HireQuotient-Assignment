let r;
var f = e=>{
    if (!r) {
        const t = ({size: o=24, ...n},l)=>e.createElement("svg", {
            viewBox: "0 0 20 20",
            fill: "currentColor",
            width: o,
            height: o,
            ref: l,
            ...n
        }, e.createElement("path", {
            fillRule: "evenodd",
            d: "M7 2a2 2 0 00-2 2v12a2 2 0 002 2h6a2 2 0 002-2V4a2 2 0 00-2-2H7zm3 14a1 1 0 100-2 1 1 0 000 2z",
            clipRule: "evenodd"
        }));
        r = e.forwardRef(t)
    }
    return r
}
;
export {f as default};
