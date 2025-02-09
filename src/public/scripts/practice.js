document.addEventListener("DOMContentLoaded", () => {
    const stepTitles = document.querySelectorAll(".practice_step_title");

    stepTitles.forEach((title) => {
        title.addEventListener("click", () => {
            const content = title.nextElementSibling;
            if (content.style.display === "none" || content.style.display === "") {
                content.style.display = "block";
            } else {
                content.style.display = "none";
            }
        });
    });
});

var player;

const videoIds = ["XhfRaoa_YmM", "wL7eZju8n-c"];

function onYouTubeIframeAPIReady() {

    // get point from url router.get("/practice/:score") 
    const url = window.location.href;
    const point = parseInt(url.split("/").pop());
    console.log(point);
    const videoId = videoIds[(point >= 14 && point <=19) ? 0 : 1];

    player = new YT.Player('player', {
        height: '360',
        width: '640',
        videoId: videoId, // ID của video trên YouTube
        playerVars: {
            'playsinline': 1
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerReady(event) {
    console.log("Player is ready");
}

function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.ENDED) {
        alert("Cảm ơn bạn đã xem video!");
    }
}