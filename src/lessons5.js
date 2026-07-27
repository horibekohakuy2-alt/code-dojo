// 教材データ(5): Ruby / Rails（つなげーとインターン実務予習・2026-07-18追加）
// ruby-01〜03: ruby.wasmで本物のRubyを実行 / rails-01: リクエストシミュレーター / rails-02: ActiveRecord→SQL翻訳

const RB_NOTE = '▶実行の初回はRuby環境の読み込みに5〜10秒かかります（2回目からは速くなります）。書き終えたら「▶ 実行して結果を見る」を押してください。';
const RAILS_NOTE = '本物のRailsはブラウザで動かないため、これは<strong>教材のコードパターンだけを解釈するシミュレーター</strong>です。流れの理解が目的。本物は入社後の実務で！';
const AR_NOTE = '入力した ActiveRecord 式を1行ずつSQLに翻訳し、本物のSQLite（sql.js）で実行します。テーブル: posts（id, content, likes）・4件入り。';

LESSONS.push(
  // ================= Ruby =================
  {
    id: "ruby-01",
    unit: "ruby",
    title: "Rubyへようこそ — puts・変数・式展開",
    previewMode: "rb",
    scaffoldNote: RB_NOTE,
    filename: "main.rb",
    explanation: `
<h3>RubyはRailsの母語 — そしてあなたは4言語目</h3>
<p>つなげーとの実務スタックは<strong>Ruby on Rails</strong>。Railsのコードを読むには、まず土台のRubyです。朗報はこれまでと同じ——<strong>JS/TS/Pythonを学んだあなたなら、Rubyも「対応表の置き換え」で読めます</strong>。</p>
<table>
<tr><th>JavaScript</th><th>Python</th><th>Ruby</th></tr>
<tr><td>console.log(x)</td><td>print(x)</td><td>puts x</td></tr>
<tr><td>const name = "..."</td><td>name = "..."</td><td>name = "..."（宣言キーワード不要）</td></tr>
<tr><td>\`&#36;{name}さん\`</td><td>f"{name}さん"</td><td>"#{name}さん"（式展開）</td></tr>
<tr><td>// コメント</td><td># コメント</td><td># コメント</td></tr>
<tr><td>{ } でブロック</td><td>インデントが文法</td><td><strong>end で閉じる</strong></td></tr>
</table>

<h3>ブロックは end で閉じる — Pythonとの最大の違い</h3>
<pre><code>if age >= 18
  puts "成人です"
end</code></pre>
<p>Pythonはインデント自体が文法でしたが、Rubyは <code>if 〜 end</code> のように<strong>endで閉じます</strong>（インデントは読みやすさのため）。<code>do 〜 end</code>・<code>def 〜 end</code>・<code>class 〜 end</code>——Railsのコードは「endの積み重ね」でできています。</p>

<h3>putsの ( ) が無い？ — Rubyらしさ第1位</h3>
<p><code>puts("こんにちは")</code> と書いてもよいですが、Rubyでは<strong>メソッド呼び出しの ( ) をよく省略します</strong>: <code>puts "こんにちは"</code>。Railsのコード（<code>get "/posts", to: "..."</code> など）はこの省略形だらけなので、「( ) が無くてもメソッド呼び出し」と読めることが重要です。</p>
<div class="tip">💡 <strong>整数 ÷ 整数 は整数</strong>: <code>3000 / 4</code> は 750（Pythonは750.0でした）。割り切れないと切り捨てられます（<code>7 / 2</code> → 3）。小数が欲しいときは <code>7 / 2.0</code> や <code>.to_f</code>。言語ごとの割り算の癖は、AIコードの数値バグを追うときの定番チェックポイントです。</div>
`,
    model: `name = "コハク"
age = 20

puts "こんにちは、" + name + "さん"
puts "#{name}さんは#{age}歳、来年は#{age + 1}歳"

if age >= 18
  puts "成人です"
end`,
    challenge: {
      spec: "割り勘計算のRuby版を書いてください（JS→TS→Python→Ruby、ついに4言語目！）。<br>・total = 3000、people = 4 を定義<br>・1人あたりの金額を計算して変数に入れる<br>・式展開で「1人あたり750円です」と出力<br>・total が 2000 以上なら「割り勘推奨」と出力（if 〜 end）",
      allowed: ["変数 = 値", "puts", '式展開 "#{変数}"', "/（割り算）", "if 条件 〜 end"],
      model: `total = 3000
people = 4
per_person = total / people

puts "1人あたり#{per_person}円です"

if total >= 2000
  puts "割り勘推奨"
end`,
      checklist: [
        "式展開 #{ } をJSの${ }・Pythonのf文字列と対応づけて説明できる",
        "ifをendで閉じた（Pythonとの違いを説明できる）",
        "750「円」と整数で出た理由（整数÷整数は整数）を説明できる",
      ],
    },
  },
  {
    id: "ruby-02",
    unit: "ruby",
    title: "配列とブロック — each・select・map",
    previewMode: "rb",
    scaffoldNote: RB_NOTE,
    filename: "main.rb",
    explanation: `
<h3>ブロック — Rubyの心臓部にして、Rails読解の最重要文法</h3>
<p>Rubyでは「処理のかたまり」を<strong>ブロック</strong>としてメソッドに渡します。書き方は2つ:</p>
<pre><code>scores.each do |s|      # 複数行のとき: do 〜 end
  puts "#{s}点"
end

scores.select { |s| s >= 80 }   # 1行のとき: { }</code></pre>
<p><code>|s|</code> は「1件ずつ取り出してsと呼ぶ」——JSのアロー関数の引数、Pythonの for s in に相当します。<strong>Railsのコードはブロックの連続</strong>（routes.draw do、each do、validates ...）なので、この形が読めればRailsの見た目の8割は怖くなくなります。</p>

<h3>3言語対応表 — 同じ発想、違う名前</h3>
<table>
<tr><th>やること</th><th>JavaScript</th><th>Python</th><th>Ruby</th></tr>
<tr><td>全件処理</td><td>forEach</td><td>for x in xs:</td><td>each</td></tr>
<tr><td>絞り込み</td><td>filter</td><td>内包表記 if</td><td><strong>select</strong></td></tr>
<tr><td>変換</td><td>map</td><td>内包表記</td><td>map</td></tr>
<tr><td>合計 / 個数</td><td>reduce / .length</td><td>sum() / len()</td><td>.sum / .length</td></tr>
</table>

<h3>便利メソッドと inspect</h3>
<pre><code>[72, 85, 91].sum        # 248
[72, 85, 91].length     # 3
passed.inspect          # "[85, 91]" — 配列を目に見える文字列にする（デバッグの友）</code></pre>
<div class="tip">💡 <code>puts 配列</code> は1行ずつバラして表示されます。「配列の形のまま」見たいときは <code>puts passed.inspect</code>。AIコードのデバッグで変数の中身を確認する定番テクニックです（JSのconsole.log(JSON.stringify(x))に相当）。</div>
`,
    model: `scores = [72, 85, 91, 68]

scores.each do |s|
  puts "#{s}点"
end

passed = scores.select { |s| s >= 80 }
puts "合格: #{passed.inspect}"

puts "合計: #{scores.sum}"
puts "平均: #{scores.sum / scores.length.to_f}"`,
    challenge: {
      spec: "今週の学習時間を集計してください（Python編と同じデータをRubyで！）。<br>・hours = [2, 1, 4, 4, 3] を定義<br>・each で1日ずつ「◯時間」と出力（do 〜 end）<br>・select で3時間以上の日だけ残し「集中日: [4, 4, 3]」と出力（inspect）<br>・sum で「週合計: ◯時間」と出力",
      allowed: ["配列 [ ]", "each do |x| 〜 end", "select { |x| 条件 }", ".sum", ".inspect", 'puts "#{ }"'],
      model: `hours = [2, 1, 4, 4, 3]

hours.each do |h|
  puts "#{h}時間"
end

focused = hours.select { |h| h >= 3 }
puts "集中日: #{focused.inspect}"

puts "週合計: #{hours.sum}時間"`,
      checklist: [
        "do |x| 〜 end と { |x| } の2つのブロック記法を使い分けた",
        "selectをJSのfilter・Pythonの内包表記と対応づけて説明できる",
        "inspectが「配列を配列の形のまま見せる」ことを確認した",
      ],
    },
  },
  {
    id: "ruby-03",
    unit: "ruby",
    title: "シンボル・ハッシュ・クラス — Railsを読む準備",
    previewMode: "rb",
    scaffoldNote: RB_NOTE,
    filename: "main.rb",
    explanation: `
<h3>シンボル — Railsのコードを埋め尽くす「:名前」</h3>
<pre><code>:name    :id    :desc    :posts</code></pre>
<p>コロンで始まる<strong>シンボル</strong>は「軽量な名前ラベル」です。文字列と似ていますが、「文章」ではなく「目印・キー」として使います。次のレッスンで見るRailsコード——<code>to: "posts#index"</code>、<code>order(likes: :desc)</code>——は<strong>シンボルだらけ</strong>。「: が付いてたら名前ラベル」と読めれば恐れる必要はありません。</p>

<h3>ハッシュ — JSのオブジェクト・Pythonの辞書のRuby版</h3>
<pre><code>me = { name: "コハク", age: 20 }   # キーはシンボル
me[:name]                            # 取り出しは [:キー]</code></pre>
<p><code>{ name: "コハク" }</code> は正式には <code>{ :name =&gt; "コハク" }</code> の省略形。<strong>キーがシンボルのハッシュ</strong>が現代Rubyの標準形です。</p>

<h3>クラス — Railsの「@変数」の正体を知る</h3>
<pre><code>class Post
  def initialize(content, likes)
    @content = content     # @付き = インスタンス変数（この部品が覚えている値）
    @likes = likes
  end

  def summary
    "#{@content}（いいね #{@likes}）"
  end
end

post = Post.new("HTML完了！", 12)   # newで実体を作る
puts post.summary</code></pre>
<ul>
  <li><code>class 〜 end</code> — 部品の設計図。Reactのコンポーネントに近い発想</li>
  <li><code>initialize</code> — newしたときに1回だけ走る初期化（コンストラクタ）</li>
  <li><code>@content</code> — <strong>インスタンス変数</strong>。Railsのcontrollerで見る <code>@posts</code> はまさにこれ</li>
</ul>
<div class="tip">💡 ここまでの3レッスンで、Railsを読むためのRuby文法（end・ブロック・シンボル・ハッシュ・クラス・@変数）が揃いました。次のレッスンから、いよいよRails本体の「流れ」を読みます。</div>
`,
    model: `class Post
  def initialize(content, likes)
    @content = content
    @likes = likes
  end

  def summary
    "#{@content}（いいね #{@likes}）"
  end
end

posts = [
  Post.new("HTML完了！", 12),
  Post.new("Ruby学習中", 8),
]

posts.each { |post| puts post.summary }

me = { name: "コハク", circle: "AIサークル" }
puts "#{me[:name]}＠#{me[:circle]}"`,
    challenge: {
      spec: "学習科目クラスを作ってください。<br>・class Subject: initialize で名前と週の時間数を受け取り、@name と @hours に入れる<br>・describe メソッド:「AIを週6時間」の形の文字列を返す<br>・Subject.new を2件、配列に入れて each で describe を出力<br>・最後に、ハッシュ { name: ..., goal: ... } を作り式展開で1行出力",
      allowed: ["class 〜 end", "def initialize / def メソッド名", "@変数", "クラス.new( )", "each { |x| }", "ハッシュ { key: 値 }", "[:key]"],
      model: `class Subject
  def initialize(name, hours)
    @name = name
    @hours = hours
  end

  def describe
    "#{@name}を週#{@hours}時間"
  end
end

subjects = [
  Subject.new("AI", 6),
  Subject.new("Ruby", 4),
]

subjects.each { |subject| puts subject.describe }

goal = { name: "コハク", goal: "Railsが読める" }
puts "#{goal[:name]}の目標: #{goal[:goal]}"`,
      checklist: [
        "initializeと@変数の役割（newのときに値を覚える）を説明できる",
        "@postsのようなRailsの@変数が「インスタンス変数」だと言える",
        "ハッシュのキーをシンボルで書き、[:key]で取り出せた",
      ],
    },
  },

  // ================= Rails =================
  {
    id: "rails-01",
    unit: "ruby",
    title: "Railsの全体像 — MVCとリクエストの一生",
    previewMode: "rails",
    scaffoldNote: RAILS_NOTE,
    filename: "config/routes.rb ほか3ファイル",
    railsRequest: "GET /posts",
    railsData: {
      posts: [
        { id: 1, content: "HTML完了！", likes: 12 },
        { id: 2, content: "Ruby学習中", likes: 8 },
        { id: 3, content: "Rails予習なう", likes: 25 },
      ],
    },
    explanation: `
<h3>Railsは「役割分担が決まっているNext.js」だと思えばいい</h3>
<p>Ruby on Railsは、Webアプリの実務標準フレームワーク（Next.jsのRuby版の大先輩）。最大の特徴は<strong>MVC</strong>という役割分担と、「ファイルをどこに置くか」が完全に決まっていることです。</p>
<table>
<tr><th>役割</th><th>ファイルの場所</th><th>仕事</th><th>あなたの既習知識との対応</th></tr>
<tr><td>ルーティング</td><td>config/routes.rb</td><td>URLと処理の対応表</td><td>Next.jsの「ファイルがURLになる」の手書き版</td></tr>
<tr><td><strong>C</strong>ontroller</td><td>app/controllers/</td><td>リクエストを受けて材料を集める</td><td>司令塔。@変数に材料を入れる（ruby-03）</td></tr>
<tr><td><strong>M</strong>odel</td><td>app/models/</td><td>データベースとの窓口</td><td>SQLの翻訳者（次レッスン）</td></tr>
<tr><td><strong>V</strong>iew</td><td>app/views/</td><td>HTMLを組み立てる</td><td>JSXのERB版。&lt;%= %&gt; で埋め込み</td></tr>
</table>

<h3>リクエストの一生 — この流れが読めれば勝ち</h3>
<pre><code>ブラウザ「GET /posts」
  → routes.rb:  get "/posts", to: "posts#index"
       「/posts は PostsController の index アクションへ」
  → controller: def index / @posts = Post.all
       「モデルに頼んで投稿を全部取ってきて、@postsに入れる」
  → view: index.html.erb が @posts を使ってHTMLを組み立てる
  → 完成したHTMLがブラウザへ返る</code></pre>

<h3>ERB — HTMLにRubyを埋め込む</h3>
<ul>
  <li><code>&lt;%= 式 %&gt;</code> — 式の結果を<strong>表示する</strong>（=あり）</li>
  <li><code>&lt;% 文 %&gt;</code> — 実行するだけで<strong>表示しない</strong>（eachやifに使う）</li>
</ul>
<p>JSXの <code>{ }</code> と同じ発想です。<code>&lt;% @posts.each do |post| %&gt;</code> 〜 <code>&lt;% end %&gt;</code> はReactの <code>{posts.map(...)}</code> に相当します。</p>
<div class="tip">💡 <strong>頻出エラーの読み方</strong>: 「No route matches [GET "/xxx"]」= routes.rbに対応表がない。「The action 'index' could not be found」= controllerにdefがない。「undefined method for nil」= @変数が空のままviewで使った——エラー文がどの層の問題かを教えてくれるのがMVCの利点です。</div>
`,
    model: `# config/routes.rb
Rails.application.routes.draw do
  get "/posts", to: "posts#index"
end

# app/controllers/posts_controller.rb
class PostsController < ApplicationController
  def index
    @posts = Post.all
  end
end

# app/views/posts/index.html.erb
<h1>投稿一覧</h1>
<% @posts.each do |post| %>
  <p><%= post.content %></p>
<% end %>`,
    challenge: {
      spec: "手本と同じ「GET /posts」の3ファイル構成を<strong>何も見ずに</strong>書き、さらにviewを拡張してください。<br>・routes.rb: /posts を posts#index へ<br>・controller: @posts = Post.all<br>・view: 見出しを「みんなの投稿」にし、各投稿を「内容（いいね ◯）」の形で表示（post.likes を使う）",
      allowed: ['get "/パス", to: "コントローラ#アクション"', "class 〜Controller", "def index 〜 end", "@posts = Post.all", "<%= %> / <% %>", "each do |post| 〜 end"],
      model: `# config/routes.rb
Rails.application.routes.draw do
  get "/posts", to: "posts#index"
end

# app/controllers/posts_controller.rb
class PostsController < ApplicationController
  def index
    @posts = Post.all
  end
end

# app/views/posts/index.html.erb
<h1>みんなの投稿</h1>
<% @posts.each do |post| %>
  <p><%= post.content %>（いいね <%= post.likes %>）</p>
<% end %>`,
      checklist: [
        "routes → controller → view の3ファイルの役割を自分の言葉で言える",
        "@posts が controller から view へ渡る流れを説明できる",
        "<%= %>（表示する）と <% %>（表示しない）を使い分けた",
      ],
    },
  },
  {
    id: "rails-02",
    unit: "ruby",
    title: "ActiveRecordとSQL — モデルは翻訳者",
    previewMode: "ar",
    scaffoldNote: AR_NOTE,
    filename: "rails console",
    seedSql: "CREATE TABLE posts (id INTEGER, content TEXT, likes INTEGER); INSERT INTO posts VALUES (1,'HTML完了！',12),(2,'Ruby学習中',8),(3,'Rails予習なう',25),(4,'SQL楽しい',3);",
    explanation: `
<h3>Model = 「SQLを書かなくていい」ための翻訳者</h3>
<p>SQLユニットで書いた <code>SELECT * FROM posts;</code>。Railsではこれを<strong>Rubyのまま</strong>書きます: <code>Post.all</code>。この裏でSQLへの翻訳をやってくれる仕組みが<strong>ActiveRecord</strong>です。</p>
<p>命名規約に注目——<strong>モデルは単数形（Post）、テーブルは複数形（posts）</strong>。Railsは名前の対応を自動で理解します（設定より規約）。</p>

<h3>翻訳対応表 — SQLユニットの知識がそのまま活きる</h3>
<table>
<tr><th>ActiveRecord</th><th>翻訳されるSQL</th><th>SQLユニットの回</th></tr>
<tr><td>Post.all</td><td>SELECT * FROM posts;</td><td>SQL-01</td></tr>
<tr><td>Post.find(3)</td><td>SELECT * FROM posts WHERE id = 3 LIMIT 1;</td><td>SQL-01</td></tr>
<tr><td>Post.where("likes >= 10")</td><td>SELECT * FROM posts WHERE likes >= 10;</td><td>SQL-01</td></tr>
<tr><td>Post.order(likes: :desc)</td><td>SELECT * FROM posts ORDER BY likes DESC;</td><td>SQL-02</td></tr>
<tr><td>Post.count</td><td>SELECT COUNT(*) FROM posts;</td><td>SQL-02</td></tr>
</table>
<p>つなぎ方（メソッドチェーン）も可能: <code>Post.where("likes >= 10").order(likes: :desc)</code> → WHEREとORDER BYが両方付いたSQLになります。</p>

<h3>なぜ「翻訳を読める」ことが大事か</h3>
<p>AIが書いたRailsコードの<strong>DBがらみのバグ（遅い・0件・違うデータが出る）を追うときは、ActiveRecordを頭の中でSQLに訳す</strong>のが定石です。実務のログにも翻訳後のSQLがそのまま流れます（<code>Post Load (0.3ms) SELECT "posts".* FROM "posts"</code> のような行）。このレッスンの画面はその「翻訳の瞬間」を見せてくれます。</p>
<div class="tip">💡 <code>order(likes: :desc)</code> は ruby-03 の知識の合体です——「ハッシュ { likes: :desc }（カッコ省略）を渡している。キーも値もシンボル」。Railsの呪文っぽい書き方は、分解すればぜんぶ既習のRuby文法です。</div>
`,
    model: `Post.all
Post.find(3)
Post.where("likes >= 10")
Post.order(likes: :desc)
Post.count`,
    challenge: {
      spec: "rails console（モデルと対話する画面）のつもりで、次の3つをActiveRecordで取得してください。<br>①「いいねが10以上」の投稿を「いいねの多い順」で（<strong>1行のメソッドチェーン</strong>）<br>② id=4 の投稿を1件<br>③ 投稿の総数<br>実行して、翻訳されたSQLと結果を確認すること",
      allowed: ['Post.where("条件")', "Post.order(列: :desc)", "メソッドチェーン .where(...).order(...)", "Post.find(数)", "Post.count"],
      model: `Post.where("likes >= 10").order(likes: :desc)
Post.find(4)
Post.count`,
      checklist: [
        "チェーンがWHERE+ORDER BYの1本のSQLに翻訳されるのを確認した",
        "モデル単数形（Post）⇔テーブル複数形（posts）の規約を説明できる",
        "3つとも、翻訳後のSQLを見て「SQLユニットで書いた形だ」と確認した",
      ],
    },
  }
);
