-- Optional alignment queries for RETROHELP (MySQL / phpMyAdmin).
-- Run only what you need. Backup the database first.

-- ---------------------------------------------------------------------------
-- 1) No structural changes are required for the current Laravel app:
--    `users` columns already match: id, nickname, full_name, password,
--    role_id, is_verified, created_at, updated_at.
--    Clinic staff self-registration inserts: nickname NULL, full_name set,
--    role_id = 2, is_verified = 0 until an admin approves.
-- ---------------------------------------------------------------------------

-- 2) Existing patients in older dumps may have is_verified = 0. The API now
--    expects verified patients to sign in. Activate all existing patients:
-- UPDATE `users` SET `is_verified` = 1 WHERE `role_id` = 1;

-- 3) Optional: enforce unique full names at the database (matches Laravel
--    validation for new clinic_staff registrations). Your sample dump
--    contains duplicate full_name values; fix duplicates first, then:
-- ALTER TABLE `users` ADD UNIQUE KEY `users_full_name_unique` (`full_name`);
-- (MySQL allows multiple NULLs in a UNIQUE column, so community rows with
--  full_name NULL are still OK.)

-- 4) Find duplicate full_name values before adding the unique index:
-- SELECT `full_name`, COUNT(*) AS c FROM `users`
-- WHERE `full_name` IS NOT NULL AND `full_name` != ''
-- GROUP BY `full_name` HAVING c > 1;
