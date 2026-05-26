# Security Spec

## 1. Data Invariants
1. A User document must only be creatable and updatable by the user whose UID matches the document ID. Email must match auth token, and they must be email_verified unless they are an anonymous/new signup without it required (Actually, we enforce email_verified for all).
2. A Document must belong to `/users/{userId}/documents/{documentId}` and the `userId` field must match path `userId` and `request.auth.uid`.
3. A VerifiedProfile must belong to `/users/{userId}/profile/verified` and its `userId` field must match `userId` and `request.auth.uid`.
4. Only the owner can read their own documents and profile.

## 2. Dirty Dozen Payloads
1. User creation with ID mismatch (Spoofed ID).
2. User creation with unverified email.
3. User update adding a random ghost field `isAdmin: true`.
4. User creation missing required `createdAt` field.
5. User update modifying the immutable `createdAt` field.
6. Document creation where `userId` doesn't match the path.
7. Document creation with huge ID payload > 128 chars.
8. Document update omitting required fields via a set/update gap.
9. Profile creation where `userId` doesn't match `request.auth.uid`.
10. Reading someone else's document.
11. Reading someone else's profile.
12. Listing another user's documents.
