currentsong = new Audio()


function formatTime(seconds) {
    // Calculate minutes and seconds
    let minutes = Math.floor(seconds / 60);
    let remainingSeconds = seconds % 60;
    
    // Pad single-digit seconds with a leading zero
    let secondsString = remainingSeconds < 10 ? '0' +Math.floor(remainingSeconds) : Math.floor(remainingSeconds) ;
    
    // Return formatted time as a string
    return minutes + ':' + secondsString;
}
async function getSong() {
    let songApi = await fetch('http://127.0.0.1:5500/songs/');
    let response = await songApi.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    ats = div.getElementsByTagName("a")

    let songs = [];
    for (let i = 0; i < ats.length; i++) {
        song = ats[i];
        if (song.href.endsWith(".mp3")) {
            songs.push(song.href.split("/songs/")[1]);
        }
    }

    return songs
}
async function main() {
    songs = await getSong();
    let playing = false;
    const plays = document.getElementById("play");
    plays.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play()
            plays.innerHTML = '<img class="invert"  src="pause.svg" alt="">' //populating library
        } else {
            currentsong.pause()
            plays.innerHTML = '<img class="invert"  src="play.svg" alt="">'
        }
    });
    let music = document.querySelector(".musiclib");
    for (const obj of songs) {
        music.innerHTML = music.innerHTML + `<li class="musiclist">${decodeURI(obj)}</li>`
    }

    Array.from(document.querySelector(".musiclib").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", () => {
            document.querySelector(".songinfo").innerHTML = decodeURI(e.innerHTML)
            document.querySelector(".timer").innerHTML = "00/00"
            currentsong.src = "http://127.0.0.1:5500/songs/" + e.innerHTML
            currentsong.play();
        });
    })
    currentsong.addEventListener("timeupdate", () => {
        console.log(currentsong.currentTime, currentsong.duration)
        document.querySelector(".timer").innerHTML =`${formatTime(currentsong.currentTime)}/${formatTime(currentsong.duration)}`
        document.querySelector(".circle").style.left=`${(currentsong.currentTime/currentsong.duration)*100}%`
    })

}
main()

