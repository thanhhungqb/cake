'use strict';
// Depending on the URL argument, render as LTR or RTL.
var rtl = (document.location.search == '?rtl');
var block = null;

var dirty = false;
Blockly.PythonTutor.code = '';

function start() {
  Blockly.inject(document.getElementById('blocklyDiv'),
      {
        path: "./blockly/",
        toolbox: document.getElementById('toolbox')
      }
  );
  Blockly.addChangeListener(renderContent);
  Blockly.addChangeListener(function() {
    Blockly.mainWorkspace.traceOn(false);
    dirty = true;
  });

  //Blockly.Blocks.CreateMainBlock();
  var xml = '<xml xmlns="http://www.w3.org/1999/xhtml">' +
  '<block type="procedures_defreturn" deletable="false" movable="false">' +
  '<field name="NAME">do_something</field>' +
  '<field name="TYPES">int</field>' +
  '<field name="DISTS">variable</field>' +
  '</block></xml>';
  BlocklyApps.loadBlocks(xml);

  $('#exec_run').click(function () {
    if (dirty) {
      Blockly.PythonTutor.code = Blockly.PythonTutor.workspaceToCode();
    }
    $('#exec_error span').text('');
    eval(Blockly.PythonTutor.code);
    Blockly.PythonTutor.trace_ = [];
    Blockly.PythonTutor.top_of_stack = 0;
    var f = 'Blockly.PythonTutor.env.functions.'+$("#exec_function").val();
    try {
      if (eval(f) === undefined) throw new Error("Invalid function for execution.");
    } catch(err) {
      $('#exec_error span').text(err.message);
    }
    if (Blockly.PythonTutor.trace_.length > 0) {
      new ExecutionVisualizer('exec_trace', {code: '', trace: Blockly.PythonTutor.trace_},
                              {debugMode: true,
                              hideCode: true,
                              lang: 'cpp'});
    }
    dirty = false;
  });

  if ('BlocklyStorage' in window) {
    // Hook a save function onto unload.
    BlocklyStorage.backupOnUnload();
  }
}


function renderContent() {
  var content = document.getElementById('code');
  var code = Blockly.cake.workspaceToCode();
  content.textContent = code;
  if (typeof prettyPrintOne == 'function') {
    code = content.innerHTML;
    code = prettyPrintOne(code, 'c');
    content.innerHTML = code;
  }
  if (typeof(Storage) !== "undefined") {
    var xml = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace);
    localStorage.setItem("Blockly.mainWorkspace", Blockly.Xml.domToText(xml));
  }
}

/**
 * Discard all blocks from the workspace.
 */
function discard() {
  var count = Blockly.mainWorkspace.getAllBlocks().length;
  if (count < 2 || window.confirm("Remove all blocks?")) {
    Blockly.mainWorkspace.clear();
    //Blockly.Blocks.CreateMainBlock();
    window.location.hash = '';
  }
}

// /**
//  * Insert terminal into page.
//  * https://github.com/jcubic/jquery.terminal
//  */
// jQuery(function($, undefined) {
//     $('#terminal').terminal(function(command, term) {
//         if (command !== '') {
//             var result = window.eval(command);
//             if (result != undefined) {
//                 term.echo(String(result));
//             }
//         }
//     }, {
//         greetings: 'Cake Console Terminal',
//         name: 'js_demo',
//         height: 0,
//         width: 0,
//         prompt: 'cake> '});
// });

function loadxml(xml) {
  if (typeof xml != "string" || xml.length < 5) {
    alert("No Input");
    return false;
    return;
  }
  try {
    var dom = Blockly.Xml.textToDom(xml);
    Blockly.mainWorkspace.clear();
    Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, dom);
    return true;
  } catch (e) {
    alert("Invalid xml");
    return false;
  }
}

/**
 * Save current codes into a *.c file.
 * https://github.com/eligrey/FileSaver.js
 */
function downloadCode() {
  var code = Blockly.cake.workspaceToCode();
  var codeArray = [];
  codeArray.push(code);
  console.log(code);
  var codeBlob = new Blob(codeArray, {type: "text/plain;charset=utf-8"});
  saveAs(codeBlob, "code.c");
}