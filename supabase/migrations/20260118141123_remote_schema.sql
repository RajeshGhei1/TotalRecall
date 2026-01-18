create extension if not exists "hypopg" with schema "extensions";

create extension if not exists "index_advisor" with schema "extensions";

drop extension if exists "pg_net";

create type "public"."ai_agent_status" as enum ('active', 'inactive', 'training', 'error');

create type "public"."ai_agent_type" as enum ('cognitive', 'predictive', 'automation', 'analysis', 'deep_research');

create type "public"."deployment_location" as enum ('dashboard_widget', 'modal_dialog', 'dedicated_page', 'navigation_item', 'inline_embed', 'sidebar_panel');

create type "public"."interview_type" as enum ('phone', 'video', 'onsite', 'technical');

create type "public"."job_status" as enum ('draft', 'active', 'paused', 'closed');

create type "public"."placement_status" as enum ('active', 'inactive', 'scheduled', 'expired');

create type "public"."priority_level" as enum ('low', 'medium', 'high', 'urgent');

create type "public"."trigger_type" as enum ('user_action', 'page_load', 'scheduled', 'conditional', 'manual');

create sequence "public"."tr_id_sequence";

drop trigger if exists "update_ai_agent_configurations_updated_at" on "public"."ai_agent_configurations";

drop trigger if exists "update_ai_decision_approvals_updated_at" on "public"."ai_decision_approvals";

drop trigger if exists "update_ai_decision_rules_updated_at" on "public"."ai_decision_rules";

drop trigger if exists "update_ai_decision_workflows_updated_at" on "public"."ai_decision_workflows";

drop trigger if exists "update_ai_service_configurations_updated_at" on "public"."ai_service_configurations";

drop trigger if exists "update_ai_services_updated_at" on "public"."ai_services";

drop trigger if exists "trigger_update_module_features_updated_at" on "public"."module_features";

drop trigger if exists "trigger_update_tenant_feature_overrides_updated_at" on "public"."tenant_feature_overrides";

drop trigger if exists "user_sessions_updated_at" on "public"."user_sessions";

drop trigger if exists "update_ai_agents_updated_at" on "public"."ai_agents";

drop policy "Super admins can view all activity logs" on "public"."ai_agent_activity_logs";

drop policy "System can insert activity logs" on "public"."ai_agent_activity_logs";

drop policy "Tenant admins can view their tenant's activity logs" on "public"."ai_agent_activity_logs";

drop policy "Users can view their own activity logs" on "public"."ai_agent_activity_logs";

drop policy "Super admins can manage all configurations" on "public"."ai_agent_configurations";

drop policy "Tenant admins can manage their tenant's configurations" on "public"."ai_agent_configurations";

drop policy "Users can view their tenant's configurations" on "public"."ai_agent_configurations";

drop policy "Super admins can manage all AI agents" on "public"."ai_agents";

drop policy "Tenant admins can manage their tenant's AI agents" on "public"."ai_agents";

drop policy "Users can create AI agents for their tenant" on "public"."ai_agents";

drop policy "Users can view their tenant's AI agents" on "public"."ai_agents";

drop policy "Tenant admins can view their tenant's analytics" on "public"."ai_decision_analytics";

drop policy "Tenant admins can view all approvals in their tenant" on "public"."ai_decision_approvals";

drop policy "Users can manage their own approvals" on "public"."ai_decision_approvals";

drop policy "Tenant admins can manage their tenant's decision instances" on "public"."ai_decision_instances";

drop policy "Users can view their tenant's decision instances" on "public"."ai_decision_instances";

drop policy "Tenant admins can manage their tenant's decision rules" on "public"."ai_decision_rules";

drop policy "Users can view their tenant's decision rules" on "public"."ai_decision_rules";

drop policy "Tenant admins can manage their tenant's workflows" on "public"."ai_decision_workflows";

drop policy "Users can view their tenant's workflows" on "public"."ai_decision_workflows";

drop policy "Tenant admins can manage their tenant's AI service configs" on "public"."ai_service_configurations";

drop policy "Users can view their tenant's AI service configs" on "public"."ai_service_configurations";

drop policy "Users can create AI services in their tenant" on "public"."ai_services";

drop policy "Users can delete AI services in their tenant" on "public"."ai_services";

drop policy "Users can update AI services in their tenant" on "public"."ai_services";

drop policy "Users can view AI services in their tenant" on "public"."ai_services";

drop policy "Tenant admins can view their tenant's audit logs" on "public"."audit_logs";

drop policy "Super admins can manage compliance items" on "public"."compliance_items";

drop policy "Super admins can view all feature analytics" on "public"."feature_usage_analytics";

drop policy "System can insert feature usage analytics" on "public"."feature_usage_analytics";

drop policy "Users can view their tenant's feature analytics" on "public"."feature_usage_analytics";

drop policy "Anyone can view module features" on "public"."module_features";

drop policy "Super admins can manage module features" on "public"."module_features";

drop policy "Super admins can manage all feature overrides" on "public"."tenant_feature_overrides";

drop policy "Tenant admins can manage their feature overrides" on "public"."tenant_feature_overrides";

drop policy "Tenant admins can view their feature overrides" on "public"."tenant_feature_overrides";

drop policy "Super admins can view all user sessions" on "public"."user_sessions";

drop policy "System can insert user sessions" on "public"."user_sessions";

drop policy "Tenant admins can view their tenant's user sessions" on "public"."user_sessions";

drop policy "Users can update their own sessions" on "public"."user_sessions";

drop policy "Super admins can view all audit logs" on "public"."audit_logs";

revoke delete on table "public"."ai_agent_activity_logs" from "anon";

revoke insert on table "public"."ai_agent_activity_logs" from "anon";

revoke references on table "public"."ai_agent_activity_logs" from "anon";

revoke select on table "public"."ai_agent_activity_logs" from "anon";

revoke trigger on table "public"."ai_agent_activity_logs" from "anon";

revoke truncate on table "public"."ai_agent_activity_logs" from "anon";

revoke update on table "public"."ai_agent_activity_logs" from "anon";

revoke delete on table "public"."ai_agent_activity_logs" from "authenticated";

revoke insert on table "public"."ai_agent_activity_logs" from "authenticated";

revoke references on table "public"."ai_agent_activity_logs" from "authenticated";

revoke select on table "public"."ai_agent_activity_logs" from "authenticated";

revoke trigger on table "public"."ai_agent_activity_logs" from "authenticated";

revoke truncate on table "public"."ai_agent_activity_logs" from "authenticated";

revoke update on table "public"."ai_agent_activity_logs" from "authenticated";

revoke delete on table "public"."ai_agent_activity_logs" from "service_role";

revoke insert on table "public"."ai_agent_activity_logs" from "service_role";

revoke references on table "public"."ai_agent_activity_logs" from "service_role";

revoke select on table "public"."ai_agent_activity_logs" from "service_role";

revoke trigger on table "public"."ai_agent_activity_logs" from "service_role";

revoke truncate on table "public"."ai_agent_activity_logs" from "service_role";

revoke update on table "public"."ai_agent_activity_logs" from "service_role";

revoke delete on table "public"."ai_agent_configurations" from "anon";

revoke insert on table "public"."ai_agent_configurations" from "anon";

revoke references on table "public"."ai_agent_configurations" from "anon";

revoke select on table "public"."ai_agent_configurations" from "anon";

revoke trigger on table "public"."ai_agent_configurations" from "anon";

revoke truncate on table "public"."ai_agent_configurations" from "anon";

revoke update on table "public"."ai_agent_configurations" from "anon";

revoke delete on table "public"."ai_agent_configurations" from "authenticated";

revoke insert on table "public"."ai_agent_configurations" from "authenticated";

revoke references on table "public"."ai_agent_configurations" from "authenticated";

revoke select on table "public"."ai_agent_configurations" from "authenticated";

revoke trigger on table "public"."ai_agent_configurations" from "authenticated";

revoke truncate on table "public"."ai_agent_configurations" from "authenticated";

revoke update on table "public"."ai_agent_configurations" from "authenticated";

revoke delete on table "public"."ai_agent_configurations" from "service_role";

revoke insert on table "public"."ai_agent_configurations" from "service_role";

revoke references on table "public"."ai_agent_configurations" from "service_role";

revoke select on table "public"."ai_agent_configurations" from "service_role";

revoke trigger on table "public"."ai_agent_configurations" from "service_role";

revoke truncate on table "public"."ai_agent_configurations" from "service_role";

revoke update on table "public"."ai_agent_configurations" from "service_role";

revoke delete on table "public"."ai_decision_analytics" from "anon";

revoke insert on table "public"."ai_decision_analytics" from "anon";

revoke references on table "public"."ai_decision_analytics" from "anon";

revoke select on table "public"."ai_decision_analytics" from "anon";

revoke trigger on table "public"."ai_decision_analytics" from "anon";

revoke truncate on table "public"."ai_decision_analytics" from "anon";

revoke update on table "public"."ai_decision_analytics" from "anon";

revoke delete on table "public"."ai_decision_analytics" from "authenticated";

revoke insert on table "public"."ai_decision_analytics" from "authenticated";

revoke references on table "public"."ai_decision_analytics" from "authenticated";

revoke select on table "public"."ai_decision_analytics" from "authenticated";

revoke trigger on table "public"."ai_decision_analytics" from "authenticated";

revoke truncate on table "public"."ai_decision_analytics" from "authenticated";

revoke update on table "public"."ai_decision_analytics" from "authenticated";

revoke delete on table "public"."ai_decision_analytics" from "service_role";

revoke insert on table "public"."ai_decision_analytics" from "service_role";

revoke references on table "public"."ai_decision_analytics" from "service_role";

revoke select on table "public"."ai_decision_analytics" from "service_role";

revoke trigger on table "public"."ai_decision_analytics" from "service_role";

revoke truncate on table "public"."ai_decision_analytics" from "service_role";

revoke update on table "public"."ai_decision_analytics" from "service_role";

revoke delete on table "public"."ai_decision_approvals" from "anon";

revoke insert on table "public"."ai_decision_approvals" from "anon";

revoke references on table "public"."ai_decision_approvals" from "anon";

revoke select on table "public"."ai_decision_approvals" from "anon";

revoke trigger on table "public"."ai_decision_approvals" from "anon";

revoke truncate on table "public"."ai_decision_approvals" from "anon";

revoke update on table "public"."ai_decision_approvals" from "anon";

revoke delete on table "public"."ai_decision_approvals" from "authenticated";

revoke insert on table "public"."ai_decision_approvals" from "authenticated";

revoke references on table "public"."ai_decision_approvals" from "authenticated";

revoke select on table "public"."ai_decision_approvals" from "authenticated";

revoke trigger on table "public"."ai_decision_approvals" from "authenticated";

revoke truncate on table "public"."ai_decision_approvals" from "authenticated";

revoke update on table "public"."ai_decision_approvals" from "authenticated";

revoke delete on table "public"."ai_decision_approvals" from "service_role";

revoke insert on table "public"."ai_decision_approvals" from "service_role";

revoke references on table "public"."ai_decision_approvals" from "service_role";

revoke select on table "public"."ai_decision_approvals" from "service_role";

revoke trigger on table "public"."ai_decision_approvals" from "service_role";

revoke truncate on table "public"."ai_decision_approvals" from "service_role";

revoke update on table "public"."ai_decision_approvals" from "service_role";

revoke delete on table "public"."ai_decision_instances" from "anon";

revoke insert on table "public"."ai_decision_instances" from "anon";

revoke references on table "public"."ai_decision_instances" from "anon";

revoke select on table "public"."ai_decision_instances" from "anon";

revoke trigger on table "public"."ai_decision_instances" from "anon";

revoke truncate on table "public"."ai_decision_instances" from "anon";

revoke update on table "public"."ai_decision_instances" from "anon";

revoke delete on table "public"."ai_decision_instances" from "authenticated";

revoke insert on table "public"."ai_decision_instances" from "authenticated";

revoke references on table "public"."ai_decision_instances" from "authenticated";

revoke select on table "public"."ai_decision_instances" from "authenticated";

revoke trigger on table "public"."ai_decision_instances" from "authenticated";

revoke truncate on table "public"."ai_decision_instances" from "authenticated";

revoke update on table "public"."ai_decision_instances" from "authenticated";

revoke delete on table "public"."ai_decision_instances" from "service_role";

revoke insert on table "public"."ai_decision_instances" from "service_role";

revoke references on table "public"."ai_decision_instances" from "service_role";

revoke select on table "public"."ai_decision_instances" from "service_role";

revoke trigger on table "public"."ai_decision_instances" from "service_role";

revoke truncate on table "public"."ai_decision_instances" from "service_role";

revoke update on table "public"."ai_decision_instances" from "service_role";

revoke delete on table "public"."ai_decision_rules" from "anon";

revoke insert on table "public"."ai_decision_rules" from "anon";

revoke references on table "public"."ai_decision_rules" from "anon";

revoke select on table "public"."ai_decision_rules" from "anon";

revoke trigger on table "public"."ai_decision_rules" from "anon";

revoke truncate on table "public"."ai_decision_rules" from "anon";

revoke update on table "public"."ai_decision_rules" from "anon";

revoke delete on table "public"."ai_decision_rules" from "authenticated";

revoke insert on table "public"."ai_decision_rules" from "authenticated";

revoke references on table "public"."ai_decision_rules" from "authenticated";

revoke select on table "public"."ai_decision_rules" from "authenticated";

revoke trigger on table "public"."ai_decision_rules" from "authenticated";

revoke truncate on table "public"."ai_decision_rules" from "authenticated";

revoke update on table "public"."ai_decision_rules" from "authenticated";

revoke delete on table "public"."ai_decision_rules" from "service_role";

revoke insert on table "public"."ai_decision_rules" from "service_role";

revoke references on table "public"."ai_decision_rules" from "service_role";

revoke select on table "public"."ai_decision_rules" from "service_role";

revoke trigger on table "public"."ai_decision_rules" from "service_role";

revoke truncate on table "public"."ai_decision_rules" from "service_role";

revoke update on table "public"."ai_decision_rules" from "service_role";

revoke delete on table "public"."ai_decision_workflows" from "anon";

revoke insert on table "public"."ai_decision_workflows" from "anon";

revoke references on table "public"."ai_decision_workflows" from "anon";

revoke select on table "public"."ai_decision_workflows" from "anon";

revoke trigger on table "public"."ai_decision_workflows" from "anon";

revoke truncate on table "public"."ai_decision_workflows" from "anon";

revoke update on table "public"."ai_decision_workflows" from "anon";

revoke delete on table "public"."ai_decision_workflows" from "authenticated";

revoke insert on table "public"."ai_decision_workflows" from "authenticated";

revoke references on table "public"."ai_decision_workflows" from "authenticated";

revoke select on table "public"."ai_decision_workflows" from "authenticated";

revoke trigger on table "public"."ai_decision_workflows" from "authenticated";

revoke truncate on table "public"."ai_decision_workflows" from "authenticated";

revoke update on table "public"."ai_decision_workflows" from "authenticated";

revoke delete on table "public"."ai_decision_workflows" from "service_role";

revoke insert on table "public"."ai_decision_workflows" from "service_role";

revoke references on table "public"."ai_decision_workflows" from "service_role";

revoke select on table "public"."ai_decision_workflows" from "service_role";

revoke trigger on table "public"."ai_decision_workflows" from "service_role";

revoke truncate on table "public"."ai_decision_workflows" from "service_role";

revoke update on table "public"."ai_decision_workflows" from "service_role";

revoke delete on table "public"."ai_service_configurations" from "anon";

revoke insert on table "public"."ai_service_configurations" from "anon";

revoke references on table "public"."ai_service_configurations" from "anon";

revoke select on table "public"."ai_service_configurations" from "anon";

revoke trigger on table "public"."ai_service_configurations" from "anon";

revoke truncate on table "public"."ai_service_configurations" from "anon";

revoke update on table "public"."ai_service_configurations" from "anon";

revoke delete on table "public"."ai_service_configurations" from "authenticated";

revoke insert on table "public"."ai_service_configurations" from "authenticated";

revoke references on table "public"."ai_service_configurations" from "authenticated";

revoke select on table "public"."ai_service_configurations" from "authenticated";

revoke trigger on table "public"."ai_service_configurations" from "authenticated";

revoke truncate on table "public"."ai_service_configurations" from "authenticated";

revoke update on table "public"."ai_service_configurations" from "authenticated";

revoke delete on table "public"."ai_service_configurations" from "service_role";

revoke insert on table "public"."ai_service_configurations" from "service_role";

revoke references on table "public"."ai_service_configurations" from "service_role";

revoke select on table "public"."ai_service_configurations" from "service_role";

revoke trigger on table "public"."ai_service_configurations" from "service_role";

revoke truncate on table "public"."ai_service_configurations" from "service_role";

revoke update on table "public"."ai_service_configurations" from "service_role";

revoke delete on table "public"."ai_services" from "anon";

revoke insert on table "public"."ai_services" from "anon";

revoke references on table "public"."ai_services" from "anon";

revoke select on table "public"."ai_services" from "anon";

revoke trigger on table "public"."ai_services" from "anon";

revoke truncate on table "public"."ai_services" from "anon";

revoke update on table "public"."ai_services" from "anon";

revoke delete on table "public"."ai_services" from "authenticated";

revoke insert on table "public"."ai_services" from "authenticated";

revoke references on table "public"."ai_services" from "authenticated";

revoke select on table "public"."ai_services" from "authenticated";

revoke trigger on table "public"."ai_services" from "authenticated";

revoke truncate on table "public"."ai_services" from "authenticated";

revoke update on table "public"."ai_services" from "authenticated";

revoke delete on table "public"."ai_services" from "service_role";

revoke insert on table "public"."ai_services" from "service_role";

revoke references on table "public"."ai_services" from "service_role";

revoke select on table "public"."ai_services" from "service_role";

revoke trigger on table "public"."ai_services" from "service_role";

revoke truncate on table "public"."ai_services" from "service_role";

revoke update on table "public"."ai_services" from "service_role";

revoke delete on table "public"."compliance_items" from "anon";

revoke insert on table "public"."compliance_items" from "anon";

revoke references on table "public"."compliance_items" from "anon";

revoke select on table "public"."compliance_items" from "anon";

revoke trigger on table "public"."compliance_items" from "anon";

revoke truncate on table "public"."compliance_items" from "anon";

revoke update on table "public"."compliance_items" from "anon";

revoke delete on table "public"."compliance_items" from "authenticated";

revoke insert on table "public"."compliance_items" from "authenticated";

revoke references on table "public"."compliance_items" from "authenticated";

revoke select on table "public"."compliance_items" from "authenticated";

revoke trigger on table "public"."compliance_items" from "authenticated";

revoke truncate on table "public"."compliance_items" from "authenticated";

revoke update on table "public"."compliance_items" from "authenticated";

revoke delete on table "public"."compliance_items" from "service_role";

revoke insert on table "public"."compliance_items" from "service_role";

revoke references on table "public"."compliance_items" from "service_role";

revoke select on table "public"."compliance_items" from "service_role";

revoke trigger on table "public"."compliance_items" from "service_role";

revoke truncate on table "public"."compliance_items" from "service_role";

revoke update on table "public"."compliance_items" from "service_role";

alter table "public"."ai_agent_activity_logs" drop constraint "ai_agent_activity_logs_agent_id_fkey";

alter table "public"."ai_agent_activity_logs" drop constraint "ai_agent_activity_logs_status_check";

alter table "public"."ai_agent_activity_logs" drop constraint "ai_agent_activity_logs_tenant_id_fkey";

alter table "public"."ai_agent_activity_logs" drop constraint "ai_agent_activity_logs_user_id_fkey";

alter table "public"."ai_agent_configurations" drop constraint "ai_agent_configurations_agent_id_fkey";

alter table "public"."ai_agent_configurations" drop constraint "ai_agent_configurations_agent_id_tenant_id_key";

alter table "public"."ai_agent_configurations" drop constraint "ai_agent_configurations_created_by_fkey";

alter table "public"."ai_agent_configurations" drop constraint "ai_agent_configurations_tenant_id_fkey";

alter table "public"."ai_agents" drop constraint "ai_agents_agent_type_check";

alter table "public"."ai_agents" drop constraint "ai_agents_status_check";

alter table "public"."ai_agents" drop constraint "ai_agents_tenant_id_name_key";

alter table "public"."ai_decision_analytics" drop constraint "ai_decision_analytics_rule_id_date_key";

alter table "public"."ai_decision_analytics" drop constraint "ai_decision_analytics_rule_id_fkey";

alter table "public"."ai_decision_analytics" drop constraint "ai_decision_analytics_tenant_id_fkey";

alter table "public"."ai_decision_approvals" drop constraint "ai_decision_approvals_approval_status_check";

alter table "public"."ai_decision_approvals" drop constraint "ai_decision_approvals_approver_id_fkey";

alter table "public"."ai_decision_approvals" drop constraint "ai_decision_approvals_decision_instance_id_fkey";

alter table "public"."ai_decision_instances" drop constraint "ai_decision_instances_rule_id_fkey";

alter table "public"."ai_decision_instances" drop constraint "ai_decision_instances_tenant_id_fkey";

alter table "public"."ai_decision_rules" drop constraint "ai_decision_rules_created_by_fkey";

alter table "public"."ai_decision_rules" drop constraint "ai_decision_rules_rule_type_check";

alter table "public"."ai_decision_rules" drop constraint "ai_decision_rules_tenant_id_fkey";

alter table "public"."ai_decision_workflows" drop constraint "ai_decision_workflows_created_by_fkey";

alter table "public"."ai_decision_workflows" drop constraint "ai_decision_workflows_tenant_id_fkey";

alter table "public"."ai_decision_workflows" drop constraint "ai_decision_workflows_workflow_type_check";

alter table "public"."ai_service_configurations" drop constraint "ai_service_configurations_tenant_id_fkey";

alter table "public"."ai_service_configurations" drop constraint "ai_service_configurations_tenant_id_service_id_key";

alter table "public"."ai_services" drop constraint "ai_services_tenant_id_fkey";

alter table "public"."compliance_items" drop constraint "compliance_items_status_check";

alter table "public"."feature_usage_analytics" drop constraint "fk_feature_usage_module_feature";

alter table "public"."feature_usage_analytics" drop constraint "fk_feature_usage_tenant";

alter table "public"."module_features" drop constraint "fk_module_features_module";

alter table "public"."module_permissions" drop constraint "module_permissions_plan_id_module_name_key";

alter table "public"."subscription_plans" drop constraint "subscription_plans_name_key";

alter table "public"."tenant_feature_overrides" drop constraint "fk_tenant_feature_overrides_module_feature";

alter table "public"."tenant_feature_overrides" drop constraint "fk_tenant_feature_overrides_tenant";

alter table "public"."tenant_feature_overrides" drop constraint "tenant_feature_overrides_override_type_check";

alter table "public"."audit_logs" drop constraint "audit_logs_tenant_id_fkey";

alter table "public"."audit_logs" drop constraint "audit_logs_user_id_fkey";

alter table "public"."user_sessions" drop constraint "user_sessions_tenant_id_fkey";

alter table "public"."user_sessions" drop constraint "user_sessions_user_id_fkey";

drop index if exists "public"."idx_application_summary_tenant_date";

drop materialized view if exists "public"."application_summary";

drop function if exists "public"."cleanup_old_audit_logs"();

drop function if exists "public"."cleanup_old_user_interactions"();

drop function if exists "public"."get_active_applications_count"(tenant_uuid uuid);

drop function if exists "public"."get_active_users_count"(p_tenant_id uuid);

drop function if exists "public"."get_company_network"(root_company_id uuid, max_depth integer);

drop function if exists "public"."get_slow_queries"();

drop function if exists "public"."get_user_login_history"(p_user_id uuid, p_limit integer);

drop function if exists "public"."get_user_tenant_id"(user_uuid uuid);

drop function if exists "public"."log_user_login"(p_user_id uuid, p_tenant_id uuid, p_ip_address inet, p_user_agent text, p_login_method text);

drop function if exists "public"."log_user_logout"(p_session_id uuid);

drop function if exists "public"."refresh_materialized_views"();

drop function if exists "public"."update_ai_service_configurations_updated_at"();

drop function if exists "public"."update_module_features_updated_at"();

drop function if exists "public"."update_table_statistics"();

drop function if exists "public"."update_tenant_feature_overrides_updated_at"();

drop function if exists "public"."update_user_sessions_updated_at"();

alter table "public"."ai_agent_activity_logs" drop constraint "ai_agent_activity_logs_pkey";

alter table "public"."ai_agent_configurations" drop constraint "ai_agent_configurations_pkey";

alter table "public"."ai_decision_analytics" drop constraint "ai_decision_analytics_pkey";

alter table "public"."ai_decision_approvals" drop constraint "ai_decision_approvals_pkey";

alter table "public"."ai_decision_instances" drop constraint "ai_decision_instances_pkey";

alter table "public"."ai_decision_rules" drop constraint "ai_decision_rules_pkey";

alter table "public"."ai_decision_workflows" drop constraint "ai_decision_workflows_pkey";

alter table "public"."ai_service_configurations" drop constraint "ai_service_configurations_pkey";

alter table "public"."ai_services" drop constraint "ai_services_pkey";

alter table "public"."compliance_items" drop constraint "compliance_items_pkey";

drop index if exists "public"."ai_agent_activity_logs_pkey";

drop index if exists "public"."ai_agent_configurations_agent_id_tenant_id_key";

drop index if exists "public"."ai_agent_configurations_pkey";

drop index if exists "public"."ai_agents_tenant_id_name_key";

drop index if exists "public"."ai_decision_analytics_pkey";

drop index if exists "public"."ai_decision_analytics_rule_id_date_key";

drop index if exists "public"."ai_decision_approvals_pkey";

drop index if exists "public"."ai_decision_instances_pkey";

drop index if exists "public"."ai_decision_rules_pkey";

drop index if exists "public"."ai_decision_workflows_pkey";

drop index if exists "public"."ai_service_configurations_pkey";

drop index if exists "public"."ai_service_configurations_tenant_id_service_id_key";

drop index if exists "public"."ai_services_pkey";

drop index if exists "public"."compliance_items_pkey";

drop index if exists "public"."idx_ai_agent_activity_logs_agent_id";

drop index if exists "public"."idx_ai_agent_activity_logs_created_at";

drop index if exists "public"."idx_ai_agent_activity_logs_status";

drop index if exists "public"."idx_ai_agent_activity_logs_tenant_id";

drop index if exists "public"."idx_ai_agent_activity_logs_user_id";

drop index if exists "public"."idx_ai_agent_configurations_active";

drop index if exists "public"."idx_ai_agent_configurations_agent_id";

drop index if exists "public"."idx_ai_agent_configurations_tenant_id";

drop index if exists "public"."idx_ai_agents_agent_type";

drop index if exists "public"."idx_ai_agents_created_at";

drop index if exists "public"."idx_ai_agents_tenant_id";

drop index if exists "public"."idx_ai_decision_analytics_rule_date";

drop index if exists "public"."idx_ai_decision_analytics_tenant_date";

drop index if exists "public"."idx_ai_decision_approvals_approver";

drop index if exists "public"."idx_ai_decision_approvals_instance";

drop index if exists "public"."idx_ai_decision_approvals_status";

drop index if exists "public"."idx_ai_decision_instances_created";

drop index if exists "public"."idx_ai_decision_instances_result";

drop index if exists "public"."idx_ai_decision_instances_rule";

drop index if exists "public"."idx_ai_decision_instances_tenant";

drop index if exists "public"."idx_ai_decision_rules_active";

drop index if exists "public"."idx_ai_decision_rules_module";

drop index if exists "public"."idx_ai_decision_rules_tenant";

drop index if exists "public"."idx_ai_decision_rules_type";

drop index if exists "public"."idx_ai_decision_workflows_active";

drop index if exists "public"."idx_ai_decision_workflows_tenant";

drop index if exists "public"."idx_ai_services_category";

drop index if exists "public"."idx_ai_services_is_active";

drop index if exists "public"."idx_ai_services_service_type";

drop index if exists "public"."idx_ai_services_tenant_id";

drop index if exists "public"."idx_applications_candidate_id";

drop index if exists "public"."idx_applications_created_at";

drop index if exists "public"."idx_applications_status_tracking";

drop index if exists "public"."idx_applications_tenant_id";

drop index if exists "public"."idx_audit_logs_severity";

drop index if exists "public"."idx_companies_created_at";

drop index if exists "public"."idx_companies_fts";

drop index if exists "public"."idx_companies_name";

drop index if exists "public"."idx_feature_usage_analytics_last_used";

drop index if exists "public"."idx_form_definitions_active";

drop index if exists "public"."idx_form_definitions_created_at";

drop index if exists "public"."idx_form_definitions_is_active";

drop index if exists "public"."idx_module_features_category";

drop index if exists "public"."idx_people_created_at";

drop index if exists "public"."idx_people_email";

drop index if exists "public"."idx_people_fts";

drop index if exists "public"."idx_people_full_name";

drop index if exists "public"."idx_people_search_composite";

drop index if exists "public"."idx_people_updated_at";

drop index if exists "public"."idx_user_interactions_activity";

drop index if exists "public"."idx_user_interactions_created_at";

drop index if exists "public"."idx_user_interactions_interaction_type";

drop index if exists "public"."idx_user_interactions_tenant_id";

drop index if exists "public"."idx_user_interactions_user_id";

drop index if exists "public"."idx_user_sessions_login_at";

drop index if exists "public"."idx_user_sessions_login_method";

drop index if exists "public"."idx_user_tenants_composite";

drop index if exists "public"."idx_user_tenants_role";

drop index if exists "public"."module_permissions_plan_id_module_name_key";

drop index if exists "public"."subscription_plans_name_key";

drop index if exists "public"."idx_ai_agents_status";

drop table "public"."ai_agent_activity_logs";

drop table "public"."ai_agent_configurations";

drop table "public"."ai_decision_analytics";

drop table "public"."ai_decision_approvals";

drop table "public"."ai_decision_instances";

drop table "public"."ai_decision_rules";

drop table "public"."ai_decision_workflows";

drop table "public"."ai_service_configurations";

drop table "public"."ai_services";

drop table "public"."compliance_items";


  create table "public"."ai_context_cache" (
    "id" uuid not null default gen_random_uuid(),
    "cache_key" text not null,
    "agent_id" uuid,
    "tenant_id" uuid,
    "context_hash" text not null,
    "cached_response" jsonb not null,
    "hit_count" integer default 0,
    "expires_at" timestamp with time zone not null,
    "created_at" timestamp with time zone default now(),
    "last_accessed_at" timestamp with time zone default now()
      );


alter table "public"."ai_context_cache" enable row level security;


  create table "public"."ai_decisions" (
    "id" uuid not null default gen_random_uuid(),
    "agent_id" uuid,
    "user_id" uuid,
    "tenant_id" uuid,
    "context" jsonb not null,
    "decision" jsonb not null,
    "confidence_score" numeric(3,2),
    "reasoning" text[],
    "outcome_feedback" jsonb,
    "was_accepted" boolean,
    "created_at" timestamp with time zone default now()
      );


alter table "public"."ai_decisions" enable row level security;


  create table "public"."ai_insights" (
    "id" uuid not null default gen_random_uuid(),
    "agent_id" uuid,
    "tenant_id" uuid,
    "insight_type" text not null,
    "source_entities" jsonb default '[]'::jsonb,
    "insight_data" jsonb not null,
    "confidence_score" numeric(3,2),
    "applicable_modules" text[],
    "expiry_date" timestamp with time zone,
    "is_active" boolean default true,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."ai_insights" enable row level security;


  create table "public"."ai_learning_data" (
    "id" uuid not null default gen_random_uuid(),
    "decision_id" uuid,
    "feedback_type" text not null,
    "feedback_data" jsonb not null,
    "user_id" uuid,
    "tenant_id" uuid,
    "learning_weight" numeric(3,2) default 1.0,
    "is_processed" boolean default false,
    "created_at" timestamp with time zone default now()
      );


alter table "public"."ai_learning_data" enable row level security;


  create table "public"."ai_models" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null,
    "provider" text not null,
    "model_id" text not null,
    "version" text default '1.0.0'::text,
    "capabilities" text[] default '{}'::text[],
    "cost_per_token" numeric(10,8) default 0.00001,
    "max_tokens" integer default 4096,
    "supports_streaming" boolean default false,
    "supports_vision" boolean default false,
    "supports_function_calling" boolean default false,
    "is_active" boolean default true,
    "configuration" jsonb default '{}'::jsonb,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."ai_models" enable row level security;


  create table "public"."ai_performance_metrics" (
    "id" uuid not null default gen_random_uuid(),
    "agent_id" uuid not null,
    "tenant_id" uuid,
    "metric_date" date not null default CURRENT_DATE,
    "total_requests" integer default 0,
    "successful_requests" integer default 0,
    "failed_requests" integer default 0,
    "average_response_time_ms" integer default 0,
    "total_cost" numeric(10,2) default 0,
    "accuracy_score" numeric(3,2) default 0,
    "user_satisfaction_score" numeric(3,2) default 0,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."ai_performance_metrics" enable row level security;


  create table "public"."ai_request_logs" (
    "id" uuid not null default gen_random_uuid(),
    "request_id" text not null,
    "agent_id" uuid,
    "model_id" uuid,
    "tenant_id" uuid,
    "user_id" uuid,
    "request_type" text not null,
    "input_tokens" integer default 0,
    "output_tokens" integer default 0,
    "total_cost" numeric(10,6) default 0,
    "response_time_ms" integer,
    "status" text not null default 'pending'::text,
    "error_message" text,
    "context" jsonb default '{}'::jsonb,
    "created_at" timestamp with time zone default now()
      );


alter table "public"."ai_request_logs" enable row level security;


  create table "public"."behavioral_patterns" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid,
    "tenant_id" uuid,
    "pattern_type" text not null,
    "pattern_data" jsonb not null,
    "frequency_score" numeric(3,2),
    "last_occurrence" timestamp with time zone,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."behavioral_patterns" enable row level security;


  create table "public"."candidate_tags" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null,
    "color" text default '#3B82F6'::text,
    "description" text,
    "created_at" timestamp with time zone not null default now()
      );


alter table "public"."candidate_tags" enable row level security;


  create table "public"."candidates" (
    "id" uuid not null default gen_random_uuid(),
    "first_name" text not null,
    "last_name" text not null,
    "email" text not null,
    "phone" text,
    "location" text,
    "linkedin_url" text,
    "portfolio_url" text,
    "resume_url" text,
    "resume_text" text,
    "skills" jsonb default '[]'::jsonb,
    "experience_years" integer,
    "current_title" text,
    "current_company" text,
    "desired_salary" numeric,
    "availability_date" date,
    "notes" text,
    "tags" jsonb default '[]'::jsonb,
    "ai_summary" text,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "tenant_id" uuid
      );


alter table "public"."candidates" enable row level security;


  create table "public"."custom_field_values" (
    "id" uuid not null default gen_random_uuid(),
    "field_id" uuid,
    "entity_type" text not null,
    "entity_id" uuid not null,
    "value" jsonb,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."custom_field_values" enable row level security;


  create table "public"."custom_fields" (
    "id" uuid not null default gen_random_uuid(),
    "tenant_id" uuid,
    "name" text not null,
    "field_key" text not null,
    "field_type" text not null,
    "options" jsonb,
    "required" boolean default false,
    "description" text,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "applicable_forms" jsonb default '[]'::jsonb,
    "sort_order" integer default 0,
    "form_id" uuid,
    "section_id" uuid
      );


alter table "public"."custom_fields" enable row level security;


  create table "public"."dashboard_layouts" (
    "id" uuid not null default gen_random_uuid(),
    "config_id" uuid not null,
    "widget_id" text not null,
    "position_x" integer not null default 0,
    "position_y" integer not null default 0,
    "width" integer not null default 1,
    "height" integer not null default 1,
    "widget_config" jsonb default '{}'::jsonb,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."dashboard_layouts" enable row level security;


  create table "public"."dashboard_templates" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null,
    "description" text,
    "template_type" text not null default 'custom'::text,
    "target_role" text,
    "layout_config" jsonb not null default '{}'::jsonb,
    "widget_configs" jsonb not null default '[]'::jsonb,
    "is_active" boolean not null default true,
    "created_by" uuid,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."dashboard_templates" enable row level security;


  create table "public"."dashboard_widgets" (
    "id" uuid not null default gen_random_uuid(),
    "widget_type" text not null,
    "name" text not null,
    "description" text,
    "category" text not null,
    "config_schema" jsonb not null default '{}'::jsonb,
    "data_source_config" jsonb not null default '{}'::jsonb,
    "default_config" jsonb not null default '{}'::jsonb,
    "is_active" boolean not null default true,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."dashboard_widgets" enable row level security;


  create table "public"."feature_events" (
    "id" uuid not null default gen_random_uuid(),
    "feature_id" text not null,
    "event_name" text not null,
    "event_schema" jsonb not null default '{}'::jsonb,
    "description" text,
    "is_active" boolean default true,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );



  create table "public"."feature_interfaces" (
    "id" uuid not null default gen_random_uuid(),
    "feature_id" text not null,
    "interface_type" text not null,
    "interface_path" text not null,
    "interface_props" jsonb default '{}'::jsonb,
    "is_active" boolean default true,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );



  create table "public"."form_deployment_points" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null,
    "description" text,
    "location" public.deployment_location not null,
    "target_path" text,
    "is_active" boolean not null default true,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."form_deployment_points" enable row level security;


  create table "public"."form_module_assignments" (
    "id" uuid not null default gen_random_uuid(),
    "form_id" uuid not null,
    "module_id" uuid not null,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."form_module_assignments" enable row level security;


  create table "public"."form_notifications" (
    "id" uuid not null default gen_random_uuid(),
    "workflow_id" uuid,
    "notification_type" text not null,
    "template_data" jsonb not null default '{}'::jsonb,
    "recipients" jsonb not null default '[]'::jsonb,
    "trigger_event" text not null,
    "is_active" boolean not null default true,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."form_notifications" enable row level security;


  create table "public"."form_placements" (
    "id" uuid not null default gen_random_uuid(),
    "form_id" uuid not null,
    "deployment_point_id" uuid not null,
    "tenant_id" uuid,
    "module_id" uuid,
    "status" public.placement_status not null default 'active'::public.placement_status,
    "priority" integer not null default 0,
    "configuration" jsonb default '{}'::jsonb,
    "starts_at" timestamp with time zone,
    "ends_at" timestamp with time zone,
    "created_by" uuid,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."form_placements" enable row level security;


  create table "public"."form_response_analytics" (
    "id" uuid not null default gen_random_uuid(),
    "form_id" uuid not null,
    "placement_id" uuid,
    "response_id" uuid,
    "event_type" text not null,
    "event_data" jsonb not null default '{}'::jsonb,
    "user_agent" text,
    "ip_address" inet,
    "session_id" text,
    "tenant_id" uuid,
    "created_at" timestamp with time zone not null default now()
      );


alter table "public"."form_response_analytics" enable row level security;


  create table "public"."form_responses" (
    "id" uuid not null default gen_random_uuid(),
    "form_id" uuid not null,
    "placement_id" uuid,
    "tenant_id" uuid,
    "submitted_by" uuid,
    "response_data" jsonb not null default '{}'::jsonb,
    "status" text not null default 'completed'::text,
    "submitted_at" timestamp with time zone not null default now(),
    "processed_at" timestamp with time zone,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."form_responses" enable row level security;


  create table "public"."form_sections" (
    "id" uuid not null default gen_random_uuid(),
    "form_id" uuid not null,
    "name" text not null,
    "description" text,
    "sort_order" integer not null default 0,
    "is_collapsible" boolean not null default false,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."form_sections" enable row level security;


  create table "public"."form_submissions" (
    "id" uuid not null default gen_random_uuid(),
    "form_id" uuid not null,
    "submitted_by" uuid,
    "submission_data" jsonb not null default '{}'::jsonb,
    "status" text not null default 'draft'::text,
    "submitted_at" timestamp with time zone,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."form_submissions" enable row level security;


  create table "public"."form_triggers" (
    "id" uuid not null default gen_random_uuid(),
    "placement_id" uuid not null,
    "trigger_type" public.trigger_type not null,
    "trigger_conditions" jsonb not null default '{}'::jsonb,
    "is_active" boolean not null default true,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."form_triggers" enable row level security;


  create table "public"."form_workflows" (
    "id" uuid not null default gen_random_uuid(),
    "form_id" uuid not null,
    "name" text not null,
    "description" text,
    "trigger_conditions" jsonb not null default '{}'::jsonb,
    "workflow_steps" jsonb not null default '[]'::jsonb,
    "is_active" boolean not null default true,
    "created_by" uuid,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."form_workflows" enable row level security;


  create table "public"."global_email_templates" (
    "id" uuid not null default gen_random_uuid(),
    "template_key" text not null,
    "name" text not null,
    "subject" text not null,
    "html_content" text not null,
    "text_content" text,
    "variables" jsonb default '[]'::jsonb,
    "is_active" boolean not null default true,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "created_by" uuid,
    "updated_by" uuid
      );


alter table "public"."global_email_templates" enable row level security;


  create table "public"."global_settings" (
    "id" uuid not null default gen_random_uuid(),
    "setting_key" text not null,
    "setting_value" jsonb not null default '{}'::jsonb,
    "setting_type" text not null default 'string'::text,
    "category" text not null default 'general'::text,
    "description" text,
    "is_sensitive" boolean not null default false,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "created_by" uuid,
    "updated_by" uuid
      );


alter table "public"."global_settings" enable row level security;


  create table "public"."interviews" (
    "id" uuid not null default gen_random_uuid(),
    "application_id" uuid not null,
    "interviewer_id" uuid,
    "type" public.interview_type not null,
    "scheduled_at" timestamp with time zone not null,
    "duration_minutes" integer default 60,
    "location" text,
    "meeting_link" text,
    "notes" text,
    "feedback" jsonb default '{}'::jsonb,
    "score" numeric,
    "status" text default 'scheduled'::text,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."interviews" enable row level security;


  create table "public"."jobs" (
    "id" uuid not null default gen_random_uuid(),
    "title" text not null,
    "description" text,
    "requirements" jsonb default '[]'::jsonb,
    "location" text,
    "department" text,
    "employment_type" text default 'full-time'::text,
    "salary_min" numeric,
    "salary_max" numeric,
    "status" public.job_status default 'draft'::public.job_status,
    "priority" public.priority_level default 'medium'::public.priority_level,
    "hiring_manager_id" uuid,
    "created_by" uuid,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "closes_at" timestamp with time zone,
    "tenant_id" uuid
      );


alter table "public"."jobs" enable row level security;


  create table "public"."linkedin_profile_enrichments" (
    "id" uuid not null default gen_random_uuid(),
    "person_id" uuid not null,
    "tenant_id" uuid not null,
    "linkedin_data" jsonb not null,
    "match_confidence" numeric(3,2) default 0.0,
    "last_updated" timestamp with time zone default now(),
    "created_at" timestamp with time zone default now()
      );


alter table "public"."linkedin_profile_enrichments" enable row level security;


  create table "public"."module_usage_tracking" (
    "id" uuid not null default gen_random_uuid(),
    "tenant_id" uuid not null,
    "module_name" character varying(100) not null,
    "usage_type" character varying(50) not null,
    "usage_count" integer not null default 0,
    "period_start" timestamp with time zone not null,
    "period_end" timestamp with time zone not null,
    "metadata" jsonb default '{}'::jsonb,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."module_usage_tracking" enable row level security;


  create table "public"."password_policy_enforcement" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid,
    "action_type" text not null,
    "enforcement_date" timestamp with time zone default now(),
    "policy_version" jsonb not null,
    "status" text default 'pending'::text,
    "notes" text,
    "created_at" timestamp with time zone default now()
      );


alter table "public"."password_policy_enforcement" enable row level security;


  create table "public"."skills" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null,
    "category" text,
    "created_at" timestamp with time zone not null default now()
      );


alter table "public"."skills" enable row level security;


  create table "public"."system_health_metrics" (
    "id" uuid not null default gen_random_uuid(),
    "metric_name" text not null,
    "metric_value" numeric not null,
    "metric_unit" text,
    "metric_type" text not null default 'gauge'::text,
    "threshold_warning" numeric,
    "threshold_critical" numeric,
    "recorded_at" timestamp with time zone not null default now(),
    "metadata" jsonb default '{}'::jsonb
      );


alter table "public"."system_health_metrics" enable row level security;


  create table "public"."system_maintenance" (
    "id" uuid not null default gen_random_uuid(),
    "title" text not null,
    "description" text,
    "maintenance_type" text not null default 'scheduled'::text,
    "status" text not null default 'planned'::text,
    "scheduled_start" timestamp with time zone not null,
    "scheduled_end" timestamp with time zone not null,
    "actual_start" timestamp with time zone,
    "actual_end" timestamp with time zone,
    "affected_services" jsonb default '[]'::jsonb,
    "notification_sent" boolean not null default false,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "created_by" uuid
      );


alter table "public"."system_maintenance" enable row level security;


  create table "public"."system_notifications" (
    "id" uuid not null default gen_random_uuid(),
    "title" text not null,
    "message" text not null,
    "type" text not null default 'info'::text,
    "is_active" boolean not null default true,
    "priority" integer not null default 0,
    "starts_at" timestamp with time zone,
    "ends_at" timestamp with time zone,
    "target_users" jsonb default '["all"]'::jsonb,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "created_by" uuid
      );


alter table "public"."system_notifications" enable row level security;


  create table "public"."talent_skills" (
    "id" uuid not null default gen_random_uuid(),
    "talent_id" uuid not null,
    "skill_id" uuid not null,
    "proficiency_level" text,
    "years_of_experience" numeric(4,1),
    "created_at" timestamp with time zone not null default now()
      );


alter table "public"."talent_skills" enable row level security;


  create table "public"."talents" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid,
    "full_name" text not null,
    "email" text not null,
    "phone" text,
    "location" text,
    "years_of_experience" integer,
    "current_salary" numeric(12,2),
    "desired_salary" numeric(12,2),
    "availability_status" text default 'available'::text,
    "avatar_url" text,
    "bio" text,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."talents" enable row level security;


  create table "public"."tenant_ai_models" (
    "id" uuid not null default gen_random_uuid(),
    "tenant_id" uuid not null,
    "model_id" text not null,
    "api_key" text,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."tenant_ai_models" enable row level security;


  create table "public"."tenant_api_connections" (
    "id" uuid not null default gen_random_uuid(),
    "tenant_id" uuid not null,
    "connection_name" character varying(100) not null,
    "api_endpoint" text not null,
    "authentication_config" jsonb not null default '{}'::jsonb,
    "webhook_config" jsonb default '{}'::jsonb,
    "is_active" boolean not null default true,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."tenant_api_connections" enable row level security;


  create table "public"."tenant_billing_connections" (
    "id" uuid not null default gen_random_uuid(),
    "tenant_id" uuid not null,
    "platform" character varying(50) not null,
    "connection_config" jsonb not null default '{}'::jsonb,
    "is_active" boolean not null default true,
    "connected_at" timestamp with time zone not null default now(),
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."tenant_billing_connections" enable row level security;


  create table "public"."tenant_communication_connections" (
    "id" uuid not null default gen_random_uuid(),
    "tenant_id" uuid not null,
    "platform" character varying(50) not null,
    "connection_config" jsonb not null default '{}'::jsonb,
    "is_active" boolean not null default true,
    "connected_at" timestamp with time zone not null default now(),
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."tenant_communication_connections" enable row level security;


  create table "public"."tenant_document_parsing_config" (
    "id" uuid not null default gen_random_uuid(),
    "tenant_id" uuid not null,
    "parsing_rules" jsonb default '{}'::jsonb,
    "ai_model_config" jsonb default '{}'::jsonb,
    "supported_formats" jsonb default '["pdf", "doc", "docx", "txt"]'::jsonb,
    "is_active" boolean not null default true,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."tenant_document_parsing_config" enable row level security;


  create table "public"."tenant_email_configurations" (
    "id" uuid not null default gen_random_uuid(),
    "tenant_id" uuid not null,
    "smtp_config" jsonb default '{}'::jsonb,
    "signature_templates" jsonb default '[]'::jsonb,
    "automation_config" jsonb default '{}'::jsonb,
    "tracking_enabled" boolean not null default false,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."tenant_email_configurations" enable row level security;


  create table "public"."tenant_outreach_configurations" (
    "id" uuid not null default gen_random_uuid(),
    "tenant_id" uuid not null,
    "campaign_templates" jsonb default '[]'::jsonb,
    "automation_workflows" jsonb default '[]'::jsonb,
    "follow_up_sequences" jsonb default '[]'::jsonb,
    "is_active" boolean not null default true,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."tenant_outreach_configurations" enable row level security;


  create table "public"."tenant_social_media_connections" (
    "id" uuid not null default gen_random_uuid(),
    "tenant_id" uuid not null,
    "platform" character varying(50) not null,
    "connection_config" jsonb not null default '{}'::jsonb,
    "is_active" boolean not null default true,
    "connected_at" timestamp with time zone not null default now(),
    "expires_at" timestamp with time zone,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."tenant_social_media_connections" enable row level security;


  create table "public"."tenant_subscriptions" (
    "id" uuid not null default gen_random_uuid(),
    "tenant_id" uuid not null,
    "plan_id" uuid not null,
    "status" text not null default 'active'::text,
    "billing_cycle" text not null default 'monthly'::text,
    "starts_at" timestamp with time zone not null default now(),
    "ends_at" timestamp with time zone,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "subscription_level" text default 'tenant'::text
      );


alter table "public"."tenant_subscriptions" enable row level security;


  create table "public"."tenant_video_connections" (
    "id" uuid not null default gen_random_uuid(),
    "tenant_id" uuid not null,
    "platform" character varying(50) not null,
    "connection_config" jsonb not null default '{}'::jsonb,
    "is_active" boolean not null default true,
    "connected_at" timestamp with time zone not null default now(),
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."tenant_video_connections" enable row level security;


  create table "public"."user_dashboard_configs" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "dashboard_name" text not null,
    "layout_config" jsonb not null default '{}'::jsonb,
    "widget_configs" jsonb not null default '[]'::jsonb,
    "filters" jsonb default '{}'::jsonb,
    "is_default" boolean default false,
    "tenant_id" uuid,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."user_dashboard_configs" enable row level security;


  create table "public"."user_navigation_preferences" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "admin_type" text not null,
    "preferences" jsonb not null default '{}'::jsonb,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."user_navigation_preferences" enable row level security;


  create table "public"."user_subscriptions" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "tenant_id" uuid not null,
    "plan_id" uuid not null,
    "status" text not null default 'active'::text,
    "billing_cycle" text not null default 'monthly'::text,
    "starts_at" timestamp with time zone not null default now(),
    "ends_at" timestamp with time zone,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "assigned_by" uuid
      );


alter table "public"."user_subscriptions" enable row level security;


  create table "public"."widget_data_sources" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null,
    "source_type" text not null,
    "query_config" jsonb not null default '{}'::jsonb,
    "refresh_interval" integer default 300,
    "cache_duration" integer default 300,
    "is_active" boolean not null default true,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."widget_data_sources" enable row level security;


  create table "public"."workflow_execution_logs" (
    "id" uuid not null default gen_random_uuid(),
    "workflow_id" uuid not null,
    "response_id" uuid not null,
    "execution_status" text not null default 'pending'::text,
    "step_results" jsonb not null default '[]'::jsonb,
    "error_message" text,
    "started_at" timestamp with time zone not null default now(),
    "completed_at" timestamp with time zone,
    "created_at" timestamp with time zone not null default now()
      );


alter table "public"."workflow_execution_logs" enable row level security;

alter table "public"."ai_agents" drop column "agent_type";

alter table "public"."ai_agents" add column "api_endpoint" text;

alter table "public"."ai_agents" add column "cost_per_request" numeric(10,6) default 0.001;

alter table "public"."ai_agents" add column "is_active" boolean default true;

alter table "public"."ai_agents" add column "last_trained_at" timestamp with time zone;

alter table "public"."ai_agents" add column "model_version" text default '1.0.0'::text;

alter table "public"."ai_agents" add column "training_data_version" text;

alter table "public"."ai_agents" add column "type" public.ai_agent_type not null;

alter table "public"."ai_agents" alter column "capabilities" set default '{}'::text[];

alter table "public"."ai_agents" alter column "capabilities" set data type text[] using "capabilities"::text[];

alter table "public"."ai_agents" alter column "created_at" drop not null;

alter table "public"."ai_agents" alter column "model_config" drop not null;

alter table "public"."ai_agents" alter column "status" set default 'inactive'::public.ai_agent_status;

alter table "public"."ai_agents" alter column "status" drop not null;

alter table "public"."ai_agents" alter column "status" set data type public.ai_agent_status using "status"::public.ai_agent_status;

alter table "public"."ai_agents" alter column "updated_at" drop not null;

alter table "public"."applications" enable row level security;

alter table "public"."audit_logs" add column "request_id" text;

alter table "public"."audit_logs" alter column "severity" set default 'info'::text;

alter table "public"."audit_logs" alter column "severity" drop not null;

alter table "public"."companies" add column "industry" text;

alter table "public"."companies" enable row level security;

alter table "public"."company_relationship_history" enable row level security;

alter table "public"."company_relationship_types" enable row level security;

alter table "public"."company_relationships" enable row level security;

alter table "public"."company_relationships_advanced" enable row level security;

alter table "public"."dropdown_option_categories" enable row level security;

alter table "public"."dropdown_options" enable row level security;

alter table "public"."feature_usage_analytics" disable row level security;

alter table "public"."form_definitions" enable row level security;

alter table "public"."module_features" add column "created_by" uuid;

alter table "public"."module_features" add column "dependencies" text[] default '{}'::text[];

alter table "public"."module_features" add column "feature_config" jsonb default '{}'::jsonb;

alter table "public"."module_features" add column "input_schema" jsonb default '{}'::jsonb;

alter table "public"."module_features" add column "is_active" boolean default true;

alter table "public"."module_features" add column "output_schema" jsonb default '{}'::jsonb;

alter table "public"."module_features" add column "requirements" text[] default '{}'::text[];

alter table "public"."module_features" add column "tags" text[] default '{}'::text[];

alter table "public"."module_features" add column "ui_component_path" text;

alter table "public"."module_features" add column "version" text default 'v1.0.0'::text;

alter table "public"."module_features" disable row level security;

alter table "public"."module_permissions" drop column "updated_at";

alter table "public"."module_permissions" alter column "created_at" set not null;

alter table "public"."module_permissions" alter column "is_enabled" set default false;

alter table "public"."module_permissions" alter column "is_enabled" set not null;

alter table "public"."module_permissions" alter column "limits" drop default;

alter table "public"."module_permissions" enable row level security;

alter table "public"."module_pricing" enable row level security;

alter table "public"."people" enable row level security;

alter table "public"."profiles" enable row level security;

alter table "public"."subscription_plans" alter column "base_price_annually" set default 0;

alter table "public"."subscription_plans" alter column "base_price_monthly" set default 0;

alter table "public"."subscription_plans" alter column "created_at" set not null;

alter table "public"."subscription_plans" alter column "is_active" set not null;

alter table "public"."subscription_plans" alter column "price_annually" set default 0;

alter table "public"."subscription_plans" alter column "price_annually" set not null;

alter table "public"."subscription_plans" alter column "price_monthly" set default 0;

alter table "public"."subscription_plans" alter column "updated_at" set not null;

alter table "public"."subscription_plans" enable row level security;

alter table "public"."system_modules" enable row level security;

alter table "public"."tenant_feature_overrides" disable row level security;

alter table "public"."tenants" enable row level security;

alter table "public"."user_interactions" enable row level security;

alter table "public"."user_sessions" drop column "created_at";

alter table "public"."user_sessions" drop column "location_info";

alter table "public"."user_sessions" drop column "session_duration_minutes";

alter table "public"."user_sessions" drop column "updated_at";

alter table "public"."user_sessions" add column "last_activity_at" timestamp with time zone default now();

alter table "public"."user_sessions" add column "session_token" text not null;

alter table "public"."user_sessions" alter column "is_active" drop not null;

alter table "public"."user_tenants" enable row level security;

CREATE UNIQUE INDEX ai_context_cache_cache_key_key ON public.ai_context_cache USING btree (cache_key);

CREATE UNIQUE INDEX ai_context_cache_pkey ON public.ai_context_cache USING btree (id);

CREATE UNIQUE INDEX ai_decisions_pkey ON public.ai_decisions USING btree (id);

CREATE UNIQUE INDEX ai_insights_pkey ON public.ai_insights USING btree (id);

CREATE UNIQUE INDEX ai_learning_data_pkey ON public.ai_learning_data USING btree (id);

CREATE UNIQUE INDEX ai_models_pkey ON public.ai_models USING btree (id);

CREATE UNIQUE INDEX ai_performance_metrics_agent_id_tenant_id_metric_date_key ON public.ai_performance_metrics USING btree (agent_id, tenant_id, metric_date);

CREATE UNIQUE INDEX ai_performance_metrics_pkey ON public.ai_performance_metrics USING btree (id);

CREATE UNIQUE INDEX ai_request_logs_pkey ON public.ai_request_logs USING btree (id);

CREATE UNIQUE INDEX applications_job_id_candidate_id_key ON public.applications USING btree (job_id, candidate_id);

CREATE UNIQUE INDEX behavioral_patterns_pkey ON public.behavioral_patterns USING btree (id);

CREATE UNIQUE INDEX candidate_tags_name_key ON public.candidate_tags USING btree (name);

CREATE UNIQUE INDEX candidate_tags_pkey ON public.candidate_tags USING btree (id);

CREATE UNIQUE INDEX candidates_pkey ON public.candidates USING btree (id);

CREATE UNIQUE INDEX companies_tr_id_key ON public.companies USING btree (tr_id);

CREATE UNIQUE INDEX company_relationships_person_company_unique ON public.company_relationships USING btree (person_id, company_id, start_date);

CREATE UNIQUE INDEX custom_field_values_field_id_entity_type_entity_id_key ON public.custom_field_values USING btree (field_id, entity_type, entity_id);

CREATE UNIQUE INDEX custom_field_values_pkey ON public.custom_field_values USING btree (id);

CREATE UNIQUE INDEX custom_fields_pkey ON public.custom_fields USING btree (id);

CREATE UNIQUE INDEX custom_fields_tenant_id_field_key_key ON public.custom_fields USING btree (tenant_id, field_key);

CREATE UNIQUE INDEX dashboard_layouts_pkey ON public.dashboard_layouts USING btree (id);

CREATE UNIQUE INDEX dashboard_templates_pkey ON public.dashboard_templates USING btree (id);

CREATE UNIQUE INDEX dashboard_widgets_pkey ON public.dashboard_widgets USING btree (id);

CREATE UNIQUE INDEX dropdown_options_category_id_value_key ON public.dropdown_options USING btree (category_id, value);

CREATE UNIQUE INDEX feature_events_feature_id_event_name_key ON public.feature_events USING btree (feature_id, event_name);

CREATE UNIQUE INDEX feature_events_pkey ON public.feature_events USING btree (id);

CREATE UNIQUE INDEX feature_interfaces_feature_id_interface_type_key ON public.feature_interfaces USING btree (feature_id, interface_type);

CREATE UNIQUE INDEX feature_interfaces_pkey ON public.feature_interfaces USING btree (id);

CREATE UNIQUE INDEX form_definitions_tenant_id_slug_key ON public.form_definitions USING btree (tenant_id, slug);

CREATE UNIQUE INDEX form_deployment_points_pkey ON public.form_deployment_points USING btree (id);

CREATE UNIQUE INDEX form_module_assignments_form_id_module_id_key ON public.form_module_assignments USING btree (form_id, module_id);

CREATE UNIQUE INDEX form_module_assignments_pkey ON public.form_module_assignments USING btree (id);

CREATE UNIQUE INDEX form_notifications_pkey ON public.form_notifications USING btree (id);

CREATE UNIQUE INDEX form_placements_form_id_deployment_point_id_tenant_id_key ON public.form_placements USING btree (form_id, deployment_point_id, tenant_id);

CREATE UNIQUE INDEX form_placements_pkey ON public.form_placements USING btree (id);

CREATE UNIQUE INDEX form_response_analytics_pkey ON public.form_response_analytics USING btree (id);

CREATE UNIQUE INDEX form_responses_pkey ON public.form_responses USING btree (id);

CREATE UNIQUE INDEX form_sections_pkey ON public.form_sections USING btree (id);

CREATE UNIQUE INDEX form_submissions_pkey ON public.form_submissions USING btree (id);

CREATE UNIQUE INDEX form_triggers_pkey ON public.form_triggers USING btree (id);

CREATE UNIQUE INDEX form_workflows_pkey ON public.form_workflows USING btree (id);

CREATE UNIQUE INDEX global_email_templates_pkey ON public.global_email_templates USING btree (id);

CREATE UNIQUE INDEX global_email_templates_template_key_key ON public.global_email_templates USING btree (template_key);

CREATE UNIQUE INDEX global_settings_pkey ON public.global_settings USING btree (id);

CREATE UNIQUE INDEX global_settings_setting_key_key ON public.global_settings USING btree (setting_key);

CREATE INDEX idx_ai_agents_tenant_type ON public.ai_agents USING btree (tenant_id, type);

CREATE INDEX idx_ai_context_cache_agent_id ON public.ai_context_cache USING btree (agent_id);

CREATE INDEX idx_ai_context_cache_key_expires ON public.ai_context_cache USING btree (cache_key, expires_at);

CREATE INDEX idx_ai_context_cache_tenant_id ON public.ai_context_cache USING btree (tenant_id);

CREATE INDEX idx_ai_decisions_agent_created ON public.ai_decisions USING btree (agent_id, created_at);

CREATE INDEX idx_ai_decisions_agent_user ON public.ai_decisions USING btree (agent_id, user_id);

CREATE INDEX idx_ai_decisions_tenant_id ON public.ai_decisions USING btree (tenant_id);

CREATE INDEX idx_ai_decisions_time ON public.ai_decisions USING btree (created_at);

CREATE INDEX idx_ai_insights_agent_id ON public.ai_insights USING btree (agent_id);

CREATE INDEX idx_ai_insights_tenant_active ON public.ai_insights USING btree (tenant_id, is_active);

CREATE INDEX idx_ai_insights_tenant_type ON public.ai_insights USING btree (tenant_id, insight_type) WHERE (is_active = true);

CREATE INDEX idx_ai_learning_data_tenant_id ON public.ai_learning_data USING btree (tenant_id);

CREATE INDEX idx_ai_performance_metrics_agent_date ON public.ai_performance_metrics USING btree (agent_id, metric_date);

CREATE INDEX idx_ai_request_logs_agent_status ON public.ai_request_logs USING btree (agent_id, status);

CREATE INDEX idx_ai_request_logs_model_id ON public.ai_request_logs USING btree (model_id);

CREATE INDEX idx_ai_request_logs_tenant_created ON public.ai_request_logs USING btree (tenant_id, created_at);

CREATE INDEX idx_applications_candidate ON public.applications USING btree (candidate_id);

CREATE INDEX idx_applications_job ON public.applications USING btree (job_id);

CREATE INDEX idx_applications_tenant ON public.applications USING btree (tenant_id);

CREATE INDEX idx_audit_logs_module_name ON public.audit_logs USING btree (module_name);

CREATE INDEX idx_behavioral_patterns_tenant_id ON public.behavioral_patterns USING btree (tenant_id);

CREATE INDEX idx_behavioral_patterns_user_type ON public.behavioral_patterns USING btree (user_id, pattern_type);

CREATE INDEX idx_candidates_email ON public.candidates USING btree (email);

CREATE INDEX idx_candidates_tenant ON public.candidates USING btree (tenant_id);

CREATE INDEX idx_companies_tr_id ON public.companies USING btree (tr_id);

CREATE INDEX idx_custom_fields_form_id ON public.custom_fields USING btree (form_id);

CREATE INDEX idx_custom_fields_section_id ON public.custom_fields USING btree (section_id);

CREATE INDEX idx_dropdown_options_category_id ON public.dropdown_options USING btree (category_id);

CREATE INDEX idx_feature_events_feature_id ON public.feature_events USING btree (feature_id);

CREATE INDEX idx_feature_interfaces_feature_id ON public.feature_interfaces USING btree (feature_id);

CREATE INDEX idx_feature_interfaces_type ON public.feature_interfaces USING btree (interface_type);

CREATE INDEX idx_form_definitions_slug ON public.form_definitions USING btree (slug);

CREATE INDEX idx_form_definitions_visibility_scope ON public.form_definitions USING btree (visibility_scope);

CREATE INDEX idx_form_module_assignments_form_id ON public.form_module_assignments USING btree (form_id);

CREATE INDEX idx_form_module_assignments_module_id ON public.form_module_assignments USING btree (module_id);

CREATE INDEX idx_form_notifications_workflow_id ON public.form_notifications USING btree (workflow_id);

CREATE INDEX idx_form_placements_form_id ON public.form_placements USING btree (form_id);

CREATE INDEX idx_form_placements_tenant_status ON public.form_placements USING btree (tenant_id, status);

CREATE INDEX idx_form_response_analytics_created_at ON public.form_response_analytics USING btree (created_at);

CREATE INDEX idx_form_response_analytics_form_id ON public.form_response_analytics USING btree (form_id);

CREATE INDEX idx_form_responses_submitted_at ON public.form_responses USING btree (submitted_at);

CREATE INDEX idx_form_responses_tenant_form ON public.form_responses USING btree (tenant_id, form_id);

CREATE INDEX idx_form_sections_form_id ON public.form_sections USING btree (form_id);

CREATE INDEX idx_form_sections_sort_order ON public.form_sections USING btree (form_id, sort_order);

CREATE INDEX idx_form_submissions_form_id ON public.form_submissions USING btree (form_id);

CREATE INDEX idx_form_submissions_submitted_by ON public.form_submissions USING btree (submitted_by);

CREATE INDEX idx_form_triggers_placement_active ON public.form_triggers USING btree (placement_id, is_active);

CREATE INDEX idx_form_workflows_form_id ON public.form_workflows USING btree (form_id);

CREATE INDEX idx_interviews_application ON public.interviews USING btree (application_id);

CREATE INDEX idx_interviews_scheduled ON public.interviews USING btree (scheduled_at);

CREATE INDEX idx_jobs_status ON public.jobs USING btree (status);

CREATE INDEX idx_jobs_tenant ON public.jobs USING btree (tenant_id);

CREATE INDEX idx_linkedin_enrichments_person ON public.linkedin_profile_enrichments USING btree (person_id);

CREATE INDEX idx_module_features_active ON public.module_features USING btree (is_active) WHERE (is_active = true);

CREATE INDEX idx_module_features_tags ON public.module_features USING gin (tags);

CREATE INDEX idx_module_pricing_active ON public.module_pricing USING btree (is_active);

CREATE INDEX idx_module_pricing_module_name ON public.module_pricing USING btree (module_name);

CREATE INDEX idx_people_tr_id ON public.people USING btree (tr_id);

CREATE INDEX idx_profiles_policy_compliance ON public.profiles USING btree (policy_check_required, password_meets_policy);

CREATE INDEX idx_profiles_tr_id ON public.profiles USING btree (tr_id);

CREATE INDEX idx_system_modules_name ON public.system_modules USING btree (name);

CREATE INDEX idx_tenant_social_connections_tenant_platform ON public.tenant_social_media_connections USING btree (tenant_id, platform);

CREATE INDEX idx_tenant_subscriptions_status ON public.tenant_subscriptions USING btree (status);

CREATE INDEX idx_tenant_subscriptions_tenant_id ON public.tenant_subscriptions USING btree (tenant_id);

CREATE INDEX idx_tenants_tr_id ON public.tenants USING btree (tr_id);

CREATE INDEX idx_user_interactions_tenant_type ON public.user_interactions USING btree (tenant_id, interaction_type);

CREATE INDEX idx_user_interactions_type_time ON public.user_interactions USING btree (interaction_type, created_at);

CREATE INDEX idx_user_interactions_user_tenant ON public.user_interactions USING btree (user_id, tenant_id);

CREATE INDEX idx_user_sessions_session_token ON public.user_sessions USING btree (session_token);

CREATE INDEX idx_workflow_execution_logs_response_id ON public.workflow_execution_logs USING btree (response_id);

CREATE INDEX idx_workflow_execution_logs_workflow_id ON public.workflow_execution_logs USING btree (workflow_id);

CREATE UNIQUE INDEX interviews_pkey ON public.interviews USING btree (id);

CREATE UNIQUE INDEX jobs_pkey ON public.jobs USING btree (id);

CREATE UNIQUE INDEX linkedin_profile_enrichments_person_id_key ON public.linkedin_profile_enrichments USING btree (person_id);

CREATE UNIQUE INDEX linkedin_profile_enrichments_pkey ON public.linkedin_profile_enrichments USING btree (id);

CREATE UNIQUE INDEX module_pricing_module_name_key ON public.module_pricing USING btree (module_name);

CREATE UNIQUE INDEX module_usage_tracking_pkey ON public.module_usage_tracking USING btree (id);

CREATE UNIQUE INDEX module_usage_tracking_tenant_id_module_name_usage_type_peri_key ON public.module_usage_tracking USING btree (tenant_id, module_name, usage_type, period_start);

CREATE UNIQUE INDEX password_policy_enforcement_pkey ON public.password_policy_enforcement USING btree (id);

CREATE UNIQUE INDEX people_email_key ON public.people USING btree (email);

CREATE UNIQUE INDEX people_tr_id_key ON public.people USING btree (tr_id);

CREATE UNIQUE INDEX profiles_tr_id_key ON public.profiles USING btree (tr_id);

CREATE UNIQUE INDEX skills_name_key ON public.skills USING btree (name);

CREATE UNIQUE INDEX skills_pkey ON public.skills USING btree (id);

CREATE UNIQUE INDEX system_health_metrics_pkey ON public.system_health_metrics USING btree (id);

CREATE UNIQUE INDEX system_maintenance_pkey ON public.system_maintenance USING btree (id);

CREATE UNIQUE INDEX system_modules_pkey ON public.system_modules USING btree (id);

CREATE UNIQUE INDEX system_notifications_pkey ON public.system_notifications USING btree (id);

CREATE UNIQUE INDEX talent_skills_pkey ON public.talent_skills USING btree (id);

CREATE UNIQUE INDEX talent_skills_talent_id_skill_id_key ON public.talent_skills USING btree (talent_id, skill_id);

CREATE UNIQUE INDEX talents_email_key ON public.talents USING btree (email);

CREATE UNIQUE INDEX talents_pkey ON public.talents USING btree (id);

CREATE UNIQUE INDEX tenant_ai_models_pkey ON public.tenant_ai_models USING btree (id);

CREATE UNIQUE INDEX tenant_ai_models_tenant_id_key ON public.tenant_ai_models USING btree (tenant_id);

CREATE UNIQUE INDEX tenant_api_connections_pkey ON public.tenant_api_connections USING btree (id);

CREATE UNIQUE INDEX tenant_api_connections_tenant_id_connection_name_key ON public.tenant_api_connections USING btree (tenant_id, connection_name);

CREATE UNIQUE INDEX tenant_billing_connections_pkey ON public.tenant_billing_connections USING btree (id);

CREATE UNIQUE INDEX tenant_billing_connections_tenant_id_platform_key ON public.tenant_billing_connections USING btree (tenant_id, platform);

CREATE UNIQUE INDEX tenant_communication_connections_pkey ON public.tenant_communication_connections USING btree (id);

CREATE UNIQUE INDEX tenant_communication_connections_tenant_id_platform_key ON public.tenant_communication_connections USING btree (tenant_id, platform);

CREATE UNIQUE INDEX tenant_document_parsing_config_pkey ON public.tenant_document_parsing_config USING btree (id);

CREATE UNIQUE INDEX tenant_document_parsing_config_tenant_id_key ON public.tenant_document_parsing_config USING btree (tenant_id);

CREATE UNIQUE INDEX tenant_email_configurations_pkey ON public.tenant_email_configurations USING btree (id);

CREATE UNIQUE INDEX tenant_email_configurations_tenant_id_key ON public.tenant_email_configurations USING btree (tenant_id);

CREATE UNIQUE INDEX tenant_outreach_configurations_pkey ON public.tenant_outreach_configurations USING btree (id);

CREATE UNIQUE INDEX tenant_outreach_configurations_tenant_id_key ON public.tenant_outreach_configurations USING btree (tenant_id);

CREATE UNIQUE INDEX tenant_social_media_connections_pkey ON public.tenant_social_media_connections USING btree (id);

CREATE UNIQUE INDEX tenant_social_media_connections_tenant_id_platform_key ON public.tenant_social_media_connections USING btree (tenant_id, platform);

CREATE UNIQUE INDEX tenant_subscriptions_pkey ON public.tenant_subscriptions USING btree (id);

CREATE UNIQUE INDEX tenant_video_connections_pkey ON public.tenant_video_connections USING btree (id);

CREATE UNIQUE INDEX tenant_video_connections_tenant_id_platform_key ON public.tenant_video_connections USING btree (tenant_id, platform);

CREATE UNIQUE INDEX tenants_tr_id_key ON public.tenants USING btree (tr_id);

CREATE UNIQUE INDEX user_dashboard_configs_pkey ON public.user_dashboard_configs USING btree (id);

CREATE UNIQUE INDEX user_navigation_preferences_pkey ON public.user_navigation_preferences USING btree (id);

CREATE UNIQUE INDEX user_navigation_preferences_user_id_admin_type_key ON public.user_navigation_preferences USING btree (user_id, admin_type);

CREATE UNIQUE INDEX user_sessions_session_token_key ON public.user_sessions USING btree (session_token);

CREATE UNIQUE INDEX user_subscriptions_pkey ON public.user_subscriptions USING btree (id);

CREATE UNIQUE INDEX user_subscriptions_user_id_tenant_id_key ON public.user_subscriptions USING btree (user_id, tenant_id);

CREATE UNIQUE INDEX user_tenants_user_id_tenant_id_key ON public.user_tenants USING btree (user_id, tenant_id);

CREATE UNIQUE INDEX widget_data_sources_pkey ON public.widget_data_sources USING btree (id);

CREATE UNIQUE INDEX workflow_execution_logs_pkey ON public.workflow_execution_logs USING btree (id);

CREATE INDEX idx_ai_agents_status ON public.ai_agents USING btree (status) WHERE (is_active = true);

alter table "public"."ai_context_cache" add constraint "ai_context_cache_pkey" PRIMARY KEY using index "ai_context_cache_pkey";

alter table "public"."ai_decisions" add constraint "ai_decisions_pkey" PRIMARY KEY using index "ai_decisions_pkey";

alter table "public"."ai_insights" add constraint "ai_insights_pkey" PRIMARY KEY using index "ai_insights_pkey";

alter table "public"."ai_learning_data" add constraint "ai_learning_data_pkey" PRIMARY KEY using index "ai_learning_data_pkey";

alter table "public"."ai_models" add constraint "ai_models_pkey" PRIMARY KEY using index "ai_models_pkey";

alter table "public"."ai_performance_metrics" add constraint "ai_performance_metrics_pkey" PRIMARY KEY using index "ai_performance_metrics_pkey";

alter table "public"."ai_request_logs" add constraint "ai_request_logs_pkey" PRIMARY KEY using index "ai_request_logs_pkey";

alter table "public"."behavioral_patterns" add constraint "behavioral_patterns_pkey" PRIMARY KEY using index "behavioral_patterns_pkey";

alter table "public"."candidate_tags" add constraint "candidate_tags_pkey" PRIMARY KEY using index "candidate_tags_pkey";

alter table "public"."candidates" add constraint "candidates_pkey" PRIMARY KEY using index "candidates_pkey";

alter table "public"."custom_field_values" add constraint "custom_field_values_pkey" PRIMARY KEY using index "custom_field_values_pkey";

alter table "public"."custom_fields" add constraint "custom_fields_pkey" PRIMARY KEY using index "custom_fields_pkey";

alter table "public"."dashboard_layouts" add constraint "dashboard_layouts_pkey" PRIMARY KEY using index "dashboard_layouts_pkey";

alter table "public"."dashboard_templates" add constraint "dashboard_templates_pkey" PRIMARY KEY using index "dashboard_templates_pkey";

alter table "public"."dashboard_widgets" add constraint "dashboard_widgets_pkey" PRIMARY KEY using index "dashboard_widgets_pkey";

alter table "public"."feature_events" add constraint "feature_events_pkey" PRIMARY KEY using index "feature_events_pkey";

alter table "public"."feature_interfaces" add constraint "feature_interfaces_pkey" PRIMARY KEY using index "feature_interfaces_pkey";

alter table "public"."form_deployment_points" add constraint "form_deployment_points_pkey" PRIMARY KEY using index "form_deployment_points_pkey";

alter table "public"."form_module_assignments" add constraint "form_module_assignments_pkey" PRIMARY KEY using index "form_module_assignments_pkey";

alter table "public"."form_notifications" add constraint "form_notifications_pkey" PRIMARY KEY using index "form_notifications_pkey";

alter table "public"."form_placements" add constraint "form_placements_pkey" PRIMARY KEY using index "form_placements_pkey";

alter table "public"."form_response_analytics" add constraint "form_response_analytics_pkey" PRIMARY KEY using index "form_response_analytics_pkey";

alter table "public"."form_responses" add constraint "form_responses_pkey" PRIMARY KEY using index "form_responses_pkey";

alter table "public"."form_sections" add constraint "form_sections_pkey" PRIMARY KEY using index "form_sections_pkey";

alter table "public"."form_submissions" add constraint "form_submissions_pkey" PRIMARY KEY using index "form_submissions_pkey";

alter table "public"."form_triggers" add constraint "form_triggers_pkey" PRIMARY KEY using index "form_triggers_pkey";

alter table "public"."form_workflows" add constraint "form_workflows_pkey" PRIMARY KEY using index "form_workflows_pkey";

alter table "public"."global_email_templates" add constraint "global_email_templates_pkey" PRIMARY KEY using index "global_email_templates_pkey";

alter table "public"."global_settings" add constraint "global_settings_pkey" PRIMARY KEY using index "global_settings_pkey";

alter table "public"."interviews" add constraint "interviews_pkey" PRIMARY KEY using index "interviews_pkey";

alter table "public"."jobs" add constraint "jobs_pkey" PRIMARY KEY using index "jobs_pkey";

alter table "public"."linkedin_profile_enrichments" add constraint "linkedin_profile_enrichments_pkey" PRIMARY KEY using index "linkedin_profile_enrichments_pkey";

alter table "public"."module_usage_tracking" add constraint "module_usage_tracking_pkey" PRIMARY KEY using index "module_usage_tracking_pkey";

alter table "public"."password_policy_enforcement" add constraint "password_policy_enforcement_pkey" PRIMARY KEY using index "password_policy_enforcement_pkey";

alter table "public"."skills" add constraint "skills_pkey" PRIMARY KEY using index "skills_pkey";

alter table "public"."system_health_metrics" add constraint "system_health_metrics_pkey" PRIMARY KEY using index "system_health_metrics_pkey";

alter table "public"."system_maintenance" add constraint "system_maintenance_pkey" PRIMARY KEY using index "system_maintenance_pkey";

alter table "public"."system_modules" add constraint "system_modules_pkey" PRIMARY KEY using index "system_modules_pkey";

alter table "public"."system_notifications" add constraint "system_notifications_pkey" PRIMARY KEY using index "system_notifications_pkey";

alter table "public"."talent_skills" add constraint "talent_skills_pkey" PRIMARY KEY using index "talent_skills_pkey";

alter table "public"."talents" add constraint "talents_pkey" PRIMARY KEY using index "talents_pkey";

alter table "public"."tenant_ai_models" add constraint "tenant_ai_models_pkey" PRIMARY KEY using index "tenant_ai_models_pkey";

alter table "public"."tenant_api_connections" add constraint "tenant_api_connections_pkey" PRIMARY KEY using index "tenant_api_connections_pkey";

alter table "public"."tenant_billing_connections" add constraint "tenant_billing_connections_pkey" PRIMARY KEY using index "tenant_billing_connections_pkey";

alter table "public"."tenant_communication_connections" add constraint "tenant_communication_connections_pkey" PRIMARY KEY using index "tenant_communication_connections_pkey";

alter table "public"."tenant_document_parsing_config" add constraint "tenant_document_parsing_config_pkey" PRIMARY KEY using index "tenant_document_parsing_config_pkey";

alter table "public"."tenant_email_configurations" add constraint "tenant_email_configurations_pkey" PRIMARY KEY using index "tenant_email_configurations_pkey";

alter table "public"."tenant_outreach_configurations" add constraint "tenant_outreach_configurations_pkey" PRIMARY KEY using index "tenant_outreach_configurations_pkey";

alter table "public"."tenant_social_media_connections" add constraint "tenant_social_media_connections_pkey" PRIMARY KEY using index "tenant_social_media_connections_pkey";

alter table "public"."tenant_subscriptions" add constraint "tenant_subscriptions_pkey" PRIMARY KEY using index "tenant_subscriptions_pkey";

alter table "public"."tenant_video_connections" add constraint "tenant_video_connections_pkey" PRIMARY KEY using index "tenant_video_connections_pkey";

alter table "public"."user_dashboard_configs" add constraint "user_dashboard_configs_pkey" PRIMARY KEY using index "user_dashboard_configs_pkey";

alter table "public"."user_navigation_preferences" add constraint "user_navigation_preferences_pkey" PRIMARY KEY using index "user_navigation_preferences_pkey";

alter table "public"."user_subscriptions" add constraint "user_subscriptions_pkey" PRIMARY KEY using index "user_subscriptions_pkey";

alter table "public"."widget_data_sources" add constraint "widget_data_sources_pkey" PRIMARY KEY using index "widget_data_sources_pkey";

alter table "public"."workflow_execution_logs" add constraint "workflow_execution_logs_pkey" PRIMARY KEY using index "workflow_execution_logs_pkey";

alter table "public"."ai_context_cache" add constraint "ai_context_cache_agent_id_fkey" FOREIGN KEY (agent_id) REFERENCES public.ai_agents(id) not valid;

alter table "public"."ai_context_cache" validate constraint "ai_context_cache_agent_id_fkey";

alter table "public"."ai_context_cache" add constraint "ai_context_cache_cache_key_key" UNIQUE using index "ai_context_cache_cache_key_key";

alter table "public"."ai_context_cache" add constraint "ai_context_cache_tenant_id_fkey" FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) not valid;

alter table "public"."ai_context_cache" validate constraint "ai_context_cache_tenant_id_fkey";

alter table "public"."ai_decisions" add constraint "ai_decisions_agent_id_fkey" FOREIGN KEY (agent_id) REFERENCES public.ai_agents(id) ON DELETE CASCADE not valid;

alter table "public"."ai_decisions" validate constraint "ai_decisions_agent_id_fkey";

alter table "public"."ai_decisions" add constraint "ai_decisions_confidence_score_check" CHECK (((confidence_score >= (0)::numeric) AND (confidence_score <= (1)::numeric))) not valid;

alter table "public"."ai_decisions" validate constraint "ai_decisions_confidence_score_check";

alter table "public"."ai_decisions" add constraint "ai_decisions_tenant_id_fkey" FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE not valid;

alter table "public"."ai_decisions" validate constraint "ai_decisions_tenant_id_fkey";

alter table "public"."ai_decisions" add constraint "ai_decisions_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE not valid;

alter table "public"."ai_decisions" validate constraint "ai_decisions_user_id_fkey";

alter table "public"."ai_insights" add constraint "ai_insights_agent_id_fkey" FOREIGN KEY (agent_id) REFERENCES public.ai_agents(id) ON DELETE CASCADE not valid;

alter table "public"."ai_insights" validate constraint "ai_insights_agent_id_fkey";

alter table "public"."ai_insights" add constraint "ai_insights_tenant_id_fkey" FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE not valid;

alter table "public"."ai_insights" validate constraint "ai_insights_tenant_id_fkey";

alter table "public"."ai_learning_data" add constraint "ai_learning_data_decision_id_fkey" FOREIGN KEY (decision_id) REFERENCES public.ai_decisions(id) not valid;

alter table "public"."ai_learning_data" validate constraint "ai_learning_data_decision_id_fkey";

alter table "public"."ai_learning_data" add constraint "ai_learning_data_tenant_id_fkey" FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) not valid;

alter table "public"."ai_learning_data" validate constraint "ai_learning_data_tenant_id_fkey";

alter table "public"."ai_performance_metrics" add constraint "ai_performance_metrics_agent_id_fkey" FOREIGN KEY (agent_id) REFERENCES public.ai_agents(id) not valid;

alter table "public"."ai_performance_metrics" validate constraint "ai_performance_metrics_agent_id_fkey";

alter table "public"."ai_performance_metrics" add constraint "ai_performance_metrics_agent_id_tenant_id_metric_date_key" UNIQUE using index "ai_performance_metrics_agent_id_tenant_id_metric_date_key";

alter table "public"."ai_performance_metrics" add constraint "ai_performance_metrics_tenant_id_fkey" FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) not valid;

alter table "public"."ai_performance_metrics" validate constraint "ai_performance_metrics_tenant_id_fkey";

alter table "public"."ai_request_logs" add constraint "ai_request_logs_agent_id_fkey" FOREIGN KEY (agent_id) REFERENCES public.ai_agents(id) not valid;

alter table "public"."ai_request_logs" validate constraint "ai_request_logs_agent_id_fkey";

alter table "public"."ai_request_logs" add constraint "ai_request_logs_model_id_fkey" FOREIGN KEY (model_id) REFERENCES public.ai_models(id) not valid;

alter table "public"."ai_request_logs" validate constraint "ai_request_logs_model_id_fkey";

alter table "public"."ai_request_logs" add constraint "ai_request_logs_tenant_id_fkey" FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) not valid;

alter table "public"."ai_request_logs" validate constraint "ai_request_logs_tenant_id_fkey";

alter table "public"."applications" add constraint "applications_candidate_id_fkey" FOREIGN KEY (candidate_id) REFERENCES public.candidates(id) ON DELETE CASCADE not valid;

alter table "public"."applications" validate constraint "applications_candidate_id_fkey";

alter table "public"."applications" add constraint "applications_job_id_candidate_id_key" UNIQUE using index "applications_job_id_candidate_id_key";

alter table "public"."applications" add constraint "applications_job_id_fkey" FOREIGN KEY (job_id) REFERENCES public.jobs(id) ON DELETE CASCADE not valid;

alter table "public"."applications" validate constraint "applications_job_id_fkey";

alter table "public"."behavioral_patterns" add constraint "behavioral_patterns_tenant_id_fkey" FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE not valid;

alter table "public"."behavioral_patterns" validate constraint "behavioral_patterns_tenant_id_fkey";

alter table "public"."behavioral_patterns" add constraint "behavioral_patterns_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE not valid;

alter table "public"."behavioral_patterns" validate constraint "behavioral_patterns_user_id_fkey";

alter table "public"."candidate_tags" add constraint "candidate_tags_name_key" UNIQUE using index "candidate_tags_name_key";

alter table "public"."companies" add constraint "companies_parent_company_id_fkey" FOREIGN KEY (parent_company_id) REFERENCES public.companies(id) ON DELETE SET NULL not valid;

alter table "public"."companies" validate constraint "companies_parent_company_id_fkey";

alter table "public"."companies" add constraint "companies_tr_id_key" UNIQUE using index "companies_tr_id_key";

alter table "public"."company_relationships" add constraint "company_relationships_branch_office_id_fkey" FOREIGN KEY (branch_office_id) REFERENCES public.company_branch_offices(id) not valid;

alter table "public"."company_relationships" validate constraint "company_relationships_branch_office_id_fkey";

alter table "public"."company_relationships" add constraint "company_relationships_company_id_fkey" FOREIGN KEY (company_id) REFERENCES public.companies(id) not valid;

alter table "public"."company_relationships" validate constraint "company_relationships_company_id_fkey";

alter table "public"."company_relationships" add constraint "company_relationships_person_company_unique" UNIQUE using index "company_relationships_person_company_unique";

alter table "public"."company_relationships" add constraint "company_relationships_reports_to_fkey" FOREIGN KEY (reports_to) REFERENCES public.people(id) not valid;

alter table "public"."company_relationships" validate constraint "company_relationships_reports_to_fkey";

alter table "public"."custom_field_values" add constraint "custom_field_values_field_id_entity_type_entity_id_key" UNIQUE using index "custom_field_values_field_id_entity_type_entity_id_key";

alter table "public"."custom_field_values" add constraint "custom_field_values_field_id_fkey" FOREIGN KEY (field_id) REFERENCES public.custom_fields(id) ON DELETE CASCADE not valid;

alter table "public"."custom_field_values" validate constraint "custom_field_values_field_id_fkey";

alter table "public"."custom_fields" add constraint "custom_fields_form_id_fkey" FOREIGN KEY (form_id) REFERENCES public.form_definitions(id) ON DELETE SET NULL not valid;

alter table "public"."custom_fields" validate constraint "custom_fields_form_id_fkey";

alter table "public"."custom_fields" add constraint "custom_fields_section_id_fkey" FOREIGN KEY (section_id) REFERENCES public.form_sections(id) ON DELETE SET NULL not valid;

alter table "public"."custom_fields" validate constraint "custom_fields_section_id_fkey";

alter table "public"."custom_fields" add constraint "custom_fields_tenant_id_field_key_key" UNIQUE using index "custom_fields_tenant_id_field_key_key";

alter table "public"."custom_fields" add constraint "custom_fields_tenant_id_fkey" FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE not valid;

alter table "public"."custom_fields" validate constraint "custom_fields_tenant_id_fkey";

alter table "public"."dashboard_layouts" add constraint "dashboard_layouts_config_id_fkey" FOREIGN KEY (config_id) REFERENCES public.user_dashboard_configs(id) ON DELETE CASCADE not valid;

alter table "public"."dashboard_layouts" validate constraint "dashboard_layouts_config_id_fkey";

alter table "public"."dropdown_options" add constraint "dropdown_options_category_id_fkey" FOREIGN KEY (category_id) REFERENCES public.dropdown_option_categories(id) ON DELETE CASCADE not valid;

alter table "public"."dropdown_options" validate constraint "dropdown_options_category_id_fkey";

alter table "public"."dropdown_options" add constraint "dropdown_options_category_id_value_key" UNIQUE using index "dropdown_options_category_id_value_key";

alter table "public"."feature_events" add constraint "feature_events_feature_id_event_name_key" UNIQUE using index "feature_events_feature_id_event_name_key";

alter table "public"."feature_interfaces" add constraint "feature_interfaces_feature_id_interface_type_key" UNIQUE using index "feature_interfaces_feature_id_interface_type_key";

alter table "public"."feature_interfaces" add constraint "feature_interfaces_interface_type_check" CHECK ((interface_type = ANY (ARRAY['component'::text, 'service'::text, 'hook'::text, 'api'::text]))) not valid;

alter table "public"."feature_interfaces" validate constraint "feature_interfaces_interface_type_check";

alter table "public"."form_definitions" add constraint "form_definitions_created_by_fkey" FOREIGN KEY (created_by) REFERENCES public.profiles(id) not valid;

alter table "public"."form_definitions" validate constraint "form_definitions_created_by_fkey";

alter table "public"."form_definitions" add constraint "form_definitions_tenant_id_fkey" FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) not valid;

alter table "public"."form_definitions" validate constraint "form_definitions_tenant_id_fkey";

alter table "public"."form_definitions" add constraint "form_definitions_tenant_id_slug_key" UNIQUE using index "form_definitions_tenant_id_slug_key";

alter table "public"."form_module_assignments" add constraint "form_module_assignments_form_id_fkey" FOREIGN KEY (form_id) REFERENCES public.form_definitions(id) ON DELETE CASCADE not valid;

alter table "public"."form_module_assignments" validate constraint "form_module_assignments_form_id_fkey";

alter table "public"."form_module_assignments" add constraint "form_module_assignments_form_id_module_id_key" UNIQUE using index "form_module_assignments_form_id_module_id_key";

alter table "public"."form_module_assignments" add constraint "form_module_assignments_module_id_fkey" FOREIGN KEY (module_id) REFERENCES public.system_modules(id) ON DELETE CASCADE not valid;

alter table "public"."form_module_assignments" validate constraint "form_module_assignments_module_id_fkey";

alter table "public"."form_notifications" add constraint "form_notifications_notification_type_check" CHECK ((notification_type = ANY (ARRAY['email'::text, 'sms'::text, 'in_app'::text, 'webhook'::text]))) not valid;

alter table "public"."form_notifications" validate constraint "form_notifications_notification_type_check";

alter table "public"."form_notifications" add constraint "form_notifications_workflow_id_fkey" FOREIGN KEY (workflow_id) REFERENCES public.form_workflows(id) ON DELETE CASCADE not valid;

alter table "public"."form_notifications" validate constraint "form_notifications_workflow_id_fkey";

alter table "public"."form_placements" add constraint "form_placements_deployment_point_id_fkey" FOREIGN KEY (deployment_point_id) REFERENCES public.form_deployment_points(id) ON DELETE CASCADE not valid;

alter table "public"."form_placements" validate constraint "form_placements_deployment_point_id_fkey";

alter table "public"."form_placements" add constraint "form_placements_form_id_deployment_point_id_tenant_id_key" UNIQUE using index "form_placements_form_id_deployment_point_id_tenant_id_key";

alter table "public"."form_placements" add constraint "form_placements_form_id_fkey" FOREIGN KEY (form_id) REFERENCES public.form_definitions(id) ON DELETE CASCADE not valid;

alter table "public"."form_placements" validate constraint "form_placements_form_id_fkey";

alter table "public"."form_placements" add constraint "form_placements_module_id_fkey" FOREIGN KEY (module_id) REFERENCES public.system_modules(id) ON DELETE SET NULL not valid;

alter table "public"."form_placements" validate constraint "form_placements_module_id_fkey";

alter table "public"."form_placements" add constraint "form_placements_tenant_id_fkey" FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE not valid;

alter table "public"."form_placements" validate constraint "form_placements_tenant_id_fkey";

alter table "public"."form_response_analytics" add constraint "form_response_analytics_event_type_check" CHECK ((event_type = ANY (ARRAY['form_view'::text, 'form_start'::text, 'form_submit'::text, 'form_abandon'::text]))) not valid;

alter table "public"."form_response_analytics" validate constraint "form_response_analytics_event_type_check";

alter table "public"."form_response_analytics" add constraint "form_response_analytics_form_id_fkey" FOREIGN KEY (form_id) REFERENCES public.form_definitions(id) ON DELETE CASCADE not valid;

alter table "public"."form_response_analytics" validate constraint "form_response_analytics_form_id_fkey";

alter table "public"."form_response_analytics" add constraint "form_response_analytics_placement_id_fkey" FOREIGN KEY (placement_id) REFERENCES public.form_placements(id) ON DELETE SET NULL not valid;

alter table "public"."form_response_analytics" validate constraint "form_response_analytics_placement_id_fkey";

alter table "public"."form_response_analytics" add constraint "form_response_analytics_response_id_fkey" FOREIGN KEY (response_id) REFERENCES public.form_responses(id) ON DELETE CASCADE not valid;

alter table "public"."form_response_analytics" validate constraint "form_response_analytics_response_id_fkey";

alter table "public"."form_response_analytics" add constraint "form_response_analytics_tenant_id_fkey" FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) not valid;

alter table "public"."form_response_analytics" validate constraint "form_response_analytics_tenant_id_fkey";

alter table "public"."form_responses" add constraint "form_responses_form_id_fkey" FOREIGN KEY (form_id) REFERENCES public.form_definitions(id) ON DELETE CASCADE not valid;

alter table "public"."form_responses" validate constraint "form_responses_form_id_fkey";

alter table "public"."form_responses" add constraint "form_responses_placement_id_fkey" FOREIGN KEY (placement_id) REFERENCES public.form_placements(id) ON DELETE SET NULL not valid;

alter table "public"."form_responses" validate constraint "form_responses_placement_id_fkey";

alter table "public"."form_responses" add constraint "form_responses_tenant_id_fkey" FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE not valid;

alter table "public"."form_responses" validate constraint "form_responses_tenant_id_fkey";

alter table "public"."form_sections" add constraint "form_sections_form_id_fkey" FOREIGN KEY (form_id) REFERENCES public.form_definitions(id) ON DELETE CASCADE not valid;

alter table "public"."form_sections" validate constraint "form_sections_form_id_fkey";

alter table "public"."form_submissions" add constraint "form_submissions_form_id_fkey" FOREIGN KEY (form_id) REFERENCES public.form_definitions(id) ON DELETE CASCADE not valid;

alter table "public"."form_submissions" validate constraint "form_submissions_form_id_fkey";

alter table "public"."form_submissions" add constraint "form_submissions_status_check" CHECK ((status = ANY (ARRAY['draft'::text, 'submitted'::text, 'approved'::text, 'rejected'::text]))) not valid;

alter table "public"."form_submissions" validate constraint "form_submissions_status_check";

alter table "public"."form_submissions" add constraint "form_submissions_submitted_by_fkey" FOREIGN KEY (submitted_by) REFERENCES public.profiles(id) not valid;

alter table "public"."form_submissions" validate constraint "form_submissions_submitted_by_fkey";

alter table "public"."form_triggers" add constraint "form_triggers_placement_id_fkey" FOREIGN KEY (placement_id) REFERENCES public.form_placements(id) ON DELETE CASCADE not valid;

alter table "public"."form_triggers" validate constraint "form_triggers_placement_id_fkey";

alter table "public"."form_workflows" add constraint "form_workflows_created_by_fkey" FOREIGN KEY (created_by) REFERENCES public.profiles(id) not valid;

alter table "public"."form_workflows" validate constraint "form_workflows_created_by_fkey";

alter table "public"."form_workflows" add constraint "form_workflows_form_id_fkey" FOREIGN KEY (form_id) REFERENCES public.form_definitions(id) ON DELETE CASCADE not valid;

alter table "public"."form_workflows" validate constraint "form_workflows_form_id_fkey";

alter table "public"."global_email_templates" add constraint "global_email_templates_created_by_fkey" FOREIGN KEY (created_by) REFERENCES public.profiles(id) not valid;

alter table "public"."global_email_templates" validate constraint "global_email_templates_created_by_fkey";

alter table "public"."global_email_templates" add constraint "global_email_templates_template_key_key" UNIQUE using index "global_email_templates_template_key_key";

alter table "public"."global_email_templates" add constraint "global_email_templates_updated_by_fkey" FOREIGN KEY (updated_by) REFERENCES public.profiles(id) not valid;

alter table "public"."global_email_templates" validate constraint "global_email_templates_updated_by_fkey";

alter table "public"."global_settings" add constraint "global_settings_created_by_fkey" FOREIGN KEY (created_by) REFERENCES public.profiles(id) not valid;

alter table "public"."global_settings" validate constraint "global_settings_created_by_fkey";

alter table "public"."global_settings" add constraint "global_settings_setting_key_key" UNIQUE using index "global_settings_setting_key_key";

alter table "public"."global_settings" add constraint "global_settings_updated_by_fkey" FOREIGN KEY (updated_by) REFERENCES public.profiles(id) not valid;

alter table "public"."global_settings" validate constraint "global_settings_updated_by_fkey";

alter table "public"."interviews" add constraint "interviews_application_id_fkey" FOREIGN KEY (application_id) REFERENCES public.applications(id) ON DELETE CASCADE not valid;

alter table "public"."interviews" validate constraint "interviews_application_id_fkey";

alter table "public"."interviews" add constraint "interviews_score_check" CHECK (((score >= (1)::numeric) AND (score <= (10)::numeric))) not valid;

alter table "public"."interviews" validate constraint "interviews_score_check";

alter table "public"."linkedin_profile_enrichments" add constraint "linkedin_profile_enrichments_person_id_fkey" FOREIGN KEY (person_id) REFERENCES public.people(id) ON DELETE CASCADE not valid;

alter table "public"."linkedin_profile_enrichments" validate constraint "linkedin_profile_enrichments_person_id_fkey";

alter table "public"."linkedin_profile_enrichments" add constraint "linkedin_profile_enrichments_person_id_key" UNIQUE using index "linkedin_profile_enrichments_person_id_key";

alter table "public"."module_pricing" add constraint "module_pricing_module_name_key" UNIQUE using index "module_pricing_module_name_key";

alter table "public"."module_usage_tracking" add constraint "module_usage_tracking_tenant_id_module_name_usage_type_peri_key" UNIQUE using index "module_usage_tracking_tenant_id_module_name_usage_type_peri_key";

alter table "public"."password_policy_enforcement" add constraint "password_policy_enforcement_action_type_check" CHECK ((action_type = ANY (ARRAY['notification_sent'::text, 'forced_reset'::text, 'grace_period_granted'::text]))) not valid;

alter table "public"."password_policy_enforcement" validate constraint "password_policy_enforcement_action_type_check";

alter table "public"."password_policy_enforcement" add constraint "password_policy_enforcement_status_check" CHECK ((status = ANY (ARRAY['pending'::text, 'completed'::text, 'failed'::text]))) not valid;

alter table "public"."password_policy_enforcement" validate constraint "password_policy_enforcement_status_check";

alter table "public"."password_policy_enforcement" add constraint "password_policy_enforcement_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE not valid;

alter table "public"."password_policy_enforcement" validate constraint "password_policy_enforcement_user_id_fkey";

alter table "public"."people" add constraint "people_email_key" UNIQUE using index "people_email_key";

alter table "public"."people" add constraint "people_tr_id_key" UNIQUE using index "people_tr_id_key";

alter table "public"."profiles" add constraint "profiles_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."profiles" validate constraint "profiles_id_fkey";

alter table "public"."profiles" add constraint "profiles_tr_id_key" UNIQUE using index "profiles_tr_id_key";

alter table "public"."saved_reports" add constraint "saved_reports_created_by_fkey" FOREIGN KEY (created_by) REFERENCES public.profiles(id) not valid;

alter table "public"."saved_reports" validate constraint "saved_reports_created_by_fkey";

alter table "public"."skills" add constraint "skills_name_key" UNIQUE using index "skills_name_key";

alter table "public"."system_maintenance" add constraint "system_maintenance_created_by_fkey" FOREIGN KEY (created_by) REFERENCES public.profiles(id) not valid;

alter table "public"."system_maintenance" validate constraint "system_maintenance_created_by_fkey";

alter table "public"."system_notifications" add constraint "system_notifications_created_by_fkey" FOREIGN KEY (created_by) REFERENCES public.profiles(id) not valid;

alter table "public"."system_notifications" validate constraint "system_notifications_created_by_fkey";

alter table "public"."talent_skills" add constraint "talent_skills_skill_id_fkey" FOREIGN KEY (skill_id) REFERENCES public.skills(id) ON DELETE CASCADE not valid;

alter table "public"."talent_skills" validate constraint "talent_skills_skill_id_fkey";

alter table "public"."talent_skills" add constraint "talent_skills_talent_id_fkey" FOREIGN KEY (talent_id) REFERENCES public.talents(id) ON DELETE CASCADE not valid;

alter table "public"."talent_skills" validate constraint "talent_skills_talent_id_fkey";

alter table "public"."talent_skills" add constraint "talent_skills_talent_id_skill_id_key" UNIQUE using index "talent_skills_talent_id_skill_id_key";

alter table "public"."talents" add constraint "talents_email_key" UNIQUE using index "talents_email_key";

alter table "public"."talents" add constraint "talents_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table "public"."talents" validate constraint "talents_user_id_fkey";

alter table "public"."tenant_ai_models" add constraint "tenant_ai_models_tenant_id_fkey" FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE not valid;

alter table "public"."tenant_ai_models" validate constraint "tenant_ai_models_tenant_id_fkey";

alter table "public"."tenant_ai_models" add constraint "tenant_ai_models_tenant_id_key" UNIQUE using index "tenant_ai_models_tenant_id_key";

alter table "public"."tenant_api_connections" add constraint "tenant_api_connections_tenant_id_connection_name_key" UNIQUE using index "tenant_api_connections_tenant_id_connection_name_key";

alter table "public"."tenant_billing_connections" add constraint "tenant_billing_connections_tenant_id_platform_key" UNIQUE using index "tenant_billing_connections_tenant_id_platform_key";

alter table "public"."tenant_communication_connections" add constraint "tenant_communication_connections_tenant_id_platform_key" UNIQUE using index "tenant_communication_connections_tenant_id_platform_key";

alter table "public"."tenant_document_parsing_config" add constraint "tenant_document_parsing_config_tenant_id_key" UNIQUE using index "tenant_document_parsing_config_tenant_id_key";

alter table "public"."tenant_email_configurations" add constraint "tenant_email_configurations_tenant_id_key" UNIQUE using index "tenant_email_configurations_tenant_id_key";

alter table "public"."tenant_outreach_configurations" add constraint "tenant_outreach_configurations_tenant_id_key" UNIQUE using index "tenant_outreach_configurations_tenant_id_key";

alter table "public"."tenant_social_media_connections" add constraint "tenant_social_media_connections_tenant_id_platform_key" UNIQUE using index "tenant_social_media_connections_tenant_id_platform_key";

alter table "public"."tenant_subscriptions" add constraint "tenant_subscriptions_billing_cycle_check" CHECK ((billing_cycle = ANY (ARRAY['monthly'::text, 'annually'::text]))) not valid;

alter table "public"."tenant_subscriptions" validate constraint "tenant_subscriptions_billing_cycle_check";

alter table "public"."tenant_subscriptions" add constraint "tenant_subscriptions_plan_id_fkey" FOREIGN KEY (plan_id) REFERENCES public.subscription_plans(id) ON DELETE CASCADE not valid;

alter table "public"."tenant_subscriptions" validate constraint "tenant_subscriptions_plan_id_fkey";

alter table "public"."tenant_subscriptions" add constraint "tenant_subscriptions_status_check" CHECK ((status = ANY (ARRAY['active'::text, 'inactive'::text, 'cancelled'::text, 'expired'::text]))) not valid;

alter table "public"."tenant_subscriptions" validate constraint "tenant_subscriptions_status_check";

alter table "public"."tenant_subscriptions" add constraint "tenant_subscriptions_subscription_level_check" CHECK ((subscription_level = ANY (ARRAY['tenant'::text, 'fallback'::text]))) not valid;

alter table "public"."tenant_subscriptions" validate constraint "tenant_subscriptions_subscription_level_check";

alter table "public"."tenant_subscriptions" add constraint "tenant_subscriptions_tenant_id_fkey" FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE not valid;

alter table "public"."tenant_subscriptions" validate constraint "tenant_subscriptions_tenant_id_fkey";

alter table "public"."tenant_video_connections" add constraint "tenant_video_connections_tenant_id_platform_key" UNIQUE using index "tenant_video_connections_tenant_id_platform_key";

alter table "public"."tenants" add constraint "tenants_tr_id_key" UNIQUE using index "tenants_tr_id_key";

alter table "public"."user_interactions" add constraint "user_interactions_tenant_id_fkey" FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE not valid;

alter table "public"."user_interactions" validate constraint "user_interactions_tenant_id_fkey";

alter table "public"."user_interactions" add constraint "user_interactions_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE not valid;

alter table "public"."user_interactions" validate constraint "user_interactions_user_id_fkey";

alter table "public"."user_navigation_preferences" add constraint "user_navigation_preferences_admin_type_check" CHECK ((admin_type = ANY (ARRAY['super_admin'::text, 'tenant_admin'::text]))) not valid;

alter table "public"."user_navigation_preferences" validate constraint "user_navigation_preferences_admin_type_check";

alter table "public"."user_navigation_preferences" add constraint "user_navigation_preferences_user_id_admin_type_key" UNIQUE using index "user_navigation_preferences_user_id_admin_type_key";

alter table "public"."user_navigation_preferences" add constraint "user_navigation_preferences_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."user_navigation_preferences" validate constraint "user_navigation_preferences_user_id_fkey";

alter table "public"."user_sessions" add constraint "user_sessions_session_token_key" UNIQUE using index "user_sessions_session_token_key";

alter table "public"."user_subscriptions" add constraint "user_subscriptions_assigned_by_fkey" FOREIGN KEY (assigned_by) REFERENCES auth.users(id) not valid;

alter table "public"."user_subscriptions" validate constraint "user_subscriptions_assigned_by_fkey";

alter table "public"."user_subscriptions" add constraint "user_subscriptions_billing_cycle_check" CHECK ((billing_cycle = ANY (ARRAY['monthly'::text, 'annually'::text]))) not valid;

alter table "public"."user_subscriptions" validate constraint "user_subscriptions_billing_cycle_check";

alter table "public"."user_subscriptions" add constraint "user_subscriptions_plan_id_fkey" FOREIGN KEY (plan_id) REFERENCES public.subscription_plans(id) ON DELETE CASCADE not valid;

alter table "public"."user_subscriptions" validate constraint "user_subscriptions_plan_id_fkey";

alter table "public"."user_subscriptions" add constraint "user_subscriptions_status_check" CHECK ((status = ANY (ARRAY['active'::text, 'inactive'::text, 'cancelled'::text, 'expired'::text]))) not valid;

alter table "public"."user_subscriptions" validate constraint "user_subscriptions_status_check";

alter table "public"."user_subscriptions" add constraint "user_subscriptions_tenant_id_fkey" FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE not valid;

alter table "public"."user_subscriptions" validate constraint "user_subscriptions_tenant_id_fkey";

alter table "public"."user_subscriptions" add constraint "user_subscriptions_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."user_subscriptions" validate constraint "user_subscriptions_user_id_fkey";

alter table "public"."user_subscriptions" add constraint "user_subscriptions_user_id_tenant_id_key" UNIQUE using index "user_subscriptions_user_id_tenant_id_key";

alter table "public"."user_tenants" add constraint "user_tenants_manager_id_fkey" FOREIGN KEY (manager_id) REFERENCES public.profiles(id) not valid;

alter table "public"."user_tenants" validate constraint "user_tenants_manager_id_fkey";

alter table "public"."user_tenants" add constraint "user_tenants_tenant_id_fkey" FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE not valid;

alter table "public"."user_tenants" validate constraint "user_tenants_tenant_id_fkey";

alter table "public"."user_tenants" add constraint "user_tenants_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE not valid;

alter table "public"."user_tenants" validate constraint "user_tenants_user_id_fkey";

alter table "public"."user_tenants" add constraint "user_tenants_user_id_tenant_id_key" UNIQUE using index "user_tenants_user_id_tenant_id_key";

alter table "public"."workflow_execution_logs" add constraint "workflow_execution_logs_execution_status_check" CHECK ((execution_status = ANY (ARRAY['pending'::text, 'running'::text, 'completed'::text, 'failed'::text]))) not valid;

alter table "public"."workflow_execution_logs" validate constraint "workflow_execution_logs_execution_status_check";

alter table "public"."workflow_execution_logs" add constraint "workflow_execution_logs_response_id_fkey" FOREIGN KEY (response_id) REFERENCES public.form_responses(id) ON DELETE CASCADE not valid;

alter table "public"."workflow_execution_logs" validate constraint "workflow_execution_logs_response_id_fkey";

alter table "public"."workflow_execution_logs" add constraint "workflow_execution_logs_workflow_id_fkey" FOREIGN KEY (workflow_id) REFERENCES public.form_workflows(id) ON DELETE CASCADE not valid;

alter table "public"."workflow_execution_logs" validate constraint "workflow_execution_logs_workflow_id_fkey";

alter table "public"."audit_logs" add constraint "audit_logs_tenant_id_fkey" FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) not valid;

alter table "public"."audit_logs" validate constraint "audit_logs_tenant_id_fkey";

alter table "public"."audit_logs" add constraint "audit_logs_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) not valid;

alter table "public"."audit_logs" validate constraint "audit_logs_user_id_fkey";

alter table "public"."user_sessions" add constraint "user_sessions_tenant_id_fkey" FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) not valid;

alter table "public"."user_sessions" validate constraint "user_sessions_tenant_id_fkey";

alter table "public"."user_sessions" add constraint "user_sessions_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE not valid;

alter table "public"."user_sessions" validate constraint "user_sessions_user_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.assign_tr_id_companies()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  IF NEW.tr_id IS NULL THEN
    NEW.tr_id := public.generate_tr_id('COM');
  END IF;
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.assign_tr_id_people()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  IF NEW.tr_id IS NULL THEN
    NEW.tr_id := public.generate_tr_id('PEO');
  END IF;
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.assign_tr_id_profiles()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  IF NEW.tr_id IS NULL THEN
    NEW.tr_id := public.generate_tr_id('USR');
  END IF;
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.assign_tr_id_tenants()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  IF NEW.tr_id IS NULL THEN
    NEW.tr_id := public.generate_tr_id('TEN');
  END IF;
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.backfill_tr_ids()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  -- Update companies without TR IDs
  UPDATE public.companies 
  SET tr_id = public.generate_tr_id('COM')
  WHERE tr_id IS NULL;
  
  -- Update tenants without TR IDs
  UPDATE public.tenants 
  SET tr_id = public.generate_tr_id('TEN')
  WHERE tr_id IS NULL;
  
  -- Update profiles without TR IDs
  UPDATE public.profiles 
  SET tr_id = public.generate_tr_id('USR')
  WHERE tr_id IS NULL;
  
  -- Update people without TR IDs
  UPDATE public.people 
  SET tr_id = public.generate_tr_id('PEO')
  WHERE tr_id IS NULL;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.check_password_policy_compliance(user_password_hash text, user_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  policy_requirements jsonb;
  min_length integer;
  require_uppercase boolean;
  require_lowercase boolean;
  require_numbers boolean;
  require_symbols boolean;
BEGIN
  -- Get current password policy from global_settings
  SELECT jsonb_object_agg(setting_key, setting_value) INTO policy_requirements
  FROM global_settings 
  WHERE category = 'security' 
  AND setting_key IN ('password_min_length', 'password_require_uppercase', 
                      'password_require_lowercase', 'password_require_numbers', 
                      'password_require_symbols');
  
  -- Extract policy values with defaults
  min_length := COALESCE((policy_requirements->>'password_min_length')::integer, 8);
  require_uppercase := COALESCE((policy_requirements->>'password_require_uppercase')::boolean, false);
  require_lowercase := COALESCE((policy_requirements->>'password_require_lowercase')::boolean, true);
  require_numbers := COALESCE((policy_requirements->>'password_require_numbers')::boolean, true);
  require_symbols := COALESCE((policy_requirements->>'password_require_symbols')::boolean, false);
  
  -- Note: In a real implementation, you would need to validate against the actual password
  -- This is a placeholder that always returns true for demonstration
  -- Real implementation would require storing password metadata or using a secure validation service
  
  RETURN true; -- Placeholder - would implement actual password checking logic
END;
$function$
;

CREATE OR REPLACE FUNCTION public.cleanup_old_audit_logs(retention_days integer DEFAULT 365)
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  deleted_count integer;
BEGIN
  DELETE FROM public.audit_logs 
  WHERE created_at < (now() - (retention_days || ' days')::interval);
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.create_user_profile(user_email text, user_full_name text, user_role text)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  new_user_id UUID;
BEGIN
  -- Generate a new UUID for the user
  new_user_id := gen_random_uuid();
  
  -- Insert the new user into the profiles table
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (new_user_id, user_email, user_full_name, user_role::user_role);
  
  -- Return the new user's ID
  RETURN new_user_id;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.delete_test_data()
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
  -- Delete company relationships first (due to foreign key constraints)
  DELETE FROM public.company_relationships 
  WHERE person_id IN (SELECT id FROM public.people WHERE email LIKE 'test%@example.com')
  OR company_id IN (SELECT id FROM public.companies WHERE name LIKE 'TestCo%');
  
  -- Delete people
  DELETE FROM public.people WHERE email LIKE 'test%@example.com';
  
  -- Delete companies
  DELETE FROM public.companies WHERE name LIKE 'TestCo%';
END;
$function$
;

CREATE OR REPLACE FUNCTION public.find_entity_by_tr_id(p_tr_id text)
 RETURNS TABLE(entity_type text, entity_id uuid, entity_name text, tr_id text)
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  RETURN QUERY
  SELECT 'company'::text, c.id, c.name, c.tr_id
  FROM public.companies c
  WHERE c.tr_id = p_tr_id
  
  UNION ALL
  
  SELECT 'tenant'::text, t.id, t.name, t.tr_id
  FROM public.tenants t
  WHERE t.tr_id = p_tr_id
  
  UNION ALL
  
  SELECT 'user'::text, p.id, COALESCE(p.full_name, p.email), p.tr_id
  FROM public.profiles p
  WHERE p.tr_id = p_tr_id
  
  UNION ALL
  
  SELECT 'person'::text, pe.id, (pe.first_name || ' ' || pe.last_name), pe.tr_id
  FROM public.people pe
  WHERE pe.tr_id = p_tr_id;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.generate_tr_id(entity_prefix text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  next_id bigint;
  tr_id text;
BEGIN
  -- Get next sequence value
  SELECT nextval('public.tr_id_sequence') INTO next_id;
  
  -- Format as TR-{PREFIX}-{PADDED_NUMBER}
  tr_id := 'TR-' || entity_prefix || '-' || lpad(next_id::text, 8, '0');
  
  RETURN tr_id;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    new.id, 
    new.email, 
    COALESCE(new.raw_user_meta_data->>'full_name', new.email),
    'user'
  );
  RETURN new;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.is_super_admin(user_id uuid)
 RETURNS boolean
 LANGUAGE sql
 SECURITY DEFINER
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = user_id AND role = 'super_admin'
  );
$function$
;

CREATE OR REPLACE FUNCTION public.resolve_user_subscription(p_user_id uuid, p_tenant_id uuid)
 RETURNS TABLE(subscription_id uuid, plan_id uuid, status text, billing_cycle text, subscription_type text, starts_at timestamp with time zone, ends_at timestamp with time zone)
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  -- First, check for active user-specific subscription
  RETURN QUERY
  SELECT 
    us.id as subscription_id,
    us.plan_id,
    us.status,
    us.billing_cycle,
    'user'::text as subscription_type,
    us.starts_at,
    us.ends_at
  FROM public.user_subscriptions us
  WHERE us.user_id = p_user_id 
    AND us.tenant_id = p_tenant_id
    AND us.status = 'active'
    AND (us.ends_at IS NULL OR us.ends_at > now())
  LIMIT 1;

  -- If no user subscription found, fall back to tenant subscription
  IF NOT FOUND THEN
    RETURN QUERY
    SELECT 
      ts.id as subscription_id,
      ts.plan_id,
      ts.status,
      ts.billing_cycle,
      'tenant'::text as subscription_type,
      ts.starts_at,
      ts.ends_at
    FROM public.tenant_subscriptions ts
    WHERE ts.tenant_id = p_tenant_id
      AND ts.status = 'active'
      AND (ts.ends_at IS NULL OR ts.ends_at > now())
    LIMIT 1;
  END IF;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.rls_auto_enable()
 RETURNS event_trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'pg_catalog'
AS $function$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN
    SELECT *
    FROM pg_event_trigger_ddl_commands()
    WHERE command_tag IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
      AND object_type IN ('table','partitioned table')
  LOOP
     IF cmd.schema_name IS NOT NULL AND cmd.schema_name IN ('public') AND cmd.schema_name NOT IN ('pg_catalog','information_schema') AND cmd.schema_name NOT LIKE 'pg_toast%' AND cmd.schema_name NOT LIKE 'pg_temp%' THEN
      BEGIN
        EXECUTE format('alter table if exists %s enable row level security', cmd.object_identity);
        RAISE LOG 'rls_auto_enable: enabled RLS on %', cmd.object_identity;
      EXCEPTION
        WHEN OTHERS THEN
          RAISE LOG 'rls_auto_enable: failed to enable RLS on %', cmd.object_identity;
      END;
     ELSE
        RAISE LOG 'rls_auto_enable: skip % (either system schema or not in enforced list: %.)', cmd.object_identity, cmd.schema_name;
     END IF;
  END LOOP;
END;
$function$
;

create or replace view "public"."test_data_view" as  SELECT 'companies'::text AS table_name,
    count(*) AS record_count
   FROM public.companies
  WHERE (companies.name ~~ 'TestCo%'::text)
UNION ALL
 SELECT 'people (talent)'::text AS table_name,
    count(*) AS record_count
   FROM public.people
  WHERE (people.email ~~ 'testtalent%@example.com'::text)
UNION ALL
 SELECT 'people (contact)'::text AS table_name,
    count(*) AS record_count
   FROM public.people
  WHERE (people.email ~~ 'testcontact%@example.com'::text)
UNION ALL
 SELECT 'company_relationships'::text AS table_name,
    count(*) AS record_count
   FROM public.company_relationships
  WHERE ((company_relationships.company_id IN ( SELECT companies.id
           FROM public.companies
          WHERE (companies.name ~~ 'TestCo%'::text))) OR (company_relationships.person_id IN ( SELECT people.id
           FROM public.people
          WHERE (people.email ~~ 'test%@example.com'::text))));


CREATE OR REPLACE FUNCTION public.update_ai_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_dashboard_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_form_notifications_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_form_workflows_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_social_connections_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_tenant_module_assignments_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_tenant_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_timestamp()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.log_audit_event(p_user_id uuid, p_tenant_id uuid, p_action text, p_entity_type text, p_entity_id uuid DEFAULT NULL::uuid, p_old_values jsonb DEFAULT NULL::jsonb, p_new_values jsonb DEFAULT NULL::jsonb, p_ip_address inet DEFAULT NULL::inet, p_user_agent text DEFAULT NULL::text, p_session_id text DEFAULT NULL::text, p_severity text DEFAULT 'info'::text, p_module_name text DEFAULT NULL::text, p_additional_context jsonb DEFAULT '{}'::jsonb)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  audit_id uuid;
BEGIN
  INSERT INTO public.audit_logs (
    user_id, tenant_id, action, entity_type, entity_id,
    old_values, new_values, ip_address, user_agent,
    session_id, severity, module_name, additional_context
  ) VALUES (
    p_user_id, p_tenant_id, p_action, p_entity_type, p_entity_id,
    p_old_values, p_new_values, p_ip_address, p_user_agent,
    p_session_id, p_severity, p_module_name, p_additional_context
  ) RETURNING id INTO audit_id;
  
  RETURN audit_id;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$function$
;

grant delete on table "public"."ai_context_cache" to "anon";

grant insert on table "public"."ai_context_cache" to "anon";

grant references on table "public"."ai_context_cache" to "anon";

grant select on table "public"."ai_context_cache" to "anon";

grant trigger on table "public"."ai_context_cache" to "anon";

grant truncate on table "public"."ai_context_cache" to "anon";

grant update on table "public"."ai_context_cache" to "anon";

grant delete on table "public"."ai_context_cache" to "authenticated";

grant insert on table "public"."ai_context_cache" to "authenticated";

grant references on table "public"."ai_context_cache" to "authenticated";

grant select on table "public"."ai_context_cache" to "authenticated";

grant trigger on table "public"."ai_context_cache" to "authenticated";

grant truncate on table "public"."ai_context_cache" to "authenticated";

grant update on table "public"."ai_context_cache" to "authenticated";

grant delete on table "public"."ai_context_cache" to "service_role";

grant insert on table "public"."ai_context_cache" to "service_role";

grant references on table "public"."ai_context_cache" to "service_role";

grant select on table "public"."ai_context_cache" to "service_role";

grant trigger on table "public"."ai_context_cache" to "service_role";

grant truncate on table "public"."ai_context_cache" to "service_role";

grant update on table "public"."ai_context_cache" to "service_role";

grant delete on table "public"."ai_decisions" to "anon";

grant insert on table "public"."ai_decisions" to "anon";

grant references on table "public"."ai_decisions" to "anon";

grant select on table "public"."ai_decisions" to "anon";

grant trigger on table "public"."ai_decisions" to "anon";

grant truncate on table "public"."ai_decisions" to "anon";

grant update on table "public"."ai_decisions" to "anon";

grant delete on table "public"."ai_decisions" to "authenticated";

grant insert on table "public"."ai_decisions" to "authenticated";

grant references on table "public"."ai_decisions" to "authenticated";

grant select on table "public"."ai_decisions" to "authenticated";

grant trigger on table "public"."ai_decisions" to "authenticated";

grant truncate on table "public"."ai_decisions" to "authenticated";

grant update on table "public"."ai_decisions" to "authenticated";

grant delete on table "public"."ai_decisions" to "service_role";

grant insert on table "public"."ai_decisions" to "service_role";

grant references on table "public"."ai_decisions" to "service_role";

grant select on table "public"."ai_decisions" to "service_role";

grant trigger on table "public"."ai_decisions" to "service_role";

grant truncate on table "public"."ai_decisions" to "service_role";

grant update on table "public"."ai_decisions" to "service_role";

grant delete on table "public"."ai_insights" to "anon";

grant insert on table "public"."ai_insights" to "anon";

grant references on table "public"."ai_insights" to "anon";

grant select on table "public"."ai_insights" to "anon";

grant trigger on table "public"."ai_insights" to "anon";

grant truncate on table "public"."ai_insights" to "anon";

grant update on table "public"."ai_insights" to "anon";

grant delete on table "public"."ai_insights" to "authenticated";

grant insert on table "public"."ai_insights" to "authenticated";

grant references on table "public"."ai_insights" to "authenticated";

grant select on table "public"."ai_insights" to "authenticated";

grant trigger on table "public"."ai_insights" to "authenticated";

grant truncate on table "public"."ai_insights" to "authenticated";

grant update on table "public"."ai_insights" to "authenticated";

grant delete on table "public"."ai_insights" to "service_role";

grant insert on table "public"."ai_insights" to "service_role";

grant references on table "public"."ai_insights" to "service_role";

grant select on table "public"."ai_insights" to "service_role";

grant trigger on table "public"."ai_insights" to "service_role";

grant truncate on table "public"."ai_insights" to "service_role";

grant update on table "public"."ai_insights" to "service_role";

grant delete on table "public"."ai_learning_data" to "anon";

grant insert on table "public"."ai_learning_data" to "anon";

grant references on table "public"."ai_learning_data" to "anon";

grant select on table "public"."ai_learning_data" to "anon";

grant trigger on table "public"."ai_learning_data" to "anon";

grant truncate on table "public"."ai_learning_data" to "anon";

grant update on table "public"."ai_learning_data" to "anon";

grant delete on table "public"."ai_learning_data" to "authenticated";

grant insert on table "public"."ai_learning_data" to "authenticated";

grant references on table "public"."ai_learning_data" to "authenticated";

grant select on table "public"."ai_learning_data" to "authenticated";

grant trigger on table "public"."ai_learning_data" to "authenticated";

grant truncate on table "public"."ai_learning_data" to "authenticated";

grant update on table "public"."ai_learning_data" to "authenticated";

grant delete on table "public"."ai_learning_data" to "service_role";

grant insert on table "public"."ai_learning_data" to "service_role";

grant references on table "public"."ai_learning_data" to "service_role";

grant select on table "public"."ai_learning_data" to "service_role";

grant trigger on table "public"."ai_learning_data" to "service_role";

grant truncate on table "public"."ai_learning_data" to "service_role";

grant update on table "public"."ai_learning_data" to "service_role";

grant delete on table "public"."ai_models" to "anon";

grant insert on table "public"."ai_models" to "anon";

grant references on table "public"."ai_models" to "anon";

grant select on table "public"."ai_models" to "anon";

grant trigger on table "public"."ai_models" to "anon";

grant truncate on table "public"."ai_models" to "anon";

grant update on table "public"."ai_models" to "anon";

grant delete on table "public"."ai_models" to "authenticated";

grant insert on table "public"."ai_models" to "authenticated";

grant references on table "public"."ai_models" to "authenticated";

grant select on table "public"."ai_models" to "authenticated";

grant trigger on table "public"."ai_models" to "authenticated";

grant truncate on table "public"."ai_models" to "authenticated";

grant update on table "public"."ai_models" to "authenticated";

grant delete on table "public"."ai_models" to "service_role";

grant insert on table "public"."ai_models" to "service_role";

grant references on table "public"."ai_models" to "service_role";

grant select on table "public"."ai_models" to "service_role";

grant trigger on table "public"."ai_models" to "service_role";

grant truncate on table "public"."ai_models" to "service_role";

grant update on table "public"."ai_models" to "service_role";

grant delete on table "public"."ai_performance_metrics" to "anon";

grant insert on table "public"."ai_performance_metrics" to "anon";

grant references on table "public"."ai_performance_metrics" to "anon";

grant select on table "public"."ai_performance_metrics" to "anon";

grant trigger on table "public"."ai_performance_metrics" to "anon";

grant truncate on table "public"."ai_performance_metrics" to "anon";

grant update on table "public"."ai_performance_metrics" to "anon";

grant delete on table "public"."ai_performance_metrics" to "authenticated";

grant insert on table "public"."ai_performance_metrics" to "authenticated";

grant references on table "public"."ai_performance_metrics" to "authenticated";

grant select on table "public"."ai_performance_metrics" to "authenticated";

grant trigger on table "public"."ai_performance_metrics" to "authenticated";

grant truncate on table "public"."ai_performance_metrics" to "authenticated";

grant update on table "public"."ai_performance_metrics" to "authenticated";

grant delete on table "public"."ai_performance_metrics" to "service_role";

grant insert on table "public"."ai_performance_metrics" to "service_role";

grant references on table "public"."ai_performance_metrics" to "service_role";

grant select on table "public"."ai_performance_metrics" to "service_role";

grant trigger on table "public"."ai_performance_metrics" to "service_role";

grant truncate on table "public"."ai_performance_metrics" to "service_role";

grant update on table "public"."ai_performance_metrics" to "service_role";

grant delete on table "public"."ai_request_logs" to "anon";

grant insert on table "public"."ai_request_logs" to "anon";

grant references on table "public"."ai_request_logs" to "anon";

grant select on table "public"."ai_request_logs" to "anon";

grant trigger on table "public"."ai_request_logs" to "anon";

grant truncate on table "public"."ai_request_logs" to "anon";

grant update on table "public"."ai_request_logs" to "anon";

grant delete on table "public"."ai_request_logs" to "authenticated";

grant insert on table "public"."ai_request_logs" to "authenticated";

grant references on table "public"."ai_request_logs" to "authenticated";

grant select on table "public"."ai_request_logs" to "authenticated";

grant trigger on table "public"."ai_request_logs" to "authenticated";

grant truncate on table "public"."ai_request_logs" to "authenticated";

grant update on table "public"."ai_request_logs" to "authenticated";

grant delete on table "public"."ai_request_logs" to "service_role";

grant insert on table "public"."ai_request_logs" to "service_role";

grant references on table "public"."ai_request_logs" to "service_role";

grant select on table "public"."ai_request_logs" to "service_role";

grant trigger on table "public"."ai_request_logs" to "service_role";

grant truncate on table "public"."ai_request_logs" to "service_role";

grant update on table "public"."ai_request_logs" to "service_role";

grant delete on table "public"."behavioral_patterns" to "anon";

grant insert on table "public"."behavioral_patterns" to "anon";

grant references on table "public"."behavioral_patterns" to "anon";

grant select on table "public"."behavioral_patterns" to "anon";

grant trigger on table "public"."behavioral_patterns" to "anon";

grant truncate on table "public"."behavioral_patterns" to "anon";

grant update on table "public"."behavioral_patterns" to "anon";

grant delete on table "public"."behavioral_patterns" to "authenticated";

grant insert on table "public"."behavioral_patterns" to "authenticated";

grant references on table "public"."behavioral_patterns" to "authenticated";

grant select on table "public"."behavioral_patterns" to "authenticated";

grant trigger on table "public"."behavioral_patterns" to "authenticated";

grant truncate on table "public"."behavioral_patterns" to "authenticated";

grant update on table "public"."behavioral_patterns" to "authenticated";

grant delete on table "public"."behavioral_patterns" to "service_role";

grant insert on table "public"."behavioral_patterns" to "service_role";

grant references on table "public"."behavioral_patterns" to "service_role";

grant select on table "public"."behavioral_patterns" to "service_role";

grant trigger on table "public"."behavioral_patterns" to "service_role";

grant truncate on table "public"."behavioral_patterns" to "service_role";

grant update on table "public"."behavioral_patterns" to "service_role";

grant delete on table "public"."candidate_tags" to "anon";

grant insert on table "public"."candidate_tags" to "anon";

grant references on table "public"."candidate_tags" to "anon";

grant select on table "public"."candidate_tags" to "anon";

grant trigger on table "public"."candidate_tags" to "anon";

grant truncate on table "public"."candidate_tags" to "anon";

grant update on table "public"."candidate_tags" to "anon";

grant delete on table "public"."candidate_tags" to "authenticated";

grant insert on table "public"."candidate_tags" to "authenticated";

grant references on table "public"."candidate_tags" to "authenticated";

grant select on table "public"."candidate_tags" to "authenticated";

grant trigger on table "public"."candidate_tags" to "authenticated";

grant truncate on table "public"."candidate_tags" to "authenticated";

grant update on table "public"."candidate_tags" to "authenticated";

grant delete on table "public"."candidate_tags" to "service_role";

grant insert on table "public"."candidate_tags" to "service_role";

grant references on table "public"."candidate_tags" to "service_role";

grant select on table "public"."candidate_tags" to "service_role";

grant trigger on table "public"."candidate_tags" to "service_role";

grant truncate on table "public"."candidate_tags" to "service_role";

grant update on table "public"."candidate_tags" to "service_role";

grant delete on table "public"."candidates" to "anon";

grant insert on table "public"."candidates" to "anon";

grant references on table "public"."candidates" to "anon";

grant select on table "public"."candidates" to "anon";

grant trigger on table "public"."candidates" to "anon";

grant truncate on table "public"."candidates" to "anon";

grant update on table "public"."candidates" to "anon";

grant delete on table "public"."candidates" to "authenticated";

grant insert on table "public"."candidates" to "authenticated";

grant references on table "public"."candidates" to "authenticated";

grant select on table "public"."candidates" to "authenticated";

grant trigger on table "public"."candidates" to "authenticated";

grant truncate on table "public"."candidates" to "authenticated";

grant update on table "public"."candidates" to "authenticated";

grant delete on table "public"."candidates" to "service_role";

grant insert on table "public"."candidates" to "service_role";

grant references on table "public"."candidates" to "service_role";

grant select on table "public"."candidates" to "service_role";

grant trigger on table "public"."candidates" to "service_role";

grant truncate on table "public"."candidates" to "service_role";

grant update on table "public"."candidates" to "service_role";

grant delete on table "public"."custom_field_values" to "anon";

grant insert on table "public"."custom_field_values" to "anon";

grant references on table "public"."custom_field_values" to "anon";

grant select on table "public"."custom_field_values" to "anon";

grant trigger on table "public"."custom_field_values" to "anon";

grant truncate on table "public"."custom_field_values" to "anon";

grant update on table "public"."custom_field_values" to "anon";

grant delete on table "public"."custom_field_values" to "authenticated";

grant insert on table "public"."custom_field_values" to "authenticated";

grant references on table "public"."custom_field_values" to "authenticated";

grant select on table "public"."custom_field_values" to "authenticated";

grant trigger on table "public"."custom_field_values" to "authenticated";

grant truncate on table "public"."custom_field_values" to "authenticated";

grant update on table "public"."custom_field_values" to "authenticated";

grant delete on table "public"."custom_field_values" to "service_role";

grant insert on table "public"."custom_field_values" to "service_role";

grant references on table "public"."custom_field_values" to "service_role";

grant select on table "public"."custom_field_values" to "service_role";

grant trigger on table "public"."custom_field_values" to "service_role";

grant truncate on table "public"."custom_field_values" to "service_role";

grant update on table "public"."custom_field_values" to "service_role";

grant delete on table "public"."custom_fields" to "anon";

grant insert on table "public"."custom_fields" to "anon";

grant references on table "public"."custom_fields" to "anon";

grant select on table "public"."custom_fields" to "anon";

grant trigger on table "public"."custom_fields" to "anon";

grant truncate on table "public"."custom_fields" to "anon";

grant update on table "public"."custom_fields" to "anon";

grant delete on table "public"."custom_fields" to "authenticated";

grant insert on table "public"."custom_fields" to "authenticated";

grant references on table "public"."custom_fields" to "authenticated";

grant select on table "public"."custom_fields" to "authenticated";

grant trigger on table "public"."custom_fields" to "authenticated";

grant truncate on table "public"."custom_fields" to "authenticated";

grant update on table "public"."custom_fields" to "authenticated";

grant delete on table "public"."custom_fields" to "service_role";

grant insert on table "public"."custom_fields" to "service_role";

grant references on table "public"."custom_fields" to "service_role";

grant select on table "public"."custom_fields" to "service_role";

grant trigger on table "public"."custom_fields" to "service_role";

grant truncate on table "public"."custom_fields" to "service_role";

grant update on table "public"."custom_fields" to "service_role";

grant delete on table "public"."dashboard_layouts" to "anon";

grant insert on table "public"."dashboard_layouts" to "anon";

grant references on table "public"."dashboard_layouts" to "anon";

grant select on table "public"."dashboard_layouts" to "anon";

grant trigger on table "public"."dashboard_layouts" to "anon";

grant truncate on table "public"."dashboard_layouts" to "anon";

grant update on table "public"."dashboard_layouts" to "anon";

grant delete on table "public"."dashboard_layouts" to "authenticated";

grant insert on table "public"."dashboard_layouts" to "authenticated";

grant references on table "public"."dashboard_layouts" to "authenticated";

grant select on table "public"."dashboard_layouts" to "authenticated";

grant trigger on table "public"."dashboard_layouts" to "authenticated";

grant truncate on table "public"."dashboard_layouts" to "authenticated";

grant update on table "public"."dashboard_layouts" to "authenticated";

grant delete on table "public"."dashboard_layouts" to "service_role";

grant insert on table "public"."dashboard_layouts" to "service_role";

grant references on table "public"."dashboard_layouts" to "service_role";

grant select on table "public"."dashboard_layouts" to "service_role";

grant trigger on table "public"."dashboard_layouts" to "service_role";

grant truncate on table "public"."dashboard_layouts" to "service_role";

grant update on table "public"."dashboard_layouts" to "service_role";

grant delete on table "public"."dashboard_templates" to "anon";

grant insert on table "public"."dashboard_templates" to "anon";

grant references on table "public"."dashboard_templates" to "anon";

grant select on table "public"."dashboard_templates" to "anon";

grant trigger on table "public"."dashboard_templates" to "anon";

grant truncate on table "public"."dashboard_templates" to "anon";

grant update on table "public"."dashboard_templates" to "anon";

grant delete on table "public"."dashboard_templates" to "authenticated";

grant insert on table "public"."dashboard_templates" to "authenticated";

grant references on table "public"."dashboard_templates" to "authenticated";

grant select on table "public"."dashboard_templates" to "authenticated";

grant trigger on table "public"."dashboard_templates" to "authenticated";

grant truncate on table "public"."dashboard_templates" to "authenticated";

grant update on table "public"."dashboard_templates" to "authenticated";

grant delete on table "public"."dashboard_templates" to "service_role";

grant insert on table "public"."dashboard_templates" to "service_role";

grant references on table "public"."dashboard_templates" to "service_role";

grant select on table "public"."dashboard_templates" to "service_role";

grant trigger on table "public"."dashboard_templates" to "service_role";

grant truncate on table "public"."dashboard_templates" to "service_role";

grant update on table "public"."dashboard_templates" to "service_role";

grant delete on table "public"."dashboard_widgets" to "anon";

grant insert on table "public"."dashboard_widgets" to "anon";

grant references on table "public"."dashboard_widgets" to "anon";

grant select on table "public"."dashboard_widgets" to "anon";

grant trigger on table "public"."dashboard_widgets" to "anon";

grant truncate on table "public"."dashboard_widgets" to "anon";

grant update on table "public"."dashboard_widgets" to "anon";

grant delete on table "public"."dashboard_widgets" to "authenticated";

grant insert on table "public"."dashboard_widgets" to "authenticated";

grant references on table "public"."dashboard_widgets" to "authenticated";

grant select on table "public"."dashboard_widgets" to "authenticated";

grant trigger on table "public"."dashboard_widgets" to "authenticated";

grant truncate on table "public"."dashboard_widgets" to "authenticated";

grant update on table "public"."dashboard_widgets" to "authenticated";

grant delete on table "public"."dashboard_widgets" to "service_role";

grant insert on table "public"."dashboard_widgets" to "service_role";

grant references on table "public"."dashboard_widgets" to "service_role";

grant select on table "public"."dashboard_widgets" to "service_role";

grant trigger on table "public"."dashboard_widgets" to "service_role";

grant truncate on table "public"."dashboard_widgets" to "service_role";

grant update on table "public"."dashboard_widgets" to "service_role";

grant delete on table "public"."feature_events" to "anon";

grant insert on table "public"."feature_events" to "anon";

grant references on table "public"."feature_events" to "anon";

grant select on table "public"."feature_events" to "anon";

grant trigger on table "public"."feature_events" to "anon";

grant truncate on table "public"."feature_events" to "anon";

grant update on table "public"."feature_events" to "anon";

grant delete on table "public"."feature_events" to "authenticated";

grant insert on table "public"."feature_events" to "authenticated";

grant references on table "public"."feature_events" to "authenticated";

grant select on table "public"."feature_events" to "authenticated";

grant trigger on table "public"."feature_events" to "authenticated";

grant truncate on table "public"."feature_events" to "authenticated";

grant update on table "public"."feature_events" to "authenticated";

grant delete on table "public"."feature_events" to "service_role";

grant insert on table "public"."feature_events" to "service_role";

grant references on table "public"."feature_events" to "service_role";

grant select on table "public"."feature_events" to "service_role";

grant trigger on table "public"."feature_events" to "service_role";

grant truncate on table "public"."feature_events" to "service_role";

grant update on table "public"."feature_events" to "service_role";

grant delete on table "public"."feature_interfaces" to "anon";

grant insert on table "public"."feature_interfaces" to "anon";

grant references on table "public"."feature_interfaces" to "anon";

grant select on table "public"."feature_interfaces" to "anon";

grant trigger on table "public"."feature_interfaces" to "anon";

grant truncate on table "public"."feature_interfaces" to "anon";

grant update on table "public"."feature_interfaces" to "anon";

grant delete on table "public"."feature_interfaces" to "authenticated";

grant insert on table "public"."feature_interfaces" to "authenticated";

grant references on table "public"."feature_interfaces" to "authenticated";

grant select on table "public"."feature_interfaces" to "authenticated";

grant trigger on table "public"."feature_interfaces" to "authenticated";

grant truncate on table "public"."feature_interfaces" to "authenticated";

grant update on table "public"."feature_interfaces" to "authenticated";

grant delete on table "public"."feature_interfaces" to "service_role";

grant insert on table "public"."feature_interfaces" to "service_role";

grant references on table "public"."feature_interfaces" to "service_role";

grant select on table "public"."feature_interfaces" to "service_role";

grant trigger on table "public"."feature_interfaces" to "service_role";

grant truncate on table "public"."feature_interfaces" to "service_role";

grant update on table "public"."feature_interfaces" to "service_role";

grant delete on table "public"."form_deployment_points" to "anon";

grant insert on table "public"."form_deployment_points" to "anon";

grant references on table "public"."form_deployment_points" to "anon";

grant select on table "public"."form_deployment_points" to "anon";

grant trigger on table "public"."form_deployment_points" to "anon";

grant truncate on table "public"."form_deployment_points" to "anon";

grant update on table "public"."form_deployment_points" to "anon";

grant delete on table "public"."form_deployment_points" to "authenticated";

grant insert on table "public"."form_deployment_points" to "authenticated";

grant references on table "public"."form_deployment_points" to "authenticated";

grant select on table "public"."form_deployment_points" to "authenticated";

grant trigger on table "public"."form_deployment_points" to "authenticated";

grant truncate on table "public"."form_deployment_points" to "authenticated";

grant update on table "public"."form_deployment_points" to "authenticated";

grant delete on table "public"."form_deployment_points" to "service_role";

grant insert on table "public"."form_deployment_points" to "service_role";

grant references on table "public"."form_deployment_points" to "service_role";

grant select on table "public"."form_deployment_points" to "service_role";

grant trigger on table "public"."form_deployment_points" to "service_role";

grant truncate on table "public"."form_deployment_points" to "service_role";

grant update on table "public"."form_deployment_points" to "service_role";

grant delete on table "public"."form_module_assignments" to "anon";

grant insert on table "public"."form_module_assignments" to "anon";

grant references on table "public"."form_module_assignments" to "anon";

grant select on table "public"."form_module_assignments" to "anon";

grant trigger on table "public"."form_module_assignments" to "anon";

grant truncate on table "public"."form_module_assignments" to "anon";

grant update on table "public"."form_module_assignments" to "anon";

grant delete on table "public"."form_module_assignments" to "authenticated";

grant insert on table "public"."form_module_assignments" to "authenticated";

grant references on table "public"."form_module_assignments" to "authenticated";

grant select on table "public"."form_module_assignments" to "authenticated";

grant trigger on table "public"."form_module_assignments" to "authenticated";

grant truncate on table "public"."form_module_assignments" to "authenticated";

grant update on table "public"."form_module_assignments" to "authenticated";

grant delete on table "public"."form_module_assignments" to "service_role";

grant insert on table "public"."form_module_assignments" to "service_role";

grant references on table "public"."form_module_assignments" to "service_role";

grant select on table "public"."form_module_assignments" to "service_role";

grant trigger on table "public"."form_module_assignments" to "service_role";

grant truncate on table "public"."form_module_assignments" to "service_role";

grant update on table "public"."form_module_assignments" to "service_role";

grant delete on table "public"."form_notifications" to "anon";

grant insert on table "public"."form_notifications" to "anon";

grant references on table "public"."form_notifications" to "anon";

grant select on table "public"."form_notifications" to "anon";

grant trigger on table "public"."form_notifications" to "anon";

grant truncate on table "public"."form_notifications" to "anon";

grant update on table "public"."form_notifications" to "anon";

grant delete on table "public"."form_notifications" to "authenticated";

grant insert on table "public"."form_notifications" to "authenticated";

grant references on table "public"."form_notifications" to "authenticated";

grant select on table "public"."form_notifications" to "authenticated";

grant trigger on table "public"."form_notifications" to "authenticated";

grant truncate on table "public"."form_notifications" to "authenticated";

grant update on table "public"."form_notifications" to "authenticated";

grant delete on table "public"."form_notifications" to "service_role";

grant insert on table "public"."form_notifications" to "service_role";

grant references on table "public"."form_notifications" to "service_role";

grant select on table "public"."form_notifications" to "service_role";

grant trigger on table "public"."form_notifications" to "service_role";

grant truncate on table "public"."form_notifications" to "service_role";

grant update on table "public"."form_notifications" to "service_role";

grant delete on table "public"."form_placements" to "anon";

grant insert on table "public"."form_placements" to "anon";

grant references on table "public"."form_placements" to "anon";

grant select on table "public"."form_placements" to "anon";

grant trigger on table "public"."form_placements" to "anon";

grant truncate on table "public"."form_placements" to "anon";

grant update on table "public"."form_placements" to "anon";

grant delete on table "public"."form_placements" to "authenticated";

grant insert on table "public"."form_placements" to "authenticated";

grant references on table "public"."form_placements" to "authenticated";

grant select on table "public"."form_placements" to "authenticated";

grant trigger on table "public"."form_placements" to "authenticated";

grant truncate on table "public"."form_placements" to "authenticated";

grant update on table "public"."form_placements" to "authenticated";

grant delete on table "public"."form_placements" to "service_role";

grant insert on table "public"."form_placements" to "service_role";

grant references on table "public"."form_placements" to "service_role";

grant select on table "public"."form_placements" to "service_role";

grant trigger on table "public"."form_placements" to "service_role";

grant truncate on table "public"."form_placements" to "service_role";

grant update on table "public"."form_placements" to "service_role";

grant delete on table "public"."form_response_analytics" to "anon";

grant insert on table "public"."form_response_analytics" to "anon";

grant references on table "public"."form_response_analytics" to "anon";

grant select on table "public"."form_response_analytics" to "anon";

grant trigger on table "public"."form_response_analytics" to "anon";

grant truncate on table "public"."form_response_analytics" to "anon";

grant update on table "public"."form_response_analytics" to "anon";

grant delete on table "public"."form_response_analytics" to "authenticated";

grant insert on table "public"."form_response_analytics" to "authenticated";

grant references on table "public"."form_response_analytics" to "authenticated";

grant select on table "public"."form_response_analytics" to "authenticated";

grant trigger on table "public"."form_response_analytics" to "authenticated";

grant truncate on table "public"."form_response_analytics" to "authenticated";

grant update on table "public"."form_response_analytics" to "authenticated";

grant delete on table "public"."form_response_analytics" to "service_role";

grant insert on table "public"."form_response_analytics" to "service_role";

grant references on table "public"."form_response_analytics" to "service_role";

grant select on table "public"."form_response_analytics" to "service_role";

grant trigger on table "public"."form_response_analytics" to "service_role";

grant truncate on table "public"."form_response_analytics" to "service_role";

grant update on table "public"."form_response_analytics" to "service_role";

grant delete on table "public"."form_responses" to "anon";

grant insert on table "public"."form_responses" to "anon";

grant references on table "public"."form_responses" to "anon";

grant select on table "public"."form_responses" to "anon";

grant trigger on table "public"."form_responses" to "anon";

grant truncate on table "public"."form_responses" to "anon";

grant update on table "public"."form_responses" to "anon";

grant delete on table "public"."form_responses" to "authenticated";

grant insert on table "public"."form_responses" to "authenticated";

grant references on table "public"."form_responses" to "authenticated";

grant select on table "public"."form_responses" to "authenticated";

grant trigger on table "public"."form_responses" to "authenticated";

grant truncate on table "public"."form_responses" to "authenticated";

grant update on table "public"."form_responses" to "authenticated";

grant delete on table "public"."form_responses" to "service_role";

grant insert on table "public"."form_responses" to "service_role";

grant references on table "public"."form_responses" to "service_role";

grant select on table "public"."form_responses" to "service_role";

grant trigger on table "public"."form_responses" to "service_role";

grant truncate on table "public"."form_responses" to "service_role";

grant update on table "public"."form_responses" to "service_role";

grant delete on table "public"."form_sections" to "anon";

grant insert on table "public"."form_sections" to "anon";

grant references on table "public"."form_sections" to "anon";

grant select on table "public"."form_sections" to "anon";

grant trigger on table "public"."form_sections" to "anon";

grant truncate on table "public"."form_sections" to "anon";

grant update on table "public"."form_sections" to "anon";

grant delete on table "public"."form_sections" to "authenticated";

grant insert on table "public"."form_sections" to "authenticated";

grant references on table "public"."form_sections" to "authenticated";

grant select on table "public"."form_sections" to "authenticated";

grant trigger on table "public"."form_sections" to "authenticated";

grant truncate on table "public"."form_sections" to "authenticated";

grant update on table "public"."form_sections" to "authenticated";

grant delete on table "public"."form_sections" to "service_role";

grant insert on table "public"."form_sections" to "service_role";

grant references on table "public"."form_sections" to "service_role";

grant select on table "public"."form_sections" to "service_role";

grant trigger on table "public"."form_sections" to "service_role";

grant truncate on table "public"."form_sections" to "service_role";

grant update on table "public"."form_sections" to "service_role";

grant delete on table "public"."form_submissions" to "anon";

grant insert on table "public"."form_submissions" to "anon";

grant references on table "public"."form_submissions" to "anon";

grant select on table "public"."form_submissions" to "anon";

grant trigger on table "public"."form_submissions" to "anon";

grant truncate on table "public"."form_submissions" to "anon";

grant update on table "public"."form_submissions" to "anon";

grant delete on table "public"."form_submissions" to "authenticated";

grant insert on table "public"."form_submissions" to "authenticated";

grant references on table "public"."form_submissions" to "authenticated";

grant select on table "public"."form_submissions" to "authenticated";

grant trigger on table "public"."form_submissions" to "authenticated";

grant truncate on table "public"."form_submissions" to "authenticated";

grant update on table "public"."form_submissions" to "authenticated";

grant delete on table "public"."form_submissions" to "service_role";

grant insert on table "public"."form_submissions" to "service_role";

grant references on table "public"."form_submissions" to "service_role";

grant select on table "public"."form_submissions" to "service_role";

grant trigger on table "public"."form_submissions" to "service_role";

grant truncate on table "public"."form_submissions" to "service_role";

grant update on table "public"."form_submissions" to "service_role";

grant delete on table "public"."form_triggers" to "anon";

grant insert on table "public"."form_triggers" to "anon";

grant references on table "public"."form_triggers" to "anon";

grant select on table "public"."form_triggers" to "anon";

grant trigger on table "public"."form_triggers" to "anon";

grant truncate on table "public"."form_triggers" to "anon";

grant update on table "public"."form_triggers" to "anon";

grant delete on table "public"."form_triggers" to "authenticated";

grant insert on table "public"."form_triggers" to "authenticated";

grant references on table "public"."form_triggers" to "authenticated";

grant select on table "public"."form_triggers" to "authenticated";

grant trigger on table "public"."form_triggers" to "authenticated";

grant truncate on table "public"."form_triggers" to "authenticated";

grant update on table "public"."form_triggers" to "authenticated";

grant delete on table "public"."form_triggers" to "service_role";

grant insert on table "public"."form_triggers" to "service_role";

grant references on table "public"."form_triggers" to "service_role";

grant select on table "public"."form_triggers" to "service_role";

grant trigger on table "public"."form_triggers" to "service_role";

grant truncate on table "public"."form_triggers" to "service_role";

grant update on table "public"."form_triggers" to "service_role";

grant delete on table "public"."form_workflows" to "anon";

grant insert on table "public"."form_workflows" to "anon";

grant references on table "public"."form_workflows" to "anon";

grant select on table "public"."form_workflows" to "anon";

grant trigger on table "public"."form_workflows" to "anon";

grant truncate on table "public"."form_workflows" to "anon";

grant update on table "public"."form_workflows" to "anon";

grant delete on table "public"."form_workflows" to "authenticated";

grant insert on table "public"."form_workflows" to "authenticated";

grant references on table "public"."form_workflows" to "authenticated";

grant select on table "public"."form_workflows" to "authenticated";

grant trigger on table "public"."form_workflows" to "authenticated";

grant truncate on table "public"."form_workflows" to "authenticated";

grant update on table "public"."form_workflows" to "authenticated";

grant delete on table "public"."form_workflows" to "service_role";

grant insert on table "public"."form_workflows" to "service_role";

grant references on table "public"."form_workflows" to "service_role";

grant select on table "public"."form_workflows" to "service_role";

grant trigger on table "public"."form_workflows" to "service_role";

grant truncate on table "public"."form_workflows" to "service_role";

grant update on table "public"."form_workflows" to "service_role";

grant delete on table "public"."global_email_templates" to "anon";

grant insert on table "public"."global_email_templates" to "anon";

grant references on table "public"."global_email_templates" to "anon";

grant select on table "public"."global_email_templates" to "anon";

grant trigger on table "public"."global_email_templates" to "anon";

grant truncate on table "public"."global_email_templates" to "anon";

grant update on table "public"."global_email_templates" to "anon";

grant delete on table "public"."global_email_templates" to "authenticated";

grant insert on table "public"."global_email_templates" to "authenticated";

grant references on table "public"."global_email_templates" to "authenticated";

grant select on table "public"."global_email_templates" to "authenticated";

grant trigger on table "public"."global_email_templates" to "authenticated";

grant truncate on table "public"."global_email_templates" to "authenticated";

grant update on table "public"."global_email_templates" to "authenticated";

grant delete on table "public"."global_email_templates" to "service_role";

grant insert on table "public"."global_email_templates" to "service_role";

grant references on table "public"."global_email_templates" to "service_role";

grant select on table "public"."global_email_templates" to "service_role";

grant trigger on table "public"."global_email_templates" to "service_role";

grant truncate on table "public"."global_email_templates" to "service_role";

grant update on table "public"."global_email_templates" to "service_role";

grant delete on table "public"."global_settings" to "anon";

grant insert on table "public"."global_settings" to "anon";

grant references on table "public"."global_settings" to "anon";

grant select on table "public"."global_settings" to "anon";

grant trigger on table "public"."global_settings" to "anon";

grant truncate on table "public"."global_settings" to "anon";

grant update on table "public"."global_settings" to "anon";

grant delete on table "public"."global_settings" to "authenticated";

grant insert on table "public"."global_settings" to "authenticated";

grant references on table "public"."global_settings" to "authenticated";

grant select on table "public"."global_settings" to "authenticated";

grant trigger on table "public"."global_settings" to "authenticated";

grant truncate on table "public"."global_settings" to "authenticated";

grant update on table "public"."global_settings" to "authenticated";

grant delete on table "public"."global_settings" to "service_role";

grant insert on table "public"."global_settings" to "service_role";

grant references on table "public"."global_settings" to "service_role";

grant select on table "public"."global_settings" to "service_role";

grant trigger on table "public"."global_settings" to "service_role";

grant truncate on table "public"."global_settings" to "service_role";

grant update on table "public"."global_settings" to "service_role";

grant delete on table "public"."interviews" to "anon";

grant insert on table "public"."interviews" to "anon";

grant references on table "public"."interviews" to "anon";

grant select on table "public"."interviews" to "anon";

grant trigger on table "public"."interviews" to "anon";

grant truncate on table "public"."interviews" to "anon";

grant update on table "public"."interviews" to "anon";

grant delete on table "public"."interviews" to "authenticated";

grant insert on table "public"."interviews" to "authenticated";

grant references on table "public"."interviews" to "authenticated";

grant select on table "public"."interviews" to "authenticated";

grant trigger on table "public"."interviews" to "authenticated";

grant truncate on table "public"."interviews" to "authenticated";

grant update on table "public"."interviews" to "authenticated";

grant delete on table "public"."interviews" to "service_role";

grant insert on table "public"."interviews" to "service_role";

grant references on table "public"."interviews" to "service_role";

grant select on table "public"."interviews" to "service_role";

grant trigger on table "public"."interviews" to "service_role";

grant truncate on table "public"."interviews" to "service_role";

grant update on table "public"."interviews" to "service_role";

grant delete on table "public"."jobs" to "anon";

grant insert on table "public"."jobs" to "anon";

grant references on table "public"."jobs" to "anon";

grant select on table "public"."jobs" to "anon";

grant trigger on table "public"."jobs" to "anon";

grant truncate on table "public"."jobs" to "anon";

grant update on table "public"."jobs" to "anon";

grant delete on table "public"."jobs" to "authenticated";

grant insert on table "public"."jobs" to "authenticated";

grant references on table "public"."jobs" to "authenticated";

grant select on table "public"."jobs" to "authenticated";

grant trigger on table "public"."jobs" to "authenticated";

grant truncate on table "public"."jobs" to "authenticated";

grant update on table "public"."jobs" to "authenticated";

grant delete on table "public"."jobs" to "service_role";

grant insert on table "public"."jobs" to "service_role";

grant references on table "public"."jobs" to "service_role";

grant select on table "public"."jobs" to "service_role";

grant trigger on table "public"."jobs" to "service_role";

grant truncate on table "public"."jobs" to "service_role";

grant update on table "public"."jobs" to "service_role";

grant delete on table "public"."linkedin_profile_enrichments" to "anon";

grant insert on table "public"."linkedin_profile_enrichments" to "anon";

grant references on table "public"."linkedin_profile_enrichments" to "anon";

grant select on table "public"."linkedin_profile_enrichments" to "anon";

grant trigger on table "public"."linkedin_profile_enrichments" to "anon";

grant truncate on table "public"."linkedin_profile_enrichments" to "anon";

grant update on table "public"."linkedin_profile_enrichments" to "anon";

grant delete on table "public"."linkedin_profile_enrichments" to "authenticated";

grant insert on table "public"."linkedin_profile_enrichments" to "authenticated";

grant references on table "public"."linkedin_profile_enrichments" to "authenticated";

grant select on table "public"."linkedin_profile_enrichments" to "authenticated";

grant trigger on table "public"."linkedin_profile_enrichments" to "authenticated";

grant truncate on table "public"."linkedin_profile_enrichments" to "authenticated";

grant update on table "public"."linkedin_profile_enrichments" to "authenticated";

grant delete on table "public"."linkedin_profile_enrichments" to "service_role";

grant insert on table "public"."linkedin_profile_enrichments" to "service_role";

grant references on table "public"."linkedin_profile_enrichments" to "service_role";

grant select on table "public"."linkedin_profile_enrichments" to "service_role";

grant trigger on table "public"."linkedin_profile_enrichments" to "service_role";

grant truncate on table "public"."linkedin_profile_enrichments" to "service_role";

grant update on table "public"."linkedin_profile_enrichments" to "service_role";

grant delete on table "public"."module_usage_tracking" to "anon";

grant insert on table "public"."module_usage_tracking" to "anon";

grant references on table "public"."module_usage_tracking" to "anon";

grant select on table "public"."module_usage_tracking" to "anon";

grant trigger on table "public"."module_usage_tracking" to "anon";

grant truncate on table "public"."module_usage_tracking" to "anon";

grant update on table "public"."module_usage_tracking" to "anon";

grant delete on table "public"."module_usage_tracking" to "authenticated";

grant insert on table "public"."module_usage_tracking" to "authenticated";

grant references on table "public"."module_usage_tracking" to "authenticated";

grant select on table "public"."module_usage_tracking" to "authenticated";

grant trigger on table "public"."module_usage_tracking" to "authenticated";

grant truncate on table "public"."module_usage_tracking" to "authenticated";

grant update on table "public"."module_usage_tracking" to "authenticated";

grant delete on table "public"."module_usage_tracking" to "service_role";

grant insert on table "public"."module_usage_tracking" to "service_role";

grant references on table "public"."module_usage_tracking" to "service_role";

grant select on table "public"."module_usage_tracking" to "service_role";

grant trigger on table "public"."module_usage_tracking" to "service_role";

grant truncate on table "public"."module_usage_tracking" to "service_role";

grant update on table "public"."module_usage_tracking" to "service_role";

grant delete on table "public"."password_policy_enforcement" to "anon";

grant insert on table "public"."password_policy_enforcement" to "anon";

grant references on table "public"."password_policy_enforcement" to "anon";

grant select on table "public"."password_policy_enforcement" to "anon";

grant trigger on table "public"."password_policy_enforcement" to "anon";

grant truncate on table "public"."password_policy_enforcement" to "anon";

grant update on table "public"."password_policy_enforcement" to "anon";

grant delete on table "public"."password_policy_enforcement" to "authenticated";

grant insert on table "public"."password_policy_enforcement" to "authenticated";

grant references on table "public"."password_policy_enforcement" to "authenticated";

grant select on table "public"."password_policy_enforcement" to "authenticated";

grant trigger on table "public"."password_policy_enforcement" to "authenticated";

grant truncate on table "public"."password_policy_enforcement" to "authenticated";

grant update on table "public"."password_policy_enforcement" to "authenticated";

grant delete on table "public"."password_policy_enforcement" to "service_role";

grant insert on table "public"."password_policy_enforcement" to "service_role";

grant references on table "public"."password_policy_enforcement" to "service_role";

grant select on table "public"."password_policy_enforcement" to "service_role";

grant trigger on table "public"."password_policy_enforcement" to "service_role";

grant truncate on table "public"."password_policy_enforcement" to "service_role";

grant update on table "public"."password_policy_enforcement" to "service_role";

grant delete on table "public"."skills" to "anon";

grant insert on table "public"."skills" to "anon";

grant references on table "public"."skills" to "anon";

grant select on table "public"."skills" to "anon";

grant trigger on table "public"."skills" to "anon";

grant truncate on table "public"."skills" to "anon";

grant update on table "public"."skills" to "anon";

grant delete on table "public"."skills" to "authenticated";

grant insert on table "public"."skills" to "authenticated";

grant references on table "public"."skills" to "authenticated";

grant select on table "public"."skills" to "authenticated";

grant trigger on table "public"."skills" to "authenticated";

grant truncate on table "public"."skills" to "authenticated";

grant update on table "public"."skills" to "authenticated";

grant delete on table "public"."skills" to "service_role";

grant insert on table "public"."skills" to "service_role";

grant references on table "public"."skills" to "service_role";

grant select on table "public"."skills" to "service_role";

grant trigger on table "public"."skills" to "service_role";

grant truncate on table "public"."skills" to "service_role";

grant update on table "public"."skills" to "service_role";

grant delete on table "public"."system_health_metrics" to "anon";

grant insert on table "public"."system_health_metrics" to "anon";

grant references on table "public"."system_health_metrics" to "anon";

grant select on table "public"."system_health_metrics" to "anon";

grant trigger on table "public"."system_health_metrics" to "anon";

grant truncate on table "public"."system_health_metrics" to "anon";

grant update on table "public"."system_health_metrics" to "anon";

grant delete on table "public"."system_health_metrics" to "authenticated";

grant insert on table "public"."system_health_metrics" to "authenticated";

grant references on table "public"."system_health_metrics" to "authenticated";

grant select on table "public"."system_health_metrics" to "authenticated";

grant trigger on table "public"."system_health_metrics" to "authenticated";

grant truncate on table "public"."system_health_metrics" to "authenticated";

grant update on table "public"."system_health_metrics" to "authenticated";

grant delete on table "public"."system_health_metrics" to "service_role";

grant insert on table "public"."system_health_metrics" to "service_role";

grant references on table "public"."system_health_metrics" to "service_role";

grant select on table "public"."system_health_metrics" to "service_role";

grant trigger on table "public"."system_health_metrics" to "service_role";

grant truncate on table "public"."system_health_metrics" to "service_role";

grant update on table "public"."system_health_metrics" to "service_role";

grant delete on table "public"."system_maintenance" to "anon";

grant insert on table "public"."system_maintenance" to "anon";

grant references on table "public"."system_maintenance" to "anon";

grant select on table "public"."system_maintenance" to "anon";

grant trigger on table "public"."system_maintenance" to "anon";

grant truncate on table "public"."system_maintenance" to "anon";

grant update on table "public"."system_maintenance" to "anon";

grant delete on table "public"."system_maintenance" to "authenticated";

grant insert on table "public"."system_maintenance" to "authenticated";

grant references on table "public"."system_maintenance" to "authenticated";

grant select on table "public"."system_maintenance" to "authenticated";

grant trigger on table "public"."system_maintenance" to "authenticated";

grant truncate on table "public"."system_maintenance" to "authenticated";

grant update on table "public"."system_maintenance" to "authenticated";

grant delete on table "public"."system_maintenance" to "service_role";

grant insert on table "public"."system_maintenance" to "service_role";

grant references on table "public"."system_maintenance" to "service_role";

grant select on table "public"."system_maintenance" to "service_role";

grant trigger on table "public"."system_maintenance" to "service_role";

grant truncate on table "public"."system_maintenance" to "service_role";

grant update on table "public"."system_maintenance" to "service_role";

grant delete on table "public"."system_notifications" to "anon";

grant insert on table "public"."system_notifications" to "anon";

grant references on table "public"."system_notifications" to "anon";

grant select on table "public"."system_notifications" to "anon";

grant trigger on table "public"."system_notifications" to "anon";

grant truncate on table "public"."system_notifications" to "anon";

grant update on table "public"."system_notifications" to "anon";

grant delete on table "public"."system_notifications" to "authenticated";

grant insert on table "public"."system_notifications" to "authenticated";

grant references on table "public"."system_notifications" to "authenticated";

grant select on table "public"."system_notifications" to "authenticated";

grant trigger on table "public"."system_notifications" to "authenticated";

grant truncate on table "public"."system_notifications" to "authenticated";

grant update on table "public"."system_notifications" to "authenticated";

grant delete on table "public"."system_notifications" to "service_role";

grant insert on table "public"."system_notifications" to "service_role";

grant references on table "public"."system_notifications" to "service_role";

grant select on table "public"."system_notifications" to "service_role";

grant trigger on table "public"."system_notifications" to "service_role";

grant truncate on table "public"."system_notifications" to "service_role";

grant update on table "public"."system_notifications" to "service_role";

grant delete on table "public"."talent_skills" to "anon";

grant insert on table "public"."talent_skills" to "anon";

grant references on table "public"."talent_skills" to "anon";

grant select on table "public"."talent_skills" to "anon";

grant trigger on table "public"."talent_skills" to "anon";

grant truncate on table "public"."talent_skills" to "anon";

grant update on table "public"."talent_skills" to "anon";

grant delete on table "public"."talent_skills" to "authenticated";

grant insert on table "public"."talent_skills" to "authenticated";

grant references on table "public"."talent_skills" to "authenticated";

grant select on table "public"."talent_skills" to "authenticated";

grant trigger on table "public"."talent_skills" to "authenticated";

grant truncate on table "public"."talent_skills" to "authenticated";

grant update on table "public"."talent_skills" to "authenticated";

grant delete on table "public"."talent_skills" to "service_role";

grant insert on table "public"."talent_skills" to "service_role";

grant references on table "public"."talent_skills" to "service_role";

grant select on table "public"."talent_skills" to "service_role";

grant trigger on table "public"."talent_skills" to "service_role";

grant truncate on table "public"."talent_skills" to "service_role";

grant update on table "public"."talent_skills" to "service_role";

grant delete on table "public"."talents" to "anon";

grant insert on table "public"."talents" to "anon";

grant references on table "public"."talents" to "anon";

grant select on table "public"."talents" to "anon";

grant trigger on table "public"."talents" to "anon";

grant truncate on table "public"."talents" to "anon";

grant update on table "public"."talents" to "anon";

grant delete on table "public"."talents" to "authenticated";

grant insert on table "public"."talents" to "authenticated";

grant references on table "public"."talents" to "authenticated";

grant select on table "public"."talents" to "authenticated";

grant trigger on table "public"."talents" to "authenticated";

grant truncate on table "public"."talents" to "authenticated";

grant update on table "public"."talents" to "authenticated";

grant delete on table "public"."talents" to "service_role";

grant insert on table "public"."talents" to "service_role";

grant references on table "public"."talents" to "service_role";

grant select on table "public"."talents" to "service_role";

grant trigger on table "public"."talents" to "service_role";

grant truncate on table "public"."talents" to "service_role";

grant update on table "public"."talents" to "service_role";

grant delete on table "public"."tenant_ai_models" to "anon";

grant insert on table "public"."tenant_ai_models" to "anon";

grant references on table "public"."tenant_ai_models" to "anon";

grant select on table "public"."tenant_ai_models" to "anon";

grant trigger on table "public"."tenant_ai_models" to "anon";

grant truncate on table "public"."tenant_ai_models" to "anon";

grant update on table "public"."tenant_ai_models" to "anon";

grant delete on table "public"."tenant_ai_models" to "authenticated";

grant insert on table "public"."tenant_ai_models" to "authenticated";

grant references on table "public"."tenant_ai_models" to "authenticated";

grant select on table "public"."tenant_ai_models" to "authenticated";

grant trigger on table "public"."tenant_ai_models" to "authenticated";

grant truncate on table "public"."tenant_ai_models" to "authenticated";

grant update on table "public"."tenant_ai_models" to "authenticated";

grant delete on table "public"."tenant_ai_models" to "service_role";

grant insert on table "public"."tenant_ai_models" to "service_role";

grant references on table "public"."tenant_ai_models" to "service_role";

grant select on table "public"."tenant_ai_models" to "service_role";

grant trigger on table "public"."tenant_ai_models" to "service_role";

grant truncate on table "public"."tenant_ai_models" to "service_role";

grant update on table "public"."tenant_ai_models" to "service_role";

grant delete on table "public"."tenant_api_connections" to "anon";

grant insert on table "public"."tenant_api_connections" to "anon";

grant references on table "public"."tenant_api_connections" to "anon";

grant select on table "public"."tenant_api_connections" to "anon";

grant trigger on table "public"."tenant_api_connections" to "anon";

grant truncate on table "public"."tenant_api_connections" to "anon";

grant update on table "public"."tenant_api_connections" to "anon";

grant delete on table "public"."tenant_api_connections" to "authenticated";

grant insert on table "public"."tenant_api_connections" to "authenticated";

grant references on table "public"."tenant_api_connections" to "authenticated";

grant select on table "public"."tenant_api_connections" to "authenticated";

grant trigger on table "public"."tenant_api_connections" to "authenticated";

grant truncate on table "public"."tenant_api_connections" to "authenticated";

grant update on table "public"."tenant_api_connections" to "authenticated";

grant delete on table "public"."tenant_api_connections" to "service_role";

grant insert on table "public"."tenant_api_connections" to "service_role";

grant references on table "public"."tenant_api_connections" to "service_role";

grant select on table "public"."tenant_api_connections" to "service_role";

grant trigger on table "public"."tenant_api_connections" to "service_role";

grant truncate on table "public"."tenant_api_connections" to "service_role";

grant update on table "public"."tenant_api_connections" to "service_role";

grant delete on table "public"."tenant_billing_connections" to "anon";

grant insert on table "public"."tenant_billing_connections" to "anon";

grant references on table "public"."tenant_billing_connections" to "anon";

grant select on table "public"."tenant_billing_connections" to "anon";

grant trigger on table "public"."tenant_billing_connections" to "anon";

grant truncate on table "public"."tenant_billing_connections" to "anon";

grant update on table "public"."tenant_billing_connections" to "anon";

grant delete on table "public"."tenant_billing_connections" to "authenticated";

grant insert on table "public"."tenant_billing_connections" to "authenticated";

grant references on table "public"."tenant_billing_connections" to "authenticated";

grant select on table "public"."tenant_billing_connections" to "authenticated";

grant trigger on table "public"."tenant_billing_connections" to "authenticated";

grant truncate on table "public"."tenant_billing_connections" to "authenticated";

grant update on table "public"."tenant_billing_connections" to "authenticated";

grant delete on table "public"."tenant_billing_connections" to "service_role";

grant insert on table "public"."tenant_billing_connections" to "service_role";

grant references on table "public"."tenant_billing_connections" to "service_role";

grant select on table "public"."tenant_billing_connections" to "service_role";

grant trigger on table "public"."tenant_billing_connections" to "service_role";

grant truncate on table "public"."tenant_billing_connections" to "service_role";

grant update on table "public"."tenant_billing_connections" to "service_role";

grant delete on table "public"."tenant_communication_connections" to "anon";

grant insert on table "public"."tenant_communication_connections" to "anon";

grant references on table "public"."tenant_communication_connections" to "anon";

grant select on table "public"."tenant_communication_connections" to "anon";

grant trigger on table "public"."tenant_communication_connections" to "anon";

grant truncate on table "public"."tenant_communication_connections" to "anon";

grant update on table "public"."tenant_communication_connections" to "anon";

grant delete on table "public"."tenant_communication_connections" to "authenticated";

grant insert on table "public"."tenant_communication_connections" to "authenticated";

grant references on table "public"."tenant_communication_connections" to "authenticated";

grant select on table "public"."tenant_communication_connections" to "authenticated";

grant trigger on table "public"."tenant_communication_connections" to "authenticated";

grant truncate on table "public"."tenant_communication_connections" to "authenticated";

grant update on table "public"."tenant_communication_connections" to "authenticated";

grant delete on table "public"."tenant_communication_connections" to "service_role";

grant insert on table "public"."tenant_communication_connections" to "service_role";

grant references on table "public"."tenant_communication_connections" to "service_role";

grant select on table "public"."tenant_communication_connections" to "service_role";

grant trigger on table "public"."tenant_communication_connections" to "service_role";

grant truncate on table "public"."tenant_communication_connections" to "service_role";

grant update on table "public"."tenant_communication_connections" to "service_role";

grant delete on table "public"."tenant_document_parsing_config" to "anon";

grant insert on table "public"."tenant_document_parsing_config" to "anon";

grant references on table "public"."tenant_document_parsing_config" to "anon";

grant select on table "public"."tenant_document_parsing_config" to "anon";

grant trigger on table "public"."tenant_document_parsing_config" to "anon";

grant truncate on table "public"."tenant_document_parsing_config" to "anon";

grant update on table "public"."tenant_document_parsing_config" to "anon";

grant delete on table "public"."tenant_document_parsing_config" to "authenticated";

grant insert on table "public"."tenant_document_parsing_config" to "authenticated";

grant references on table "public"."tenant_document_parsing_config" to "authenticated";

grant select on table "public"."tenant_document_parsing_config" to "authenticated";

grant trigger on table "public"."tenant_document_parsing_config" to "authenticated";

grant truncate on table "public"."tenant_document_parsing_config" to "authenticated";

grant update on table "public"."tenant_document_parsing_config" to "authenticated";

grant delete on table "public"."tenant_document_parsing_config" to "service_role";

grant insert on table "public"."tenant_document_parsing_config" to "service_role";

grant references on table "public"."tenant_document_parsing_config" to "service_role";

grant select on table "public"."tenant_document_parsing_config" to "service_role";

grant trigger on table "public"."tenant_document_parsing_config" to "service_role";

grant truncate on table "public"."tenant_document_parsing_config" to "service_role";

grant update on table "public"."tenant_document_parsing_config" to "service_role";

grant delete on table "public"."tenant_email_configurations" to "anon";

grant insert on table "public"."tenant_email_configurations" to "anon";

grant references on table "public"."tenant_email_configurations" to "anon";

grant select on table "public"."tenant_email_configurations" to "anon";

grant trigger on table "public"."tenant_email_configurations" to "anon";

grant truncate on table "public"."tenant_email_configurations" to "anon";

grant update on table "public"."tenant_email_configurations" to "anon";

grant delete on table "public"."tenant_email_configurations" to "authenticated";

grant insert on table "public"."tenant_email_configurations" to "authenticated";

grant references on table "public"."tenant_email_configurations" to "authenticated";

grant select on table "public"."tenant_email_configurations" to "authenticated";

grant trigger on table "public"."tenant_email_configurations" to "authenticated";

grant truncate on table "public"."tenant_email_configurations" to "authenticated";

grant update on table "public"."tenant_email_configurations" to "authenticated";

grant delete on table "public"."tenant_email_configurations" to "service_role";

grant insert on table "public"."tenant_email_configurations" to "service_role";

grant references on table "public"."tenant_email_configurations" to "service_role";

grant select on table "public"."tenant_email_configurations" to "service_role";

grant trigger on table "public"."tenant_email_configurations" to "service_role";

grant truncate on table "public"."tenant_email_configurations" to "service_role";

grant update on table "public"."tenant_email_configurations" to "service_role";

grant delete on table "public"."tenant_outreach_configurations" to "anon";

grant insert on table "public"."tenant_outreach_configurations" to "anon";

grant references on table "public"."tenant_outreach_configurations" to "anon";

grant select on table "public"."tenant_outreach_configurations" to "anon";

grant trigger on table "public"."tenant_outreach_configurations" to "anon";

grant truncate on table "public"."tenant_outreach_configurations" to "anon";

grant update on table "public"."tenant_outreach_configurations" to "anon";

grant delete on table "public"."tenant_outreach_configurations" to "authenticated";

grant insert on table "public"."tenant_outreach_configurations" to "authenticated";

grant references on table "public"."tenant_outreach_configurations" to "authenticated";

grant select on table "public"."tenant_outreach_configurations" to "authenticated";

grant trigger on table "public"."tenant_outreach_configurations" to "authenticated";

grant truncate on table "public"."tenant_outreach_configurations" to "authenticated";

grant update on table "public"."tenant_outreach_configurations" to "authenticated";

grant delete on table "public"."tenant_outreach_configurations" to "service_role";

grant insert on table "public"."tenant_outreach_configurations" to "service_role";

grant references on table "public"."tenant_outreach_configurations" to "service_role";

grant select on table "public"."tenant_outreach_configurations" to "service_role";

grant trigger on table "public"."tenant_outreach_configurations" to "service_role";

grant truncate on table "public"."tenant_outreach_configurations" to "service_role";

grant update on table "public"."tenant_outreach_configurations" to "service_role";

grant delete on table "public"."tenant_social_media_connections" to "anon";

grant insert on table "public"."tenant_social_media_connections" to "anon";

grant references on table "public"."tenant_social_media_connections" to "anon";

grant select on table "public"."tenant_social_media_connections" to "anon";

grant trigger on table "public"."tenant_social_media_connections" to "anon";

grant truncate on table "public"."tenant_social_media_connections" to "anon";

grant update on table "public"."tenant_social_media_connections" to "anon";

grant delete on table "public"."tenant_social_media_connections" to "authenticated";

grant insert on table "public"."tenant_social_media_connections" to "authenticated";

grant references on table "public"."tenant_social_media_connections" to "authenticated";

grant select on table "public"."tenant_social_media_connections" to "authenticated";

grant trigger on table "public"."tenant_social_media_connections" to "authenticated";

grant truncate on table "public"."tenant_social_media_connections" to "authenticated";

grant update on table "public"."tenant_social_media_connections" to "authenticated";

grant delete on table "public"."tenant_social_media_connections" to "service_role";

grant insert on table "public"."tenant_social_media_connections" to "service_role";

grant references on table "public"."tenant_social_media_connections" to "service_role";

grant select on table "public"."tenant_social_media_connections" to "service_role";

grant trigger on table "public"."tenant_social_media_connections" to "service_role";

grant truncate on table "public"."tenant_social_media_connections" to "service_role";

grant update on table "public"."tenant_social_media_connections" to "service_role";

grant delete on table "public"."tenant_subscriptions" to "anon";

grant insert on table "public"."tenant_subscriptions" to "anon";

grant references on table "public"."tenant_subscriptions" to "anon";

grant select on table "public"."tenant_subscriptions" to "anon";

grant trigger on table "public"."tenant_subscriptions" to "anon";

grant truncate on table "public"."tenant_subscriptions" to "anon";

grant update on table "public"."tenant_subscriptions" to "anon";

grant delete on table "public"."tenant_subscriptions" to "authenticated";

grant insert on table "public"."tenant_subscriptions" to "authenticated";

grant references on table "public"."tenant_subscriptions" to "authenticated";

grant select on table "public"."tenant_subscriptions" to "authenticated";

grant trigger on table "public"."tenant_subscriptions" to "authenticated";

grant truncate on table "public"."tenant_subscriptions" to "authenticated";

grant update on table "public"."tenant_subscriptions" to "authenticated";

grant delete on table "public"."tenant_subscriptions" to "service_role";

grant insert on table "public"."tenant_subscriptions" to "service_role";

grant references on table "public"."tenant_subscriptions" to "service_role";

grant select on table "public"."tenant_subscriptions" to "service_role";

grant trigger on table "public"."tenant_subscriptions" to "service_role";

grant truncate on table "public"."tenant_subscriptions" to "service_role";

grant update on table "public"."tenant_subscriptions" to "service_role";

grant delete on table "public"."tenant_video_connections" to "anon";

grant insert on table "public"."tenant_video_connections" to "anon";

grant references on table "public"."tenant_video_connections" to "anon";

grant select on table "public"."tenant_video_connections" to "anon";

grant trigger on table "public"."tenant_video_connections" to "anon";

grant truncate on table "public"."tenant_video_connections" to "anon";

grant update on table "public"."tenant_video_connections" to "anon";

grant delete on table "public"."tenant_video_connections" to "authenticated";

grant insert on table "public"."tenant_video_connections" to "authenticated";

grant references on table "public"."tenant_video_connections" to "authenticated";

grant select on table "public"."tenant_video_connections" to "authenticated";

grant trigger on table "public"."tenant_video_connections" to "authenticated";

grant truncate on table "public"."tenant_video_connections" to "authenticated";

grant update on table "public"."tenant_video_connections" to "authenticated";

grant delete on table "public"."tenant_video_connections" to "service_role";

grant insert on table "public"."tenant_video_connections" to "service_role";

grant references on table "public"."tenant_video_connections" to "service_role";

grant select on table "public"."tenant_video_connections" to "service_role";

grant trigger on table "public"."tenant_video_connections" to "service_role";

grant truncate on table "public"."tenant_video_connections" to "service_role";

grant update on table "public"."tenant_video_connections" to "service_role";

grant delete on table "public"."user_dashboard_configs" to "anon";

grant insert on table "public"."user_dashboard_configs" to "anon";

grant references on table "public"."user_dashboard_configs" to "anon";

grant select on table "public"."user_dashboard_configs" to "anon";

grant trigger on table "public"."user_dashboard_configs" to "anon";

grant truncate on table "public"."user_dashboard_configs" to "anon";

grant update on table "public"."user_dashboard_configs" to "anon";

grant delete on table "public"."user_dashboard_configs" to "authenticated";

grant insert on table "public"."user_dashboard_configs" to "authenticated";

grant references on table "public"."user_dashboard_configs" to "authenticated";

grant select on table "public"."user_dashboard_configs" to "authenticated";

grant trigger on table "public"."user_dashboard_configs" to "authenticated";

grant truncate on table "public"."user_dashboard_configs" to "authenticated";

grant update on table "public"."user_dashboard_configs" to "authenticated";

grant delete on table "public"."user_dashboard_configs" to "service_role";

grant insert on table "public"."user_dashboard_configs" to "service_role";

grant references on table "public"."user_dashboard_configs" to "service_role";

grant select on table "public"."user_dashboard_configs" to "service_role";

grant trigger on table "public"."user_dashboard_configs" to "service_role";

grant truncate on table "public"."user_dashboard_configs" to "service_role";

grant update on table "public"."user_dashboard_configs" to "service_role";

grant delete on table "public"."user_navigation_preferences" to "anon";

grant insert on table "public"."user_navigation_preferences" to "anon";

grant references on table "public"."user_navigation_preferences" to "anon";

grant select on table "public"."user_navigation_preferences" to "anon";

grant trigger on table "public"."user_navigation_preferences" to "anon";

grant truncate on table "public"."user_navigation_preferences" to "anon";

grant update on table "public"."user_navigation_preferences" to "anon";

grant delete on table "public"."user_navigation_preferences" to "authenticated";

grant insert on table "public"."user_navigation_preferences" to "authenticated";

grant references on table "public"."user_navigation_preferences" to "authenticated";

grant select on table "public"."user_navigation_preferences" to "authenticated";

grant trigger on table "public"."user_navigation_preferences" to "authenticated";

grant truncate on table "public"."user_navigation_preferences" to "authenticated";

grant update on table "public"."user_navigation_preferences" to "authenticated";

grant delete on table "public"."user_navigation_preferences" to "service_role";

grant insert on table "public"."user_navigation_preferences" to "service_role";

grant references on table "public"."user_navigation_preferences" to "service_role";

grant select on table "public"."user_navigation_preferences" to "service_role";

grant trigger on table "public"."user_navigation_preferences" to "service_role";

grant truncate on table "public"."user_navigation_preferences" to "service_role";

grant update on table "public"."user_navigation_preferences" to "service_role";

grant delete on table "public"."user_subscriptions" to "anon";

grant insert on table "public"."user_subscriptions" to "anon";

grant references on table "public"."user_subscriptions" to "anon";

grant select on table "public"."user_subscriptions" to "anon";

grant trigger on table "public"."user_subscriptions" to "anon";

grant truncate on table "public"."user_subscriptions" to "anon";

grant update on table "public"."user_subscriptions" to "anon";

grant delete on table "public"."user_subscriptions" to "authenticated";

grant insert on table "public"."user_subscriptions" to "authenticated";

grant references on table "public"."user_subscriptions" to "authenticated";

grant select on table "public"."user_subscriptions" to "authenticated";

grant trigger on table "public"."user_subscriptions" to "authenticated";

grant truncate on table "public"."user_subscriptions" to "authenticated";

grant update on table "public"."user_subscriptions" to "authenticated";

grant delete on table "public"."user_subscriptions" to "service_role";

grant insert on table "public"."user_subscriptions" to "service_role";

grant references on table "public"."user_subscriptions" to "service_role";

grant select on table "public"."user_subscriptions" to "service_role";

grant trigger on table "public"."user_subscriptions" to "service_role";

grant truncate on table "public"."user_subscriptions" to "service_role";

grant update on table "public"."user_subscriptions" to "service_role";

grant delete on table "public"."widget_data_sources" to "anon";

grant insert on table "public"."widget_data_sources" to "anon";

grant references on table "public"."widget_data_sources" to "anon";

grant select on table "public"."widget_data_sources" to "anon";

grant trigger on table "public"."widget_data_sources" to "anon";

grant truncate on table "public"."widget_data_sources" to "anon";

grant update on table "public"."widget_data_sources" to "anon";

grant delete on table "public"."widget_data_sources" to "authenticated";

grant insert on table "public"."widget_data_sources" to "authenticated";

grant references on table "public"."widget_data_sources" to "authenticated";

grant select on table "public"."widget_data_sources" to "authenticated";

grant trigger on table "public"."widget_data_sources" to "authenticated";

grant truncate on table "public"."widget_data_sources" to "authenticated";

grant update on table "public"."widget_data_sources" to "authenticated";

grant delete on table "public"."widget_data_sources" to "service_role";

grant insert on table "public"."widget_data_sources" to "service_role";

grant references on table "public"."widget_data_sources" to "service_role";

grant select on table "public"."widget_data_sources" to "service_role";

grant trigger on table "public"."widget_data_sources" to "service_role";

grant truncate on table "public"."widget_data_sources" to "service_role";

grant update on table "public"."widget_data_sources" to "service_role";

grant delete on table "public"."workflow_execution_logs" to "anon";

grant insert on table "public"."workflow_execution_logs" to "anon";

grant references on table "public"."workflow_execution_logs" to "anon";

grant select on table "public"."workflow_execution_logs" to "anon";

grant trigger on table "public"."workflow_execution_logs" to "anon";

grant truncate on table "public"."workflow_execution_logs" to "anon";

grant update on table "public"."workflow_execution_logs" to "anon";

grant delete on table "public"."workflow_execution_logs" to "authenticated";

grant insert on table "public"."workflow_execution_logs" to "authenticated";

grant references on table "public"."workflow_execution_logs" to "authenticated";

grant select on table "public"."workflow_execution_logs" to "authenticated";

grant trigger on table "public"."workflow_execution_logs" to "authenticated";

grant truncate on table "public"."workflow_execution_logs" to "authenticated";

grant update on table "public"."workflow_execution_logs" to "authenticated";

grant delete on table "public"."workflow_execution_logs" to "service_role";

grant insert on table "public"."workflow_execution_logs" to "service_role";

grant references on table "public"."workflow_execution_logs" to "service_role";

grant select on table "public"."workflow_execution_logs" to "service_role";

grant trigger on table "public"."workflow_execution_logs" to "service_role";

grant truncate on table "public"."workflow_execution_logs" to "service_role";

grant update on table "public"."workflow_execution_logs" to "service_role";


  create policy "AI context cache is tenant-scoped"
  on "public"."ai_context_cache"
  as permissive
  for all
  to authenticated
using (((tenant_id IS NULL) OR (EXISTS ( SELECT 1
   FROM public.user_tenants
  WHERE ((user_tenants.user_id = auth.uid()) AND (user_tenants.tenant_id = ai_context_cache.tenant_id)))) OR public.is_super_admin(auth.uid())));



  create policy "AI learning data is tenant-scoped"
  on "public"."ai_learning_data"
  as permissive
  for all
  to authenticated
using (((tenant_id IS NULL) OR (EXISTS ( SELECT 1
   FROM public.user_tenants
  WHERE ((user_tenants.user_id = auth.uid()) AND (user_tenants.tenant_id = ai_learning_data.tenant_id)))) OR public.is_super_admin(auth.uid())));



  create policy "AI models are modifiable by super admins"
  on "public"."ai_models"
  as permissive
  for all
  to authenticated
using (public.is_super_admin(auth.uid()))
with check (public.is_super_admin(auth.uid()));



  create policy "AI models are readable by authenticated users"
  on "public"."ai_models"
  as permissive
  for select
  to authenticated
using (true);



  create policy "AI performance metrics are tenant-scoped"
  on "public"."ai_performance_metrics"
  as permissive
  for all
  to authenticated
using (((tenant_id IS NULL) OR (EXISTS ( SELECT 1
   FROM public.user_tenants
  WHERE ((user_tenants.user_id = auth.uid()) AND (user_tenants.tenant_id = ai_performance_metrics.tenant_id)))) OR public.is_super_admin(auth.uid())));



  create policy "AI request logs are tenant-scoped"
  on "public"."ai_request_logs"
  as permissive
  for all
  to authenticated
using (((tenant_id IS NULL) OR (EXISTS ( SELECT 1
   FROM public.user_tenants
  WHERE ((user_tenants.user_id = auth.uid()) AND (user_tenants.tenant_id = ai_request_logs.tenant_id)))) OR public.is_super_admin(auth.uid())));



  create policy "Enable all operations for authenticated users"
  on "public"."applications"
  as permissive
  for all
  to authenticated
using (true);



  create policy "Enable all operations for authenticated users"
  on "public"."candidate_tags"
  as permissive
  for all
  to authenticated
using (true);



  create policy "Enable all operations for authenticated users"
  on "public"."candidates"
  as permissive
  for all
  to authenticated
using (true);



  create policy "Enable all access to companies"
  on "public"."companies"
  as permissive
  for all
  to public
using (true)
with check (true);



  create policy "Allow authenticated users to read company_relationship_history"
  on "public"."company_relationship_history"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Allow system to insert history records"
  on "public"."company_relationship_history"
  as permissive
  for insert
  to authenticated
with check (true);



  create policy "Allow anonymous users to read company_relationship_types"
  on "public"."company_relationship_types"
  as permissive
  for select
  to anon
using (true);



  create policy "Allow authenticated users to delete company_relationship_types"
  on "public"."company_relationship_types"
  as permissive
  for delete
  to authenticated
using (true);



  create policy "Allow authenticated users to insert company_relationship_types"
  on "public"."company_relationship_types"
  as permissive
  for insert
  to authenticated
with check (true);



  create policy "Allow authenticated users to read company_relationship_types"
  on "public"."company_relationship_types"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Allow authenticated users to update company_relationship_types"
  on "public"."company_relationship_types"
  as permissive
  for update
  to authenticated
using (true)
with check (true);



  create policy "Allow anonymous users to read company_relationships_advanced"
  on "public"."company_relationships_advanced"
  as permissive
  for select
  to anon
using (true);



  create policy "Allow authenticated users to delete company_relationships_advan"
  on "public"."company_relationships_advanced"
  as permissive
  for delete
  to authenticated
using (true);



  create policy "Allow authenticated users to insert company_relationships_advan"
  on "public"."company_relationships_advanced"
  as permissive
  for insert
  to authenticated
with check (true);



  create policy "Allow authenticated users to read company_relationships_advance"
  on "public"."company_relationships_advanced"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Allow authenticated users to update company_relationships_advan"
  on "public"."company_relationships_advanced"
  as permissive
  for update
  to authenticated
using (true)
with check (true);



  create policy "Users can view custom field values for entities they have acces"
  on "public"."custom_field_values"
  as permissive
  for select
  to public
using ((field_id IN ( SELECT cf.id
   FROM (public.custom_fields cf
     JOIN public.user_tenants ut ON ((cf.tenant_id = ut.tenant_id)))
  WHERE (ut.user_id = auth.uid()))));



  create policy "Tenant admins can manage their custom fields"
  on "public"."custom_fields"
  as permissive
  for all
  to public
using ((tenant_id IN ( SELECT user_tenants.tenant_id
   FROM public.user_tenants
  WHERE (user_tenants.user_id = auth.uid()))));



  create policy "Users can delete custom fields"
  on "public"."custom_fields"
  as permissive
  for delete
  to authenticated
using (true);



  create policy "Users can insert custom fields"
  on "public"."custom_fields"
  as permissive
  for insert
  to authenticated
with check (true);



  create policy "Users can update custom fields"
  on "public"."custom_fields"
  as permissive
  for update
  to authenticated
using (true);



  create policy "Users can view custom fields"
  on "public"."custom_fields"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Layout positions accessible via dashboard config"
  on "public"."dashboard_layouts"
  as permissive
  for all
  to public
using ((EXISTS ( SELECT 1
   FROM public.user_dashboard_configs
  WHERE ((user_dashboard_configs.id = dashboard_layouts.config_id) AND ((user_dashboard_configs.user_id = auth.uid()) OR public.is_super_admin(auth.uid()))))));



  create policy "Templates manageable by super admins"
  on "public"."dashboard_templates"
  as permissive
  for all
  to public
using (public.is_super_admin(auth.uid()));



  create policy "Templates viewable by authenticated users"
  on "public"."dashboard_templates"
  as permissive
  for select
  to public
using ((auth.role() = 'authenticated'::text));



  create policy "Widgets manageable by super admins"
  on "public"."dashboard_widgets"
  as permissive
  for all
  to public
using (public.is_super_admin(auth.uid()));



  create policy "Widgets viewable by authenticated users"
  on "public"."dashboard_widgets"
  as permissive
  for select
  to public
using ((auth.role() = 'authenticated'::text));



  create policy "All users can view dropdown categories"
  on "public"."dropdown_option_categories"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Allow anonymous read access to dropdown_option_categories"
  on "public"."dropdown_option_categories"
  as permissive
  for select
  to anon
using (true);



  create policy "Allow authenticated create access to dropdown_option_categories"
  on "public"."dropdown_option_categories"
  as permissive
  for insert
  to authenticated
with check (true);



  create policy "Allow authenticated read access to dropdown_option_categories"
  on "public"."dropdown_option_categories"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Anyone can view dropdown categories"
  on "public"."dropdown_option_categories"
  as permissive
  for select
  to public
using (true);



  create policy "Authenticated users can delete dropdown categories"
  on "public"."dropdown_option_categories"
  as permissive
  for delete
  to public
using ((auth.role() = 'authenticated'::text));



  create policy "Authenticated users can insert dropdown categories"
  on "public"."dropdown_option_categories"
  as permissive
  for insert
  to public
with check ((auth.role() = 'authenticated'::text));



  create policy "Authenticated users can update dropdown categories"
  on "public"."dropdown_option_categories"
  as permissive
  for update
  to public
using ((auth.role() = 'authenticated'::text));



  create policy "Super admins can manage dropdown categories"
  on "public"."dropdown_option_categories"
  as permissive
  for all
  to authenticated
using (public.is_super_admin(auth.uid()));



  create policy "All users can view dropdown options"
  on "public"."dropdown_options"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Allow anonymous read access to dropdown_options"
  on "public"."dropdown_options"
  as permissive
  for select
  to anon
using (true);



  create policy "Allow authenticated create access to dropdown_options"
  on "public"."dropdown_options"
  as permissive
  for insert
  to authenticated
with check (true);



  create policy "Allow authenticated read access to dropdown_options"
  on "public"."dropdown_options"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Anyone can view dropdown options"
  on "public"."dropdown_options"
  as permissive
  for select
  to public
using (true);



  create policy "Authenticated users can delete dropdown options"
  on "public"."dropdown_options"
  as permissive
  for delete
  to public
using ((auth.role() = 'authenticated'::text));



  create policy "Authenticated users can insert dropdown options"
  on "public"."dropdown_options"
  as permissive
  for insert
  to public
with check ((auth.role() = 'authenticated'::text));



  create policy "Authenticated users can update dropdown options"
  on "public"."dropdown_options"
  as permissive
  for update
  to public
using ((auth.role() = 'authenticated'::text));



  create policy "Super admins can manage dropdown options"
  on "public"."dropdown_options"
  as permissive
  for all
  to authenticated
using (public.is_super_admin(auth.uid()));



  create policy "Admins can manage forms for their tenant"
  on "public"."form_definitions"
  as permissive
  for all
  to public
using (((EXISTS ( SELECT 1
   FROM (public.user_tenants ut
     JOIN public.profiles p ON ((p.id = auth.uid())))
  WHERE ((ut.user_id = auth.uid()) AND (ut.tenant_id = form_definitions.tenant_id) AND ((ut.user_role = 'admin'::text) OR (p.role = 'super_admin'::public.user_role))))) OR ((tenant_id IS NULL) AND (EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'super_admin'::public.user_role)))))));



  create policy "Users can view forms for their tenant or global forms"
  on "public"."form_definitions"
  as permissive
  for select
  to public
using (((tenant_id IS NULL) OR (tenant_id IN ( SELECT user_tenants.tenant_id
   FROM public.user_tenants
  WHERE (user_tenants.user_id = auth.uid()))) OR (EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'super_admin'::public.user_role))))));



  create policy "Super admins can manage deployment points"
  on "public"."form_deployment_points"
  as permissive
  for all
  to public
using (public.is_super_admin(auth.uid()));



  create policy "Users can view active deployment points"
  on "public"."form_deployment_points"
  as permissive
  for select
  to public
using ((is_active = true));



  create policy "Super admins can manage form module assignments"
  on "public"."form_module_assignments"
  as permissive
  for all
  to public
using (public.is_super_admin(auth.uid()));



  create policy "Super admins can manage all placements"
  on "public"."form_placements"
  as permissive
  for all
  to public
using (public.is_super_admin(auth.uid()));



  create policy "Users can view placements for their tenant"
  on "public"."form_placements"
  as permissive
  for select
  to public
using (((tenant_id IN ( SELECT user_tenants.tenant_id
   FROM public.user_tenants
  WHERE (user_tenants.user_id = auth.uid()))) OR (tenant_id IS NULL)));



  create policy "Super admins can manage all responses"
  on "public"."form_responses"
  as permissive
  for all
  to public
using (public.is_super_admin(auth.uid()));



  create policy "Users can manage responses for their tenant"
  on "public"."form_responses"
  as permissive
  for all
  to public
using ((tenant_id IN ( SELECT user_tenants.tenant_id
   FROM public.user_tenants
  WHERE (user_tenants.user_id = auth.uid()))));



  create policy "Admins can manage sections for their forms"
  on "public"."form_sections"
  as permissive
  for all
  to public
using (((EXISTS ( SELECT 1
   FROM ((public.form_definitions fd
     JOIN public.user_tenants ut ON ((ut.tenant_id = fd.tenant_id)))
     JOIN public.profiles p ON ((p.id = auth.uid())))
  WHERE ((fd.id = form_sections.form_id) AND (ut.user_id = auth.uid()) AND ((ut.user_role = 'admin'::text) OR (p.role = 'super_admin'::public.user_role))))) OR (EXISTS ( SELECT 1
   FROM public.form_definitions fd
  WHERE ((fd.id = form_sections.form_id) AND (fd.tenant_id IS NULL) AND (EXISTS ( SELECT 1
           FROM public.profiles
          WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'super_admin'::public.user_role)))))))));



  create policy "Users can view sections for accessible forms"
  on "public"."form_sections"
  as permissive
  for select
  to public
using ((EXISTS ( SELECT 1
   FROM public.form_definitions fd
  WHERE ((fd.id = form_sections.form_id) AND ((fd.tenant_id IS NULL) OR (fd.tenant_id IN ( SELECT user_tenants.tenant_id
           FROM public.user_tenants
          WHERE (user_tenants.user_id = auth.uid()))) OR (EXISTS ( SELECT 1
           FROM public.profiles
          WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'super_admin'::public.user_role)))))))));



  create policy "Admins can view all submissions for their tenant forms"
  on "public"."form_submissions"
  as permissive
  for select
  to public
using (((EXISTS ( SELECT 1
   FROM ((public.form_definitions fd
     JOIN public.user_tenants ut ON ((ut.tenant_id = fd.tenant_id)))
     JOIN public.profiles p ON ((p.id = auth.uid())))
  WHERE ((fd.id = form_submissions.form_id) AND (ut.user_id = auth.uid()) AND ((ut.user_role = 'admin'::text) OR (p.role = 'super_admin'::public.user_role))))) OR (EXISTS ( SELECT 1
   FROM public.form_definitions fd
  WHERE ((fd.id = form_submissions.form_id) AND (fd.tenant_id IS NULL) AND (EXISTS ( SELECT 1
           FROM public.profiles
          WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'super_admin'::public.user_role)))))))));



  create policy "Users can create submissions for accessible forms"
  on "public"."form_submissions"
  as permissive
  for insert
  to public
with check (((submitted_by = auth.uid()) AND (EXISTS ( SELECT 1
   FROM public.form_definitions fd
  WHERE ((fd.id = form_submissions.form_id) AND (fd.is_active = true) AND ((fd.tenant_id IS NULL) OR (fd.tenant_id IN ( SELECT user_tenants.tenant_id
           FROM public.user_tenants
          WHERE (user_tenants.user_id = auth.uid())))))))));



  create policy "Users can update their own draft submissions"
  on "public"."form_submissions"
  as permissive
  for update
  to public
using (((submitted_by = auth.uid()) AND (status = 'draft'::text)));



  create policy "Users can view their own submissions"
  on "public"."form_submissions"
  as permissive
  for select
  to public
using ((submitted_by = auth.uid()));



  create policy "Super admins can manage all triggers"
  on "public"."form_triggers"
  as permissive
  for all
  to public
using (public.is_super_admin(auth.uid()));



  create policy "Users can view triggers for accessible placements"
  on "public"."form_triggers"
  as permissive
  for select
  to public
using ((placement_id IN ( SELECT form_placements.id
   FROM public.form_placements
  WHERE ((form_placements.tenant_id IN ( SELECT user_tenants.tenant_id
           FROM public.user_tenants
          WHERE (user_tenants.user_id = auth.uid()))) OR (form_placements.tenant_id IS NULL)))));



  create policy "Super admins can manage global email templates"
  on "public"."global_email_templates"
  as permissive
  for all
  to public
using (public.is_super_admin(auth.uid()));



  create policy "Super admins can manage global settings"
  on "public"."global_settings"
  as permissive
  for all
  to public
using (public.is_super_admin(auth.uid()));



  create policy "Enable all operations for authenticated users"
  on "public"."interviews"
  as permissive
  for all
  to authenticated
using (true);



  create policy "Enable all operations for authenticated users"
  on "public"."jobs"
  as permissive
  for all
  to authenticated
using (true);



  create policy "Super admins can manage LinkedIn enrichments"
  on "public"."linkedin_profile_enrichments"
  as permissive
  for all
  to public
using ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'super_admin'::public.user_role)))));



  create policy "Super admin can access all module usage tracking"
  on "public"."module_usage_tracking"
  as permissive
  for all
  to public
using ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'super_admin'::public.user_role)))));



  create policy "Super admins can manage password policy enforcement"
  on "public"."password_policy_enforcement"
  as permissive
  for all
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'super_admin'::public.user_role)))));



  create policy "Super admins can update all profiles"
  on "public"."profiles"
  as permissive
  for update
  to public
using (public.is_super_admin(auth.uid()));



  create policy "Super admins can view all profiles"
  on "public"."profiles"
  as permissive
  for select
  to public
using (public.is_super_admin(auth.uid()));



  create policy "Users can update their own profile"
  on "public"."profiles"
  as permissive
  for update
  to public
using ((auth.uid() = id));



  create policy "Users can view their own profile"
  on "public"."profiles"
  as permissive
  for select
  to public
using ((auth.uid() = id));



  create policy "Allow all actions on saved_reports"
  on "public"."saved_reports"
  as permissive
  for all
  to public
using (true)
with check (true);



  create policy "Skills are viewable by all authenticated users"
  on "public"."skills"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Superadmins can do everything with skills"
  on "public"."skills"
  as permissive
  for all
  to authenticated
using (public.is_super_admin(auth.uid()));



  create policy "Super admins can view system health metrics"
  on "public"."system_health_metrics"
  as permissive
  for select
  to public
using (public.is_super_admin(auth.uid()));



  create policy "System can insert health metrics"
  on "public"."system_health_metrics"
  as permissive
  for insert
  to public
with check (true);



  create policy "Super admins can manage system maintenance"
  on "public"."system_maintenance"
  as permissive
  for all
  to public
using (public.is_super_admin(auth.uid()));



  create policy "Allow anonymous users to read system_modules"
  on "public"."system_modules"
  as permissive
  for select
  to anon
using (true);



  create policy "Allow authenticated users to delete system_modules"
  on "public"."system_modules"
  as permissive
  for delete
  to authenticated
using (true);



  create policy "Allow authenticated users to insert system_modules"
  on "public"."system_modules"
  as permissive
  for insert
  to authenticated
with check (true);



  create policy "Allow authenticated users to read system_modules"
  on "public"."system_modules"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Allow authenticated users to update system_modules"
  on "public"."system_modules"
  as permissive
  for update
  to authenticated
using (true)
with check (true);



  create policy "Super admins can manage system notifications"
  on "public"."system_notifications"
  as permissive
  for all
  to public
using (public.is_super_admin(auth.uid()));



  create policy "Superadmins can do everything with talent_skills"
  on "public"."talent_skills"
  as permissive
  for all
  to authenticated
using (public.is_super_admin(auth.uid()));



  create policy "Superadmins can do everything with talents"
  on "public"."talents"
  as permissive
  for all
  to authenticated
using (public.is_super_admin(auth.uid()));



  create policy "tenant_ai_models_super_admin_policy"
  on "public"."tenant_ai_models"
  as permissive
  for all
  to public
using (public.is_super_admin(auth.uid()));



  create policy "Super admin can access all API connections"
  on "public"."tenant_api_connections"
  as permissive
  for all
  to public
using ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'super_admin'::public.user_role)))));



  create policy "Super admin can access all billing connections"
  on "public"."tenant_billing_connections"
  as permissive
  for all
  to public
using ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'super_admin'::public.user_role)))));



  create policy "Super admin can access all communication connections"
  on "public"."tenant_communication_connections"
  as permissive
  for all
  to public
using ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'super_admin'::public.user_role)))));



  create policy "Super admin can access all document parsing configs"
  on "public"."tenant_document_parsing_config"
  as permissive
  for all
  to public
using ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'super_admin'::public.user_role)))));



  create policy "Super admin can access all email configurations"
  on "public"."tenant_email_configurations"
  as permissive
  for all
  to public
using ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'super_admin'::public.user_role)))));



  create policy "Super admin can access all outreach configurations"
  on "public"."tenant_outreach_configurations"
  as permissive
  for all
  to public
using ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'super_admin'::public.user_role)))));



  create policy "Super admin can access all social media connections"
  on "public"."tenant_social_media_connections"
  as permissive
  for all
  to public
using ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'super_admin'::public.user_role)))));



  create policy "Super admins can manage all social media connections"
  on "public"."tenant_social_media_connections"
  as permissive
  for all
  to public
using ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'super_admin'::public.user_role)))));



  create policy "Super admin can access all video connections"
  on "public"."tenant_video_connections"
  as permissive
  for all
  to public
using ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'super_admin'::public.user_role)))));



  create policy "Super admins can delete tenants"
  on "public"."tenants"
  as permissive
  for delete
  to public
using (public.is_super_admin(auth.uid()));



  create policy "Super admins can insert tenants"
  on "public"."tenants"
  as permissive
  for insert
  to public
with check (public.is_super_admin(auth.uid()));



  create policy "Super admins can update tenants"
  on "public"."tenants"
  as permissive
  for update
  to public
using (public.is_super_admin(auth.uid()));



  create policy "Super admins can view all tenants"
  on "public"."tenants"
  as permissive
  for select
  to public
using (public.is_super_admin(auth.uid()));



  create policy "Users can view tenants they belong to"
  on "public"."tenants"
  as permissive
  for select
  to public
using ((EXISTS ( SELECT 1
   FROM public.user_tenants
  WHERE ((user_tenants.user_id = auth.uid()) AND (user_tenants.tenant_id = user_tenants.id)))));



  create policy "User configs accessible by owner"
  on "public"."user_dashboard_configs"
  as permissive
  for all
  to public
using (((auth.uid() = user_id) OR public.is_super_admin(auth.uid())));



  create policy "Users can delete their own navigation preferences"
  on "public"."user_navigation_preferences"
  as permissive
  for delete
  to public
using ((auth.uid() = user_id));



  create policy "Users can insert their own navigation preferences"
  on "public"."user_navigation_preferences"
  as permissive
  for insert
  to public
with check ((auth.uid() = user_id));



  create policy "Users can update their own navigation preferences"
  on "public"."user_navigation_preferences"
  as permissive
  for update
  to public
using ((auth.uid() = user_id));



  create policy "Users can view their own navigation preferences"
  on "public"."user_navigation_preferences"
  as permissive
  for select
  to public
using ((auth.uid() = user_id));



  create policy "Super admins can view all sessions"
  on "public"."user_sessions"
  as permissive
  for select
  to public
using ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'super_admin'::public.user_role)))));



  create policy "System can manage sessions"
  on "public"."user_sessions"
  as permissive
  for all
  to public
using (true);



  create policy "Super admins can delete user subscriptions"
  on "public"."user_subscriptions"
  as permissive
  for delete
  to public
using ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'super_admin'::public.user_role)))));



  create policy "Super admins can insert user subscriptions"
  on "public"."user_subscriptions"
  as permissive
  for insert
  to public
with check ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'super_admin'::public.user_role)))));



  create policy "Super admins can update user subscriptions"
  on "public"."user_subscriptions"
  as permissive
  for update
  to public
using ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'super_admin'::public.user_role)))));



  create policy "Super admins can view all user subscriptions"
  on "public"."user_subscriptions"
  as permissive
  for select
  to public
using ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'super_admin'::public.user_role)))));



  create policy "Super admins can manage tenant relationships"
  on "public"."user_tenants"
  as permissive
  for all
  to public
using (public.is_super_admin(auth.uid()));



  create policy "Super admins can view all tenant relationships"
  on "public"."user_tenants"
  as permissive
  for select
  to public
using (public.is_super_admin(auth.uid()));



  create policy "Users can view their own tenant relationships"
  on "public"."user_tenants"
  as permissive
  for select
  to public
using ((user_id = auth.uid()));



  create policy "Data sources manageable by super admins"
  on "public"."widget_data_sources"
  as permissive
  for all
  to public
using (public.is_super_admin(auth.uid()));



  create policy "Data sources viewable by authenticated users"
  on "public"."widget_data_sources"
  as permissive
  for select
  to public
using ((auth.role() = 'authenticated'::text));



  create policy "Super admins can view all audit logs"
  on "public"."audit_logs"
  as permissive
  for select
  to public
using ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'super_admin'::public.user_role)))));


CREATE TRIGGER update_ai_insights_updated_at BEFORE UPDATE ON public.ai_insights FOR EACH ROW EXECUTE FUNCTION public.update_ai_updated_at();

CREATE TRIGGER update_ai_models_updated_at BEFORE UPDATE ON public.ai_models FOR EACH ROW EXECUTE FUNCTION public.update_ai_updated_at();

CREATE TRIGGER update_ai_performance_metrics_updated_at BEFORE UPDATE ON public.ai_performance_metrics FOR EACH ROW EXECUTE FUNCTION public.update_ai_updated_at();

CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON public.applications FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_behavioral_patterns_updated_at BEFORE UPDATE ON public.behavioral_patterns FOR EACH ROW EXECUTE FUNCTION public.update_ai_updated_at();

CREATE TRIGGER update_candidates_updated_at BEFORE UPDATE ON public.candidates FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER set_companies_updated_at BEFORE UPDATE ON public.companies FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();

CREATE TRIGGER trigger_assign_tr_id_companies BEFORE INSERT ON public.companies FOR EACH ROW EXECUTE FUNCTION public.assign_tr_id_companies();

CREATE TRIGGER update_company_relationships_updated_at BEFORE UPDATE ON public.company_relationships FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();

CREATE TRIGGER update_custom_field_values_updated_at BEFORE UPDATE ON public.custom_field_values FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_custom_fields_updated_at BEFORE UPDATE ON public.custom_fields FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_dashboard_layouts_updated_at BEFORE UPDATE ON public.dashboard_layouts FOR EACH ROW EXECUTE FUNCTION public.update_dashboard_updated_at();

CREATE TRIGGER update_dashboard_templates_updated_at BEFORE UPDATE ON public.dashboard_templates FOR EACH ROW EXECUTE FUNCTION public.update_dashboard_updated_at();

CREATE TRIGGER update_dashboard_widgets_updated_at BEFORE UPDATE ON public.dashboard_widgets FOR EACH ROW EXECUTE FUNCTION public.update_dashboard_updated_at();

CREATE TRIGGER set_dropdown_categories_updated_at BEFORE UPDATE ON public.dropdown_option_categories FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();

CREATE TRIGGER set_dropdown_options_updated_at BEFORE UPDATE ON public.dropdown_options FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();

CREATE TRIGGER update_form_definitions_updated_at BEFORE UPDATE ON public.form_definitions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_form_deployment_points_updated_at BEFORE UPDATE ON public.form_deployment_points FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_form_module_assignments_updated_at BEFORE UPDATE ON public.form_module_assignments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER trigger_update_form_notifications_updated_at BEFORE UPDATE ON public.form_notifications FOR EACH ROW EXECUTE FUNCTION public.update_form_notifications_updated_at();

CREATE TRIGGER update_form_placements_updated_at BEFORE UPDATE ON public.form_placements FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_form_responses_updated_at BEFORE UPDATE ON public.form_responses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_form_sections_updated_at BEFORE UPDATE ON public.form_sections FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_form_submissions_updated_at BEFORE UPDATE ON public.form_submissions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_form_triggers_updated_at BEFORE UPDATE ON public.form_triggers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER trigger_update_form_workflows_updated_at BEFORE UPDATE ON public.form_workflows FOR EACH ROW EXECUTE FUNCTION public.update_form_workflows_updated_at();

CREATE TRIGGER update_global_email_templates_updated_at BEFORE UPDATE ON public.global_email_templates FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_global_settings_updated_at BEFORE UPDATE ON public.global_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_interviews_updated_at BEFORE UPDATE ON public.interviews FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON public.jobs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_module_pricing_updated_at BEFORE UPDATE ON public.module_pricing FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_module_usage_tracking_updated_at BEFORE UPDATE ON public.module_usage_tracking FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trigger_assign_tr_id_people BEFORE INSERT ON public.people FOR EACH ROW EXECUTE FUNCTION public.assign_tr_id_people();

CREATE TRIGGER update_people_updated_at BEFORE UPDATE ON public.people FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();

CREATE TRIGGER trigger_assign_tr_id_profiles BEFORE INSERT ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.assign_tr_id_profiles();

CREATE TRIGGER update_profiles_timestamp BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.saved_reports FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();

CREATE TRIGGER update_subscription_plans_updated_at BEFORE UPDATE ON public.subscription_plans FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_system_maintenance_updated_at BEFORE UPDATE ON public.system_maintenance FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_system_modules_updated_at BEFORE UPDATE ON public.system_modules FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_system_notifications_updated_at BEFORE UPDATE ON public.system_notifications FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER set_talents_updated_at BEFORE UPDATE ON public.talents FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();

CREATE TRIGGER set_tenant_ai_models_timestamp BEFORE UPDATE ON public.tenant_ai_models FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();

CREATE TRIGGER update_tenant_api_connections_updated_at BEFORE UPDATE ON public.tenant_api_connections FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tenant_billing_connections_updated_at BEFORE UPDATE ON public.tenant_billing_connections FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tenant_communication_connections_updated_at BEFORE UPDATE ON public.tenant_communication_connections FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tenant_document_parsing_config_updated_at BEFORE UPDATE ON public.tenant_document_parsing_config FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tenant_email_configurations_updated_at BEFORE UPDATE ON public.tenant_email_configurations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tenant_outreach_configurations_updated_at BEFORE UPDATE ON public.tenant_outreach_configurations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trigger_update_social_connections_updated_at BEFORE UPDATE ON public.tenant_social_media_connections FOR EACH ROW EXECUTE FUNCTION public.update_social_connections_updated_at();

CREATE TRIGGER update_tenant_social_media_connections_updated_at BEFORE UPDATE ON public.tenant_social_media_connections FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tenant_subscriptions_updated_at BEFORE UPDATE ON public.tenant_subscriptions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_tenant_video_connections_updated_at BEFORE UPDATE ON public.tenant_video_connections FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trigger_assign_tr_id_tenants BEFORE INSERT ON public.tenants FOR EACH ROW EXECUTE FUNCTION public.assign_tr_id_tenants();

CREATE TRIGGER update_tenants_timestamp BEFORE UPDATE ON public.tenants FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();

CREATE TRIGGER update_tenants_updated_at BEFORE UPDATE ON public.tenants FOR EACH ROW EXECUTE FUNCTION public.update_tenant_updated_at();

CREATE TRIGGER update_user_dashboard_configs_updated_at BEFORE UPDATE ON public.user_dashboard_configs FOR EACH ROW EXECUTE FUNCTION public.update_dashboard_updated_at();

CREATE TRIGGER update_user_navigation_preferences_updated_at BEFORE UPDATE ON public.user_navigation_preferences FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_user_subscriptions_updated_at BEFORE UPDATE ON public.user_subscriptions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_widget_data_sources_updated_at BEFORE UPDATE ON public.widget_data_sources FOR EACH ROW EXECUTE FUNCTION public.update_dashboard_updated_at();

CREATE TRIGGER update_ai_agents_updated_at BEFORE UPDATE ON public.ai_agents FOR EACH ROW EXECUTE FUNCTION public.update_ai_updated_at();

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


