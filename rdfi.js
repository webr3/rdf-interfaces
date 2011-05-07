/**
 * ECMAScript-262 V5 Implementation of the Core RDF Interfaces
 * 
 *  - <http://www.w3.org/2010/02/rdfa/sources/rdf-interfaces/>
 *  - <http://github.org/webr3/rdf-interfaces/>
 *  
 * This is free and unencumbered software released into the public domain.
 * For more information, please refer to <http://unlicense.org/>
 */
rdf = (function() {
  var rdf = {};
  rdf.encodeString = function(s) {
    var out = "", skip = false, _g1 = 0, _g = s.length;
    while(_g1 < _g) {
      var i = _g1++;
      if(!skip) {
        var code = s.charCodeAt(i);
        if(55296 <= code && code <= 56319) {
          var low = s.charCodeAt(i + 1);
          code = (code - 55296) * 1024 + (low - 56320) + 65536;
          skip = true
        }
        if(code > 1114111) { throw new Error("Char out of range"); }
        var hex = "00000000".concat((new Number(code)).toString(16).toUpperCase());
        if(code >= 65536) {
          out += "\\U" + hex.slice(-8)
        } else {
          if(code >= 127 || code <= 31) {
            switch(code) {
              case 9:  out += "\\t"; break;
              case 10: out += "\\n"; break;
              case 13: out += "\\r"; break;
              default: out += "\\u" + hex.slice(-4); break
            }
          } else {
            switch(code) {
              case 34: out += '\\"'; break;
              case 92: out += "\\\\"; break;
              default: out += s.charAt(i); break
            }
          }
        }
      } else {
        skip = !skip
      }
    }
    return out
  };
  
  rdf.BlankNode = function() {
    return Object.defineProperties( {}, {
      interfaceName: { writable: false, configurable : false, enumerable: true, value: 'BlankNode' },
      nominalValue: { writable: false, configurable : false, enumerable: true, value: 'b'.concat(++rdf.BlankNode.NEXTID) },
      valueOf: { writable: false, configurable : false, enumerable: true, value: function() {
        return this.nominalValue;
      }},
      equals: { writable: true, configurable : false, enumerable: true, value: function(o) {
        if(!o.hasOwnProperty('interfaceName')) return this.nominalValue == o;
        return (o.interfaceName == this.interfaceName) ? this.nominalValue == o.nominalValue : false;
      }},
      toString: { writable: false, configurable : false, enumerable: true, value: function() {
        return '_:'.concat(this.nominalValue);
      }},
      toNT: { writable: false, configurable : false, enumerable: true, value: function() {
        return rdf.encodeString(this.toString());
      }},
      h: { configurable : false, enumerable: false, get: function(){return this.nominalValue} },
    })
  };
  rdf.BlankNode.NEXTID = 0;
  
  rdf.NamedNode = function(iri) {
    return Object.defineProperties( {}, {
      interfaceName: { writable: false, configurable : false, enumerable: true, value: 'NamedNode' },
      value: { writable: false, configurable : false, enumerable: true, value: iri },
      valueOf: { writable: false, configurable : false, enumerable: true, value: function() {
        return this.nominalValue;
      }},
      equals: { writable: true, configurable : false, enumerable: true, value: function(o) {
        if(!o.hasOwnProperty('interfaceName')) return this.nominalValue == o;
        return (o.interfaceName == this.interfaceName) ? this.nominalValue == o.nominalValue : false;
      }},
      toString: { writable: false, configurable : false, enumerable: true, value: function() {
        return this.nominalValue.toString();
      }},
      toNT: { writable: false, configurable : false, enumerable: true, value: function() {
        return '<' + rdf.encodeString(this.toString()) + '>';
      }},
      h: { configurable : false, enumerable: false, get: function(){return this.nominalValue} }
    })
  };
  
  rdf.Literal = function(value, language, datatype, nativ) {
    if(typeof language == "string" && language[0] == "@") language = language.slice(1);
    return Object.defineProperties( {}, {
      interfaceName: { writable: false, configurable : false, enumerable: true, value: 'Literal' },
      value: { writable: false, configurable : false, enumerable: true, value: value },
      valueOf: { writable: false, configurable : false, enumerable: true, value: function() {
        return nativ === null ? this.nominalValue : nativ;
      }},
      language: { writable: false, configurable : false, enumerable: true, value: language },
      datatype: { writable: false, configurable : false, enumerable: true, value: datatype },
      equals: { writable: true, configurable : false, enumerable: true, value: function(o) {
        if(!o.hasOwnProperty('interfaceName')) return this.valueOf() == o;
        if(o.interfaceName != this.interfaceName) return false;
        return this.h == o.h;
      }},
      toString: { writable: false, configurable : false, enumerable: true, value: function() {
        return this.nominalValue.toString();
      }},
      toNT: { writable: false, configurable : false, enumerable: true, value: function() {
        var s = '"' + rdf.encodeString(this.nominalValue) + '"';
        if( Boolean(this.language).valueOf() ) return s.concat('@' + this.language);
        if( Boolean(this.datatype).valueOf() ) return s.concat('^^' + this.datatype.toNT());
        return s;
      }},
      h: { writable: false, configurable : false, enumerable: false, value: language + '|' + (datatype ? datatype.toString() : '') + '|' + value.toString() }
    })
  };
  
  rdf.Triple = function(s,p,o) {
    return Object.defineProperties( {}, {
      subject: { writable: false, configurable : false, enumerable: true, value: s },
      property: { writable: false, configurable : false, enumerable: true, value: p },
      object: { writable: false, configurable : false, enumerable: true, value: o },
      equals: { writable: true, configurable : false, enumerable: true, value: function(t) {
        return this.s.equals(t.s) && this.p.equals(t.p) && this.o.equals(t.o);
      }},
      toString: { writable: false, configurable : false, enumerable: true, value: function() {
        return this.s.toNT() + " " + this.p.toNT() + " " + this.o.toNT() + " .";
      }},
      s: { configurable : false, enumerable: false, get: function() { return this.subject } },
      p: { configurable : false, enumerable: false, get: function() { return this.property } },
      o: { configurable : false, enumerable: false, get: function() { return this.object } }
    })
  };
  
  rdf.Graph = function(a) {
    return Object.defineProperties( {}, {
      _graph: { writable: true, configurable : false, enumerable: false, value: [] },
      _spo: { writable: true, configurable : false, enumerable: false, value: {} },
      length: { configurable : false, enumerable: true, get: function() {
        return this._graph.length;
      }},
      add: { writable: false, configurable : false, enumerable: true, value: function(t) {
        this._spo[t.s.h] || (this._spo[t.s.h] = {});
        this._spo[t.s.h][t.p.h] || (this._spo[t.s.h][t.p.h] = {});
        if(!this._spo[t.s.h][t.p.h][t.o.h]) {
          this._spo[t.s.h][t.p.h][t.o.h] = t;
          this._graph.push(t);
          this.actions.forEach(function(a){a.run(t)});
        }
        return this;
      }},
      addArray: { writable: false, configurable : false, enumerable: false, value: function(a) {
        if(Array.isArray(a)) var g = this, b = a.forEach( function(t) { g.add(t) });
        return this;
      }},
      remove: { writable: false, configurable : false, enumerable: true, value: function(t) {
        this._spo[t.s.h] && this._spo[t.s.h][t.p.h] && this._spo[t.s.h][t.p.h][t.o.h] && (
          delete this._spo[t.s.h][t.p.h][t.o.h] &&
          this._graph.splice(this._graph.indexOf(t),1)  
        );
        return this;
      }},
      removeMatches: { writable: false, configurable : false, enumerable: true, value: function(s,p,o) {
        s = arguments[0] === undefined ? null : s;
        p = arguments[1] === undefined ? null : p;
        o = arguments[2] === undefined ? null : o;
        var r = [];
        this.forEach(function(t,g) {
          (s===null||t.s.equals(s)) && (p===null||t.p.equals(p)) && (o===null||t.o.equals(o)) && r.push(t);
        });
        for(i in r) this.remove(r[i]);
        return this;
      }},
      toArray: { writable: false, configurable : false, enumerable: true, value: function() {
        return this._graph.slice(0);
      }},
      some: { writable: false, configurable : false, enumerable: true, value: function(cb) {
        return this._graph.some(cb);
      }},
      every: { writable: false, configurable : false, enumerable: true, value: function(cb) {
        return this._graph.every(cb);
      }},
      filter: { writable: false, configurable : false, enumerable: true, value: function(cb) {
        return new rdf.Graph(this._graph.filter(cb));
      }},
      forEach: { writable: false, configurable : false, enumerable: true, value: function(cb) {
        var g = this; this._graph.forEach(function(t) { cb(t,g) });
      }},
      match: { writable: false, configurable : false, enumerable: true, value: function(s,p,o,l) {
        s = arguments[0] === undefined ? null : s;
        p = arguments[1] === undefined ? null : p;
        o = arguments[2] === undefined ? null : o;
        l = arguments[3] === undefined ? null : l;
        var c = 0;
        if(l<1) l=-1;
        return new rdf.Graph(this._graph.filter(function(t) {
          if(c == l) return false;
          return (s===null||t.s.equals(s)) && (p===null||t.p.equals(p)) && (o===null||t.o.equals(o)) && ++c;
        }));
      }},
      merge: { writable: false, configurable : false, enumerable: true, value: function(g) {
        return new rdf.Graph().addAll(this).addAll(g);
      }},
      addAll: { writable: false, configurable : false, enumerable: true, value: function(g) {
        return this.addArray(g.toArray());
      }},
      actions: { writable: false, configurable : false, enumerable: true, value: [] },
      addAction: { writable: false, configurable : false, enumerable: true, value: function(a,r) {
        if(r) this.forEach(function(t,g){a.run(t,g)});
        this.actions.push(a);
        return this;
      }}
    }).addArray(a);
  };
  
  rdf.TripleAction = function(test,action) {
    return Object.defineProperties( {}, {
      action: { writable: true, configurable : false, enumerable: true, value: action },
      test: { writable: true, configurable : false, enumerable: true, value: test },
      run: { writable: false, configurable : false, enumerable: true, value: function(t,g) {
        if(this.test(t)) this.action(t,g);
      }}    
    })
  };
  
  rdf.PrefixMap = function(i) {
    return Object.defineProperties( {} , {
      resolve: { writable: false, configurable : false, enumerable: true, value: function(curie) {
        var index = curie.indexOf(":");
        if(index < 0 || curie.indexOf("//") >= 0)  return null;
        var prefix = curie.slice(0, index).toLowerCase();
        if(!this[prefix]) return null;
        return this[prefix].concat( curie.slice(++index) );
      }},
      shrink: { writable: false, configurable : false, enumerable: true, value: function(iri) {
        for(pref in this)
          if(iri.substr(0,this[pref].length) == this[pref])
            return pref + ':' + iri.slice(this[pref].length);
        return iri;
      }},
      setDefault: { writable: false, configurable : false, enumerable: true, value: function(iri) {
        this[''] = iri;
      }},
      addAll: { writable: false, configurable : false, enumerable: true, value: function(prefixes, override) {
        for(p in prefixes)
          if(!this[p] || override)
            this[p] = prefixes[p];
        return this;
      }}
    }).addAll(i);
  };
  
  rdf.TermMap = function(i) {
    return Object.defineProperties( {} , {
      resolve: { writable: false, configurable : false, enumerable: true, value: function(term) {
        if(this[term]) return this[term]
        if(this[""]) return this[""].concat(term)
        return null;
      }},
      shrink: { writable: false, configurable : false, enumerable: true, value: function(iri) {
        for(t in this)
          if(this[t] == iri) return t;
        return iri;
      }},
      setDefault: { writable: false, configurable : false, enumerable: true, value: function(iri) {
        this[''] = iri;
      }},
      addAll: { writable: false, configurable : false, enumerable: true, value: function(terms, override) {
        for(t in terms)
          if(!this[t] || override)
            this[t] = terms[t];
        return this;
      }}
    }).addAll(i);
  }
  
  rdf.Profile = function(i) {
    return Object.defineProperties( {} , {
      prefixes: { writable: false, configurable : false, enumerable: true, value: new rdf.PrefixMap },
      terms: { writable: false, configurable : false, enumerable: true, value: new rdf.TermMap },
      resolve: { writable: false, configurable : false, enumerable: true, value: function(tp) {
        return tp.indexOf(":") >= 0 ? this.prefixes.resolve(tp) : this.terms.resolve(tp);
      }},
      setDefaultVocabulary: { writable: false, configurable : false, enumerable: true, value: function(iri) {
        this.terms.setDefault(iri);
      }},
      setDefaultPrefix: { writable: false, configurable : false, enumerable: true, value: function(iri) {
        this.prefixes.setDefault(iri);
      }},
      setTerm: { writable: false, configurable : false, enumerable: true, value: function(term, iri) {
        this.terms[term] = iri;
      }},
      setPrefix: { writable: false, configurable : false, enumerable: true, value: function(prefix, iri) {
        this.prefixes[prefix] = iri;
      }},
      importProfile: { writable: false, configurable : false, enumerable: true, value: function(profile, override) {
        if(!profile) return this;
        this.prefixes.addAll(profile.prefixes, override);
        this.terms.addAll(profile.terms, override);
        return this;
      }}
    }).importProfile(i);
  };
  
  rdf.RDFEnvironment = function() {
    var rp = {terms:{},prefixes:{
      owl: "http://www.w3.org/2002/07/owl#",
      rdf: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
      rdfs: "http://www.w3.org/2000/01/rdf-schema#",
      rdfa: "http://www.w3.org/ns/rdfa#",
      xhv: "http://www.w3.org/1999/xhtml/vocab#",
      xml: "http://www.w3.org/XML/1998/namespace",
      xsd: "http://www.w3.org/2001/XMLSchema#",
    }};
    var xsd = {};
    for(v in x=['string','boolean','dateTime','date','time','int','double','float','decimal','integer',
              'nonPositiveInteger','negativeInteger','long','int','short','byte','nonNegativeInteger',
              'unsignedLong','unsignedInt','unsignedShort','unsignedByte','positiveInteger'])
      xsd[x[v]] = rp.prefixes.xsd.concat(x[v]);
    return Object.defineProperties( new rdf.Profile(rp), {
      createBlankNode: { writable: false, configurable : false, enumerable: true, value: function() {
        return new rdf.BlankNode;
      }},
      createNamedNode: { writable: false, configurable : false, enumerable: true, value: function(iri) {
        return new rdf.NamedNode(iri);
      }},
      createLiteral: { writable: false, configurable : false, enumerable: true, value: function(value) {
        var l = null, dt = arguments[2], v = value;
        if(arguments[1]) {
          if(arguments[1].hasOwnProperty('interfaceName')) dt = arguments[1];
          else l = arguments[1];
        }
        if(dt) {
          switch(dt.valueOf()) {
            case xsd.string:
              v = new String(v); break;
            case xsd['boolean']:
              v = (new Boolean(v == "false" ? false : v)).valueOf(); break;
            case xsd['float']:
            case xsd.integer:
            case xsd['long']:
            case xsd['double']:
            case xsd.decimal:
            case xsd.nonPositiveInteger:
            case xsd.nonNegativeInteger:
            case xsd.negativeInteger:
            case xsd['int']:
            case xsd.unsignedLong:
            case xsd.positiveInteger:
            case xsd['short']:
            case xsd.unsignedInt:
            case xsd['byte']:
            case xsd.unsignedShort:
            case xsd.unsignedByte:
              v = (new Number(v)).valueOf(); break;
            case xsd['date']:
            case xsd.time:
            case xsd.dateTime:
              v = new Date(v); break;
          }
        }
        return new rdf.Literal(value,l,dt,v);
      }},
      createTriple: { writable: false, configurable : false, enumerable: true, value: function(s,p,o) {
        return new rdf.Triple(s,p,o);
      }},
      createGraph: { writable: false, configurable : false, enumerable: true, value: function(a) {
        return new rdf.Graph(a);
      }},
      createAction: { writable: false, configurable : false, enumerable: true, value: function(t,a) {
        return new rdf.TripleAction(t,a);
      }},
      createProfile: { writable: false, configurable : false, enumerable: true, value: function(empty) {
        return new rdf.Profile(!empty ? this : null);
      }},
      createTermMap: { writable: false, configurable : false, enumerable: true, value: function(empty) {
        return new rdf.TermMap(!empty ? this.terms : null);
      }},
      createPrefixMap: { writable: false, configurable : false, enumerable: true, value: function(empty) {
        return new rdf.PrefixMap(!empty ? this.prefixes : null);
      }},
    });
  };
  return rdf;
})();
if(module) module.exports = rdf; 