$(function () {
    let sc = ""
    let c = document.querySelector("#cube")
    console.log(c)
    resizeCube()
    window.addEventListener('resize', resizeCube);

    function resizeCube(){
        if(window.innerWidth < 600) {
            sc = "scale(.5) "
            c.style.transform = "scale(.5) rotateX(-10deg) rotateY(20deg)"
        }else{
            sc = "scale(1) "
            c.style.transform = "scale(1) rotateX(-10deg) rotateY(20deg)"
        }    
        console.log(sc)
    }
        
    var el = document.createElement('div'),
        transformProps = 'transform WebkitTransform MozTransform OTransform msTransform'.split(' '),
        transformProp = support(transformProps),
        transitionDuration = 'transitionDuration WebkitTransitionDuration MozTransitionDuration OTransitionDuration msTransitionDuration'.split(' '),
        transitionDurationProp = support(transitionDuration);

    function support(props) {
        for (var i = 0, l = props.length; i < l; i++) {
            if (typeof el.style[props[i]] !== "undefined") {
                return props[i];
            }
        }
    }

    var mouse = {
            start: {}
        },
        touch = document.ontouchmove !== undefined,

        //viewport object variable
        viewport = {
            x: -10,
            y: 20,
            el: $('.cube')[0],

            //central move function
            move: function (coords) {
                if (coords) {
                    if (typeof coords.x === "number") this.x = coords.x;
                    if (typeof coords.y === "number") this.y = coords.y;
                 }

                this.x = this.x > 90 ? 90 : this.x;
                this.x = this.x < -90 ? -90 : this.x;
                this.y = this.y > 180 ? 180 : this.y;
                this.y = this.y < -180 ? -180 : this.y;

                this.el.style[transformProp] = sc + "rotateX(" + this.x + "deg) rotateY(" + this.y + "deg)";
            },
            reset: function () {
                this.move({
                    x: 0,
                    y: 0
                });
            }
        };

    viewport.duration = function () {
        var d = touch ? 50 : 0;
        viewport.el.style[transitionDurationProp] = d + "ms";
        return d;
    }();

    $(document).keydown(function (evt) {
        switch (evt.keyCode) {
            case 37: // left
                viewport.move({
                    y: viewport.y - 90
                });
                break;

            case 38: // up
                evt.preventDefault();
                viewport.move({
                    x: viewport.x + 90
                });
                break;

            case 39: // right
                viewport.move({
                    y: viewport.y + 90
                });
                break;

            case 40: // down
                evt.preventDefault();
                viewport.move({
                    x: viewport.x - 90
                });
                break;

            case 27: //esc
                viewport.reset();
                break;

            default:
                break;
        };
    }).bind('mousedown touchstart', function (evt) {
        delete mouse.last;
        if ($(evt.target).is('a, iframe')) {
            return true;
        }

        evt.originalEvent.touches ? evt = evt.originalEvent.touches[0] : null;
        mouse.start.x = evt.pageX;
        mouse.start.y = evt.pageY;
        $(document).bind('mousemove touchmove', function (event) {
            // Only perform rotation if one touch or mouse (e.g. still scale with pinch and zoom)
            if (!touch || !(event.originalEvent && event.originalEvent.touches.length > 1)) {
                event.preventDefault();
                // Get touch co-ords
                event.originalEvent.touches ? event = event.originalEvent.touches[0] : null;
                $('.viewport').trigger('move-viewport', {
                    x: event.pageX,
                    y: event.pageY
                });
            }
        });

        $(document).bind('mouseup touchend', function () {
            $(document).unbind('mousemove touchmove');
        });
    });

    $('.viewport').bind('move-viewport', function (evt, movedMouse) {

        // Reduce movement on touch screens
        var movementScaleFactor = touch ? 3 : 2;

        if (!mouse.last) {
            mouse.last = mouse.start;
        } else {
            if (forward(mouse.start.x, mouse.last.x) != forward(mouse.last.x, movedMouse.x)) {
                mouse.start.x = mouse.last.x;
            }
            if (forward(mouse.start.y, mouse.last.y) != forward(mouse.last.y, movedMouse.y)) {
                mouse.start.y = mouse.last.y;
            }
        }

        viewport.move({
            x: viewport.x + parseInt((mouse.start.y - movedMouse.y) / movementScaleFactor),
            y: viewport.y - parseInt((mouse.start.x - movedMouse.x) / movementScaleFactor)
        });

        mouse.last.x = movedMouse.x;
        mouse.last.y = movedMouse.y;

        function forward(v1, v2) {
            return v1 >= v2 ? true : false;
        }
    });

    
});