var slider = document.getElementById('slider');
    slider.style.left = '125px';

(function setRate() {

    var star = document.createElement('i');
        star.classList.add('material-icons');
        star.style.color = '#694E00';
        star.innerHTML = 'star';

    var allRates = document.getElementsByClassName('rate');

    var rate = allRates[0].getAttribute('data-rate');

    for (var i = 0; i < 5; i++) {
        allRates[0].appendChild(star.cloneNode(true));
    }

    for (var y = 0; y < rate; y++) {
        allRates[0].children[y].style.color = '#FFC107';
    }

})();

(function galerySlide() {

    var firstClick;
    var lastClick;

    (function setFirstRotate() {

        for (var i = 1; i < slider.children.length; i++) {
            slider.children[i].style.transform = 'rotateY(-40deg)';
        }

    })();

    function swipe(e) {

        slider.style.left = -(firstClick - e.clientX) + 'px';

        function rotateSlide(distance) {

            var deg = -distance / 5;

            if (deg > -40 && deg < 40) {
                return deg;
            }

        }

        for (var i = 0; i < slider.children.length; i++) {
            slider.children[i].style.transform = 'rotateY(' + rotateSlide(parseFloat(slider.style.left) - 125 + (250* i)) + 'deg)';
        }

    }

    function toFixedPosition() {

        (function nearSlide(distance) {

            function getBreakPoints() {

                var points = [];

                for (var i = 0; i < slider.children.length; i++) {
                    points[i] = i * 250;
                }

                return points;

            }

            var breakpoints = getBreakPoints();

            if (distance <= breakpoints[0]) {
                slider.style.left = (breakpoints[1] / 2) + 'px';
                slider.children[0].style.transform = 'rotateY(0deg)';
            }

            for (var i = 0; i < breakpoints.length; i++) {

                if (distance >= breakpoints[i] && distance <= breakpoints[i+1]) {
                    slider.style.left = -(breakpoints[i + 1]  - 125) + 'px';

                    slider.style.transition = 'all 0.5s';
                    slider.children[i + 1].style.transform = 'rotateY(0deg)';


                    setTimeout(function() {
                        slider.style.transition = 'none';
                    }, 500);

                }

            }

        })(-parseFloat(slider.style.left));

    }

    function mousedown(e) {

        slider.style.cursor = 'move';

        if (lastClick) {
            firstClick = e.clientX - lastClick;
        } else {
            firstClick = e.clientX;
        }

        slider.addEventListener('mousemove', swipe);

    }

    function mouseup(e) {

        slider.style.cursor = 'pointer';

        lastClick = -(firstClick - e.clientX);

        slider.removeEventListener('mousemove', swipe);

        toFixedPosition();

    }

    function mouseleave(e) {

        slider.style.cursor = 'pointer';

        lastClick = -(firstClick - e.clientX);

        slider.removeEventListener('mousemove', swipe);

        toFixedPosition();

    }

    slider.addEventListener('mousedown', mousedown);
    slider.addEventListener('mouseup', mouseup);
    slider.addEventListener('mouseleave', mouseleave);

})();
