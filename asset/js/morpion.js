let canvas = document.getElementById('tic-tac-toe-board');
let context = canvas.getContext('2d');

let canvasSize = 400;
let sectionSize = canvasSize / 3;

context.translate(0.5, 0.5);
let Etatjeu = new Array();
let player = 1;
let lineColor = "#ddd";

function initMorpion() {
    canvas.width = canvasSize;
    canvas.height = canvasSize;
    canvas.classList.add('active');
    document.querySelector('.welcome-text').innerHTML = ``;
    document.querySelector('img').className = document.querySelector('img').className.replaceAll('52', '20');
    Etatjeu = [];
    clearBoard();
    drawLines(10, lineColor);

    canvas.addEventListener('mouseup', function(event) {
        let canvasMousePosition = getCanvasMousePosition(event);
        addPlayingPiece(canvasMousePosition);
        drawLines(10, lineColor);
    });
}



function RetireUnElement(liste, element) {
    liste[liste.indexOf(element)] = liste[0];
    liste.shift();
    return liste.sort()
}

function ListeReste(liste) {
    let Reste = new Array();
    for (i = 0; i < 9; i++) {
        if (liste.indexOf(i) == -1) {
            Reste.push(i)
        }
    }
    return Reste
}

function ListeFils(liste) {
    let Fils = new Array();
    Reste = ListeReste(liste);
    for (i = 0; i < Reste.length; i++) {
        Fils.push([Reste[i]]);
    }
    for (i = 0; i < Reste.length; i++) {
        Fils[i] = liste.concat(Fils[i]);
    }
    return Fils
}

function ListeFilsNiveau(liste, niveau) {
    if (niveau != 0) {
        let etat = new Array();
        let i;
        for (i = 0; i < 9 - liste.length; i++) {
            etat.push(ListeFilsNiveau(ListeFils(liste)[i], niveau - 1))
        }
        return etat;
    } else {
        return (liste)
    }
}

function Victoire(liste) {
    let l = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0)
    let n = (liste.length + 1) % 2;
    for (i = n; i < liste.length; i = i + 2) {
        l[liste[i]] = 1;
    }
    if ((l[0] == 1 && l[1] == 1 && l[2] == 1) || (l[3] == 1 && l[4] == 1 && l[5] == 1) || (l[6] == 1 && l[7] == 1 && l[8] == 1) || (l[0] == 1 && l[3] == 1 && l[6] == 1) || (l[1] == 1 && l[4] == 1 && l[7] == 1) || (l[2] == 1 && l[5] == 1 && l[8] == 1) || (l[0] == 1 && l[4] == 1 && l[8] == 1) || (l[2] == 1 && l[4] == 1 && l[6] == 1)) { return 1 } else { return 0 }
}

let seuil

function MeilleurCoup(liste, niveau) {
    if (niveau == 0) { seuil = ListeReste(liste).length - 1 }
    let Force = Math.pow(-1, niveau + 1);
    let force;
    let Coup = 9;
    let coup = 700;
    let i;
    for (i = 0; i < 9 - liste.length; i++) {
        if (niveau % 2 == 0) {
            force = Victoire(ListeFils(liste)[i]);
            if (force == 1) {
                return [force, ListeReste(liste)[i]]
            } else {
                if (niveau < seuil) {
                    force = MeilleurCoup(ListeFils(liste)[i], niveau + 1)[0];
                    if (force > Force) {
                        Force = force;
                        Coup = ListeReste(liste)[i];
                    }
                } else { return [Victoire(liste), ListeReste(liste)[0]] }
            }
        }
        if (niveau % 2 == 1) {
            force = -1 * Victoire(ListeFils(liste)[i]);
            if (force == -1) {
                return [force, ListeReste(liste)[i]]
            } else {
                if (niveau < seuil) {
                    force = MeilleurCoup(ListeFils(liste)[i], niveau + 1)[0];
                    if (force < Force) {
                        Force = force;
                        Coup = ListeReste(liste)[i];
                    }
                } else { return [Victoire(liste), ListeReste(liste)[0]] }
            }
        }
    }
    return [Force, Coup]
}

function ListeFilsMinMax(liste, niveau) {
    if (niveau != 0) {
        let etat = new Array();
        let i;
        for (i = 0; i < 9 - liste.length; i++) {
            etat.push((ListeFilsMinMax(ListeFils(liste)[i], niveau - 1)))
        }
        return etat;
    } else {
        return Victoire(liste)
    }
}

function Afficher(liste) {
    let a;
    let b;
    for (i = 0; i < liste.length; i++) {
        a = liste[i] % 3;
        b = (liste[i] - a) / 3;
        if (i % 2 == 0) {
            drawX(b * sectionSize, a * sectionSize);
        } else {
            drawO(b * sectionSize, a * sectionSize);
        }
    }

}

function jouer(liste, k) {
    if (Victoire(liste) == 1 || liste.length > 8) { replay(); } else {
        k = parseFloat(k);
        if (ListeReste(liste).indexOf(k) != -1) {
            liste.push(k);
            let list = new Array();
            let i;
            for (i = 0; i < liste.length; i++) { list.push(liste[i]) }
            if (liste.length < 9) {
                let l = MeilleurCoup(list, 0)[1];
                liste.push(l);
            }
            Afficher(liste);
            if (Victoire(liste) == 1) {
                document.querySelector('.game-state').innerText = 'Vous avez perdu !';
                replay();
            } else if (liste.length > 8) {
                document.querySelector('.game-state').innerText = 'Match nul !';
                replay();
            }
        }

    }
}

function replay() {
    Etatjeu = [];
    clearBoard();
    drawLines(10, lineColor);
}



function getInitialBoard(defaultValue) {
    let board = [];

    for (let x = 0; x < 3; x++) {
        board.push([]);

        for (let y = 0; y < 3; y++) {
            board[x].push(defaultValue);
        }
    }

    return board;
}

let board = getInitialBoard("");

function addPlayingPiece(mouse) {
    for (let x = 0; x < 3; x++) {
        for (let y = 0; y < 3; y++) {
            let xCordinate = x * sectionSize;
            let yCordinate = y * sectionSize;
            if (mouse.x >= xCordinate && mouse.x <= xCordinate + sectionSize && mouse.y >= yCordinate && mouse.y <= yCordinate + sectionSize) {
                let linearCordinate = ((x + 1) - 1) * 3 + (y + 1);
                jouer(Etatjeu, linearCordinate - 1);
            }
        }
    }
}

function clearBoard() {
    context.clearRect(0, 0, canvasSize, canvasSize);
}

function drawO(xCordinate, yCordinate) {
    let halfSectionSize = (0.5 * sectionSize);
    let centerX = xCordinate + halfSectionSize;
    let centerY = yCordinate + halfSectionSize;
    let radius = (sectionSize - 100) / 2;
    let startAngle = 0 * Math.PI;
    let endAngle = 2 * Math.PI;

    context.lineWidth = 10;
    context.strokeStyle = "#01bBC2";

    context.beginPath();
    context.arc(centerX, centerY, radius, startAngle, endAngle);
    context.stroke();
}

function drawX(xCordinate, yCordinate) {
    context.strokeStyle = "#f1be32";
    context.beginPath();

    let offset = 50;
    context.moveTo(xCordinate + offset, yCordinate + offset);
    context.lineTo(xCordinate + sectionSize - offset, yCordinate + sectionSize - offset);

    context.moveTo(xCordinate + offset, yCordinate + sectionSize - offset);
    context.lineTo(xCordinate + sectionSize - offset, yCordinate + offset);

    context.stroke();
}

function drawLines(lineWidth, strokeStyle) {
    let lineStart = 4;
    let lineLenght = canvasSize - 5;
    context.lineWidth = lineWidth;
    context.lineCap = 'round';
    context.strokeStyle = strokeStyle;
    context.beginPath();

    for (let y = 1; y <= 2; y++) {
        context.moveTo(lineStart, y * sectionSize);
        context.lineTo(lineLenght, y * sectionSize);
    }
    for (let x = 1; x <= 2; x++) {
        context.moveTo(x * sectionSize, lineStart);
        context.lineTo(x * sectionSize, lineLenght);
    }

    context.stroke();
}

function getCanvasMousePosition(event) {
    let rect = canvas.getBoundingClientRect();

    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    }
}