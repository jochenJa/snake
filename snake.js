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
var coords = {
    convert: function (coId) { return coId.split('v').map(function($str) { return parseInt($str); }); },
    mutate: function (mutation, co) {
        return [co[0] + mutation[0],co[1] + mutation[1]];
    },
    toCoId: function (co) { return co[0]+'v'+co[1]; },

    up: function(coId) { return coords.toCoId(coords.mutate([-1,0], coords.convert(coId))); },
    down: function(coId) { return coords.toCoId(coords.mutate([1,0], coords.convert(coId))); },
    left: function(coId) { return coords.toCoId(coords.mutate([0,-1], coords.convert(coId))); },
    right: function(coId) { return coords.toCoId(coords.mutate([0,1], coords.convert(coId))); }
}


var matrix = {
    rows: 15,
    cols: 15,
    lifecycle: 250,

    nextSpotInDirection: function (coId) {
        if(typeof this.direction === 'undefined') { this.direction = coords.down; }
        $spot = $('#'+this.direction(coId));
        return $spot;
    },
    createSnake: function () {
        var $tail = this.randomSpot();
        while(! this.takenBy(this.cleanpart(), $tail)) { $tail = this.randomSpot(); }
        $tail.html(this.tailpart());

        var $head = this.nextSpotInDirection($tail.attr('id'));
        $head.html(this.headpart());
    },

    randomSpot: function () {
        return $('#'+Math.floor((Math.random() * 10) + 1)+'v'+Math.floor((Math.random() * 10) + 1));
    },
    takenBy: function ($left, $right) { return $right.children($left).length == 1; },

    createFood: function () {
        var $spot = this.randomSpot();
        while(! this.takenBy(this.cleanpart(), $spot)) { $spot = this.randomSpot(); }
        $spot.html(this.foodpart());
    },

    init: function(anchor) {
        $anchor = anchor;
        this.fillUp();
        this.createSnake();
        this.createFood();
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


