function showOptions() {
    const options = document.getElementById('profile-options');
    if (options.style.display === 'none' || options.style.display === '') {
        options.style.display = 'block';
    } else {
        options.style.display = 'none';
    }
}

document.addEventListener('click', function(event) {
    const options = document.getElementById('profile-options');
    const profileBtn = document.querySelector('.profile-btn');
    if (options && profileBtn && !profileBtn.contains(event.target) && !options.contains(event.target)) {
        options.style.display = 'none';
    }
});