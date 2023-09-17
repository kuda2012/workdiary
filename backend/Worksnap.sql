CREATE TABLE "access_control" (
  "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "user_id" varchar,
  "post_id" integer,
  "access_status" varchar
);

CREATE TABLE "tabs" (
  "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "post_id" integer,
  "title" varchar,
  "url" text,
  "comment" varchar,
  "order" varchar
);

CREATE TABLE "users" (
  "id" varchar PRIMARY KEY,
  "email" varchar,
  "name" varchar,
  "created_at" timestamp DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE "posts" (
  "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "user_id" varchar,
  "date" date,
  "summary_text" text,
  "summary_voice" bytea,
  "created_at" timestamp DEFAULT (CURRENT_TIMESTAMP),
  "last_updated" timestamp DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE "tags" (
  "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "post_id" integer,
  "text" varchar
);

CREATE TABLE "shared_posts" (
  "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "pointer_id" varchar,
  "post_id" integer,
  "shared_at" timestamp DEFAULT (CURRENT_TIMESTAMP)
);

COMMENT ON COLUMN "access_control"."access_status" IS 'read-only or read-write';

COMMENT ON COLUMN "tabs"."comment" IS 'your little opinions about the tab';

COMMENT ON COLUMN "posts"."summary_text" IS 'This should be your EOD notes. What happened today.';

ALTER TABLE "posts" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE;

ALTER TABLE "access_control" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE;

ALTER TABLE "access_control" ADD FOREIGN KEY ("post_id") REFERENCES "posts" ("id") ON DELETE CASCADE;

ALTER TABLE "tabs" ADD FOREIGN KEY ("post_id") REFERENCES "posts" ("id") ON DELETE CASCADE;

ALTER TABLE "shared_posts" ADD FOREIGN KEY ("post_id") REFERENCES "posts" ("id") ON DELETE CASCADE;

ALTER TABLE "tags" ADD FOREIGN KEY ("post_id") REFERENCES "posts" ("id") ON DELETE CASCADE;
