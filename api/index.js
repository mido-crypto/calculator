const express = require("express");
const OpenAI = require("openai");
const path = require("path");

const app = express();

app.use(express.json());

// تشغيل ملفات الموقع
app.use(express.static(path.join(__dirname, "..")));

// AI Solver
app.post("/solve", async (req, res) => {
    try {
        const { question } = req.body;

        if (!question || !question.trim()) {
            return res.status(400).json({
                answer: "اكتب المسألة الرياضية الأول."
            });
        }

        const client = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });

        const response = await client.responses.create({
            model: process.env.OPENAI_MODEL || "gpt-6-luna",

            instructions: `
أنت محرك ذكاء اصطناعي متخصص في الرياضيات داخل تطبيق AI Math Calculator.

حل المسألة الرياضية التي يكتبها المستخدم.

القواعد:
- حل المعادلات الخطية.
- حل المعادلات التربيعية.
- التعامل مع الأقواس والكسور والأسس.
- إذا كان هناك أكثر من حل، اعرض جميع الحلول.
- اشرح الحل خطوة بخطوة.
- اكتب بالعربية بطريقة بسيطة وواضحة.
- ضع النتيجة النهائية في آخر الإجابة.
- تحقق من النتيجة قبل عرضها.
`,

            input: question
        });

        res.json({
            answer: response.output_text
        });

    } catch (error) {
        console.error("OpenAI Error:", error);

        res.status(500).json({
            answer: "حصل خطأ أثناء حل المسألة."
        });
    }
});

// مهم جدًا لـ Vercel
module.exports = app;
