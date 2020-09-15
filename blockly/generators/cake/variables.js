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
 * @fileoverview Generating cake for variable blocks.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

goog.provide('Blockly.cake.variables');

goog.require('Blockly.cake');

Blockly.cake['define_get'] = function(block) {
    // Variable getter.
    var code = Blockly.cake.variableDB_.getName(block.getFieldValue('VAR'),
        Blockly.Variables.NAME_TYPE);
    code = Blockly.Blocks.checkUnselect(code);
    return [code, Blockly.cake.ORDER_ATOMIC];
};

Blockly.cake['define_declare'] = function(block) {
    // Variable declare.
    var argument0 = Blockly.cake.valueToCode(block, 'VALUE',
            Blockly.cake.ORDER_ASSIGNMENT) || '0';
    var varName = Blockly.cake.variableDB_.getName(
        block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
    var define = '#define';
    if (Blockly.Blocks.checkLegalName(Blockly.Msg.VARIABLES_ILLEGALNAME, varName) == -1){
        this.initVar();
    }
    var code = define + ' ' + varName + ' ' + argument0;
    code = Blockly.cake.scrub_(block, code);
    Blockly.cake.definitions_['define_' + varName] = code;
    return null;
};

Blockly.cake['variables_get'] = function(block) {
    // Variable getter.
    var code = Blockly.cake.variableDB_.getName(block.getFieldValue('VAR'),
        Blockly.Variables.NAME_TYPE);
    code = Blockly.Blocks.checkUnselect(code);
    return [code, Blockly.cake.ORDER_ATOMIC];
};

Blockly.cake['variables_set'] = function(block) {
    // Variable setter.
    var argument0 = Blockly.cake.valueToCode(block, 'VALUE',
            Blockly.cake.ORDER_ASSIGNMENT) || '0';
    var varName = Blockly.cake.variableDB_.getName(
        block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
    varName = Blockly.Blocks.checkUnselect(varName);
    return varName + ' = ' + argument0 + ';\n';
};

Blockly.cake['variables_declare'] = function(block) {
    // Variable declare.
    var argument0 = Blockly.cake.valueToCode(block, 'VALUE',
            Blockly.cake.ORDER_ASSIGNMENT);
    var varName = Blockly.cake.variableDB_.getName(
        block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
    var varType = block.getFieldValue('TYPES');
    if(varType == 'std::string'){
        Blockly.cake.definitions_['include_cake_string'] =
            '#include <string>';
    }
    if (Blockly.Blocks.checkLegalName(Blockly.Msg.VARIABLES_ILLEGALNAME, varName) == -1){
        this.initVar();
    }
    return varType + ' ' + varName + (argument0 ? ' = ' + argument0 : '') + ';\n';
};

Blockly.cake['variables_pointer_get'] = function(block) {
    // Variable getter.
    var code = Blockly.cake.variableDB_.getName(block.getFieldValue('VAR'),
        Blockly.Variables.NAME_TYPE);
    code = Blockly.Blocks.checkUnselect(code);
    return [code, Blockly.cake.ORDER_ATOMIC];
};

Blockly.cake['variables_pointer_set'] = function(block) {
    // Variable setter.
    var argument0 = Blockly.cake.valueToCode(block, 'VALUE',
            Blockly.cake.ORDER_ASSIGNMENT) || '0';
    var argument1 = Blockly.cake.variableDB_.getName(block.getFieldValue('VAR'),
    Blockly.Variables.NAME_TYPE);
    argument1 = Blockly.Blocks.checkUnselect(argument1);
    return argument1 + ' = ' + argument0 + ';\n';
};

Blockly.cake['variables_pointer_star_set'] = function(block) {
    return '*' + Blockly.cake['variables_pointer_set'].call(this, block);
};

Blockly.cake['variables_pointer_declare'] = function(block) {
    // Variable declare.
    var argument0 = Blockly.cake.valueToCode(block, 'VALUE',
            Blockly.cake.ORDER_ASSIGNMENT);
    var initCode;
    if(argument0)
        initCode = ' = ' + argument0 + ';\n';
    else
        initCode =  ';\n';

    var varName = Blockly.cake.variableDB_.getName(
        block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
    var varType = block.getFieldValue('TYPES');
    if(varType == 'std::string'){
        Blockly.cake.definitions_['include_cake_string'] =
            '#include <string>';
    }
    var varIteration = '*'
    if (Blockly.Blocks.checkLegalName(Blockly.Msg.VARIABLES_ILLEGALNAME, varName) == -1){
        this.initVar();
    }
    return varType + varIteration + ' ' + varName + initCode;
};

Blockly.cake['variables_pointer_&'] = function(block) {
    var argument0 = Blockly.cake.valueToCode(block, 'VALUE', Blockly.cake.ORDER_ASSIGNMENT);
    return ['&' + argument0, Blockly.cake.ORDER_ATOMIC];
};

Blockly.cake['variables_pointer_*'] = function(block) {
    var argument0 = Blockly.cake.valueToCode(block, 'VALUE', Blockly.cake.ORDER_ASSIGNMENT);
    return ['*' + argument0, Blockly.cake.ORDER_ATOMIC];
};

Blockly.cake['variables_array_get_array'] = Blockly.cake['variables_get'];

Blockly.cake['variables_array_get'] = function(block) {
    var varName = Blockly.cake.variableDB_.getName(block.getFieldValue('VAR'),
        Blockly.Variables.NAME_TYPE);
    varName = Blockly.Blocks.checkUnselect(varName);
    var index = Blockly.cake.valueToCode(block, 'LENGTH_1', Blockly.cake.ORDER_ATOMIC);
    var code = varName + '[' + index + ']';
    return [code, Blockly.cake.ORDER_ATOMIC];
};

Blockly.cake['variables_array_set'] = function(block) {
    // Variable setter.
    var argument0 = Blockly.cake.valueToCode(block, 'VALUE',
            Blockly.cake.ORDER_ASSIGNMENT) || '0';
    var varName = Blockly.cake.variableDB_.getName(block.getFieldValue('VAR'),
            Blockly.Variables.NAME_TYPE);
    varName = Blockly.Blocks.checkUnselect(varName);
    var index = Blockly.cake.valueToCode(block, 'LENGTH_1', Blockly.cake.ORDER_ATOMIC);
    return varName + '[' + index + '] = ' + argument0 + '\n';

};

Blockly.cake['variables_array_declare'] = function(block) {
    // Variable declare.
    var varName = Blockly.cake.variableDB_.getName(
        block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
    var varType = block.getFieldValue('TYPES');
    var length_1 = block.getIndices()[0];
    var length_2 = block.getIndices()[1];
    var length_3 = block.getIndices()[2];

    if(varType == 'std::string'){
        Blockly.cake.definitions_['include_cake_string'] =
            '#include <string>';
    }

    var code;

    // must: idx > 0 , no-input: regarded as 0
   /* if (isNaN(length_1) == true || isNaN(length_2) == true || isNaN(length_3) == true) {
        window.alert('Error, you have to enter the number in length');
    }
    */
    if (length_1 != 0 && length_2 == 0 && length_3 == 0)
        code = varType + ' ' + varName + '[' + length_1 + ']';
    else if (length_1 != 0 && length_2 != 0 && length_3 == 0)
        code = varType + ' ' + varName + '[' + length_1 + ']' + '[' + length_2 + ']';
    else if (length_1 != 0 && length_2 != 0 && length_3 != 0)
        code = varType + ' ' + varName +  '[' + length_1 + ']' + '[' + length_2 + ']' + '[' + length_3 + ']';
    /*else
        window.alert('Please confirm array index');
*/
    var init = Blockly.cake.valueToCode(block, 'VALUE',
                  Blockly.cake.ORDER_ASSIGNMENT);
    if (init) {
        code += ' = ' + init;
    }
    code += ';\n';
    if (Blockly.Blocks.checkLegalName(Blockly.Msg.VARIABLES_ILLEGALNAME, varName) == -1){
        this.initVar();
    }
    return code;
};