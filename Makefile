include .env

.PHONY: supabase-schema
supabase-schema:
	@supabase gen types typescript --project-id ${SUPABASE_PROJECT_ID} > app/database.types.ts
