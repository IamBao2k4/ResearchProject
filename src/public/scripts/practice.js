console.log('Script loaded');

document.addEventListener("DOMContentLoaded", () => {
    const stepTitles = document.querySelectorAll(".practice_step_title");
    
    stepTitles.forEach((title) => {
        title.addEventListener("click", () => {
            const content = title.nextElementSibling;
            const step = title.closest('.practice_step');
            
            // Nếu là bước 2, mở video modal
            if (step.classList.contains('step_2')) {
                showVideoModal('inpok4MKVLM');
                return;
            }

            // Các bước khác thì toggle content bình thường
            if (content.style.display === "none" || content.style.display === "") {
                content.style.display = "block";
            } else {
                content.style.display = "none";
            }
        });
    });

    // Thay đổi nội dung của player div thành button
    const playerDiv = document.getElementById('player');
    playerDiv.innerHTML = `
        <button class="video-btn">Xem video hướng dẫn thiền định</button>
    `;

    // Xử lý sự kiện click button
    const videoBtn = playerDiv.querySelector('.video-btn');
    videoBtn.addEventListener('click', () => {
        showVideoModal('inpok4MKVLM');
    });
});

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

    // Load YouTube API nếu chưa được load
    if (!window.YT) {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    } else {
        onYouTubeIframeAPIReady();
    }

    // Xử lý đóng modal
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
                <button class="modal-btn modal-btn-survey">Khảo sát lại</button>
                <button class="modal-btn modal-btn-home">Về trang chủ</button>
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
    const surveyBtn = modal.querySelector('.modal-btn-survey');
    const homeBtn = modal.querySelector('.modal-btn-home');
    
    surveyBtn.addEventListener('click', () => {
        closeModal();
        window.location.href = '/survey';
    });
    
    homeBtn.addEventListener('click', () => {
        // Lưu trạng thái vào localStorage
        localStorage.setItem('hideVideoButton', 'true');
        closeModal();
        window.location.href = '/';
    });

    // Click outside to close
    overlay.addEventListener('click', closeModal);
}

// Đặt onYouTubeIframeAPIReady vào window object
window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;