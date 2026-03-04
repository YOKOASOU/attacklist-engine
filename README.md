# X (旧Twitter) DM自動送信システム

X のダイレクトメッセージを3つのモジュールで自動化するシステムです。

## システム構成

```
┌─────────────────┐    ┌──────────────────────┐    ┌──────────────────┐
│  1. リスト収集   │ →  │  2. DM生成・ブラッシュ │ →  │  3. DM自動送信   │
│  ListCollector  │    │   MessageGenerator    │    │   DMSender       │
│                 │    │   (Claude API使用)    │    │   (X API使用)    │
│ ・CSV読み込み   │    │ ・プロフィール分析     │    │ ・レート制限管理 │
│ ・キーワード検索 │    │ ・パーソナライズ生成   │    │ ・1日上限管理   │
│ ・フォロワー取得 │    │ ・ブラッシュアップ     │    │ ・dry_runモード │
│ ・フィルタリング │    │ ・品質スコアリング     │    │ ・送信ログ記録  │
└─────────────────┘    └──────────────────────┘    └──────────────────┘
```

## セットアップ

### 1. 依存ライブラリのインストール

```bash
pip install -r requirements.txt
```

### 2. 環境変数の設定

```bash
cp .env.example .env
# .env を編集して各APIキーを設定
```

必要なAPIキー:
- **X Developer API**: https://developer.twitter.com/en/portal/dashboard
  - Basic プラン以上が必要（DM送信・検索機能）
- **Anthropic Claude API**: https://console.anthropic.com

### 3. X API の権限設定

X Developer Portal で以下の権限を有効化:
- `Read and Write` (DM送信に必要)
- `Direct Messages` の読み書き権限

## 使い方

### プレビュー（送信前の確認）

```bash
python main.py preview --csv data/attack_lists/sample_targets.csv --limit 3
```

### CSVから一括送信

```bash
# DRY RUN (テスト実行 - 実際には送信しない)
DM_DRY_RUN=true python main.py run-csv \
  --csv data/attack_lists/targets.csv \
  --template sales_proposal

# 本番実行
DM_DRY_RUN=false python main.py run-csv \
  --csv data/attack_lists/targets.csv \
  --template collaboration \
  --min-score 0.75 \
  --limit 10
```

### キーワード検索からの送信

```bash
python main.py run-kw \
  --keywords "SaaS,BtoB,スタートアップ" \
  --min-followers 500 \
  --max-results 30
```

### テンプレート一覧

```bash
python main.py list-templates
```

## CSVフォーマット

```csv
username,display_name,bio,tags
techfounder_jp,田中太郎,SaaSスタートアップ経営,SaaS
```

| 列名 | 必須 | 説明 |
|------|------|------|
| username | ✓ | X のユーザー名（@なし） |
| display_name | | 表示名（省略時はusernameを使用） |
| bio | | プロフィール文（DM生成に活用） |
| tags | | タグ（カンマ区切り） |

## 設定パラメータ (.env)

| 変数 | デフォルト | 説明 |
|------|-----------|------|
| `DM_INTERVAL_SECONDS` | 60 | DM送信間隔（秒） |
| `DM_DAILY_LIMIT` | 50 | 1日の送信上限 |
| `DM_DRY_RUN` | true | テスト実行モード |

## プロジェクト構造

```
attacklist-engine/
├── main.py                    # CLIエントリーポイント
├── orchestrator.py            # 3モジュール統合オーケストレーター
├── config/
│   └── settings.py            # 設定管理
├── modules/
│   ├── list_collector/        # モジュール1: リスト収集
│   │   ├── collector.py
│   │   ├── filters.py
│   │   └── models.py
│   ├── message_generator/     # モジュール2: DM生成
│   │   ├── generator.py
│   │   └── models.py
│   └── dm_sender/             # モジュール3: DM送信
│       ├── sender.py
│       └── models.py
├── data/
│   ├── attack_lists/          # アタックリストCSV
│   ├── templates/             # メッセージテンプレート
│   └── logs/                  # 送信ログ（自動生成）
└── requirements.txt
```

## 注意事項

- X (Twitter) の利用規約および開発者ポリシーを必ず遵守してください
- 受信者の同意なく無差別に大量送信することは利用規約違反になる場合があります
- 適切な送信間隔（`DM_INTERVAL_SECONDS`）を設定し、スパムとみなされないようにしてください
- 本番実行前に必ず `DM_DRY_RUN=true` でテスト実行してください
