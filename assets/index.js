var __adKernelBanner = {

    initGallery: function(slides, parent) {

        //=require blocks/gallery/gallery.js

    },

    setRate: function() {

        //=require blocks/rate/rate.js

    },

    initAnimation: function(images) {

        //=require blocks/animation/animation.js

    }

};

var imageArray = [
                  './img/unsplash.jpg',
                  './img/unsplash-2.jpg',
                  './img/unsplash-3.jpg',
                  './img/unsplash-4.jpg',
                  './img/unsplash-5.jpg',
                  './img/unsplash-6.jpg'
                 ];

__adKernelBanner.initAnimation(['./img/unsplash.jpg', './img/unsplash-2.jpg', './img/unsplash-3.jpg']);

__adKernelBanner.initGallery(imageArray, document.getElementById('slider'));

__adKernelBanner.setRate();
