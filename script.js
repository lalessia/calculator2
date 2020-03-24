var ans = 0
var arrInput = [];
var result = [];
var lastResult = 0;

$( document ).ready(function() {
    arrInput[0] = '|';
    setInputOnMonitor();
});

function setInputOnMonitor(newInput, input){
    $("#strinput").remove();
    $('#inputByUser').append('<div id="strinput"></div>');

    var strInput = '';
    for(var i = 0; i < arrInput.length; i++) {
        if(arrInput[i] == "pi"){
            strInput += '&#960;';
        }else if(arrInput[i]=='ANS'){
            strInput += 'ANS';
            arrInput[i] = lastResult;
        }else if(arrInput[i] == 'sqrt2' || arrInput[i] == 'sqrtn'){
            strInput += '&radic;(';
        }else{
            strInput += arrInput[i];
        }
    }
    $("#strinput").append(strInput);
}

function shiftPipeToLeft(){
    var pipePosition = arrInput.indexOf('|');
    if(pipePosition > 0){
        arrInput.splice(pipePosition, 1);
        arrInput.splice(pipePosition - 1, 0, "|");
    }
    setInputOnMonitor();
}

function shiftPipeToRight(){
    var pipePosition = arrInput.indexOf('|');
    if(pipePosition < arrInput.length){
        arrInput.splice(pipePosition, 1);
        // if(arrInput[pipePosition] === '</sup>'){
        //     arrInput.splice(pipePosition + 2, 0, "|");
        // }else{
            arrInput.splice(pipePosition + 1, 0, "|");
        //}
    }

    pipePosition = arrInput.indexOf('|');
    for(var i = arrInput.length - 1; i >= 0; i--){
        if(arrInput[i]==='</sup>' && arrInput[i+2] === 'sqrtn'){
            arrInput.splice(pipePosition, 1);
            arrInput.splice(pipePosition + 2, 0, "|");
            break;
        }else if (arrInput[i]=='<sup>'){
            arrInput.splice(pipePosition, 1);
            arrInput.splice(pipePosition + 1, 0, "</sup>");
            arrInput.splice(pipePosition + 1, 0, "|");
        }
    }
    setInputOnMonitor();
}

function getInput(input) {
    var pipePosition = arrInput.indexOf('|');
    if (input === 'e<sup>'){
        arrInput.splice(pipePosition, 0, 'e');
        arrInput.splice(pipePosition + 1, 0, '<sup>');
    } //caso radice n-esima
    else if(input.substring(0, 12)==='<sup>|</sup>'){
        //elimino il pipe da il fondo e lo rimetto solo in alto
        arrInput.splice(pipePosition, 1);
        //al primo touch a destra riposiziona dopo la radice
        arrInput.splice(pipePosition, 0, '<sup>');
        arrInput.splice(pipePosition + 1, 0, '|');
        arrInput.splice(pipePosition + 2, 0, '</sup>');
        arrInput.splice(pipePosition + 3, 0, input.substring(12,17));
    }else {
        arrInput.splice(pipePosition, 0, input);
    }
    setInputOnMonitor();
}

function removeLastInput(){
    if(arrInput[arrInput.length - 1].length === 1){
        arrInput.splice(arrInput.length - 1, 1);
    } else{
        arrInput[arrInput.length - 1] = arrInput[arrInput.length - 1].substring(0, arrInput[arrInput.length - 1].length-1);
    }
    setInputOnMonitor();
}

function removeInput(){
    arrInput = [];
    arrInput[0] = '|';
    result = [];
    $("#result").empty();
    setInputOnMonitor();
}

//BEGIN ERROR IN EXPRESSION
function areBracketsCorrect(){
    var openBrackets = 0;
    var lastInputIsOpenBracket = false;
    var areCorrect = true;

    for(var i = 0; i < arrInput.length; i++){
        if(arrInput[i] == '('){
            openBrackets++;
            lastInputIsOpenBracket = true;
        }
        else if(arrInput[i] == ')'){
            openBrackets--;
            if(openBrackets < 0 || lastInputIsOpenBracket){
                result = ['Error'];
                areCorrect = false;
                setInputOnMonitor();
                break;
            }
        }
        else{
            lastInputIsOpenBracket = false;
        }
    }

    if(openBrackets == 1){
        getInput(')');
    }else if(openBrackets > 1){
        result = ['Error'];
        areCorrect = false
        setInputOnMonitor();
    }

    return areCorrect;
}
//END ERROR IN EXPRESSION

function errorsInExpression(){
    if(!areBracketsCorrect()){
        return true
    }
    return false;
}

function countOpenBracket(){
    var openBrackets = 0;
    for(var i = 0; i < result.length; i++){
        if(result[i] === '('){
            openBrackets++;
        }
    }
    return openBrackets;
}

function checkOperationByBrackets(){
    var nestestOpenBracket = 0;
    var nestestCloseBracket = 0;
    var subArray = [];

    for(var i = 0; i < result.length; i++){
        if(result[i] === '('){
            nestestOpenBracket = i;
        }
        else if(result[i] === ')'){
            nestestCloseBracket = i;
            break;
        }
    }
    subArray[0] = nestestOpenBracket;
    subArray[1] = nestestCloseBracket;
    return subArray;
}

function makeOperationsOnSingleNumber(res, i){
    if(res[0] == '-' && !isNaN(parseFloat(res[1]))){
        res.splice(0, 2, res[0] + res[1]);
    }
    else if(res[i] == '.' && (isNaN(res[i-1]) || i == 0) && (!isNaN(res[i+1]))){
        res.splice(i, 2, '0' + res[i] + res[i+1]);
    }
    else if(res[i] == '!'){
        if(i == 0 || !(Number.isInteger(parseFloat(res[i-1])))) {
            return;
        } else{
            var number = parseInt(res[i-1]);
            var fact = 1;
            if (number > 0){
                for(var j = 1; j <= res[i-1]; j++){
                    fact *= j;
                }
            }
            res.splice(i-1, 2, fact);
        }
    }
    else if(res[i] == '<sup>2</sup>'){
        var power = parseInt(res[i].substring(5,6));
        var base = parseFloat(res[i-1]);
        var exponentiation = Math.pow(base, power);
        res.splice(i-1, 2, exponentiation);
    }
    else if(res[i] == '<sup>-1</sup>'){
        var power = -1;
        var base = parseFloat(res[i-1]);
        var exponentiation = Math.pow(base, power);
        res.splice(i-1, 2, exponentiation);
    }
    else if(res[i] == '<sup>' && res[i+3] !== "sqrtn"){
        var power = res[i + 1];
        var base = parseFloat(res[i-1]);
        if(res[i - 1] === 'e'){
            base = Math.exp(1);
        }else {
            base = parseFloat(res[i-1]);
        }
        var exponentiation = Math.pow(base, power);
        res.splice(i-1, 4, exponentiation);
    }
    else if(res[i] === 'sqrtn'){
        var base = res[i+1];
        var exp = 1/res[i-2];
        var sqrtn = Math.pow(base, 1/res[i-2]);
        res.splice(i-3, 5, sqrtn);
        console.log(sqrtn);
    }
    else if(res[i] == 'pi'){
        res[i] = Math.PI;
    }else if(res[i] == 'sqrt2' && !isNaN(res[i+1])){
        var sqrt = Math.sqrt(res[i+1]);
        res.splice(i, 2, sqrt);
    }else if(res[i] == 'sen(' && !isNaN(res[i+1])){
        var sin = Math.sin((res[i+1] * Math.PI)/ 180);
        res.splice(i, 2, sin);
    }else if(res[i] == 'cos(' && !isNaN(res[i+1])){
        var cos = Math.cos((res[i+1] * Math.PI)/ 180);
        res.splice(i, 2, cos);
    }else if(res[i] == 'tg(' && !isNaN(res[i+1])){
        var tan = Math.tan((res[i+1] * Math.PI)/ 180);
        res.splice(i, 2, tan);
    }else if(res[i] == 'arcsin(' && !isNaN(res[i+1])){
        var asin = ((Math.asin(res[i+1])) * 180) / Math.PI;
        res.splice(i, 2, asin);
    }else if(res[i] == 'arccos(' && !isNaN(res[i+1])){
        var acos = ((Math.acos(res[i+1])) * 180) / Math.PI;
        res.splice(i, 2, acos);
    }else if(res[i] == 'arctg(' && !isNaN(res[i+1])){
        var atan = ((Math.atan(res[i+1])) * 180) / Math.PI;
        res.splice(i, 2, atan);
    }else if(res[i] == 'ln(' && !isNaN(res[i+1])){
        var ln = Math.log(res[i+1]);
        res.splice(i, 2, ln);
    }else if(res[i] == 'log(' && !isNaN(res[i+1])){
        var log = Math.log10(res[i+1]);
        res.splice(i, 2, log);
    }
}

function doCalculation(subArr){
    //controllare che le parentesi non inizino per *, /, !
    var res = result.slice(subArr[0] + 1, subArr[1]);
    var itemsToBeReplaced = subArr[1] - subArr[0] + 1;
    var subres;

    for(var i = 0; i < res.length; i++){
        makeOperationsOnSingleNumber(res, i);
    }

    var i = 0;
    while(i < res.length){
        if(res[i]=="*"){
            subres = res[i - 1] * res[i + 1];
            res.splice(i-1, 3, subres);
        }
        if(res[i]=="/"){
            subres = res[i - 1] / res[i + 1];
            res.splice(i-1, 3, subres);
        }
        i++;
    }

    var j = 0
    while(j < res.length && res.length > 2){
        if(res[j]=="+"){
            subres = parseFloat(res[j - 1]) + parseFloat(res[j + 1]);
            res.splice(j-1, 3, subres);
        }
        if(res[j]=="-"){
            subres = parseFloat(res[j - 1]) - parseFloat(res[j + 1]);
            res.splice(j-1, 3, subres);
        }
        j++;
    }
    if(res.length == 2 && (res[0] == '-' || res[0] == '+') && !isNaN(res[1])){
        res[0] = res[0] + res[1];
    }

    result.splice(subArr[0], itemsToBeReplaced, res[0]);
}

function executeOperation(){
    var openBrackets = countOpenBracket();
    var subArr = []
    for(var i = 0; i < openBrackets; i++){
        subArr = checkOperationByBrackets();
        doCalculation(subArr);
    }
    arrInput = [];
    printResult();
}

function printResult(){
    if(result.length == 2 && (result[0] == '-' || result[0] == '+') && !isNaN(result[1])){
        if(result[0] == '-'){
            subres = res[0] + res[1];
            res.splice(0, 2, subres);
        }
        lastResult = result[0];
    } else if(isNaN(parseFloat(result[0]))){
        result = ['Error'];
    } else{
        lastResult = result[0];
    }
    $("#result").empty();
    $('#result').append(result[0]);
}

function removePipe(){
    var index = arrInput.indexOf('|');
    arrInput.splice(index, 1);
}

function mergeNumber(){
    if(arrInput.length > 0){
        var lastValue;
        var i = 0
        while(i <= arrInput.length){
            lastValue = arrInput[i];
            //se l'ultimo valore preso in considerazione e il successivo sono entrambi numeri
            // if(!isNaN(lastValue) && !isNaN(arrInput[i + 1])){
            //     arrInput.splice(i, 2, lastValue + arrInput[i + 1])
            // }
            if(!isNaN(lastValue)){
                var j = i;
                while (!isNaN(arrInput[j + 1])) {
                    j++;
                }
                for(var q = i+1; q <= j; q++){
                    console.log(arrInput[q]);
                    lastValue = lastValue + arrInput[q];
                }
                replace = j - i +1;
                arrInput.splice(i, replace, lastValue);
            }
            i++;
        }
    }
}

function getResult(){
    removePipe();
    mergeNumber();
    if(!errorsInExpression()){
        result = arrInput.slice();
        result.splice(0, 0, '(');
        result.splice(result.length, 0, ')');
        executeOperation();
    } else{
        printResult();
    }
}

function inprogress(){
    alert('working in progress')
}
