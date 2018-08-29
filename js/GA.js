enchant();
GA = function(item,step,treasure,ability,width,height,select,answer_route){
  var GENE = 100;
  var N = 50;
  var MAX = step + 4;
  var item_n = treasure;
  var dir = 4;
  var Pop = new Array(N*2);
  var fit = new Array(N*2);
  var index = new Array(N*2);
  var item_flag = new Array(10);
  var item_count = 0;
  for(var i = 0; i < 2 * N; i++)index[i] = i;
  var fitness = {
    min:0,
    max:100
  };
  var i,j,k;
  var treasure = {
    NORMAL:0,
    UP:1,
    DOWN:2
  };
  var current = new Array(2);
  var rest_step = new Array(N * 2);
  var catch_item = new Array(N * 2);
  var total_step = new Array(N * 2);
//----------------------------------------------------------------------
//settings
//----------------------------------------------------------------------
  current[0] = 1*SIZE;//x
  current[1] = 1*SIZE;//y
  for(i = 0; i < N; i++){
    Pop[i] = new Array(MAX);//すべてup
  }
//----------------------------------------------------------------------
//initialize
//----------------------------------------------------------------------
//初期個体を良いものにしてやれば良い
  for(i = 0; i < N; i++ ){
    fit[i] = fitness.min;
    for(j = 0; j < MAX; j++ ){
      Pop[i][j] = Math.floor(Math.random()*4);
    }
  }
  //----------------------------------------------------------------------
  //GA
  //----------------------------------------------------------------------
  //fitness---------------------------------------------------------------
  for(i = 0; i < N; i++){
    current[0] = 1*SIZE;//x
    current[1] = 1*SIZE;//y
    fit[i] = 0;
    rest_step[i] = 0;
    catch_item[i] = 0;
    hp = step;
    total_step[i] = step;
    item_count = 0;
    for(j = 0; j < 10; j++){item_flag[j] = 0;}
    for(j = 0 ; j < MAX; j++){
      if(j > 2){
        if(Math.random()<0.1){
          var before = Pop[i][j] - Pop[i][j-1];
          var after = Pop[i][j-1] - Pop[i][j-2];
          if(before != 0 && before == after){
            Pop[i][j] = Math.floor(Math.random()*2)+Pop[i][j]+1;
            if(Pop[i][j] > 3)Pop[i][j]-=4;
          }
        }
      }
      switch(Pop[i][j]){
        case select.UP:
          if(current[1] > SIZE*2 && Pop[i][j-1] != select.DOWN){current[1]-=SIZE;--hp;}
          else{
            Pop[i][j] = Math.floor(Math.random()*2)+select.UP+1;
            if(Pop[i][j] > 3)Pop[i][j]-=4;
            j--;
          }
          break;
        case select.RIGHT:
          if(current[0] < (map_w-1)*SIZE && Pop[i][j-1] != select.LEFT){current[0]+=SIZE;--hp;}
          else{
            Pop[i][j] = Math.floor(Math.random()*2)+select.RIGHT+1;
            if(Pop[i][j] > 3)Pop[i][j]-=4;
            j--;
          }
          break;
        case select.DOWN:
          if(current[1] < (map_h-1)*SIZE && Pop[i][j-1] != select.UP){current[1]+=SIZE;--hp;}
          else{
            Pop[i][j] = Math.floor(Math.random()*2)+select.DOWN+1;
            if(Pop[i][j] > 3)Pop[i][j]-=4;
            j--;
          }
          break;
        case select.LEFT:
          if(current[0] > SIZE*2 && Pop[i][j-1] != select.RIGHT){current[0]-=SIZE;--hp;}
          else{
            Pop[i][j] = Math.floor(Math.random()*2)+select.LEFT+1;
            if(Pop[i][j] > 3)Pop[i][j]-=4;
            j--;
          }
          break;
        default:
          break;
      }
      //item取得判定
      if( j >= step + 2 ){
        if(item_flag[6] == 1){
          if(item_flag[7] == 1){
            for(k = 0; k < 10; k++){
              if(current[0]===item[k].x && current[1]===item[k].y){
                if(item_flag[k] == 0){
                  if(item[k].kind == treasure.NORMAL){
                    fit[i]+=10;
                    catch_item[i]++;
                    if(catch_item[i] == item_n){fit[i] += hp * 10;rest_step[i]=hp;}
                  }else if(item[k].kind == treasure.UP){
                    fit[i]+=ability.UP;
                    hp+=ability.UP;
                    total_step[i]+=ability.UP;
                  }else if(item[k].kind == treasure.DOWN){
                    fit[i]+=ability.DOWN;
                    hp+=ability.DOWN;
                    total_step[i]+=ability.DOWN;
                  }
                  item_flag[k] = 1;
                }
              }
            }
          }
        }
      }
      else if( j >= step ){
        if(item_flag[6] == 1){
          for(k = 0; k < 10; k++){
            if(current[0]===item[k].x && current[1]===item[k].y){
              if(item_flag[k] == 0){
                if(item[k].kind == treasure.NORMAL){
                  fit[i]+=10;
                  catch_item[i]++;
                  if(catch_item[i] == item_n){fit[i] += hp * 10;rest_step[i]=hp;}
                }else if(item[k].kind == treasure.UP){
                  fit[i]+=ability.UP;
                  hp+=ability.UP;
                  total_step[i]+=ability.UP;
                }else if(item[k].kind == treasure.DOWN){
                  fit[i]+=ability.DOWN;
                  hp+=ability.DOWN;
                  total_step[i]+=ability.DOWN;
                }
                item_flag[k] = 1;
              }
            }
          }
        }
        else if(item_flag[7] == 1){
          for(k = 0; k < 10; k++){
            if(current[0]===item[k].x && current[1]===item[k].y){
              if(item_flag[k] == 0){
                if(item[k].kind == treasure.NORMAL){
                  fit[i]+=10;
                  catch_item[i]++;
                  if(catch_item[i] == item_n){fit[i] += hp * 10;rest_step[i]=hp;}
                }else if(item[k].kind == treasure.UP){
                  fit[i]+=ability.UP;
                  hp+=ability.UP;
                  total_step[i]+=ability.UP;
                }else if(item[k].kind == treasure.DOWN){
                  fit[i]+=ability.DOWN;
                  hp+=ability.DOWN;
                  total_step[i]+=ability.DOWN;
                }
                item_flag[k] = 1;
              }
            }
          }
        }
      }
      else{
        for(k = 0; k < 10; k++){
          if(current[0]===item[k].x && current[1]===item[k].y){
            if(item_flag[k] == 0){
              if(item[k].kind == treasure.NORMAL){
                fit[i]+=10;
                catch_item[i]++;
                if(catch_item[i] == item_n){fit[i] += hp * 10;rest_step[i]=hp;}
              }else if(item[k].kind == treasure.UP){
                fit[i]+=ability.UP;
                hp+=ability.UP;
                total_step[i]+=ability.UP;
              }else if(item[k].kind == treasure.DOWN){
                fit[i]+=ability.DOWN;
                hp+=ability.DOWN;
                total_step[i]+=ability.DOWN;
              }
              item_flag[k] = 1;
            }
          }
        }
      }
    }
  }
  //sort------------------------------------------------------
  SORT(fit,index,N);
  POP_SORT(Pop,index,N,MAX);
  FIT_SORT(fit,index,N);
  STEP_UPDATE(rest_step,index,N);
  STEP_UPDATE(catch_item,index,N);
  STEP_UPDATE(total_step,index,N);

  console.log(Pop[0]);

  //ga
  var gene = 0;
  var p1,p2;
  var parent1,parent2;
  while(1){
    if(gene % 10 == 0){
      for(i = 10; i < N; i++ ){
        fit[i] = fitness.min;
        for(j = 0; j < MAX; j++ ){
            Pop[i][j] = Math.floor(Math.random()*3);
        }
      }
      //fitness------------------------------------------------------------------
      for(i = 10; i < N; i++){
        current[0] = 1*SIZE;//x
        current[1] = 1*SIZE;//y
        fit[i] = 0;
        rest_step[i] = 0;
        catch_item[i] = 0;
        hp = step;
        total_step[i] = step;
        item_count = 0;
        for(j = 0; j < 10; j++){item_flag[j] = 0;}
        for(j = 0 ; j < MAX; j++){
          if(j > 2){
            if(Math.random()<0.1){
              var before = Pop[i][j] - Pop[i][j-1];
              var after = Pop[i][j-1] - Pop[i][j-2];
              if(before != 0 && before == after){
                Pop[i][j] = Math.floor(Math.random()*2)+Pop[i][j]+1;
                if(Pop[i][j] > 3)Pop[i][j]-=4;
              }
            }
          }
          switch(Pop[i][j]){
            case select.UP:
              if(current[1] > SIZE*2 && Pop[i][j-1] != select.DOWN){current[1]-=SIZE;--hp;}
              else{
                Pop[i][j] = Math.floor(Math.random()*2)+select.UP+1;
                if(Pop[i][j] > 3)Pop[i][j]-=4;
                j--;
              }
              break;
            case select.RIGHT:
              if(current[0] < (map_w-1)*SIZE && Pop[i][j-1] != select.LEFT){current[0]+=SIZE;--hp;}
              else{
                Pop[i][j] = Math.floor(Math.random()*2)+select.RIGHT+1;
                if(Pop[i][j] > 3)Pop[i][j]-=4;
                j--;
              }
              break;
            case select.DOWN:
              if(current[1] < (map_h-1)*SIZE && Pop[i][j-1] != select.UP){current[1]+=SIZE;--hp;}
              else{
                Pop[i][j] = Math.floor(Math.random()*2)+select.DOWN+1;
                if(Pop[i][j] > 3)Pop[i][j]-=4;
                j--;
              }
              break;
            case select.LEFT:
              if(current[0] > SIZE*2 && Pop[i][j-1] != select.RIGHT){current[0]-=SIZE;--hp;}
              else{
                Pop[i][j] = Math.floor(Math.random()*2)+select.LEFT+1;
                if(Pop[i][j] > 3)Pop[i][j]-=4;
                j--;
              }
              break;
            default:
              break;
          }
          //item取得判定
          if( j >= step + 2 ){
            if(item_flag[6] == 1){
              if(item_flag[7] == 1){
                for(k = 0; k < 10; k++){
                  if(current[0]===item[k].x && current[1]===item[k].y){
                    if(item_flag[k] == 0){
                      if(item[k].kind == treasure.NORMAL){
                        fit[i]+=10;
                        catch_item[i]++;
                        if(catch_item[i] == item_n){fit[i] += hp * 10;rest_step[i]=hp;}
                      }else if(item[k].kind == treasure.UP){
                        fit[i]+=ability.UP;
                        hp+=ability.UP;
                        total_step[i]+=ability.UP;
                      }else if(item[k].kind == treasure.DOWN){
                        fit[i]+=ability.DOWN;
                        hp+=ability.DOWN;
                        total_step[i]+=ability.DOWN;
                      }
                      item_flag[k] = 1;
                    }
                  }
                }
              }
            }
          }
          else if( j >= step ){
            if(item_flag[6] == 1){
              for(k = 0; k < 10; k++){
                if(current[0]===item[k].x && current[1]===item[k].y){
                  if(item_flag[k] == 0){
                    if(item[k].kind == treasure.NORMAL){
                      fit[i]+=10;
                      catch_item[i]++;
                      if(catch_item[i] == item_n){fit[i] += hp * 10;rest_step[i]=hp;}
                    }else if(item[k].kind == treasure.UP){
                      fit[i]+=ability.UP;
                      hp+=ability.UP;
                      total_step[i]+=ability.UP;
                    }else if(item[k].kind == treasure.DOWN){
                      fit[i]+=ability.DOWN;
                      hp+=ability.DOWN;
                      total_step[i]+=ability.DOWN;
                    }
                    item_flag[k] = 1;
                  }
                }
              }
            }
            else if(item_flag[7] == 1){
              for(k = 0; k < 10; k++){
                if(current[0]===item[k].x && current[1]===item[k].y){
                  if(item_flag[k] == 0){
                    if(item[k].kind == treasure.NORMAL){
                      fit[i]+=10;
                      catch_item[i]++;
                      if(catch_item[i] == item_n){fit[i] += hp * 10;rest_step[i]=hp;}
                    }else if(item[k].kind == treasure.UP){
                      fit[i]+=ability.UP;
                      hp+=ability.UP;
                      total_step[i]+=ability.UP;
                    }else if(item[k].kind == treasure.DOWN){
                      fit[i]+=ability.DOWN;
                      hp+=ability.DOWN;
                      total_step[i]+=ability.DOWN;
                    }
                    item_flag[k] = 1;
                  }
                }
              }
            }
          }
          else{
            for(k = 0; k < 10; k++){
              if(current[0]===item[k].x && current[1]===item[k].y){
                if(item_flag[k] == 0){
                  if(item[k].kind == treasure.NORMAL){
                    fit[i]+=10;
                    catch_item[i]++;
                    if(catch_item[i] == item_n){fit[i] += hp * 10;rest_step[i]=hp;}
                  }else if(item[k].kind == treasure.UP){
                    fit[i]+=ability.UP;
                    hp+=ability.UP;
                    total_step[i]+=ability.UP;
                  }else if(item[k].kind == treasure.DOWN){
                    fit[i]+=ability.DOWN;
                    hp+=ability.DOWN;
                    total_step[i]+=ability.DOWN;
                  }
                  item_flag[k] = 1;
                }
              }
            }
          }
        }
      }
      //fitnessend------------------------------------------------------------------
    }
    for(var p = 0; p < N; p++){
      //selection parent1
      p1 = Math.floor(Math.random()*(N-1));
      p2 = Math.floor(Math.random()*(N-1));
      if(fit[p1] > fit[p2]){
        parent1 = p1;
      }else if(fit[p1] < fit[p2]){
        parent1 = p2;
      }else{
        parent1 = Math.random()<0.5?p1:p2;
      }

      //selection parent2
      p1 = Math.floor(Math.random()*(N-1));
      p2 = Math.floor(Math.random()*(N-1));
      if(fit[p1] > fit[p2]){
        parent2 = p1;
      }else if(fit[p1] < fit[p2]){
        parent2 = p2;
      }else{
        parent2 = Math.random()<0.5?p1:p2;
      }
      //crossover
      var random = 0;//Math.floor(Math.random()*2);
      if(random == 0){Pop[p+N] = No_Crossing(Pop[parent1],Pop[parent2],MAX);}
      else if(random == 1){Pop[p+N] = One_Point_Crossing(Pop[parent1],Pop[parent2],MAX);}
      else{Pop[p+N] = Two_Point_Crossing(Pop[parent1],Pop[parent2],MAX);}
      //mutation
      //Pop[p+N] = Range_Mutation(Pop[p+N],MAX);
      //Pop[p+N] = Two_Mutation(Pop[p+N],MAX);
      Pop[p+N] = Range_Mutation(Pop[p+N],MAX);
    }
    //fitness---------------------------------------------------------------
    for(i = N; i < N * 2; i++){
      current[0] = 1*SIZE;//x
      current[1] = 1*SIZE;//y
      fit[i] = 0;
      rest_step[i] = 0;
      catch_item[i] = 0;
      hp = step;
      total_step[i] = step;
      item_count = 0;
      for(j = 0; j < 10; j++){item_flag[j] = 0;}
      for(j = 0 ; j < MAX; j++){
        if(j > 2){
          if(Math.random()<0.1){
            var before = Pop[i][j] - Pop[i][j-1];
            var after = Pop[i][j-1] - Pop[i][j-2];
            if(before != 0 && before == after){
              Pop[i][j] = Math.floor(Math.random()*2)+Pop[i][j]+1;
              if(Pop[i][j] > 3)Pop[i][j]-=4;
            }
          }
        }
        switch(Pop[i][j]){
          case select.UP:
            if(current[1] > SIZE*2 && Pop[i][j-1] != select.DOWN){current[1]-=SIZE;--hp;}
            else{
              Pop[i][j] = Math.floor(Math.random()*2)+select.UP+1;
              if(Pop[i][j] > 3)Pop[i][j]-=4;
              j--;
            }
            break;
          case select.RIGHT:
            if(current[0] < (map_w-1)*SIZE && Pop[i][j-1] != select.LEFT){current[0]+=SIZE;--hp;}
            else{
              Pop[i][j] = Math.floor(Math.random()*2)+select.RIGHT+1;
              if(Pop[i][j] > 3)Pop[i][j]-=4;
              j--;
            }
            break;
          case select.DOWN:
            if(current[1] < (map_h-1)*SIZE && Pop[i][j-1] != select.UP){current[1]+=SIZE;--hp;}
            else{
              Pop[i][j] = Math.floor(Math.random()*2)+select.DOWN+1;
              if(Pop[i][j] > 3)Pop[i][j]-=4;
              j--;
            }
            break;
          case select.LEFT:
            if(current[0] > SIZE*2 && Pop[i][j-1] != select.RIGHT){current[0]-=SIZE;--hp;}
            else{
              Pop[i][j] = Math.floor(Math.random()*2)+select.LEFT+1;
              if(Pop[i][j] > 3)Pop[i][j]-=4;
              j--;
            }
            break;
          default:
            break;
        }
        //item取得判定
        if( j >= step + 2 ){
          if(item_flag[6] == 1){
            if(item_flag[7] == 1){
              for(k = 0; k < 10; k++){
                if(current[0]===item[k].x && current[1]===item[k].y){
                  if(item_flag[k] == 0){
                    if(item[k].kind == treasure.NORMAL){
                      fit[i]+=10;
                      catch_item[i]++;
                      if(catch_item[i] == item_n){fit[i] += hp * 10;rest_step[i]=hp;}
                    }else if(item[k].kind == treasure.UP){
                      fit[i]+=ability.UP;
                      hp+=ability.UP;
                      total_step[i]+=ability.UP;
                    }else if(item[k].kind == treasure.DOWN){
                      fit[i]+=ability.DOWN;
                      hp+=ability.DOWN;
                      total_step[i]+=ability.DOWN;
                    }
                    item_flag[k] = 1;
                  }
                }
              }
            }
          }
        }
        else if( j >= step ){
          if(item_flag[6] == 1){
            for(k = 0; k < 10; k++){
              if(current[0]===item[k].x && current[1]===item[k].y){
                if(item_flag[k] == 0){
                  if(item[k].kind == treasure.NORMAL){
                    fit[i]+=10;
                    catch_item[i]++;
                    if(catch_item[i] == item_n){fit[i] += hp * 10;rest_step[i]=hp;}
                  }else if(item[k].kind == treasure.UP){
                    fit[i]+=ability.UP;
                    hp+=ability.UP;
                    total_step[i]+=ability.UP;
                  }else if(item[k].kind == treasure.DOWN){
                    fit[i]+=ability.DOWN;
                    hp+=ability.DOWN;
                    total_step[i]+=ability.DOWN;
                  }
                  item_flag[k] = 1;
                }
              }
            }
          }
          else if(item_flag[7] == 1){
            for(k = 0; k < 10; k++){
              if(current[0]===item[k].x && current[1]===item[k].y){
                if(item_flag[k] == 0){
                  if(item[k].kind == treasure.NORMAL){
                    fit[i]+=10;
                    catch_item[i]++;
                    if(catch_item[i] == item_n){fit[i] += hp * 10;rest_step[i]=hp;}
                  }else if(item[k].kind == treasure.UP){
                    fit[i]+=ability.UP;
                    hp+=ability.UP;
                    total_step[i]+=ability.UP;
                  }else if(item[k].kind == treasure.DOWN){
                    fit[i]+=ability.DOWN;
                    hp+=ability.DOWN;
                    total_step[i]+=ability.DOWN;
                  }
                  item_flag[k] = 1;
                }
              }
            }
          }
        }
        else{
          for(k = 0; k < 10; k++){
            if(current[0]===item[k].x && current[1]===item[k].y){
              if(item_flag[k] == 0){
                if(item[k].kind == treasure.NORMAL){
                  fit[i]+=10;
                  catch_item[i]++;
                  if(catch_item[i] == item_n){fit[i] += hp * 10;rest_step[i]=hp;}
                }else if(item[k].kind == treasure.UP){
                  fit[i]+=ability.UP;
                  hp+=ability.UP;
                  total_step[i]+=ability.UP;
                }else if(item[k].kind == treasure.DOWN){
                  fit[i]+=ability.DOWN;
                  hp+=ability.DOWN;
                  total_step[i]+=ability.DOWN;
                }
                item_flag[k] = 1;
              }
            }
          }
        }
      }
    }
    //other--------------------------------------------------
    SORT(fit,index,2*N);
    POP_SORT(Pop,index,N*2,MAX);
    FIT_SORT(fit,index,N*2);
    STEP_UPDATE(rest_step,index,N*2);
    STEP_UPDATE(catch_item,index,N*2);
    STEP_UPDATE(total_step,index,N*2);
    gene++;
    if(gene == GENE){break;}
  }

  console.log(Pop[0]);

  for(var i = 0; i < MAX; i++){
    answer_route[i] = Pop[0][i];
  }
  return [rest_step[0],catch_item[0],total_step[0]];
};
//----------------------------------------------------------------------
//関数
//------------------------------------------------------------------
function SORT(fit,index,N){
  var temp;
  for(var k = 0; k < N-1; k++){
    for(var l = N-1; l > k; l--){
      if(fit[index[l]] > fit[index[l-1]]){
        temp = index[l];
        index[l] = index[l-1];
        index[l-1] = temp;
      }
    }
  }
}
function POP_SORT(pop,index,N,R){
  var temp = new Array(N);
  for(var i = 0; i < N ; i++){
    temp[i] = new Array(R);
    for(var j = 0; j < R; j++){
      temp[i][j] = pop[i][j];
    }
  }
  for(var i = 0; i < N ; i++){
    for(var j = 0; j < R; j++){
      pop[i][j] = temp[index[i]][j];
    }
  }
}
function FIT_SORT(fit,index,N){
  var temp = new Array(N);
  for(var i = 0; i < N ; i++){
    temp[i] = fit[i];
  }
  for(var i = 0; i < N ; i++){
    fit[i] = temp[index[i]];
  }
}
function STEP_UPDATE(step,index,N){
  var temp = new Array(N);
  for(var i = 0; i < N ; i++){
    temp[i] = step[i];
  }
  for(var i = 0; i < N ; i++){
    step[i] = temp[index[i]];
  }
}
function No_Crossing(p1,p2,R){
  var c = new Array(R);
  if(Math.random()<0.5){
    for(var i = 0; i < R; i++){
      c[i] = p1[i];
    }
  }else{
    for(var i = 0; i < R; i++){
      c[i] = p2[i];
    }
  }
  return c;
}
function One_Point_Crossing(p1,p2,R){
  var c = new Array(R);
  var cut = Math.floor(Math.random()*(R-2)+1);
  for(var n = 0; n < cut; n++){
    c[n] = p1[n];
  }
  for(var n = cut; n < R; n++){
    c[n] = p2[n];
  }
  return c;
}
function Two_Point_Crossing(p1,p2,R){
  var c = new Array(R);
  var cut1 = Math.floor(Math.random()*(R-2)+1);
  var cut2 = Math.floor(Math.random()*(R-2-cut1)+cut1+1);
  for(var k = 0; k < cut1; k++){
    c[k] = p1[k];
  }
  for(var k = cut1; k < cut2; k++){
    c[k] = p2[k];
  }
  for(var k = cut2; k < R; k++){
    c[k] = p1[k];
  }
  return c;
}
function Uniform_Crossing(p1,p2,R){
  var c = new Array(R);
  for(var k = 0; k < R; k++){
    c[k] = Math.random()<0.5?p1[k]:p2[k];
  }
  return c;
}
function Mutation(pop,R){
  for(var n = 0 ; n < R-1; n++){
    if(Math.random() <= 1/R){
      pop[n] += Math.random()*(4-2) + 1;
      if(pop[n] > 3)pop[n] -= 4;
    }
  }
  return pop;
}
function Two_Mutation(pop,R){
  for(var n = 0 ; n < R-1; n++){
    if(Math.random() <= 1/R*2){
      pop[n] += 2;
      if(pop[n] > 3){pop[n] -= 4;}
      pop[n+1] += 2;
      if(pop[n+1] > 3){pop[n+1] -= 4;}
    }
  }
  return pop;
}
function Range_Mutation(pop,R){
  var cut1 = Math.floor(Math.random()*(R-2)+1);
  var wide = Math.floor(Math.random()*4+3);
  var cut2 = Math.floor(Math.random()*wide+cut1+1);//Math.floor(Math.random()*(R-2-cut1)+cut1+1);
  var temp;
  for(var k = cut1; k < cut2; k++){
    for(var m = cut1; m < cut2; m++){
      if(Math.random()<0.6){
        temp = pop[k];
        pop[k] = pop[m];
        pop[m] = temp;
      }
    }
  }
  return pop;
}
