// ...existing code...

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

// ...existing code...