-- Total accounts ever created
-- select COUNT(id) from users_audit
-- WHERE action = 'CREATE_USER'

-- Total active posts
-- select COUNT(id) from posts

 
 
-- How many logins per day app wide
SELECT DATE(login_time) AS login_date,
 COUNT(DISTINCT user_id) AS total_logins_per_day
FROM user_logins
WHERE file_source = 'actionCreator.js'
GROUP BY DATE(login_time)
ORDER BY DATE(login_time) DESC


-- How many total logins per day per user
-- SELECT DATE(login_time) AS login_date,
--        user_id,
--        email,
--        COUNT DISTINCT(*) AS total_logins_per_day
-- FROM user_logins
-- WHERE file_source = 'actionCreator.js'
-- GROUP BY DATE(login_time), user_id, email
-- ORDER BY login_date, email, user_id;

-- Number of transcriptions per day
-- SELECT DATE(created_at) AS transcription_day,
--        COUNT(user_id) AS total_transciptions_per_day,
--        SUM(duration) AS total_duration_per_day
-- FROM transcribe_log
-- GROUP BY DATE(created_at)
-- ORDER BY DATE(created_at) DESC


-- Most active users per day
-- WITH RankedTranscriptions AS (
--   SELECT 
--     DATE(t.created_at) AS transcription_day,
--     t.user_id,
--     COUNT(t.user_id) AS total_transcriptions_per_user_per_day,
--     SUM(t.duration) AS total_duration_per_user_per_day,
--     ROW_NUMBER() OVER (PARTITION BY DATE(t.created_at) ORDER BY COUNT(t.user_id) DESC) AS user_rank
--   FROM transcribe_log t
--   GROUP BY DATE(t.created_at), t.user_id
-- )
-- SELECT 
--   rt.transcription_day,
--   rt.user_id,
--   u.full_name,
--   u.email,
--   rt.total_transcriptions_per_user_per_day,
--   rt.total_duration_per_user_per_day
-- FROM RankedTranscriptions rt
-- INNER JOIN users u ON rt.user_id = u.id
-- WHERE rt.user_rank = 1
-- ORDER BY rt.transcription_day DESC, rt.total_transcriptions_per_user_per_day DESC;



