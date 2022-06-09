const lorem = `Lorem ipsum, dolor sit amet consectetur adipisicing elit. Magni ad voluptates aperiam suscipit eveniet consequatur in eos earum assumenda dolor excepturi omnis officia facilis ullam repudiandae, cum modi esse quas.`

let input = []
let objectiveText = []
let actualText = []
let pointer = 0
let lastKeyPress = 0
let line = 0;

const objective = document.querySelector("#objective")
const htmlPointer = document.querySelector("#pointer")

const afkDefault = 2000;

let words;
fetch("./words.json").then(r => {
    r.json().then((json) => {
        words = json

        for (let i = 0; i < 50; i++) {
            objectiveText.push(words[ parseInt(Math.random() * words.length - 1) ])
        }

        objective.innerHTML = objectiveText.join(" ")

        for (let i = 0; i < objectiveText.length; i++) {
            input.push("")
            actualText.push("")
        }

        pointerPos()
    })
})

function pointerPos() {
    autoScroll()
    let lastWord = objective.children[ objective.children.length - 1 ]
    let charPos;
    let x, y;

    if (!lastWord) {
        charPos = objective.getBoundingClientRect()

        x = charPos.left - 2
        y = charPos.top + 1
    } else {
        let lastChar = lastWord.children[ lastWord.children.length - 1 ]

        charPos = lastChar.getBoundingClientRect();
        x = charPos.left + charPos.width - 2
        y = charPos.top - 3
    }

    if (lastWord && input[ pointer ].length == 0) {
        x += 16
    }

    htmlPointer.style.left = `${x}px`
    htmlPointer.style.top = `${y}px`
}

function wordMatch(w1, w2) {
    return w1 == w2
}

function charMatch(w1, w2) {
    let res = "";
    let w1l = w1.length
    let w2l = w2.length
    let match = true

    if (w2l == 0) {
        return w1
    }


    for (let i = 0; i < w1l; i++) {

        if (w2[ i ] == undefined) {
            res += w1[ i ]
            continue
        }

        if (w1[ i ] == w2[ i ]) {
            res += `<span class="correct">${w2[ i ]}</span>`
        }

        if (w1[ i ] != w2[ i ]) {
            match = false
            res += `<span class="incorrect">${w1[ i ]}</span>`
        }

    }

    if (w2l > w1l) {
        let toBeIgnored = w2.substring(0, w1l)
        res += `<span class="overflow">${w2.replace(toBeIgnored, "")}</span>`
    }

    if (!match) {
        return `<span class="incorrect-word">${res}</span>`
    } else {
        return `<span class="word">${res}</span>`
    }
}

document.addEventListener("keydown", (e) => {
    if (e.key == ' ') {
        pointer++
    } else if (e.key == 'Backspace') {
        if (input[ pointer ].length > 0) {
            input[ pointer ] = input[ pointer ].substring(0, input[ pointer ].length - 1)
        } else if (pointer > 0 && !wordMatch(objectiveText[ pointer - 1 ], input[ pointer - 1 ])) {
            pointer--
        }
    } else {
        if (e.key.length == 1) {
            input[ pointer ] += e.key
            lastKeyPress = new Date().getTime()
        }
    }

    for (let i = 0; i < objectiveText.length; i++) {
        if (!wordMatch(objectiveText[ i ], input[ i ]) && pointer != i) {
            actualText[ i ] = `<span class="incorrect-word">${actualText[ i ]}</span>`

        }
        actualText[ i ] = charMatch(objectiveText[ i ], input[ i ])
    }

    objective.innerHTML = actualText.join(" ")

    pointerPos()
})

function restart() {
    input = []
    objectiveText = []
    actualText = []
    pointer = 0
    line = 0

    for (let i = 0; i < 30; i++) {
        objectiveText.push(words[ parseInt(Math.random() * words.length - 1) ])
    }

    objective.innerHTML = objectiveText.join(" ")

    for (let i = 0; i < objectiveText.length; i++) {
        input.push("")
        actualText.push("")
    }

    document.querySelector("#restart").blur()
    pointerPos()
}

let keybind = 0

document.addEventListener('keydown', (e) => {
    if (e.key == "Tab") {
        e.preventDefault()
        keybind++
    } else if (e.key == "Enter" && keybind == 1) {
        restart()
        keybind = 0
    } else {
        keybind = 0
    }
})


function afkCheck() {
    if (new Date().getTime() - lastKeyPress >= afkDefault) {
        if (!htmlPointer.classList.contains("afk")) htmlPointer.classList.add("afk")
    } else {
        if (htmlPointer.classList.contains("afk")) htmlPointer.classList.remove("afk")
    }
}

setInterval(() => {
    afkCheck()
}, 1000);

function autoScroll() {
    let objectiveBoundaries = objective.getBoundingClientRect()
    let pointerBoundaries = htmlPointer.getBoundingClientRect()

    let lineHeight = objectiveBoundaries.height / 3
    let objectiveY = objectiveBoundaries.top + 1
    let pointerY = pointerBoundaries.top

    let currentLine = Math.abs(Math.ceil((pointerY - objectiveY) / lineHeight))
    if (currentLine == 2){
        console.log('KLJSDAJKSD');
        objective.scroll(0, 40 * (line-1))
        line++
    }

    console.log(pointerY, objectiveY, lineHeight, currentLine, line);
}