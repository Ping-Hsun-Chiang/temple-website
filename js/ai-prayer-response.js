/**
 * 六興堂 祈福內容 AI 安心回應
 * 
 * 使用方式：在 online_prayer.html 的 </body> 前加入
 * <script src="js/ai-prayer-response.js"></script>
 * 
 * 功能：
 * - 分析祈福內容的主題與情緒
 * - 產生溫和、莊重、個人化的安心回應
 * - 完全本地運算，不傳送任何個資到外部
 * - 不涉及醫療、法律、投資建議
 * - 不假裝神明發話，不做過度承諾
 */

(function () {
  'use strict';

  // ============================================================
  // ★ 主題偵測規則
  // ============================================================
  const THEMES = {
    health: {
      keywords: ['健康', '身體', '生病', '疾病', '開刀', '手術', '住院', '康復', '痊癒', '病痛', '平安', '醫', '癌', '檢查', '治療', '復健', '長壽'],
      label: '健康',
      icon: '💚'
    },
    family: {
      keywords: ['家人', '家庭', '爸', '媽', '父', '母', '孩子', '兒', '女', '阿公', '阿嬤', '阿祖', '爺', '奶', '親人', '闔家', '全家', '弟', '妹', '哥', '姊'],
      label: '家庭',
      icon: '🏠'
    },
    career: {
      keywords: ['工作', '事業', '升遷', '加薪', '面試', '求職', '轉職', '公司', '老闆', '同事', '職場', '生意', '創業', '賺錢', '收入'],
      label: '事業',
      icon: '💼'
    },
    study: {
      keywords: ['考試', '學業', '升學', '讀書', '成績', '大學', '研究所', '畢業', '學校', '功課', '國考', '證照', '上榜'],
      label: '學業',
      icon: '📖'
    },
    love: {
      keywords: ['感情', '姻緣', '另一半', '對象', '結婚', '婚姻', '戀愛', '桃花', '緣分', '伴侶', '老公', '老婆', '男友', '女友', '復合', '分手'],
      label: '姻緣',
      icon: '💕'
    },
    peace: {
      keywords: ['平安', '順遂', '順利', '安康', '出入', '旅行', '出國', '交通', '安全', '一切順利', '萬事'],
      label: '平安',
      icon: '🕊️'
    },
    wealth: {
      keywords: ['財運', '財富', '招財', '投資', '買房', '存錢', '貸款', '債', '經濟'],
      label: '財運',
      icon: '🧧'
    },
    grief: {
      keywords: ['思念', '離開', '過世', '往生', '天堂', '走了', '懷念', '保佑在天', '冥福'],
      label: '思念',
      icon: '🕯️'
    }
  };

  // ============================================================
  // ★ 情緒偵測
  // ============================================================
  const EMOTIONS = {
    worry: ['擔心', '害怕', '焦慮', '不安', '恐懼', '煩惱', '壓力', '緊張', '惶恐', '無助', '無奈'],
    hope: ['希望', '期待', '祈求', '願', '盼', '渴望', '夢想', '期盼', '想要'],
    gratitude: ['感謝', '感恩', '謝謝', '感激', '感念', '保佑', '庇佑'],
    sadness: ['難過', '傷心', '痛苦', '苦', '淚', '哭', '心痛', '捨不得', '遺憾', '失去']
  };

  // ============================================================
  // ★ 回應模板庫
  // 每個主題有多個模板，隨機選取以避免重複感
  // {theme} 會被替換為偵測到的主題文字
  // ============================================================
  const RESPONSE_TEMPLATES = {

    // --- 依主題 ---
    health: [
      '您為{who}的健康虔誠祈願，這份心意十分珍貴。\n\n身體是承載一切美好的根基，願這份祈福化為溫暖的力量，陪伴{who}度過每一天。廟方將誠心代為祈福，願身心安頓、日漸康泰。',
      '感受到您對{who}健康的深切關懷。\n\n生命中有些時刻需要多一點力量與信心，您願意為{who}點亮這盞祈願之燈，本身就是最溫暖的守護。願神明庇佑，平安康健。',
      '您的祈願裡承載著對{who}最真摯的關心。\n\n無論此刻正經歷什麼，每一份來自心底的祝福都是力量。廟方將虔誠為{who}誦經祈福，願一切漸漸好轉、身心安寧。',
    ],
    family: [
      '家人是生命中最珍貴的存在，您為家人的祈願讓人感到溫暖。\n\n願這份心意化為祝福，守護家中每一位成員。廟方將誠心代為祈福，願闔家平安、幸福圓滿。',
      '感受到您對家人深深的愛與牽掛。\n\n一個家庭的平安，來自每個人的互相惦念。您的祈願就是最好的守護。願神明庇佑，家和萬事興。',
    ],
    career: [
      '事業路上難免有挑戰與不確定，您願意靜下心來為自己祈願，本身就是一種智慧。\n\n願您在每一個選擇與努力中，都能找到方向與力量。廟方將誠心為您祈福，願前路開闊、貴人相助。',
      '您對事業的用心與努力，值得被看見。\n\n無論現在處於什麼階段，每一步認真走過的路都不會白費。願這份祈福為您帶來安定的力量，一步一步穩健前行。',
    ],
    study: [
      '為學業而來的您，辛苦了。\n\n讀書備考的路上，壓力與期待並存，能為自己祈一份安心，也是給自己最好的鼓勵。願您心定神清、有所收穫，廟方將誠心為您祈福。',
      '每一份為學業的努力都是在為未來播種。\n\n願這份祈福陪伴您在備考的日子裡保持安定，發揮最好的自己。金榜題名與否，認真走過的路本身就是收穫。',
    ],
    love: [
      '感情的事，有時候需要的不只是答案，更是一份安心。\n\n您願意為這段緣分誠心祈願，代表您是認真看待的。願這份心意化為祝福，無論結果如何，都能讓您心裡多一份平靜。',
      '緣分有時像風，看不見卻感受得到。\n\n您的祈願代表了對美好關係的期盼，這份心意本身就很珍貴。願神明庇佑，有緣人終會相遇，感情的路上少一些波折。',
    ],
    peace: [
      '平安看似簡單，卻是最踏實的祝福。\n\n您的祈願裡包含了對生活最樸實的期盼——出入平安、萬事順遂。廟方將誠心為您祈福，願每一天都是安穩的好日子。',
      '「平安」兩個字，承載的是對生活最深的珍惜。\n\n願這份祈福伴隨您的每一天，大小事情都能順心如意。神明慈悲護佑，歲歲平安。',
    ],
    wealth: [
      '財運的背後，是對更安穩生活的期盼。\n\n您的祈願廟方會誠心代為祈福。同時也相信，認真努力的人運氣不會太差，願您在踏實前行中，收穫應得的豐盛。',
    ],
    grief: [
      '感受到您心中的思念與不捨。\n\n離別雖然讓人心痛，但那些一起走過的日子、說過的話、分享的溫暖，都不會消失。它們會以另一種方式陪伴著您。\n\n廟方將誠心為您誦經祈福，願逝者安息、生者安心。',
      '思念一個人的心情，文字很難完全表達。\n\n但您願意將這份心意化為祈願，讓人感到您的真心與溫柔。願這份祈福為您帶來一些安慰，也為摯愛的人送上祝福。',
    ],

    // --- 通用（偵測不到特定主題時使用）---
    general: [
      '您的祈願已收到，廟方將誠心代為祈福誦經 🙏\n\n每一份來自心底的祝願，都有它的重量與意義。願這份虔誠為您帶來安定的力量，心中所盼，一步步實現。',
      '感謝您虔誠的祈願。\n\n生活中的每一個祈求，都代表著對美好的期盼。廟方將在神前為您誦經祈福，願神明慈悲庇佑，萬事順心。',
      '您的心意，廟方已恭敬收下 🙏\n\n無論是什麼樣的祈願，誠心本身就是最大的力量。願這份祈福為您帶來安心，日子一天比一天好。',
    ]
  };

  // --- 情緒加持語（附加在主回應之後）---
  const EMOTION_ADDITIONS = {
    worry: [
      '\n\n感受到您心中的擔憂，這是人之常情。有些事情需要時間，也需要信心。願您在等待中也能感到安穩。',
      '\n\n擔心的心情很能理解。把心中的不安化為祈願，已經是很好的疏導方式。願您漸漸放下焦慮，安心面對每一天。',
    ],
    sadness: [
      '\n\n難過的時候，允許自己慢慢來，不需要勉強自己馬上堅強。願這份祈福能給您一些陪伴與溫暖。',
      '\n\n感受到您心裡的不容易。有些傷痛需要時間去撫平，願您在這段路上不覺得孤單。',
    ],
    gratitude: [
      '\n\n您的感恩之心，讓人感到溫暖。懂得感謝的人，本身就是被祝福的。',
    ],
  };

  // ============================================================
  // 分析與生成邏輯
  // ============================================================

  /**
   * 偵測祈福內容的主題
   */
  function detectThemes(text) {
    const detected = [];
    for (const [key, theme] of Object.entries(THEMES)) {
      for (const kw of theme.keywords) {
        if (text.includes(kw)) {
          detected.push(key);
          break;
        }
      }
    }
    return [...new Set(detected)]; // 去重
  }

  /**
   * 偵測情緒傾向
   */
  function detectEmotions(text) {
    const detected = [];
    for (const [key, keywords] of Object.entries(EMOTIONS)) {
      for (const kw of keywords) {
        if (text.includes(kw)) {
          detected.push(key);
          break;
        }
      }
    }
    return [...new Set(detected)];
  }

  /**
   * 偵測祈福對象（自己 or 他人）
   */
  function detectTarget(text) {
    const otherKeywords = ['家人', '爸', '媽', '父', '母', '孩子', '兒子', '女兒', '阿公', '阿嬤', '老公', '老婆', '朋友', '他', '她', '哥', '姊', '弟', '妹', '先生', '太太'];
    for (const kw of otherKeywords) {
      if (text.includes(kw)) return '對方';
    }
    return '您';
  }

  /**
   * 從模板庫隨機選取一個
   */
  function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  /**
   * 主函式：產生安心回應
   * @param {string} prayerText - 使用者填寫的祈願內容
   * @param {string} prayerType - 使用者選擇的祈福類型（平安祈福/健康祈福/...）
   * @returns {object} { response: string, themes: string[], icon: string }
   */
  function generateResponse(prayerText, prayerType) {
    const text = (prayerText || '') + ' ' + (prayerType || '');
    const themes = detectThemes(text);
    const emotions = detectEmotions(text);
    const target = detectTarget(text);

    let response = '';
    let icon = '🙏';

    // 選擇主回應
    if (themes.length > 0) {
      const primaryTheme = themes[0];
      const templates = RESPONSE_TEMPLATES[primaryTheme] || RESPONSE_TEMPLATES.general;
      response = pickRandom(templates);
      icon = THEMES[primaryTheme].icon;
      // 替換 {who}
      response = response.replace(/\{who\}/g, target);
    } else {
      response = pickRandom(RESPONSE_TEMPLATES.general);
    }

    // 附加情緒回應
    if (emotions.includes('sadness')) {
      response += pickRandom(EMOTION_ADDITIONS.sadness);
    } else if (emotions.includes('worry')) {
      response += pickRandom(EMOTION_ADDITIONS.worry);
    } else if (emotions.includes('gratitude')) {
      response += pickRandom(EMOTION_ADDITIONS.gratitude);
    }

    return {
      response: response,
      themes: themes.map(t => THEMES[t]?.label || t),
      icon: icon
    };
  }

  // ============================================================
  // 注入 CSS
  // ============================================================
  const PRAYER_RESPONSE_CSS = `
    .prayer-ai-response {
      background: linear-gradient(135deg, rgba(201,168,76,0.06), rgba(139,26,26,0.04));
      border: 1px solid rgba(201,168,76,0.15);
      border-radius: 16px;
      padding: 32px 28px;
      margin-top: 28px;
      animation: prFadeIn 0.8s ease;
      position: relative;
      overflow: hidden;
    }
    .prayer-ai-response::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 3px;
      background: linear-gradient(90deg, transparent, rgba(201,168,76,0.4), transparent);
    }
    @keyframes prFadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .prayer-ai-header {
      display: flex; align-items: center; gap: 10px;
      margin-bottom: 20px;
    }
    .prayer-ai-header-icon { font-size: 1.6rem; }
    .prayer-ai-header-text {
      font-family: 'Noto Serif TC', serif;
      font-size: 1rem;
      color: #C9A84C;
      font-weight: 600;
    }
    .prayer-ai-themes {
      display: flex; gap: 8px; flex-wrap: wrap;
      margin-bottom: 16px;
    }
    .prayer-ai-theme-tag {
      font-size: 0.7rem;
      padding: 3px 10px;
      border-radius: 12px;
      background: rgba(201,168,76,0.08);
      color: #C9A84C;
      border: 1px solid rgba(201,168,76,0.15);
    }
    .prayer-ai-body {
      font-size: 0.9rem;
      color: #C4A882;
      line-height: 2;
      white-space: pre-line;
    }
    .prayer-ai-footer {
      margin-top: 20px;
      padding-top: 16px;
      border-top: 1px solid rgba(201,168,76,0.08);
      font-size: 0.75rem;
      color: #8B7355;
      text-align: center;
    }

    .prayer-ai-actions {
      display: flex; gap: 16px; justify-content: center; margin-top: 40px;
    }
    .prayer-ai-action-btn {
      padding: 12px 24px; background: transparent; border: 1px solid #C9A84C;
      border-radius: 8px; color: #C9A84C; font-size: 0.95rem; cursor: pointer;
      text-decoration: none; transition: all 0.3s; font-family: 'Noto Sans TC', sans-serif;
    }
    .prayer-ai-action-btn:hover {
      background: rgba(201,168,76,0.1); color: #E8D48B;
    }

    /* 過場動畫 */
    .prayer-ai-loading {
      text-align: center;
      padding: 40px 24px;
      animation: prFadeIn 0.5s ease;
    }
    .prayer-ai-loading-icon {
      font-size: 2.5rem;
      animation: prPulse 1.5s ease-in-out infinite;
      margin-bottom: 16px;
    }
    @keyframes prPulse {
      0%, 100% { opacity: 0.6; transform: scale(1); }
      50% { opacity: 1; transform: scale(1.1); }
    }
    .prayer-ai-loading-text {
      color: #C4A882;
      font-size: 0.9rem;
      font-family: 'Noto Serif TC', serif;
    }
  `;

  // ============================================================
  // UI 生成函式
  // ============================================================

  /**
   * 顯示載入動畫
   * @param {HTMLElement} container - 要插入的容器
   */
  function showLoading(container) {
    const div = document.createElement('div');
    div.className = 'prayer-ai-loading';
    div.id = 'prayerAiLoading';
    div.innerHTML = `
      <div class="prayer-ai-loading-icon">🙏</div>
      <div class="prayer-ai-loading-text">廟方正為您虔誠祈福中...</div>
    `;
    container.appendChild(div);
  }

  /**
   * 顯示回應結果
   * @param {HTMLElement} container - 要插入的容器
   * @param {object} result - generateResponse 的回傳值
   */
  function showResponse(container, result) {
    // 移除載入動畫
    const loading = document.getElementById('prayerAiLoading');
    if (loading) loading.remove();

    const div = document.createElement('div');
    div.className = 'prayer-ai-response';

    let themeTags = '';
    if (result.themes.length > 0) {
      themeTags = '<div class="prayer-ai-themes">' +
        result.themes.map(t => `<span class="prayer-ai-theme-tag">${t}</span>`).join('') +
        '</div>';
    }

    div.innerHTML = `
      <div class="prayer-ai-header">
        <span class="prayer-ai-header-icon">${result.icon}</span>
        <span class="prayer-ai-header-text">六興堂 誠心祝福</span>
      </div>
      ${themeTags}
      <div class="prayer-ai-body">${result.response}</div>
      <div class="prayer-ai-footer">
        此回應由六興堂祈福系統自動產生，僅供安心參考。<br>
        廟方將依您的祈願內容代為誦經祈福。
      </div>
    `;
    container.appendChild(div);
  }

  // ============================================================
  // 注入 CSS 並暴露 API
  // ============================================================
  const style = document.createElement('style');
  style.textContent = PRAYER_RESPONSE_CSS;
  document.head.appendChild(style);

  // 暴露到全域，讓 online_prayer.html 可以呼叫
  window.PrayerAI = {
    generate: generateResponse,
    showLoading: showLoading,
    showResponse: showResponse
  };

})();
