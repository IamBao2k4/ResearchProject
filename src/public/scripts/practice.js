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
    { id: 'E8u0MR-JN9I', title: 'Video 1', index: 1 },
    { id: 'PLkxdpKPnMM', title: 'Video 2', index: 2 },
    { id: 'P2VnVXlFMmQ', title: 'Video 3', index: 3 },
    { id: '6Y0AKIq9ZLg', title: 'Video 4', index: 4 },
    { id: '_4578LUGgDE', title: 'Video 5', index: 5 },
];

document.addEventListener("DOMContentLoaded", async () => {
    const stepTitles = document.querySelectorAll(".practice_step_title");
    
    // Ẩn tất cả các bước ngoại trừ bước 1 khi trang được tải
    initSteps();

    showMiniVideoList(videos);

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
        showCongratulations("Bạn đã hoàn thành bài tập thiền định. Hãy tiếp tục duy trì thói quen này nhé!");
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
let watchedVideos = 1;
async function showMiniVideoList(videos) {
    const modal = document.createElement('div');
    modal.className = 'mini-video-list-modal';
    modal.innerHTML = `
        <div class="mini-video-list-modal-content">
            <h2>Chọn video để xem</h2>
            <div class="mini-video-list">
                ${videos.map(video => `
                    <div class="mini-video-list-item" data-video-id="${video.id}" data-index="${video.index}">
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

    watchedVideos = await fetch("/profile/get-watched-videos")
        .then((response) => response.json())
        .then((data) => data.watchedVideos[0]);

    // Handle click event on each video list item
    const videoItems = modal.querySelectorAll('.mini-video-list-item');
    videoItems.forEach(item => {
        item.addEventListener('click', () => {
            const videoId = item.getAttribute('data-video-id');
            const index = item.getAttribute('data-index');

            console.log("watchedVideos", watchedVideos);
            console.log("index", index);
            console.log(watchedVideos)

            if(watchedVideos >= index){
                showVideoModal(videoId);
            }
            else{
                alert(`Bạn cần xem video ${watchedVideos} trước để mở video này!`);
                return;
            }
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
        <div class="video-modal-header">
            <h2>Video Hướng dẫn thiền định</h2>
            <button class="video-modal-close">X</button>
        </div>
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
        onYouTubeIframeAPIReady(videoId);
    }

    const closeButton = modal.querySelector('.video-modal-close');
    closeButton.addEventListener('click', () => {
        modal.classList.remove('show');
        showMiniVideoList(videos);
        setTimeout(() => modal.remove(), 300);
        if (player) {
            player.stopVideo();
        }
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            if (videoWatched) {
                let video;
                videos.forEach((v) => {
                    if (v.id === videoId) {
                        video = v;
                    }
                });
                fetch("/profile/update-watched-videos", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        watchedVideos: video.index + 1,
                    }),
                })
                .then((response) => response.json())
                .then(() => {
                    watchedVideos = video.index + 1;
                });
                completeStep(2);
            } else {
                showMessage("Bạn cần xem video ít nhất 10 giây để hoàn thành bước này!");
            }
            
            showMiniVideoList(videos);
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
                const checkin_radio_group = document.querySelectorAll(".radio-container")[0];
                const checkinRadios = checkin_radio_group.querySelectorAll("input[type='radio']");
                checkinRadios.forEach((radio) => {
                    radio.disabled = true;
                    if (radio.nextElementSibling.innerHTML === data[0].status) {
                        radio.nextElementSibling.style.color = "#000";
                        radio.nextElementSibling.style.fontWeight = "bold";
                        radio.nextElementSibling.style.cursor = "not-allowed";
                    }
                });
                const label = checkin_radio_group.parentNode.querySelector("label");
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
                const checkout_radio_group = document.querySelectorAll(".radio-container")[1];
                const checkoutRadios = checkout_radio_group.querySelectorAll("input[type='radio']");
                checkoutRadios.forEach((radio) => {
                    radio.disabled = true;
                    if (radio.nextElementSibling.innerHTML === data[0].status) {
                        radio.nextElementSibling.style.color = "#000";
                        radio.nextElementSibling.style.fontWeight = "bold";
                        radio.nextElementSibling.style.cursor = "not-allowed";
                    }
                });
                const label = checkout_radio_group.parentNode.querySelector("label");
                label.innerHTML = "Bạn đã checkout trạng thái ngày hôm nay!";
                setDisabledSaveButton(checkoutSaveBtn);
                
                // Đánh dấu bước 4 đã hoàn thành
                completeStep(4);
            }
        })
        .catch((error) => console.error(error));
}

async function handleSaveStatus(status) {
    let radio_group = document.querySelectorAll(".radio-container")[0];
    if(status === "checkout"){
        radio_group = document.querySelectorAll(".radio-container")[1];
    }

    const radios = radio_group.querySelectorAll("input[type='radio']");

    const selectedRadio = radio_group.querySelector("input[type='radio']:checked");
    if (!selectedRadio) {
        alert("Vui lòng chọn trạng thái!");
        return;
    }

    const statusText = selectedRadio.nextElementSibling.innerHTML;
    const url = status === "checkin" ? "/checkin" : "/checkout";

    await fetch(url, {
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
                radios.forEach((radio) => {
                    radio.disabled = true;
                });
                selectedRadio.nextElementSibling.style.color = "#000";
                selectedRadio.nextElementSibling.style.fontWeight = "bold";
                selectedRadio.nextElementSibling.style.cursor = "not-allowed";
            }

            fetch("/profile/update-finished-steps", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    finishedSteps: status === "checkin" ? 2 : 4,
                }),
            })
            .then((response) => response.json())
            .then(() => {
                checkIfUserCheckedIn();
                checkIfUserCheckedOut();
            })
            
        })
        .catch((error) => console.error(error));

    if(status === "checkout"){
        const checkoutStatus = selectedRadio.id;
        let alertString = "";
        switch(checkoutStatus){
            case "happy": 
                alertString = "✨Tuyệt vời! Hãy lưu giữ khoảnh khắc vui vẻ này và tiếp tục lan tỏa năng lượng tích cực nhé! Chúc bạn có thêm nhiều ngày tuyệt vời như hôm nay! ";
                break;
            case "normal":
                alertString = "🌿 Không sao cả, có những ngày chỉ đơn giản là trôi qua. Hãy tự thưởng cho mình một điều gì đó nhỏ bé nhưng ý nghĩa, có thể ngày mai sẽ thú vị hơn đấy! ";
                break;
            case "sad":
                alertString = "🤗 Không sao đâu, khóc cũng là một cách để giải tỏa cảm xúc. Bạn không hề yếu đuối, bạn chỉ đang đối diện với chính mình một cách chân thật. Hãy để bản thân được nghỉ ngơi, và nhớ rằng ngày mai là một cơ hội mới để bắt đầu lại!";
                break;
            case "angry":
                alertString = "🌸 Hôm nay có thể không như mong muốn, nhưng bạn đã cố gắng hết sức rồi. Đừng để cơn giận giữ mãi trong lòng, hãy thử nghe một bản nhạc nhẹ hoặc viết ra suy nghĩ của mình để giải tỏa nhé. Ngày mai sẽ tốt hơn!";
                break;
            case "worry":
                alertString = "💙 Mọi chuyện rồi sẽ ổn thôi. Đừng quên rằng bạn không cần phải giải quyết tất cả mọi thứ trong một ngày. Hãy thử hít thở sâu, viết ra những điều khiến bạn lo lắng và cho bản thân một chút thời gian để thư giãn nhé!";
            default:
                alertString = "Chúc mừng bạn đã hoàn thành ngày hôm nay!";
        }

        alert(alertString);
    }
}

function setDisabledSaveButton(btn) {
    btn.disabled = true;
    btn.style.cursor = "not-allowed";
    btn.style.backgroundColor = "#ccc";
    btn.style.color = "#000";
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

        // Khi hoàn thành video thì chúc mừng
        if (event.data === YT.PlayerState.ENDED) {
            const endTime = new Date().getTime();
            watchDuration += (endTime - watchStartTime) / 1000;
            
            // Đánh dấu đã xem nếu đã xem hơn 10 giây
            if (watchDuration >= 10) {
                videoWatched = true;
            }
            showCongratulations("Chúc mừng bạn đã hoàn thành video, hãy tiếp tục với các bước tiếp theo nhé!");
        }
    }
}

function showCongratulations(congratulations) {
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
            <p class="modal-message">${congratulations}</p>
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