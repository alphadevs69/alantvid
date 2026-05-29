const appBtn = document.getElementById("appBtn");

const apkUrl = "https://alantvid.pages.dev/app.apk";
const appScheme = "alantv://open";

const isAndroid = /Android/i.test(navigator.userAgent);

appBtn.innerText = "Get App";

if(isAndroid){

appBtn.addEventListener("click", function(e){
e.preventDefault();

let opened = false;

const onVisibilityChange = function(){
if(document.hidden){
opened = true;
appBtn.innerText = "Launch App";
}
};

document.addEventListener(
"visibilitychange",
onVisibilityChange,
{ once:true }
);

window.location.href = appScheme;

setTimeout(function(){

if(!opened){

appBtn.innerText = "Get App";
window.location.href = apkUrl;

}

},1800);

});

}else{

appBtn.innerText = "Get App";
appBtn.href = apkUrl;
appBtn.setAttribute("download","app.apk");

}

function toggleMenu(){

const menu = document.getElementById("copyMenu");

if(menu.style.display === "block"){
menu.style.display = "none";
}else{
menu.style.display = "block";
}

}

function showImage(){

const img = document.getElementById("sawitImage");

if(img.style.display === "block"){
img.style.display = "none";
}else{
img.style.display = "block";
}

}

function copyLink(url){

navigator.clipboard.writeText(url)
.then(() => {

const toast = document.getElementById("toast");

toast.classList.add("show");

setTimeout(() => {
toast.classList.remove("show");
},2000);

})
.catch(() => {
alert("Copy gagal");
});

}

const music = document.getElementById("bgMusic");
const musicBtn = document.getElementById("musicBtn");
const musicPlayer = document.getElementById("musicPlayer");

window.addEventListener("load", () => {

music.volume = 0.55;

const playPromise = music.play();

if(playPromise !== undefined){

playPromise.catch(() => {

setPaused();

document.addEventListener("click", () => {

music.play();
setPlaying();

},{ once:true });

});

}

});

function toggleMusic(){

if(music.paused){

music.play();
setPlaying();

}else{

music.pause();
setPaused();

}

}

function setPlaying(){

musicBtn.innerText = "⏸";
musicPlayer.classList.remove("paused");

}

function setPaused(){

musicBtn.innerText = "▶";
musicPlayer.classList.add("paused");

}