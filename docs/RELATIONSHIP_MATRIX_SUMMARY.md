# TotalRecall Relationship Matrix Summary

This summary accompanies `docs/RELATIONSHIP_MATRIX.csv` and provides
the quantitative overview of the complete scope.

## Counts (current)

- Consolidated features: 72
  - Implemented: 32
  - In development: 0
  - Planned: 40
  - Deprecated: 0
- Core platform capabilities: 15
- Apps (modules): 68
- Module-to-feature seed mappings: 17

## Consolidated Feature Status (UI-aligned)

Mapping used for UI status chips:
- Live = Implemented
- Testing = In development
- Planning = Planned

Current UI-aligned counts:
- Live: 32
- Testing: 0
- Planning: 40

## Implementation Status & Audit Scope

Implementation status and audit scope are recorded per row in
`docs/RELATIONSHIP_MATRIX.csv`:
- `status` = lifecycle state (implemented / in_development / planned / deprecated)
- `implementation_level` = completeness (complete / partial / metadata)
- `scope` = audit depth (full_e2e / safety_only / mapping)


## Sources of Truth

- Apps (modules): `system_modules` table (Supabase)
- Standard features + AI capabilities: `src/services/moduleFeatureLibrary.ts`
- Consolidated feature library: `src/services/consolidatedFeatureLibrary.ts`
- Unified feature system metadata counts: `src/services/unifiedFeatureSystem.ts`
- Module-to-feature mappings (seeded): `feature_mapping_setup.sql`, `feature_mapping_minimal.sql`

## Notes

- The relationship matrix uses the consolidated, de-duplicated feature list as the authoritative UI catalog.
- Status and implementation level in the CSV reflect the current system intent
  and known development stage (implemented / testing / in_development / planning).
- Safety-only scope indicates areas that should be audited for isolation,
  gating, and security even if not fully implemented.
