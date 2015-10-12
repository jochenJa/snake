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

    createFood: function () {

    },

    init: function(anchor) {
        $anchor = anchor;
        this.fillUp();
        this.createSnake();
        this.createFood();
    },

    cleanpart: function () { return 'O'; },
    foodpart: function () { return 'F'; },
    headpart: function () { return 'H'; },
    tailpart: function () { return '*'; },

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


