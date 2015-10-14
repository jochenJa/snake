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

    next level When snake eats 3 times
    level defines lifecycle speed , lifecycle + (10 * level)

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
    right: function(coId) { return coords.toCoId(coords.mutate([0,1], coords.convert(coId))); },

    randomDirection: function() {
        var arr = [coords.down, coords.up, coords.left, coords.right];
        var index = Math.floor(Math.random() * 4);

        return arr[index];
    }
}


var matrix = {
    rows: 30,
    cols: 30,
    lifecycle: 240,
    lifecycleStep: 6,
    tail: [],
    level: 0,
    direction: coords.randomDirection(),

    nextSpotInDirection: function (coId) { return this.spot(this.direction(coId)); },
    createSnake: function () {
        var $tail;
        do { $tail = this.randomSpot(); } while(! this.takenBy(this.cleanpart(), $tail))
        $tail.html(this.tailpart());
        this.tail.unshift($tail.attr('id'));

        this.$head = this.nextSpotInDirection($tail.attr('id'));
        this.$head.html(this.headpart());
    },

    randomSpot: function () {
        return $('#'+Math.floor((Math.random() * 10) + 1)+'v'+Math.floor((Math.random() * 10) + 1));
    },
    takenBy: function ($part, $container) {
        return $container.children('.' + $part.attr('class')).length > 0;
    },

    createFood: function () {
        var $spot;
        do { $spot = this.randomSpot(); } while(! this.takenBy(this.cleanpart(), $spot))
        $spot.html(this.foodpart());
    },

    levelTracker: function () {
        return $('<div />', {id: 'leveltracker', html: 'Level ' + this.level});
    },
    init: function(anchor) {
        $anchor = anchor;
        this.fillUp();
        $anchor.append(this.levelTracker());
        this.createSnake();
        this.createFood();
    },

    cleanpart: function () { return $('<div />', {class: 'empty', html: '&nbsp;'}); },
    foodpart: function () { return $('<div />', {class: 'food', html: '&nbsp;'}); },
    headpart: function () { return $('<div />', {class: 'head', html: '&nbsp;'}); },
    tailpart: function () { return $('<div />', {class: 'tail', html: '&nbsp;'}); },

    fillUp: function() {
        var $container = $('<div />', {id: 'matrix'});
        for(var i=1;i<=this.rows;i++) {
            for(var j=1;j<=this.cols;j++) {
                var $col = $('<div />', {
                    id: coords.toCoId([i, j]),
                    html: this.cleanpart()
                });

                $container.append($col);
            }
            $container.append($('<br>'));
        }
        $anchor.append($container);
    },

    spot: function (coId) { return $('#' + coId); },

    snakeMoves: function (nextLevel, endGame) {
        var $spot = this.nextSpotInDirection(this.$head.attr('id'));
        switch(true) {
            case this.takenBy(this.cleanpart(), $spot):
                $tail = this.spot(this.tail.shift());
                $tail.html(this.cleanpart());

                this.$head.html(this.tailpart());
                this.tail.push(this.$head.attr('id'));
                this.$head = $spot;
                this.$head.html(this.headpart());
                break;
            case this.takenBy(this.foodpart(), $spot):
                this.$head.html(this.tailpart());
                this.tail.push(this.$head.attr('id'));
                this.$head = $spot;
                this.$head.html(this.headpart());
                this.createFood();
                break;
            default :
                endGame('Game ends, snake died');
        }

        // next level when snake grows by 3 tailparts
        console.log(this.tail.length + ':' + Math.floor(this.tail.length/3) +':'+ this.level);
        if(Math.floor(this.tail.length/3) > this.level) { nextLevel(); }

        if(this.level > Math.floor(this.lifecycle/this.lifecycleStep)) { endGame('Game finished!'); }
    },

    wakesUp: function() {
        this.nextLevel();
    },

    nextLevel: function(previousLevel) {
        if(previousLevel) { clearInterval(previousLevel); }
        this.level++;
        $('#leveltracker').replaceWith(this.levelTracker());
        var id = setInterval(function() {
            matrix.snakeMoves(
                function() { matrix.nextLevel(id); console.log('next level');},
                function(message) { clearInterval(id); console.log(message);}
            );
        }, (this.lifecycle - (this.level * this.lifecycleStep)) );
    }
}


