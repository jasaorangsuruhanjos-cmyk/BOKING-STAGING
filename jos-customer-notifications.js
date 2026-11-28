/* JOS customer payment notifications — STAGING ONLY.
 * Isolated UI module. Does not modify order/payment flows.
 */
(function () {
  'use strict';
  if (window.__josStageNotificationsLoaded) return;
  window.__josStageNotificationsLoaded = true;

  const TABLE = 'jos_customer_notifications';
  const ENVIRONMENT = 'staging';
  let db = null;
  let currentUserId = null;
  let channel = null;
  let rows = [];
  let isOpen = false;

  const $ = (selector, root = document) => root.querySelector(selector);
  const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (ch) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[ch]);

  function addStyles() {
    if ($('#josStageNotificationStyles')) return;
    const style = document.createElement('style');
    style.id = 'josStageNotificationStyles';
    style.textContent = `
      /* Lima elemen dipaksa tetap dalam satu baris: judul, cari, online, lonceng, menu. */
      .top .search-row{display:flex!important;flex-direction:row!important;flex-wrap:nowrap!important;align-items:center!important;justify-content:flex-start!important;gap:5px!important;width:100%!important;min-width:0!important;box-sizing:border-box!important}
      .top .search-row .jos-page-name{flex:0 0 auto!important;max-width:64px!important;min-width:0!important;overflow:hidden!important;text-overflow:ellipsis!important;white-space:nowrap!important}
      .top .search-row .search{flex:1 1 0!important;width:auto!important;min-width:40px!important;max-width:none!important;margin:0!important}
      .top .search-row .search input{min-width:0!important;width:100%!important}
      .top .search-row .jos-online{flex:0 0 auto!important;white-space:nowrap!important}
      .top .search-row #josStageNotificationBell{position:relative!important;order:98!important;display:none;flex:0 0 30px!important;width:30px!important;min-width:30px!important;height:30px!important;max-height:30px!important;margin:0!important;padding:0!important;border:1px solid #d8e8f5!important;border-radius:9px!important;background:#fff!important;color:#07569a!important;font-size:15px!important;line-height:1!important;align-items:center!important;justify-content:center!important;box-shadow:0 2px 5px #0b47721a!important;cursor:pointer!important}
      .top .search-row #openMainMenu{position:static!important;inset:auto!important;order:99!important;flex:0 0 30px!important;width:30px!important;min-width:30px!important;height:30px!important;max-height:30px!important;margin:0!important;padding:0!important}
      .top .search-row #openMainMenu span{width:16px!important}
      #josStageNotificationBell .count{position:absolute;right:-5px;top:-5px;min-width:16px;height:16px;padding:0 3px;border-radius:20px;background:#e53935;color:#fff;font-size:9px;font-weight:900;display:none;align-items:center;justify-content:center;border:2px solid #fff}
      #josStageNotificationLayer{position:fixed;inset:0;z-index:110000;background:#102c4666;display:none;align-items:flex-start;justify-content:center;padding:76px 12px 18px}
      #josStageNotificationLayer.open{display:flex}
      #josStageNotificationPanel{width:min(100%,520px);max-height:min(78vh,680px);overflow:auto;background:#fff;border:1px solid #dce9f4;border-radius:20px;box-shadow:0 18px 55px #092e4a44}
      #josStageNotificationPanel .head{position:sticky;top:0;background:#fff;border-bottom:1px solid #e7eef5;padding:16px;display:flex;align-items:center;justify-content:space-between;z-index:1}
      #josStageNotificationPanel .head strong{font-size:16px;color:#07569a}
      #josStageNotificationPanel .close{border:0;background:#edf5fb;color:#31556f;border-radius:10px;width:34px;height:34px;font-size:20px}
      #josStageNotificationList{padding:10px 14px 16px}
      .jos-stage-notice{border:1px solid #e1ebf3;border-radius:14px;padding:13px;margin:8px 0;background:#fff}
      .jos-stage-notice.unread{background:#f2f8ff;border-color:#b9d9f2}
      .jos-stage-notice h3{margin:0 0 7px;font-size:14px;color:#07569a}
      .jos-stage-notice p{margin:0;color:#496176;font-size:12px;line-height:1.55;white-space:pre-line}
      .jos-stage-notice time{display:block;margin-top:9px;color:#8294a4;font-size:10px}
      .jos-stage-empty{padding:32px 12px;text-align:center;color:#71869a;font-size:13px}
      @media(max-width:380px){
        .top{padding-left:10px!important;padding-right:10px!important}
        .top .search-row{gap:4px!important}
        .top .search-row .jos-page-name{max-width:55px!important;font-size:12px!important}
        .top .search-row .search{min-width:32px!important;height:29px!important;padding:0 4px!important}
        .top .search-row .search input{font-size:9px!important}
        .top .search-row .jos-online{font-size:7px!important;padding:3px 4px!important;gap:3px!important}
        .top .search-row #josStageNotificationBell,.top .search-row #openMainMenu{flex-basis:28px!important;width:28px!important;min-width:28px!important;height:28px!important;max-height:28px!important}
      }
      @media(max-width:430px){#josStageNotificationLayer{padding-top:68px}#josStageNotificationPanel{max-height:82vh}}
    `;

    document.head.appendChild(style);
  }

  function addUi() {
    addStyles();
    const row = $('.top .search-row');
    const hamburger = $('#openMainMenu');
    if (row && hamburger && hamburger.parentElement !== row) {
      row.appendChild(hamburger);
    }
    if (row && hamburger && !$('#josStageNotificationBell')) {
      const button = document.createElement('button');
      button.id = 'josStageNotificationBell';
      button.type = 'button';
      button.setAttribute('aria-label', 'Notifikasi pelanggan');
      button.setAttribute('title', 'Notifikasi');
      button.innerHTML = '🔔<span class="count" aria-live="polite"></span>';
      button.addEventListener('click', openPanel);
      hamburger.parentNode.insertBefore(button, hamburger);
    }
    if (!$('#josStageNotificationLayer')) {
      const layer = document.createElement('div');
      layer.id = 'josStageNotificationLayer';
      layer.innerHTML = `
        <section id="josStageNotificationPanel" role="dialog" aria-modal="true" aria-label="Notifikasi JOS">
          <div class="head"><strong>🔔 Notifikasi JOS</strong><button class="close" type="button" aria-label="Tutup">×</button></div>
          <div id="josStageNotificationList"><div class="jos-stage-empty">Memuat notifikasi...</div></div>
        </section>`;
      layer.addEventListener('click', (event) => {
        if (event.target === layer || event.target.closest('.close')) closePanel();
      });
      document.body.appendChild(layer);
    }
  }

  function setBellVisible(visible) {
    const bell = $('#josStageNotificationBell');
    if (bell) bell.style.display = visible ? 'inline-flex' : 'none';
  }

  function updateCount() {
    const badge = $('#josStageNotificationBell .count');
    if (!badge) return;
    const unread = rows.filter((item) => !item.is_read).length;
    badge.textContent = unread > 99 ? '99+' : String(unread);
    badge.style.display = unread ? 'inline-flex' : 'none';
  }

  function renderList() {
    const list = $('#josStageNotificationList');
    if (!list) return;
    if (!rows.length) {
      list.innerHTML = '<div class="jos-stage-empty">Belum ada notifikasi pembayaran.</div>';
      return;
    }
    list.innerHTML = rows.map((item) => {
      const date = item.created_at ? new Date(item.created_at) : null;
      const formatted = date && !Number.isNaN(date.getTime())
        ? new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' }).format(date)
        : '';
      return `<article class="jos-stage-notice ${item.is_read ? '' : 'unread'}" data-id="${escapeHtml(item.id)}">
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.body)}</p>
        <time>${escapeHtml(formatted)}${item.is_read ? ' · Sudah dibaca' : ' · Belum dibaca'}</time>
      </article>`;
    }).join('');
    list.querySelectorAll('.jos-stage-notice.unread').forEach((card) => {
      card.addEventListener('click', () => markRead(card.dataset.id));
    });
  }

  async function loadNotifications() {
    if (!db || !currentUserId) return;
    const { data, error } = await db.from(TABLE)
      .select('id,title,body,is_read,created_at,order_id,event_key')
      .eq('customer_id', currentUserId)
      .eq('source_app', 'JOS')
      .eq('environment', ENVIRONMENT)
      .order('created_at', { ascending: false })
      .limit(50);
    if (error) {
      console.warn('[JOS notifications staging] Gagal memuat notifikasi:', error.message);
      return;
    }
    rows = data || [];
    updateCount();
    if (isOpen) renderList();
  }

  async function markRead(id) {
    if (!db || !currentUserId || !id) return;
    const { error } = await db.from(TABLE)
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq('id', id)
      .eq('customer_id', currentUserId)
      .eq('environment', ENVIRONMENT);
    if (error) {
      console.warn('[JOS notifications staging] Gagal menandai dibaca:', error.message);
      return;
    }
    rows = rows.map((item) => item.id === id ? { ...item, is_read: true } : item);
    updateCount();
    renderList();
  }

  async function openPanel() {
    isOpen = true;
    const layer = $('#josStageNotificationLayer');
    if (layer) layer.classList.add('open');
    const list = $('#josStageNotificationList');
    if (list) list.innerHTML = '<div class="jos-stage-empty">Memuat notifikasi...</div>';
    await loadNotifications();
    renderList();
  }

  function closePanel() {
    isOpen = false;
    const layer = $('#josStageNotificationLayer');
    if (layer) layer.classList.remove('open');
  }

  function resetRealtime() {
    if (channel && db) {
      try { db.removeChannel(channel); } catch (_) {}
    }
    channel = null;
  }

  async function handleSession(session) {
    const user = session?.user || null;
    const brand = user?.user_metadata?.app_brand;
    if (!user || user.is_anonymous || (brand && brand !== 'JOS')) {
      currentUserId = null;
      rows = [];
      resetRealtime();
      setBellVisible(false);
      updateCount();
      closePanel();
      return;
    }
    currentUserId = user.id;
    setBellVisible(true);
    await loadNotifications();
    resetRealtime();
    channel = db.channel('jos-stage-customer-notifications-' + user.id)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: TABLE,
        filter: 'customer_id=eq.' + user.id
      }, () => { loadNotifications(); })
      .subscribe((status) => {
        if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          console.warn('[JOS notifications staging] Realtime belum tersambung; penyegaran tetap dilakukan saat halaman aktif.');
        }
      });
  }

  function init() {
    addUi();
    if (typeof josDb === 'undefined' || !josDb?.auth) {
      console.warn('[JOS notifications staging] Supabase customer client tidak ditemukan; fitur notifikasi tidak diaktifkan.');
      return;
    }
    db = josDb;
    db.auth.getSession().then(({ data }) => handleSession(data?.session || null)).catch((error) => {
      console.warn('[JOS notifications staging] Gagal membaca sesi:', error?.message || error);
    });
    db.auth.onAuthStateChange((_event, session) => {
      Promise.resolve().then(() => handleSession(session));
    });
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && currentUserId) loadNotifications();
    });
    window.addEventListener('focus', () => {
      if (currentUserId) loadNotifications();
    });
    window.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closePanel();
    });
    window.setInterval(() => {
      if (!document.hidden && currentUserId) loadNotifications();
    }, 45000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
