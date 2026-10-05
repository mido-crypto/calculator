require("dotenv").config();

const express = require("express");
const OpenAI = require("openai");

const app = express();
const PORT = process.env.PORT || 3000;

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
    console.error("ERROR: OPENAI_API_KEY is missing from .env");
    process.exit(1);
}

const client = new OpenAI({
    apiKey: apiKey
});

app.use(express.json());

// منع الوصول لملف .env
app.use((req, res, next) => {
    if (req.path === "/.env" || req.path.startsWith("/.env.")) {
        return res.status(404).end();
    }

    next();
});

app.use(express.static(__dirname));

app.post("/solve", async (req, res) => {

    try {

        const { question } = req.body;

        if (!question || !question.trim()) {
            return res.status(400).json({
                answer: "اكتب المسألة الرياضية الأول."
            });
        }

        console.log("Question:", question);

        const response = await client.responses.create({

            model: process.env.OPENAI_MODEL || "gpt-6-luna",

            instructions: `
أنت محرك ذكاء اصطناعي متخصص في الرياضيات داخل تطبيق AI Math Calculator.

مهمتك حل أي مسألة رياضية يكتبها المستخدم.

قواعد مهمة:
- حل المعادلات الخطية.
- حل المعادلات التربيعية.
- التعامل مع الأقواس.
- التعامل مع الكسور.
- التعامل مع الأسس.
- التعامل مع أكثر من خطوة.
- إذا كان للمعادلة أكثر من حل، اعرض جميع الحلول.
- اشرح الحل خطوة بخطوة.
- تحقق من النتيجة قبل عرضها.
- اكتب بالعربية بطريقة بسيطة وواضحة.
- ضع النتيجة النهائية في آخر الإجابة.
- لا تقل إن هناك محرك AI ناقص أو أن التطبيق يحتاج إلى إضافة AI.
- أنت محرك الذكاء الاصطناعي المسؤول عن حل المسألة.

مثال:
إذا كتب المستخدم:
3x + 11 = 20

الحل:
3x + 11 = 20
3x = 20 - 11
3x = 9
x = 3

النتيجة النهائية: x = 3
`,

            input: question
        });

        console.log("AI Answer:", response.output_text);

        res.json({
            answer: response.output_text
        });

    } catch (error) {

        console.error("OpenAI Error:", error);

        res.status(500).json({
            answer: "حصل خطأ أثناء حل المسألة. راجع مفتاح API واتصال الإنترنت."
        });

    }

});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});