-- Content OS — schema مستقل (بدون هیچ وابستگی به دیتابیس‌های دیگر)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS team_members (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name       VARCHAR(150) NOT NULL,
  username        VARCHAR(50)  UNIQUE NOT NULL,
  password_hash   VARCHAR(255) NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS content_ideas (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title           TEXT NOT NULL,
  status          VARCHAR(20) NOT NULL DEFAULT 'new', -- new | converted | archived
  created_by      UUID NOT NULL REFERENCES team_members(id),
  converted_content_id UUID,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS content_items (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title           VARCHAR(200) NOT NULL,
  content_type    VARCHAR(20) NOT NULL, -- reel | post | story | carousel | photo
  status          VARCHAR(20) NOT NULL DEFAULT 'in_progress', -- in_progress | ready | published | archived
  scheduled_at    TIMESTAMPTZ,
  published_at    TIMESTAMPTZ,
  assignee_id     UUID REFERENCES team_members(id),
  created_by      UUID NOT NULL REFERENCES team_members(id),
  idea_id         UUID REFERENCES content_ideas(id),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE content_ideas
  ADD CONSTRAINT content_ideas_converted_content_id_fkey
  FOREIGN KEY (converted_content_id) REFERENCES content_items(id);

CREATE TABLE IF NOT EXISTS content_tasks (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id      UUID NOT NULL REFERENCES content_items(id) ON DELETE CASCADE,
  title           VARCHAR(150) NOT NULL,
  assignee_id     UUID REFERENCES team_members(id),
  status          VARCHAR(20) NOT NULL DEFAULT 'pending', -- pending | done
  sort_order      INT NOT NULL DEFAULT 0,
  due_at          TIMESTAMPTZ,
  completed_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_content_tasks_assignee ON content_tasks (assignee_id, status, due_at);
CREATE INDEX IF NOT EXISTS idx_content_tasks_content ON content_tasks (content_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_content_items_status ON content_items (status, scheduled_at);
