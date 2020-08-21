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
 * @fileoverview Generating cake for loop blocks.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

goog.provide('Blockly.cake.loops');

goog.require('Blockly.cake');


Blockly.cake['controls_whileUntil'] = function(block) {
  // Do while/until loop.
  var until = block.getFieldValue('MODE') == 'UNTIL';
  var argument0 = Blockly.cake.valueToCode(block, 'BOOL',
    until ? Blockly.cake.ORDER_LOGICAL_NOT :
    Blockly.cake.ORDER_NONE) || '0';
  var branch = Blockly.cake.statementToCode(block, 'DO');
  branch = Blockly.cake.addLoopTrap(branch, block.id);
  if (until) {
    argument0 = '!' + argument0;
  }
  return 'while (' + argument0 + ') {\n' + branch + '}\n';
};

Blockly.cake['controls_doWhile'] = function(block) {
    // Do while/until loop.
    var until = block.getFieldValue('MODE') == 'UNTIL';
    var argument0 = Blockly.cake.valueToCode(block, 'BOOL',
            until ? Blockly.cake.ORDER_LOGICAL_NOT :
                Blockly.cake.ORDER_NONE) || '0';
    var branch = Blockly.cake.statementToCode(block, 'DO');
    branch = Blockly.cake.addLoopTrap(branch, block.id);
    if (until) {
        argument0 = '!' + argument0;
    }
    return 'do {\n' + branch + '} while (' + argument0 + ');\n';
};

Blockly.cake['controls_repeat'] = function(block) {
  // Counting loop.
  var countVar = Blockly.cake.variableDB_.getDistinctName('i', Blockly.Variables.NAME_TYPE);
  var argument0 = Blockly.cake.valueToCode(block, 'TIMES',
    Blockly.cake.ORDER_ASSIGNMENT) || '0';
  var branch = Blockly.cake.statementToCode(block, 'DO');
  branch = Blockly.cake.addLoopTrap(branch, block.id);
  return 'for (int ' + countVar + ' = 0; ' + countVar + ' < '+ argument0 + '; ++' + countVar +
         ') {\n' + branch + '}\n';
}

Blockly.cake['controls_for'] = function(block) {
  // For loop.
  var initialiser = Blockly.cake.statementToCode(block, 'INIT',
    Blockly.cake.ORDER_ASSIGNMENT) || ';';
  var condition = Blockly.cake.valueToCode(block, 'COND',
    Blockly.cake.ORDER_ASSIGNMENT) || ';';
  var increment = Blockly.cake.statementToCode(block, 'INC',
    Blockly.cake.ORDER_ASSIGNMENT) || '';
  var branch = Blockly.cake.statementToCode(block, 'DO');
  branch = Blockly.cake.addLoopTrap(branch, block.id);

  // remove newlines from statement blocks

  return "for (" + initialiser.trim() + " " + condition + "; " + increment.trim().replace(/;\s*$/, "") + ") {\n" +
         branch + "\n}\n";
};

Blockly.cake['controls_flow_statements'] = function(block) {
  // Flow statements: continue, break.
  switch (block.getFieldValue('FLOW')) {
    case 'BREAK':
      return 'break;\n';
    case 'CONTINUE':
      return 'continue;\n';
  }
  throw 'Unknown flow statement.';
};