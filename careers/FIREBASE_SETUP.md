# Job Application Backend — Firebase

`careers/apply.html` uses Firebase (project `wds-jobs`) for three things:

1. **Firestore** — stores every submitted application in an `applications`
   collection.
2. **Firebase Auth (Google Sign-In)** — gates the admin dashboard
   (`careers/apply.html#admin`) so only approved Google accounts can read
   applicant data.
3. **Firebase Storage** — holds uploaded resumes. Applicants can upload
   but never read them back; only admins can open one, and only on
   demand from the dashboard.

The web app config (`apiKey`, `authDomain`, etc., near the top of
`apply.html`) is safe to be public — it just tells the browser which
Firebase project to talk to. It is **not** a secret and is not how access
is controlled. Real enforcement happens in the Firestore security rules
below, which run on Google's servers and can't be bypassed by anything a
visitor does in their browser.

## One-time setup already done (in the Firebase console)

- Created project `wds-jobs`
- Enabled **Firestore Database** (Standard, production mode)
- Enabled **Authentication → Google** sign-in provider
- Registered a Web App and copied its config into `apply.html`

## Still needed: publish the security rules

This is the step that actually locks applicant data down to admins only.
Without it, Firestore's production-mode default (deny everything) means
*nothing* works yet — applicants can't even submit.

1. Firebase console → your project → **Firestore Database → Rules** tab
2. Replace whatever's there with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /applications/{appId} {
      // Anyone can submit an application — no login required.
      allow create: if true;

      // Only signed-in, verified accounts on the admin allowlist can
      // read applications. Keep this list in sync with
      // ALLOWED_ADMIN_EMAILS in careers/apply.html.
      allow read: if request.auth != null
                  && request.auth.token.email_verified == true
                  && request.auth.token.email in [
                       "tori@wdsinc.net",
                       "info@wdsinc.net"
                     ];

      // No edits or deletes from the client — applications are
      // append-only from the browser's side.
      allow update, delete: if false;
    }
  }
}
```

3. Click **Publish**.

## Also needed: enable Storage + publish its rules (for resumes)

1. Firebase console → your project → left sidebar → **Build → Storage** →
   **Get started** (accept the default bucket location)
2. Go to the **Rules** tab on that same Storage page, replace the default
   with:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /resumes/{position}/{fileName} {
      // Applicants can upload (size-capped at 10MB), but never read
      // resumes back — only admins can.
      allow write: if request.resource.size < 10 * 1024 * 1024;

      allow read: if request.auth != null
                  && request.auth.token.email_verified == true
                  && request.auth.token.email in [
                       "tori@wdsinc.net",
                       "info@wdsinc.net"
                     ];
    }
  }
}
```

3. Click **Publish**.

Without this, resume uploads will fail (falling back to a "Resume upload
failed — applicant should be asked to resend" flag on the application —
the rest of the application still saves fine either way, so a resume
hiccup never loses the whole submission).

## Adding or removing admins

Three places have to stay in sync:

- `ALLOWED_ADMIN_EMAILS` near the top of `careers/apply.html` (controls
  what the UI shows/hides)
- The `email in [...]` list in the Firestore rules (applications)
- The `email in [...]` list in the Storage rules (resumes)

Only Google accounts already signed in with Google can be admins — there's
no separate password to manage. If someone leaves or shouldn't have
access anymore, remove their email from both places.

## Why this is a real security boundary (unlike the old Sheets approach)

The previous Google Sheets version relied on a "shared key" baked into
the page's JavaScript — anyone who opened dev tools could read it and
call the backend directly, bypassing the UI entirely. Firestore rules
don't have that problem: they're evaluated by Google's servers against
the requester's cryptographically verified identity (their signed-in
Google account), not against anything the browser sends that could be
copied out of the page source. Reading the code doesn't get you in.
