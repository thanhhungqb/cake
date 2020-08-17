'use strict';
// Depending on the URL argument, render as LTR or RTL.
var rtl = (document.location.search == '?rtl');
var block = null;

function start() {
  Blockly.inject(document.getElementById('blocklyDiv'),
      {
        path: "./blockly/",
        toolbox: document.getElementById('toolbox')
      }
  );
  Blockly.addChangeListener(renderContent);
  Blockly.Blocks.CreateMainBlock();

  BlocklyApps.loadBlocks('');

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
    Blockly.Blocks.CreateMainBlock();
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