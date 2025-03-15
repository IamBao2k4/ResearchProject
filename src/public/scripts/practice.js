const checkinSaveBtn = document.querySelector(".checkin-save-btn");
const checkoutSaveBtn = document.querySelector(".checkout-save-btn");

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

    stepTitles.forEach((title) => {
        title.addEventListener("click", () => {
            const content = title.nextElementSibling;
            const step = title.closest('.practice_step');

            // Toggle content visibility
            if (content.style.display === "none" || content.style.display === "") {
                content.style.display = "block";
            } else {
                content.style.display = "none";
            }

            // Show video list when step_2 is clicked
            if (step.classList.contains('step_2')) {
                showMiniVideoList(videos);
            }
        });
    });

    // // Thay đổi nội dung của player div thành button
    // const playerDiv = document.getElementById('player');
    // playerDiv.innerHTML = `
    //     <button class="video-btn">Xem video hướng dẫn thiền định</button>
    // `;

    // // Xử lý sự kiện click button
    // const videoBtn = playerDiv.querySelector('.video-btn');
    // videoBtn.addEventListener('click', () => {
    //     showVideoModal('inpok4MKVLM');
    // });

    handleDisableSaveButton();
    checkinSaveBtn.addEventListener("click", async () => {
        handleSaveStatus("checkin");
    });

    checkoutSaveBtn.addEventListener("click", async () => {
        handleSaveStatus("checkout");
    });

    checkIfUserCheckedIn();
    checkIfUserCheckedOut();
});

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
            <button class="close-modal">&times;</button>
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

    // Handle close modal
    const closeBtn = modal.querySelector('.close-modal');
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('show');
        setTimeout(() => modal.remove(), 300);
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
        modal.classList.remove('show');
        setTimeout(() => modal.remove(), 300);
        window.location.reload();
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
            setTimeout(() => modal.remove(), 300);
            window.location.reload();
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
    player = new YT.Player('youtube-player', {
        events: {
            'onStateChange': function(event) {
                if (event.data === YT.PlayerState.ENDED) {
                    const modal = document.querySelector('.video-modal');
                    modal.classList.remove('show');
                    setTimeout(() => {
                        modal.remove();
                        showCongratulations();
                    }, 300);
                }
            }
        }
    });
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

// Đặt onYouTubeIframeAPIReady vào window object
window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;