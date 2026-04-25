/**
 * 六興堂 線上祈福 — LLM 回應模組
 *
 * 使用方式：在 online_prayer.html 的 </body> 前加入
 * <script src="js/ai-prayer-response.js"></script>
 *
 * 依賴：部署 google-apps-script/prayer-llm.gs 並將網址填入下方 PRAYER_API_URL
 */

(function () {
  'use strict';

  // ============================================================
  // ★ 填入你的 Google Apps Script 部署網址
  // ============================================================
  const PRAYER_API_URL = 'https://script.google.com/macros/s/AKfycbyeBsqpMH1nwiF8SNV_kB0eZfKJtHs6hhNY8Z_wmpF2yPSdYStIINAlgQig7BVzkCUcQA/exec'; // 例：'https://script.google.com/macros/s/AKfy.../exec'

  // ============================================================
  // 回應卡片的圖示對應（依祈福類型）
  // ============================================================
  const TYPE_ICON = {
    '平安祈福': '🏮',
    '健康祈福': '🌿',
    '事業學業': '✍️',
    '姻緣感情': '🌸'
  };

  // ============================================================
  // 網路異常時的備用靜態回應
  // ============================================================
  const FALLBACK_RESPONSES = [
    '您的心意，廟方已恭敬收下。\n\n誠心的祈願，如清香裊裊上達天聽，每一份來自心底的祝願都有它的重量。願這份虔誠為您帶來安定的力量，心中所盼，一步步實現。\n\n願神明庇佑，平安順心。',
    '感謝您在此靜下心來，向神明傾訴心中所願。\n\n古人云：「心誠則靈」，您的一份誠意，已化作最真摯的祈願。廟方將代為在神前誦經，願您所求所盼，在踏實前行中逐漸實現。\n\n願您日日安康，事事順遂。',
    '您的祈願已化作清香，悄悄上達天聽。\n\n生命中有些時刻，需要的不是答案，而是一份安心與力量。願這份祈福陪伴您面對每一天，在努力的路上不覺孤單。\n\n玄天六上帝慈悲護佑，願您平安喜樂。'
  ];

  // ============================================================
  // 主 API 呼叫（回傳 Promise）
  // ============================================================

  async function generate(wish, prayerType, name) {
    if (!PRAYER_API_URL) {
      return buildResult(randomFallback(), prayerType);
    }

    const body = JSON.stringify({ prayerType, wish, name: name || '' });

    const response = await fetch(PRAYER_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body
    });

    const data = await response.json();

    if (!data.success || !data.response) {
      throw new Error('API 回傳無效');
    }

    return buildResult(data.response, prayerType);
  }

  function buildResult(responseText, prayerType) {
    return {
      response: responseText,
      icon: TYPE_ICON[prayerType] || '🙏',
      prayerType: prayerType || ''
    };
  }

  function randomFallback() {
    return FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)];
  }

  function getFallback(prayerType) {
    return buildResult(randomFallback(), prayerType);
  }

  // ============================================================
  // CSS 注入
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
      to   { opacity: 1; transform: translateY(0); }
    }
    .prayer-ai-header {
      display: flex; align-items: center; gap: 10px;
      margin-bottom: 20px;
    }
    .prayer-ai-header-icon { font-size: 1.6rem; }
    .prayer-ai-header-text {
      font-family: 'Noto Serif TC', serif;
      font-size: 1rem; color: #C9A84C; font-weight: 600;
    }
    .prayer-ai-type-tag {
      display: inline-block;
      font-size: 0.72rem; padding: 3px 12px; border-radius: 12px;
      background: rgba(201,168,76,0.08); color: #C9A84C;
      border: 1px solid rgba(201,168,76,0.15); margin-bottom: 16px;
    }
    .prayer-ai-body {
      font-size: 0.92rem; color: #C4A882;
      line-height: 2.1; white-space: pre-line;
    }
    .prayer-ai-footer {
      margin-top: 20px; padding-top: 16px;
      border-top: 1px solid rgba(201,168,76,0.08);
      font-size: 0.75rem; color: #8B7355; text-align: center;
    }

    /* 載入動畫 */
    .prayer-ai-loading {
      text-align: center; padding: 48px 24px;
      animation: prFadeIn 0.5s ease;
    }
    .prayer-ai-loading-icon {
      font-size: 2.8rem; margin-bottom: 20px;
      animation: prPulse 1.8s ease-in-out infinite;
    }
    @keyframes prPulse {
      0%, 100% { opacity: 0.5; transform: scale(1); }
      50%       { opacity: 1;   transform: scale(1.12); }
    }
    .prayer-ai-loading-text {
      color: #C4A882; font-size: 0.9rem;
      font-family: 'Noto Serif TC', serif; letter-spacing: 0.08em;
    }
    .prayer-ai-loading-dots::after {
      content: '';
      animation: loadingDots 1.5s steps(4, end) infinite;
    }
    @keyframes loadingDots {
      0%   { content: ''; }
      25%  { content: '．'; }
      50%  { content: '．．'; }
      75%  { content: '．．．'; }
      100% { content: ''; }
    }
  `;

  // ============================================================
  // UI 函式
  // ============================================================

  function showLoading(container) {
    const div = document.createElement('div');
    div.className = 'prayer-ai-loading';
    div.id = 'prayerAiLoading';
    div.innerHTML = `
      <div class="prayer-ai-loading-icon">🙏</div>
      <div class="prayer-ai-loading-text">
        神明正感受您的心意<span class="prayer-ai-loading-dots"></span>
      </div>
    `;
    container.appendChild(div);
  }

  function showResponse(container, result) {
    const loading = document.getElementById('prayerAiLoading');
    if (loading) loading.remove();

    const div = document.createElement('div');
    div.className = 'prayer-ai-response';
    div.innerHTML = `
      <div class="prayer-ai-header">
        <span class="prayer-ai-header-icon">${result.icon}</span>
        <span class="prayer-ai-header-text">六興堂 誠心祝福</span>
      </div>
      ${result.prayerType ? `<div class="prayer-ai-type-tag">${result.prayerType}</div>` : ''}
      <div class="prayer-ai-body">${escapeHtml(result.response)}</div>
      <div class="prayer-ai-footer">
        此回應由六興堂祈福系統產生，僅供安心參考。<br>
        廟方將依您的祈願內容代為誦經祈福。
      </div>
    `;
    container.appendChild(div);
  }

  function escapeHtml(text) {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\n/g, '<br>');
  }

  // ============================================================
  // 注入 CSS 並暴露 API
  // ============================================================
  const style = document.createElement('style');
  style.textContent = PRAYER_RESPONSE_CSS;
  document.head.appendChild(style);

  window.PrayerAI = { generate, showLoading, showResponse, getFallback };

})();
