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

    up: function up(coId) { return coords.toCoId(coords.mutate([-1,0], coords.convert(coId))); },
    down: function down(coId) { return coords.toCoId(coords.mutate([1,0], coords.convert(coId))); },
    left: function left(coId) { return coords.toCoId(coords.mutate([0,-1], coords.convert(coId))); },
    right: function right(coId) { return coords.toCoId(coords.mutate([0,1], coords.convert(coId))); },

    randomDirection: function() {
        var arr = [coords.down, coords.up, coords.left, coords.right];
        var index = Math.floor(Math.random() * 4);

        return arr[index];
    },

    random: function(leftUp, downRight) {
        var rows = Math.abs(leftUp[0] - downRight[0] + 1);
        var cols = Math.abs(leftUp[1] - downRight[1] + 1);
        coId = this.toCoId([Math.floor((Math.random() * rows) + leftUp[0]), Math.floor((Math.random() * cols) + leftUp[1])]);
        //console.log(coId);
        return coId;
    }
}


var matrix = {
    rows: 30,
    cols: 30,
    lifecycle: 500,
    lifecycleStep: 12,
    tail: [],
    directionChain: [],
    level: 0,
    food: 0,
    direction: coords.randomDirection(),

    inDirection: function (coId) {
        if(nextdirection = this.directionChain.pop()) {
            this.direction = nextdirection;
        }

        return this.direction(coId);
    },
    nextSpotInDirection: function (coId) { return this.spot(this.inDirection(coId)); },
    createSnake: function () {
        var $tail;
        do { $tail = this.randomSpotAroundCenter(); } while(! this.takenBy(this.cleanpart(), $tail));
        $tail.html(this.tailpart());
        this.tail.unshift($tail.attr('id'));

        this.$head = this.nextSpotInDirection($tail.attr('id'));
        this.$head.html(this.headpart());
    },

    randomSpot: function () {
        return matrix.spot(coords.random([1,1], [matrix.rows,matrix.cols]));
    },

    randomSpotAroundCenter: function () {
        upLeft = [Math.floor(matrix.rows/3), Math.floor(matrix.cols/3)];
        downRight = [upLeft[0]*2, upLeft[1]*2];
        return matrix.spot(coords.random(upLeft, downRight));
    },

    takenBy: function ($part, $container) {
        return $container.children('.' + $part.attr('class')).length > 0;
    },

    createFood: function (spotFunction) {
        var $spot;
        do { $spot = spotFunction(); } while(! this.takenBy(this.cleanpart(), $spot));
        $spot.html(this.foodpart());
    },

    levelTracker: function () {
        return $('<div />', {id: 'leveltracker', html: 'Level ' + this.level + '.' + (this.food % 3)});
    },

    foodTracker: function () {
        return $('<div />', {id: 'foodtracker', html: 'Food ' + this.food});
    },
    init: function(anchor) {
        $anchor = anchor;
        $anchor.append(this.levelTracker());
        this.fillUp();
        //$anchor.append(this.foodTracker());
        this.createSnake();
        this.createFood(this.randomSpotAroundCenter);
    },

    cleanpart: function () { return $('<div />', {class: 'empty', html: '&nbsp;'}); },
    foodpart: function () { return $('<div />', {class: 'food', html: '&nbsp;'}); },
    headpart: function () { return $('<div />', {class: 'head', html: '&nbsp;'}); },
    tailpart: function () { return $('<div />', {class: 'tail', html: '&nbsp;'}); },

    fillUp: function() {
        var $container = $('<div />', {id: 'matrix'});
        for(var i=1;i<=this.rows;i++) {
            $row = $('<div />', {class: 'row'});
            for(var j=1;j<=this.cols;j++) {
                var $col = $('<div />', {
                    id: coords.toCoId([i, j]),
                    html: this.cleanpart()
                });

                $row.append($col);
            }
            $container.append($row);
        }
        $anchor.append($container);
    },

    spot: function (coId) { return $('#' + coId); },

    eats: function () {
        this.food++;
        $('#leveltracker').replaceWith(this.levelTracker());
    },

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
                this.eats();
                this.$head.html(this.tailpart());
                this.tail.push(this.$head.attr('id'));
                this.$head = $spot;
                this.$head.html(this.headpart());

                this.createFood(this.randomSpot);
                break;
            default :
                endGame('Game ends, snake died');
        }

        // next level when snake grows by 3 tailparts
        if(Math.floor(this.tail.length/3) > this.level) {
            this.level++;
            nextLevel();
        }

        if(this.level > Math.floor(this.lifecycle/this.lifecycleStep)) { endGame('Game finished!'); }
    },

    wakesUp: function() {
        this.nextLevel();
    },

    nextLevel: function(previousLevel) {
        if(previousLevel) { clearInterval(previousLevel); }
        $('#leveltracker').replaceWith(this.levelTracker());
        var id = setInterval(function() {
            matrix.snakeMoves(
                function() { matrix.nextLevel(id); console.log('next level');},
                function(message) { clearInterval(id); console.log(message);}
            );
        }, (this.lifecycle - (this.level * this.lifecycleStep)) );
    },

    changedirection: function(direction) {
        if(direction(this.direction(this.$head.attr('id'))) == this.$head.attr('id')) return;
        this.directionChain.push(direction);
    }
}


