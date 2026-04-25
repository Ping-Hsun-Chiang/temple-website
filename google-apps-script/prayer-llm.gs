/**
 * 六興堂 線上祈福 — Gemini LLM 代理
 *
 * 部署步驟：
 * 1. 前往 https://script.google.com 建立新專案，貼上此程式碼
 * 2. 左側選單 → 「專案設定」→「指令碼屬性」→ 新增屬性：
 *    名稱：GEMINI_API_KEY  值：你的 Gemini API 金鑰
 *    （取得 API 金鑰：https://aistudio.google.com/app/apikey）
 * 3. 點選「部署」→「新增部署作業」→ 類型選「網路應用程式」
 *    - 以下列身分執行：我
 *    - 誰可以存取：所有人
 * 4. 複製部署後產生的網址，填入 js/ai-prayer-response.js 的 PRAYER_API_URL
 */

const SYSTEM_PROMPT = `你是「六興堂誠心回應系統」，負責在信眾完成線上祈福後，給予一段溫暖的回應。

六興堂位於臺南市下營區，主祀北極玄天六上帝與康趙二元帥，為地方信仰中心，香火鼎盛，庇佑鄉里數十年。

請依照以下原則撰寫回應：

【語氣】
- 溫暖、莊重，帶有人情味，如同廟方長輩關切信眾
- 不要太正式官僚，也不要過度親暱
- 帶有宗教的沉靜感，但不說教

【內容要求】
- 必須回應信眾具體說出來的事情，讓對方感受到被理解而非制式祝福
- 視內容給予鼓勵或安慰，若對方提到擔憂，先承接情緒再給予力量
- 可以引用一句道家或佛家的智慧語句（需貼切，非硬湊）
- 結尾給予一段簡短、真誠的祝福語

【嚴格限制】
- 絕對不可以第一人稱神明身分說話（例如「吾乃玄天上帝」「神明曰」等）
- 不可做出醫療、法律、投資的具體建議
- 不可做出「一定會成功」「保證實現」等過度承諾
- 長度控制在 150 至 250 字之間
- 必須使用繁體中文
- 不要使用任何 Markdown 格式符號（不要用 **、##、- 等）`;

// ============================================================
// HTTP 進入點
// ============================================================

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const responseText = callGemini(data);
    return ContentService
      .createTextOutput(JSON.stringify({ success: true, response: responseText }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    Logger.log('Error: ' + err.message);
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// OPTIONS preflight（瀏覽器 CORS 預檢）
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok' }))
    .setMimeType(ContentService.MimeType.JSON);
}

// ============================================================
// Gemini API 呼叫
// ============================================================

function callGemini({ prayerType, wish, name }) {
  const apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
  if (!apiKey) throw new Error('GEMINI_API_KEY 未設定');

  const userMessage = [
    `信眾姓名：${name || '信眾'}`,
    `祈福類型：${prayerType}`,
    `心裡的話：${wish}`
  ].join('\n');

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const payload = {
    system_instruction: {
      parts: [{ text: SYSTEM_PROMPT }]
    },
    contents: [
      { role: 'user', parts: [{ text: userMessage }] }
    ],
    generationConfig: {
      temperature: 0.88,
      maxOutputTokens: 512,
      topP: 0.92
    }
  };

  const response = UrlFetchApp.fetch(url, {
    method: 'POST',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  });

  const result = JSON.parse(response.getContentText());

  if (result.error) {
    throw new Error('Gemini API 錯誤：' + result.error.message);
  }

  return result.candidates[0].content.parts[0].text.trim();
}
