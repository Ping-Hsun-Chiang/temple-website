# 六興堂 Temple Website

一個以 **宮廟文化展示** 與 **線上服務功能** 為核心的網站專案，目標是將傳統信仰場域轉化為更容易被大眾接觸的數位體驗。  
本專案除了介紹六興堂的沿革、神明、活動與相片，也設計了多個可實際操作的互動頁面，如 **線上點燈、線上祈福、隨喜捐款、線上擲筊** 等。

此專案同時也是我的個人作品之一，展示我從 **網站規劃、前端開發、互動設計，到部署上線** 的完整實作能力。

## Website
- Live Site: [https://ping-hsun-chiang.github.io/temple-website/](https://ping-hsun-chiang.github.io/temple-website/)
- Repository: [https://github.com/Ping-Hsun-Chiang/temple-website](https://github.com/Ping-Hsun-Chiang/temple-website)

## Project Overview
本專案以靜態網站為基礎，結合表單互動與輕量化智慧模組，打造出兼具資訊展示與服務流程的宮廟網站。  
除了基本的內容呈現外，我也加入了使用者實際會操作到的流程設計，例如：

- 線上點燈資料填寫與確認
- 線上祈福內容輸入與回應
- 線上捐款流程與資料送出
- FAQ 式互動問答
- 擬真化的線上擲筊體驗

這讓專案不只是單純的形象網站，而是一個更接近真實服務場景的前端作品。

## Main Features
### 1. 宮廟資訊展示
- 宮廟沿革介紹
- 主祀與配祀神明介紹
- 活動公告區塊
- 相片集錦
- 聯絡資訊與地點資訊

### 2. 線上服務功能
- **線上點燈**：提供燈種選擇、資料填寫、確認與送出流程
- **線上祈福**：讓使用者輸入祈願內容，並取得溫和的回應文字
- **隨喜捐款**：支援捐款項目、金額選擇、收據需求與確認流程
- **線上擲筊**：提供簡易互動式擲筊體驗，增加網站參與感

### 3. 輕量化智慧互動模組
- **AI 廟務小幫手**
  - 使用本地知識庫與關鍵字 / 模糊比對方式實作
  - 可快速回答地址、開放時間、點燈、祈福、捐款等常見問題
  - 不需額外付費 API，即可提供基本互動體驗

- **祈福安心回應模組**
  - 依使用者輸入內容進行主題與情緒關鍵字判斷
  - 產生較溫和、具情境感的文字回應
  - 採用前端本地邏輯生成，不依賴外部 AI 服務

## Technologies Used
- **HTML5**
- **CSS3**
- **JavaScript (Vanilla JS)**
- **Responsive Web Design (RWD)**
- **Google Fonts**
- **GitHub Pages**（網站部署）
- **Google Apps Script Web App**（表單資料送出）

## What I Did
在這個專案中，我主要負責與完成了以下工作：

- 規劃網站整體結構與頁面流程
- 設計符合宮廟風格的視覺版型與前端介面
- 開發首頁與多個服務頁面
- 實作多步驟表單流程與前端驗證
- 建立 FAQ 式聊天互動模組
- 設計祈福內容回應邏輯
- 串接 Google Apps Script 作為表單送出端點
- 使用 GitHub Pages 完成網站部署
- 補上 meta description、Open Graph 等分享與基本 SEO 設定

## Project Highlights
- 不是單純的靜態展示頁，而是包含 **實際服務流程** 的完整網站專案
- 同時涵蓋 **內容設計、互動設計、前端實作、部署上線**
- 在不依賴昂貴外部服務的前提下，完成基礎的智慧互動功能
- 適合作為展示「我能從零做出一個可上線產品」的作品案例
- 具備真實情境導向，能展示我如何將需求轉成可操作的介面與流程

## Project Structure
```bash
.
├── index.html
├── online_lighting.html
├── online_prayer.html
├── online_donation.html
├── online_divination.html
├── js/
│   ├── ai-chatbot.js
│   └── ai-prayer-response.js
├── images/
└── sitemap.xml
```

## Why This Project Matters
對我而言，這個專案的重要性不只是「我做了一個網站」，而是它能夠反映我具備以下能力：

- 能將需求整理成實際可用的網站架構
- 能從視覺風格、內容排版到互動流程完整實作
- 能在免費或低成本條件下完成可上線的作品
- 能把靜態頁面結合資料送出流程，做出更接近真實產品的專案
- 能在有限技術資源下，設計出有互動感的使用者體驗

## Interview Talking Points
若在面試中介紹這個專案，我會聚焦在以下幾點：

- 我獨立完成了一個可實際部署的網站作品，而不只是做出畫面。
- 我設計了多個有流程性的功能頁面，例如點燈、祈福、捐款，不只是單頁展示。
- 我用 Vanilla JavaScript 完成互動邏輯、表單驗證與功能串接。
- 我在沒有付費 AI API 的情況下，實作了本地知識庫問答與祈福回應模組。
- 我把靜態網站與 Google Apps Script 串接，讓前端頁面具備基本資料提交能力。
- 我有考慮實際使用情境，例如表單步驟、資訊整理、分享預覽與上線部署。

## Future Improvements
未來若持續擴充，這個專案可以再加入：

- 後台管理介面（管理點燈 / 捐款 / 祈福資料）
- 資料庫整合與查詢功能
- 權限管理與登入系統
- 多語系版本
- 活動管理與公告維護功能
- 串接真正的 LLM API，升級目前的規則式互動模組

## Author
**Ping-Hsun Chiang**  
GitHub: [Ping-Hsun-Chiang](https://github.com/Ping-Hsun-Chiang)
