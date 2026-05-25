/* ============================================================
 * 南国石油HP - GA4イベント計測スクリプト
 *
 * 役割：
 *   - 電話タップ（tel:）        → click_phone
 *   - LINEクリック              → click_line
 *   - メールクリック（mailto:） → click_email
 *   - 30秒以上の滞在            → engaged_30s
 *   - 75%以上のスクロール       → deep_scroll
 *
 * 使い方：
 *   このファイルを各HTMLの <head> 内、gtag('config', ...) の
 *   直後に以下の1行で読み込むだけ：
 *
 *     <script src="tracking.js" defer></script>
 * ============================================================ */

(function () {
  'use strict';

  // gtagが読み込まれていなければ何もしない
  function track(eventName, params) {
    if (typeof gtag === 'function') {
      gtag('event', eventName, params || {});
    }
  }

  function init() {
    var path = location.pathname;

    // --- 電話タップ計測 ---
    document.querySelectorAll('a[href^="tel:"]').forEach(function (el) {
      el.addEventListener('click', function () {
        track('click_phone', {
          page_path: path,
          link_text: (el.textContent || '').trim().slice(0, 50)
        });
      });
    });

    // --- LINEクリック計測 ---
    document.querySelectorAll('a[href*="line.me"]').forEach(function (el) {
      el.addEventListener('click', function () {
        track('click_line', {
          page_path: path,
          link_text: (el.textContent || '').trim().slice(0, 50)
        });
      });
    });

    // --- メールクリック計測 ---
    document.querySelectorAll('a[href^="mailto:"]').forEach(function (el) {
      el.addEventListener('click', function () {
        track('click_email', {
          page_path: path,
          link_text: (el.textContent || '').trim().slice(0, 50)
        });
      });
    });

    // --- 30秒以上の滞在を計測 ---
    var engaged = false;
    setTimeout(function () {
      if (!engaged) {
        engaged = true;
        track('engaged_30s', { page_path: path });
      }
    }, 30000);

    // --- 75%以上スクロールを計測 ---
    var deepScrolled = false;
    function onScroll() {
      if (deepScrolled) return;
      var h = document.documentElement;
      var scrolled = (h.scrollTop + window.innerHeight) / h.scrollHeight;
      if (scrolled >= 0.75) {
        deepScrolled = true;
        track('deep_scroll', { page_path: path });
        window.removeEventListener('scroll', onScroll);
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
