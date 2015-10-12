/*
logic
-----------
  foodpart
  cleanpart
  headpart
  tailpart

  snake
    - co head
    - co tail
    - direction
    - growing

  matrix
    rows
    cols
    lifecycle

    init
        - fill matrix with cleanpart's
            - each row
            - each col
            - each spot is [not taken]
        - create snake on matrix
            - [tailpart] on [random spot] [not taken]
            - [random direction]
            - [headpart] on [next spot in direction]
        - put food on matrix
            - [foodpart] on [random spot] [not taken]

    each lifecycle
       - headpart moves [next spot in direction]
             when [taken] by [tailpart] snake dies.
                - stop lifecycle
             when [taken] by [foodpart] snake grows.
                - snake is growing
                - [foodpart] becomes [headpart]
                - [foodpart] on [random spot] [not taken]
             when [not taken] spot becomes [headpart]
       - tailpart moves [next tailpart] when [not growing]
            - tail becomes [next tailpart]
            - [tailpart] becomes [cleanpart]

    [next spot in direction]

 */

var matrix = {
    rows: 10,
    cols: 10,
    lifecycle: 250,

    createSnake: function () {

    },

    randomSpot: function () {
        return $('#'+Math.floor((Math.random() * 10) + 1)+'v'+Math.floor((Math.random() * 10) + 1));
    },
    takenBy: function (part, $spot) {
        return $spot.html() == part();
    },
    createFood: function () {
        var $spot = this.randomSpot();
        while(! this.takenBy(this.cleanpart, $spot)) { $spot = this.randomSpot(); }
        $spot.html(this.foodpart());
    },

    init: function(anchor) {
        $anchor = anchor;
        this.fillUp();
        this.createSnake();
        //this.createFood();
    },

    cleanpart: function () { return $('<div />', {class: 'empty', html: '&nbsp;'}); },
    foodpart: function () { return $('<div />', {class: 'food', html: '&nbsp;'}); },
    headpart: function () { return $('<div />', {class: 'head', html: '&nbsp;'}); },
    tailpart: function () { return $('<div />', {class: 'tail', html: '&nbsp;'}); },

    co: function (i, j) { return i + 'v' + j; },

    fillUp: function() {
        var $container = $('<div />', {id: 'matrix'});
        for(var i=1;i<=this.rows;i++) {
            for(var j=1;j<=this.cols;j++) {
                var $col = $('<div />', {
                    id: this.co(i, j),
                    html: this.cleanpart()
                });

                $container.append($col);
            }
            $container.append($('<br>'));
        }
        $anchor.append($container);
    },

    wakesUp: function() {

    }
}


