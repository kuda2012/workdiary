CREATE TABLE "access_control" (
  "user_id" varchar,
  "post_id" integer,
  "access_status" varchar
);

CREATE TABLE "invalid_tokens" (
  "id" integer PRIMARY KEY NOT NULL,
  "token" text,
  "user_id" varchar
);

CREATE TABLE "tabs" (
  "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "post_id" integer,
  "title" varchar,
  "icon" text,
  "url" text
);

CREATE TABLE "users" (
  "id" varchar PRIMARY KEY,
  "email" varchar,
  "auth_provider" varchar,
  "name" varchar,
  "password" varchar,
  "created_at" timestamp DEFAULT (CURRENT_TIMESTAMP),
  "alarm_status" boolean,
  "alarm_time" varchar,
  "alarm_days" jsonb[] DEFAULT ARRAY['{"day": "sun", "value": false}'::jsonb, '{"day": "mon", "value": true}'::jsonb, '{"day": "tue", "value": true}'::jsonb, '{"day": "wed", "value": true}'::jsonb, '{"day": "thu", "value": true}'::jsonb, '{"day": "fri", "value": true}'::jsonb, '{"day": "sat", "value": false}'::jsonb],
);

CREATE TABLE users_audit (
    audit_id integer NOT NULL,
    action character varying(20) NOT NULL,
    audit_timestamp timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    id character varying NOT NULL,
    email character varying NOT NULL,
    name character varying,
    created_at timestamp without time zone,
    alarm_status boolean,
    alarm_time character varying,
    auto_pull_tabs boolean,
    alarm_days jsonb[],
    password character varying,
    auth_provider character varying(50),
    verified boolean DEFAULT false NOT NULL,
    time_verified timestamp without time zone
);

CREATE OR REPLACE FUNCTION log_user_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'DELETE') THEN
        INSERT INTO users_audit (action, id, email, name, created_at, alarm_status, alarm_time, auto_pull_tabs, alarm_days, password, auth_provider, verified, time_verified)
        VALUES ('DELETE_USER', OLD.id, OLD.email, OLD.name, OLD.created_at, OLD.alarm_status, OLD.alarm_time, OLD.auto_pull_tabs, OLD.alarm_days, OLD.password, OLD.auth_provider, OLD.verified, OLD.time_verified);
        
    ELSIF (TG_OP = 'INSERT') THEN
        INSERT INTO users_audit (action, id, email, name, created_at, alarm_status, alarm_time, auto_pull_tabs, alarm_days, password, auth_provider, verified, time_verified)
        VALUES ('CREATE_USER', NEW.id, NEW.email, NEW.name, NEW.created_at, NEW.alarm_status, NEW.alarm_time, NEW.auto_pull_tabs, NEW.alarm_days, NEW.password, NEW.auth_provider, NEW.verified, NEW.time_verified);
        
    ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO users_audit (action, id, email, name, created_at, alarm_status, alarm_time, auto_pull_tabs, alarm_days, password, auth_provider, verified, time_verified)
        VALUES ('UPDATE_USER', NEW.id, NEW.email, NEW.name, NEW.created_at, NEW.alarm_status, NEW.alarm_time, NEW.auto_pull_tabs, NEW.alarm_days, NEW.password, NEW.auth_provider, NEW.verified, NEW.time_verified);
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;




CREATE TABLE user_logins (
  id INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,  -- Incrementing ID column
  user_id varchar NOT NULL,  -- References the user table
  email varchar,
  name varchar,
  login_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,  -- Timestamp of login
  file_source VARCHAR(35),  -- Source of the login (string)
  ip_address VARCHAR(20),  -- IP address of the user
  user_agent VARCHAR  -- User agent string
);


CREATE TABLE "transcribe_log" (
  "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "user_id" varchar,
  "transcription" varchar,
  "created_at" timestamp DEFAULT (CURRENT_TIMESTAMP WITH TIMEZONE),
);

CREATE TABLE "posts" (
  "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "user_id" varchar,
  "date" date,
  "summary_text" text,
  "summary_voice" bytea,
  "created_at" timestamp DEFAULT (CURRENT_TIMESTAMP),
  "last_updated" timestamp
);

CREATE TABLE "tags" (
  "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "post_id" integer,
  "text" varchar
);

CREATE TABLE "shared_posts" (
  "id" varchar PRIMARY KEY,
  "pointer_id" varchar,
  "post_id" integer,
  "shared_at" timestamp DEFAULT (CURRENT_TIMESTAMP)
);

COMMENT ON COLUMN "access_control"."access_status" IS 'read-only or read-write';

COMMENT ON COLUMN "posts"."summary_text" IS 'This should be your EOD notes. What happened today.';

ALTER TABLE "posts" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "invalid_tokens" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "access_control" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "access_control" ADD FOREIGN KEY ("post_id") REFERENCES "posts" ("id");

ALTER TABLE "transcribe_log" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "tabs" ADD FOREIGN KEY ("post_id") REFERENCES "posts" ("id");

ALTER TABLE "shared_posts" ADD FOREIGN KEY ("post_id") REFERENCES "posts" ("id");

ALTER TABLE "tags" ADD FOREIGN KEY ("post_id") REFERENCES "posts" ("id");
