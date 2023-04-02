function getArtElementPosition() {
    window.scrollTo(0, 0);
    let artElement = document.querySelector('.css-1dbjc4n.r-18u37iz.r-1ny4l3l.r-1udh08x.r-1qhn6m8.r-i023vh');
    if (artElement) {
        let artPosition = artElement.getBoundingClientRect();
        let artLeft = artPosition.left;
        let artTop = artPosition.top;
        let artWidth = artPosition.width;
        let artHeight = artPosition.height;
        let clientH = window.innerHeight;
        let currentUrl = window.location.href;
        return {left: artLeft, top: artTop, width: artWidth, height: artHeight, clientH:clientH, url:currentUrl};
    } else {
        console.log('class="art"の要素が見つかりませんでした。');
        return null;
    }
}
console.log("this is twitter");

function message(request, sender, sendResponse){
    console.log(request.command);
    if(request.command == "getArtElmPosition") {
        let result = getArtElementPosition();
        console.log("send",result);
        sendResponse({ result:result });
    }

}
chrome.runtime.onMessage.addListener(message);