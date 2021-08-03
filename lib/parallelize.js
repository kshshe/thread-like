(() => {
  "use strict";
  var e,
    t,
    o,
    n = {
      765: (e, t) => {
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.activeTasks = void 0),
          (t.activeTasks = new Set());
      },
      761: function (e, t, o) {
        var n =
          (this && this.__awaiter) ||
          function (e, t, o, n) {
            return new (o || (o = Promise))(function (r, i) {
              function a(e) {
                try {
                  l(n.next(e));
                } catch (e) {
                  i(e);
                }
              }
              function s(e) {
                try {
                  l(n.throw(e));
                } catch (e) {
                  i(e);
                }
              }
              function l(e) {
                var t;
                e.done
                  ? r(e.value)
                  : ((t = e.value),
                    t instanceof o
                      ? t
                      : new o(function (e) {
                          e(t);
                        })).then(a, s);
              }
              l((n = n.apply(e, t || [])).next());
            });
          };
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.loop = void 0);
        const r = o(553),
          i = o(175),
          a = o(765);
        let s = !1;
        const l = (e) => Date.now() - e < r.TASKS_LIMIT;
        t.loop = function () {
          return n(this, void 0, void 0, function* () {
            if (!s)
              for (s = !0; ; ) {
                if (0 === a.activeTasks.size) return void (s = !1);
                let e = Date.now();
                e: for (; l(e); )
                  for (const t of a.activeTasks) {
                    const o = () => {
                      a.activeTasks.delete(t), t.logger && t.logger.end();
                    };
                    if (!l(e)) break e;
                    if (t.aborted) o();
                    else {
                      try {
                        t.result = t.generator.next();
                      } catch (e) {
                        o(), t.reject(e);
                        continue;
                      }
                      t.result.done
                        ? (o(), t.resolve(t.result.value))
                        : t.logger && t.logger.tick();
                    }
                  }
                yield i.wait(r.TASKS_PAUSE);
              }
          });
        };
      },
      11: (e, t, o) => {
        t.I = void 0;
        const n = o(553),
          r = o(506),
          i = o(765),
          a = o(761);
        t.I = function (e, t = {}) {
          const o = Object.assign({ debug: !1 }, t);
          return function (...t) {
            const s = o.debug ? r.statLogger(e.name || "anonymous") : void 0,
              l = { generator: e(...t), aborted: !1, logger: s },
              c = new Promise((e, t) => {
                (l.resolve = e), (l.reject = t);
              });
            if (
              (i.activeTasks.add(l),
              (c.abort = function (e = !0) {
                const t = l;
                (t.aborted = !0),
                  e ? t.resolve(n.Aborted) : t.reject(n.Aborted);
              }),
              a.loop(),
              o.maxTime)
            ) {
              const e = setTimeout(() => {
                l.aborted = !0;
              }, o.maxTime);
              c.finally(() => clearTimeout(e));
            }
            return s && s.start(), c;
          };
        };
      },
      553: (e, t) => {
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.Aborted = t.TASKS_PAUSE = t.TASKS_LIMIT = void 0),
          (t.TASKS_LIMIT = 13),
          (t.TASKS_PAUSE = 0),
          (t.Aborted = Symbol("aborted"));
      },
      569: (e, t) => {
        (t.K = void 0),
          (t.K = function* (e, t) {
            e % t == 0 && (yield);
          });
      },
      600: (e, t, o) => {
        t.H = void 0;
        const n = o(553);
        t.H = (e) => e === n.Aborted;
      },
      506: (e, t, o) => {
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.statLogger = void 0);
        const n = o(553);
        t.statLogger = (e) => {
          let t = [],
            o = performance.now();
          return {
            tick: () => {
              t.push(performance.now() - o), (o = performance.now());
            },
            start: () => {
              console.log(`${e} started`);
            },
            end: () => {
              const o = t.reduce((e, t) => e + t, 0) / t.length;
              console.log(
                `${e}\nTicks ${t.length}\nAverage time is ${o.toFixed(
                  2
                )}ms/tick.`
              ),
                o < n.TASKS_LIMIT / 200 &&
                  console.warn(
                    "One iteration takes too little time. Try to yield less often."
                  ),
                o > n.TASKS_LIMIT / 2 &&
                  console.warn(
                    "One iteration takes too long. Try to yield more often."
                  ),
                console.log(`${e} finished`);
            },
          };
        };
      },
      175: (e, t) => {
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.wait = void 0),
          (t.wait = (e) => new Promise((t) => setTimeout(t, e)));
      },
    },
    r = {};
  function i(e) {
    var t = r[e];
    if (void 0 !== t) return t.exports;
    var o = (r[e] = { exports: {} });
    return n[e].call(o.exports, o, o.exports, i), o.exports;
  }
  (e = i(11)),
    (t = i(600)),
    (o = i(569)),
    (window.parallelize = e.I),
    (window.parallelize.isAborted = t.H),
    (window.parallelize.everyNth = o.K);
})();
