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
  return [code, Blockly.PythonTutor.ORDER_ATOMIC];
};

Blockly.PythonTutor['variables_set'] = function(block) {
  // Variable setter.
  var argument0 = Blockly.PythonTutor.valueToCode(block, 'VALUE',
      Blockly.PythonTutor.ORDER_ASSIGNMENT) || '0';
  var varName = Blockly.PythonTutor.variableDB_.getName(
      block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
  return 'locals.'+varName + '.v = ' + argument0 + ';\n'+
         'pyt.generate_trace('+block.id+')\n';
};

Blockly.PythonTutor['variables_declare'] = function(block) {
  // Variable declare.
  var argument0 = Blockly.PythonTutor.valueToCode(block, 'VALUE',
          Blockly.PythonTutor.ORDER_ASSIGNMENT) || '0';
  var varName = Blockly.PythonTutor.variableDB_.getName(
      block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
  var varInfo = {type: block.getTypes(),
                 dist: block.getDist(),
                 name: block.getVars(),
                 scope: block.getScope(),
                 pos: block.getPos(),
                 spec: block.getSpec(),
                }

  if (Blockly.Blocks.checkLegalName(Blockly.Msg.VARIABLES_ILLEGALNAME, varName) == -1){
      this.initVar();
  }
  return 'pyt.allocate_stack(frame, "'+varName+'",'+JSON.stringify(varInfo)+');\n'+
         'locals.'+varName+'.v = '+argument0+';)\n'+
         'pyt.generate_trace('+block.id+')\n';
};