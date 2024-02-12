const imgPath = "../images_tyler1"

//Apply overlay to a thumbnail
function applyOverlay(thumbnailElement, overlayImgPath) {
    let overlay = document.createElement("img");
    overlay.src = overlayImgPath;
    overlay.style.position = "absolute";
    overlay.style.width = "100%";
    overlay.style.transform = 'translate(-50%, -50%)';
    overlay.style.zIndex = "0"; //put overlay ahead of thumbnail but behind time so it looks normal
    thumbnailElement.parentElement.insertBefore(overlay, thumbnailElement.nextSibling);
}

function findThumbnails() { //returns a list of thumbnail elements in the DOM
    return;
}

function executeOverlays() { //use list from findThumbnails with applyOverlay() to apply overlays to all thumbnails
    return;
}

function fakeRandomShuffle() {//OPTIONAL FUNCTION: use various algorithms to ensure non-repeating thumbnails, completely unnecessary but would be cool
    return;
}

fakeRandomShuffle()
    .then(() => {
        setInterval(executeOverlays, 100);
        console.log("Tyler1fy Loaded Successfully.");
    })