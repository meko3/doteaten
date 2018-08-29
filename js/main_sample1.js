window.onload = function(){
  Scene_Main();
};

var WIDTH = 720,
    HEIGHT = 1280;

function Scene_Main(){
  //Stageの作成
  var stage = new PIXI.Stage(0x66FF99);
  //環境に応じたrendererの作成
  var renderer = PIXI.autoDetectRenderer(WIDTH,HEIGHT);
  //rendererが持つ要素をDOMに追加
  document.body.appendChild(renderer.view);
  //animate簡素尾をrequestAnimFrameで実行
  requestAnimFrame(animate);
  //画像ファイルを読み込んでTextureを取得
  var texture = PIXI.Texture.fromImage("image/bunny.png");
  //取得したTextureを使ってSpriteを生成
  var bunny = new PIXI.Sprite(texture);
  //SpriteでのTextureの位置を調整
  bunny.anchor.x = 0.5;
  bunny.anchor.y = 0.5;
  //Spriteを任意の位置に移動
  bunny.position.x = 200;
  bunny.position.y = 150;
  //StageにSpriteを追加
  stage.addChild(bunny);

  //描画時のフレームごとの処理を記述
  function animate(){
    //次のrequestAnimFrameでanimateの実行を再度設定
    requestAnimFrame(animate);
    //stageに配置したSpriteを回転
    bunny.rotation +=0.1;
    //処理の結果をrendererがstageに描画
    renderer.render(stage);
  }
}
