"use strict";
var y = 250;			//自機のY座標
var v = 0;				//自機の加速度
var keyDown = false;	//キー押下中か
var WALLS = 80;			//洞窟の通り道(DOMで表現)
var score = 0;
var walls = [];
var slope = 0;			//勾配の度合い
var timer;				//メインループ実行タイマー
var ship;				//自機のDOMオブジェクト
var main;				//洞窟の通り道の親要素となるDOMオブジェクト

//読み込み時実行関数
function init() {

	//ゲーム領域のdiv(80個)
	main = document.getElementById('main');
	ship = document.getElementById('ship');

	for (var i = 0; i < WALLS; i++) {
		walls[i] = document.createElement("div");
		walls[i].style.position = "absolute";
		walls[i].style.top = "100px";
		walls[i].style.left = i * 10 + "px";
		walls[i].style.width = "10px";
		walls[i].style.height = "400px";
		walls[i].style.backgroundColor = "#333333";
		main.appendChild(walls[i]);
	}

	//洞窟の勾配を保持(隣のdivとのy座標の差分を乱数で求める)
	slope = Math.floor(Math.random() * 5) + 1;
	timer = setInterval(mainloop, 50);

	//イベントハンドラーの登録
	window.addEventListener('keydown', function () { keyDown = true; });
	window.addEventListener('keyup', function () { keyDown = false; });
}

//自機の衝突判定
function hitTest() {

	//自機の上端
	var st = parseInt(ship.style.top) + 10;

	var sh = parseInt(ship.style.height);

	//自機の下端
	var sb = st + sh - 20;

	//洞窟の上端
	var wt = parseInt(walls[14].style.top);

	var wh = parseInt(walls[14].style.height);

	//洞窟の下端
	var wb = wh + wt;

	//自機の上端stが洞窟の上端wtより小さいか
	//自機の下端sbが洞窟の下端wbより大きい場合は衝突
	return (st < wt) || (sb > wb);
}

function mainloop() {

	//衝突している場合
	if (hitTest()) {
		clearInterval(timer);
		document.getElementById('bang').style.top = (y - 40) + "px";
		document.getElementById('bang').style.visibility = "visible";
		return;
	}

	//スコアの加算表示反映
	score += 10;
	document.getElementById('score').innerHTML = score.toString();

	//加速度の処理
	//キー押下時にvを-3，押していないとき+3
	v += keyDown ? -3:3;
	y += v;
	ship.style.top = y + 'px';

	//一番右端の洞窟
	var edge = walls[WALLS - 1].style;
	var t = parseInt(edge.top);
	var h = parseInt(edge.height);
	var b = h + t;
	t += slope;
	b += slope;

	//一番右端の上端と下端の衝突判定
	//衝突した場合洞窟の幅を狭める
	if ((t < 0) && (slope < 0) || (b > 600) && (slope > 0)) {
		slope = (Math.floor(Math.random() * 5) + 1) * (slope < 0 ? 1:-1);
		edge.top = (t + 10) + "px";
		edge.height = (h - 20) + "px";
	} else {
		edge.top = t + "px";
	}

	//横スクロール表現
	//壁を左に順番にコピー
	for (var i = 0; i < WALLS - 1; i++) {
		walls[i].style.top = walls[i + 1].style.top;
		walls[i].style.height = walls[i + 1].style.height;
	}
}



