[Back to interview](../interview.md)

# Communication

<!-- TOC -->
* [Communication](#communication)
  * [🌐 REST API](#-rest-api)
    * [ℹ️ HTTP Methods](#ℹ-http-methods)
      * [ℹ️ PUT vs POST](#ℹ-put-vs-post)
      * [ℹ️ HTTP Status Codes](#ℹ-http-status-codes)
      * [ℹ️ Retry rules](#ℹ-retry-rules)
      * [ℹ️ Idempotency keys (POST safety)](#ℹ-idempotency-keys-post-safety)
    * [ℹ️ API Versioning](#ℹ-api-versioning)
<!-- TOC -->

## 🌐 REST API

### ℹ️ HTTP Methods

> HTTP methods express intent, not implementation.

| Method | 	Purpose                | 	Idempotent | 	Retry-safe | 	Typical usage      |
|--------|-------------------------|-------------|-------------|---------------------|
| GET    | Read data               | ✅           | ✅           | 	Fetch resources    |
| POST   | Create / trigger action | 	❌          | 	❌          | *️Create new entity |
| PUT    | Replace resource        | ✅           | ✅           | Full update         |
| PATCH  | Partial update          | ⚠️ depends	 | ⚠️ depends  | Partial update      |
| DELETE | Remove resource         | ✅           | ✅           | Delete resource     |

*️⚠️ **POST** can be retry-safe only with an idempotency key.

---

#### ℹ️ PUT vs POST

| Aspect             | 	POST       | 	PUT               |
|--------------------|-------------|--------------------|
| Creates resource   | 	✅          | 	✅                 |                     
| Client supplies ID | 	❌          | 	✅                 |                   
| Idempotent         | 	❌	         | ✅                  |                           
| Retry-safe         | 	❌	         | ✅                  |                           
| Typical use        | 	create new | 	create or replace | 

👍 Rule of thumb:  

`POST → “please create something”`  
`PUT → “make this resource look exactly like this”`

---

#### ℹ️ HTTP Status Codes

🔶 **Client errors (4xx)**

| Code  | Name                  | Meaning                        | Retry |
|-------|-----------------------|--------------------------------|-------|
| `400` | 	Bad Request          | 	Invalid syntax / payload      | 	❌    |
| `401` | 	Unauthorized         | 	Missing or invalid auth       | 	❌    |
| `403` | 	Forbidden            | 	Authenticated but not allowed | 	❌    |
| `404` | 	Not Found            | 	Resource does not exist       | 	❌*   |
| `409` | 	Conflict             | 	State/version conflict        | 	❌    |
| `422` | 	Unprocessable Entity | 	Semantic validation failed    | 	❌    |

* `DELETE` on non-existing resource may still be OK.

🔶 **Server errors (5xx)**

| Code | 	Name                  | 	Meaning                 | 	Retry |
|------|------------------------|--------------------------|--------|
| 500  | 	Internal Server Error | 	Unexpected failure      | 	⚠️    |
| 502  | 	Bad Gateway           | 	Upstream failure	       | ✅      |
| 503  | 	Service Unavailable   | 	Overload / maintenance	 | ✅      |
| 504  | 	Gateway Timeout       | 	Upstream timeout	       | ✅      |

✅ Retry with backoff  
✅ Respect Retry-After if present

---

#### ℹ️ Retry rules

> Retry only what is idempotent or transient.  
> Retries should target transient server failures, never client-side validation errors.  
> POST is non-idempotent and risky to retry, while PUT and DELETE are safe to repeat.

📌 **Safe to retry**

✅ Network errors  
✅ Timeouts  
✅ 5xx responses  
✅ Idempotent methods (`GET`, `PUT`, `DELETE`)  

📌 **Dangerous to retry**

❌ `POST` without idempotency key  
❌ Any `4xx` error  
❌ Business validation failures  

---

#### ℹ️ Idempotency keys (POST safety)

To safely retry `POST`:

`Idempotency-Key: <uuid>`

Server must **guarantee**:

- same request → same result
- no duplicate side effects

---

### ℹ️ API Versioning

🔶 **Why version APIs?**

- introduce breaking changes
- keep old clients working
- evolve contracts safely

🔶 **Common strategies**

| Strategy          | Example                   | Pros              | Cons             |
|-------------------|---------------------------|-------------------|------------------|
| URL versioning    | `/api/v1/users`           | 	explicit, simple | 	URL pollution   |
| Header versioning | `Accept: vnd.app.v2+json` | clean URLs        | hard to debug    |
| Query param       | `?version=1`              | easy              | cache-unfriendly |

🔶 **Best practice:**

✅ URL versioning for public APIs  
✅ Version only breaking changes

---
<div style="break-after: page;"></div>

