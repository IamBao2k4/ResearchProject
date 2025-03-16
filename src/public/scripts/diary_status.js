document.addEventListener('DOMContentLoaded',async function () {
    const frontCover = document.getElementById('front-cover');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    let pages;
    let totalPages;
    let currentPage = 0;
    let isAnimating = false;
    
    // Thêm class loading để ngăn chặn hiện trong suốt trong quá trình tải
    document.querySelector('#diaryStatus').classList.add('loading');

    await loadDiaryStatus();

    // Initialize page positions
    function initPages() {
        // Debug: Kiểm tra số lượng trang và trạng thái
        console.log(`Tổng số trang: ${pages.length}`);
        console.log(`Trang bìa: ${frontCover.id}`);
        
        if (pages.length > 1) {
            console.log(`Trang thứ 2 có ID: ${pages[1].className}`);
        }
        
        // Set all pages to initial position (behind cover)
        pages.forEach((page, index) => {
            // Log thông tin về mỗi trang
            console.log(`Trang ${index}: ${page.className}`);
            
            // Chuẩn bị tất cả các trang từ đầu
            page.style.transform = 'rotateY(0deg)';
            page.style.zIndex = totalPages - index;
            
            // Ẩn tất cả các trang - đảm bảo visibility và opacity đều được thiết lập
            page.style.visibility = 'hidden';
            page.style.opacity = '0';
            
            // Thêm class để ngăn chặn hiệu ứng trong suốt
            page.classList.add('page-hidden');
        });
        
        // Đảm bảo bìa sách luôn hiển thị
        frontCover.style.visibility = 'visible';
        frontCover.style.opacity = '1';
        frontCover.classList.remove('page-hidden');
        
        // Loại bỏ class loading
        setTimeout(() => {
            document.querySelector('#diaryStatus').classList.remove('loading');
        }, 100);
    }

    initPages();

    let isNext = false;
    let isPrev = false;

    // Turn to previous page
    function prevPage() {
        if (currentPage >= 0 && !isAnimating) {
            isAnimating = true;

            if(isNext && currentPage > 0) currentPage--;

            if (currentPage === 0) {
                // Thêm class turning cho hiệu ứng
                frontCover.classList.add('turning');
                
                // Chuẩn bị trang đầu tiên để ẩn đi (nếu đang hiển thị)
                if (pages[0] && pages[0].style.visibility === 'visible') {
                    // Chuyển opacity về 0 với transition
                    pages[0].style.opacity = '0';
                    
                    // Đặt timeout dài hơn để đảm bảo opacity có thời gian transition
                    setTimeout(() => {
                        // Quay bìa về vị trí ban đầu
                        frontCover.style.transform = 'rotateY(0deg)';
                        
                        // Đợi bìa quay được một nửa rồi mới ẩn page
                        setTimeout(() => {
                            // Ẩn trang đầu chỉ khi bìa đã quay đủ xa
                            pages[0].style.visibility = 'hidden';
                            // Thêm class ẩn trang
                            pages[0].classList.add('page-hidden');
                            
                            // Hoàn thành animation
                            setTimeout(() => {
                                frontCover.classList.remove('turning');
                                isAnimating = false;
                            }, 300); 
                        }, 350);
                    }, 100);
                } else {
                    // Quay bìa về vị trí ban đầu
                    frontCover.style.transform = 'rotateY(0deg)';
                    
                    // Đợi animation hoàn thành
                    setTimeout(() => {
                        frontCover.classList.remove('turning');
                        isAnimating = false;
                    }, 700);
                }
            } else {
                // Lật trang từ trang hiện tại về trang trước đó
                console.log(`Quay về từ trang: ${currentPage} sang trang: ${currentPage - 1}`);
                
                // Thêm class turning cho hiệu ứng
                pages[currentPage - 1].classList.add('turning');
                
                // Chuẩn bị trang trước đó (sẽ lật về)
                if (currentPage > 1 && pages[currentPage - 2]) {
                    // Xóa bỏ class ẩn
                    pages[currentPage - 2].classList.remove('page-hidden');
                    // Đảm bảo trang trước đó đã sẵn sàng hiển thị sau khi lật
                    pages[currentPage - 2].style.visibility = 'visible';
                    // Bắt đầu với opacity 0 để có thể fade-in sau
                    pages[currentPage - 2].style.opacity = '0';
                }
                
                // Flip the current page back
                pages[currentPage - 1].style.transform = 'rotateY(0deg)';
                pages[currentPage - 1].classList.remove('flipped');
                
                // Đợi animation hoàn thành một nửa trước khi hiển thị trang mới
                setTimeout(() => {
                    // Hiển thị trang trước đó nếu có
                    if (currentPage > 1 && pages[currentPage - 2]) {
                        // Hiệu ứng fade-in cho trang trước đó
                        pages[currentPage - 2].style.opacity = '1';
                    }
                    
                    // Cập nhật trang hiện tại
                    currentPage--;
                    
                    // Đợi animation hoàn thành
                    setTimeout(() => {
                        // Thêm class ẩn cho trang không hiển thị nữa
                        if (currentPage < totalPages - 1) {
                            pages[currentPage + 1].classList.add('page-hidden');
                        }
                    
                        // Bỏ class turning sau khi đã lật xong
                        pages[currentPage].classList.remove('turning');
                        isAnimating = false;
                    }, 350);
                }, 350);
            }

            isPrev = true;
            isNext = false;
            updateButtons();
        }
    }

    // Turn to next page
    function nextPage() {
        if (currentPage < totalPages && !isAnimating) {
            isAnimating = true;

            if(isPrev && currentPage < totalPages && currentPage > 0) currentPage++;

            if (currentPage === 0) {
                // Đang ở bìa và muốn lật trang đầu tiên
                // Thêm class turning cho hiệu ứng
                frontCover.classList.add('turning');
                
                // Chuẩn bị trang đầu tiên trước khi mở bìa
                if (pages[0]) {
                    // Đảm bảo trang đầu tiên đã sẵn sàng nhưng chưa hiển thị
                    pages[0].classList.remove('page-hidden');
                    pages[0].style.visibility = 'hidden';
                    pages[0].style.opacity = '0';
                }
                
                // Open the cover
                frontCover.style.transform = 'rotateY(-180deg)';
                
                // Đợi bìa mở được nửa đường
                setTimeout(() => {
                    // Hiển thị trang đầu tiên khi bìa đã mở đủ xa
                    if (pages[0]) {
                        // Hiện trang ra trước, vẫn với opacity 0
                        pages[0].style.visibility = 'visible';
                        
                        // Đợi một khoảng ngắn rồi mới tăng opacity
                        setTimeout(() => {
                            // Hiệu ứng fade-in cho nội dung trang
                            pages[0].style.opacity = '1';
                            
                            // Chuẩn bị sẵn trang thứ 2 nếu có
                            if (pages[1]) {
                                pages[1].classList.remove('page-hidden');
                                pages[1].style.visibility = 'hidden';
                                pages[1].style.opacity = '0';
                            }
                            
                            // Hoàn tất animation
                            setTimeout(() => {
                                frontCover.classList.remove('turning');
                                isAnimating = false;
                            }, 300);
                        }, 100);
                    }
                }, 350);
            } else {
                // Lật các trang nội dung (từ trang 1 trở đi)
                
                // Thêm class turning cho hiệu ứng
                pages[currentPage - 1].classList.add('turning');
                
                // Chuẩn bị trang tiếp theo (sẽ hiển thị)
                if (currentPage < totalPages) {
                    // Log để debug
                    console.log(`Chuẩn bị hiển thị trang: ${currentPage + 1}`);
                    
                    // Xóa bỏ class ẩn
                    pages[currentPage].classList.remove('page-hidden');
                    // Ẩn trang tiếp theo chờ trang hiện tại lật qua
                    pages[currentPage].style.visibility = 'hidden';
                    pages[currentPage].style.opacity = '0';
                    
                    // Chuẩn bị trang tiếp theo sau đó nếu có
                    if (currentPage + 1 < totalPages) {
                        pages[currentPage + 1].classList.remove('page-hidden');
                    }
                }
                
                // Lật trang hiện tại
                pages[currentPage - 1].style.transform = 'rotateY(-180deg)';
                pages[currentPage - 1].classList.add('flipped');
                
                // Đợi animation đủ xa để trang tiếp theo không bị chồng lên trang đang lật
                setTimeout(() => {
                    // Hiển thị trang tiếp theo nếu có
                    if (currentPage < totalPages) {
                        // Hiện trang ra nhưng chưa có opacity
                        pages[currentPage].style.visibility = 'visible';
                        
                        // Đợi thêm một khoảng ngắn để tránh hiệu ứng chớp
                        setTimeout(() => {
                            // Hiệu ứng fade-in cho trang tiếp theo
                            pages[currentPage].style.opacity = '1';
                            
                            // Tăng trang hiện tại và hoàn tất animation
                            currentPage++;
                            
                            // Log để debug
                            console.log(`Đã chuyển đến trang: ${currentPage}`);
                            
                            // Đợi animation hoàn thành
                            setTimeout(() => {
                                pages[currentPage - 1].classList.remove('turning');
                                isAnimating = false;
                            }, 300);
                        }, 150);
                    } else {
                        // Nếu không có trang tiếp theo
                        currentPage++;
                        setTimeout(() => {
                            pages[currentPage - 1].classList.remove('turning');
                            isAnimating = false;
                        }, 500);
                    }
                }, 400);
                
                isPrev = false;
                isNext = true;
                
                updateButtons();
                return; // Prevent the currentPage++ below
            }

            currentPage++;
            
            isPrev = false;
            isNext = true;

            updateButtons();
        }
    }

    // Update button states
    function updateButtons() {
        prevBtn.disabled = currentPage === 0;
        nextBtn.disabled = currentPage === totalPages;
    }

    // Event listeners
    prevBtn.addEventListener('click', prevPage);
    nextBtn.addEventListener('click', nextPage);

    // Optional: Add keyboard navigation
    document.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowLeft') {
            prevPage();
        } else if (e.key === 'ArrowRight') {
            nextPage();
        }
    });

    // load diary status data
    async function loadDates() {
        const response = await fetch('/api/all-status-date');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    }

    async function loadCheckinStatus() {
        const response = await fetch('/checkin/all');
        const data = await response.json();
        return data;
    }

    async function loadCheckoutStatus() {
        const response = await fetch('/checkout/all');
        const data = await response.json();
        return data;
    }

    async function loadDiaryStatus() {
        const dates = await loadDates();
        const checkinStatus = await loadCheckinStatus();
        const checkoutStatus = await loadCheckoutStatus();
        const book = document.querySelector('.book');

        console.log(`Số ngày lấy được: ${dates.length}`);

        // Xóa hết các trang đã tồn tại (nếu có)
        const existingPages = book.querySelectorAll('.page:not(#front-cover)');
        existingPages.forEach(page => page.remove());

        for (let i = 0; i < dates.length; i++) {
            let date = dates[i];
            console.log(`Tạo trang ${i+1} cho ngày: ${date}`);
            
            let checkin = checkinStatus.find(status => new Date(status.date).toISOString().split("T")[0] === date);
            let checkout = checkoutStatus.find(status => new Date(status.date).toISOString().split("T")[0] === date);

            // Chuyển đổi định dạng ngày từ YYYY-MM-DD thành DD-MM-YYYY
            let formattedDate = '';
            if (date) {
                const dateParts = date.split('-');
                if (dateParts.length === 3) {
                    formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
                } else {
                    formattedDate = date; // Giữ nguyên nếu không đúng định dạng
                }
            }

            let page = document.createElement('div');
            page.classList.add('page');
            const pageClass = 'page'+(i+1); 
            page.classList.add(pageClass);
            page.id = `page${i+1}`;  // Thêm ID để dễ debug
            page.innerHTML = `
                <div class="page-content">
                    <div class="diary-date">${formattedDate}</div>
                    <h2 class="diary-title">Cảm xúc thường ngày.</h2>
                    <div class="diary-content">
                        <p>Cảm xúc đầu ngày: </p>
                        <p>${checkin?.status || "Bạn chưa checkin cảm xúc đầu ngày!"}</p>
                        <p>Cảm xúc cuối ngày: </p>
                        <p>${checkout?.status || "Bạn chưa checkout cảm xúc cuối ngày!"}</p>
                    </div>
                    <div class="page-number">${i + 1}</div>
                    <div class="page-curl"></div>
                </div>
            `;

            book.appendChild(page);
            console.log(`Đã thêm trang ${i+1} vào sách`);
        }

        const backCover = document.createElement('div');
        backCover.classList.add('page');
        backCover.id = 'back-cover';
        backCover.innerHTML = `
            <div class="page-content"
                style="background-color: #8b4513; color: #f5f5dc; display: flex; justify-content: center; align-items: center; text-align: center;">
                <p>"The diary is an exercise in freedom—a space to process, reflect, and dream."</p>
            </div>
        `;

        book.appendChild(backCover);
        pages = document.querySelectorAll('.page');
        totalPages = pages.length - 1;
        
        console.log(`Đã tải xong ${pages.length} trang, bao gồm cả bìa sau.`);
        console.log('Danh sách các trang:');
        pages.forEach((page, index) => {
            console.log(`- Trang ${index}: ${page.id || page.className}`);
        });
    }
});