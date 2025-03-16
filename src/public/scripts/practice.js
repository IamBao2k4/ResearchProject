const checkinSaveBtn = document.querySelector(".checkin-save-btn");
const checkoutSaveBtn = document.querySelector(".checkout-save-btn");

// Biến để theo dõi trạng thái các bước
const stepStatus = {
    step1: false,
    step2: false,
    step3: false,
    step4: false
};

// Biến để lưu trạng thái video đã xem
let videoWatched = false;

const videos = [
    { id: 'inpok4MKVLM', title: 'Video 1' },
    { id: 'dQw4w9WgXcQ', title: 'Video 2' },
    { id: '3JZ_D3ELwOQ', title: 'Video 3' },
    { id: 'L_jWHffIx5E', title: 'Video 4' },
    { id: 'eVTXPUF4Oz4', title: 'Video 5' },
    { id: 'hTWKbfoikeg', title: 'Video 6' },
    { id: 'kXYiU_JCYtU', title: 'Video 7' },
    { id: 'ktvTqknDobU', title: 'Video 8' },
    { id: 'y6120QOlsfU', title: 'Video 9' },
    { id: 'CevxZvSJLk8', title: 'Video 10' }
];

document.addEventListener("DOMContentLoaded", () => {
    const stepTitles = document.querySelectorAll(".practice_step_title");
    const practiceSteps = document.querySelectorAll(".practice_step");
    
    // Ẩn tất cả các bước ngoại trừ bước 1 khi trang được tải
    initSteps();

    stepTitles.forEach((title) => {
        title.addEventListener("click", (event) => {
            const content = title.nextElementSibling;
            const step = title.closest('.practice_step');
            const stepNumber = getStepNumber(step);
            
            // Chỉ cho phép mở bước hiện tại hoặc các bước đã hoàn thành
            if (!canAccessStep(stepNumber)) {
                event.preventDefault();
                showMessage(`Bạn cần hoàn thành bước ${stepNumber - 1} trước`);
                return;
            }

            // Toggle content visibility
            if (content.style.display === "none" || content.style.display === "") {
                content.style.display = "block";
            } else {
                content.style.display = "none";
            }
            // Auto proceed after 5 seconds for step 3
            if (step.classList.contains('step_3') && !stepStatus.step3) {
                startStep3Timer();
            }
        });
    });

    handleDisableSaveButton();
    checkinSaveBtn.addEventListener("click", async () => {
        await handleSaveStatus("checkin");
        // Đánh dấu bước 1 đã hoàn thành
        completeStep(1);
    });

    checkoutSaveBtn.addEventListener("click", async () => {
        await handleSaveStatus("checkout");
        // Đánh dấu bước 4 đã hoàn thành
        completeStep(4);
        // Hiển thị thông báo chúc mừng
        showCongratulations();
    });

    checkIfUserCheckedIn();
    checkIfUserCheckedOut();
});

// Khởi tạo các bước
function initSteps() {
    const practiceSteps = document.querySelectorAll(".practice_step");
    
    // Hiển thị chỉ bước 1, ẩn các bước khác
    practiceSteps.forEach((step, index) => {
        const content = step.querySelector(".practice_step_content");
        if (index === 0) {
            content.style.display = "block";
        } else {
            content.style.display = "none";
        }
    });
}

// Lấy số thứ tự của bước từ class
function getStepNumber(stepElement) {
    const classes = stepElement.className.split(' ');
    for (const cls of classes) {
        if (cls.startsWith('step_')) {
            return parseInt(cls.replace('step_', ''));
        }
    }
    return 0;
}

// Kiểm tra xem người dùng có thể truy cập bước này chưa
function canAccessStep(stepNumber) {
    if (stepNumber === 1) return true;
    
    // Nếu bước trước đó đã hoàn thành, cho phép truy cập bước này
    return stepStatus[`step${stepNumber - 1}`];
}

// Đánh dấu bước đã hoàn thành và mở bước tiếp theo
function completeStep(stepNumber) {
    stepStatus[`step${stepNumber}`] = true;
    
    // Đánh dấu bước hiện tại đã hoàn thành bằng CSS
    const completedStep = document.querySelector(`.step_${stepNumber}`);
    completedStep.classList.add('completed');
    
    // Nếu không phải bước cuối cùng, mở bước tiếp theo
    if (stepNumber < 4) {
        setTimeout(() => {
            const nextStep = document.querySelector(`.step_${stepNumber + 1}`);
            const nextStepTitle = nextStep.querySelector('.practice_step_title');
            const nextStepContent = nextStep.querySelector('.practice_step_content');
            
            // Cuộn tới bước tiếp theo
            nextStep.scrollIntoView({ behavior: 'smooth' });
            
            // Hiển thị nội dung bước tiếp theo
            nextStepContent.style.display = "block";
            
            // Nếu là bước 2, hiển thị danh sách video
            if (stepNumber + 1 === 2) {
                showMiniVideoList(videos);
            }
            
            // Nếu là bước 3, bắt đầu đếm ngược
            if (stepNumber + 1 === 3) {
                startStep3Timer();
            }
        }, 1000);
    }
}

// Bắt đầu đếm ngược cho bước 3
function startStep3Timer() {
    if (stepStatus.step3) return; // Nếu đã hoàn thành thì không làm gì
    
    let timeLeft = 5;
    const timerElement = document.createElement('div');
    timerElement.className = 'step-timer';
    timerElement.innerHTML = `Tự động chuyển sang bước tiếp theo sau <span>${timeLeft}</span> giây...`;
    
    const step3 = document.querySelector('.step_3');
    const step3Content = step3.querySelector('.practice_step_content');
    step3Content.appendChild(timerElement);
    
    const interval = setInterval(() => {
        timeLeft--;
        timerElement.querySelector('span').textContent = timeLeft;
        
        if (timeLeft <= 0) {
            clearInterval(interval);
            timerElement.remove();
            
            // Đánh dấu bước 3 đã hoàn thành
            stepStatus.step3 = true;
            completeStep(3);
        }
    }, 1000);
}

// Hiển thị thông báo
function showMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.className = 'message-overlay';
    messageElement.innerHTML = `
        <div class="message-content">
            <p>${message}</p>
            <button class="message-close">OK</button>
        </div>
    `;
    
    document.body.appendChild(messageElement);
    
    messageElement.querySelector('.message-close').addEventListener('click', () => {
        messageElement.remove();
    });
}

function showMiniVideoList(videos) {
    const modal = document.createElement('div');
    modal.className = 'mini-video-list-modal';
    modal.innerHTML = `
        <div class="mini-video-list-modal-content">
            <h2>Chọn video để xem</h2>
            <div class="mini-video-list">
                ${videos.map(video => `
                    <div class="mini-video-list-item" data-video-id="${video.id}">
                        <img src="https://img.youtube.com/vi/${video.id}/0.jpg" alt="${video.title}">
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    const step_2 = document.querySelector('.step_2');
    const videoListContainer = step_2.querySelector('.practice_step_content');
    videoListContainer.appendChild(modal);
    setTimeout(() => modal.classList.add('show'), 10);
    // Handle click event on each video list item
    const videoItems = modal.querySelectorAll('.mini-video-list-item');
    videoItems.forEach(item => {
        item.addEventListener('click', () => {
            const videoId = item.getAttribute('data-video-id');
            showVideoModal(videoId);
            modal.classList.remove('show');
            setTimeout(() => modal.remove(), 300);
        });
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
            setTimeout(() => modal.remove(), 300);
        }
    });
}

function showVideoModal(videoId) {
    const modal = document.createElement('div');
    modal.className = 'video-modal';
    modal.innerHTML = `
        <div class="video-modal-content">
            <div class="video-container">
                <iframe 
                    id="youtube-player"
                    width="100%" 
                    height="100%" 
                    src="https://www.youtube.com/embed/${videoId}?enablejsapi=1"
                    title="Hướng dẫn thiền định"
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen
                ></iframe>
            </div>
            <button class="close-modal">&times;</button>
        </div>
    `;

    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('show'), 10);

    // Load YouTube API if not already loaded
    if (!window.YT) {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    } else {
        onYouTubeIframeAPIReady();
    }

    // Handle close modal
    const closeBtn = modal.querySelector('.close-modal');
    closeBtn.addEventListener('click', () => {
        // Kiểm tra xem người dùng đã xem tối thiểu 10 giây chưa
        if (videoWatched) {
            completeStep(2); // Đánh dấu bước 2 đã hoàn thành
        } else {
            showMessage("Bạn cần xem video ít nhất 10 giây để hoàn thành bước này!");
        }
        
        modal.classList.remove('show');
        setTimeout(() => modal.remove(), 300);
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            if (videoWatched) {
                completeStep(2);
            } else {
                showMessage("Bạn cần xem video ít nhất 10 giây để hoàn thành bước này!");
            }
            
            modal.classList.remove('show');
            setTimeout(() => modal.remove(), 300);
        }
    });
}

function checkIfUserCheckedIn() {
    fetch("/checkin/todayStatus")
        .then((response) => response.json())
        .then((data) => {
            if (data[0].date.split("T")[0] === new Date().toISOString().split("T")[0]) {
                const checkinTextarea = document.getElementById("checkin");
                checkinTextarea.value = data[0].status;
                checkinTextarea.disabled = true;
                checkinTextarea.style.cursor = "not-allowed";
                checkinTextarea.style.resize = "none";
                const label = checkinTextarea.parentNode.querySelector("label");
                label.innerHTML = "Bạn đã checkin trạng thái ngày hôm nay!";
                setDisabledSaveButton(checkinSaveBtn);
                
                // Đánh dấu bước 1 đã hoàn thành
                completeStep(1);
            }
        })
        .catch((error) => console.error(error));
}

function checkIfUserCheckedOut() {
    fetch("/checkout/todayStatus")
        .then((response) => response.json())
        .then((data) => {
            if (data[0].date.split("T")[0] === new Date().toISOString().split("T")[0]) {
                const checkoutTextarea = document.getElementById("checkout");
                checkoutTextarea.value = data[0].status;
                checkoutTextarea.disabled = true;
                checkoutTextarea.style.cursor = "not-allowed";
                checkoutTextarea.style.resize = "none";
                const label = checkoutTextarea.parentNode.querySelector("label");
                label.innerHTML = "Bạn đã checkout trạng thái ngày hôm nay!";
                setDisabledSaveButton(checkoutSaveBtn);
                
                // Đánh dấu bước 4 đã hoàn thành
                completeStep(4);
            }
        })
        .catch((error) => console.error(error));
}

function handleSaveStatus(status) {
    const textarea = document.getElementById(status);
    const statusText = textarea.value.trim();
    const url = status === "checkin" ? "/checkin" : "/checkout";

    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            status: statusText,
        }),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.success) {
                setDisabledSaveButton(status === "checkin" ? checkinSaveBtn : checkoutSaveBtn);
                textarea.disabled = true;
                textarea.style.cursor = "not-allowed";
                textarea.style.resize = "none";
            }
        })
        .catch((error) => console.error(error));
}

function setDisabledSaveButton(btn) {
    btn.disabled = true;
    btn.style.cursor = "not-allowed";
    btn.style.backgroundColor = "#ccc";
    btn.style.color = "#000";
}

function handleDisableSaveButton(){
    const currentButtonStyle = window.getComputedStyle(checkinSaveBtn);

    // ----------CHECKIN-------------
    const checkinTextarea = document.getElementById("checkin");
    if (checkinTextarea.value.trim() !== "") {
        checkinSaveBtn.disabled = false;
        checkinSaveBtn.style = currentButtonStyle;
    } else {
        setDisabledSaveButton(checkinSaveBtn);
    }
    checkinTextarea.addEventListener("input", () => {
        if (checkinTextarea.value.trim() !== "") {
            checkinSaveBtn.disabled = false;
            checkinSaveBtn.style = currentButtonStyle;
        } else {
            setDisabledSaveButton(checkinSaveBtn);
        }
    });

    // ----------CHECKOUT-------------
    const checkoutTextarea = document.getElementById("checkout");
    if (checkoutTextarea.value.trim() !== "") {
        checkoutSaveBtn.disabled = false;
        checkoutSaveBtn.style = currentButtonStyle;
    } else {
        setDisabledSaveButton(checkoutSaveBtn);
    }
    checkoutTextarea.addEventListener("input", () => {
        if (checkoutTextarea.value.trim() !== "") {
            checkoutSaveBtn.disabled = false;
            checkoutSaveBtn.style = currentButtonStyle;
        } else {
            setDisabledSaveButton(checkoutSaveBtn);
        }
    });
}

let player;

function onYouTubeIframeAPIReady() {
    let player;
    
    try {
        player = new YT.Player('youtube-player', {
            events: {
                'onStateChange': onPlayerStateChange
            }
        });
    } catch (error) {
        console.error("Error initializing YouTube player:", error);
    }
    
    let watchStartTime = 0;
    let watchDuration = 0;
    
    function onPlayerStateChange(event) {
        // Khi video bắt đầu phát
        if (event.data === YT.PlayerState.PLAYING) {
            watchStartTime = new Date().getTime();
        }
        
        // Khi video dừng hoặc kết thúc
        if (event.data === YT.PlayerState.PAUSED || event.data === YT.PlayerState.ENDED) {
            const endTime = new Date().getTime();
            watchDuration += (endTime - watchStartTime) / 1000;
            
            // Đánh dấu đã xem nếu đã xem hơn 10 giây
            if (watchDuration >= 10) {
                videoWatched = true;
            }
        }
    }
}

function showCongratulations() {
    // Tạo overlay
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    document.body.appendChild(overlay);

    // Tạo container cho pháo hoa
    const fireworksContainer = document.createElement('div');
    fireworksContainer.id = 'fireworks-container';
    document.body.appendChild(fireworksContainer);

    // Khởi tạo pháo hoa
    const fireworks = new Fireworks.default(fireworksContainer, {
        rocketsPoint: {
            min: 30,
            max: 70
        },
        hue: {
            min: 0,
            max: 360
        },
        delay: {
            min: 15,
            max: 30
        },
        speed: 2.5,
        acceleration: 1.05,
        friction: 0.95,
        gravity: 1.5,
        particles: 90,
        trace: 4,
        explosion: 8,
        autoresize: true,
        brightness: {
            min: 50,
            max: 90,
            decay: {
                min: 0.015,
                max: 0.03
            }
        },
        mouse: {
            click: true,
            move: false
        }
    });

    fireworks.start();

    // Tạo modal chúc mừng
    const modal = document.createElement('div');
    modal.className = 'custom-modal congratulations-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <div class="sparkles"></div>
                <h3 class="modal-title">🎉 Chúc mừng bạn! 🎉</h3>
            </div>
            <p class="modal-message">Bạn đã hoàn thành bài tập thiền định. Hãy tiếp tục duy trì thói quen này nhé!</p>
            <div class="modal-buttons">
                <button class="modal-btn modal-btn-continue">Tiếp tục</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Hiển thị overlay và modal
    requestAnimationFrame(() => {
        overlay.classList.add('show');
        modal.classList.add('show');
    });

    // Xử lý đóng modal
    const closeModal = () => {
        overlay.classList.remove('show');
        modal.classList.remove('show');
        fireworks.stop();
        setTimeout(() => {
            overlay.remove();
            modal.remove();
            fireworksContainer.remove();
        }, 300);
    };

    // Xử lý các nút
    const continueBtn = modal.querySelector('.modal-btn-continue');
    
    continueBtn.addEventListener('click', () => {
        // Lưu trạng thái vào localStorage
        localStorage.setItem('hideVideoButton', 'true');
        closeModal();
    });

    // Click outside to close
    overlay.addEventListener('click', closeModal);
}

// Thêm CSS cho thông báo và bộ đếm thời gian
document.addEventListener('DOMContentLoaded', function() {
    const style = document.createElement('style');
    style.textContent = `
        .message-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
        }
        
        .message-content {
            background: white;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            max-width: 80%;
        }
        
        .message-close {
            margin-top: 15px;
            padding: 8px 20px;
            background: #f8b7cd;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
        
        .step-timer {
            margin-top: 20px;
            padding: 10px;
            background: #f0f0f0;
            text-align: center;
            border-radius: 5px;
            font-weight: bold;
        }
        
        .practice_step {
            position: relative;
        }
        
        .practice_step::before {
            content: "";
            position: absolute;
            top: 0;
            left: -20px;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: #ccc;
        }
        
        .practice_step.completed::before {
            background: #4CAF50;
        }
    `;
    document.head.appendChild(style);
});

// Đặt onYouTubeIframeAPIReady vào window object
window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;