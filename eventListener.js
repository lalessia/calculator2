//https://keycode.info/
//https://www.w3schools.com/jsref/event_key_keycode.asp
document.addEventListener('keydown', function(event) {
    if(event.keyCode == 8) {
        removeLastInput();
    }else if(event.keyCode == 37){
        shiftPipeToLeft();
    }else if(event.keyCode == 39){
        shiftPipeToRight();
    }
    else if(event.keyCode == 40) {
        alert('( was pressed');
    }
    else if(event.keyCode == 13) {
        getResult();
    }
    else if(event.keyCode == 48) {
        getInput('0');
    }
    else if(event.keyCode == 49) {
        getInput('1');
    }
    else if(event.keyCode == 50) {
        getInput('2');
    }
    else if(event.keyCode == 51) {
        getInput('3');
    }
    else if(event.keyCode == 52) {
        getInput('4');
    }
    else if(event.keyCode == 53) {
        getInput('5');
    }
    else if(event.keyCode == 54) {
        getInput('6')
    }
    else if(event.keyCode == 55) {
        getInput('7');
    }
    else if(event.keyCode == 56) {
        getInput('8');
    }
    else if(event.keyCode == 57) {
        getInput('9');
    }
    else if(event.keyCode == 94) {
        alert('^ was pressed');
    }
    else if(event.keyCode == 187) {
        getInput('+');
    }
    else if(event.keyCode == 189) {
        getInput('-');
    }
    else if(event.keyCode == 221) {
        getInput('*');
    }
    else if(event.keyCode == 220) {
        getInput('/');
    }
    else if(event.keyCode == 188) {
        alert(', was pressed');
    }
});
