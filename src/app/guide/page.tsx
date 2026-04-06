import { GuideSection } from "@/components/guide/GuideSection";
import { Sparkles, CalendarClock, Users, RefreshCw, BookOpen } from "lucide-react";

const sections = [
  {
    icon: Sparkles,
    title: "AI投稿生成の使い方",
    color: "text-neon-purple",
    steps: [
      { title: "トピックを入力", description: "投稿したいテーマやキーワードを入力します。具体的なほどAIの精度が上がります。" },
      { title: "プラットフォームを選択", description: "X (Twitter)、Instagram、Threadsから投稿先を選びます。" },
      { title: "キャラクターとトーンを設定", description: "事前に作成したペルソナを選び、投稿のトーンを調整します。" },
      { title: "生成して編集", description: "AIが生成した投稿を確認し、必要に応じて編集・コピー・予約できます。" },
    ],
  },
  {
    icon: CalendarClock,
    title: "予約投稿の使い方",
    color: "text-neon-blue",
    steps: [
      { title: "投稿を作成", description: "AI生成または手動で投稿コンテンツを作成します。" },
      { title: "日時を設定", description: "投稿したい日時を選択します。最適な投稿時間の提案も参考にしてください。" },
      { title: "スケジュールを確認", description: "予約一覧で投稿のステータスを管理できます。" },
    ],
  },
  {
    icon: Users,
    title: "ペルソナ設定の使い方",
    color: "text-neon-green",
    steps: [
      { title: "ペルソナを作成", description: "投稿するキャラクターの名前、性格、トーン、得意トピックを設定します。" },
      { title: "使い分ける", description: "異なるペルソナで投稿を生成し、ターゲットに合わせた発信ができます。" },
    ],
  },
  {
    icon: RefreshCw,
    title: "リライトの使い方",
    color: "text-neon-pink",
    steps: [
      { title: "元のテキストを入力", description: "リライトしたい既存の投稿やテキストをペーストします。" },
      { title: "スタイルを選択", description: "「カジュアルに」「プロっぽく」「バズりやすく」など、変換スタイルを選びます。" },
      { title: "結果を確認", description: "リライト結果を確認して、そのままコピーまたは再調整できます。" },
    ],
  },
  {
    icon: BookOpen,
    title: "学習メモの使い方",
    color: "text-neon-purple",
    steps: [
      { title: "気づきを記録", description: "バズった投稿の分析、効果的だった表現、新しい発見をメモします。" },
      { title: "タグで整理", description: "タグを付けることで、あとから検索・分類しやすくなります。" },
    ],
  },
];

export default function GuidePage() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
      {sections.map((section) => (
        <GuideSection key={section.title} {...section} />
      ))}
    </div>
  );
}
