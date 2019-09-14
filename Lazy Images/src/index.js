import './styles.scss'

let images_loaded = 0;

$(document).ready(function () {

    const main = $('main').eq(0)
    const lazyImages = []

    // Create 1000 images but dont assign a src to them, save the url in data-src
    for (let i = 0; i <= 1000; i++) {
        const rnd = Math.floor(Math.random() * 100)
        const base_url = `https://picsum.photos/id/${i + rnd }`
        const img = new Image()
        img.setAttribute('data-src', base_url + '/500')
        img.setAttribute('data-id', i)
        img.addEventListener('load', onLoad)
        img.addEventListener('error', onError)

        main.append(img)
        lazyImages.push(img)
    }

    if ("IntersectionObserver" in window) {
        console.log("We have intersection observer")

        let lazyImageObserver = new IntersectionObserver(function (entries, observer) {

            // When the image is visible copy the data-src to src
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    let lazyImage = entry.target;
                    lazyImage.src = lazyImage.dataset.src;
                    lazyImage.classList.remove("lazy");
                    lazyImageObserver.unobserve(lazyImage);
                }
            });
        });

        lazyImages.forEach(img => {
            lazyImageObserver.observe(img);
        });
    }
});

function onLoad(e) {
    images_loaded++;
    console.log("Loaded image")
}

function onError(e){
    console.log('Image 404')
    images_loaded++;
    $(e.target).remove()
}

