const { judgeTexasDuel } = require("./porker");
// 遊戲規則概述
// 每人發兩張底牌，再翻三張公共牌。
// 根據五張牌組成的最佳牌型決勝負
// 因為做測試，所以不管花色，只看數字，且不把多組合排行考慮進去(葫蘆、同花順、同花、皇家同花順)

// 盤點所有可能情境輸入

// 啟動失敗，輸入值就直接不對了，在比對前就要擋下來
// 1. 雙方有一人輸入值數量不對
// 2. 公共牌數量不對
// 3. 雙方的值超過鋪克牌大小1~13
// 4. 某一張牌輸入值重複超過4次
// 延伸：
// 1. 輸入值有非數字
// 2. 輸入值有非整數
// 3. 輸入值有負數
// 4. 輸入值有非數字
// ...
test("雙方有一人輸入值數量不對", () => {
  expect(judgeTexasDuel([1, 2, 3, 4, 5], [6, 7], [11, 12, 13])).toBe(
    "Invalid input: Each player must have 2 cards!"
  );
});

test("公共牌數量不對", () => {
  expect(judgeTexasDuel([1, 2, 3, 4, 5, 6], [6, 7], [11, 12])).toBe(
    "Invalid input: Public cards number of cards must be 5!"
  );
});

// 錯誤：因為有指定unit test的回傳，即便是失敗，順序也會影響到測試是否通過
// test("數字超過13", () => {
//   expect(judgeTexasDuel([1, 2, 3, 4, 5], [6, 7], [11, 12, 13, 14])).toBe(
//     "Invalid input: Card number must be between 1 and 13!"
//   );
// });

// 正確：因為有指定unit test的回傳，所以error code 也會影響到測試是否通過
test("數字超過13", () => {
  expect(judgeTexasDuel([1, 2, 3, 4, 14], [6, 7], [11, 12])).toBe(
    "Invalid input: Card number must be between 1 and 13!"
  );
});

test("數字重複超過4次", () => {
  expect(judgeTexasDuel([1, 2, 13, 13, 13], [6, 7], [13, 13])).toBe(
    "Invalid input: Card 13 appears more than 4 times!"
  );
});

// 啟動成功，進入到判斷輸贏，且真的有一方贏
// Tips：有五種勝利方法，那最正確的應該是要包含10種情境
// 但因為我們只看數字，所以排行應該要改成
// 排行： 順子 > 四條 > 三條 > 兩對 > 一對 > 高牌

test("順子", () => {
  expect(judgeTexasDuel([1, 2, 3, 4, 5], [6, 7], [11, 12])).toBe(
    "Opponent win with Straight"
  );
});

test("四條", () => {
  expect(judgeTexasDuel([1, 1, 2, 3, 3], [3, 3], [11, 12])).toBe(
    "Opponent win with Four of a Kind"
  );
});

test("三條", () => {
  expect(judgeTexasDuel([1, 1, 3, 4, 5], [3, 3], [11, 12])).toBe(
    "Opponent win with Three of a Kind"
  );
});

test("兩對 - Tie", () => {
  expect(judgeTexasDuel([2, 3, 4, 5, 6], [7, 8], [1, 9])).toBe(
    "Opponent win with Straight"
  );
});

test("一對", () => {
  expect(judgeTexasDuel([1, 2, 6, 7, 8], [11, 12], [3, 3])).toBe(
    "Player win with Pair"
  );
});
test("高牌", () => {
  expect(judgeTexasDuel([1, 2, 6, 7, 8], [3, 5], [11, 12])).toBe(
    "Player win with High Card"
  );
});

// 啟動成功，進入到判斷輸贏，但雙方平手
// 同理 但比一方贏少一半測試數量

test("兩對 - Tie", () => {
  expect(judgeTexasDuel([1, 1, 2, 2, 3], [9, 10], [8, 10])).toBe("Tie");
});
//...

// 撰寫流程
// 1. 先固定return的值，寫成功測試，確認測試會成功
// 2. 盤點所有可能的輸入情境，寫失敗測試，確認測試會失敗
// 3. 修正產品邏輯，確認測試會成功
// 4. 反覆1~3，直到所有情境都測試過

// 一些總結
// 因為有指定unit test的回傳，即便是失敗，順序也會影響到測試是否通過
// 同樣花色下，也不見得是平手，也需要另外比較其他的比較項
// 目前測試只有測試judgeTexasDuel，也就是結果的部分，但依照書中所講，有程式碼的地方就要寫測試(除非是語法內建函式)

// 假設我們先進行產品開發的邏輯驗證，而非防呆，那我們蠻有可能在回頭做防呆時，將之前的測試搞壞，所以防呆的測試應該要先寫
// ex：judgeTexasDuel([1, 1, 2, 3, 5], [1, 1], [1, 10])
// 這樣的輸入，在原本的邏輯下，會回傳"Player win with Four of a Kind"，但因為我們後面有做防呆，所以會回傳"Invalid input: Card 1 appears more than 4 times!"
// 而這時就需要回頭修改原本的測試，蠻容易陷入到 這應該要修改測試 還是要修改產品程式碼的判斷。

