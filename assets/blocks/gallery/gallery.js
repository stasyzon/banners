function initGallery(slides) {

    var slider = document.getElementById('slider');

    calculateTransform(false, -200);

    (function addSlides() {

        for (var i = 0; i < slides.length; i++) {

            var slide = document.createElement('div');

            slide.classList.add('gallery__item');
            slide.style.background = 'url(' + slides[i] + ') no-repeat center / cover';

            slider.appendChild(slide);
        }

    })();

    (function initControllers() {

        for (var i = 0; i < slides.length; i++) {

            var controller = document.createElement('div');

            controller.classList.add('controller__item');

            document.getElementById('controlerContainer').appendChild(controller);
        }

        document.getElementById('controlerContainer').style.width = slides.length * 25 + 'px';

    })();

    function getBreakPoints() {

        var points = [];

        for (var i = 0; i < slider.children.length; i++) {
            points[i] = -180 * i + 220;
        }

        return points;

    }

    var breakPoints = getBreakPoints();

    var bannerWidth = parseFloat(getComputedStyle(document.getElementById('banner')).width);
    var bannerPosition = document.getElementById('banner').getBoundingClientRect().left;
    var slideWidth = parseFloat(getComputedStyle(document.getElementById('slider').children[0]).width);

    var getSliderOffset = function() {
        return parseFloat(slider.style.left);
    }

    var initDisplace = (bannerWidth / 2) - (slideWidth / 2) * (slider.children.length / 2) + 55;

    var firstClickPosition;
    var lastClickPosition = initDisplace;

    function calculateTransform(e, x) {

        if (x) {
            slider.style.left = x + 'px';
            lastClickPosition = x - 80;
        } else {
            slider.style.left = -((firstClickPosition || 0)  - (e.clientX || e.touches.clientX)) + 80 + 'px';
        }

        var calculateDistance = function(slideNumber) {

            var slideOffset = slider.children[slideNumber].offsetParent.offsetLeft + (slideWidth * slideNumber) - 75 * slideNumber - 125;

            return slideOffset;
        }

        function rotateSlide(distance) {

            var deg = -distance / 5;

            if (deg < -40) {
                return -40;
            }

            if (deg > -40 && deg < 40) {
                return deg;
            }

            if (deg > 40) {
                return 40;
            }

        }

        function scaleSlide(distance) {

            var depth = 320;

            var zDisplace = +distance + depth / 2;

            if (zDisplace > depth / 2) {
                return depth - zDisplace - depth / 2;
            }

            return zDisplace - depth / 2;

        }

        function calculateSlideLayer(distance) {

            var depth = 400;

            var zIndex = -distance + depth / 2;

            if (zIndex > depth / 2) {
                return depth - zIndex;
            }

            return zIndex;

        }

        for (var i = 0; i < slider.children.length; i++) {

            slider.children[i].style.transform =
            'rotateY(' + rotateSlide(calculateDistance(i)) + 'deg)' +
            'translateZ(' + scaleSlide(calculateDistance(i)) + 'px)';

            slider.children[i].style.zIndex = calculateSlideLayer(calculateDistance(i));

        }

        for (var y = 0; y < slider.children.length; y++) {

            if (getSliderOffset() < breakPoints[y] && getSliderOffset() > breakPoints[y + 1]) {

                for (var z = 0; z < document.getElementById('controlerContainer').children.length; z++) {
                    document.getElementById('controlerContainer').children[z].classList.remove('controller__item--active');
                }

                document.getElementById('controlerContainer').children[y].classList.add('controller__item--active')

            }

        }


    }


    function toFixedPosition() {

        if (getSliderOffset() > breakPoints[0]) {
            calculateTransform(false, breakPoints[0] - slideWidth / 2 + 30);
        }

        for (var y = 0; y < slider.children.length; y++) {

            if (getSliderOffset() < breakPoints[y] && getSliderOffset() > breakPoints[y + 1]) {

                // for (var i = 0; i < slider.children.length; i++) {
                //     slider.children[i].style.transition = 'all 0.5s';
                //
                //     slider.style.transition = 'all 0.5s';
                // }

                calculateTransform(false, breakPoints[y] - slideWidth / 2 + 30 + 5 * y);

                // setTimeout(function () {
                //
                //     for (var z = 0; z < slider.children.length; z++) {
                //         slider.children[z].style.transition = 'none';
                //     }
                //
                //     slider.style.transition = 'none';
                //
                // }, 500);

            }

        }

        if (getSliderOffset() < breakPoints[breakPoints.length - 1]) {

            calculateTransform(false, breakPoints[breakPoints.length - 1] - slideWidth / 2 + 30 + 5 * breakPoints.length - 1);

        }

    }

    function mousedown(e) {

        slider.style.cursor = 'move';

        if (lastClickPosition) {
            firstClickPosition = e.clientX - lastClickPosition;
        } else {
            firstClickPosition = e.clientX;
        }

        slider.addEventListener('mousemove', calculateTransform);

        return false;

    }

    function mouseup(e) {

        slider.style.cursor = 'pointer';

        lastClickPosition = -(firstClickPosition - e.clientX);

        slider.removeEventListener('mousemove', calculateTransform);

        toFixedPosition();

        return false;

    }

    function mouseleave(e) {

        slider.style.cursor = 'pointer';

        lastClickPosition = -(firstClickPosition - e.clientX);

        slider.removeEventListener('mousemove', calculateTransform);

        toFixedPosition();

        return false;

    }

    toFixedPosition();

    slider.addEventListener('mousedown', mousedown);
    slider.addEventListener('mouseup', mouseup);
    slider.addEventListener('mouseleave', mouseleave);

    slider.addEventListener('touchstart', mousedown);
    slider.addEventListener('touchend', mouseup);
    slider.addEventListener('touchmove', calculateTransform);

}
