// 1. 啥都不幹 但寫死固定-> 先使測試通過，確保程式碼能運作
// function judgeTexasDuel(publicCards, opponentCards, playerCards) {
//   // 實現邏輯
//   return "High Card";
// }

// 給GPT的指令
// 德州雙人不錯，幫我用js寫一段
// input是公共牌、對手排、自己排
// 但不用紀錄花色，且每個數字不能重複4次(因為花色只有四個)
// 舉例
// input[[1,2,3],[1,2],[4,5]]
// output ：對手贏，對手同花順
function judgeTexasDuel(publicCards, opponentCards, playerCards) {
  // 所有牌的輸入檢查
  // 合併所有卡片
  const allCards = [...publicCards, ...opponentCards, ...playerCards];

  if (publicCards.length !== 5) {
    return "Invalid input: Public cards number of cards must be 5!";
  }
  if (opponentCards.length !== 2 || playerCards.length !== 2) {
    return "Invalid input: Each player must have 2 cards!";
  }
  //如果數字有超過13，代表輸入錯誤
  if (allCards.some((card) => card > 13)) {
    return "Invalid input: Card number must be between 1 and 13!";
  }
  // 檢查數字不能超過四次
  const counts = {};
  for (const card of allCards) {
    counts[card] = (counts[card] || 0) + 1;
    if (counts[card] > 4) {
      return `Invalid input: Card ${card} appears more than 4 times!`;
    }
  }

  // 定義牌型權重
  const handRankings = [
    "High Card", // 無特殊牌型
    "Pair", // 對子
    "Two Pair", // 兩對
    "Three of a Kind", // 三條
    "Four of a Kind", // 四條
    "Straight", // 順子
  ];

  // 檢查順子的工具函數
  function isStraight(cards) {
    const sorted = [...new Set(cards)].sort((a, b) => a - b);
    for (let i = 1; i < sorted.length; i++) {
      if (sorted[i] - sorted[i - 1] !== 1) return false;
    }
    return sorted.length >= 5; // 至少五張才是順子
  }

  // 判斷牌型的工具函數
  function evaluateHand(cards) {
    const counts = {};
    cards.forEach((card) => (counts[card] = (counts[card] || 0) + 1));

    const values = Object.values(counts).sort((a, b) => b - a); // 按頻率排序
    const isFourOfAKind = values[0] === 4; // 第一個數字是4，代表有四條
    const isThreeOfAKind = values[0] === 3; // 第一個數字是3，代表有三條
    const isTwoPair = values[0] === 2 && values[1] === 2; // 兩個對子的情況
    const isPair = values[0] === 2; // 至少有一對

    if (isStraight(cards)) return { rank: 4, name: "Straight" };
    if (isFourOfAKind) return { rank: 3.5, name: "Four of a Kind" };
    if (isThreeOfAKind) return { rank: 3, name: "Three of a Kind" };
    if (isTwoPair) return { rank: 2.5, name: "Two Pair" }; // 使用2.5避免與Pair重疊
    if (isPair) return { rank: 2, name: "Pair" };
    return { rank: 1, name: "High Card" };
  }

  // 主函數：判斷德州雙人對決
  const opponentFullHand = [...publicCards, ...opponentCards];
  const playerFullHand = [...publicCards, ...playerCards];

  const opponentEvaluation = evaluateHand(opponentFullHand);
  const playerEvaluation = evaluateHand(playerFullHand);

  if (opponentEvaluation.rank > playerEvaluation.rank) {
    return `Opponent win with ${opponentEvaluation.name}`;
  } else if (opponentEvaluation.rank < playerEvaluation.rank) {
    return `Player win with ${playerEvaluation.name}`;
  } else {
    // 同等級的牌型，按數字最大值決定勝負
    const opponentMaxCard = Math.max(...opponentFullHand);
    const playerMaxCard = Math.max(...playerFullHand);

    if (opponentMaxCard > playerMaxCard) {
      return `Opponent win with ${opponentEvaluation.name}`;
    } else if (playerMaxCard > opponentMaxCard) {
      return `Player win with ${playerEvaluation.name}`;
    } else {
      return "Tie";
    }
  }
}

module.exports = { judgeTexasDuel };
