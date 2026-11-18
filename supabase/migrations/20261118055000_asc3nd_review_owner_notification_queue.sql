-- Already deployed to canonical Supabase project cyxdevcjycmffhmwxojh on 2026-11-18.
-- Reuses ASC3ND's existing notification outbox and cron/Resend worker.
-- Data remains in public.asc3nd_client_guide_progress, separate from volunteer CRM.
create or replace function asc3nd_private.queue_editbook_review_update()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, asc3nd
as $$
begin
  if new.guide_slug = 'website-review-2026-11'
     and new.client_key like 'public:%'
     and coalesce(new.state->>'notifyOwner','false') = 'true'
     and (tg_op = 'INSERT' or new.state->>'updatedAt' is distinct from old.state->>'updatedAt')
  then
    insert into asc3nd.site_notification_outbox(kind,payload,recipient_email)
    values (
      'participation',
      jsonb_build_object(
        'name', coalesce(nullif(left(new.state->>'reviewerName',80),''),'Client reviewer'),
        'route_key','editorial-review',
        'form_type','slide-feedback',
        'source_page','https://asc3nd-editoral-docs.vercel.app/#page-' || coalesce(new.state->>'slideNumber',''),
        'answers',jsonb_build_object(
          'slide',new.state->>'slideId',
          'decision',new.state->>'decision',
          'comment',new.state->>'comment'
        ),
        'occurred_at',new.state->>'updatedAt'
      ),
      'executiveusa@gmail.com'
    );
  end if;
  return new;
end;
$$;
revoke all on function asc3nd_private.queue_editbook_review_update() from public,anon,authenticated;
drop trigger if exists trg_asc3nd_review_owner_notification on public.asc3nd_client_guide_progress;
create trigger trg_asc3nd_review_owner_notification
after insert or update on public.asc3nd_client_guide_progress
for each row execute function asc3nd_private.queue_editbook_review_update();

-- Rollback, without deleting reviewer data:
-- drop trigger if exists trg_asc3nd_review_owner_notification on public.asc3nd_client_guide_progress;
-- drop function if exists asc3nd_private.queue_editbook_review_update();
