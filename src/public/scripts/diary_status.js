const emotionsLog = document.querySelector('.emotions-log');

async function getAllCheckinStatus() {
    const response = await fetch('/checkin/all');
    const data = await response.json();
    return data;
}

async function getAllCheckoutStatus() {
    const response = await fetch('/checkout/all');
    const data = await response.json();
    return data;
}

document.addEventListener('DOMContentLoaded', async () => {
    const checkinStatus = await getAllCheckinStatus();
    const checkoutStatus = await getAllCheckoutStatus();

    let dates = [];

    checkinStatus.forEach(checkin => {
        if (!dates.includes(checkin.date.split("T")[0])) {
            dates.push(checkin.date.split("T")[0]);
        }
    });
    
    checkoutStatus.forEach(checkout => {
        if (!dates.includes(checkout.date.split("T")[0])) {
            dates.push(checkout.date.split("T")[0]);
        }
    });

    console.log("checkinStatus", checkinStatus);
    console.log("checkoutStatus", checkoutStatus);

    const uniqueDates = dates.sort((a, b) => new Date(b) - new Date(a));

    console.log("uniqueDates", uniqueDates);

    uniqueDates.forEach(date => {
        const checkin = checkinStatus.find(checkin => checkin.date.split("T")[0] === date);
        const checkout = checkoutStatus.find(checkout => checkout.date.split("T")[0] === date);

        const emotionDiv = document.createElement('div');
        emotionDiv.classList.add('log-entry');
        emotionDiv.innerHTML = `
            <div class="date">${date}</div>
            <div class="emotion-status">
                <div class="emotion-icon">
                    <img src="/images/emotions/.svg" alt="">
                </div>
                <div class="emotion-text"></div>
            </div>
            <div class="status">${checkin?.status || "Bạn chưa checkin cảm xúc vào ngày này!"}</div>
            <div class="status">${checkout?.status || "Bạn chưa checkout cảm xúc vào ngày này!"}</div>
            `;
        emotionsLog.appendChild(emotionDiv);
    });
});