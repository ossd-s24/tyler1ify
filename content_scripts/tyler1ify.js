const imgPath = "images_tyler1/"
const IMAGELIST = [
    'a.png',
    'b.png',
    'c.png',
    'd.png',
    'e.png',
    'f.png',
    'g.png',
    'h.png',
]

//Apply overlay to a thumbnail
function applyOverlay(thumbnailElement, overlayImgPath) {
    let overlay = document.createElement("img");
    overlay.src = browser.runtime.getURL(overlayImgPath);
    overlay.style.position = "absolute";
    overlay.style.width = "100%";
    overlay.style.transform = 'translate(-100%, 0%)';
    overlay.style.zIndex = "0"; //put overlay ahead of thumbnail but behind time so it looks normal
    thumbnailElement.parentElement.insertBefore(overlay, thumbnailElement.nextSibling);
}

function findThumbnails() {
    // thumbnails on home page
    const homepageThumbnails = document.querySelectorAll("ytd-thumbnail:not(.ytd-video-preview,.ytd-rich-grid-slim-media) a > yt-image > img.yt-core-image:only-child:not(.yt-core-attributed-string__image-element)");

    // thumbnails in notifications
    const notificationImages = document.querySelectorAll('img.style-scope.yt-img-shadow[width="86"]');

    const homePageImages = [ // Put all the selected images into an array
        ...Array.from(homepageThumbnails),
        ...Array.from(notificationImages),
    ];
    // check to see if we found any thumbnails
    console.log(thumbnailImages.length, "thumbnails found on homepage.")

    // filter images by aspect ratio

    const TARGETRATIO = [16 / 9, 4 / 3];
    const MARGINOFERROR = 0.02; // Allows for 4:3, since YouTube is badly coded

    const filteredHomePageImages = homePageImages.filter((img) => {
        if (img.height === 0 || img.width === 0) return false; //ignore images with no dimensions

        const aspectratio = img.width / img.height;
        for (let i = 0; i < TARGETRATIO.length; i++) {
            if (Math.abs(aspectratio - TARGETRATIO[i]) < MARGINOFERROR) {
                return true;
            }
        }
    });


    // get all recommendation thumbnails
    const recImages = document.querySelectorAll(".ytp-videowall-still-image:not([style*='extension:'])");
    const allImages = [...filteredHomePageImages, ...Array.from(recImages)];


    // TODO: directly return instead of store in res, this is for debugging purposes only
    const res = allImages.filter(image => {
        const parent = image.parentElement;

        // Checks whether it's a video preview
        const isVideoPreview = parent.closest("#video-preview") !== null || parent.tagName == "YTD-MOVING-THUMBNAIL-RENDERER"

        // Checks whether it's a chapter thumbnail
        const isChapter = parent.closest("#endpoint") !== null


        // Check if thumbnails have already been processed
        const processed = Array.from(parent.children).filter(child => {
            return (
                child.src &&
                child.src.includes("extension") ||
                isVideoPreview || isChapter)
        });

        return processed.length == 0;
    })

    console.log(res.length, "thumbnails found.")
    console.log('data', res)
    return res;
}

function executeOverlays() { //use list from findThumbnails with applyOverlay() to apply overlays to all thumbnails
    const thumbnails = findThumbnails();
    thumbnails.forEach((thumbnail, index) => {
        const overlay = IMAGELIST[index % IMAGELIST.length]; // cycle through the list of overlays, TODO: maybe random?
        applyOverlay(thumbnail, `${imgPath}/${overlay}`);
    });
}


var int = '';
browser.runtime.onMessage.addListener((message) => {
    if (message.action === 'enableExtension') {
        console.log("Extension enabled.");
        int = setInterval(executeOverlays, 100);
    } else if (message.action === 'disableExtension') {
        console.log("Extension disabled.");
        // Remove all overlays
        const overlays = document.querySelectorAll("img[src*='extension']");
        overlays.forEach(overlay => overlay.remove());
        clearInterval(int);
    }
});
int = setInterval(executeOverlays, 100);

