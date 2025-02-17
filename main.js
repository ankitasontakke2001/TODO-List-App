var Ip = Object.defineProperty
  , Mp = Object.defineProperties;
var _p = Object.getOwnPropertyDescriptors;
var Sc = Object.getOwnPropertySymbols;
var Sp = Object.prototype.hasOwnProperty
  , Tp = Object.prototype.propertyIsEnumerable;
var Tc = (e, t, n) => t in e ? Ip(e, t, {
    enumerable: !0,
    configurable: !0,
    writable: !0,
    value: n
}) : e[t] = n
  , v = (e, t) => {
    for (var n in t ||= {})
        Sp.call(t, n) && Tc(e, n, t[n]);
    if (Sc)
        for (var n of Sc(t))
            Tp.call(t, n) && Tc(e, n, t[n]);
    return e
}
  , H = (e, t) => Mp(e, _p(t));
var xc = null;
var hs = 1;
function oe(e) {
    let t = xc;
    return xc = e,
    t
}
var Ac = {
    version: 0,
    lastCleanEpoch: 0,
    dirty: !1,
    producerNode: void 0,
    producerLastReadVersion: void 0,
    producerIndexOfThis: void 0,
    nextProducerIndex: 0,
    liveConsumerNode: void 0,
    liveConsumerIndexOfThis: void 0,
    consumerAllowSignalWrites: !1,
    consumerIsAlwaysLive: !1,
    producerMustRecompute: () => !1,
    producerRecomputeValue: () => {}
    ,
    consumerMarkedDirty: () => {}
    ,
    consumerOnSignalRead: () => {}
};
function xp(e) {
    if (!(ms(e) && !e.dirty) && !(!e.dirty && e.lastCleanEpoch === hs)) {
        if (!e.producerMustRecompute(e) && !ps(e)) {
            e.dirty = !1,
            e.lastCleanEpoch = hs;
            return
        }
        e.producerRecomputeValue(e),
        e.dirty = !1,
        e.lastCleanEpoch = hs
    }
}
function Nc(e) {
    return e && (e.nextProducerIndex = 0),
    oe(e)
}
function Oc(e, t) {
    if (oe(t),
    !(!e || e.producerNode === void 0 || e.producerIndexOfThis === void 0 || e.producerLastReadVersion === void 0)) {
        if (ms(e))
            for (let n = e.nextProducerIndex; n < e.producerNode.length; n++)
                gs(e.producerNode[n], e.producerIndexOfThis[n]);
        for (; e.producerNode.length > e.nextProducerIndex; )
            e.producerNode.pop(),
            e.producerLastReadVersion.pop(),
            e.producerIndexOfThis.pop()
    }
}
function ps(e) {
    Jr(e);
    for (let t = 0; t < e.producerNode.length; t++) {
        let n = e.producerNode[t]
          , r = e.producerLastReadVersion[t];
        if (r !== n.version || (xp(n),
        r !== n.version))
            return !0
    }
    return !1
}
function Rc(e) {
    if (Jr(e),
    ms(e))
        for (let t = 0; t < e.producerNode.length; t++)
            gs(e.producerNode[t], e.producerIndexOfThis[t]);
    e.producerNode.length = e.producerLastReadVersion.length = e.producerIndexOfThis.length = 0,
    e.liveConsumerNode && (e.liveConsumerNode.length = e.liveConsumerIndexOfThis.length = 0)
}
function gs(e, t) {
    if (Ap(e),
    Jr(e),
    e.liveConsumerNode.length === 1)
        for (let r = 0; r < e.producerNode.length; r++)
            gs(e.producerNode[r], e.producerIndexOfThis[r]);
    let n = e.liveConsumerNode.length - 1;
    if (e.liveConsumerNode[t] = e.liveConsumerNode[n],
    e.liveConsumerIndexOfThis[t] = e.liveConsumerIndexOfThis[n],
    e.liveConsumerNode.length--,
    e.liveConsumerIndexOfThis.length--,
    t < e.liveConsumerNode.length) {
        let r = e.liveConsumerIndexOfThis[t]
          , i = e.liveConsumerNode[t];
        Jr(i),
        i.producerIndexOfThis[r] = t
    }
}
function ms(e) {
    return e.consumerIsAlwaysLive || (e?.liveConsumerNode?.length ?? 0) > 0
}
function Jr(e) {
    e.producerNode ??= [],
    e.producerIndexOfThis ??= [],
    e.producerLastReadVersion ??= []
}
function Ap(e) {
    e.liveConsumerNode ??= [],
    e.liveConsumerIndexOfThis ??= []
}
function Np() {
    throw new Error
}
var Op = Np;
function Fc(e) {
    Op = e
}
function _(e) {
    return typeof e == "function"
}
function rn(e) {
    let n = e(r => {
        Error.call(r),
        r.stack = new Error().stack
    }
    );
    return n.prototype = Object.create(Error.prototype),
    n.prototype.constructor = n,
    n
}
var Xr = rn(e => function(n) {
    e(this),
    this.message = n ? `${n.length} errors occurred during unsubscription:
${n.map( (r, i) => `${i + 1}) ${r.toString()}`).join(`
  `)}` : "",
    this.name = "UnsubscriptionError",
    this.errors = n
}
);
function Wn(e, t) {
    if (e) {
        let n = e.indexOf(t);
        0 <= n && e.splice(n, 1)
    }
}
var re = class e {
    constructor(t) {
        this.initialTeardown = t,
        this.closed = !1,
        this._parentage = null,
        this._finalizers = null
    }
    unsubscribe() {
        let t;
        if (!this.closed) {
            this.closed = !0;
            let {_parentage: n} = this;
            if (n)
                if (this._parentage = null,
                Array.isArray(n))
                    for (let o of n)
                        o.remove(this);
                else
                    n.remove(this);
            let {initialTeardown: r} = this;
            if (_(r))
                try {
                    r()
                } catch (o) {
                    t = o instanceof Xr ? o.errors : [o]
                }
            let {_finalizers: i} = this;
            if (i) {
                this._finalizers = null;
                for (let o of i)
                    try {
                        Pc(o)
                    } catch (s) {
                        t = t ?? [],
                        s instanceof Xr ? t = [...t, ...s.errors] : t.push(s)
                    }
            }
            if (t)
                throw new Xr(t)
        }
    }
    add(t) {
        var n;
        if (t && t !== this)
            if (this.closed)
                Pc(t);
            else {
                if (t instanceof e) {
                    if (t.closed || t._hasParent(this))
                        return;
                    t._addParent(this)
                }
                (this._finalizers = (n = this._finalizers) !== null && n !== void 0 ? n : []).push(t)
            }
    }
    _hasParent(t) {
        let {_parentage: n} = this;
        return n === t || Array.isArray(n) && n.includes(t)
    }
    _addParent(t) {
        let {_parentage: n} = this;
        this._parentage = Array.isArray(n) ? (n.push(t),
        n) : n ? [n, t] : t
    }
    _removeParent(t) {
        let {_parentage: n} = this;
        n === t ? this._parentage = null : Array.isArray(n) && Wn(n, t)
    }
    remove(t) {
        let {_finalizers: n} = this;
        n && Wn(n, t),
        t instanceof e && t._removeParent(this)
    }
}
;
re.EMPTY = ( () => {
    let e = new re;
    return e.closed = !0,
    e
}
)();
var vs = re.EMPTY;
function ei(e) {
    return e instanceof re || e && "closed"in e && _(e.remove) && _(e.add) && _(e.unsubscribe)
}
function Pc(e) {
    _(e) ? e() : e.unsubscribe()
}
var Fe = {
    onUnhandledError: null,
    onStoppedNotification: null,
    Promise: void 0,
    useDeprecatedSynchronousErrorHandling: !1,
    useDeprecatedNextContext: !1
};
var on = {
    setTimeout(e, t, ...n) {
        let {delegate: r} = on;
        return r?.setTimeout ? r.setTimeout(e, t, ...n) : setTimeout(e, t, ...n)
    },
    clearTimeout(e) {
        let {delegate: t} = on;
        return (t?.clearTimeout || clearTimeout)(e)
    },
    delegate: void 0
};
function ti(e) {
    on.setTimeout( () => {
        let {onUnhandledError: t} = Fe;
        if (t)
            t(e);
        else
            throw e
    }
    )
}
function qn() {}
var kc = ys("C", void 0, void 0);
function Lc(e) {
    return ys("E", void 0, e)
}
function Vc(e) {
    return ys("N", e, void 0)
}
function ys(e, t, n) {
    return {
        kind: e,
        value: t,
        error: n
    }
}
var xt = null;
function sn(e) {
    if (Fe.useDeprecatedSynchronousErrorHandling) {
        let t = !xt;
        if (t && (xt = {
            errorThrown: !1,
            error: null
        }),
        e(),
        t) {
            let {errorThrown: n, error: r} = xt;
            if (xt = null,
            n)
                throw r
        }
    } else
        e()
}
function jc(e) {
    Fe.useDeprecatedSynchronousErrorHandling && xt && (xt.errorThrown = !0,
    xt.error = e)
}
var At = class extends re {
    constructor(t) {
        super(),
        this.isStopped = !1,
        t ? (this.destination = t,
        ei(t) && t.add(this)) : this.destination = Pp
    }
    static create(t, n, r) {
        return new et(t,n,r)
    }
    next(t) {
        this.isStopped ? ws(Vc(t), this) : this._next(t)
    }
    error(t) {
        this.isStopped ? ws(Lc(t), this) : (this.isStopped = !0,
        this._error(t))
    }
    complete() {
        this.isStopped ? ws(kc, this) : (this.isStopped = !0,
        this._complete())
    }
    unsubscribe() {
        this.closed || (this.isStopped = !0,
        super.unsubscribe(),
        this.destination = null)
    }
    _next(t) {
        this.destination.next(t)
    }
    _error(t) {
        try {
            this.destination.error(t)
        } finally {
            this.unsubscribe()
        }
    }
    _complete() {
        try {
            this.destination.complete()
        } finally {
            this.unsubscribe()
        }
    }
}
  , Rp = Function.prototype.bind;
function Ds(e, t) {
    return Rp.call(e, t)
}
var Cs = class {
    constructor(t) {
        this.partialObserver = t
    }
    next(t) {
        let {partialObserver: n} = this;
        if (n.next)
            try {
                n.next(t)
            } catch (r) {
                ni(r)
            }
    }
    error(t) {
        let {partialObserver: n} = this;
        if (n.error)
            try {
                n.error(t)
            } catch (r) {
                ni(r)
            }
        else
            ni(t)
    }
    complete() {
        let {partialObserver: t} = this;
        if (t.complete)
            try {
                t.complete()
            } catch (n) {
                ni(n)
            }
    }
}
  , et = class extends At {
    constructor(t, n, r) {
        super();
        let i;
        if (_(t) || !t)
            i = {
                next: t ?? void 0,
                error: n ?? void 0,
                complete: r ?? void 0
            };
        else {
            let o;
            this && Fe.useDeprecatedNextContext ? (o = Object.create(t),
            o.unsubscribe = () => this.unsubscribe(),
            i = {
                next: t.next && Ds(t.next, o),
                error: t.error && Ds(t.error, o),
                complete: t.complete && Ds(t.complete, o)
            }) : i = t
        }
        this.destination = new Cs(i)
    }
}
;
function ni(e) {
    Fe.useDeprecatedSynchronousErrorHandling ? jc(e) : ti(e)
}
function Fp(e) {
    throw e
}
function ws(e, t) {
    let {onStoppedNotification: n} = Fe;
    n && on.setTimeout( () => n(e, t))
}
var Pp = {
    closed: !0,
    next: qn,
    error: Fp,
    complete: qn
};
var an = typeof Symbol == "function" && Symbol.observable || "@@observable";
function le(e) {
    return e
}
function Es(...e) {
    return bs(e)
}
function bs(e) {
    return e.length === 0 ? le : e.length === 1 ? e[0] : function(n) {
        return e.reduce( (r, i) => i(r), n)
    }
}
var k = ( () => {
    class e {
        constructor(n) {
            n && (this._subscribe = n)
        }
        lift(n) {
            let r = new e;
            return r.source = this,
            r.operator = n,
            r
        }
        subscribe(n, r, i) {
            let o = Lp(n) ? n : new et(n,r,i);
            return sn( () => {
                let {operator: s, source: a} = this;
                o.add(s ? s.call(o, a) : a ? this._subscribe(o) : this._trySubscribe(o))
            }
            ),
            o
        }
        _trySubscribe(n) {
            try {
                return this._subscribe(n)
            } catch (r) {
                n.error(r)
            }
        }
        forEach(n, r) {
            return r = Uc(r),
            new r( (i, o) => {
                let s = new et({
                    next: a => {
                        try {
                            n(a)
                        } catch (u) {
                            o(u),
                            s.unsubscribe()
                        }
                    }
                    ,
                    error: o,
                    complete: i
                });
                this.subscribe(s)
            }
            )
        }
        _subscribe(n) {
            var r;
            return (r = this.source) === null || r === void 0 ? void 0 : r.subscribe(n)
        }
        [an]() {
            return this
        }
        pipe(...n) {
            return bs(n)(this)
        }
        toPromise(n) {
            return n = Uc(n),
            new n( (r, i) => {
                let o;
                this.subscribe(s => o = s, s => i(s), () => r(o))
            }
            )
        }
    }
    return e.create = t => new e(t),
    e
}
)();
function Uc(e) {
    var t;
    return (t = e ?? Fe.Promise) !== null && t !== void 0 ? t : Promise
}
function kp(e) {
    return e && _(e.next) && _(e.error) && _(e.complete)
}
function Lp(e) {
    return e && e instanceof At || kp(e) && ei(e)
}
function Is(e) {
    return _(e?.lift)
}
function O(e) {
    return t => {
        if (Is(t))
            return t.lift(function(n) {
                try {
                    return e(n, this)
                } catch (r) {
                    this.error(r)
                }
            });
        throw new TypeError("Unable to lift unknown Observable type")
    }
}
function R(e, t, n, r, i) {
    return new Ms(e,t,n,r,i)
}
var Ms = class extends At {
    constructor(t, n, r, i, o, s) {
        super(t),
        this.onFinalize = o,
        this.shouldUnsubscribe = s,
        this._next = n ? function(a) {
            try {
                n(a)
            } catch (u) {
                t.error(u)
            }
        }
        : super._next,
        this._error = i ? function(a) {
            try {
                i(a)
            } catch (u) {
                t.error(u)
            } finally {
                this.unsubscribe()
            }
        }
        : super._error,
        this._complete = r ? function() {
            try {
                r()
            } catch (a) {
                t.error(a)
            } finally {
                this.unsubscribe()
            }
        }
        : super._complete
    }
    unsubscribe() {
        var t;
        if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
            let {closed: n} = this;
            super.unsubscribe(),
            !n && ((t = this.onFinalize) === null || t === void 0 || t.call(this))
        }
    }
}
;
function un() {
    return O( (e, t) => {
        let n = null;
        e._refCount++;
        let r = R(t, void 0, void 0, void 0, () => {
            if (!e || e._refCount <= 0 || 0 < --e._refCount) {
                n = null;
                return
            }
            let i = e._connection
              , o = n;
            n = null,
            i && (!o || i === o) && i.unsubscribe(),
            t.unsubscribe()
        }
        );
        e.subscribe(r),
        r.closed || (n = e.connect())
    }
    )
}
var cn = class extends k {
    constructor(t, n) {
        super(),
        this.source = t,
        this.subjectFactory = n,
        this._subject = null,
        this._refCount = 0,
        this._connection = null,
        Is(t) && (this.lift = t.lift)
    }
    _subscribe(t) {
        return this.getSubject().subscribe(t)
    }
    getSubject() {
        let t = this._subject;
        return (!t || t.isStopped) && (this._subject = this.subjectFactory()),
        this._subject
    }
    _teardown() {
        this._refCount = 0;
        let {_connection: t} = this;
        this._subject = this._connection = null,
        t?.unsubscribe()
    }
    connect() {
        let t = this._connection;
        if (!t) {
            t = this._connection = new re;
            let n = this.getSubject();
            t.add(this.source.subscribe(R(n, void 0, () => {
                this._teardown(),
                n.complete()
            }
            , r => {
                this._teardown(),
                n.error(r)
            }
            , () => this._teardown()))),
            t.closed && (this._connection = null,
            t = re.EMPTY)
        }
        return t
    }
    refCount() {
        return un()(this)
    }
}
;
var $c = rn(e => function() {
    e(this),
    this.name = "ObjectUnsubscribedError",
    this.message = "object unsubscribed"
}
);
var de = ( () => {
    class e extends k {
        constructor() {
            super(),
            this.closed = !1,
            this.currentObservers = null,
            this.observers = [],
            this.isStopped = !1,
            this.hasError = !1,
            this.thrownError = null
        }
        lift(n) {
            let r = new ri(this,this);
            return r.operator = n,
            r
        }
        _throwIfClosed() {
            if (this.closed)
                throw new $c
        }
        next(n) {
            sn( () => {
                if (this._throwIfClosed(),
                !this.isStopped) {
                    this.currentObservers || (this.currentObservers = Array.from(this.observers));
                    for (let r of this.currentObservers)
                        r.next(n)
                }
            }
            )
        }
        error(n) {
            sn( () => {
                if (this._throwIfClosed(),
                !this.isStopped) {
                    this.hasError = this.isStopped = !0,
                    this.thrownError = n;
                    let {observers: r} = this;
                    for (; r.length; )
                        r.shift().error(n)
                }
            }
            )
        }
        complete() {
            sn( () => {
                if (this._throwIfClosed(),
                !this.isStopped) {
                    this.isStopped = !0;
                    let {observers: n} = this;
                    for (; n.length; )
                        n.shift().complete()
                }
            }
            )
        }
        unsubscribe() {
            this.isStopped = this.closed = !0,
            this.observers = this.currentObservers = null
        }
        get observed() {
            var n;
            return ((n = this.observers) === null || n === void 0 ? void 0 : n.length) > 0
        }
        _trySubscribe(n) {
            return this._throwIfClosed(),
            super._trySubscribe(n)
        }
        _subscribe(n) {
            return this._throwIfClosed(),
            this._checkFinalizedStatuses(n),
            this._innerSubscribe(n)
        }
        _innerSubscribe(n) {
            let {hasError: r, isStopped: i, observers: o} = this;
            return r || i ? vs : (this.currentObservers = null,
            o.push(n),
            new re( () => {
                this.currentObservers = null,
                Wn(o, n)
            }
            ))
        }
        _checkFinalizedStatuses(n) {
            let {hasError: r, thrownError: i, isStopped: o} = this;
            r ? n.error(i) : o && n.complete()
        }
        asObservable() {
            let n = new k;
            return n.source = this,
            n
        }
    }
    return e.create = (t, n) => new ri(t,n),
    e
}
)()
  , ri = class extends de {
    constructor(t, n) {
        super(),
        this.destination = t,
        this.source = n
    }
    next(t) {
        var n, r;
        (r = (n = this.destination) === null || n === void 0 ? void 0 : n.next) === null || r === void 0 || r.call(n, t)
    }
    error(t) {
        var n, r;
        (r = (n = this.destination) === null || n === void 0 ? void 0 : n.error) === null || r === void 0 || r.call(n, t)
    }
    complete() {
        var t, n;
        (n = (t = this.destination) === null || t === void 0 ? void 0 : t.complete) === null || n === void 0 || n.call(t)
    }
    _subscribe(t) {
        var n, r;
        return (r = (n = this.source) === null || n === void 0 ? void 0 : n.subscribe(t)) !== null && r !== void 0 ? r : vs
    }
}
;
var se = class extends de {
    constructor(t) {
        super(),
        this._value = t
    }
    get value() {
        return this.getValue()
    }
    _subscribe(t) {
        let n = super._subscribe(t);
        return !n.closed && t.next(this._value),
        n
    }
    getValue() {
        let {hasError: t, thrownError: n, _value: r} = this;
        if (t)
            throw n;
        return this._throwIfClosed(),
        r
    }
    next(t) {
        super.next(this._value = t)
    }
}
;
var De = new k(e => e.complete());
function Bc(e) {
    return e && _(e.schedule)
}
function _s(e) {
    return e[e.length - 1]
}
function ii(e) {
    return _(_s(e)) ? e.pop() : void 0
}
function Ge(e) {
    return Bc(_s(e)) ? e.pop() : void 0
}
function Hc(e, t) {
    return typeof _s(e) == "number" ? e.pop() : t
}
function Gc(e, t, n, r) {
    function i(o) {
        return o instanceof n ? o : new n(function(s) {
            s(o)
        }
        )
    }
    return new (n || (n = Promise))(function(o, s) {
        function a(l) {
            try {
                c(r.next(l))
            } catch (d) {
                s(d)
            }
        }
        function u(l) {
            try {
                c(r.throw(l))
            } catch (d) {
                s(d)
            }
        }
        function c(l) {
            l.done ? o(l.value) : i(l.value).then(a, u)
        }
        c((r = r.apply(e, t || [])).next())
    }
    )
}
function zc(e) {
    var t = typeof Symbol == "function" && Symbol.iterator
      , n = t && e[t]
      , r = 0;
    if (n)
        return n.call(e);
    if (e && typeof e.length == "number")
        return {
            next: function() {
                return e && r >= e.length && (e = void 0),
                {
                    value: e && e[r++],
                    done: !e
                }
            }
        };
    throw new TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.")
}
function Nt(e) {
    return this instanceof Nt ? (this.v = e,
    this) : new Nt(e)
}
function Wc(e, t, n) {
    if (!Symbol.asyncIterator)
        throw new TypeError("Symbol.asyncIterator is not defined.");
    var r = n.apply(e, t || []), i, o = [];
    return i = {},
    s("next"),
    s("throw"),
    s("return"),
    i[Symbol.asyncIterator] = function() {
        return this
    }
    ,
    i;
    function s(f) {
        r[f] && (i[f] = function(h) {
            return new Promise(function(p, b) {
                o.push([f, h, p, b]) > 1 || a(f, h)
            }
            )
        }
        )
    }
    function a(f, h) {
        try {
            u(r[f](h))
        } catch (p) {
            d(o[0][3], p)
        }
    }
    function u(f) {
        f.value instanceof Nt ? Promise.resolve(f.value.v).then(c, l) : d(o[0][2], f)
    }
    function c(f) {
        a("next", f)
    }
    function l(f) {
        a("throw", f)
    }
    function d(f, h) {
        f(h),
        o.shift(),
        o.length && a(o[0][0], o[0][1])
    }
}
function qc(e) {
    if (!Symbol.asyncIterator)
        throw new TypeError("Symbol.asyncIterator is not defined.");
    var t = e[Symbol.asyncIterator], n;
    return t ? t.call(e) : (e = typeof zc == "function" ? zc(e) : e[Symbol.iterator](),
    n = {},
    r("next"),
    r("throw"),
    r("return"),
    n[Symbol.asyncIterator] = function() {
        return this
    }
    ,
    n);
    function r(o) {
        n[o] = e[o] && function(s) {
            return new Promise(function(a, u) {
                s = e[o](s),
                i(a, u, s.done, s.value)
            }
            )
        }
    }
    function i(o, s, a, u) {
        Promise.resolve(u).then(function(c) {
            o({
                value: c,
                done: a
            })
        }, s)
    }
}
var oi = e => e && typeof e.length == "number" && typeof e != "function";
function si(e) {
    return _(e?.then)
}
function ai(e) {
    return _(e[an])
}
function ui(e) {
    return Symbol.asyncIterator && _(e?.[Symbol.asyncIterator])
}
function ci(e) {
    return new TypeError(`You provided ${e !== null && typeof e == "object" ? "an invalid object" : `'${e}'`} where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.`)
}
function Vp() {
    return typeof Symbol != "function" || !Symbol.iterator ? "@@iterator" : Symbol.iterator
}
var li = Vp();
function di(e) {
    return _(e?.[li])
}
function fi(e) {
    return Wc(this, arguments, function*() {
        let n = e.getReader();
        try {
            for (; ; ) {
                let {value: r, done: i} = yield Nt(n.read());
                if (i)
                    return yield Nt(void 0);
                yield yield Nt(r)
            }
        } finally {
            n.releaseLock()
        }
    })
}
function hi(e) {
    return _(e?.getReader)
}
function G(e) {
    if (e instanceof k)
        return e;
    if (e != null) {
        if (ai(e))
            return jp(e);
        if (oi(e))
            return Up(e);
        if (si(e))
            return $p(e);
        if (ui(e))
            return Zc(e);
        if (di(e))
            return Bp(e);
        if (hi(e))
            return Hp(e)
    }
    throw ci(e)
}
function jp(e) {
    return new k(t => {
        let n = e[an]();
        if (_(n.subscribe))
            return n.subscribe(t);
        throw new TypeError("Provided object does not correctly implement Symbol.observable")
    }
    )
}
function Up(e) {
    return new k(t => {
        for (let n = 0; n < e.length && !t.closed; n++)
            t.next(e[n]);
        t.complete()
    }
    )
}
function $p(e) {
    return new k(t => {
        e.then(n => {
            t.closed || (t.next(n),
            t.complete())
        }
        , n => t.error(n)).then(null, ti)
    }
    )
}
function Bp(e) {
    return new k(t => {
        for (let n of e)
            if (t.next(n),
            t.closed)
                return;
        t.complete()
    }
    )
}
function Zc(e) {
    return new k(t => {
        zp(e, t).catch(n => t.error(n))
    }
    )
}
function Hp(e) {
    return Zc(fi(e))
}
function zp(e, t) {
    var n, r, i, o;
    return Gc(this, void 0, void 0, function*() {
        try {
            for (n = qc(e); r = yield n.next(),
            !r.done; ) {
                let s = r.value;
                if (t.next(s),
                t.closed)
                    return
            }
        } catch (s) {
            i = {
                error: s
            }
        } finally {
            try {
                r && !r.done && (o = n.return) && (yield o.call(n))
            } finally {
                if (i)
                    throw i.error
            }
        }
        t.complete()
    })
}
function we(e, t, n, r=0, i=!1) {
    let o = t.schedule(function() {
        n(),
        i ? e.add(this.schedule(null, r)) : this.unsubscribe()
    }, r);
    if (e.add(o),
    !i)
        return o
}
function pi(e, t=0) {
    return O( (n, r) => {
        n.subscribe(R(r, i => we(r, e, () => r.next(i), t), () => we(r, e, () => r.complete(), t), i => we(r, e, () => r.error(i), t)))
    }
    )
}
function gi(e, t=0) {
    return O( (n, r) => {
        r.add(e.schedule( () => n.subscribe(r), t))
    }
    )
}
function Yc(e, t) {
    return G(e).pipe(gi(t), pi(t))
}
function Qc(e, t) {
    return G(e).pipe(gi(t), pi(t))
}
function Kc(e, t) {
    return new k(n => {
        let r = 0;
        return t.schedule(function() {
            r === e.length ? n.complete() : (n.next(e[r++]),
            n.closed || this.schedule())
        })
    }
    )
}
function Jc(e, t) {
    return new k(n => {
        let r;
        return we(n, t, () => {
            r = e[li](),
            we(n, t, () => {
                let i, o;
                try {
                    ({value: i, done: o} = r.next())
                } catch (s) {
                    n.error(s);
                    return
                }
                o ? n.complete() : n.next(i)
            }
            , 0, !0)
        }
        ),
        () => _(r?.return) && r.return()
    }
    )
}
function mi(e, t) {
    if (!e)
        throw new Error("Iterable cannot be null");
    return new k(n => {
        we(n, t, () => {
            let r = e[Symbol.asyncIterator]();
            we(n, t, () => {
                r.next().then(i => {
                    i.done ? n.complete() : n.next(i.value)
                }
                )
            }
            , 0, !0)
        }
        )
    }
    )
}
function Xc(e, t) {
    return mi(fi(e), t)
}
function el(e, t) {
    if (e != null) {
        if (ai(e))
            return Yc(e, t);
        if (oi(e))
            return Kc(e, t);
        if (si(e))
            return Qc(e, t);
        if (ui(e))
            return mi(e, t);
        if (di(e))
            return Jc(e, t);
        if (hi(e))
            return Xc(e, t)
    }
    throw ci(e)
}
function W(e, t) {
    return t ? el(e, t) : G(e)
}
function C(...e) {
    let t = Ge(e);
    return W(e, t)
}
function ln(e, t) {
    let n = _(e) ? e : () => e
      , r = i => i.error(n());
    return new k(t ? i => t.schedule(r, 0, i) : r)
}
function Ss(e) {
    return !!e && (e instanceof k || _(e.lift) && _(e.subscribe))
}
var tt = rn(e => function() {
    e(this),
    this.name = "EmptyError",
    this.message = "no elements in sequence"
}
);
function x(e, t) {
    return O( (n, r) => {
        let i = 0;
        n.subscribe(R(r, o => {
            r.next(e.call(t, o, i++))
        }
        ))
    }
    )
}
var {isArray: Gp} = Array;
function Wp(e, t) {
    return Gp(t) ? e(...t) : e(t)
}
function vi(e) {
    return x(t => Wp(e, t))
}
var {isArray: qp} = Array
  , {getPrototypeOf: Zp, prototype: Yp, keys: Qp} = Object;
function yi(e) {
    if (e.length === 1) {
        let t = e[0];
        if (qp(t))
            return {
                args: t,
                keys: null
            };
        if (Kp(t)) {
            let n = Qp(t);
            return {
                args: n.map(r => t[r]),
                keys: n
            }
        }
    }
    return {
        args: e,
        keys: null
    }
}
function Kp(e) {
    return e && typeof e == "object" && Zp(e) === Yp
}
function Di(e, t) {
    return e.reduce( (n, r, i) => (n[r] = t[i],
    n), {})
}
function wi(...e) {
    let t = Ge(e)
      , n = ii(e)
      , {args: r, keys: i} = yi(e);
    if (r.length === 0)
        return W([], t);
    let o = new k(Jp(r, t, i ? s => Di(i, s) : le));
    return n ? o.pipe(vi(n)) : o
}
function Jp(e, t, n=le) {
    return r => {
        tl(t, () => {
            let {length: i} = e
              , o = new Array(i)
              , s = i
              , a = i;
            for (let u = 0; u < i; u++)
                tl(t, () => {
                    let c = W(e[u], t)
                      , l = !1;
                    c.subscribe(R(r, d => {
                        o[u] = d,
                        l || (l = !0,
                        a--),
                        a || r.next(n(o.slice()))
                    }
                    , () => {
                        --s || r.complete()
                    }
                    ))
                }
                , r)
        }
        , r)
    }
}
function tl(e, t, n) {
    e ? we(n, e, t) : t()
}
function nl(e, t, n, r, i, o, s, a) {
    let u = []
      , c = 0
      , l = 0
      , d = !1
      , f = () => {
        d && !u.length && !c && t.complete()
    }
      , h = b => c < r ? p(b) : u.push(b)
      , p = b => {
        o && t.next(b),
        c++;
        let y = !1;
        G(n(b, l++)).subscribe(R(t, m => {
            i?.(m),
            o ? h(m) : t.next(m)
        }
        , () => {
            y = !0
        }
        , void 0, () => {
            if (y)
                try {
                    for (c--; u.length && c < r; ) {
                        let m = u.shift();
                        s ? we(t, s, () => p(m)) : p(m)
                    }
                    f()
                } catch (m) {
                    t.error(m)
                }
        }
        ))
    }
    ;
    return e.subscribe(R(t, h, () => {
        d = !0,
        f()
    }
    )),
    () => {
        a?.()
    }
}
function ee(e, t, n=1 / 0) {
    return _(t) ? ee( (r, i) => x( (o, s) => t(r, o, i, s))(G(e(r, i))), n) : (typeof t == "number" && (n = t),
    O( (r, i) => nl(r, i, e, n)))
}
function Zn(e=1 / 0) {
    return ee(le, e)
}
function rl() {
    return Zn(1)
}
function dn(...e) {
    return rl()(W(e, Ge(e)))
}
function Ci(e) {
    return new k(t => {
        G(e()).subscribe(t)
    }
    )
}
function Ts(...e) {
    let t = ii(e)
      , {args: n, keys: r} = yi(e)
      , i = new k(o => {
        let {length: s} = n;
        if (!s) {
            o.complete();
            return
        }
        let a = new Array(s)
          , u = s
          , c = s;
        for (let l = 0; l < s; l++) {
            let d = !1;
            G(n[l]).subscribe(R(o, f => {
                d || (d = !0,
                c--),
                a[l] = f
            }
            , () => u--, void 0, () => {
                (!u || !d) && (c || o.next(r ? Di(r, a) : a),
                o.complete())
            }
            ))
        }
    }
    );
    return t ? i.pipe(vi(t)) : i
}
function xs(...e) {
    let t = Ge(e)
      , n = Hc(e, 1 / 0)
      , r = e;
    return r.length ? r.length === 1 ? G(r[0]) : Zn(n)(W(r, t)) : De
}
function Ie(e, t) {
    return O( (n, r) => {
        let i = 0;
        n.subscribe(R(r, o => e.call(t, o, i++) && r.next(o)))
    }
    )
}
function pt(e) {
    return O( (t, n) => {
        let r = null, i = !1, o;
        r = t.subscribe(R(n, void 0, void 0, s => {
            o = G(e(s, pt(e)(t))),
            r ? (r.unsubscribe(),
            r = null,
            o.subscribe(n)) : i = !0
        }
        )),
        i && (r.unsubscribe(),
        r = null,
        o.subscribe(n))
    }
    )
}
function il(e, t, n, r, i) {
    return (o, s) => {
        let a = n
          , u = t
          , c = 0;
        o.subscribe(R(s, l => {
            let d = c++;
            u = a ? e(u, l, d) : (a = !0,
            l),
            r && s.next(u)
        }
        , i && ( () => {
            a && s.next(u),
            s.complete()
        }
        )))
    }
}
function gt(e, t) {
    return _(t) ? ee(e, t, 1) : ee(e, 1)
}
function mt(e) {
    return O( (t, n) => {
        let r = !1;
        t.subscribe(R(n, i => {
            r = !0,
            n.next(i)
        }
        , () => {
            r || n.next(e),
            n.complete()
        }
        ))
    }
    )
}
function nt(e) {
    return e <= 0 ? () => De : O( (t, n) => {
        let r = 0;
        t.subscribe(R(n, i => {
            ++r <= e && (n.next(i),
            e <= r && n.complete())
        }
        ))
    }
    )
}
function As(e) {
    return x( () => e)
}
function Ns(e, t=le) {
    return e = e ?? Xp,
    O( (n, r) => {
        let i, o = !0;
        n.subscribe(R(r, s => {
            let a = t(s);
            (o || !e(i, a)) && (o = !1,
            i = a,
            r.next(s))
        }
        ))
    }
    )
}
function Xp(e, t) {
    return e === t
}
function Ei(e=eg) {
    return O( (t, n) => {
        let r = !1;
        t.subscribe(R(n, i => {
            r = !0,
            n.next(i)
        }
        , () => r ? n.complete() : n.error(e())))
    }
    )
}
function eg() {
    return new tt
}
function Ot(e) {
    return O( (t, n) => {
        try {
            t.subscribe(n)
        } finally {
            n.add(e)
        }
    }
    )
}
function We(e, t) {
    let n = arguments.length >= 2;
    return r => r.pipe(e ? Ie( (i, o) => e(i, o, r)) : le, nt(1), n ? mt(t) : Ei( () => new tt))
}
function fn(e) {
    return e <= 0 ? () => De : O( (t, n) => {
        let r = [];
        t.subscribe(R(n, i => {
            r.push(i),
            e < r.length && r.shift()
        }
        , () => {
            for (let i of r)
                n.next(i);
            n.complete()
        }
        , void 0, () => {
            r = null
        }
        ))
    }
    )
}
function Os(e, t) {
    let n = arguments.length >= 2;
    return r => r.pipe(e ? Ie( (i, o) => e(i, o, r)) : le, fn(1), n ? mt(t) : Ei( () => new tt))
}
function Rs(e, t) {
    return O(il(e, t, arguments.length >= 2, !0))
}
function bi(e={}) {
    let {connector: t= () => new de, resetOnError: n=!0, resetOnComplete: r=!0, resetOnRefCountZero: i=!0} = e;
    return o => {
        let s, a, u, c = 0, l = !1, d = !1, f = () => {
            a?.unsubscribe(),
            a = void 0
        }
        , h = () => {
            f(),
            s = u = void 0,
            l = d = !1
        }
        , p = () => {
            let b = s;
            h(),
            b?.unsubscribe()
        }
        ;
        return O( (b, y) => {
            c++,
            !d && !l && f();
            let m = u = u ?? t();
            y.add( () => {
                c--,
                c === 0 && !d && !l && (a = Fs(p, i))
            }
            ),
            m.subscribe(y),
            !s && c > 0 && (s = new et({
                next: Q => m.next(Q),
                error: Q => {
                    d = !0,
                    f(),
                    a = Fs(h, n, Q),
                    m.error(Q)
                }
                ,
                complete: () => {
                    l = !0,
                    f(),
                    a = Fs(h, r),
                    m.complete()
                }
            }),
            G(b).subscribe(s))
        }
        )(o)
    }
}
function Fs(e, t, ...n) {
    if (t === !0) {
        e();
        return
    }
    if (t === !1)
        return;
    let r = new et({
        next: () => {
            r.unsubscribe(),
            e()
        }
    });
    return G(t(...n)).subscribe(r)
}
function Ps(...e) {
    let t = Ge(e);
    return O( (n, r) => {
        (t ? dn(e, n, t) : dn(e, n)).subscribe(r)
    }
    )
}
function fe(e, t) {
    return O( (n, r) => {
        let i = null
          , o = 0
          , s = !1
          , a = () => s && !i && r.complete();
        n.subscribe(R(r, u => {
            i?.unsubscribe();
            let c = 0
              , l = o++;
            G(e(u, l)).subscribe(i = R(r, d => r.next(t ? t(u, d, l, c++) : d), () => {
                i = null,
                a()
            }
            ))
        }
        , () => {
            s = !0,
            a()
        }
        ))
    }
    )
}
function ks(e) {
    return O( (t, n) => {
        G(e).subscribe(R(n, () => n.complete(), qn)),
        !n.closed && t.subscribe(n)
    }
    )
}
function te(e, t, n) {
    let r = _(e) || t || n ? {
        next: e,
        error: t,
        complete: n
    } : e;
    return r ? O( (i, o) => {
        var s;
        (s = r.subscribe) === null || s === void 0 || s.call(r);
        let a = !0;
        i.subscribe(R(o, u => {
            var c;
            (c = r.next) === null || c === void 0 || c.call(r, u),
            o.next(u)
        }
        , () => {
            var u;
            a = !1,
            (u = r.complete) === null || u === void 0 || u.call(r),
            o.complete()
        }
        , u => {
            var c;
            a = !1,
            (c = r.error) === null || c === void 0 || c.call(r, u),
            o.error(u)
        }
        , () => {
            var u, c;
            a && ((u = r.unsubscribe) === null || u === void 0 || u.call(r)),
            (c = r.finalize) === null || c === void 0 || c.call(r)
        }
        ))
    }
    ) : le
}
function $(e) {
    for (let t in e)
        if (e[t] === $)
            return t;
    throw Error("Could not find renamed property on target object.")
}
function Ii(e, t) {
    for (let n in t)
        t.hasOwnProperty(n) && !e.hasOwnProperty(n) && (e[n] = t[n])
}
function ge(e) {
    if (typeof e == "string")
        return e;
    if (Array.isArray(e))
        return "[" + e.map(ge).join(", ") + "]";
    if (e == null)
        return "" + e;
    if (e.overriddenName)
        return `${e.overriddenName}`;
    if (e.name)
        return `${e.name}`;
    let t = e.toString();
    if (t == null)
        return "" + t;
    let n = t.indexOf(`
`);
    return n === -1 ? t : t.substring(0, n)
}
function ol(e, t) {
    return e == null || e === "" ? t === null ? "" : t : t == null || t === "" ? e : e + " " + t
}
var tg = $({
    __forward_ref__: $
});
function hr(e) {
    return e.__forward_ref__ = hr,
    e.toString = function() {
        return ge(this())
    }
    ,
    e
}
function he(e) {
    return Ul(e) ? e() : e
}
function Ul(e) {
    return typeof e == "function" && e.hasOwnProperty(tg) && e.__forward_ref__ === hr
}
function $l(e) {
    return e && !!e.\u0275providers
}
var ng = "https://g.co/ng/security#xss"
  , D = class extends Error {
    constructor(t, n) {
        super(Ji(t, n)),
        this.code = t
    }
}
;
function Ji(e, t) {
    return `${`NG0${Math.abs(e)}`}${t ? ": " + t : ""}`
}
var rg = $({
    \u0275cmp: $
})
  , ig = $({
    \u0275dir: $
})
  , og = $({
    \u0275pipe: $
})
  , sg = $({
    \u0275mod: $
})
  , Oi = $({
    \u0275fac: $
})
  , Yn = $({
    __NG_ELEMENT_ID__: $
})
  , sl = $({
    __NG_ENV_ID__: $
});
function Bl(e) {
    return typeof e == "string" ? e : e == null ? "" : String(e)
}
function ag(e) {
    return typeof e == "function" ? e.name || e.toString() : typeof e == "object" && e != null && typeof e.type == "function" ? e.type.name || e.type.toString() : Bl(e)
}
function ug(e, t) {
    let n = t ? `. Dependency path: ${t.join(" > ")} > ${e}` : "";
    throw new D(-200,`Circular dependency in DI detected for ${e}${n}`)
}
function La(e, t) {
    let n = t ? ` in ${t}` : "";
    throw new D(-201,!1)
}
function cg(e, t) {
    e == null && lg(t, e, null, "!=")
}
function lg(e, t, n, r) {
    throw new Error(`ASSERTION ERROR: ${e}` + (r == null ? "" : ` [Expected=> ${n} ${r} ${t} <=Actual]`))
}
function E(e) {
    return {
        token: e.token,
        providedIn: e.providedIn || null,
        factory: e.factory,
        value: void 0
    }
}
function Ct(e) {
    return {
        providers: e.providers || [],
        imports: e.imports || []
    }
}
function Xi(e) {
    return al(e, zl) || al(e, Gl)
}
function Hl(e) {
    return Xi(e) !== null
}
function al(e, t) {
    return e.hasOwnProperty(t) ? e[t] : null
}
function dg(e) {
    let t = e && (e[zl] || e[Gl]);
    return t || null
}
function ul(e) {
    return e && (e.hasOwnProperty(cl) || e.hasOwnProperty(fg)) ? e[cl] : null
}
var zl = $({
    \u0275prov: $
}), cl = $({
    \u0275inj: $
}), Gl = $({
    ngInjectableDef: $
}), fg = $({
    ngInjectorDef: $
}), F = function(e) {
    return e[e.Default = 0] = "Default",
    e[e.Host = 1] = "Host",
    e[e.Self = 2] = "Self",
    e[e.SkipSelf = 4] = "SkipSelf",
    e[e.Optional = 8] = "Optional",
    e
}(F || {}), ea;
function hg() {
    return ea
}
function Ce(e) {
    let t = ea;
    return ea = e,
    t
}
function Wl(e, t, n) {
    let r = Xi(e);
    if (r && r.providedIn == "root")
        return r.value === void 0 ? r.value = r.factory() : r.value;
    if (n & F.Optional)
        return null;
    if (t !== void 0)
        return t;
    La(ge(e), "Injector")
}
var rt = globalThis;
var w = class {
    constructor(t, n) {
        this._desc = t,
        this.ngMetadataName = "InjectionToken",
        this.\u0275prov = void 0,
        typeof n == "number" ? this.__NG_ELEMENT_ID__ = n : n !== void 0 && (this.\u0275prov = E({
            token: this,
            providedIn: n.providedIn || "root",
            factory: n.factory
        }))
    }
    get multi() {
        return this
    }
    toString() {
        return `InjectionToken ${this._desc}`
    }
}
;
var pg = {}, Jn = pg, gg = "__NG_DI_FLAG__", Ri = "ngTempTokenPath", mg = "ngTokenPath", vg = /\n/gm, yg = "\u0275", ll = "__source", Qn;
function vt(e) {
    let t = Qn;
    return Qn = e,
    t
}
function Dg(e, t=F.Default) {
    if (Qn === void 0)
        throw new D(-203,!1);
    return Qn === null ? Wl(e, void 0, t) : Qn.get(e, t & F.Optional ? null : void 0, t)
}
function I(e, t=F.Default) {
    return (hg() || Dg)(he(e), t)
}
function g(e, t=F.Default) {
    return I(e, eo(t))
}
function eo(e) {
    return typeof e > "u" || typeof e == "number" ? e : 0 | (e.optional && 8) | (e.host && 1) | (e.self && 2) | (e.skipSelf && 4)
}
function ta(e) {
    let t = [];
    for (let n = 0; n < e.length; n++) {
        let r = he(e[n]);
        if (Array.isArray(r)) {
            if (r.length === 0)
                throw new D(900,!1);
            let i, o = F.Default;
            for (let s = 0; s < r.length; s++) {
                let a = r[s]
                  , u = wg(a);
                typeof u == "number" ? u === -1 ? i = a.token : o |= u : i = a
            }
            t.push(I(i, o))
        } else
            t.push(I(r))
    }
    return t
}
function wg(e) {
    return e[gg]
}
function Cg(e, t, n, r) {
    let i = e[Ri];
    throw t[ll] && i.unshift(t[ll]),
    e.message = Eg(`
` + e.message, i, n, r),
    e[mg] = i,
    e[Ri] = null,
    e
}
function Eg(e, t, n, r=null) {
    e = e && e.charAt(0) === `
` && e.charAt(1) == yg ? e.slice(2) : e;
    let i = ge(t);
    if (Array.isArray(t))
        i = t.map(ge).join(" -> ");
    else if (typeof t == "object") {
        let o = [];
        for (let s in t)
            if (t.hasOwnProperty(s)) {
                let a = t[s];
                o.push(s + ":" + (typeof a == "string" ? JSON.stringify(a) : ge(a)))
            }
        i = `{${o.join(", ")}}`
    }
    return `${n}${r ? "(" + r + ")" : ""}[${i}]: ${e.replace(vg, `
  `)}`
}
function to(e) {
    return {
        toString: e
    }.toString()
}
var ql = function(e) {
    return e[e.OnPush = 0] = "OnPush",
    e[e.Default = 1] = "Default",
    e
}(ql || {})
  , Ye = function(e) {
    return e[e.Emulated = 0] = "Emulated",
    e[e.None = 2] = "None",
    e[e.ShadowDom = 3] = "ShadowDom",
    e
}(Ye || {})
  , vn = {}
  , xe = [];
function Zl(e, t, n) {
    let r = e.length;
    for (; ; ) {
        let i = e.indexOf(t, n);
        if (i === -1)
            return i;
        if (i === 0 || e.charCodeAt(i - 1) <= 32) {
            let o = t.length;
            if (i + o === r || e.charCodeAt(i + o) <= 32)
                return i
        }
        n = i + 1
    }
}
function na(e, t, n) {
    let r = 0;
    for (; r < n.length; ) {
        let i = n[r];
        if (typeof i == "number") {
            if (i !== 0)
                break;
            r++;
            let o = n[r++]
              , s = n[r++]
              , a = n[r++];
            e.setAttribute(t, s, a, o)
        } else {
            let o = i
              , s = n[++r];
            Ig(o) ? e.setProperty(t, o, s) : e.setAttribute(t, o, s),
            r++
        }
    }
    return r
}
function bg(e) {
    return e === 3 || e === 4 || e === 6
}
function Ig(e) {
    return e.charCodeAt(0) === 64
}
function Xn(e, t) {
    if (!(t === null || t.length === 0))
        if (e === null || e.length === 0)
            e = t.slice();
        else {
            let n = -1;
            for (let r = 0; r < t.length; r++) {
                let i = t[r];
                typeof i == "number" ? n = i : n === 0 || (n === -1 || n === 2 ? dl(e, n, i, null, t[++r]) : dl(e, n, i, null, null))
            }
        }
    return e
}
function dl(e, t, n, r, i) {
    let o = 0
      , s = e.length;
    if (t === -1)
        s = -1;
    else
        for (; o < e.length; ) {
            let a = e[o++];
            if (typeof a == "number") {
                if (a === t) {
                    s = -1;
                    break
                } else if (a > t) {
                    s = o - 1;
                    break
                }
            }
        }
    for (; o < e.length; ) {
        let a = e[o];
        if (typeof a == "number")
            break;
        if (a === n) {
            if (r === null) {
                i !== null && (e[o + 1] = i);
                return
            } else if (r === e[o + 1]) {
                e[o + 2] = i;
                return
            }
        }
        o++,
        r !== null && o++,
        i !== null && o++
    }
    s !== -1 && (e.splice(s, 0, t),
    o = s + 1),
    e.splice(o++, 0, n),
    r !== null && e.splice(o++, 0, r),
    i !== null && e.splice(o++, 0, i)
}
var Yl = "ng-template";
function Mg(e, t, n) {
    let r = 0
      , i = !0;
    for (; r < e.length; ) {
        let o = e[r++];
        if (typeof o == "string" && i) {
            let s = e[r++];
            if (n && o === "class" && Zl(s.toLowerCase(), t, 0) !== -1)
                return !0
        } else if (o === 1) {
            for (; r < e.length && typeof (o = e[r++]) == "string"; )
                if (o.toLowerCase() === t)
                    return !0;
            return !1
        } else
            typeof o == "number" && (i = !1)
    }
    return !1
}
function Ql(e) {
    return e.type === 4 && e.value !== Yl
}
function _g(e, t, n) {
    let r = e.type === 4 && !n ? Yl : e.value;
    return t === r
}
function Sg(e, t, n) {
    let r = 4
      , i = e.attrs || []
      , o = Ag(i)
      , s = !1;
    for (let a = 0; a < t.length; a++) {
        let u = t[a];
        if (typeof u == "number") {
            if (!s && !Pe(r) && !Pe(u))
                return !1;
            if (s && Pe(u))
                continue;
            s = !1,
            r = u | r & 1;
            continue
        }
        if (!s)
            if (r & 4) {
                if (r = 2 | r & 1,
                u !== "" && !_g(e, u, n) || u === "" && t.length === 1) {
                    if (Pe(r))
                        return !1;
                    s = !0
                }
            } else {
                let c = r & 8 ? u : t[++a];
                if (r & 8 && e.attrs !== null) {
                    if (!Mg(e.attrs, c, n)) {
                        if (Pe(r))
                            return !1;
                        s = !0
                    }
                    continue
                }
                let l = r & 8 ? "class" : u
                  , d = Tg(l, i, Ql(e), n);
                if (d === -1) {
                    if (Pe(r))
                        return !1;
                    s = !0;
                    continue
                }
                if (c !== "") {
                    let f;
                    d > o ? f = "" : f = i[d + 1].toLowerCase();
                    let h = r & 8 ? f : null;
                    if (h && Zl(h, c, 0) !== -1 || r & 2 && c !== f) {
                        if (Pe(r))
                            return !1;
                        s = !0
                    }
                }
            }
    }
    return Pe(r) || s
}
function Pe(e) {
    return (e & 1) === 0
}
function Tg(e, t, n, r) {
    if (t === null)
        return -1;
    let i = 0;
    if (r || !n) {
        let o = !1;
        for (; i < t.length; ) {
            let s = t[i];
            if (s === e)
                return i;
            if (s === 3 || s === 6)
                o = !0;
            else if (s === 1 || s === 2) {
                let a = t[++i];
                for (; typeof a == "string"; )
                    a = t[++i];
                continue
            } else {
                if (s === 4)
                    break;
                if (s === 0) {
                    i += 4;
                    continue
                }
            }
            i += o ? 1 : 2
        }
        return -1
    } else
        return Ng(t, e)
}
function xg(e, t, n=!1) {
    for (let r = 0; r < t.length; r++)
        if (Sg(e, t[r], n))
            return !0;
    return !1
}
function Ag(e) {
    for (let t = 0; t < e.length; t++) {
        let n = e[t];
        if (bg(n))
            return t
    }
    return e.length
}
function Ng(e, t) {
    let n = e.indexOf(4);
    if (n > -1)
        for (n++; n < e.length; ) {
            let r = e[n];
            if (typeof r == "number")
                return -1;
            if (r === t)
                return n;
            n++
        }
    return -1
}
function fl(e, t) {
    return e ? ":not(" + t.trim() + ")" : t
}
function Og(e) {
    let t = e[0]
      , n = 1
      , r = 2
      , i = ""
      , o = !1;
    for (; n < e.length; ) {
        let s = e[n];
        if (typeof s == "string")
            if (r & 2) {
                let a = e[++n];
                i += "[" + s + (a.length > 0 ? '="' + a + '"' : "") + "]"
            } else
                r & 8 ? i += "." + s : r & 4 && (i += " " + s);
        else
            i !== "" && !Pe(s) && (t += fl(o, i),
            i = ""),
            r = s,
            o = o || !Pe(r);
        n++
    }
    return i !== "" && (t += fl(o, i)),
    t
}
function Rg(e) {
    return e.map(Og).join(",")
}
function Fg(e) {
    let t = []
      , n = []
      , r = 1
      , i = 2;
    for (; r < e.length; ) {
        let o = e[r];
        if (typeof o == "string")
            i === 2 ? o !== "" && t.push(o, e[++r]) : i === 8 && n.push(o);
        else {
            if (!Pe(i))
                break;
            i = o
        }
        r++
    }
    return {
        attrs: t,
        classes: n
    }
}
function no(e) {
    return to( () => {
        let t = nd(e)
          , n = H(v({}, t), {
            decls: e.decls,
            vars: e.vars,
            template: e.template,
            consts: e.consts || null,
            ngContentSelectors: e.ngContentSelectors,
            onPush: e.changeDetection === ql.OnPush,
            directiveDefs: null,
            pipeDefs: null,
            dependencies: t.standalone && e.dependencies || null,
            getStandaloneInjector: null,
            signals: e.signals ?? !1,
            data: e.data || {},
            encapsulation: e.encapsulation || Ye.Emulated,
            styles: e.styles || xe,
            _: null,
            schemas: e.schemas || null,
            tView: null,
            id: ""
        });
        rd(n);
        let r = e.dependencies;
        return n.directiveDefs = pl(r, !1),
        n.pipeDefs = pl(r, !0),
        n.id = Lg(n),
        n
    }
    )
}
function Pg(e) {
    return Pt(e) || Jl(e)
}
function kg(e) {
    return e !== null
}
function Et(e) {
    return to( () => ({
        type: e.type,
        bootstrap: e.bootstrap || xe,
        declarations: e.declarations || xe,
        imports: e.imports || xe,
        exports: e.exports || xe,
        transitiveCompileScopes: null,
        schemas: e.schemas || null,
        id: e.id || null
    }))
}
function hl(e, t) {
    if (e == null)
        return vn;
    let n = {};
    for (let r in e)
        if (e.hasOwnProperty(r)) {
            let i = e[r]
              , o = i;
            Array.isArray(i) && (o = i[1],
            i = i[0]),
            n[i] = r,
            t && (t[i] = o)
        }
    return n
}
function st(e) {
    return to( () => {
        let t = nd(e);
        return rd(t),
        t
    }
    )
}
function Kl(e) {
    return {
        type: e.type,
        name: e.name,
        factory: null,
        pure: e.pure !== !1,
        standalone: e.standalone === !0,
        onDestroy: e.type.prototype.ngOnDestroy || null
    }
}
function Pt(e) {
    return e[rg] || null
}
function Jl(e) {
    return e[ig] || null
}
function Xl(e) {
    return e[og] || null
}
function ed(e) {
    let t = Pt(e) || Jl(e) || Xl(e);
    return t !== null ? t.standalone : !1
}
function td(e, t) {
    let n = e[sg] || null;
    if (!n && t === !0)
        throw new Error(`Type ${ge(e)} does not have '\u0275mod' property.`);
    return n
}
function nd(e) {
    let t = {};
    return {
        type: e.type,
        providersResolver: null,
        factory: null,
        hostBindings: e.hostBindings || null,
        hostVars: e.hostVars || 0,
        hostAttrs: e.hostAttrs || null,
        contentQueries: e.contentQueries || null,
        declaredInputs: t,
        inputTransforms: null,
        inputConfig: e.inputs || vn,
        exportAs: e.exportAs || null,
        standalone: e.standalone === !0,
        signals: e.signals === !0,
        selectors: e.selectors || xe,
        viewQuery: e.viewQuery || null,
        features: e.features || null,
        setInput: null,
        findHostDirectiveDefs: null,
        hostDirectives: null,
        inputs: hl(e.inputs, t),
        outputs: hl(e.outputs),
        debugInfo: null
    }
}
function rd(e) {
    e.features?.forEach(t => t(e))
}
function pl(e, t) {
    if (!e)
        return null;
    let n = t ? Xl : Pg;
    return () => (typeof e == "function" ? e() : e).map(r => n(r)).filter(kg)
}
function Lg(e) {
    let t = 0
      , n = [e.selectors, e.ngContentSelectors, e.hostVars, e.hostAttrs, e.consts, e.vars, e.decls, e.encapsulation, e.standalone, e.signals, e.exportAs, JSON.stringify(e.inputs), JSON.stringify(e.outputs), Object.getOwnPropertyNames(e.type.prototype), !!e.contentQueries, !!e.viewQuery].join("|");
    for (let i of n)
        t = Math.imul(31, t) + i.charCodeAt(0) << 0;
    return t += 2147483648,
    "c" + t
}
var at = 0
  , S = 1
  , M = 2
  , ne = 3
  , ke = 4
  , je = 5
  , Fi = 6
  , er = 7
  , ae = 8
  , yn = 9
  , tr = 10
  , ue = 11
  , nr = 12
  , gl = 13
  , In = 14
  , Le = 15
  , ro = 16
  , hn = 17
  , rr = 18
  , io = 19
  , id = 20
  , Kn = 21
  , Ls = 22
  , kt = 23
  , Me = 25
  , od = 1;
var Lt = 7
  , Pi = 8
  , ki = 9
  , me = 10
  , Dn = function(e) {
    return e[e.None = 0] = "None",
    e[e.HasTransplantedViews = 2] = "HasTransplantedViews",
    e[e.HasChildViewsToRefresh = 4] = "HasChildViewsToRefresh",
    e
}(Dn || {});
function yt(e) {
    return Array.isArray(e) && typeof e[od] == "object"
}
function Ve(e) {
    return Array.isArray(e) && e[od] === !0
}
function sd(e) {
    return (e.flags & 4) !== 0
}
function oo(e) {
    return e.componentOffset > -1
}
function Va(e) {
    return (e.flags & 1) === 1
}
function Dt(e) {
    return !!e.template
}
function Vg(e) {
    return (e[M] & 512) !== 0
}
function Vt(e, t) {
    let n = e.hasOwnProperty(Oi);
    return n ? e[Oi] : null
}
var ra = class {
    constructor(t, n, r) {
        this.previousValue = t,
        this.currentValue = n,
        this.firstChange = r
    }
    isFirstChange() {
        return this.firstChange
    }
}
;
function Mn() {
    return ad
}
function ad(e) {
    return e.type.prototype.ngOnChanges && (e.setInput = Ug),
    jg
}
Mn.ngInherit = !0;
function jg() {
    let e = cd(this)
      , t = e?.current;
    if (t) {
        let n = e.previous;
        if (n === vn)
            e.previous = t;
        else
            for (let r in t)
                n[r] = t[r];
        e.current = null,
        this.ngOnChanges(t)
    }
}
function Ug(e, t, n, r) {
    let i = this.declaredInputs[n]
      , o = cd(e) || $g(e, {
        previous: vn,
        current: null
    })
      , s = o.current || (o.current = {})
      , a = o.previous
      , u = a[i];
    s[i] = new ra(u && u.currentValue,t,a === vn),
    e[r] = t
}
var ud = "__ngSimpleChanges__";
function cd(e) {
    return e[ud] || null
}
function $g(e, t) {
    return e[ud] = t
}
var ml = null;
var qe = function(e, t, n) {
    ml?.(e, t, n)
}
  , Bg = "svg"
  , Hg = "math";
function Qe(e) {
    for (; Array.isArray(e); )
        e = e[at];
    return e
}
function ld(e, t) {
    return Qe(t[e])
}
function Ue(e, t) {
    return Qe(t[e.index])
}
function ja(e, t) {
    return e.data[t]
}
function zg(e, t) {
    return e[t]
}
function bt(e, t) {
    let n = t[e];
    return yt(n) ? n : n[at]
}
function Ua(e) {
    return (e[M] & 128) === 128
}
function Gg(e) {
    return Ve(e[ne])
}
function Li(e, t) {
    return t == null ? null : e[t]
}
function dd(e) {
    e[hn] = 0
}
function Wg(e) {
    e[M] & 1024 || (e[M] |= 1024,
    Ua(e) && so(e))
}
function qg(e, t) {
    for (; e > 0; )
        t = t[In],
        e--;
    return t
}
function fd(e) {
    return e[M] & 9216 || e[kt]?.dirty
}
function hd(e) {
    fd(e) && so(e)
}
function so(e) {
    let t = e[ne];
    for (; t !== null && !(Ve(t) && t[M] & Dn.HasChildViewsToRefresh || yt(t) && t[M] & 8192); ) {
        if (Ve(t))
            t[M] |= Dn.HasChildViewsToRefresh;
        else if (t[M] |= 8192,
        !Ua(t))
            break;
        t = t[ne]
    }
}
function Zg(e, t) {
    if ((e[M] & 256) === 256)
        throw new D(911,!1);
    e[Kn] === null && (e[Kn] = []),
    e[Kn].push(t)
}
var P = {
    lFrame: wd(null),
    bindingsEnabled: !0,
    skipHydrationRootTNode: null
};
function Yg() {
    return P.lFrame.elementDepthCount
}
function Qg() {
    P.lFrame.elementDepthCount++
}
function Kg() {
    P.lFrame.elementDepthCount--
}
function pd() {
    return P.bindingsEnabled
}
function Jg() {
    return P.skipHydrationRootTNode !== null
}
function Xg(e) {
    return P.skipHydrationRootTNode === e
}
function em() {
    P.skipHydrationRootTNode = null
}
function Z() {
    return P.lFrame.lView
}
function $e() {
    return P.lFrame.tView
}
function pr(e) {
    return P.lFrame.contextLView = e,
    e[ae]
}
function gr(e) {
    return P.lFrame.contextLView = null,
    e
}
function Be() {
    let e = gd();
    for (; e !== null && e.type === 64; )
        e = e.parent;
    return e
}
function gd() {
    return P.lFrame.currentTNode
}
function tm() {
    let e = P.lFrame
      , t = e.currentTNode;
    return e.isParent ? t : t.parent
}
function mr(e, t) {
    let n = P.lFrame;
    n.currentTNode = e,
    n.isParent = t
}
function md() {
    return P.lFrame.isParent
}
function nm() {
    P.lFrame.isParent = !1
}
function rm() {
    let e = P.lFrame
      , t = e.bindingRootIndex;
    return t === -1 && (t = e.bindingRootIndex = e.tView.bindingStartIndex),
    t
}
function im(e) {
    return P.lFrame.bindingIndex = e
}
function ao() {
    return P.lFrame.bindingIndex++
}
function om(e) {
    let t = P.lFrame
      , n = t.bindingIndex;
    return t.bindingIndex = t.bindingIndex + e,
    n
}
function sm() {
    return P.lFrame.inI18n
}
function am(e, t) {
    let n = P.lFrame;
    n.bindingIndex = n.bindingRootIndex = e,
    ia(t)
}
function um() {
    return P.lFrame.currentDirectiveIndex
}
function ia(e) {
    P.lFrame.currentDirectiveIndex = e
}
function cm(e) {
    let t = P.lFrame.currentDirectiveIndex;
    return t === -1 ? null : e[t]
}
function vd(e) {
    P.lFrame.currentQueryIndex = e
}
function lm(e) {
    let t = e[S];
    return t.type === 2 ? t.declTNode : t.type === 1 ? e[je] : null
}
function yd(e, t, n) {
    if (n & F.SkipSelf) {
        let i = t
          , o = e;
        for (; i = i.parent,
        i === null && !(n & F.Host); )
            if (i = lm(o),
            i === null || (o = o[In],
            i.type & 10))
                break;
        if (i === null)
            return !1;
        t = i,
        e = o
    }
    let r = P.lFrame = Dd();
    return r.currentTNode = t,
    r.lView = e,
    !0
}
function $a(e) {
    let t = Dd()
      , n = e[S];
    P.lFrame = t,
    t.currentTNode = n.firstChild,
    t.lView = e,
    t.tView = n,
    t.contextLView = e,
    t.bindingIndex = n.bindingStartIndex,
    t.inI18n = !1
}
function Dd() {
    let e = P.lFrame
      , t = e === null ? null : e.child;
    return t === null ? wd(e) : t
}
function wd(e) {
    let t = {
        currentTNode: null,
        isParent: !0,
        lView: null,
        tView: null,
        selectedIndex: -1,
        contextLView: null,
        elementDepthCount: 0,
        currentNamespace: null,
        currentDirectiveIndex: -1,
        bindingRootIndex: -1,
        bindingIndex: -1,
        currentQueryIndex: 0,
        parent: e,
        child: null,
        inI18n: !1
    };
    return e !== null && (e.child = t),
    t
}
function Cd() {
    let e = P.lFrame;
    return P.lFrame = e.parent,
    e.currentTNode = null,
    e.lView = null,
    e
}
var Ed = Cd;
function Ba() {
    let e = Cd();
    e.isParent = !0,
    e.tView = null,
    e.selectedIndex = -1,
    e.contextLView = null,
    e.elementDepthCount = 0,
    e.currentDirectiveIndex = -1,
    e.currentNamespace = null,
    e.bindingRootIndex = -1,
    e.bindingIndex = -1,
    e.currentQueryIndex = 0
}
function dm(e) {
    return (P.lFrame.contextLView = qg(e, P.lFrame.contextLView))[ae]
}
function Gt() {
    return P.lFrame.selectedIndex
}
function jt(e) {
    P.lFrame.selectedIndex = e
}
function fm() {
    let e = P.lFrame;
    return ja(e.tView, e.selectedIndex)
}
function hm() {
    return P.lFrame.currentNamespace
}
var bd = !0;
function Ha() {
    return bd
}
function za(e) {
    bd = e
}
function pm(e, t, n) {
    let {ngOnChanges: r, ngOnInit: i, ngDoCheck: o} = t.type.prototype;
    if (r) {
        let s = ad(t);
        (n.preOrderHooks ??= []).push(e, s),
        (n.preOrderCheckHooks ??= []).push(e, s)
    }
    i && (n.preOrderHooks ??= []).push(0 - e, i),
    o && ((n.preOrderHooks ??= []).push(e, o),
    (n.preOrderCheckHooks ??= []).push(e, o))
}
function Ga(e, t) {
    for (let n = t.directiveStart, r = t.directiveEnd; n < r; n++) {
        let o = e.data[n].type.prototype
          , {ngAfterContentInit: s, ngAfterContentChecked: a, ngAfterViewInit: u, ngAfterViewChecked: c, ngOnDestroy: l} = o;
        s && (e.contentHooks ??= []).push(-n, s),
        a && ((e.contentHooks ??= []).push(n, a),
        (e.contentCheckHooks ??= []).push(n, a)),
        u && (e.viewHooks ??= []).push(-n, u),
        c && ((e.viewHooks ??= []).push(n, c),
        (e.viewCheckHooks ??= []).push(n, c)),
        l != null && (e.destroyHooks ??= []).push(n, l)
    }
}
function Si(e, t, n) {
    Id(e, t, 3, n)
}
function Ti(e, t, n, r) {
    (e[M] & 3) === n && Id(e, t, n, r)
}
function Vs(e, t) {
    let n = e[M];
    (n & 3) === t && (n &= 16383,
    n += 1,
    e[M] = n)
}
function Id(e, t, n, r) {
    let i = r !== void 0 ? e[hn] & 65535 : 0
      , o = r ?? -1
      , s = t.length - 1
      , a = 0;
    for (let u = i; u < s; u++)
        if (typeof t[u + 1] == "number") {
            if (a = t[u],
            r != null && a >= r)
                break
        } else
            t[u] < 0 && (e[hn] += 65536),
            (a < o || o == -1) && (gm(e, n, t, u),
            e[hn] = (e[hn] & 4294901760) + u + 2),
            u++
}
function vl(e, t) {
    qe(4, e, t);
    let n = oe(null);
    try {
        t.call(e)
    } finally {
        oe(n),
        qe(5, e, t)
    }
}
function gm(e, t, n, r) {
    let i = n[r] < 0
      , o = n[r + 1]
      , s = i ? -n[r] : n[r]
      , a = e[s];
    i ? e[M] >> 14 < e[hn] >> 16 && (e[M] & 3) === t && (e[M] += 16384,
    vl(a, o)) : vl(a, o)
}
var mn = -1
  , Ut = class {
    constructor(t, n, r) {
        this.factory = t,
        this.resolving = !1,
        this.canSeeViewProviders = n,
        this.injectImpl = r
    }
}
;
function mm(e) {
    return e instanceof Ut
}
function vm(e) {
    return (e.flags & 8) !== 0
}
function ym(e) {
    return (e.flags & 16) !== 0
}
function Md(e) {
    return e !== mn
}
function Vi(e) {
    let t = e & 32767;
    return e & 32767
}
function Dm(e) {
    return e >> 16
}
function ji(e, t) {
    let n = Dm(e)
      , r = t;
    for (; n > 0; )
        r = r[In],
        n--;
    return r
}
var oa = !0;
function Ui(e) {
    let t = oa;
    return oa = e,
    t
}
var wm = 256
  , _d = wm - 1
  , Sd = 5
  , Cm = 0
  , Ze = {};
function Em(e, t, n) {
    let r;
    typeof n == "string" ? r = n.charCodeAt(0) || 0 : n.hasOwnProperty(Yn) && (r = n[Yn]),
    r == null && (r = n[Yn] = Cm++);
    let i = r & _d
      , o = 1 << i;
    t.data[e + (i >> Sd)] |= o
}
function $i(e, t) {
    let n = Td(e, t);
    if (n !== -1)
        return n;
    let r = t[S];
    r.firstCreatePass && (e.injectorIndex = t.length,
    js(r.data, e),
    js(t, null),
    js(r.blueprint, null));
    let i = Wa(e, t)
      , o = e.injectorIndex;
    if (Md(i)) {
        let s = Vi(i)
          , a = ji(i, t)
          , u = a[S].data;
        for (let c = 0; c < 8; c++)
            t[o + c] = a[s + c] | u[s + c]
    }
    return t[o + 8] = i,
    o
}
function js(e, t) {
    e.push(0, 0, 0, 0, 0, 0, 0, 0, t)
}
function Td(e, t) {
    return e.injectorIndex === -1 || e.parent && e.parent.injectorIndex === e.injectorIndex || t[e.injectorIndex + 8] === null ? -1 : e.injectorIndex
}
function Wa(e, t) {
    if (e.parent && e.parent.injectorIndex !== -1)
        return e.parent.injectorIndex;
    let n = 0
      , r = null
      , i = t;
    for (; i !== null; ) {
        if (r = Rd(i),
        r === null)
            return mn;
        if (n++,
        i = i[In],
        r.injectorIndex !== -1)
            return r.injectorIndex | n << 16
    }
    return mn
}
function sa(e, t, n) {
    Em(e, t, n)
}
function xd(e, t, n) {
    if (n & F.Optional || e !== void 0)
        return e;
    La(t, "NodeInjector")
}
function Ad(e, t, n, r) {
    if (n & F.Optional && r === void 0 && (r = null),
    !(n & (F.Self | F.Host))) {
        let i = e[yn]
          , o = Ce(void 0);
        try {
            return i ? i.get(t, r, n & F.Optional) : Wl(t, r, n & F.Optional)
        } finally {
            Ce(o)
        }
    }
    return xd(r, t, n)
}
function Nd(e, t, n, r=F.Default, i) {
    if (e !== null) {
        if (t[M] & 2048 && !(r & F.Self)) {
            let s = Sm(e, t, n, r, Ze);
            if (s !== Ze)
                return s
        }
        let o = Od(e, t, n, r, Ze);
        if (o !== Ze)
            return o
    }
    return Ad(t, n, r, i)
}
function Od(e, t, n, r, i) {
    let o = Mm(n);
    if (typeof o == "function") {
        if (!yd(t, e, r))
            return r & F.Host ? xd(i, n, r) : Ad(t, n, r, i);
        try {
            let s;
            if (s = o(r),
            s == null && !(r & F.Optional))
                La(n);
            else
                return s
        } finally {
            Ed()
        }
    } else if (typeof o == "number") {
        let s = null
          , a = Td(e, t)
          , u = mn
          , c = r & F.Host ? t[Le][je] : null;
        for ((a === -1 || r & F.SkipSelf) && (u = a === -1 ? Wa(e, t) : t[a + 8],
        u === mn || !Dl(r, !1) ? a = -1 : (s = t[S],
        a = Vi(u),
        t = ji(u, t))); a !== -1; ) {
            let l = t[S];
            if (yl(o, a, l.data)) {
                let d = bm(a, t, n, s, r, c);
                if (d !== Ze)
                    return d
            }
            u = t[a + 8],
            u !== mn && Dl(r, t[S].data[a + 8] === c) && yl(o, a, t) ? (s = l,
            a = Vi(u),
            t = ji(u, t)) : a = -1
        }
    }
    return i
}
function bm(e, t, n, r, i, o) {
    let s = t[S]
      , a = s.data[e + 8]
      , u = r == null ? oo(a) && oa : r != s && (a.type & 3) !== 0
      , c = i & F.Host && o === a
      , l = Im(a, s, n, u, c);
    return l !== null ? wn(t, s, l, a) : Ze
}
function Im(e, t, n, r, i) {
    let o = e.providerIndexes
      , s = t.data
      , a = o & 1048575
      , u = e.directiveStart
      , c = e.directiveEnd
      , l = o >> 20
      , d = r ? a : a + l
      , f = i ? a + l : c;
    for (let h = d; h < f; h++) {
        let p = s[h];
        if (h < u && n === p || h >= u && p.type === n)
            return h
    }
    if (i) {
        let h = s[u];
        if (h && Dt(h) && h.type === n)
            return u
    }
    return null
}
function wn(e, t, n, r) {
    let i = e[n]
      , o = t.data;
    if (mm(i)) {
        let s = i;
        s.resolving && ug(ag(o[n]));
        let a = Ui(s.canSeeViewProviders);
        s.resolving = !0;
        let u, c = s.injectImpl ? Ce(s.injectImpl) : null, l = yd(e, r, F.Default);
        try {
            i = e[n] = s.factory(void 0, o, e, r),
            t.firstCreatePass && n >= r.directiveStart && pm(n, o[n], t)
        } finally {
            c !== null && Ce(c),
            Ui(a),
            s.resolving = !1,
            Ed()
        }
    }
    return i
}
function Mm(e) {
    if (typeof e == "string")
        return e.charCodeAt(0) || 0;
    let t = e.hasOwnProperty(Yn) ? e[Yn] : void 0;
    return typeof t == "number" ? t >= 0 ? t & _d : _m : t
}
function yl(e, t, n) {
    let r = 1 << e;
    return !!(n[t + (e >> Sd)] & r)
}
function Dl(e, t) {
    return !(e & F.Self) && !(e & F.Host && t)
}
var Ft = class {
    constructor(t, n) {
        this._tNode = t,
        this._lView = n
    }
    get(t, n, r) {
        return Nd(this._tNode, this._lView, t, eo(r), n)
    }
}
;
function _m() {
    return new Ft(Be(),Z())
}
function vr(e) {
    return to( () => {
        let t = e.prototype.constructor
          , n = t[Oi] || aa(t)
          , r = Object.prototype
          , i = Object.getPrototypeOf(e.prototype).constructor;
        for (; i && i !== r; ) {
            let o = i[Oi] || aa(i);
            if (o && o !== n)
                return o;
            i = Object.getPrototypeOf(i)
        }
        return o => new o
    }
    )
}
function aa(e) {
    return Ul(e) ? () => {
        let t = aa(he(e));
        return t && t()
    }
    : Vt(e)
}
function Sm(e, t, n, r, i) {
    let o = e
      , s = t;
    for (; o !== null && s !== null && s[M] & 2048 && !(s[M] & 512); ) {
        let a = Od(o, s, n, r | F.Self, Ze);
        if (a !== Ze)
            return a;
        let u = o.parent;
        if (!u) {
            let c = s[id];
            if (c) {
                let l = c.get(n, Ze, r);
                if (l !== Ze)
                    return l
            }
            u = Rd(s),
            s = s[In]
        }
        o = u
    }
    return i
}
function Rd(e) {
    let t = e[S]
      , n = t.type;
    return n === 2 ? t.declTNode : n === 1 ? e[je] : null
}
function Tm(e) {
    return typeof e == "function"
}
function qa(e, t) {
    e.forEach(n => Array.isArray(n) ? qa(n, t) : t(n))
}
function Fd(e, t, n) {
    t >= e.length ? e.push(n) : e.splice(t, 0, n)
}
function Bi(e, t) {
    return t >= e.length - 1 ? e.pop() : e.splice(t, 1)[0]
}
function xm(e, t) {
    let n = [];
    for (let r = 0; r < e; r++)
        n.push(t);
    return n
}
function Am(e, t, n, r) {
    let i = e.length;
    if (i == t)
        e.push(n, r);
    else if (i === 1)
        e.push(r, e[0]),
        e[0] = n;
    else {
        for (i--,
        e.push(e[i - 1], e[i]); i > t; ) {
            let o = i - 2;
            e[i] = e[o],
            i--
        }
        e[t] = n,
        e[t + 1] = r
    }
}
function Nm(e, t, n) {
    let r = yr(e, t);
    return r >= 0 ? e[r | 1] = n : (r = ~r,
    Am(e, r, t, n)),
    r
}
function Us(e, t) {
    let n = yr(e, t);
    if (n >= 0)
        return e[n | 1]
}
function yr(e, t) {
    return Om(e, t, 1)
}
function Om(e, t, n) {
    let r = 0
      , i = e.length >> n;
    for (; i !== r; ) {
        let o = r + (i - r >> 1)
          , s = e[o << n];
        if (t === s)
            return o << n;
        s > t ? i = o : r = o + 1
    }
    return ~(i << n)
}
var Dr = new w("ENVIRONMENT_INITIALIZER")
  , Pd = new w("INJECTOR",-1)
  , kd = new w("INJECTOR_DEF_TYPES")
  , Hi = class {
    get(t, n=Jn) {
        if (n === Jn) {
            let r = new Error(`NullInjectorError: No provider for ${ge(t)}!`);
            throw r.name = "NullInjectorError",
            r
        }
        return n
    }
}
;
function _n(e) {
    return {
        \u0275providers: e
    }
}
function Rm(...e) {
    return {
        \u0275providers: Ld(!0, e),
        \u0275fromNgModule: !0
    }
}
function Ld(e, ...t) {
    let n = [], r = new Set, i, o = s => {
        n.push(s)
    }
    ;
    return qa(t, s => {
        let a = s;
        ua(a, o, [], r) && (i ||= [],
        i.push(a))
    }
    ),
    i !== void 0 && Vd(i, o),
    n
}
function Vd(e, t) {
    for (let n = 0; n < e.length; n++) {
        let {ngModule: r, providers: i} = e[n];
        Za(i, o => {
            t(o, r)
        }
        )
    }
}
function ua(e, t, n, r) {
    if (e = he(e),
    !e)
        return !1;
    let i = null
      , o = ul(e)
      , s = !o && Pt(e);
    if (!o && !s) {
        let u = e.ngModule;
        if (o = ul(u),
        o)
            i = u;
        else
            return !1
    } else {
        if (s && !s.standalone)
            return !1;
        i = e
    }
    let a = r.has(i);
    if (s) {
        if (a)
            return !1;
        if (r.add(i),
        s.dependencies) {
            let u = typeof s.dependencies == "function" ? s.dependencies() : s.dependencies;
            for (let c of u)
                ua(c, t, n, r)
        }
    } else if (o) {
        if (o.imports != null && !a) {
            r.add(i);
            let c;
            try {
                qa(o.imports, l => {
                    ua(l, t, n, r) && (c ||= [],
                    c.push(l))
                }
                )
            } finally {}
            c !== void 0 && Vd(c, t)
        }
        if (!a) {
            let c = Vt(i) || ( () => new i);
            t({
                provide: i,
                useFactory: c,
                deps: xe
            }, i),
            t({
                provide: kd,
                useValue: i,
                multi: !0
            }, i),
            t({
                provide: Dr,
                useValue: () => I(i),
                multi: !0
            }, i)
        }
        let u = o.providers;
        if (u != null && !a) {
            let c = e;
            Za(u, l => {
                t(l, c)
            }
            )
        }
    } else
        return !1;
    return i !== e && e.providers !== void 0
}
function Za(e, t) {
    for (let n of e)
        $l(n) && (n = n.\u0275providers),
        Array.isArray(n) ? Za(n, t) : t(n)
}
var Fm = $({
    provide: String,
    useValue: $
});
function jd(e) {
    return e !== null && typeof e == "object" && Fm in e
}
function Pm(e) {
    return !!(e && e.useExisting)
}
function km(e) {
    return !!(e && e.useFactory)
}
function Cn(e) {
    return typeof e == "function"
}
function Lm(e) {
    return !!e.useClass
}
var uo = new w("Set Injector scope."), xi = {}, Vm = {}, $s;
function Ya() {
    return $s === void 0 && ($s = new Hi),
    $s
}
var Ee = class {
}
  , ir = class extends Ee {
    get destroyed() {
        return this._destroyed
    }
    constructor(t, n, r, i) {
        super(),
        this.parent = n,
        this.source = r,
        this.scopes = i,
        this.records = new Map,
        this._ngOnDestroyHooks = new Set,
        this._onDestroyHooks = [],
        this._destroyed = !1,
        la(t, s => this.processProvider(s)),
        this.records.set(Pd, pn(void 0, this)),
        i.has("environment") && this.records.set(Ee, pn(void 0, this));
        let o = this.records.get(uo);
        o != null && typeof o.value == "string" && this.scopes.add(o.value),
        this.injectorDefTypes = new Set(this.get(kd, xe, F.Self))
    }
    destroy() {
        this.assertNotDestroyed(),
        this._destroyed = !0;
        try {
            for (let n of this._ngOnDestroyHooks)
                n.ngOnDestroy();
            let t = this._onDestroyHooks;
            this._onDestroyHooks = [];
            for (let n of t)
                n()
        } finally {
            this.records.clear(),
            this._ngOnDestroyHooks.clear(),
            this.injectorDefTypes.clear()
        }
    }
    onDestroy(t) {
        return this.assertNotDestroyed(),
        this._onDestroyHooks.push(t),
        () => this.removeOnDestroy(t)
    }
    runInContext(t) {
        this.assertNotDestroyed();
        let n = vt(this), r = Ce(void 0), i;
        try {
            return t()
        } finally {
            vt(n),
            Ce(r)
        }
    }
    get(t, n=Jn, r=F.Default) {
        if (this.assertNotDestroyed(),
        t.hasOwnProperty(sl))
            return t[sl](this);
        r = eo(r);
        let i, o = vt(this), s = Ce(void 0);
        try {
            if (!(r & F.SkipSelf)) {
                let u = this.records.get(t);
                if (u === void 0) {
                    let c = Hm(t) && Xi(t);
                    c && this.injectableDefInScope(c) ? u = pn(ca(t), xi) : u = null,
                    this.records.set(t, u)
                }
                if (u != null)
                    return this.hydrate(t, u)
            }
            let a = r & F.Self ? Ya() : this.parent;
            return n = r & F.Optional && n === Jn ? null : n,
            a.get(t, n)
        } catch (a) {
            if (a.name === "NullInjectorError") {
                if ((a[Ri] = a[Ri] || []).unshift(ge(t)),
                o)
                    throw a;
                return Cg(a, t, "R3InjectorError", this.source)
            } else
                throw a
        } finally {
            Ce(s),
            vt(o)
        }
    }
    resolveInjectorInitializers() {
        let t = vt(this), n = Ce(void 0), r;
        try {
            let i = this.get(Dr, xe, F.Self);
            for (let o of i)
                o()
        } finally {
            vt(t),
            Ce(n)
        }
    }
    toString() {
        let t = []
          , n = this.records;
        for (let r of n.keys())
            t.push(ge(r));
        return `R3Injector[${t.join(", ")}]`
    }
    assertNotDestroyed() {
        if (this._destroyed)
            throw new D(205,!1)
    }
    processProvider(t) {
        t = he(t);
        let n = Cn(t) ? t : he(t && t.provide)
          , r = Um(t);
        if (!Cn(t) && t.multi === !0) {
            let i = this.records.get(n);
            i || (i = pn(void 0, xi, !0),
            i.factory = () => ta(i.multi),
            this.records.set(n, i)),
            n = t,
            i.multi.push(t)
        } else {
            let i = this.records.get(n)
        }
        this.records.set(n, r)
    }
    hydrate(t, n) {
        return n.value === xi && (n.value = Vm,
        n.value = n.factory()),
        typeof n.value == "object" && n.value && Bm(n.value) && this._ngOnDestroyHooks.add(n.value),
        n.value
    }
    injectableDefInScope(t) {
        if (!t.providedIn)
            return !1;
        let n = he(t.providedIn);
        return typeof n == "string" ? n === "any" || this.scopes.has(n) : this.injectorDefTypes.has(n)
    }
    removeOnDestroy(t) {
        let n = this._onDestroyHooks.indexOf(t);
        n !== -1 && this._onDestroyHooks.splice(n, 1)
    }
}
;
function ca(e) {
    let t = Xi(e)
      , n = t !== null ? t.factory : Vt(e);
    if (n !== null)
        return n;
    if (e instanceof w)
        throw new D(204,!1);
    if (e instanceof Function)
        return jm(e);
    throw new D(204,!1)
}
function jm(e) {
    let t = e.length;
    if (t > 0) {
        let r = xm(t, "?");
        throw new D(204,!1)
    }
    let n = dg(e);
    return n !== null ? () => n.factory(e) : () => new e
}
function Um(e) {
    if (jd(e))
        return pn(void 0, e.useValue);
    {
        let t = Ud(e);
        return pn(t, xi)
    }
}
function Ud(e, t, n) {
    let r;
    if (Cn(e)) {
        let i = he(e);
        return Vt(i) || ca(i)
    } else if (jd(e))
        r = () => he(e.useValue);
    else if (km(e))
        r = () => e.useFactory(...ta(e.deps || []));
    else if (Pm(e))
        r = () => I(he(e.useExisting));
    else {
        let i = he(e && (e.useClass || e.provide));
        if ($m(e))
            r = () => new i(...ta(e.deps));
        else
            return Vt(i) || ca(i)
    }
    return r
}
function pn(e, t, n=!1) {
    return {
        factory: e,
        value: t,
        multi: n ? [] : void 0
    }
}
function $m(e) {
    return !!e.deps
}
function Bm(e) {
    return e !== null && typeof e == "object" && typeof e.ngOnDestroy == "function"
}
function Hm(e) {
    return typeof e == "function" || typeof e == "object" && e instanceof w
}
function la(e, t) {
    for (let n of e)
        Array.isArray(n) ? la(n, t) : n && $l(n) ? la(n.\u0275providers, t) : t(n)
}
function ut(e, t) {
    e instanceof ir && e.assertNotDestroyed();
    let n, r = vt(e), i = Ce(void 0);
    try {
        return t()
    } finally {
        vt(r),
        Ce(i)
    }
}
function wl(e, t=null, n=null, r) {
    let i = $d(e, t, n, r);
    return i.resolveInjectorInitializers(),
    i
}
function $d(e, t=null, n=null, r, i=new Set) {
    let o = [n || xe, Rm(e)];
    return r = r || (typeof e == "object" ? void 0 : ge(e)),
    new ir(o,t || Ya(),r || null,i)
}
var Wt = ( () => {
    let t = class t {
        static create(r, i) {
            if (Array.isArray(r))
                return wl({
                    name: ""
                }, i, r, "");
            {
                let o = r.name ?? "";
                return wl({
                    name: o
                }, r.parent, r.providers, o)
            }
        }
    }
    ;
    t.THROW_IF_NOT_FOUND = Jn,
    t.NULL = new Hi,
    t.\u0275prov = E({
        token: t,
        providedIn: "any",
        factory: () => I(Pd)
    }),
    t.__NG_ELEMENT_ID__ = -1;
    let e = t;
    return e
}
)();
var da;
function Bd(e) {
    da = e
}
function zm() {
    if (da !== void 0)
        return da;
    if (typeof document < "u")
        return document;
    throw new D(210,!1)
}
var Qa = new w("AppId",{
    providedIn: "root",
    factory: () => Gm
})
  , Gm = "ng"
  , Ka = new w("Platform Initializer")
  , It = new w("Platform ID",{
    providedIn: "platform",
    factory: () => "unknown"
});
var Ja = new w("CSP nonce",{
    providedIn: "root",
    factory: () => zm().body?.querySelector("[ngCspNonce]")?.getAttribute("ngCspNonce") || null
});
function Hd(e) {
    return e instanceof Function ? e() : e
}
function zd(e) {
    return (e.flags & 128) === 128
}
var it = function(e) {
    return e[e.Important = 1] = "Important",
    e[e.DashCase = 2] = "DashCase",
    e
}(it || {});
var Gd = new Map
  , Wm = 0;
function qm() {
    return Wm++
}
function Zm(e) {
    Gd.set(e[io], e)
}
function Ym(e) {
    Gd.delete(e[io])
}
var Cl = "__ngContext__";
function $t(e, t) {
    yt(t) ? (e[Cl] = t[io],
    Zm(t)) : e[Cl] = t
}
var Qm;
function Xa(e, t) {
    return Qm(e, t)
}
function eu(e) {
    let t = e[ne];
    return Ve(t) ? t[ne] : t
}
function Wd(e) {
    return Zd(e[nr])
}
function qd(e) {
    return Zd(e[ke])
}
function Zd(e) {
    for (; e !== null && !Ve(e); )
        e = e[ke];
    return e
}
function gn(e, t, n, r, i) {
    if (r != null) {
        let o, s = !1;
        Ve(r) ? o = r : yt(r) && (s = !0,
        r = r[at]);
        let a = Qe(r);
        e === 0 && n !== null ? i == null ? Kd(t, n, a) : zi(t, n, a, i || null, !0) : e === 1 && n !== null ? zi(t, n, a, i || null, !0) : e === 2 ? pv(t, a, s) : e === 3 && t.destroyNode(a),
        o != null && mv(t, e, o, n, i)
    }
}
function Km(e, t) {
    return e.createText(t)
}
function Jm(e, t, n) {
    e.setValue(t, n)
}
function Yd(e, t, n) {
    return e.createElement(t, n)
}
function Xm(e, t) {
    let n = t[ue];
    wr(e, t, n, 2, null, null),
    t[at] = null,
    t[je] = null
}
function ev(e, t, n, r, i, o) {
    r[at] = i,
    r[je] = t,
    wr(e, r, n, 1, i, o)
}
function tv(e, t) {
    wr(e, t, t[ue], 2, null, null)
}
function nv(e) {
    let t = e[nr];
    if (!t)
        return Bs(e[S], e);
    for (; t; ) {
        let n = null;
        if (yt(t))
            n = t[nr];
        else {
            let r = t[me];
            r && (n = r)
        }
        if (!n) {
            for (; t && !t[ke] && t !== e; )
                yt(t) && Bs(t[S], t),
                t = t[ne];
            t === null && (t = e),
            yt(t) && Bs(t[S], t),
            n = t && t[ke]
        }
        t = n
    }
}
function rv(e, t, n, r) {
    let i = me + r
      , o = n.length;
    r > 0 && (n[i - 1][ke] = t),
    r < o - me ? (t[ke] = n[i],
    Fd(n, me + r, t)) : (n.push(t),
    t[ke] = null),
    t[ne] = n;
    let s = t[ro];
    s !== null && n !== s && iv(s, t);
    let a = t[rr];
    a !== null && a.insertView(e),
    hd(t),
    t[M] |= 128
}
function iv(e, t) {
    let n = e[ki]
      , i = t[ne][ne][Le];
    t[Le] !== i && (e[M] |= Dn.HasTransplantedViews),
    n === null ? e[ki] = [t] : n.push(t)
}
function Qd(e, t) {
    let n = e[ki]
      , r = n.indexOf(t)
      , i = t[ne];
    n.splice(r, 1)
}
function or(e, t) {
    if (e.length <= me)
        return;
    let n = me + t
      , r = e[n];
    if (r) {
        let i = r[ro];
        i !== null && i !== e && Qd(i, r),
        t > 0 && (e[n - 1][ke] = r[ke]);
        let o = Bi(e, me + t);
        Xm(r[S], r);
        let s = o[rr];
        s !== null && s.detachView(o[S]),
        r[ne] = null,
        r[ke] = null,
        r[M] &= -129
    }
    return r
}
function co(e, t) {
    if (!(t[M] & 256)) {
        let n = t[ue];
        t[kt] && Rc(t[kt]),
        n.destroyNode && wr(e, t, n, 3, null, null),
        nv(t)
    }
}
function Bs(e, t) {
    if (!(t[M] & 256)) {
        t[M] &= -129,
        t[M] |= 256,
        sv(e, t),
        ov(e, t),
        t[S].type === 1 && t[ue].destroy();
        let n = t[ro];
        if (n !== null && Ve(t[ne])) {
            n !== t[ne] && Qd(n, t);
            let r = t[rr];
            r !== null && r.detachView(e)
        }
        Ym(t)
    }
}
function ov(e, t) {
    let n = e.cleanup
      , r = t[er];
    if (n !== null)
        for (let o = 0; o < n.length - 1; o += 2)
            if (typeof n[o] == "string") {
                let s = n[o + 3];
                s >= 0 ? r[s]() : r[-s].unsubscribe(),
                o += 2
            } else {
                let s = r[n[o + 1]];
                n[o].call(s)
            }
    r !== null && (t[er] = null);
    let i = t[Kn];
    if (i !== null) {
        t[Kn] = null;
        for (let o = 0; o < i.length; o++) {
            let s = i[o];
            s()
        }
    }
}
function sv(e, t) {
    let n;
    if (e != null && (n = e.destroyHooks) != null)
        for (let r = 0; r < n.length; r += 2) {
            let i = t[n[r]];
            if (!(i instanceof Ut)) {
                let o = n[r + 1];
                if (Array.isArray(o))
                    for (let s = 0; s < o.length; s += 2) {
                        let a = i[o[s]]
                          , u = o[s + 1];
                        qe(4, a, u);
                        try {
                            u.call(a)
                        } finally {
                            qe(5, a, u)
                        }
                    }
                else {
                    qe(4, i, o);
                    try {
                        o.call(i)
                    } finally {
                        qe(5, i, o)
                    }
                }
            }
        }
}
function av(e, t, n) {
    return uv(e, t.parent, n)
}
function uv(e, t, n) {
    let r = t;
    for (; r !== null && r.type & 40; )
        t = r,
        r = t.parent;
    if (r === null)
        return n[at];
    {
        let {componentOffset: i} = r;
        if (i > -1) {
            let {encapsulation: o} = e.data[r.directiveStart + i];
            if (o === Ye.None || o === Ye.Emulated)
                return null
        }
        return Ue(r, n)
    }
}
function zi(e, t, n, r, i) {
    e.insertBefore(t, n, r, i)
}
function Kd(e, t, n) {
    e.appendChild(t, n)
}
function El(e, t, n, r, i) {
    r !== null ? zi(e, t, n, r, i) : Kd(e, t, n)
}
function cv(e, t, n, r) {
    e.removeChild(t, n, r)
}
function tu(e, t) {
    return e.parentNode(t)
}
function lv(e, t) {
    return e.nextSibling(t)
}
function dv(e, t, n) {
    return hv(e, t, n)
}
function fv(e, t, n) {
    return e.type & 40 ? Ue(e, n) : null
}
var hv = fv, bl;
function nu(e, t, n, r) {
    let i = av(e, r, t)
      , o = t[ue]
      , s = r.parent || t[je]
      , a = dv(s, r, t);
    if (i != null)
        if (Array.isArray(n))
            for (let u = 0; u < n.length; u++)
                El(o, i, n[u], a, !1);
        else
            El(o, i, n, a, !1);
    bl !== void 0 && bl(o, r, t, n, i)
}
function Ai(e, t) {
    if (t !== null) {
        let n = t.type;
        if (n & 3)
            return Ue(t, e);
        if (n & 4)
            return fa(-1, e[t.index]);
        if (n & 8) {
            let r = t.child;
            if (r !== null)
                return Ai(e, r);
            {
                let i = e[t.index];
                return Ve(i) ? fa(-1, i) : Qe(i)
            }
        } else {
            if (n & 32)
                return Xa(t, e)() || Qe(e[t.index]);
            {
                let r = Jd(e, t);
                if (r !== null) {
                    if (Array.isArray(r))
                        return r[0];
                    let i = eu(e[Le]);
                    return Ai(i, r)
                } else
                    return Ai(e, t.next)
            }
        }
    }
    return null
}
function Jd(e, t) {
    if (t !== null) {
        let r = e[Le][je]
          , i = t.projection;
        return r.projection[i]
    }
    return null
}
function fa(e, t) {
    let n = me + e + 1;
    if (n < t.length) {
        let r = t[n]
          , i = r[S].firstChild;
        if (i !== null)
            return Ai(r, i)
    }
    return t[Lt]
}
function pv(e, t, n) {
    let r = tu(e, t);
    r && cv(e, r, t, n)
}
function ru(e, t, n, r, i, o, s) {
    for (; n != null; ) {
        let a = r[n.index]
          , u = n.type;
        if (s && t === 0 && (a && $t(Qe(a), r),
        n.flags |= 2),
        (n.flags & 32) !== 32)
            if (u & 8)
                ru(e, t, n.child, r, i, o, !1),
                gn(t, e, i, a, o);
            else if (u & 32) {
                let c = Xa(n, r), l;
                for (; l = c(); )
                    gn(t, e, i, l, o);
                gn(t, e, i, a, o)
            } else
                u & 16 ? gv(e, t, r, n, i, o) : gn(t, e, i, a, o);
        n = s ? n.projectionNext : n.next
    }
}
function wr(e, t, n, r, i, o) {
    ru(n, r, e.firstChild, t, i, o, !1)
}
function gv(e, t, n, r, i, o) {
    let s = n[Le]
      , u = s[je].projection[r.projection];
    if (Array.isArray(u))
        for (let c = 0; c < u.length; c++) {
            let l = u[c];
            gn(t, e, i, l, o)
        }
    else {
        let c = u
          , l = s[ne];
        zd(r) && (c.flags |= 128),
        ru(e, t, c, l, i, o, !0)
    }
}
function mv(e, t, n, r, i) {
    let o = n[Lt]
      , s = Qe(n);
    o !== s && gn(t, e, r, o, i);
    for (let a = me; a < n.length; a++) {
        let u = n[a];
        wr(u[S], u, e, t, r, o)
    }
}
function vv(e, t, n, r, i) {
    if (t)
        i ? e.addClass(n, r) : e.removeClass(n, r);
    else {
        let o = r.indexOf("-") === -1 ? void 0 : it.DashCase;
        i == null ? e.removeStyle(n, r, o) : (typeof i == "string" && i.endsWith("!important") && (i = i.slice(0, -10),
        o |= it.Important),
        e.setStyle(n, r, i, o))
    }
}
function yv(e, t, n) {
    e.setAttribute(t, "style", n)
}
function Xd(e, t, n) {
    n === "" ? e.removeAttribute(t, "class") : e.setAttribute(t, "class", n)
}
function ef(e, t, n) {
    let {mergedAttrs: r, classes: i, styles: o} = n;
    r !== null && na(e, t, r),
    i !== null && Xd(e, t, i),
    o !== null && yv(e, t, o)
}
var ha = class {
    constructor(t) {
        this.changingThisBreaksApplicationSecurity = t
    }
    toString() {
        return `SafeValue must use [property]=binding: ${this.changingThisBreaksApplicationSecurity} (see ${ng})`
    }
}
;
function iu(e) {
    return e instanceof ha ? e.changingThisBreaksApplicationSecurity : e
}
var Dv = "h"
  , wv = "b";
var Cv = (e, t, n) => null;
function ou(e, t, n=!1) {
    return Cv(e, t, n)
}
var pa = class {
}
  , Gi = class {
}
;
function Ev(e) {
    let t = Error(`No component factory found for ${ge(e)}.`);
    return t[bv] = e,
    t
}
var bv = "ngComponent";
var ga = class {
    resolveComponentFactory(t) {
        throw Ev(t)
    }
}
  , lo = ( () => {
    let t = class t {
    }
    ;
    t.NULL = new ga;
    let e = t;
    return e
}
)();
function Iv() {
    return su(Be(), Z())
}
function su(e, t) {
    return new qt(Ue(e, t))
}
var qt = ( () => {
    let t = class t {
        constructor(r) {
            this.nativeElement = r
        }
    }
    ;
    t.__NG_ELEMENT_ID__ = Iv;
    let e = t;
    return e
}
)();
var sr = class {
}
  , Sn = ( () => {
    let t = class t {
        constructor() {
            this.destroyNode = null
        }
    }
    ;
    t.__NG_ELEMENT_ID__ = () => Mv();
    let e = t;
    return e
}
)();
function Mv() {
    let e = Z()
      , t = Be()
      , n = bt(t.index, e);
    return (yt(n) ? n : e)[ue]
}
var _v = ( () => {
    let t = class t {
    }
    ;
    t.\u0275prov = E({
        token: t,
        providedIn: "root",
        factory: () => null
    });
    let e = t;
    return e
}
)()
  , Bt = class {
    constructor(t) {
        this.full = t,
        this.major = t.split(".")[0],
        this.minor = t.split(".")[1],
        this.patch = t.split(".").slice(2).join(".")
    }
}
  , Sv = new Bt("17.1.0-next.2")
  , Hs = {};
function Wi(e, t, n, r, i=!1) {
    for (; n !== null; ) {
        let o = t[n.index];
        o !== null && r.push(Qe(o)),
        Ve(o) && Tv(o, r);
        let s = n.type;
        if (s & 8)
            Wi(e, t, n.child, r);
        else if (s & 32) {
            let a = Xa(n, t), u;
            for (; u = a(); )
                r.push(u)
        } else if (s & 16) {
            let a = Jd(t, n);
            if (Array.isArray(a))
                r.push(...a);
            else {
                let u = eu(t[Le]);
                Wi(u[S], u, a, r, !0)
            }
        }
        n = i ? n.projectionNext : n.next
    }
    return r
}
function Tv(e, t) {
    for (let n = me; n < e.length; n++) {
        let r = e[n]
          , i = r[S].firstChild;
        i !== null && Wi(r[S], r, i, t)
    }
    e[Lt] !== e[at] && t.push(e[Lt])
}
var tf = [];
function xv(e) {
    return e[kt] ?? Av(e)
}
function Av(e) {
    let t = tf.pop() ?? Object.create(Ov);
    return t.lView = e,
    t
}
function Nv(e) {
    e.lView[kt] !== e && (e.lView = null,
    tf.push(e))
}
var Ov = H(v({}, Ac), {
    consumerIsAlwaysLive: !0,
    consumerMarkedDirty: e => {
        so(e.lView)
    }
    ,
    consumerOnSignalRead() {
        this.lView[kt] = this
    }
})
  , Rv = "ngOriginalError";
function zs(e) {
    return e[Rv]
}
var ot = class {
    constructor() {
        this._console = console
    }
    handleError(t) {
        let n = this._findOriginalError(t);
        this._console.error("ERROR", t),
        n && this._console.error("ORIGINAL ERROR", n)
    }
    _findOriginalError(t) {
        let n = t && zs(t);
        for (; n && zs(n); )
            n = zs(n);
        return n || null
    }
}
;
var nf = !1
  , Fv = new w("",{
    providedIn: "root",
    factory: () => nf
});
var Zt = {};
function Ke(e) {
    rf($e(), Z(), Gt() + e, !1)
}
function rf(e, t, n, r) {
    if (!r)
        if ((t[M] & 3) === 3) {
            let o = e.preOrderCheckHooks;
            o !== null && Si(t, o, n)
        } else {
            let o = e.preOrderHooks;
            o !== null && Ti(t, o, 0, n)
        }
    jt(n)
}
function Y(e, t=F.Default) {
    let n = Z();
    if (n === null)
        return I(e, t);
    let r = Be();
    return Nd(r, n, he(e), t)
}
function Pv(e, t) {
    let n = e.hostBindingOpCodes;
    if (n !== null)
        try {
            for (let r = 0; r < n.length; r++) {
                let i = n[r];
                if (i < 0)
                    jt(~i);
                else {
                    let o = i
                      , s = n[++r]
                      , a = n[++r];
                    am(s, o);
                    let u = t[o];
                    a(2, u)
                }
            }
        } finally {
            jt(-1)
        }
}
function fo(e, t, n, r, i, o, s, a, u, c, l) {
    let d = t.blueprint.slice();
    return d[at] = i,
    d[M] = r | 4 | 128 | 8,
    (c !== null || e && e[M] & 2048) && (d[M] |= 2048),
    dd(d),
    d[ne] = d[In] = e,
    d[ae] = n,
    d[tr] = s || e && e[tr],
    d[ue] = a || e && e[ue],
    d[yn] = u || e && e[yn] || null,
    d[je] = o,
    d[io] = qm(),
    d[Fi] = l,
    d[id] = c,
    d[Le] = t.type == 2 ? e[Le] : d,
    d
}
function ho(e, t, n, r, i) {
    let o = e.data[t];
    if (o === null)
        o = kv(e, t, n, r, i),
        sm() && (o.flags |= 32);
    else if (o.type & 64) {
        o.type = n,
        o.value = r,
        o.attrs = i;
        let s = tm();
        o.injectorIndex = s === null ? -1 : s.injectorIndex
    }
    return mr(o, !0),
    o
}
function kv(e, t, n, r, i) {
    let o = gd()
      , s = md()
      , a = s ? o : o && o.parent
      , u = e.data[t] = $v(e, a, n, t, r, i);
    return e.firstChild === null && (e.firstChild = u),
    o !== null && (s ? o.child == null && u.parent !== null && (o.child = u) : o.next === null && (o.next = u,
    u.prev = o)),
    u
}
function of(e, t, n, r) {
    if (n === 0)
        return -1;
    let i = t.length;
    for (let o = 0; o < n; o++)
        t.push(r),
        e.blueprint.push(r),
        e.data.push(null);
    return i
}
function sf(e, t, n, r, i) {
    let o = Gt()
      , s = r & 2;
    try {
        jt(-1),
        s && t.length > Me && rf(e, t, Me, !1),
        qe(s ? 2 : 0, i),
        n(r, i)
    } finally {
        jt(o),
        qe(s ? 3 : 1, i)
    }
}
function af(e, t, n) {
    if (sd(t)) {
        let r = oe(null);
        try {
            let i = t.directiveStart
              , o = t.directiveEnd;
            for (let s = i; s < o; s++) {
                let a = e.data[s];
                a.contentQueries && a.contentQueries(1, n[s], s)
            }
        } finally {
            oe(r)
        }
    }
}
function uf(e, t, n) {
    pd() && (Zv(e, t, n, Ue(n, t)),
    (n.flags & 64) === 64 && hf(e, t, n))
}
function cf(e, t, n=Ue) {
    let r = t.localNames;
    if (r !== null) {
        let i = t.index + 1;
        for (let o = 0; o < r.length; o += 2) {
            let s = r[o + 1]
              , a = s === -1 ? n(t, e) : e[s];
            e[i++] = a
        }
    }
}
function lf(e) {
    let t = e.tView;
    return t === null || t.incompleteFirstPass ? e.tView = au(1, null, e.template, e.decls, e.vars, e.directiveDefs, e.pipeDefs, e.viewQuery, e.schemas, e.consts, e.id) : t
}
function au(e, t, n, r, i, o, s, a, u, c, l) {
    let d = Me + r
      , f = d + i
      , h = Lv(d, f)
      , p = typeof c == "function" ? c() : c;
    return h[S] = {
        type: e,
        blueprint: h,
        template: n,
        queries: null,
        viewQuery: a,
        declTNode: t,
        data: h.slice().fill(null, d),
        bindingStartIndex: d,
        expandoStartIndex: f,
        hostBindingOpCodes: null,
        firstCreatePass: !0,
        firstUpdatePass: !0,
        staticViewQueries: !1,
        staticContentQueries: !1,
        preOrderHooks: null,
        preOrderCheckHooks: null,
        contentHooks: null,
        contentCheckHooks: null,
        viewHooks: null,
        viewCheckHooks: null,
        destroyHooks: null,
        cleanup: null,
        contentQueries: null,
        components: null,
        directiveRegistry: typeof o == "function" ? o() : o,
        pipeRegistry: typeof s == "function" ? s() : s,
        firstChild: null,
        schemas: u,
        consts: p,
        incompleteFirstPass: !1,
        ssrId: l
    }
}
function Lv(e, t) {
    let n = [];
    for (let r = 0; r < t; r++)
        n.push(r < e ? null : Zt);
    return n
}
function Vv(e, t, n, r) {
    let o = r.get(Fv, nf) || n === Ye.ShadowDom
      , s = e.selectRootElement(t, o);
    return jv(s),
    s
}
function jv(e) {
    Uv(e)
}
var Uv = e => null;
function $v(e, t, n, r, i, o) {
    let s = t ? t.injectorIndex : -1
      , a = 0;
    return Jg() && (a |= 128),
    {
        type: n,
        index: r,
        insertBeforeIndex: null,
        injectorIndex: s,
        directiveStart: -1,
        directiveEnd: -1,
        directiveStylingLast: -1,
        componentOffset: -1,
        propertyBindings: null,
        flags: a,
        providerIndexes: 0,
        value: i,
        attrs: o,
        mergedAttrs: null,
        localNames: null,
        initialInputs: void 0,
        inputs: null,
        outputs: null,
        tView: null,
        next: null,
        prev: null,
        projectionNext: null,
        child: null,
        parent: t,
        projection: null,
        styles: null,
        stylesWithoutHost: null,
        residualStyles: void 0,
        classes: null,
        classesWithoutHost: null,
        residualClasses: void 0,
        classBindings: 0,
        styleBindings: 0
    }
}
function Il(e, t, n, r) {
    for (let i in e)
        if (e.hasOwnProperty(i)) {
            n = n === null ? {} : n;
            let o = e[i];
            r === null ? Ml(n, t, i, o) : r.hasOwnProperty(i) && Ml(n, t, r[i], o)
        }
    return n
}
function Ml(e, t, n, r) {
    e.hasOwnProperty(n) ? e[n].push(t, r) : e[n] = [t, r]
}
function Bv(e, t, n) {
    let r = t.directiveStart
      , i = t.directiveEnd
      , o = e.data
      , s = t.attrs
      , a = []
      , u = null
      , c = null;
    for (let l = r; l < i; l++) {
        let d = o[l]
          , f = n ? n.get(d) : null
          , h = f ? f.inputs : null
          , p = f ? f.outputs : null;
        u = Il(d.inputs, l, u, h),
        c = Il(d.outputs, l, c, p);
        let b = u !== null && s !== null && !Ql(t) ? ry(u, l, s) : null;
        a.push(b)
    }
    u !== null && (u.hasOwnProperty("class") && (t.flags |= 8),
    u.hasOwnProperty("style") && (t.flags |= 16)),
    t.initialInputs = a,
    t.inputs = u,
    t.outputs = c
}
function Hv(e) {
    return e === "class" ? "className" : e === "for" ? "htmlFor" : e === "formaction" ? "formAction" : e === "innerHtml" ? "innerHTML" : e === "readonly" ? "readOnly" : e === "tabindex" ? "tabIndex" : e
}
function zv(e, t, n, r, i, o, s, a) {
    let u = Ue(t, n), c = t.inputs, l;
    !a && c != null && (l = c[r]) ? (uu(e, n, l, r, i),
    oo(t) && Gv(n, t.index)) : t.type & 3 ? (r = Hv(r),
    i = s != null ? s(i, t.value || "", r) : i,
    o.setProperty(u, r, i)) : t.type & 12
}
function Gv(e, t) {
    let n = bt(t, e);
    n[M] & 16 || (n[M] |= 64)
}
function df(e, t, n, r) {
    if (pd()) {
        let i = r === null ? null : {
            "": -1
        }, o = Qv(e, n), s, a;
        o === null ? s = a = null : [s,a] = o,
        s !== null && ff(e, t, n, s, i, a),
        i && Kv(n, r, i)
    }
    n.mergedAttrs = Xn(n.mergedAttrs, n.attrs)
}
function ff(e, t, n, r, i, o) {
    for (let c = 0; c < r.length; c++)
        sa($i(n, t), e, r[c].type);
    Xv(n, e.data.length, r.length);
    for (let c = 0; c < r.length; c++) {
        let l = r[c];
        l.providersResolver && l.providersResolver(l)
    }
    let s = !1
      , a = !1
      , u = of(e, t, r.length, null);
    for (let c = 0; c < r.length; c++) {
        let l = r[c];
        n.mergedAttrs = Xn(n.mergedAttrs, l.hostAttrs),
        ey(e, n, t, u, l),
        Jv(u, l, i),
        l.contentQueries !== null && (n.flags |= 4),
        (l.hostBindings !== null || l.hostAttrs !== null || l.hostVars !== 0) && (n.flags |= 64);
        let d = l.type.prototype;
        !s && (d.ngOnChanges || d.ngOnInit || d.ngDoCheck) && ((e.preOrderHooks ??= []).push(n.index),
        s = !0),
        !a && (d.ngOnChanges || d.ngDoCheck) && ((e.preOrderCheckHooks ??= []).push(n.index),
        a = !0),
        u++
    }
    Bv(e, n, o)
}
function Wv(e, t, n, r, i) {
    let o = i.hostBindings;
    if (o) {
        let s = e.hostBindingOpCodes;
        s === null && (s = e.hostBindingOpCodes = []);
        let a = ~t.index;
        qv(s) != a && s.push(a),
        s.push(n, r, o)
    }
}
function qv(e) {
    let t = e.length;
    for (; t > 0; ) {
        let n = e[--t];
        if (typeof n == "number" && n < 0)
            return n
    }
    return 0
}
function Zv(e, t, n, r) {
    let i = n.directiveStart
      , o = n.directiveEnd;
    oo(n) && ty(t, n, e.data[i + n.componentOffset]),
    e.firstCreatePass || $i(n, t),
    $t(r, t);
    let s = n.initialInputs;
    for (let a = i; a < o; a++) {
        let u = e.data[a]
          , c = wn(t, e, a, n);
        if ($t(c, t),
        s !== null && ny(t, a - i, c, u, n, s),
        Dt(u)) {
            let l = bt(n.index, t);
            l[ae] = wn(t, e, a, n)
        }
    }
}
function hf(e, t, n) {
    let r = n.directiveStart
      , i = n.directiveEnd
      , o = n.index
      , s = um();
    try {
        jt(o);
        for (let a = r; a < i; a++) {
            let u = e.data[a]
              , c = t[a];
            ia(a),
            (u.hostBindings !== null || u.hostVars !== 0 || u.hostAttrs !== null) && Yv(u, c)
        }
    } finally {
        jt(-1),
        ia(s)
    }
}
function Yv(e, t) {
    e.hostBindings !== null && e.hostBindings(1, t)
}
function Qv(e, t) {
    let n = e.directiveRegistry
      , r = null
      , i = null;
    if (n)
        for (let o = 0; o < n.length; o++) {
            let s = n[o];
            if (xg(t, s.selectors, !1))
                if (r || (r = []),
                Dt(s))
                    if (s.findHostDirectiveDefs !== null) {
                        let a = [];
                        i = i || new Map,
                        s.findHostDirectiveDefs(s, a, i),
                        r.unshift(...a, s);
                        let u = a.length;
                        ma(e, t, u)
                    } else
                        r.unshift(s),
                        ma(e, t, 0);
                else
                    i = i || new Map,
                    s.findHostDirectiveDefs?.(s, r, i),
                    r.push(s)
        }
    return r === null ? null : [r, i]
}
function ma(e, t, n) {
    t.componentOffset = n,
    (e.components ??= []).push(t.index)
}
function Kv(e, t, n) {
    if (t) {
        let r = e.localNames = [];
        for (let i = 0; i < t.length; i += 2) {
            let o = n[t[i + 1]];
            if (o == null)
                throw new D(-301,!1);
            r.push(t[i], o)
        }
    }
}
function Jv(e, t, n) {
    if (n) {
        if (t.exportAs)
            for (let r = 0; r < t.exportAs.length; r++)
                n[t.exportAs[r]] = e;
        Dt(t) && (n[""] = e)
    }
}
function Xv(e, t, n) {
    e.flags |= 1,
    e.directiveStart = t,
    e.directiveEnd = t + n,
    e.providerIndexes = t
}
function ey(e, t, n, r, i) {
    e.data[r] = i;
    let o = i.factory || (i.factory = Vt(i.type, !0))
      , s = new Ut(o,Dt(i),Y);
    e.blueprint[r] = s,
    n[r] = s,
    Wv(e, t, r, of(e, n, i.hostVars, Zt), i)
}
function ty(e, t, n) {
    let r = Ue(t, e)
      , i = lf(n)
      , o = e[tr].rendererFactory
      , s = 16;
    n.signals ? s = 4096 : n.onPush && (s = 64);
    let a = po(e, fo(e, i, null, s, r, t, null, o.createRenderer(r, n), null, null, null));
    e[t.index] = a
}
function ny(e, t, n, r, i, o) {
    let s = o[t];
    if (s !== null)
        for (let a = 0; a < s.length; ) {
            let u = s[a++]
              , c = s[a++]
              , l = s[a++];
            pf(r, n, u, c, l)
        }
}
function pf(e, t, n, r, i) {
    let o = oe(null);
    try {
        let s = e.inputTransforms;
        s !== null && s.hasOwnProperty(r) && (i = s[r].call(t, i)),
        e.setInput !== null ? e.setInput(t, i, n, r) : t[r] = i
    } finally {
        oe(o)
    }
}
function ry(e, t, n) {
    let r = null
      , i = 0;
    for (; i < n.length; ) {
        let o = n[i];
        if (o === 0) {
            i += 4;
            continue
        } else if (o === 5) {
            i += 2;
            continue
        }
        if (typeof o == "number")
            break;
        if (e.hasOwnProperty(o)) {
            r === null && (r = []);
            let s = e[o];
            for (let a = 0; a < s.length; a += 2)
                if (s[a] === t) {
                    r.push(o, s[a + 1], n[i + 1]);
                    break
                }
        }
        i += 2
    }
    return r
}
function gf(e, t, n, r) {
    return [e, !0, 0, t, null, r, null, n, null, null]
}
function mf(e, t) {
    let n = e.contentQueries;
    if (n !== null) {
        let r = oe(null);
        try {
            for (let i = 0; i < n.length; i += 2) {
                let o = n[i]
                  , s = n[i + 1];
                if (s !== -1) {
                    let a = e.data[s];
                    vd(o),
                    a.contentQueries(2, t[s], s)
                }
            }
        } finally {
            oe(r)
        }
    }
}
function po(e, t) {
    return e[nr] ? e[gl][ke] = t : e[nr] = t,
    e[gl] = t,
    t
}
function va(e, t, n) {
    vd(0);
    let r = oe(null);
    try {
        t(e, n)
    } finally {
        oe(r)
    }
}
function iy(e) {
    return e[er] || (e[er] = [])
}
function oy(e) {
    return e.cleanup || (e.cleanup = [])
}
function vf(e, t) {
    let n = e[yn]
      , r = n ? n.get(ot, null) : null;
    r && r.handleError(t)
}
function uu(e, t, n, r, i) {
    for (let o = 0; o < n.length; ) {
        let s = n[o++]
          , a = n[o++]
          , u = t[s]
          , c = e.data[s];
        pf(c, u, r, a, i)
    }
}
function sy(e, t, n) {
    let r = ld(t, e);
    Jm(e[ue], r, n)
}
var ay = 100;
function uy(e, t=!0) {
    let n = e[tr]
      , r = n.rendererFactory
      , i = n.afterRenderEventManager
      , o = !1;
    o || (r.begin?.(),
    i?.begin());
    try {
        let s = e[S]
          , a = e[ae];
        yf(s, e, s.template, a),
        cy(e)
    } catch (s) {
        throw t && vf(e, s),
        s
    } finally {
        o || (r.end?.(),
        n.inlineEffectRunner?.flush(),
        i?.end())
    }
}
function cy(e) {
    let t = 0;
    for (; fd(e); ) {
        if (t === ay)
            throw new D(103,!1);
        t++,
        Cf(e, 1)
    }
}
function yf(e, t, n, r) {
    let i = t[M];
    if ((i & 256) === 256)
        return;
    let o = !1;
    !o && t[tr].inlineEffectRunner?.flush(),
    $a(t);
    let s = null
      , a = null;
    !o && ly(e) && (a = xv(t),
    s = Nc(a));
    try {
        dd(t),
        im(e.bindingStartIndex),
        n !== null && sf(e, t, n, 2, r);
        let u = (i & 3) === 3;
        if (!o)
            if (u) {
                let d = e.preOrderCheckHooks;
                d !== null && Si(t, d, null)
            } else {
                let d = e.preOrderHooks;
                d !== null && Ti(t, d, 0, null),
                Vs(t, 0)
            }
        if (dy(t),
        Df(t, 0),
        e.contentQueries !== null && mf(e, t),
        !o)
            if (u) {
                let d = e.contentCheckHooks;
                d !== null && Si(t, d)
            } else {
                let d = e.contentHooks;
                d !== null && Ti(t, d, 1),
                Vs(t, 1)
            }
        Pv(e, t);
        let c = e.components;
        c !== null && Ef(t, c, 0);
        let l = e.viewQuery;
        if (l !== null && va(2, l, r),
        !o)
            if (u) {
                let d = e.viewCheckHooks;
                d !== null && Si(t, d)
            } else {
                let d = e.viewHooks;
                d !== null && Ti(t, d, 2),
                Vs(t, 2)
            }
        if (e.firstUpdatePass === !0 && (e.firstUpdatePass = !1),
        t[Ls]) {
            for (let d of t[Ls])
                d();
            t[Ls] = null
        }
        o || (t[M] &= -73)
    } catch (u) {
        throw so(t),
        u
    } finally {
        a !== null && (Oc(a, s),
        Nv(a)),
        Ba()
    }
}
function ly(e) {
    return e.type !== 2
}
function Df(e, t) {
    for (let n = Wd(e); n !== null; n = qd(n)) {
        n[M] &= ~Dn.HasChildViewsToRefresh;
        for (let r = me; r < n.length; r++) {
            let i = n[r];
            wf(i, t)
        }
    }
}
function dy(e) {
    for (let t = Wd(e); t !== null; t = qd(t)) {
        if (!(t[M] & Dn.HasTransplantedViews))
            continue;
        let n = t[ki];
        for (let r = 0; r < n.length; r++) {
            let i = n[r]
              , o = i[ne];
            Wg(i)
        }
    }
}
function fy(e, t, n) {
    let r = bt(t, e);
    wf(r, n)
}
function wf(e, t) {
    Ua(e) && Cf(e, t)
}
function Cf(e, t) {
    let r = e[S]
      , i = e[M]
      , o = e[kt]
      , s = !!(t === 0 && i & 16);
    if (s ||= !!(i & 64 && t === 0),
    s ||= !!(i & 1024),
    s ||= !!(o?.dirty && ps(o)),
    o && (o.dirty = !1),
    e[M] &= -9217,
    s)
        yf(r, e, r.template, e[ae]);
    else if (i & 8192) {
        Df(e, 1);
        let a = r.components;
        a !== null && Ef(e, a, 1)
    }
}
function Ef(e, t, n) {
    for (let r = 0; r < t.length; r++)
        fy(e, t[r], n)
}
function cu(e) {
    for (; e; ) {
        e[M] |= 64;
        let t = eu(e);
        if (Vg(e) && !t)
            return e;
        e = t
    }
    return null
}
var En = class {
    get rootNodes() {
        let t = this._lView
          , n = t[S];
        return Wi(n, t, n.firstChild, [])
    }
    constructor(t, n, r=!0) {
        this._lView = t,
        this._cdRefInjectingView = n,
        this.notifyErrorHandler = r,
        this._appRef = null,
        this._attachedToViewContainer = !1
    }
    get context() {
        return this._lView[ae]
    }
    set context(t) {
        this._lView[ae] = t
    }
    get destroyed() {
        return (this._lView[M] & 256) === 256
    }
    destroy() {
        if (this._appRef)
            this._appRef.detachView(this);
        else if (this._attachedToViewContainer) {
            let t = this._lView[ne];
            if (Ve(t)) {
                let n = t[Pi]
                  , r = n ? n.indexOf(this) : -1;
                r > -1 && (or(t, r),
                Bi(n, r))
            }
            this._attachedToViewContainer = !1
        }
        co(this._lView[S], this._lView)
    }
    onDestroy(t) {
        Zg(this._lView, t)
    }
    markForCheck() {
        cu(this._cdRefInjectingView || this._lView)
    }
    detach() {
        this._lView[M] &= -129
    }
    reattach() {
        hd(this._lView),
        this._lView[M] |= 128
    }
    detectChanges() {
        uy(this._lView, this.notifyErrorHandler)
    }
    checkNoChanges() {}
    attachToViewContainerRef() {
        if (this._appRef)
            throw new D(902,!1);
        this._attachedToViewContainer = !0
    }
    detachFromAppRef() {
        this._appRef = null,
        tv(this._lView[S], this._lView)
    }
    attachToAppRef(t) {
        if (this._attachedToViewContainer)
            throw new D(902,!1);
        this._appRef = t
    }
}
  , Tn = ( () => {
    let t = class t {
    }
    ;
    t.__NG_ELEMENT_ID__ = hy;
    let e = t;
    return e
}
)();
function hy(e) {
    return py(Be(), Z(), (e & 16) === 16)
}
function py(e, t, n) {
    if (oo(e) && !n) {
        let r = bt(e.index, t);
        return new En(r,r)
    } else if (e.type & 47) {
        let r = t[Le];
        return new En(r,t)
    }
    return null
}
var _l = new Set;
function Cr(e) {
    _l.has(e) || (_l.add(e),
    performance?.mark?.("mark_use_counter", {
        detail: {
            feature: e
        }
    }))
}
var ya = class extends de {
    constructor(t=!1) {
        super(),
        this.__isAsync = t
    }
    emit(t) {
        super.next(t)
    }
    subscribe(t, n, r) {
        let i = t
          , o = n || ( () => null)
          , s = r;
        if (t && typeof t == "object") {
            let u = t;
            i = u.next?.bind(u),
            o = u.error?.bind(u),
            s = u.complete?.bind(u)
        }
        this.__isAsync && (o = Gs(o),
        i && (i = Gs(i)),
        s && (s = Gs(s)));
        let a = super.subscribe({
            next: i,
            error: o,
            complete: s
        });
        return t instanceof re && t.add(a),
        a
    }
}
;
function Gs(e) {
    return t => {
        setTimeout(e, void 0, t)
    }
}
var pe = ya;
function Sl(...e) {}
function gy() {
    let e = typeof rt.requestAnimationFrame == "function"
      , t = rt[e ? "requestAnimationFrame" : "setTimeout"]
      , n = rt[e ? "cancelAnimationFrame" : "clearTimeout"];
    if (typeof Zone < "u" && t && n) {
        let r = t[Zone.__symbol__("OriginalDelegate")];
        r && (t = r);
        let i = n[Zone.__symbol__("OriginalDelegate")];
        i && (n = i)
    }
    return {
        nativeRequestAnimationFrame: t,
        nativeCancelAnimationFrame: n
    }
}
var K = class e {
    constructor({enableLongStackTrace: t=!1, shouldCoalesceEventChangeDetection: n=!1, shouldCoalesceRunChangeDetection: r=!1}) {
        if (this.hasPendingMacrotasks = !1,
        this.hasPendingMicrotasks = !1,
        this.isStable = !0,
        this.onUnstable = new pe(!1),
        this.onMicrotaskEmpty = new pe(!1),
        this.onStable = new pe(!1),
        this.onError = new pe(!1),
        typeof Zone > "u")
            throw new D(908,!1);
        Zone.assertZonePatched();
        let i = this;
        i._nesting = 0,
        i._outer = i._inner = Zone.current,
        Zone.TaskTrackingZoneSpec && (i._inner = i._inner.fork(new Zone.TaskTrackingZoneSpec)),
        t && Zone.longStackTraceZoneSpec && (i._inner = i._inner.fork(Zone.longStackTraceZoneSpec)),
        i.shouldCoalesceEventChangeDetection = !r && n,
        i.shouldCoalesceRunChangeDetection = r,
        i.lastRequestAnimationFrameId = -1,
        i.nativeRequestAnimationFrame = gy().nativeRequestAnimationFrame,
        yy(i)
    }
    static isInAngularZone() {
        return typeof Zone < "u" && Zone.current.get("isAngularZone") === !0
    }
    static assertInAngularZone() {
        if (!e.isInAngularZone())
            throw new D(909,!1)
    }
    static assertNotInAngularZone() {
        if (e.isInAngularZone())
            throw new D(909,!1)
    }
    run(t, n, r) {
        return this._inner.run(t, n, r)
    }
    runTask(t, n, r, i) {
        let o = this._inner
          , s = o.scheduleEventTask("NgZoneEvent: " + i, t, my, Sl, Sl);
        try {
            return o.runTask(s, n, r)
        } finally {
            o.cancelTask(s)
        }
    }
    runGuarded(t, n, r) {
        return this._inner.runGuarded(t, n, r)
    }
    runOutsideAngular(t) {
        return this._outer.run(t)
    }
}
  , my = {};
function lu(e) {
    if (e._nesting == 0 && !e.hasPendingMicrotasks && !e.isStable)
        try {
            e._nesting++,
            e.onMicrotaskEmpty.emit(null)
        } finally {
            if (e._nesting--,
            !e.hasPendingMicrotasks)
                try {
                    e.runOutsideAngular( () => e.onStable.emit(null))
                } finally {
                    e.isStable = !0
                }
        }
}
function vy(e) {
    e.isCheckStableRunning || e.lastRequestAnimationFrameId !== -1 || (e.lastRequestAnimationFrameId = e.nativeRequestAnimationFrame.call(rt, () => {
        e.fakeTopEventTask || (e.fakeTopEventTask = Zone.root.scheduleEventTask("fakeTopEventTask", () => {
            e.lastRequestAnimationFrameId = -1,
            Da(e),
            e.isCheckStableRunning = !0,
            lu(e),
            e.isCheckStableRunning = !1
        }
        , void 0, () => {}
        , () => {}
        )),
        e.fakeTopEventTask.invoke()
    }
    ),
    Da(e))
}
function yy(e) {
    let t = () => {
        vy(e)
    }
    ;
    e._inner = e._inner.fork({
        name: "angular",
        properties: {
            isAngularZone: !0
        },
        onInvokeTask: (n, r, i, o, s, a) => {
            if (Dy(a))
                return n.invokeTask(i, o, s, a);
            try {
                return Tl(e),
                n.invokeTask(i, o, s, a)
            } finally {
                (e.shouldCoalesceEventChangeDetection && o.type === "eventTask" || e.shouldCoalesceRunChangeDetection) && t(),
                xl(e)
            }
        }
        ,
        onInvoke: (n, r, i, o, s, a, u) => {
            try {
                return Tl(e),
                n.invoke(i, o, s, a, u)
            } finally {
                e.shouldCoalesceRunChangeDetection && t(),
                xl(e)
            }
        }
        ,
        onHasTask: (n, r, i, o) => {
            n.hasTask(i, o),
            r === i && (o.change == "microTask" ? (e._hasPendingMicrotasks = o.microTask,
            Da(e),
            lu(e)) : o.change == "macroTask" && (e.hasPendingMacrotasks = o.macroTask))
        }
        ,
        onHandleError: (n, r, i, o) => (n.handleError(i, o),
        e.runOutsideAngular( () => e.onError.emit(o)),
        !1)
    })
}
function Da(e) {
    e._hasPendingMicrotasks || (e.shouldCoalesceEventChangeDetection || e.shouldCoalesceRunChangeDetection) && e.lastRequestAnimationFrameId !== -1 ? e.hasPendingMicrotasks = !0 : e.hasPendingMicrotasks = !1
}
function Tl(e) {
    e._nesting++,
    e.isStable && (e.isStable = !1,
    e.onUnstable.emit(null))
}
function xl(e) {
    e._nesting--,
    lu(e)
}
var bf = new w("",{
    providedIn: "root",
    factory: If
});
function If() {
    let e = g(K)
      , t = !0
      , n = new k(i => {
        t = e.isStable && !e.hasPendingMacrotasks && !e.hasPendingMicrotasks,
        e.runOutsideAngular( () => {
            i.next(t),
            i.complete()
        }
        )
    }
    )
      , r = new k(i => {
        let o;
        e.runOutsideAngular( () => {
            o = e.onStable.subscribe( () => {
                K.assertNotInAngularZone(),
                queueMicrotask( () => {
                    !t && !e.hasPendingMacrotasks && !e.hasPendingMicrotasks && (t = !0,
                    i.next(!0))
                }
                )
            }
            )
        }
        );
        let s = e.onUnstable.subscribe( () => {
            K.assertInAngularZone(),
            t && (t = !1,
            e.runOutsideAngular( () => {
                i.next(!1)
            }
            ))
        }
        );
        return () => {
            o.unsubscribe(),
            s.unsubscribe()
        }
    }
    );
    return xs(n, r.pipe(bi()))
}
function Dy(e) {
    return !Array.isArray(e) || e.length !== 1 ? !1 : e[0].data?.__ignore_ng_zone__ === !0
}
var wy = ( () => {
    let t = class t {
        constructor() {
            this.renderDepth = 0,
            this.handler = null,
            this.internalCallbacks = []
        }
        begin() {
            this.handler?.validateBegin(),
            this.renderDepth++
        }
        end() {
            if (this.renderDepth--,
            this.renderDepth === 0) {
                for (let r of this.internalCallbacks)
                    r();
                this.internalCallbacks.length = 0,
                this.handler?.execute()
            }
        }
        ngOnDestroy() {
            this.handler?.destroy(),
            this.handler = null,
            this.internalCallbacks.length = 0
        }
    }
    ;
    t.\u0275prov = E({
        token: t,
        providedIn: "root",
        factory: () => new t
    });
    let e = t;
    return e
}
)();
function Cy(e, t) {
    let n = bt(t, e)
      , r = n[S];
    Ey(r, n);
    let i = n[at];
    i !== null && n[Fi] === null && (n[Fi] = ou(i, n[yn])),
    du(r, n, n[ae])
}
function Ey(e, t) {
    for (let n = t.length; n < e.blueprint.length; n++)
        t.push(e.blueprint[n])
}
function du(e, t, n) {
    $a(t);
    try {
        let r = e.viewQuery;
        r !== null && va(1, r, n);
        let i = e.template;
        i !== null && sf(e, t, i, 1, n),
        e.firstCreatePass && (e.firstCreatePass = !1),
        e.staticContentQueries && mf(e, t),
        e.staticViewQueries && va(2, e.viewQuery, n);
        let o = e.components;
        o !== null && by(t, o)
    } catch (r) {
        throw e.firstCreatePass && (e.incompleteFirstPass = !0,
        e.firstCreatePass = !1),
        r
    } finally {
        t[M] &= -5,
        Ba()
    }
}
function by(e, t) {
    for (let n = 0; n < t.length; n++)
        Cy(e, t[n])
}
function wa(e, t, n) {
    let r = n ? e.styles : null
      , i = n ? e.classes : null
      , o = 0;
    if (t !== null)
        for (let s = 0; s < t.length; s++) {
            let a = t[s];
            if (typeof a == "number")
                o = a;
            else if (o == 1)
                i = ol(i, a);
            else if (o == 2) {
                let u = a
                  , c = t[++s];
                r = ol(r, u + ": " + c + ";")
            }
        }
    n ? e.styles = r : e.stylesWithoutHost = r,
    n ? e.classes = i : e.classesWithoutHost = i
}
var qi = class extends lo {
    constructor(t) {
        super(),
        this.ngModule = t
    }
    resolveComponentFactory(t) {
        let n = Pt(t);
        return new ar(n,this.ngModule)
    }
}
;
function Al(e) {
    let t = [];
    for (let n in e)
        if (e.hasOwnProperty(n)) {
            let r = e[n];
            t.push({
                propName: r,
                templateName: n
            })
        }
    return t
}
function Iy(e) {
    let t = e.toLowerCase();
    return t === "svg" ? Bg : t === "math" ? Hg : null
}
var Ca = class {
    constructor(t, n) {
        this.injector = t,
        this.parentInjector = n
    }
    get(t, n, r) {
        r = eo(r);
        let i = this.injector.get(t, Hs, r);
        return i !== Hs || n === Hs ? i : this.parentInjector.get(t, n, r)
    }
}
  , ar = class extends Gi {
    get inputs() {
        let t = this.componentDef
          , n = t.inputTransforms
          , r = Al(t.inputs);
        if (n !== null)
            for (let i of r)
                n.hasOwnProperty(i.propName) && (i.transform = n[i.propName]);
        return r
    }
    get outputs() {
        return Al(this.componentDef.outputs)
    }
    constructor(t, n) {
        super(),
        this.componentDef = t,
        this.ngModule = n,
        this.componentType = t.type,
        this.selector = Rg(t.selectors),
        this.ngContentSelectors = t.ngContentSelectors ? t.ngContentSelectors : [],
        this.isBoundToModule = !!n
    }
    create(t, n, r, i) {
        i = i || this.ngModule;
        let o = i instanceof Ee ? i : i?.injector;
        o && this.componentDef.getStandaloneInjector !== null && (o = this.componentDef.getStandaloneInjector(o) || o);
        let s = o ? new Ca(t,o) : t
          , a = s.get(sr, null);
        if (a === null)
            throw new D(407,!1);
        let u = s.get(_v, null)
          , c = s.get(wy, null)
          , l = {
            rendererFactory: a,
            sanitizer: u,
            inlineEffectRunner: null,
            afterRenderEventManager: c
        }
          , d = a.createRenderer(null, this.componentDef)
          , f = this.componentDef.selectors[0][0] || "div"
          , h = r ? Vv(d, r, this.componentDef.encapsulation, s) : Yd(d, f, Iy(f))
          , p = 4608
          , b = this.componentDef.onPush ? 576 : 528
          , y = this.componentDef.signals ? p : b
          , m = null;
        h !== null && (m = ou(h, s, !0));
        let Q = au(0, null, null, 1, 0, null, null, null, null, null, null)
          , ie = fo(null, Q, null, y, null, null, l, d, s, null, m);
        $a(ie);
        let q, ze;
        try {
            let be = this.componentDef, ht, fs = null;
            be.findHostDirectiveDefs ? (ht = [],
            fs = new Map,
            be.findHostDirectiveDefs(be, ht, fs),
            ht.push(be)) : ht = [be];
            let Ep = My(ie, h)
              , bp = _y(Ep, h, be, ht, ie, l, d);
            ze = ja(Q, Me),
            h && xy(d, be, h, r),
            n !== void 0 && Ay(ze, this.ngContentSelectors, n),
            q = Ty(bp, be, ht, fs, ie, [Ny]),
            du(Q, ie, null)
        } finally {
            Ba()
        }
        return new Ea(this.componentType,q,su(ze, ie),ie,ze)
    }
}
  , Ea = class extends pa {
    constructor(t, n, r, i, o) {
        super(),
        this.location = r,
        this._rootLView = i,
        this._tNode = o,
        this.previousInputValues = null,
        this.instance = n,
        this.hostView = this.changeDetectorRef = new En(i,void 0,!1),
        this.componentType = t
    }
    setInput(t, n) {
        let r = this._tNode.inputs, i;
        if (r !== null && (i = r[t])) {
            if (this.previousInputValues ??= new Map,
            this.previousInputValues.has(t) && Object.is(this.previousInputValues.get(t), n))
                return;
            let o = this._rootLView;
            uu(o[S], o, i, t, n),
            this.previousInputValues.set(t, n);
            let s = bt(this._tNode.index, o);
            cu(s)
        }
    }
    get injector() {
        return new Ft(this._tNode,this._rootLView)
    }
    destroy() {
        this.hostView.destroy()
    }
    onDestroy(t) {
        this.hostView.onDestroy(t)
    }
}
;
function My(e, t) {
    let n = e[S]
      , r = Me;
    return e[r] = t,
    ho(n, r, 2, "#host", null)
}
function _y(e, t, n, r, i, o, s) {
    let a = i[S];
    Sy(r, e, t, s);
    let u = null;
    t !== null && (u = ou(t, i[yn]));
    let c = o.rendererFactory.createRenderer(t, n)
      , l = 16;
    n.signals ? l = 4096 : n.onPush && (l = 64);
    let d = fo(i, lf(n), null, l, i[e.index], e, o, c, null, null, u);
    return a.firstCreatePass && ma(a, e, r.length - 1),
    po(i, d),
    i[e.index] = d
}
function Sy(e, t, n, r) {
    for (let i of e)
        t.mergedAttrs = Xn(t.mergedAttrs, i.hostAttrs);
    t.mergedAttrs !== null && (wa(t, t.mergedAttrs, !0),
    n !== null && ef(r, n, t))
}
function Ty(e, t, n, r, i, o) {
    let s = Be()
      , a = i[S]
      , u = Ue(s, i);
    ff(a, i, s, n, null, r);
    for (let l = 0; l < n.length; l++) {
        let d = s.directiveStart + l
          , f = wn(i, a, d, s);
        $t(f, i)
    }
    hf(a, i, s),
    u && $t(u, i);
    let c = wn(i, a, s.directiveStart + s.componentOffset, s);
    if (e[ae] = i[ae] = c,
    o !== null)
        for (let l of o)
            l(c, t);
    return af(a, s, e),
    c
}
function xy(e, t, n, r) {
    if (r)
        na(e, n, ["ng-version", Sv.full]);
    else {
        let {attrs: i, classes: o} = Fg(t.selectors[0]);
        i && na(e, n, i),
        o && o.length > 0 && Xd(e, n, o.join(" "))
    }
}
function Ay(e, t, n) {
    let r = e.projection = [];
    for (let i = 0; i < t.length; i++) {
        let o = n[i];
        r.push(o != null ? Array.from(o) : null)
    }
}
function Ny() {
    let e = Be();
    Ga(Z()[S], e)
}
function Oy(e) {
    return Object.getPrototypeOf(e.prototype).constructor
}
function xn(e) {
    let t = Oy(e.type)
      , n = !0
      , r = [e];
    for (; t; ) {
        let i;
        if (Dt(e))
            i = t.\u0275cmp || t.\u0275dir;
        else {
            if (t.\u0275cmp)
                throw new D(903,!1);
            i = t.\u0275dir
        }
        if (i) {
            if (n) {
                r.push(i);
                let s = e;
                s.inputs = Mi(e.inputs),
                s.inputTransforms = Mi(e.inputTransforms),
                s.declaredInputs = Mi(e.declaredInputs),
                s.outputs = Mi(e.outputs);
                let a = i.hostBindings;
                a && ky(e, a);
                let u = i.viewQuery
                  , c = i.contentQueries;
                if (u && Fy(e, u),
                c && Py(e, c),
                Ii(e.inputs, i.inputs),
                Ii(e.declaredInputs, i.declaredInputs),
                Ii(e.outputs, i.outputs),
                i.inputTransforms !== null && (s.inputTransforms === null && (s.inputTransforms = {}),
                Ii(s.inputTransforms, i.inputTransforms)),
                Dt(i) && i.data.animation) {
                    let l = e.data;
                    l.animation = (l.animation || []).concat(i.data.animation)
                }
            }
            let o = i.features;
            if (o)
                for (let s = 0; s < o.length; s++) {
                    let a = o[s];
                    a && a.ngInherit && a(e),
                    a === xn && (n = !1)
                }
        }
        t = Object.getPrototypeOf(t)
    }
    Ry(r)
}
function Ry(e) {
    let t = 0
      , n = null;
    for (let r = e.length - 1; r >= 0; r--) {
        let i = e[r];
        i.hostVars = t += i.hostVars,
        i.hostAttrs = Xn(i.hostAttrs, n = Xn(n, i.hostAttrs))
    }
}
function Mi(e) {
    return e === vn ? {} : e === xe ? [] : e
}
function Fy(e, t) {
    let n = e.viewQuery;
    n ? e.viewQuery = (r, i) => {
        t(r, i),
        n(r, i)
    }
    : e.viewQuery = t
}
function Py(e, t) {
    let n = e.contentQueries;
    n ? e.contentQueries = (r, i, o) => {
        t(r, i, o),
        n(r, i, o)
    }
    : e.contentQueries = t
}
function ky(e, t) {
    let n = e.hostBindings;
    n ? e.hostBindings = (r, i) => {
        t(r, i),
        n(r, i)
    }
    : e.hostBindings = t
}
function Ly(e, t, n) {
    return e[t] = n
}
function Ht(e, t, n) {
    let r = e[t];
    return Object.is(r, n) ? !1 : (e[t] = n,
    !0)
}
function Vy(e, t, n, r) {
    let i = Ht(e, t, n);
    return Ht(e, t + 1, r) || i
}
function jy(e, t, n, r) {
    return Ht(e, ao(), n) ? t + Bl(n) + r : Zt
}
function _i(e, t) {
    return e << 17 | t << 2
}
function zt(e) {
    return e >> 17 & 32767
}
function Uy(e) {
    return (e & 2) == 2
}
function $y(e, t) {
    return e & 131071 | t << 17
}
function ba(e) {
    return e | 2
}
function bn(e) {
    return (e & 131068) >> 2
}
function Ws(e, t) {
    return e & -131069 | t << 2
}
function By(e) {
    return (e & 1) === 1
}
function Ia(e) {
    return e | 1
}
function Hy(e, t, n, r, i, o) {
    let s = o ? t.classBindings : t.styleBindings
      , a = zt(s)
      , u = bn(s);
    e[r] = n;
    let c = !1, l;
    if (Array.isArray(n)) {
        let d = n;
        l = d[1],
        (l === null || yr(d, l) > 0) && (c = !0)
    } else
        l = n;
    if (i)
        if (u !== 0) {
            let f = zt(e[a + 1]);
            e[r + 1] = _i(f, a),
            f !== 0 && (e[f + 1] = Ws(e[f + 1], r)),
            e[a + 1] = $y(e[a + 1], r)
        } else
            e[r + 1] = _i(a, 0),
            a !== 0 && (e[a + 1] = Ws(e[a + 1], r)),
            a = r;
    else
        e[r + 1] = _i(u, 0),
        a === 0 ? a = r : e[u + 1] = Ws(e[u + 1], r),
        u = r;
    c && (e[r + 1] = ba(e[r + 1])),
    Nl(e, l, r, !0, o),
    Nl(e, l, r, !1, o),
    zy(t, l, e, r, o),
    s = _i(a, u),
    o ? t.classBindings = s : t.styleBindings = s
}
function zy(e, t, n, r, i) {
    let o = i ? e.residualClasses : e.residualStyles;
    o != null && typeof t == "string" && yr(o, t) >= 0 && (n[r + 1] = Ia(n[r + 1]))
}
function Nl(e, t, n, r, i) {
    let o = e[n + 1]
      , s = t === null
      , a = r ? zt(o) : bn(o)
      , u = !1;
    for (; a !== 0 && (u === !1 || s); ) {
        let c = e[a]
          , l = e[a + 1];
        Gy(c, t) && (u = !0,
        e[a + 1] = r ? Ia(l) : ba(l)),
        a = r ? zt(l) : bn(l)
    }
    u && (e[n + 1] = r ? ba(o) : Ia(o))
}
function Gy(e, t) {
    return e === null || t == null || (Array.isArray(e) ? e[1] : e) === t ? !0 : Array.isArray(e) && typeof t == "string" ? yr(e, t) >= 0 : !1
}
function An(e, t, n) {
    let r = Z()
      , i = ao();
    if (Ht(r, i, t)) {
        let o = $e()
          , s = fm();
        zv(o, s, r, e, t, r[ue], n, !1)
    }
    return An
}
function Ol(e, t, n, r, i) {
    let o = t.inputs
      , s = i ? "class" : "style";
    uu(e, n, o[s], s, r)
}
function fu(e, t) {
    return Wy(e, t, null, !0),
    fu
}
function Wy(e, t, n, r) {
    let i = Z()
      , o = $e()
      , s = om(2);
    if (o.firstUpdatePass && Zy(o, e, s, r),
    t !== Zt && Ht(i, s, t)) {
        let a = o.data[Gt()];
        Xy(o, a, i, i[ue], e, i[s + 1] = eD(t, n), r, s)
    }
}
function qy(e, t) {
    return t >= e.expandoStartIndex
}
function Zy(e, t, n, r) {
    let i = e.data;
    if (i[n + 1] === null) {
        let o = i[Gt()]
          , s = qy(e, n);
        tD(o, r) && t === null && !s && (t = !1),
        t = Yy(i, o, t, r),
        Hy(i, o, t, n, s, r)
    }
}
function Yy(e, t, n, r) {
    let i = cm(e)
      , o = r ? t.residualClasses : t.residualStyles;
    if (i === null)
        (r ? t.classBindings : t.styleBindings) === 0 && (n = qs(null, e, t, n, r),
        n = ur(n, t.attrs, r),
        o = null);
    else {
        let s = t.directiveStylingLast;
        if (s === -1 || e[s] !== i)
            if (n = qs(i, e, t, n, r),
            o === null) {
                let u = Qy(e, t, r);
                u !== void 0 && Array.isArray(u) && (u = qs(null, e, t, u[1], r),
                u = ur(u, t.attrs, r),
                Ky(e, t, r, u))
            } else
                o = Jy(e, t, r)
    }
    return o !== void 0 && (r ? t.residualClasses = o : t.residualStyles = o),
    n
}
function Qy(e, t, n) {
    let r = n ? t.classBindings : t.styleBindings;
    if (bn(r) !== 0)
        return e[zt(r)]
}
function Ky(e, t, n, r) {
    let i = n ? t.classBindings : t.styleBindings;
    e[zt(i)] = r
}
function Jy(e, t, n) {
    let r, i = t.directiveEnd;
    for (let o = 1 + t.directiveStylingLast; o < i; o++) {
        let s = e[o].hostAttrs;
        r = ur(r, s, n)
    }
    return ur(r, t.attrs, n)
}
function qs(e, t, n, r, i) {
    let o = null
      , s = n.directiveEnd
      , a = n.directiveStylingLast;
    for (a === -1 ? a = n.directiveStart : a++; a < s && (o = t[a],
    r = ur(r, o.hostAttrs, i),
    o !== e); )
        a++;
    return e !== null && (n.directiveStylingLast = a),
    r
}
function ur(e, t, n) {
    let r = n ? 1 : 2
      , i = -1;
    if (t !== null)
        for (let o = 0; o < t.length; o++) {
            let s = t[o];
            typeof s == "number" ? i = s : i === r && (Array.isArray(e) || (e = e === void 0 ? [] : ["", e]),
            Nm(e, s, n ? !0 : t[++o]))
        }
    return e === void 0 ? null : e
}
function Xy(e, t, n, r, i, o, s, a) {
    if (!(t.type & 3))
        return;
    let u = e.data
      , c = u[a + 1]
      , l = By(c) ? Rl(u, t, n, i, bn(c), s) : void 0;
    if (!Zi(l)) {
        Zi(o) || Uy(c) && (o = Rl(u, null, n, i, a, s));
        let d = ld(Gt(), n);
        vv(r, s, d, i, o)
    }
}
function Rl(e, t, n, r, i, o) {
    let s = t === null, a;
    for (; i > 0; ) {
        let u = e[i]
          , c = Array.isArray(u)
          , l = c ? u[1] : u
          , d = l === null
          , f = n[i + 1];
        f === Zt && (f = d ? xe : void 0);
        let h = d ? Us(f, r) : l === r ? f : void 0;
        if (c && !Zi(h) && (h = Us(u, r)),
        Zi(h) && (a = h,
        s))
            return a;
        let p = e[i + 1];
        i = s ? zt(p) : bn(p)
    }
    if (t !== null) {
        let u = o ? t.residualClasses : t.residualStyles;
        u != null && (a = Us(u, r))
    }
    return a
}
function Zi(e) {
    return e !== void 0
}
function eD(e, t) {
    return e == null || e === "" || (typeof t == "string" ? e = e + t : typeof e == "object" && (e = ge(iu(e)))),
    e
}
function tD(e, t) {
    return (e.flags & (t ? 8 : 16)) !== 0
}
var tx = new RegExp(`^(\\d+)*(${wv}|${Dv})*(.*)`);
var nD = (e, t) => null;
function cr(e, t) {
    return nD(e, t)
}
var Ma = class {
    destroy(t) {}
    updateValue(t, n) {}
    swap(t, n) {
        let r = Math.min(t, n)
          , i = Math.max(t, n)
          , o = this.detach(i);
        if (i - r > 1) {
            let s = this.detach(r);
            this.attach(r, o),
            this.attach(i, s)
        } else
            this.attach(r, o)
    }
    move(t, n) {
        this.attach(n, this.detach(t))
    }
}
;
function Zs(e, t, n, r, i) {
    return e === n && Object.is(t, r) ? 1 : Object.is(i(e, t), i(n, r)) ? -1 : 0
}
function rD(e, t, n) {
    let r, i, o = 0, s = e.length - 1;
    if (Array.isArray(t)) {
        let a = t.length - 1;
        for (; o <= s && o <= a; ) {
            let u = e.at(o)
              , c = t[o]
              , l = Zs(o, u, o, c, n);
            if (l !== 0) {
                l < 0 && e.updateValue(o, c),
                o++;
                continue
            }
            let d = e.at(s)
              , f = t[a]
              , h = Zs(s, d, a, f, n);
            if (h !== 0) {
                h < 0 && e.updateValue(s, f),
                s--,
                a--;
                continue
            }
            let p = n(o, u)
              , b = n(s, d)
              , y = n(o, c);
            if (Object.is(y, b)) {
                let m = n(a, f);
                Object.is(m, p) ? (e.swap(o, s),
                e.updateValue(s, f),
                a--,
                s--) : e.move(s, o),
                e.updateValue(o, c),
                o++;
                continue
            }
            if (r ??= new Yi,
            i ??= Pl(e, o, s, n),
            _a(e, r, o, y))
                e.updateValue(o, c),
                o++,
                s++;
            else if (i.has(y))
                r.set(p, e.detach(o)),
                s--;
            else {
                let m = e.create(o, t[o]);
                e.attach(o, m),
                o++,
                s++
            }
        }
        for (; o <= a; )
            Fl(e, r, n, o, t[o]),
            o++
    } else if (t != null) {
        let a = t[Symbol.iterator]()
          , u = a.next();
        for (; !u.done && o <= s; ) {
            let c = e.at(o)
              , l = u.value
              , d = Zs(o, c, o, l, n);
            if (d !== 0)
                d < 0 && e.updateValue(o, l),
                o++,
                u = a.next();
            else {
                r ??= new Yi,
                i ??= Pl(e, o, s, n);
                let f = n(o, l);
                if (_a(e, r, o, f))
                    e.updateValue(o, l),
                    o++,
                    s++,
                    u = a.next();
                else if (!i.has(f))
                    e.attach(o, e.create(o, l)),
                    o++,
                    s++,
                    u = a.next();
                else {
                    let h = n(o, c);
                    r.set(h, e.detach(o)),
                    s--
                }
            }
        }
        for (; !u.done; )
            Fl(e, r, n, e.length, u.value),
            u = a.next()
    }
    for (; o <= s; )
        e.destroy(e.detach(s--));
    r?.forEach(a => {
        e.destroy(a)
    }
    )
}
function _a(e, t, n, r) {
    return t !== void 0 && t.has(r) ? (e.attach(n, t.get(r)),
    t.delete(r),
    !0) : !1
}
function Fl(e, t, n, r, i) {
    if (_a(e, t, r, n(r, i)))
        e.updateValue(r, i);
    else {
        let o = e.create(r, i);
        e.attach(r, o)
    }
}
function Pl(e, t, n, r) {
    let i = new Set;
    for (let o = t; o <= n; o++)
        i.add(r(o, e.at(o)));
    return i
}
var Yi = class {
    constructor() {
        this.map = new Map
    }
    has(t) {
        let n = this.map.get(t);
        return n !== void 0 && n.length > 0
    }
    delete(t) {
        let n = this.map.get(t);
        return n !== void 0 ? (n.shift(),
        !0) : !1
    }
    get(t) {
        let n = this.map.get(t);
        return n !== void 0 && n.length > 0 ? n[0] : void 0
    }
    set(t, n) {
        if (!this.map.has(t)) {
            this.map.set(t, [n]);
            return
        }
        this.map.get(t)?.push(n)
    }
    forEach(t) {
        for (let[n,r] of this.map)
            for (let i of r)
                t(i, n)
    }
}
;
function hu(e, t, n, r) {
    let i = t.tView
      , s = e[M] & 4096 ? 4096 : 16
      , a = fo(e, i, n, s, null, t, null, null, null, r?.injector ?? null, r?.dehydratedView ?? null)
      , u = e[t.index];
    a[ro] = u;
    let c = e[rr];
    return c !== null && (a[rr] = c.createEmbeddedView(i)),
    du(i, a, n),
    a
}
function Mf(e, t) {
    let n = me + t;
    if (n < e.length)
        return e[n]
}
function lr(e, t) {
    return !t || zd(e)
}
function go(e, t, n, r=!0) {
    let i = t[S];
    if (rv(i, t, e, n),
    r) {
        let o = fa(n, e)
          , s = t[ue]
          , a = tu(s, e[Lt]);
        a !== null && ev(i, e[je], s, t, a, o)
    }
}
function _f(e, t) {
    let n = or(e, t);
    return n !== void 0 && co(n[S], n),
    n
}
var mo = ( () => {
    let t = class t {
    }
    ;
    t.__NG_ELEMENT_ID__ = iD;
    let e = t;
    return e
}
)();
function iD() {
    let e = Be();
    return sD(e, Z())
}
var oD = mo
  , Sf = class extends oD {
    constructor(t, n, r) {
        super(),
        this._lContainer = t,
        this._hostTNode = n,
        this._hostLView = r
    }
    get element() {
        return su(this._hostTNode, this._hostLView)
    }
    get injector() {
        return new Ft(this._hostTNode,this._hostLView)
    }
    get parentInjector() {
        let t = Wa(this._hostTNode, this._hostLView);
        if (Md(t)) {
            let n = ji(t, this._hostLView)
              , r = Vi(t)
              , i = n[S].data[r + 8];
            return new Ft(i,n)
        } else
            return new Ft(null,this._hostLView)
    }
    clear() {
        for (; this.length > 0; )
            this.remove(this.length - 1)
    }
    get(t) {
        let n = kl(this._lContainer);
        return n !== null && n[t] || null
    }
    get length() {
        return this._lContainer.length - me
    }
    createEmbeddedView(t, n, r) {
        let i, o;
        typeof r == "number" ? i = r : r != null && (i = r.index,
        o = r.injector);
        let s = cr(this._lContainer, t.ssrId)
          , a = t.createEmbeddedViewImpl(n || {}, o, s);
        return this.insertImpl(a, i, lr(this._hostTNode, s)),
        a
    }
    createComponent(t, n, r, i, o) {
        let s = t && !Tm(t), a;
        if (s)
            a = n;
        else {
            let p = n || {};
            a = p.index,
            r = p.injector,
            i = p.projectableNodes,
            o = p.environmentInjector || p.ngModuleRef
        }
        let u = s ? t : new ar(Pt(t))
          , c = r || this.parentInjector;
        if (!o && u.ngModule == null) {
            let b = (s ? c : this.parentInjector).get(Ee, null);
            b && (o = b)
        }
        let l = Pt(u.componentType ?? {})
          , d = cr(this._lContainer, l?.id ?? null)
          , f = d?.firstChild ?? null
          , h = u.create(c, i, f, o);
        return this.insertImpl(h.hostView, a, lr(this._hostTNode, d)),
        h
    }
    insert(t, n) {
        return this.insertImpl(t, n, !0)
    }
    insertImpl(t, n, r) {
        let i = t._lView;
        if (Gg(i)) {
            let a = this.indexOf(t);
            if (a !== -1)
                this.detach(a);
            else {
                let u = i[ne]
                  , c = new Sf(u,u[je],u[ne]);
                c.detach(c.indexOf(t))
            }
        }
        let o = this._adjustIndex(n)
          , s = this._lContainer;
        return go(s, i, o, r),
        t.attachToViewContainerRef(),
        Fd(Ys(s), o, t),
        t
    }
    move(t, n) {
        return this.insert(t, n)
    }
    indexOf(t) {
        let n = kl(this._lContainer);
        return n !== null ? n.indexOf(t) : -1
    }
    remove(t) {
        let n = this._adjustIndex(t, -1)
          , r = or(this._lContainer, n);
        r && (Bi(Ys(this._lContainer), n),
        co(r[S], r))
    }
    detach(t) {
        let n = this._adjustIndex(t, -1)
          , r = or(this._lContainer, n);
        return r && Bi(Ys(this._lContainer), n) != null ? new En(r) : null
    }
    _adjustIndex(t, n=0) {
        return t ?? this.length + n
    }
}
;
function kl(e) {
    return e[Pi]
}
function Ys(e) {
    return e[Pi] || (e[Pi] = [])
}
function sD(e, t) {
    let n, r = t[e.index];
    return Ve(r) ? n = r : (n = gf(r, t, null, e),
    t[e.index] = n,
    po(t, n)),
    uD(n, t, e, r),
    new Sf(n,e,t)
}
function aD(e, t) {
    let n = e[ue]
      , r = n.createComment("")
      , i = Ue(t, e)
      , o = tu(n, i);
    return zi(n, o, r, lv(n, i), !1),
    r
}
var uD = dD
  , cD = (e, t, n) => !1;
function lD(e, t, n) {
    return cD(e, t, n)
}
function dD(e, t, n, r) {
    if (e[Lt])
        return;
    let i;
    n.type & 8 ? i = Qe(r) : i = aD(t, n),
    e[Lt] = i
}
function fD(e, t, n, r, i, o, s, a, u) {
    let c = t.consts
      , l = ho(t, e, 4, s || null, Li(c, a));
    df(t, n, l, Li(c, u)),
    Ga(t, l);
    let d = l.tView = au(2, l, r, i, o, t.directiveRegistry, t.pipeRegistry, null, t.schemas, c, null);
    return t.queries !== null && (t.queries.template(t, l),
    d.queries = t.queries.embeddedTView(l)),
    l
}
function dr(e, t, n, r, i, o, s, a) {
    let u = Z()
      , c = $e()
      , l = e + Me
      , d = c.firstCreatePass ? fD(l, c, u, t, n, r, i, o, s) : c.data[l];
    mr(d, !1);
    let f = hD(c, u, d, e);
    Ha() && nu(c, u, f, d),
    $t(f, u);
    let h = gf(f, u, f, d);
    return u[l] = h,
    po(u, h),
    lD(h, d, u),
    Va(d) && uf(c, u, d),
    s != null && cf(u, d, a),
    dr
}
var hD = pD;
function pD(e, t, n, r) {
    return za(!0),
    t[ue].createComment("")
}
function Tf(e, t, n) {
    Cr("NgControlFlow");
    let r = Z()
      , i = ao()
      , o = Aa(r, Me + e)
      , s = 0;
    if (Ht(r, i, t)) {
        let a = oe(null);
        try {
            if (_f(o, s),
            t !== -1) {
                let u = Na(r[S], Me + t)
                  , c = cr(o, u.tView.ssrId)
                  , l = hu(r, u, n, {
                    dehydratedView: c
                });
                go(o, l, s, lr(u, c))
            }
        } finally {
            oe(a)
        }
    } else {
        let a = Mf(o, s);
        a !== void 0 && (a[ae] = n)
    }
}
var Sa = class {
    constructor(t, n, r) {
        this.lContainer = t,
        this.$implicit = n,
        this.$index = r
    }
    get $count() {
        return this.lContainer.length - me
    }
}
;
var Ta = class {
    constructor(t, n, r) {
        this.hasEmptyBlock = t,
        this.trackByFn = n,
        this.liveCollection = r
    }
}
;
function xf(e, t, n, r, i, o, s, a, u, c, l) {
    Cr("NgControlFlow");
    let d = u !== void 0
      , f = Z()
      , h = a ? s.bind(f[Le][ae]) : s
      , p = new Ta(d,h);
    f[Me + e] = p,
    dr(e + 1, t, n, r, i, o),
    d && dr(e + 2, u, c, l)
}
var xa = class extends Ma {
    constructor(t, n, r) {
        super(),
        this.lContainer = t,
        this.hostLView = n,
        this.templateTNode = r,
        this.needsIndexUpdate = !1
    }
    get length() {
        return this.lContainer.length - me
    }
    at(t) {
        return this.getLView(t)[ae].$implicit
    }
    attach(t, n) {
        let r = n[Fi];
        this.needsIndexUpdate ||= t !== this.length,
        go(this.lContainer, n, t, lr(this.templateTNode, r))
    }
    detach(t) {
        return this.needsIndexUpdate ||= t !== this.length - 1,
        gD(this.lContainer, t)
    }
    create(t, n) {
        let r = cr(this.lContainer, this.templateTNode.tView.ssrId);
        return hu(this.hostLView, this.templateTNode, new Sa(this.lContainer,n,t), {
            dehydratedView: r
        })
    }
    destroy(t) {
        co(t[S], t)
    }
    updateValue(t, n) {
        this.getLView(t)[ae].$implicit = n
    }
    reset() {
        this.needsIndexUpdate = !1
    }
    updateIndexes() {
        if (this.needsIndexUpdate)
            for (let t = 0; t < this.length; t++)
                this.getLView(t)[ae].$index = t
    }
    getLView(t) {
        return mD(this.lContainer, t)
    }
}
;
function Af(e) {
    let t = oe(null)
      , n = Gt();
    try {
        let r = Z()
          , i = r[S]
          , o = r[n];
        if (o.liveCollection === void 0) {
            let a = n + 1
              , u = Aa(r, a)
              , c = Na(i, a);
            o.liveCollection = new xa(u,r,c)
        } else
            o.liveCollection.reset();
        let s = o.liveCollection;
        if (rD(s, e, o.trackByFn),
        s.updateIndexes(),
        o.hasEmptyBlock) {
            let a = ao()
              , u = s.length === 0;
            if (Ht(r, a, u)) {
                let c = n + 2
                  , l = Aa(r, c);
                if (u) {
                    let d = Na(i, c)
                      , f = cr(l, d.tView.ssrId)
                      , h = hu(r, d, void 0, {
                        dehydratedView: f
                    });
                    go(l, h, 0, lr(d, f))
                } else
                    _f(l, 0)
            }
        }
    } finally {
        oe(t)
    }
}
function Aa(e, t) {
    return e[t]
}
function gD(e, t) {
    return or(e, t)
}
function mD(e, t) {
    return Mf(e, t)
}
function Na(e, t) {
    return ja(e, t)
}
function vD(e, t, n, r, i, o) {
    let s = t.consts
      , a = Li(s, i)
      , u = ho(t, e, 2, r, a);
    return df(t, n, u, Li(s, o)),
    u.attrs !== null && wa(u, u.attrs, !1),
    u.mergedAttrs !== null && wa(u, u.mergedAttrs, !0),
    t.queries !== null && t.queries.elementStart(t, u),
    u
}
function A(e, t, n, r) {
    let i = Z()
      , o = $e()
      , s = Me + e
      , a = i[ue]
      , u = o.firstCreatePass ? vD(s, o, i, t, n, r) : o.data[s]
      , c = yD(o, i, u, a, t, e);
    i[s] = c;
    let l = Va(u);
    return mr(u, !0),
    ef(a, c, u),
    (u.flags & 32) !== 32 && Ha() && nu(o, i, c, u),
    Yg() === 0 && $t(c, i),
    Qg(),
    l && (uf(o, i, u),
    af(o, u, i)),
    r !== null && cf(i, u),
    A
}
function N() {
    let e = Be();
    md() ? nm() : (e = e.parent,
    mr(e, !1));
    let t = e;
    Xg(t) && em(),
    Kg();
    let n = $e();
    return n.firstCreatePass && (Ga(n, e),
    sd(e) && n.queries.elementEnd(e)),
    t.classesWithoutHost != null && vm(t) && Ol(n, t, Z(), t.classesWithoutHost, !0),
    t.stylesWithoutHost != null && ym(t) && Ol(n, t, Z(), t.stylesWithoutHost, !1),
    N
}
function Nn(e, t, n, r) {
    return A(e, t, n, r),
    N(),
    Nn
}
var yD = (e, t, n, r, i, o) => (za(!0),
Yd(r, i, hm()));
function vo() {
    return Z()
}
var Rt = void 0;
function DD(e) {
    let t = e
      , n = Math.floor(Math.abs(e))
      , r = e.toString().replace(/^[^.]*\.?/, "").length;
    return n === 1 && r === 0 ? 1 : 5
}
var wD = ["en", [["a", "p"], ["AM", "PM"], Rt], [["AM", "PM"], Rt, Rt], [["S", "M", "T", "W", "T", "F", "S"], ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]], Rt, [["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"], ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]], Rt, [["B", "A"], ["BC", "AD"], ["Before Christ", "Anno Domini"]], 0, [6, 0], ["M/d/yy", "MMM d, y", "MMMM d, y", "EEEE, MMMM d, y"], ["h:mm a", "h:mm:ss a", "h:mm:ss a z", "h:mm:ss a zzzz"], ["{1}, {0}", Rt, "{1} 'at' {0}", Rt], [".", ",", ";", "%", "+", "-", "E", "\xD7", "\u2030", "\u221E", "NaN", ":"], ["#,##0.###", "#,##0%", "\xA4#,##0.00", "#E0"], "USD", "$", "US Dollar", {}, "ltr", DD]
  , Qs = {};
function Ae(e) {
    let t = CD(e)
      , n = Ll(t);
    if (n)
        return n;
    let r = t.split("-")[0];
    if (n = Ll(r),
    n)
        return n;
    if (r === "en")
        return wD;
    throw new D(701,!1)
}
function Ll(e) {
    return e in Qs || (Qs[e] = rt.ng && rt.ng.common && rt.ng.common.locales && rt.ng.common.locales[e]),
    Qs[e]
}
var J = function(e) {
    return e[e.LocaleId = 0] = "LocaleId",
    e[e.DayPeriodsFormat = 1] = "DayPeriodsFormat",
    e[e.DayPeriodsStandalone = 2] = "DayPeriodsStandalone",
    e[e.DaysFormat = 3] = "DaysFormat",
    e[e.DaysStandalone = 4] = "DaysStandalone",
    e[e.MonthsFormat = 5] = "MonthsFormat",
    e[e.MonthsStandalone = 6] = "MonthsStandalone",
    e[e.Eras = 7] = "Eras",
    e[e.FirstDayOfWeek = 8] = "FirstDayOfWeek",
    e[e.WeekendRange = 9] = "WeekendRange",
    e[e.DateFormat = 10] = "DateFormat",
    e[e.TimeFormat = 11] = "TimeFormat",
    e[e.DateTimeFormat = 12] = "DateTimeFormat",
    e[e.NumberSymbols = 13] = "NumberSymbols",
    e[e.NumberFormats = 14] = "NumberFormats",
    e[e.CurrencyCode = 15] = "CurrencyCode",
    e[e.CurrencySymbol = 16] = "CurrencySymbol",
    e[e.CurrencyName = 17] = "CurrencyName",
    e[e.Currencies = 18] = "Currencies",
    e[e.Directionality = 19] = "Directionality",
    e[e.PluralCase = 20] = "PluralCase",
    e[e.ExtraData = 21] = "ExtraData",
    e
}(J || {});
function CD(e) {
    return e.toLowerCase().replace(/_/g, "-")
}
var Qi = "en-US";
var ED = Qi;
function bD(e) {
    cg(e, "Expected localeId to be defined"),
    typeof e == "string" && (ED = e.toLowerCase().replace(/_/g, "-"))
}
function Yt(e) {
    return !!e && typeof e.then == "function"
}
function Nf(e) {
    return !!e && typeof e.subscribe == "function"
}
function _e(e, t, n, r) {
    let i = Z()
      , o = $e()
      , s = Be();
    return MD(o, i, i[ue], s, e, t, r),
    _e
}
function ID(e, t, n, r) {
    let i = e.cleanup;
    if (i != null)
        for (let o = 0; o < i.length - 1; o += 2) {
            let s = i[o];
            if (s === n && i[o + 1] === r) {
                let a = t[er]
                  , u = i[o + 2];
                return a.length > u ? a[u] : null
            }
            typeof s == "string" && (o += 2)
        }
    return null
}
function MD(e, t, n, r, i, o, s) {
    let a = Va(r)
      , c = e.firstCreatePass && oy(e)
      , l = t[ae]
      , d = iy(t)
      , f = !0;
    if (r.type & 3 || s) {
        let b = Ue(r, t)
          , y = s ? s(b) : b
          , m = d.length
          , Q = s ? q => s(Qe(q[r.index])) : r.index
          , ie = null;
        if (!s && a && (ie = ID(e, t, i, r.index)),
        ie !== null) {
            let q = ie.__ngLastListenerFn__ || ie;
            q.__ngNextListenerFn__ = o,
            ie.__ngLastListenerFn__ = o,
            f = !1
        } else {
            o = jl(r, t, l, o, !1);
            let q = n.listen(y, i, o);
            d.push(o, q),
            c && c.push(i, Q, m, m + 1)
        }
    } else
        o = jl(r, t, l, o, !1);
    let h = r.outputs, p;
    if (f && h !== null && (p = h[i])) {
        let b = p.length;
        if (b)
            for (let y = 0; y < b; y += 2) {
                let m = p[y]
                  , Q = p[y + 1]
                  , ze = t[m][Q].subscribe(o)
                  , be = d.length;
                d.push(o, ze),
                c && c.push(i, r.index, be, -(be + 1))
            }
    }
}
function Vl(e, t, n, r) {
    try {
        return qe(6, t, n),
        n(r) !== !1
    } catch (i) {
        return vf(e, i),
        !1
    } finally {
        qe(7, t, n)
    }
}
function jl(e, t, n, r, i) {
    return function o(s) {
        if (s === Function)
            return r;
        let a = e.componentOffset > -1 ? bt(e.index, t) : t;
        cu(a);
        let u = Vl(t, n, r, s)
          , c = o.__ngNextListenerFn__;
        for (; c; )
            u = Vl(t, n, c, s) && u,
            c = c.__ngNextListenerFn__;
        return i && u === !1 && s.preventDefault(),
        u
    }
}
function Er(e=1) {
    return dm(e)
}
function _D(e, t, n, r) {
    n >= e.data.length && (e.data[n] = null,
    e.blueprint[n] = null),
    t[n] = r
}
function U(e, t="") {
    let n = Z()
      , r = $e()
      , i = e + Me
      , o = r.firstCreatePass ? ho(r, i, 1, t, null) : r.data[i]
      , s = SD(r, n, o, t, e);
    n[i] = s,
    Ha() && nu(r, n, s, o),
    mr(o, !1)
}
var SD = (e, t, n, r, i) => (za(!0),
Km(t[ue], r));
function yo(e) {
    return Do("", e, ""),
    yo
}
function Do(e, t, n) {
    let r = Z()
      , i = jy(r, e, t, n);
    return i !== Zt && sy(r, Gt(), i),
    Do
}
function TD(e, t, n) {
    let r = $e();
    if (r.firstCreatePass) {
        let i = Dt(e);
        Oa(n, r.data, r.blueprint, i, !0),
        Oa(t, r.data, r.blueprint, i, !1)
    }
}
function Oa(e, t, n, r, i) {
    if (e = he(e),
    Array.isArray(e))
        for (let o = 0; o < e.length; o++)
            Oa(e[o], t, n, r, i);
    else {
        let o = $e()
          , s = Z()
          , a = Be()
          , u = Cn(e) ? e : he(e.provide)
          , c = Ud(e)
          , l = a.providerIndexes & 1048575
          , d = a.directiveStart
          , f = a.providerIndexes >> 20;
        if (Cn(e) || !e.multi) {
            let h = new Ut(c,i,Y)
              , p = Js(u, t, i ? l : l + f, d);
            p === -1 ? (sa($i(a, s), o, u),
            Ks(o, e, t.length),
            t.push(u),
            a.directiveStart++,
            a.directiveEnd++,
            i && (a.providerIndexes += 1048576),
            n.push(h),
            s.push(h)) : (n[p] = h,
            s[p] = h)
        } else {
            let h = Js(u, t, l + f, d)
              , p = Js(u, t, l, l + f)
              , b = h >= 0 && n[h]
              , y = p >= 0 && n[p];
            if (i && !y || !i && !b) {
                sa($i(a, s), o, u);
                let m = ND(i ? AD : xD, n.length, i, r, c);
                !i && y && (n[p].providerFactory = m),
                Ks(o, e, t.length, 0),
                t.push(u),
                a.directiveStart++,
                a.directiveEnd++,
                i && (a.providerIndexes += 1048576),
                n.push(m),
                s.push(m)
            } else {
                let m = Of(n[i ? p : h], c, !i && r);
                Ks(o, e, h > -1 ? h : p, m)
            }
            !i && r && y && n[p].componentProviders++
        }
    }
}
function Ks(e, t, n, r) {
    let i = Cn(t)
      , o = Lm(t);
    if (i || o) {
        let u = (o ? he(t.useClass) : t).prototype.ngOnDestroy;
        if (u) {
            let c = e.destroyHooks || (e.destroyHooks = []);
            if (!i && t.multi) {
                let l = c.indexOf(n);
                l === -1 ? c.push(n, [r, u]) : c[l + 1].push(r, u)
            } else
                c.push(n, u)
        }
    }
}
function Of(e, t, n) {
    return n && e.componentProviders++,
    e.multi.push(t) - 1
}
function Js(e, t, n, r) {
    for (let i = n; i < r; i++)
        if (t[i] === e)
            return i;
    return -1
}
function xD(e, t, n, r) {
    return Ra(this.multi, [])
}
function AD(e, t, n, r) {
    let i = this.multi, o;
    if (this.providerFactory) {
        let s = this.providerFactory.componentProviders
          , a = wn(n, n[S], this.providerFactory.index, r);
        o = a.slice(0, s),
        Ra(i, o);
        for (let u = s; u < a.length; u++)
            o.push(a[u])
    } else
        o = [],
        Ra(i, o);
    return o
}
function Ra(e, t) {
    for (let n = 0; n < e.length; n++) {
        let r = e[n];
        t.push(r())
    }
    return t
}
function ND(e, t, n, r, i) {
    let o = new Ut(e,n,Y);
    return o.multi = [],
    o.index = t,
    o.componentProviders = 0,
    Of(o, i, r && !n),
    o
}
function pu(e, t=[]) {
    return n => {
        n.providersResolver = (r, i) => TD(r, i ? i(e) : e, t)
    }
}
var wt = class {
}
  , fr = class {
}
;
var Fa = class extends wt {
    constructor(t, n, r) {
        super(),
        this._parent = n,
        this._bootstrapComponents = [],
        this.destroyCbs = [],
        this.componentFactoryResolver = new qi(this);
        let i = td(t);
        this._bootstrapComponents = Hd(i.bootstrap),
        this._r3Injector = $d(t, n, [{
            provide: wt,
            useValue: this
        }, {
            provide: lo,
            useValue: this.componentFactoryResolver
        }, ...r], ge(t), new Set(["environment"])),
        this._r3Injector.resolveInjectorInitializers(),
        this.instance = this._r3Injector.get(t)
    }
    get injector() {
        return this._r3Injector
    }
    destroy() {
        let t = this._r3Injector;
        !t.destroyed && t.destroy(),
        this.destroyCbs.forEach(n => n()),
        this.destroyCbs = null
    }
    onDestroy(t) {
        this.destroyCbs.push(t)
    }
}
  , Pa = class extends fr {
    constructor(t) {
        super(),
        this.moduleType = t
    }
    create(t) {
        return new Fa(this.moduleType,t,[])
    }
}
;
var Ki = class extends wt {
    constructor(t) {
        super(),
        this.componentFactoryResolver = new qi(this),
        this.instance = null;
        let n = new ir([...t.providers, {
            provide: wt,
            useValue: this
        }, {
            provide: lo,
            useValue: this.componentFactoryResolver
        }],t.parent || Ya(),t.debugName,new Set(["environment"]));
        this.injector = n,
        t.runEnvironmentInitializers && n.resolveInjectorInitializers()
    }
    destroy() {
        this.injector.destroy()
    }
    onDestroy(t) {
        this.injector.onDestroy(t)
    }
}
;
function gu(e, t, n=null) {
    return new Ki({
        providers: e,
        parent: t,
        debugName: n,
        runEnvironmentInitializers: !0
    }).injector
}
var OD = ( () => {
    let t = class t {
        constructor(r) {
            this._injector = r,
            this.cachedInjectors = new Map
        }
        getOrCreateStandaloneInjector(r) {
            if (!r.standalone)
                return null;
            if (!this.cachedInjectors.has(r)) {
                let i = Ld(!1, r.type)
                  , o = i.length > 0 ? gu([i], this._injector, `Standalone[${r.type.name}]`) : null;
                this.cachedInjectors.set(r, o)
            }
            return this.cachedInjectors.get(r)
        }
        ngOnDestroy() {
            try {
                for (let r of this.cachedInjectors.values())
                    r !== null && r.destroy()
            } finally {
                this.cachedInjectors.clear()
            }
        }
    }
    ;
    t.\u0275prov = E({
        token: t,
        providedIn: "environment",
        factory: () => new t(I(Ee))
    });
    let e = t;
    return e
}
)();
function wo(e) {
    Cr("NgStandalone"),
    e.getStandaloneInjector = t => t.get(OD).getOrCreateStandaloneInjector(e)
}
function RD(e, t) {
    let n = e[t];
    return n === Zt ? void 0 : n
}
function FD(e, t, n, r, i, o, s) {
    let a = t + n;
    return Vy(e, a, i, o) ? Ly(e, a + 2, s ? r.call(s, i, o) : r(i, o)) : RD(e, a + 2)
}
function Rf(e, t) {
    let n = $e(), r, i = e + Me;
    n.firstCreatePass ? (r = PD(t, n.pipeRegistry),
    n.data[i] = r,
    r.onDestroy && (n.destroyHooks ??= []).push(i, r.onDestroy)) : r = n.data[i];
    let o = r.factory || (r.factory = Vt(r.type, !0)), s, a = Ce(Y);
    try {
        let u = Ui(!1)
          , c = o();
        return Ui(u),
        _D(n, Z(), i, c),
        c
    } finally {
        Ce(a)
    }
}
function PD(e, t) {
    if (t)
        for (let n = t.length - 1; n >= 0; n--) {
            let r = t[n];
            if (e === r.name)
                return r
        }
}
function Ff(e, t, n, r) {
    let i = e + Me
      , o = Z()
      , s = zg(o, i);
    return kD(o, i) ? FD(o, rm(), t, s.transform, n, r, s) : s.transform(n, r)
}
function kD(e, t) {
    return e[S].data[t].pure
}
var Pf = new w("Application Initializer")
  , kf = ( () => {
    let t = class t {
        constructor() {
            this.initialized = !1,
            this.done = !1,
            this.donePromise = new Promise( (r, i) => {
                this.resolve = r,
                this.reject = i
            }
            ),
            this.appInits = g(Pf, {
                optional: !0
            }) ?? []
        }
        runInitializers() {
            if (this.initialized)
                return;
            let r = [];
            for (let o of this.appInits) {
                let s = o();
                if (Yt(s))
                    r.push(s);
                else if (Nf(s)) {
                    let a = new Promise( (u, c) => {
                        s.subscribe({
                            complete: u,
                            error: c
                        })
                    }
                    );
                    r.push(a)
                }
            }
            let i = () => {
                this.done = !0,
                this.resolve()
            }
            ;
            Promise.all(r).then( () => {
                i()
            }
            ).catch(o => {
                this.reject(o)
            }
            ),
            r.length === 0 && i(),
            this.initialized = !0
        }
    }
    ;
    t.\u0275fac = function(i) {
        return new (i || t)
    }
    ,
    t.\u0275prov = E({
        token: t,
        factory: t.\u0275fac,
        providedIn: "root"
    });
    let e = t;
    return e
}
)()
  , Co = ( () => {
    let t = class t {
        log(r) {
            console.log(r)
        }
        warn(r) {
            console.warn(r)
        }
    }
    ;
    t.\u0275fac = function(i) {
        return new (i || t)
    }
    ,
    t.\u0275prov = E({
        token: t,
        factory: t.\u0275fac,
        providedIn: "platform"
    });
    let e = t;
    return e
}
)();
function LD() {
    return typeof $localize < "u" && $localize.locale || Qi
}
var Eo = new w("LocaleId",{
    providedIn: "root",
    factory: () => g(Eo, F.Optional | F.SkipSelf) || LD()
});
var br = ( () => {
    let t = class t {
        constructor() {
            this.taskId = 0,
            this.pendingTasks = new Set,
            this.hasPendingTasks = new se(!1)
        }
        add() {
            this.hasPendingTasks.next(!0);
            let r = this.taskId++;
            return this.pendingTasks.add(r),
            r
        }
        remove(r) {
            this.pendingTasks.delete(r),
            this.pendingTasks.size === 0 && this.hasPendingTasks.next(!1)
        }
        ngOnDestroy() {
            this.pendingTasks.clear(),
            this.hasPendingTasks.next(!1)
        }
    }
    ;
    t.\u0275fac = function(i) {
        return new (i || t)
    }
    ,
    t.\u0275prov = E({
        token: t,
        factory: t.\u0275fac,
        providedIn: "root"
    });
    let e = t;
    return e
}
)()
  , ka = class {
    constructor(t, n) {
        this.ngModuleFactory = t,
        this.componentFactories = n
    }
}
  , mu = ( () => {
    let t = class t {
        compileModuleSync(r) {
            return new Pa(r)
        }
        compileModuleAsync(r) {
            return Promise.resolve(this.compileModuleSync(r))
        }
        compileModuleAndAllComponentsSync(r) {
            let i = this.compileModuleSync(r)
              , o = td(r)
              , s = Hd(o.declarations).reduce( (a, u) => {
                let c = Pt(u);
                return c && a.push(new ar(c)),
                a
            }
            , []);
            return new ka(i,s)
        }
        compileModuleAndAllComponentsAsync(r) {
            return Promise.resolve(this.compileModuleAndAllComponentsSync(r))
        }
        clearCache() {}
        clearCacheFor(r) {}
        getModuleId(r) {}
    }
    ;
    t.\u0275fac = function(i) {
        return new (i || t)
    }
    ,
    t.\u0275prov = E({
        token: t,
        factory: t.\u0275fac,
        providedIn: "root"
    });
    let e = t;
    return e
}
)();
var Lf = new w("");
var Ni = null;
var Vf = new w("PlatformDestroyListeners")
  , bo = new w("appBootstrapListener");
function VD() {
    Fc( () => {
        throw new D(600,!1)
    }
    )
}
function jD(e) {
    return e.isBoundToModule
}
function UD(e=[]) {
    if (Ni)
        return Ni;
    let t = BD(e);
    return Ni = t,
    VD(),
    $D(t),
    t
}
function $D(e) {
    e.get(Ka, null)?.forEach(n => n())
}
function jf(e) {
    try {
        let {rootComponent: t, appProviders: n, platformProviders: r} = e
          , i = UD(r)
          , o = [ZD(), ...n || []]
          , a = new Ki({
            providers: o,
            parent: i,
            debugName: "",
            runEnvironmentInitializers: !1
        }).injector
          , u = a.get(K);
        return u.run( () => {
            a.resolveInjectorInitializers();
            let c = a.get(ot, null), l;
            u.runOutsideAngular( () => {
                l = u.onError.subscribe({
                    next: h => {
                        c.handleError(h)
                    }
                })
            }
            );
            let d = () => a.destroy()
              , f = i.get(Vf);
            return f.add(d),
            a.onDestroy( () => {
                l.unsubscribe(),
                f.delete(d)
            }
            ),
            zD(c, u, () => {
                let h = a.get(kf);
                return h.runInitializers(),
                h.donePromise.then( () => {
                    let p = a.get(Eo, Qi);
                    bD(p || Qi);
                    let b = a.get(On);
                    return t !== void 0 && b.bootstrap(t),
                    b
                }
                )
            }
            )
        }
        )
    } catch (t) {
        return Promise.reject(t)
    }
}
function BD(e=[], t) {
    return Wt.create({
        name: t,
        providers: [{
            provide: uo,
            useValue: "platform"
        }, {
            provide: Vf,
            useValue: new Set([ () => Ni = null])
        }, ...e]
    })
}
function HD(e) {
    return {
        enableLongStackTrace: !1,
        shouldCoalesceEventChangeDetection: e?.eventCoalescing ?? !1,
        shouldCoalesceRunChangeDetection: e?.runCoalescing ?? !1
    }
}
function zD(e, t, n) {
    try {
        let r = n();
        return Yt(r) ? r.catch(i => {
            throw t.runOutsideAngular( () => e.handleError(i)),
            i
        }
        ) : r
    } catch (r) {
        throw t.runOutsideAngular( () => e.handleError(r)),
        r
    }
}
var On = ( () => {
    let t = class t {
        constructor() {
            this._bootstrapListeners = [],
            this._runningTick = !1,
            this._destroyed = !1,
            this._destroyListeners = [],
            this._views = [],
            this.internalErrorHandler = g(Uf),
            this.zoneIsStable = g(bf),
            this.componentTypes = [],
            this.components = [],
            this.isStable = g(br).hasPendingTasks.pipe(fe(r => r ? C(!1) : this.zoneIsStable), Ns(), bi()),
            this._injector = g(Ee)
        }
        get destroyed() {
            return this._destroyed
        }
        get injector() {
            return this._injector
        }
        bootstrap(r, i) {
            let o = r instanceof Gi;
            if (!this._injector.get(kf).done) {
                let p = "Cannot bootstrap as there are still asynchronous initializers running." + (!o && ed(r) ? "" : " Bootstrap components in the `ngDoBootstrap` method of the root module.");
                throw new D(405,!1)
            }
            let a;
            o ? a = r : a = this._injector.get(lo).resolveComponentFactory(r),
            this.componentTypes.push(a.componentType);
            let u = jD(a) ? void 0 : this._injector.get(wt)
              , c = i || a.selector
              , l = a.create(Wt.NULL, [], c, u)
              , d = l.location.nativeElement
              , f = l.injector.get(Lf, null);
            return f?.registerApplication(d),
            l.onDestroy( () => {
                this.detachView(l.hostView),
                Xs(this.components, l),
                f?.unregisterApplication(d)
            }
            ),
            this._loadComponent(l),
            l
        }
        tick() {
            if (this._runningTick)
                throw new D(101,!1);
            try {
                this._runningTick = !0;
                for (let r of this._views)
                    r.detectChanges()
            } catch (r) {
                this.internalErrorHandler(r)
            } finally {
                this._runningTick = !1
            }
        }
        attachView(r) {
            let i = r;
            this._views.push(i),
            i.attachToAppRef(this)
        }
        detachView(r) {
            let i = r;
            Xs(this._views, i),
            i.detachFromAppRef()
        }
        _loadComponent(r) {
            this.attachView(r.hostView),
            this.tick(),
            this.components.push(r);
            let i = this._injector.get(bo, []);
            [...this._bootstrapListeners, ...i].forEach(o => o(r))
        }
        ngOnDestroy() {
            if (!this._destroyed)
                try {
                    this._destroyListeners.forEach(r => r()),
                    this._views.slice().forEach(r => r.destroy())
                } finally {
                    this._destroyed = !0,
                    this._views = [],
                    this._bootstrapListeners = [],
                    this._destroyListeners = []
                }
        }
        onDestroy(r) {
            return this._destroyListeners.push(r),
            () => Xs(this._destroyListeners, r)
        }
        destroy() {
            if (this._destroyed)
                throw new D(406,!1);
            let r = this._injector;
            r.destroy && !r.destroyed && r.destroy()
        }
        get viewCount() {
            return this._views.length
        }
        warnIfDestroyed() {}
    }
    ;
    t.\u0275fac = function(i) {
        return new (i || t)
    }
    ,
    t.\u0275prov = E({
        token: t,
        factory: t.\u0275fac,
        providedIn: "root"
    });
    let e = t;
    return e
}
)();
function Xs(e, t) {
    let n = e.indexOf(t);
    n > -1 && e.splice(n, 1)
}
var Uf = new w("",{
    providedIn: "root",
    factory: () => g(ot).handleError.bind(void 0)
});
function GD() {
    let e = g(K)
      , t = g(ot);
    return n => e.runOutsideAngular( () => t.handleError(n))
}
var WD = ( () => {
    let t = class t {
        constructor() {
            this.zone = g(K),
            this.applicationRef = g(On)
        }
        initialize() {
            this._onMicrotaskEmptySubscription || (this._onMicrotaskEmptySubscription = this.zone.onMicrotaskEmpty.subscribe({
                next: () => {
                    this.zone.run( () => {
                        this.applicationRef.tick()
                    }
                    )
                }
            }))
        }
        ngOnDestroy() {
            this._onMicrotaskEmptySubscription?.unsubscribe()
        }
    }
    ;
    t.\u0275fac = function(i) {
        return new (i || t)
    }
    ,
    t.\u0275prov = E({
        token: t,
        factory: t.\u0275fac,
        providedIn: "root"
    });
    let e = t;
    return e
}
)();
function qD(e) {
    return [{
        provide: K,
        useFactory: e
    }, {
        provide: Dr,
        multi: !0,
        useFactory: () => {
            let t = g(WD, {
                optional: !0
            });
            return () => t.initialize()
        }
    }, {
        provide: Uf,
        useFactory: GD
    }, {
        provide: bf,
        useFactory: If
    }]
}
function ZD(e) {
    let t = qD( () => new K(HD(e)));
    return _n([[], t])
}
function Io(e) {
    return typeof e == "boolean" ? e : e != null && e !== "false"
}
var wu = null;
function ft() {
    return wu
}
function zf(e) {
    wu || (wu = e)
}
var Oo = class {
}
  , ye = new w("DocumentToken")
  , Gf = ( () => {
    let t = class t {
        historyGo(r) {
            throw new Error("Not implemented")
        }
    }
    ;
    t.\u0275fac = function(i) {
        return new (i || t)
    }
    ,
    t.\u0275prov = E({
        token: t,
        factory: () => g(KD),
        providedIn: "platform"
    });
    let e = t;
    return e
}
)();
var KD = ( () => {
    let t = class t extends Gf {
        constructor() {
            super(),
            this._doc = g(ye),
            this._location = window.location,
            this._history = window.history
        }
        getBaseHrefFromDOM() {
            return ft().getBaseHref(this._doc)
        }
        onPopState(r) {
            let i = ft().getGlobalEventTarget(this._doc, "window");
            return i.addEventListener("popstate", r, !1),
            () => i.removeEventListener("popstate", r)
        }
        onHashChange(r) {
            let i = ft().getGlobalEventTarget(this._doc, "window");
            return i.addEventListener("hashchange", r, !1),
            () => i.removeEventListener("hashchange", r)
        }
        get href() {
            return this._location.href
        }
        get protocol() {
            return this._location.protocol
        }
        get hostname() {
            return this._location.hostname
        }
        get port() {
            return this._location.port
        }
        get pathname() {
            return this._location.pathname
        }
        get search() {
            return this._location.search
        }
        get hash() {
            return this._location.hash
        }
        set pathname(r) {
            this._location.pathname = r
        }
        pushState(r, i, o) {
            this._history.pushState(r, i, o)
        }
        replaceState(r, i, o) {
            this._history.replaceState(r, i, o)
        }
        forward() {
            this._history.forward()
        }
        back() {
            this._history.back()
        }
        historyGo(r=0) {
            this._history.go(r)
        }
        getState() {
            return this._history.state
        }
    }
    ;
    t.\u0275fac = function(i) {
        return new (i || t)
    }
    ,
    t.\u0275prov = E({
        token: t,
        factory: () => new t,
        providedIn: "platform"
    });
    let e = t;
    return e
}
)();
function Wf(e, t) {
    if (e.length == 0)
        return t;
    if (t.length == 0)
        return e;
    let n = 0;
    return e.endsWith("/") && n++,
    t.startsWith("/") && n++,
    n == 2 ? e + t.substring(1) : n == 1 ? e + t : e + "/" + t
}
function $f(e) {
    let t = e.match(/#|\?|$/)
      , n = t && t.index || e.length
      , r = n - (e[n - 1] === "/" ? 1 : 0);
    return e.slice(0, r) + e.slice(n)
}
function Kt(e) {
    return e && e[0] !== "?" ? "?" + e : e
}
var Fo = ( () => {
    let t = class t {
        historyGo(r) {
            throw new Error("Not implemented")
        }
    }
    ;
    t.\u0275fac = function(i) {
        return new (i || t)
    }
    ,
    t.\u0275prov = E({
        token: t,
        factory: () => g(qf),
        providedIn: "root"
    });
    let e = t;
    return e
}
)()
  , JD = new w("appBaseHref")
  , qf = ( () => {
    let t = class t extends Fo {
        constructor(r, i) {
            super(),
            this._platformLocation = r,
            this._removeListenerFns = [],
            this._baseHref = i ?? this._platformLocation.getBaseHrefFromDOM() ?? g(ye).location?.origin ?? ""
        }
        ngOnDestroy() {
            for (; this._removeListenerFns.length; )
                this._removeListenerFns.pop()()
        }
        onPopState(r) {
            this._removeListenerFns.push(this._platformLocation.onPopState(r), this._platformLocation.onHashChange(r))
        }
        getBaseHref() {
            return this._baseHref
        }
        prepareExternalUrl(r) {
            return Wf(this._baseHref, r)
        }
        path(r=!1) {
            let i = this._platformLocation.pathname + Kt(this._platformLocation.search)
              , o = this._platformLocation.hash;
            return o && r ? `${i}${o}` : i
        }
        pushState(r, i, o, s) {
            let a = this.prepareExternalUrl(o + Kt(s));
            this._platformLocation.pushState(r, i, a)
        }
        replaceState(r, i, o, s) {
            let a = this.prepareExternalUrl(o + Kt(s));
            this._platformLocation.replaceState(r, i, a)
        }
        forward() {
            this._platformLocation.forward()
        }
        back() {
            this._platformLocation.back()
        }
        getState() {
            return this._platformLocation.getState()
        }
        historyGo(r=0) {
            this._platformLocation.historyGo?.(r)
        }
    }
    ;
    t.\u0275fac = function(i) {
        return new (i || t)(I(Gf),I(JD, 8))
    }
    ,
    t.\u0275prov = E({
        token: t,
        factory: t.\u0275fac,
        providedIn: "root"
    });
    let e = t;
    return e
}
)();
var Mr = ( () => {
    let t = class t {
        constructor(r) {
            this._subject = new pe,
            this._urlChangeListeners = [],
            this._urlChangeSubscription = null,
            this._locationStrategy = r;
            let i = this._locationStrategy.getBaseHref();
            this._basePath = tw($f(Bf(i))),
            this._locationStrategy.onPopState(o => {
                this._subject.emit({
                    url: this.path(!0),
                    pop: !0,
                    state: o.state,
                    type: o.type
                })
            }
            )
        }
        ngOnDestroy() {
            this._urlChangeSubscription?.unsubscribe(),
            this._urlChangeListeners = []
        }
        path(r=!1) {
            return this.normalize(this._locationStrategy.path(r))
        }
        getState() {
            return this._locationStrategy.getState()
        }
        isCurrentPathEqualTo(r, i="") {
            return this.path() == this.normalize(r + Kt(i))
        }
        normalize(r) {
            return t.stripTrailingSlash(ew(this._basePath, Bf(r)))
        }
        prepareExternalUrl(r) {
            return r && r[0] !== "/" && (r = "/" + r),
            this._locationStrategy.prepareExternalUrl(r)
        }
        go(r, i="", o=null) {
            this._locationStrategy.pushState(o, "", r, i),
            this._notifyUrlChangeListeners(this.prepareExternalUrl(r + Kt(i)), o)
        }
        replaceState(r, i="", o=null) {
            this._locationStrategy.replaceState(o, "", r, i),
            this._notifyUrlChangeListeners(this.prepareExternalUrl(r + Kt(i)), o)
        }
        forward() {
            this._locationStrategy.forward()
        }
        back() {
            this._locationStrategy.back()
        }
        historyGo(r=0) {
            this._locationStrategy.historyGo?.(r)
        }
        onUrlChange(r) {
            return this._urlChangeListeners.push(r),
            this._urlChangeSubscription || (this._urlChangeSubscription = this.subscribe(i => {
                this._notifyUrlChangeListeners(i.url, i.state)
            }
            )),
            () => {
                let i = this._urlChangeListeners.indexOf(r);
                this._urlChangeListeners.splice(i, 1),
                this._urlChangeListeners.length === 0 && (this._urlChangeSubscription?.unsubscribe(),
                this._urlChangeSubscription = null)
            }
        }
        _notifyUrlChangeListeners(r="", i) {
            this._urlChangeListeners.forEach(o => o(r, i))
        }
        subscribe(r, i, o) {
            return this._subject.subscribe({
                next: r,
                error: i,
                complete: o
            })
        }
    }
    ;
    t.normalizeQueryParams = Kt,
    t.joinWithSlash = Wf,
    t.stripTrailingSlash = $f,
    t.\u0275fac = function(i) {
        return new (i || t)(I(Fo))
    }
    ,
    t.\u0275prov = E({
        token: t,
        factory: () => XD(),
        providedIn: "root"
    });
    let e = t;
    return e
}
)();
function XD() {
    return new Mr(I(Fo))
}
function ew(e, t) {
    if (!e || !t.startsWith(e))
        return t;
    let n = t.substring(e.length);
    return n === "" || ["/", ";", "?", "#"].includes(n[0]) ? n : t
}
function Bf(e) {
    return e.replace(/\/index.html$/, "")
}
function tw(e) {
    if (new RegExp("^(https?:)?//").test(e)) {
        let[,n] = e.split(/\/\/[^\/]+/);
        return n
    }
    return e
}
var ve = function(e) {
    return e[e.Format = 0] = "Format",
    e[e.Standalone = 1] = "Standalone",
    e
}(ve || {})
  , B = function(e) {
    return e[e.Narrow = 0] = "Narrow",
    e[e.Abbreviated = 1] = "Abbreviated",
    e[e.Wide = 2] = "Wide",
    e[e.Short = 3] = "Short",
    e
}(B || {})
  , Se = function(e) {
    return e[e.Short = 0] = "Short",
    e[e.Medium = 1] = "Medium",
    e[e.Long = 2] = "Long",
    e[e.Full = 3] = "Full",
    e
}(Se || {})
  , lt = function(e) {
    return e[e.Decimal = 0] = "Decimal",
    e[e.Group = 1] = "Group",
    e[e.List = 2] = "List",
    e[e.PercentSign = 3] = "PercentSign",
    e[e.PlusSign = 4] = "PlusSign",
    e[e.MinusSign = 5] = "MinusSign",
    e[e.Exponential = 6] = "Exponential",
    e[e.SuperscriptingExponent = 7] = "SuperscriptingExponent",
    e[e.PerMille = 8] = "PerMille",
    e[e.Infinity = 9] = "Infinity",
    e[e.NaN = 10] = "NaN",
    e[e.TimeSeparator = 11] = "TimeSeparator",
    e[e.CurrencyDecimal = 12] = "CurrencyDecimal",
    e[e.CurrencyGroup = 13] = "CurrencyGroup",
    e
}(lt || {});
function nw(e) {
    return Ae(e)[J.LocaleId]
}
function rw(e, t, n) {
    let r = Ae(e)
      , i = [r[J.DayPeriodsFormat], r[J.DayPeriodsStandalone]]
      , o = Ne(i, t);
    return Ne(o, n)
}
function iw(e, t, n) {
    let r = Ae(e)
      , i = [r[J.DaysFormat], r[J.DaysStandalone]]
      , o = Ne(i, t);
    return Ne(o, n)
}
function ow(e, t, n) {
    let r = Ae(e)
      , i = [r[J.MonthsFormat], r[J.MonthsStandalone]]
      , o = Ne(i, t);
    return Ne(o, n)
}
function sw(e, t) {
    let r = Ae(e)[J.Eras];
    return Ne(r, t)
}
function Mo(e, t) {
    let n = Ae(e);
    return Ne(n[J.DateFormat], t)
}
function _o(e, t) {
    let n = Ae(e);
    return Ne(n[J.TimeFormat], t)
}
function So(e, t) {
    let r = Ae(e)[J.DateTimeFormat];
    return Ne(r, t)
}
function Po(e, t) {
    let n = Ae(e)
      , r = n[J.NumberSymbols][t];
    if (typeof r > "u") {
        if (t === lt.CurrencyDecimal)
            return n[J.NumberSymbols][lt.Decimal];
        if (t === lt.CurrencyGroup)
            return n[J.NumberSymbols][lt.Group]
    }
    return r
}
function Zf(e) {
    if (!e[J.ExtraData])
        throw new Error(`Missing extra locale data for the locale "${e[J.LocaleId]}". Use "registerLocaleData" to load new data. See the "I18n guide" on angular.io to know more.`)
}
function aw(e) {
    let t = Ae(e);
    return Zf(t),
    (t[J.ExtraData][2] || []).map(r => typeof r == "string" ? vu(r) : [vu(r[0]), vu(r[1])])
}
function uw(e, t, n) {
    let r = Ae(e);
    Zf(r);
    let i = [r[J.ExtraData][0], r[J.ExtraData][1]]
      , o = Ne(i, t) || [];
    return Ne(o, n) || []
}
function Ne(e, t) {
    for (let n = t; n > -1; n--)
        if (typeof e[n] < "u")
            return e[n];
    throw new Error("Locale data API: locale data undefined")
}
function vu(e) {
    let[t,n] = e.split(":");
    return {
        hours: +t,
        minutes: +n
    }
}
var cw = /^(\d{4,})-?(\d\d)-?(\d\d)(?:T(\d\d)(?::?(\d\d)(?::?(\d\d)(?:\.(\d+))?)?)?(Z|([+-])(\d\d):?(\d\d))?)?$/
  , Ir = {}
  , lw = /((?:[^BEGHLMOSWYZabcdhmswyz']+)|(?:'(?:[^']|'')*')|(?:G{1,5}|y{1,4}|Y{1,4}|M{1,5}|L{1,5}|w{1,2}|W{1}|d{1,2}|E{1,6}|c{1,6}|a{1,5}|b{1,5}|B{1,5}|h{1,2}|H{1,2}|m{1,2}|s{1,2}|S{1,3}|z{1,4}|Z{1,5}|O{1,4}))([\s\S]*)/
  , dt = function(e) {
    return e[e.Short = 0] = "Short",
    e[e.ShortGMT = 1] = "ShortGMT",
    e[e.Long = 2] = "Long",
    e[e.Extended = 3] = "Extended",
    e
}(dt || {})
  , V = function(e) {
    return e[e.FullYear = 0] = "FullYear",
    e[e.Month = 1] = "Month",
    e[e.Date = 2] = "Date",
    e[e.Hours = 3] = "Hours",
    e[e.Minutes = 4] = "Minutes",
    e[e.Seconds = 5] = "Seconds",
    e[e.FractionalSeconds = 6] = "FractionalSeconds",
    e[e.Day = 7] = "Day",
    e
}(V || {})
  , L = function(e) {
    return e[e.DayPeriods = 0] = "DayPeriods",
    e[e.Days = 1] = "Days",
    e[e.Months = 2] = "Months",
    e[e.Eras = 3] = "Eras",
    e
}(L || {});
function dw(e, t, n, r) {
    let i = ww(e);
    t = ct(n, t) || t;
    let s = [], a;
    for (; t; )
        if (a = lw.exec(t),
        a) {
            s = s.concat(a.slice(1));
            let l = s.pop();
            if (!l)
                break;
            t = l
        } else {
            s.push(t);
            break
        }
    let u = i.getTimezoneOffset();
    r && (u = Qf(r, u),
    i = Dw(i, r, !0));
    let c = "";
    return s.forEach(l => {
        let d = vw(l);
        c += d ? d(i, n, u) : l === "''" ? "'" : l.replace(/(^'|'$)/g, "").replace(/''/g, "'")
    }
    ),
    c
}
function Ro(e, t, n) {
    let r = new Date(0);
    return r.setFullYear(e, t, n),
    r.setHours(0, 0, 0),
    r
}
function ct(e, t) {
    let n = nw(e);
    if (Ir[n] = Ir[n] || {},
    Ir[n][t])
        return Ir[n][t];
    let r = "";
    switch (t) {
    case "shortDate":
        r = Mo(e, Se.Short);
        break;
    case "mediumDate":
        r = Mo(e, Se.Medium);
        break;
    case "longDate":
        r = Mo(e, Se.Long);
        break;
    case "fullDate":
        r = Mo(e, Se.Full);
        break;
    case "shortTime":
        r = _o(e, Se.Short);
        break;
    case "mediumTime":
        r = _o(e, Se.Medium);
        break;
    case "longTime":
        r = _o(e, Se.Long);
        break;
    case "fullTime":
        r = _o(e, Se.Full);
        break;
    case "short":
        let i = ct(e, "shortTime")
          , o = ct(e, "shortDate");
        r = To(So(e, Se.Short), [i, o]);
        break;
    case "medium":
        let s = ct(e, "mediumTime")
          , a = ct(e, "mediumDate");
        r = To(So(e, Se.Medium), [s, a]);
        break;
    case "long":
        let u = ct(e, "longTime")
          , c = ct(e, "longDate");
        r = To(So(e, Se.Long), [u, c]);
        break;
    case "full":
        let l = ct(e, "fullTime")
          , d = ct(e, "fullDate");
        r = To(So(e, Se.Full), [l, d]);
        break
    }
    return r && (Ir[n][t] = r),
    r
}
function To(e, t) {
    return t && (e = e.replace(/\{([^}]+)}/g, function(n, r) {
        return t != null && r in t ? t[r] : n
    })),
    e
}
function He(e, t, n="-", r, i) {
    let o = "";
    (e < 0 || i && e <= 0) && (i ? e = -e + 1 : (e = -e,
    o = n));
    let s = String(e);
    for (; s.length < t; )
        s = "0" + s;
    return r && (s = s.slice(s.length - t)),
    o + s
}
function fw(e, t) {
    return He(e, 3).substring(0, t)
}
function X(e, t, n=0, r=!1, i=!1) {
    return function(o, s) {
        let a = hw(e, o);
        if ((n > 0 || a > -n) && (a += n),
        e === V.Hours)
            a === 0 && n === -12 && (a = 12);
        else if (e === V.FractionalSeconds)
            return fw(a, t);
        let u = Po(s, lt.MinusSign);
        return He(a, t, u, r, i)
    }
}
function hw(e, t) {
    switch (e) {
    case V.FullYear:
        return t.getFullYear();
    case V.Month:
        return t.getMonth();
    case V.Date:
        return t.getDate();
    case V.Hours:
        return t.getHours();
    case V.Minutes:
        return t.getMinutes();
    case V.Seconds:
        return t.getSeconds();
    case V.FractionalSeconds:
        return t.getMilliseconds();
    case V.Day:
        return t.getDay();
    default:
        throw new Error(`Unknown DateType value "${e}".`)
    }
}
function z(e, t, n=ve.Format, r=!1) {
    return function(i, o) {
        return pw(i, o, e, t, n, r)
    }
}
function pw(e, t, n, r, i, o) {
    switch (n) {
    case L.Months:
        return ow(t, i, r)[e.getMonth()];
    case L.Days:
        return iw(t, i, r)[e.getDay()];
    case L.DayPeriods:
        let s = e.getHours()
          , a = e.getMinutes();
        if (o) {
            let c = aw(t)
              , l = uw(t, i, r)
              , d = c.findIndex(f => {
                if (Array.isArray(f)) {
                    let[h,p] = f
                      , b = s >= h.hours && a >= h.minutes
                      , y = s < p.hours || s === p.hours && a < p.minutes;
                    if (h.hours < p.hours) {
                        if (b && y)
                            return !0
                    } else if (b || y)
                        return !0
                } else if (f.hours === s && f.minutes === a)
                    return !0;
                return !1
            }
            );
            if (d !== -1)
                return l[d]
        }
        return rw(t, i, r)[s < 12 ? 0 : 1];
    case L.Eras:
        return sw(t, r)[e.getFullYear() <= 0 ? 0 : 1];
    default:
        let u = n;
        throw new Error(`unexpected translation type ${u}`)
    }
}
function xo(e) {
    return function(t, n, r) {
        let i = -1 * r
          , o = Po(n, lt.MinusSign)
          , s = i > 0 ? Math.floor(i / 60) : Math.ceil(i / 60);
        switch (e) {
        case dt.Short:
            return (i >= 0 ? "+" : "") + He(s, 2, o) + He(Math.abs(i % 60), 2, o);
        case dt.ShortGMT:
            return "GMT" + (i >= 0 ? "+" : "") + He(s, 1, o);
        case dt.Long:
            return "GMT" + (i >= 0 ? "+" : "") + He(s, 2, o) + ":" + He(Math.abs(i % 60), 2, o);
        case dt.Extended:
            return r === 0 ? "Z" : (i >= 0 ? "+" : "") + He(s, 2, o) + ":" + He(Math.abs(i % 60), 2, o);
        default:
            throw new Error(`Unknown zone width "${e}"`)
        }
    }
}
var gw = 0
  , No = 4;
function mw(e) {
    let t = Ro(e, gw, 1).getDay();
    return Ro(e, 0, 1 + (t <= No ? No : No + 7) - t)
}
function Yf(e) {
    return Ro(e.getFullYear(), e.getMonth(), e.getDate() + (No - e.getDay()))
}
function yu(e, t=!1) {
    return function(n, r) {
        let i;
        if (t) {
            let o = new Date(n.getFullYear(),n.getMonth(),1).getDay() - 1
              , s = n.getDate();
            i = 1 + Math.floor((s + o) / 7)
        } else {
            let o = Yf(n)
              , s = mw(o.getFullYear())
              , a = o.getTime() - s.getTime();
            i = 1 + Math.round(a / 6048e5)
        }
        return He(i, e, Po(r, lt.MinusSign))
    }
}
function Ao(e, t=!1) {
    return function(n, r) {
        let o = Yf(n).getFullYear();
        return He(o, e, Po(r, lt.MinusSign), t)
    }
}
var Du = {};
function vw(e) {
    if (Du[e])
        return Du[e];
    let t;
    switch (e) {
    case "G":
    case "GG":
    case "GGG":
        t = z(L.Eras, B.Abbreviated);
        break;
    case "GGGG":
        t = z(L.Eras, B.Wide);
        break;
    case "GGGGG":
        t = z(L.Eras, B.Narrow);
        break;
    case "y":
        t = X(V.FullYear, 1, 0, !1, !0);
        break;
    case "yy":
        t = X(V.FullYear, 2, 0, !0, !0);
        break;
    case "yyy":
        t = X(V.FullYear, 3, 0, !1, !0);
        break;
    case "yyyy":
        t = X(V.FullYear, 4, 0, !1, !0);
        break;
    case "Y":
        t = Ao(1);
        break;
    case "YY":
        t = Ao(2, !0);
        break;
    case "YYY":
        t = Ao(3);
        break;
    case "YYYY":
        t = Ao(4);
        break;
    case "M":
    case "L":
        t = X(V.Month, 1, 1);
        break;
    case "MM":
    case "LL":
        t = X(V.Month, 2, 1);
        break;
    case "MMM":
        t = z(L.Months, B.Abbreviated);
        break;
    case "MMMM":
        t = z(L.Months, B.Wide);
        break;
    case "MMMMM":
        t = z(L.Months, B.Narrow);
        break;
    case "LLL":
        t = z(L.Months, B.Abbreviated, ve.Standalone);
        break;
    case "LLLL":
        t = z(L.Months, B.Wide, ve.Standalone);
        break;
    case "LLLLL":
        t = z(L.Months, B.Narrow, ve.Standalone);
        break;
    case "w":
        t = yu(1);
        break;
    case "ww":
        t = yu(2);
        break;
    case "W":
        t = yu(1, !0);
        break;
    case "d":
        t = X(V.Date, 1);
        break;
    case "dd":
        t = X(V.Date, 2);
        break;
    case "c":
    case "cc":
        t = X(V.Day, 1);
        break;
    case "ccc":
        t = z(L.Days, B.Abbreviated, ve.Standalone);
        break;
    case "cccc":
        t = z(L.Days, B.Wide, ve.Standalone);
        break;
    case "ccccc":
        t = z(L.Days, B.Narrow, ve.Standalone);
        break;
    case "cccccc":
        t = z(L.Days, B.Short, ve.Standalone);
        break;
    case "E":
    case "EE":
    case "EEE":
        t = z(L.Days, B.Abbreviated);
        break;
    case "EEEE":
        t = z(L.Days, B.Wide);
        break;
    case "EEEEE":
        t = z(L.Days, B.Narrow);
        break;
    case "EEEEEE":
        t = z(L.Days, B.Short);
        break;
    case "a":
    case "aa":
    case "aaa":
        t = z(L.DayPeriods, B.Abbreviated);
        break;
    case "aaaa":
        t = z(L.DayPeriods, B.Wide);
        break;
    case "aaaaa":
        t = z(L.DayPeriods, B.Narrow);
        break;
    case "b":
    case "bb":
    case "bbb":
        t = z(L.DayPeriods, B.Abbreviated, ve.Standalone, !0);
        break;
    case "bbbb":
        t = z(L.DayPeriods, B.Wide, ve.Standalone, !0);
        break;
    case "bbbbb":
        t = z(L.DayPeriods, B.Narrow, ve.Standalone, !0);
        break;
    case "B":
    case "BB":
    case "BBB":
        t = z(L.DayPeriods, B.Abbreviated, ve.Format, !0);
        break;
    case "BBBB":
        t = z(L.DayPeriods, B.Wide, ve.Format, !0);
        break;
    case "BBBBB":
        t = z(L.DayPeriods, B.Narrow, ve.Format, !0);
        break;
    case "h":
        t = X(V.Hours, 1, -12);
        break;
    case "hh":
        t = X(V.Hours, 2, -12);
        break;
    case "H":
        t = X(V.Hours, 1);
        break;
    case "HH":
        t = X(V.Hours, 2);
        break;
    case "m":
        t = X(V.Minutes, 1);
        break;
    case "mm":
        t = X(V.Minutes, 2);
        break;
    case "s":
        t = X(V.Seconds, 1);
        break;
    case "ss":
        t = X(V.Seconds, 2);
        break;
    case "S":
        t = X(V.FractionalSeconds, 1);
        break;
    case "SS":
        t = X(V.FractionalSeconds, 2);
        break;
    case "SSS":
        t = X(V.FractionalSeconds, 3);
        break;
    case "Z":
    case "ZZ":
    case "ZZZ":
        t = xo(dt.Short);
        break;
    case "ZZZZZ":
        t = xo(dt.Extended);
        break;
    case "O":
    case "OO":
    case "OOO":
    case "z":
    case "zz":
    case "zzz":
        t = xo(dt.ShortGMT);
        break;
    case "OOOO":
    case "ZZZZ":
    case "zzzz":
        t = xo(dt.Long);
        break;
    default:
        return null
    }
    return Du[e] = t,
    t
}
function Qf(e, t) {
    e = e.replace(/:/g, "");
    let n = Date.parse("Jan 01, 1970 00:00:00 " + e) / 6e4;
    return isNaN(n) ? t : n
}
function yw(e, t) {
    return e = new Date(e.getTime()),
    e.setMinutes(e.getMinutes() + t),
    e
}
function Dw(e, t, n) {
    let r = n ? -1 : 1
      , i = e.getTimezoneOffset()
      , o = Qf(t, i);
    return yw(e, r * (o - i))
}
function ww(e) {
    if (Hf(e))
        return e;
    if (typeof e == "number" && !isNaN(e))
        return new Date(e);
    if (typeof e == "string") {
        if (e = e.trim(),
        /^(\d{4}(-\d{1,2}(-\d{1,2})?)?)$/.test(e)) {
            let[i,o=1,s=1] = e.split("-").map(a => +a);
            return Ro(i, o - 1, s)
        }
        let n = parseFloat(e);
        if (!isNaN(e - n))
            return new Date(n);
        let r;
        if (r = e.match(cw))
            return Cw(r)
    }
    let t = new Date(e);
    if (!Hf(t))
        throw new Error(`Unable to convert "${e}" into a date`);
    return t
}
function Cw(e) {
    let t = new Date(0)
      , n = 0
      , r = 0
      , i = e[8] ? t.setUTCFullYear : t.setFullYear
      , o = e[8] ? t.setUTCHours : t.setHours;
    e[9] && (n = Number(e[9] + e[10]),
    r = Number(e[9] + e[11])),
    i.call(t, Number(e[1]), Number(e[2]) - 1, Number(e[3]));
    let s = Number(e[4] || 0) - n
      , a = Number(e[5] || 0) - r
      , u = Number(e[6] || 0)
      , c = Math.floor(parseFloat("0." + (e[7] || 0)) * 1e3);
    return o.call(t, s, a, u, c),
    t
}
function Hf(e) {
    return e instanceof Date && !isNaN(e.valueOf())
}
function ko(e, t) {
    t = encodeURIComponent(t);
    for (let n of e.split(";")) {
        let r = n.indexOf("=")
          , [i,o] = r == -1 ? [n, ""] : [n.slice(0, r), n.slice(r + 1)];
        if (i.trim() === t)
            return decodeURIComponent(o)
    }
    return null
}
function Ew(e, t) {
    return new D(2100,!1)
}
var bw = "mediumDate"
  , Iw = new w("DATE_PIPE_DEFAULT_TIMEZONE")
  , Mw = new w("DATE_PIPE_DEFAULT_OPTIONS")
  , Kf = ( () => {
    let t = class t {
        constructor(r, i, o) {
            this.locale = r,
            this.defaultTimezone = i,
            this.defaultOptions = o
        }
        transform(r, i, o, s) {
            if (r == null || r === "" || r !== r)
                return null;
            try {
                let a = i ?? this.defaultOptions?.dateFormat ?? bw
                  , u = o ?? this.defaultOptions?.timezone ?? this.defaultTimezone ?? void 0;
                return dw(r, a, s || this.locale, u)
            } catch (a) {
                throw Ew(t, a.message)
            }
        }
    }
    ;
    t.\u0275fac = function(i) {
        return new (i || t)(Y(Eo, 16),Y(Iw, 24),Y(Mw, 24))
    }
    ,
    t.\u0275pipe = Kl({
        name: "date",
        type: t,
        pure: !0,
        standalone: !0
    });
    let e = t;
    return e
}
)();
var Jf = "browser"
  , _w = "server";
function Cu(e) {
    return e === _w
}
var Rn = class {
}
;
var Sr = class {
}
  , Vo = class {
}
  , Jt = class e {
    constructor(t) {
        this.normalizedNames = new Map,
        this.lazyUpdate = null,
        t ? typeof t == "string" ? this.lazyInit = () => {
            this.headers = new Map,
            t.split(`
`).forEach(n => {
                let r = n.indexOf(":");
                if (r > 0) {
                    let i = n.slice(0, r)
                      , o = i.toLowerCase()
                      , s = n.slice(r + 1).trim();
                    this.maybeSetNormalizedName(i, o),
                    this.headers.has(o) ? this.headers.get(o).push(s) : this.headers.set(o, [s])
                }
            }
            )
        }
        : typeof Headers < "u" && t instanceof Headers ? (this.headers = new Map,
        t.forEach( (n, r) => {
            this.setHeaderEntries(r, n)
        }
        )) : this.lazyInit = () => {
            this.headers = new Map,
            Object.entries(t).forEach( ([n,r]) => {
                this.setHeaderEntries(n, r)
            }
            )
        }
        : this.headers = new Map
    }
    has(t) {
        return this.init(),
        this.headers.has(t.toLowerCase())
    }
    get(t) {
        this.init();
        let n = this.headers.get(t.toLowerCase());
        return n && n.length > 0 ? n[0] : null
    }
    keys() {
        return this.init(),
        Array.from(this.normalizedNames.values())
    }
    getAll(t) {
        return this.init(),
        this.headers.get(t.toLowerCase()) || null
    }
    append(t, n) {
        return this.clone({
            name: t,
            value: n,
            op: "a"
        })
    }
    set(t, n) {
        return this.clone({
            name: t,
            value: n,
            op: "s"
        })
    }
    delete(t, n) {
        return this.clone({
            name: t,
            value: n,
            op: "d"
        })
    }
    maybeSetNormalizedName(t, n) {
        this.normalizedNames.has(n) || this.normalizedNames.set(n, t)
    }
    init() {
        this.lazyInit && (this.lazyInit instanceof e ? this.copyFrom(this.lazyInit) : this.lazyInit(),
        this.lazyInit = null,
        this.lazyUpdate && (this.lazyUpdate.forEach(t => this.applyUpdate(t)),
        this.lazyUpdate = null))
    }
    copyFrom(t) {
        t.init(),
        Array.from(t.headers.keys()).forEach(n => {
            this.headers.set(n, t.headers.get(n)),
            this.normalizedNames.set(n, t.normalizedNames.get(n))
        }
        )
    }
    clone(t) {
        let n = new e;
        return n.lazyInit = this.lazyInit && this.lazyInit instanceof e ? this.lazyInit : this,
        n.lazyUpdate = (this.lazyUpdate || []).concat([t]),
        n
    }
    applyUpdate(t) {
        let n = t.name.toLowerCase();
        switch (t.op) {
        case "a":
        case "s":
            let r = t.value;
            if (typeof r == "string" && (r = [r]),
            r.length === 0)
                return;
            this.maybeSetNormalizedName(t.name, n);
            let i = (t.op === "a" ? this.headers.get(n) : void 0) || [];
            i.push(...r),
            this.headers.set(n, i);
            break;
        case "d":
            let o = t.value;
            if (!o)
                this.headers.delete(n),
                this.normalizedNames.delete(n);
            else {
                let s = this.headers.get(n);
                if (!s)
                    return;
                s = s.filter(a => o.indexOf(a) === -1),
                s.length === 0 ? (this.headers.delete(n),
                this.normalizedNames.delete(n)) : this.headers.set(n, s)
            }
            break
        }
    }
    setHeaderEntries(t, n) {
        let r = (Array.isArray(n) ? n : [n]).map(o => o.toString())
          , i = t.toLowerCase();
        this.headers.set(i, r),
        this.maybeSetNormalizedName(t, i)
    }
    forEach(t) {
        this.init(),
        Array.from(this.normalizedNames.keys()).forEach(n => t(this.normalizedNames.get(n), this.headers.get(n)))
    }
}
;
var bu = class {
    encodeKey(t) {
        return Xf(t)
    }
    encodeValue(t) {
        return Xf(t)
    }
    decodeKey(t) {
        return decodeURIComponent(t)
    }
    decodeValue(t) {
        return decodeURIComponent(t)
    }
}
;
function Aw(e, t) {
    let n = new Map;
    return e.length > 0 && e.replace(/^\?/, "").split("&").forEach(i => {
        let o = i.indexOf("=")
          , [s,a] = o == -1 ? [t.decodeKey(i), ""] : [t.decodeKey(i.slice(0, o)), t.decodeValue(i.slice(o + 1))]
          , u = n.get(s) || [];
        u.push(a),
        n.set(s, u)
    }
    ),
    n
}
var Nw = /%(\d[a-f0-9])/gi
  , Ow = {
    40: "@",
    "3A": ":",
    24: "$",
    "2C": ",",
    "3B": ";",
    "3D": "=",
    "3F": "?",
    "2F": "/"
};
function Xf(e) {
    return encodeURIComponent(e).replace(Nw, (t, n) => Ow[n] ?? t)
}
function Lo(e) {
    return `${e}`
}
var Mt = class e {
    constructor(t={}) {
        if (this.updates = null,
        this.cloneFrom = null,
        this.encoder = t.encoder || new bu,
        t.fromString) {
            if (t.fromObject)
                throw new Error("Cannot specify both fromString and fromObject.");
            this.map = Aw(t.fromString, this.encoder)
        } else
            t.fromObject ? (this.map = new Map,
            Object.keys(t.fromObject).forEach(n => {
                let r = t.fromObject[n]
                  , i = Array.isArray(r) ? r.map(Lo) : [Lo(r)];
                this.map.set(n, i)
            }
            )) : this.map = null
    }
    has(t) {
        return this.init(),
        this.map.has(t)
    }
    get(t) {
        this.init();
        let n = this.map.get(t);
        return n ? n[0] : null
    }
    getAll(t) {
        return this.init(),
        this.map.get(t) || null
    }
    keys() {
        return this.init(),
        Array.from(this.map.keys())
    }
    append(t, n) {
        return this.clone({
            param: t,
            value: n,
            op: "a"
        })
    }
    appendAll(t) {
        let n = [];
        return Object.keys(t).forEach(r => {
            let i = t[r];
            Array.isArray(i) ? i.forEach(o => {
                n.push({
                    param: r,
                    value: o,
                    op: "a"
                })
            }
            ) : n.push({
                param: r,
                value: i,
                op: "a"
            })
        }
        ),
        this.clone(n)
    }
    set(t, n) {
        return this.clone({
            param: t,
            value: n,
            op: "s"
        })
    }
    delete(t, n) {
        return this.clone({
            param: t,
            value: n,
            op: "d"
        })
    }
    toString() {
        return this.init(),
        this.keys().map(t => {
            let n = this.encoder.encodeKey(t);
            return this.map.get(t).map(r => n + "=" + this.encoder.encodeValue(r)).join("&")
        }
        ).filter(t => t !== "").join("&")
    }
    clone(t) {
        let n = new e({
            encoder: this.encoder
        });
        return n.cloneFrom = this.cloneFrom || this,
        n.updates = (this.updates || []).concat(t),
        n
    }
    init() {
        this.map === null && (this.map = new Map),
        this.cloneFrom !== null && (this.cloneFrom.init(),
        this.cloneFrom.keys().forEach(t => this.map.set(t, this.cloneFrom.map.get(t))),
        this.updates.forEach(t => {
            switch (t.op) {
            case "a":
            case "s":
                let n = (t.op === "a" ? this.map.get(t.param) : void 0) || [];
                n.push(Lo(t.value)),
                this.map.set(t.param, n);
                break;
            case "d":
                if (t.value !== void 0) {
                    let r = this.map.get(t.param) || []
                      , i = r.indexOf(Lo(t.value));
                    i !== -1 && r.splice(i, 1),
                    r.length > 0 ? this.map.set(t.param, r) : this.map.delete(t.param)
                } else {
                    this.map.delete(t.param);
                    break
                }
            }
        }
        ),
        this.cloneFrom = this.updates = null)
    }
}
;
var Iu = class {
    constructor() {
        this.map = new Map
    }
    set(t, n) {
        return this.map.set(t, n),
        this
    }
    get(t) {
        return this.map.has(t) || this.map.set(t, t.defaultValue()),
        this.map.get(t)
    }
    delete(t) {
        return this.map.delete(t),
        this
    }
    has(t) {
        return this.map.has(t)
    }
    keys() {
        return this.map.keys()
    }
}
;
function Rw(e) {
    switch (e) {
    case "DELETE":
    case "GET":
    case "HEAD":
    case "OPTIONS":
    case "JSONP":
        return !1;
    default:
        return !0
    }
}
function eh(e) {
    return typeof ArrayBuffer < "u" && e instanceof ArrayBuffer
}
function th(e) {
    return typeof Blob < "u" && e instanceof Blob
}
function nh(e) {
    return typeof FormData < "u" && e instanceof FormData
}
function Fw(e) {
    return typeof URLSearchParams < "u" && e instanceof URLSearchParams
}
var _r = class e {
    constructor(t, n, r, i) {
        this.url = n,
        this.body = null,
        this.reportProgress = !1,
        this.withCredentials = !1,
        this.responseType = "json",
        this.method = t.toUpperCase();
        let o;
        if (Rw(this.method) || i ? (this.body = r !== void 0 ? r : null,
        o = i) : o = r,
        o && (this.reportProgress = !!o.reportProgress,
        this.withCredentials = !!o.withCredentials,
        o.responseType && (this.responseType = o.responseType),
        o.headers && (this.headers = o.headers),
        o.context && (this.context = o.context),
        o.params && (this.params = o.params),
        this.transferCache = o.transferCache),
        this.headers || (this.headers = new Jt),
        this.context || (this.context = new Iu),
        !this.params)
            this.params = new Mt,
            this.urlWithParams = n;
        else {
            let s = this.params.toString();
            if (s.length === 0)
                this.urlWithParams = n;
            else {
                let a = n.indexOf("?")
                  , u = a === -1 ? "?" : a < n.length - 1 ? "&" : "";
                this.urlWithParams = n + u + s
            }
        }
    }
    serializeBody() {
        return this.body === null ? null : eh(this.body) || th(this.body) || nh(this.body) || Fw(this.body) || typeof this.body == "string" ? this.body : this.body instanceof Mt ? this.body.toString() : typeof this.body == "object" || typeof this.body == "boolean" || Array.isArray(this.body) ? JSON.stringify(this.body) : this.body.toString()
    }
    detectContentTypeHeader() {
        return this.body === null || nh(this.body) ? null : th(this.body) ? this.body.type || null : eh(this.body) ? null : typeof this.body == "string" ? "text/plain" : this.body instanceof Mt ? "application/x-www-form-urlencoded;charset=UTF-8" : typeof this.body == "object" || typeof this.body == "number" || typeof this.body == "boolean" ? "application/json" : null
    }
    clone(t={}) {
        let n = t.method || this.method
          , r = t.url || this.url
          , i = t.responseType || this.responseType
          , o = t.body !== void 0 ? t.body : this.body
          , s = t.withCredentials !== void 0 ? t.withCredentials : this.withCredentials
          , a = t.reportProgress !== void 0 ? t.reportProgress : this.reportProgress
          , u = t.headers || this.headers
          , c = t.params || this.params
          , l = t.context ?? this.context;
        return t.setHeaders !== void 0 && (u = Object.keys(t.setHeaders).reduce( (d, f) => d.set(f, t.setHeaders[f]), u)),
        t.setParams && (c = Object.keys(t.setParams).reduce( (d, f) => d.set(f, t.setParams[f]), c)),
        new e(n,r,o,{
            params: c,
            headers: u,
            context: l,
            reportProgress: a,
            responseType: i,
            withCredentials: s
        })
    }
}
  , Fn = function(e) {
    return e[e.Sent = 0] = "Sent",
    e[e.UploadProgress = 1] = "UploadProgress",
    e[e.ResponseHeader = 2] = "ResponseHeader",
    e[e.DownloadProgress = 3] = "DownloadProgress",
    e[e.Response = 4] = "Response",
    e[e.User = 5] = "User",
    e
}(Fn || {})
  , Tr = class {
    constructor(t, n=$o.Ok, r="OK") {
        this.headers = t.headers || new Jt,
        this.status = t.status !== void 0 ? t.status : n,
        this.statusText = t.statusText || r,
        this.url = t.url || null,
        this.ok = this.status >= 200 && this.status < 300
    }
}
  , Mu = class e extends Tr {
    constructor(t={}) {
        super(t),
        this.type = Fn.ResponseHeader
    }
    clone(t={}) {
        return new e({
            headers: t.headers || this.headers,
            status: t.status !== void 0 ? t.status : this.status,
            statusText: t.statusText || this.statusText,
            url: t.url || this.url || void 0
        })
    }
}
  , jo = class e extends Tr {
    constructor(t={}) {
        super(t),
        this.type = Fn.Response,
        this.body = t.body !== void 0 ? t.body : null
    }
    clone(t={}) {
        return new e({
            body: t.body !== void 0 ? t.body : this.body,
            headers: t.headers || this.headers,
            status: t.status !== void 0 ? t.status : this.status,
            statusText: t.statusText || this.statusText,
            url: t.url || this.url || void 0
        })
    }
}
  , Uo = class extends Tr {
    constructor(t) {
        super(t, 0, "Unknown Error"),
        this.name = "HttpErrorResponse",
        this.ok = !1,
        this.status >= 200 && this.status < 300 ? this.message = `Http failure during parsing for ${t.url || "(unknown url)"}` : this.message = `Http failure response for ${t.url || "(unknown url)"}: ${t.status} ${t.statusText}`,
        this.error = t.error || null
    }
}
  , $o = function(e) {
    return e[e.Continue = 100] = "Continue",
    e[e.SwitchingProtocols = 101] = "SwitchingProtocols",
    e[e.Processing = 102] = "Processing",
    e[e.EarlyHints = 103] = "EarlyHints",
    e[e.Ok = 200] = "Ok",
    e[e.Created = 201] = "Created",
    e[e.Accepted = 202] = "Accepted",
    e[e.NonAuthoritativeInformation = 203] = "NonAuthoritativeInformation",
    e[e.NoContent = 204] = "NoContent",
    e[e.ResetContent = 205] = "ResetContent",
    e[e.PartialContent = 206] = "PartialContent",
    e[e.MultiStatus = 207] = "MultiStatus",
    e[e.AlreadyReported = 208] = "AlreadyReported",
    e[e.ImUsed = 226] = "ImUsed",
    e[e.MultipleChoices = 300] = "MultipleChoices",
    e[e.MovedPermanently = 301] = "MovedPermanently",
    e[e.Found = 302] = "Found",
    e[e.SeeOther = 303] = "SeeOther",
    e[e.NotModified = 304] = "NotModified",
    e[e.UseProxy = 305] = "UseProxy",
    e[e.Unused = 306] = "Unused",
    e[e.TemporaryRedirect = 307] = "TemporaryRedirect",
    e[e.PermanentRedirect = 308] = "PermanentRedirect",
    e[e.BadRequest = 400] = "BadRequest",
    e[e.Unauthorized = 401] = "Unauthorized",
    e[e.PaymentRequired = 402] = "PaymentRequired",
    e[e.Forbidden = 403] = "Forbidden",
    e[e.NotFound = 404] = "NotFound",
    e[e.MethodNotAllowed = 405] = "MethodNotAllowed",
    e[e.NotAcceptable = 406] = "NotAcceptable",
    e[e.ProxyAuthenticationRequired = 407] = "ProxyAuthenticationRequired",
    e[e.RequestTimeout = 408] = "RequestTimeout",
    e[e.Conflict = 409] = "Conflict",
    e[e.Gone = 410] = "Gone",
    e[e.LengthRequired = 411] = "LengthRequired",
    e[e.PreconditionFailed = 412] = "PreconditionFailed",
    e[e.PayloadTooLarge = 413] = "PayloadTooLarge",
    e[e.UriTooLong = 414] = "UriTooLong",
    e[e.UnsupportedMediaType = 415] = "UnsupportedMediaType",
    e[e.RangeNotSatisfiable = 416] = "RangeNotSatisfiable",
    e[e.ExpectationFailed = 417] = "ExpectationFailed",
    e[e.ImATeapot = 418] = "ImATeapot",
    e[e.MisdirectedRequest = 421] = "MisdirectedRequest",
    e[e.UnprocessableEntity = 422] = "UnprocessableEntity",
    e[e.Locked = 423] = "Locked",
    e[e.FailedDependency = 424] = "FailedDependency",
    e[e.TooEarly = 425] = "TooEarly",
    e[e.UpgradeRequired = 426] = "UpgradeRequired",
    e[e.PreconditionRequired = 428] = "PreconditionRequired",
    e[e.TooManyRequests = 429] = "TooManyRequests",
    e[e.RequestHeaderFieldsTooLarge = 431] = "RequestHeaderFieldsTooLarge",
    e[e.UnavailableForLegalReasons = 451] = "UnavailableForLegalReasons",
    e[e.InternalServerError = 500] = "InternalServerError",
    e[e.NotImplemented = 501] = "NotImplemented",
    e[e.BadGateway = 502] = "BadGateway",
    e[e.ServiceUnavailable = 503] = "ServiceUnavailable",
    e[e.GatewayTimeout = 504] = "GatewayTimeout",
    e[e.HttpVersionNotSupported = 505] = "HttpVersionNotSupported",
    e[e.VariantAlsoNegotiates = 506] = "VariantAlsoNegotiates",
    e[e.InsufficientStorage = 507] = "InsufficientStorage",
    e[e.LoopDetected = 508] = "LoopDetected",
    e[e.NotExtended = 510] = "NotExtended",
    e[e.NetworkAuthenticationRequired = 511] = "NetworkAuthenticationRequired",
    e
}($o || {});
function Eu(e, t) {
    return {
        body: t,
        headers: e.headers,
        context: e.context,
        observe: e.observe,
        params: e.params,
        reportProgress: e.reportProgress,
        responseType: e.responseType,
        withCredentials: e.withCredentials,
        transferCache: e.transferCache
    }
}
var _u = ( () => {
    let t = class t {
        constructor(r) {
            this.handler = r
        }
        request(r, i, o={}) {
            let s;
            if (r instanceof _r)
                s = r;
            else {
                let c;
                o.headers instanceof Jt ? c = o.headers : c = new Jt(o.headers);
                let l;
                o.params && (o.params instanceof Mt ? l = o.params : l = new Mt({
                    fromObject: o.params
                })),
                s = new _r(r,i,o.body !== void 0 ? o.body : null,{
                    headers: c,
                    context: o.context,
                    params: l,
                    reportProgress: o.reportProgress,
                    responseType: o.responseType || "json",
                    withCredentials: o.withCredentials,
                    transferCache: o.transferCache
                })
            }
            let a = C(s).pipe(gt(c => this.handler.handle(c)));
            if (r instanceof _r || o.observe === "events")
                return a;
            let u = a.pipe(Ie(c => c instanceof jo));
            switch (o.observe || "body") {
            case "body":
                switch (s.responseType) {
                case "arraybuffer":
                    return u.pipe(x(c => {
                        if (c.body !== null && !(c.body instanceof ArrayBuffer))
                            throw new Error("Response is not an ArrayBuffer.");
                        return c.body
                    }
                    ));
                case "blob":
                    return u.pipe(x(c => {
                        if (c.body !== null && !(c.body instanceof Blob))
                            throw new Error("Response is not a Blob.");
                        return c.body
                    }
                    ));
                case "text":
                    return u.pipe(x(c => {
                        if (c.body !== null && typeof c.body != "string")
                            throw new Error("Response is not a string.");
                        return c.body
                    }
                    ));
                case "json":
                default:
                    return u.pipe(x(c => c.body))
                }
            case "response":
                return u;
            default:
                throw new Error(`Unreachable: unhandled observe type ${o.observe}}`)
            }
        }
        delete(r, i={}) {
            return this.request("DELETE", r, i)
        }
        get(r, i={}) {
            return this.request("GET", r, i)
        }
        head(r, i={}) {
            return this.request("HEAD", r, i)
        }
        jsonp(r, i) {
            return this.request("JSONP", r, {
                params: new Mt().append(i, "JSONP_CALLBACK"),
                observe: "body",
                responseType: "json"
            })
        }
        options(r, i={}) {
            return this.request("OPTIONS", r, i)
        }
        patch(r, i, o={}) {
            return this.request("PATCH", r, Eu(o, i))
        }
        post(r, i, o={}) {
            return this.request("POST", r, Eu(o, i))
        }
        put(r, i, o={}) {
            return this.request("PUT", r, Eu(o, i))
        }
    }
    ;
    t.\u0275fac = function(i) {
        return new (i || t)(I(Sr))
    }
    ,
    t.\u0275prov = E({
        token: t,
        factory: t.\u0275fac
    });
    let e = t;
    return e
}
)();
function Pw(e, t) {
    return t(e)
}
function kw(e, t, n) {
    return (r, i) => ut(n, () => t(r, o => e(o, i)))
}
var oh = new w("")
  , Lw = new w("")
  , Vw = new w("");
var rh = ( () => {
    let t = class t extends Sr {
        constructor(r, i) {
            super(),
            this.backend = r,
            this.injector = i,
            this.chain = null,
            this.pendingTasks = g(br);
            let o = g(Vw, {
                optional: !0
            });
            this.backend = o ?? r
        }
        handle(r) {
            if (this.chain === null) {
                let o = Array.from(new Set([...this.injector.get(oh), ...this.injector.get(Lw, [])]));
                this.chain = o.reduceRight( (s, a) => kw(s, a, this.injector), Pw)
            }
            let i = this.pendingTasks.add();
            return this.chain(r, o => this.backend.handle(o)).pipe(Ot( () => this.pendingTasks.remove(i)))
        }
    }
    ;
    t.\u0275fac = function(i) {
        return new (i || t)(I(Vo),I(Ee))
    }
    ,
    t.\u0275prov = E({
        token: t,
        factory: t.\u0275fac
    });
    let e = t;
    return e
}
)();
var jw = /^\)\]\}',?\n/;
function Uw(e) {
    return "responseURL"in e && e.responseURL ? e.responseURL : /^X-Request-URL:/m.test(e.getAllResponseHeaders()) ? e.getResponseHeader("X-Request-URL") : null
}
var ih = ( () => {
    let t = class t {
        constructor(r) {
            this.xhrFactory = r
        }
        handle(r) {
            if (r.method === "JSONP")
                throw new D(-2800,!1);
            let i = this.xhrFactory;
            return (i.\u0275loadImpl ? W(i.\u0275loadImpl()) : C(null)).pipe(fe( () => new k(s => {
                let a = i.build();
                if (a.open(r.method, r.urlWithParams),
                r.withCredentials && (a.withCredentials = !0),
                r.headers.forEach( (y, m) => a.setRequestHeader(y, m.join(","))),
                r.headers.has("Accept") || a.setRequestHeader("Accept", "application/json, text/plain, */*"),
                !r.headers.has("Content-Type")) {
                    let y = r.detectContentTypeHeader();
                    y !== null && a.setRequestHeader("Content-Type", y)
                }
                if (r.responseType) {
                    let y = r.responseType.toLowerCase();
                    a.responseType = y !== "json" ? y : "text"
                }
                let u = r.serializeBody()
                  , c = null
                  , l = () => {
                    if (c !== null)
                        return c;
                    let y = a.statusText || "OK"
                      , m = new Jt(a.getAllResponseHeaders())
                      , Q = Uw(a) || r.url;
                    return c = new Mu({
                        headers: m,
                        status: a.status,
                        statusText: y,
                        url: Q
                    }),
                    c
                }
                  , d = () => {
                    let {headers: y, status: m, statusText: Q, url: ie} = l()
                      , q = null;
                    m !== $o.NoContent && (q = typeof a.response > "u" ? a.responseText : a.response),
                    m === 0 && (m = q ? $o.Ok : 0);
                    let ze = m >= 200 && m < 300;
                    if (r.responseType === "json" && typeof q == "string") {
                        let be = q;
                        q = q.replace(jw, "");
                        try {
                            q = q !== "" ? JSON.parse(q) : null
                        } catch (ht) {
                            q = be,
                            ze && (ze = !1,
                            q = {
                                error: ht,
                                text: q
                            })
                        }
                    }
                    ze ? (s.next(new jo({
                        body: q,
                        headers: y,
                        status: m,
                        statusText: Q,
                        url: ie || void 0
                    })),
                    s.complete()) : s.error(new Uo({
                        error: q,
                        headers: y,
                        status: m,
                        statusText: Q,
                        url: ie || void 0
                    }))
                }
                  , f = y => {
                    let {url: m} = l()
                      , Q = new Uo({
                        error: y,
                        status: a.status || 0,
                        statusText: a.statusText || "Unknown Error",
                        url: m || void 0
                    });
                    s.error(Q)
                }
                  , h = !1
                  , p = y => {
                    h || (s.next(l()),
                    h = !0);
                    let m = {
                        type: Fn.DownloadProgress,
                        loaded: y.loaded
                    };
                    y.lengthComputable && (m.total = y.total),
                    r.responseType === "text" && a.responseText && (m.partialText = a.responseText),
                    s.next(m)
                }
                  , b = y => {
                    let m = {
                        type: Fn.UploadProgress,
                        loaded: y.loaded
                    };
                    y.lengthComputable && (m.total = y.total),
                    s.next(m)
                }
                ;
                return a.addEventListener("load", d),
                a.addEventListener("error", f),
                a.addEventListener("timeout", f),
                a.addEventListener("abort", f),
                r.reportProgress && (a.addEventListener("progress", p),
                u !== null && a.upload && a.upload.addEventListener("progress", b)),
                a.send(u),
                s.next({
                    type: Fn.Sent
                }),
                () => {
                    a.removeEventListener("error", f),
                    a.removeEventListener("abort", f),
                    a.removeEventListener("load", d),
                    a.removeEventListener("timeout", f),
                    r.reportProgress && (a.removeEventListener("progress", p),
                    u !== null && a.upload && a.upload.removeEventListener("progress", b)),
                    a.readyState !== a.DONE && a.abort()
                }
            }
            )))
        }
    }
    ;
    t.\u0275fac = function(i) {
        return new (i || t)(I(Rn))
    }
    ,
    t.\u0275prov = E({
        token: t,
        factory: t.\u0275fac
    });
    let e = t;
    return e
}
)()
  , sh = new w("XSRF_ENABLED")
  , $w = "XSRF-TOKEN"
  , Bw = new w("XSRF_COOKIE_NAME",{
    providedIn: "root",
    factory: () => $w
})
  , Hw = "X-XSRF-TOKEN"
  , zw = new w("XSRF_HEADER_NAME",{
    providedIn: "root",
    factory: () => Hw
})
  , Bo = class {
}
  , Gw = ( () => {
    let t = class t {
        constructor(r, i, o) {
            this.doc = r,
            this.platform = i,
            this.cookieName = o,
            this.lastCookieString = "",
            this.lastToken = null,
            this.parseCount = 0
        }
        getToken() {
            if (this.platform === "server")
                return null;
            let r = this.doc.cookie || "";
            return r !== this.lastCookieString && (this.parseCount++,
            this.lastToken = ko(r, this.cookieName),
            this.lastCookieString = r),
            this.lastToken
        }
    }
    ;
    t.\u0275fac = function(i) {
        return new (i || t)(I(ye),I(It),I(Bw))
    }
    ,
    t.\u0275prov = E({
        token: t,
        factory: t.\u0275fac
    });
    let e = t;
    return e
}
)();
function Ww(e, t) {
    let n = e.url.toLowerCase();
    if (!g(sh) || e.method === "GET" || e.method === "HEAD" || n.startsWith("http://") || n.startsWith("https://"))
        return t(e);
    let r = g(Bo).getToken()
      , i = g(zw);
    return r != null && !e.headers.has(i) && (e = e.clone({
        headers: e.headers.set(i, r)
    })),
    t(e)
}
function ah(...e) {
    let t = [_u, ih, rh, {
        provide: Sr,
        useExisting: rh
    }, {
        provide: Vo,
        useExisting: ih
    }, {
        provide: oh,
        useValue: Ww,
        multi: !0
    }, {
        provide: sh,
        useValue: !0
    }, {
        provide: Bo,
        useClass: Gw
    }];
    for (let n of e)
        t.push(...n.\u0275providers);
    return _n(t)
}
var xu = class extends Oo {
    constructor() {
        super(...arguments),
        this.supportsDOMEvents = !0
    }
}
  , Au = class e extends xu {
    static makeCurrent() {
        zf(new e)
    }
    onAndCancel(t, n, r) {
        return t.addEventListener(n, r),
        () => {
            t.removeEventListener(n, r)
        }
    }
    dispatchEvent(t, n) {
        t.dispatchEvent(n)
    }
    remove(t) {
        t.parentNode && t.parentNode.removeChild(t)
    }
    createElement(t, n) {
        return n = n || this.getDefaultDocument(),
        n.createElement(t)
    }
    createHtmlDocument() {
        return document.implementation.createHTMLDocument("fakeTitle")
    }
    getDefaultDocument() {
        return document
    }
    isElementNode(t) {
        return t.nodeType === Node.ELEMENT_NODE
    }
    isShadowRoot(t) {
        return t instanceof DocumentFragment
    }
    getGlobalEventTarget(t, n) {
        return n === "window" ? window : n === "document" ? t : n === "body" ? t.body : null
    }
    getBaseHref(t) {
        let n = Yw();
        return n == null ? null : Qw(n)
    }
    resetBaseElement() {
        xr = null
    }
    getUserAgent() {
        return window.navigator.userAgent
    }
    getCookie(t) {
        return ko(document.cookie, t)
    }
}
  , xr = null;
function Yw() {
    return xr = xr || document.querySelector("base"),
    xr ? xr.getAttribute("href") : null
}
function Qw(e) {
    return new URL(e,"http://a").pathname
}
var Kw = ( () => {
    let t = class t {
        build() {
            return new XMLHttpRequest
        }
    }
    ;
    t.\u0275fac = function(i) {
        return new (i || t)
    }
    ,
    t.\u0275prov = E({
        token: t,
        factory: t.\u0275fac
    });
    let e = t;
    return e
}
)()
  , Nu = new w("EventManagerPlugins")
  , dh = ( () => {
    let t = class t {
        constructor(r, i) {
            this._zone = i,
            this._eventNameToPlugin = new Map,
            r.forEach(o => {
                o.manager = this
            }
            ),
            this._plugins = r.slice().reverse()
        }
        addEventListener(r, i, o) {
            return this._findPluginFor(i).addEventListener(r, i, o)
        }
        getZone() {
            return this._zone
        }
        _findPluginFor(r) {
            let i = this._eventNameToPlugin.get(r);
            if (i)
                return i;
            if (i = this._plugins.find(s => s.supports(r)),
            !i)
                throw new D(5101,!1);
            return this._eventNameToPlugin.set(r, i),
            i
        }
    }
    ;
    t.\u0275fac = function(i) {
        return new (i || t)(I(Nu),I(K))
    }
    ,
    t.\u0275prov = E({
        token: t,
        factory: t.\u0275fac
    });
    let e = t;
    return e
}
)()
  , Ho = class {
    constructor(t) {
        this._doc = t
    }
}
  , Su = "ng-app-id"
  , fh = ( () => {
    let t = class t {
        constructor(r, i, o, s={}) {
            this.doc = r,
            this.appId = i,
            this.nonce = o,
            this.platformId = s,
            this.styleRef = new Map,
            this.hostNodes = new Set,
            this.styleNodesInDOM = this.collectServerRenderedStyles(),
            this.platformIsServer = Cu(s),
            this.resetHostNodes()
        }
        addStyles(r) {
            for (let i of r)
                this.changeUsageCount(i, 1) === 1 && this.onStyleAdded(i)
        }
        removeStyles(r) {
            for (let i of r)
                this.changeUsageCount(i, -1) <= 0 && this.onStyleRemoved(i)
        }
        ngOnDestroy() {
            let r = this.styleNodesInDOM;
            r && (r.forEach(i => i.remove()),
            r.clear());
            for (let i of this.getAllStyles())
                this.onStyleRemoved(i);
            this.resetHostNodes()
        }
        addHost(r) {
            this.hostNodes.add(r);
            for (let i of this.getAllStyles())
                this.addStyleToHost(r, i)
        }
        removeHost(r) {
            this.hostNodes.delete(r)
        }
        getAllStyles() {
            return this.styleRef.keys()
        }
        onStyleAdded(r) {
            for (let i of this.hostNodes)
                this.addStyleToHost(i, r)
        }
        onStyleRemoved(r) {
            let i = this.styleRef;
            i.get(r)?.elements?.forEach(o => o.remove()),
            i.delete(r)
        }
        collectServerRenderedStyles() {
            let r = this.doc.head?.querySelectorAll(`style[${Su}="${this.appId}"]`);
            if (r?.length) {
                let i = new Map;
                return r.forEach(o => {
                    o.textContent != null && i.set(o.textContent, o)
                }
                ),
                i
            }
            return null
        }
        changeUsageCount(r, i) {
            let o = this.styleRef;
            if (o.has(r)) {
                let s = o.get(r);
                return s.usage += i,
                s.usage
            }
            return o.set(r, {
                usage: i,
                elements: []
            }),
            i
        }
        getStyleElement(r, i) {
            let o = this.styleNodesInDOM
              , s = o?.get(i);
            if (s?.parentNode === r)
                return o.delete(i),
                s.removeAttribute(Su),
                s;
            {
                let a = this.doc.createElement("style");
                return this.nonce && a.setAttribute("nonce", this.nonce),
                a.textContent = i,
                this.platformIsServer && a.setAttribute(Su, this.appId),
                r.appendChild(a),
                a
            }
        }
        addStyleToHost(r, i) {
            let o = this.getStyleElement(r, i)
              , s = this.styleRef
              , a = s.get(i)?.elements;
            a ? a.push(o) : s.set(i, {
                elements: [o],
                usage: 1
            })
        }
        resetHostNodes() {
            let r = this.hostNodes;
            r.clear(),
            r.add(this.doc.head)
        }
    }
    ;
    t.\u0275fac = function(i) {
        return new (i || t)(I(ye),I(Qa),I(Ja, 8),I(It))
    }
    ,
    t.\u0275prov = E({
        token: t,
        factory: t.\u0275fac
    });
    let e = t;
    return e
}
)()
  , Tu = {
    svg: "http://www.w3.org/2000/svg",
    xhtml: "http://www.w3.org/1999/xhtml",
    xlink: "http://www.w3.org/1999/xlink",
    xml: "http://www.w3.org/XML/1998/namespace",
    xmlns: "http://www.w3.org/2000/xmlns/",
    math: "http://www.w3.org/1998/MathML/"
}
  , Ru = /%COMP%/g
  , hh = "%COMP%"
  , Jw = `_nghost-${hh}`
  , Xw = `_ngcontent-${hh}`
  , eC = !0
  , tC = new w("RemoveStylesOnCompDestroy",{
    providedIn: "root",
    factory: () => eC
});
function nC(e) {
    return Xw.replace(Ru, e)
}
function rC(e) {
    return Jw.replace(Ru, e)
}
function ph(e, t) {
    return t.map(n => n.replace(Ru, e))
}
var uh = ( () => {
    let t = class t {
        constructor(r, i, o, s, a, u, c, l=null) {
            this.eventManager = r,
            this.sharedStylesHost = i,
            this.appId = o,
            this.removeStylesOnCompDestroy = s,
            this.doc = a,
            this.platformId = u,
            this.ngZone = c,
            this.nonce = l,
            this.rendererByCompId = new Map,
            this.platformIsServer = Cu(u),
            this.defaultRenderer = new Ar(r,a,c,this.platformIsServer)
        }
        createRenderer(r, i) {
            if (!r || !i)
                return this.defaultRenderer;
            this.platformIsServer && i.encapsulation === Ye.ShadowDom && (i = H(v({}, i), {
                encapsulation: Ye.Emulated
            }));
            let o = this.getOrCreateRenderer(r, i);
            return o instanceof zo ? o.applyToHost(r) : o instanceof Nr && o.applyStyles(),
            o
        }
        getOrCreateRenderer(r, i) {
            let o = this.rendererByCompId
              , s = o.get(i.id);
            if (!s) {
                let a = this.doc
                  , u = this.ngZone
                  , c = this.eventManager
                  , l = this.sharedStylesHost
                  , d = this.removeStylesOnCompDestroy
                  , f = this.platformIsServer;
                switch (i.encapsulation) {
                case Ye.Emulated:
                    s = new zo(c,l,i,this.appId,d,a,u,f);
                    break;
                case Ye.ShadowDom:
                    return new Ou(c,l,r,i,a,u,this.nonce,f);
                default:
                    s = new Nr(c,l,i,d,a,u,f);
                    break
                }
                o.set(i.id, s)
            }
            return s
        }
        ngOnDestroy() {
            this.rendererByCompId.clear()
        }
    }
    ;
    t.\u0275fac = function(i) {
        return new (i || t)(I(dh),I(fh),I(Qa),I(tC),I(ye),I(It),I(K),I(Ja))
    }
    ,
    t.\u0275prov = E({
        token: t,
        factory: t.\u0275fac
    });
    let e = t;
    return e
}
)()
  , Ar = class {
    constructor(t, n, r, i) {
        this.eventManager = t,
        this.doc = n,
        this.ngZone = r,
        this.platformIsServer = i,
        this.data = Object.create(null),
        this.throwOnSyntheticProps = !0,
        this.destroyNode = null
    }
    destroy() {}
    createElement(t, n) {
        return n ? this.doc.createElementNS(Tu[n] || n, t) : this.doc.createElement(t)
    }
    createComment(t) {
        return this.doc.createComment(t)
    }
    createText(t) {
        return this.doc.createTextNode(t)
    }
    appendChild(t, n) {
        (ch(t) ? t.content : t).appendChild(n)
    }
    insertBefore(t, n, r) {
        t && (ch(t) ? t.content : t).insertBefore(n, r)
    }
    removeChild(t, n) {
        t && t.removeChild(n)
    }
    selectRootElement(t, n) {
        let r = typeof t == "string" ? this.doc.querySelector(t) : t;
        if (!r)
            throw new D(-5104,!1);
        return n || (r.textContent = ""),
        r
    }
    parentNode(t) {
        return t.parentNode
    }
    nextSibling(t) {
        return t.nextSibling
    }
    setAttribute(t, n, r, i) {
        if (i) {
            n = i + ":" + n;
            let o = Tu[i];
            o ? t.setAttributeNS(o, n, r) : t.setAttribute(n, r)
        } else
            t.setAttribute(n, r)
    }
    removeAttribute(t, n, r) {
        if (r) {
            let i = Tu[r];
            i ? t.removeAttributeNS(i, n) : t.removeAttribute(`${r}:${n}`)
        } else
            t.removeAttribute(n)
    }
    addClass(t, n) {
        t.classList.add(n)
    }
    removeClass(t, n) {
        t.classList.remove(n)
    }
    setStyle(t, n, r, i) {
        i & (it.DashCase | it.Important) ? t.style.setProperty(n, r, i & it.Important ? "important" : "") : t.style[n] = r
    }
    removeStyle(t, n, r) {
        r & it.DashCase ? t.style.removeProperty(n) : t.style[n] = ""
    }
    setProperty(t, n, r) {
        t != null && (t[n] = r)
    }
    setValue(t, n) {
        t.nodeValue = n
    }
    listen(t, n, r) {
        if (typeof t == "string" && (t = ft().getGlobalEventTarget(this.doc, t),
        !t))
            throw new Error(`Unsupported event target ${t} for event ${n}`);
        return this.eventManager.addEventListener(t, n, this.decoratePreventDefault(r))
    }
    decoratePreventDefault(t) {
        return n => {
            if (n === "__ngUnwrap__")
                return t;
            (this.platformIsServer ? this.ngZone.runGuarded( () => t(n)) : t(n)) === !1 && n.preventDefault()
        }
    }
}
;
function ch(e) {
    return e.tagName === "TEMPLATE" && e.content !== void 0
}
var Ou = class extends Ar {
    constructor(t, n, r, i, o, s, a, u) {
        super(t, o, s, u),
        this.sharedStylesHost = n,
        this.hostEl = r,
        this.shadowRoot = r.attachShadow({
            mode: "open"
        }),
        this.sharedStylesHost.addHost(this.shadowRoot);
        let c = ph(i.id, i.styles);
        for (let l of c) {
            let d = document.createElement("style");
            a && d.setAttribute("nonce", a),
            d.textContent = l,
            this.shadowRoot.appendChild(d)
        }
    }
    nodeOrShadowRoot(t) {
        return t === this.hostEl ? this.shadowRoot : t
    }
    appendChild(t, n) {
        return super.appendChild(this.nodeOrShadowRoot(t), n)
    }
    insertBefore(t, n, r) {
        return super.insertBefore(this.nodeOrShadowRoot(t), n, r)
    }
    removeChild(t, n) {
        return super.removeChild(this.nodeOrShadowRoot(t), n)
    }
    parentNode(t) {
        return this.nodeOrShadowRoot(super.parentNode(this.nodeOrShadowRoot(t)))
    }
    destroy() {
        this.sharedStylesHost.removeHost(this.shadowRoot)
    }
}
  , Nr = class extends Ar {
    constructor(t, n, r, i, o, s, a, u) {
        super(t, o, s, a),
        this.sharedStylesHost = n,
        this.removeStylesOnCompDestroy = i,
        this.styles = u ? ph(u, r.styles) : r.styles
    }
    applyStyles() {
        this.sharedStylesHost.addStyles(this.styles)
    }
    destroy() {
        this.removeStylesOnCompDestroy && this.sharedStylesHost.removeStyles(this.styles)
    }
}
  , zo = class extends Nr {
    constructor(t, n, r, i, o, s, a, u) {
        let c = i + "-" + r.id;
        super(t, n, r, o, s, a, u, c),
        this.contentAttr = nC(c),
        this.hostAttr = rC(c)
    }
    applyToHost(t) {
        this.applyStyles(),
        this.setAttribute(t, this.hostAttr, "")
    }
    createElement(t, n) {
        let r = super.createElement(t, n);
        return super.setAttribute(r, this.contentAttr, ""),
        r
    }
}
  , iC = ( () => {
    let t = class t extends Ho {
        constructor(r) {
            super(r)
        }
        supports(r) {
            return !0
        }
        addEventListener(r, i, o) {
            return r.addEventListener(i, o, !1),
            () => this.removeEventListener(r, i, o)
        }
        removeEventListener(r, i, o) {
            return r.removeEventListener(i, o)
        }
    }
    ;
    t.\u0275fac = function(i) {
        return new (i || t)(I(ye))
    }
    ,
    t.\u0275prov = E({
        token: t,
        factory: t.\u0275fac
    });
    let e = t;
    return e
}
)()
  , lh = ["alt", "control", "meta", "shift"]
  , oC = {
    "\b": "Backspace",
    "	": "Tab",
    "\x7F": "Delete",
    "\x1B": "Escape",
    Del: "Delete",
    Esc: "Escape",
    Left: "ArrowLeft",
    Right: "ArrowRight",
    Up: "ArrowUp",
    Down: "ArrowDown",
    Menu: "ContextMenu",
    Scroll: "ScrollLock",
    Win: "OS"
}
  , sC = {
    alt: e => e.altKey,
    control: e => e.ctrlKey,
    meta: e => e.metaKey,
    shift: e => e.shiftKey
}
  , aC = ( () => {
    let t = class t extends Ho {
        constructor(r) {
            super(r)
        }
        supports(r) {
            return t.parseEventName(r) != null
        }
        addEventListener(r, i, o) {
            let s = t.parseEventName(i)
              , a = t.eventCallback(s.fullKey, o, this.manager.getZone());
            return this.manager.getZone().runOutsideAngular( () => ft().onAndCancel(r, s.domEventName, a))
        }
        static parseEventName(r) {
            let i = r.toLowerCase().split(".")
              , o = i.shift();
            if (i.length === 0 || !(o === "keydown" || o === "keyup"))
                return null;
            let s = t._normalizeKey(i.pop())
              , a = ""
              , u = i.indexOf("code");
            if (u > -1 && (i.splice(u, 1),
            a = "code."),
            lh.forEach(l => {
                let d = i.indexOf(l);
                d > -1 && (i.splice(d, 1),
                a += l + ".")
            }
            ),
            a += s,
            i.length != 0 || s.length === 0)
                return null;
            let c = {};
            return c.domEventName = o,
            c.fullKey = a,
            c
        }
        static matchEventFullKeyCode(r, i) {
            let o = oC[r.key] || r.key
              , s = "";
            return i.indexOf("code.") > -1 && (o = r.code,
            s = "code."),
            o == null || !o ? !1 : (o = o.toLowerCase(),
            o === " " ? o = "space" : o === "." && (o = "dot"),
            lh.forEach(a => {
                if (a !== o) {
                    let u = sC[a];
                    u(r) && (s += a + ".")
                }
            }
            ),
            s += o,
            s === i)
        }
        static eventCallback(r, i, o) {
            return s => {
                t.matchEventFullKeyCode(s, r) && o.runGuarded( () => i(s))
            }
        }
        static _normalizeKey(r) {
            return r === "esc" ? "escape" : r
        }
    }
    ;
    t.\u0275fac = function(i) {
        return new (i || t)(I(ye))
    }
    ,
    t.\u0275prov = E({
        token: t,
        factory: t.\u0275fac
    });
    let e = t;
    return e
}
)();
function gh(e, t) {
    return jf(v({
        rootComponent: e
    }, uC(t)))
}
function uC(e) {
    return {
        appProviders: [...hC, ...e?.providers ?? []],
        platformProviders: fC
    }
}
function cC() {
    Au.makeCurrent()
}
function lC() {
    return new ot
}
function dC() {
    return Bd(document),
    document
}
var fC = [{
    provide: It,
    useValue: Jf
}, {
    provide: Ka,
    useValue: cC,
    multi: !0
}, {
    provide: ye,
    useFactory: dC,
    deps: []
}];
var hC = [{
    provide: uo,
    useValue: "root"
}, {
    provide: ot,
    useFactory: lC,
    deps: []
}, {
    provide: Nu,
    useClass: iC,
    multi: !0,
    deps: [ye, K, It]
}, {
    provide: Nu,
    useClass: aC,
    multi: !0,
    deps: [ye]
}, uh, fh, dh, {
    provide: sr,
    useExisting: uh
}, {
    provide: Rn,
    useClass: Kw,
    deps: []
}, []];
function pC() {
    return new Fu(I(ye))
}
var Fu = ( () => {
    let t = class t {
        constructor(r) {
            this._doc = r
        }
        getTitle() {
            return this._doc.title
        }
        setTitle(r) {
            this._doc.title = r || ""
        }
    }
    ;
    t.\u0275fac = function(i) {
        return new (i || t)(I(ye))
    }
    ,
    t.\u0275prov = E({
        token: t,
        factory: function(i) {
            let o = null;
            return i ? o = new i : o = pC(),
            o
        },
        providedIn: "root"
    });
    let e = t;
    return e
}
)();
var T = "primary"
  , Wr = Symbol("RouteTitle")
  , ju = class {
    constructor(t) {
        this.params = t || {}
    }
    has(t) {
        return Object.prototype.hasOwnProperty.call(this.params, t)
    }
    get(t) {
        if (this.has(t)) {
            let n = this.params[t];
            return Array.isArray(n) ? n[0] : n
        }
        return null
    }
    getAll(t) {
        if (this.has(t)) {
            let n = this.params[t];
            return Array.isArray(n) ? n : [n]
        }
        return []
    }
    get keys() {
        return Object.keys(this.params)
    }
}
;
function jn(e) {
    return new ju(e)
}
function vC(e, t, n) {
    let r = n.path.split("/");
    if (r.length > e.length || n.pathMatch === "full" && (t.hasChildren() || r.length < e.length))
        return null;
    let i = {};
    for (let o = 0; o < r.length; o++) {
        let s = r[o]
          , a = e[o];
        if (s.startsWith(":"))
            i[s.substring(1)] = a;
        else if (s !== a.path)
            return null
    }
    return {
        consumed: e.slice(0, r.length),
        posParams: i
    }
}
function yC(e, t) {
    if (e.length !== t.length)
        return !1;
    for (let n = 0; n < e.length; ++n)
        if (!Je(e[n], t[n]))
            return !1;
    return !0
}
function Je(e, t) {
    let n = e ? Uu(e) : void 0
      , r = t ? Uu(t) : void 0;
    if (!n || !r || n.length != r.length)
        return !1;
    let i;
    for (let o = 0; o < n.length; o++)
        if (i = n[o],
        !Eh(e[i], t[i]))
            return !1;
    return !0
}
function Uu(e) {
    return [...Object.keys(e), ...Object.getOwnPropertySymbols(e)]
}
function Eh(e, t) {
    if (Array.isArray(e) && Array.isArray(t)) {
        if (e.length !== t.length)
            return !1;
        let n = [...e].sort()
          , r = [...t].sort();
        return n.every( (i, o) => r[o] === i)
    } else
        return e === t
}
function bh(e) {
    return e.length > 0 ? e[e.length - 1] : null
}
function Tt(e) {
    return Ss(e) ? e : Yt(e) ? W(Promise.resolve(e)) : C(e)
}
var DC = {
    exact: Mh,
    subset: _h
}
  , Ih = {
    exact: wC,
    subset: CC,
    ignored: () => !0
};
function mh(e, t, n) {
    return DC[n.paths](e.root, t.root, n.matrixParams) && Ih[n.queryParams](e.queryParams, t.queryParams) && !(n.fragment === "exact" && e.fragment !== t.fragment)
}
function wC(e, t) {
    return Je(e, t)
}
function Mh(e, t, n) {
    if (!en(e.segments, t.segments) || !qo(e.segments, t.segments, n) || e.numberOfChildren !== t.numberOfChildren)
        return !1;
    for (let r in t.children)
        if (!e.children[r] || !Mh(e.children[r], t.children[r], n))
            return !1;
    return !0
}
function CC(e, t) {
    return Object.keys(t).length <= Object.keys(e).length && Object.keys(t).every(n => Eh(e[n], t[n]))
}
function _h(e, t, n) {
    return Sh(e, t, t.segments, n)
}
function Sh(e, t, n, r) {
    if (e.segments.length > n.length) {
        let i = e.segments.slice(0, n.length);
        return !(!en(i, n) || t.hasChildren() || !qo(i, n, r))
    } else if (e.segments.length === n.length) {
        if (!en(e.segments, n) || !qo(e.segments, n, r))
            return !1;
        for (let i in t.children)
            if (!e.children[i] || !_h(e.children[i], t.children[i], r))
                return !1;
        return !0
    } else {
        let i = n.slice(0, e.segments.length)
          , o = n.slice(e.segments.length);
        return !en(e.segments, i) || !qo(e.segments, i, r) || !e.children[T] ? !1 : Sh(e.children[T], t, o, r)
    }
}
function qo(e, t, n) {
    return t.every( (r, i) => Ih[n](e[i].parameters, r.parameters))
}
var _t = class {
    constructor(t=new j([],{}), n={}, r=null) {
        this.root = t,
        this.queryParams = n,
        this.fragment = r
    }
    get queryParamMap() {
        return this._queryParamMap || (this._queryParamMap = jn(this.queryParams)),
        this._queryParamMap
    }
    toString() {
        return IC.serialize(this)
    }
}
  , j = class {
    constructor(t, n) {
        this.segments = t,
        this.children = n,
        this.parent = null,
        Object.values(n).forEach(r => r.parent = this)
    }
    hasChildren() {
        return this.numberOfChildren > 0
    }
    get numberOfChildren() {
        return Object.keys(this.children).length
    }
    toString() {
        return Zo(this)
    }
}
  , Xt = class {
    constructor(t, n) {
        this.path = t,
        this.parameters = n
    }
    get parameterMap() {
        return this._parameterMap || (this._parameterMap = jn(this.parameters)),
        this._parameterMap
    }
    toString() {
        return xh(this)
    }
}
;
function EC(e, t) {
    return en(e, t) && e.every( (n, r) => Je(n.parameters, t[r].parameters))
}
function en(e, t) {
    return e.length !== t.length ? !1 : e.every( (n, r) => n.path === t[r].path)
}
function bC(e, t) {
    let n = [];
    return Object.entries(e.children).forEach( ([r,i]) => {
        r === T && (n = n.concat(t(i, r)))
    }
    ),
    Object.entries(e.children).forEach( ([r,i]) => {
        r !== T && (n = n.concat(t(i, r)))
    }
    ),
    n
}
var fc = ( () => {
    let t = class t {
    }
    ;
    t.\u0275fac = function(i) {
        return new (i || t)
    }
    ,
    t.\u0275prov = E({
        token: t,
        factory: () => new Qo,
        providedIn: "root"
    });
    let e = t;
    return e
}
)()
  , Qo = class {
    parse(t) {
        let n = new Bu(t);
        return new _t(n.parseRootSegment(),n.parseQueryParams(),n.parseFragment())
    }
    serialize(t) {
        let n = `/${Or(t.root, !0)}`
          , r = SC(t.queryParams)
          , i = typeof t.fragment == "string" ? `#${MC(t.fragment)}` : "";
        return `${n}${r}${i}`
    }
}
  , IC = new Qo;
function Zo(e) {
    return e.segments.map(t => xh(t)).join("/")
}
function Or(e, t) {
    if (!e.hasChildren())
        return Zo(e);
    if (t) {
        let n = e.children[T] ? Or(e.children[T], !1) : ""
          , r = [];
        return Object.entries(e.children).forEach( ([i,o]) => {
            i !== T && r.push(`${i}:${Or(o, !1)}`)
        }
        ),
        r.length > 0 ? `${n}(${r.join("//")})` : n
    } else {
        let n = bC(e, (r, i) => i === T ? [Or(e.children[T], !1)] : [`${i}:${Or(r, !1)}`]);
        return Object.keys(e.children).length === 1 && e.children[T] != null ? `${Zo(e)}/${n[0]}` : `${Zo(e)}/(${n.join("//")})`
    }
}
function Th(e) {
    return encodeURIComponent(e).replace(/%40/g, "@").replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",")
}
function Go(e) {
    return Th(e).replace(/%3B/gi, ";")
}
function MC(e) {
    return encodeURI(e)
}
function $u(e) {
    return Th(e).replace(/\(/g, "%28").replace(/\)/g, "%29").replace(/%26/gi, "&")
}
function Yo(e) {
    return decodeURIComponent(e)
}
function vh(e) {
    return Yo(e.replace(/\+/g, "%20"))
}
function xh(e) {
    return `${$u(e.path)}${_C(e.parameters)}`
}
function _C(e) {
    return Object.keys(e).map(t => `;${$u(t)}=${$u(e[t])}`).join("")
}
function SC(e) {
    let t = Object.keys(e).map(n => {
        let r = e[n];
        return Array.isArray(r) ? r.map(i => `${Go(n)}=${Go(i)}`).join("&") : `${Go(n)}=${Go(r)}`
    }
    ).filter(n => !!n);
    return t.length ? `?${t.join("&")}` : ""
}
var TC = /^[^\/()?;#]+/;
function Pu(e) {
    let t = e.match(TC);
    return t ? t[0] : ""
}
var xC = /^[^\/()?;=#]+/;
function AC(e) {
    let t = e.match(xC);
    return t ? t[0] : ""
}
var NC = /^[^=?&#]+/;
function OC(e) {
    let t = e.match(NC);
    return t ? t[0] : ""
}
var RC = /^[^&#]+/;
function FC(e) {
    let t = e.match(RC);
    return t ? t[0] : ""
}
var Bu = class {
    constructor(t) {
        this.url = t,
        this.remaining = t
    }
    parseRootSegment() {
        return this.consumeOptional("/"),
        this.remaining === "" || this.peekStartsWith("?") || this.peekStartsWith("#") ? new j([],{}) : new j([],this.parseChildren())
    }
    parseQueryParams() {
        let t = {};
        if (this.consumeOptional("?"))
            do
                this.parseQueryParam(t);
            while (this.consumeOptional("&"));
        return t
    }
    parseFragment() {
        return this.consumeOptional("#") ? decodeURIComponent(this.remaining) : null
    }
    parseChildren() {
        if (this.remaining === "")
            return {};
        this.consumeOptional("/");
        let t = [];
        for (this.peekStartsWith("(") || t.push(this.parseSegment()); this.peekStartsWith("/") && !this.peekStartsWith("//") && !this.peekStartsWith("/("); )
            this.capture("/"),
            t.push(this.parseSegment());
        let n = {};
        this.peekStartsWith("/(") && (this.capture("/"),
        n = this.parseParens(!0));
        let r = {};
        return this.peekStartsWith("(") && (r = this.parseParens(!1)),
        (t.length > 0 || Object.keys(n).length > 0) && (r[T] = new j(t,n)),
        r
    }
    parseSegment() {
        let t = Pu(this.remaining);
        if (t === "" && this.peekStartsWith(";"))
            throw new D(4009,!1);
        return this.capture(t),
        new Xt(Yo(t),this.parseMatrixParams())
    }
    parseMatrixParams() {
        let t = {};
        for (; this.consumeOptional(";"); )
            this.parseParam(t);
        return t
    }
    parseParam(t) {
        let n = AC(this.remaining);
        if (!n)
            return;
        this.capture(n);
        let r = "";
        if (this.consumeOptional("=")) {
            let i = Pu(this.remaining);
            i && (r = i,
            this.capture(r))
        }
        t[Yo(n)] = Yo(r)
    }
    parseQueryParam(t) {
        let n = OC(this.remaining);
        if (!n)
            return;
        this.capture(n);
        let r = "";
        if (this.consumeOptional("=")) {
            let s = FC(this.remaining);
            s && (r = s,
            this.capture(r))
        }
        let i = vh(n)
          , o = vh(r);
        if (t.hasOwnProperty(i)) {
            let s = t[i];
            Array.isArray(s) || (s = [s],
            t[i] = s),
            s.push(o)
        } else
            t[i] = o
    }
    parseParens(t) {
        let n = {};
        for (this.capture("("); !this.consumeOptional(")") && this.remaining.length > 0; ) {
            let r = Pu(this.remaining)
              , i = this.remaining[r.length];
            if (i !== "/" && i !== ")" && i !== ";")
                throw new D(4010,!1);
            let o;
            r.indexOf(":") > -1 ? (o = r.slice(0, r.indexOf(":")),
            this.capture(o),
            this.capture(":")) : t && (o = T);
            let s = this.parseChildren();
            n[o] = Object.keys(s).length === 1 ? s[T] : new j([],s),
            this.consumeOptional("//")
        }
        return n
    }
    peekStartsWith(t) {
        return this.remaining.startsWith(t)
    }
    consumeOptional(t) {
        return this.peekStartsWith(t) ? (this.remaining = this.remaining.substring(t.length),
        !0) : !1
    }
    capture(t) {
        if (!this.consumeOptional(t))
            throw new D(4011,!1)
    }
}
;
function Ah(e) {
    return e.segments.length > 0 ? new j([],{
        [T]: e
    }) : e
}
function Nh(e) {
    let t = {};
    for (let r of Object.keys(e.children)) {
        let i = e.children[r]
          , o = Nh(i);
        if (r === T && o.segments.length === 0 && o.hasChildren())
            for (let[s,a] of Object.entries(o.children))
                t[s] = a;
        else
            (o.segments.length > 0 || o.hasChildren()) && (t[r] = o)
    }
    let n = new j(e.segments,t);
    return PC(n)
}
function PC(e) {
    if (e.numberOfChildren === 1 && e.children[T]) {
        let t = e.children[T];
        return new j(e.segments.concat(t.segments),t.children)
    }
    return e
}
function Un(e) {
    return e instanceof _t
}
function kC(e, t, n=null, r=null) {
    let i = Oh(e);
    return Rh(i, t, n, r)
}
function Oh(e) {
    let t;
    function n(o) {
        let s = {};
        for (let u of o.children) {
            let c = n(u);
            s[u.outlet] = c
        }
        let a = new j(o.url,s);
        return o === e && (t = a),
        a
    }
    let r = n(e.root)
      , i = Ah(r);
    return t ?? i
}
function Rh(e, t, n, r) {
    let i = e;
    for (; i.parent; )
        i = i.parent;
    if (t.length === 0)
        return ku(i, i, i, n, r);
    let o = LC(t);
    if (o.toRoot())
        return ku(i, i, new j([],{}), n, r);
    let s = VC(o, i, e)
      , a = s.processChildren ? Pr(s.segmentGroup, s.index, o.commands) : Ph(s.segmentGroup, s.index, o.commands);
    return ku(i, s.segmentGroup, a, n, r)
}
function Ko(e) {
    return typeof e == "object" && e != null && !e.outlets && !e.segmentPath
}
function Vr(e) {
    return typeof e == "object" && e != null && e.outlets
}
function ku(e, t, n, r, i) {
    let o = {};
    r && Object.entries(r).forEach( ([u,c]) => {
        o[u] = Array.isArray(c) ? c.map(l => `${l}`) : `${c}`
    }
    );
    let s;
    e === t ? s = n : s = Fh(e, t, n);
    let a = Ah(Nh(s));
    return new _t(a,o,i)
}
function Fh(e, t, n) {
    let r = {};
    return Object.entries(e.children).forEach( ([i,o]) => {
        o === t ? r[i] = n : r[i] = Fh(o, t, n)
    }
    ),
    new j(e.segments,r)
}
var Jo = class {
    constructor(t, n, r) {
        if (this.isAbsolute = t,
        this.numberOfDoubleDots = n,
        this.commands = r,
        t && r.length > 0 && Ko(r[0]))
            throw new D(4003,!1);
        let i = r.find(Vr);
        if (i && i !== bh(r))
            throw new D(4004,!1)
    }
    toRoot() {
        return this.isAbsolute && this.commands.length === 1 && this.commands[0] == "/"
    }
}
;
function LC(e) {
    if (typeof e[0] == "string" && e.length === 1 && e[0] === "/")
        return new Jo(!0,0,e);
    let t = 0
      , n = !1
      , r = e.reduce( (i, o, s) => {
        if (typeof o == "object" && o != null) {
            if (o.outlets) {
                let a = {};
                return Object.entries(o.outlets).forEach( ([u,c]) => {
                    a[u] = typeof c == "string" ? c.split("/") : c
                }
                ),
                [...i, {
                    outlets: a
                }]
            }
            if (o.segmentPath)
                return [...i, o.segmentPath]
        }
        return typeof o != "string" ? [...i, o] : s === 0 ? (o.split("/").forEach( (a, u) => {
            u == 0 && a === "." || (u == 0 && a === "" ? n = !0 : a === ".." ? t++ : a != "" && i.push(a))
        }
        ),
        i) : [...i, o]
    }
    , []);
    return new Jo(n,t,r)
}
var Ln = class {
    constructor(t, n, r) {
        this.segmentGroup = t,
        this.processChildren = n,
        this.index = r
    }
}
;
function VC(e, t, n) {
    if (e.isAbsolute)
        return new Ln(t,!0,0);
    if (!n)
        return new Ln(t,!1,NaN);
    if (n.parent === null)
        return new Ln(n,!0,0);
    let r = Ko(e.commands[0]) ? 0 : 1
      , i = n.segments.length - 1 + r;
    return jC(n, i, e.numberOfDoubleDots)
}
function jC(e, t, n) {
    let r = e
      , i = t
      , o = n;
    for (; o > i; ) {
        if (o -= i,
        r = r.parent,
        !r)
            throw new D(4005,!1);
        i = r.segments.length
    }
    return new Ln(r,!1,i - o)
}
function UC(e) {
    return Vr(e[0]) ? e[0].outlets : {
        [T]: e
    }
}
function Ph(e, t, n) {
    if (e || (e = new j([],{})),
    e.segments.length === 0 && e.hasChildren())
        return Pr(e, t, n);
    let r = $C(e, t, n)
      , i = n.slice(r.commandIndex);
    if (r.match && r.pathIndex < e.segments.length) {
        let o = new j(e.segments.slice(0, r.pathIndex),{});
        return o.children[T] = new j(e.segments.slice(r.pathIndex),e.children),
        Pr(o, 0, i)
    } else
        return r.match && i.length === 0 ? new j(e.segments,{}) : r.match && !e.hasChildren() ? Hu(e, t, n) : r.match ? Pr(e, 0, i) : Hu(e, t, n)
}
function Pr(e, t, n) {
    if (n.length === 0)
        return new j(e.segments,{});
    {
        let r = UC(n)
          , i = {};
        if (Object.keys(r).some(o => o !== T) && e.children[T] && e.numberOfChildren === 1 && e.children[T].segments.length === 0) {
            let o = Pr(e.children[T], t, n);
            return new j(e.segments,o.children)
        }
        return Object.entries(r).forEach( ([o,s]) => {
            typeof s == "string" && (s = [s]),
            s !== null && (i[o] = Ph(e.children[o], t, s))
        }
        ),
        Object.entries(e.children).forEach( ([o,s]) => {
            r[o] === void 0 && (i[o] = s)
        }
        ),
        new j(e.segments,i)
    }
}
function $C(e, t, n) {
    let r = 0
      , i = t
      , o = {
        match: !1,
        pathIndex: 0,
        commandIndex: 0
    };
    for (; i < e.segments.length; ) {
        if (r >= n.length)
            return o;
        let s = e.segments[i]
          , a = n[r];
        if (Vr(a))
            break;
        let u = `${a}`
          , c = r < n.length - 1 ? n[r + 1] : null;
        if (i > 0 && u === void 0)
            break;
        if (u && c && typeof c == "object" && c.outlets === void 0) {
            if (!Dh(u, c, s))
                return o;
            r += 2
        } else {
            if (!Dh(u, {}, s))
                return o;
            r++
        }
        i++
    }
    return {
        match: !0,
        pathIndex: i,
        commandIndex: r
    }
}
function Hu(e, t, n) {
    let r = e.segments.slice(0, t)
      , i = 0;
    for (; i < n.length; ) {
        let o = n[i];
        if (Vr(o)) {
            let u = BC(o.outlets);
            return new j(r,u)
        }
        if (i === 0 && Ko(n[0])) {
            let u = e.segments[t];
            r.push(new Xt(u.path,yh(n[0]))),
            i++;
            continue
        }
        let s = Vr(o) ? o.outlets[T] : `${o}`
          , a = i < n.length - 1 ? n[i + 1] : null;
        s && a && Ko(a) ? (r.push(new Xt(s,yh(a))),
        i += 2) : (r.push(new Xt(s,{})),
        i++)
    }
    return new j(r,{})
}
function BC(e) {
    let t = {};
    return Object.entries(e).forEach( ([n,r]) => {
        typeof r == "string" && (r = [r]),
        r !== null && (t[n] = Hu(new j([],{}), 0, r))
    }
    ),
    t
}
function yh(e) {
    let t = {};
    return Object.entries(e).forEach( ([n,r]) => t[n] = `${r}`),
    t
}
function Dh(e, t, n) {
    return e == n.path && Je(t, n.parameters)
}
var kr = "imperative"
  , ce = function(e) {
    return e[e.NavigationStart = 0] = "NavigationStart",
    e[e.NavigationEnd = 1] = "NavigationEnd",
    e[e.NavigationCancel = 2] = "NavigationCancel",
    e[e.NavigationError = 3] = "NavigationError",
    e[e.RoutesRecognized = 4] = "RoutesRecognized",
    e[e.ResolveStart = 5] = "ResolveStart",
    e[e.ResolveEnd = 6] = "ResolveEnd",
    e[e.GuardsCheckStart = 7] = "GuardsCheckStart",
    e[e.GuardsCheckEnd = 8] = "GuardsCheckEnd",
    e[e.RouteConfigLoadStart = 9] = "RouteConfigLoadStart",
    e[e.RouteConfigLoadEnd = 10] = "RouteConfigLoadEnd",
    e[e.ChildActivationStart = 11] = "ChildActivationStart",
    e[e.ChildActivationEnd = 12] = "ChildActivationEnd",
    e[e.ActivationStart = 13] = "ActivationStart",
    e[e.ActivationEnd = 14] = "ActivationEnd",
    e[e.Scroll = 15] = "Scroll",
    e[e.NavigationSkipped = 16] = "NavigationSkipped",
    e
}(ce || {})
  , Re = class {
    constructor(t, n) {
        this.id = t,
        this.url = n
    }
}
  , jr = class extends Re {
    constructor(t, n, r="imperative", i=null) {
        super(t, n),
        this.type = ce.NavigationStart,
        this.navigationTrigger = r,
        this.restoredState = i
    }
    toString() {
        return `NavigationStart(id: ${this.id}, url: '${this.url}')`
    }
}
  , tn = class extends Re {
    constructor(t, n, r) {
        super(t, n),
        this.urlAfterRedirects = r,
        this.type = ce.NavigationEnd
    }
    toString() {
        return `NavigationEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}')`
    }
}
  , Oe = function(e) {
    return e[e.Redirect = 0] = "Redirect",
    e[e.SupersededByNewNavigation = 1] = "SupersededByNewNavigation",
    e[e.NoDataFromResolver = 2] = "NoDataFromResolver",
    e[e.GuardRejected = 3] = "GuardRejected",
    e
}(Oe || {})
  , zu = function(e) {
    return e[e.IgnoredSameUrlNavigation = 0] = "IgnoredSameUrlNavigation",
    e[e.IgnoredByUrlHandlingStrategy = 1] = "IgnoredByUrlHandlingStrategy",
    e
}(zu || {})
  , St = class extends Re {
    constructor(t, n, r, i) {
        super(t, n),
        this.reason = r,
        this.code = i,
        this.type = ce.NavigationCancel
    }
    toString() {
        return `NavigationCancel(id: ${this.id}, url: '${this.url}')`
    }
}
  , nn = class extends Re {
    constructor(t, n, r, i) {
        super(t, n),
        this.reason = r,
        this.code = i,
        this.type = ce.NavigationSkipped
    }
}
  , Ur = class extends Re {
    constructor(t, n, r, i) {
        super(t, n),
        this.error = r,
        this.target = i,
        this.type = ce.NavigationError
    }
    toString() {
        return `NavigationError(id: ${this.id}, url: '${this.url}', error: ${this.error})`
    }
}
  , Xo = class extends Re {
    constructor(t, n, r, i) {
        super(t, n),
        this.urlAfterRedirects = r,
        this.state = i,
        this.type = ce.RoutesRecognized
    }
    toString() {
        return `RoutesRecognized(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`
    }
}
  , Gu = class extends Re {
    constructor(t, n, r, i) {
        super(t, n),
        this.urlAfterRedirects = r,
        this.state = i,
        this.type = ce.GuardsCheckStart
    }
    toString() {
        return `GuardsCheckStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`
    }
}
  , Wu = class extends Re {
    constructor(t, n, r, i, o) {
        super(t, n),
        this.urlAfterRedirects = r,
        this.state = i,
        this.shouldActivate = o,
        this.type = ce.GuardsCheckEnd
    }
    toString() {
        return `GuardsCheckEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state}, shouldActivate: ${this.shouldActivate})`
    }
}
  , qu = class extends Re {
    constructor(t, n, r, i) {
        super(t, n),
        this.urlAfterRedirects = r,
        this.state = i,
        this.type = ce.ResolveStart
    }
    toString() {
        return `ResolveStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`
    }
}
  , Zu = class extends Re {
    constructor(t, n, r, i) {
        super(t, n),
        this.urlAfterRedirects = r,
        this.state = i,
        this.type = ce.ResolveEnd
    }
    toString() {
        return `ResolveEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`
    }
}
  , Yu = class {
    constructor(t) {
        this.route = t,
        this.type = ce.RouteConfigLoadStart
    }
    toString() {
        return `RouteConfigLoadStart(path: ${this.route.path})`
    }
}
  , Qu = class {
    constructor(t) {
        this.route = t,
        this.type = ce.RouteConfigLoadEnd
    }
    toString() {
        return `RouteConfigLoadEnd(path: ${this.route.path})`
    }
}
  , Ku = class {
    constructor(t) {
        this.snapshot = t,
        this.type = ce.ChildActivationStart
    }
    toString() {
        return `ChildActivationStart(path: '${this.snapshot.routeConfig && this.snapshot.routeConfig.path || ""}')`
    }
}
  , Ju = class {
    constructor(t) {
        this.snapshot = t,
        this.type = ce.ChildActivationEnd
    }
    toString() {
        return `ChildActivationEnd(path: '${this.snapshot.routeConfig && this.snapshot.routeConfig.path || ""}')`
    }
}
  , Xu = class {
    constructor(t) {
        this.snapshot = t,
        this.type = ce.ActivationStart
    }
    toString() {
        return `ActivationStart(path: '${this.snapshot.routeConfig && this.snapshot.routeConfig.path || ""}')`
    }
}
  , ec = class {
    constructor(t) {
        this.snapshot = t,
        this.type = ce.ActivationEnd
    }
    toString() {
        return `ActivationEnd(path: '${this.snapshot.routeConfig && this.snapshot.routeConfig.path || ""}')`
    }
}
;
var $r = class {
}
  , Br = class {
    constructor(t) {
        this.url = t
    }
}
;
var tc = class {
    constructor() {
        this.outlet = null,
        this.route = null,
        this.injector = null,
        this.children = new os,
        this.attachRef = null
    }
}
  , os = ( () => {
    let t = class t {
        constructor() {
            this.contexts = new Map
        }
        onChildOutletCreated(r, i) {
            let o = this.getOrCreateContext(r);
            o.outlet = i,
            this.contexts.set(r, o)
        }
        onChildOutletDestroyed(r) {
            let i = this.getContext(r);
            i && (i.outlet = null,
            i.attachRef = null)
        }
        onOutletDeactivated() {
            let r = this.contexts;
            return this.contexts = new Map,
            r
        }
        onOutletReAttached(r) {
            this.contexts = r
        }
        getOrCreateContext(r) {
            let i = this.getContext(r);
            return i || (i = new tc,
            this.contexts.set(r, i)),
            i
        }
        getContext(r) {
            return this.contexts.get(r) || null
        }
    }
    ;
    t.\u0275fac = function(i) {
        return new (i || t)
    }
    ,
    t.\u0275prov = E({
        token: t,
        factory: t.\u0275fac,
        providedIn: "root"
    });
    let e = t;
    return e
}
)()
  , es = class {
    constructor(t) {
        this._root = t
    }
    get root() {
        return this._root.value
    }
    parent(t) {
        let n = this.pathFromRoot(t);
        return n.length > 1 ? n[n.length - 2] : null
    }
    children(t) {
        let n = nc(t, this._root);
        return n ? n.children.map(r => r.value) : []
    }
    firstChild(t) {
        let n = nc(t, this._root);
        return n && n.children.length > 0 ? n.children[0].value : null
    }
    siblings(t) {
        let n = rc(t, this._root);
        return n.length < 2 ? [] : n[n.length - 2].children.map(i => i.value).filter(i => i !== t)
    }
    pathFromRoot(t) {
        return rc(t, this._root).map(n => n.value)
    }
}
;
function nc(e, t) {
    if (e === t.value)
        return t;
    for (let n of t.children) {
        let r = nc(e, n);
        if (r)
            return r
    }
    return null
}
function rc(e, t) {
    if (e === t.value)
        return [t];
    for (let n of t.children) {
        let r = rc(e, n);
        if (r.length)
            return r.unshift(t),
            r
    }
    return []
}
var Te = class {
    constructor(t, n) {
        this.value = t,
        this.children = n
    }
    toString() {
        return `TreeNode(${this.value})`
    }
}
;
function kn(e) {
    let t = {};
    return e && e.children.forEach(n => t[n.value.outlet] = n),
    t
}
var ts = class extends es {
    constructor(t, n) {
        super(t),
        this.snapshot = n,
        pc(this, t)
    }
    toString() {
        return this.snapshot.toString()
    }
}
;
function kh(e, t) {
    let n = HC(e, t)
      , r = new se([new Xt("",{})])
      , i = new se({})
      , o = new se({})
      , s = new se({})
      , a = new se("")
      , u = new $n(r,i,s,a,o,T,t,n.root);
    return u.snapshot = n.root,
    new ts(new Te(u,[]),n)
}
function HC(e, t) {
    let n = {}
      , r = {}
      , i = {}
      , o = ""
      , s = new Hr([],n,i,o,r,T,t,null,{});
    return new ns("",new Te(s,[]))
}
var $n = class {
    constructor(t, n, r, i, o, s, a, u) {
        this.urlSubject = t,
        this.paramsSubject = n,
        this.queryParamsSubject = r,
        this.fragmentSubject = i,
        this.dataSubject = o,
        this.outlet = s,
        this.component = a,
        this._futureSnapshot = u,
        this.title = this.dataSubject?.pipe(x(c => c[Wr])) ?? C(void 0),
        this.url = t,
        this.params = n,
        this.queryParams = r,
        this.fragment = i,
        this.data = o
    }
    get routeConfig() {
        return this._futureSnapshot.routeConfig
    }
    get root() {
        return this._routerState.root
    }
    get parent() {
        return this._routerState.parent(this)
    }
    get firstChild() {
        return this._routerState.firstChild(this)
    }
    get children() {
        return this._routerState.children(this)
    }
    get pathFromRoot() {
        return this._routerState.pathFromRoot(this)
    }
    get paramMap() {
        return this._paramMap || (this._paramMap = this.params.pipe(x(t => jn(t)))),
        this._paramMap
    }
    get queryParamMap() {
        return this._queryParamMap || (this._queryParamMap = this.queryParams.pipe(x(t => jn(t)))),
        this._queryParamMap
    }
    toString() {
        return this.snapshot ? this.snapshot.toString() : `Future(${this._futureSnapshot})`
    }
}
;
function hc(e, t, n="emptyOnly") {
    let r, {routeConfig: i} = e;
    return t !== null && (n === "always" || i?.path === "" || !t.component && !t.routeConfig?.loadComponent) ? r = {
        params: v(v({}, t.params), e.params),
        data: v(v({}, t.data), e.data),
        resolve: v(v(v(v({}, e.data), t.data), i?.data), e._resolvedData)
    } : r = {
        params: e.params,
        data: e.data,
        resolve: v(v({}, e.data), e._resolvedData ?? {})
    },
    i && Vh(i) && (r.resolve[Wr] = i.title),
    r
}
var Hr = class {
    get title() {
        return this.data?.[Wr]
    }
    constructor(t, n, r, i, o, s, a, u, c) {
        this.url = t,
        this.params = n,
        this.queryParams = r,
        this.fragment = i,
        this.data = o,
        this.outlet = s,
        this.component = a,
        this.routeConfig = u,
        this._resolve = c
    }
    get root() {
        return this._routerState.root
    }
    get parent() {
        return this._routerState.parent(this)
    }
    get firstChild() {
        return this._routerState.firstChild(this)
    }
    get children() {
        return this._routerState.children(this)
    }
    get pathFromRoot() {
        return this._routerState.pathFromRoot(this)
    }
    get paramMap() {
        return this._paramMap || (this._paramMap = jn(this.params)),
        this._paramMap
    }
    get queryParamMap() {
        return this._queryParamMap || (this._queryParamMap = jn(this.queryParams)),
        this._queryParamMap
    }
    toString() {
        let t = this.url.map(r => r.toString()).join("/")
          , n = this.routeConfig ? this.routeConfig.path : "";
        return `Route(url:'${t}', path:'${n}')`
    }
}
  , ns = class extends es {
    constructor(t, n) {
        super(n),
        this.url = t,
        pc(this, n)
    }
    toString() {
        return Lh(this._root)
    }
}
;
function pc(e, t) {
    t.value._routerState = e,
    t.children.forEach(n => pc(e, n))
}
function Lh(e) {
    let t = e.children.length > 0 ? ` { ${e.children.map(Lh).join(", ")} } ` : "";
    return `${e.value}${t}`
}
function Lu(e) {
    if (e.snapshot) {
        let t = e.snapshot
          , n = e._futureSnapshot;
        e.snapshot = n,
        Je(t.queryParams, n.queryParams) || e.queryParamsSubject.next(n.queryParams),
        t.fragment !== n.fragment && e.fragmentSubject.next(n.fragment),
        Je(t.params, n.params) || e.paramsSubject.next(n.params),
        yC(t.url, n.url) || e.urlSubject.next(n.url),
        Je(t.data, n.data) || e.dataSubject.next(n.data)
    } else
        e.snapshot = e._futureSnapshot,
        e.dataSubject.next(e._futureSnapshot.data)
}
function ic(e, t) {
    let n = Je(e.params, t.params) && EC(e.url, t.url)
      , r = !e.parent != !t.parent;
    return n && !r && (!e.parent || ic(e.parent, t.parent))
}
function Vh(e) {
    return typeof e.title == "string" || e.title === null
}
var zC = ( () => {
    let t = class t {
        constructor() {
            this.activated = null,
            this._activatedRoute = null,
            this.name = T,
            this.activateEvents = new pe,
            this.deactivateEvents = new pe,
            this.attachEvents = new pe,
            this.detachEvents = new pe,
            this.parentContexts = g(os),
            this.location = g(mo),
            this.changeDetector = g(Tn),
            this.environmentInjector = g(Ee),
            this.inputBinder = g(gc, {
                optional: !0
            }),
            this.supportsBindingToComponentInputs = !0
        }
        get activatedComponentRef() {
            return this.activated
        }
        ngOnChanges(r) {
            if (r.name) {
                let {firstChange: i, previousValue: o} = r.name;
                if (i)
                    return;
                this.isTrackedInParentContexts(o) && (this.deactivate(),
                this.parentContexts.onChildOutletDestroyed(o)),
                this.initializeOutletWithName()
            }
        }
        ngOnDestroy() {
            this.isTrackedInParentContexts(this.name) && this.parentContexts.onChildOutletDestroyed(this.name),
            this.inputBinder?.unsubscribeFromRouteData(this)
        }
        isTrackedInParentContexts(r) {
            return this.parentContexts.getContext(r)?.outlet === this
        }
        ngOnInit() {
            this.initializeOutletWithName()
        }
        initializeOutletWithName() {
            if (this.parentContexts.onChildOutletCreated(this.name, this),
            this.activated)
                return;
            let r = this.parentContexts.getContext(this.name);
            r?.route && (r.attachRef ? this.attach(r.attachRef, r.route) : this.activateWith(r.route, r.injector))
        }
        get isActivated() {
            return !!this.activated
        }
        get component() {
            if (!this.activated)
                throw new D(4012,!1);
            return this.activated.instance
        }
        get activatedRoute() {
            if (!this.activated)
                throw new D(4012,!1);
            return this._activatedRoute
        }
        get activatedRouteData() {
            return this._activatedRoute ? this._activatedRoute.snapshot.data : {}
        }
        detach() {
            if (!this.activated)
                throw new D(4012,!1);
            this.location.detach();
            let r = this.activated;
            return this.activated = null,
            this._activatedRoute = null,
            this.detachEvents.emit(r.instance),
            r
        }
        attach(r, i) {
            this.activated = r,
            this._activatedRoute = i,
            this.location.insert(r.hostView),
            this.inputBinder?.bindActivatedRouteToOutletComponent(this),
            this.attachEvents.emit(r.instance)
        }
        deactivate() {
            if (this.activated) {
                let r = this.component;
                this.activated.destroy(),
                this.activated = null,
                this._activatedRoute = null,
                this.deactivateEvents.emit(r)
            }
        }
        activateWith(r, i) {
            if (this.isActivated)
                throw new D(4013,!1);
            this._activatedRoute = r;
            let o = this.location
              , a = r.snapshot.component
              , u = this.parentContexts.getOrCreateContext(this.name).children
              , c = new oc(r,u,o.injector);
            this.activated = o.createComponent(a, {
                index: o.length,
                injector: c,
                environmentInjector: i ?? this.environmentInjector
            }),
            this.changeDetector.markForCheck(),
            this.inputBinder?.bindActivatedRouteToOutletComponent(this),
            this.activateEvents.emit(this.activated.instance)
        }
    }
    ;
    t.\u0275fac = function(i) {
        return new (i || t)
    }
    ,
    t.\u0275dir = st({
        type: t,
        selectors: [["router-outlet"]],
        inputs: {
            name: "name"
        },
        outputs: {
            activateEvents: "activate",
            deactivateEvents: "deactivate",
            attachEvents: "attach",
            detachEvents: "detach"
        },
        exportAs: ["outlet"],
        standalone: !0,
        features: [Mn]
    });
    let e = t;
    return e
}
)()
  , oc = class {
    constructor(t, n, r) {
        this.route = t,
        this.childContexts = n,
        this.parent = r
    }
    get(t, n) {
        return t === $n ? this.route : t === os ? this.childContexts : this.parent.get(t, n)
    }
}
  , gc = new w("");
function GC(e, t, n) {
    let r = zr(e, t._root, n ? n._root : void 0);
    return new ts(r,t)
}
function zr(e, t, n) {
    if (n && e.shouldReuseRoute(t.value, n.value.snapshot)) {
        let r = n.value;
        r._futureSnapshot = t.value;
        let i = WC(e, t, n);
        return new Te(r,i)
    } else {
        if (e.shouldAttach(t.value)) {
            let o = e.retrieve(t.value);
            if (o !== null) {
                let s = o.route;
                return s.value._futureSnapshot = t.value,
                s.children = t.children.map(a => zr(e, a)),
                s
            }
        }
        let r = qC(t.value)
          , i = t.children.map(o => zr(e, o));
        return new Te(r,i)
    }
}
function WC(e, t, n) {
    return t.children.map(r => {
        for (let i of n.children)
            if (e.shouldReuseRoute(r.value, i.value.snapshot))
                return zr(e, r, i);
        return zr(e, r)
    }
    )
}
function qC(e) {
    return new $n(new se(e.url),new se(e.params),new se(e.queryParams),new se(e.fragment),new se(e.data),e.outlet,e.component,e)
}
var jh = "ngNavigationCancelingError";
function Uh(e, t) {
    let {redirectTo: n, navigationBehaviorOptions: r} = Un(t) ? {
        redirectTo: t,
        navigationBehaviorOptions: void 0
    } : t
      , i = $h(!1, Oe.Redirect, t);
    return i.url = n,
    i.navigationBehaviorOptions = r,
    i
}
function $h(e, t, n) {
    let r = new Error("NavigationCancelingError: " + (e || ""));
    return r[jh] = !0,
    r.cancellationCode = t,
    n && (r.url = n),
    r
}
function ZC(e) {
    return Bh(e) && Un(e.url)
}
function Bh(e) {
    return e && e[jh]
}
var YC = ( () => {
    let t = class t {
    }
    ;
    t.\u0275fac = function(i) {
        return new (i || t)
    }
    ,
    t.\u0275cmp = no({
        type: t,
        selectors: [["ng-component"]],
        standalone: !0,
        features: [wo],
        decls: 1,
        vars: 0,
        template: function(i, o) {
            i & 1 && Nn(0, "router-outlet")
        },
        dependencies: [zC],
        encapsulation: 2
    });
    let e = t;
    return e
}
)();
function QC(e, t) {
    return e.providers && !e._injector && (e._injector = gu(e.providers, t, `Route: ${e.path}`)),
    e._injector ?? t
}
function mc(e) {
    let t = e.children && e.children.map(mc)
      , n = t ? H(v({}, e), {
        children: t
    }) : v({}, e);
    return !n.component && !n.loadComponent && (t || n.loadChildren) && n.outlet && n.outlet !== T && (n.component = YC),
    n
}
function Xe(e) {
    return e.outlet || T
}
function KC(e, t) {
    let n = e.filter(r => Xe(r) === t);
    return n.push(...e.filter(r => Xe(r) !== t)),
    n
}
function qr(e) {
    if (!e)
        return null;
    if (e.routeConfig?._injector)
        return e.routeConfig._injector;
    for (let t = e.parent; t; t = t.parent) {
        let n = t.routeConfig;
        if (n?._loadedInjector)
            return n._loadedInjector;
        if (n?._injector)
            return n._injector
    }
    return null
}
var JC = (e, t, n, r) => x(i => (new sc(t,i.targetRouterState,i.currentRouterState,n,r).activate(e),
i))
  , sc = class {
    constructor(t, n, r, i, o) {
        this.routeReuseStrategy = t,
        this.futureState = n,
        this.currState = r,
        this.forwardEvent = i,
        this.inputBindingEnabled = o
    }
    activate(t) {
        let n = this.futureState._root
          , r = this.currState ? this.currState._root : null;
        this.deactivateChildRoutes(n, r, t),
        Lu(this.futureState.root),
        this.activateChildRoutes(n, r, t)
    }
    deactivateChildRoutes(t, n, r) {
        let i = kn(n);
        t.children.forEach(o => {
            let s = o.value.outlet;
            this.deactivateRoutes(o, i[s], r),
            delete i[s]
        }
        ),
        Object.values(i).forEach(o => {
            this.deactivateRouteAndItsChildren(o, r)
        }
        )
    }
    deactivateRoutes(t, n, r) {
        let i = t.value
          , o = n ? n.value : null;
        if (i === o)
            if (i.component) {
                let s = r.getContext(i.outlet);
                s && this.deactivateChildRoutes(t, n, s.children)
            } else
                this.deactivateChildRoutes(t, n, r);
        else
            o && this.deactivateRouteAndItsChildren(n, r)
    }
    deactivateRouteAndItsChildren(t, n) {
        t.value.component && this.routeReuseStrategy.shouldDetach(t.value.snapshot) ? this.detachAndStoreRouteSubtree(t, n) : this.deactivateRouteAndOutlet(t, n)
    }
    detachAndStoreRouteSubtree(t, n) {
        let r = n.getContext(t.value.outlet)
          , i = r && t.value.component ? r.children : n
          , o = kn(t);
        for (let s of Object.keys(o))
            this.deactivateRouteAndItsChildren(o[s], i);
        if (r && r.outlet) {
            let s = r.outlet.detach()
              , a = r.children.onOutletDeactivated();
            this.routeReuseStrategy.store(t.value.snapshot, {
                componentRef: s,
                route: t,
                contexts: a
            })
        }
    }
    deactivateRouteAndOutlet(t, n) {
        let r = n.getContext(t.value.outlet)
          , i = r && t.value.component ? r.children : n
          , o = kn(t);
        for (let s of Object.keys(o))
            this.deactivateRouteAndItsChildren(o[s], i);
        r && (r.outlet && (r.outlet.deactivate(),
        r.children.onOutletDeactivated()),
        r.attachRef = null,
        r.route = null)
    }
    activateChildRoutes(t, n, r) {
        let i = kn(n);
        t.children.forEach(o => {
            this.activateRoutes(o, i[o.value.outlet], r),
            this.forwardEvent(new ec(o.value.snapshot))
        }
        ),
        t.children.length && this.forwardEvent(new Ju(t.value.snapshot))
    }
    activateRoutes(t, n, r) {
        let i = t.value
          , o = n ? n.value : null;
        if (Lu(i),
        i === o)
            if (i.component) {
                let s = r.getOrCreateContext(i.outlet);
                this.activateChildRoutes(t, n, s.children)
            } else
                this.activateChildRoutes(t, n, r);
        else if (i.component) {
            let s = r.getOrCreateContext(i.outlet);
            if (this.routeReuseStrategy.shouldAttach(i.snapshot)) {
                let a = this.routeReuseStrategy.retrieve(i.snapshot);
                this.routeReuseStrategy.store(i.snapshot, null),
                s.children.onOutletReAttached(a.contexts),
                s.attachRef = a.componentRef,
                s.route = a.route.value,
                s.outlet && s.outlet.attach(a.componentRef, a.route.value),
                Lu(a.route.value),
                this.activateChildRoutes(t, null, s.children)
            } else {
                let a = qr(i.snapshot);
                s.attachRef = null,
                s.route = i,
                s.injector = a,
                s.outlet && s.outlet.activateWith(i, s.injector),
                this.activateChildRoutes(t, null, s.children)
            }
        } else
            this.activateChildRoutes(t, null, r)
    }
}
  , rs = class {
    constructor(t) {
        this.path = t,
        this.route = this.path[this.path.length - 1]
    }
}
  , Vn = class {
    constructor(t, n) {
        this.component = t,
        this.route = n
    }
}
;
function XC(e, t, n) {
    let r = e._root
      , i = t ? t._root : null;
    return Rr(r, i, n, [r.value])
}
function eE(e) {
    let t = e.routeConfig ? e.routeConfig.canActivateChild : null;
    return !t || t.length === 0 ? null : {
        node: e,
        guards: t
    }
}
function Hn(e, t) {
    let n = Symbol()
      , r = t.get(e, n);
    return r === n ? typeof e == "function" && !Hl(e) ? e : t.get(e) : r
}
function Rr(e, t, n, r, i={
    canDeactivateChecks: [],
    canActivateChecks: []
}) {
    let o = kn(t);
    return e.children.forEach(s => {
        tE(s, o[s.value.outlet], n, r.concat([s.value]), i),
        delete o[s.value.outlet]
    }
    ),
    Object.entries(o).forEach( ([s,a]) => Lr(a, n.getContext(s), i)),
    i
}
function tE(e, t, n, r, i={
    canDeactivateChecks: [],
    canActivateChecks: []
}) {
    let o = e.value
      , s = t ? t.value : null
      , a = n ? n.getContext(e.value.outlet) : null;
    if (s && o.routeConfig === s.routeConfig) {
        let u = nE(s, o, o.routeConfig.runGuardsAndResolvers);
        u ? i.canActivateChecks.push(new rs(r)) : (o.data = s.data,
        o._resolvedData = s._resolvedData),
        o.component ? Rr(e, t, a ? a.children : null, r, i) : Rr(e, t, n, r, i),
        u && a && a.outlet && a.outlet.isActivated && i.canDeactivateChecks.push(new Vn(a.outlet.component,s))
    } else
        s && Lr(t, a, i),
        i.canActivateChecks.push(new rs(r)),
        o.component ? Rr(e, null, a ? a.children : null, r, i) : Rr(e, null, n, r, i);
    return i
}
function nE(e, t, n) {
    if (typeof n == "function")
        return n(e, t);
    switch (n) {
    case "pathParamsChange":
        return !en(e.url, t.url);
    case "pathParamsOrQueryParamsChange":
        return !en(e.url, t.url) || !Je(e.queryParams, t.queryParams);
    case "always":
        return !0;
    case "paramsOrQueryParamsChange":
        return !ic(e, t) || !Je(e.queryParams, t.queryParams);
    case "paramsChange":
    default:
        return !ic(e, t)
    }
}
function Lr(e, t, n) {
    let r = kn(e)
      , i = e.value;
    Object.entries(r).forEach( ([o,s]) => {
        i.component ? t ? Lr(s, t.children.getContext(o), n) : Lr(s, null, n) : Lr(s, t, n)
    }
    ),
    i.component ? t && t.outlet && t.outlet.isActivated ? n.canDeactivateChecks.push(new Vn(t.outlet.component,i)) : n.canDeactivateChecks.push(new Vn(null,i)) : n.canDeactivateChecks.push(new Vn(null,i))
}
function Zr(e) {
    return typeof e == "function"
}
function rE(e) {
    return typeof e == "boolean"
}
function iE(e) {
    return e && Zr(e.canLoad)
}
function oE(e) {
    return e && Zr(e.canActivate)
}
function sE(e) {
    return e && Zr(e.canActivateChild)
}
function aE(e) {
    return e && Zr(e.canDeactivate)
}
function uE(e) {
    return e && Zr(e.canMatch)
}
function Hh(e) {
    return e instanceof tt || e?.name === "EmptyError"
}
var Wo = Symbol("INITIAL_VALUE");
function Bn() {
    return fe(e => wi(e.map(t => t.pipe(nt(1), Ps(Wo)))).pipe(x(t => {
        for (let n of t)
            if (n !== !0) {
                if (n === Wo)
                    return Wo;
                if (n === !1 || n instanceof _t)
                    return n
            }
        return !0
    }
    ), Ie(t => t !== Wo), nt(1)))
}
function cE(e, t) {
    return ee(n => {
        let {targetSnapshot: r, currentSnapshot: i, guards: {canActivateChecks: o, canDeactivateChecks: s}} = n;
        return s.length === 0 && o.length === 0 ? C(H(v({}, n), {
            guardsResult: !0
        })) : lE(s, r, i, e).pipe(ee(a => a && rE(a) ? dE(r, o, e, t) : C(a)), x(a => H(v({}, n), {
            guardsResult: a
        })))
    }
    )
}
function lE(e, t, n, r) {
    return W(e).pipe(ee(i => mE(i.component, i.route, n, t, r)), We(i => i !== !0, !0))
}
function dE(e, t, n, r) {
    return W(t).pipe(gt(i => dn(hE(i.route.parent, r), fE(i.route, r), gE(e, i.path, n), pE(e, i.route, n))), We(i => i !== !0, !0))
}
function fE(e, t) {
    return e !== null && t && t(new Xu(e)),
    C(!0)
}
function hE(e, t) {
    return e !== null && t && t(new Ku(e)),
    C(!0)
}
function pE(e, t, n) {
    let r = t.routeConfig ? t.routeConfig.canActivate : null;
    if (!r || r.length === 0)
        return C(!0);
    let i = r.map(o => Ci( () => {
        let s = qr(t) ?? n
          , a = Hn(o, s)
          , u = oE(a) ? a.canActivate(t, e) : ut(s, () => a(t, e));
        return Tt(u).pipe(We())
    }
    ));
    return C(i).pipe(Bn())
}
function gE(e, t, n) {
    let r = t[t.length - 1]
      , o = t.slice(0, t.length - 1).reverse().map(s => eE(s)).filter(s => s !== null).map(s => Ci( () => {
        let a = s.guards.map(u => {
            let c = qr(s.node) ?? n
              , l = Hn(u, c)
              , d = sE(l) ? l.canActivateChild(r, e) : ut(c, () => l(r, e));
            return Tt(d).pipe(We())
        }
        );
        return C(a).pipe(Bn())
    }
    ));
    return C(o).pipe(Bn())
}
function mE(e, t, n, r, i) {
    let o = t && t.routeConfig ? t.routeConfig.canDeactivate : null;
    if (!o || o.length === 0)
        return C(!0);
    let s = o.map(a => {
        let u = qr(t) ?? i
          , c = Hn(a, u)
          , l = aE(c) ? c.canDeactivate(e, t, n, r) : ut(u, () => c(e, t, n, r));
        return Tt(l).pipe(We())
    }
    );
    return C(s).pipe(Bn())
}
function vE(e, t, n, r) {
    let i = t.canLoad;
    if (i === void 0 || i.length === 0)
        return C(!0);
    let o = i.map(s => {
        let a = Hn(s, e)
          , u = iE(a) ? a.canLoad(t, n) : ut(e, () => a(t, n));
        return Tt(u)
    }
    );
    return C(o).pipe(Bn(), zh(r))
}
function zh(e) {
    return Es(te(t => {
        if (Un(t))
            throw Uh(e, t)
    }
    ), x(t => t === !0))
}
function yE(e, t, n, r) {
    let i = t.canMatch;
    if (!i || i.length === 0)
        return C(!0);
    let o = i.map(s => {
        let a = Hn(s, e)
          , u = uE(a) ? a.canMatch(t, n) : ut(e, () => a(t, n));
        return Tt(u)
    }
    );
    return C(o).pipe(Bn(), zh(r))
}
var Gr = class {
    constructor(t) {
        this.segmentGroup = t || null
    }
}
  , is = class extends Error {
    constructor(t) {
        super(),
        this.urlTree = t
    }
}
;
function Pn(e) {
    return ln(new Gr(e))
}
function DE(e) {
    return ln(new D(4e3,!1))
}
function wE(e) {
    return ln($h(!1, Oe.GuardRejected))
}
var ac = class {
    constructor(t, n) {
        this.urlSerializer = t,
        this.urlTree = n
    }
    noMatchError(t) {
        return new D(4002,!1)
    }
    lineralizeSegments(t, n) {
        let r = []
          , i = n.root;
        for (; ; ) {
            if (r = r.concat(i.segments),
            i.numberOfChildren === 0)
                return C(r);
            if (i.numberOfChildren > 1 || !i.children[T])
                return DE(t.redirectTo);
            i = i.children[T]
        }
    }
    applyRedirectCommands(t, n, r) {
        let i = this.applyRedirectCreateUrlTree(n, this.urlSerializer.parse(n), t, r);
        if (n.startsWith("/"))
            throw new is(i);
        return i
    }
    applyRedirectCreateUrlTree(t, n, r, i) {
        let o = this.createSegmentGroup(t, n.root, r, i);
        return new _t(o,this.createQueryParams(n.queryParams, this.urlTree.queryParams),n.fragment)
    }
    createQueryParams(t, n) {
        let r = {};
        return Object.entries(t).forEach( ([i,o]) => {
            if (typeof o == "string" && o.startsWith(":")) {
                let a = o.substring(1);
                r[i] = n[a]
            } else
                r[i] = o
        }
        ),
        r
    }
    createSegmentGroup(t, n, r, i) {
        let o = this.createSegments(t, n.segments, r, i)
          , s = {};
        return Object.entries(n.children).forEach( ([a,u]) => {
            s[a] = this.createSegmentGroup(t, u, r, i)
        }
        ),
        new j(o,s)
    }
    createSegments(t, n, r, i) {
        return n.map(o => o.path.startsWith(":") ? this.findPosParam(t, o, i) : this.findOrReturn(o, r))
    }
    findPosParam(t, n, r) {
        let i = r[n.path.substring(1)];
        if (!i)
            throw new D(4001,!1);
        return i
    }
    findOrReturn(t, n) {
        let r = 0;
        for (let i of n) {
            if (i.path === t.path)
                return n.splice(r),
                i;
            r++
        }
        return t
    }
}
  , uc = {
    matched: !1,
    consumedSegments: [],
    remainingSegments: [],
    parameters: {},
    positionalParamSegments: {}
};
function CE(e, t, n, r, i) {
    let o = vc(e, t, n);
    return o.matched ? (r = QC(t, r),
    yE(r, t, n, i).pipe(x(s => s === !0 ? o : v({}, uc)))) : C(o)
}
function vc(e, t, n) {
    if (t.path === "")
        return t.pathMatch === "full" && (e.hasChildren() || n.length > 0) ? v({}, uc) : {
            matched: !0,
            consumedSegments: [],
            remainingSegments: n,
            parameters: {},
            positionalParamSegments: {}
        };
    let i = (t.matcher || vC)(n, e, t);
    if (!i)
        return v({}, uc);
    let o = {};
    Object.entries(i.posParams ?? {}).forEach( ([a,u]) => {
        o[a] = u.path
    }
    );
    let s = i.consumed.length > 0 ? v(v({}, o), i.consumed[i.consumed.length - 1].parameters) : o;
    return {
        matched: !0,
        consumedSegments: i.consumed,
        remainingSegments: n.slice(i.consumed.length),
        parameters: s,
        positionalParamSegments: i.posParams ?? {}
    }
}
function wh(e, t, n, r) {
    return n.length > 0 && IE(e, n, r) ? {
        segmentGroup: new j(t,bE(r, new j(n,e.children))),
        slicedSegments: []
    } : n.length === 0 && ME(e, n, r) ? {
        segmentGroup: new j(e.segments,EE(e, t, n, r, e.children)),
        slicedSegments: n
    } : {
        segmentGroup: new j(e.segments,e.children),
        slicedSegments: n
    }
}
function EE(e, t, n, r, i) {
    let o = {};
    for (let s of r)
        if (ss(e, n, s) && !i[Xe(s)]) {
            let a = new j([],{});
            o[Xe(s)] = a
        }
    return v(v({}, i), o)
}
function bE(e, t) {
    let n = {};
    n[T] = t;
    for (let r of e)
        if (r.path === "" && Xe(r) !== T) {
            let i = new j([],{});
            n[Xe(r)] = i
        }
    return n
}
function IE(e, t, n) {
    return n.some(r => ss(e, t, r) && Xe(r) !== T)
}
function ME(e, t, n) {
    return n.some(r => ss(e, t, r))
}
function ss(e, t, n) {
    return (e.hasChildren() || t.length > 0) && n.pathMatch === "full" ? !1 : n.path === ""
}
function _E(e, t, n, r) {
    return Xe(e) !== r && (r === T || !ss(t, n, e)) ? !1 : e.path === "**" ? !0 : vc(t, e, n).matched
}
function SE(e, t, n) {
    return t.length === 0 && !e.children[n]
}
var cc = class {
}
;
function TE(e, t, n, r, i, o, s="emptyOnly") {
    return new lc(e,t,n,r,i,s,o).recognize()
}
var xE = 31
  , lc = class {
    constructor(t, n, r, i, o, s, a) {
        this.injector = t,
        this.configLoader = n,
        this.rootComponentType = r,
        this.config = i,
        this.urlTree = o,
        this.paramsInheritanceStrategy = s,
        this.urlSerializer = a,
        this.applyRedirects = new ac(this.urlSerializer,this.urlTree),
        this.absoluteRedirectCount = 0,
        this.allowRedirects = !0
    }
    noMatchError(t) {
        return new D(4002,!1)
    }
    recognize() {
        let t = wh(this.urlTree.root, [], [], this.config).segmentGroup;
        return this.match(t).pipe(x(n => {
            let r = new Hr([],Object.freeze({}),Object.freeze(v({}, this.urlTree.queryParams)),this.urlTree.fragment,{},T,this.rootComponentType,null,{})
              , i = new Te(r,n)
              , o = new ns("",i)
              , s = kC(r, [], this.urlTree.queryParams, this.urlTree.fragment);
            return s.queryParams = this.urlTree.queryParams,
            o.url = this.urlSerializer.serialize(s),
            this.inheritParamsAndData(o._root, null),
            {
                state: o,
                tree: s
            }
        }
        ))
    }
    match(t) {
        return this.processSegmentGroup(this.injector, this.config, t, T).pipe(pt(r => {
            if (r instanceof is)
                return this.urlTree = r.urlTree,
                this.match(r.urlTree.root);
            throw r instanceof Gr ? this.noMatchError(r) : r
        }
        ))
    }
    inheritParamsAndData(t, n) {
        let r = t.value
          , i = hc(r, n, this.paramsInheritanceStrategy);
        r.params = Object.freeze(i.params),
        r.data = Object.freeze(i.data),
        t.children.forEach(o => this.inheritParamsAndData(o, r))
    }
    processSegmentGroup(t, n, r, i) {
        return r.segments.length === 0 && r.hasChildren() ? this.processChildren(t, n, r) : this.processSegment(t, n, r, r.segments, i, !0).pipe(x(o => o instanceof Te ? [o] : []))
    }
    processChildren(t, n, r) {
        let i = [];
        for (let o of Object.keys(r.children))
            o === "primary" ? i.unshift(o) : i.push(o);
        return W(i).pipe(gt(o => {
            let s = r.children[o]
              , a = KC(n, o);
            return this.processSegmentGroup(t, a, s, o)
        }
        ), Rs( (o, s) => (o.push(...s),
        o)), mt(null), Os(), ee(o => {
            if (o === null)
                return Pn(r);
            let s = Gh(o);
            return AE(s),
            C(s)
        }
        ))
    }
    processSegment(t, n, r, i, o, s) {
        return W(n).pipe(gt(a => this.processSegmentAgainstRoute(a._injector ?? t, n, a, r, i, o, s).pipe(pt(u => {
            if (u instanceof Gr)
                return C(null);
            throw u
        }
        ))), We(a => !!a), pt(a => {
            if (Hh(a))
                return SE(r, i, o) ? C(new cc) : Pn(r);
            throw a
        }
        ))
    }
    processSegmentAgainstRoute(t, n, r, i, o, s, a) {
        return _E(r, i, o, s) ? r.redirectTo === void 0 ? this.matchSegmentAgainstRoute(t, i, r, o, s) : this.allowRedirects && a ? this.expandSegmentAgainstRouteUsingRedirect(t, i, n, r, o, s) : Pn(i) : Pn(i)
    }
    expandSegmentAgainstRouteUsingRedirect(t, n, r, i, o, s) {
        let {matched: a, consumedSegments: u, positionalParamSegments: c, remainingSegments: l} = i.path === "**" ? Ch(o) : vc(n, i, o);
        if (!a)
            return Pn(n);
        i.redirectTo.startsWith("/") && (this.absoluteRedirectCount++,
        this.absoluteRedirectCount > xE && (this.allowRedirects = !1));
        let d = this.applyRedirects.applyRedirectCommands(u, i.redirectTo, c);
        return this.applyRedirects.lineralizeSegments(i, d).pipe(ee(f => this.processSegment(t, r, n, f.concat(l), s, !1)))
    }
    matchSegmentAgainstRoute(t, n, r, i, o) {
        let s;
        return r.path === "**" ? (s = C(Ch(i)),
        n.children = {}) : s = CE(n, r, i, t, this.urlSerializer),
        s.pipe(fe(a => a.matched ? (t = r._injector ?? t,
        this.getChildConfig(t, r, i).pipe(fe( ({routes: u}) => {
            let c = r._loadedInjector ?? t
              , {consumedSegments: l, remainingSegments: d, parameters: f} = a
              , h = new Hr(l,f,Object.freeze(v({}, this.urlTree.queryParams)),this.urlTree.fragment,OE(r),Xe(r),r.component ?? r._loadedComponent ?? null,r,RE(r))
              , {segmentGroup: p, slicedSegments: b} = wh(n, l, d, u);
            if (b.length === 0 && p.hasChildren())
                return this.processChildren(c, u, p).pipe(x(m => m === null ? null : new Te(h,m)));
            if (u.length === 0 && b.length === 0)
                return C(new Te(h,[]));
            let y = Xe(r) === o;
            return this.processSegment(c, u, p, b, y ? T : o, !0).pipe(x(m => new Te(h,m instanceof Te ? [m] : [])))
        }
        ))) : Pn(n)))
    }
    getChildConfig(t, n, r) {
        return n.children ? C({
            routes: n.children,
            injector: t
        }) : n.loadChildren ? n._loadedRoutes !== void 0 ? C({
            routes: n._loadedRoutes,
            injector: n._loadedInjector
        }) : vE(t, n, r, this.urlSerializer).pipe(ee(i => i ? this.configLoader.loadChildren(t, n).pipe(te(o => {
            n._loadedRoutes = o.routes,
            n._loadedInjector = o.injector
        }
        )) : wE(n))) : C({
            routes: [],
            injector: t
        })
    }
}
;
function AE(e) {
    e.sort( (t, n) => t.value.outlet === T ? -1 : n.value.outlet === T ? 1 : t.value.outlet.localeCompare(n.value.outlet))
}
function NE(e) {
    let t = e.value.routeConfig;
    return t && t.path === ""
}
function Gh(e) {
    let t = []
      , n = new Set;
    for (let r of e) {
        if (!NE(r)) {
            t.push(r);
            continue
        }
        let i = t.find(o => r.value.routeConfig === o.value.routeConfig);
        i !== void 0 ? (i.children.push(...r.children),
        n.add(i)) : t.push(r)
    }
    for (let r of n) {
        let i = Gh(r.children);
        t.push(new Te(r.value,i))
    }
    return t.filter(r => !n.has(r))
}
function OE(e) {
    return e.data || {}
}
function RE(e) {
    return e.resolve || {}
}
function Ch(e) {
    return {
        matched: !0,
        parameters: e.length > 0 ? bh(e).parameters : {},
        consumedSegments: e,
        remainingSegments: [],
        positionalParamSegments: {}
    }
}
function FE(e, t, n, r, i, o) {
    return ee(s => TE(e, t, n, r, s.extractedUrl, i, o).pipe(x( ({state: a, tree: u}) => H(v({}, s), {
        targetSnapshot: a,
        urlAfterRedirects: u
    }))))
}
function PE(e, t) {
    return ee(n => {
        let {targetSnapshot: r, guards: {canActivateChecks: i}} = n;
        if (!i.length)
            return C(n);
        let o = new Set(i.map(u => u.route))
          , s = new Set;
        for (let u of o)
            if (!s.has(u))
                for (let c of Wh(u))
                    s.add(c);
        let a = 0;
        return W(s).pipe(gt(u => o.has(u) ? kE(u, r, e, t) : (u.data = hc(u, u.parent, e).resolve,
        C(void 0))), te( () => a++), fn(1), ee(u => a === s.size ? C(n) : De))
    }
    )
}
function Wh(e) {
    let t = e.children.map(n => Wh(n)).flat();
    return [e, ...t]
}
function kE(e, t, n, r) {
    let i = e.routeConfig
      , o = e._resolve;
    return i?.title !== void 0 && !Vh(i) && (o[Wr] = i.title),
    LE(o, e, t, r).pipe(x(s => (e._resolvedData = s,
    e.data = hc(e, e.parent, n).resolve,
    null)))
}
function LE(e, t, n, r) {
    let i = Uu(e);
    if (i.length === 0)
        return C({});
    let o = {};
    return W(i).pipe(ee(s => VE(e[s], t, n, r).pipe(We(), te(a => {
        o[s] = a
    }
    ))), fn(1), As(o), pt(s => Hh(s) ? De : ln(s)))
}
function VE(e, t, n, r) {
    let i = qr(t) ?? r
      , o = Hn(e, i)
      , s = o.resolve ? o.resolve(t, n) : ut(i, () => o(t, n));
    return Tt(s)
}
function Vu(e) {
    return fe(t => {
        let n = e(t);
        return n ? W(n).pipe(x( () => t)) : C(t)
    }
    )
}
var qh = ( () => {
    let t = class t {
        buildTitle(r) {
            let i, o = r.root;
            for (; o !== void 0; )
                i = this.getResolvedTitleForRoute(o) ?? i,
                o = o.children.find(s => s.outlet === T);
            return i
        }
        getResolvedTitleForRoute(r) {
            return r.data[Wr]
        }
    }
    ;
    t.\u0275fac = function(i) {
        return new (i || t)
    }
    ,
    t.\u0275prov = E({
        token: t,
        factory: () => g(jE),
        providedIn: "root"
    });
    let e = t;
    return e
}
)()
  , jE = ( () => {
    let t = class t extends qh {
        constructor(r) {
            super(),
            this.title = r
        }
        updateTitle(r) {
            let i = this.buildTitle(r);
            i !== void 0 && this.title.setTitle(i)
        }
    }
    ;
    t.\u0275fac = function(i) {
        return new (i || t)(I(Fu))
    }
    ,
    t.\u0275prov = E({
        token: t,
        factory: t.\u0275fac,
        providedIn: "root"
    });
    let e = t;
    return e
}
)()
  , yc = new w("",{
    providedIn: "root",
    factory: () => ({})
})
  , Dc = new w("ROUTES")
  , UE = ( () => {
    let t = class t {
        constructor() {
            this.componentLoaders = new WeakMap,
            this.childrenLoaders = new WeakMap,
            this.compiler = g(mu)
        }
        loadComponent(r) {
            if (this.componentLoaders.get(r))
                return this.componentLoaders.get(r);
            if (r._loadedComponent)
                return C(r._loadedComponent);
            this.onLoadStartListener && this.onLoadStartListener(r);
            let i = Tt(r.loadComponent()).pipe(x(Zh), te(s => {
                this.onLoadEndListener && this.onLoadEndListener(r),
                r._loadedComponent = s
            }
            ), Ot( () => {
                this.componentLoaders.delete(r)
            }
            ))
              , o = new cn(i, () => new de).pipe(un());
            return this.componentLoaders.set(r, o),
            o
        }
        loadChildren(r, i) {
            if (this.childrenLoaders.get(i))
                return this.childrenLoaders.get(i);
            if (i._loadedRoutes)
                return C({
                    routes: i._loadedRoutes,
                    injector: i._loadedInjector
                });
            this.onLoadStartListener && this.onLoadStartListener(i);
            let s = $E(i, this.compiler, r, this.onLoadEndListener).pipe(Ot( () => {
                this.childrenLoaders.delete(i)
            }
            ))
              , a = new cn(s, () => new de).pipe(un());
            return this.childrenLoaders.set(i, a),
            a
        }
    }
    ;
    t.\u0275fac = function(i) {
        return new (i || t)
    }
    ,
    t.\u0275prov = E({
        token: t,
        factory: t.\u0275fac,
        providedIn: "root"
    });
    let e = t;
    return e
}
)();
function $E(e, t, n, r) {
    return Tt(e.loadChildren()).pipe(x(Zh), ee(i => i instanceof fr || Array.isArray(i) ? C(i) : W(t.compileModuleAsync(i))), x(i => {
        r && r(e);
        let o, s, a = !1;
        return Array.isArray(i) ? (s = i,
        a = !0) : (o = i.create(n).injector,
        s = o.get(Dc, [], {
            optional: !0,
            self: !0
        }).flat()),
        {
            routes: s.map(mc),
            injector: o
        }
    }
    ))
}
function BE(e) {
    return e && typeof e == "object" && "default"in e
}
function Zh(e) {
    return BE(e) ? e.default : e
}
var wc = ( () => {
    let t = class t {
    }
    ;
    t.\u0275fac = function(i) {
        return new (i || t)
    }
    ,
    t.\u0275prov = E({
        token: t,
        factory: () => g(HE),
        providedIn: "root"
    });
    let e = t;
    return e
}
)()
  , HE = ( () => {
    let t = class t {
        shouldProcessUrl(r) {
            return !0
        }
        extract(r) {
            return r
        }
        merge(r, i) {
            return r
        }
    }
    ;
    t.\u0275fac = function(i) {
        return new (i || t)
    }
    ,
    t.\u0275prov = E({
        token: t,
        factory: t.\u0275fac,
        providedIn: "root"
    });
    let e = t;
    return e
}
)()
  , zE = new w("");
var GE = ( () => {
    let t = class t {
        get hasRequestedNavigation() {
            return this.navigationId !== 0
        }
        constructor() {
            this.currentNavigation = null,
            this.currentTransition = null,
            this.lastSuccessfulNavigation = null,
            this.events = new de,
            this.transitionAbortSubject = new de,
            this.configLoader = g(UE),
            this.environmentInjector = g(Ee),
            this.urlSerializer = g(fc),
            this.rootContexts = g(os),
            this.location = g(Mr),
            this.inputBindingEnabled = g(gc, {
                optional: !0
            }) !== null,
            this.titleStrategy = g(qh),
            this.options = g(yc, {
                optional: !0
            }) || {},
            this.paramsInheritanceStrategy = this.options.paramsInheritanceStrategy || "emptyOnly",
            this.urlHandlingStrategy = g(wc),
            this.createViewTransition = g(zE, {
                optional: !0
            }),
            this.navigationId = 0,
            this.afterPreactivation = () => C(void 0),
            this.rootComponentType = null;
            let r = o => this.events.next(new Yu(o))
              , i = o => this.events.next(new Qu(o));
            this.configLoader.onLoadEndListener = i,
            this.configLoader.onLoadStartListener = r
        }
        complete() {
            this.transitions?.complete()
        }
        handleNavigationRequest(r) {
            let i = ++this.navigationId;
            this.transitions?.next(H(v(v({}, this.transitions.value), r), {
                id: i
            }))
        }
        setupNavigations(r, i, o) {
            return this.transitions = new se({
                id: 0,
                currentUrlTree: i,
                currentRawUrl: i,
                extractedUrl: this.urlHandlingStrategy.extract(i),
                urlAfterRedirects: this.urlHandlingStrategy.extract(i),
                rawUrl: i,
                extras: {},
                resolve: null,
                reject: null,
                promise: Promise.resolve(!0),
                source: kr,
                restoredState: null,
                currentSnapshot: o.snapshot,
                targetSnapshot: null,
                currentRouterState: o,
                targetRouterState: null,
                guards: {
                    canActivateChecks: [],
                    canDeactivateChecks: []
                },
                guardsResult: null
            }),
            this.transitions.pipe(Ie(s => s.id !== 0), x(s => H(v({}, s), {
                extractedUrl: this.urlHandlingStrategy.extract(s.rawUrl)
            })), fe(s => {
                this.currentTransition = s;
                let a = !1
                  , u = !1;
                return C(s).pipe(te(c => {
                    this.currentNavigation = {
                        id: c.id,
                        initialUrl: c.rawUrl,
                        extractedUrl: c.extractedUrl,
                        trigger: c.source,
                        extras: c.extras,
                        previousNavigation: this.lastSuccessfulNavigation ? H(v({}, this.lastSuccessfulNavigation), {
                            previousNavigation: null
                        }) : null
                    }
                }
                ), fe(c => {
                    let l = !r.navigated || this.isUpdatingInternalState() || this.isUpdatedBrowserUrl()
                      , d = c.extras.onSameUrlNavigation ?? r.onSameUrlNavigation;
                    if (!l && d !== "reload") {
                        let f = "";
                        return this.events.next(new nn(c.id,this.urlSerializer.serialize(c.rawUrl),f,zu.IgnoredSameUrlNavigation)),
                        c.resolve(null),
                        De
                    }
                    if (this.urlHandlingStrategy.shouldProcessUrl(c.rawUrl))
                        return C(c).pipe(fe(f => {
                            let h = this.transitions?.getValue();
                            return this.events.next(new jr(f.id,this.urlSerializer.serialize(f.extractedUrl),f.source,f.restoredState)),
                            h !== this.transitions?.getValue() ? De : Promise.resolve(f)
                        }
                        ), FE(this.environmentInjector, this.configLoader, this.rootComponentType, r.config, this.urlSerializer, this.paramsInheritanceStrategy), te(f => {
                            s.targetSnapshot = f.targetSnapshot,
                            s.urlAfterRedirects = f.urlAfterRedirects,
                            this.currentNavigation = H(v({}, this.currentNavigation), {
                                finalUrl: f.urlAfterRedirects
                            });
                            let h = new Xo(f.id,this.urlSerializer.serialize(f.extractedUrl),this.urlSerializer.serialize(f.urlAfterRedirects),f.targetSnapshot);
                            this.events.next(h)
                        }
                        ));
                    if (l && this.urlHandlingStrategy.shouldProcessUrl(c.currentRawUrl)) {
                        let {id: f, extractedUrl: h, source: p, restoredState: b, extras: y} = c
                          , m = new jr(f,this.urlSerializer.serialize(h),p,b);
                        this.events.next(m);
                        let Q = kh(h, this.rootComponentType).snapshot;
                        return this.currentTransition = s = H(v({}, c), {
                            targetSnapshot: Q,
                            urlAfterRedirects: h,
                            extras: H(v({}, y), {
                                skipLocationChange: !1,
                                replaceUrl: !1
                            })
                        }),
                        this.currentNavigation.finalUrl = h,
                        C(s)
                    } else {
                        let f = "";
                        return this.events.next(new nn(c.id,this.urlSerializer.serialize(c.extractedUrl),f,zu.IgnoredByUrlHandlingStrategy)),
                        c.resolve(null),
                        De
                    }
                }
                ), te(c => {
                    let l = new Gu(c.id,this.urlSerializer.serialize(c.extractedUrl),this.urlSerializer.serialize(c.urlAfterRedirects),c.targetSnapshot);
                    this.events.next(l)
                }
                ), x(c => (this.currentTransition = s = H(v({}, c), {
                    guards: XC(c.targetSnapshot, c.currentSnapshot, this.rootContexts)
                }),
                s)), cE(this.environmentInjector, c => this.events.next(c)), te(c => {
                    if (s.guardsResult = c.guardsResult,
                    Un(c.guardsResult))
                        throw Uh(this.urlSerializer, c.guardsResult);
                    let l = new Wu(c.id,this.urlSerializer.serialize(c.extractedUrl),this.urlSerializer.serialize(c.urlAfterRedirects),c.targetSnapshot,!!c.guardsResult);
                    this.events.next(l)
                }
                ), Ie(c => c.guardsResult ? !0 : (this.cancelNavigationTransition(c, "", Oe.GuardRejected),
                !1)), Vu(c => {
                    if (c.guards.canActivateChecks.length)
                        return C(c).pipe(te(l => {
                            let d = new qu(l.id,this.urlSerializer.serialize(l.extractedUrl),this.urlSerializer.serialize(l.urlAfterRedirects),l.targetSnapshot);
                            this.events.next(d)
                        }
                        ), fe(l => {
                            let d = !1;
                            return C(l).pipe(PE(this.paramsInheritanceStrategy, this.environmentInjector), te({
                                next: () => d = !0,
                                complete: () => {
                                    d || this.cancelNavigationTransition(l, "", Oe.NoDataFromResolver)
                                }
                            }))
                        }
                        ), te(l => {
                            let d = new Zu(l.id,this.urlSerializer.serialize(l.extractedUrl),this.urlSerializer.serialize(l.urlAfterRedirects),l.targetSnapshot);
                            this.events.next(d)
                        }
                        ))
                }
                ), Vu(c => {
                    let l = d => {
                        let f = [];
                        d.routeConfig?.loadComponent && !d.routeConfig._loadedComponent && f.push(this.configLoader.loadComponent(d.routeConfig).pipe(te(h => {
                            d.component = h
                        }
                        ), x( () => {}
                        )));
                        for (let h of d.children)
                            f.push(...l(h));
                        return f
                    }
                    ;
                    return wi(l(c.targetSnapshot.root)).pipe(mt(), nt(1))
                }
                ), Vu( () => this.afterPreactivation()), fe( () => {
                    let {currentSnapshot: c, targetSnapshot: l} = s
                      , d = this.createViewTransition?.(this.environmentInjector, c.root, l.root);
                    return d ? W(d).pipe(x( () => s)) : C(s)
                }
                ), x(c => {
                    let l = GC(r.routeReuseStrategy, c.targetSnapshot, c.currentRouterState);
                    return this.currentTransition = s = H(v({}, c), {
                        targetRouterState: l
                    }),
                    this.currentNavigation.targetRouterState = l,
                    s
                }
                ), te( () => {
                    this.events.next(new $r)
                }
                ), JC(this.rootContexts, r.routeReuseStrategy, c => this.events.next(c), this.inputBindingEnabled), nt(1), te({
                    next: c => {
                        a = !0,
                        this.lastSuccessfulNavigation = this.currentNavigation,
                        this.events.next(new tn(c.id,this.urlSerializer.serialize(c.extractedUrl),this.urlSerializer.serialize(c.urlAfterRedirects))),
                        this.titleStrategy?.updateTitle(c.targetRouterState.snapshot),
                        c.resolve(!0)
                    }
                    ,
                    complete: () => {
                        a = !0
                    }
                }), ks(this.transitionAbortSubject.pipe(te(c => {
                    throw c
                }
                ))), Ot( () => {
                    if (!a && !u) {
                        let c = "";
                        this.cancelNavigationTransition(s, c, Oe.SupersededByNewNavigation)
                    }
                    this.currentNavigation?.id === s.id && (this.currentNavigation = null)
                }
                ), pt(c => {
                    if (u = !0,
                    Bh(c))
                        this.events.next(new St(s.id,this.urlSerializer.serialize(s.extractedUrl),c.message,c.cancellationCode)),
                        ZC(c) ? this.events.next(new Br(c.url)) : s.resolve(!1);
                    else {
                        this.events.next(new Ur(s.id,this.urlSerializer.serialize(s.extractedUrl),c,s.targetSnapshot ?? void 0));
                        try {
                            s.resolve(r.errorHandler(c))
                        } catch (l) {
                            s.reject(l)
                        }
                    }
                    return De
                }
                ))
            }
            ))
        }
        cancelNavigationTransition(r, i, o) {
            let s = new St(r.id,this.urlSerializer.serialize(r.extractedUrl),i,o);
            this.events.next(s),
            r.resolve(!1)
        }
        isUpdatingInternalState() {
            return this.currentTransition?.extractedUrl.toString() !== this.currentTransition?.currentUrlTree.toString()
        }
        isUpdatedBrowserUrl() {
            return this.urlHandlingStrategy.extract(this.urlSerializer.parse(this.location.path(!0))).toString() !== this.currentTransition?.extractedUrl.toString() && !this.currentTransition?.extras.skipLocationChange
        }
    }
    ;
    t.\u0275fac = function(i) {
        return new (i || t)
    }
    ,
    t.\u0275prov = E({
        token: t,
        factory: t.\u0275fac,
        providedIn: "root"
    });
    let e = t;
    return e
}
)();
function WE(e) {
    return e !== kr
}
var qE = ( () => {
    let t = class t {
    }
    ;
    t.\u0275fac = function(i) {
        return new (i || t)
    }
    ,
    t.\u0275prov = E({
        token: t,
        factory: () => g(ZE),
        providedIn: "root"
    });
    let e = t;
    return e
}
)()
  , dc = class {
    shouldDetach(t) {
        return !1
    }
    store(t, n) {}
    shouldAttach(t) {
        return !1
    }
    retrieve(t) {
        return null
    }
    shouldReuseRoute(t, n) {
        return t.routeConfig === n.routeConfig
    }
}
  , ZE = ( () => {
    let t = class t extends dc {
    }
    ;
    t.\u0275fac = ( () => {
        let r;
        return function(o) {
            return (r || (r = vr(t)))(o || t)
        }
    }
    )(),
    t.\u0275prov = E({
        token: t,
        factory: t.\u0275fac,
        providedIn: "root"
    });
    let e = t;
    return e
}
)()
  , Yh = ( () => {
    let t = class t {
    }
    ;
    t.\u0275fac = function(i) {
        return new (i || t)
    }
    ,
    t.\u0275prov = E({
        token: t,
        factory: () => g(YE),
        providedIn: "root"
    });
    let e = t;
    return e
}
)()
  , YE = ( () => {
    let t = class t extends Yh {
        constructor() {
            super(...arguments),
            this.location = g(Mr),
            this.urlSerializer = g(fc),
            this.options = g(yc, {
                optional: !0
            }) || {},
            this.canceledNavigationResolution = this.options.canceledNavigationResolution || "replace",
            this.urlHandlingStrategy = g(wc),
            this.urlUpdateStrategy = this.options.urlUpdateStrategy || "deferred",
            this.currentUrlTree = new _t,
            this.rawUrlTree = this.currentUrlTree,
            this.currentPageId = 0,
            this.lastSuccessfulId = -1,
            this.routerState = kh(this.currentUrlTree, null),
            this.stateMemento = this.createStateMemento()
        }
        getCurrentUrlTree() {
            return this.currentUrlTree
        }
        getRawUrlTree() {
            return this.rawUrlTree
        }
        restoredState() {
            return this.location.getState()
        }
        get browserPageId() {
            return this.canceledNavigationResolution !== "computed" ? this.currentPageId : this.restoredState()?.\u0275routerPageId ?? this.currentPageId
        }
        getRouterState() {
            return this.routerState
        }
        createStateMemento() {
            return {
                rawUrlTree: this.rawUrlTree,
                currentUrlTree: this.currentUrlTree,
                routerState: this.routerState
            }
        }
        registerNonRouterCurrentEntryChangeListener(r) {
            return this.location.subscribe(i => {
                i.type === "popstate" && r(i.url, i.state)
            }
            )
        }
        handleRouterEvent(r, i) {
            if (r instanceof jr)
                this.stateMemento = this.createStateMemento();
            else if (r instanceof nn)
                this.rawUrlTree = i.initialUrl;
            else if (r instanceof Xo) {
                if (this.urlUpdateStrategy === "eager" && !i.extras.skipLocationChange) {
                    let o = this.urlHandlingStrategy.merge(i.finalUrl, i.initialUrl);
                    this.setBrowserUrl(o, i)
                }
            } else
                r instanceof $r ? (this.currentUrlTree = i.finalUrl,
                this.rawUrlTree = this.urlHandlingStrategy.merge(i.finalUrl, i.initialUrl),
                this.routerState = i.targetRouterState,
                this.urlUpdateStrategy === "deferred" && (i.extras.skipLocationChange || this.setBrowserUrl(this.rawUrlTree, i))) : r instanceof St && (r.code === Oe.GuardRejected || r.code === Oe.NoDataFromResolver) ? this.restoreHistory(i) : r instanceof Ur ? this.restoreHistory(i, !0) : r instanceof tn && (this.lastSuccessfulId = r.id,
                this.currentPageId = this.browserPageId)
        }
        setBrowserUrl(r, i) {
            let o = this.urlSerializer.serialize(r);
            if (this.location.isCurrentPathEqualTo(o) || i.extras.replaceUrl) {
                let s = this.browserPageId
                  , a = v(v({}, i.extras.state), this.generateNgRouterState(i.id, s));
                this.location.replaceState(o, "", a)
            } else {
                let s = v(v({}, i.extras.state), this.generateNgRouterState(i.id, this.browserPageId + 1));
                this.location.go(o, "", s)
            }
        }
        restoreHistory(r, i=!1) {
            if (this.canceledNavigationResolution === "computed") {
                let o = this.browserPageId
                  , s = this.currentPageId - o;
                s !== 0 ? this.location.historyGo(s) : this.currentUrlTree === r.finalUrl && s === 0 && (this.resetState(r),
                this.resetUrlToCurrentUrlTree())
            } else
                this.canceledNavigationResolution === "replace" && (i && this.resetState(r),
                this.resetUrlToCurrentUrlTree())
        }
        resetState(r) {
            this.routerState = this.stateMemento.routerState,
            this.currentUrlTree = this.stateMemento.currentUrlTree,
            this.rawUrlTree = this.urlHandlingStrategy.merge(this.currentUrlTree, r.finalUrl ?? this.rawUrlTree)
        }
        resetUrlToCurrentUrlTree() {
            this.location.replaceState(this.urlSerializer.serialize(this.rawUrlTree), "", this.generateNgRouterState(this.lastSuccessfulId, this.currentPageId))
        }
        generateNgRouterState(r, i) {
            return this.canceledNavigationResolution === "computed" ? {
                navigationId: r,
                \u0275routerPageId: i
            } : {
                navigationId: r
            }
        }
    }
    ;
    t.\u0275fac = ( () => {
        let r;
        return function(o) {
            return (r || (r = vr(t)))(o || t)
        }
    }
    )(),
    t.\u0275prov = E({
        token: t,
        factory: t.\u0275fac,
        providedIn: "root"
    });
    let e = t;
    return e
}
)()
  , Fr = function(e) {
    return e[e.COMPLETE = 0] = "COMPLETE",
    e[e.FAILED = 1] = "FAILED",
    e[e.REDIRECTING = 2] = "REDIRECTING",
    e
}(Fr || {});
function QE(e, t) {
    e.events.pipe(Ie(n => n instanceof tn || n instanceof St || n instanceof Ur || n instanceof nn), x(n => n instanceof tn || n instanceof nn ? Fr.COMPLETE : (n instanceof St ? n.code === Oe.Redirect || n.code === Oe.SupersededByNewNavigation : !1) ? Fr.REDIRECTING : Fr.FAILED), Ie(n => n !== Fr.REDIRECTING), nt(1)).subscribe( () => {
        t()
    }
    )
}
function KE(e) {
    throw e
}
var JE = {
    paths: "exact",
    fragment: "ignored",
    matrixParams: "ignored",
    queryParams: "exact"
}
  , XE = {
    paths: "subset",
    fragment: "ignored",
    matrixParams: "ignored",
    queryParams: "subset"
}
  , Qh = ( () => {
    let t = class t {
        get currentUrlTree() {
            return this.stateManager.getCurrentUrlTree()
        }
        get rawUrlTree() {
            return this.stateManager.getRawUrlTree()
        }
        get events() {
            return this._events
        }
        get routerState() {
            return this.stateManager.getRouterState()
        }
        constructor() {
            this.disposed = !1,
            this.isNgZoneEnabled = !1,
            this.console = g(Co),
            this.stateManager = g(Yh),
            this.options = g(yc, {
                optional: !0
            }) || {},
            this.pendingTasks = g(br),
            this.urlUpdateStrategy = this.options.urlUpdateStrategy || "deferred",
            this.navigationTransitions = g(GE),
            this.urlSerializer = g(fc),
            this.location = g(Mr),
            this.urlHandlingStrategy = g(wc),
            this._events = new de,
            this.errorHandler = this.options.errorHandler || KE,
            this.navigated = !1,
            this.routeReuseStrategy = g(qE),
            this.onSameUrlNavigation = this.options.onSameUrlNavigation || "ignore",
            this.config = g(Dc, {
                optional: !0
            })?.flat() ?? [],
            this.componentInputBindingEnabled = !!g(gc, {
                optional: !0
            }),
            this.eventsSubscription = new re,
            this.isNgZoneEnabled = g(K)instanceof K && K.isInAngularZone(),
            this.resetConfig(this.config),
            this.navigationTransitions.setupNavigations(this, this.currentUrlTree, this.routerState).subscribe({
                error: r => {
                    this.console.warn(r)
                }
            }),
            this.subscribeToNavigationEvents()
        }
        subscribeToNavigationEvents() {
            let r = this.navigationTransitions.events.subscribe(i => {
                try {
                    let o = this.navigationTransitions.currentTransition
                      , s = this.navigationTransitions.currentNavigation;
                    if (o !== null && s !== null) {
                        if (this.stateManager.handleRouterEvent(i, s),
                        i instanceof St && i.code !== Oe.Redirect && i.code !== Oe.SupersededByNewNavigation)
                            this.navigated = !0;
                        else if (i instanceof tn)
                            this.navigated = !0;
                        else if (i instanceof Br) {
                            let a = this.urlHandlingStrategy.merge(i.url, o.currentRawUrl)
                              , u = {
                                skipLocationChange: o.extras.skipLocationChange,
                                replaceUrl: this.urlUpdateStrategy === "eager" || WE(o.source)
                            };
                            this.scheduleNavigation(a, kr, null, u, {
                                resolve: o.resolve,
                                reject: o.reject,
                                promise: o.promise
                            })
                        }
                    }
                    tb(i) && this._events.next(i)
                } catch (o) {
                    this.navigationTransitions.transitionAbortSubject.next(o)
                }
            }
            );
            this.eventsSubscription.add(r)
        }
        resetRootComponentType(r) {
            this.routerState.root.component = r,
            this.navigationTransitions.rootComponentType = r
        }
        initialNavigation() {
            this.setUpLocationChangeListener(),
            this.navigationTransitions.hasRequestedNavigation || this.navigateToSyncWithBrowser(this.location.path(!0), kr, this.stateManager.restoredState())
        }
        setUpLocationChangeListener() {
            this.nonRouterCurrentEntryChangeSubscription || (this.nonRouterCurrentEntryChangeSubscription = this.stateManager.registerNonRouterCurrentEntryChangeListener( (r, i) => {
                setTimeout( () => {
                    this.navigateToSyncWithBrowser(r, "popstate", i)
                }
                , 0)
            }
            ))
        }
        navigateToSyncWithBrowser(r, i, o) {
            let s = {
                replaceUrl: !0
            }
              , a = o?.navigationId ? o : null;
            if (o) {
                let c = v({}, o);
                delete c.navigationId,
                delete c.\u0275routerPageId,
                Object.keys(c).length !== 0 && (s.state = c)
            }
            let u = this.parseUrl(r);
            this.scheduleNavigation(u, i, a, s)
        }
        get url() {
            return this.serializeUrl(this.currentUrlTree)
        }
        getCurrentNavigation() {
            return this.navigationTransitions.currentNavigation
        }
        get lastSuccessfulNavigation() {
            return this.navigationTransitions.lastSuccessfulNavigation
        }
        resetConfig(r) {
            this.config = r.map(mc),
            this.navigated = !1
        }
        ngOnDestroy() {
            this.dispose()
        }
        dispose() {
            this.navigationTransitions.complete(),
            this.nonRouterCurrentEntryChangeSubscription && (this.nonRouterCurrentEntryChangeSubscription.unsubscribe(),
            this.nonRouterCurrentEntryChangeSubscription = void 0),
            this.disposed = !0,
            this.eventsSubscription.unsubscribe()
        }
        createUrlTree(r, i={}) {
            let {relativeTo: o, queryParams: s, fragment: a, queryParamsHandling: u, preserveFragment: c} = i
              , l = c ? this.currentUrlTree.fragment : a
              , d = null;
            switch (u) {
            case "merge":
                d = v(v({}, this.currentUrlTree.queryParams), s);
                break;
            case "preserve":
                d = this.currentUrlTree.queryParams;
                break;
            default:
                d = s || null
            }
            d !== null && (d = this.removeEmptyProps(d));
            let f;
            try {
                let h = o ? o.snapshot : this.routerState.snapshot.root;
                f = Oh(h)
            } catch {
                (typeof r[0] != "string" || !r[0].startsWith("/")) && (r = []),
                f = this.currentUrlTree.root
            }
            return Rh(f, r, d, l ?? null)
        }
        navigateByUrl(r, i={
            skipLocationChange: !1
        }) {
            let o = Un(r) ? r : this.parseUrl(r)
              , s = this.urlHandlingStrategy.merge(o, this.rawUrlTree);
            return this.scheduleNavigation(s, kr, null, i)
        }
        navigate(r, i={
            skipLocationChange: !1
        }) {
            return eb(r),
            this.navigateByUrl(this.createUrlTree(r, i), i)
        }
        serializeUrl(r) {
            return this.urlSerializer.serialize(r)
        }
        parseUrl(r) {
            try {
                return this.urlSerializer.parse(r)
            } catch {
                return this.urlSerializer.parse("/")
            }
        }
        isActive(r, i) {
            let o;
            if (i === !0 ? o = v({}, JE) : i === !1 ? o = v({}, XE) : o = i,
            Un(r))
                return mh(this.currentUrlTree, r, o);
            let s = this.parseUrl(r);
            return mh(this.currentUrlTree, s, o)
        }
        removeEmptyProps(r) {
            return Object.keys(r).reduce( (i, o) => {
                let s = r[o];
                return s != null && (i[o] = s),
                i
            }
            , {})
        }
        scheduleNavigation(r, i, o, s, a) {
            if (this.disposed)
                return Promise.resolve(!1);
            let u, c, l;
            a ? (u = a.resolve,
            c = a.reject,
            l = a.promise) : l = new Promise( (f, h) => {
                u = f,
                c = h
            }
            );
            let d = this.pendingTasks.add();
            return QE(this, () => {
                queueMicrotask( () => this.pendingTasks.remove(d))
            }
            ),
            this.navigationTransitions.handleNavigationRequest({
                source: i,
                restoredState: o,
                currentUrlTree: this.currentUrlTree,
                currentRawUrl: this.currentUrlTree,
                rawUrl: r,
                extras: s,
                resolve: u,
                reject: c,
                promise: l,
                currentSnapshot: this.routerState.snapshot,
                currentRouterState: this.routerState
            }),
            l.catch(f => Promise.reject(f))
        }
    }
    ;
    t.\u0275fac = function(i) {
        return new (i || t)
    }
    ,
    t.\u0275prov = E({
        token: t,
        factory: t.\u0275fac,
        providedIn: "root"
    });
    let e = t;
    return e
}
)();
function eb(e) {
    for (let t = 0; t < e.length; t++)
        if (e[t] == null)
            throw new D(4008,!1)
}
function tb(e) {
    return !(e instanceof $r) && !(e instanceof Br)
}
var nb = new w("");
function Kh(e, ...t) {
    return _n([{
        provide: Dc,
        multi: !0,
        useValue: e
    }, [], {
        provide: $n,
        useFactory: rb,
        deps: [Qh]
    }, {
        provide: bo,
        multi: !0,
        useFactory: ib
    }, t.map(n => n.\u0275providers)])
}
function rb(e) {
    return e.routerState.root
}
function ib() {
    let e = g(Wt);
    return t => {
        let n = e.get(On);
        if (t !== n.components[0])
            return;
        let r = e.get(Qh)
          , i = e.get(ob);
        e.get(sb) === 1 && r.initialNavigation(),
        e.get(ab, null, F.Optional)?.setUpPreloading(),
        e.get(nb, null, F.Optional)?.init(),
        r.resetRootComponentType(n.componentTypes[0]),
        i.closed || (i.next(),
        i.complete(),
        i.unsubscribe())
    }
}
var ob = new w("",{
    factory: () => new de
})
  , sb = new w("",{
    providedIn: "root",
    factory: () => 1
});
var ab = new w("");
var Jh = [];
var Xh = {
    providers: [Kh(Jh), ah()]
};
var ep = ( () => {
    let t = class t {
        constructor(r) {
            this.http = r,
            this.apiUrl = "https://freeapi.gerasim.in/api/JWT/"
        }
        getAllTaskList() {
            return this.http.get(this.apiUrl + "GetAllTaskList")
        }
        addNewtask(r) {
            return this.http.post(this.apiUrl + "CreateNewTask", r)
        }
        updateTask(r) {
            return this.http.put(this.apiUrl + "UpdateTask", r)
        }
        deleteTask(r) {
            return this.http.delete(this.apiUrl + "DeleteTask?itemId=" + r)
        }
    }
    ;
    t.\u0275fac = function(i) {
        return new (i || t)(I(_u))
    }
    ,
    t.\u0275prov = E({
        token: t,
        factory: t.\u0275fac,
        providedIn: "root"
    });
    let e = t;
    return e
}
)();
var zn = class {
    constructor() {
        this.itemId = 0,
        this.taskDescription = "",
        this.completedOn = new Date,
        this.createdOn = new Date,
        this.isCompleted = !1,
        this.tags = "",
        this.taskName = "",
        this.dueDate = new Date
    }
}
;
var up = ( () => {
    let t = class t {
        constructor(r, i) {
            this._renderer = r,
            this._elementRef = i,
            this.onChange = o => {}
            ,
            this.onTouched = () => {}
        }
        setProperty(r, i) {
            this._renderer.setProperty(this._elementRef.nativeElement, r, i)
        }
        registerOnTouched(r) {
            this.onTouched = r
        }
        registerOnChange(r) {
            this.onChange = r
        }
        setDisabledState(r) {
            this.setProperty("disabled", r)
        }
    }
    ;
    t.\u0275fac = function(i) {
        return new (i || t)(Y(Sn),Y(qt))
    }
    ,
    t.\u0275dir = st({
        type: t
    });
    let e = t;
    return e
}
)()
  , ub = ( () => {
    let t = class t extends up {
    }
    ;
    t.\u0275fac = ( () => {
        let r;
        return function(o) {
            return (r || (r = vr(t)))(o || t)
        }
    }
    )(),
    t.\u0275dir = st({
        type: t,
        features: [xn]
    });
    let e = t;
    return e
}
)()
  , cp = new w("NgValueAccessor");
var cb = {
    provide: cp,
    useExisting: hr( () => ls),
    multi: !0
};
function lb() {
    let e = ft() ? ft().getUserAgent() : "";
    return /android (\d+)/.test(e.toLowerCase())
}
var db = new w("CompositionEventMode")
  , ls = ( () => {
    let t = class t extends up {
        constructor(r, i, o) {
            super(r, i),
            this._compositionMode = o,
            this._composing = !1,
            this._compositionMode == null && (this._compositionMode = !lb())
        }
        writeValue(r) {
            let i = r ?? "";
            this.setProperty("value", i)
        }
        _handleInput(r) {
            (!this._compositionMode || this._compositionMode && !this._composing) && this.onChange(r)
        }
        _compositionStart() {
            this._composing = !0
        }
        _compositionEnd(r) {
            this._composing = !1,
            this._compositionMode && this.onChange(r)
        }
    }
    ;
    t.\u0275fac = function(i) {
        return new (i || t)(Y(Sn),Y(qt),Y(db, 8))
    }
    ,
    t.\u0275dir = st({
        type: t,
        selectors: [["input", "formControlName", "", 3, "type", "checkbox"], ["textarea", "formControlName", ""], ["input", "formControl", "", 3, "type", "checkbox"], ["textarea", "formControl", ""], ["input", "ngModel", "", 3, "type", "checkbox"], ["textarea", "ngModel", ""], ["", "ngDefaultControl", ""]],
        hostBindings: function(i, o) {
            i & 1 && _e("input", function(a) {
                return o._handleInput(a.target.value)
            })("blur", function() {
                return o.onTouched()
            })("compositionstart", function() {
                return o._compositionStart()
            })("compositionend", function(a) {
                return o._compositionEnd(a.target.value)
            })
        },
        features: [pu([cb]), xn]
    });
    let e = t;
    return e
}
)();
var fb = new w("NgValidators")
  , hb = new w("NgAsyncValidators");
function lp(e) {
    return e != null
}
function dp(e) {
    return Yt(e) ? W(e) : e
}
function fp(e) {
    let t = {};
    return e.forEach(n => {
        t = n != null ? v(v({}, t), n) : t
    }
    ),
    Object.keys(t).length === 0 ? null : t
}
function hp(e, t) {
    return t.map(n => n(e))
}
function pb(e) {
    return !e.validate
}
function pp(e) {
    return e.map(t => pb(t) ? t : n => t.validate(n))
}
function gb(e) {
    if (!e)
        return null;
    let t = e.filter(lp);
    return t.length == 0 ? null : function(n) {
        return fp(hp(n, t))
    }
}
function gp(e) {
    return e != null ? gb(pp(e)) : null
}
function mb(e) {
    if (!e)
        return null;
    let t = e.filter(lp);
    return t.length == 0 ? null : function(n) {
        let r = hp(n, t).map(dp);
        return Ts(r).pipe(x(fp))
    }
}
function mp(e) {
    return e != null ? mb(pp(e)) : null
}
function tp(e, t) {
    return e === null ? [t] : Array.isArray(e) ? [...e, t] : [e, t]
}
function vb(e) {
    return e._rawValidators
}
function yb(e) {
    return e._rawAsyncValidators
}
function Cc(e) {
    return e ? Array.isArray(e) ? e : [e] : []
}
function us(e, t) {
    return Array.isArray(e) ? e.includes(t) : e === t
}
function np(e, t) {
    let n = Cc(t);
    return Cc(e).forEach(i => {
        us(n, i) || n.push(i)
    }
    ),
    n
}
function rp(e, t) {
    return Cc(t).filter(n => !us(e, n))
}
var cs = class {
    constructor() {
        this._rawValidators = [],
        this._rawAsyncValidators = [],
        this._onDestroyCallbacks = []
    }
    get value() {
        return this.control ? this.control.value : null
    }
    get valid() {
        return this.control ? this.control.valid : null
    }
    get invalid() {
        return this.control ? this.control.invalid : null
    }
    get pending() {
        return this.control ? this.control.pending : null
    }
    get disabled() {
        return this.control ? this.control.disabled : null
    }
    get enabled() {
        return this.control ? this.control.enabled : null
    }
    get errors() {
        return this.control ? this.control.errors : null
    }
    get pristine() {
        return this.control ? this.control.pristine : null
    }
    get dirty() {
        return this.control ? this.control.dirty : null
    }
    get touched() {
        return this.control ? this.control.touched : null
    }
    get status() {
        return this.control ? this.control.status : null
    }
    get untouched() {
        return this.control ? this.control.untouched : null
    }
    get statusChanges() {
        return this.control ? this.control.statusChanges : null
    }
    get valueChanges() {
        return this.control ? this.control.valueChanges : null
    }
    get path() {
        return null
    }
    _setValidators(t) {
        this._rawValidators = t || [],
        this._composedValidatorFn = gp(this._rawValidators)
    }
    _setAsyncValidators(t) {
        this._rawAsyncValidators = t || [],
        this._composedAsyncValidatorFn = mp(this._rawAsyncValidators)
    }
    get validator() {
        return this._composedValidatorFn || null
    }
    get asyncValidator() {
        return this._composedAsyncValidatorFn || null
    }
    _registerOnDestroy(t) {
        this._onDestroyCallbacks.push(t)
    }
    _invokeOnDestroyCallbacks() {
        this._onDestroyCallbacks.forEach(t => t()),
        this._onDestroyCallbacks = []
    }
    reset(t=void 0) {
        this.control && this.control.reset(t)
    }
    hasError(t, n) {
        return this.control ? this.control.hasError(t, n) : !1
    }
    getError(t, n) {
        return this.control ? this.control.getError(t, n) : null
    }
}
  , Ec = class extends cs {
    get formDirective() {
        return null
    }
    get path() {
        return null
    }
}
  , Kr = class extends cs {
    constructor() {
        super(...arguments),
        this._parent = null,
        this.name = null,
        this.valueAccessor = null
    }
}
  , bc = class {
    constructor(t) {
        this._cd = t
    }
    get isTouched() {
        return !!this._cd?.control?.touched
    }
    get isUntouched() {
        return !!this._cd?.control?.untouched
    }
    get isPristine() {
        return !!this._cd?.control?.pristine
    }
    get isDirty() {
        return !!this._cd?.control?.dirty
    }
    get isValid() {
        return !!this._cd?.control?.valid
    }
    get isInvalid() {
        return !!this._cd?.control?.invalid
    }
    get isPending() {
        return !!this._cd?.control?.pending
    }
    get isSubmitted() {
        return !!this._cd?.submitted
    }
}
  , Db = {
    "[class.ng-untouched]": "isUntouched",
    "[class.ng-touched]": "isTouched",
    "[class.ng-pristine]": "isPristine",
    "[class.ng-dirty]": "isDirty",
    "[class.ng-valid]": "isValid",
    "[class.ng-invalid]": "isInvalid",
    "[class.ng-pending]": "isPending"
}
  , dN = H(v({}, Db), {
    "[class.ng-submitted]": "isSubmitted"
})
  , vp = ( () => {
    let t = class t extends bc {
        constructor(r) {
            super(r)
        }
    }
    ;
    t.\u0275fac = function(i) {
        return new (i || t)(Y(Kr, 2))
    }
    ,
    t.\u0275dir = st({
        type: t,
        selectors: [["", "formControlName", ""], ["", "ngModel", ""], ["", "formControl", ""]],
        hostVars: 14,
        hostBindings: function(i, o) {
            i & 2 && fu("ng-untouched", o.isUntouched)("ng-touched", o.isTouched)("ng-pristine", o.isPristine)("ng-dirty", o.isDirty)("ng-valid", o.isValid)("ng-invalid", o.isInvalid)("ng-pending", o.isPending)
        },
        features: [xn]
    });
    let e = t;
    return e
}
)();
var Yr = "VALID"
  , as = "INVALID"
  , Gn = "PENDING"
  , Qr = "DISABLED";
function wb(e) {
    return (ds(e) ? e.validators : e) || null
}
function Cb(e) {
    return Array.isArray(e) ? gp(e) : e || null
}
function Eb(e, t) {
    return (ds(t) ? t.asyncValidators : e) || null
}
function bb(e) {
    return Array.isArray(e) ? mp(e) : e || null
}
function ds(e) {
    return e != null && !Array.isArray(e) && typeof e == "object"
}
var Ic = class {
    constructor(t, n) {
        this._pendingDirty = !1,
        this._hasOwnPendingAsyncValidator = !1,
        this._pendingTouched = !1,
        this._onCollectionChange = () => {}
        ,
        this._parent = null,
        this.pristine = !0,
        this.touched = !1,
        this._onDisabledChange = [],
        this._assignValidators(t),
        this._assignAsyncValidators(n)
    }
    get validator() {
        return this._composedValidatorFn
    }
    set validator(t) {
        this._rawValidators = this._composedValidatorFn = t
    }
    get asyncValidator() {
        return this._composedAsyncValidatorFn
    }
    set asyncValidator(t) {
        this._rawAsyncValidators = this._composedAsyncValidatorFn = t
    }
    get parent() {
        return this._parent
    }
    get valid() {
        return this.status === Yr
    }
    get invalid() {
        return this.status === as
    }
    get pending() {
        return this.status == Gn
    }
    get disabled() {
        return this.status === Qr
    }
    get enabled() {
        return this.status !== Qr
    }
    get dirty() {
        return !this.pristine
    }
    get untouched() {
        return !this.touched
    }
    get updateOn() {
        return this._updateOn ? this._updateOn : this.parent ? this.parent.updateOn : "change"
    }
    setValidators(t) {
        this._assignValidators(t)
    }
    setAsyncValidators(t) {
        this._assignAsyncValidators(t)
    }
    addValidators(t) {
        this.setValidators(np(t, this._rawValidators))
    }
    addAsyncValidators(t) {
        this.setAsyncValidators(np(t, this._rawAsyncValidators))
    }
    removeValidators(t) {
        this.setValidators(rp(t, this._rawValidators))
    }
    removeAsyncValidators(t) {
        this.setAsyncValidators(rp(t, this._rawAsyncValidators))
    }
    hasValidator(t) {
        return us(this._rawValidators, t)
    }
    hasAsyncValidator(t) {
        return us(this._rawAsyncValidators, t)
    }
    clearValidators() {
        this.validator = null
    }
    clearAsyncValidators() {
        this.asyncValidator = null
    }
    markAsTouched(t={}) {
        this.touched = !0,
        this._parent && !t.onlySelf && this._parent.markAsTouched(t)
    }
    markAllAsTouched() {
        this.markAsTouched({
            onlySelf: !0
        }),
        this._forEachChild(t => t.markAllAsTouched())
    }
    markAsUntouched(t={}) {
        this.touched = !1,
        this._pendingTouched = !1,
        this._forEachChild(n => {
            n.markAsUntouched({
                onlySelf: !0
            })
        }
        ),
        this._parent && !t.onlySelf && this._parent._updateTouched(t)
    }
    markAsDirty(t={}) {
        this.pristine = !1,
        this._parent && !t.onlySelf && this._parent.markAsDirty(t)
    }
    markAsPristine(t={}) {
        this.pristine = !0,
        this._pendingDirty = !1,
        this._forEachChild(n => {
            n.markAsPristine({
                onlySelf: !0
            })
        }
        ),
        this._parent && !t.onlySelf && this._parent._updatePristine(t)
    }
    markAsPending(t={}) {
        this.status = Gn,
        t.emitEvent !== !1 && this.statusChanges.emit(this.status),
        this._parent && !t.onlySelf && this._parent.markAsPending(t)
    }
    disable(t={}) {
        let n = this._parentMarkedDirty(t.onlySelf);
        this.status = Qr,
        this.errors = null,
        this._forEachChild(r => {
            r.disable(H(v({}, t), {
                onlySelf: !0
            }))
        }
        ),
        this._updateValue(),
        t.emitEvent !== !1 && (this.valueChanges.emit(this.value),
        this.statusChanges.emit(this.status)),
        this._updateAncestors(H(v({}, t), {
            skipPristineCheck: n
        })),
        this._onDisabledChange.forEach(r => r(!0))
    }
    enable(t={}) {
        let n = this._parentMarkedDirty(t.onlySelf);
        this.status = Yr,
        this._forEachChild(r => {
            r.enable(H(v({}, t), {
                onlySelf: !0
            }))
        }
        ),
        this.updateValueAndValidity({
            onlySelf: !0,
            emitEvent: t.emitEvent
        }),
        this._updateAncestors(H(v({}, t), {
            skipPristineCheck: n
        })),
        this._onDisabledChange.forEach(r => r(!1))
    }
    _updateAncestors(t) {
        this._parent && !t.onlySelf && (this._parent.updateValueAndValidity(t),
        t.skipPristineCheck || this._parent._updatePristine(),
        this._parent._updateTouched())
    }
    setParent(t) {
        this._parent = t
    }
    getRawValue() {
        return this.value
    }
    updateValueAndValidity(t={}) {
        this._setInitialStatus(),
        this._updateValue(),
        this.enabled && (this._cancelExistingSubscription(),
        this.errors = this._runValidator(),
        this.status = this._calculateStatus(),
        (this.status === Yr || this.status === Gn) && this._runAsyncValidator(t.emitEvent)),
        t.emitEvent !== !1 && (this.valueChanges.emit(this.value),
        this.statusChanges.emit(this.status)),
        this._parent && !t.onlySelf && this._parent.updateValueAndValidity(t)
    }
    _updateTreeValidity(t={
        emitEvent: !0
    }) {
        this._forEachChild(n => n._updateTreeValidity(t)),
        this.updateValueAndValidity({
            onlySelf: !0,
            emitEvent: t.emitEvent
        })
    }
    _setInitialStatus() {
        this.status = this._allControlsDisabled() ? Qr : Yr
    }
    _runValidator() {
        return this.validator ? this.validator(this) : null
    }
    _runAsyncValidator(t) {
        if (this.asyncValidator) {
            this.status = Gn,
            this._hasOwnPendingAsyncValidator = !0;
            let n = dp(this.asyncValidator(this));
            this._asyncValidationSubscription = n.subscribe(r => {
                this._hasOwnPendingAsyncValidator = !1,
                this.setErrors(r, {
                    emitEvent: t
                })
            }
            )
        }
    }
    _cancelExistingSubscription() {
        this._asyncValidationSubscription && (this._asyncValidationSubscription.unsubscribe(),
        this._hasOwnPendingAsyncValidator = !1)
    }
    setErrors(t, n={}) {
        this.errors = t,
        this._updateControlsErrors(n.emitEvent !== !1)
    }
    get(t) {
        let n = t;
        return n == null || (Array.isArray(n) || (n = n.split(".")),
        n.length === 0) ? null : n.reduce( (r, i) => r && r._find(i), this)
    }
    getError(t, n) {
        let r = n ? this.get(n) : this;
        return r && r.errors ? r.errors[t] : null
    }
    hasError(t, n) {
        return !!this.getError(t, n)
    }
    get root() {
        let t = this;
        for (; t._parent; )
            t = t._parent;
        return t
    }
    _updateControlsErrors(t) {
        this.status = this._calculateStatus(),
        t && this.statusChanges.emit(this.status),
        this._parent && this._parent._updateControlsErrors(t)
    }
    _initObservables() {
        this.valueChanges = new pe,
        this.statusChanges = new pe
    }
    _calculateStatus() {
        return this._allControlsDisabled() ? Qr : this.errors ? as : this._hasOwnPendingAsyncValidator || this._anyControlsHaveStatus(Gn) ? Gn : this._anyControlsHaveStatus(as) ? as : Yr
    }
    _anyControlsHaveStatus(t) {
        return this._anyControls(n => n.status === t)
    }
    _anyControlsDirty() {
        return this._anyControls(t => t.dirty)
    }
    _anyControlsTouched() {
        return this._anyControls(t => t.touched)
    }
    _updatePristine(t={}) {
        this.pristine = !this._anyControlsDirty(),
        this._parent && !t.onlySelf && this._parent._updatePristine(t)
    }
    _updateTouched(t={}) {
        this.touched = this._anyControlsTouched(),
        this._parent && !t.onlySelf && this._parent._updateTouched(t)
    }
    _registerOnCollectionChange(t) {
        this._onCollectionChange = t
    }
    _setUpdateStrategy(t) {
        ds(t) && t.updateOn != null && (this._updateOn = t.updateOn)
    }
    _parentMarkedDirty(t) {
        let n = this._parent && this._parent.dirty;
        return !t && !!n && !this._parent._anyControlsDirty()
    }
    _find(t) {
        return null
    }
    _assignValidators(t) {
        this._rawValidators = Array.isArray(t) ? t.slice() : t,
        this._composedValidatorFn = Cb(this._rawValidators)
    }
    _assignAsyncValidators(t) {
        this._rawAsyncValidators = Array.isArray(t) ? t.slice() : t,
        this._composedAsyncValidatorFn = bb(this._rawAsyncValidators)
    }
}
;
var yp = new w("CallSetDisabledState",{
    providedIn: "root",
    factory: () => Mc
})
  , Mc = "always";
function Ib(e, t) {
    return [...t.path, e]
}
function Mb(e, t, n=Mc) {
    Sb(e, t),
    t.valueAccessor.writeValue(e.value),
    (e.disabled || n === "always") && t.valueAccessor.setDisabledState?.(e.disabled),
    Tb(e, t),
    Ab(e, t),
    xb(e, t),
    _b(e, t)
}
function ip(e, t) {
    e.forEach(n => {
        n.registerOnValidatorChange && n.registerOnValidatorChange(t)
    }
    )
}
function _b(e, t) {
    if (t.valueAccessor.setDisabledState) {
        let n = r => {
            t.valueAccessor.setDisabledState(r)
        }
        ;
        e.registerOnDisabledChange(n),
        t._registerOnDestroy( () => {
            e._unregisterOnDisabledChange(n)
        }
        )
    }
}
function Sb(e, t) {
    let n = vb(e);
    t.validator !== null ? e.setValidators(tp(n, t.validator)) : typeof n == "function" && e.setValidators([n]);
    let r = yb(e);
    t.asyncValidator !== null ? e.setAsyncValidators(tp(r, t.asyncValidator)) : typeof r == "function" && e.setAsyncValidators([r]);
    let i = () => e.updateValueAndValidity();
    ip(t._rawValidators, i),
    ip(t._rawAsyncValidators, i)
}
function Tb(e, t) {
    t.valueAccessor.registerOnChange(n => {
        e._pendingValue = n,
        e._pendingChange = !0,
        e._pendingDirty = !0,
        e.updateOn === "change" && Dp(e, t)
    }
    )
}
function xb(e, t) {
    t.valueAccessor.registerOnTouched( () => {
        e._pendingTouched = !0,
        e.updateOn === "blur" && e._pendingChange && Dp(e, t),
        e.updateOn !== "submit" && e.markAsTouched()
    }
    )
}
function Dp(e, t) {
    e._pendingDirty && e.markAsDirty(),
    e.setValue(e._pendingValue, {
        emitModelToViewChange: !1
    }),
    t.viewToModelUpdate(e._pendingValue),
    e._pendingChange = !1
}
function Ab(e, t) {
    let n = (r, i) => {
        t.valueAccessor.writeValue(r),
        i && t.viewToModelUpdate(r)
    }
    ;
    e.registerOnChange(n),
    t._registerOnDestroy( () => {
        e._unregisterOnChange(n)
    }
    )
}
function Nb(e, t) {
    if (!e.hasOwnProperty("model"))
        return !1;
    let n = e.model;
    return n.isFirstChange() ? !0 : !Object.is(t, n.currentValue)
}
function Ob(e) {
    return Object.getPrototypeOf(e.constructor) === ub
}
function Rb(e, t) {
    if (!t)
        return null;
    Array.isArray(t);
    let n, r, i;
    return t.forEach(o => {
        o.constructor === ls ? n = o : Ob(o) ? r = o : i = o
    }
    ),
    i || r || n || null
}
function op(e, t) {
    let n = e.indexOf(t);
    n > -1 && e.splice(n, 1)
}
function sp(e) {
    return typeof e == "object" && e !== null && Object.keys(e).length === 2 && "value"in e && "disabled"in e
}
var Fb = class extends Ic {
    constructor(t=null, n, r) {
        super(wb(n), Eb(r, n)),
        this.defaultValue = null,
        this._onChange = [],
        this._pendingChange = !1,
        this._applyFormState(t),
        this._setUpdateStrategy(n),
        this._initObservables(),
        this.updateValueAndValidity({
            onlySelf: !0,
            emitEvent: !!this.asyncValidator
        }),
        ds(n) && (n.nonNullable || n.initialValueIsDefault) && (sp(t) ? this.defaultValue = t.value : this.defaultValue = t)
    }
    setValue(t, n={}) {
        this.value = this._pendingValue = t,
        this._onChange.length && n.emitModelToViewChange !== !1 && this._onChange.forEach(r => r(this.value, n.emitViewToModelChange !== !1)),
        this.updateValueAndValidity(n)
    }
    patchValue(t, n={}) {
        this.setValue(t, n)
    }
    reset(t=this.defaultValue, n={}) {
        this._applyFormState(t),
        this.markAsPristine(n),
        this.markAsUntouched(n),
        this.setValue(this.value, n),
        this._pendingChange = !1
    }
    _updateValue() {}
    _anyControls(t) {
        return !1
    }
    _allControlsDisabled() {
        return this.disabled
    }
    registerOnChange(t) {
        this._onChange.push(t)
    }
    _unregisterOnChange(t) {
        op(this._onChange, t)
    }
    registerOnDisabledChange(t) {
        this._onDisabledChange.push(t)
    }
    _unregisterOnDisabledChange(t) {
        op(this._onDisabledChange, t)
    }
    _forEachChild(t) {}
    _syncPendingControls() {
        return this.updateOn === "submit" && (this._pendingDirty && this.markAsDirty(),
        this._pendingTouched && this.markAsTouched(),
        this._pendingChange) ? (this.setValue(this._pendingValue, {
            onlySelf: !0,
            emitModelToViewChange: !1
        }),
        !0) : !1
    }
    _applyFormState(t) {
        sp(t) ? (this.value = this._pendingValue = t.value,
        t.disabled ? this.disable({
            onlySelf: !0,
            emitEvent: !1
        }) : this.enable({
            onlySelf: !0,
            emitEvent: !1
        })) : this.value = this._pendingValue = t
    }
}
;
var Pb = {
    provide: Kr,
    useExisting: hr( () => _c)
}
  , ap = Promise.resolve()
  , _c = ( () => {
    let t = class t extends Kr {
        constructor(r, i, o, s, a, u) {
            super(),
            this._changeDetectorRef = a,
            this.callSetDisabledState = u,
            this.control = new Fb,
            this._registered = !1,
            this.name = "",
            this.update = new pe,
            this._parent = r,
            this._setValidators(i),
            this._setAsyncValidators(o),
            this.valueAccessor = Rb(this, s)
        }
        ngOnChanges(r) {
            if (this._checkForErrors(),
            !this._registered || "name"in r) {
                if (this._registered && (this._checkName(),
                this.formDirective)) {
                    let i = r.name.previousValue;
                    this.formDirective.removeControl({
                        name: i,
                        path: this._getPath(i)
                    })
                }
                this._setUpControl()
            }
            "isDisabled"in r && this._updateDisabled(r),
            Nb(r, this.viewModel) && (this._updateValue(this.model),
            this.viewModel = this.model)
        }
        ngOnDestroy() {
            this.formDirective && this.formDirective.removeControl(this)
        }
        get path() {
            return this._getPath(this.name)
        }
        get formDirective() {
            return this._parent ? this._parent.formDirective : null
        }
        viewToModelUpdate(r) {
            this.viewModel = r,
            this.update.emit(r)
        }
        _setUpControl() {
            this._setUpdateStrategy(),
            this._isStandalone() ? this._setUpStandalone() : this.formDirective.addControl(this),
            this._registered = !0
        }
        _setUpdateStrategy() {
            this.options && this.options.updateOn != null && (this.control._updateOn = this.options.updateOn)
        }
        _isStandalone() {
            return !this._parent || !!(this.options && this.options.standalone)
        }
        _setUpStandalone() {
            Mb(this.control, this, this.callSetDisabledState),
            this.control.updateValueAndValidity({
                emitEvent: !1
            })
        }
        _checkForErrors() {
            this._isStandalone() || this._checkParentType(),
            this._checkName()
        }
        _checkParentType() {}
        _checkName() {
            this.options && this.options.name && (this.name = this.options.name),
            !this._isStandalone() && this.name
        }
        _updateValue(r) {
            ap.then( () => {
                this.control.setValue(r, {
                    emitViewToModelChange: !1
                }),
                this._changeDetectorRef?.markForCheck()
            }
            )
        }
        _updateDisabled(r) {
            let i = r.isDisabled.currentValue
              , o = i !== 0 && Io(i);
            ap.then( () => {
                o && !this.control.disabled ? this.control.disable() : !o && this.control.disabled && this.control.enable(),
                this._changeDetectorRef?.markForCheck()
            }
            )
        }
        _getPath(r) {
            return this._parent ? Ib(r, this._parent) : [r]
        }
    }
    ;
    t.\u0275fac = function(i) {
        return new (i || t)(Y(Ec, 9),Y(fb, 10),Y(hb, 10),Y(cp, 10),Y(Tn, 8),Y(yp, 8))
    }
    ,
    t.\u0275dir = st({
        type: t,
        selectors: [["", "ngModel", "", 3, "formControlName", "", 3, "formControl", ""]],
        inputs: {
            name: "name",
            isDisabled: ["disabled", "isDisabled"],
            model: ["ngModel", "model"],
            options: ["ngModelOptions", "options"]
        },
        outputs: {
            update: "ngModelChange"
        },
        exportAs: ["ngModel"],
        features: [pu([Pb]), xn, Mn]
    });
    let e = t;
    return e
}
)();
var kb = ( () => {
    let t = class t {
    }
    ;
    t.\u0275fac = function(i) {
        return new (i || t)
    }
    ,
    t.\u0275mod = Et({
        type: t
    }),
    t.\u0275inj = Ct({});
    let e = t;
    return e
}
)();
var Lb = ( () => {
    let t = class t {
    }
    ;
    t.\u0275fac = function(i) {
        return new (i || t)
    }
    ,
    t.\u0275mod = Et({
        type: t
    }),
    t.\u0275inj = Ct({
        imports: [kb]
    });
    let e = t;
    return e
}
)();
var wp = ( () => {
    let t = class t {
        static withConfig(r) {
            return {
                ngModule: t,
                providers: [{
                    provide: yp,
                    useValue: r.callSetDisabledState ?? Mc
                }]
            }
        }
    }
    ;
    t.\u0275fac = function(i) {
        return new (i || t)
    }
    ,
    t.\u0275mod = Et({
        type: t
    }),
    t.\u0275inj = Ct({
        imports: [Lb]
    });
    let e = t;
    return e
}
)();
var jb = (e, t) => "itemId";
function Ub(e, t) {
    if (e & 1) {
        let n = vo();
        A(0, "button", 24),
        _e("click", function() {
            pr(n);
            let i = Er();
            return gr(i.addTask())
        }),
        U(1, "Add Task"),
        N()
    }
}
function $b(e, t) {
    if (e & 1) {
        let n = vo();
        A(0, "button", 25),
        _e("click", function() {
            pr(n);
            let i = Er();
            return gr(i.updateTask())
        }),
        U(1, "Update"),
        N()
    }
}
function Bb(e, t) {
    if (e & 1) {
        let n = vo();
        A(0, "tr")(1, "td", 26),
        U(2),
        N(),
        A(3, "td")(4, "div", 2)(5, "div", 27),
        Nn(6, "input", 28),
        N(),
        A(7, "div", 10),
        U(8),
        N(),
        A(9, "div", 29),
        Nn(10, "i", 30),
        N()()(),
        A(11, "td"),
        U(12),
        Rf(13, "date"),
        N(),
        A(14, "td", 23)(15, "button", 31),
        _e("click", function() {
            let o = pr(n).$implicit
              , s = Er();
            return gr(s.onEdit(o))
        }),
        U(16, "Edit"),
        N(),
        A(17, "button", 32),
        _e("click", function() {
            let o = pr(n).$implicit
              , s = Er();
            return gr(s.onDelete(o.itemId))
        }),
        U(18, "Delete"),
        N()()()
    }
    if (e & 2) {
        let n = t.$implicit
          , r = t.$index;
        Ke(2),
        yo(r + 1),
        Ke(6),
        Do(" ", n.taskName, " "),
        Ke(4),
        yo(Ff(13, 3, n.dueDate, "dd-MMM-yyyy"))
    }
}
var Cp = ( () => {
    let t = class t {
        constructor() {
            this.taskObj = new zn,
            this.taskList = [],
            this.masterService = g(ep)
        }
        ngOnInit() {
            this.loadAllTask()
        }
        loadAllTask() {
            this.masterService.getAllTaskList().subscribe(r => {
                this.taskList = r.data
            }
            )
        }
        addTask() {
            this.masterService.addNewtask(this.taskObj).subscribe(r => {
                r.result && (alert("Task Created Success"),
                this.loadAllTask(),
                this.taskObj = new zn)
            }
            , r => {
                alert("API Call Error")
            }
            )
        }
        updateTask() {
            this.masterService.updateTask(this.taskObj).subscribe(r => {
                r.result && (alert("Task Updated Success"),
                this.loadAllTask(),
                this.taskObj = new zn)
            }
            , r => {
                alert("API Call Error")
            }
            )
        }
        onDelete(r) {
            confirm("Are you sure Want to Delete") && this.masterService.deleteTask(r).subscribe(o => {
                o.result && (alert("Task Delete Success"),
                this.loadAllTask())
            }
            , o => {
                alert("API Call Error")
            }
            )
        }
        onEdit(r) {
            this.taskObj = r,
            setTimeout( () => {
                let i = new Date(this.taskObj.dueDate)
                  , o = ("0" + i.getDate()).slice(-2)
                  , s = ("0" + (i.getMonth() + 1)).slice(-2)
                  , a = i.getFullYear() + "-" + s + "-" + o;
                document.getElementById("textDate").value = a
            }
            , 1e3)
        }
    }
    ;
    t.\u0275fac = function(i) {
        return new (i || t)
    }
    ,
    t.\u0275cmp = no({
        type: t,
        selectors: [["app-root"]],
        standalone: !0,
        features: [wo],
        decls: 74,
        vars: 5,
        consts: [[1, "container", "pt-3"], [1, "mt-2", "p-1", "bg-primary", "text-white", "rounded", "text-center"], [1, "row"], [1, "col-6", "pt-2"], ["type", "text", "placeholder", "Task Name", 1, "form-control", 3, "ngModel", "ngModelChange"], [1, "col-12", "pt-2"], ["rows", "3", "placeholder", "Task Description", 1, "form-control", 3, "ngModel", "ngModelChange"], [1, "row", "pt-2"], [1, "col-2"], ["type", "date", "id", "textDate", "placeholder", "Due Date", 1, "form-control", 3, "ngModel", "ngModelChange"], [1, "col-6"], ["type", "text", "placeholder", "Enter Comma Seperated tags", 1, "form-control", 3, "ngModel", "ngModelChange"], [1, "col"], ["class", "btn btn-success"], [1, "row", "pt-4"], [1, "btn", "btn-primary", "btn-sm"], [1, "btn", "btn-secondary", "btn-sm"], [1, "btn", "btn-success", "btn-sm"], [1, "btn", "btn-success", "text-light", "btn-sm"], [1, "btn", "btn-secondary", "btn-sm", "text-light"], [1, "row", "pt-3"], [1, "col-12"], [1, "table", "table-bordered", "table-striped", "table-sm"], [1, "text-center"], [1, "btn", "btn-success", 3, "click"], [1, "btn", "btn-warning", 3, "click"], [2, "text-align", "center"], [1, "col-1"], ["type", "checkbox"], [1, "col-4", "text-end"], [1, "fa", "fa-close", "text-secondary", "px-3", "text-danger"], [1, "btn", "btn-warning", "btn-sm", "rounded-btn", 3, "click"], [1, "btn", "btn-danger", "btn-sm", "rounded-btn", 3, "click"]],
        template: function(i, o) {
            i & 1 && (A(0, "div", 0)(1, "div", 1)(2, "h1"),
            U(3, "ToDo App"),
            N(),
            A(4, "p"),
            U(5, "Advance Version With Filter "),
            N()(),
            A(6, "div", 2)(7, "div", 3)(8, "input", 4),
            _e("ngModelChange", function(a) {
                return o.taskObj.taskName = a
            }),
            N()()(),
            A(9, "div", 2)(10, "div", 5)(11, "textarea", 6),
            _e("ngModelChange", function(a) {
                return o.taskObj.taskDescription = a
            }),
            N()()(),
            A(12, "div", 7)(13, "div", 8)(14, "input", 9),
            _e("ngModelChange", function(a) {
                return o.taskObj.dueDate = a
            }),
            N()(),
            A(15, "div", 10)(16, "input", 11),
            _e("ngModelChange", function(a) {
                return o.taskObj.tags = a
            }),
            N()(),
            A(17, "div", 12),
            dr(18, Ub, 2, 0, "button", 13)(19, $b, 2, 0),
            N()(),
            A(20, "div", 14)(21, "div", 12)(22, "button", 15),
            U(23, "Filter By Tags"),
            N(),
            A(24, "button", 16),
            U(25, "Show All"),
            N(),
            A(26, "button", 16),
            U(27, "Show Completed"),
            N()()(),
            A(28, "div", 14)(29, "div", 12)(30, "button", 16),
            U(31, "Tags Group"),
            N(),
            A(32, "button", 16),
            U(33, "default"),
            N(),
            A(34, "button", 16),
            U(35, "Hobby "),
            N(),
            A(36, "button", 17),
            U(37, "Holiday"),
            N(),
            A(38, "button", 18),
            U(39, "Financial "),
            N(),
            A(40, "button", 16),
            U(41, "Fun "),
            N(),
            A(42, "button", 17),
            U(43, "Emergency "),
            N(),
            A(44, "button", 19),
            U(45, "Health "),
            N(),
            A(46, "button", 16),
            U(47, "Work"),
            N(),
            A(48, "button", 16),
            U(49, "Education"),
            N(),
            A(50, "button", 16),
            U(51, "Social"),
            N(),
            A(52, "button", 16),
            U(53, "Travel"),
            N()()(),
            A(54, "div", 20)(55, "div", 21)(56, "table", 22)(57, "thead")(58, "tr")(59, "th")(60, "strong"),
            U(61, "Index"),
            N()(),
            A(62, "th")(63, "strong"),
            U(64, "Task Name"),
            N()(),
            A(65, "th")(66, "strong"),
            U(67, "Due Date"),
            N()(),
            A(68, "th", 23)(69, "strong"),
            U(70, "Tags"),
            N()()()(),
            A(71, "tbody"),
            xf(72, Bb, 19, 6, "tr", null, jb),
            N()()()()()),
            i & 2 && (Ke(8),
            An("ngModel", o.taskObj.taskName),
            Ke(3),
            An("ngModel", o.taskObj.taskDescription),
            Ke(3),
            An("ngModel", o.taskObj.dueDate),
            Ke(2),
            An("ngModel", o.taskObj.tags),
            Ke(2),
            Tf(18, o.taskObj.itemId == 0 ? 18 : 19),
            Ke(54),
            Af(o.taskList))
        },
        dependencies: [Kf, wp, ls, vp, _c],
        styles: [".form-control[_ngcontent-%COMP%]{border:1px solid black!important}.rounded-btn[_ngcontent-%COMP%]{border-radius:20px}.btn-sm[_ngcontent-%COMP%]{margin-left:5px}"]
    });
    let e = t;
    return e
}
)();
gh(Cp, Xh).catch(e => console.error(e));
