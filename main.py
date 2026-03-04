"""
X (旧Twitter) DM自動送信システム - CLIエントリーポイント

使い方:
  python main.py run-csv   --csv data/attack_lists/targets.csv --template sales_proposal
  python main.py run-kw    --keywords "マーケティング,SaaS" --max-results 50
  python main.py preview   --csv data/attack_lists/targets.csv --limit 3
  python main.py list-templates
"""

import json
import logging
import sys
from pathlib import Path

import typer
from rich.console import Console
from rich.table import Table

# カレントディレクトリをパスに追加
sys.path.insert(0, str(Path(__file__).parent))

from config import settings

app = typer.Typer(
    name="dm-system",
    help="X (旧Twitter) DM自動送信システム",
    no_args_is_help=True,
)
console = Console()


def _setup_logging(log_level: str = "INFO") -> None:
    log_file = Path(settings.log_file)
    log_file.parent.mkdir(parents=True, exist_ok=True)

    logging.basicConfig(
        level=getattr(logging, log_level.upper(), logging.INFO),
        format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
        handlers=[
            logging.FileHandler(log_file, encoding="utf-8"),
            logging.StreamHandler(),
        ],
    )


@app.command("run-csv")
def run_from_csv(
    csv: str = typer.Option(..., "--csv", "-c", help="アタックリストのCSVファイルパス"),
    template: str = typer.Option("sales_proposal", "--template", "-t", help="使用するテンプレート名"),
    min_score: float = typer.Option(0.7, "--min-score", help="最低品質スコア (0.0-1.0)"),
    no_brushup: bool = typer.Option(False, "--no-brushup", help="ブラッシュアップをスキップ"),
    limit: int = typer.Option(0, "--limit", "-n", help="処理件数上限 (0=全件)"),
    dry_run: bool = typer.Option(False, "--dry-run", help="テスト実行（送信しない）"),
):
    """CSVファイルのアタックリストからDMを生成・送信する"""
    _setup_logging(settings.log_level)

    if dry_run:
        import os
        os.environ["DM_DRY_RUN"] = "true"
        # settingsを再読み込み
        from importlib import reload
        import config.settings as s_mod
        reload(s_mod)

    from orchestrator import DMOrchestrator
    orchestrator = DMOrchestrator()

    console.print(f"\n[bold green]DM送信システム起動[/bold green]")
    console.print(f"  CSVファイル: {csv}")
    console.print(f"  テンプレート: {template}")
    console.print(f"  ブラッシュアップ: {'なし' if no_brushup else 'あり'}")
    console.print(f"  最低スコア: {min_score}")
    console.print(f"  DRY RUN: {settings.dm_dry_run}\n")

    results = orchestrator.run_from_csv(
        csv_path=csv,
        template_name=template,
        min_quality_score=min_score,
        do_brushup=not no_brushup,
        limit=limit if limit > 0 else None,
    )

    _print_results_table(results)


@app.command("run-kw")
def run_from_keyword(
    keywords: str = typer.Option(..., "--keywords", "-k", help="カンマ区切りのキーワード (例: 'SaaS,マーケ')"),
    template: str = typer.Option("sales_proposal", "--template", "-t", help="テンプレート名"),
    min_followers: int = typer.Option(100, "--min-followers", help="最小フォロワー数"),
    max_results: int = typer.Option(50, "--max-results", help="最大収集件数"),
    min_score: float = typer.Option(0.7, "--min-score", help="最低品質スコア"),
    no_brushup: bool = typer.Option(False, "--no-brushup", help="ブラッシュアップをスキップ"),
):
    """キーワード検索でターゲットを収集してDMを送信する"""
    _setup_logging(settings.log_level)

    keyword_list = [k.strip() for k in keywords.split(",")]
    from orchestrator import DMOrchestrator
    orchestrator = DMOrchestrator()

    console.print(f"\n[bold green]キーワード検索モード[/bold green]")
    console.print(f"  キーワード: {keyword_list}")
    console.print(f"  最小フォロワー: {min_followers}")

    results = orchestrator.run_from_keyword(
        keywords=keyword_list,
        template_name=template,
        min_followers=min_followers,
        max_results=max_results,
        min_quality_score=min_score,
        do_brushup=not no_brushup,
    )

    _print_results_table(results)


@app.command("preview")
def preview(
    csv: str = typer.Option(..., "--csv", "-c", help="CSVファイルパス"),
    template: str = typer.Option("sales_proposal", "--template", "-t", help="テンプレート名"),
    limit: int = typer.Option(3, "--limit", "-n", help="プレビュー件数"),
    no_brushup: bool = typer.Option(False, "--no-brushup", help="ブラッシュアップをスキップ"),
):
    """送信前にDM内容をプレビューする（送信しない）"""
    _setup_logging(settings.log_level)

    from orchestrator import DMOrchestrator
    orchestrator = DMOrchestrator()

    messages = orchestrator.preview_messages(
        csv_path=csv,
        template_name=template,
        limit=limit,
        do_brushup=not no_brushup,
    )

    console.print(f"\n[bold yellow]DMプレビュー ({len(messages)}件)[/bold yellow]\n")
    for i, msg in enumerate(messages, 1):
        console.print(f"[bold]--- {i}. @{msg.target_username} ({msg.target_display_name}) ---[/bold]")
        console.print(f"品質スコア: {msg.quality_score:.2f} | 文字数: {msg.char_count()} | 承認: {'✓' if msg.is_approved else '✗'}")
        console.print(f"\n{msg.message}\n")
        if msg.generation_notes:
            console.print(f"[dim]メモ: {msg.generation_notes}[/dim]\n")


@app.command("list-templates")
def list_templates(
    templates_path: str = typer.Option(
        "data/templates/sample_templates.json", "--path", "-p", help="テンプレートJSONのパス"
    ),
):
    """利用可能なテンプレート一覧を表示する"""
    path = Path(templates_path)
    if not path.exists():
        console.print(f"[red]テンプレートファイルが見つかりません: {templates_path}[/red]")
        raise typer.Exit(1)

    with open(path, encoding="utf-8") as f:
        templates = json.load(f)

    table = Table(title="利用可能なテンプレート")
    table.add_column("名前", style="cyan")
    table.add_column("文体")
    table.add_column("目的")

    for t in templates:
        table.add_row(t["name"], t.get("tone", ""), t["purpose"][:50] + "...")

    console.print(table)


def _print_results_table(results: list[dict]) -> None:
    if not results:
        console.print("[yellow]処理結果がありません[/yellow]")
        return

    table = Table(title="送信結果")
    table.add_column("ユーザー名", style="cyan")
    table.add_column("ステータス")
    table.add_column("スコア")
    table.add_column("備考")

    status_colors = {
        "sent": "green",
        "skipped": "yellow",
        "failed": "red",
        "rate_limited": "red",
        "pending": "white",
    }

    for r in results:
        status = r["status"]
        color = status_colors.get(status, "white")
        table.add_row(
            f"@{r['target_username']}",
            f"[{color}]{status}[/{color}]",
            f"{r['quality_score']:.2f}" if r["quality_score"] else "-",
            r["error_message"][:40] if r["error_message"] else "",
        )

    console.print(table)


if __name__ == "__main__":
    app()
