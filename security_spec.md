# GhostLink Security Specification

## 1. Data Invariants
- A `Project` must have a valid `ownerId` matching the creator's UID.
- `Activity` entries must be linked to an existing `Project` or be global system alerts.
- `users` documents can only be written by the matching Auth UID.
- Terminal project statuses (archived, completed) lock the document from further non-admin edits.
- All timestamps must be server-validated.

## 2. The Dirty Dozen Payloads

### Payload 1: Unauthorized Profile Hijack
**Description:** User A tries to overwrite User B's profile.
**Path:** `/users/userB`
**Data:** `{ "userId": "userB", "email": "attacker@evil.com", "role": "admin" }`
**Expectation:** `PERMISSION_DENIED` (UID mismatch).

### Payload 2: Self-Promotion to Admin
**Description:** New user tries to set `role: "admin"` during creation.
**Path:** `/users/newSelf`
**Data:** `{ "userId": "newSelf", "email": "me@here.com", "role": "admin" }`
**Expectation:** `PERMISSION_DENIED` (Only existing admins can grant admin role, or defaults to user).

### Payload 3: Orphaned Project
**Description:** Create project with `ownerId` mismatching request auth.
**Path:** `/projects/proj1`
**Data:** `{ "title": "Steal", "ownerId": "targetUser", "status": "active", "members": ["targetUser"] }`
**Expectation:** `PERMISSION_DENIED`.

### Payload 4: Ghost Project Field
**Description:** Injecting `isVerified: true` into a project.
**Path:** `/projects/proj1` (Update)
**Data:** `{ "isVerified": true }`
**Expectation:** `PERMISSION_DENIED` (affectedKeys().hasOnly constraint).

### Payload 5: Rapid Message Spam
**Description:** Message with non-server timestamp.
**Path:** `/chat/messages/entries/msg1`
**Data:** `{ "text": "spam", "userId": "me", "timestamp": "2030-01-01T00:00:00Z" }`
**Expectation:** `PERMISSION_DENIED` (timestamp mismatch with request.time).

### Payload 6: Identity Email Spoofing
**Description:** Set email to admin address without `email_verified: true`.
**Action:** Any admin-gated read/write.
**Expectation:** `PERMISSION_DENIED`.

### Payload 7: Terminal State Bypass
**Description:** Updating a 'completed' project.
**Path:** `/projects/finished_proj`
**Data:** `{ "status": "active" }`
**Expectation:** `PERMISSION_DENIED` (Terminal state locking).

### Payload 8: Excessive ID Length
**Description:** Documentation project with 2MB string as ID.
**Path:** `/projects/[2MB_STRING]`
**Expectation:** `PERMISSION_DENIED` (isValidId length check).

### Payload 9: PII Leak - Unauthorized READ
**Description:** User A tries to list all user documents in `/users`.
**Expectation:** `PERMISSION_DENIED` (No blanket reads).

### Payload 10: Array Bloating
**Description:** Adding 10,000 members to a project.
**Data:** `{ "members": ["u1", "u2", ..., "u10000"] }`
**Expectation:** `PERMISSION_DENIED` (List size constraint).

### Payload 11: System Field Poisoning
**Description:** User tries to edit `aiSummary` field in a project (hypothetical system field).
**Expectation:** `PERMISSION_DENIED`.

### Payload 12: Invalid Type Injection
**Description:** Sending a number for `title` field.
**Data:** `{ "title": 12345 }`
**Expectation:** `PERMISSION_DENIED` (Type matching).

## 3. Test Runner (Draft)
```typescript
// firestore.rules.test.ts logic would go here
// verifying the above scenarios against the rules.
```
