/**
 * 六興堂 AI 廟務小幫手
 * 
 * 使用方式：在任何頁面的 </body> 前加入
 * <script src="js/ai-chatbot.js"></script>
 * 
 * 特色：
 * - 本地知識庫 + 模糊比對，完全免費、不需任何 API
 * - 自動注入 CSS 與 HTML，不影響現有頁面
 * - 手機版自適應
 * - 宗教語氣溫和莊重
 * - 無法回答時溫和引導聯繫廟方
 */

(function () {
  'use strict';

  // ============================================================
  // ★ 知識庫 — 修改這裡來更新回答內容
  // 每筆資料：keywords（觸發關鍵詞）、answer（回答）、link（選填，引導連結）
  // ============================================================
  const KNOWLEDGE = [
    // --- 基本資訊 ---
    {
      keywords: ['在哪', '地址', '位置', '哪裡', '地點', '怎麼去', '交通', '路線', '開車', '導航', '公車', '客運'],
      answer: '六興堂位於 <b>臺南市下營區東興一街125巷5號</b>。\n\n🚗 自行開車可使用 Google Maps 導航「下營過港寮六興堂」。\n\n歡迎蒞臨參拜！',
      link: { text: '查看地圖與交通資訊', url: 'index.html#contact' }
    },
    {
      keywords: ['電話', '聯絡', '聯繫', '打電話', '手機'],
      answer: '您可以透過以下方式聯繫廟方：\n\n📞 電話：(06) 667-9086\n📘 Facebook 粉專：搜尋「下營庄六興堂」\n📷 Instagram：@liu_xing_tang__',
      link: { text: '查看聯絡資訊', url: 'index.html#contact' }
    },
    {
      keywords: ['開放', '時間', '營業', '幾點', '參拜時間', '什麼時候開'],
      answer: '六興堂開放時間為 <b>每日 06:00 – 21:00</b>，全年無休。\n\n歡迎隨時蒞臨參拜，神明慈悲護佑。'
    },
    {
      keywords: ['介紹', '關於', '沿革', '歷史', '什麼廟', '六興堂是'],
      answer: '六興堂位於臺南市下營區過港寮，主祀 <b>北極玄天六上帝</b>，配祀康趙二元帥、觀音佛祖、觀音二佛祖、軍師伍關大帝、黑虎大將軍等神尊。\n\n長年庇佑地方百姓，為社區重要的信仰與文化中心。',
      link: { text: '了解宮廟沿革', url: 'index.html#about' }
    },

    // --- 主祀神明 ---
    {
      keywords: ['玄天', '上帝', '主祀', '主神', '拜什麼', '供奉'],
      answer: '六興堂主祀 <b>北極玄天六上帝</b>，又稱玄天上帝，為道教護法神，掌管北方，威靈顯赫，庇佑蒼生。\n\n另有主祀 <b>康趙二元帥</b>，威武護民。',
      link: { text: '查看神明介紹', url: 'index.html#deities' }
    },
    {
      keywords: ['神明', '配祀', '觀音', '黑虎', '軍師', '康趙'],
      answer: '六興堂供奉的神尊包括：\n\n🔹 主祀：北極玄天六上帝、康趙二元帥\n🔹 配祀：觀音佛祖、觀音二佛祖、軍師伍關大帝、黑虎大將軍',
      link: { text: '查看完整神明介紹', url: 'index.html#deities' }
    },

    // --- 線上服務 ---
    {
      keywords: ['服務', '線上', '可以做什麼', '有什麼功能', '網站功能'],
      answer: '六興堂目前提供三項線上服務：\n\n🏮 <b>線上點燈</b>：光明燈、太歲燈、文昌燈、財神燈\n🙏 <b>線上祈福</b>：由廟方代為祈福誦經\n💛 <b>隨喜捐款</b>：護持廟務與公益活動',
      link: { text: '前往線上服務', url: 'index.html#services' }
    },

    // --- 點燈相關 ---
    {
      keywords: ['點燈', '燈種', '什麼燈', '有幾種燈'],
      answer: '六興堂提供四種燈種：\n\n💡 <b>光明燈</b>：照亮前途、消災解厄、闔家平安\n⭐ <b>太歲燈</b>：安太歲、化煞氣、逢凶化吉\n📖 <b>文昌燈</b>：金榜題名、學業進步\n🧧 <b>財神燈</b>：招財進寶、事業興旺\n\n每盞 NT$ 600 / 年',
      link: { text: '前往線上點燈', url: 'online_lighting.html' }
    },
    {
      keywords: ['光明燈'],
      answer: '💡 <b>光明燈</b> 的功效為照亮前途、消災解厄、闔家平安。\n\n適合為自己或家人祈求整年平安順遂。每盞 NT$ 600 / 年。',
      link: { text: '前往點燈', url: 'online_lighting.html' }
    },
    {
      keywords: ['太歲燈', '安太歲', '犯太歲'],
      answer: '⭐ <b>太歲燈</b> 適合當年沖犯太歲的生肖，可安太歲、化煞氣、逢凶化吉。\n\n每盞 NT$ 600 / 年。',
      link: { text: '前往點燈', url: 'online_lighting.html' }
    },
    {
      keywords: ['文昌燈', '考試', '學業', '升學', '讀書'],
      answer: '📖 <b>文昌燈</b> 適合學生或準備考試者，祈求金榜題名、學業進步、考試順利。\n\n每盞 NT$ 600 / 年。',
      link: { text: '前往點燈', url: 'online_lighting.html' }
    },
    {
      keywords: ['財神燈', '財運', '事業', '生意', '賺錢'],
      answer: '🧧 <b>財神燈</b> 適合祈求招財進寶、事業興旺、財源廣進。\n\n每盞 NT$ 600 / 年。',
      link: { text: '前往點燈', url: 'online_lighting.html' }
    },
    {
      keywords: ['多少錢', '費用', '價格', '價錢', '怎麼付', '匯款', '付款'],
      answer: '目前點燈費用為每盞 <b>NT$ 600 / 年</b>。\n\n付款方式為 <b>銀行匯款</b>，在線上填寫資料後，系統會提供匯款帳號。匯款完成後，請將收據截圖傳至廟方 Facebook 粉專或 LINE 確認即可。',
      link: { text: '前往線上點燈', url: 'online_lighting.html' }
    },

    // --- 祈福相關 ---
    {
      keywords: ['祈福', '祈願', '誦經', '代為祈福'],
      answer: '🙏 <b>線上祈福</b> 服務讓無法親臨本宮的信眾，也能獲得神明庇佑。\n\n您只需填寫祈福類型與祈願內容，廟方將代為在神前誦經祈福。\n\n可選擇：平安祈福、健康祈福、事業學業、姻緣感情。',
      link: { text: '前往線上祈福', url: 'online_prayer.html' }
    },

    // --- 捐款相關 ---
    {
      keywords: ['捐款', '捐錢', '樂捐', '贊助', '油香', '添油香'],
      answer: '💛 <b>隨喜捐款</b> 項目包括：\n\n🪷 油香隨喜\n🏛️ 寺廟維護\n🎊 年度法會活動護持\n\n可自選金額，匯款後將收據截圖傳至廟方確認。',
      link: { text: '前往隨喜捐款', url: 'online_donation.html' }
    },
    {
      keywords: ['收據', '發票', '憑證', '報稅'],
      answer: '關於收據，您在填寫捐款或點燈資料時，可以選擇：\n\n📌 <b>不需要</b>：功德無量\n📌 <b>廟中領取</b>：放置廟中，擇日親自領取\n📌 <b>郵寄收據</b>：寄送至您填寫的地址\n\n如有其他需求，歡迎直接聯繫廟方。'
    },

    // --- 活動相關 ---
    {
      keywords: ['活動', '法會', '慶典', '公告', '最新消息', '節慶'],
      answer: '六興堂定期舉辦法會、慶典等活動。\n\n您可以在官網首頁的「活動公告」區查看最新活動資訊，也可以追蹤我們的 Facebook 粉專獲得即時更新。',
      link: { text: '查看活動公告', url: 'index.html#events' }
    },

    // --- 照片 ---
    {
      keywords: ['照片', '相片', '圖片', '相簿', '廟的照片'],
      answer: '您可以在官網的「相片集錦」區欣賞六興堂的廟宇風貌、法會實況、慶典紀錄等照片。',
      link: { text: '瀏覽相片集錦', url: 'index.html#gallery' }
    },

    // --- 社群 ---
    {
      keywords: ['facebook', 'fb', '粉專', 'ig', 'instagram', '社群', '追蹤'],
      answer: '歡迎追蹤六興堂的社群帳號：\n\n📘 <b>Facebook</b>：搜尋「下營庄六興堂」\n📷 <b>Instagram</b>：@liu_xing_tang__\n\n隨時掌握最新活動與消息！'
    },

    // --- 問候 ---
    {
      keywords: ['你好', '哈囉', '嗨', '您好', 'hi', 'hello', '安安'],
      answer: '您好！歡迎來到六興堂 🙏\n\n我是廟務小幫手，可以為您介紹廟宇資訊、線上服務、交通方式等。\n\n請問有什麼我可以幫您的嗎？'
    },
    {
      keywords: ['謝謝', '感謝', '感恩', '多謝', '3q'],
      answer: '不客氣！很高興能為您服務 🙏\n\n如有其他問題，隨時都可以詢問。\n\n願神明庇佑，平安順遂。'
    },
  ];

  // 無法回答時的回覆（隨機選一個）
  const FALLBACK_RESPONSES = [
    '感謝您的提問 🙏\n\n這個問題我目前無法確切回答，建議您直接聯繫廟方，會有更詳細的說明：\n\n📞 電話：(06) 667-9086\n📘 Facebook：搜尋「下營庄六興堂」',
    '謝謝您的詢問。\n\n關於這個問題，建議您直接與廟方聯繫以獲得最準確的資訊：\n\n📞 電話：(06) 667-9086\n📘 Facebook：搜尋「下營庄六興堂」',
    '這個問題我不太確定，怕給您錯誤的資訊 🙏\n\n建議您可以：\n1. 查看首頁的各區塊資訊\n2. 直接致電廟方 (06) 667-9086\n3. 到 Facebook 粉專留言詢問',
  ];

  // 引導性建議（新對話開始時顯示）
  const SUGGESTIONS = [
    '六興堂在哪裡？',
    '有哪些線上服務？',
    '燈種有什麼差別？',
    '如何線上點燈？',
  ];

  // ============================================================
  // 比對邏輯
  // ============================================================
  function findBestMatch(input) {
    const query = input.toLowerCase().replace(/[？?！!。，、\s]/g, '');
    if (query.length === 0) return null;

    let bestMatch = null;
    let bestScore = 0;

    for (const item of KNOWLEDGE) {
      let score = 0;
      for (const kw of item.keywords) {
        const kwLower = kw.toLowerCase();
        // 完全包含
        if (query.includes(kwLower)) {
          score += kwLower.length * 3;
        }
        // 部分重疊（模糊）
        else {
          let overlap = 0;
          for (const char of kwLower) {
            if (query.includes(char)) overlap++;
          }
          if (overlap >= kwLower.length * 0.6 && kwLower.length >= 2) {
            score += overlap;
          }
        }
      }
      if (score > bestScore) {
        bestScore = score;
        bestMatch = item;
      }
    }

    // 門檻：至少要有一定的匹配分數
    return bestScore >= 2 ? bestMatch : null;
  }

  function getResponse(input) {
    const match = findBestMatch(input);
    if (match) {
      return { answer: match.answer, link: match.link || null };
    }
    // 隨機選一個 fallback
    const fb = FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)];
    return { answer: fb, link: { text: '回到首頁', url: 'index.html' } };
  }

  // ============================================================
  // 注入 CSS
  // ============================================================
  const CHATBOT_CSS = `
    #temple-chatbot-toggle {
      position: fixed; bottom: 24px; right: 24px; z-index: 8000;
      width: 60px; height: 60px; border-radius: 50%;
      background: linear-gradient(135deg, #A07C28, #C9A84C);
      border: none; cursor: pointer;
      box-shadow: 0 4px 20px rgba(201,168,76,0.35);
      display: flex; align-items: center; justify-content: center;
      font-size: 1.6rem; transition: all 0.3s;
    }
    #temple-chatbot-toggle:hover { transform: scale(1.08); box-shadow: 0 6px 28px rgba(201,168,76,0.5); }
    #temple-chatbot-toggle .badge {
      position: absolute; top: -2px; right: -2px;
      width: 18px; height: 18px; border-radius: 50%;
      background: #B22222; display: none;
      align-items: center; justify-content: center;
      font-size: 0.6rem; color: #fff;
    }

    #temple-chatbot-panel {
      position: fixed; bottom: 96px; right: 24px; z-index: 8001;
      width: 360px; max-height: 520px;
      background: #1A0A0A; border: 1px solid rgba(201,168,76,0.2);
      border-radius: 16px; overflow: hidden;
      display: none; flex-direction: column;
      box-shadow: 0 12px 48px rgba(0,0,0,0.6);
      font-family: 'Noto Sans TC', sans-serif;
    }
    #temple-chatbot-panel.open { display: flex; animation: cbSlideUp 0.3s ease; }
    @keyframes cbSlideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }

    .cb-header {
      padding: 16px 20px; display: flex; align-items: center; justify-content: space-between;
      background: linear-gradient(135deg, #5C0A0A, #8B1A1A);
      border-bottom: 1px solid rgba(201,168,76,0.2);
    }
    .cb-header-left { display: flex; align-items: center; gap: 10px; }
    .cb-header-icon { font-size: 1.4rem; }
    .cb-header-title { color: #E8D48B; font-family: 'Noto Serif TC', serif; font-size: 0.95rem; font-weight: 600; letter-spacing: 0.05em; }
    .cb-header-sub { color: rgba(245,230,200,0.5); font-size: 0.65rem; margin-top: 2px; }
    .cb-close { background: none; border: none; color: rgba(245,230,200,0.5); font-size: 1.4rem; cursor: pointer; padding: 4px; }
    .cb-close:hover { color: #E8D48B; }

    .cb-messages {
      flex: 1; overflow-y: auto; padding: 16px;
      display: flex; flex-direction: column; gap: 12px;
      max-height: 340px; min-height: 200px;
      scrollbar-width: thin; scrollbar-color: rgba(201,168,76,0.2) transparent;
    }

    .cb-msg { max-width: 88%; padding: 12px 16px; border-radius: 12px; font-size: 0.85rem; line-height: 1.7; word-break: break-word; }
    .cb-msg-bot { align-self: flex-start; background: #1E0E0E; border: 1px solid rgba(201,168,76,0.08); color: #C4A882; border-bottom-left-radius: 4px; }
    .cb-msg-user { align-self: flex-end; background: rgba(201,168,76,0.12); color: #F5E6C8; border-bottom-right-radius: 4px; }
    .cb-msg-bot b { color: #C9A84C; }
    .cb-msg-link {
      display: inline-block; margin-top: 10px; padding: 6px 14px;
      background: rgba(201,168,76,0.1); border: 1px solid rgba(201,168,76,0.2);
      border-radius: 6px; color: #C9A84C; font-size: 0.78rem;
      text-decoration: none; transition: background 0.2s;
    }
    .cb-msg-link:hover { background: rgba(201,168,76,0.2); }

    .cb-suggestions { display: flex; flex-wrap: wrap; gap: 8px; padding: 0 16px 12px; }
    .cb-suggest-btn {
      padding: 6px 14px; background: rgba(201,168,76,0.06);
      border: 1px solid rgba(201,168,76,0.15); border-radius: 20px;
      color: #C4A882; font-size: 0.75rem; cursor: pointer;
      font-family: 'Noto Sans TC', sans-serif; transition: all 0.2s;
    }
    .cb-suggest-btn:hover { border-color: #C9A84C; color: #C9A84C; background: rgba(201,168,76,0.1); }

    .cb-input-area {
      padding: 12px 16px; border-top: 1px solid rgba(201,168,76,0.1);
      display: flex; gap: 10px; align-items: center; background: #140808;
    }
    .cb-input {
      flex: 1; padding: 10px 14px; background: #1E0E0E;
      border: 1px solid rgba(201,168,76,0.12); border-radius: 8px;
      color: #F5E6C8; font-size: 0.85rem; outline: none;
      font-family: 'Noto Sans TC', sans-serif;
    }
    .cb-input:focus { border-color: #C9A84C; }
    .cb-input::placeholder { color: #8B7355; }
    .cb-send {
      width: 38px; height: 38px; border-radius: 50%; border: none;
      background: linear-gradient(135deg, #A07C28, #C9A84C);
      color: #1A0A0A; font-size: 1rem; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      transition: transform 0.2s; flex-shrink: 0;
    }
    .cb-send:hover { transform: scale(1.08); }

    .cb-typing { align-self: flex-start; padding: 10px 16px; }
    .cb-typing-dots { display: flex; gap: 4px; }
    .cb-typing-dots span { width: 6px; height: 6px; border-radius: 50%; background: #8B7355; animation: cbDot 1.2s infinite; }
    .cb-typing-dots span:nth-child(2) { animation-delay: 0.2s; }
    .cb-typing-dots span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes cbDot { 0%,60%,100% { opacity: 0.3; } 30% { opacity: 1; } }

    /* 手機版 */
    @media (max-width: 500px) {
      #temple-chatbot-panel { right: 0; bottom: 0; left: 0; width: 100%; max-height: 100vh; border-radius: 16px 16px 0 0; }
      #temple-chatbot-toggle { bottom: 16px; right: 16px; width: 54px; height: 54px; font-size: 1.4rem; }
      .cb-messages { max-height: calc(100vh - 200px); }
    }
  `;

  // ============================================================
  // 注入 HTML
  // ============================================================
  function injectUI() {
    // CSS
    const style = document.createElement('style');
    style.textContent = CHATBOT_CSS;
    document.head.appendChild(style);

    // 浮動按鈕
    const toggle = document.createElement('button');
    toggle.id = 'temple-chatbot-toggle';
    toggle.setAttribute('aria-label', '開啟廟務小幫手');
    toggle.innerHTML = '🙏';
    document.body.appendChild(toggle);

    // 聊天面板
    const panel = document.createElement('div');
    panel.id = 'temple-chatbot-panel';
    panel.innerHTML = `
      <div class="cb-header">
        <div class="cb-header-left">
          <span class="cb-header-icon">🏮</span>
          <div>
            <div class="cb-header-title">廟務小幫手</div>
            <div class="cb-header-sub">六興堂智慧導覽</div>
          </div>
        </div>
        <button class="cb-close" aria-label="關閉">✕</button>
      </div>
      <div class="cb-messages" id="cbMessages"></div>
      <div class="cb-suggestions" id="cbSuggestions"></div>
      <div class="cb-input-area">
        <input class="cb-input" id="cbInput" type="text" placeholder="請輸入您的問題..." maxlength="200">
        <button class="cb-send" id="cbSend" aria-label="送出">➤</button>
      </div>
    `;
    document.body.appendChild(panel);

    // 事件綁定
    toggle.addEventListener('click', () => {
      panel.classList.toggle('open');
      if (panel.classList.contains('open') && document.getElementById('cbMessages').children.length === 0) {
        showWelcome();
      }
    });
    panel.querySelector('.cb-close').addEventListener('click', () => panel.classList.remove('open'));
    document.getElementById('cbSend').addEventListener('click', handleSend);
    document.getElementById('cbInput').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleSend();
    });
  }

  // ============================================================
  // 對話邏輯
  // ============================================================
  function showWelcome() {
    addBotMessage('您好！歡迎來到六興堂 🙏\n\n我是廟務小幫手，可以為您介紹廟宇資訊、線上服務、交通方式等。\n\n您可以直接輸入問題，或點擊下方的常見問題：');
    showSuggestions();
  }

  function showSuggestions() {
    const container = document.getElementById('cbSuggestions');
    container.innerHTML = '';
    SUGGESTIONS.forEach(text => {
      const btn = document.createElement('button');
      btn.className = 'cb-suggest-btn';
      btn.textContent = text;
      btn.addEventListener('click', () => {
        addUserMessage(text);
        container.innerHTML = '';
        processQuestion(text);
      });
      container.appendChild(btn);
    });
  }

  function handleSend() {
    const input = document.getElementById('cbInput');
    const text = input.value.trim();
    if (!text) return;
    input.value = '';
    document.getElementById('cbSuggestions').innerHTML = '';
    addUserMessage(text);
    processQuestion(text);
  }

  function processQuestion(text) {
    // 顯示打字動畫
    const typing = showTyping();
    // 模擬思考延遲（讓體驗更自然）
    const delay = 600 + Math.random() * 800;
    setTimeout(() => {
      typing.remove();
      const result = getResponse(text);
      addBotMessage(result.answer, result.link);
    }, delay);
  }

  function addUserMessage(text) {
    const container = document.getElementById('cbMessages');
    const div = document.createElement('div');
    div.className = 'cb-msg cb-msg-user';
    div.textContent = text;
    container.appendChild(div);
    scrollToBottom();
  }

  function addBotMessage(text, link) {
    const container = document.getElementById('cbMessages');
    const div = document.createElement('div');
    div.className = 'cb-msg cb-msg-bot';
    // 支援換行與 HTML（粗體）
    div.innerHTML = text.replace(/\n/g, '<br>');
    if (link) {
      const a = document.createElement('a');
      a.className = 'cb-msg-link';
      a.href = link.url;
      a.textContent = link.text + ' →';
      div.appendChild(document.createElement('br'));
      div.appendChild(a);
    }
    container.appendChild(div);
    scrollToBottom();
  }

  function showTyping() {
    const container = document.getElementById('cbMessages');
    const div = document.createElement('div');
    div.className = 'cb-msg cb-msg-bot cb-typing';
    div.innerHTML = '<div class="cb-typing-dots"><span></span><span></span><span></span></div>';
    container.appendChild(div);
    scrollToBottom();
    return div;
  }

  function scrollToBottom() {
    const container = document.getElementById('cbMessages');
    setTimeout(() => { container.scrollTop = container.scrollHeight; }, 50);
  }

  // ============================================================
  // 初始化
  // ============================================================
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectUI);
  } else {
    injectUI();
  }

})();
