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
    const thumbnailImages = document.querySelectorAll("ytd-thumbnail:not(.ytd-video-preview, .ytd-rich-grid-slim-media) a > yt-image > img.yt-core-image:only-child:not(.yt-core-attributed-string__image-element)");
    const notificationImages = document.querySelectorAll('img.style-scope.yt-img-shadow[width="86"]');

    const homePageImages = [ // Put all the selected images into an array
        ...Array.from(thumbnailImages),
        ...Array.from(notificationImages),
    ];

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
    // for (let i = 0; i < thumbnails.length; i++) {
    //     const thumbnail = thumbnails[i];
    //     applyOverlay(thumbnail, chrome.runtime.getURL(`${imgPath}/tyler1.png`));
    // }
}

function fakeRandomShuffle() {//OPTIONAL FUNCTION: use various algorithms to ensure non-repeating thumbnails, completely unnecessary but would be cool
    // for now, just return the list of images to replace the thumbnails
    // get all png under images_tyler1

    // TODO: use a map function to get the images
    const images = [
        'images_tyler1/a.png',
        'images_tyler1/b.png',
        'images_tyler1/c.png',
        'images_tyler1/d.png',
        'images_tyler1/e.png',
        'images_tyler1/f.png',
        'images_tyler1/g.png',
        'images_tyler1/h.png',
    ]
    return new Promise((resolve, reject) => {
        resolve(images);
    });
}

fakeRandomShuffle()
    .then((images) => {
        console.log(images)
        setInterval(executeOverlays, 100);
        console.log("Tyler1fy Loaded Successfully.");
    })