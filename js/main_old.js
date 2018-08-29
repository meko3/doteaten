/*main.js*/
window.onload = function(){
  Select_Scene(Loading);
};

/*データ読み込み*/
/*シーン選択*/
//base//----------------------------------------
function Select_Scene(){
  this.initialize.apply(this,arguments);
}
Select_Scene.prototype = Object.create(Scene.prototype);
Select_Scene.prototype.constructor = Select_Scene;

Select_Scene.prototype.initialize = function(){
  Scene.prototype.initialize.call(this);
};
//loading//-------------------------------------
function Loading(){
  this.initialize.apply(this);
}
Loading.prototype = Object.create(Select_Scene.prototype);
Loading.prototype.constructor = Loading;

Loading.prototype.initialize = function(){
  Loading.prototype.initialize.call(this);
  Plugin.loadData();
  Config.load();
  this.loadWindowImage();
}
Loading.prototype.loadWindowImage = function(){
  Image.loadWindow("window");
  Image.loadWindow("Icon");
};
//Scene
//main------------------------------------------
function Scene_Main(){
  this.initialize.apply(this,arguments);
}
Scene_Main.prototype = Object.create(Select_Scene.prototype);
Scene_Main.prototype.constructor = Scene_Main;

Scene_Main.prototype.initialize = funtion(){
  Scene_Main.prototype.initialize.call(this);
}
//menu------------------------------------------
function Scene_Menu(){
  this.initialize.apply(this,arguments);
}
Scene_Menu.prototype = Object.create(Select_Scene.prototype);
Scene_Menu.prototype.constructor = Scene_Menu;

Scene_Menu.prototype.initialize = function(){
  Scene_Menu.prototype.initialize.call(this);
};
//start-----------------------------------------
function Scene_Title(){
  this.initialize.apply(this,arguments);
}
Scene_Title.prototype = Object.create(Select_Scene.prototype);
Scene_title.prototype.constructor = Scene_Title;

Scene_Title.protoptype.initialize = function(){
  Scene_Title.prototype.initialize.call(this);
};
//gameover--------------------------------------
function Scene_Gameover(){
  this.initialize.apply(this,arguments);
}
Scene_Gameover.prototype = Object.create(Select_Scene.prototype);
Scene_Gameover.prototype.constructor = Scene_Gameover;

Scene_Gameover.prototype.initialize = function(){
  Scene_Gameover.prototype.initialize.call(this);
};


/*Data*///--------------------------------------------------
function Plugin(){
  throw new Error("This is a static class");
}

var $actor = null;
var $panel = null;
var $bgm = null;

Plugin._datafile=[
  {data:"$actor", scr:"Actor.json"},
  {data:"$panel", scr:"Panel.json"},
  {data:"$bgm", scr:"BGM.json"}
];

Plugin.loadData = function(){
  for(var i = 0;i < this._datafile.length;i++){
    var data = this._datafile[i].data;
    var src = this._datafile[i].src;
    this.loadFile(data,src);
  }
};

Plugin.loadFile = function(data,src){
  var xhl = new XMLHttpRequest();
  var path = "data/"+src;
  xhl.open("GET",path);
  xhl.overrideMimeType("application/json");
  xhl.onload = function(){
    if(xhl.status < 400){
      window[data] = JSON.parse(xhl.responseText);
      Plugin.onLoad(window[data]);
    }
  };
  xhl.onerror = function(){
    Plugin._error = Plugin._error || path;
  };
  window[data] = null;
  xhl.send();
};
/*Setting*///--------------------------------------------
function Config(){
  throw new Error("This is a static class");
}
Config.load = function(){
  var file;
  var config = {};
  try{
    file = Strage.load(-1);
  }catch(e){
    console.error(e);
  }
  if(file){
    config = JSON.prase(file);
  }
};
/*image*///---------------------------------------------
function Image(){
  throw new Error("This is static class");
}
ImageManager._cache = {};
Image.loadWindow = function(filename,el){
  return this.loadImage("img/system/",filename,el,false);
};
Image.loadImage = function(folder,filename,el,smooth){
  if(filename){
    var path = folder + encodeURIComponent(filename) + ".png";
    var image = this.loadNormal(path,el);
    this.smooth = smooth;
    return image;
  }else{
    return this.loadEmpty();
  }
};
Image.loadEmpty = function(){
  if(!this._cache[null]){
    this._cache[null] = new Bitmap();
  }
  return this._cache[null];
};
Image.loadNormal = function(path,el){
  var key = path + ':' + el;
  if (!this._cache[key]) {
      var bitmap = Bitmap.load(path);
      bitmap.addLoadListener(function() {
          bitmap.rotateHue(el);
      });
      this._cache[key] = bitmap;
  }
  return this._cache[key];
};
/*bitmap*///
