enchant();
window.onload = function(){
  main();
};

var MAX_STEP = 30;
var player_hp =MAX_STEP;
var final_score = 0;
var control = {
  UP:0,
  RIGHT:1,
  DOWN:2,
  LEFT:3
};
var tile ={
  FIELD:0,
  WALL:4
};
var collision = {
  NO:0,
  EXIST:1
};
var treasure = {
  NORMAL:0,
  UP:1,
  DOWN:2
};
var item_t = 10;
var item_n = {
  NORMAL: 6,
  UP: 2,
  DOWN: 2
};
var item_ability = {
  NORMAL:0,
  UP: 2,
  DOWN: -2
};
var SIZE = 32;
var map_w = 10,
    map_h = 10;
var WIDTH = SIZE*(map_w+2);
var HEIGHT = SIZE*(map_h+2);
var PLAYER = 'image/player1.png';
var TILE = "image/tile1.png";
var PAD = "image/pad-up.png";
function main(){
  //--------------------------------------------------------------
  //ステージ作成
  //--------------------------------------------------------------
  var map_tile = new Array(map_h);
  var map_collision = new Array(map_h);
  for(var i = 0 ; i < map_h + 2; i++){
    map_tile[i] = new Array(map_w);
    map_collision[i] = new Array(map_w);
    for(var j = 0 ; j < map_h + 2; j++){
      if(i == 0 || i == map_h+1){
        map_tile[i][j] = tile.WALL;
        map_collision[i][j] = collision.EXIST;
      }else if(j == 0 || j == map_w+1){
        map_tile[i][j] = tile.WALL;
        map_collision[i][j] = collision.EXIST;
      }else{
        map_tile[i][j] = tile.FIELD;
        map_collision[i][j] = collision.NO;
      }
    }
  }
  game = new Game(WIDTH,HEIGHT + SIZE * 4);
  game.fps = 7;
  game.preload(PLAYER,TILE,PAD);
  game.rootScene.backgroundColor = 'black';
  game.onload = function(){
    Main = new Scene();
    Main.backgroundColor = "black";
    //-------------------------------------------------------------
    //Map作成
    //-------------------------------------------------------------
    map = new Map(SIZE,SIZE);
    map.image = game.assets[TILE];
    map.loadData(map_tile);
    map.collisionData = map_collision;
    Main.addChild(map);
    //-------------------------------------------------------------
    //stage作成
    //-------------------------------------------------------------
    stage = new Group();
    Main.addChild(stage);
    //-------------------------------------------------------------
    //Item作成
    //-------------------------------------------------------------
    //treasure-----------------------------------------------------
    var item = new Array(item_n);
    var flag_point = 1;
    for(var i = 0; i < item_n.NORMAL ; i++){
      item[i] = new Item(treasure.NORMAL,Math.floor(Math.random()*(map_w-2)+2),Math.floor(Math.random()*(map_h-2)+2));
      for(var j = 0; j < i; j++){
        if(item[i].x == item[j].x){
          while(item[i].y == item[j].y){
            item[i].y = Math.floor(Math.random()*(map_h-2)+1)*SIZE;
            flag_point = 1;
            for(var k = 0; k < i; k++){
              if(item[k].y == item[i].y){
                  flag_point = 0;
              }
            }
            if(flag_point == 1){break;}
          }
        }
        if(item[i].x == 1*SIZE){
          while(item[i].y == 1*SIZE){
            item[i].y = Math.floor(Math.random()*(map_h-2)+1)*SIZE;
            flag_point = 1;
            for(var k = 0; k < i; k++){
              if(item[k].y == item[i].y){
                  flag_point = 0;
              }
            }
            if(flag_point == 1){break;}
          }
        }
      }
      stage.addChild(item[i]);
    }
    for(var i = item_n.NORMAL; i < item_n.NORMAL + item_n.UP ; i++){
      item[i] = new Item(treasure.UP,Math.floor(Math.random()*(map_w-2)+2),Math.floor(Math.random()*(map_h-2)+2));
      for(var j = 0; j < i; j++){
        if(item[i].x == item[j].x){
          while(item[i].y == item[j].y){
            item[i].y = Math.floor(Math.random()*(map_h-2)+1)*SIZE;
            flag_point = 1;
            for(var k = 0; k < i; k++){
              if(item[k].y == item[i].y){
                  flag_point = 0;
              }
            }
            if(flag_point == 1){break;}
          }
        }
        if(item[i].x == 1*SIZE){
          while(item[i].y == 1*SIZE){
            item[i].y = Math.floor(Math.random()*(map_h-2)+1)*SIZE;
            flag_point = 1;
            for(var k = 0; k < i; k++){
              if(item[k].y == item[i].y){
                  flag_point = 0;
              }
            }
            if(flag_point == 1){break;}
          }
        }
      }
      stage.addChild(item[i]);
    }
    for(var i = item_n.NORMAL + item_n.UP; i < item_n.NORMAL + item_n.UP + item_n.DOWN ; i++){
      item[i] = new Item(treasure.DOWN,Math.floor(Math.random()*(map_w-2)+2),Math.floor(Math.random()*(map_h-2)+2));
      for(var j = 0; j < i; j++){
        if(item[i].x == item[j].x){
          while(item[i].y == item[j].y){
            item[i].y = Math.floor(Math.random()*(map_h-2)+1)*SIZE;
            flag_point = 1;
            for(var k = 0; k < i; k++){
              if(item[k].y == item[i].y){
                  flag_point = 0;
              }
            }
            if(flag_point == 1){break;}
          }
        }
        if(item[i].x == 1*SIZE){
          while(item[i].y == 1*SIZE){
            item[i].y = Math.floor(Math.random()*(map_h-2)+1)*SIZE;
            flag_point = 1;
            for(var k = 0; k < i; k++){
              if(item[k].y == item[i].y){
                  flag_point = 0;
              }
            }
            if(flag_point == 1){break;}
          }
        }
      }
      stage.addChild(item[i]);
    }
    //-------------------------------------------------------------
    //Player作成
    //-------------------------------------------------------------
    player = new Player(1,1);
    stage.addChild(player);
    //-------------------------------------------------------------
    // Controller作成
    //-------------------------------------------------------------
    var pad = new Array(4);
    for (i = 0; i < 4; i++ ) {
      pad[i] = new Sprite(SIZE * 1.5, SIZE * 1.4);
      if(i==0) {
        pad[i].x = WIDTH - 6 * SIZE;
        pad[i].y = HEIGHT + SIZE;
      } else if (i == 1) {
        pad[i].x = WIDTH - 5.14 * SIZE;
        pad[i].y = HEIGHT + SIZE * 1.78;
        pad[i].rotate(90);
      } else if (i == 2) {
        pad[i].x = WIDTH - 6.04 * SIZE;
        pad[i].y = HEIGHT + SIZE * 2.53;
        pad[i].rotate(180);
      } else if (i == 3) {
        pad[i].x = WIDTH - 6.9 * SIZE;
        pad[i].y = HEIGHT + SIZE * 1.72;
        pad[i].rotate(-90);
      }
      pad[i].image = game.assets[PAD];
      Main.addChild(pad[i]);
    }
    pad[0].addEventListener("touchstart", () => {
      if(player.keycount <= 0){
        if(player.y>0+SIZE){
          player.keycount = 2;player.y-=SIZE;player.hp--;player.route[player.count]=control.UP;player.count++;
        }
      }else if(player.keycount > 0){
        player.keycount--;
      }
    });
    pad[1].addEventListener("touchstart", () => {
      if(player.keycount <= 0){
        if(player.x<=WIDTH-SIZE*3){
          player.keycount = 2;player.x+=SIZE;player.hp--;player.route[player.count]=control.RIGHT;player.count++;
        }
      }else if(player.keycount > 0){
        player.keycount--;
      }
    });
    pad[2].addEventListener("touchstart", () => {
      if(player.keycount <= 0){
        if(player.y<=WIDTH-SIZE*3){
          player.keycount = 2;player.y+=SIZE;player.hp--;player.route[player.count]=control.DOWN;player.count++;
        }
      }else if(player.keycount > 0){
        player.keycount--;
      }
    });
    pad[3].addEventListener("touchstart", () => {
      if(player.keycount <= 0){
        if(player.x>0+SIZE){
          player.keycount = 2;player.x-=SIZE;player.hp--;player.route[player.count]=control.LEFT;player.count++;
        }
      }else if(player.keycount > 0){
        player.keycount--;
      }
    });
    //-------------------------------------------------------------
    //answer作成
    //-------------------------------------------------------------
    var answer_route = new Array(MAX_STEP + 4);
    var array = new Array(3);
    array = GA(item,MAX_STEP,item_n.NORMAL,item_ability,map_w,map_h,control,answer_route);
    var score = array[0]+array[1]*10;
    var last_step = array[0];
    var total = array[2];
    judge = new MSG(WIDTH/6,HEIGHT/2,"red");
    judge.text="You win!";
    var player_route;
    //-------------------------------------------------------------
    //Message作成
    //-------------------------------------------------------------
    //獲得アイテム
    msg = new MSG(10,-5,"red");
    stage.addChild(msg);
    //残り体力
    HP = new MSG(WIDTH/2,-5,"lightgreen");
    stage.addChild(HP);
    game.addEventListener("enterframe",function(){
      msg.text = "Score "+ player.item_count * 10;
      HP.text = "HP "+player.hp;
      if(player.item_count == item_n.NORMAL || player.hp == 0){
        final_score = player.item_count * 10 + player.hp;
        if(score == final_score){judge.text="Draw";judge.color = "green";}
        else if(score > final_score){judge.text="You lose";judge.color = "blue";}
        msg.text = "Score " + final_score;
        //stage.addChild(rest);
        HP.text = "Clear!";
        game.pushScene(Answer);
      }
      /*
      else if(player.hp == 0){
        msg.text = "GAME OVER";
        game.stop();
      }
      */
    });


    Newgame = new Scene();
    Newgame.backgroundColor = "rgba(255,230,0,1)";
    AI = new MSG(WIDTH/6,HEIGHT/4,"black");
    AI.text = "AI's score: "+score;
    Newgame.addChild(AI);
    Newgame.addEventListener("touchstart",function(){
      //game.popScene(Newgame);
      //game.replaceScene(Answer);
      game.stop();
      //game.start();
    });

    //view answer scene------------------------------------
    Answer = new Scene();
    //Player's route
    var line = new Sprite(WIDTH,HEIGHT);
    line.x = 0;
    line.y = 0;
    //line.backgroundColor = "rgba(200, 255, 200, 0.5)";
    //line
    var surface = new Surface(WIDTH,HEIGHT);
    line.image = surface;
    context = surface.context;
    context.beginPath();
    var current_x = SIZE*3/2;
    var current_y = SIZE*3/2;
    context.moveTo(current_x,current_y);
    for(var i = 0 ; i < player.count; i++){
      //console.log(answer_route[i]);
      switch(player.route[i]){
        case control.UP:current_y -= SIZE;break;
        case control.RIGHT:current_x += SIZE;break;
        case control.DOWN:current_y += SIZE;break;
        case control.LEFT:current_x -= SIZE;break;
        default:break;
      }
      //console.log(current_x+" "+current_y);
      context.lineTo(current_x,current_y);
    }
    context.strokeStyle = "blue";
    context.stroke();
    Answer.addChild(line);

    //AI's route
    var line = new Sprite(WIDTH,HEIGHT);
    line.x = 0;
    line.y = 0;
    line.backgroundColor = "rgba(200, 255, 200, 0.5)";
    //line
    var surface = new Surface(WIDTH,HEIGHT);
    line.image = surface;
    context = surface.context;
    context.beginPath();
    var current_x = SIZE*3/2;
    var current_y = SIZE*3/2;
    context.moveTo(current_x,current_y);
    for(var i = 0 ; i < total - last_step; i++){
      //console.log(answer_route[i]);
      switch(answer_route[i]){
        case control.UP:current_y -= SIZE;break;
        case control.RIGHT:current_x += SIZE;break;
        case control.DOWN:current_y += SIZE;break;
        case control.LEFT:current_x -= SIZE;break;
        default:break;
      }
      //console.log(current_x+" "+current_y);
      context.lineTo(current_x,current_y);
    }
    context.strokeStyle = "red";
    context.stroke();
    Answer.addChild(line);

    for(var p = 0; p < 10; p++){
      //console.log(item[p].x+" "+item[p].y);
      var circle = new Sprite(WIDTH,HEIGHT);
      circle.x = item[p].x + SIZE/4;
      circle.y = item[p].y + SIZE/4;
      var surface_c = new Surface(WIDTH,HEIGHT);
      ctx = surface_c.context;
      ctx.beginPath();
      ctx.arc(SIZE/4,SIZE/4,SIZE/4,0,Math.PI*2,false);
      if(p < item_n.NORMAL){
        ctx.fillStyle = "green";
      }else if(p < item_n.NORMAL + item_n.UP){
        ctx.fillStyle = "yellow";
      }else if(p < item_n.NORMAL + item_n.UP + item_n.DOWN){
        ctx.fillStyle = "blue";
      }
      ctx.fill();
      circle.image = surface_c;
      Answer.addChild(circle);
    }
    //console.log((current_x-SIZE/2)/SIZE+" "+(current_y-SIZE/2)/SIZE);

    var circle = new Sprite(WIDTH,HEIGHT);
    circle.x = current_x - SIZE/4;
    circle.y = current_y - SIZE/4;
    var surface_c = new Surface(WIDTH,HEIGHT);
    ctx = surface_c.context;
    ctx.beginPath();
    ctx.arc(SIZE/4,SIZE/4,SIZE/4,0,Math.PI*2,false);
    ctx.fillStyle = "red";
    ctx.fill();
    circle.image = surface_c;
    Answer.addChild(circle);

    //回答の見方
      mg = new MSG(0,HEIGHT-SIZE-5,"green");
      mg.text = "宝箱:●";
      Answer.addChild(mg);

      my = new MSG(WIDTH/2-SIZE*2.2,HEIGHT-SIZE-5,"yellow");
      my.text = "花:●";
      Answer.addChild(my);

      mg = new MSG(WIDTH-5.5*SIZE,HEIGHT-SIZE-5,"blue");
      mg.text = "落とし穴:●";
      Answer.addChild(mg);

    AI = new MSG(WIDTH/6,HEIGHT/4,"black");
    AI.text = "AI's score: "+score;
    Answer.addChild(AI);

    Answer.addChild(judge);
    Answer.addEventListener("touchstart",function(){
      game.replaceScene(Newgame);
      game.stop();
      game.popScene(Answer);
      //game.start();

    });

    game.pushScene(Main);
    //game.pushScene(Answer);
  };
  game.start();
}
//プレイヤークラス
Player = Class.create(Sprite,{
  initialize: function(x,y){
    Sprite.call(this,SIZE,SIZE);
    this.x=x * SIZE;
    this.y=y * SIZE;
    this.image = game.assets[PLAYER];
    this.frame=0;
    this.item_count = 0;
    this.hp =player_hp;
    this.flag=0;
    this.route = new Array(MAX_STEP + 4);
    this.count = 0;
    this.keycount = 0;
  },
  onenterframe: function(){
    if(this.keycount <= 0){
      if(this.x<=WIDTH-SIZE*3)if(game.input.right){this.keycount = 2;this.x+=SIZE;this.hp--;this.route[this.count]=control.RIGHT;this.count++;}
      if(this.x>0+SIZE)if(game.input.left){this.keycount = 2;this.x-=SIZE;this.hp--;this.route[this.count]=control.LEFT;this.count++;}
      if(this.y<=WIDTH-SIZE*3)if(game.input.down){this.keycount = 2;this.y+=SIZE;this.hp--;this.route[this.count]=control.DOWN;this.count++;}
      if(this.y>0+SIZE)if(game.input.up){this.keycount = 2;this.y-=SIZE;this.hp--;this.route[this.count]=control.UP;this.count++;}
    }else if(this.keycount > 0){
      this.keycount--;
    }
  }
});
//アイテムクラス
Items = [];
Item = Class.create(Sprite,{
  initialize: function(kind,x,y){
    Sprite.call(this,SIZE,SIZE);
    this.x=x * SIZE;
    this.y=y * SIZE;
    this.kind = kind;
    this.image = game.assets[TILE];
    if(this.kind == treasure.NORMAL){
      this.frame = 25;
    }else if(this.kind == treasure.UP){
      this.frame = 18;
    }else if(this.kind == treasure.DOWN){
      this.frame = 17;
    }else{
      this.frame = 0;
    }
    Items[Items.length]=this;
  },
  onenterframe: function(){
    if(this.within(player,1/4)){
      if(this.kind == treasure.NORMAL){
        player.item_count++;
      }else if(this.kind == treasure.UP){
        player.hp += item_ability.UP;
      }else if(this.kind == treasure.DOWN){
        player.hp += item_ability.DOWN;
      }
      this.remove();
    }
  },
  remove: function(){
    stage.removeChild(this);
    delete Items[this.id];
    delete this;
  }
});
//メッセージクラス
MSG = Class.create(Label,{
  initialize:function(x,y,color){
    Label.call(this,x,y,color);
    this.x = x;
    this.y = y;
    this.color = color;
    this.font = "bold 30px Meiryo";
  }
});
