// アプリ本体: サイドバー描画、3ステップの進行管理、タイピング判定、
// 実行エンジン: HTML直接表示 / TS・React・RN(Babel変換) / Git(シミュレーター) / Python(Pyodide) / SQL(sql.js)

const STORAGE_KEY = "code-dojo-progress-v1";
const BROKEN_KEY = "code-dojo-progress-broken";

// loadWarning は loadProgress() が代入するため、progress より先に宣言する
// （後に置くと let の巻き上げ規則で「初期化前アクセス」エラーになりアプリ全体が停止する）
let loadWarning = null;
let progress = loadProgress();
let currentLessonId = null;
let currentReviewId = null;
let currentReviewProblem = 0;
let currentStep = 1;
let previewTimer = null;

// 壊れたデータを黙って0に戻さない: 生データを退避キーへ移してから初期化し、警告を残す
function loadProgress() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") throw new Error("形式が不正です");
    return parsed;
  } catch (e) {
    try { localStorage.setItem(BROKEN_KEY, raw); } catch (e2) { /* 退避できなくても続行 */ }
    loadWarning =
      "⚠ 保存されていた進捗データが読み取れなかったため、進捗を初期化しました。" +
      "元のデータは削除せず <code>" + BROKEN_KEY + "</code> というキーに退避してあります（復元の手がかりになります）。";
    return {};
  }
}

function saveProgress() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

function lessonProgress(id) {
  if (!progress[id]) progress[id] = { step1: false, step2: false, done: false };
  return progress[id];
}

function getLesson(id) {
  return LESSONS.find(function (l) { return l.id === id; });
}

// カリキュラム順（UNITSの並び × 各ユニット内の定義順）
function orderedLessons() {
  const arr = [];
  UNITS.forEach(function (u) {
    LESSONS.forEach(function (l) { if (l.unit === u.id) arr.push(l); });
  });
  return arr;
}

function escapeHtml(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// 完成判定用の正規化: 改行コード統一、行末スペース除去、末尾の空行除去
function normalize(code) {
  return code
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map(function (line) { return line.replace(/[ \t]+$/, ""); })
    .join("\n")
    .replace(/\n+$/, "");
}

// ---------- プレビュー実行エンジン ----------

const CDN_BABEL = '<script src="https://unpkg.com/@babel/standalone@7.24.7/babel.min.js"><\/script>';
const CDN_REACT =
  '<script src="https://unpkg.com/react@18.3.1/umd/react.production.min.js"><\/script>' +
  '<script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js"><\/script>';
const CDN_PYODIDE = '<script src="https://cdn.jsdelivr.net/pyodide/v0.26.2/full/pyodide.js"><\/script>';
const CDN_SQLJS = '<script src="https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.2/sql-wasm.min.js"><\/script>';
const SQLJS_BASE = "https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.2/";
// ruby.wasm: バージョン固定（@latestはある日突然壊れるため）。実測: 転送7.8MB・初期化4.5秒（2026-07-18）
const RUBY_WASM_PKG = "https://cdn.jsdelivr.net/npm/@ruby/3.4-wasm-wasi@2.9.3-2.9.4/dist/";
const CDN_RUBY = '<script src="' + RUBY_WASM_PKG + 'browser.umd.js"><\/script>';

// React Native部品のWeb再現シム（教材で使う部品のみ）
const RN_SHIM =
  'var StyleSheet={create:function(s){return s;}};' +
  'function __rns(s){if(!s)return {};var o=Object.assign({},s);' +
  'if(o.paddingVertical!==undefined){o.paddingTop=o.paddingVertical;o.paddingBottom=o.paddingVertical;delete o.paddingVertical;}' +
  'if(o.paddingHorizontal!==undefined){o.paddingLeft=o.paddingHorizontal;o.paddingRight=o.paddingHorizontal;delete o.paddingHorizontal;}' +
  'if(o.marginVertical!==undefined){o.marginTop=o.marginVertical;o.marginBottom=o.marginVertical;delete o.marginVertical;}' +
  'if(o.marginHorizontal!==undefined){o.marginLeft=o.marginHorizontal;o.marginRight=o.marginHorizontal;delete o.marginHorizontal;}' +
  'return o;}' +
  'var View=function(p){return React.createElement("div",{style:Object.assign({display:"flex",flexDirection:"column"},__rns(p.style))},p.children);};' +
  'var SafeAreaView=View;' +
  'var Text=function(p){return React.createElement("div",{style:__rns(p.style)},p.children);};' +
  'var TouchableOpacity=function(p){return React.createElement("div",{style:Object.assign({cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center"},__rns(p.style)),onClick:p.onPress},p.children);};' +
  'var Button=function(p){return React.createElement("button",{onClick:p.onPress,style:{padding:"8px 12px",margin:"4px 0",cursor:"pointer"}},p.title);};' +
  'var TextInput=function(p){return React.createElement("input",{style:Object.assign({border:"1px solid #ccc",padding:"6px"},__rns(p.style)),value:p.value,placeholder:p.placeholder,onChange:function(e){if(p.onChangeText)p.onChangeText(e.target.value);}});};' +
  'var FlatList=function(p){return React.createElement("div",{style:{overflowY:"auto"}},p.data.map(function(it,i){return React.createElement("div",{key:p.keyExtractor?p.keyExtractor(it,i):i},p.renderItem({item:it,index:i}));}));};';

// ----- Gitシミュレーター（親側で実行し、静的なターミナルHTMLを生成。オフライン動作） -----

function runGitSim(lesson, code) {
  const setup = lesson.termSetup || {};
  const state = {
    inited: !!setup.inited,
    url: "",
    pushed: false,
    commits: (setup.commits || []).slice(),
    files: {},
  };
  (setup.committed || []).forEach(function (f) { state.files[f] = "committed"; });
  (setup.modified || []).forEach(function (f) { state.files[f] = "modified"; });
  (setup.untracked || []).forEach(function (f) { state.files[f] = "untracked"; });

  const HASHES = ["a1b2c3d", "f4e5d6c", "9c8b7a6", "3d4e5f6", "7a8b9c0", "5e6f7a8"];
  const out = [];
  function push(cls, text) {
    out.push('<div class="' + cls + '">' + escapeHtml(text) + "</div>");
  }
  function fileNames(states) {
    return Object.keys(state.files).filter(function (f) {
      return states.indexOf(state.files[f]) !== -1;
    });
  }

  code.replace(/\r\n/g, "\n").split("\n").forEach(function (raw) {
    const line = raw.trim();
    if (!line) return;
    if (line.charAt(0) === "#") { push("t-comment", line); return; }
    push("t-cmd", "$ " + line);
    if (line.indexOf("git") !== 0) { push("t-note", "（gitコマンドではありません）"); return; }

    if (line === "git init") {
      state.inited = true;
      push("t-out", "Initialized empty Git repository in /my-project/.git/");
      return;
    }
    if (!state.inited) {
      push("t-err", "fatal: not a git repository（先に git init が必要です）");
      return;
    }
    if (line === "git status") {
      push("t-out", "On branch main");
      const staged = fileNames(["staged-new", "staged-mod"]);
      const modified = fileNames(["modified"]);
      const untracked = fileNames(["untracked"]);
      if (staged.length) {
        push("t-out", "Changes to be committed:（コミット予定）");
        staged.forEach(function (f) {
          push("t-green", "        " + (state.files[f] === "staged-new" ? "new file:   " : "modified:   ") + f);
        });
      }
      if (modified.length) {
        push("t-out", "Changes not staged for commit:（変更あり・未ステージ）");
        modified.forEach(function (f) { push("t-red", "        modified:   " + f); });
      }
      if (untracked.length) {
        push("t-out", "Untracked files:（未追跡の新ファイル）");
        untracked.forEach(function (f) { push("t-red", "        " + f); });
      }
      if (!staged.length && !modified.length && !untracked.length) {
        push("t-out", "nothing to commit, working tree clean（すべて記録済み）");
      }
      return;
    }
    if (line === "git add .") {
      fileNames(["untracked"]).forEach(function (f) { state.files[f] = "staged-new"; });
      fileNames(["modified"]).forEach(function (f) { state.files[f] = "staged-mod"; });
      push("t-note", "（すべての変更をステージに追加しました）");
      return;
    }
    const addMatch = line.match(/^git add (\S+)$/);
    if (addMatch) {
      const f = addMatch[1];
      if (state.files[f] === "untracked") { state.files[f] = "staged-new"; push("t-note", "（" + f + " をステージに追加しました）"); }
      else if (state.files[f] === "modified") { state.files[f] = "staged-mod"; push("t-note", "（" + f + " をステージに追加しました）"); }
      else if (state.files[f]) { push("t-note", "（" + f + " に新しい変更はありません）"); }
      else { push("t-err", "fatal: pathspec '" + f + "' did not match any files"); }
      return;
    }
    const commitMatch = line.match(/^git commit -m "(.+)"$/);
    if (commitMatch) {
      const staged = fileNames(["staged-new", "staged-mod"]);
      if (!staged.length) {
        push("t-err", "nothing to commit（git add を忘れていませんか？）");
        return;
      }
      const hash = HASHES[state.commits.length % HASHES.length];
      staged.forEach(function (f) { state.files[f] = "committed"; });
      state.commits.push({ hash: hash, msg: commitMatch[1] });
      push("t-out", "[main " + hash + "] " + commitMatch[1]);
      push("t-out", " " + staged.length + " file(s) changed");
      return;
    }
    if (line === "git log --oneline") {
      if (!state.commits.length) { push("t-err", "fatal: コミットがまだありません"); return; }
      state.commits.slice().reverse().forEach(function (c) {
        push("t-out", c.hash + " " + c.msg);
      });
      return;
    }
    if (line === "git diff") {
      const modified = fileNames(["modified"]);
      if (!modified.length) { push("t-note", "（未ステージの変更はありません）"); return; }
      modified.forEach(function (f) {
        push("t-out", "diff --git a/" + f + " b/" + f);
        push("t-red", "- <p>準備中です</p>");
        push("t-green", "+ <p>プロフィールを公開しました！</p>");
      });
      return;
    }
    const remoteMatch = line.match(/^git remote add origin (\S+)$/);
    if (remoteMatch) {
      state.url = remoteMatch[1];
      push("t-note", "（リモート origin を登録しました: " + state.url + "）");
      return;
    }
    if (line === "git push -u origin main" || line === "git push") {
      if (!state.url) { push("t-err", "fatal: リモートが未登録です（git remote add origin URL が先）"); return; }
      if (!state.commits.length) { push("t-err", "error: コミットがないため送るものがありません"); return; }
      if (state.pushed) { push("t-out", "Everything up-to-date（送信済み・変更なし）"); return; }
      state.pushed = true;
      push("t-out", "To " + state.url);
      push("t-out", " * [new branch]      main -> main");
      return;
    }
    push("t-note", "（このコマンドはシミュレーター未対応です。本物のターミナルで試してみましょう）");
  });

  return '<!DOCTYPE html><html><head><meta charset="UTF-8"><style>' +
    "body{margin:0}" +
    ".term{background:#0f172a;color:#e2e8f0;font-family:Consolas,monospace;padding:14px 16px;font-size:13px;line-height:1.8;min-height:100vh;box-sizing:border-box}" +
    ".t-cmd{color:#fff;font-weight:bold}.t-out{color:#94a3b8;white-space:pre-wrap}" +
    ".t-note{color:#64748b;font-style:italic}.t-err{color:#f87171}" +
    ".t-green{color:#4ade80;white-space:pre-wrap}.t-red{color:#f87171;white-space:pre-wrap}.t-comment{color:#64748b}" +
    '</style></head><body><div class="term">' +
    (out.length ? out.join("") : '<div class="t-note">（コマンドを入力するとここに結果が表示されます）</div>') +
    "</div></body></html>";
}

// ----- Railsリクエスト・シミュレーター（親側で実行・オフライン。教材のコードパターンのみ対応） -----

function runRailsSim(lesson, code) {
  const req = lesson.railsRequest || "GET /posts";
  const reqPath = req.split(" ")[1] || "/";
  const data = lesson.railsData || {};
  const src = code.replace(/\r\n/g, "\n");
  const out = [];
  function push(cls, text) {
    out.push('<div class="' + cls + '">' + escapeHtml(text) + "</div>");
  }

  let rendered = null;
  push("t-cmd", "🌐 ブラウザ → " + req);

  // 1) routes.rb の get "パス", to: "コントローラ#アクション" を対応表として読む
  const routes = [];
  const routeRe = /get\s+"([^"]+)",\s*to:\s*"(\w+)#(\w+)"/g;
  let m;
  while ((m = routeRe.exec(src))) routes.push({ path: m[1], ctrl: m[2], action: m[3] });
  const route = routes.find(function (r) { return r.path === reqPath; });
  if (!route) {
    push("t-err", 'No route matches [GET "' + reqPath + '"]');
    push("t-note", "（routes.rb に " + reqPath + " の get がありません。対応表に追加しましょう）");
    return railsDoc(out, rendered);
  }
  const ctrlClass = route.ctrl.charAt(0).toUpperCase() + route.ctrl.slice(1) + "Controller";
  push("t-route", 'routes.rb: "' + route.path + '" → ' + ctrlClass + "#" + route.action);

  // 2) controller の def アクション から @変数 = Model.all / Model.find(n) を拾う
  const actionMatch = src.match(new RegExp("def\\s+" + route.action + "\\b([\\s\\S]*?)^\\s*end\\s*$", "m"));
  if (!actionMatch) {
    push("t-err", "The action '" + route.action + "' could not be found for " + ctrlClass);
    push("t-note", "（controller に def " + route.action + " がありません）");
    return railsDoc(out, rendered);
  }
  const vars = {};
  const assignRe = /@(\w+)\s*=\s*(\w+)\.(all|find\((\d+)\))/g;
  let hadAssign = false;
  while ((m = assignRe.exec(actionMatch[1]))) {
    hadAssign = true;
    const table = m[2].toLowerCase() + "s"; // Post → posts（単数形⇔複数形の規約）
    const rows = data[table] || [];
    if (m[3] === "all") {
      vars[m[1]] = rows;
      push("t-ctrl", "controller: @" + m[1] + " = " + m[2] + ".all → " + table + "テーブルから" + rows.length + "件取得");
    } else {
      const id = Number(m[4]);
      vars[m[1]] = rows.find(function (r) { return r.id === id; }) || null;
      push("t-ctrl", "controller: @" + m[1] + " = " + m[2] + ".find(" + id + ") → id=" + id + " の1件を取得");
    }
  }
  if (!hadAssign) push("t-ctrl", "controller: " + route.action + " を実行（@変数の代入なし）");

  // 3) view（# app/views/ 区切り以降）をERBとしてレンダリング
  const viewMatch = src.match(/# app\/views\/[^\n]*\n([\s\S]*)$/);
  if (!viewMatch || !viewMatch[1].trim()) {
    push("t-err", "Missing template（view ファイルがありません）");
    return railsDoc(out, rendered);
  }
  push("t-view", "view: ERBをレンダリング → 完成したHTMLをブラウザへ返す");
  rendered = renderErb(viewMatch[1], vars, push);
  return railsDoc(out, rendered);
}

function renderErb(erb, vars, push) {
  let html = erb;
  // <% @list.each do |x| %> 〜 <% end %>
  html = html.replace(/<%\s*@(\w+)\.each\s+do\s*\|(\w+)\|\s*%>([\s\S]*?)<%\s*end\s*%>/g, function (_all, name, item, block) {
    const list = vars[name];
    if (!list) {
      push("t-err", "undefined method `each' for nil（@" + name + " が nil。controllerで代入されていません）");
      return "";
    }
    return list.map(function (row) {
      return block.replace(new RegExp("<%=\\s*" + item + "\\.(\\w+)\\s*%>", "g"), function (_a, attr) {
        return row[attr] !== undefined ? escapeHtml(String(row[attr])) : "";
      });
    }).join("");
  });
  // <%= @obj.attr %>（単体オブジェクト）
  html = html.replace(/<%=\s*@(\w+)\.(\w+)\s*%>/g, function (_all, name, attr) {
    const obj = vars[name];
    if (!obj) {
      push("t-err", "undefined method for nil（@" + name + " が nil）");
      return "";
    }
    return obj[attr] !== undefined ? escapeHtml(String(obj[attr])) : "";
  });
  // 未対応のERBが残っていたら注記して除去
  if (/<%[\s\S]*?%>/.test(html)) {
    push("t-note", "（一部のERBはシミュレーター未対応のため無視しました）");
    html = html.replace(/<%=?[\s\S]*?%>/g, "");
  }
  return html;
}

function railsDoc(out, rendered) {
  return '<!DOCTYPE html><html><head><meta charset="UTF-8"><style>' +
    "body{margin:0;font-family:sans-serif}" +
    ".term{background:#0f172a;color:#e2e8f0;font-family:Consolas,monospace;padding:14px 16px;font-size:13px;line-height:1.9}" +
    ".t-cmd{color:#fff;font-weight:bold}.t-route{color:#93c5fd}.t-ctrl{color:#fcd34d}.t-view{color:#86efac}" +
    ".t-err{color:#f87171}.t-note{color:#64748b;font-style:italic}" +
    ".browser-label{font-size:11px;color:#94a3b8;padding:6px 16px;background:#f1f5f9;border-bottom:1px solid #e2e8f0}" +
    ".browser{padding:16px 20px;line-height:1.8}" +
    '</style></head><body><div class="term">' + out.join("") + "</div>" +
    (rendered !== null
      ? '<div class="browser-label">🌐 ブラウザに表示されるHTML</div><div class="browser">' + rendered + "</div>"
      : "") +
    "</body></html>";
}

// ----- ActiveRecord → SQL 翻訳（rails-02用。教材のパターンのみ対応） -----

function translateAR(line) {
  function table(model) { return model.toLowerCase() + "s"; }
  let m;
  if ((m = line.match(/^(\w+)\.all$/))) return "SELECT * FROM " + table(m[1]) + ";";
  if ((m = line.match(/^(\w+)\.count$/))) return "SELECT COUNT(*) FROM " + table(m[1]) + ";";
  if ((m = line.match(/^(\w+)\.find\((\d+)\)$/))) return "SELECT * FROM " + table(m[1]) + " WHERE id = " + m[2] + " LIMIT 1;";
  if ((m = line.match(/^(\w+)\.where\("([^"]+)"\)\.order\((\w+):\s*:desc\)$/)))
    return "SELECT * FROM " + table(m[1]) + " WHERE " + m[2] + " ORDER BY " + m[3] + " DESC;";
  if ((m = line.match(/^(\w+)\.where\("([^"]+)"\)$/))) return "SELECT * FROM " + table(m[1]) + " WHERE " + m[2] + ";";
  if ((m = line.match(/^(\w+)\.order\((\w+):\s*:desc\)$/))) return "SELECT * FROM " + table(m[1]) + " ORDER BY " + m[2] + " DESC;";
  if ((m = line.match(/^(\w+)\.order\(:(\w+)\)$/))) return "SELECT * FROM " + table(m[1]) + " ORDER BY " + m[2] + ";";
  return null;
}

// ----- モードごとのプレビューHTML生成 -----

function buildPreviewDoc(lesson, code) {
  const mode = lesson.previewMode || "html";
  if (mode === "html") return code;
  if (mode === "term") return runGitSim(lesson, code);
  if (mode === "rails") return runRailsSim(lesson, code);

  if (mode === "py") {
    const src = JSON.stringify(code).replace(/<\//g, "<\\/");
    return '<!DOCTYPE html><html><head><meta charset="UTF-8">' + CDN_PYODIDE +
      "<style>body{font-family:Consolas,monospace;padding:12px;font-size:13px;line-height:1.7;background:#0f172a;color:#e2e8f0;margin:0;min-height:100vh}</style></head><body>" +
      '<pre id="out" style="white-space:pre-wrap;margin:0">Python実行環境を読み込み中…（初回は10秒ほどかかります）</pre>' +
      "<script>loadPyodide().then(function(py){" +
      'var buf="";py.setStdout({batched:function(s){buf+=s+"\\n";}});py.setStderr({batched:function(s){buf+=s+"\\n";}});' +
      "try{py.runPython(" + src + ');}catch(e){buf+="⚠ "+e.message;}' +
      'document.getElementById("out").textContent=buf||"(出力なし)";' +
      '}).catch(function(e){document.getElementById("out").textContent="⚠ 読み込み失敗（ネット接続を確認してください）: "+e.message;});<\/script>' +
      "</body></html>";
  }

  if (mode === "sql") {
    const src = JSON.stringify(code).replace(/<\//g, "<\\/");
    const seed = JSON.stringify(lesson.seedSql || "").replace(/<\//g, "<\\/");
    return '<!DOCTYPE html><html><head><meta charset="UTF-8">' + CDN_SQLJS +
      "<style>body{font-family:sans-serif;padding:12px;font-size:13px;margin:0}" +
      "table{border-collapse:collapse;margin:8px 0 16px}th,td{border:1px solid #cbd5e1;padding:4px 12px;font-size:13px}" +
      "th{background:#eff6ff}.q{color:#64748b;font-family:Consolas,monospace;font-size:12px;margin-top:8px}" +
      ".err{color:#dc2626;white-space:pre-wrap}.note{color:#64748b;font-style:italic}</style></head><body>" +
      '<div id="out">データベースを読み込み中…</div>' +
      '<script>initSqlJs({locateFile:function(f){return "' + SQLJS_BASE + '"+f;}}).then(function(SQL){' +
      "var db=new SQL.Database();db.run(" + seed + ");" +
      'var el=document.getElementById("out");el.innerHTML="";' +
      "try{var results=db.exec(" + src + ");" +
      'if(!results.length){el.innerHTML="<div class=note>（結果セットなし — INSERT/UPDATE等の書き込みは成功しています。SELECTで確認してみましょう）</div>";}' +
      "results.forEach(function(r){" +
      'var h="<table><tr>";r.columns.forEach(function(c){h+="<th>"+c+"</th>";});h+="</tr>";' +
      'r.values.forEach(function(row){h+="<tr>";row.forEach(function(v){h+="<td>"+v+"</td>";});h+="</tr>";});' +
      'h+="</table>";el.innerHTML+=h;});' +
      '}catch(e){el.innerHTML="<div class=err>⚠ "+e.message+"</div>";}' +
      '}).catch(function(e){document.getElementById("out").textContent="⚠ 読み込み失敗（ネット接続を確認してください）: "+e.message;});<\/script>' +
      "</body></html>";
  }

  if (mode === "rb") {
    const src = JSON.stringify(code).replace(/<\//g, "<\\/");
    return '<!DOCTYPE html><html><head><meta charset="UTF-8">' + CDN_RUBY +
      "<style>body{font-family:Consolas,monospace;padding:12px;font-size:13px;line-height:1.7;background:#0f172a;color:#e2e8f0;margin:0;min-height:100vh}</style></head><body>" +
      '<pre id="out" style="white-space:pre-wrap;margin:0">Ruby実行環境を読み込み中…（初回は5〜10秒かかります）</pre>' +
      "<script>(function(){" +
      'var el=document.getElementById("out");' +
      'WebAssembly.compileStreaming(fetch("' + RUBY_WASM_PKG + 'ruby+stdlib.wasm"))' +
      '.then(function(mod){return window["ruby-wasm-wasi"].DefaultRubyVM(mod);})' +
      ".then(function(r){var vm=r.vm;" +
      "vm.eval('require \"stringio\"; $stdout = StringIO.new');" +
      "var err=null;" +
      "try{vm.eval(" + src + ");}catch(e){err=String(e.message||e).split(\"\\n\").slice(0,3).join(\"\\n\");}" +
      "var out=vm.eval('$stdout.string').toString();" +
      'el.textContent=out+(err?"⚠ "+err:"")||"(出力なし)";' +
      "})" +
      '.catch(function(e){el.textContent="⚠ 読み込み失敗（ネット接続を確認してください）: "+e.message;});' +
      "})();<\/script></body></html>";
  }

  if (mode === "ar") {
    // 親側で ActiveRecord → SQL に翻訳し、iframe内のsql.jsで実行して見せる
    const items = [];
    code.replace(/\r\n/g, "\n").split("\n").forEach(function (raw) {
      const line = raw.trim();
      if (!line || line.charAt(0) === "#") return;
      const sql = translateAR(line);
      items.push({ arH: escapeHtml(line), sql: sql, sqlH: sql ? escapeHtml(sql) : "" });
    });
    const seed = JSON.stringify(lesson.seedSql || "").replace(/<\//g, "<\\/");
    const payload = JSON.stringify(items).replace(/<\//g, "<\\/");
    return '<!DOCTYPE html><html><head><meta charset="UTF-8">' + CDN_SQLJS +
      "<style>body{font-family:sans-serif;padding:12px;font-size:13px;margin:0}" +
      ".ar{font-family:Consolas,monospace;background:#0f172a;color:#fcd34d;padding:6px 10px;border-radius:6px 6px 0 0;margin-top:14px}" +
      ".ar::before{content:\"rails> \";color:#64748b}" +
      ".sql{font-family:Consolas,monospace;background:#1e293b;color:#93c5fd;padding:6px 10px;border-radius:0 0 6px 6px}" +
      ".sql::before{content:\"↓ SQL: \";color:#64748b}" +
      "table{border-collapse:collapse;margin:8px 0 4px}th,td{border:1px solid #cbd5e1;padding:4px 12px;font-size:13px}" +
      "th{background:#eff6ff}.err{color:#dc2626;white-space:pre-wrap}.note{color:#64748b;font-style:italic;margin-top:6px}</style></head><body>" +
      '<div id="out">データベースを読み込み中…</div>' +
      '<script>initSqlJs({locateFile:function(f){return "' + SQLJS_BASE + '"+f;}}).then(function(SQL){' +
      "var db=new SQL.Database();db.run(" + seed + ");" +
      "var items=" + payload + ";" +
      'var el=document.getElementById("out");el.innerHTML="";' +
      "if(!items.length){el.innerHTML='<div class=note>（ActiveRecord式を1行ずつ入力して実行すると、SQLへの翻訳と結果がここに出ます）</div>';}" +
      "items.forEach(function(it){" +
      'var h="<div class=ar>"+it.arH+"</div>";' +
      "if(!it.sql){h+='<div class=note>（この書き方はシミュレーター未対応です。教材のパターンで試しましょう）</div>';el.innerHTML+=h;return;}" +
      'h+="<div class=sql>"+it.sqlH+"</div>";' +
      "try{var results=db.exec(it.sql);" +
      "if(!results.length){h+='<div class=note>（結果なし）</div>';}" +
      "results.forEach(function(r){" +
      'var t="<table><tr>";r.columns.forEach(function(c){t+="<th>"+c+"</th>";});t+="</tr>";' +
      'r.values.forEach(function(row){t+="<tr>";row.forEach(function(v){t+="<td>"+v+"</td>";});t+="</tr>";});' +
      't+="</table>";h+=t;});' +
      '}catch(e){h+="<div class=err>⚠ "+e.message+"</div>";}' +
      "el.innerHTML+=h;});" +
      '}).catch(function(e){document.getElementById("out").textContent="⚠ 読み込み失敗（ネット接続を確認してください）: "+e.message;});<\/script>' +
      "</body></html>";
  }

  // ts / react / rn は常駐ランナー（createRunner）側で実行するため、ここには来ない
  return "";
}

// ----- ts/react/rn 用の常駐ランナー -----
// srcdocを毎回作り直すとBabel/Reactの再ロード・再パースで数秒かかるため、
// ランナー文書を一度だけ読み込み、コードはpostMessageで送って変換・実行する

function isTransformMode(lesson) {
  const mode = lesson.previewMode || "html";
  return mode === "ts" || mode === "react" || mode === "rn";
}

// import・export をブラウザ実行用に取り除く（本物の書き方のまま打てるように）
function stripModuleSyntax(code) {
  return code
    .replace(/^import\s[^\n]*$/gm, "")
    .replace(/^export\s+default\s+/gm, "");
}

function buildRunnerDoc(lesson) {
  const mode = lesson.previewMode;

  if (mode === "ts") {
    return '<!DOCTYPE html><html><head><meta charset="UTF-8">' + CDN_BABEL +
      "<style>body{font-family:sans-serif;padding:12px;line-height:1.7}</style></head><body>" +
      '<div id="__scaffold">' + (lesson.scaffold || "") + "</div>" +
      '<pre id="__err" style="color:#dc2626;white-space:pre-wrap;font-size:12px"></pre>' +
      "<script>" +
      'var __scaffoldHtml=document.getElementById("__scaffold").innerHTML;' +
      'window.addEventListener("message",function(e){' +
      'var d=e.data;if(!d||d.type!=="run")return;' +
      'document.getElementById("__err").textContent="";' +
      'document.getElementById("__scaffold").innerHTML=__scaffoldHtml;' +
      "if(!d.code.trim())return;" +
      "try{var __out=Babel.transform(d.code," +
      '{filename:"main.ts",presets:[["typescript",{allExtensions:true}]]}).code;' +
      // 直前の実行の const/let と衝突しないよう毎回関数スコープで実行
      '(0,eval)("(function(){"+__out+"\\n})();");}' +
      'catch(err){document.getElementById("__err").textContent="⚠ "+err.message;}' +
      "});" +
      'parent.postMessage({type:"runner-ready"},"*");' +
      "<\/script></body></html>";
  }

  // react / rn
  const rootWrap = mode === "rn"
    ? '<div style="width:300px;height:520px;margin:10px auto;border:12px solid #111827;border-radius:28px;background:#fff;overflow:hidden" id="__rootbox"></div>'
    : '<div id="__rootbox"></div>';
  const rootDivJs = mode === "rn"
    ? "'<div id=\"root\" style=\"display:flex;flex-direction:column;height:100%;overflow:auto\"></div>'"
    : "'<div id=\"root\"></div>'";

  const shim =
    "<script>var useState=React.useState,useEffect=React.useEffect,useRef=React.useRef;" +
    'var Link=function(p){return React.createElement("a",{href:p.href,onClick:function(e){e.preventDefault();}},p.children);};' +
    (mode === "rn" ? RN_SHIM : "") +
    "<\/script>";

  return '<!DOCTYPE html><html><head><meta charset="UTF-8">' + CDN_REACT + CDN_BABEL +
    "<style>body{font-family:sans-serif;padding:8px;margin:0;line-height:1.6}button{cursor:pointer}input{font-size:14px;padding:4px}</style></head><body>" +
    rootWrap +
    '<pre id="__err" style="color:#dc2626;white-space:pre-wrap;font-size:12px;padding:0 8px"></pre>' +
    shim +
    "<script>" +
    'function __showErr(e){document.getElementById("__err").textContent="⚠ "+e.message;}' +
    "var __root=null;" +
    'window.addEventListener("message",function(e){' +
    'var d=e.data;if(!d||d.type!=="run")return;' +
    'document.getElementById("__err").textContent="";' +
    "if(__root){try{__root.unmount();}catch(x){}__root=null;}" +
    'document.getElementById("__rootbox").innerHTML=' + rootDivJs + ";" +
    "window.__MOUNT__=undefined;" +
    "if(!d.code.trim())return;" +
    "try{var __out=Babel.transform(d.code," +
    '{filename:"app.tsx",presets:[["typescript",{isTSX:true,allExtensions:true}],"react"]}).code;' +
    '(0,eval)("(function(){"+__out+"\\n})();");' +
    'if(typeof window.__MOUNT__!=="function"){throw new Error(d.mount+" というコンポーネントが見つかりません");}' +
    '__root=ReactDOM.createRoot(document.getElementById("root"));' +
    "if(d.asyncMount){Promise.resolve(window.__MOUNT__({})).then(function(el){__root.render(el);}).catch(__showErr);}" +
    'else{var __props=d.mountChildren?{children:React.createElement("p",{style:{color:"#94a3b8"}},d.mountChildren)}:null;' +
    "__root.render(React.createElement(window.__MOUNT__,__props));}" +
    "}catch(err){__showErr(err);}" +
    "});" +
    'parent.postMessage({type:"runner-ready"},"*");' +
    "<\/script></body></html>";
}

function createRunner(frame, lesson) {
  const mode = lesson.previewMode;
  let ready = false;
  let pendingMsg = null;

  function onReady(e) {
    if (!frame.isConnected) { window.removeEventListener("message", onReady); return; }
    if (e.source !== frame.contentWindow) return;
    if (!e.data || e.data.type !== "runner-ready") return;
    window.removeEventListener("message", onReady);
    ready = true;
    if (pendingMsg) { frame.contentWindow.postMessage(pendingMsg, "*"); pendingMsg = null; }
  }
  window.addEventListener("message", onReady);
  frame.srcdoc = buildRunnerDoc(lesson);

  return {
    run: function (code, opts) {
      opts = opts || {};
      const body = code.trim() ? stripModuleSyntax(code) : "";
      const msg = { type: "run", code: body };
      if (body && mode !== "ts") {
        const mountName = opts.mount || lesson.mount || "App";
        msg.mount = mountName;
        msg.code += "\n;window.__MOUNT__ = " + mountName + ";";
        msg.asyncMount = opts.asyncMount !== undefined ? opts.asyncMount : !!lesson.asyncMount;
        msg.mountChildren = lesson.mountChildren || "";
      }
      if (ready) frame.contentWindow.postMessage(msg, "*");
      else pendingMsg = msg;
    },
  };
}

function previewLabel(lesson) {
  const mode = lesson.previewMode || "html";
  if (mode === "html") return "実行結果プレビュー";
  if (mode === "term") return "ターミナル・シミュレーター（オフラインで動作）";
  if (mode === "ts") return "実行結果プレビュー（TypeScriptを自動変換して実行・要ネット接続）";
  if (mode === "py") return "実行結果（本物のPythonをブラウザ内で実行・要ネット接続）";
  if (mode === "sql") return "実行結果テーブル（本物のSQLiteをブラウザ内で実行・要ネット接続）";
  if (mode === "rn") return "スマホ画面シミュレーター（要ネット接続）";
  if (mode === "rb") return "実行結果（本物のRubyをブラウザ内で実行・要ネット接続）";
  if (mode === "rails") return "Railsリクエスト・シミュレーター（オフラインで動作・教材のパターンのみ対応）";
  if (mode === "ar") return "ActiveRecord → SQL 翻訳＋実行結果（本物のSQLiteで実行・要ネット接続）";
  return "実行結果プレビュー（Reactを自動変換して実行・要ネット接続）";
}

// py/sql/rb/arは実行が重い（wasm読み込み）ためボタン起動、それ以外は自動更新
function needsRunButton(lesson) {
  const mode = lesson.previewMode || "html";
  return mode === "py" || mode === "sql" || mode === "rb" || mode === "ar";
}

function fileChip(lesson) {
  return lesson.filename
    ? '<div class="file-chip">📄 ファイル: <code>' + escapeHtml(lesson.filename) + "</code></div>"
    : "";
}

function scaffoldNoteHtml(lesson) {
  return lesson.scaffoldNote
    ? '<div class="scaffold-note">' + lesson.scaffoldNote + "</div>"
    : "";
}

function isPhone(lesson) {
  return (lesson.previewMode || "html") === "rn";
}

// ---------- サイドバー ----------

// 完了したユニットは既定で折りたたむ（進むほどスクロールが増える問題への対処）。
// 手動の開閉はメモリだけで保持し、リロードすると既定に戻す
// （マイペースの週間タブ weekOpen と同方式。localStorageには保存しない）
const unitOpen = new Map();

// 力試しが未クリアのうちは「完了」としない——閉じると次にやるべき力試しが隠れてしまうため
function unitComplete(unitId) {
  const unitLessons = LESSONS.filter(function (l) { return l.unit === unitId; });
  if (!unitLessons.length) return false;
  if (!unitLessons.every(function (l) { return lessonProgress(l.id).done; })) return false;
  const rv = reviewForUnit(unitId);
  return rv ? reviewDone(rv.id) : true;
}

// いま開いているレッスン・力試しがこのユニット内にあるか
// （最後のレッスンを完了した瞬間に、見ているユニットが目の前で畳まれるのを防ぐ）
function unitHasCurrent(unitId) {
  if (currentLessonId) {
    const l = getLesson(currentLessonId);
    if (l && l.unit === unitId) return true;
  }
  if (currentReviewId) {
    const rv = getReview(currentReviewId);
    if (rv && rv.unit === unitId) return true;
  }
  return false;
}

function renderSidebar() {
  const nav = document.getElementById("lesson-nav");
  let html = "";
  UNITS.forEach(function (unit) {
    const unitLessons = LESSONS.filter(function (l) { return l.unit === unit.id; });
    const doneInUnit = unitLessons.filter(function (l) { return lessonProgress(l.id).done; }).length;
    const complete = unitComplete(unit.id);
    // 手動で開閉していればそれを優先し、なければ「未完了 or いま見ている」なら開く
    const open = unitOpen.has(unit.id)
      ? unitOpen.get(unit.id)
      : (!complete || unitHasCurrent(unit.id));

    html += '<details class="unit-group" data-unit="' + unit.id + '"' + (open ? " open" : "") + ">";
    html += '<summary class="unit-title">' + unit.name;
    if (unit.locked) html += '<span class="locked-badge">🔒 ' + unit.note + "</span>";
    else if (unitLessons.length) {
      html += '<span class="unit-count' + (complete ? " complete" : "") + '">' +
        (complete ? "✔ " : "") + doneInUnit + "/" + unitLessons.length + "</span>";
    }
    html += "</summary>";
    if (unit.locked || unitLessons.length === 0) {
      html += '<div class="locked-note">準備中</div>';
    } else {
      unitLessons.forEach(function (l) {
        const p = lessonProgress(l.id);
        const active = l.id === currentLessonId ? " active" : "";
        const mark = p.done ? '<span class="done-mark">✔</span>' : "";
        html +=
          '<button class="lesson-link' + active + '" data-lesson="' + l.id + '">' +
          mark + l.title + "</button>";
      });
      const rv = reviewForUnit(unit.id);
      if (rv) {
        const active = rv.id === currentReviewId ? " active" : "";
        const mark = reviewDone(rv.id) ? '<span class="done-mark">✔</span>' : "🎯 ";
        html +=
          '<button class="review-link' + active + '" data-review="' + rv.id + '">' +
          mark + rv.title + "</button>";
      }
    }
    html += "</details>";
  });
  nav.innerHTML = html;

  // 手動の開閉だけを記録する。toggleイベントは描画直後にも発火してしまい
  // 「全ユニットを手動で開いた」と誤記録されるため、summaryのクリックで拾う
  // （クリックの既定動作でこの後 open が反転するので、反転後の値を入れる）
  nav.querySelectorAll(".unit-group").forEach(function (d) {
    d.querySelector("summary").addEventListener("click", function () {
      unitOpen.set(d.dataset.unit, !d.open);
    });
  });

  nav.querySelectorAll(".lesson-link").forEach(function (btn) {
    btn.addEventListener("click", function () {
      openLesson(btn.dataset.lesson);
    });
  });

  nav.querySelectorAll(".review-link").forEach(function (btn) {
    btn.addEventListener("click", function () {
      openReview(btn.dataset.review);
    });
  });

  const doneCount = LESSONS.filter(function (l) { return lessonProgress(l.id).done; }).length;
  document.getElementById("total-progress-fill").style.width =
    Math.round((doneCount / LESSONS.length) * 100) + "%";
  document.getElementById("total-progress-text").textContent =
    doneCount + " / " + LESSONS.length + " レッスン完了";

  if (typeof renderProgressNotice === "function") renderProgressNotice();
}

// ---------- レッスン表示 ----------

function openLesson(id) {
  currentLessonId = id;
  currentReviewId = null;
  const lesson = getLesson(id);
  // これから開くレッスンが畳まれたままにならないよう、手動の開閉記録を解除する
  unitOpen.delete(lesson.unit);
  const p = lessonProgress(id);
  // 最初の未完了ステップから開始
  currentStep = !p.step1 ? 1 : !p.step2 ? 2 : 3;

  document.getElementById("welcome").hidden = true;
  document.getElementById("review-view").hidden = true;
  document.getElementById("lesson-view").hidden = false;
  const unit = UNITS.find(function (u) { return u.id === lesson.unit; });
  document.getElementById("lesson-unit").textContent = unit.name;
  document.getElementById("lesson-title").textContent = lesson.title;

  renderSidebar();
  renderStep();
}

function renderStepTabs() {
  const p = lessonProgress(currentLessonId);
  document.querySelectorAll(".step-tab").forEach(function (tab) {
    const step = Number(tab.dataset.step);
    tab.classList.toggle("active", step === currentStep);
    // ①はいつでも、②は①完了後、③は②完了後に開ける
    tab.disabled = (step === 2 && !p.step1) || (step === 3 && !p.step2);
    const doneMark =
      (step === 1 && p.step1) || (step === 2 && p.step2) || (step === 3 && p.done)
        ? ' <span class="step-done">✔</span>'
        : "";
    tab.innerHTML =
      (step === 1 ? "① 説明" : step === 2 ? "② 手本を見て入力" : "③ 見ないで挑戦") + doneMark;
  });
}

function renderStep() {
  renderStepTabs();
  const body = document.getElementById("step-body");
  if (currentStep === 1) renderStep1(body);
  if (currentStep === 2) renderStep2(body);
  if (currentStep === 3) renderStep3(body);
}

// ---------- ① 説明 ----------

function renderStep1(body) {
  const lesson = getLesson(currentLessonId);
  const p = lessonProgress(currentLessonId);
  body.innerHTML =
    '<div class="explanation">' + lesson.explanation + "</div>" +
    '<div class="btn-row"><button class="btn" id="step1-done">理解した！ 手本入力へ進む →</button></div>' +
    (p.step1 ? '<div class="success-banner">このステップは完了済みです。読み返しはいつでもOK。</div>' : "");
  document.getElementById("step1-done").addEventListener("click", function () {
    p.step1 = true;
    saveProgress();
    currentStep = 2;
    renderStep();
  });
}

// ---------- ② 手本を見て入力 ----------

function renderStep2(body) {
  const lesson = getLesson(currentLessonId);
  const p = lessonProgress(currentLessonId);
  const phoneClass = isPhone(lesson) ? " phone" : "";
  const runBtn = needsRunButton(lesson)
    ? '<div class="btn-row"><button class="btn secondary" id="run-preview">▶ 実行して結果を見る</button></div>'
    : "";
  body.innerHTML =
    fileChip(lesson) +
    '<p>下の手本コードを見ながら、右の入力欄に<strong>1文字ずつ正確に</strong>打ち込んでください。' +
    "打った部分は<span style=\"color:var(--ok)\">緑</span>、間違いは<span style=\"color:var(--ng)\">赤</span>で表示されます。</p>" +
    scaffoldNoteHtml(lesson) +
    '<div class="type-grid">' +
    '<div><div class="pane-label">手本コード</div><div class="model-view" id="model-view"></div></div>' +
    '<div><div class="pane-label">あなたの入力（Tabキーでスペース2つ）</div>' +
    '<textarea class="code-input" id="type-input" spellcheck="false" autocapitalize="off" autocomplete="off"></textarea>' +
    '<div class="type-stats">正確率: <strong id="stat-acc">-</strong>　進捗: <strong id="stat-prog">0%</strong></div></div>' +
    "</div>" +
    '<div class="pane-label" style="margin-top:14px">' + previewLabel(lesson) + "</div>" +
    runBtn +
    '<iframe class="preview-frame' + phoneClass + '" id="live-preview" sandbox="allow-scripts allow-same-origin"></iframe>' +
    '<div id="step2-result"></div>';

  const input = document.getElementById("type-input");
  setupTabKey(input);

  // 手本ビューは初回に一度だけspanを構築し、以降は変わった文字のクラスだけ差分更新する
  // （毎キーの innerHTML 全再構築は手本が長いほど打鍵が重くなるため）
  const model = lesson.model;
  const view = document.getElementById("model-view");
  let viewHtml = "";
  for (let i = 0; i < model.length; i++) {
    viewHtml += '<span class="pending">' + escapeHtml(model[i]) + "</span>";
  }
  view.innerHTML = viewHtml + '<span class="extra"></span>';
  const charSpans = view.children;
  const extraSpan = charSpans[model.length];
  let prevValue = "";

  const runner = isTransformMode(lesson)
    ? createRunner(document.getElementById("live-preview"), lesson)
    : null;

  input.addEventListener("input", function () {
    updateTypeView(input.value);
  });

  if (needsRunButton(lesson)) {
    document.getElementById("run-preview").addEventListener("click", function () {
      document.getElementById("live-preview").srcdoc = buildPreviewDoc(lesson, input.value);
    });
  }

  if (p.step2) {
    showStep2Success();
  }

  function schedulePreview(value) {
    const frame = document.getElementById("live-preview");
    if (!frame) return;
    if (needsRunButton(lesson)) return; // py/sql はボタンで実行
    clearTimeout(previewTimer);
    if (runner) {
      // 変換系は打鍵が止まってから常駐ランナーへ送る（毎キー変換は重いため）
      previewTimer = setTimeout(function () { runner.run(value); }, 400);
      return;
    }
    // html/term もiframe文書の作り直しは毎キーには重いので、少しだけ待って反映
    previewTimer = setTimeout(function () {
      frame.srcdoc = buildPreviewDoc(lesson, value);
    }, 150);
  }

  function updateTypeView(value) {
    // 前回入力と一致している先頭部分は触らず、変わった範囲のspanだけ更新
    let start = 0;
    const minLen = Math.min(prevValue.length, value.length);
    while (start < minLen && prevValue[start] === value[start]) start++;
    const end = Math.min(Math.max(prevValue.length, value.length), model.length);
    for (let i = start; i < end; i++) {
      charSpans[i].className =
        i >= value.length ? "pending" : value[i] === model[i] ? "ok" : "ng";
    }
    extraSpan.textContent = value.length > model.length ? value.slice(model.length) : "";
    prevValue = value;

    let correct = 0;
    const typed = Math.min(value.length, model.length);
    for (let i = 0; i < typed; i++) {
      if (value[i] === model[i]) correct++;
    }
    document.getElementById("stat-acc").textContent =
      typed === 0 ? "-" : Math.round((correct / typed) * 100) + "%";
    document.getElementById("stat-prog").textContent =
      Math.round((correct / model.length) * 100) + "%";

    schedulePreview(value);

    if (normalize(value) === normalize(model) && !p.step2) {
      p.step2 = true;
      saveProgress();
      showStep2Success();
      renderStepTabs();
      renderSidebar();
    }
  }

  function showStep2Success() {
    document.getElementById("step2-result").innerHTML =
      '<div class="success-banner">🎉 完全一致！ 手本入力クリア！</div>' +
      '<div class="btn-row"><button class="btn" id="to-step3">③ 見ないで挑戦へ →</button></div>';
    document.getElementById("to-step3").addEventListener("click", function () {
      currentStep = 3;
      renderStep();
    });
  }
}

// ---------- ③ 見ないで挑戦 ----------

function renderStep3(body) {
  const lesson = getLesson(currentLessonId);
  const c = lesson.challenge;
  const p = lessonProgress(currentLessonId);
  const phoneClass = isPhone(lesson) ? " phone" : "";
  const challengeOpts = { mount: c.mount, asyncMount: c.asyncMount };

  let chips = "";
  c.allowed.forEach(function (a) {
    chips += '<span class="allowed-chip">' + escapeHtml(a) + "</span>";
  });

  body.innerHTML =
    fileChip(lesson) +
    '<div class="challenge-spec"><h4>📋 お題</h4><p>' + c.spec + "</p></div>" +
    '<div class="pane-label">使ってよい要素（これだけがヒント。手本は見ない！）</div>' +
    '<div class="allowed-list">' + chips + "</div>" +
    scaffoldNoteHtml(lesson) +
    '<textarea class="code-input" id="challenge-input" spellcheck="false" autocapitalize="off" autocomplete="off" placeholder="ここに何も見ずに書いてみよう"></textarea>' +
    '<div class="btn-row">' +
    '<button class="btn secondary" id="challenge-preview-btn">▶ 実行して結果を見る</button>' +
    '<button class="btn" id="reveal-btn">答え合わせする</button>' +
    "</div>" +
    '<div class="pane-label">あなたのコードの実行結果</div>' +
    '<iframe class="preview-frame' + phoneClass + '" id="challenge-preview" sandbox="allow-scripts allow-same-origin"></iframe>' +
    '<div id="answer-area"></div>';

  const input = document.getElementById("challenge-input");
  setupTabKey(input);

  const challengeRunner = isTransformMode(lesson)
    ? createRunner(document.getElementById("challenge-preview"), lesson)
    : null;

  document.getElementById("challenge-preview-btn").addEventListener("click", function () {
    if (challengeRunner) {
      challengeRunner.run(input.value, challengeOpts);
    } else {
      document.getElementById("challenge-preview").srcdoc =
        buildPreviewDoc(lesson, input.value);
    }
  });

  document.getElementById("reveal-btn").addEventListener("click", function () {
    let checks = "";
    c.checklist.forEach(function (item, i) {
      checks +=
        '<li><label><input type="checkbox" class="check-item" data-i="' + i + '">' +
        escapeHtml(item) + "</label></li>";
    });
    document.getElementById("answer-area").innerHTML =
      '<div class="answer-area">' +
      '<div class="pane-label">模範解答（自分のコードと見比べよう。違っていても、動けば正解！）</div>' +
      '<div class="answer-code">' + escapeHtml(c.model) + "</div>" +
      '<div class="pane-label" style="margin-top:12px">模範解答の実行結果</div>' +
      '<iframe class="preview-frame' + phoneClass + '" id="model-preview" sandbox="allow-scripts allow-same-origin"></iframe>' +
      '<div class="pane-label" style="margin-top:12px">セルフチェック（全部チェックで完了ボタンが押せます）</div>' +
      '<ul class="checklist">' + checks + "</ul>" +
      '<button class="btn" id="complete-btn" disabled>このレッスンを完了する 🎉</button>' +
      '<div class="next-lesson-row" id="next-row"></div>' +
      "</div>";

    if (isTransformMode(lesson)) {
      createRunner(document.getElementById("model-preview"), lesson).run(c.model, challengeOpts);
    } else {
      document.getElementById("model-preview").srcdoc = buildPreviewDoc(lesson, c.model);
    }

    const completeBtn = document.getElementById("complete-btn");
    const boxes = document.querySelectorAll(".check-item");
    boxes.forEach(function (box) {
      box.addEventListener("change", function () {
        const allChecked = Array.prototype.every.call(boxes, function (b) { return b.checked; });
        completeBtn.disabled = !allChecked;
      });
    });

    completeBtn.addEventListener("click", function () {
      p.done = true;
      saveProgress();
      renderSidebar();
      renderStepTabs();
      const next = nextLesson();
      document.getElementById("next-row").innerHTML =
        '<div class="success-banner">🏆 レッスン完了！おつかれさま！</div>' +
        (next
          ? '<div class="btn-row"><button class="btn" id="next-btn">次のレッスン: ' + next.title + " →</button></div>"
          : '<div class="btn-row"><span>🎓 全レッスン完了！カリキュラム完走おめでとうございます！次は本物の環境（VSCode / Git / create-next-app / Expo / Python）に挑戦しましょう。</span></div>');
      if (next) {
        document.getElementById("next-btn").addEventListener("click", function () {
          openLesson(next.id);
        });
      }
    });
  });

  if (p.done) {
    body.insertAdjacentHTML(
      "afterbegin",
      '<div class="success-banner">このレッスンは完了済みです。復習はいつでもどうぞ。</div>'
    );
  }
}

function nextLesson() {
  const arr = orderedLessons();
  const idx = arr.findIndex(function (l) { return l.id === currentLessonId; });
  return arr[idx + 1] || null;
}

// ---------- 力試し（各ユニット末の総合復習） ----------

function allReviews() {
  return typeof REVIEWS !== "undefined" ? REVIEWS : [];
}

function getReview(id) {
  return allReviews().find(function (r) { return r.id === id; });
}

function reviewForUnit(unitId) {
  return allReviews().find(function (r) { return r.unit === unitId; });
}

function reviewProgress(id) {
  if (!progress.__reviews) progress.__reviews = {};
  if (!progress.__reviews[id]) progress.__reviews[id] = { done: {} };
  return progress.__reviews[id];
}

function reviewDone(id) {
  const rv = getReview(id);
  if (!rv) return false;
  const rp = reviewProgress(id);
  for (let i = 0; i < rv.problems.length; i++) {
    if (!rp.done[i]) return false;
  }
  return true;
}

function openReview(id) {
  currentReviewId = id;
  currentLessonId = null;
  const rv = getReview(id);
  unitOpen.delete(rv.unit);
  // 最初の未クリア問題から開始（全クリア済みなら問題1）
  const rp = reviewProgress(id);
  const firstUndone = rv.problems.findIndex(function (_p, i) { return !rp.done[i]; });
  currentReviewProblem = firstUndone === -1 ? 0 : firstUndone;
  const unit = UNITS.find(function (u) { return u.id === rv.unit; });
  document.getElementById("welcome").hidden = true;
  document.getElementById("lesson-view").hidden = true;
  document.getElementById("review-view").hidden = false;
  document.getElementById("review-unit").textContent = unit.name;
  document.getElementById("review-title").textContent = rv.title;
  renderSidebar();
  renderReview();
}

function renderReview() {
  const rv = getReview(currentReviewId);
  const rp = reviewProgress(rv.id);
  const body = document.getElementById("review-body");

  // レッスンの①②③と同じ見た目のタブ（順番ロックなし・自由に行き来できる）
  let tabs = "";
  rv.problems.forEach(function (prob, i) {
    const active = i === currentReviewProblem ? " active" : "";
    const done = rp.done[i] ? ' <span class="step-done">✔</span>' : "";
    const kind = prob.type === "read" ? "読む" : "書く";
    tabs +=
      '<button class="step-tab problem-tab' + active + '" data-problem="' + i + '">' +
      "問題" + (i + 1) + "・" + kind + done + "</button>";
  });

  body.innerHTML =
    '<div class="review-intro">' + rv.intro + "</div>" +
    '<div class="step-tabs">' + tabs + "</div>" +
    '<div id="review-problem-body"></div>';

  body.querySelectorAll(".problem-tab").forEach(function (tab) {
    tab.addEventListener("click", function () {
      currentReviewProblem = Number(tab.dataset.problem);
      renderReview();
    });
  });

  const el = document.createElement("div");
  el.className = "review-problem";
  document.getElementById("review-problem-body").appendChild(el);
  const prob = rv.problems[currentReviewProblem];
  if (prob.type === "read") renderReviewRead(el, rv, prob, currentReviewProblem);
  else renderReviewWrite(el, rv, prob, currentReviewProblem);

  maybeShowReviewComplete(rv);
}

function reviewChecklistHtml(prob) {
  let checks = "";
  (prob.checklist || []).forEach(function (item, k) {
    checks +=
      '<li><label><input type="checkbox" class="rv-check" data-k="' + k + '">' +
      escapeHtml(item) + "</label></li>";
  });
  return '<ul class="checklist">' + checks + "</ul>";
}

// チェックリスト全チェックで完了ボタンを有効化し、押されたら問題をクリア扱いにする共通処理
function wireReviewDone(el, rv, i) {
  const doneBtn = el.querySelector(".btn-done");
  const boxes = el.querySelectorAll(".rv-check");
  boxes.forEach(function (b) {
    b.addEventListener("change", function () {
      doneBtn.disabled = !Array.prototype.every.call(boxes, function (x) { return x.checked; });
    });
  });
  doneBtn.addEventListener("click", function () {
    const rp = reviewProgress(rv.id);
    rp.done[i] = true;
    saveProgress();
    renderSidebar();
    doneBtn.disabled = true;
    doneBtn.textContent = "クリア済み ✔";
    // 開いている答え合わせを消さないよう、再描画せずタブに✔だけ足す
    const tab = document.querySelector('.problem-tab[data-problem="' + i + '"]');
    if (tab && !tab.querySelector(".step-done")) {
      tab.innerHTML += ' <span class="step-done">✔</span>';
    }
    maybeShowReviewComplete(rv);
  });
}

function renderReviewWrite(el, rv, prob, i) {
  const rp = reviewProgress(rv.id);
  const pl = {
    previewMode: prob.previewMode || "html",
    scaffold: prob.scaffold,
    mount: prob.mount,
    asyncMount: prob.asyncMount,
    mountChildren: prob.mountChildren,
    seedSql: prob.seedSql,
    termSetup: prob.termSetup,
  };
  const phoneClass = isPhone(pl) ? " phone" : "";
  let chips = "";
  (prob.allowed || []).forEach(function (a) {
    chips += '<span class="allowed-chip">' + escapeHtml(a) + "</span>";
  });

  el.innerHTML =
    '<div class="problem-badge">問題 ' + (i + 1) + "・書いて動かす</div>" +
    (rp.done[i] ? '<div class="success-banner">この問題はクリア済みです。復習はいつでもどうぞ。</div>' : "") +
    '<div class="challenge-spec"><p>' + prob.prompt + "</p></div>" +
    (prob.scaffoldNote ? '<div class="scaffold-note">' + prob.scaffoldNote + "</div>" : "") +
    '<div class="pane-label">使ってよい要素（ヒント）</div>' +
    '<div class="allowed-list">' + chips + "</div>" +
    '<textarea class="code-input" spellcheck="false" autocapitalize="off" autocomplete="off" placeholder="ここに書いてみよう">' +
    escapeHtml(prob.starter || "") + "</textarea>" +
    '<div class="btn-row">' +
    '<button class="btn secondary btn-run">▶ 実行して結果を見る</button>' +
    '<button class="btn btn-reveal">答え合わせする</button>' +
    "</div>" +
    '<iframe class="preview-frame' + phoneClass + '" sandbox="allow-scripts allow-same-origin"></iframe>' +
    '<div class="answer-slot"></div>';

  const input = el.querySelector(".code-input");
  setupTabKey(input);
  const frame = el.querySelector(".preview-frame");
  const runner = isTransformMode(pl) ? createRunner(frame, pl) : null;

  el.querySelector(".btn-run").addEventListener("click", function () {
    if (runner) runner.run(input.value, { mount: prob.mount, asyncMount: prob.asyncMount });
    else frame.srcdoc = buildPreviewDoc(pl, input.value);
  });

  el.querySelector(".btn-reveal").addEventListener("click", function () {
    const slot = el.querySelector(".answer-slot");
    slot.innerHTML =
      '<div class="answer-area">' +
      '<div class="pane-label">模範解答（動けば表現は違ってOK）</div>' +
      '<div class="answer-code">' + escapeHtml(prob.model) + "</div>" +
      '<div class="pane-label" style="margin-top:12px">セルフチェック（全部チェックでクリア）</div>' +
      reviewChecklistHtml(prob) +
      '<button class="btn btn-done" disabled>この問題をクリア ✔</button>' +
      "</div>";
    wireReviewDone(slot, rv, i);
  });
}

function renderReviewRead(el, rv, prob, i) {
  const rp = reviewProgress(rv.id);
  el.innerHTML =
    '<div class="problem-badge read">問題 ' + (i + 1) + "・読んで答える</div>" +
    (rp.done[i] ? '<div class="success-banner">この問題はクリア済みです。復習はいつでもどうぞ。</div>' : "") +
    '<div class="review-q">' + prob.question + "</div>" +
    '<div class="read-code">' + escapeHtml(prob.code) + "</div>" +
    '<div class="pane-label">あなたの答え（まず自分で書いてみる）</div>' +
    '<textarea class="code-input" style="min-height:90px" spellcheck="false" autocapitalize="off" autocomplete="off" placeholder="ここに予想・説明を書いてみよう"></textarea>' +
    '<div class="btn-row"><button class="btn btn-reveal">答え合わせする</button></div>' +
    '<div class="answer-slot"></div>';

  el.querySelector(".btn-reveal").addEventListener("click", function () {
    const slot = el.querySelector(".answer-slot");
    slot.innerHTML =
      '<div class="read-answer">' +
      '<div class="pane-label">正解</div><p>' + prob.answer + "</p>" +
      (prob.explanation ? '<div class="pane-label" style="margin-top:8px">解説</div><p>' + prob.explanation + "</p>" : "") +
      '<div class="pane-label" style="margin-top:10px">セルフチェック（全部チェックでクリア）</div>' +
      reviewChecklistHtml(prob) +
      '<button class="btn btn-done" disabled>この問題をクリア ✔</button>' +
      "</div>";
    wireReviewDone(slot, rv, i);
  });
}

function maybeShowReviewComplete(rv) {
  const existing = document.getElementById("review-complete");
  if (!reviewDone(rv.id)) {
    if (existing) existing.remove();
    return;
  }
  if (existing) return;
  const body = document.getElementById("review-body");
  const div = document.createElement("div");
  div.id = "review-complete";
  div.className = "success-banner";
  div.style.marginTop = "18px";
  div.textContent = "🏆 " + rv.title + " クリア！ この言語の重要ポイントを一通り復習できました。";
  body.appendChild(div);
}

// ---------- 共通 ----------

function setupTabKey(textarea) {
  textarea.addEventListener("keydown", function (e) {
    if (e.key === "Tab") {
      e.preventDefault();
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      textarea.value = textarea.value.slice(0, start) + "  " + textarea.value.slice(end);
      textarea.selectionStart = textarea.selectionEnd = start + 2;
      textarea.dispatchEvent(new Event("input"));
    }
  });
}

// ---------- 進捗のバックアップ（保存・復元） ----------
// 進捗はブラウザごと・ページの開き方ごとに別々に保存されるため、
// 消えたとき／別ブラウザへ移したいときのためにファイル1つで持ち出せるようにする

function progressSummary(data) {
  let lessons = 0;
  let reviews = 0;
  Object.keys(data || {}).forEach(function (key) {
    if (key === "__reviews") {
      const all = data.__reviews || {};
      Object.keys(all).forEach(function (rid) {
        const done = (all[rid] && all[rid].done) || {};
        Object.keys(done).forEach(function (i) { if (done[i]) reviews++; });
      });
    } else if (data[key] && data[key].done) {
      lessons++;
    }
  });
  return { lessons: lessons, reviews: reviews };
}

function isValidProgress(data) {
  if (!data || typeof data !== "object" || Array.isArray(data)) return false;
  const keys = Object.keys(data);
  if (!keys.length) return false;
  return keys.every(function (key) {
    const v = data[key];
    if (!v || typeof v !== "object") return false;
    if (key === "__reviews") return true;
    return "step1" in v || "step2" in v || "done" in v;
  });
}

function todayStamp() {
  const d = new Date();
  const pad = function (n) { return (n < 10 ? "0" : "") + n; };
  return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
}

function openModal(html) {
  closeModal();
  const back = document.createElement("div");
  back.className = "modal-backdrop";
  back.id = "app-modal";
  back.innerHTML = '<div class="modal">' + html + "</div>";
  document.body.appendChild(back);
  back.addEventListener("click", function (e) { if (e.target === back) closeModal(); });
  return back;
}

function closeModal() {
  const m = document.getElementById("app-modal");
  if (m) m.remove();
}

function exportProgress() {
  const json = JSON.stringify(progress, null, 2);
  const name = "code-dojo-progress-" + todayStamp() + ".json";
  const btn = document.getElementById("backup-progress");
  try {
    const url = URL.createObjectURL(new Blob([json], { type: "application/json" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    const label = btn.textContent;
    btn.textContent = "✔ " + name + " を保存";
    setTimeout(function () { btn.textContent = label; }, 3000);
  } catch (e) {
    // ダウンロードできない環境向けフォールバック（無言で失敗させない）
    openModal(
      "<h3>ファイルとして保存できませんでした</h3>" +
      "<p>下の内容をコピーして、テキストファイルやObsidianのノートに貼り付けて保存してください。</p>" +
      '<textarea class="code-input" style="min-height:160px" readonly>' + escapeHtml(json) + "</textarea>" +
      '<div class="btn-row"><button class="btn" id="modal-close">閉じる</button></div>'
    );
    document.getElementById("modal-close").addEventListener("click", closeModal);
  }
}

function showRestoreDialog() {
  openModal(
    "<h3>📥 保存した進捗を復元</h3>" +
    "<p>バックアップしたJSONファイルを選ぶか、中身を貼り付けてください。</p>" +
    '<div class="btn-row"><button class="btn secondary" id="restore-pick">📁 ファイルを選ぶ</button></div>' +
    '<div class="pane-label">またはJSONを貼り付け</div>' +
    '<textarea class="code-input" id="restore-text" style="min-height:120px" spellcheck="false" placeholder=\'{"html-01": {"step1": true, ...\'></textarea>' +
    '<div id="restore-msg"></div>' +
    '<div class="btn-row"><button class="btn" id="restore-load">読み込む</button>' +
    '<button class="btn secondary" id="restore-cancel">キャンセル</button></div>'
  );
  document.getElementById("restore-pick").addEventListener("click", function () {
    document.getElementById("restore-file").click();
  });
  document.getElementById("restore-cancel").addEventListener("click", closeModal);
  document.getElementById("restore-load").addEventListener("click", function () {
    handleRestoreInput(document.getElementById("restore-text").value);
  });
}

function restoreError(message) {
  const el = document.getElementById("restore-msg");
  if (el) el.innerHTML = '<div class="notice warn">⚠ ' + message + "</div>";
}

// 読み込んだデータを検証し、上書き前に件数を見せて確認する（壊れたJSONで現在の進捗を潰さない）
function handleRestoreInput(text) {
  let data = null;
  try {
    data = JSON.parse(text);
  } catch (e) {
    restoreError("JSONとして読み取れませんでした。ファイルの中身をそのまま貼り付けてください。");
    return;
  }
  if (!isValidProgress(data)) {
    restoreError("Code Dojoの進捗データではないようです。現在の進捗はそのままにしました。");
    return;
  }
  const incoming = progressSummary(data);
  const current = progressSummary(progress);
  openModal(
    "<h3>この進捗で上書きしますか？</h3>" +
    "<p>読み込んだデータ: レッスン完了 <strong>" + incoming.lessons + "件</strong> ／ 力試しクリア <strong>" + incoming.reviews + "問</strong></p>" +
    "<p>いまの進捗: レッスン完了 " + current.lessons + "件 ／ 力試しクリア " + current.reviews + "問<br>" +
    "<strong>いまの進捗は消えて、読み込んだ内容に置き換わります。</strong></p>" +
    '<div class="btn-row"><button class="btn" id="restore-apply">上書きする</button>' +
    '<button class="btn secondary" id="restore-abort">キャンセル</button></div>'
  );
  document.getElementById("restore-abort").addEventListener("click", closeModal);
  document.getElementById("restore-apply").addEventListener("click", function () {
    progress = data;
    saveProgress();
    loadWarning = null;
    unitOpen.clear(); // 進捗が総入れ替えされるので、手動の開閉も既定に戻す
    currentLessonId = null;
    currentReviewId = null;
    document.getElementById("lesson-view").hidden = true;
    document.getElementById("review-view").hidden = true;
    document.getElementById("welcome").hidden = false;
    renderSidebar();
    openModal(
      '<h3>✔ 復元しました</h3><p>レッスン完了 ' + incoming.lessons + "件 ／ 力試しクリア " + incoming.reviews + "問の状態に戻しました。</p>" +
      '<div class="btn-row"><button class="btn" id="modal-close">閉じる</button></div>'
    );
    document.getElementById("modal-close").addEventListener("click", closeModal);
  });
}

// 進捗0件のとき「別ブラウザで開いていないか」を案内する（消失と勘違いしやすいため）
function renderProgressNotice() {
  const el = document.getElementById("progress-notice");
  if (!el) return;
  let html = "";
  if (loadWarning) html += '<div class="notice warn">' + loadWarning + "</div>";
  const s = progressSummary(progress);
  if (s.lessons === 0 && s.reviews === 0) {
    html +=
      '<div class="notice">🔎 <strong>進捗が0件です。</strong>' +
      "以前に進めたはずなのに0件のときは、<strong>いつもと同じブラウザ・同じファイルで開いているか</strong>確認してください" +
      "（進捗はブラウザごとに別々に保存されるため、別のブラウザで開くと0件に見えます）。<br>" +
      "はじめて始める場合はこのままで大丈夫です。ときどき左下の「💾 進捗をファイルに保存」でバックアップしておくと安心です。</div>";
  }
  el.innerHTML = html;
}

document.getElementById("backup-progress").addEventListener("click", exportProgress);
document.getElementById("restore-progress").addEventListener("click", showRestoreDialog);
document.getElementById("restore-file").addEventListener("change", function (e) {
  const file = e.target.files && e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function () { handleRestoreInput(String(reader.result)); };
  reader.onerror = function () { restoreError("ファイルを読み込めませんでした。"); };
  reader.readAsText(file);
  e.target.value = ""; // 同じファイルを選び直せるようにする
});

document.querySelectorAll(".step-tab").forEach(function (tab) {
  tab.addEventListener("click", function () {
    currentStep = Number(tab.dataset.step);
    renderStep();
  });
});

document.getElementById("reset-progress").addEventListener("click", function () {
  if (confirm("すべての進捗を消してやり直しますか？")) {
    progress = {};
    saveProgress();
    unitOpen.clear();
    currentLessonId = null;
    currentReviewId = null;
    document.getElementById("lesson-view").hidden = true;
    document.getElementById("review-view").hidden = true;
    document.getElementById("welcome").hidden = false;
    renderSidebar();
  }
});

renderSidebar();
