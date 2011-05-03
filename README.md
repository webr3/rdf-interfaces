# Implementation of the Core RDF Interfaces in ECMAScript-262 V5 (Javascript) #

The [RDF Interfaces Specification](http://www.w3.org/2010/02/rdfa/sources/rdf-interfaces/) defines a set of standardized interfaces for working with RDF data in a programming environment.

This is an ECMAScript-262 V5 (Javascript) implementation of those interfaces, by the specification editor.

**Note:** This is a base implementation upon which libraries can be built, and which modular components can use, another library will be provided shortly which extends this implementation and adds in various DataParsers / Serializers, Query mechanisms and the usual array of utility + shorthand methods.

## Compatibility ##

The code uses newer features such as Object.defineProperties and Array.prototype.(some, every, forEach, filter), Data.now and Array.isArray, the implementation should be compatible with:

-  node.js
-  BESEN
-  Rhino 1.7
-  WebKit
-  Chrome 6+
-  Firefox 4+
-  Safari 5+
-  Internet Explorer 9
 
See the [ECMAScript 5 compatibility table](http://kangax.github.com/es5-compat-table/) for more up to date compatibility information.
 
## License ##
 
This code is released in to the public domain, and [UNLICENSED](http://unlicense.org/).
 
## Usage ##
 
This implementation provides the RDF Concept Interfaces and the RDF Environment Interfaces, essentially it provides an instance of RDFEnvironment ready to go.
 
Simply include the file as per usual in a browser and access via the `.rdf` variable, or in node.js and similar `rdf = require('./rdfi');`
 
 