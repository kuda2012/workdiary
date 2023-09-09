CREATE TABLE "access_control" (
  "id" varchar,
  "user_id" varchar,
  "post_id" varchar,
  "access_status" varchar
);

CREATE TABLE "tabs" (
  "id" varchar,
  "post_id" varchar,
  "title" varchar,
  "url" text,
  "comment" varchar,
  "tab_order" varchar
);

CREATE TABLE "users" (
  "id" varchar PRIMARY KEY,
  "email" varchar,
  "name" varchar,
  "created_at" timestamp DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE "posts" (
  "id" varchar PRIMARY KEY,
  "user_id" varchar,
  "date" date,
  "summary_text" text,
  "tabs" varchar[][],
  "summary_voice" bytea,
  "last_updated" timestamp DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE "tags" (
  "id" varchar PRIMARY KEY,
  "post_id" varchar,
  "text" varchar
);

CREATE TABLE "shared_posts" (
  "id" varchar PRIMARY KEY,
  "pointer_id" varchar,
  "post_id" varchar,
  "shared_at" timestamp DEFAULT (CURRENT_TIMESTAMP)
);

COMMENT ON COLUMN "access_control"."access_status" IS 'read-only or read-write';

COMMENT ON COLUMN "tabs"."comment" IS 'your little opinions about the tab';

COMMENT ON COLUMN "posts"."summary_text" IS 'This should be your EOD notes. What happened today.';

ALTER TABLE "posts" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "access_control" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "access_control" ADD FOREIGN KEY ("post_id") REFERENCES "posts" ("id");

ALTER TABLE "tabs" ADD FOREIGN KEY ("post_id") REFERENCES "posts" ("id");

ALTER TABLE "shared_posts" ADD FOREIGN KEY ("post_id") REFERENCES "posts" ("id");

ALTER TABLE "tags" ADD FOREIGN KEY ("post_id") REFERENCES "posts" ("id");
