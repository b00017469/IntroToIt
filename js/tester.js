var defaultQuestions = [
    {
        questionText: "Вопрос 1?",
        answerOptions: ["ответ 1", "ответ 2", "ответ 3", "ответ 4"],
        rightAnswers: [1]
    },
    {
        questionText: "Вопрос 2?",
        answerOptions: ["ответ 1", "ответ 2", "ответ 3", "ответ 4"],
        rightAnswers: [2]
    },
    {
        questionText: "Вопрос 3?",
        answerOptions: ["ответ 1", "ответ 2", "ответ 3", "ответ 4"],
        rightAnswers: [3]
    },
    {
        questionText: "Вопрос 4?",
        answerOptions: ["ответ 1", "ответ 2", "ответ 3", "ответ 4"],
        rightAnswers: [4]
    },
    {
        questionText: "Вопрос 5?",
        answerOptions: ["ответ 1", "ответ 2", "ответ 3", "ответ 4"],
        rightAnswers: [1, 2, 3, 4]
    }
]

var numberOfAnswers = 4


function addQuestion() {

    var questionText = inputQuestionText()
    if (questionText === undefined) return

    var answerOptions = inputAnswerOptions()
    if (answerOptions === undefined) return

    var rightAnswers = inputRightAnswers()
    if (rightAnswers === undefined) return

    defaultQuestions.push({
        questionText: questionText,
        answerOptions: answerOptions,
        rightAnswers: rightAnswers
    })
}

function inputQuestionText() {
    var input = prompt("Введите текст вопроса", "")
    if (!isInputValid(input)) {
        return showSimpleMassage("CC1")
    }
    return removeSpaces(input)
}

function inputAnswerOptions() {
    var answerOptions = []
    for (var i = 0; i < numberOfAnswers; i++) {
        var answer = prompt(`Введите текст ${i + 1} варианта ответа`, ``)
        if (!isInputValid(answer)) {
            return showSimpleMassage("CC2", i + 1)
        }
        answerOptions[i] = removeSpaces(answer)
    }
    return answerOptions
}

function inputRightAnswers() {
    var rightAnswers = prompt("Введите номера правильных ответов через запятую. Нумерация начинается с 1", "")
    if (!isInputValid(rightAnswers)) {
        return showSimpleMassage("CC3")
    }
    var arrayRightAnswers = rightAnswers.replace(/\s+/g, '').split(',')
    if (!isValidRightAnswer(arrayRightAnswers)) {
        return showSimpleMassage("CC6")
    }
    var arrayNumbers = []
    for (var i = 0; i < arrayRightAnswers.length; i++) {
        arrayNumbers[i] = Number(arrayRightAnswers[i])
    }
    return arrayNumbers
}

function removeSpaces(text) {
    return text.trim()
}

function isInputValid(text) {
    return text !== null && removeSpaces(text) !== ""
}

function isValidRightAnswer(array) {
    var arraySet = new Set(array)
    if (array.length !== arraySet.size) return false
    for (value of arraySet) {
        if (!["1", "2", "3", "4"].includes(value)) return false
    }
    return true
}

function startTest() {
    disabled(document.getElementById("start"))
    disabled(document.getElementById("add"))

    var ol = document.createElement("ol")
    document.body.append(ol)

    var i = 0
    for (var questionText of defaultQuestions) {
        var li = document.createElement("li")
        li.innerHTML = questionText.questionText
        ol.append(li)

        var j = 0
        for (var answer of questionText.answerOptions) {
            var checkbox = document.createElement("input")
            checkbox.type = "checkbox"
            checkbox.id = `checkbox${i}.${j}`
            var label = document.createElement("label")
            label.textContent = answer
            var br = document.createElement("br")
            li.append(br, checkbox, label)
            j++
        }
        i++
    }

    var buttonResult = document.createElement("button")
    buttonResult.innerHTML = "Отправить"
    buttonResult.setAttribute("onclick", "checkResult()")
    document.body.append(buttonResult)
}

function allQuestinsChecked() {
    for (var i = 0; i < defaultQuestions.length; i++) {
        var isChecked = []
        for (var j = 0; j < defaultQuestions[i].answerOptions.length; j++) {
            var checkboxById = document.getElementById(`checkbox${i}.${j}`)
            isChecked[j] = checkboxById.checked
        }
        if (!isChecked.includes(true)) return false
    }
    return true
}

function checkResult() {
    if (!allQuestinsChecked()) {
        return showSimpleMassage("CC4")
    }
    //The user's answers are compared with the correct answer options. Wrong answer numbers are saved in a var wrongAnswerNumbers
    var wrongAnswerNumbers = []
    for (var i = 0; i < defaultQuestions.length; i++) {
        for (var j = 0; j < defaultQuestions[i].answerOptions.length; j++) {
            var checkboxById = document.getElementById(`checkbox${i}.${j}`)
            var answerByUser = checkboxById.checked
            var right = defaultQuestions[i].rightAnswers.includes(j + 1)
            if (answerByUser !== right) {
                wrongAnswerNumbers.push(i + 1)
                break
            }
        }
    }
    if (wrongAnswerNumbers.length === 0) {
        return showMassage("CC5", wrongAnswerNumbers)
    }
    return showMassage("CC7", wrongAnswerNumbers)
}

function disabled(element) {
    element.setAttribute("disabled", "disabled")
}

function showSimpleMassage(message, number = 0) {
    var simpleMessages = {
        CC1: "Вы не ввели текст вопроса. Попробуйте добавить вопрос заново.",
        CC2: `Вы не ввели текст ${number} варианта ответа. Попробуйте добавить вопрос заново.`,
        CC3: "Вы не ввели правильные варианты ответов. Попробуйте заново.",
        CC4: "Все вопросы должны иметь хотя бы один выбранный вариант ответа. Проверьте правильность заполнения.",
        CC6: "Поле может содержать только уникальные цифры 1, 2, 3, 4, разделенные запятой. Попробуйте добавить вопрос заново."
    };
    alert(simpleMessages[message])
}

function showMassage(message, wrongAnswerNumbers) {
    var countOfQuestions = defaultQuestions.length
    var countOfCorrectQuestions = countOfQuestions - wrongAnswerNumbers.length
    if (countOfCorrectQuestions < countOfQuestions) {
        var strWrongAnswers = ""
        for (var i = 0; i < wrongAnswerNumbers.length; i++) {
            strWrongAnswers += `${wrongAnswerNumbers[i]}. ${defaultQuestions[wrongAnswerNumbers[i] - 1].questionText}\n`
        }
    }
    var messages = {
        CC5: `Ваш результат ${countOfCorrectQuestions} из ${countOfQuestions}. Вы молодец!`,
        CC7: `Вы неправильно ответили на вопросы:\n
${strWrongAnswers}\nВаш результат ${countOfCorrectQuestions} из ${countOfQuestions}.`
    };
    alert(messages[message])
}