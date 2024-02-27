currentsong = new Audio()


function formatTime(seconds) {
  
    let minutes = Math.floor(seconds / 60);
    let remainingSeconds = seconds % 60;
    let secondsString = remainingSeconds < 10 ? '0' +Math.floor(remainingSeconds) : Math.floor(remainingSeconds) ;
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
       document.querySelector(".timer").innerHTML =`${formatTime(currentsong.currentTime)}/${formatTime(currentsong.duration)}`
        document.querySelector(".circle").style.left=`${(currentsong.currentTime/currentsong.duration)*100}%`
    })
const seekbar=document.querySelector(".seekbar");
seekbar.addEventListener("click",(e)=>{
document.querySelector(".circle").style.left=`${(e.offsetX/e.target.getBoundingClientRect().width)*100}%`
currentsong.currentTime=(currentsong.duration*((e.offsetX/e.target.getBoundingClientRect().width)*100))/100
})
const prev = document.querySelector("#prev");

prev.addEventListener("click", (e) => {
    console.log("Current song:", currentsong.src);
     const currentSongFilename = currentsong.src.split("/").slice(-1)[0];
const index = songs.indexOf(currentSongFilename)-1;
console.log(index)
currentsong.src=(`http://127.0.0.1:5500/songs/`+songs[index])
currentsong.play()
document.querySelector(".songinfo").innerHTML =decodeURI (currentsong.src.split("/").slice(-1)[0])
});

const next=document.querySelector("#next");
next.addEventListener("click",(e)=>{
    console.log("Current song:", currentsong.src);
    const currentSongFilename = currentsong.src.split("/").slice(-1)[0];
const index = songs.indexOf(currentSongFilename)+1;
console.log(index)
currentsong.src=(`http://127.0.0.1:5500/songs/`+songs[index])
currentsong.play()
document.querySelector(".songinfo").innerHTML =decodeURI (currentsong.src.split("/").slice(-1)[0])
})
}
main()

