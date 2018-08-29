enchant();
window.onload = function(){
  main();
};

var MAX_STEP = 50;
var player_ho = MAX_STEP;
var control = {
  UP:0,
  RIGHT:1,
  DOWN:2,
  LEFT:3
};
//status tips
var treasure = {
  NORMAL:0,
  UP:1,
  DOWN:2
};
var item_n = {
  NORMAL: 6,
  UP: 2,
  DOWN: 2
};
var item_ability = {
  NORMAL:0,
  UP: 2,
  DOWN: -3
};
//graphic tips
var SIZE = 32;
var map_w = 13,
    map_h = 13;
var WIDTH = SIZE*(map_w+2);
var HEIGHT = SIZE*(map_h+2);
var PLAYER = 'image/player1.png';
var TILE = "image/tile1.png";
var tile ={
  FIELD:0,
  WALL:4
};
var collision = {
  NO:0,
  EXIST:1
};

function main(){
  
}
