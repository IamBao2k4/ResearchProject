document.addEventListener('DOMContentLoaded',async function () {
    const frontCover = document.getElementById('front-cover');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    let pages;
    let totalPages;
    let currentPage = 0;
    let isAnimating = false;

    await loadDiaryStatus();

    // Initialize page positions
    function initPages() {
        // Set all pages to initial position (behind cover)
        pages.forEach((page, index) => {
            page.style.transform = 'rotateY(0deg)';
            page.style.zIndex = totalPages - index;
            if (index > 0) {
                // Hide all pages except the first one
                page.style.visibility = 'hidden';
            }
        });
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
                // Return to cover
                frontCover.style.transform = 'rotateY(0deg)';
                // Hide the first page
                setTimeout(() => {
                    pages[0].style.visibility = 'hidden';
                }, 700);
            } else {
                
                // Flip the current page back
                pages[currentPage - 1].style.transform = 'rotateY(0deg)';
                pages[currentPage - 1].classList.remove('flipped');

                pages[currentPage - 1].style.visibility = 'visible';
                currentPage--;
            }

            isPrev = true;
            isNext = false;
            updateButtons();
            
            isAnimating = false;
        }
    }

    // Turn to next page
    function nextPage() {
        if (currentPage < totalPages && !isAnimating) {
            isAnimating = true;

            if(isPrev && currentPage < totalPages && currentPage > 0) currentPage++;

            if (currentPage === 0) {
                // Open the cover
                frontCover.style.transform = 'rotateY(-180deg)';
                // Show the first page
                pages[0].style.visibility = 'visible';
            } else {
                // Flip the current page
                pages[currentPage - 1].style.transform = 'rotateY(-180deg)';
                pages[currentPage - 1].classList.add('flipped');

                // Show the next page
                if (currentPage < totalPages) {
                    pages[currentPage].style.visibility = 'visible';
                }
                
            }

            currentPage++;
            
            isPrev = false;
            isNext = true;

            updateButtons();

            setTimeout(() => {
                isAnimating = false;
            }, 700);
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

    async function loadCheckinStatus()
    {
        const response = await fetch('/checkin/all');
        const data = await response.json();
        return data;
    }

    async function loadCheckoutStatus()
    {
        const response = await fetch('/checkout/all');
        const data = await response.json();
        return data;
    }

    async function loadDiaryStatus()
    {
        const dates = await loadDates();
        const checkinStatus = await loadCheckinStatus();
        const checkoutStatus = await loadCheckoutStatus();
        const book = document.querySelector('.book');

        for (let i = 0; i < dates.length; i++) {
            let date = dates[i];
            console.log("Date: ", date);
            let checkin = checkinStatus.find(status => new Date(status.date).toISOString().split("T")[0] === date);
            let checkout = checkoutStatus.find(status => new Date(status.date).toISOString().split("T")[0] === date);

            let page = document.createElement('div');
            page.classList.add('page');
            const pageClass = 'page'+(i+1); 
            page.classList.add(pageClass);
            page.innerHTML = `
                <div class="page-content">
                    <div class="diary-date">${date}</div>
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
    }


});