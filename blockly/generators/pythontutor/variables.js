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
 * @fileoverview Generating JavaScript for variable blocks.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

goog.provide('Blockly.PythonTutor.variables');

goog.require('Blockly.PythonTutor');


Blockly.PythonTutor['variables_get'] = function(block) {
  // Variable getter.
  var code = 'locals.'+Blockly.PythonTutor.variableDB_.getName(block.getFieldValue('VAR'),
      Blockly.Variables.NAME_TYPE)+'.v';
//   if (block._dist == 'r')
//     code += '.v';
  return [code, Blockly.PythonTutor.ORDER_ATOMIC];
};

Blockly.PythonTutor['variables_set'] = function(block) {
  // Variable setter.
  var argument0 = Blockly.PythonTutor.valueToCode(block, 'VALUE',
      Blockly.PythonTutor.ORDER_ASSIGNMENT) || '0';
  var varName = Blockly.PythonTutor.variableDB_.getName(
      block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
  var code = 'locals.'+varName + '.v';
//   if (block._dist == 'r')
//     code += '.v';
  return  code + ' = ' + argument0 + ';\n'+
         'pyt.generate_trace('+block.id+');\n';
};

Blockly.PythonTutor['variables_declare'] = function(block) {
  // Variable declare.
  var argument0 = Blockly.PythonTutor.valueToCode(block, 'VALUE',
          Blockly.PythonTutor.ORDER_ASSIGNMENT) || '0';
  var varName = Blockly.PythonTutor.variableDB_.getName(
      block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
  var varInfo = block.getInfo();

  if (Blockly.Blocks.checkLegalName(Blockly.Msg.VARIABLES_ILLEGALNAME, varName) == -1){
      this.initVar();
  }
  return 'pyt.allocate_stack(frame, "'+varName+'",'+JSON.stringify(varInfo)+');\n'+
         'locals.'+varName+'.v = '+argument0+';\n'+
         'pyt.generate_trace('+block.id+');\n';
};

Blockly.PythonTutor.variables_pointer_get = function(block) {
    // Variable getter.
    var code = 'locals.' + Blockly.PythonTutor.variableDB_.getName(block.getFieldValue('VAR'),
        Blockly.Variables.NAME_TYPE)+'.v';
    return [code, Blockly.PythonTutor.ORDER_ATOMIC];
};

Blockly.PythonTutor.variables_pointer_set = function(block) {
    // Variable setter.
    var argument0 = Blockly.PythonTutor.valueToCode(block, 'VALUE',
            Blockly.PythonTutor.ORDER_ASSIGNMENT);
    var varName = Blockly.PythonTutor.variableDB_.getName(block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
    return 'locals.'+varName+'.v='+ argument0 + ';\n' +
           'pyt.generate_trace('+block.id+');\n';
};

Blockly.PythonTutor.variables_pointer_star_set = function(block) {
    // Variable setter.
    var argument0 = Blockly.PythonTutor.valueToCode(block, 'VALUE',
            Blockly.PythonTutor.ORDER_ASSIGNMENT);
    var varName = Blockly.PythonTutor.variableDB_.getName(block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
    return 'locals.'+varName+'.v.v='+ argument0 + ';\n' +
           'pyt.generate_trace('+block.id+');\n';
};

Blockly.PythonTutor.variables_pointer_declare = function(block) {
    // Variable declare.
    var argument0 = Blockly.PythonTutor.valueToCode(block, 'VALUE',
            Blockly.PythonTutor.ORDER_ASSIGNMENT) || 'undefined';

    var varName = Blockly.PythonTutor.variableDB_.getName(
        block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
    var varInfo = block.getInfo();
    var varIteration;
    if (block.getFieldValue('ITERATION') == '*' || block.getFieldValue('ITERATION') == '**' || block.getFieldValue('ITERATION') == '***')
        varIteration = block.getFieldValue('ITERATION');
    else {
        window.alert('please confirm asterisk. that must be among *, **, and  ***.');
        return 0;
    }
    if (Blockly.Blocks.checkLegalName(Blockly.Msg.VARIABLES_ILLEGALNAME, varName) == -1){
        this.initVar();
    }
    return 'pyt.allocate_stack(frame, "'+varName+'",'+JSON.stringify(varInfo)+');\n'+
           'locals.'+varName+'.v = '+argument0+';\n'+
           'pyt.generate_trace('+block.id+');\n';

};

Blockly.PythonTutor['variables_pointer_&'] = function(block) {
    var ptrName = Blockly.PythonTutor.variableDB_.getName(
        block.getInputTargetBlock('VALUE').getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
    return ['locals.' + ptrName, Blockly.PythonTutor.ORDER_ATOMIC];
};

Blockly.PythonTutor['variables_pointer_*'] = function(block) {
    var argument0 = Blockly.PythonTutor.valueToCode(block, 'VALUE', Blockly.PythonTutor.ORDER_ASSIGNMENT);
    return [argument0+'.v', Blockly.PythonTutor.ORDER_ATOMIC];
};