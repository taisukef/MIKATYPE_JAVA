import { System, Timer, TimerTask, Toolkit, Random, Color, Font, newInt, newChar } from "./likeJ.js";
//import { getSize, setSize, getInsets, getGraphics } from "./likeJGraphicsDummy.js";
import { getSize, setSize, getInsets, getGraphics, KeyAdapter, addKeyListener } from "./likeJGraphics.js";

import { MIKA_Asm8086 } from "./MIKA_Asm8086.js";
import { MIKA_IchigoJam } from "./MIKA_IchigoJam.js";
import { MIKA_oubun } from "./MIKA_oubun.js";
import { MIKA_mec } from "./MIKA_mec.js";
import { MIKA_mefortran } from "./MIKA_mefortran.js";
import { MIKA_mepascal } from "./MIKA_mepascal.js";
import { MIKA_mebasic } from "./MIKA_mebasic.js";
import { MIKA_memsdos } from "./MIKA_memsdos.js";

import { ZenkakuAlpha } from "https://code4fukui.github.io/mojikiban/ZenkakuAlpha.js";

const ICHIGOJAM = true;
const ENC = "UTF-8";
const LOWMODE = false;

let MIKA_file_name_seiseki = "mikatype.sei"; /* 成績ファイル名 読み込み用 */
let MIKA_file_name_seiseki2 = "mikatype.sei"; /* 成績ファイル名 書き込み用 */
let MIKA_file_name_kiroku = "mikatype.log"; /* 練習時間記録ファイル名 追記用 */
let MIKA_file_name_hayasa = "mikatype.spd"; /* 最高速度記録ファイル名 追記用 */
let MIKA_file_error_hayasa = 0; /* 最高速度記録ファイル書き込みエラー  = 0 正常  = 1 異常 */
let MIKA_file_error_kiroku = 0; /* 練習時間記録ファイル書き込みエラー  = 0 正常  = 1 異常 */
let MIKA_file_error_seiseki = 0; /* 成績ファイル書き込みエラー  = 0 正常  = 1 異常 */
let MIKA_Procptimer; /* ポジション練習ガイドキー文字位置表示用タイマー */
let MIKA_Procrtimer; /* ランダム練習 英単語練習入力速度表示用タイマー */
let MIKA_Procatimer; /* ローマ字練習入力速度表示用タイマー */
let MIKA_s_date; /* 練習開始日時 プログラム起動時に取得 練習時間記録ファイルに書き込み時使用 */
let MIKA_type_kiroku_date; /* 最高速度達成日時 (時分秒を含む)*/
let MIKA_type_date; /* 最高速度達成日 一時保存エリア MIKA_type_kiroku_dateの年月日のみを保存 */
let MIKA_st_t; /*  練習時間記録ファイル用練習開始時間ミリ秒 */
let MIKA_lt_t; /*  練習時間記録ファイル用練習終了時間ミリ秒 */
let MIKA_rt_t = 0; /* 成績記録ファイル用合計練習時間  秒 */
let MIKA_seiseki = [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null]; /* 成績データ読み込みデータ列 */
let MIKA_r_date =  /* ランダム練習 最高速度達成日付 */
[
  "        ",
  "        ",
  "        ",
  "        ",
  "        ",
  "        ",
  "        ",
  "        "
];
let MIKA_w_date =  /* 英単語練習 最高速度達成日付 */
[
  "        ",
  "        ",
  "        ",
  "        ",
  "        ",
  "        ",
  "        "
];
let MIKA_a_date =  /* ローマ字練習 最高速度達成日付 */
[
  "        ",
  "        "
];
let MIKA_r_speed =  /* ランダム練習 最高速度記録 */
[
  0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0
];
let MIKA_w_speed =  /* 英単語練習 最高速度記録 */
[
  0.0,0.0,0.0,0.0,0.0,0.0,0.0
];
let MIKA_a_speed =  /* ローマ字練習 最高速度記録 */
[
  0.0,0.0
];
let MIKA_p_time = 0; /* ポジション練習 累積練習時間 秒*/
let MIKA_r_time =  /* ランダム練習 累積練習時間 秒 */
[
  0,0,0,0,0,0,0,0
];
let MIKA_w_time =  /* 英単語練習 累積練習時間 秒 */
[
  0,0,0,0,0,0,0
];
let MIKA_a_time =  /* ローマ字練習 累積練習時間 秒 */
[
  0,0
];
let MIKA_timer = new Timer(); /* ポジション練習 ランダム練習 英単語練習 ローマ字練習用 タイマー取得 */
let MIKA_c_pos1 = "1234567890"; /* キーボード 最上段 刻印文字列 */
let MIKA_c_pos2 = LOWMODE ? "qwertyuiop" : "QWERTYUIOP"; /* キーボード 上一段 刻印文字列 */
let MIKA_c_pos3 = LOWMODE ? "asdfghjkl;" : "ASDFGHJKL;"; /* キーボード ホームポジション 刻印文字列 */
let MIKA_c_pos4 = LOWMODE ? "zxcvbnm,." : "ZXCVBNM,."; /* キーボード 下一段刻文字列印 */
let MIKA_c_post = [MIKA_c_pos1,MIKA_c_pos2,MIKA_c_pos3,MIKA_c_pos4]; /* キーボード刻印文字列テーブル */
let MIKA_h_pos1 = LOWMODE ? "asdfghjkl" : "ASDFGHJKL"; /* ホームポジション 練習文字列 */
let MIKA_h_pos2 = LOWMODE ? "qwertyuiop" : "QWERTYUIOP"; /* 上一段 練習文字列 */
let MIKA_h_pos3 = LOWMODE ? "asdfghjklqwertyuiop" : "ASDFGHJKLQWERTYUIOP"; /* ホームポジション＋上一段 練習文字列 */
let MIKA_h_pos4 = LOWMODE ? "zxcvbnm" : "ZXCVBNM"; /* 下一段 練習文字列 */
let MIKA_h_pos5 = LOWMODE ? "asdfghjklzxcvbnm" : "ASDFGHJKLZXCVBNM"; /* ホームポジション＋下一段 練習文字列 */
let MIKA_h_pos6 = LOWMODE ? "asdfghjklqwertyuiopzxcvbnm" : "ASDFGHJKLQWERTYUIOPZXCVBNM"; /* ホームポジション＋上一段＋下一段 練習文字列 */
let MIKA_h_pos7 = "1234567890"; /* 数字 練習文字列 */
let MIKA_h_pos8 = LOWMODE ? "asdfghjklqwertyuiopzxcvbnm1234567890" : "ASDFGHJKLQWERTYUIOPZXCVBNM1234567890"; /* 全段 練習文字列 */
let MIKA_h_pos = [MIKA_h_pos1,MIKA_h_pos2,MIKA_h_pos3,MIKA_h_pos4,MIKA_h_pos5,MIKA_h_pos6,MIKA_h_pos7,MIKA_h_pos8]; /* ポジション練習 ランダム練習 練習文字列テーブル */
let MIKA_p_count = null; /* 練習回数配列 アドレス */
let MIKA_p_count_position = [0,0,0,0,0,0,0,0]; /* ポジション練習 練習回数 */
let MIKA_p_count_random = [0,0,0,0,0,0,0,0]; /* ランダム練習 練習回数 */
let MIKA_p_count_word = [0,0,0,0,0,0,0]; /* 英単語練習 練習回数 */
let MIKA_p_count_romaji = [0,0]; /* ローマ字練習練習回数 */
let MIKA_char_table; /* 練習文字列テーブル アドレス */
let MIKA_word_table; /* 練習単語テーブルアドレス */
let MIKA_magenta = new Color(128,32,128); /* 濃いめのマゼンタ */
let MIKA_green = new Color(0,128,0); /* 濃いめのグリーン */
let MIKA_blue = new Color(0,0,128); /* 濃いめの青 */
let MIKA_cyan = new Color(0,128,128); /* 濃いめのシアン */
let MIKA_orange = new Color(128,32,0); /* 濃いめのオレンジ */
let MIKA_red = new Color(128,0,0); /* 濃いめの赤 */
let MIKA_color_position_err = new Color(192,0,0); /* ポジション練習のエラー文字の赤 */
let MIKA_bk_color = Color.white; /* 背景の色 */
let MIKA_finger_color = new Color(255,191,63); /* 指の色 */
let MIKA_nail_color = new Color(255,255,191); /* 指の爪の色 */
//	MIKA_nail_color = new Color(255,0,0); /* 指の爪の色 */
let MIKA_color_text_under_line = new Color(0,0,255); /* ランダム練習 英単語練習 ローマ字練習の下線表示色 */
let MIKA_color_romaji = new Color(0,0,255); /* ローマ字表記 文字表示色*/
let MIKA_color_romaji_err = new Color(255,0,0); /* ローマ字表記 エラー文字背景表示色 */
let MIKA_color_romaji_under_line = new Color(0,0,255); /* ローマ字表記 下線表示色 */
let MIKA_type_kind_mes = null; /* 練習項目名 */
let MIKA_type_speed_record = null; /* 最高速度記録配列アドレス */
let MIKA_type_date_record = null; /* 最高速度達成日配列アドレス */
let MIKA_type_time_record = null; /* 累積練習時間配列 アドレス */
let MIKA_type_start_time = 0; /* ポジション練習 ランダム練習 英単語練習 ローマ字練習 練習開始時間 ミリ秒 */
let MIKA_type_end_time = 0; /* ポジション練習 ランダム練習 英単語練習 ローマ字練習 練習終了時間 ミリ秒 */
let MIKA_type_speed_time = 0.0; /* 前回 練習経過時間 秒 */
let MIKA_ttype_speed_time = 0.0; /* 今回 練習経過時間 秒 */
let MIKA_type_speed = 0.0; /* ランダム練習 英単語練習 ローマ字練習 の文字入力速度 */
let MIKA_type_speed2 = 0.0; /* ローマ字入力時の打鍵速度 */
let MIKA_position_limit = 60; /* ポジション練習 練習文字数 */
let MIKA_random_key_limit = 60.0; /* ランダム練習 英単語練習 ローマ字練習 キー入力の 制限時間 秒 */
let MIKA_random_key_limit2 = 60.0; /* ランダム練習 英単語練習 ローマ字練習 タイマーの 制限時間 秒 */
let MIKA_random_time_interval = 1000; /* ランダム練習 英単語練習 ローマ字練習 一秒タイマー ミリ秒 */
let MIKA_type_syuryou_flag = 0; /* 練習終了時の記録更新フラグ  = 0 更新せず  = 1 前回の入力速度が0.0の時の記録更新  = 2 前回の記録が0.0より大きい時の記録更新 */
let MIKA_char_position = 0; /* 練習文字番号 ポジション練習 ランダム練習にてランダムに文字を選択する時のポインター */
let MIKA_key_char = 0; /* 練習文字 */
let MIKA_guide_char = 0; /* ガイドキー文字 */
let MIKA_err_char = 0; /* エラー文字 */
let MIKA_type_count = 0; /* 入力文字数カウンター */
let MIKA_w_count = 0; /* ひらがな入力文字数カウンター */
let MIKA_type_err_count = 0; /* エラー入力文字数カウンター */
let MIKA_c_p1 = 0;
let MIKA_c_p2 = 0; /* ランダム練習 英単語練習 ローマ字練習の練習文字ポインター */
let MIKA_err_char_flag = 0; /* エラー入力フラグ */
let MIKA_time_start_flag = 0; /* 時間計測開始フラグ  = 0 開始前  = 1 測定中 */
let MIKA_romaji = null; /* ひらがなのローマ字表記 */
let MIKA_romaji_length = 0; /* ひらがなのローマ字表記の文字数 */
let MIKA_romaji2 = null; /* ひらがなのローマ字の別表記 */
let MIKA_romaji_length2 = 0; /* ひらがなのローマ字の別表記の文字数 */
let MIKA_key_char2 = 0; /* ひらがなローマ字別表記の練習文字 */
let MIKA_r_count = 0; /* ひらがな一文字内のローマ字表記文字カウンター */
let MIKA_random_scale = 1.0; /* ランダム練習 英単語練習 ローマ字練習の文字表示倍率 */
let MIKA_max_x_flag = 0;/* 画面表示 縦行数モード  = 0 25行  = 1 20行 */
let MIKA_max_y_flag = 0;/* 画面表示 横文半角カラム数モード  = 0 80カラム  = 1 64カラム */
let MIKA_width_x = 16; /* 全角文字 半角文字 縦方向ドット数 */
let MIKA_width_y = 8; /* 半角文字 横方向ドット数 */
let MIKA_practice_end_flag = 0; /* 練習実行中フラグ  = 0 練習中  = 1 終了中 ESCによる終了も含む */
let MIKA_key_guide_flag = 0; /* キーガイドメッセージ表示フラグ  = 0 表示なし  = 1 次回はキーガイドを表示を消して練習  = 2次回はキーガイドを表示を消して練習 */
let MIKA_menu_kind_flag = 0; /*  = 1 キーガイド表示あり  = 3 キーガイド表示無し */
let MIKA_key_guide_on = 1; /* 定数 キーガイド表示あり */
let MIKA_key_guide_off = 3; /* 定数 キーガイド表示無し */
let MIKA_type_end_flag = 0; /* 練習終了フラグ  = 0 ESCによる終了  = 1 60文字入力による終了 */
let MIKA_pasciix = newInt(26); /* 英文字 A～Zに対応するキーのx座標 */
let MIKA_pasciiy = newInt(26); /* 英文字 A～Zに対応するキーのy座標 */
let MIKA_pnumberx = newInt(10); /* 数字 0～1に対応するキーのx座標 */
let MIKA_pnumbery = newInt(10); /* 数字 0～1に対応するキーのy座標 */
let MIKA_mes0 = "●●●  美佳のタイプトレーナー  ●●●";
let MIKA_mes0a = "●●●  美佳のタイプトレーナー ポジション練習　●●●";
let MIKA_mes0b = "●●●  美佳のタイプトレーナー ランダム練習　●●●";
let MIKA_mes0c = "●●●  美佳のタイプトレーナー 英単語練習　●●●";
let MIKA_mes0d = "●●●  美佳のタイプトレーナー ローマ字練習　●●●";
let MIKA_mesta = "●●●  美佳のタイプトレーナー %s　●●●";
let MIKA_mestb = "●● 美佳のタイプトレーナー ポジション練習 %s ●●";
let MIKA_mestc = "●● 美佳のタイプトレーナー ランダム練習 %s ●●";
let MIKA_mesi1 = "もう一度練習するときはリターンキーまたは、Enterキーを押してください";
let MIKA_mesi2 = "メニューに戻るときはESCキーを押してください";
let MIKA_mesi3 = "おめでとう、記録を更新しました";
let MIKA_abort_mes = "ESCキーを押すと中断します";
let MIKA_return_mes = "ESCキーを押すとメニューに戻ります";
let MIKA_key_type_mes = "のキーを打ちましょうね．．";
let MIKA_keymes1 = "ｽﾍﾟｰｽを押すとｷｰｶﾞｲﾄﾞを消去します";
let MIKA_keymes2 = "ｽﾍﾟｰｽを押すとｷｰｶﾞｲﾄﾞを表示します";
let MIKA_keymes3 = "この次は、スペースキーを押してキーガイドの表示を消して練習してみましょうね";
let MIKA_keymes4 = "この次は、スペースキーを押してキーガイドを表示して練習してみましょうね";
let MIKA_mest2 = "練習項目           タイプ速度　文字／分       達成日       累積練習時間";
let MIKA_menu_mes_s =  [ /* 初期メニュー メニュー項目 */
  "ポジション練習",
  "ランダム練習",
  "英単語練習",
  "ローマ字練習",
  "成績",
  "終了",
];
let MIKA_menu_cord_s =   [ /* 初期 メニュー項目表示位置 x座標 y座標 */
  [3*14,20*8],
  [5*14,20*8],
  [7*14,20*8],
  [9*14,20*8],
  [11*14,20*8],
  [13*14,20*8]
];
let MIKA_menu_s_sel_flag =  [ /* 初期メニュー メニュー項目選択フラグ */
  0,0,0,0,0,0];
let MIKA_menu_s_function =  [ /* 初期メニュー 機能番号 */
  21,22,23,24,29,9999];
let MIKA_menu_mes =  [ /* ポジション練習 ランダム練習 メニュー項目 */
  "ホームポジション",
  "上一段",
  "ホームポジション＋上一段",
  "下一段",
  "ホームポジション＋下一段",
  "ホームポジション＋上一段＋下一段",
  "数字",
  "全段",
  "メニューに戻る"
];
let MIKA_menu_cord =   [ /* ポジション練習 ランダム練習 英単語練習 ローマ字練習 メニュー項目表示位置 x座標 y座標 */
  [2*14,20*8],
  [4*14,20*8],
  [6*14,20*8],
  [8*14,20*8],
  [10*14,20*8],
  [12*14,20*8],
  [14*14,20*8],
  [16*14,20*8],
  [18*14,20*8]
];
let MIKA_position_menu_function =  [ /* ポジション練習 機能番号 */
  401,402,403,404,405,406,407,408,9001];
let MIKA_position_sel_flag =  [ /* ポジション練習 メニュー項目選択フラグ */
  0,0,0,0,0,0,0,0,0];
let MIKA_random_menu_function =  [ /* ランダム練習 機能番号 */
  501,502,503,504,505,506,507,508,9001];
let MIKA_random_sel_flag =  [ /* ランダム練習 メニュー項目選択フラグ */
  0,0,0,0,0,0,0,0,0];
let MIKA_menu_mes_w =  [ /* 英単語練習 メニュー項目 */
  "基本英単語練習",
  "ＭＳＤＯＳコマンド練習",
  "Ｃ言語練習",
  "パスカル練習",
  "フォートラン練習",
  "ＢＡＳＩＣ練習",
  ICHIGOJAM ? MIKA_IchigoJam.NAME : MIKA_Asm8086.NAME,
  "メニューに戻る"
];
let MIKA_word_menu_function =  [ /* 英単語練習 機能番号 */
  601,602,603,604,605,606,607,9001];
let MIKA_word_sel_flag =  [ /* 英単語練習 メニュー項目選択フラグ */
  0,0,0,0,0,0,0,0];
let MIKA_menu_mes_r =  [ /* ローマ字練習 メニュー項目 */
  "ローマ字ランダム練習",
  "ローマ字単語練習",
  "メニューに戻る"
];
let MIKA_romaji_menu_function = [ /* ローマ字練習 機能番号 */
  701,702,9001];
let MIKA_romaji_sel_flag =  [ /* ローマ字練習 メニュー項目選択フラグ */
  0,0,0];	
let MIKA_fngpoint =   [ /* 指表示位置 x 座標 y 座標 表示幅 */
  [21*16+8,10*8+6,3*8+2], /* 左手小指 */
  [20*16+2,15*8,4*8], /* 左手薬指 */
  [20*16-3,20*8,4*8], /* 左手中指 */
  [20*16+2,25*8,4*8], /* 左手人指し指 */
  [22*16,31*8-4,5*8], /* 左手親指 */
  [22*16,39*8+4,5*8], /* 右手親指 */
  [20*16+2,46*8,4*8], /* 右手人指し指 */
  [20*16-3,51*8,4*8], /* 右手中指 */
  [20*16+2,56*8,4*8], /* 右手薬指 */
  [21*16+8,61*8,3*8+2] /* 右手小指 */
];
let MIKA_t_line = 7; /* ランダム練習 英単語練習 ローマ字練習 練習テキスト表示開始行位置 */
let MIKA_chat_t = newChar(10, 40); /* 練習テキスト文字 横40文字 縦10行 */
let MIKA_chat_yomi_t = newInt(10 * 40); /* 練習テキストのひらがなに対応した文字番号 */
let MIKA_cline_x; /* ランダム練習 英単語練習 ローマ字練習 練習テキスト行数 最小 = 3 最大  = 10 */
let MIKA_cline_c; /* ランダム練習 英単語練習 ローマ字練習 練習テキスト 文字数 */
let MIKA_utikiri_flag;	/* ランダム練習 英単語練習 ローマ字練習 練習テキスト打ち切りフラグ  = 1 全練習テキスト打ち切りによる終了  = 0 60秒タイマーによる終了 */
let MIKA_utikiri_flag2;	/* 前回速度表示時の打ち切りフラグの値 */
//	MIKA_exec_func_no = 29;
//	MIKA_exec_func_no = 21;
let MIKA_exec_func_no = 0; /* メニューの機能番号 */
let MIKA_type_kind_no = 0; /* 練習項目番号 */
let MIKA_menu_function_table; /* メニューの機能番号テーブルアドレス */
let MIKA_sel_flag; /* 前回選択メニュー項目選択フラグアドレス */
let MIKA_win_size; /* ウィンドーサイズ */
let MIKA_insets; /* ウィンドー表示領域 */

const MIKA_w_seq = [
  MIKA_oubun,
  MIKA_memsdos,
  MIKA_mec,
  MIKA_mepascal,
  MIKA_mefortran,
  MIKA_mebasic,
  ICHIGOJAM ? MIKA_IchigoJam.SEQ : MIKA_Asm8086.SEQ
]; /* 英単語練習 練習単語テーブル */

function charlength(a) /* 文字が半角文字か全角文字かの判定を行う リターン値 半角=1 全角 =2 */
{
  let i;
//		System.out.printf("a=%1c code=%d\n",a,(int)a);
  if (a < 255) i = 1; /* 半角英数の場合 */
  // 半角カナひとまず非対応
  //else if (0xff61<=a&&a<=0xff9f) i=1; /* 半角カナ文字の場合 */
  else i = 2; /* 半角英数 半角カナ文字以外の場合 */
  return i;
}
function stringlength(a) /* 文字列長を半角文字=1 全角文字 =2 で計算する */
{
  let i,ii,length;
  length=a.length; /* 文字列長取得 */
  ii=0;
  for(i=0;i<length;i++)
  {
    ii=ii+charlength(a.charAt(i)); /* i番目の文字長を加算 */
  }
  return ii;
}	
function cslputzscale(g, x1, y1, a, scale) /* 半角英数を全角文字に変換して指定の倍率で表示 */
{
  if (typeof a != "string") {
    a = String.fromCharCode(a);
  }
  const aa = ZenkakuAlpha.toZen(a);
  cslputscale(g, x1, y1, String.valueOf(aa), scale); /* 文字列を指定で倍率で仮想座標で表示 */
}
function cslput(g, x, y, mes) /* 文字列を仮想座標で表示 */
{
  cslputscale(g, x, y, mes, 1.0); /* 文字列を等倍の倍率で仮想座標で表示 */
}
function cslmencenter(g,x, mes) /* 中央にメッセージ文字列を表示 */
// x 文字列表示仮想座標
{
  let y;
  let k;
  let kk;
  if(MIKA_max_y_flag==0) kk=80; /* 横幅半角80文字モード */
  else kk=64; /* 横幅半角64文字モード */
  k=stringlength(mes); /* 文字列長取得  半角文字は長さ=1 全角文字は長さ=2で計算*/
//		System.out.printf("mes=%s lentgh=%s",mes,k);
  y=((kk-k)*MIKA_width_y)/2; /* 表示開始位置計算 */
  cslput(g,x,y,mes); /* 文字列表示 */
}
function cslclr(g) /* 画面クリア */
{
  let x,y;
  x=MIKA_win_size.height; /* 画面最大高さ取得 */
  y=MIKA_win_size.width; /* 画面最大幅取得 */
  cslcolor(g,MIKA_bk_color); /* 表示色に背景色を設定 */
  g.fillRect(0,0,y,x); /* 背景色で画面クリア */
}
function cslcolor(g, color) /* 表示色を設定 */
{
  g.setColor(color);
}
function inttangotable(a, speed,flag) /* 英単語練習 ローマ字単語練習の練習テキスト作成共通処理 */
/* a 単語テーブル speed 最高入力速度 flag =0 英単語練習 =1 ローマ字単語練習 */
{
  const size_yoko = 40; /* 横方向文字数 整数 */
  let space_flag = 0;
  const rsize_yoko = 40.0; /* 横方向の文字数 実数 */
  const rand = new Random(); /* 乱数処理作成 */
  MIKA_cline_x = Math.floor(Math.ceil((speed + rsize_yoko) / rsize_yoko)); /* 最大練習行数算出 */
  if (MIKA_cline_x > 10) MIKA_cline_x = 10; /*最大練習行数は 10行 */
  if (MIKA_cline_x < 3) MIKA_cline_x = 3; /* 最小練習行数は 3行 */
  MIKA_cline_c = MIKA_cline_x * size_yoko; /* 最大文字数算出 */
  const a_length = a.length; /* 単語テーブルの単語数を取得 */
  let kk = 0; /* 練習文字数カウンター ゼロ設定 */
  let i = 0; /* 横方向の文字位置カウンターをゼロ設定 */
  let j = 0; /* 練習行数をゼロ設定 */
  for (let l = 0;l < 1000; l++)
  {
    const ii = rand.nextInt(a_length); /* ランダムに単語テーブル長以下の整数を取得 */
    const b = a[ii]; /* 単語アドレス取得 */
    const b_length = b.length; /* 単語長さを取得 */
    if (kk + b_length > MIKA_cline_c) break; /* 残りエリアが単語長より短い場合は処理を中断 */
    space_flag = 0; /* スペース設定フラグをゼロクリア */
    for (let k = 0; k < b_length; k++) /* 単語文字数分の練習文字を設定 */
    {
      const c = b.charAt(k); /* 単語のk番目の文字を取得 */
      MIKA_chat_t[j][i] = c; /* 練習文字を設定 */
      if (flag == 1) /* ローマ字単語設定の場合 */
      {
        MIKA_chat_yomi_t[kk] = kfound(c); /* ひらがな文字の読みを設定 */
      }
      kk++; /* 練習文字数を一加算 */
      if (kk >= MIKA_cline_c) break; /* 残りエリアがない時は処理を中断 */
      i++;
      if (i >= size_yoko) /* 行の終わりまで設定した場合 */
      {
        /* 練習文字アドレスを更新 */
        i = 0; /* 横方向文字位置を行の先頭に設定 */
        j++; /* 練習行数を一加算 */
      } 
    }
    if (kk >= MIKA_cline_c) break; /* 残りエリアがない時は処理を中断 */
    MIKA_chat_t[j][i] = ' '; /* スペース文字を設定 */
    if (flag == 1) /* ローマ字単語設定の場合 */
    {
      MIKA_chat_yomi_t[kk] = 0; /* スペース文字の読みをゼロに設定 */
    }
    space_flag = 1; /* スペース設定フラグを一に設定 */
    kk++; /* 練習文字数を一加算 */
    if (kk >= MIKA_cline_c) break; /* 残りエリアがない時は処理を中断 */
    i++; /* 一行内の横方向の文字位置を一加算 */
    if (i >= size_yoko) /* 行の終わりまで設定した場合 */
    {    			
      /* 練習文字アドレスを更新 */
      i = 0; /* 横方向文字位置を行の先頭に設定 */
      j++; /* 練習行数を一加算 */
    }
  }
  MIKA_cline_c = kk; /* 練習文字数を設定 */
  if (space_flag == 1)  MIKA_cline_c--; /* 最終設定文字がスペースの時は練習文字数を一減算 */
//		System.out.printf("練習文字数 =%d\n",MIKA_cline_c);
}

function intwordtable(a, speed) /* 英単語練習の練習テキスト作成 */
{
    inttangotable(a, speed, 0); /* 英単語練習 ローマ字単語練習のテキスト作成共通処理呼び出し */
}
function cslfonthight(scale) /* 指定倍率で全角文字の表示エリア高さを取得 */
{
    const font_size = Math.floor(MIKA_width_x * scale); /* 表示エリア高さを仮想座標で計算 */
    const font_hight = xcord(font_size) - xcord(0);  /* 表示エリア高さを実座標に変換 */
    return font_hight;
}
function cslfontwidth(scale) /* 指定倍率で全角文字の表示エリア幅を取得 */
{
    const font_size = Math.floor(MIKA_width_y * 2 * scale); /* 表示エリア幅を仮想座標で計算 */
    const font_width = ycord(font_size) - ycord(0); /* 表示エリア幅を実座標に変換 */
    return font_width;
}
function cslfontsize(scale) /* 指定倍率でフォントサイズを取得 */
{
  const font_hight = cslfonthight(scale); /* 指定倍率で表示エリア高さを取得 */
  const font_width = cslfontwidth(scale); /* 指定倍率で表示エリア幅を取得 */
  const font_size = Math.min(font_hight, font_width); /* 表示エリア高さと表示エリア幅の小さい方の値をフォントサイズに指定 */
  return font_size;
}
function xcord(x1){ /* 仮想x座標を 実x座標に変換 */
  let max_x_cord1;
  if (MIKA_max_x_flag == 0) /* 縦25行モードの設定 */
  {
    max_x_cord1 = 25 * 16;
  }
  else /* 縦20行モードの設定 */
  {
    max_x_cord1 = 20 * 16;
  }
  const x = MIKA_win_size.height - MIKA_insets.top - MIKA_insets.bottom; /* 有効 x表示高さを計算 */
  let xx = x * x1 / max_x_cord1; /* 仮想座標を実座標に変換 */
  xx = xx + MIKA_insets.top; /* 表示位置をウィンドー枠内に補正 */ 
  return xx;
}
function ycord(y1) /* 仮想y座標を 実y座標に変換 */
{
  let max_y_cord1;
  if (MIKA_max_y_flag == 0) /* 一行横 80カラムモードの設定 */
  {
    max_y_cord1 = 80 * 8;
  }
  else /* 一行横 64カラムモードの設定 */
  {
    max_y_cord1 = 64 * 8;
  }
  const y = MIKA_win_size.width - MIKA_insets.left - MIKA_insets.right; /* 有効 y表示幅を計算 */
  let yy = (y * y1) / (max_y_cord1); /* 仮想座標を実座標に変換 */
  yy = yy + MIKA_insets.left; /* 表示位置をウィンドー枠内に補正 */
  return yy;
}
function xxcord(x) /* ランダム練習 英単語練習 ローマ字練習で 練習文字の表示x仮想座標を計算 */
{
  let xx;
  xx=	MIKA_t_line*16+x*20; /* MIKA_t_lineを開始行にして、ドット高さ20ドットで表示 */
  return xx;
}
function yycord(y) /* ランダム練習 英単語練習 ローマ字練習で 練習文字の表示y仮想座標を計算 */
{
  let yy;
  yy=y*16; /*  横 16ドット間隔で表示 */
  return yy;
}
function cslputscale(g, x1, y1, a, scale) /* 仮想座標から実座標に変換して文字列を指定の倍率で表示 */
{
  const font_size = cslfontsize(scale); /* 文字フォントサイズ取得 */
  const ffont_size = Math.floor(font_size / 1.33); /* フォントサイズ補正 */
  const font_width = cslfontwidth(1.0); /* 文字表示エリア幅取得 */
  const font_hight = cslfonthight(1.0); /* 文字表示エリア高さ取得 */
  const fg = new Font("Monospaced", Font.PLAIN, font_size); /* 文字フォント指定 */
  g.setFont(fg); /* 文字フォント設定 */
  const ii = a.length; /* 表示文字列長取得 */
  let iii = 0;
  const xx1 = xcord(x1+MIKA_width_x); /* 表示位置x座標を仮想座標から実座標に変換 */
  for (let i = 0; i < ii; i++) {
    const yy1 = ycord(y1 + MIKA_width_y * iii); /* 表示位置 y座標を仮想座標から実座標に変換 */
    const aa = a.charAt(i); /* 文字列からi番目の文字を取り出し */
    g.drawString(String.valueOf(aa), yy1 + (font_width - font_size) / 2, xx1 + (ffont_size - font_hight) / 2); /* 表示位置の中央に文字を表示 */
//			if(aa=='ａ') System.out.printf("font_size=%d,font_width%d font hight%d\n",font_size,font_width,font_hight);
//			System.out.printf("x=%d y=%d %s %x \n",yy1,xx1,String.valueOf(aa),(int)aa);
  
    iii = iii + charlength(aa); /* 表示文字位置更新 半角文字は y座標を 1 加算 全角文字は 2加算 */
  }
}
function disptitle(g, mes, submes) /* 練習項目を画面上部に表示 */
// mes 練習種別メッセージ
// submes 練習項目メッセージ
{
  const mes0 = String.format(mes, submes); /* 表示メッセージを作成 */
  cslcolor(g, MIKA_magenta); /* 表示色をマゼンタに設定 */
  cslmencenter(g, 1, mes0); /* 画面上部中央にメッセージを表示 */
//		System.out.printf(mes0);
}
function dispabortmessage(g,flag, i, j) /* 「ESCキーを押すと中断します」のメッセージを表示 */
// flag=0 表示 flag=1 消去 
// i 表示位置縦行番号
// j 表示位置横列番号
	{
		let color1;
		let ii,jj;
		if(flag==0) cslcolor(g,MIKA_cyan);  /* フラグが=0の時は表示色をシアンに設定 */
		else cslcolor(g,MIKA_bk_color); /* フラグが=1の時は表示を消去 */
		ii=i*16;
		jj=j*8;
		if(jj<=0) jj=1;
		cslput(g,ii,jj,MIKA_abort_mes);	/* 「ESCキーを押すと中断します」のメッセージを表示 */
	}
function dispabortmes2(g, flag) /* ローマ字練習 英単語練習で 「ESCキーを押すと中断します」のメッセージを表示 */
// flag=0 表示 flag=1 消去 
	{
		dispabortmessage(g,flag,23,20);
	}

function dispctable(g) /* ランダム練習 英単語練習 ローマ字練習 練習テキスト表示 */
{
  console.log("DIS!!", MIKA_cline_x)
  let a;
  let i,j,k;
  let ii,jj;
  let kazu_yoko=40; /* 横文字数 */
  k=0;
  for(j=0;j<MIKA_cline_x;j++) /* 練習行数まで表示 */
  {
    for(i=0;i<kazu_yoko;i++) /* 横一行40文字表示 */
    {
      if(k>=MIKA_cline_c) break; /* 練習文字数まで表示 */
      a=MIKA_chat_t[j][i]; /* 練習文字を取得 */
      if(MIKA_err_char_flag==1&&j==MIKA_c_p2&&i==MIKA_c_p1) /* 練習文字がエラー文字の場合 */
      {
        cslcolor(g,Color.red); /* 表示色を赤に設定 */
        dispbkchar(g,j,i); /* 文字の背景を赤色で表示 */
      }
      cslcolor(g,Color.black); /* 表示色を黒に設定 */
      jj=xxcord(j); /* 練習文字の縦位置を仮想座標に変換 */
      ii=yycord(i); /* 練習文字の横位置を仮想座標に変換 */
      cslputzscale(g,jj,ii,a,1.0); /* 指定の位置に文字を表示 */
      if(j<MIKA_c_p2||(j==MIKA_c_p2&&i<MIKA_c_p1)) /* 入力済の文字には下線を引く */
      {
        cslputu(g,jj,ii,"aa",1,MIKA_color_text_under_line);	
      }
      k++; /* 表示文字数インクリメント */
    }
  }
}
function dispspeedrate(g, flag) /* ランダム練習 英単語練習 入力速度表示 */
// flag=0 表示 flag=1 消去
	{
	  let a;
		let offset;
		if(flag==0)
		{
			cslcolor(g,MIKA_blue); /* flagが=ゼロの時は青色で表示 */
			offset=0;
			a=String.format("入力速度%6.1f文字／分",MIKA_type_speed); /* 入力速度を文字列に変換 */
		}
		else
		{
			cslcolor(g,MIKA_bk_color);; /* flagが=1の場合は表示消去 */
			offset=8;
			a=String.format("%6.1f",MIKA_type_speed); /* 入力速度を文字列に変換 */
		}
		cslput(g,5*16,(24+offset)*8,a); /* 入力速度を表示 */
	}
function ftypespeed(count, start_time, end_time) /* 一分間あたりのタイプ速度を計算 */
// count 文字数
// start_time 開始時間 ミリ秒
// end_time 終了時間 ミリ秒
	{
		let speed_rate;
		let r_count;
		r_count=count;
		if(end_time==start_time) speed_rate=0.0; /* 開始時間と終了時間が一致する場合はタイプ速度をゼロに指定 */
		else
		{
			speed_rate=1000.0*60.0*r_count/(end_time-start_time); /* 一分間あたりのタイプ速度を計算 */
		}
		return speed_rate;
	}
function mesdisptime(u_flag, flag, type_speed_time) /* 練習経過時間文字列作成 */
// u_flag=0 練習経過時間を2桁の整数で表示 flag=1 練習経過時間を小数点以下二桁まで表示
{
  let a;
  if(u_flag==0) /* 打ち切りフラグがゼロの場合 */
  {
    if(flag==0)
    {
      a=String.format("経過時間%2.0f秒",type_speed_time); /* 練習経過時間を整数で表示 */
    }
    else
    {
      if(MIKA_utikiri_flag==1) a=String.format("%2.0f秒",type_speed_time); /* 練習経過時間を小数点以下二桁まで表示 */
      else
      a=String.format("%2.0f",type_speed_time); /* 練習経過時間を整数で表示 */
    }
  }
  else /* 打ち切りフラグが1の場合 */
  {
    if(flag==0)
    {
      a=String.format("経過時間%5.2f秒",type_speed_time); /* 練習経過時間を小数点以下二桁まで表示 */
    }
    else
    {
      if(MIKA_utikiri_flag==1) a=String.format("%5.2f秒",type_speed_time); /* 練習経過時間を小数点以下二桁まで表示 */
      else
      a=String.format("%5.2f",type_speed_time); /* 練習経過時間を小数点以下二桁まで表示 */

    }
  }
  return a;
}
function disptime(g, flag) /* ランダム練習 英単語練習 ローマ字練習にて練習経過時間を表示 */
// flag=0 表示 flag=1 消去 
{
  let a;
  let offset;
  if(flag==0) /* 緑色で練習経過時間を表示 */
  {
    cslcolor(g,MIKA_blue); /* 表示色を青に設定 */
    a=mesdisptime(MIKA_utikiri_flag,flag,MIKA_type_speed_time); /* 練習経過時間文字列作成 */
    offset=0;
  }
  else /* 前回の練習経過時間表示を消去 */
  {
    cslcolor(g,MIKA_bk_color); /* 表示色を背景色に設定 */
    a=mesdisptime(MIKA_utikiri_flag2,flag,MIKA_type_speed_time); /* 練習経過時間文字列作成 */
    offset=8;
  }
  cslput(g,5*16,(4+offset)*8,a); /* 文字列の表示あるいは消去 */
}
function procdispspeed(g) /* ランダム練習 英単語練習 入力速度表示 */
{
    disptime(g,1); /* 前回練習経過時間表示を消去 */
    dispspeedrate(g,1); /* 前回 入力速度表示を消去 */
    MIKA_type_speed_time=MIKA_ttype_speed_time; /* 練習経過時間を更新 */
    MIKA_type_speed=ftypespeed(MIKA_type_count,MIKA_type_start_time,MIKA_type_end_time); /* 入力速度を計算 */
    disptime(g,0); /* 今回練習経過時間を表示 */
    dispspeedrate(g,0); /* 今回入力速度を表示 */
}

function disptrain(g, mest) /* ランダム練習 英単語練習 実行画面の表示 */
{
  let a,b;
  cslclr(g); /* 画面クリア */
  disptitle(g,mest, MIKA_type_kind_mes); /* 練習項目を表示 */
  cslcolor(g, MIKA_green); /* 表示色を緑に設定 */
  cslput(g, 4 * 16, 4 * 8, "制限時間60秒"); /* 制限時間を表示 */
  if (MIKA_p_count[MIKA_type_kind_no] != 0) /* 練習回数がゼロでない場合 */
  {
    dispkaisu2(g, 0); /* 練習回数を表示 */
  }
  if (MIKA_type_speed != 0.0) /* 入力速度がゼロでない場合 */
  {
    dispspeedrate(g, 0); /* 入力速度を表示 */
  }
  if (MIKA_type_speed_time != 0.0) /* 経過秒がゼロでない場合 */
  {
    disptime(g, 0); /* 経過秒表示 */
  }
  if (MIKA_type_err_count!=0) /* エラー回数がゼロで無い場合 */
  {
    disperror1(g,0); /* エラー回数表示 */
  }
  if(MIKA_type_speed_record[MIKA_type_kind_no]!=0.0) /* 最高入力速度がゼロでない場合 */
  {
    dispmaxspeedrecord(g,3,20,3,49); /* 最高入力速度と達成日時を表示 */
  }
  dispctable(g); /* 練習文字を表示 */
  if(MIKA_practice_end_flag==1) /* 練習終了時 */
  {
    if(MIKA_type_syuryou_flag==2) /* 記録更新時 */
    {
      dispupmes(g); /* 記録を更新しましたの表示を行う */
    }
    dispretrymessage(g,0); /* リトライメッセージ表示 */
  }
  else
  {
    dispabortmes2(g,0); /* エスケープキーを押すと中断しますのメッセージを表示 */
  }
}
function dispseiseki(g) /* 成績表示 */
{
  let i;
  let time_i;
  let a,aa,b;
  cslclr(g); /* 画面クリア */
  a=tconv(MIKA_rt_t); /* 前回までの合計練習時間を文字列に変換 */
  aa=String.format("前回までの練習時間　%s",a); /* 前回までの合計練習時間のメッセージ作成 */
  cslcolor(g,MIKA_green); /* 表示色を緑色に設定 */
  cslput(g,1,1,aa); /* 前回までの合計練習時間を表示 */
  cslcolor(g,MIKA_blue); /* 表示色を青色に設定 */
  cslput(g,1,43*8,MIKA_return_mes); /* エスケープキーを押すとメニューに戻りますのメッセージを表示 */
  MIKA_lt_t=System.currentTimeMillis(); /* 現在時刻をミリ秒で取得 */
  time_i=timeinterval(MIKA_st_t,MIKA_lt_t); /* 今回練習時間を秒で計算 */
  a=tconv(time_i); /* 今回練習時間を文字列に変換 */
  aa=String.format("今回の練習時間　　　%s",a); /* 今回練習時間のメッセージを作成 */
  cslcolor(g,MIKA_green); /* 表示色を緑色に設定 */
  cslput(g,16,1,aa); /* 今回練習時間を表示 */
  cslcolor(g,MIKA_blue); /* 表示色を青色に設定 */
  cslput(g,3*16,1,MIKA_mest2); /* 表示項目の表題を表示 */
  cslcolor(g,MIKA_orange); /* 表示色をオレンジに設定 */
  b=tconv(MIKA_p_time); /* ポジション練習の累積練習時間を文字列に変換 */
  cslput(g,4*16,54*8,b); /* ポジション練習の累積練習時間を表示 */
  cslput(g,4*16,1,MIKA_menu_mes_s[0]); /* 練習項目「ポジション練習」を表示 */
  ppseiseki(g,6,8,MIKA_menu_mes,MIKA_r_speed,MIKA_r_date,MIKA_r_time); /* ランダム練習の成績を表示 */
  ppseiseki(g,15,7,MIKA_menu_mes_w,MIKA_w_speed,MIKA_w_date,MIKA_w_time); /* 英単語練習の成績を表示 */
  ppseiseki(g,23,2,MIKA_menu_mes_r,MIKA_a_speed,MIKA_a_date,MIKA_a_time); /* ローマ字練習の成績を表示 */
}
function dispstart(g) /* 著作権表示 */
{
  MIKA_max_x_flag = 1; /* 縦 20行モードに設定 */
  MIKA_max_y_flag = 1;/* 横 64カラムモードに設定 */
  const title_bar="●●●●●●●●●●●●●●●●●●●●●●●●●";
  cslclr(g); /* 画面クリア */
  cslcolor(g, MIKA_magenta); /* 表示色をマゼンタに設定 */
  cslput(g, 3 * 16, 7 * 8, title_bar); /* 表示枠 上端を表示 */
  for (let i = 4; i < 15; i++)
  {
    cslput(g,i*16,7*8,"●"); /* 表示枠 左端を表示 */
    cslput(g,i*16,55*8,"●"); /* 表示枠 右端を表示 */
  }	
  cslput(g,15*16,7*8,title_bar); /* 表示枠 下端を表示 */
  cslcolor(g,MIKA_blue); /* 表示色を青に設定 */
  cslmencenter(g,5*16+8,"美佳のタイプトレーナー");
  cslcolor(g,MIKA_cyan); /* 表示色をシアンに設定 */
  cslmencenter(g,7*16+8,"ＭＩＫＡＴＹＰＥ Ｖer２.０６.０１");
  cslcolor(g,MIKA_orange); /* 表示色をオレンジに設定 */
  cslmencenter(g,9*16+6,"＜＜より高速なタイピングのために＞＞");
  cslmencenter(g,11*16+4,"めざせ一分間２００文字入力");
  cslcolor(g,MIKA_cyan); /* 表示色をシアンに設定 */
  cslmencenter(g,14*16-8,"Copy right 1991/10/12  今村 二朗");
  cslput(g,17*16,24*8,"キーをどれか押すとメニューを表示します");
  MIKA_max_x_flag = 0; /* 縦 25行モードに戻す */
  MIKA_max_y_flag = 0; /* 横 80カラムモードに戻す */
}
function dispkaisumes(g, flag, i, j) /* 練習回数表示 */
// flag=0 表示 flag=1 消去 
// i 表示位置縦行番号
// j 表示位置横列番号
	{
		let type_mes;
		let count;
		if(MIKA_p_count==null) return; /* 練習回数配列アドレスが空の時はリターン */
		count=MIKA_p_count[MIKA_type_kind_no]; /* 練習項目に対応する練習回数取り出し */
//		System.out.printf("count=%d  MIKA_type_kind_no=%d\n",count,MIKA_type_kind_no);
		if(count==0) return; /* 練習回数がゼロの時はリターン */
		if(flag==0) cslcolor(g,MIKA_green); /* フラグが=0の時は表示色を緑色に設定 */
		else cslcolor(g,MIKA_bk_color); /* フラグが=1の時は表示を消去 */
		type_mes=String.format("練習回数%4d回",count); /* 練習回数メッセージ作成 */
		cslput(g,i*16,j*8,type_mes); /* 練習回数メッセージ表示 */
	}
	function dispkaisu(g, flag) /* ポジション練習 練習回数表示 */
// flag=0 表示 flag=1 消去 
	{
		dispkaisumes(g,flag,1,64);
	}
function dispkaisu2(g, flag) /* ランダム練習 英単語練習 ローマ字練習 練習回数表示 */
// flag=0 表示 flag=1 消去 
	{
		dispkaisumes(g,flag,1,31);
	}
function proctrainexit(g)/* ランダム練習 英単語練習の練習終了時の表示更新 */
{
    dispkaisu2(g,1); /* 前回練習回数の表示を消去 */
    MIKA_p_count[MIKA_type_kind_no]++; /* 練習回数を加算 */
    dispkaisu2(g,0); /* 今回練習回数を表示 */
    dispabortmes2(g,1); /* エスケープキーを押すと中断しますのメッセージを消去 */
    dispretrymessage(g,0); /* リトライメッセージを表示 */
}
function prockiroku(g) /* ランダム練習 英単語練習 ローマ字練習にてタイプ入力速度が前回までの最高速度を更新したかの比較を行う */
{
  if(MIKA_type_speed_record[MIKA_type_kind_no]<MIKA_type_speed) /* 前回までの最高入力速度を更新した場合 */
  {
    if(MIKA_type_speed_record[MIKA_type_kind_no]>0.0) /* 前回の最高入力速度がゼロより大きい場合 */
    {
      dispupmes(g); /* 練習記録を更新しましたのメッセージを表示 */
      MIKA_type_syuryou_flag=2; /* 練習記録更新フラグを2にセット */
    }
    else /* 前回の最高入力速度がゼロの場合 */
    {
      MIKA_type_syuryou_flag = 1; /* 練習記録更新フラグを1にセット */
    }
    //MIKA_type_kiroku_date = new Date(); /* 最高記録達成日の日時を取得 */
    //SimpleDateFormat MIKA_date = new SimpleDateFormat("yy/MM/dd"); /* 最高記録達成日時の取り出しフォーマットを作成 */
    //MIKA_type_date = MIKA_date.format(MIKA_type_kiroku_date); /* 最高記録達成日時文字列を指定フォーマットに従って作成 */
//			System.out.printf("日付=%s\n",MIKA_type_date);
    //MIKA_file_error_hayasa = whayasa(); /* 最高速度記録ファイル書き込み */
  }
}
function dispretrymessage(g, flag) /* リトライメッセージ表示 flag=0 表示を行う flag=1 表示を消去 */
{
  if(flag==0) cslcolor(g,MIKA_cyan); /* 表示色をシアンに設定 */
  else cslcolor(g,MIKA_bk_color); /* 表示色を背景色に設定 */
  cslput(g,22*16,10*8,MIKA_mesi1); /* 「もう一度練習するときはリターンキーまたは、Enterキーを押してください」のメッセージを表示 */
  cslput(g,23*16,10*8,MIKA_mesi2); /* 「この次は、スペースキーを押してキーガイドを表示して練習してみましょうね」のメッセージを表示 */
}

function dispmen(g) /* メニュー及び練習画面表示 */
{
  if (MIKA_exec_func_no==0) dispstart(g); /* 著作権表示 */
  else if (MIKA_exec_func_no==1) menexe(g,MIKA_menu_mes_s,MIKA_menu_cord_s,MIKA_menu_s_function,MIKA_menu_s_sel_flag,MIKA_mes0); /* 初期メニュー表示 */
  else if (MIKA_exec_func_no==21) menexe(g,MIKA_menu_mes,MIKA_menu_cord,MIKA_position_menu_function,MIKA_position_sel_flag,MIKA_mes0a); /* ポジション練習メニュー表示 */
  else if (MIKA_exec_func_no==22) menexe(g,MIKA_menu_mes,MIKA_menu_cord,MIKA_random_menu_function,MIKA_random_sel_flag,MIKA_mes0b); /* ランダム練習メニュー表示 */
  else if (MIKA_exec_func_no==23) menexe(g,MIKA_menu_mes_w,MIKA_menu_cord,MIKA_word_menu_function,MIKA_word_sel_flag,MIKA_mes0c); /* 英単語練習メニュー表示 */
  else if (MIKA_exec_func_no==24) menexe(g,MIKA_menu_mes_r,MIKA_menu_cord,MIKA_romaji_menu_function,MIKA_romaji_sel_flag,MIKA_mes0d);	 /* ローマ字練習メニュー表示 */
  else if (MIKA_exec_func_no==29) dispseiseki(g); /* 成績表示 */
  else if (MIKA_exec_func_no>400&&MIKA_exec_func_no<500) dispptrain(g,MIKA_mestb); /* ポジション練習の各項目の実行画面表示 */
  else if (MIKA_exec_func_no>500&&MIKA_exec_func_no<600) disptrain(g,MIKA_mestc); /* ランダム練習の各項目の実行画面表示 */
  else if (MIKA_exec_func_no>600&&MIKA_exec_func_no<700) disptrain(g,MIKA_mesta); /* 英単語練習の各項目の実行画面表示 */
  else if (MIKA_exec_func_no>700&&MIKA_exec_func_no<800) dispatrain(g,MIKA_mesta); /* ローマ字練習の各項目の実行画面表示 */
}

function prepflags(flag) /* ランダム練習 英単語練習 ローマ字練習の開始時のフラグクリア処理 */
{
  MIKA_c_p1=0; /* 練習文字 横座標 クリア */
  MIKA_c_p2=0; /* 練習文字 縦座標 クリア */
  MIKA_type_count=0; /* 入力文字数カウンター クリア */
  MIKA_type_err_count=0; /* エラー入力文字数カウンター クリア */
  MIKA_err_char_flag=0; /* エラー入力フラグ クリア */
  MIKA_type_speed=0.0; /* 文字入力速度 クリア */
  MIKA_type_speed2=0.0; /* ローマ字入力時の打鍵速度 クリア */
  MIKA_type_speed_time=0.0; /* 前回 練習経過時間 クリア */
  MIKA_ttype_speed_time=0.0; /* 今回 練習経過時間 クリア */
  MIKA_w_count=0; /* ひらがな入力文字数カウンター クリア */
  MIKA_r_count=0; /* ひらがな一文字内のローマ字表記文字カウンター クリア */
  MIKA_time_start_flag=0; /* 時間計測開始フラグ クリア */
  MIKA_utikiri_flag=0; /* 練習テキスト打ち切りフラグ クリア */
  MIKA_utikiri_flag2=0; /* 前回速度表示時の打ち切りフラグ クリア */
  MIKA_type_syuryou_flag=0; /* 練習終了時の記録更新フラグ クリア */
}
function preptrain(func_no) /* 練習の前処理 */
{
  MIKA_type_kind_no = func_no - 601; /* 練習項目番号を取得 */
  MIKA_type_speed_record = MIKA_w_speed; /* 最高速度記録配列アドレスに 英単語練習 最高速度記録 を設定 */
  MIKA_type_date_record = MIKA_w_date; /* 最高速度達成日配列アドレスに 英単語練習 最高速度達成日付 を設定 */
  MIKA_type_time_record = MIKA_w_time; /* 累積練習時間配列アドレスに 英単語練習 累積練習時間 を設定 */
  MIKA_p_count = MIKA_p_count_word; /* 練習回数配列アドレスに英単語練習 練習回数 を設定 */
  MIKA_practice_end_flag = 0; /* 練習実行中フラグクリア */	
  MIKA_type_kind_mes = MIKA_menu_mes_w[MIKA_type_kind_no]; /* 練習項目名を設定 */
  MIKA_word_table = MIKA_w_seq[MIKA_type_kind_no]; /* 練習単語テーブルアドレスに英単語練習単語テーブルの指定項目を設定 */
  intwordtable(MIKA_word_table, MIKA_type_speed_record[MIKA_type_kind_no]); /* 英単語練習 練習テキスト作成 */
  prepflags(0); /* 練習フラグ初期化 */
}
class Procrtimer extends TimerTask { /* ランダム練習 単語練習用タイマー */
  sec_count = 0;
  run() {
    this.sec_count++;
    if (MIKA_practice_end_flag == 0) /* 練習実行中の場合 */
    {
      if ((MIKA_practice_end_flag == 0) && (this.sec_count >= MIKA_random_key_limit2)) /* 制限時間を超過した場合 */
      {
        MIKA_practice_end_flag = 1; /* 練習実行中フラグを終了にセット */
        this.cancel(); /* タイマーをキャンセル */
        MIKA_ttype_speed_time = MIKA_random_key_limit2; /* 経過時間を制限時間に設定 */
        MIKA_type_end_time = MIKA_type_start_time + (MIKA_random_key_limit2 * 1000); /* 現在時刻を開始時間+制限時間に設定 */
        const g = getGraphics();  /* Graphics 取得 */
        procdispspeed(g); /* 練習速度表示 */
        MIKA_type_time_record[MIKA_type_kind_no] = MIKA_type_time_record[MIKA_type_kind_no] + MIKA_ttype_speed_time; /* 累積練習時間加算 */
        prockiroku(g); /* 記録を更新時の処理 */
        proctrainexit(g); /* 練習終了時の表示更新 */
        g.dispose(); /* Graphics 破棄 */
      }
      else if(MIKA_practice_end_flag == 0)
      {
        MIKA_type_end_time = System.currentTimeMillis(); /* 現在時刻をミリ秒で取得 */
        MIKA_ttype_speed_time = (MIKA_type_end_time - MIKA_type_start_time) / 1000.0; /* 経過秒を実数で計算 */
        if ((MIKA_type_speed_time != MIKA_ttype_speed_time) && MIKA_ttype_speed_time >= 1.0) 
        {
          const g = getGraphics();  /* Graphics 取得 */
          procdispspeed(g); /* 入力速度を表示 */
          g.dispose(); /* Graphics 破棄 */
        }
      }
    }
  }
}
function paint() {
  const g = getGraphics();
  // 画面を塗りつぶす
  MIKA_win_size = getSize(); /* 表示画面サイズ取得 */
//		System.out.printf("win size width=%d height=%d\n",MIKA_win_size.width,MIKA_win_size.height);
  MIKA_insets = getInsets(); /* 表示画面外枠サイズ取得 */
//		System.out.printf("Inset left=%d right=%d top=%d bottom=%d \n",MIKA_insets.left,MIKA_insets.right,MIKA_insets.top,MIKA_insets.bottom);
  dispmen(g); /* 画面表示 */
}
function procexit() /* プログラム終了時の処理 */
{
  let a;
  let c;
  MIKA_lt_t=System.currentTimeMillis(); /* 練習時間記録ファイル用練習終了時間をミリ秒で取得 */
  MIKA_file_error_seiseki=wseiseki(); /* 成績ファイル書き込み */
  MIKA_file_error_kiroku=wkiroku(); /* 練習時間記録ファイル書き込み */
//		MIKA_file_error_seiseki=1;
//		MIKA_file_error_kiroku=1;
//		MIKA_file_error_hayasa=1;
  if(MIKA_file_error_seiseki==1||MIKA_file_error_kiroku==1||MIKA_file_error_hayasa==1) /* 成績ファイル書き込みエラーの場合 */
  {
    a=mesfileerr(); /* 成績ファイル書き込みエラーメッセジ作成 */
    //c = getContentPane();
    //JOptionPane.showMessageDialog(c.getParent(),a,"成績ファイル書き込みエラー",JOptionPane.WARNING_MESSAGE);
    /* 成績ファイル書き込みエラーダイアログ表示 */
  }
  //System.exit(0); /* プログラム終了 */
}		

function destroy() {
  savekiroku(); /* 練習記録(累積練習時間 最高入力速度 達成日)を保存する */
  procexit(); /* 成績ファイル書き込み 練習時間記録ファイル書き込み */
}
function tconv(time) /* 練習時間秒を文字列に変換 */
{
  let a;
  a=t0conv(time,0); /* 練習時間秒を "%5d時間%2d分%2d秒"のフォーマットで文字列に変換 */
  return a;
}
function t0conv(time, flag) /* 練習時間秒をフォーマットを指定して文字列に変換 */
{
  let a;
  let t1,t2,t3;
  t3=time%60; /* 秒を計算 */
  time=time/60;
  t2=time%60; /* 分を計算 */
  t1=time/60; /* 時間を計算 */
  if(flag==0)	a=String.format("%5d時間%2d分%2d秒",t1,t2,t3); /* 時分秒を文字列に変換 */
  else a=String.format("%3d時間%2d分%2d秒",t1,t2,t3);
  return a;
}
function ttconv(mes) /* 時分秒の文字列を秒に変換 */
{
  let t1,t2,t3;
  let i,i1,i2,i3;

//		System.out.printf("練習時間 =%s\n",mes);
  t1=mes.substring(0,5); /* 時間文字列を取得 */
  t2=mes.substring(7,9); /* 分文字列を取得 */
  t3=mes.substring(10,12); /* 秒文字列を取得 */
  i1=Integer.parseInt(t1.trim()); /* 時間文字列を整数に変換 */
  i2=Integer.parseInt(t2.trim()); /* 分文字列を整数に変換 */
  i3=Integer.parseInt(t3.trim()); /* 秒文字列を整数に変換 */
  i=i1*60*60+i2*60+i3; /* 時分秒から秒を算出 */
//		System.out.printf("時間=%s %d 分=%s %d 秒=%s %s\n",t1,i1,t2,i2,t3,i3);
//		System.out.printf("時間=%d 分=%d 秒=%s\n",i1,i2,i3);
  return(i);
}
function cfind(a, line) /* 文字列から指定の文字の位置を検索する */
{
  let i;
  let j;
  j=line.length; /* 文字列長取得 */
  for(i=0;i<1000&&i<j;i++)
  {
    if(a==line.charAt(i)) /* 文字列から指定の文字と一致する文字が見つかった場合 */
    {
      return i + 1;
    }
  }
  return 0; /* 一致する文字が見つからない場合 */
}
function inkotable(a, a_pos, c_pos, p_x, p_y) /* 文字種に対応した文字のキーの位置を設定する */
{
  let	i,pos;
  for(i=0;i<4;i++)
  {
    if((pos=cfind(a,c_pos[i]))!=0)
    {
      p_x[a_pos]=i+1; /* =1 最上段 =2 上一段 =3 ホームポジション =4 下一段 */
      p_y[a_pos]=pos; /* 左から数えたキーの位置。最左端は1から始まる */
//			System.out.printf("char %c p_x=%d p_y=%d\n",a,p_x[a_pos],p_y[a_pos]);
    }
  }
}
function inktable() /* キーボードの位置テーブル初期化 */
{
  let	i;
  let a;
  for(i=0x41;i<=0x5a;i++) /* 英大文字に対応したキーの位置を設定 */
  {
    a=i;
    inkotable(a,i-0x41,MIKA_c_post,MIKA_pasciix,MIKA_pasciiy);
  }
  for(i=0x61;i<=0x7a;i++) /* 英小文字に対応したキーの位置の設定 */
  {
    a=i;
    inkotable(a,i-0x61,MIKA_c_post,MIKA_pasciix,MIKA_pasciiy);
  }
  for(i=0x30;i<=0x39;i++) /* 数字に対応したキーの位置の設定 */
  {
    a=i;
    inkotable(a,i-0x30,MIKA_c_post,MIKA_pnumberx,MIKA_pnumbery);
  }
}
function readResult() {
  const file = new File(MIKA_file_name_seiseki); /* 成績ファイルオープン */
  try {
    const b_reader = new BufferedReader(new InputStreamReader(new FileInputStream(file),ENC));
    err=rseiseki(b_reader,MIKA_seiseki); /* 練習成績ファイル読み込み */
    if(err==0) convseiseki(MIKA_seiseki); /* 練習成績ファイルデータ変換 */
    try{
      b_reader.close(); /* 練習成績ファイルクローズ */
    }
    catch (e) { 
          e.printStackTrace();
    }
  } catch (e) {

  }
}
function funcbackmenu(func_no) /* メニューの階層を一段上に戻る */
{
  let ffun_no=0;
  if(func_no>400&&func_no<500) /* ポジション練習の各項目の場合 */
  {
    ffun_no=21; /* ポジション練習のメニューに戻る */
  }
  else if(func_no>500&&func_no<600) /* ランダム練習の各項目の場合 */
  {
    ffun_no=22; /* ランダム練習のメニューに戻る */
  }
  else if(func_no>600&&func_no<700) /* 英単語練習の各項目の場合 */
  {
    ffun_no=23; /* 英単語練習のメニューに戻る */
  }
  else if(func_no>700&&func_no<800) /* ローマ字の各項目の場合 */
  {
    ffun_no=24; /* ローマ字練習のメニューに戻る */
  }
  else
  {
    ffun_no=1; /* 初期メニューに戻る */
  }
  return ffun_no;
}
function init() {
// リスナー
  const myKeyAdapter = new MyKeyAdapter(); 
  addKeyListener(myKeyAdapter);/* キー入力処理追加 */
  MIKA_s_date = new Date(); /* 練習開始日時取得 */
  MIKA_st_t = System.currentTimeMillis(); /*  練習時間記録ファイル用練習開始時間をミリ秒で取得 */
  inktable(); /* キーボードの位置テーブル初期化 */
  // readResult();
  const screenSize = Toolkit.getDefaultToolkit().getScreenSize(); /* ウィンドー最大サイズ取得 */
  const w = screenSize.width * 4 / 5; /* ウィンドーサイズ 幅を最大幅の4/5に設定 */
  const h = screenSize.height * 4 / 5; /* ウィンドーサイズ 高さを最大高さの4/5に設定 */
  setSize(w, h); /* ウィンドーサイズを設定 */
//		Toolkit tk = Toolkit.getDefaultToolkit();
//		Image img = tk.getImage( "mikatype.gif" ); /* アイコン画像取得 */
//		setIconImage( img ); /* アイコンの設定 */
  //setTitle("美佳タイプ"); /* タイトル設定 */
  //setLocationRelativeTo(null); /* 中央に表示 */
  //setVisible(true); /* ウィンドー表示 */
}
function proctrain(g, nChar) /* ランダム練習 英単語練習の文字入力処理 */
{
  if (nChar == 0x1b){ /* エスケープキー入力の場合 */
    if(MIKA_practice_end_flag==0) /* 入力練習実行中の場合 */
    {
      MIKA_practice_end_flag=1; /* 練習実行中フラグを終了にセット */
      if(MIKA_time_start_flag==1) /* 最初の正解を入力済で制限時間のタイマーを開始済の場合 */
      {
        MIKA_Procrtimer.cancel();	 /* 制限時間60秒のタイマーをキャンセル */				
        MIKA_type_end_time=System.currentTimeMillis(); /* 終了時間をミリ秒で取得 */
        const MIKA_ttype_speed_time=(MIKA_type_end_time-MIKA_type_start_time)/1000.0; /* 練習時間 秒を計算 */
        if(MIKA_ttype_speed_time<=0.0)MIKA_ttype_speed_time=1.0; /* 練習時間がゼロ以下の場合は1に設定 */
        MIKA_type_time_record[MIKA_type_kind_no]=MIKA_type_time_record[MIKA_type_kind_no] + MIKA_ttype_speed_time; /* 累積練習時間の記録を加算 */
      }
      dispabortmes2(g,1); /* エスケープキーで終了しますの表示を消去 */
      dispretrymessage(g,0); /* 練習リトライメッセージ表示 */
    }
    else /* 練習終了の場合 */
    {
      if(MIKA_type_syuryou_flag==1||MIKA_type_syuryou_flag==2) /* 練習記録を更新した場合 */
      {
        MIKA_type_speed_record[MIKA_type_kind_no]=MIKA_type_speed;	/* 練習記録 最高入力速度を更新 */
        MIKA_type_date_record[MIKA_type_kind_no]=MIKA_type_date; /* 練習記録 達成日を更新 */
      }
      MIKA_exec_func_no=funcbackmenu(MIKA_exec_func_no);	/* メニューを一階層戻る */
      dispmen(g); /* メニュー表示 */
    }
  }
  else if((nChar==0x0d||nChar==0x0a)&&MIKA_practice_end_flag==1)	 /* 練習の終了時に改行が入力された場合 */
  {
    MIKA_practice_end_flag=0; /* 練習実行中フラグクリア */
    if(MIKA_type_syuryou_flag==1||MIKA_type_syuryou_flag==2)	 /* 練習記録を更新した場合 */
    {
        MIKA_type_speed_record[MIKA_type_kind_no]=MIKA_type_speed; /* 練習記録 最高入力速度を更新 */
        MIKA_type_date_record[MIKA_type_kind_no]=MIKA_type_date; /* 練習記録 達成日を更新 */
    }
    if(600<MIKA_exec_func_no&&MIKA_exec_func_no<700) intwordtable(MIKA_word_table,MIKA_type_speed_record[MIKA_type_kind_no]);  /* 英単語練習 練習テキスト作成 */
    else inctable(MIKA_char_table,MIKA_type_speed_record[MIKA_type_kind_no]); /* ランダム練習 練習テキスト作成 */
    prepflags(0); /* 練習フラグ初期化 */
    dispmen(g); /* 画面表示 */
  }
  else if(MIKA_practice_end_flag==0) /* 練習実行中の場合 */
  {
    if(MIKA_time_start_flag==1) /* 最初の正解を入力済の場合 */
    {
      MIKA_type_end_time=System.currentTimeMillis();  /*終了時間をミリ秒で取得 */
      MIKA_ttype_speed_time=(MIKA_type_end_time-MIKA_type_start_time)/1000.0; /* 練習時間 秒を計算 */
      if(MIKA_ttype_speed_time>=MIKA_random_key_limit)  /* 練習時間が制限時間を超えた場合 */
      {
        if(MIKA_practice_end_flag==0) /* タイマーによる割り込みを考慮して再度フラグをチェック */
        {
          MIKA_practice_end_flag=1; /* 練習実行中フラグを終了にセット */
          MIKA_Procrtimer.cancel();		/* 制限時間60秒のタイマーをキャンセル */				
          MIKA_ttype_speed_time=MIKA_random_key_limit; /* 練習時間を制限時間に設定 */
          MIKA_type_end_time=MIKA_type_start_time+(MIKA_random_key_limit*1000); /* 終了時間を開始時間+制限時間に設定 */
          procdispspeed(g); /* 入力速度を表示 */
          MIKA_type_time_record[MIKA_type_kind_no]=MIKA_type_time_record[MIKA_type_kind_no]+ MIKA_ttype_speed_time; /* 累積練習時間の記録を加算 */
          prockiroku(g); /* 記録を更新時の処理 */
          proctrainexit(g); /* 練習終了時の表示更新 */
        }
        return;
      }
    }
    MIKA_key_char=MIKA_chat_t[MIKA_c_p2][MIKA_c_p1].charCodeAt(0); /* 練習文字を取り出し */
    if(uppertolower(nChar)==uppertolower(MIKA_key_char)) /* 入力文字と練習文字を小文字に変換して比較 */
    {
       /* 練習文字と入力文字が一致する場合 */
      if(MIKA_type_count+1>=MIKA_cline_c) /* すべての練習文字を入力した場合は練習を終了 */
      {
        if(MIKA_practice_end_flag==0) /* タイマーによる割り込みを考慮して再度フラグをチェック */
        {
          MIKA_practice_end_flag=1; /* 練習実行中フラグを終了にセット */
          MIKA_Procrtimer.cancel();	/* 	制限時間60秒のタイマーをキャンセル */				
          MIKA_type_count++; /* 入力文字正解数を加算 */
          MIKA_utikiri_flag=1; /* 練習打ち切りフラグをセット */
          MIKA_utikiri_flag2=0; /* 前回練習速度消去用にフラグをクリア */
          if(MIKA_err_char_flag==1) /* 前回入力がエラーの場合 */
          {
          MIKA_err_char_flag=0; /* エラー入力フラグクリア */
          disperrchar(g,0); /* エラー文字の赤色表示を元の背景色に戻す */
          }
          cslputu(g,MIKA_t_line*16+MIKA_c_p2*20,MIKA_c_p1*16,"aa",1,MIKA_color_text_under_line); /* 正解文字に下線を表示 */
          if(MIKA_c_p1<39) /* 次の練習文字位置を取得 */
          {
            MIKA_c_p1++; /* 横座標インクリメント */
          }
          else
          {
            MIKA_c_p1=0; /* 横座標をゼロに設定*/
            MIKA_c_p2++; /* 縦座標をインクリメント */
          }
      
          procdispspeed(g); /* 入力速度を表示 */
          MIKA_type_time_record[MIKA_type_kind_no]=MIKA_type_time_record[MIKA_type_kind_no] + MIKA_ttype_speed_time; /* 累積練習時間の記録を加算 */
          prockiroku(g); /* 記録を更新時の処理 */
          proctrainexit(g); /* 練習終了時の表示更新 */
        }
        return;
      }
      MIKA_type_count++; /* 入力文字正解数を加算 */
      if(MIKA_time_start_flag==0) /* 最初の正解文字入力の場合 */
      {
        MIKA_type_start_time=System.currentTimeMillis(); /* 練習開始時間をミリ秒で取得取得 */
        MIKA_type_speed_time=0; /* 前回練習時間秒を0に設定 */
        MIKA_ttype_speed_time=0; /* 今回練習時間秒を0に設定 */
        MIKA_time_start_flag=1; /* 練習時間計測フラグセット */
        MIKA_Procrtimer = new Procrtimer();/* 60秒タイマー取得 */
        MIKA_timer.scheduleAtFixedRate(MIKA_Procrtimer,MIKA_random_time_interval,MIKA_random_time_interval); /* タイマーを一秒間隔でセット */
      }
      if(MIKA_err_char_flag==1) /* 前回入力がエラーの場合 */
      {
        MIKA_err_char_flag=0; /* エラー入力フラグクリア */
        disperrchar(g,0); /* エラー文字の赤色表示を元の背景色に戻す */
      }
      cslputu(g,MIKA_t_line*16+MIKA_c_p2*20,MIKA_c_p1*16,"aa",1,MIKA_color_text_under_line); /* 正解文字に下線を表示 */
      if(MIKA_c_p1<39) /* 次の練習文字位置を取得 */
      {
        MIKA_c_p1++; /* 横座標インクリメント */
      }
      else
      {
        MIKA_c_p1=0; /* 横座標をゼロに設定*/
        MIKA_c_p2++; /* 縦座標をインクリメント */
      }
    }
    else /* 入力エラーの場合 */
    {
      MIKA_err_char_flag=1; /* エラー入力フラグセット */
      disperrchar(g,1); /* エラー文字を背景赤で表示 */
      disperror1(g,1); /* 前回のエラー回数表示をクリア */
      MIKA_type_err_count++; /* エラー入力文字数カウンターを加算 */
      disperror1(g,0); /* 今回エラー回数を表示 */
    }
    if(MIKA_time_start_flag==1) /* 練習時間計測中の場合 */
    {
      if((roundtime(MIKA_type_speed_time)!=roundtime(MIKA_ttype_speed_time))&&MIKA_ttype_speed_time>=1.0) /* 練習時間が前回より一秒以上更新している場合は入力速度を更新 */
      {
        procdispspeed(g); /* 入力速度を表示 */
      }
    }
  }
}
function roundtime(time) /* 小数点以下 切り捨て */
{
  let time0;
  time0=Math.floor(time); /* 浮動小数点を整数に変換 */
  time=time0; /* 整数を浮動小数点に変換 */
  return time;
}
function disperrorcount(g, flag, i, j) /* エラー入力回数表示 */
// flag=0 表示 flag=1 数値のみ消去 flag=2 メッセージと共に数値を消去
// i 表示位置縦行番号
// j 表示位置横列番号
	{
		let type_mes;
		let offset;
		if(flag==0) /* フラグが=0の時は表示色を赤色に設定 */
		{
 			cslcolor(g,MIKA_red);
			type_mes=String.format("ミスタッチ%3d回",MIKA_type_err_count); /* エラーカウントメッセージ作成 */
			offset=0;
		}
		else if(flag==1)
		{
			cslcolor(g,MIKA_bk_color); /* フラグが=1の時は表示を消去 */
			type_mes=String.format("%3d",MIKA_type_err_count); /* エラーカウントメッセージ作成 */
			offset=10;
		}
		else
		{
			cslcolor(g,MIKA_bk_color); /* フラグが=1の時は表示を消去 */
			type_mes=String.format("ミスタッチ%3d回",MIKA_type_err_count); /* エラーカウントメッセージ作成 */
			offset=0;
		}
		//		System.out.printf("i=%d j=%d",i,j);
		cslput(g,i*16,(j+offset)*8,type_mes); /* 指定位置にエラーカウント表示 */
	}
	function cslputu(g, x, y, mes, yy, color1) /* 文字列の下に下線を表示 */
// x 文字列表示左上仮想x座標
// y 文字列表示左上仮想y座標 
// mes アンダーラインを引く文字列
// yy 文字列下端から下線までのドット数間隔の補正値
// color1 表示色 
	{
		let char_length;
		let x1,x2,xx,y1,y2;
		let font_size,ffont_size;
		let font_hight;
		char_length=stringlength(mes); /* 文字列長取得 半角文字は長さ=1 全角文字は長さ=2で計算*/
		font_size=cslfontsize(1.0); /* 等倍のフォントサイズ取得 */
		ffont_size=Math.floor(font_size/1.33); /* フォントサイズ補正 */
		font_hight=cslfonthight(1.0); /* 表示エリア高さを取得 */
		x1=xcord(x+MIKA_width_x)+yy+(ffont_size-font_hight)/2+2; /* アンダーラインのx座標設定 */
		x2=xcord(1)-xcord(0); /* アンダーラインの太さを設定 */
		y1=ycord(y); /* アンダーラインの開始y座標設定 */
		y2=ycord(y+char_length*8); /* アンダーラインの終了y座標設定 */
		cslcolor(g,color1); /* アンダーラインの色を設定 */
		for(xx=x1;xx<=x1+x2;xx++) /* 指定の太さのアンダーラインを描画 */
		{
			g.drawLine(y1,xx,y2,xx); /* 直線描画 */
		}
	}
	function dispmaxspeedrecord(g, i1, j1, i2, j2) /* ランダム練習 英単語練習 ローマ字練習の 最高入力速度と 達成日を表示 */
	{
			let a,b;
			cslcolor(g,MIKA_green); /* 表示色を緑に設定 */
			a=String.format("最高入力速度%6.1f文字／分",MIKA_type_speed_record[MIKA_type_kind_no]); /* 最高速度メッセージ作成 */
			cslput(g,i1*16,j1*8,a); /* 最高速度メッセージ表示 */
			b=String.format("達成日 %s",MIKA_type_date_record[MIKA_type_kind_no]); /* 達成日メッセージ作成 */
			cslput(g,i2*16,j2*8,b); /* 達成日メッセージ表示 */
	}
function disperror1(g, flag) /* ランダム練習 英単語演習 エラー回数表示 */
// flag=0 表示 flag=1 消去  flag=2 メッセージと共に数値を消去
	{
		disperrorcount(g,flag,5,49); /* 表示位置を指定してエラー回数表示 */
	}

	function dispbkchar(g, i, j) /* ランダム練習 英単語練習 ローマ字練習で練習文字の背景を表示 */
	{
		let ii,jj;
		ii=xxcord(i); /* 練習文字の縦位置を仮想座標に変換 */
		jj=yycord(j); /* 練習文字の横位置を仮想座標に変換 */
		cslputzscale(g,ii,jj,'■',1.4); /* 四角文字を倍率1.4倍で表示 */
	}
	function dispchar(g, i, j, a) /* ランダム練習 英単語練習 ローマ字練習で練習文字を表示 */
	{
		let ii,jj;
		ii=xxcord(i); /* 練習文字の縦位置を実座標に変換 */
		jj=yycord(j); /* 練習文字の横位置を実座標に変換 */
		cslputzscale(g,ii,jj,a,MIKA_random_scale); /* 練習文字を等倍で表示 */
	}
	function disperrchar(g, flag) /* ランダム練習 英単語練習 ローマ字練習で エラー文字を表示 */
// flag=1 赤色背景で表示
// flag=0 背景白色で表示
	{
		let color1,color2;
		if(flag==1) /* エラー文字を背景赤色で表示する場合 */
		{
			color1=Color.red; /* 背景色を赤色に指定 */
			color2=Color.black; /* 文字色を黒色に指定 */
		}
		else /* エラー文字を背景白色で再表示する場合 */
		{
			color1=MIKA_bk_color; /* 背景色を白色に指定 */
			color2=Color.black; /* 文字色を黒色に指定 */
		}
		cslcolor(g,color1); /* 背景色の設定 */
		dispbkchar(g,MIKA_c_p2,MIKA_c_p1);	/* 四角い文字を背景に表示 */
		cslcolor(g,color2); /* 文字色の設定 */
		dispchar(g,MIKA_c_p2,MIKA_c_p1,MIKA_chat_t[MIKA_c_p2][MIKA_c_p1]); /* 練習文字を表示 */
	}
function uppertolower(nChar) /* 英大文字を英小文字に変換 */
{
    if('A'.charCodeAt(0) <= nChar && nChar <= 'Z'.charCodeAt(0)) {
      nChar = nChar - 'A'.charCodeAt(0) + 'a'.charCodeAt(0); /* 英大文字の場合は小文字に変換 */
    }
    return nChar;
}
function menexe(g, menu_mes, menu_cord, menu_function, sel_flag, menut)
{
  let i,j;
  let x;
  let y;
  let	mesi5="番号キーを押して下さい";
  MIKA_max_x_flag=0; /* 縦 25行モードに設定 */
  MIKA_max_y_flag=0; /* 横 80カラムモードに設定 */
  cslclr(g); /* 画面クリア */
  cslcolor(g,MIKA_magenta); /* 表示色をマゼンタに設定 */
  cslmencenter(g,1,menut); /* メニュータイトルを上端の中央に表示 */
  MIKA_max_x_flag=1; /* 縦 20行モードに設定 */
  MIKA_max_y_flag=1; /* 横 64カラムモードに設定 */
  cslcolor(g,MIKA_cyan);
  cslput(g,18*16,29*8,mesi5); /* 番号キーを押して下さいのメッセージを表示 */
  j=menu_mes.length;
  for(i=0;i<j;i++)
  {
    x=menu_cord[i][0]; /* メニュー表示位置 x座標取得 */
    y=menu_cord[i][1]; /* メニュー表示位置 y座標取得 */
    if(sel_flag[i]==1)	cslcolor(g,MIKA_green); /*前回選択メニュー項目は緑色で表示 */
    else 	cslcolor(g,MIKA_blue); /* その他のメニューは青色で表示 */
    cslput(g,x,y,menu_mes[i]); /* メニュー項目表示 */
    if(sel_flag[i]==1) cslputu(g,x,y,menu_mes[i],1,MIKA_green); /* 前回選択メニュー項目に下線を表示 */
    cslputzscale(g,x,y-4*MIKA_width_y, i + '1'.charCodeAt(0), 1.0); /* メニュー番号を表示 */
  }
  MIKA_menu_function_table=menu_function; /* 機能番号テーブル設定 */
  MIKA_sel_flag=sel_flag; /* 前回選択メニュー項目選択フラグアドレス設定 */
  MIKA_max_x_flag=0; /* 縦 25行モードに戻す */
  MIKA_max_y_flag=0; /* 横 80カラムモードに戻す */
}
function mencom(menu_function_table, sel_flag, nChar) /* 選択されたメニューの項目に対応する機能番号を取得 */
{
  let func_no=0;
  let i,ii,iii;
  let sel_flag1=0;
  if(menu_function_table==null) return(0);
  ii=menu_function_table.length;
  if(nChar==0x1b){ /* 入力文字がエスケープの場合 */
    for(i=0;i<ii;i++) /* メニューに戻りますのメニュー項目をサーチ */
    {
      if(menu_function_table[i]>9000&&menu_function_table[i]<9999) /* メニューに戻りますのメニュー項目があった場合 */  
      {
        func_no=menu_function_table[i];
      }
    }
    return(func_no);
  }
  else if(nChar<=0x30||nChar>0x39) return(0); /* 入力文字が1～9の数字以外は処理をしないでリターン */
  else
  {
    iii=nChar-0x31; /* 文字を数字に変換 */
    if(iii<ii) /* 入力された数字に対応するメニューがある場合 */
    {
      func_no=menu_function_table[iii]; /* 対応する機能番号を取り出す */
      for(i=0;i<ii;i++)
      {
          if(sel_flag[i]!=0) sel_flag1=i+1; /* 前回選択メニュー項目番号をサーチ */
      }
      if(0<func_no&&func_no<9000) /* 今回選択メニューがメニューに戻るで無い場合 */
      {
        if(sel_flag1!=0) sel_flag[sel_flag1-1]=0; /*前回選択メニュー番号をクリア */
        sel_flag[iii]=1; /* 今回の選択メニュー番号を前回選択メニュー番号に設定 */
      }
      return(func_no);
    }
    else
    return(0);
  }	
}	

function exec_func(g, nChar) /* 一文字入力に対応した処理を行う */
	{
		let func_no;
		if(MIKA_exec_func_no==0) /* 最初の初期画面を表示中にキーが押された場合 */
		{
			MIKA_exec_func_no=1; /* 初期画面の表示番号を設定 */
			dispmen(g); /* メニュー表示 */
			return(1);
		}
		func_no = mencom(MIKA_menu_function_table,MIKA_sel_flag,nChar); /* 選択されたメニューの項目に対応する機能番号を取得 */
		if(func_no != 0) /* メニュー表示中に数字キーが押されて対応する機能番号がゼロでない場合 */
		{
			MIKA_menu_function_table=null;
			MIKA_exec_func_no=func_no;
			if(MIKA_exec_func_no==9999) procexit(); /* 機能番号が 9999の時は終了 */
			if (MIKA_exec_func_no>9000) MIKA_exec_func_no=MIKA_exec_func_no-9000; /* 機能番号がメニューに戻るの時は、メニュー番号を取得 */
			if(MIKA_exec_func_no>400&&MIKA_exec_func_no<800) /* 機能番号が練習メニューの実行の場合は各練習の項目ごとに前処理を行う */
			{
				preptrain(MIKA_exec_func_no); /* 練習の各項目ごとの前処理 */
			}
			dispmen(g); /* メニュー、練習画面表示 */
			return(1);
		}
		else /* 練習の実行中にキーが押された場合 */
		{
			if (nChar==0x1b && MIKA_exec_func_no==29) /* 成績表示中にエスケープキーが押された場合 */
			{
				MIKA_exec_func_no=1; /* 初期メニューのメニュー番号設定 */
				dispmen(g); /* メニュー表示 */
				return(1);
			}
			if (MIKA_exec_func_no>400&&MIKA_exec_func_no<500) /* ポジション練習 */
			{
				procptrain(g,nChar); /* ポジション練習 文字入力処理 */
				return(1);
			}
			if(MIKA_exec_func_no>500&&MIKA_exec_func_no<600) /* ランダム練習 */
			{
				proctrain(g,nChar); /* ランダム練習 文字入力処理 */
				return(1);
			}
			if(MIKA_exec_func_no>600&&MIKA_exec_func_no<700) /* 英単語練習 */
			{
				proctrain(g, nChar); /* 英単語演習 文字入力処理 */
				return(1);
			}
			if(MIKA_exec_func_no>700&&MIKA_exec_func_no<800) /* ローマ字練習 */
			{
				procatrain(g,nChar); /* ローマ字練習 文字入力処理 */
				return(1);
			}
		}
		return(0);
	}
class MyKeyAdapter extends KeyAdapter {
  keyPressed(e) {
    let err;
    let keyCode;
    let g = getGraphics(); /* Graphics 取得 */
    let keyChar = e.getKeyChar(); /* 入力文字取得 */
  //			keyCode=(int) keyChar;
  //			System.out.printf("KeyChar=%4x\n",KeyCode);			
    //if (keyChar != KeyEvent.CHAR_UNDEFINED) /* 入力されたキーが有効な文字の場合 */
    //{
      err = exec_func(g, keyChar); /* 入力文字に対応した処理を実行 */
    //}
    g.dispose(); /* Graphics 破棄 */
  }
}

function main() {
  init();
  MIKA_exec_func_no = 601;
  preptrain(MIKA_exec_func_no);
  paint();

  // start
  MIKA_type_start_time = System.currentTimeMillis(); /* 練習開始時間をミリ秒で取得取得 */
  MIKA_type_speed_time = 0; /* 前回練習時間秒を0に設定 */
  MIKA_ttype_speed_time = 0; /* 今回練習時間秒を0に設定 */
  MIKA_time_start_flag = 1; /* 練習時間計測フラグセット */
  MIKA_Procrtimer = new Procrtimer();/* 60秒タイマー取得 */
  MIKA_timer.scheduleAtFixedRate(MIKA_Procrtimer, MIKA_random_time_interval, MIKA_random_time_interval); /* タイマーを一秒間隔でセット */
}

main();
