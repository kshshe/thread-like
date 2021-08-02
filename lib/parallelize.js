(() => {
  "use strict";
  var e,
    t,
    o = {
      11: function (e, t, o) {
        var r =
          (this && this.__awaiter) ||
          function (e, t, o, r) {
            return new (o || (o = Promise))(function (n, i) {
              function a(e) {
                try {
                  s(r.next(e));
                } catch (e) {
                  i(e);
                }
              }
              function l(e) {
                try {
                  s(r.throw(e));
                } catch (e) {
                  i(e);
                }
              }
              function s(e) {
                var t;
                e.done
                  ? n(e.value)
                  : ((t = e.value),
                    t instanceof o
                      ? t
                      : new o(function (e) {
                          e(t);
                        })).then(a, l);
              }
              s((r = r.apply(e, t || [])).next());
            });
          };
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.parallelize = void 0);
        const n = o(553),
          i = o(506),
          a = o(175),
          l = new Set();
        let s = !1;
        const c = (e) => Date.now() - e < n.TASKS_LIMIT;
        t.parallelize = function (e, t = {}) {
          const o = Object.assign({ debug: !1 }, t);
          return function () {
            const t = o.debug ? i.statLogger(e.name || "anonymous") : void 0,
              d = { generator: e(), aborted: !1, logger: t },
              u = new Promise((e, t) => {
                (d.resolve = e), (d.reject = t);
              });
            return (
              l.add(d),
              (u.abort = function (e = !0) {
                const t = d;
                (t.aborted = !0),
                  e ? t.resolve(n.Aborted) : t.reject(n.Aborted);
              }),
              (function () {
                r(this, void 0, void 0, function* () {
                  if (!s)
                    for (s = !0; ; ) {
                      if (0 === l.size) return void (s = !1);
                      let e = Date.now();
                      e: for (; c(e); )
                        for (const t of l) {
                          const o = () => {
                            l.delete(t), t.logger && t.logger.end();
                          };
                          if (!c(e)) break e;
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
                      yield a.wait(n.TASKS_PAUSE);
                    }
                });
              })(),
              t && t.start(),
              u
            );
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
      600: (e, t, o) => {
        t.H = void 0;
        const r = o(553);
        t.H = (e) => e === r.Aborted;
      },
      506: (e, t) => {
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.statLogger = void 0),
          (t.statLogger = (e) => {
            let t = [],
              o = performance.now();
            return {
              tick: () => {
                t.push(performance.now() - o);
              },
              start: () => {
                console.log(`${e} started`);
              },
              end: () => {
                const o = (t.reduce((e, t) => e + t) / t.length).toFixed(2);
                console.log(
                  `${e}\nTicks ${t.length}\nAverage time is ${o}ms/tick`
                ),
                  console.log(`${e} finished`);
              },
            };
          });
      },
      175: (e, t) => {
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.wait = void 0),
          (t.wait = (e) => new Promise((t) => setTimeout(t, e)));
      },
    },
    r = {};
  function n(e) {
    var t = r[e];
    if (void 0 !== t) return t.exports;
    var i = (r[e] = { exports: {} });
    return o[e].call(i.exports, i, i.exports, n), i.exports;
  }
  (e = n(11)),
    (t = n(600)),
    (window.parallelize = e.parallelize),
    (window.parallelize.isAborted = t.H);
})();
