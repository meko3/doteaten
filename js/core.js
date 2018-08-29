function Graphic(){
  throw new Error("This is a static class");
}
Graphic.initialize = function(width,height,type){
  this._width = width || 720;
  this._height = height || 1280;
  this._rendererType = type || "auto";
};
