/* ========================================================================
   AI 提示词生成器 - prompt-builder.js
   纯原生 JS，无第三方依赖
   功能：分类切换、中英文搜索、点选加入输出（去重）、删除、复制、清空
   ======================================================================== */

(function () {
  'use strict';

  // ── 配置 ──
  var DATA_URL = 'data/tags.json';
  var STORAGE_KEY = 'pb-selected-v1';

  // ── 状态 ──
  var allTags = [];
  var categories = [];
  var currentCategory = '全部';
  var selectedPositive = []; // [{zh, en, category}]
  var selectedNegative = [];
  var searchKeyword = '';

  // ── DOM ──
  var $categories = document.getElementById('pbCategories');
  var $tagsGrid = document.getElementById('pbTagsGrid');
  var $tagsCount = document.getElementById('pbTagsCount');
  var $empty = document.getElementById('pbEmpty');
  var $searchInput = document.getElementById('pbSearchInput');
  var $headerSearch = document.getElementById('searchInput');
  var $positiveBox = document.getElementById('pbPositiveBox');
  var $negativeBox = document.getElementById('pbNegativeBox');
  var $posCount = document.getElementById('pbPosCount');
  var $negCount = document.getElementById('pbNegCount');
  var $outputCount = document.getElementById('pbOutputCount');
  var $copyPos = document.getElementById('pbCopyPos');
  var $copyNeg = document.getElementById('pbCopyNeg');
  var $copyAll = document.getElementById('pbCopyAll');
  var $clearPos = document.getElementById('pbClearPos');
  var $clearNeg = document.getElementById('pbClearNeg');
  var $clearAll = document.getElementById('pbClearAll');
  var $toast = document.getElementById('pbToast');
  var $totalCount = document.getElementById('pbTotalCount');

  // ── 工具函数 ──
  function escapeHtml(s) {
    if (!s) return '';
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function showToast(msg) {
    $toast.textContent = msg;
    $toast.style.display = 'block';
    clearTimeout(showToast._t);
    showToast._t = setTimeout(function () {
      $toast.style.display = 'none';
    }, 1500);
  }

  // ── 复制到剪贴板（兼容方案）──
  function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).catch(function () {
        fallbackCopy(text);
      });
    }
    fallbackCopy(text);
    return Promise.resolve();
  }

  function fallbackCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    ta.style.top = '0';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
    } catch (e) {
      // 忽略
    }
    document.body.removeChild(ta);
  }

  // ── 持久化 ──
  function saveSelected() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        positive: selectedPositive,
        negative: selectedNegative,
      }));
    } catch (e) {
      // localStorage 不可用时静默失败
    }
  }

  function loadSelected() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      var data = JSON.parse(raw);
      if (Array.isArray(data.positive)) selectedPositive = data.positive;
      if (Array.isArray(data.negative)) selectedNegative = data.negative;
    } catch (e) {
      // 忽略
    }
  }

  // ── 渲染分类栏 ──
  function renderCategories() {
    var html = '';
    // "全部" 按钮
    var totalCount = allTags.length;
    html += '<button class="pb-cat-btn' + (currentCategory === '全部' ? ' active' : '') + '" data-cat="全部" type="button">';
    html += '全部<span class="pb-cat-count">' + totalCount + '</span>';
    html += '</button>';

    // 各分类按钮
    for (var i = 0; i < categories.length; i++) {
      var cat = categories[i];
      var catCount = allTags.filter(function (t) { return t.category === cat; }).length;
      html += '<button class="pb-cat-btn' + (currentCategory === cat ? ' active' : '') + '" data-cat="' + escapeHtml(cat) + '" type="button">';
      html += escapeHtml(cat) + '<span class="pb-cat-count">' + catCount + '</span>';
      html += '</button>';
    }
    $categories.innerHTML = html;
  }

  // ── 渲染标签 ──
  function renderTags() {
    var kw = searchKeyword.trim().toLowerCase();
    var filtered = allTags.filter(function (t) {
      // 分类过滤
      if (currentCategory !== '全部' && t.category !== currentCategory) return false;
      // 搜索过滤
      if (kw) {
        var zh = (t.zh || '').toLowerCase();
        var en = (t.en || '').toLowerCase();
        if (zh.indexOf(kw) === -1 && en.indexOf(kw) === -1) return false;
      }
      return true;
    });

    $tagsCount.textContent = '当前 ' + filtered.length + ' 个标签' + (kw ? '（搜索：' + kw + '）' : '');

    if (filtered.length === 0) {
      $tagsGrid.innerHTML = '';
      $empty.style.display = 'block';
      return;
    }
    $empty.style.display = 'none';

    var html = '';
    for (var i = 0; i < filtered.length; i++) {
      var t = filtered[i];
      var isSelected = isTagSelected(t);
      var classes = 'pb-tag';
      if (isSelected) classes += ' selected';
      if (t.type === 'negative') classes += ' tag-negative';
      html += '<button class="' + classes + '" data-en="' + escapeHtml(t.en) + '" data-zh="' + escapeHtml(t.zh) + '" data-cat="' + escapeHtml(t.category) + '" data-type="' + escapeHtml(t.type) + '" type="button">';
      html += '<span class="pb-tag-zh">' + escapeHtml(t.zh) + '</span>';
      html += '<span class="pb-tag-en">' + escapeHtml(t.en) + '</span>';
      html += '</button>';
    }
    $tagsGrid.innerHTML = html;
  }

  // ── 判断标签是否已选中 ──
  function isTagSelected(tag) {
    var list = tag.type === 'negative' ? selectedNegative : selectedPositive;
    for (var i = 0; i < list.length; i++) {
      if (list[i].en === tag.en) return true;
    }
    return false;
  }

  // ── 渲染输出面板 ──
  function renderOutput() {
    // 正向
    if (selectedPositive.length === 0) {
      $positiveBox.innerHTML = '<div class="pb-output-placeholder">点击左侧标签添加</div>';
    } else {
      var html = '';
      for (var i = 0; i < selectedPositive.length; i++) {
        var t = selectedPositive[i];
        html += '<span class="pb-output-chip">';
        html += '<span class="pb-chip-en">' + escapeHtml(t.en) + '</span>';
        html += '<button class="pb-chip-remove" data-en="' + escapeHtml(t.en) + '" data-type="positive" type="button" aria-label="删除">×</button>';
        html += '</span>';
      }
      $positiveBox.innerHTML = html;
    }

    // 负面
    if (selectedNegative.length === 0) {
      $negativeBox.innerHTML = '<div class="pb-output-placeholder">点击负面词标签添加</div>';
    } else {
      var html2 = '';
      for (var j = 0; j < selectedNegative.length; j++) {
        var n = selectedNegative[j];
        html2 += '<span class="pb-output-chip">';
        html2 += '<span class="pb-chip-en">' + escapeHtml(n.en) + '</span>';
        html2 += '<button class="pb-chip-remove" data-en="' + escapeHtml(n.en) + '" data-type="negative" type="button" aria-label="删除">×</button>';
        html2 += '</span>';
      }
      $negativeBox.innerHTML = html2;
    }

    // 计数
    $posCount.textContent = selectedPositive.length;
    $negCount.textContent = selectedNegative.length;
    $outputCount.textContent = (selectedPositive.length + selectedNegative.length) + ' 项';
  }

  // ── 切换标签选中状态 ──
  function toggleTag(tag) {
    var list = tag.type === 'negative' ? selectedNegative : selectedPositive;
    var idx = -1;
    for (var i = 0; i < list.length; i++) {
      if (list[i].en === tag.en) { idx = i; break; }
    }
    if (idx >= 0) {
      list.splice(idx, 1);
    } else {
      list.push({ zh: tag.zh, en: tag.en, category: tag.category });
    }
    saveSelected();
    renderTags();
    renderOutput();
  }

  // ── 删除单项 ──
  function removeTag(en, type) {
    var list = type === 'negative' ? selectedNegative : selectedPositive;
    for (var i = 0; i < list.length; i++) {
      if (list[i].en === en) { list.splice(i, 1); break; }
    }
    saveSelected();
    renderTags();
    renderOutput();
  }

  // ── 生成 prompt 文本 ──
  function buildPrompt(list) {
    var tokens = [];
    for (var i = 0; i < list.length; i++) {
      if (list[i].en) tokens.push(list[i].en);
    }
    return tokens.join(', ');
  }

  // ── 事件绑定 ──
  function bindEvents() {
    // 分类切换
    $categories.addEventListener('click', function (e) {
      var btn = e.target.closest('.pb-cat-btn');
      if (!btn) return;
      currentCategory = btn.getAttribute('data-cat');
      renderCategories();
      renderTags();
    });

    // 标签点击（事件委托）
    $tagsGrid.addEventListener('click', function (e) {
      var tag = e.target.closest('.pb-tag');
      if (!tag) return;
      var t = {
        zh: tag.getAttribute('data-zh'),
        en: tag.getAttribute('data-en'),
        category: tag.getAttribute('data-cat'),
        type: tag.getAttribute('data-type'),
      };
      toggleTag(t);
    });

    // 输出区删除（事件委托）
    $positiveBox.addEventListener('click', function (e) {
      var btn = e.target.closest('.pb-chip-remove');
      if (!btn) return;
      removeTag(btn.getAttribute('data-en'), btn.getAttribute('data-type'));
    });
    $negativeBox.addEventListener('click', function (e) {
      var btn = e.target.closest('.pb-chip-remove');
      if (!btn) return;
      removeTag(btn.getAttribute('data-en'), btn.getAttribute('data-type'));
    });

    // 搜索（防抖）
    var searchTimer = null;
    $searchInput.addEventListener('input', function (e) {
      searchKeyword = e.target.value;
      clearTimeout(searchTimer);
      searchTimer = setTimeout(function () {
        renderTags();
      }, 120);
    });

    // 同步 header 搜索框（可选，仅当存在时）
    if ($headerSearch) {
      $headerSearch.addEventListener('input', function (e) {
        $searchInput.value = e.target.value;
        searchKeyword = e.target.value;
        clearTimeout(searchTimer);
        searchTimer = setTimeout(function () {
          renderTags();
        }, 120);
      });
    }

    // 复制正向
    $copyPos.addEventListener('click', function () {
      var text = buildPrompt(selectedPositive);
      if (!text) { showToast('正向提示词为空'); return; }
      copyToClipboard(text).then(function () {
        showToast('已复制正向提示词');
      });
    });

    // 复制负面
    $copyNeg.addEventListener('click', function () {
      var text = buildPrompt(selectedNegative);
      if (!text) { showToast('负面提示词为空'); return; }
      copyToClipboard(text).then(function () {
        showToast('已复制负面提示词');
      });
    });

    // 复制全部
    $copyAll.addEventListener('click', function () {
      var pos = buildPrompt(selectedPositive);
      var neg = buildPrompt(selectedNegative);
      var text = '';
      if (pos) text += '正向提示词：\n' + pos;
      if (neg) {
        if (pos) text += '\n\n';
        text += '负面提示词：\n' + neg;
      }
      if (!text) { showToast('提示词为空'); return; }
      copyToClipboard(text).then(function () {
        showToast('已复制全部提示词');
      });
    });

    // 清空正向
    $clearPos.addEventListener('click', function () {
      if (selectedPositive.length === 0) { showToast('正向已为空'); return; }
      selectedPositive = [];
      saveSelected();
      renderTags();
      renderOutput();
      showToast('已清空正向');
    });

    // 清空负面
    $clearNeg.addEventListener('click', function () {
      if (selectedNegative.length === 0) { showToast('负面已为空'); return; }
      selectedNegative = [];
      saveSelected();
      renderTags();
      renderOutput();
      showToast('已清空负面');
    });

    // 清空全部
    $clearAll.addEventListener('click', function () {
      if (selectedPositive.length === 0 && selectedNegative.length === 0) {
        showToast('已为空');
        return;
      }
      selectedPositive = [];
      selectedNegative = [];
      saveSelected();
      renderTags();
      renderOutput();
      showToast('已清空全部');
    });
  }

  // ── 加载数据 ──
  function loadData() {
    fetch(DATA_URL)
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function (data) {
        if (data && data.meta && Array.isArray(data.tags)) {
          allTags = data.tags;
          categories = data.meta.categories || [];
          if ($totalCount) $totalCount.textContent = data.meta.total || allTags.length;
        } else if (Array.isArray(data)) {
          // 兼容纯数组格式
          allTags = data;
          categories = [];
          var seen = {};
          for (var i = 0; i < allTags.length; i++) {
            var c = allTags[i].category;
            if (c && !seen[c]) { seen[c] = 1; categories.push(c); }
          }
          if ($totalCount) $totalCount.textContent = allTags.length;
        } else {
          throw new Error('数据格式错误');
        }
        renderCategories();
        renderTags();
        renderOutput();
      })
      .catch(function (err) {
        $tagsGrid.innerHTML = '';
        $tagsCount.textContent = '数据加载失败：' + (err.message || err);
        console.error('[prompt-builder] 数据加载失败:', err);
      });
  }

  // ── 初始化 ──
  function init() {
    loadSelected();
    bindEvents();
    loadData();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
