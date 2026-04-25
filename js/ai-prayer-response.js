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
  const PRAYER_API_URL = 'https://script.google.com/macros/s/AKfycby0xOkqWHoK7RDU_Wiu1YHNai_GAHW24N0iImQuGGLLL00OPeTwZHoCnaVy6p-lqDXX6Q/exec'; // 例：'https://script.google.com/macros/s/AKfy.../exec'

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
  // 主 API 呼叫（回傳 Promise）
  // ============================================================

  async function generate(wish, prayerType, name) {
    if (!PRAYER_API_URL) {
      throw new Error('PRAYER_API_URL 尚未設定');
    }

    const body = JSON.stringify({ prayerType, wish, name: name || '' });

    const response = await fetch(PRAYER_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body
    });

    const data = await response.json();

    if (!data.success || !data.response) {
      throw new Error(data.error || 'API 回傳無效');
    }

    return {
      response: data.response,
      icon: TYPE_ICON[prayerType] || '🙏',
      prayerType: prayerType || ''
    };
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

    /* 錯誤訊息 */
    .prayer-ai-error {
      background: rgba(139,26,26,0.08);
      border: 1px solid rgba(139,26,26,0.25);
      border-radius: 12px;
      padding: 28px 24px;
      margin-top: 28px;
      text-align: center;
      animation: prFadeIn 0.5s ease;
    }
    .prayer-ai-error-icon { font-size: 2rem; margin-bottom: 12px; }
    .prayer-ai-error-title {
      font-family: 'Noto Serif TC', serif;
      font-size: 1rem; color: #C4A882; margin-bottom: 8px;
    }
    .prayer-ai-error-detail {
      font-size: 0.8rem; color: #8B7355; line-height: 1.8;
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

  function showError(container, errMessage) {
    const loading = document.getElementById('prayerAiLoading');
    if (loading) loading.remove();

    const div = document.createElement('div');
    div.className = 'prayer-ai-error';
    div.innerHTML = `
      <div class="prayer-ai-error-icon">⚠️</div>
      <div class="prayer-ai-error-title">祈福系統暫時無法連線</div>
      <div class="prayer-ai-error-detail">
        ${errMessage ? escapeHtml(errMessage) + '<br><br>' : ''}
        請稍後再試，或直接前往廟方 Facebook 粉專告知祈願內容。
      </div>
    `;
    container.appendChild(div);
  }

  window.PrayerAI = { generate, showLoading, showResponse, showError };

})();
