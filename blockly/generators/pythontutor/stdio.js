'use strict';

goog.provide('Blockly.PythonTutor.stdio');

goog.require('Blockly.PythonTutor');

Blockly.PythonTutor['library_stdio_printf'] = function(block) {
    // Print statement
    var argument = '';
    var typeCode = '';
    var inQutCode = '';
    var outQutCode = '';
    var code = 'stdout += ""';

    for (var n = 0; n <= block.printAddCount_; n++) {
        argument = Blockly.PythonTutor.valueToCode(block, 'VAR' + n,
            Blockly.PythonTutor.ORDER_NONE) || '';

        code += '+'+argument;
    } // for loop end
    return code + '\n';
};

Blockly.PythonTutor['library_stdio_text'] = function(block) {
    // Text value.
    var code = goog.string.quote(block.getFieldValue('TEXT'));
    return [code, Blockly.PythonTutor.ORDER_ATOMIC];
};

Blockly.PythonTutor['library_stdio_char'] = function(block) {
    // Char value.
    var code = goog.string.quote(block.getFieldValue('TEXT'));
    return [code, Blockly.PythonTutor.ORDER_ATOMIC];
};

Blockly.PythonTutor['library_stdio_newLine'] = function() {
    // new line block for '\n'
    var code = "'\\n'";
    return [code, Blockly.PythonTutor.ORDER_NONE];
};

Blockly.PythonTutor['library_stdio_scanf'] = function(block) {
    // Scan statement
    var argument = '';
    var typeCode = '';
    var inQutCode = '';
    var outQutCode = '';
    var code = '';

    for (var n = 0; n <= block.scanAddCount_; n++) {
        argument = Blockly.PythonTutor.valueToCode(block, 'VAR' + n,
            Blockly.PythonTutor.ORDER_NONE) || '';

        var childConnection = block.inputList[n].connection;
        var childBlock = childConnection.targetBlock();

        if(childBlock){
            var childBlockType = childBlock.type;

            if (childBlockType == 'variables_array_get')
            {
                var tempArgu1 = argument.split('[');

                typeCode = Blockly.PythonTutor.arrTypeCheckInScan(tempArgu1[0], childConnection);

                if (typeCode == '%s') {
                    inQutCode += typeCode;
                    //outQutCode += ', ' + argument;
                    outQutCode += ' >> ' + argument;
                } else {
                    inQutCode += typeCode;
                    //outQutCode += ', &' + argument;
                    outQutCode += ' >> ' + argument;
                }
            }
            else if (childBlockType == 'variables_pointer_get')
            {
                typeCode = Blockly.PythonTutor.varTypeCheckInPrintScan(argument);

                if (typeCode == '%c'){
                    typeCode = '%s';
                }
                inQutCode += typeCode;
                //outQutCode += ', ' + argument;
                outQutCode += ' >> ' + argument;
            }
            else if (childBlockType == 'variables_pointer_&')
            {
                if (childConnection.isSuperior()) {
                    childConnection.targetBlock().setParent(null);
                } else {
                    childConnection.sourceBlock_.setParent(null);
                }
                // Bump away.
                childConnection.sourceBlock_.bumpNeighbours_();
            }
            else if (childBlockType == 'variables_pointer_*')
            {
                if(childBlock.inputList[0].connection.targetBlock()){
                    argument = Blockly.PythonTutor.valueToCode(childBlock, 'VALUE', Blockly.PythonTutor.ORDER_NONE) || '';

                    typeCode = Blockly.PythonTutor.varTypeCheckInPrintScan(argument);

                    if (typeCode == '') {
                        inQutCode += argument;
                    } else {
                        inQutCode += typeCode;
                        //outQutCode += ', &*' + argument;
                        outQutCode += ' >> ' + argument;
                    }
                }
            }
            else // When 'variables_variable_get' block
            {
                typeCode = Blockly.PythonTutor.varTypeCheckInPrintScan(argument);

                inQutCode += typeCode;
                //outQutCode += ', &' + argument;
                outQutCode += ' >> ' + argument;
            }
        }
    } // for loop end

    // if (outQutCode == ''){
    //     code = 'scanf(\"' + inQutCode + '\");';
    // } else {
    //     code = 'scanf(\"' + inQutCode + '\"' + outQutCode + ');';
    // }
    code = 'std::cin' + outQutCode + ';';

    Blockly.PythonTutor.definitions_['include_PythonTutor_stdio'] =
        '#include <iostream>';
    return code + '\n';
};

Blockly.PythonTutor.varTypeCheckInPrintScan = function(varName) { // variable type check
    var typeCode = '';
    var varList = Blockly.Variables.allVariables();

    for(var temp = 0 ; temp < varList.length ; temp++) {
        if (varName == varList[temp].name) {
            var type = varList[temp].type;
            if (type == 'int') {
                typeCode = '%d';
            } else if (type == 'unsigned int') {
                typeCode = '%u';
            } else if (type == 'float') {
                typeCode = '%f';
            } else if (type == 'double') {
                typeCode = '%f';
            } else if (type == 'char') {
                typeCode = '%c';
            } else if (type == 'dbchar') {
                typeCode = '%s';
            }
            return typeCode;
        }
    }
    return typeCode;
};

Blockly.PythonTutor.pointerTypeCheckInPrint = function(varName, checkDoubleAst) { // pointer type check
    var typeCode = '';
    var varList = Blockly.Variables.allVariables();

    if (checkDoubleAst == true){ // double pointer
        for(var temp = 0 ; temp < varList.length ; temp++) {
            if (varName == varList[temp].name) {
                var type = varList[temp].type;
                if (type == 'dbint') {
                    typeCode = '%d';
                } else if (type == 'dbunsigned int') {
                    typeCode = '%u';
                } else if (type == 'dbfloat') {
                    typeCode = '%f';
                } else if (type == 'dbdouble') {
                    typeCode = '%f';
                } else if (type == 'dbchar') {
                    typeCode = '%c';
                }
                return typeCode;
            }
        }
        return typeCode;
    } else { // single pointer(*) or normal pointer block
        for (var temp = 0; temp < varList.length; temp++) {
            if (varName == varList[temp][2]) {
                var type = varList[temp][0];
                if (varList[temp][5] == '*') {
                    if (type == 'int') {
                        typeCode = '%d';
                    } else if (type == 'unsigned int') {
                        typeCode = '%u';
                    } else if (type == 'float') {
                        typeCode = '%f';
                    } else if (type == 'double') {
                        typeCode = '%f';
                    } else if (type == 'char') {
                        typeCode = '%c';
                    }
                    return typeCode;
                } else {
                    if (type == 'dbchar') {
                        typeCode = '%s';
                    } else {
                        typeCode = '%p';
                    }
                    return typeCode;
                }
            }
        }
    }
};

Blockly.PythonTutor.arrTypeCheckInScan = function(varName, childConnection) {
    var typeCode = '';
    var childBlock = childConnection.targetBlock();
    var arrList = Blockly.Variables.getVariableBlocks({dist: 'a'});

    for(var temp = 0 ; temp < arrList.length ; temp++) {
        var option = arrList[temp].name;
        var type = Blockly.FieldDropdown.prototype.getTypefromVars(option , "type");

        var arrIdxLength = arrList[temp].spec[0];
        var inputLength = childBlock.getInputIdxLength();

        // type: variable
        if (arrIdxLength == inputLength) {
            if (type == 'int') {
                typeCode = '%d';
            } else if (type == 'unsigned int') {
                typeCode = '%u';
            } else if (type == 'float') {
                typeCode = '%f';
            } else if (type == 'double') {
                typeCode = '%f';
            } else if (type == 'char') {
                typeCode = '%c';
            } else if (type == 'dbchar') {
                typeCode = '%s';
            }
            return typeCode;
        }
        // type: pointer
        else if ((arrIdxLength > inputLength) && (arrList[temp].type == 'char')) {
            typeCode = '%s';
            return typeCode;
        }
        else {
            if (childConnection.isSuperior()) {
                childConnection.targetBlock().setParent(null);
            } else {
                childConnection.sourceBlock_.setParent(null);
            }
            // Bump away.
            childConnection.sourceBlock_.bumpNeighbours_();
        }
    }
    return typeCode;
};

Blockly.PythonTutor['comment'] = function(block) {
    // Comment statement
    var argument = '';
    var code = '';
    var numOfLine = 0;

    for (var n = 0; n <= block.commentAddCount_; n++) {
        argument = Blockly.PythonTutor.valueToCode(block, 'VAR' + n,
            Blockly.PythonTutor.ORDER_NONE) || '';

        var childConnection = block.inputList[n].connection;
        var childBlock = childConnection.targetBlock();

        if(childBlock){
            var childBlockType = childBlock.type;

            if (childBlockType != 'library_stdio_text')
            {
                if (childConnection.isSuperior()) {
                    childConnection.targetBlock().setParent(null);
                } else {
                    childConnection.sourceBlock_.setParent(null);
                }
                // Bump away.
                childConnection.sourceBlock_.bumpNeighbours_();
            }
        }
        if(argument != ''){
            code += argument + '\n';
        }
        numOfLine += 1;
    } // for loop end

    if (numOfLine == 1){
        if(argument != '')
            code = '//' + code;
        else
            code = '//\n';
    } else {
        code = '/*\n' + code + '*/\n';
    }

    return code;
};