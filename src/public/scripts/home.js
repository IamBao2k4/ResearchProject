document.querySelector('.logout-button').addEventListener('click', function() {
    // Gửi yêu cầu đăng xuất tới server
    fetch('/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => {
        if (response.ok) {
            // Chuyển hướng tới trang đăng nhập sau khi đăng xuất thành công
            window.location.href = '/login';
        } else {
            alert('Đăng xuất thất bại. Vui lòng thử lại.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Có lỗi xảy ra. Vui lòng thử lại.');
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const surveyLoginBtn = document.querySelector('#survey-login-btn');
    
    if (surveyLoginBtn) {
        surveyLoginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = '/login';
        });
    }
    
    // Tìm nút bằng class video-btn
    const continueVideoBtn = document.querySelector('.video-btn');
    
    if (continueVideoBtn) {
        // Kiểm tra trạng thái từ localStorage
        if (localStorage.getItem('hideVideoButton') === 'true') {
            // Tìm phần tử cha gần nhất và ẩn nó
            const parentElement = continueVideoBtn.closest('#player');
            if (parentElement) {
                parentElement.style.display = 'none';
            }
            localStorage.removeItem('hideVideoButton');
        }
    }
});

// ...existing code...