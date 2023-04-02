let allCanvas = document.createElement('canvas');
let actx = allCanvas.getContext("2d");

function main3(elm){
    console.log("main3");
    // Element to capture

    // Calculate number of sections required
    let numSections = Math.ceil((elm.height+elm.top) / elm.clientH);

    allCanvas.width = elm.width;
    allCanvas.height = elm.height;
    
    // Create promises for each section to capture
    index = {num:numSections,i:0}

    url = elm.url;
    main(elm,elm.clientH-elm.top,index);
    

}

function main(elm,clientH,index){
    console.log("main");
    let topOffset;
    if(index.i == index.num-1 && index.num != 1){
        topOffset =  elm.height-clientH;
    }else{
        topOffset =  index.i * clientH;
    }
    scrollPromise(topOffset)
    .then(()=>captureSection(elm, clientH, index,topOffset))
    .then((index)=>{
        console.log("next");
        if(index.i != index.num){
          main(elm,clientH,index); 
        }else{
            btn.click();            
            console.log("end");
        }
    })

}

function copy(){
    console.log("copy");
    chrome.permissions.request({permissions: ['clipboardWrite']}, function(granted) {
        if (granted) {
            // キャンバスをクリップボードにコピーする
            allCanvas.toBlob(blob => {
                const item = new ClipboardItem({ "image/png": blob });
                navigator.clipboard.write([item]).then(() => {
                console.log('Copied to clipboard');

                const p = document.createElement("p"); // p要素を作成
                p.textContent = "copied!"; // p要素のテキストを設定
                document.body.appendChild(p); // body要素にp要素を追加
              });
            });
        } else {
            console.error('Clipboard write permission denied');
        }
    });
}

function scrollPromise(topOffset) {
  return new Promise((resolve, reject) => {
    console.log("scroll");
    chrome.tabs.executeScript({ code: "window.scrollTo(0, " + topOffset + ");" }, () => {
      resolve();
    });
  });
}

var url="";

// Function to capture a section and append it to the array
function captureSection(elm,clientH,index,topOffset) {
    return new Promise((resolve, reject) => {
        console.log("capture");
        console.log(topOffset);
        let ctxHeight;
        if( index.i == index.num-1){
          ctxHeight = elm.height-clientH*index.i;
        }else{
          ctxHeight = clientH;
        }
        let top = elm.top+index.i*clientH-topOffset;

        let options = {
          format: "png",
          quality: 100
        };
        chrome.tabs.captureVisibleTab(options, function(screenshotUrl) {
            let img = new Image();
            img.onload = function() {
            let canvas = document.createElement('canvas');
            let ctx = canvas.getContext('2d');
            console.log( "elm", elm, clientH);
            canvas.width = elm.width;
            canvas.height = ctxHeight;
            ctx.drawImage(img, elm.left, top, elm.width, ctxHeight, 0, 0, elm.width, ctxHeight);
            console.log("top",top);
            actx.drawImage( canvas, 0, index.i*clientH );

            index.i ++;
            resolve(index);
          };
            img.src = screenshotUrl;
        });
    });
}


document.addEventListener('DOMContentLoaded', function() {
    console.log("load");
    send();
});

let btn = document.getElementById("myB");
btn.addEventListener("click",function(){
    copy();
});


function send(){
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { command: "getArtElmPosition" }, function(response) {
        if( response.result ){
            main3( response.result );
        }
      });
    });
}



