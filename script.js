// ===============================
// Calculator
// ===============================

function appendValue(value) {
    document.getElementById("display").value += value;
}

function clearDisplay() {
    document.getElementById("display").value = "";
}

function deleteLast() {
    const display = document.getElementById("display");
    display.value = display.value.slice(0, -1);
}

function calculate() {
    const display = document.getElementById("display");

    try {
        if (!display.value.trim()) return;

        const expression = display.value
            .replace(/×/g, "*")
            .replace(/÷/g, "/");

        display.value = Function(
            '"use strict"; return (' + expression + ")"
        )();
    } catch (error) {
        display.value = "Error";
    }
}


// ===============================
// Open / Close AI
// ===============================

function openAI() {
    document.getElementById("aiModal").classList.add("active");

    setTimeout(() => {
        document.getElementById("aiQuestion").focus();
    }, 100);
}

function closeAI() {
    document.getElementById("aiModal").classList.remove("active");
}


// ===============================
// AI Solver
// ===============================

async function askAI() {

    const questionElement = document.getElementById("aiQuestion");
    const resultElement = document.getElementById("aiResult");
    const button = document.getElementById("askAIButton");

    const question = questionElement.value.trim();

    if (!question) {
        resultElement.textContent = "اكتب المسألة الرياضية الأول.";
        return;
    }

    button.disabled = true;
    button.textContent = "جاري الحل...";
    resultElement.textContent = "جاري حل المسألة...";

    try {

        const response = await fetch("/solve", {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                question: question
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.answer || "حدث خطأ أثناء الاتصال بالسيرفر."
            );
        }

        resultElement.textContent =
            data.answer || "لم يتم الحصول على إجابة.";

    } catch (error) {

        console.error("AI ERROR:", error);

        resultElement.textContent =
            "حصل خطأ في الاتصال بالذكاء الاصطناعي. تأكد أن السيرفر شغال.";

    } finally {

        button.disabled = false;
        button.textContent = "ASK AI";
    }
}


// ===============================
// Keyboard
// ===============================

document.addEventListener("keydown", function (event) {

    if (event.key === "Escape") {
        closeAI();
    }

});


// ===============================
// Start
// ===============================

console.log("AI Math Calculator loaded successfully.");
console.log("script version 123");