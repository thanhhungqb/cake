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
  var returnValue = Blockly.PythonTutor.valueToCode(block, 'RETURN',
      Blockly.PythonTutor.ORDER_NONE) || '';
  if (returnValue) {
    returnValue = '  return ' + returnValue + ';\n';
  } else {
    returnValue = '  return 0;\n';
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
  var code = 'function ' + funcName + '(' + args.join(', ') + ') {\n' +
             Blockly.PythonTutor.create_stack_frame(funcName, typePlusArgs) +
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


Blockly.PythonTutor['create_stack_frame'] = function(name, args) {
  return 'var locals = {' + args.map(arg => arg[1]+': {t:"'+arg[0] + '",'+
  'v:'+arg[1]+'},') + '};\n' +
  'env.push({func_name: "' + name + '", locals});\n';
}