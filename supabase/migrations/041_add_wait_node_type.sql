-- ============================================================
-- 041_add_wait_node_type.sql
--
-- Adds 'wait' to flow_nodes.node_type CHECK constraint and 'waiting' to flow_runs.status CHECK constraint.
--
-- Idempotent — safe to re-run.
-- ============================================================

-- 1. flow_nodes.node_type — add 'wait'
ALTER TABLE flow_nodes
  DROP CONSTRAINT IF EXISTS flow_nodes_node_type_check;

ALTER TABLE flow_nodes
  ADD CONSTRAINT flow_nodes_node_type_check
  CHECK (node_type IN (
    'start',
    'send_buttons',
    'send_list',
    'send_message',
    'send_media',
    'collect_input',
    'condition',
    'set_tag',
    'wait',
    'handoff',
    'http_fetch',
    'end'
  ));

-- 2. flow_runs.status — add 'waiting'
ALTER TABLE flow_runs
  DROP CONSTRAINT IF EXISTS flow_runs_status_check;

ALTER TABLE flow_runs
  ADD CONSTRAINT flow_runs_status_check
  CHECK (status IN (
    'active',
    'waiting',
    'completed',
    'handed_off',
    'timed_out',
    'paused_by_agent',
    'failed'
  ));
