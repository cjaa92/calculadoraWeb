let runningOp = "", enableDot = true, result=0, isEnterHit = 0;

function registerElement(newReg){
    if(newReg.match(/[\d\.]/) && isEnterHit){
        runningOp = "";
    }
    isEnterHit = 0;
    let lastElement = (runningOp == 0)?"0":runningOp.split("").pop(); // Split para identificar el ultimo elemento insertado
    let lastNumber = runningOp.split(/[+x÷\-]/).pop(); 
    if(runningOp == "0" && newReg == "0"){ // validacion en caso de tener un cero inicial
        return 0;
    } else if(newReg == "." && enableDot){ //Validacion para punto en caso de que sea despues de un signo
        enableDot = false;
        if(runningOp == "" || lastElement.match(/[+x÷\-]/))
            runningOp = runningOp + "0.";
        else 
            runningOp = runningOp + ".";
    } else if(newReg == "." && !enableDot){ //Validacion para punto en caso de que sea despues de un signo
        return 0;
    } else if(newReg == "NEG"){ // Seccion de Negativo
        if(lastElement == ")"){ // En caso de que ya exista en negativo 
            runningOp = runningOp.slice(0,runningOp.length - lastNumber.length) + runningOp.slice(runningOp.length - lastNumber.length,runningOp.length).replace(/[\(\)\-]/g,'');
        } else { // o Solo ponerle el negativo
            runningOp = runningOp.slice(0,runningOp.length - lastNumber.length) + "(-" + lastNumber + ")";
        }
    } else if(newReg == "C"){ // Seccion de Clear
        runningOp = "";
        enableDot = true;
        result = 0;
    } else if(newReg == "DEL"){
        if(lastElement == ")"){// Caso para cuando existe un negativo
            if(lastNumber.length>3){//Evalua si solo estan los parentesis y el neg 
                if(runningOp.slice(0,runningOp.length - 1).split("").pop() == ".") // En caso de que se vaya a eliminar un punto habilitarlo de nuevo
                    enableDot = true;
                runningOp = runningOp.slice(0,runningOp.length - 2) + ")";
            } else { 
                runningOp = runningOp.replace('(-)', '');
            }
        } else if(runningOp != "") { // Evalua que no este vacio para eliminar uno
            runningOp = runningOp.slice(0,runningOp.length - 1);
            if(lastElement == ".") //Si se elimino punto, se habilita de nuevo
                enableDot = true;
            if(runningOp.split(/[+x÷\-]/).pop().match(/[\.]/)) //En caso de que haya eliminado signo, evalua si el valor anterior tiene punto o no
                enableDot = false;
        }
    } else if(newReg.match(/\d/)){ // Seccion de agregar digitos
        if(lastElement == ")"){ // Caso para cuando existe un negativo
            runningOp = runningOp.slice(0,runningOp.length - 1) + newReg + ")";
        } else if(lastNumber == "0"){
            runningOp = runningOp.slice(0,runningOp.length - 1) + newReg;
        } else {
            runningOp = runningOp + newReg;
        }
    } else if(newReg.match(/[+x÷\-]/)){ // Seccion de agregar operacion
        if(lastElement.match(/[+x÷\-]/)){ //En caso de que sea un signo lo sustituye
            runningOp = runningOp.slice(0,runningOp.length - 1) + newReg;
        } else {
            runningOp = runningOp + newReg;
        }
        enableDot = true; // con signo nuevo se resetea el poder poner punto
    }  else if(newReg == "="){ // Seccion para evaluar
        isEnterHit = 1;
        enableDot = 1;
    } else{
        $("#message").html('<div class="alert alert-danger" role="alert">Introdujo un valor invalido...</div>');
        $(".alert").delay(5000).slideUp(200, function () { $(this).alert("close"); });
        //alert("Introdujo un valor invalido...");
        return 0;
    }
    evalOpsRealTime();
}


function evalOpsRealTime(){
    $(`#runningOp`).html(`${runningOp}<span class="posi">|</span>`);
    let op = runningOp.replace('(-)', '');
    let lastElement = op.split("").pop()
    if(runningOp != ""){
        if(lastElement.match(/[x÷]/)){
            op = op + "1";
        } else if(lastElement.match(/[+\-]/)){
            op = op + "0";
        }
        op = op.replace(/x/g,"*").replace(/÷/g,"/");
        try{
            //console.log(op);
            result = eval(op);
            if(!isFinite(result)){
                result = "Error";
                $("#message").html('<div class="alert alert-danger" role="alert">Su resultado es indeterminado...</div>');
                $(".alert").delay(5000).slideUp(200, function () { $(this).alert("close"); });
                //alert("Su resultado es indeterminado...")
            }
        } catch(e){
            result = "Error";
            $("#message").html('<div class="alert alert-danger" role="alert">Existe un error en su operación...</div>');
            $(".alert").delay(5000).slideUp(200, function () { $(this).alert("close"); });
            //alert("Existe un error en su operación...");
        }
        $(`#result`).html(`${result}`);
        if(result != "Error" && isEnterHit){
            runningOp = result + "";
            $(`#runningOp`).html(`${runningOp}<span class="posi">|</span>`);
        }
    } else {
        $(`#result`).html(`0`);
    }
}


window.onkeyup = function(e) { // Seccion de captura de Keyboard
    let key = e.keyCode ? e.keyCode : e.which;
    let valKey = "";
    switch(key){
        case 8:
            valKey = "DEL";
            break;
        case 13:
        case 187:
            valKey = (e.key=="+")?"+":"=";
            break;
        case 46:
            valKey = "C";
            break;
        case 190:
        case 110:
            valKey = ".";
            break;
        case 107:
            valKey = "+";
            break;
        case 189:
        case 109:
            valKey = "-";
            break;
        case 191:
        case 111:
            valKey = "÷";
            break;
        case 56:
        case 88:
        case 106:
            valKey = (e.key=="8")?"8":"x";
            break;
        case 48:
        case 49:
        case 50:
        case 51:
        case 52:
        case 53:
        case 54:
        case 55:
        case 56:
        case 57:
            valKey = (key - 48) + "";
            break;
        case 96:
        case 97:
        case 98:
        case 99:
        case 100:
        case 101:
        case 102:
        case 103:
        case 104:
        case 105:
            valKey = (key - 96) + "";
            break;
        default:
            return 0;
    }
    //console.log(valKey);
    registerElement(valKey);
}