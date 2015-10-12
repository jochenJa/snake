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

 */


