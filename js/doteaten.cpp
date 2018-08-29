
#include "DxLib.h"

#include <iostream>
#include <windows.h>
#include <cstdlib>
#include <ctime>

#define WALL -1
#define ROAD 1
#define NONE 0
#define PLAYMAN 2
#define ITEMUP 50
#define ITEMDO 100
#define ITEM 150
#define HP 20//体力
#define ITEMCOUNT 10//アイテムの個数

#define DOWN 1
#define UP 3
#define UP_COUNT 2
#define DOWN_COUNT 2

#define START -2
#define MAIN 1
#define CONTINUE 2
#define GAMEOVER 3
#define CHECK 4
#define SELECT 5
#define END 6

#define ON 0
#define OFF -1

#define WIDTH 5  //横幅はWIDTHの2倍
#define HEIGHT 5 //縦幅はHEIGHTの2倍

#define K 4 //3以上の数　曲がる確率 K-1/K
#define I 10 //3以上の数　item落ちる確率　1/I
#define SLEEPTIME 100 //速さ

#define SIZE 32//1マス

#define WINDOW_WIDTH 2*WIDTH+3
#define WINDOW_HEIGHT 2*HEIGHT+3

#define NUMBER 200

#define NumOfKo 1000
#define GAgeneration 1000
#define GAlength 36


int Key[256];
int gpUpdateKey();

int check = START;

enum eMenu{
	eMenu_check,//答え合わせ
	eMenu_continue,//コンティニュー
	eMenu_exit,//終了

	eMenu_Num//選択数
};

static int NowSelect = eMenu_check;


///////////
/////w/////
//a/////d// //方向
/////s/////
///////////


class PLAYER{
public:
	int stage[2 * WIDTH + 3][2 * HEIGHT + 3];//ステージ
	int x;//x座標
	int y;//y座標
	char forward;//4方向
	int hp;//たいりょく
	int item[ITEMCOUNT][2];
	int items;
	int ups;
	int downs;
	int itemcount;
	char course[NUMBER];

	void Makestage();//ステージの形を作る
	void Initialize();//初期位置決定　初期方向決定
	void Show(int plus);//ステージ出力
	void Item();//ランダムでアイテムを落とす
	void Catch();//アイテムが落ちてたら拾う
	void Speeddown();//体力低下
	void Speedup();//体力増加
	void Control(int p);//入力
	int Meter();//体力
	void Continue();//コンティニュー
	void StartMenu();//スタートメニュー
	void Main();//メインメニュー
	void Main(char course[], PLAYER pl);//メインメニュー
	int Main(int code[], PLAYER pl);//メインメニュー


	void Route_Draw();//軌跡を描く
	void Show_Check();//ステージ出力 答え合わせ用
	void StageCopy(PLAYER pl);
	void Main_Check();//いるかなー？
	void AI_Control(int p);//自動入力
	void Route_Draw2();
};


void GA(PLAYER a, PLAYER b);


int WINAPI WinMain(HINSTANCE hInstance, HINSTANCE hPrevInstance,
	LPSTR lpCmdLine, int nCmdShow)
{

	ChangeWindowMode(TRUE);

	if (DxLib_Init() == -1){	// ＤＸライブラリ初期化処理
		return -1;				// エラーが起きたら直ちに終了
	}

	SetDrawScreen(DX_SCREEN_BACK);

	//画面モードの変更
	SetGraphMode((2*HEIGHT+3)*SIZE, (2*WIDTH+3)*SIZE, SIZE);
	//main
	PLAYER a;
	PLAYER b;
	PLAYER bb;
	while (ScreenFlip() == 0 && ProcessMessage() == 0 && ClearDrawScreen() == 0 ){
		switch (check){
		case START:
			a.StartMenu();
			break;
		case MAIN:
			srand((unsigned)time(NULL));
			a.Makestage();
			a.Initialize();
			a.Item();
			bb.StageCopy(a);
			b.StageCopy(a);
			a.Show(0);
			a.Main();
			break;
		case CONTINUE:
			a.Continue();
			break;
		case GAMEOVER:
			a.Continue();
			break;
		case CHECK:
			 SetGraphMode(2*(2 * HEIGHT + 3)*SIZE, (2 * WIDTH + 3)*SIZE, SIZE);
			 bb.Show((2 * WIDTH + 3)*SIZE);
			 b.StageCopy(bb);
			 b.Show(0);
			 ScreenFlip();
			 b.Main(a.course, bb);
			 a.Route_Draw();

			 GA(b, bb);

			 WaitKey();
			 SetGraphMode((2 * HEIGHT + 3)*SIZE, (2 * WIDTH + 3)*SIZE, SIZE);
			 check = SELECT;
			 break;
		case SELECT:
			a.Continue();
			break;
		case END:goto LABEL;
		}
		ClearDrawScreen();
	}
	LABEL:
		//WaitKey();					// キーの入力待ち((7-3)『WaitKey』を使用)

		DxLib_End();				// ＤＸライブラリ使用の終了処理

		return 0;					// ソフトの終了
}



int gpUpdateKey(){
	char tmpKey[256];
	GetHitKeyStateAll(tmpKey);

	for (int i = 0; i < 256; i++){
		if (tmpKey[i] != 0){
			++Key[i];
		}
		else{
			Key[i] = 0;
		}
	}
	return 0;
}

void PLAYER::Makestage(){
		//ステージ生成
		for (int i = 0; i < 2 * WIDTH + 3; i++){
			for (int j = 0; j < 2 * HEIGHT + 3; j++){
				if (i == 0 || j == 0 || i == 2 * WIDTH + 2 || j == 2 * HEIGHT + 2){
					stage[i][j] = NONE;
				}
				else if (1 < i && i < 2 * WIDTH + 1 && 1 < j && j < 2 * HEIGHT + 1){
					stage[i][j] = ROAD;
				}
				else{ stage[i][j] = WALL; }
			}
		}

}

void PLAYER::Initialize(){
	x = WIDTH;
	y = HEIGHT;
	forward = 'w';
	hp = HP;
	items = 0;
	ups = 0;
	downs = 0;
	itemcount = 0;
	for (int i = 0; i < NUMBER;i++){
		course[i] = '0';
	}

}

void PLAYER::Show(int plus){
	//printout

	int bl = LoadGraph("black.png");
	int yuka = LoadGraph("yuka10.jpg");
	int kabe = LoadGraph("kabe2.jpg");
	int up = LoadGraph("UP.png");
	int down = LoadGraph("DOWN.png");
	int it = LoadGraph("ITEM.png");
	int gu = LoadGraph("girl_up.png");
	int gr = LoadGraph("girl_right.png");
	int gd = LoadGraph("girl_down.png");
	int gl = LoadGraph("girl_left.png");

	for (int i = 0; i < 2 * HEIGHT + 3; i++){
		for (int j = 0; j < 2 * WIDTH + 3; j++){

			if (stage[i][j] == NONE){
				DrawExtendGraph(SIZE * j + plus, SIZE * i, SIZE * (j + 1) + plus, SIZE * (i + 1), bl, TRUE);
			}
			else if(stage[i][j] == WALL){
				DrawExtendGraph(SIZE * j + plus, SIZE * i, SIZE * (j + 1) + plus, SIZE * (i + 1), kabe, TRUE);
			}
			else{
				DrawExtendGraph(SIZE * j + plus, SIZE * i, SIZE * (j + 1) + plus, SIZE * (i + 1), yuka, FALSE);
			}

			if (j == x && i == y){
				switch (forward){
				case 'w':DrawExtendGraph(SIZE * j + plus, SIZE * i, SIZE * (j + 1) + plus, SIZE * (i + 1), gu, TRUE); break;
				case 'd':DrawExtendGraph(SIZE * j + plus, SIZE * i, SIZE * (j + 1) + plus, SIZE * (i + 1), gr, TRUE); break;
				case 's':DrawExtendGraph(SIZE * j + plus, SIZE * i, SIZE * (j + 1) + plus, SIZE * (i + 1), gd, TRUE); break;
				case 'a':DrawExtendGraph(SIZE * j + plus, SIZE * i, SIZE * (j + 1) + plus, SIZE * (i + 1), gl, TRUE); break;
				}
			}
			else if (stage[i][j] == ITEMUP){
				DrawExtendGraph(SIZE * j + plus, SIZE * i, SIZE * (j + 1) + plus, SIZE * (i + 1), up, TRUE);
			}
			else if (stage[i][j] == ITEMDO){
				DrawExtendGraph(SIZE * j + plus, SIZE * i, SIZE * (j + 1) + plus, SIZE * (i + 1), down, TRUE);
			}
			else if (stage[i][j] == ITEM){
				DrawExtendGraph(SIZE * j + plus, SIZE * i, SIZE * (j + 1) + plus, SIZE * (i + 1), it, TRUE);
			}


		}
	}

	//DrawFormatString(SIZE*WIDTH, SIZE + (HEIGHT+5), GetColor(127, 0, 0), "%d", check);

	DrawString(SIZE + plus, SIZE+2, "ITEM", GetColor(0, 255, 0));
	DrawFormatString(SIZE + 96 + plus, SIZE+2, GetColor(0, 255, 0), "%d", items);
	for (int k = 0; k < hp; k++){
		DrawString(SIZE + (2*WIDTH) * SIZE-k*SIZE/2 + plus, SIZE+16+2, "+",GetColor(0, 255, 0));
	}
}

void PLAYER::Item(){
	int x_item = 0;
	int y_item = 0;
	int k, l;
	int check;
	//int up_count = 0;
	//int down_count = 0;
	int item_count = 0;
	for (int i = 0; i<ITEMCOUNT; i++){
		x_item = rand() % (2 * WIDTH - 1) + 2;
		y_item = rand() % (2 * HEIGHT - 1) + 2;
		item[i][0] = x_item;
		item[i][1] = y_item;
		for (int j = 0; j<i; j++){
			while (item[i][0] == item[j][0] && item[i][1] == item[j][1]){
				y_item = rand() % (2 * HEIGHT - 1) + 2;
				item[i][1] = y_item;
			}
		}
		k = item[i][0];
		l = item[i][1];
		if (itemcount < UP_COUNT){
			stage[l][k] = ITEMUP; ++itemcount;
		}
		else if (UP_COUNT <= itemcount && itemcount < UP_COUNT+DOWN_COUNT){
			stage[l][k] = ITEMDO; ++itemcount;
		}
		else if (UP_COUNT+DOWN_COUNT <= itemcount && itemcount<ITEMCOUNT){
			stage[l][k] = ITEM; ++itemcount;
		}
		/*
		if (check != 1 && check != 2){ stage[l][k] = ITEM; ++itemcount; }
		else if (check == 2){
			if (down_count < DOWN_COUNT){
				stage[l][k] = ITEMDO; ++down_count;
			}
			else{
				check = rand() % 5 + 1;
				if (check != 2){ stage[l][k] = ITEM; ++itemcount; }
				else if (check == 1){ stage[l][k] = ITEMUP; ++up_count; }
			}
		}
		else if (check == 1){
			if (up_count < UP_COUNT){ stage[l][k] = ITEMUP; ++up_count; }
			else{
				check = rand() % 5 + 1;
				if (check != 2){ stage[l][k] = ITEM; ++itemcount; }
				else if (check == 2){ stage[l][k] = ITEMDO; ++down_count; }
			}
		}
		*/
	}
}

void PLAYER::Catch(){
	if (stage[y][x] == ITEMDO){
		Speeddown();
		downs++;
	}
	else if (stage[y][x] == ITEMUP){
		Speedup();
	}
	else if (stage[y][x] == ITEM){
		++items;
	}
	stage[y][x] = ROAD;
}

void PLAYER::Speeddown(){
	hp -= DOWN;
}

void PLAYER::Speedup(){
	hp += UP;
}

void PLAYER::Control(int p){
	gpUpdateKey();
	if (Key[KEY_INPUT_D] >= 1 || Key[KEY_INPUT_RIGHT]>=1){ // 右キーが押されていたら
		if (stage[y][x + 1] != WALL){ --hp; ++x; forward = 'd';		course[p] = 'd'; }                  // 右へ移動

	}
	if (Key[KEY_INPUT_S] >= 1 || Key[KEY_INPUT_DOWN]>=1){ // 下キーが押されていたら
		if (stage[y + 1][x] != WALL){ --hp; ++y; forward = 's';		course[p] = 's'; }                   // 下へ移動

	}
	if (Key[KEY_INPUT_A] >= 1||Key[KEY_INPUT_LEFT]>=1){ // 左キーが押されていたら
		if (stage[y][x - 1] != WALL){ --hp; --x; forward = 'a';		course[p] = 'a'; }                      // 左へ移動

	}
	if (Key[KEY_INPUT_W] >= 1||Key[KEY_INPUT_UP]>=1){ // 上キーが押されていたら
		if (stage[y - 1][x] != WALL){ --hp; --y; forward = 'w';		course[p] = 'w'; }                      // 上へ移動

	}
}



int PLAYER::Meter(){
	if (items == itemcount){
		return CONTINUE;
	}
	else if (hp <= 0){
		return GAMEOVER;
	}
	else{ return MAIN; }
}

void PLAYER::Continue(){
	ClearDrawScreen();
	//DrawBox(0, 0, SIZE*(WIDTH * 2 + 3), SIZE*(HEIGHT * 2 + 3), GetColor(0, 0, 0), TRUE);
	if (check == CONTINUE){
	}
	else if (check == GAMEOVER){
	}
	else if (check == SELECT){
	}

	int gd = LoadGraph("girl_down.png");

	while (ScreenFlip() == 0 && ProcessMessage() == 0 && ClearDrawScreen() == 0){
		if (check == CONTINUE){
			DrawFormatString(SIZE*(WIDTH-1), SIZE*HEIGHT, GetColor(255, 255, 0), "Conglaturation!");
		}
		else if (check == GAMEOVER){
			DrawFormatString(SIZE*WIDTH, SIZE*HEIGHT, GetColor(255, 255, 255), "GAME OVER");
		}
		else if (check == SELECT){
		}

		DrawFormatString(SIZE*(WIDTH+1), SIZE*(HEIGHT + 3), GetColor(255, 127, 255), "Check");
		DrawFormatString(SIZE*(WIDTH+1), SIZE*(HEIGHT + 4 + 1 / 4), GetColor(255, 127, 255), "Continue");
		DrawFormatString(SIZE*(WIDTH+1), SIZE*(HEIGHT + 5 + 1 / 2), GetColor(255, 127, 255), "Exit");

		gpUpdateKey();
		if (NowSelect == eMenu_check){
			DrawExtendGraph(SIZE*WIDTH, SIZE*(HEIGHT + 3) - 4, SIZE*(WIDTH + 1), SIZE*(HEIGHT + 4) - 4, gd, TRUE);
		}
		else if (NowSelect == eMenu_continue){
			DrawExtendGraph(SIZE*WIDTH, SIZE*(HEIGHT + 4 + 1 / 4) - 4, SIZE*(WIDTH + 1), SIZE*(HEIGHT + 5 + 1 / 4) - 4, gd, TRUE);
		}
		else if (NowSelect == eMenu_exit){
			DrawExtendGraph(SIZE*WIDTH, SIZE*(HEIGHT + 5 + 1 / 2) - 4, SIZE*(WIDTH + 1), SIZE*(HEIGHT + 6 + 1 / 2) - 4, gd, TRUE);
		}

		if (Key[KEY_INPUT_DOWN] == 1){//下キーが押されていたら
			NowSelect = (NowSelect + 1) % eMenu_Num;//選択状態を一つ下げる
		}
		if (Key[KEY_INPUT_UP] == 1){//上キーが押されていたら
			NowSelect = (NowSelect + (eMenu_Num - 1)) % eMenu_Num;//選択状態を一つ上げる
		}
		if (Key[KEY_INPUT_RETURN] == 1){//エンターキーが押されたら
			switch (NowSelect){//現在選択中の状態によって処理を分岐
			case eMenu_check://check選択中なら
				check = CHECK;//シーンをcheck画面に変更
				break;
			case eMenu_continue://continue選択中なら
				check = MAIN;//シーンをcontinue画面に変更
				break;
			case eMenu_exit://exit選択中なら
				check = END;//シーンをexit画面に変更
				break;
			}
			break;
		}
	}
	NowSelect = eMenu_check;
}

void PLAYER::StartMenu(){
	int menu[2];
	for (int i = 0; i < 2; i++){
		menu[i] = OFF;
	}
	int gd = LoadGraph("girl_down.png");
	int ti = LoadGraph("Title.png");
	menu[0] = ON;

	while (1){

		DrawExtendGraph(20 , SIZE, SIZE * 13, SIZE*(HEIGHT + 2), ti, TRUE);

		DrawFormatString(SIZE*(WIDTH + 1), SIZE*(HEIGHT + 3), GetColor(255, 127, 255), "START");
		DrawFormatString(SIZE*(WIDTH + 1), SIZE*(HEIGHT + 4+1/2), GetColor(255, 127, 255), "Exit");


		if (menu[0] == ON){
			DrawExtendGraph(SIZE*WIDTH , SIZE*(HEIGHT +3) - 4, SIZE*(WIDTH+1), SIZE*(HEIGHT + 4) - 4, gd, TRUE);
		}
		else if (menu[1] == ON){
			DrawExtendGraph(SIZE*WIDTH, SIZE*(HEIGHT + 4+1/2) - 4, SIZE*(WIDTH+1), SIZE*(HEIGHT + 5+1/2) - 4, gd, TRUE);
		}

		gpUpdateKey();
		if (Key[KEY_INPUT_UP] >= 1){
			if (menu[0] == OFF){
				menu[0] = ON;
				menu[1] = OFF;
			}
		}
		else if (Key[KEY_INPUT_DOWN] >= 1){
			if (menu[1] == OFF){
				menu[1] = ON;
				menu[0] = OFF;
			}
		}

		if (Key[KEY_INPUT_RETURN] >= 1){//START
			if (menu[0] == ON){
				check = MAIN;
				ClearDrawScreen();
				break;
			}
			else if (menu[1] == ON){//EXIT
				check = END;
				break;
			}
		}
		ClearDrawScreen();
	}

}

void PLAYER::Main(){
	int p = 0;
	while (ScreenFlip() == 0 && ProcessMessage() == 0 && ClearDrawScreen() == 0 && gpUpdateKey() == 0){
		if (Meter() != MAIN){
			check = Meter();
			break;
		}
		Control(p);
		p++;
		//Back_Draw();
		Catch();
		Show(0);
		Sleep(SLEEPTIME);
	}
	ClearDrawScreen();
}

void PLAYER::Main(char course[], PLAYER pl){
	int p = 0;
	while (ScreenFlip() == 0 && ProcessMessage() == 0 && gpUpdateKey() == 0){
		if (Meter() != MAIN){
			check = Meter();
			break;
		}

		if (course[p] == 'd'){ // 右キーが押されていたら
			if (stage[y][x + 1] != WALL){ --hp; ++x; forward = 'd';}                  // 右へ移動

		}
		else if (course[p] == 's'){ // 下キーが押されていたら
			if (stage[y + 1][x] != WALL){ --hp; ++y; forward = 's';}                   // 下へ移動

		}
		else if (course[p] == 'a'){ // 左キーが押されていたら
			if (stage[y][x - 1] != WALL){ --hp; --x; forward = 'a';}                      // 左へ移動

		}
		else if (course[p] == 'w'){ // 上キーが押されていたら
			if (stage[y - 1][x] != WALL){ --hp; --y; forward = 'w';}                      // 上へ移動

		}
		else{

		}
		//Back_Draw();
		Catch();
		p++;
	}
	Show(0);
	for (int i = 0; i < 2 * HEIGHT + 3; i++){
		for (int j = 0; j < 2 * WIDTH + 3; j++){
			stage[i][j] = pl.stage[i][j];
		}
	}
	x = pl.x;
	y = pl.y;
	forward = pl.forward;
	for (int i = 0; i < ITEMCOUNT; i++){
		for (int j = 0; j < 2; j++){
			item[i][j] = pl.item[i][j];
		}
	}

	Show(0);
}


int PLAYER::Main(int code[], PLAYER pl){
	int p = 0;
	while (ScreenFlip() == 0 && ProcessMessage() == 0 && gpUpdateKey() == 0){

		if (Meter() != MAIN){
			check = Meter();
			break;
		}

		if (code[p] == 1){ // 右キーが押されていたら
			if (stage[y][x + 1] != WALL){ --hp; ++x; forward = 'd'; }                  // 右へ移動
		}
		else if (code[p] == 2){ // 下キーが押されていたら
			if (stage[y + 1][x] != WALL){ --hp; ++y; forward = 's'; }                   // 下へ移動
		}
		else if (code[p] == 3){ // 左キーが押されていたら
			if (stage[y][x - 1] != WALL){ --hp; --x; forward = 'a'; }                      // 左へ移動
		}
		else if (code[p] == 0){ // 上キーが押されていたら
			if (stage[y - 1][x] != WALL){ --hp; --y; forward = 'w'; }                      // 上へ移動
		}
		else{

		}
		//Back_Draw();
		Catch();
		Show((2 * WIDTH + 3)*SIZE);
		p++;
	}

	for (int i = 0; i < 2 * HEIGHT + 3; i++){
		for (int j = 0; j < 2 * WIDTH + 3; j++){
			stage[i][j] = pl.stage[i][j];
		}
	}
	x = pl.x;
	y = pl.y;
	forward = pl.forward;
	for (int i = 0; i < ITEMCOUNT; i++){
		for (int j = 0; j < 2; j++){
			item[i][j] = pl.item[i][j];
		}
	}

	Show((2 * WIDTH + 3)*SIZE);

	return p;
}



void PLAYER::Route_Draw(){
	int before[2];
	int after[2];
	before[0] = WIDTH;//x成分
	before[1] = HEIGHT;//y成分
	after[0] = WIDTH;
	after[1] = HEIGHT;

	for (int i = 0; i < NUMBER; i++){
		if (course[i] == 'd'){
			after[0] = before[0] + 1;
		}
		else if (course[i] == 's'){
			after[1] = before[1] + 1;
		}
		else if (course[i] == 'a'){
			after[0] = before[0] - 1;
		}
		else if (course[i] == 'w'){
			after[1] = before[1] - 1;
		} else if (course[i] == '0'){}
		DrawLine((before[0])*SIZE+SIZE/2,(before[1])*SIZE+SIZE/2,(after[0])*SIZE+SIZE/2,(after[1])*SIZE+SIZE/2, GetColor(255, 0, 0));
		before[0] = after[0];
		before[1] = after[1];


	}
}


void PLAYER::StageCopy(PLAYER pl){
	for (int i = 0; i < 2 * HEIGHT + 3; i++){
		for (int j = 0; j < 2 * WIDTH + 3; j++){
			stage[i][j] = pl.stage[i][j];
		}
	}
	x = pl.x;
	y = pl.y;
	forward = pl.forward;
	ups = pl.ups;
	hp = pl.hp;
	downs = pl.downs;
	for (int i = 0; i < ITEMCOUNT; i++){
		for (int j = 0; j < 2; j++){
			item[i][j] = pl.item[i][j];
		}
	}
	items = pl.items;
	itemcount = pl.itemcount;

}



void PLAYER::AI_Control(int p){
	gpUpdateKey();
	if (Key[KEY_INPUT_D] >= 1 || Key[KEY_INPUT_RIGHT] >= 1){ // 右キーが押されていたら
		if (stage[y][x + 1] != WALL){ --hp; ++x; forward = 'd';  course[p] = 'd'; }                  // 右へ移動
	}
	if (Key[KEY_INPUT_S] >= 1 || Key[KEY_INPUT_DOWN] >= 1){ // 下キーが押されていたら
		if (stage[y + 1][x] != WALL){ --hp; ++y; forward = 's';  course[p] = 's'; }                   // 下へ移動
	}
	if (Key[KEY_INPUT_A] >= 1 || Key[KEY_INPUT_LEFT] >= 1){ // 左キーが押されていたら
		if (stage[y][x - 1] != WALL){ --hp; --x; forward = 'a';  course[p] = 'a'; }                      // 左へ移動
	}
	if (Key[KEY_INPUT_W] >= 1 || Key[KEY_INPUT_UP] >= 1){ // 上キーが押されていたら
		if (stage[y - 1][x] != WALL){ --hp; --y; forward = 'w';  course[p] = 'w'; }                      // 上へ移動
	}
}

void PLAYER::Route_Draw2(){
	int plus = 2 * WIDTH + 3;
	int before[2];
	int after[2];
	before[0] = WIDTH;//x成分
	before[1] = HEIGHT;//y成分
	after[0] = WIDTH;
	after[1] = HEIGHT;
	for (int i = 0; i < NUMBER; i++, ScreenFlip()){
		if (course[i] == 'd'){
			after[0] = before[0] + 1;
		}
		else if (course[i] == 's'){
			after[1] = before[1] + 1;
		}
		else if (course[i] == 'a'){
			after[0] = before[0] - 1;
		}
		else if (course[i] == 'w'){
			after[1] = before[1] - 1;
		}
		else if (course[i] == '0'){}
		DrawLine((before[0]+plus)*SIZE + SIZE / 2,(before[1]+plus)*SIZE + SIZE / 2, (after[0]+plus)*SIZE + SIZE / 2, (after[1]+plus)*SIZE + SIZE / 2, GetColor(255, 0, 0));
		before[0] = after[0];
		before[1] = after[1];

	}
}

void GA(PLAYER pl, PLAYER pl2){

	int ko[NumOfKo][GAlength];
	int ko_fit[NumOfKo];
	int cko[NumOfKo][GAlength];
	int cko_fit[NumOfKo];
	int pare1 = 0;
	int pare2 = 0;
	int index[NumOfKo];
	int j = 0;
	int a = 0;
	int b = 0;
	int temp = 0;
	int count = 0;
	char c = '0';


	//initialize
	for (int i = 0; i < NumOfKo; i++){
		ko_fit[i] = 0;
		for (int j = 0; j < GAlength; j++){
			ko[i][j] = rand() % 4;
		}
	}

	for (int i = 0; i < NumOfKo; i++){



		pl.StageCopy(pl2);
		j = 0;
		for (int j = 0; j < GAlength;j++){

			if (pl.Meter() != MAIN){
				break;
			}


			if (ko[i][j] == 0){
				if (pl.stage[pl.y - 1][pl.x] != WALL){ --pl.hp; --pl.y; pl.forward = 'w'; }                      // 上へ移動
				else{ ko[i][j] = rand() % 4; j--; }
			}
			else if (ko[i][j] == 1){
				if (pl.stage[pl.y][pl.x + 1] != WALL){ --pl.hp; ++pl.x; pl.forward = 'd'; }                  // 右へ移動
				else{ ko[i][j] = rand() % 4; j--; }
			}
			else if (ko[i][j] == 2){
				if (pl.stage[pl.y + 1][pl.x] != WALL){ --pl.hp; ++pl.y; pl.forward = 's';}                   // 下へ移動
				else{ ko[i][j] = rand() % 4; j--; }
			}
			else if (ko[i][j] == 3){
				if (pl.stage[pl.y][pl.x - 1] != WALL){ --pl.hp; --pl.x; pl.forward = 'a';}                      // 左へ移動
				else{ ko[i][j] = rand() % 4; j--; }
			}

			pl.Catch();

		}

		ko_fit[i] = pl.items * 10 + pl.ups + pl.hp - pl.downs;
		//ko_fit[i] = pl.items * 10 + pl.hp;

	}


	for (int i = 0; i < NumOfKo - 1; i++){
		for (int j = NumOfKo - 1; j > i; j--){
			if (ko_fit[j]>ko_fit[j - 1]){

				for (int t = 0; t < GAlength; t++){
					temp = ko[j - 1][t];
					ko[j - 1][t] = ko[j][t];
					ko[j][t] = temp;
				}

			}
		}
	}


	for (int ga = 0; ga < GAgeneration; ga++){

		//crossover


		for (int i = 0; i < NumOfKo; i++){

			a = rand() % NumOfKo;
			b = rand() % NumOfKo;
			if (ko_fit[a] >= ko_fit[b]){
				pare1 = a;
			}
			else{
				pare1 = b;
			}

			a = rand() % NumOfKo;
			b = rand() % NumOfKo;
			if (ko_fit[a] >= ko_fit[b]){
				pare2 = a;
			}
			else{
				pare2 = b;
			}

			for (int j = 0; j < GAlength; j++){
				//if (rand() % 2 == 0){
					cko[i][j] = ko[pare1][j];
				//}
				//else{
				//	cko[i][j] = ko[pare2][j];
				//}

			}
		}

		//mutation

		for (int i = 0; i < NumOfKo; i++){


			for (int j = 0; j < GAlength; j++){

				if (rand() % GAlength <= 10){
					cko[i][j] += rand() % 3 + 1;
					if (cko[i][j] > 3){
						cko[i][j] -= 4;
					}
				}
			}
		}

		//estimate

		for (int i = 0; i < NumOfKo; i++){

			pl.StageCopy(pl2);
			j = 0;
			for (int j = 0; j < GAlength;j++){

				if (pl.Meter() != MAIN){
					break;
				}

				if (cko[i][j] == 0){
					if (pl.stage[pl.y - 1][pl.x] != WALL){ --pl.hp; --pl.y; pl.forward = 'w'; }                      // 上へ移動
					else{ cko[i][j] = rand() % 3 + 1; j--; }
				}
				else if (cko[i][j] == 1){
					if (pl.stage[pl.y][pl.x + 1] != WALL){ --pl.hp; ++pl.x; pl.forward = 'd'; }                  // 右へ移動
					else{
						cko[i][j] = 2 + rand() % 3;
						if (cko[i][j] > 3) cko[i][j] -= 4;
						j--;
					}
				}
				else if (cko[i][j] == 2){
					if (pl.stage[pl.y + 1][pl.x] != WALL){ --pl.hp; ++pl.y; pl.forward = 's'; }                   // 下へ移動
					else{
						cko[i][j] = 3 + rand() % 3;
						if (cko[i][j] > 3) cko[i][j] -= 4;
						j--;
					}
				}
				else if (cko[i][j] == 3){
					if (pl.stage[pl.y][pl.x - 1] != WALL){ --pl.hp; --pl.x; pl.forward = 'a'; }                      // 左へ移動
					else{ cko[i][j] = rand() % 3; j--; }
				}

				pl.Catch();

			}

			cko_fit[i] = pl.items * 10 + pl.hp + pl.ups - pl.downs;
			//cko_fit[i] = pl.items * 10 + pl.hp;

		}

		for (int i = 0; i < NumOfKo; i++){
			index[i] = i;
		}

		for (int i = 0; i < NumOfKo - 1; i++){
			for (int j = NumOfKo - 1; j > i; j--){
				if (cko_fit[j]>cko_fit[j - 1]){
					temp = index[j - 1];
					index[j - 1] = index[j];
					index[j] = temp;
				}
			}
		}

		//update

		count = 0;
		for (int i = 0; i < NumOfKo; i++){
			if (ko_fit[i] <= cko_fit[index[count]]){
				for (int t = 0; t < GAlength; t++){
					ko[i][t] = cko[index[count]][t];
				}
				ko_fit[i] = cko_fit[index[count]];
				count++;
			}
		}



	}

	int code[GAlength];
	int limit = 0;

	for (int i = 0; i < GAlength; i++){
		code[i] = ko[0][i];
	}

	pl.StageCopy(pl2);
	pl.Show((2 * WIDTH + 3)*SIZE);
	ScreenFlip();
	limit = pl.Main(code, pl2);

	int before[2];
	int after[2];
	before[0] = WIDTH;//x成分
	before[1] = HEIGHT;//y成分
	after[0] = WIDTH;
	after[1] = HEIGHT;

	for (int i = 0; i < limit; i++){
		if (code[i] == 1){
			after[0] = before[0] + 1;
		}
		else if (code[i] == 2){
			after[1] = before[1] + 1;
		}
		else if (code[i] == 3){
			after[0] = before[0] - 1;
		}
		else if (code[i] == 0){
			after[1] = before[1] - 1;
		}
		else{

		}
		DrawLine((before[0])*SIZE + (2 * WIDTH + 3)*SIZE + SIZE / 2, (before[1])*SIZE + SIZE / 2, (after[0])*SIZE + (2 * WIDTH + 3)*SIZE + SIZE / 2, (after[1])*SIZE + SIZE / 2, GetColor(255, 0, 0));
		before[0] = after[0];
		before[1] = after[1];


	}

}
