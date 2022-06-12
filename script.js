const htmlText = $("#text")
const htmlPointer = $("#pointer")

let words = [
    "pai", "m\u00e3e", "filho", "cachorro", "irm\u00e3o", "irm\u00e3", "empresa", "fam\u00edlia", "pa\u00eds", "pais", "casa", "chute", "bola", "carro", "preto", "branco", "amarelo", "vermelho", "azul", "cinza", "verde", "santos", "verdade", "falso", "quantidade", "em", "n\u00e3o", "sim", "poder", "minist\u00e9rio", "mist\u00e9rio", "camisa", "felicidade", "comida", "prazer", "comest\u00edvel", "vandalo", "fantasma", "porco", "colete", "jogar", "tudo", "esperar", "todo", "nada", "nem", "haver", "grande", "feliz", "sublime", "oni", "nojo", "triste", "tristeza", "parecer", "ficar", "fazer", "comer", "fora", "dj", "arana", "pop", "smoke", "pequeno", "grande", "pin\u00f3quio", "deserto", "chap\u00e9u", "tubo", "teste", "valorant", "elsword", "minecraft", "comunidade", "cringe"
]

let htmlObjective;

let lineHeight;
let actualText;
let objective;
let input;
let pointer;

init(50)

$(document).on('keydown', e => keyHandler(e))

function init(wordQuantity) {
    htmlObjective = []
    actualText = []
    objective = []
    input = []
    pointer = 0

    for (let i = 0; i < wordQuantity; i++) {
        input.push("")
        actualText.push("")
        objective.push(words[ Math.floor(Math.random() * wordQuantity) ])
        htmlObjective.push(`<span class="word">${objective[ i ]}</span>`)
    }

    htmlText.html(htmlObjective.join(" "))
    lineHeight = $(htmlText.children()[ 0 ]).height()
    autoScroll()
}

// Trata de todos inputs 
function keyHandler(e) {
    let isValidInput = /^.$/u.test(e.key)

    if (isValidInput) {
        inputHandler(e.key)
    } else if (e.key == 'Backspace') {
        let canDelete = input[ pointer ].length > 0
        let canGoBack = input[ pointer - 1 ] && !(input[ pointer - 1 ] == objective[ pointer - 1 ])

        if (canDelete) {
            input[ pointer ] = input[ pointer ].substring(0, input[ pointer ].length - 1)
        } else if (canGoBack) {
            pointer--
        }
    }

    actualText[ pointer ] = charMatching(objective[ pointer ], input[ pointer ])
    $(htmlText.children()[ pointer ]).html(actualText[ pointer ]);
    autoScroll()
}

// Trata de inputs válidos
function inputHandler(key) {
    if (key == " ") {
        if (input[ pointer ].length > 0) {
            pointer++
        }
    } else if (input[ pointer ].length <= 16) {
        input[ pointer ] += key
    }

}

function charMatching(obj, inp) {
    let text = ""

    let isCorrect = obj == inp
    let biggestWord = Math.max(obj.length, inp.length)

    for (let i = 0; i < biggestWord; i++) {
        let inp_char = inp[ i ]
        let obj_char = obj[ i ]

        if (!obj[ i ]) {
            text += `<span class="overflow">${inp_char}</span>`
            continue
        }
        if (!inp[ i ]) {
            text += obj_char
            continue
        }
        if (inp_char == obj_char) {
            text += `<span class="correct">${obj_char}</span>`
        }
        if (inp_char != obj_char) {
            text += `<span class="incorrect">${obj_char}</span>`
        }

    }

    if (inp.length >= obj.length && !isCorrect) {
        $(htmlText.children()[ pointer ]).addClass("incorrect-word")
        return text
    } else {
        $(htmlText.children()[ pointer ]).removeClass("incorrect-word")
        return text
    }
}

function autoScroll() {
    let currentLine = Math.round(($(htmlText.children()[ pointer ]).offset().top - htmlText.offset().top) / lineHeight);

    $("#objective").scrollTop(lineHeight * currentLine - lineHeight + 1)
    pointerPosition()
}

function pointerPosition() {
    let currentWord = $(htmlText.children()[ pointer ]);
    let currentChar = $(currentWord.children()[ currentWord.children().length - 1 ]);

    let x, y;

    if (currentChar.length) {
        x = currentChar.offset().left + currentChar.width()
        y = currentChar.offset().top
    } else {
        x = currentWord.offset().left
        y = currentWord.offset().top
    }

    y += 2

    htmlPointer.css("top", `${y}px`)
    htmlPointer.css("left", `${x}px`)

    console.log(x, y);
    console.log(htmlPointer.position());
}