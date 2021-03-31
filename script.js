var log = true;

function calculate(algebra) {
    algebra = encodeURI(algebra);
    let signs = {'divide': '%C3%B7', 'multiple': '%C3%97'};


    while (algebra.indexOf(signs['divide']) > -1) {
        algebra = algebra.replace(signs['divide'], '/');
    }
    while (algebra.indexOf(signs['multiple']) > -1) {
        algebra = algebra.replace(signs['multiple'], '*');
    }


    // if (algebra.indexOf("(") > -1) {
    //     let parStart = algebra.indexOf("(");
    //     let parEnd = algebra.indexOf(")");
    //     let length = parEnd - parStart;
    //     let newAlgebra = algebra.substr(parStart, length + 1);
    //     algebra.replace(newAlgebra, calculate(newAlgebra));
    // }
    var nextRound = true;
    var i = 0;
    var char;
    // for ( i = 0; i < algebra.length; i++) {
    while (nextRound) {
        char = algebra.substr(i, 1);
        console.log(char, i)
        nextRound = false;

        //
        // if (char == "+") {
        //     algebra = sum(algebra);
        //     i = 0;
        //
        // }
        if (char == "/") {
            algebra = divide(algebra);
            i = -1;
        }
        if (char == "*") {
            algebra = multipl(algebra);
            i = -1;
        }

        if (algebra.indexOf('*') > -1) {
            nextRound = true;
        }
        if (algebra.indexOf('/') > -1) {
            nextRound = true;
        }
        i += 1
    }
    nextRound = true;
    i = 0;
    while (nextRound) {
        char = algebra.substr(i, 1);
        console.log(char, i)
        nextRound = false;

        //
        // if (char == "+") {
        //     algebra = sum(algebra);
        //     i = 0;
        //
        // }
        if (char == "+") {
            algebra = sum(algebra);
            i = -1;
        }
        if (char == "-") {
            algebra = minus(algebra);
            i = -1;
        }

        if (algebra.indexOf('+') > -1) {
            nextRound = true;
        }
        if (algebra.indexOf('-') > -1) {


            nextRound = true;
            if (algebra.substr(0, 1) == '-') {
                nextRound = false;
            }
        }
        i += 1;
    }


    console.log(algebra);
}

function addToDisplay(adding) {
    var display = document.getElementById('display');
    var displayTxt = document.getElementById('display').innerText;
    display.innerText = displayTxt + adding;
}

function clearDisplay() {
    var display = document.getElementById('display');
    display.innerText = '';

}

function BackspaceDisplay() {
    let display = document.getElementById('display');
    let str = display.innerText;
    display.innerText = str.substring(0, str.length - 1);

}

function keyCode(event) {
    if (event.key < 10) {
        addToDisplay(event.key);

    }
    if (event.key == "Escape") {
        clearDisplay();
    }
    if (event.key == "+") {
        // addToDisplay('&plus;');
        addToDisplay('+ ');
    }
    if (event.key == "-") {
        addToDisplay('-');

    }
    if (event.key == "/") {
        addToDisplay(decodeURI('%C3%B7'));
    }
    if (event.key == ")") {
        addToDisplay(decodeURI(')'));
    }
    if (event.key == "(") {
        addToDisplay(decodeURI('('));
    }
    if (event.key == "*" || event.key == "x") {
        addToDisplay(decodeURI('%C3%97'));
    }
    if (event.key == "Backspace") {
        BackspaceDisplay();
    }
    if (event.key == "Enter") {
        calculate(document.getElementById('display').innerText);
    }
    // alert(event.key);
}

function multipl(algebra) {
    let multiplePos = {'start': 0, 'sign': algebra.indexOf("*"), 'end': algebra.length - 1};
    // console.log()
    for (var i = multiplePos['sign'] - 1; i > 0; i--) {
        if (algebra.substr(i, 1) == "+" || algebra.substr(i, 1) == "-" || algebra.substr(i, 1) == "/" || algebra.substr(i, 1) == "*") {
            multiplePos['start'] = i + 1;
            break;
        }
    }
    for (var i = multiplePos['sign'] + 1; i < multiplePos['end']; i++) {
        if (algebra.substr(i, 1) == "+" || algebra.substr(i, 1) == "-" || algebra.substr(i, 1) == "/" || algebra.substr(i, 1) == "*") {
            multiplePos['end'] = i - 1;
            break;
        }
    }
    let algabraNew = algebra.substr(multiplePos['start'], multiplePos['end'] - multiplePos['start'] + 1);
    let part1 = parseFloat(algabraNew.substr(0, algabraNew.indexOf('*'))).toFixed(20);
    let part2 = parseFloat(algabraNew.substr(algabraNew.indexOf('*') + 1)).toFixed(20);
    let multiple = part1 * part2;
    if (log) {
        console.log(algebra, algabraNew, multiple);
    }
    algebra = algebra.replace(algabraNew, multiple);
    return algebra;

}

function divide(algebra) {
    let dividePos = {'start': 0, 'sign': algebra.indexOf("/"), 'end': algebra.length - 1};
    for (var i = dividePos['sign'] - 1; i > 0; i--) {
        if (algebra.substr(i, 1) == "+" || algebra.substr(i, 1) == "-" || algebra.substr(i, 1) == "/" || algebra.substr(i, 1) == "*") {
            dividePos['start'] = i + 1;
            break;
        }
    }
    for (var i = dividePos['sign'] + 1; i < dividePos['end']; i++) {
        if (algebra.substr(i, 1) == "+" || algebra.substr(i, 1) == "-" || algebra.substr(i, 1) == "/" || algebra.substr(i, 1) == "*") {
            dividePos['end']
                = i - 1;
            break;
        }
    }
    let algabraNew = algebra.substr(dividePos['start'], dividePos['end'] - dividePos['start'] + 1);
    let dividend = parseFloat(algabraNew.substr(0, algabraNew.indexOf('/')));
    let divisor = parseFloat(algabraNew.substr(algabraNew.indexOf('/') + 1));
    let quotient = dividend/ divisor;
    if (log) {
        console.log(algebra, algabraNew, quotient);
    }
    algebra = algebra.replace(algabraNew, quotient);
    return algebra;

}

function sum(algebra) {
    let sumPos = {'start': 0, 'sign': algebra.indexOf("+"), 'end': algebra.length - 1};
    // console.log()
    for (var i = sumPos['sign'] - 1; i > 0; i--) {
        if (algebra.substr(i, 1) == "+" || algebra.substr(i, 1) == "-" || algebra.substr(i, 1) == "/" || algebra.substr(i, 1) == "*") {
            sumPos['start'] = i + 1;
            break;
        }
    }
    for (var i = sumPos['sign'] + 1; i < sumPos['end']; i++) {
        if (algebra.substr(i, 1) == "+" || algebra.substr(i, 1) == "-" || algebra.substr(i, 1) == "/" || algebra.substr(i, 1) == "*") {
            sumPos['end']
                = i - 1;
            break;
        }
    }
    let algabraNew = algebra.substr(sumPos['start'], sumPos['end'] - sumPos['start'] + 1);
    let part1 = parseFloat(algabraNew.substr(0, algabraNew.indexOf('+')));
    let part2 = parseFloat(algabraNew.substr(algabraNew.indexOf('+') + 1));
    let sum = part1  + part2;
    if (log) {
        console.log(algebra, algabraNew, sum);
    }
    algebra = algebra.replace(algabraNew, sum);
    return algebra;
}

function minus(algebra) {
    let minusPos = {'start': 0, 'sign': algebra.indexOf("-"), 'end': algebra.length - 1};
    // console.log()
    for (var i = minusPos['sign'] - 1; i > 0; i--) {
        if (algebra.substr(i, 1) == "+" || algebra.substr(i, 1) == "-" || algebra.substr(i, 1) == "/" || algebra.substr(i, 1) == "*") {
            minusPos['start'] = i + 1;
            break;
        }
    }
    for (var i = minusPos['sign'] + 1; i < minusPos['end']; i++) {
        if (algebra.substr(i, 1) == "+" || algebra.substr(i, 1) == "-" || algebra.substr(i, 1) == "/" || algebra.substr(i, 1) == "*") {
            minusPos['end']
                = i - 1;
            break;
        }
    }
    let algabraNew = algebra.substr(minusPos['start'], minusPos['end'] - minusPos['start'] + 1);
    let part1 = parseFloat(algabraNew.substr(0, algabraNew.indexOf('-')));
    let part2 = parseFloat(algabraNew.substr(algabraNew.indexOf('-') + 1));
    let minus = part1 - part2;
    if (log) {
        console.log(algebra, algabraNew, minus);
    }
    algebra = algebra.replace(algabraNew, minus);
    return algebra;
}
