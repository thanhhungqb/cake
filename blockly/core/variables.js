/**
 * @license
 * Visual Blocks Editor
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
 * @fileoverview Utility functions for handling variables and procedure names.
 * Note that variables and procedures share the same name space, meaning that
 * one can't have a variable and a procedure of the same name.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

goog.provide('Blockly.Variables');

// TODO(scr): Fix circular dependencies
// goog.require('Blockly.Block');
goog.require('Blockly.Toolbox');
goog.require('Blockly.Workspace');


/**
 * Category to separate variable names from procedures and generated functions.
 */
Blockly.Variables.NAME_TYPE = 'VARIABLE';

/**
 * Find all user-created variables.
 * @param {Blockly.Block=} block Optional source block.
 * @return {!Array.<string>} Array of variable names.
 */
Blockly.Variables.allVariables = function(block) {
  var blocks = [];
  if (block) {
    var parent;
    blocks.push(block);
    while (parent = block.getParent()) {
      if (parent.type == "controls_for"
          && parent.getNextBlock() != block
          && parent.getInputTargetBlock("INIT") != block) {
        // add the init in a forloop if block not the INIT block or the next statement block.
        blocks.push(parent.getInputTargetBlock("INIT"));
      } else if (parent.type == "procedures_defreturn"
                 && parent.getInputTargetBlock("RETURN") == block) {
        for (parent = parent.getInputTargetBlock("STACK"); parent.getNextBlock(); parent = parent.getNextBlock()) {}
      }
      block = parent;
      blocks.push(block);
    }
  } else {
    blocks = Blockly.mainWorkspace.getAllBlocks();
  }
  var variableList = [];
  // Iterate through every block and add each variable to the list.
  for (var x = 0; x < blocks.length; x++) {
    var funcVar = blocks[x].getDeclare;
    var funcParamInfo = blocks[x].getParamInfo;

    if (funcVar) {
        var varName = funcVar.call(blocks[x]);

        var funcVarType = blocks[x].getTypes;
        var varType = funcVarType.call(blocks[x]);

        var funcVarDist = blocks[x].getDist;
        var varDist = funcVarDist.call(blocks[x]);

        var funcVarScope = blocks[x].getScope;
        var varScope = funcVarScope.call(blocks[x]);

        var funcVarPos = blocks[x].getPos;
        var varPos = funcVarPos.call(blocks[x]);

        var funcVarSpec = blocks[x].getSpec;
        var blockSpecifics = funcVarSpec.call(blocks[x]);

        if(varDist !='v' && varDist !='d') {
            var varSpec = blockSpecifics;
        }

      if (varName && varScope) {
        variableList.push({type: varType,
                          dist: varDist,
                          name: varName,
                          scope: varScope,
                          pos: varPos,
                          spec: varSpec});
      }
    }
    /**
    * save function parameter as a variable into variableHash and then variableList.
    * using getParamInfo function in all function blocks.
    */
    else if (funcParamInfo) {
      var params = funcParamInfo.call(blocks[x]);
      params.forEach(function(p) { variableList.push(p); });
    }
  }
    return variableList;
};

/**
 * Find all instances of the specified variable and rename them.
 * @param {string} oldName Variable to rename.
 * @param {string} newName New variable name.
 */
Blockly.Variables.renameVariable = function(oldName, newName) {
  var blocks = Blockly.mainWorkspace.getAllBlocks();
  // Iterate through every block.
  for (var x = 0; x < blocks.length; x++) {
    var func = blocks[x].renameVar;
    if (func) {
      func.call(blocks[x], oldName, newName);
    }
  }
};

/**
 * Construct the blocks required by the flyout for the variable category.
 * @param {!Array.<!Blockly.Block>} blocks List of blocks to show.
 * @param {!Array.<number>} gaps List of widths between blocks.
 * @param {number} margin Standard margin width for calculating gaps.
 * @param {!Blockly.Workspace} workspace The flyout's workspace.
 */
Blockly.Variables.flyoutCategory = function(blocks, gaps, margin, workspace) {
  var variableList = Blockly.Variables.allVariables();
  window.alert(variableList);
  variableList.sort(goog.string.caseInsensitiveCompare);
  // In addition to the user's variables, we also want to display the default
  // variable name at the top.  We also don't want this duplicated if the
  // user has created a variable of the same name.
  variableList.unshift(null);
  var defaultVariable = undefined;
  for (var i = 0; i < variableList.length; i++) {
    if (variableList[i].dist === defaultVariable) {
      continue;
    }
    var getBlock = Blockly.Blocks['variables_get'] ?
      Blockly.Block.obtain(workspace, 'variables_get') : null;
    getBlock && getBlock.initSvg();
    var setBlock = Blockly.Blocks['variables_set'] ?
      Blockly.Block.obtain(workspace, 'variables_set') : null;
    setBlock && setBlock.initSvg();
    if (variableList[i].dist === null) {
      defaultVariable = (getBlock || setBlock).getVars()[0];
    } else {
      getBlock && getBlock.setFieldValue(variableList[i].dist, 'VAR');
      setBlock && setBlock.setFieldValue(variableList[i].dist, 'VAR');
    }
    setBlock && blocks.push(setBlock);
    getBlock && blocks.push(getBlock);
    if (getBlock && setBlock) {
      gaps.push(margin, margin * 3);
    } else {
      gaps.push(margin * 2);
    }
  }
};

/**
 * Return a new variable name that is not yet being used. This will try to
 * generate single letter variable names in the range 'i' to 'z' to start with.
 * If no unique name is located it will try 'i1' to 'z1', then 'i2' to 'z2' etc.
 * @return {string} New variable name.
 */
Blockly.Variables.generateUniqueName = function() {
  var variableList = Blockly.Variables.allVariables();
  var newName = '';
  if (variableList.length) {
    variableList.sort(goog.string.caseInsensitiveCompare);
    var nameSuffix = 0,
      potName = 'i',
      i = 0,
      inUse = false;
    while (!newName) {
      i = 0;
      inUse = false;
      while (i < variableList.length && !inUse) {
        if (variableList[i].dist.toLowerCase() == potName) {
          // This potential name is already used.
          inUse = true;
        }
        i++;
      }
      if (inUse) {
        // Try the next potential name.
        if (potName[0] === 'z') {
          // Reached the end of the character sequence so back to 'a' but with
          // a new suffix.
          nameSuffix++;
          potName = 'a';
        } else {
          potName = String.fromCharCode(potName.charCodeAt(0) + 1);
          if (potName[0] == 'l') {
            // Avoid using variable 'l' because of ambiguity with '1'.
            potName = String.fromCharCode(potName.charCodeAt(0) + 1);
          }
        }
        if (nameSuffix > 0) {
          potName += nameSuffix;
        }
      } else {
        // We can use the current potential name.
        newName = potName;
      }
    }
  } else {
    newName = 'i';
  }
  return newName;
};

/**
 * Get a list of variables matching options
 * @param {mapping of parameters to match} options
 * @param {Optional to retrieve from current scope of block} block
 */
Blockly.Variables.getVariableBlocks = function(options, block) {
  var varList = Blockly.Variables.allVariables(block);
  var wantedList = [];
  for (var temp = 0 ; temp < varList.length ; temp++ ){
    if (Object.keys(options).reduce(function (acc, key) {
            return acc && varList[temp][key] == options[key];
          }, true)) {
        wantedList.push(varList[temp]);
    }
  }

  return wantedList;
};

/**
 * Ensure two identically-named procedures don't exist..
 * @param {Blockly.Block} block Declaration block
 * @return {boolean} true if there is a colliding name
 */
Blockly.Variables.findDuplicateName = function(block) {
  if (block.isInFlyout) {
    // Flyouts can have multiple procedures called 'procedure'.
    return false;
  }
  var name = block.getVars();
  var blocks = Blockly.Variables.getVariableBlocks({name: name}, block);
  return blocks.length > 1;
};