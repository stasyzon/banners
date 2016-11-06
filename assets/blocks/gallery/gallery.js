var slider = parent;

(function addSlides() {

    for (var i = 0; i < slides.length; i++) {

        var slide = document.createElement('div');

        slide.classList.add('gallery__item');
        slide.style.background = 'url(' + slides[i] + ') no-repeat center / cover';

        slider.appendChild(slide);
    }

})();

function getBreakPoints() {

    var points = [];

    for (var i = 0; i < slider.children.length; i++) {
        points[i] = -155 * i + 220;
    }

    return points;

}

var breakPoints = getBreakPoints();

(function initControllers() {

    for (var i = 0; i < slides.length; i++) {

        var controller = document.createElement('div');
        controller.classList.add('controller__item');
        controller.setAttribute('data-number', i);

        controller.onclick = function(e) {

            var slideNumber = e.target.getAttribute('data-number');

            let count = 0;

            function timer() {

                var times = setTimeout(function() {

                    count++;

                    let firstPosition = getSliderOffset();
                    let secondPosition = breakPoints[slideNumber] - slideWidth / 2 + 30 + 5 * slideNumber;

                    if (firstPosition < secondPosition) {

                        calculateTransform(false, firstPosition + 5);

                        lastClickPosition = lastClickPosition + 5;

                    } else if (firstPosition > secondPosition) {

                        calculateTransform(false, firstPosition - 5);

                        lastClickPosition = lastClickPosition + 5;

                    }

                    if (firstPosition !== secondPosition && firstPosition !== secondPosition - 5 && firstPosition !== secondPosition + 5) {

                        timer();

                    }

                }, 4);

            }

            timer();

        }

        document.getElementById('controlerContainer').appendChild(controller);

    }

    document.getElementById('controlerContainer').style.width = slides.length * 25 + 'px';

})();

var slideWidth = parseFloat(getComputedStyle(document.getElementById('slider').children[0]).width);

var getSliderOffset = function() {
    return parseFloat(slider.style.left);
}

var initDisplace = -25;

var firstClickPosition = 0;
var lastClickPosition = 0;

function calculateTransform(e, x) {

    if (x || x === 0) {
        slider.style.left = x + 'px';

    } else {
        slider.style.left = Math.ceil((e.clientX - firstClickPosition) / 2.5) + 'px';
    }

    var calculateDistance = function(slideNumber) {

        var slideOffset = slider.children[slideNumber].offsetParent.offsetLeft + (slideWidth * slideNumber) - 100 * slideNumber - 125;

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

        if (distance > 0) {
            return -distance * 2;
        }

        return distance * 2;

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

            for (let z = 0; z < document.getElementById('controlerContainer').children.length; z++) {
                document.getElementById('controlerContainer').children[z].classList.remove('controller__item--active');
            }

            document.getElementById('controlerContainer').children[y].classList.add('controller__item--active')

        }

        if (getSliderOffset() < breakPoints[breakPoints.length - 1]) {
            for (let z = 0; z < document.getElementById('controlerContainer').children.length; z++) {
                document.getElementById('controlerContainer').children[z].classList.remove('controller__item--active');
            }

            document.getElementById('controlerContainer').children[document.getElementById('controlerContainer').children.length - 1].classList.add('controller__item--active')
        }

    }


}

function toFixedPosition(e) {

    document.getElementById('gallery').removeEventListener('mousemove', calculateTransform);

    if (getSliderOffset() > breakPoints[0]) {

        let count = getSliderOffset() - (breakPoints[0] - slideWidth / 2 + 20);

        let timer = setInterval(function () {

            if (count > 0) {

                count--;
                calculateTransform(false, getSliderOffset() - 1);

            }

            if (count === 0) {
                clearInterval(timer);
            }

        }, 4);

        lastClickPosition = e.clientX - firstClickPosition - count * 2.5;

    }

    for (var y = 0; y < slider.children.length; y++) {

        if (getSliderOffset() < breakPoints[y] && getSliderOffset() > breakPoints[y + 1]) {

            let count = getSliderOffset() - (breakPoints[y] - slideWidth / 2 + 30 + 5 * y);

            let timer = setInterval(function () {

                if (count > 0) {

                    count--;
                    calculateTransform(false, getSliderOffset() - 1);

                } else if (count < 0) {

                    count++;
                    calculateTransform(false, getSliderOffset() + 1);

                }

                if (count === 0) {
                    clearInterval(timer);
                }

            }, 4);

            lastClickPosition = e.clientX - firstClickPosition - count * 2.5;

        }

    }

    if (getSliderOffset() < breakPoints[breakPoints.length - 1]) {

        let count = getSliderOffset() - (breakPoints[breakPoints.length - 1] - slideWidth / 2 + 30 + 5 * (breakPoints.length - 1));

        let timer = setInterval(function () {

            if (count < 0) {

                count++;
                calculateTransform(false, getSliderOffset() + 1);

            }

            if (count > 0) {

                count--;
                calculateTransform(false, getSliderOffset() - 1);

            }

            if (count === 0) {
                clearInterval(timer);
            }

        }, 4);

        lastClickPosition = e.clientX - firstClickPosition - count * 2.5;

    }

}

function mousedown(e) {

    console.log(firstClickPosition, lastClickPosition);

    if (lastClickPosition) {
        firstClickPosition = e.clientX - lastClickPosition;
    } else {
        firstClickPosition = e.clientX;
    }

    document.getElementById('gallery').addEventListener('mousemove', calculateTransform);

    return false;

}

function touchstart(e) {

    if (lastClickPosition) {
        firstClickPosition = e.touches[0].clientX - lastClickPosition;
    } else {
        firstClickPosition = e.touches[0].clientX;
    }

}

function touchmove(e) {

    calculateTransform(e);

}

calculateTransform(false, -25);

toFixedPosition({clientX: -50});

document.getElementById('gallery').addEventListener('mousedown', mousedown);
document.getElementById('gallery').addEventListener('mouseup', toFixedPosition);
document.getElementById('gallery').addEventListener('mouseleave', toFixedPosition);

document.getElementById('gallery').addEventListener('touchstart', mousedown);
document.getElementById('gallery').addEventListener('touchend', toFixedPosition);
document.getElementById('gallery').addEventListener('touchmove', touchmove);
document.getElementById('gallery').addEventListener('touchstart', touchstart);
