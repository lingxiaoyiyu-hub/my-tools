// Dependency components list
const initialComponents = [
  {
    id: "vcpp2005",
    name: "Microsoft Visual C++ Redistributable Package 2005",
    status: "abnormal",
    statusText: "异常",
    desc: "缺失核心系统库文件: msvcr80.dll",
    fullDesc: "Microsoft Visual C++ 2005 运行库是很多早于 2010 年开发的应用程序及游戏所需的关键底层组件。如果此组件损坏或缺失，启动某些软件时会报错：'找不到 msvcr80.dll' 或 '应用程序配置不正确'。",
    dlls: ["msvcr80.dll", "msvcp80.dll", "mfc80.dll"],
    registry: "HKLM\\SOFTWARE\\Microsoft\\DevDiv\\VC\\Servicing\\8.0",
    remedies: [
      "自动修复：点击右上角“一键修复”由诊断工具自动执行静默安装和注册。",
      "手动修复：从微软官网下载 Microsoft Visual C++ 2005 Redistributable Package 并手动运行安装程序。",
      "DLL 注册：如果文件存在但未注册，可在命令行运行 'regsvr32 msvcr80.dll' 重新注册。"
    ]
  },
  {
    id: "vcpp2008",
    name: "Microsoft Visual C++ Redistributable Package 2008",
    status: "normal",
    statusText: "正常",
    desc: "所有组件运行良好",
    fullDesc: "Microsoft Visual C++ 2008 运行库包含 msvcr90.dll 和 msvcp90.dll 等关键链接库。用于支持使用 Visual Studio 2008 开发的各类软件和早期网络游戏。",
    dlls: ["msvcr90.dll", "msvcp90.dll", "mfc90.dll"],
    registry: "HKLM\\SOFTWARE\\Microsoft\\DevDiv\\VC\\Servicing\\9.0",
    remedies: ["无需修复。当前组件版本完整，功能正常。"]
  },
  {
    id: "vcpp2010",
    name: "Microsoft Visual C++ Redistributable Package 2010",
    status: "normal",
    statusText: "正常",
    desc: "所有组件运行良好",
    fullDesc: "Microsoft Visual C++ 2010 运行库在现代 Windows 环境中极为普遍，提供了 msvcr100.dll、msvcp100.dll 等链接库，用于运行大量商业办公应用和三维游戏软件。",
    dlls: ["msvcr100.dll", "msvcp100.dll", "mfc100.dll"],
    registry: "HKLM\\SOFTWARE\\Microsoft\\DevDiv\\VC\\Servicing\\10.0",
    remedies: ["无需修复。当前组件版本完整，功能正常。"]
  },
  {
    id: "vcpp2012",
    name: "Microsoft Visual C++ Redistributable Package 2012",
    status: "normal",
    statusText: "正常",
    desc: "所有组件运行良好",
    fullDesc: "Microsoft Visual C++ 2012 运行库提供了 msvcr110.dll 和 msvcp110.dll。它是许多主流单机游戏 and 媒体播放软件的运行基石。",
    dlls: ["msvcr110.dll", "msvcp110.dll", "vcomp110.dll"],
    registry: "HKLM\\SOFTWARE\\Microsoft\\DevDiv\\VC\\Servicing\\11.0",
    remedies: ["无需修复。当前组件版本完整，功能正常。"]
  },
  {
    id: "vcpp2013",
    name: "Microsoft Visual C++ Redistributable Package 2013",
    status: "normal",
    statusText: "正常",
    desc: "所有组件运行良好",
    fullDesc: "Microsoft Visual C++ 2013 运行库，内置 msvcr120.dll 和 msvcp120.dll 运行时环境。是高版本引擎（如 Unreal Engine 3/4 等）游戏启动的基础环境。",
    dlls: ["msvcr120.dll", "msvcp120.dll", "vcomp120.dll"],
    registry: "HKLM\\SOFTWARE\\Microsoft\\DevDiv\\VC\\Servicing\\12.0",
    remedies: ["无需修复。当前组件版本完整，功能正常。"]
  },
  {
    id: "vcpp2015",
    name: "Microsoft Visual C++ Redistributable Package 2015-2022",
    status: "normal",
    statusText: "正常",
    desc: "所有组件运行良好",
    fullDesc: "这是微软官方推出的通用 C++ 运行时集合，整合了 2015、2017、2019 和 2022 的所有功能。引入了全新的 vcruntime140.dll，是目前绝大多数现代应用和大型 3A 游戏的必装项。",
    dlls: ["vcruntime140.dll", "msvcp140.dll", "vcruntime140_1.dll", "concrt140.dll"],
    registry: "HKLM\\SOFTWARE\\Microsoft\\DevDiv\\VC\\Servicing\\14.0",
    remedies: ["无需修复。当前组件版本完整，功能正常。"]
  },
  {
    id: "vs2010office",
    name: "Visual Studio 2010 Tools For Office Runtime",
    status: "normal",
    statusText: "正常",
    desc: "所有组件运行良好",
    fullDesc: "Visual Studio Tools for Office (VSTO) 运行时环境，主要用于执行基于 Microsoft Office 系列（Word、Excel、PowerPoint 等）深度定制的自动化宏程序及专业企业插件。",
    dlls: ["VSTOInstaller.exe", "Microsoft.Office.Tools.Common.v4.0.Utilities.dll"],
    registry: "HKLM\\SOFTWARE\\Microsoft\\VSTO Runtime Setup\\v4.0",
    remedies: ["无需修复。当前组件版本完整，功能正常。"]
  },
  {
    id: "directx",
    name: "DirectX End-User Runtime",
    status: "normal",
    statusText: "正常",
    desc: "所有组件运行良好",
    fullDesc: "DirectX 是微软开发的多媒体编程接口，负责加速游戏中的三维图形渲染、音频混合以及外设输入交互。是所有电脑游戏玩家必备的环境组件。",
    dlls: ["d3dx9_43.dll", "d3dx10_43.dll", "d3dx11_43.dll", "XInput1_3.dll"],
    registry: "HKLM\\SOFTWARE\\Microsoft\\DirectX",
    remedies: ["无需修复。当前 DirectX 版本与显卡驱动兼容良好，API 接口正常。"]
  },
  {
    id: "ucrt",
    name: "Universal CRT Tools",
    status: "normal",
    statusText: "正常",
    desc: "所有组件运行良好",
    fullDesc: "Universal C Runtime (UCRT) 是一项 Windows 操作系统组件，它为 Windows 操作系统上的 C 运行时库提供支持。它允许将依赖 C++ 的程序在无完整 SDK 时独立执行。",
    dlls: ["ucrtbase.dll", "api-ms-win-crt-runtime-l1-1-0.dll"],
    registry: "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Component Based Servicing",
    remedies: ["无需修复。系统通用 C++ 运行时层状态良好。"]
  },
  {
    id: "appinfo",
    name: "AppInfo服务 (Application Information)",
    status: "normal",
    statusText: "正常",
    desc: "所有组件运行良好",
    fullDesc: "AppInfo（应用程序信息）服务负责引导、启动 and 管理受限制的安全特权应用程序。如果此服务未运行或被禁用，用户可能会无法使用管理员身份运行软件或进行 UAC 授权操作。",
    dlls: ["appinfo.dll", "svchost.exe (Service host)"],
    registry: "HKLM\\SYSTEM\\CurrentControlSet\\Services\\Appinfo",
    remedies: ["无需修复。AppInfo 服务目前处于 自动(已启动) 状态。"]
  }
];

// Clone components state
let currentComponents = JSON.parse(JSON.stringify(initialComponents));
let isScanning = false;
let isRepairing = false;
let isNetworkWorking = false;

// DOM Elements
const checklistGrid = document.getElementById("checklistGrid");
const statusCounter = document.getElementById("statusCounter");
const errorCountEl = document.getElementById("errorCount");
const scannerVisual = document.getElementById("scannerVisual");
const scannerStateLabel = document.getElementById("scannerStateLabel");
const diagnosticTitle = document.getElementById("diagnosticTitle");
const diagnosticTitleCount = document.getElementById("diagnosticTitleCount");
const diagnosticDesc = document.getElementById("diagnosticDesc");
const scanBtn = document.getElementById("scanBtn");
const repairBtn = document.getElementById("repairBtn");
const themeToggle = document.getElementById("themeToggle");
const consoleHeader = document.getElementById("consoleHeader");
const consoleBody = document.getElementById("consoleBody");
const logOutput = document.getElementById("logOutput");
const logIndicator = document.getElementById("logIndicator");
const detailDrawer = document.getElementById("detailDrawer");
const drawerBody = document.getElementById("drawerBody");
const drawerTitle = document.getElementById("drawerTitle");
const closeDrawerBtn = document.getElementById("closeDrawerBtn");

// Tab Navigation Elements
const tabSystem = document.getElementById("tabSystem");
const tabNetwork = document.getElementById("tabNetwork");
const contentSystem = document.getElementById("contentSystem");
const contentNetwork = document.getElementById("contentNetwork");

// Installer Elements
const installerPanel = document.getElementById("installerPanel");
const installerList = document.getElementById("installerList");
const installerProgressText = document.getElementById("installerProgressText");

// Network Elements
const pingValue = document.getElementById("pingValue");
const statusGateway = document.getElementById("statusGateway");
const statusDns = document.getElementById("statusDns");
const statusInternet = document.getElementById("statusInternet");
const networkGauge = document.getElementById("networkGauge");
const diagnoseNetworkBtn = document.getElementById("diagnoseNetworkBtn");
const repairNetworkBtn = document.getElementById("repairNetworkBtn");

// ----------------------------------------------------
// UI Render Functions
// ----------------------------------------------------

// Render Checklist Grid
function renderChecklist() {
  checklistGrid.innerHTML = "";
  let normalCount = 0;
  let abnormalCount = 0;

  currentComponents.forEach(comp => {
    if (comp.status === "normal") normalCount++;
    if (comp.status === "abnormal") abnormalCount++;

    const card = document.createElement("div");
    card.className = `checklist-card ${comp.status}`;
    card.setAttribute("data-id", comp.id);
    
    // Setup Icon based on status
    let statusIconHtml = "";
    let badgeHtml = "";

    if (comp.status === "abnormal") {
      statusIconHtml = `
        <svg class="icon-error" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      `;
      badgeHtml = `<div class="card-badge badge-error">异常</div>`;
    } else if (comp.status === "normal") {
      statusIconHtml = `
        <svg class="icon-success" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      `;
      badgeHtml = `<div class="card-badge badge-success">正常</div>`;
    } else { // pending / scanning
      statusIconHtml = `
        <svg class="icon-pending" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M12 6v6l4 2"></path>
        </svg>
      `;
      badgeHtml = `<div class="card-badge badge-pending">扫描中</div>`;
    }

    card.innerHTML = `
      <div class="card-status-icon">${statusIconHtml}</div>
      <div class="card-info">
        <h3>${comp.name}</h3>
        <p>${comp.desc}</p>
      </div>
      ${badgeHtml}
    `;

    // Click handler to open detail drawer
    card.addEventListener("click", () => {
      openDetails(comp.id);
    });

    checklistGrid.appendChild(card);
  });

  statusCounter.textContent = `正常: ${normalCount} / 异常: ${abnormalCount}`;
  
  // Update dashboard elements
  errorCountEl.textContent = abnormalCount;
  
  if (abnormalCount > 0) {
    scannerVisual.className = "scanner-visual state-abnormal";
    scannerStateLabel.textContent = "异常项目";
    diagnosticTitle.innerHTML = `检测到以下 <span class="highlight-warn" id="diagnosticTitleCount">${abnormalCount}</span> 个问题，请立即修复`;
    diagnosticDesc.textContent = "主要症状：dll缺失、指定服务未安装";
    repairBtn.removeAttribute("disabled");
  } else {
    scannerVisual.className = "scanner-visual state-success";
    scannerStateLabel.textContent = "系统安全";
    diagnosticTitle.innerHTML = `系统环境完整，未检测到任何异常`;
    diagnosticDesc.textContent = "所有 C++ 运行库组件、DirectX 组件及 AppInfo 服务状态均处于正常运行状态。";
    repairBtn.setAttribute("disabled", "true");
  }
}

// Write to Simulated Log Terminal
function addLog(text, type = "info") {
  const row = document.createElement("div");
  row.className = `log-row ${type}`;
  
  // Add a nice visual prompt icon based on type
  let promptSymbol = "[INFO] ";
  if (type === "success") promptSymbol = "[OK]   ";
  if (type === "error")   promptSymbol = "[FAIL] ";
  if (type === "warn")    promptSymbol = "[WARN] ";
  
  row.textContent = `${promptSymbol} ${text}`;
  logOutput.appendChild(row);
  
  // Auto Scroll
  logOutput.scrollTop = logOutput.scrollHeight;
}

// Clear Terminal logs
function clearLogs() {
  logOutput.innerHTML = "";
}

// ----------------------------------------------------
// Diagnostic Scanning Sequence
// ----------------------------------------------------

async function runSystemScan() {
  if (isScanning || isRepairing || isNetworkWorking) return;
  isScanning = true;
  
  // UI State changes
  scanBtn.setAttribute("disabled", "true");
  repairBtn.setAttribute("disabled", "true");
  scannerVisual.className = "scanner-visual state-scanning";
  scannerStateLabel.textContent = "扫描中";
  errorCountEl.textContent = "...";
  
  // Expand Console log to show scanning process
  consoleHeader.setAttribute("aria-expanded", "true");
  
  clearLogs();
  addLog("启动深度依赖扫描引擎...", "info");
  await delay(600);
  
  addLog("检查内核环境...", "info");
  addLog("操作系统结构识别: x64 | Windows Subsystem for Windows Desktop", "success");
  await delay(400);
  
  // Set all components to pending/scanning
  currentComponents.forEach(c => {
    c.status = "pending";
    c.desc = "正在分析依赖树及 DLL 文件哈希...";
  });
  renderChecklist();

  // Run through components and verify
  for (let i = 0; i < currentComponents.length; i++) {
    const comp = currentComponents[i];
    addLog(`扫描中: [${i+1}/${currentComponents.length}] ${comp.name}`, "info");
    
    // Simulate check delay
    await delay(350 + Math.random() * 300);
    
    // Restore component state from initial baseline (so VC++ 2005 fails again if scanning after repair)
    const baseline = initialComponents.find(c => c.id === comp.id);
    comp.status = baseline.status;
    comp.desc = baseline.desc;

    if (comp.status === "normal") {
      addLog(`组件正常: ${comp.name} - 链接库注册完整。`, "success");
      comp.dlls.forEach(dll => {
        addLog(`  -> [FOUND] C:\\Windows\\System32\\${dll}`, "success");
      });
    } else {
      addLog(`诊断异常: ${comp.name} 运行环境已损坏或丢失！`, "error");
      comp.dlls.forEach(dll => {
        if (dll === "msvcr80.dll") {
          addLog(`  -> [MISSING] C:\\Windows\\System32\\${dll} - 文件未找到`, "error");
        } else {
          addLog(`  -> [FOUND] C:\\Windows\\System32\\${dll}`, "success");
        }
      });
    }
    
    renderChecklist();
  }

  isScanning = false;
  scanBtn.removeAttribute("disabled");
  
  const abnormalCount = currentComponents.filter(c => c.status === "abnormal").length;
  if (abnormalCount > 0) {
    addLog(`扫描结束。共检测到 ${abnormalCount} 处系统运行库损坏或缺失。建议立即进行一键修复。`, "warn");
  } else {
    addLog("扫描完成。系统所有依赖项正常且完整。无需修复。", "success");
  }
  
  document.getElementById("lastScanTime").textContent = `上次扫描: ${new Date().toLocaleTimeString()}`;
}

// ----------------------------------------------------
// System Repair Sequence (With Silent Installer Progress)
// ----------------------------------------------------

async function runSystemRepair() {
  if (isScanning || isRepairing || isNetworkWorking) return;
  
  const abnormalItems = currentComponents.filter(c => c.status === "abnormal");
  if (abnormalItems.length === 0) {
    addLog("未发现需要修复的异常组件。", "info");
    return;
  }

  isRepairing = true;
  scanBtn.setAttribute("disabled", "true");
  repairBtn.setAttribute("disabled", "true");
  logIndicator.style.display = "block";
  
  // Expand log panel
  consoleHeader.setAttribute("aria-expanded", "true");
  
  addLog("初始化一键修复引擎...", "info");
  await delay(600);
  
  addLog("请求本地安全组件修改特权...", "info");
  addLog("已获取系统管理员(System Administrator)执行特权.", "success");
  await delay(500);

  // Initialize Installer Panel UI
  installerList.innerHTML = "";
  installerPanel.style.display = "block";
  installerProgressText.textContent = "已完成 0%";

  // Create progress entries
  abnormalItems.forEach(comp => {
    const item = document.createElement("div");
    item.className = "installer-item";
    item.id = `inst-item-${comp.id}`;
    item.innerHTML = `
      <div class="installer-item-info">
        <span class="installer-item-name">${comp.name}</span>
        <span class="installer-item-status downloading" id="inst-status-${comp.id}">等待下载 (0%)</span>
      </div>
      <div class="progress-bar-container">
        <div class="progress-bar-fill" id="inst-fill-${comp.id}"></div>
      </div>
    `;
    installerList.appendChild(item);
  });

  let completedTasks = 0;

  for (let idx = 0; idx < abnormalItems.length; idx++) {
    const comp = abnormalItems[idx];
    const statusTextEl = document.getElementById(`inst-status-${comp.id}`);
    const fillEl = document.getElementById(`inst-fill-${comp.id}`);
    
    addLog(`开始修复: ${comp.name}`, "warn");
    await delay(500);
    
    addLog(`  1. 正在寻找可供修复的静默安装程序包...`, "info");
    await delay(400);
    
    addLog(`  2. 正在自微软官方源下载独立运行时分发包 [VC_Redist_2005_x86.exe]...`, "info");
    statusTextEl.className = "installer-item-status downloading";
    
    // Simulate Download Progress
    for (let progress = 10; progress <= 100; progress += 15) {
      if (progress > 100) progress = 100;
      statusTextEl.textContent = `正在下载 (${progress}%)`;
      fillEl.style.width = `${progress}%`;
      addLog(`     [下载进度] ${progress}% / 2.6 MB`, "info");
      
      // Calculate overall progress
      const overall = Math.round(((completedTasks + (progress / 100)) / abnormalItems.length) * 100);
      installerProgressText.textContent = `已完成 ${overall}%`;
      
      await delay(200);
    }
    
    addLog(`     下载验证通过 (MD5: 5C53CD5CE19B00FBF1E2D77CF1689FA4)`, "success");
    await delay(300);

    addLog(`  3. 正在解压并部署 msvcr80.dll, msvcp80.dll 库文件到 Windows SxS 缓存区...`, "info");
    statusTextEl.textContent = "正在安装 (部署文件)...";
    statusTextEl.className = "installer-item-status installing";
    await delay(500);
    
    addLog(`  4. 执行静默打包安装指令 '/q /norestart'...`, "info");
    await delay(600);
    
    addLog(`  5. 正在向 Windows 注册表写入组件服务注册项...`, "info");
    addLog(`     写入注册表项 [${comp.registry}]`, "success");
    await delay(400);
    
    addLog(`  6. 重新注册本地系统动态链接库 'regsvr32.exe /s msvcr80.dll'...`, "info");
    await delay(500);

    // Transition state to normal
    comp.status = "normal";
    comp.desc = "已成功修复，组件目前完整";
    comp.remedies = ["组件由一键修复程序成功自动安装部署。"];
    
    statusTextEl.textContent = "已完成";
    statusTextEl.className = "installer-item-status completed";
    
    completedTasks++;
    const finalOverall = Math.round((completedTasks / abnormalItems.length) * 100);
    installerProgressText.textContent = `已完成 ${finalOverall}%`;

    addLog(`组件修复成功: ${comp.name}`, "success");
    renderChecklist();
  }

  // Final verification check
  addLog("运行最终环境闭环校验分析...", "info");
  await delay(800);
  
  addLog("校验完成！所有系统动态链接库(DLL)配置完好。", "success");
  addLog("应用程序启动异常问题已被彻底解决。建议重启需要运行的软件或游戏。", "success");
  
  isRepairing = false;
  logIndicator.style.display = "none";
  scanBtn.removeAttribute("disabled");
  
  // Hide installer panel after delay
  await delay(1200);
  installerPanel.style.display = "none";
  
  // Set baseline references so that the app reflects the repaired state
  currentComponents.forEach(c => {
    const baseline = initialComponents.find(orig => orig.id === c.id);
    if (baseline) {
      baseline.status = "normal";
      baseline.desc = "所有组件运行良好";
    }
  });

  renderChecklist();
}

// ----------------------------------------------------
// Network Diagnostics & Repair Sequence
// ----------------------------------------------------

async function runNetworkDiagnose() {
  if (isScanning || isRepairing || isNetworkWorking) return;
  isNetworkWorking = true;
  
  // UI State
  diagnoseNetworkBtn.setAttribute("disabled", "true");
  repairNetworkBtn.setAttribute("disabled", "true");
  consoleHeader.setAttribute("aria-expanded", "true");
  
  clearLogs();
  addLog("开始进行本地及外网连接连通性诊断...", "info");
  
  // Reset diagnostic details to scanning state
  statusGateway.textContent = "诊断中...";
  statusGateway.className = "status-value warning";
  statusDns.textContent = "诊断中...";
  statusDns.className = "status-value warning";
  statusInternet.textContent = "诊断中...";
  statusInternet.className = "status-value warning";
  pingValue.textContent = "--";
  document.querySelector(".gauge-ring").style.transform = "rotate(-45deg)";
  
  await delay(600);
  
  // 1. Gateway check
  addLog("正在 Ping 本地默认网关 (192.168.1.1)...", "info");
  await delay(700);
  const isGatewayOk = Math.random() > 0.1; // 90% chance success
  if (isGatewayOk) {
    statusGateway.textContent = "正常 (2ms)";
    statusGateway.className = "status-value positive";
    addLog("本地网关连接正常，延迟: 2ms，丢包率: 0%", "success");
  } else {
    statusGateway.textContent = "连接超时";
    statusGateway.className = "status-value negative";
    addLog("本地默认网关 (192.168.1.1) 响应超时！可能局域网网络不通或 IP 冲突。", "error");
  }
  
  await delay(500);
  
  // 2. DNS check
  addLog("正在测试本地 DNS 服务器解析功能...", "info");
  await delay(800);
  const isDnsOk = isGatewayOk && (Math.random() > 0.15); // 85% chance success
  if (isDnsOk) {
    statusDns.textContent = "正常";
    statusDns.className = "status-value positive";
    addLog("DNS 解析功能正常，域名 'baidu.com' 成功解析为: 110.242.68.66", "success");
  } else {
    statusDns.textContent = "解析失败";
    statusDns.className = "status-value negative";
    addLog("DNS 服务异常！无法解析公共域名，请尝试刷新 DNS 缓存或更换为公共 DNS (如 114.114.114.114)。", "error");
  }
  
  await delay(500);
  
  // 3. Internet connectivity check
  addLog("正在进行外网多节点 Ping 延时测试...", "info");
  await delay(800);
  const isInternetOk = isDnsOk && (Math.random() > 0.1); 
  if (isInternetOk) {
    const latencies = [12, 15, 18, 20];
    const chosenLatency = latencies[Math.floor(Math.random() * latencies.length)];
    pingValue.textContent = chosenLatency;
    statusInternet.textContent = "已连接";
    statusInternet.className = "status-value positive";
    
    // Rotate ring based on latency
    const deg = -45 + (chosenLatency * 3);
    document.querySelector(".gauge-ring").style.transform = `rotate(${deg}deg)`;
    addLog(`外部网络连接正常，平均延时: ${chosenLatency}ms，连接状态优秀。`, "success");
  } else {
    pingValue.textContent = "999";
    statusInternet.textContent = "受限/无连接";
    statusInternet.className = "status-value negative";
    document.querySelector(".gauge-ring").style.transform = "rotate(230deg)";
    addLog("外网连通性测试失败！无法连接至外部网段骨干节点。", "error");
  }
  
  addLog("网络诊断流程结束。", "info");
  
  diagnoseNetworkBtn.removeAttribute("disabled");
  repairNetworkBtn.removeAttribute("disabled");
  isNetworkWorking = false;
}

async function runNetworkRepair() {
  if (isScanning || isRepairing || isNetworkWorking) return;
  isNetworkWorking = true;
  
  diagnoseNetworkBtn.setAttribute("disabled", "true");
  repairNetworkBtn.setAttribute("disabled", "true");
  consoleHeader.setAttribute("aria-expanded", "true");
  
  clearLogs();
  addLog("启动一键网络协议栈及 DNS 一键修复引擎...", "warn");
  await delay(600);
  
  // 1. Flush DNS
  addLog("正在清除本地客户端 DNS 解析缓存...", "info");
  addLog("执行指令: ipconfig /flushdns", "info");
  await delay(800);
  addLog("成功刷新 Windows DNS 解析缓存缓存目录。", "success");
  
  await delay(500);
  
  // 2. Reset Winsock
  addLog("正在重置 Windows 套接字(Winsock)服务协议目录...", "info");
  addLog("执行指令: netsh winsock reset", "info");
  await delay(1000);
  addLog("成功重置 Winsock 目录。网络通信端口与底层通道初始化成功。", "success");
  
  await delay(500);
  
  // 3. Reset TCP/IP
  addLog("正在重置 TCP/IP 路由参数及协议树...", "info");
  addLog("执行指令: netsh int ip reset", "info");
  await delay(900);
  addLog("TCP/IP 堆栈参数重置成功，已重定向默认路由表。", "success");
  
  await delay(500);
  
  // 4. IP release & renew
  addLog("正在向局域网 DHCP 服务器重新请求分配 IP 地址...", "info");
  addLog("执行指令: ipconfig /release", "info");
  await delay(600);
  addLog("网卡当前绑定的 IPv4 地址已成功释放。", "success");
  
  addLog("执行指令: ipconfig /renew", "info");
  await delay(1200);
  addLog("IPv4 地址重新配置成功，当前获取地址: 192.168.1.108 | 网关: 192.168.1.1", "success");
  
  await delay(600);
  addLog("底层修复指令执行完毕，正在进行闭环连通性测试...", "info");
  
  // Run positive diagnostic check
  statusGateway.textContent = "正常 (2ms)";
  statusGateway.className = "status-value positive";
  await delay(400);
  
  statusDns.textContent = "正常";
  statusDns.className = "status-value positive";
  await delay(400);
  
  pingValue.textContent = "14";
  statusInternet.textContent = "已连接";
  statusInternet.className = "status-value positive";
  document.querySelector(".gauge-ring").style.transform = "rotate(-3deg)";
  addLog("测试通过！网络服务已恢复正常连通状态。", "success");
  
  diagnoseNetworkBtn.removeAttribute("disabled");
  repairNetworkBtn.removeAttribute("disabled");
  isNetworkWorking = false;
}

// ----------------------------------------------------
// Detail Drawer Handlers
// ----------------------------------------------------

function openDetails(id) {
  const comp = currentComponents.find(c => c.id === id);
  if (!comp) return;

  drawerTitle.textContent = comp.name;

  let dllsHtml = comp.dlls.map(dll => `<li>${dll}</li>`).join("");
  let remediesHtml = comp.remedies.map((step, idx) => `
    <div class="remedy-step">
      <span class="step-number">${idx + 1}</span>
      <span class="step-desc">${step}</span>
    </div>
  `).join("");

  let statusClass = comp.status === "normal" ? "badge-success" : "badge-error";
  let statusText = comp.status === "normal" ? "正常" : "异常";

  drawerBody.innerHTML = `
    <div class="detail-block">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
        <h4>组件状态</h4>
        <span class="card-badge ${statusClass}">${statusText}</span>
      </div>
      <p style="font-weight: 500; color: var(--text-primary);">${comp.desc}</p>
    </div>

    <div class="detail-block">
      <h4>组件核心说明</h4>
      <p>${comp.fullDesc}</p>
    </div>

    <div class="detail-block">
      <h4>所包含的关键动态链接库 (DLL)</h4>
      <ul class="dll-list">
        ${dllsHtml}
      </ul>
    </div>

    <div class="detail-block">
      <h4>关联注册表定位</h4>
      <p style="font-family: var(--font-mono); font-size:12px; word-break:break-all; background:rgba(0,0,0,0.15); padding:10px; border-radius: var(--border-radius-sm); border: 1px solid var(--border-card);">
        ${comp.registry}
      </p>
    </div>

    <div class="detail-block">
      <h4>修复解决方案</h4>
      <div class="remedy-list">
        ${remediesHtml}
      </div>
    </div>
  `;

  detailDrawer.setAttribute("aria-hidden", "false");
  detailDrawer.focus();
}

function closeDetails() {
  detailDrawer.setAttribute("aria-hidden", "true");
}

// ----------------------------------------------------
// Helper Functions
// ----------------------------------------------------

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ----------------------------------------------------
// Event Listeners & Initializations
// ----------------------------------------------------

// Initialize Component Checklist Cards on Page Load
renderChecklist();

// Re-scan button click
scanBtn.addEventListener("click", () => {
  runSystemScan();
});

// One-Click Repair button click
repairBtn.addEventListener("click", () => {
  runSystemRepair();
});

// Network Diagnose button click
diagnoseNetworkBtn.addEventListener("click", () => {
  runNetworkDiagnose();
});

// Network Repair button click
repairNetworkBtn.addEventListener("click", () => {
  runNetworkRepair();
});

// Expand/Collapse Console click
consoleHeader.addEventListener("click", () => {
  const isExpanded = consoleHeader.getAttribute("aria-expanded") === "true";
  consoleHeader.setAttribute("aria-expanded", !isExpanded);
});

// Theme Toggle logic
themeToggle.addEventListener("click", () => {
  const isDark = document.body.classList.contains("theme-dark");
  if (isDark) {
    document.body.classList.replace("theme-dark", "theme-light");
  } else {
    document.body.classList.replace("theme-light", "theme-dark");
  }
});

// Tab Switches Event Listeners
tabSystem.addEventListener("click", () => {
  if (isScanning || isRepairing || isNetworkWorking) return;
  tabSystem.classList.add("active");
  tabNetwork.classList.remove("active");
  contentSystem.classList.add("active");
  contentNetwork.classList.remove("active");
  contentSystem.style.display = "block";
  contentNetwork.style.display = "none";
});

tabNetwork.addEventListener("click", () => {
  if (isScanning || isRepairing || isNetworkWorking) return;
  tabNetwork.classList.add("active");
  tabSystem.classList.remove("active");
  contentNetwork.classList.add("active");
  contentSystem.classList.remove("active");
  contentNetwork.style.display = "block";
  contentSystem.style.display = "none";
});

// Close drawer via backdrop overlay click
document.getElementById("drawerOverlay").addEventListener("click", closeDetails);

// Close drawer via close button click
closeDrawerBtn.addEventListener("click", closeDetails);

// Close drawer via Escape key
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeDetails();
  }
});
