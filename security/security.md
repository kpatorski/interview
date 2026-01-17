[Back to interview](../interview.md)

# Security

<!-- TOC -->
* [Security](#security)
  * [JWT - JSON Web Token](#jwt---json-web-token)
    * [ℹ️ What does a JWT consist of?](#ℹ-what-does-a-jwt-consist-of)
    * [ℹ️ How does encryption relate to this?](#ℹ-how-does-encryption-relate-to-this)
    * [ℹ️ Who creates JWTs?](#ℹ-who-creates-jwts)
    * [ℹ️ Why is JWT used?](#ℹ-why-is-jwt-used)
    * [ℹ️ JWT vs JWS vs JWE — how they relate](#ℹ-jwt-vs-jws-vs-jwe--how-they-relate)
      * [🔶 JWT — the umbrella concept](#-jwt--the-umbrella-concept)
      * [🔶 JWS — Signed JWT (most common case)](#-jws--signed-jwt-most-common-case)
      * [🔶 JWE — Encrypted JWT](#-jwe--encrypted-jwt)
    * [🧨 Most common mistakes a senior should catch immediately](#-most-common-mistakes-a-senior-should-catch-immediately)
    * [Questions](#questions)
  * [Encryption](#encryption)
    * [ℹ️ What is encryption?](#ℹ-what-is-encryption)
    * [ℹ️ What types of encryption exist?](#ℹ-what-types-of-encryption-exist)
      * [🔶 Symmetric encryption](#-symmetric-encryption)
      * [🔶 Asymmetric encryption](#-asymmetric-encryption)
    * [ℹ️ How does it work in practice?](#ℹ-how-does-it-work-in-practice)
      * [🔶 Asymmetric encryption (public / private keys)](#-asymmetric-encryption-public--private-keys)
        * [🔹 Encryption](#-encryption)
        * [🔹 Digital signature (not the same as encryption)](#-digital-signature-not-the-same-as-encryption)
      * [🔶 Symmetric encryption (shared secret key)](#-symmetric-encryption-shared-secret-key)
        * [🔹 Encryption and decryption](#-encryption-and-decryption)
        * [🔹 Integrity and authentication (optional)](#-integrity-and-authentication-optional)
        * [🔹 Authenticated encryption (AEAD)](#-authenticated-encryption-aead)
      * [🔶 Why both are used together](#-why-both-are-used-together)
      * [🔶 Typical real-world flow (example: TLS)](#-typical-real-world-flow-example-tls)
      * [🔶 Key takeaway](#-key-takeaway)
    * [ℹ️ 🔐 Encryption vs ✍️ Digital Signature](#ℹ--encryption-vs--digital-signature)
      * [🔶 Encryption](#-encryption-1)
      * [🔶 Digital Signature](#-digital-signature)
      * [🔶 Examples](#-examples)
    * [ℹ️ Why all this? (Goals of encryption)](#ℹ-why-all-this-goals-of-encryption)
    * [ℹ️ Who creates the keys?](#ℹ-who-creates-the-keys)
    * [SSL / TLS](#ssl--tls)
      * [ℹ️ What is it?](#ℹ-what-is-it)
      * [ℹ️ How it works (Simplified)](#ℹ-how-it-works-simplified)
      * [ℹ️ Key Functions](#ℹ-key-functions)
      * [ℹ️ SSL vs. TLS](#ℹ-ssl-vs-tls)
    * [Questions](#questions-1)
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

### ℹ️ What does a JWT consist of?

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

### ℹ️ How does encryption relate to this?

JWT is **<span style='color:firebrick'>NOT</span>** encrypted.  
It is **<span style='color:forestgreen'>only</span>** signed.

That means:

- ⚠️ anyone can read the payload,
- ✅ but no one can modify it without breaking the signature.

If you want to encrypt the token → use **JWE** (JSON Web Encryption).  
In that case, the payload element is encrypted and unreadable.
---

### ℹ️ Who creates JWTs?

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

### ℹ️ Why is JWT used?

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

### ℹ️ JWT vs JWS vs JWE — how they relate

#### 🔶 JWT — the umbrella concept

JWT (JSON Web Token) is a token format, not a cryptographic mechanism.

JWT defines:

- the data structure
- the serialization format
- standard claims (e.g. sub, exp, iss)

A JWT can be:

- signed → **JWS**
- encrypted → **JWE**

signed and encrypted → JWS wrapped in JWE

#### 🔶 JWS — Signed JWT (most common case)

🔐 JWS = JWT + digital signature

This is what most people mean when they say “JWT”.

JWS structure

> header.payload.signature

- header → signing algorithm (RS256, ES256, HS256)
- payload → claims (sub, exp, roles, etc.)
- signature → digital signature

What does JWS provide?

✅ Integrity  
✅ Authentication  
✅ Non-repudiation  
❌ Confidentiality (the payload is readable, only Base64URL-encoded)  

⚠️ Base64 ≠ encryption

Example JWS

`eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjMiLCJyb2xlIjoiQURNSU4ifQ.<signature>`

Anyone can:

- read the payload
- verify the signature

But no one can modify the token without breaking the signature.

#### 🔶 JWE — Encrypted JWT

🔐 JWE = JWT + encryption

JWE hides the payload — the token contents are unreadable.

JWE structure (5 parts)

> header.encryptedKey.iv.ciphertext.tag

| Part         | Meaning                   |
|--------------|---------------------------|
| header       | encryption algorithms     |
| encryptedKey | encrypted symmetric key   |
| iv           | initialization vector     |
| ciphertext   | encrypted payload         |
| tag          | authentication tag (AEAD) |


📌 This is NOT header.payload.signature

What does JWE provide?

✅ Confidentiality  
✅ Integrity  
✅ Authentication (cryptographic)  
❌ Non-repudiation (by itself)  

---

### 🧨 Most common mistakes a senior should catch immediately

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

**Question 1**: What is JWT made of?

1. **Header**
   Typically consists of two parts: the type of the token (JWT) and the signing algorithm being used, such as HMAC SHA256 (HS256) or RSA (RS256).  
   Example: `{"alg": "HS256", "typ": "JWT"}`
2. **Payload**
   The payload contains the claims, which are statements about an entity (typically the user) and additional data. Claims are divided into three types:
   - **Registered claims**: Standard claims like issuer (iss), expiration time (exp), and subject (sub).
   - **Public claims**: Custom claims defined by the application.
   - **Private claims**: Custom claims used to share information between parties.
3. **Signature**
   The signature is used to verify that the token has not been tampered with. 
   It is created by taking the encoded header, the encoded payload, and a secret key, then signing them using the algorithm specified in the header.

**Question 2**: Why is JWT considered as secure?

JWTs are considered secure because they use cryptographic signatures to **<span style='color:cornflowerblue'>ensure integrity</span>** and **<span style='color:cornflowerblue'>authenticity</span>**, **<span style='color:cornflowerblue'>preventing tampering</span>**; they are self-contained, allowing stateless authentication; and the signature verifies the sender, ensuring the server trusts the token's claims without needing a database lookup on every request.

**Question 3**: What is the JWT used for?

They are used for **<span style='color:cornflowerblue'>securely transmitting information</span>** between parties as a compact, primarily **<span style='color:cornflowerblue'>for authentication and authorization</span>** in APIs, enabling stateless, scalable systems like microservices and Single Sign-On (SSO) by carrying user identity and permissions directly in the token, avoiding server-side session storage.  
They act like a digital ⭕️"**wristband**"⭕️, **verifying identity** and **authorized** actions without repeated database lookups, ensuring data integrity through cryptographic signatures.

---
<div style="break-after: page;"></div>

## Encryption

### ℹ️ What is encryption?

Encryption is the process of transforming readable data (plaintext) into unreadable data (ciphertext) using a cryptographic key.

The goal is to ensure:

- **Confidentiality** → no one except the authorized recipient can read the data
- (sometimes) **Integrity** and **Authentication**, if the algorithm supports it

In web systems, encryption is a foundation of:
- HTTPS / TLS
- JWE
- data storage
- data exchange between services

---
### ℹ️ What types of encryption exist?

There are two basic types:

#### 🔶 Symmetric encryption

🔑 Uses a **single** shared key -> **the same key** is used for encryption and decryption

Example algorithms: 
- `AES-128 / AES-256`
- `ChaCha20`

Use cases:

- database encryption
- file encryption
- part of JWE operations
- internal systems

✅ Pros: fast, efficient  
⚠️ Cons: key distribution problem (the key must be securely shared with the other party)

#### 🔶 Asymmetric encryption

Uses two different keys:

🔑 Public Key – can be shared with anyone  
🔐 Private Key – must remain secret

Mechanism:  
`encryption → 🔑 public key`  
`decryption → 🔐 private key`

Example algorithms:

- RSA
- ECC (e.g. ES256, ES512)

Use cases:

- TLS / certificates
- digital signatures
- JWT signing (RS256, ES256)
- SSH
- PGP keys

✅ Pros: secure data exchange over the Internet  
⚠️ Cons: slower than symmetric encryption  

---

### ℹ️ How does it work in practice?

#### 🔶 Asymmetric encryption (public / private keys)
##### 🔹 Encryption

The sender encrypts the message using the recipient’s public key. 

❗**Only** the **recipient** can decrypt it (they own the private key)

`🔑 Public Key (recipient)  → encrypts`  
`🔐 Private Key (recipient) → decrypts`  

> Alice (sender) encrypts a message using Bob’s public key  
> Bob (receiver) decrypts it using his private key

Purpose:

- secure key exchange
- secure delivery of secrets over the Internet

##### 🔹 Digital signature (not the same as encryption)

`🔐 Private Key → signs`    
`🔑 Public Key  → verifies`  

> Bob signs a message with her private key  
> Alice can verify it using Bob’s public key

Provides:

- integrity
- authentication
- non-repudiation

This is exactly what JWT (JWS) does with RS256 / ES256 algorithms.

#### 🔶 Symmetric encryption (shared secret key)

##### 🔹 Encryption and decryption

Both parties use the same shared 🔏secret key🔏

The key must be known to both sides in advance

`🔏 Shared Secret Key → encrypts`   
`🔏 Shared Secret Key → decrypts`  

Key characteristics:

❌ no public/private key pair 🔑/🔐  
✅ very fast and efficient  
⚠️ security depends entirely on key secrecy

##### 🔹 Integrity and authentication (optional)

Symmetric encryption alone provides confidentiality only.

To ensure integrity and authentication, systems use:

- MAC (Message Authentication Code)
- HMAC (e.g. HMAC-SHA256)

Mechanism:

> Sender creates a MAC using the shared key 🔏  
> Recipient recomputes and verifies the MAC  

```
🔏 Shared Secret Key → encrypts data  
🔏 Shared Secret Key → creates MAC  
🔏 Shared Secret Key → verifies MAC
```

If verification succeeds:

- the message was not modified
- the sender knew the shared secret

##### 🔹 Authenticated encryption (AEAD)

Modern systems prefer **AEAD** modes, which combine:

- encryption
- integrity
- authentication

in a single operation.

Examples:

- AES-GCM
- ChaCha20-Poly1305

These modes eliminate the need for a separate MAC.

#### 🔶 Why both are used together

Each approach solves a different problem:

| Problem                               | Solution              |
|---------------------------------------|-----------------------|
| Secure key exchange over the Internet | Asymmetric encryption |
| Fast encryption of large data         | Symmetric encryption  |
| Identity verification                 | Digital signatures    |
| Message integrity                     | Signatures / MAC      |


#### 🔶 Typical real-world flow (example: TLS)

1. Client connects to server
2. Server presents its public key (certificate)
3. Asymmetric cryptography is used to:
   1. authenticate the server
   2. securely exchange a secret
4. Both sides derive a shared session key
5. All further communication uses symmetric encryption (AES / ChaCha20)

#### 🔶 Key takeaway

**Asymmetric cryptography answers:**
> “Who are you and how do we safely exchange secrets?”

**Symmetric cryptography answers:**
> “How do we efficiently protect large amounts of data?”

---


### ℹ️ 🔐 Encryption vs ✍️ Digital Signature

#### 🔶 Encryption

Question encryption answers:
> “Can an unauthorized party read the data?”

What does it do?

- Hides the content of data
- Transforms plaintext → ciphertext
- Protects CONFIDENTIALITY

Who can read the data?

Only the owner of the **<span style='color:green'>private</span>** key 🔐

What does it provide?

✅ Confidentiality  
❌ Integrity (without additional mechanisms)  
❌ Authentication  
❌ Non-repudiation  

#### 🔶 Digital Signature

Question a digital signature answers:
> “Who created the data and has it been modified?”

What does it do?

- Does NOT hide the data
- Creates proof of authorship and integrity
- Protects INTEGRITY, AUTHENTICATION, NON-REPUDIATION

Who can verify the signature?

Anyone who has the sender’s **<span style='color:green'>public</span>** key 🔑

What does it provide?

❌ Confidentiality  
✅ Integrity  
✅ Authentication  
✅ Non-repudiation  

#### 🔶 Examples

- **JWT**
  - JWS (RS256 / ES256) → digital signature (integrity + authentication)
  - JWE → encryption (confidentiality)

- **TLS**
  - Certificate → CA signature (trust)
  - Handshake → signatures + asymmetric crypto
  - Session → symmetric encryption

---


### ℹ️ Why all this? (Goals of encryption)

✅ Confidentiality  

Data is unreadable to intruders 😈

✅ Integrity  

Data has not been modified ✍🏻 (digital signature, MAC). 

✅ Authentication  

I can prove I am communicating with:

- a real server (TLS certificate),
- a real user (JWT signature),
- a real application (mTLS).

✅ Non-repudiation  
The sender cannot deny having signed the data with their private key.

---


### ℹ️ Who creates the keys?

It depends on the context.

✔ **TLS / HTTPS**  

Keys are generated by:
- the server → generates its own key pair (private/public)
- the CA → signs the public certificate

✔ **JWT (RS256 / ES256)**

Keys are created by the Authorization Server, e.g.:

- Keycloak
- OAuth2 Authorization Server in Spring Security
- Auth0
- Google Identity

The user never creates JWT keys — the issuer does.

✔ **JWE (encrypted JWT)**

Anyone encrypting a token needs the recipient’s public key.

✔ **SSH**

Keys are generated by the user (ssh-keygen).

---
<div style="break-after: page;"></div>

### SSL / TLS

#### ℹ️ What is it?

**SSL/TLS (Secure Sockets Layer/Transport Layer Security)** are cryptographic protocols that secure internet communication, providing privacy, authentication, and data integrity between a client (like a web browser) and a server, often seen as HTTPS.
While SSL was the original protocol, it has been replaced by the more secure and modern TLS, but the term "SSL" is still commonly used to refer to the technology. 
It works by establishing an encrypted connection using certificates, preventing eavesdropping and tampering with sensitive data like passwords and payment info.

---

#### ℹ️ How it works (Simplified)

1. **Handshake**: Your browser 🖥️ connects to a website 🌐, and the server 🗄️ sends its **SSL/TLS** certificate 🪪.
2. **Verification**: Your browser 🖥️ verifies the certificate 🪪 to ensure the site is legitimate.
3. **Key Exchange**: Using public-key 🔑 (asymmetric) encryption, the client and server securely agree on a shared secret key🔏.
4. **Encrypted Communication**: All subsequent data is encrypted and decrypted using that shared secret key🔏 (symmetric encryption), making it unreadable to outsiders.

---

#### ℹ️ Key Functions

✅ **Privacy**: Encrypts data so only the intended recipient can read it.  
✅ **Authentication**: Verifies the identity of the website or server.  
✅ **Integrity**: Ensures data hasn't been altered in transit.  

---

#### ℹ️ SSL vs. TLS

- SSL (Secure Sockets Layer): The older, now deprecated protocol with security vulnerabilities.
- TLS (Transport Layer Security): The current, updated, and more secure standard, with versions like TLS 1.2 and 1.3 actively used.
- Interchangeable Terms: Most services offering "SSL" today actually provide TLS encryption due to its widespread adoption and security, notes Amazon Web Services.

--- 
<div style="break-after: page;"></div>

### Questions

**Question 1**: What is the difference between symmetric and asymmetric encryption?  
**Question 2**: What is TLS?

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