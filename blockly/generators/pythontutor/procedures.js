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
 * @fileoverview Generating JavaScript for procedure blocks.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

goog.provide('Blockly.PythonTutor.procedures');

goog.require('Blockly.PythonTutor');

Blockly.PythonTutor['procedures_return'] = function(block) {
  var returnValue = Blockly.PythonTutor.valueToCode(block, 'VALUE',
    Blockly.cake.ORDER_NONE) || '';
  if (returnValue) {
    returnValue = 'locals.__return__ = pyt.allocate_stack("'+varType+'",'+returnValue+');\n'+
    'ols.push("__return__")\n'+
    'pyt.generate_trace('+block.id+', "return")\n'+
    '  return locals.__return__;\n';
  } else {
    'pyt.generate_trace('+block.id+', "uncaught_exception");\n'+
    '  env.pop();\n'+
    '  return;\n';
  }
};


Blockly.PythonTutor['procedures_defreturn'] = function(block) {
  // Define a procedure with a return value.
  var funcName = Blockly.PythonTutor.variableDB_.getName(
      block.getFieldValue('NAME'), Blockly.Procedures.NAME_TYPE);
  var branch = Blockly.PythonTutor.statementToCode(block, 'STACK');
  if (Blockly.PythonTutor.STATEMENT_PREFIX) {
    branch = Blockly.PythonTutor.prefixLines(
        Blockly.PythonTutor.STATEMENT_PREFIX.replace(/%1/g,
        '\'' + block.id + '\''), Blockly.PythonTutor.INDENT) + branch;
  }
  if (Blockly.PythonTutor.INFINITE_LOOP_TRAP) {
    branch = Blockly.PythonTutor.INFINITE_LOOP_TRAP.replace(/%1/g,
        '\'' + block.id + '\'') + branch;
  }

  var returnType = block.getFieldValue('TYPES');
  var returnDist = block.getFieldValue('DISTS');

  var returnValue = Blockly.PythonTutor.valueToCode(block, 'RETURN',
      Blockly.PythonTutor.ORDER_NONE) || '';
  if (returnValue) {
    returnValue = 'locals.__return__ = pyt.allocate_stack("'+returnType+'",'+returnValue+');\n'+
    '  ols.push("__return__")\n'+
    '  pyt.generate_trace('+block.id+', "return")\n'+
    '  env.pop();\n'+
    '  return locals.__return__;\n';
  } else {
    'pyt.generate_trace('+block.id+', "uncaught_exception");\n'+
    '  return;\n';
  }
  var args = [];
  var argTypes = [];
  var typePlusArgs = [];
  for (var x = 0; x < block.arguments_.length; x++) {
    args[x] = Blockly.cake.variableDB_.getName(block.arguments_[x],
      Blockly.Variables.NAME_TYPE);
    argTypes[x] = block.types_[x];
    typePlusArgs[x] = [argTypes[x], args[x]];
  }
  var code = 'fn.' + funcName +' = function(' + args.join(', ') + ') {\n' +
             Blockly.PythonTutor.create_stack_frame(funcName, typePlusArgs) +
             '  pyt.generate_trace('+block.id+', "call");\n' +
             branch + returnValue + '}';
  code = Blockly.PythonTutor.scrub_(block, code);
  Blockly.PythonTutor.definitions_[funcName] = code;
  return null;
};

// Defining a procedure without a return value uses the same generator as
// a procedure with a return value.
Blockly.PythonTutor['procedures_defnoreturn'] =
    Blockly.PythonTutor['procedures_defreturn'];

Blockly.PythonTutor['procedures_callreturn'] = function(block) {
  // Call a procedure with a return value.
  var funcName = Blockly.PythonTutor.variableDB_.getName(
      block.getFieldValue('NAME'), Blockly.Procedures.NAME_TYPE);
  var args = [];
  for (var x = 0; x < block.arguments_.length; x++) {
    args[x] = Blockly.PythonTutor.valueToCode(block, 'ARG' + x,
        Blockly.PythonTutor.ORDER_COMMA) || 'null';
  }
  var code = funcName + '(' + args.join(', ') + ')';
  return [code, Blockly.PythonTutor.ORDER_FUNCTION_CALL];
};

Blockly.PythonTutor['procedures_callnoreturn'] = function(block) {
  // Call a procedure with no return value.
  var funcName = Blockly.PythonTutor.variableDB_.getName(
      block.getFieldValue('NAME'), Blockly.Procedures.NAME_TYPE);
  var args = [];
  var argTypes = [];
  var typePlusArgs = [];
  for (var x = 0; x < block.arguments_.length; x++) {
    args[x] = Blockly.cake.variableDB_.getName(block.arguments_[x],
      Blockly.Variables.NAME_TYPE);
    argTypes[x] = block.types_[x];
    typePlusArgs.push([argTypes[x], args[x]]);
  }
  var code = funcName + '(' + args.join(', ') + ');\n';
  return code;
};

Blockly.PythonTutor['procedures_ifreturn'] = function(block) {
  // Conditionally return value from a procedure.
  var condition = Blockly.PythonTutor.valueToCode(block, 'CONDITION',
      Blockly.PythonTutor.ORDER_NONE) || 'false';
  var code = 'if (' + condition + ') {\n';
  if (block.hasReturnValue_) {
    var value = Blockly.PythonTutor.valueToCode(block, 'VALUE',
        Blockly.PythonTutor.ORDER_NONE) || 'null';
    code += '  return ' + value + ';\n';
  } else {
    code += '  return;\n';
  }
  code += '}\n';
  return code;
};


// Running ID for generating stack frames
Blockly.PythonTutor.frame_id = 0;

Blockly.PythonTutor['create_stack_frame'] = function(name, args) {
  var top = Blockly.PythonTutor.top_of_stack;
  var frame_id = Blockly.PythonTutor.frame_id++;
  return '  var locals = {' + args.map(arg => arg[1]+': pyt.allocate_stack("'+arg[0] + '", '+arg[1]+'),') + '};\n' +
         '  var ols = '+JSON.stringify(args.map(a => a[1]))+';\n'+
         '  env.push({frame_id:'+frame_id+', top:top, func_name: "' + name + '", locals, ordered_locals:ols});\n';
}