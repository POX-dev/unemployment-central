import * as BareMux from "https://cdn.jsdelivr.net/npm/@mercuryworkshop/bare-mux/dist/index.mjs";
const { ScramjetController } = $scramjetLoadController();
const scramjet = new ScramjetController({ 
    prefix: "/scramjet/",
    files: { 
    wasm: "scramjet/wasm.wasm", 
    all: "scramjet/scramjet.all.js", 
    sync: "scramjet/scramjet.sync.js" 
    } 
});

scramjet.init();
const swPath = window.location.pathname.split('/')[1] ? `/${window.location.pathname.split('/')[1]}/sw.js` : '/sw.js';
navigator.serviceWorker.register(swPath);

const connection = new BareMux.BareMuxConnection("/bareworker.js");

function getWispUrl() {
    const wisp = document.getElementById("websocket").value.trim();
    const savedWisp = localStorage.getItem('wispUrl');
    const defaultWisp = "wss://gointospace.app/wisp/";
    return wisp || savedWisp || defaultWisp;
}

async function setTransport(transportsel) {
    const wispUrl = getWispUrl();
    switch (transportsel) {
    case "epoxy":
        await connection.setTransport("https://cdn.jsdelivr.net/npm/@mercuryworkshop/epoxy-transport/dist/index.mjs", [{ wisp: wispUrl }]);
        break;
    case "libcurl":
        await connection.setTransport("https://cdn.jsdelivr.net/npm/@mercuryworkshop/libcurl-transport/dist/index.mjs", [{ websocket: wispUrl }]);
        break;
    default:
        await connection.setTransport("https://cdn.jsdelivr.net/npm/@mercuryworkshop/epoxy-transport/dist/index.mjs", [{ wisp: wispUrl }]);
        break;
    }
}

window.setTransport = setTransport;

window.search = function(input) {
    let template = "https://search.brave.com/search?q=%s";

    try {
    return new URL(input).toString();
    } catch (err) {}

    try {
    let url = new URL(`http://${input}`);
    if (url.hostname.includes(".")) return url.toString();
    } catch (err) {}

    return template.replace("%s", encodeURIComponent(input)); 
}

setTransport("epoxy");

document.getElementById("search").addEventListener("submit", async (event) => {
    event.preventDefault();
    let fixedurl = document.getElementById("url").value;
    const frame = scramjet.createFrame();
    frame.frame.id = "sj-frame";
	document.body.appendChild(frame.frame);	
	frame.go(fixedurl);
});