(()=>{
    var h, F, J, D, _, E = function() {
        return window.performance && performance.getEntriesByType && performance.getEntriesByType("navigation")[0]
    }, I = function(t) {
        if (document.readyState === "loading")
            return "loading";
        var e = E();
        if (e) {
            if (t < e.domInteractive)
                return "loading";
            if (e.domContentLoadedEventStart === 0 || t < e.domContentLoadedEventStart)
                return "dom-interactive";
            if (e.domComplete === 0 || t < e.domComplete)
                return "dom-content-loaded"
        }
        return "complete"
    }, Te = function(t) {
        var e = t.nodeName;
        return t.nodeType === 1 ? e.toLowerCase() : e.toUpperCase().replace(/^#/, "")
    }, M = function(t, e) {
        var i = "";
        try {
            for (; t && t.nodeType !== 9; ) {
                var n = t
                  , r = n.id ? "#" + n.id : Te(n) + (n.classList && n.classList.value && n.classList.value.trim() && n.classList.value.trim().length ? "." + n.classList.value.trim().replace(/\s+/g, ".") : "");
                if (i.length + r.length > (e || 100) - 1)
                    return i || r;
                if (i = i ? r + ">" + i : r,
                n.id)
                    break;
                t = n.parentNode
            }
        } catch (o) {}
        return i
    }, Q = -1, Z = function() {
        return Q
    }, y = function(t) {
        addEventListener("pageshow", function(e) {
            e.persisted && (Q = e.timeStamp,
            t(e))
        }, !0)
    }, x = function() {
        var t = E();
        return t && t.activationStart || 0
    }, m = function(t, e) {
        var i = E()
          , n = "navigate";
        return Z() >= 0 ? n = "back-forward-cache" : i && (document.prerendering || x() > 0 ? n = "prerender" : document.wasDiscarded ? n = "restore" : i.type && (n = i.type.replace(/_/g, "-"))),
        {
            name: t,
            value: e === void 0 ? -1 : e,
            rating: "good",
            delta: 0,
            entries: [],
            id: "v3-".concat(Date.now(), "-").concat(Math.floor(8999999999999 * Math.random()) + 1e12),
            navigationType: n
        }
    }, L = function(t, e, i) {
        try {
            if (PerformanceObserver.supportedEntryTypes.includes(t)) {
                var n = new PerformanceObserver(function(r) {
                    Promise.resolve().then(function() {
                        e(r.getEntries())
                    })
                }
                );
                return n.observe(Object.assign({
                    type: t,
                    buffered: !0
                }, i || {})),
                n
            }
        } catch (r) {}
    }, v = function(t, e, i, n) {
        var r, o;
        return function(a) {
            e.value >= 0 && (a || n) && ((o = e.value - (r || 0)) || r === void 0) && (r = e.value,
            e.delta = o,
            e.rating = function(c, s) {
                return c > s[1] ? "poor" : c > s[0] ? "needs-improvement" : "good"
            }(e.value, i),
            t(e))
        }
    }, q = function(t) {
        requestAnimationFrame(function() {
            return requestAnimationFrame(function() {
                return t()
            })
        })
    }, A = function(t) {
        var e = function(i) {
            i.type !== "pagehide" && document.visibilityState !== "hidden" || t(i)
        };
        addEventListener("visibilitychange", e, !0),
        addEventListener("pagehide", e, !0)
    }, z = function(t) {
        var e = !1;
        return function(i) {
            e || (t(i),
            e = !0)
        }
    }, C = -1, W = function() {
        return document.visibilityState !== "hidden" || document.prerendering ? 1 / 0 : 0
    }, R = function(t) {
        document.visibilityState === "hidden" && C > -1 && (C = t.type === "visibilitychange" ? t.timeStamp : 0,
        ye())
    }, K = function() {
        addEventListener("visibilitychange", R, !0),
        addEventListener("prerenderingchange", R, !0)
    }, ye = function() {
        removeEventListener("visibilitychange", R, !0),
        removeEventListener("prerenderingchange", R, !0)
    }, O = function() {
        return C < 0 && (C = W(),
        K(),
        y(function() {
            setTimeout(function() {
                C = W(),
                K()
            }, 0)
        })),
        {
            get firstHiddenTime() {
                return C
            }
        }
    }, P = function(t) {
        document.prerendering ? addEventListener("prerenderingchange", function() {
            return t()
        }, !0) : t()
    }, X = [1800, 3e3], Y = function(t, e) {
        e = e || {},
        P(function() {
            var i, n = O(), r = m("FCP"), o = L("paint", function(a) {
                a.forEach(function(c) {
                    c.name === "first-contentful-paint" && (o.disconnect(),
                    c.startTime < n.firstHiddenTime && (r.value = Math.max(c.startTime - x(), 0),
                    r.entries.push(c),
                    i(!0)))
                })
            });
            o && (i = v(t, r, X, e.reportAllChanges),
            y(function(a) {
                r = m("FCP"),
                i = v(t, r, X, e.reportAllChanges),
                q(function() {
                    r.value = performance.now() - a.timeStamp,
                    i(!0)
                })
            }))
        })
    }, $ = [.1, .25], ee = function(t, e) {
        (function(i, n) {
            n = n || {},
            Y(z(function() {
                var r, o = m("CLS", 0), a = 0, c = [], s = function(f) {
                    f.forEach(function(u) {
                        if (!u.hadRecentInput) {
                            var g = c[0]
                              , w = c[c.length - 1];
                            a && u.startTime - w.startTime < 1e3 && u.startTime - g.startTime < 5e3 ? (a += u.value,
                            c.push(u)) : (a = u.value,
                            c = [u])
                        }
                    }),
                    a > o.value && (o.value = a,
                    o.entries = c,
                    r())
                }, l = L("layout-shift", s);
                l && (r = v(i, o, $, n.reportAllChanges),
                A(function() {
                    s(l.takeRecords()),
                    r(!0)
                }),
                y(function() {
                    a = 0,
                    o = m("CLS", 0),
                    r = v(i, o, $, n.reportAllChanges),
                    q(function() {
                        return r()
                    })
                }),
                setTimeout(r, 0))
            }))
        }
        )(function(i) {
            (function(n) {
                if (n.entries.length) {
                    var r = n.entries.reduce(function(c, s) {
                        return c && c.value > s.value ? c : s
                    });
                    if (r && r.sources && r.sources.length) {
                        var o = (a = r.sources).find(function(c) {
                            return c.node && c.node.nodeType === 1
                        }) || a[0];
                        if (o)
                            return void (n.attribution = {
                                largestShiftTarget: M(o.node),
                                largestShiftTime: r.startTime,
                                largestShiftValue: r.value,
                                largestShiftSource: o,
                                largestShiftEntry: r,
                                loadState: I(r.startTime)
                            })
                    }
                }
                var a;
                n.attribution = {}
            }
            )(i),
            t(i)
        }, e)
    }, te = function(t, e) {
        Y(function(i) {
            (function(n) {
                if (n.entries.length) {
                    var r = E()
                      , o = n.entries[n.entries.length - 1];
                    if (r) {
                        var a = r.activationStart || 0
                          , c = Math.max(0, r.responseStart - a);
                        return void (n.attribution = {
                            timeToFirstByte: c,
                            firstByteToFCP: n.value - c,
                            loadState: I(n.entries[0].startTime),
                            navigationEntry: r,
                            fcpEntry: o
                        })
                    }
                }
                n.attribution = {
                    timeToFirstByte: 0,
                    firstByteToFCP: n.value,
                    loadState: I(Z())
                }
            }
            )(i),
            t(i)
        }, e)
    }, B = {
        passive: !0,
        capture: !0
    }, Se = new Date, ne = function(t, e) {
        h || (h = e,
        F = t,
        J = new Date,
        ie(removeEventListener),
        re())
    }, re = function() {
        if (F >= 0 && F < J - Se) {
            var t = {
                entryType: "first-input",
                name: h.type,
                target: h.target,
                cancelable: h.cancelable,
                startTime: h.timeStamp,
                processingStart: h.timeStamp + F
            };
            D.forEach(function(e) {
                e(t)
            }),
            D = []
        }
    }, Ee = function(t) {
        if (t.cancelable) {
            var e = (t.timeStamp > 1e12 ? new Date : performance.now()) - t.timeStamp;
            t.type == "pointerdown" ? function(i, n) {
                var r = function() {
                    ne(i, n),
                    a()
                }
                  , o = function() {
                    a()
                }
                  , a = function() {
                    removeEventListener("pointerup", r, B),
                    removeEventListener("pointercancel", o, B)
                };
                addEventListener("pointerup", r, B),
                addEventListener("pointercancel", o, B)
            }(e, t) : ne(e, t)
        }
    }, ie = function(t) {
        ["mousedown", "keydown", "touchstart", "pointerdown"].forEach(function(e) {
            return t(e, Ee, B)
        })
    }, ae = [100, 300], Le = function(t, e) {
        e = e || {},
        P(function() {
            var i, n = O(), r = m("FID"), o = function(s) {
                s.startTime < n.firstHiddenTime && (r.value = s.processingStart - s.startTime,
                r.entries.push(s),
                i(!0))
            }, a = function(s) {
                s.forEach(o)
            }, c = L("first-input", a);
            i = v(t, r, ae, e.reportAllChanges),
            c && A(z(function() {
                a(c.takeRecords()),
                c.disconnect()
            })),
            c && y(function() {
                var s;
                r = m("FID"),
                i = v(t, r, ae, e.reportAllChanges),
                D = [],
                F = -1,
                h = null,
                ie(addEventListener),
                s = o,
                D.push(s),
                re()
            })
        })
    }, oe = function(t, e) {
        Le(function(i) {
            (function(n) {
                var r = n.entries[0];
                n.attribution = {
                    eventTarget: M(r.target),
                    eventType: r.name,
                    eventTime: r.startTime,
                    eventEntry: r,
                    loadState: I(r.startTime)
                }
            }
            )(i),
            t(i)
        }, e)
    }, ce = 0, N = 1 / 0, b = 0, Ce = function(t) {
        t.forEach(function(e) {
            e.interactionId && (N = Math.min(N, e.interactionId),
            b = Math.max(b, e.interactionId),
            ce = b ? (b - N) / 7 + 1 : 0)
        })
    }, se = function() {
        return _ ? ce : performance.interactionCount || 0
    }, we = function() {
        "interactionCount"in performance || _ || (_ = L("event", Ce, {
            type: "event",
            buffered: !0,
            durationThreshold: 0
        }))
    }, de = [200, 500], ue = 0, le = function() {
        return se() - ue
    }, p = [], H = {}, fe = function(t) {
        var e = p[p.length - 1]
          , i = H[t.interactionId];
        if (i || p.length < 10 || t.duration > e.latency) {
            if (i)
                i.entries.push(t),
                i.latency = Math.max(i.latency, t.duration);
            else {
                var n = {
                    id: t.interactionId,
                    latency: t.duration,
                    entries: [t]
                };
                H[n.id] = n,
                p.push(n)
            }
            p.sort(function(r, o) {
                return o.latency - r.latency
            }),
            p.splice(10).forEach(function(r) {
                delete H[r.id]
            })
        }
    }, Fe = function(t, e) {
        e = e || {},
        P(function() {
            we();
            var i, n = m("INP"), r = function(a) {
                a.forEach(function(l) {
                    l.interactionId && fe(l),
                    l.entryType === "first-input" && !p.some(function(f) {
                        return f.entries.some(function(u) {
                            return l.duration === u.duration && l.startTime === u.startTime
                        })
                    }) && fe(l)
                });
                var c, s = (c = Math.min(p.length - 1, Math.floor(le() / 50)),
                p[c]);
                s && s.latency !== n.value && (n.value = s.latency,
                n.entries = s.entries,
                i())
            }, o = L("event", r, {
                durationThreshold: e.durationThreshold || 40
            });
            i = v(t, n, de, e.reportAllChanges),
            o && (o.observe({
                type: "first-input",
                buffered: !0
            }),
            A(function() {
                r(o.takeRecords()),
                n.value < 0 && le() > 0 && (n.value = 0,
                n.entries = []),
                i(!0)
            }),
            y(function() {
                p = [],
                ue = se(),
                n = m("INP"),
                i = v(t, n, de, e.reportAllChanges)
            }))
        })
    }, me = function(t, e) {
        Fe(function(i) {
            (function(n) {
                if (n.entries.length) {
                    var r = n.entries.sort(function(o, a) {
                        return a.duration - o.duration || a.processingEnd - a.processingStart - (o.processingEnd - o.processingStart)
                    })[0];
                    n.attribution = {
                        eventTarget: M(r.target),
                        eventType: r.name,
                        eventTime: r.startTime,
                        eventEntry: r,
                        loadState: I(r.startTime)
                    }
                } else
                    n.attribution = {}
            }
            )(i),
            t(i)
        }, e)
    }, ve = [2500, 4e3], U = {}, pe = function(t, e) {
        (function(i, n) {
            n = n || {},
            P(function() {
                var r, o = O(), a = m("LCP"), c = function(f) {
                    var u = f[f.length - 1];
                    u && u.startTime < o.firstHiddenTime && (a.value = Math.max(u.startTime - x(), 0),
                    a.entries = [u],
                    r())
                }, s = L("largest-contentful-paint", c);
                if (s) {
                    r = v(i, a, ve, n.reportAllChanges);
                    var l = z(function() {
                        U[a.id] || (c(s.takeRecords()),
                        s.disconnect(),
                        U[a.id] = !0,
                        r(!0))
                    });
                    ["keydown", "click"].forEach(function(f) {
                        addEventListener(f, l, !0)
                    }),
                    A(l),
                    y(function(f) {
                        a = m("LCP"),
                        r = v(i, a, ve, n.reportAllChanges),
                        q(function() {
                            a.value = performance.now() - f.timeStamp,
                            U[a.id] = !0,
                            r(!0)
                        })
                    })
                }
            })
        }
        )(function(i) {
            (function(n) {
                if (n.entries.length) {
                    var r = E();
                    if (r) {
                        var o = r.activationStart || 0
                          , a = n.entries[n.entries.length - 1]
                          , c = a.url && performance.getEntriesByType("resource").filter(function(w) {
                            return w.name === a.url
                        })[0]
                          , s = Math.max(0, r.responseStart - o)
                          , l = Math.max(s, c ? (c.requestStart || c.startTime) - o : 0)
                          , f = Math.max(l, c ? c.responseEnd - o : 0)
                          , u = Math.max(f, a ? a.startTime - o : 0)
                          , g = {
                            element: M(a.element),
                            timeToFirstByte: s,
                            resourceLoadDelay: l - s,
                            resourceLoadTime: f - l,
                            elementRenderDelay: u - f,
                            navigationEntry: r,
                            lcpEntry: a
                        };
                        return a.url && (g.url = a.url),
                        c && (g.lcpResourceEntry = c),
                        void (n.attribution = g)
                    }
                }
                n.attribution = {
                    timeToFirstByte: 0,
                    resourceLoadDelay: 0,
                    resourceLoadTime: 0,
                    elementRenderDelay: n.value
                }
            }
            )(i),
            t(i)
        }, e)
    }, he = [800, 1800], Ie = function t(e) {
        document.prerendering ? P(function() {
            return t(e)
        }) : document.readyState !== "complete" ? addEventListener("load", function() {
            return t(e)
        }, !0) : setTimeout(e, 0)
    }, Pe = function(t, e) {
        e = e || {};
        var i = m("TTFB")
          , n = v(t, i, he, e.reportAllChanges);
        Ie(function() {
            var r = E();
            if (r) {
                var o = r.responseStart;
                if (o <= 0 || o > performance.now())
                    return;
                i.value = Math.max(o - x(), 0),
                i.entries = [r],
                n(!0),
                y(function() {
                    i = m("TTFB", 0),
                    (n = v(t, i, he, e.reportAllChanges))(!0)
                })
            }
        })
    }, ge = function(t, e) {
        Pe(function(i) {
            (function(n) {
                if (n.entries.length) {
                    var r = n.entries[0]
                      , o = r.activationStart || 0
                      , a = Math.max(r.domainLookupStart - o, 0)
                      , c = Math.max(r.connectStart - o, 0)
                      , s = Math.max(r.requestStart - o, 0);
                    n.attribution = {
                        waitingTime: a,
                        dnsTime: c - a,
                        connectionTime: s - c,
                        requestTime: n.value - s,
                        navigationEntry: r
                    }
                } else
                    n.attribution = {
                        waitingTime: 0,
                        dnsTime: 0,
                        connectionTime: 0,
                        requestTime: 0
                    }
            }
            )(i),
            t(i)
        }, e)
    };
    var G = ke()
      , Be = new URL(G.src)
      , De = Be.origin + "/anonymous";
    function Me() {
        var t = function() {
            return Math.floor((1 + Math.random()) * 65536).toString(16).substring(1)
        };
        return "" + t() + t() + "-" + t() + "-" + t() + "-" + t() + "-" + t() + t() + t()
    }
    function V(t) {
        if (!location.protocol.startsWith("http"))
            return;
        let e = {
            framerSiteId: G.framerSiteId,
            origin: document.location.origin,
            pathname: document.location.pathname,
            search: document.location.search
        };
        fetch(De, {
            body: JSON.stringify(t.map(i=>({
                ...i,
                data: {
                    ...i.data,
                    context: {
                        ...e,
                        ...i.data.context
                    }
                }
            }))),
            method: "POST",
            keepalive: !0,
            headers: {
                "Content-Type": "application/json"
            }
        })
    }
    function k(t, e) {
        return {
            source: "framer.site",
            timestamp: Date.now(),
            data: {
                type: "track",
                uuid: Me(),
                event: t,
                ...e
            }
        }
    }
    function xe() {
        let t = new Set
          , [e] = performance.getEntriesByType("navigation")
          , i = document.querySelector("div#main").dataset.framerPageOptimizedAt ? new Date(document.querySelector("div#main").dataset.framerPageOptimizedAt).getTime() : null
          , n = document.querySelector("div#main").dataset.framerSsrReleasedAt ? new Date(document.querySelector("div#main").dataset.framerSsrReleasedAt).getTime() : null
          , {origin: r, pathname: o, search: a} = document.location;
        function c(l) {
            t.add(l)
        }
        function s() {
            if (t.size > 0) {
                let l = [...t].map(({name: u, delta: g, id: w, attribution: d})=>{
                    let T = {
                        metric: u,
                        label: w,
                        value: Math.round(g),
                        pageOptimizedAt: i,
                        ssrReleasedAt: n,
                        context: {
                            origin: r,
                            pathname: o,
                            search: a
                        }
                    };
                    return u === "LCP" && (T.attributionLcp = S({
                        element: d.element,
                        timeToFirstByte: d.timeToFirstByte,
                        resourceLoadDelay: d.resourceLoadDelay,
                        resourceLoadTime: d.resourceLoadTime,
                        elementRenderDelay: d.elementRenderDelay,
                        url: d.url
                    })),
                    u === "CLS" && (T.attributionCls = S({
                        largestShiftTarget: d.largestShiftTarget,
                        largestShiftTime: d.largestShiftTime,
                        largestShiftValue: d.largestShiftValue,
                        loadState: d.loadState
                    })),
                    u === "INP" && (T.attributionInp = S({
                        eventTarget: d.eventTarget,
                        eventType: d.eventType,
                        eventTime: d.eventTime ? Math.round(d.eventTime) : void 0,
                        loadState: d.loadState
                    })),
                    u === "FID" && (T.attributionFid = S({
                        eventTarget: d.eventTarget,
                        eventType: d.eventType,
                        eventTime: d.eventTime,
                        loadState: d.loadState
                    })),
                    u === "FCP" && (T.attributionFcp = S({
                        timeToFirstByte: d.timeToFirstByte,
                        firstByteToFCP: d.firstByteToFCP,
                        loadState: d.loadState
                    })),
                    u === "TTFB" && (T.attributionTtfb = S({
                        waitingTime: d.waitingTime,
                        dnsTime: d.dnsTime,
                        connectionTime: d.connectionTime,
                        requestTime: d.requestTime
                    })),
                    k("published_site_performance_web_vitals", T)
                }
                )
                  , f = k("published_site_performance", {
                    domNodes: document.getElementsByTagName("*").length,
                    pageLoadDurationMs: e.domContentLoadedEventEnd !== void 0 && e.domContentLoadedEventStart !== void 0 ? Math.round(e.domContentLoadedEventEnd - e.domContentLoadedEventStart) : null,
                    timeToFirstByteMs: Math.round(e.responseStart),
                    resourcesCount: performance.getEntriesByType("resource").length,
                    framerCSSSize: document.querySelector("[data-framer-css-ssr-minified]") ? document.querySelector("[data-framer-css-ssr-minified]").innerHTML.length : null,
                    headSize: document.querySelector("head").innerHTML.length,
                    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                    hydrationDurationMs: null,
                    pageOptimizedAt: i,
                    ssrReleasedAt: n,
                    devicePixelRatio: window.devicePixelRatio,
                    navigationTiming: {
                        activationStart: e.activationStart,
                        connectEnd: e.connectEnd,
                        connectStart: e.connectStart,
                        criticalCHRestart: e.criticalCHRestart,
                        decodedBodySize: e.decodedBodySize,
                        deliveryType: e.deliveryType,
                        domComplete: e.domComplete,
                        domContentLoadedEventEnd: e.domContentLoadedEventEnd,
                        domContentLoadedEventStart: e.domContentLoadedEventStart,
                        domInteractive: e.domInteractive,
                        domainLookupEnd: e.domainLookupEnd,
                        domainLookupStart: e.domainLookupStart,
                        duration: e.duration,
                        encodedBodySize: e.encodedBodySize,
                        fetchStart: e.fetchStart,
                        firstInterimResponseStart: e.firstInterimResponseStart,
                        loadEventEnd: e.loadEventEnd,
                        loadEventStart: e.loadEventStart,
                        nextHopProtocol: e.nextHopProtocol,
                        redirectCount: e.redirectCount,
                        redirectEnd: e.redirectEnd,
                        redirectStart: e.redirectStart,
                        requestStart: e.requestStart,
                        responseEnd: e.responseEnd,
                        responseStart: e.responseStart,
                        responseStatus: e.responseStatus,
                        secureConnectionStart: e.secureConnectionStart,
                        serverTiming: e.serverTiming ? JSON.stringify(e.serverTiming) : null,
                        startTime: e.startTime,
                        transferSize: e.transferSize,
                        type: e.type,
                        unloadEventEnd: e.unloadEventEnd,
                        unloadEventStart: e.unloadEventStart,
                        workerStart: e.workerStart
                    },
                    connection: S({
                        downlink: navigator.connection?.downlink,
                        downlinkMax: navigator.connection?.downlinkMax,
                        effectiveType: navigator.connection?.effectiveType,
                        rtt: navigator.connection?.rtt,
                        saveData: navigator.connection?.saveData,
                        type: navigator.connection?.type
                    }),
                    context: {
                        origin: r,
                        pathname: o,
                        search: a
                    }
                });
                t.clear(),
                V([...l, f])
            }
        }
        oe(c),
        pe(c),
        te(c),
        ee(({delta: l, ...f})=>{
            c({
                ...f,
                delta: l * 1e3
            })
        }
        ),
        me(c),
        ge(c),
        addEventListener("visibilitychange", ()=>{
            document.visibilityState === "hidden" && s()
        }
        ),
        addEventListener("pagehide", s)
    }
    function Ae() {
        window.addEventListener("popstate", j),
        typeof Proxy != "undefined" && (window.history.pushState = new Proxy(window.history.pushState,{
            apply: (t,e,i)=>{
                t.apply(e, i),
                j()
            }
        }))
    }
    function j(t) {
        let e = [k("published_site_pageview", {
            referrer: t && t.initialReferrer || null,
            url: location.href,
            hostname: location.hostname || null,
            pathname: location.pathname || null,
            hash: location.hash || null,
            search: location.search || null,
            framerSiteId: G.framerSiteId
        })];
        V(e)
    }
    function Re() {
        window.__send_framer_event = (t,e)=>{
            let i = k(t, e);
            V([i])
        }
    }
    function be(t) {
        return Object.values(t).some(e=>e !== void 0)
    }
    function S(t) {
        return be(t) ? t : void 0
    }
    function ke() {
        return document.currentScript ? {
            src: document.currentScript.src,
            framerSiteId: document.currentScript.getAttribute("data-fid")
        } : {
            src: "https://events.framer.com/",
            framerSiteId: null
        }
    }
    (function() {
        let t = typeof document.referrer == "string";
        xe(),
        Ae(),
        Re(),
        j({
            initialReferrer: t && document.referrer || null
        })
    }
    )();
}
)();
