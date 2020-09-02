/**
 * @license
 * Visual Blocks Language
 *
 * Copyright 2012 Google Inc.
 * https://blockly.googlecode.com/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Helper functions for generating JavaScript for blocks.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

goog.provide('Blockly.PythonTutor');

goog.require('Blockly.Generator');


Blockly.PythonTutor = new Blockly.Generator('PythonTutor');

/**
 * List of illegal variable names.
 * This is not intended to be a security feature.  Blockly is 100% client-side,
 * so bypassing this list is trivial.  This is intended to prevent users from
 * accidentally clobbering a built-in object or function.
 * @private
 */
Blockly.PythonTutor.addReservedWords(
    'Blockly,' +  // In case JS is evaled in the current window.
    // https://developer.mozilla.org/en/JavaScript/Reference/Reserved_Words
    'break,case,catch,continue,debugger,default,delete,do,else,finally,for,function,if,in,instanceof,new,return,switch,this,throw,try,typeof,var,void,while,with,' +
    'class,enum,export,extends,import,super,implements,interface,let,package,private,protected,public,static,yield,' +
    'const,null,true,false,' +
    // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects
    'Array,ArrayBuffer,Boolean,Date,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,Error,eval,EvalError,Float32Array,Float64Array,Function,Infinity,Int16Array,Int32Array,Int8Array,isFinite,isNaN,Iterator,JSON,Math,NaN,Number,Object,parseFloat,parseInt,RangeError,ReferenceError,RegExp,StopIteration,String,SyntaxError,TypeError,Uint16Array,Uint32Array,Uint8Array,Uint8ClampedArray,undefined,uneval,URIError,' +
    // https://developer.mozilla.org/en/DOM/window
    'applicationCache,closed,Components,content,_content,controllers,crypto,defaultStatus,dialogArguments,directories,document,frameElement,frames,fullScreen,globalStorage,history,innerHeight,innerWidth,length,location,locationbar,localStorage,menubar,messageManager,mozAnimationStartTime,mozInnerScreenX,mozInnerScreenY,mozPaintCount,name,navigator,opener,outerHeight,outerWidth,pageXOffset,pageYOffset,parent,performance,personalbar,pkcs11,returnValue,screen,screenX,screenY,scrollbars,scrollMaxX,scrollMaxY,scrollX,scrollY,self,sessionStorage,sidebar,status,statusbar,toolbar,top,URL,window,' +
    'addEventListener,alert,atob,back,blur,btoa,captureEvents,clearImmediate,clearInterval,clearTimeout,close,confirm,disableExternalCapture,dispatchEvent,dump,enableExternalCapture,escape,find,focus,forward,GeckoActiveXObject,getAttention,getAttentionWithCycleCount,getComputedStyle,getSelection,home,matchMedia,maximize,minimize,moveBy,moveTo,mozRequestAnimationFrame,open,openDialog,postMessage,print,prompt,QueryInterface,releaseEvents,removeEventListener,resizeBy,resizeTo,restore,routeEvent,scroll,scrollBy,scrollByLines,scrollByPages,scrollTo,setCursor,setImmediate,setInterval,setResizable,setTimeout,showModalDialog,sizeToContent,stop,unescape,updateCommands,XPCNativeWrapper,XPCSafeJSObjectWrapper,' +
    'onabort,onbeforeunload,onblur,onchange,onclick,onclose,oncontextmenu,ondevicemotion,ondeviceorientation,ondragdrop,onerror,onfocus,onhashchange,onkeydown,onkeypress,onkeyup,onload,onmousedown,onmousemove,onmouseout,onmouseover,onmouseup,onmozbeforepaint,onpaint,onpopstate,onreset,onresize,onscroll,onselect,onsubmit,onunload,onpageshow,onpagehide,' +
    'Image,Option,Worker,' +
    // https://developer.mozilla.org/en/Gecko_DOM_Reference
    'Event,Range,File,FileReader,Blob,BlobBuilder,' +
    'Attr,CDATASection,CharacterData,Comment,console,DocumentFragment,DocumentType,DomConfiguration,DOMError,DOMErrorHandler,DOMException,DOMImplementation,DOMImplementationList,DOMImplementationRegistry,DOMImplementationSource,DOMLocator,DOMObject,DOMString,DOMStringList,DOMTimeStamp,DOMUserData,Entity,EntityReference,MediaQueryList,MediaQueryListListener,NameList,NamedNodeMap,Node,NodeFilter,NodeIterator,NodeList,Notation,Plugin,PluginArray,ProcessingInstruction,SharedWorker,Text,TimeRanges,Treewalker,TypeInfo,UserDataHandler,Worker,WorkerGlobalScope,' +
    'HTMLDocument,HTMLElement,HTMLAnchorElement,HTMLAppletElement,HTMLAudioElement,HTMLAreaElement,HTMLBaseElement,HTMLBaseFontElement,HTMLBodyElement,HTMLBRElement,HTMLButtonElement,HTMLCanvasElement,HTMLDirectoryElement,HTMLDivElement,HTMLDListElement,HTMLEmbedElement,HTMLFieldSetElement,HTMLFontElement,HTMLFormElement,HTMLFrameElement,HTMLFrameSetElement,HTMLHeadElement,HTMLHeadingElement,HTMLHtmlElement,HTMLHRElement,HTMLIFrameElement,HTMLImageElement,HTMLInputElement,HTMLKeygenElement,HTMLLabelElement,HTMLLIElement,HTMLLinkElement,HTMLMapElement,HTMLMenuElement,HTMLMetaElement,HTMLModElement,HTMLObjectElement,HTMLOListElement,HTMLOptGroupElement,HTMLOptionElement,HTMLOutputElement,HTMLParagraphElement,HTMLParamElement,HTMLPreElement,HTMLQuoteElement,HTMLScriptElement,HTMLSelectElement,HTMLSourceElement,HTMLSpanElement,HTMLStyleElement,HTMLTableElement,HTMLTableCaptionElement,HTMLTableCellElement,HTMLTableDataCellElement,HTMLTableHeaderCellElement,HTMLTableColElement,HTMLTableRowElement,HTMLTableSectionElement,HTMLTextAreaElement,HTMLTimeElement,HTMLTitleElement,HTMLTrackElement,HTMLUListElement,HTMLUnknownElement,HTMLVideoElement,' +
    'HTMLCanvasElement,CanvasRenderingContext2D,CanvasGradient,CanvasPattern,TextMetrics,ImageData,CanvasPixelArray,HTMLAudioElement,HTMLVideoElement,NotifyAudioAvailableEvent,HTMLCollection,HTMLAllCollection,HTMLFormControlsCollection,HTMLOptionsCollection,HTMLPropertiesCollection,DOMTokenList,DOMSettableTokenList,DOMStringMap,RadioNodeList,' +
    'SVGDocument,SVGElement,SVGAElement,SVGAltGlyphElement,SVGAltGlyphDefElement,SVGAltGlyphItemElement,SVGAnimationElement,SVGAnimateElement,SVGAnimateColorElement,SVGAnimateMotionElement,SVGAnimateTransformElement,SVGSetElement,SVGCircleElement,SVGClipPathElement,SVGColorProfileElement,SVGCursorElement,SVGDefsElement,SVGDescElement,SVGEllipseElement,SVGFilterElement,SVGFilterPrimitiveStandardAttributes,SVGFEBlendElement,SVGFEColorMatrixElement,SVGFEComponentTransferElement,SVGFECompositeElement,SVGFEConvolveMatrixElement,SVGFEDiffuseLightingElement,SVGFEDisplacementMapElement,SVGFEDistantLightElement,SVGFEFloodElement,SVGFEGaussianBlurElement,SVGFEImageElement,SVGFEMergeElement,SVGFEMergeNodeElement,SVGFEMorphologyElement,SVGFEOffsetElement,SVGFEPointLightElement,SVGFESpecularLightingElement,SVGFESpotLightElement,SVGFETileElement,SVGFETurbulenceElement,SVGComponentTransferFunctionElement,SVGFEFuncRElement,SVGFEFuncGElement,SVGFEFuncBElement,SVGFEFuncAElement,SVGFontElement,SVGFontFaceElement,SVGFontFaceFormatElement,SVGFontFaceNameElement,SVGFontFaceSrcElement,SVGFontFaceUriElement,SVGForeignObjectElement,SVGGElement,SVGGlyphElement,SVGGlyphRefElement,SVGGradientElement,SVGLinearGradientElement,SVGRadialGradientElement,SVGHKernElement,SVGImageElement,SVGLineElement,SVGMarkerElement,SVGMaskElement,SVGMetadataElement,SVGMissingGlyphElement,SVGMPathElement,SVGPathElement,SVGPatternElement,SVGPolylineElement,SVGPolygonElement,SVGRectElement,SVGScriptElement,SVGStopElement,SVGStyleElement,SVGSVGElement,SVGSwitchElement,SVGSymbolElement,SVGTextElement,SVGTextPathElement,SVGTitleElement,SVGTRefElement,SVGTSpanElement,SVGUseElement,SVGViewElement,SVGVKernElement,' +
    'SVGAngle,SVGColor,SVGICCColor,SVGElementInstance,SVGElementInstanceList,SVGLength,SVGLengthList,SVGMatrix,SVGNumber,SVGNumberList,SVGPaint,SVGPoint,SVGPointList,SVGPreserveAspectRatio,SVGRect,SVGStringList,SVGTransform,SVGTransformList,' +
    'SVGAnimatedAngle,SVGAnimatedBoolean,SVGAnimatedEnumeration,SVGAnimatedInteger,SVGAnimatedLength,SVGAnimatedLengthList,SVGAnimatedNumber,SVGAnimatedNumberList,SVGAnimatedPreserveAspectRatio,SVGAnimatedRect,SVGAnimatedString,SVGAnimatedTransformList,' +
    'SVGPathSegList,SVGPathSeg,SVGPathSegArcAbs,SVGPathSegArcRel,SVGPathSegClosePath,SVGPathSegCurvetoCubicAbs,SVGPathSegCurvetoCubicRel,SVGPathSegCurvetoCubicSmoothAbs,SVGPathSegCurvetoCubicSmoothRel,SVGPathSegCurvetoQuadraticAbs,SVGPathSegCurvetoQuadraticRel,SVGPathSegCurvetoQuadraticSmoothAbs,SVGPathSegCurvetoQuadraticSmoothRel,SVGPathSegLinetoAbs,SVGPathSegLinetoHorizontalAbs,SVGPathSegLinetoHorizontalRel,SVGPathSegLinetoRel,SVGPathSegLinetoVerticalAbs,SVGPathSegLinetoVerticalRel,SVGPathSegMovetoAbs,SVGPathSegMovetoRel,ElementTimeControl,TimeEvent,SVGAnimatedPathData,' +
    'SVGAnimatedPoints,SVGColorProfileRule,SVGCSSRule,SVGExternalResourcesRequired,SVGFitToViewBox,SVGLangSpace,SVGLocatable,SVGRenderingIntent,SVGStylable,SVGTests,SVGTextContentElement,SVGTextPositioningElement,SVGTransformable,SVGUnitTypes,SVGURIReference,SVGViewSpec,SVGZoomAndPan,' +
    '__return__');

/**
 * Order of operation ENUMs.
 * https://developer.mozilla.org/en/JavaScript/Reference/Operators/Operator_Precedence
 */
Blockly.PythonTutor.ORDER_ATOMIC = 0;         // 0 "" ...
Blockly.PythonTutor.ORDER_MEMBER = 1;         // . []
Blockly.PythonTutor.ORDER_NEW = 1;            // new
Blockly.PythonTutor.ORDER_FUNCTION_CALL = 2;  // ()
Blockly.PythonTutor.ORDER_INCREMENT = 3;      // ++
Blockly.PythonTutor.ORDER_DECREMENT = 3;      // --
Blockly.PythonTutor.ORDER_LOGICAL_NOT = 4;    // !
Blockly.PythonTutor.ORDER_BITWISE_NOT = 4;    // ~
Blockly.PythonTutor.ORDER_UNARY_PLUS = 4;     // +
Blockly.PythonTutor.ORDER_UNARY_NEGATION = 4; // -
Blockly.PythonTutor.ORDER_TYPEOF = 4;         // typeof
Blockly.PythonTutor.ORDER_VOID = 4;           // void
Blockly.PythonTutor.ORDER_DELETE = 4;         // delete
Blockly.PythonTutor.ORDER_MULTIPLICATION = 5; // *
Blockly.PythonTutor.ORDER_DIVISION = 5;       // /
Blockly.PythonTutor.ORDER_MODULUS = 5;        // %
Blockly.PythonTutor.ORDER_ADDITION = 6;       // +
Blockly.PythonTutor.ORDER_SUBTRACTION = 6;    // -
Blockly.PythonTutor.ORDER_BITWISE_SHIFT = 7;  // << >> >>>
Blockly.PythonTutor.ORDER_RELATIONAL = 8;     // < <= > >=
Blockly.PythonTutor.ORDER_IN = 8;             // in
Blockly.PythonTutor.ORDER_INSTANCEOF = 8;     // instanceof
Blockly.PythonTutor.ORDER_EQUALITY = 9;       // == != === !==
Blockly.PythonTutor.ORDER_BITWISE_AND = 10;   // &
Blockly.PythonTutor.ORDER_BITWISE_XOR = 11;   // ^
Blockly.PythonTutor.ORDER_BITWISE_OR = 12;    // |
Blockly.PythonTutor.ORDER_LOGICAL_AND = 13;   // &&
Blockly.PythonTutor.ORDER_LOGICAL_OR = 14;    // ||
Blockly.PythonTutor.ORDER_CONDITIONAL = 15;   // ?:
Blockly.PythonTutor.ORDER_ASSIGNMENT = 16;    // = += -= *= /= %= <<= >>= ...
Blockly.PythonTutor.ORDER_COMMA = 17;         // ,
Blockly.PythonTutor.ORDER_NONE = 99;          // (...)

/**
 * Initialise the database of variable names.
 */
Blockly.PythonTutor.init = function() {
  // Create a dictionary of definitions to be printed before the code.
  Blockly.PythonTutor.definitions_ = Object.create(null);
  // Create a dictionary mapping desired function names in definitions_
  // to actual function names (to avoid collisions with user functions).
  Blockly.PythonTutor.functionNames_ = Object.create(null);

  if (Blockly.Variables) {
    if (!Blockly.PythonTutor.variableDB_) {
      Blockly.PythonTutor.variableDB_ =
          new Blockly.Names(Blockly.PythonTutor.RESERVED_WORDS_);
    } else {
      Blockly.PythonTutor.variableDB_.reset();
    }

    // Execution trace for PythonTutor.
    Blockly.PythonTutor.trace_ = [];

    Blockly.PythonTutor.top_of_stack = 0;

    // Create execution environment for the code.
    Blockly.PythonTutor.env = {
      globals: {},
      ordered_globals: {},
      functions: {},
      heap: {},
      stacks: []
    };
    // var defvars = [];
    // var variables = Blockly.Variables.allVariables();
    // for (var x = 0; x < variables.length; x++) {
    //   defvars[x] = 'var ' +
    //       Blockly.PythonTutor.variableDB_.getName(variables[x],
    //       Blockly.Variables.NAME_TYPE) + ';';
    // }
    // Blockly.PythonTutor.definitions_['variables'] = defvars.join('\n');
  }
};

/**
 * Prepend the generated code with the variable definitions.
 * @param {string} code Generated code.
 * @return {string} Completed code.
 */
Blockly.PythonTutor.finish = function(code) {
  // Convert the definitions dictionary into a list.
  var definitions = [];
  for (var name in Blockly.PythonTutor.definitions_) {
    definitions.push(Blockly.PythonTutor.definitions_[name]);
  }
  return 'var pyt = Blockly.PythonTutor;\n'+
         'var env = pyt.env.stacks;\n'+
         'var heap = pyt.env.heap;\n'+
         'var fn = pyt.env.functions;\n'+
         definitions.join('\n\n') +
         code;
};

Blockly.PythonTutor.type_sizes = {
  char: 1,
  short: 2,
  int: 4,
  long: 8,
  float: 4,
  double: 8,
  pointer: 4,
};

Blockly.PythonTutor.allocate_stack = function(frame, name, arg) {
  var a = Blockly.PythonTutor.top_of_stack;
  if (arg.dist != 'r')
    Blockly.PythonTutor.top_of_stack += Blockly.PythonTutor.type_sizes[arg.type];
  var variable = {a:a,
                  t:arg.type,
                  d:arg.dist,
                  n:arg.name,
                  s:arg.scope,
                  c:arg.spec,
                  v:undefined};
  frame.locals[name] = variable;
  frame.ordered_locals[frame.ordered_locals.length-1].push(variable);
};

// Running ID for generating stack frames
Blockly.PythonTutor.frame_id = 0;
/**
 * Generate code for creating a new stack frame during evaluation
 * @param {} name Name of function creating stack
 * @param {*} args Arguments to create in the stack frame.
 *           An array of {dist, type, name, scope, pos, spec}
 */
Blockly.PythonTutor.create_stack_frame = function(name, args) {
  var top = Blockly.PythonTutor.top_of_stack;
  var frame_id = Blockly.PythonTutor.frame_id++;
  return '  var locals = {}; var frame = {frame_id:'+frame_id+', top:top, func_name: "' + name + '", locals, ordered_locals:[[]]}\n' +
         args.map(function(arg) {
           var varName = Blockly.PythonTutor.variableDB_.getName(arg.name, Blockly.Variables.NAME_TYPE);
            return 'pyt.allocate_stack(frame, "'+varName+'", '+JSON.stringify(arg)+');' +
                   'locals.'+varName+'.v = '+varName;
          }).join('\n') +
         '\n  env.push(frame);\n';
}

Blockly.PythonTutor.pop_stack_frame = function(env) {
  var frame = env[env.length-1];
  var locals = frame.ordered_locals.flat();
  if (locals.length) {
    Blockly.PythonTutor.top_of_stack = locals[0].a;
    locals.map(function (arg) { arg.v = undefined;} );
  }
  env.pop();
}

Blockly.PythonTutor.create_scope = function(frame) {
  frame.ordered_locals.push([]);
  //console.log("Push: " + JSON.stringify(frame.ordered_locals));
}

Blockly.PythonTutor.pop_scope = function(frame) {
  //console.log("Popping: " + JSON.stringify(frame.ordered_locals));
  var locals = frame.ordered_locals.pop();
  if (locals.length) {
    locals.forEach(function (arg) {
      arg.v = undefined;
    });
    Blockly.PythonTutor.top_of_stack = locals[0].a;
  }
  // remap existing variables in scope to frame.locals
  frame.ordered_locals.flat().forEach(function (arg) {
    frame.locals[arg.n] = arg;
  });
}

// Takes a variable in our environment and return an encoded var for OPT
// Blockly.PythonTutor.encode_vars = function(name, args) {
//   return {name: }
// }

Blockly.PythonTutor.generate_trace = function(id, event="step_line") {
  // limit trace
  if (Blockly.PythonTutor.trace_.length >= 1000) {
    throw new Error('Execution has reached 1000 step limit. Check for infinite loops or reduce number of loops.');
  }
  var env = Blockly.PythonTutor.env;
  var frame = {
    bid: id,
    event: event,
    func_name: env.stacks[env.stacks.length-1].func_name,
    globals: env.globals,
    ordered_globals: env.ordered_globals,
    heap: env.heap,
    stack_to_render: []
    };
  env.stacks.forEach(function(stack) {
    var locals = []
    stack.ordered_locals.flat().forEach(function(arg) {
      var a = ['C_DATA', "0x"+("0000"+arg.a.toString(16)).substr(-4), arg.t, arg.v];
      if (arg.d == 'p') {
        a[2] += ' pointer';
        a[3] = "0x"+("0000"+arg.v.a.toString(16)).substr(-4);
      } else if (arg.d == 'r') {
        a[0] = 'C++_REF';
        a[1] = "0x"+("0000"+arg.v.a.toString(16)).substr(-4);
        a[3] = arg.v.v;
      }

      a['n'] = arg.n;
      locals.push(a);
    });
    frame.stack_to_render.push({
      frame_id: stack.frame_id,
      func_name: stack.func_name,
      is_highlighted: false,
      is_parent: false,
      is_zombie: false,
      parent_frame_id_list: [],
      unique_hash: stack.func_name+'_'+stack.frame_id,
      ordered_varnames: locals,
      encoded_locals: locals,
      stdout: stack.stdout,
    })
  });
  Blockly.PythonTutor.trace_.push(frame);
};

/**
 * Naked values are top-level blocks with outputs that aren't plugged into
 * anything.  A trailing semicolon is needed to make this legal.
 * @param {string} line Line of generated code.
 * @return {string} Legal line of code.
 */
Blockly.PythonTutor.scrubNakedValue = function(line) {
  return line + ';\n';
};

/**
 * Encode a string as a properly escaped JavaScript string, complete with
 * quotes.
 * @param {string} string Text to encode.
 * @return {string} JavaScript string.
 * @private
 */
Blockly.PythonTutor.quote_ = function(string) {
  // TODO: This is a quick hack.  Replace with goog.string.quote
  string = string.replace(/\\/g, '\\\\')
                 .replace(/\n/g, '\\\n')
                 .replace(/'/g, '\\\'');
  return '\'' + string + '\'';
};

/**
 * Common tasks for generating JavaScript from blocks.
 * Handles comments for the specified block and any connected value blocks.
 * Calls any statements following this block.
 * @param {!Blockly.Block} block The current block.
 * @param {string} code The JavaScript code created for this block.
 * @return {string} JavaScript code with comments and subsequent blocks added.
 * @private
 */
Blockly.PythonTutor.scrub_ = function(block, code) {
  var commentCode = '';
  // Only collect comments for blocks that aren't inline.
  if (!block.outputConnection || !block.outputConnection.targetConnection) {
    // Collect comment for this block.
    var comment = block.getCommentText();
    if (comment) {
      commentCode += this.prefixLines(comment, '// ') + '\n';
    }
    // Collect comments for all value arguments.
    // Don't collect comments for nested statements.
    for (var x = 0; x < block.inputList.length; x++) {
      if (block.inputList[x].type == Blockly.INPUT_VALUE) {
        var childBlock = block.inputList[x].connection.targetBlock();
        if (childBlock) {
          var comment = this.allNestedComments(childBlock);
          if (comment) {
            commentCode += this.prefixLines(comment, '// ');
          }
        }
      }
    }
  }
  var nextBlock = block.nextConnection && block.nextConnection.targetBlock();
  var nextCode = this.blockToCode(nextBlock);
  return commentCode + code + nextCode;
};