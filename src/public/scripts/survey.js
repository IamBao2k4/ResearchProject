async function getBECK() {
    const response = await fetch("/api/beck_question");
    const data = await response.json();
    return data;
}

async function getAnswerByQuestionId(id) {
    const response = await fetch(`/api/beck_answer/${id}`);
    const data = await response.json();
    return data;
}

async function generateAnswers() {
    const questions = await getBECK();
    const survey = document.querySelector(".questions");

    questions.sort((a, b) => a.question - b.question);

    for (let i = 0; i < questions.length; i++) {
        const question = questions[i];
        const answerElement = document.createElement("div");
        answerElement.classList.add("answers");

        const answers = await getAnswerByQuestionId(question._id);

        answers.forEach((answer, index) => {
            const answerInput = document.createElement("input");
            answerInput.type = "radio";
            answerInput.name = question.question;
            answerInput.required = index === 0; // Add required attribute to the first radio input
            
            const points = answer.answer.split(" - ")[0];
            const answerText = answer.answer.split(" - ")[1];

            answerInput.value = points;
            answerInput.id = answer._id;    

            const answerLabel = document.createElement("label");
            answerLabel.htmlFor = answer._id;
            answerLabel.textContent = answerText;

            const answerContainer = document.createElement("div");
            answerContainer.classList.add("answer");

            answerContainer.appendChild(answerLabel);
            answerContainer.appendChild(answerInput);

            answerElement.appendChild(answerContainer);
        });

        const questionElement = document.createElement("div");
        questionElement.classList.add("question");
        const questionText = document.createElement("h2");
        questionText.textContent = "Question " + question.question;
        questionElement.appendChild(questionText);
        questionElement.appendChild(answerElement);

        survey.appendChild(questionElement);
    };
}

const form = document.getElementById("survey-form");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const answers = {};

    for (const [key, value] of formData.entries()) {
        answers[key] = value;
    }

    var score = 0;

    for (const key in answers) {
        score += parseInt(answers[key]);
    }

    try {
        const res = await fetch("/api/beck_score", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ score }),
        });

        if (res.ok) {
            /*
            // score < 14 không có biểu hiện trầm cảm
            // score 14-19 có biểu hiện trầm cảm nhẹ
            // score 20-29 có biểu hiện trầm cảm trung bình
            // score > 30 có biểu hiện trầm cảm nặng
            */

            if(score < 14) {
                alert("Bạn không có biểu hiện trầm cảm");
            }
            else if (score > 30)
            {
                if(confirm("Bạn có biểu hiện trầm cảm nặng, hãy liên hệ với bác sĩ để được tư vấn.\nBạn có muốn đi tới trang hỗ trợ không ?"))
                {
                    window.open("https://bookingcare.vn/co-so-y-te/vien-tu-van-tam-ly-sunnycare-p317", "_blank");
                }
            }
            else {
                if(confirm("Bạn có biểu hiện trầm cảm " + (score >= 14 && score <=19 ? "nhẹ" : "trung bình") 
                    + ". \nBạn có muốn thực hành phương pháp giảm căng thẳng không ?"))
                {
                    fetch(`/practice/${score}`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }).then(
                        window.location.replace(`/practice/${score}`)
                    )
                }
            }
        }
        else{
            alert("Đã có lỗi xảy ra, vui lòng thử lại sau");
        }
    } catch (error) {
        console.error(error);
    }
});

document.addEventListener("DOMContentLoaded", async () => {
    generateAnswers();
});