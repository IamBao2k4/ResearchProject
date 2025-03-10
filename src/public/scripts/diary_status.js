// const emotionsLog = document.querySelector('.emotions-log');

// async function getAllCheckinStatus() {
//     const response = await fetch('/checkin/all');
//     const data = await response.json();
//     return data;
// }

// async function getAllCheckoutStatus() {
//     const response = await fetch('/checkout/all');
//     const data = await response.json();
//     return data;
// }

// document.addEventListener('DOMContentLoaded', async () => {
//     const checkinStatus = await getAllCheckinStatus();
//     const checkoutStatus = await getAllCheckoutStatus();

//     let dates = [];

//     checkinStatus.forEach(checkin => {
//         if (!dates.includes(checkin.date.split("T")[0])) {
//             dates.push(checkin.date.split("T")[0]);
//         }
//     });

//     checkoutStatus.forEach(checkout => {
//         if (!dates.includes(checkout.date.split("T")[0])) {
//             dates.push(checkout.date.split("T")[0]);
//         }
//     });

//     console.log("checkinStatus", checkinStatus);
//     console.log("checkoutStatus", checkoutStatus);

//     const uniqueDates = dates.sort((a, b) => new Date(b) - new Date(a));

//     console.log("uniqueDates", uniqueDates);

//     uniqueDates.forEach(date => {
//         const checkin = checkinStatus.find(checkin => checkin.date.split("T")[0] === date);
//         const checkout = checkoutStatus.find(checkout => checkout.date.split("T")[0] === date);

//         const emotionDiv = document.createElement('div');
//         emotionDiv.classList.add('log-entry');
//         emotionDiv.innerHTML = `
//             <div class="date">${date}</div>
//             <div class="emotion-status">
//                 <div class="emotion-icon">
//                     <img src="/images/emotions/.svg" alt="">
//                 </div>
//                 <div class="emotion-text"></div>
//             </div>
//             <div class="status">${checkin?.status || "Bạn chưa checkin cảm xúc vào ngày này!"}</div>
//             <div class="status">${checkout?.status || "Bạn chưa checkout cảm xúc vào ngày này!"}</div>
//             `;
//         emotionsLog.appendChild(emotionDiv);
//     });
// });

document.addEventListener('DOMContentLoaded', function () {
    const frontCover = document.getElementById('front-cover');
    const pages = document.querySelectorAll('.page');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const totalPages = pages.length;
    let currentPage = 0;
    let isAnimating = false;

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

            console.log("prev btn currentPage", currentPage);

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

            console.log("next btn currentPage", currentPage);

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
});