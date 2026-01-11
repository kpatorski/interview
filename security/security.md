[Back to interview](../interview.md)

# Security

<!-- TOC -->
* [Security](#security)
  * [JWT - JSON Web Token](#jwt---json-web-token)
    * [Questions](#questions)
  * [Encryption](#encryption)
    * [SSL / TLS](#ssl--tls)
  * [Keystore](#keystore)
  * [Truststore](#truststore)
  * [Public vs private key](#public-vs-private-key)
  * [CORS](#cors)
  * [OAuth](#oauth)
  * [LDAP](#ldap)
  * [Authorization](#authorization)
  * [Authentication](#authentication)
<!-- TOC -->

## JWT - JSON Web Token

JWT (JSON Web Token) is a self-contained token used to transfer information about a user or a session in a way that is:

- **cryptographically signed** → guarantees integrity (i.e. no one has modified it),
- **not encrypted** (unless you use JWE).

JWT is mainly used for:
- authentication,
- authorization,
- delegating access between services.

It is a lightweight alternative to sessions — **no state is stored on the server**.

---

ℹ️ **What does a JWT consist of?**

`header.payload.signature`

**Header**

Contains metadata: the algorithm and token type:

```json
{
  "alg": "RS256",
  "typ": "JWT"
}
```

**Payload**

Contains claims — information about the user and the token:

```json
{
  "sub": "123456",
  "name": "John Doe",
  "iat": 1710000000,
  "exp": 1710003600,
  "role": "ADMIN"
}
```

**Signature**

The cryptographic signature is created from:

```java
HMACSHA256(
    base64UrlEncode(header) + "." + base64UrlEncode(payload),
    secretKey
)
```

---

ℹ️ **How does encryption relate to this?**

JWT is **<span style='color:firebrick'>NOT</span>** encrypted.  
It is **<span style='color:forestgreen'>only</span>** signed.

That means:

- ⚠️ anyone can read the payload,
- ✅ but no one can modify it without breaking the signature.

If you want to encrypt the token → use **JWE** (JSON Web Encryption).  
In that case, the payload element is encrypted and unreadable.
---

ℹ️ **Who creates JWTs?**

JWTs are created by an Authorization Server, for example:
- Keycloak
- Auth0
- Google, Apple, GitHub (OIDC / OAuth2 providers)
- Your backend (e.g. Spring Security + a custom issuer)

**Process**:

1. The user logs in
2. The server verifies the password / OIDC provider,
3. The server generates a JWT and signs it with a private key,
4. The client (frontend/mobile) uses the JWT in Authorization: Bearer.

⚠️ The backend should not generate JWTs arbitrarily on its own.
This is the responsibility of the Authorization Server.

---

ℹ️ **Why is JWT used?**

✅ User authentication

After logging in, the client receives an access token — a JWT — which it uses to identify itself with every request.

✅ Authorization

JWT can contain roles, permissions, and scopes.

✅ Access delegation (OAuth2)

API A can send a JWT to API B without requiring the user to log in again.

✅ Statelessness

The server does not store sessions → **no need** for:

- sticky sessions,
- session replication,
- storing sessions in Redis.

✅ Speed and scalability

The backend verifies the signature locally, without querying the database.

✅ Communication between microservices

Each service can verify the JWT signature and trust its claims.

---

🧨 **Most common mistakes a senior should catch immediately**

- Storing JWT in localStorage → vulnerable to XSS.
- JWT without expiration → a security killer.
- Putting personal data into JWT ("because nobody can read it") → wrong.
- No key rotation (JWKS).
- Leaving Access-Control-Allow-Origin: * together with credentials → not allowed.
- Using OAuth2 for login without OIDC (empty id_token).
- Sending refresh tokens via JavaScript → they should be stored in httpOnly secure cookies.
- Disabling TLS in dev/prod "because it’s easier".

---

### Questions

---
<div style="break-after: page;"></div>

## Encryption

---
<div style="break-after: page;"></div>

### SSL / TLS

---
<div style="break-after: page;"></div>

## Keystore

---
<div style="break-after: page;"></div>

## Truststore

---
<div style="break-after: page;"></div>

## Public vs private key

---
<div style="break-after: page;"></div>

## CORS

---
<div style="break-after: page;"></div>

## OAuth

---
<div style="break-after: page;"></div>

## LDAP

---
<div style="break-after: page;"></div>

## Authorization

---
<div style="break-after: page;"></div>

## Authentication

---
<div style="break-after: page;"></div>