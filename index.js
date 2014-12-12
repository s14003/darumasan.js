// forked from soramugi's "9leap投稿ゲーム「平成ゲーム」jsdo.it移植版" http://jsdo.it/soramugi/orY0
// forked from soramugi's "forked: enchant.js Action Game Sample" http://jsdo.it/soramugi/jPrb
// forked from 9leap's "enchant.js Action Game Sample" http://jsdo.it/9leap/action-sample
// forked from Event's "enchant.js action example" http://jsdo.it/Event/enchant.js_action

/*
   「だるまさんが転んだ（仮）」  
   昔なつかし

   ゲームの名前なんにしようかな

*/
enchant();

//jsdoit用画像
var jsdoit_img = "http://jsdo.it/static/assets/enchant.js/";
var chara1 = jsdoit_img+"chara1.gif";
var map2 = jsdoit_img+"map2.gif";
var apad = jsdoit_img+"apad.png";

//歩くモーション
function walk(t){
  t.walk_c++;
  if ((t.walk_c %= 3) == 0) {
    t.walk++;   
  }if ((t.walk %= 4 ) <2 ) {
    t.frame = t.walk + t.f;
  }else {
    t.frame = (t.walk != 2) * 2 + t.f;
  }
}

window.onload = function() {
  var game=new Game(320,320);
  game.fps=24;
  game.preload(chara1,map2,apad);
  game.onload=function(){

    //MAPのブロック配置位置
    var blocks = [
      [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
      [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
      [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
      [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
      [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
      [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
      [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
      [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
      [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
      [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
      [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
      [ 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
      [ 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
      [ 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
      ];

    //MAP読み込み用おまじない
    var map = new Map(16,16);
    map.image = game.assets[map2];
    map.loadData(blocks);

    //操作キャラクター、茶色クマ
    var player = new Sprite(32,32);
    player.image = game.assets[chara1];
    player.x = 270;
    player.y = 144;
    player.scaleX = -1;
    player.touch = false;
    player.walk = 0;
    player.walk_c = 0;
    player.f = 0;
    player.time =true;
    player.addEventListener('enterframe',function(e){
      //ボタンが押されてる
      if (button.push == true) {
        this.x -= 2;
        walk(player);
      }
      //ボタンが離される
      if (button.up == true) {
        this.x--;
        walk(player);
        if (this.stop + 12 == game.frame) {
        button.up = false;
        }
      }
      //到達フラグ立て
      if (this.x <= 16) {
        this.touch = true;
        button.up = false;
        button.push = false;
      }
      //到達処理
      if (this.touch == true) {
        if (this.time == true) {
          score.num++;
          score.text = score.num+" 回成功です!!";
          this.scaleX *= -1;
          white.scaleX *= -1;
          label.text = "CLEAR";
          retry.flag = true;
          this.time = false;
        }
        this.x += 6;
        walk(player);
        if (this.x >= 80) {
          white.x += 7;
          walk(white);
        }
      }
      //リトライ画面切り替え
      if (white.x > 320) {
        label.text = "TOUCH RETRY!";
        retry.x = 0;
        player.x = 270;
        white.x = 0;
        white.frame = 5;
        if (score.num % 3 == 0 && retry.time >= 10)
          retry.time -= 5;
        time.num = retry.time;
        time.text = "残り "+time.num+" 秒";
        player.touch = false;
        player.time = true;
      }
    });

    //白クマ
    var white = new Sprite(32,32);
    white.image = game.assets[chara1];
    white.frame = 5;
    white.y = 144;
    white.scaleX = -1;
    white.walk = 0;
    white.walk_c = 0;
    white.f = 5;
    white.turn = false;
    white.time = true;
    white.addEventListener('enterframe',function(e){
      //振り向き
      if (this.turn == true) {
        this.scaleX = 1;
        if (button.push ==true || button.up == true) {
          label.move = true;
          label.text = '動いた！ You lose(ﾟ∀ﾟ)';
          game.end(score.num,score.num+"回成功して動いてしまった。");
        }
        if (this.time == true) {
          this.t = game.frame;
          this.time = false;
        }
        if (this.t + game.fps + Math.floor(Math.random()*30) <= game.frame) {
          label.text = "";
          label.time = 0;
          white.scaleX *= -1;
          white.turn = false;
          this.time = true;
        }
      }
    });

    //フラグ立て過ぎでこんがらがってきた

    //「だるまさんが転んだ」テキスト
    var label = new Label();
    label.font = '2em"Ariar"';
    label.x = 30;
    label.y = 30;
    label.text = '';
    label.t = 'だるまさんがころんだ';
    label.time = 0;
    label.move = false;
    label.addEventListener('enterframe',function(e){
      if (this.move == false) {
        if (retry.flag == false) {
          if (this.text != this.t) {
            if (Math.floor(Math.random()*10) == 0) {
              this.text += this.t[this.time];
              this.time++;
            }
          } else {
            white.turn = true;
          }
        }
      }
    });

    //クリア回数
    var score = new Label();
    score.x = 250;
    score.num = 0;
    score.text = score.num+" 回成功";

    //時間
    var time = new Label();
    time.num = 30;
    time.text = "残り "+time.num+" 秒";
    time.addEventListener('enterframe',function(e){
      if (retry.flag == false) {
        if (game.frame % game.fps == 0) {
          time.num--;
          time.text = "残り "+time.num+" 秒";
        }
        if (time.num <= 0) {
          label.text = "TIME OUT";
          game.end(score.num,score.num+"回成功して時間切れでした。"); //時間切れ
        }
      }
    });

    //操作用ボタン
    var button = new Sprite(100,100);
    button.image = game.assets[apad];
    button.x = 110;
    button.y = 220;
    button.push = false;
    button.up = false;
    button.addEventListener('touchstart',function(e){
      this.push = true;
    });
    button.addEventListener('touchend',function(e){
      this.push = false;
      this.up = true;
      player.stop = game.frame;
    });

    //リトライ用
    var retry = new Sprite(320,320);
    retry.x = -320;
    retry.time = 30;
    retry.flag = false;
    retry.addEventListener('touchend',function(e){
      label.text = "";
      label.time = 0;
      retry.flag = false;
      player.scaleX *= -1;
      white.scaleX *= -1;
      retry.x = -320;
    });

    //実行
    game.rootScene.addChild(map);
    game.rootScene.addChild(player);
    game.rootScene.addChild(white);
    game.rootScene.addChild(button);
    game.rootScene.addChild(label);
    game.rootScene.addChild(score);
    game.rootScene.addChild(time);
    game.rootScene.addChild(retry);

    game.rootScene.backgroundColor = 'paleturquoise';
  }
  game.start();
};
