//setting
var log = true;


//reference
var historySit = true;
var signs = {'divide': '%C3%B7', 'multiple': '%C3%97'};

var historyLogArr = [];
var shadowBoxNum = {'historyBtn': 0};
var setIntervalArr = {'historyBtn': null};
var historyLogDiv = document.getElementById("historyLog");

//functions
function calculate(algebra, act = false) {
    if (act) {
        clearSecondDisplay();
        addToSecondDisplay(algebra);
        historyLogArr.push(algebra);
    }

    algebra = encodeURI(algebra);
    while (algebra.indexOf(signs['divide']) > -1) {
        algebra = algebra.replace(signs['divide'], '/');
    }
    while (algebra.indexOf(signs['multiple']) > -1) {
        algebra = algebra.replace(signs['multiple'], '*');
    }


    if (algebra.indexOf("(") > -1) {
        let parStart = algebra.indexOf("(");
        let parEnd = algebra.indexOf(")");
        let length = parEnd - parStart;
        let newAlgebra = algebra.substr(parStart + 1, length - 1);
        newAlgebra = calculate(newAlgebra);

        // console.log("--->", newAlgebra, algebra);


        let preChar = algebra.substr(algebra.indexOf("(") - 2, 1);
        if (preChar < 10 || preChar == ')') {
            if (algebra.indexOf("(") != 0) {
                // console.log("<***", algebra.substr(algebra.indexOf("(") - 2));
                newAlgebra = '*' + newAlgebra;
            }
        }
        let nextChar = algebra.substr(algebra.indexOf(")") + 1, 1);
        if (nextChar < 10 || nextChar == '(') {
            if (nextChar != '') {

                // console.log("***>", algebra.substr(algebra.indexOf(")") + 1));
                newAlgebra = newAlgebra + '*';
            }
        }

        algebra = algebra.replace('(' + algebra.substr(parStart + 1, length - 1) + ')', newAlgebra);
        // console.log("---------->", algebra);

        // alert(algebra);

        // return false;
    }

    let nextRound = true;
    let i = 0;
    let char;


    while (nextRound) {
        char = algebra.substr(i, 1);
        nextRound = false;

        if (char == "/") {
            algebra = divide(algebra);
            i = -1;
            continue;
        }
        if (char == "*") {
            algebra = multiple(algebra);
            i = -1;
            continue;
        }

        if (algebra.indexOf('*') > -1) {
            nextRound = true;
        }
        if (algebra.indexOf('/') > -1) {
            nextRound = true;
        }
        i += 1
    }

    algebra = solveAllPlusAndMinus(algebra);

    console.log(algebra);
    if (act) {
        clearDisplay();
        addToDisplay(algebra);
        historyLogArr.push(algebra);
        log_history();

    }
    return algebra;
}

function solveAllPlusAndMinus(algebra) {
    let parts = [];
    let z = 0;
    for (let i = 0; i < algebra.length; i++) {
        let char = algebra.substr(i, 1);

        if (i != 0) {
            if (char == '-' || char == '+') {
                parts[z] = parseFloat(parts[z]);
                z += 1;
            }
        }

        parts[z] = (parts[z] == undefined ? '' : parts[z]) + char;


    }
    parts[z] = parseFloat(parts[z]);

    algebra =eval(parts.join('+'));
    return algebra;
}

function addToDisplay(adding) {
    var display = document.getElementById('display');
    var displayTxt = document.getElementById('display').innerText;
    display.innerText = displayTxt + adding;
}

function addToSecondDisplay(adding) {
    var display = document.getElementById('seconddisplay');
    var displayTxt = document.getElementById('seconddisplay').innerText;
    display.innerText = displayTxt + adding;
}

function clearSecondDisplay() {
    let display = document.getElementById('seconddisplay');
    display.innerText = '';

}

function clearDisplay() {
    let display = document.getElementById('display');
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
        clearSecondDisplay();
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
        calculate(document.getElementById('display').innerText, true);
    }
    if (event.key == "h") {
        historyToggle();
    }
    // alert(event.key);
}

function multiple(algebra) {
    let multiplePos = {'start': 0, 'sign': algebra.indexOf("*"), 'end': algebra.length - 1};
    for (let i = multiplePos['sign'] - 1; i > 0; i--) {
        if (algebra.substr(i, 1) == "/" || algebra.substr(i, 1) == "*"||algebra.substr(i, 1) == "-"||algebra.substr(i, 1) == "+") {
            multiplePos['start'] = i + 1;
            break;
        }
    }
    for (let i = multiplePos['sign'] + 1; i < multiplePos['end']; i++) {
        if (algebra.substr(i, 1) == "/" || algebra.substr(i, 1) == "*"||algebra.substr(i, 1) == "-"||algebra.substr(i, 1) == "+") {
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
    for (let i = dividePos['sign'] - 1; i > 0; i--) {
        if (algebra.substr(i, 1) == "/" || algebra.substr(i, 1) == "*"||algebra.substr(i, 1) == "-"||algebra.substr(i, 1) == "+") {

            dividePos['start'] = i + 1;
            break;
        }
    }
    for (let i = dividePos['sign'] + 1; i < dividePos['end']; i++) {
        if (algebra.substr(i, 1) == "/" || algebra.substr(i, 1) == "*"||algebra.substr(i, 1) == "-"||algebra.substr(i, 1) == "+") {

            dividePos['end']
                = i - 1;
            break;
        }
    }
    let algabraNew = algebra.substr(dividePos['start'], dividePos['end'] - dividePos['start'] + 1);
    let dividend = parseFloat(algabraNew.substr(0, algabraNew.indexOf('/')));
    let divisor = parseFloat(algabraNew.substr(algabraNew.indexOf('/') + 1));
    let quotient = dividend / divisor;
    if (log) {
        console.log(algebra, algabraNew, quotient);
    }
    algebra = algebra.replace(algabraNew, quotient);
    return algebra;

}

function historyToggle() {
    document.getElementById('historyBtn').blur();
    if (historySit) {
        rotateGlob('historyBtn');
        historyLogDiv.style.display = 'block';
    } else {
        clearInterval(setIntervalArr['historyBtn']);
        historyLogDiv.style.display = 'none';

    }
    historySit = !historySit;
}

function log_history() {
    historyLogDiv.innerText = '';
    for (var i = 0; i < historyLogArr.length; i++) {
        if (i % 2 == 0) {
            historyLogDiv.innerText = historyLogDiv.innerText + "\n" + historyLogArr[i] + ' = ' + historyLogArr[i + 1];
        }
    }
}

// motion function
function rotateGlob(globeId) {
    setIntervalArr[globeId] = setInterval(function changeShadoBox() {
        var element = document.getElementById(globeId);
        element.style.boxShadow = 'inset ' + shadowBoxNum[globeId] + 'px 0px 20px 3px #bed4e1';
        shadowBoxNum[globeId] += 1;
        if (shadowBoxNum[globeId] > 100) {
            shadowBoxNum[globeId] = -100;
        }
    }, 1);
}

