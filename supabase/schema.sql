-- ============================================================
-- AttackList Engine - Supabase Schema
-- ============================================================
-- 実行順序: このファイルを上から順に実行してください
-- Supabase Dashboard > SQL Editor にペーストして実行できます
-- ============================================================

-- ========== ENUM TYPES ==========

create type platform_type as enum ('twitter', 'instagram', 'threads');
create type post_status as enum ('draft', 'scheduled', 'published', 'failed');
create type schedule_status as enum ('pending', 'sent', 'failed', 'cancelled');

-- ========== 1. post_personas ==========
-- 投稿キャラクター（ペルソナ）の定義
-- UI: /persona ページで管理

create table post_personas (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,

  name        text not null,
  avatar      text not null default '',          -- 2文字イニシャル or 画像URL
  personality text not null default '',          -- 性格の説明
  tone        text not null default '',          -- カジュアル、プロフェッショナル等
  topics      text[] not null default '{}',      -- 得意トピック配列

  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on table post_personas is '投稿キャラクター（ペルソナ）の定義';

-- ========== 2. post_ideas ==========
-- 投稿のアイデア・ネタ帳（生成前の段階）
-- UI: /notebook ページで管理

create table post_ideas (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  persona_id  uuid references post_personas(id) on delete set null,

  title       text not null default '',
  content     text not null default '',          -- メモ本文
  tags        text[] not null default '{}',      -- 分類タグ
  source_url  text,                              -- 参考URLがあれば

  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on table post_ideas is '投稿アイデア・ネタ帳（学習メモ）';

-- ========== 3. generated_posts ==========
-- AI生成された投稿本体
-- UI: /generate で作成、/history で一覧表示

create table generated_posts (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  persona_id    uuid references post_personas(id) on delete set null,
  idea_id       uuid references post_ideas(id) on delete set null,

  content       text not null,                     -- 投稿本文
  platform      platform_type not null,             -- 投稿先プラットフォーム
  status        post_status not null default 'draft',

  -- AI生成メタデータ
  prompt_used   text,                              -- 生成に使ったプロンプト
  model_used    text,                              -- 使用モデル名 (claude-sonnet-4-6 等)
  tone_setting  text,                              -- 生成時のトーン設定

  published_at  timestamptz,                       -- 実際に公開された日時
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

comment on table generated_posts is 'AI生成された投稿本体';

-- ========== 4. scheduled_posts ==========
-- 予約投稿スケジュール
-- UI: /schedule で管理

create table scheduled_posts (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  generated_post_id uuid not null references generated_posts(id) on delete cascade,

  scheduled_at    timestamptz not null,              -- 投稿予定日時
  platform        platform_type not null,             -- 投稿先（generated_postsと異なる場合もある）
  status          schedule_status not null default 'pending',

  error_message   text,                              -- 失敗時のエラー内容
  sent_at         timestamptz,                       -- 実際に送信された日時

  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

comment on table scheduled_posts is '予約投稿スケジュール';

-- ========== 5. post_metrics ==========
-- 投稿後のエンゲージメント記録（時系列で複数回取得可能）
-- UI: ダッシュボード、/history で表示

create table post_metrics (
  id                uuid primary key default gen_random_uuid(),
  generated_post_id uuid not null references generated_posts(id) on delete cascade,

  likes             int not null default 0,
  retweets          int not null default 0,
  replies           int not null default 0,
  impressions       int not null default 0,
  clicks            int not null default 0,

  recorded_at       timestamptz not null default now()  -- 計測日時
);

comment on table post_metrics is '投稿エンゲージメントの時系列記録';

-- ========== INDEXES ==========

-- post_personas
create index idx_personas_user on post_personas(user_id);

-- post_ideas
create index idx_ideas_user on post_ideas(user_id);
create index idx_ideas_persona on post_ideas(persona_id);

-- generated_posts
create index idx_posts_user on generated_posts(user_id);
create index idx_posts_persona on generated_posts(persona_id);
create index idx_posts_status on generated_posts(status);
create index idx_posts_platform on generated_posts(platform);
create index idx_posts_created on generated_posts(created_at desc);

-- scheduled_posts
create index idx_scheduled_user on scheduled_posts(user_id);
create index idx_scheduled_post on scheduled_posts(generated_post_id);
create index idx_scheduled_status_at on scheduled_posts(status, scheduled_at);

-- post_metrics
create index idx_metrics_post on post_metrics(generated_post_id);
create index idx_metrics_recorded on post_metrics(recorded_at desc);

-- ========== ROW LEVEL SECURITY (RLS) ==========

alter table post_personas enable row level security;
alter table post_ideas enable row level security;
alter table generated_posts enable row level security;
alter table scheduled_posts enable row level security;
alter table post_metrics enable row level security;

-- 各テーブル共通: 自分のデータのみ CRUD 可能
create policy "Users can manage own personas"
  on post_personas for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can manage own ideas"
  on post_ideas for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can manage own posts"
  on generated_posts for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can manage own schedules"
  on scheduled_posts for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- post_metrics は generated_posts 経由でアクセス制御
create policy "Users can read own metrics"
  on post_metrics for select
  using (
    exists (
      select 1 from generated_posts
      where generated_posts.id = post_metrics.generated_post_id
        and generated_posts.user_id = auth.uid()
    )
  );

create policy "Users can insert own metrics"
  on post_metrics for insert
  with check (
    exists (
      select 1 from generated_posts
      where generated_posts.id = post_metrics.generated_post_id
        and generated_posts.user_id = auth.uid()
    )
  );

-- ========== updated_at 自動更新トリガー ==========

create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger tr_personas_updated
  before update on post_personas
  for each row execute function update_updated_at();

create trigger tr_ideas_updated
  before update on post_ideas
  for each row execute function update_updated_at();

create trigger tr_posts_updated
  before update on generated_posts
  for each row execute function update_updated_at();

create trigger tr_scheduled_updated
  before update on scheduled_posts
  for each row execute function update_updated_at();

-- ========== ダッシュボード用ビュー ==========

create or replace view dashboard_stats as
select
  user_id,
  count(*) as total_posts,
  count(*) filter (where status = 'published') as published_posts,
  count(*) filter (where status = 'scheduled') as scheduled_posts,
  count(*) filter (where status = 'draft') as draft_posts,
  count(*) filter (where created_at >= now() - interval '7 days') as posts_this_week
from generated_posts
group by user_id;
