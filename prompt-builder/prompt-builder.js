/* ========================================================================
   AI 提示词生成器 - prompt-builder.js
   纯原生 JS，无第三方依赖
   功能：
   - 默认选中第一个分类（主体），不默认展示"全部"
   - 分页：单分类超过 60 条先显示前 60 条 + 加载更多
   - 搜索：跨全部分类，显示"搜索结果：X 条"，搜索结果也分页
   - 标签按钮只显示中文，英文放 title tooltip，hover 淡淡显示
   - 分类竖向 sidebar 渲染
   - 点选加入输出（去重）、删除、复制、清空、localStorage 持久化
   - hover 标签显示预览卡（中文名/英文 token/分类/desc/可选图片），
     单实例 DOM + 事件委托，窗口边缘自动调整位置，移动端不显示
   ======================================================================== */

(function () {
  'use strict';

  // ── 配置 ──
  var DATA_URL = 'data/tags.json';
  var STORAGE_KEY = 'pb-selected-v1';
  var PAGE_SIZE = 60;

  // ── 状态 ──
  var allTags = [];
  var categories = [];          // 原始分类顺序（不含"全部"）
  var currentCategory = null;   // 默认设为第一个分类，loaded 后赋值
  var selectedPositive = [];    // [{zh, en, category}]
  var selectedNegative = [];
  var searchKeyword = '';
  var currentLimit = PAGE_SIZE; // 当前已显示数量（分页）

  // ── DOM ──
  var $categories = document.getElementById('pbCategories');
  var $tagsGrid = document.getElementById('pbTagsGrid');
  var $tagsCount = document.getElementById('pbTagsCount');
  var $empty = document.getElementById('pbEmpty');
  var $searchInput = document.getElementById('pbSearchInput');
  var $loadMoreWrap = document.getElementById('pbLoadMoreWrap');
  var $loadMoreBtn = document.getElementById('pbLoadMoreBtn');
  var $positiveBox = document.getElementById('pbPositiveBox');
  var $negativeBox = document.getElementById('pbNegativeBox');
  var $posCount = document.getElementById('pbPosCount');
  var $negCount = document.getElementById('pbNegCount');
  var $outputCount = document.getElementById('pbOutputCount');
  var $copyPos = document.getElementById('pbCopyPos');
  var $copyNeg = document.getElementById('pbCopyNeg');
  var $copyAll = document.getElementById('pbCopyAll');
  var $clearAll = document.getElementById('pbClearAll');
  var $toast = document.getElementById('pbToast');
  var $totalCount = document.getElementById('pbTotalCount');
  var $preview = document.getElementById('pbPreview');   // 预览卡单实例

  // ── 移动端检测（hover 不可靠）──
  var isTouchDevice = (window.matchMedia && window.matchMedia('(hover: none)').matches)
    || ('ontouchstart' in window && !window.matchMedia('(hover: hover)').matches);

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

  function escapeAttr(s) {
    return escapeHtml(s);
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

  // ── 统计某分类数量 ──
  function countByCategory(cat) {
    if (cat === '全部') return allTags.length;
    var n = 0;
    for (var i = 0; i < allTags.length; i++) {
      if (allTags[i].category === cat) n++;
    }
    return n;
  }

  // ── 渲染分类侧栏（竖向）──
  function renderCategories() {
    var html = '';

    // 各分类按钮（原始顺序）
    for (var i = 0; i < categories.length; i++) {
      var cat = categories[i];
      var catCount = countByCategory(cat);
      var active = (currentCategory === cat) ? ' active' : '';
      html += '<button class="pb-cat-item' + active + '" data-cat="' + escapeAttr(cat) + '" type="button">';
      html += '<span class="pb-cat-name">' + escapeHtml(cat) + '</span>';
      html += '<span class="pb-cat-count">' + catCount + '</span>';
      html += '</button>';
    }

    // "全部" 放在最末，且不默认选中
    var totalCount = allTags.length;
    var allActive = (currentCategory === '全部') ? ' active' : '';
    html += '<button class="pb-cat-item' + allActive + '" data-cat="全部" type="button">';
    html += '<span class="pb-cat-name">全部</span>';
    html += '<span class="pb-cat-count">' + totalCount + '</span>';
    html += '</button>';

    $categories.innerHTML = html;
  }

  // ── 取当前要显示的标签（经分类 + 搜索过滤后的全量列表）──
  function getFilteredTags() {
    var kw = searchKeyword.trim().toLowerCase();
    return allTags.filter(function (t) {
      if (!kw) {
        // 非搜索：按当前分类过滤（"全部"则不过滤）
        if (currentCategory !== '全部' && t.category !== currentCategory) return false;
        return true;
      }
      // 搜索：跨全部分类
      var zh = (t.zh || '').toLowerCase();
      var en = (t.en || '').toLowerCase();
      if (zh.indexOf(kw) === -1 && en.indexOf(kw) === -1) return false;
      return true;
    });
  }

  // ── 渲染标签（带分页）──
  function renderTags() {
    var kw = searchKeyword.trim().toLowerCase();
    var filtered = getFilteredTags();
    var shown = filtered.slice(0, currentLimit);

    // 元信息
    if (kw) {
      $tagsCount.textContent = '搜索结果：' + filtered.length + ' 条';
    } else if (currentCategory === '全部') {
      $tagsCount.textContent = '全部分类 · ' + filtered.length + ' 个标签';
    } else {
      $tagsCount.textContent = currentCategory + ' · ' + filtered.length + ' 个标签';
    }

    if (filtered.length === 0) {
      $tagsGrid.innerHTML = '';
      $empty.style.display = 'block';
      $loadMoreWrap.style.display = 'none';
      return;
    }
    $empty.style.display = 'none';

    var html = '';
    for (var i = 0; i < shown.length; i++) {
      var t = shown[i];
      var isSelected = isTagSelected(t);
      var classes = 'pb-tag';
      if (isSelected) classes += ' selected';
      if (t.type === 'negative') classes += ' tag-negative';
      // 不再用原生 title，避免与预览卡重叠；预览卡由 hover 触发
      html += '<button class="' + classes + '" data-en="' + escapeAttr(t.en) + '" data-zh="' + escapeAttr(t.zh) + '" data-cat="' + escapeAttr(t.category) + '" data-type="' + escapeAttr(t.type) + '" data-desc="' + escapeAttr(t.desc || '') + '" data-img="' + escapeAttr(t.previewImage || '') + '" type="button">';
      html += '<span class="pb-tag-zh">' + escapeHtml(t.zh) + '</span>';
      if (t.en && t.en !== t.zh) {
        html += '<span class="pb-tag-en">' + escapeHtml(t.en) + '</span>';
      }
      html += '</button>';
    }
    $tagsGrid.innerHTML = html;

    // 加载更多按钮：仅当还有未显示的条目时显示
    if (filtered.length > currentLimit) {
      $loadMoreWrap.style.display = 'block';
      $loadMoreBtn.textContent = '加载更多（剩余 ' + (filtered.length - currentLimit) + '）';
    } else {
      $loadMoreWrap.style.display = 'none';
    }
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
      $positiveBox.innerHTML = '<div class="pb-output-placeholder">点击标签添加</div>';
    } else {
      var html = '';
      for (var i = 0; i < selectedPositive.length; i++) {
        var t = selectedPositive[i];
        html += '<span class="pb-output-chip">';
        html += '<span class="pb-chip-en">' + escapeHtml(t.en) + '</span>';
        html += '<button class="pb-chip-remove" data-en="' + escapeAttr(t.en) + '" data-type="positive" type="button" aria-label="删除">×</button>';
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
        html2 += '<button class="pb-chip-remove" data-en="' + escapeAttr(n.en) + '" data-type="negative" type="button" aria-label="删除">×</button>';
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

  // ── 切换分类：重置分页 ──
  function switchCategory(cat) {
    currentCategory = cat;
    currentLimit = PAGE_SIZE;
    renderCategories();
    renderTags();
  }

  // ── 预览卡（hover popover）──
  // 单实例 DOM，跟随鼠标定位，窗口边缘自动调整，移动端不启用
  var previewHideTimer = null;
  var previewShowTimer = null;

  function showPreview(target, clientX, clientY) {
    if (!$preview || isTouchDevice) return;

    var zh = target.getAttribute('data-zh') || '';
    var en = target.getAttribute('data-en') || '';
    var cat = target.getAttribute('data-cat') || '';
    var desc = target.getAttribute('data-desc') || '';
    var img = target.getAttribute('data-img') || '';

    // compact 模式：无 desc 且无 previewImage 时只显示中文/英文/分类，预览卡更小
    var compact = !desc && !img;
    $preview.classList.toggle('compact', compact);

    // 构建内容
    var html = '';
    html += '<div class="pb-pv-head">';
    html += '<span class="pb-pv-zh">' + escapeHtml(zh) + '</span>';
    if (cat) html += '<span class="pb-pv-cat">' + escapeHtml(cat) + '</span>';
    html += '</div>';
    if (en && en !== zh) {
      html += '<div class="pb-pv-en"><code>' + escapeHtml(en) + '</code></div>';
    }
    if (desc) {
      html += '<div class="pb-pv-desc">' + escapeHtml(desc) + '</div>';
    }
    // 图片：懒加载，仅当有 url 时才插入 img 节点（第一版 previewImage 全空，不会渲染）
    if (img) {
      html += '<div class="pb-pv-img-wrap"><img class="pb-pv-img" alt="" loading="lazy" /></div>';
    }
    $preview.innerHTML = html;

    // 图片 src 在显示后才设置，避免页面加载时一次性加载
    if (img) {
      var $img = $preview.querySelector('.pb-pv-img');
      if ($img) {
        $img.addEventListener('error', function () {
          var w = $preview.querySelector('.pb-pv-img-wrap');
          if (w) w.style.display = 'none';
        });
        $img.src = img;
      }
    }

    $preview.style.display = 'block';
    $preview.style.visibility = 'hidden'; // 先隐藏测算位置
    positionPreview(clientX, clientY);
    $preview.style.visibility = 'visible';
  }

  // 偏移量：卡片与鼠标/标签的间距
  var PV_GAP = 12;

  function positionPreview(clientX, clientY) {
    if (!$preview) return;
    var pw = $preview.offsetWidth;
    var ph = $preview.offsetHeight;
    var vw = window.innerWidth;
    var vh = window.innerHeight;
    var scrollX = window.scrollX || 0;
    var scrollY = window.scrollY || 0;

    // 默认放在鼠标右下方，偏移 PV_GAP
    var left = clientX + PV_GAP;
    var top = clientY + PV_GAP;

    // 右溢出 → 放鼠标左下方（避免遮挡 hover 标签）
    if (left + pw > vw - 8) {
      left = clientX - pw - PV_GAP;
    }
    // 仍溢出（卡片比视口宽）→ 贴左边
    if (left < 8) left = 8;

    // 下溢出 → 放鼠标上方（不遮挡标签，且不与鼠标重叠）
    if (top + ph > vh - 8) {
      top = clientY - ph - PV_GAP;
    }
    if (top < 8) top = 8;

    // 转成页面绝对坐标（position: absolute 相对 body）
    $preview.style.left = (left + scrollX) + 'px';
    $preview.style.top = (top + scrollY) + 'px';
  }

  function hidePreview() {
    if (!$preview) return;
    $preview.style.display = 'none';
    $preview.innerHTML = '';
    $preview.classList.remove('compact');
  }

  // ── 事件绑定 ──
  function bindEvents() {
    // 分类切换
    $categories.addEventListener('click', function (e) {
      var btn = e.target.closest('.pb-cat-item');
      if (!btn) return;
      var cat = btn.getAttribute('data-cat');
      switchCategory(cat);
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

    // 标签 hover 预览卡（事件委托，搜索/分页/分类切换后无需 rebind）
    if (!isTouchDevice) {
      $tagsGrid.addEventListener('mouseover', function (e) {
        var tag = e.target.closest('.pb-tag');
        if (!tag) return;
        clearTimeout(previewHideTimer);
        clearTimeout(previewShowTimer);
        // 延迟 200ms 显示，避免鼠标扫过时频繁弹出（需求 180-250ms 区间）
        previewShowTimer = setTimeout(function () {
          showPreview(tag, e.clientX, e.clientY);
        }, 200);
      });
      $tagsGrid.addEventListener('mousemove', function (e) {
        var tag = e.target.closest('.pb-tag');
        if (!tag) return;
        // 卡片已显示则跟随更新位置
        if ($preview.style.display === 'block') {
          positionPreview(e.clientX, e.clientY);
        }
      });
      $tagsGrid.addEventListener('mouseout', function (e) {
        var tag = e.target.closest('.pb-tag');
        if (!tag) return;
        clearTimeout(previewShowTimer);
        previewHideTimer = setTimeout(hidePreview, 120);
      });
      // 鼠标进入预览卡本身时取消隐藏
      if ($preview) {
        $preview.addEventListener('mouseover', function () {
          clearTimeout(previewHideTimer);
        });
        $preview.addEventListener('mouseout', function () {
          previewHideTimer = setTimeout(hidePreview, 120);
        });
      }
    }

    // 加载更多
    $loadMoreBtn.addEventListener('click', function () {
      currentLimit += PAGE_SIZE;
      renderTags();
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

    // 搜索（防抖）—— 输入即跨分类搜索，清空回到当前分类
    var searchTimer = null;
    $searchInput.addEventListener('input', function (e) {
      searchKeyword = e.target.value;
      clearTimeout(searchTimer);
      searchTimer = setTimeout(function () {
        currentLimit = PAGE_SIZE; // 搜索/清空都重置分页
        renderTags();
      }, 120);
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

        // 默认选中第一个分类（主体），不默认"全部"
        currentCategory = (categories.length > 0) ? categories[0] : '全部';

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
