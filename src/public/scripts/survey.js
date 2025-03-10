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
        const questionElement = document.createElement("div");
        questionElement.classList.add("question", "question-card");

        // Tạo số thứ tự câu hỏi
        const questionNumber = document.createElement("h3");
        questionNumber.classList.add("question-number");
        questionNumber.textContent = "Câu " + question.question;

        // Tạo nội dung câu hỏi
        const questionText = document.createElement("p");
        questionText.classList.add("question-text");
        questionText.textContent = question.text;

        // Tạo container cho câu trả lời
        const answerElement = document.createElement("div");
        answerElement.classList.add("answers");

        const answers = await getAnswerByQuestionId(question._id);
        console.log("Answers for question", i + 1, ":", answers);

        for (let index = 0; index < answers.length; index++) {
            const answer = answers[index];
            const answerContainer = document.createElement("div");
            answerContainer.classList.add("answer-option");

            const answerInput = document.createElement("input");
            answerInput.type = "radio";
            answerInput.name = "question" + (i + 1);
            answerInput.required = true;
            
            const points = answer.answer.split(" - ")[0];
            const answerText = answer.answer.split(" - ")[1];

            answerInput.value = points;
            answerInput.id = "q" + (i + 1) + "a" + index;

            const answerLabel = document.createElement("label");
            answerLabel.htmlFor = "q" + (i + 1) + "a" + index;
            answerLabel.textContent = answerText;

            answerContainer.appendChild(answerInput);
            answerContainer.appendChild(answerLabel);
            answerElement.appendChild(answerContainer);

            // Thêm event listener cho radio button
            answerInput.addEventListener('change', updateProgress);
        };

        questionElement.appendChild(questionNumber);
        questionElement.appendChild(questionText);
        questionElement.appendChild(answerElement);

        survey.appendChild(questionElement);
    }
    
    // Cập nhật progress bar ban đầu
    updateProgress();
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
            if(score < 14) {
                showModal(
                    "Kết quả đánh giá",
                    `Điểm số của bạn là ${ score } (bé hơn 14 điểm) vì vậy bạn không có biểu hiện stress. Bạn có muốn thực hành phương pháp giảm căng thẳng không?`,
                    () => {
                        fetch(`/practice/${score}`, {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json",
                            },
                        }).then(() => {
                            window.location.replace(`/practice/${score}`);
                        });
                    }
                );
            } else if(score > 30) {
                showModal(
                    "Kết quả đánh giá",
                    `Điểm số của bạn là ${ score } (lớn hơn 30 điểm) vì vậy bạn có biểu hiện stress nặng, hãy liên hệ với bác sĩ để được tư vấn. Bạn có muốn đi tới trang hỗ trợ không?`,
                    () => {
                        window.open("https://bookingcare.vn/co-so-y-te/vien-tu-van-tam-ly-sunnycare-p317", "_blank");
                        window.location.replace("/");
                    }
                );
            } else {
                showModal(
                    "Kết quả đánh giá",
                    `Điểm số của bạn là ${score} (${score >= 14 && score <= 19 ? "nằm trong khoảng từ 14 đến 19 điểm" : "nằm trong khoảng từ 20 đến 29 điểm"}) vì vậy bạn có biểu hiện trầm cảm ${score >= 14 && score <= 19 ? "nhẹ" : "trung bình"}. Bạn có muốn thực hành phương pháp giảm căng thẳng không?`,
                    () => {
                        window.location.href = `/practice/${score}`;
                    }
                );
            }
        } else {
            showModal(
                "Lỗi",
                "Đã có lỗi xảy ra, vui lòng thử lại sau",
                null
            );
        }
    } catch (error) {
        console.error(error);
        showModal(
            "Lỗi",
            "Đã có lỗi xảy ra, vui lòng thử lại sau",
            null
        );
    }
});

document.addEventListener("DOMContentLoaded", async () => {
    generateAnswers();
});

function updateProgress() {
    const totalQuestions = 21;
    const answeredQuestions = document.querySelectorAll('input[type="radio"]:checked').length;
    const progressFill = document.querySelector('.progress-fill');
    const currentQuestionSpan = document.getElementById('current-question');
    
    // Đảm bảo các phần tử đã được tìm thấy
    if (progressFill && currentQuestionSpan) {
        const progress = (answeredQuestions / totalQuestions) * 100;
        progressFill.style.width = `${progress}%`;
        currentQuestionSpan.textContent = answeredQuestions;
        
        // Log để debug
        console.log(`Progress updated: ${answeredQuestions}/${totalQuestions} (${progress}%)`);
    } else {
        console.error('Progress elements not found');
    }
}

// Đảm bảo thêm event listener cho tất cả radio buttons sau khi DOM đã tải xong
document.addEventListener('DOMContentLoaded', () => {
    // Đợi một chút để đảm bảo các câu hỏi đã được tạo ra
    setTimeout(() => {
        const radioButtons = document.querySelectorAll('input[type="radio"]');
        radioButtons.forEach(radio => {
            radio.addEventListener('change', updateProgress);
        });
        console.log(`Added event listeners to ${radioButtons.length} radio buttons`);
        updateProgress(); // Cập nhật ngay khi trang tải xong
    }, 500);
});

function showModal(title, message, onConfirm) {
    const modal = document.createElement('div');
    modal.className = 'custom-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h3 class="modal-title">${title}</h3>
            <p class="modal-message">${message}</p>
            <div class="modal-buttons">
                ${onConfirm ? `
                    <button class="modal-btn modal-btn-cancel">Hủy</button>
                    <button class="modal-btn modal-btn-confirm">Đồng ý</button>
                ` : `
                    <button class="modal-btn modal-btn-confirm">Đóng</button>
                `}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'block';

    const closeModal = () => {
        modal.style.display = 'none';
        modal.remove();
    };

    if (onConfirm) {
        modal.querySelector('.modal-btn-cancel').addEventListener('click', () => {
            closeModal();
            window.location.href = '/';
        });
        modal.querySelector('.modal-btn-confirm').addEventListener('click', () => {
            closeModal();
            onConfirm();
        });
    } else {
        modal.querySelector('.modal-btn-confirm').addEventListener('click', () => {
            closeModal();
            window.location.href = '/';
        });
    }
}