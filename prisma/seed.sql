-- Sample data for local development. Safe to run twice.
INSERT INTO "Note" ("id", "title", "body")
VALUES ('00000000-0000-4000-8000-000000000001', 'Welcome', 'This note came from scripts/seed-db.')
ON CONFLICT ("id") DO NOTHING;
