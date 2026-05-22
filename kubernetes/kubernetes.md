[Back to interview](../interview.md)

# 🚀 Kubernetes

<!-- TOC -->
* [🚀 Kubernetes](#-kubernetes)
  * [📘 What is Kubernetes?](#-what-is-kubernetes)
  * [🏗 Cluster Architecture](#-cluster-architecture)
    * [Control Plane](#control-plane)
      * [kube-apiserver](#kube-apiserver)
      * [etcd](#etcd)
      * [kube-scheduler](#kube-scheduler)
      * [kube-controller-manager](#kube-controller-manager)
    * [Worker Node](#worker-node)
      * [kubelet](#kubelet)
      * [kube-proxy](#kube-proxy)
      * [container runtime](#container-runtime)
  * [🔄 Reconciliation Loop (Core Concept)](#-reconciliation-loop-core-concept)
  * [🧱 Core Objects](#-core-objects)
    * [Pod](#pod)
    * [Deployment](#deployment)
    * [ReplicaSet](#replicaset)
    * [StatefulSet](#statefulset)
    * [Service](#service)
    * [Ingress](#ingress)
  * [🩺 Health Probes](#-health-probes)
  * [🌐 Networking](#-networking)
    * [Flat Network Model](#flat-network-model)
    * [CNI (Container Network Interface)](#cni-container-network-interface)
  * [⚙️ Configuration and Secrets](#-configuration-and-secrets)
    * [ConfigMap](#configmap)
    * [Secret](#secret)
    * [Injecting config into containers](#injecting-config-into-containers)
  * [💻 Resource Management](#-resource-management)
    * [Requests and Limits](#requests-and-limits)
  * [🗂 Namespace](#-namespace)
  * [💾 Storage](#-storage)
    * [PersistentVolume (PV)](#persistentvolume-pv)
    * [PersistentVolumeClaim (PVC)](#persistentvolumeclaim-pvc)
    * [StorageClass](#storageclass)
  * [📈 Scaling — HPA](#-scaling--hpa)
  * [🔄 Updates and Rollbacks](#-updates-and-rollbacks)
  * [⛵ Helm](#-helm)
  * [🔐 Vault + ESO](#-vault--eso)
  * [📨 Kafka on Kubernetes](#-kafka-on-kubernetes)
  * [🛡 Security](#-security)
    * [RBAC](#rbac)
    * [ServiceAccount](#serviceaccount)
    * [SecurityContext](#securitycontext)
  * [💻 kubectl Reference](#-kubectl-reference)
    * [kubectl apply vs create vs replace](#kubectl-apply-vs-create-vs-replace)
    * [Common diagnostics](#common-diagnostics)
    * [Common errors](#common-errors)
  * [🧠 Mental Model](#-mental-model)
<!-- TOC -->

---

## 📘 What is Kubernetes?

Kubernetes (K8s) is a container orchestration platform that enables:

- Running containerized applications
- Horizontal scaling
- Zero-downtime updates
- Automatic restarts
- Network management
- Storage management
- Separation of configuration from code

Kubernetes operates using a **declarative model**.

Instead of issuing commands like:

> Run this container on that machine

you declare:

> I want 3 instances of this application

The system continuously ensures that the actual state matches the declared state.

---

## 🏗 Cluster Architecture

A Kubernetes cluster consists of **Control Plane** (the brain) and **Worker Nodes** (the workers).

### Control Plane

The Control Plane manages the entire cluster.

#### kube-apiserver

- Central entry point — everything communicates through it (kubectl, other components)
- Exposes REST API
- Validates and persists resources in etcd

#### etcd

- Distributed key-value store
- Stores the entire cluster state
- Single source of truth — if etcd dies, the cluster doesn't know what it's doing

#### kube-scheduler

- Decides which Node a new Pod runs on
- Considers available resources, affinity rules, taints

#### kube-controller-manager

- Collection of control loops — one per resource type
- Each loop: read desired state → read actual state → correct the difference
- Example: Deployment controller recreates a Pod the moment it dies

### Worker Node

A Node is a machine (VM or physical) that runs containers.

#### kubelet

- Agent on every node
- Receives instructions from API Server and manages containers

#### kube-proxy

- Manages network routing
- Implements Service load balancing via iptables/IPVS

#### container runtime

- e.g., containerd
- Actually pulls images and runs containers

---

## 🔄 Reconciliation Loop (Core Concept)

Every controller operates according to this pattern:

1. Read desired state (from API)
2. Read actual state
3. If they differ — take corrective action
4. Repeat indefinitely

If a Deployment declares 3 replicas and one crashes, the controller creates a new one.
Kubernetes continuously reconciles the system state — this is the foundation of self-healing.

---

## 🧱 Core Objects

### Pod

The smallest deployable unit. Wraps one (or more) containers.

- Containers in a Pod share networking and storage
- Has its own IP address
- **Ephemeral** — if a Pod dies, it does not come back by itself
- Almost never created directly — use Deployment instead

### Deployment

Describes the *desired state*: "always keep 2 replicas of this image running."
Creates and manages Pods via ReplicaSets.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: order-service
  namespace: bookstore
spec:
  replicas: 2
  selector:
    matchLabels:
      app: order-service         # must match Pod labels below
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1                # allow 1 extra Pod above replicas during update
      maxUnavailable: 0          # never go below replicas count → zero downtime
  template:
    metadata:
      labels:
        app: order-service
    spec:
      containers:
        - name: order-service
          image: bookstore/order-service:1.0.0
          imagePullPolicy: Never
          ports:
            - containerPort: 8082
          resources:
            requests:
              memory: "256Mi"
              cpu: "250m"        # 250 milicores = 0.25 CPU core
            limits:
              memory: "512Mi"
              cpu: "500m"
          envFrom:               # inject ALL keys from ConfigMap / Secret as env vars
            - configMapRef:
                name: order-service-config
            - secretRef:
                name: order-service-secret
```

**Rolling Update — how it works** (`replicas: 2`, `maxSurge: 1`, `maxUnavailable: 0`):

```
Start:   [v1] [v1]
Step 1:  [v1] [v1] [v2]   ← new Pod started, wait for Readiness Probe
Step 2:  [v1] [v2]        ← remove old (maxUnavailable=0 satisfied — v2 is ready)
Step 3:  [v1] [v2] [v2]   ← start next new Pod
Step 4:  [v2] [v2]        ← remove last old. Done. Zero downtime throughout.
```

The old ReplicaSet is **not deleted** — K8s keeps history for rollbacks.

### ReplicaSet

Maintains a specified number of Pods. If count drops — creates new ones.
You almost never create ReplicaSets directly; Deployment manages them.

### StatefulSet

For stateful applications (databases, Kafka brokers).

Provides:
- Stable, predictable Pod names (`kafka-0`, `kafka-1` instead of random hashes)
- Persistent identity across restarts
- Dedicated PVC per Pod

### Service

Pods have dynamic IPs that change on every restart. **Service** solves this —
a stable virtual IP (ClusterIP) and DNS name that always routes to live Pods
matching the selector label.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: book-service
  namespace: bookstore
spec:
  selector:
    app: book-service       # route to Pods with this label
  ports:
    - port: 80              # Service port (what other services connect to)
      targetPort: 8081      # container port
  type: ClusterIP
```

**Service types:**

| Type           | Access                                     | When                             |
|----------------|--------------------------------------------|----------------------------------|
| `ClusterIP`    | inside cluster only                        | service-to-service communication |
| `NodePort`     | via `<node-ip>:<port>` from outside        | testing, dev                     |
| `LoadBalancer` | cloud load balancer (AWS ALB, GCP LB)      | production in cloud              |
| `Headless`     | no ClusterIP, DNS returns Pod IPs directly | StatefulSets, Kafka              |

**DNS** — every Service gets an automatic DNS name:
```
<service-name>.<namespace>.svc.cluster.local
book-service.bookstore.svc.cluster.local     ← full FQDN
book-service                                  ← short form (same namespace)
```

### Ingress

Exposes applications outside the cluster via HTTP routing.

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: bookstore-ingress
  namespace: bookstore
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /$2
spec:
  ingressClassName: nginx
  rules:
    - host: bookstore.local
      http:
        paths:
          - path: /books(/|$)(.*)
            pathType: ImplementationSpecific
            backend:
              service:
                name: book-service
                port:
                  number: 80
          - path: /orders(/|$)(.*)
            pathType: ImplementationSpecific
            backend:
              service:
                name: order-service
                port:
                  number: 80
```

Ingress is just a config object — it requires an **Ingress Controller** (e.g., nginx) that
actually accepts requests and routes them. The controller is a reverse proxy running as a Pod.

Enables:
- HTTP routing by domain and path
- Path-based routing to multiple services behind one address
- TLS termination in one place

---

## 🩺 Health Probes

K8s doesn't know if your app is truly healthy. A container can be running while Spring Boot
is still loading. Without probes, K8s sends traffic to unready apps.

| Probe            | Active              | On failure                                     |
|------------------|---------------------|------------------------------------------------|
| `startupProbe`   | only during startup | restarts container                             |
| `livenessProbe`  | always              | restarts container                             |
| `readinessProbe` | always              | removes Pod from Service rotation (no restart) |

```yaml
containers:
  - name: order-service
    startupProbe:
      httpGet:
        path: /actuator/health
        port: 8082
      failureThreshold: 30    # 30 × 10s = 5 minutes for JVM to start
      periodSeconds: 10
    livenessProbe:
      httpGet:
        path: /actuator/health/liveness
        port: 8082
      periodSeconds: 10
      failureThreshold: 3
    readinessProbe:
      httpGet:
        path: /actuator/health/readiness
        port: 8082
      periodSeconds: 5
      failureThreshold: 3
```

Spring Boot Actuator exposes `/actuator/health/liveness` and `/actuator/health/readiness`
when `management.endpoint.health.probes.enabled: true` is set.

**Key distinction:** `livenessProbe` failing kills and restarts the container.
`readinessProbe` failing just removes the Pod from load balancing — useful when the app is
temporarily busy (long GC, batch job) but shouldn't be killed.

---

## 🌐 Networking

### Flat Network Model

- Every Pod has a unique IP address
- Every Pod can communicate with every other Pod directly
- No default network segmentation

Isolation can be introduced using **NetworkPolicy**.

### CNI (Container Network Interface)

- Assigns IP addresses to Pods
- Configures routing between nodes
- Enforces network policies
- Examples: Calico, Flannel, Cilium

---

## ⚙️ Configuration and Secrets

### ConfigMap

Stores non-sensitive configuration as key-value pairs.
Spring Boot reads them as environment variables via `${KEY_NAME}`.

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: order-service-config
  namespace: bookstore
data:
  DB_HOST: "postgres-service"
  DB_PORT: "5432"
  DB_NAME: "bookstore_orders"
  BOOK_SERVICE_URL: "http://book-service.bookstore.svc.cluster.local"
  SERVER_PORT: "8082"
```

### Secret

Stores sensitive data (passwords, tokens, certificates).
Values are **base64-encoded** — this is encoding, NOT encryption.
Anyone with `kubectl` access can decode them.

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: order-service-secret
  namespace: bookstore
type: Opaque
data:
  DB_USERNAME: Ym9va3N0b3Jl   # echo -n "bookstore" | base64
  DB_PASSWORD: c2VjcmV0       # echo -n "secret" | base64
```

```bash
# Encode / decode
echo -n "secret" | base64          # c2VjcmV0
echo "c2VjcmV0" | base64 -d        # secret

# Read a specific field from a Secret
kubectl get secret order-service-secret 
  -o jsonpath='{.data.DB_PASSWORD}' | base64 -d
```

### Injecting config into containers

**`envFrom`** injects ALL keys from a ConfigMap or Secret as environment variables.
**`env`** injects individual keys.

```yaml
envFrom:
  - configMapRef:
      name: order-service-config
  - secretRef:
      name: order-service-secret
```

Priority when the same key appears in multiple sources: `env` > later `envFrom` > earlier `envFrom`.

> **Important:** Pods do NOT automatically restart when a ConfigMap changes.
> You must run `kubectl rollout restart deployment/<name>` after applying config changes.

For production, prefer **Vault + ESO** over raw Secrets (see below).

---

## 💻 Resource Management

### Requests and Limits

```yaml
resources:
  requests:
    cpu: "250m"       # minimum required — used by Scheduler for placement decisions
    memory: "256Mi"
  limits:
    cpu: "500m"       # maximum allowed
    memory: "512Mi"   # exceeding memory limit → OOMKilled (container is killed)
```

- `requests` — the Scheduler uses this to find a Node with enough free resources
- `limits` — hard ceiling; CPU is throttled, memory violation kills the container
- **HPA requires `requests` to be set** — without it, autoscaling can't calculate % utilization

---

## 🗂 Namespace

A Namespace is a logical partition within a cluster — like folders in a filesystem.

Used for:
- Environment separation (dev / staging / prod in one cluster)
- Organizing resources by team or project
- Access control via RBAC
- Resource quotas per namespace

```bash
kubectl create namespace bookstore
kubectl config set-context --current --namespace=bookstore   # set default namespace
kubectl get pods -n bookstore                                 # or specify explicitly
```

K8s built-in namespaces you don't touch:
- `default` — where resources land when no namespace is specified
- `kube-system` — K8s internal components (API Server, Scheduler, etc.)

---

## 💾 Storage

### PersistentVolume (PV)

A piece of physical storage provisioned in the cluster (local disk, AWS EBS, GCP Disk, NFS).
Analogy: an apartment available for rent.

### PersistentVolumeClaim (PVC)

An application's request for storage. You declare what you need; K8s finds or creates a
matching PV. Analogy: a rental listing — "I need at least 40m²".

### StorageClass

Recipe for automatically creating PVs on demand. Minikube has `standard` (local directory).
Cloud providers have classes that create EBS volumes, GCP disks, etc.

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: postgres-pvc
  namespace: bookstore
spec:
  accessModes:
    - ReadWriteOnce       # one node can read/write at a time
  resources:
    requests:
      storage: 1Gi
```

```yaml
# Mounting PVC into a container
containers:
  - name: postgres
    volumeMounts:
      - name: postgres-storage
        mountPath: /var/lib/postgresql/data
volumes:
  - name: postgres-storage
    persistentVolumeClaim:
      claimName: postgres-pvc
```

```bash
kubectl get pvc    # STATUS=Bound → storage assigned; Pending → waiting
kubectl get pv     # the automatically provisioned PersistentVolume
```

**Access modes:**

| Mode            | Meaning                                                   |
|-----------------|-----------------------------------------------------------|
| `ReadWriteOnce` | one node can mount read/write (most databases)            |
| `ReadWriteMany` | multiple nodes can mount read/write (NFS, shared storage) |
| `ReadOnlyMany`  | multiple nodes can mount read-only                        |

---

## 📈 Scaling — HPA

**Manual scaling:**
```bash
kubectl scale deployment/book-service --replicas=5
```

**HPA (HorizontalPodAutoscaler)** — automatic scaling based on CPU (or custom metrics).
Polls Metrics Server every 15 seconds. Scales up when CPU > threshold, down when it drops —
but never below `minReplicas`.

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: book-service-hpa
  namespace: bookstore
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: book-service
  minReplicas: 2
  maxReplicas: 5
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70   # scale up when average CPU > 70%
```

```bash
kubectl get hpa -w    # TARGETS = current CPU% / threshold; Unknown = Metrics Server loading
```

> **Requirement:** Deployment must have `resources.requests` set — HPA uses it to calculate %.

---

## 🔄 Updates and Rollbacks

```bash
# Trigger a Rolling Update by setting a new image
kubectl set image deployment/order-service order-service=bookstore/order-service:1.1.0
#   format: <container-name>=<image>:<tag>
#   container-name comes from spec.containers[].name in the Deployment YAML

# Watch rollout progress (blocks until done, exit code 0 = success)
kubectl rollout status deployment/order-service

# View revision history
kubectl rollout history deployment/order-service

# Rollback to previous version (K8s reactivates the old ReplicaSet)
kubectl rollout undo deployment/order-service
kubectl rollout undo deployment/order-service --to-revision=3   # specific revision

# Restart all Pods (needed after ConfigMap / Secret changes — they don't auto-restart)
kubectl rollout restart deployment/order-service
```

**Why `kubectl rollout restart` instead of `kubectl set image`?**
`restart` triggers a rolling restart using the **same image** — useful when the image didn't
change but configuration did. `set image` forces a new image tag and is what you use for
actual code deployments.

**Important for Minikube:** the image cache doesn't update when you `load` the same tag again.
Always use a new tag (`1.0.1`, `1.1.0`) when deploying new code.

---

## ⛵ Helm

**Helm** is the package manager for Kubernetes — like Maven for Java or apt for Linux.

Instead of managing dozens of YAML files manually, you describe the system in parametrized
templates and install/upgrade with one command.

| Concept         | Meaning                                                   |
|-----------------|-----------------------------------------------------------|
| **Chart**       | package of YAML templates with parameters (like a `.jar`) |
| **values.yaml** | default parameter values (like `pom.xml`)                 |
| **Release**     | installed instance of a Chart in the cluster              |
| **Repository**  | collection of Charts (like Maven Central)                 |

Helm doesn't replace K8s YAML syntax — it **generates** standard manifests and sends them to
the API Server. If a template generates an invalid Deployment, K8s rejects it.

```bash
# Add a repository and install a ready-made Chart
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update
helm install postgres bitnami/postgresql 
  --namespace bookstore 
  --set auth.database=bookstore 
  --set auth.username=bookstore 
  --set auth.password=secret

# Own Chart
helm create my-chart           # generate skeleton
helm lint my-chart             # validate syntax
helm template my-app ./my-chart -n bookstore   # preview generated YAML without installing
helm install my-app ./my-chart -n bookstore
helm upgrade my-app ./my-chart --set replicaCount=3 -n bookstore
helm rollback my-app 1 -n bookstore
helm uninstall my-app -n bookstore
helm list -n bookstore
helm history my-app -n bookstore
```

**Template syntax:**

```yaml
replicas: {{ .Values.replicaCount }}
image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"
namespace: {{ .Release.Namespace }}
resources:
{{ toYaml .Values.resources | nindent 12 }}

{{- if .Values.ingress.enabled }}
# conditional block
{{- end }}
```

---

## 🔐 Vault + ESO

**Problem with K8s Secrets in production:**
- base64 = encoding, not encryption — anyone with `kubectl` can decode
- etcd is not encrypted at rest by default
- no audit log (you don't know who read a secret and when)
- no automatic rotation
- no secret leasing/expiry

**HashiCorp Vault** is a centralized secret store:
- Encryption at rest (AES-256-GCM)
- Full audit log for every access
- Automatic rotation and TTL-based expiry
- Dynamic secrets (generates DB credentials on demand)

**External Secrets Operator (ESO)** — integration pattern that keeps apps unaware of Vault.
ESO synchronizes Vault → K8s Secret automatically. The app still uses `envFrom` as usual.

```
Vault (source of truth) → ESO (syncs) → K8s Secret → envFrom in Deployment
```

| Aspect | K8s Secret | Vault + ESO |
|---|---|---|
| Encryption at rest | Optional (etcd default: no) | Always (AES-256-GCM) |
| Audit log | None | Full — who, when, what |
| Rotation | Manual | Automatic |
| Dynamic secrets | No | Yes (TTL, auto-expire) |
| Complexity | Low | Higher |
| When to use | Dev, staging | Production, compliance |

Key ESO resources:
- **`SecretStore`** — how ESO connects to Vault (address, authentication method)
- **`ExternalSecret`** — which secrets to fetch and what K8s Secret to create

---

## 📨 Kafka on Kubernetes

**Apache Kafka** is a distributed, append-only event log. Unlike a queue (where a message
disappears after being read), Kafka retains events for a configured period (default 7 days) —
every Consumer Group reads independently at its own offset.

| Concept            | Meaning                                                                   |
|--------------------|---------------------------------------------------------------------------|
| **Topic**          | named log for one type of event (e.g., `order.confirmed`)                 |
| **Partition**      | fragment of a topic — unit of parallelism and ordering                    |
| **Offset**         | position of an event in a partition — immutable, monotonically increasing |
| **Producer**       | publishes events; message key determines partition (hash % n)             |
| **Consumer Group** | set of consumers sharing partitions; each partition → one consumer        |
| **Consumer Lag**   | how many events a consumer is behind — LAG=0 means keeping up             |
| **DLT**            | Dead Letter Topic — events land here after exhausting retry attempts      |

**Delivery semantics:**
- `At-most-once` — fire and forget, may be lost
- `At-least-once` — retry on failure, may arrive twice (**Spring Kafka default** → handle duplicates!)
- `Exactly-once` — Kafka transactions, complex, rarely needed

**Deployed as StatefulSet** — Kafka brokers need stable identity, stable DNS names (`kafka-0`),
and dedicated PVCs. A Deployment would reset all of this on restart.

```bash
# Kafka CLI (inside the kafka-controller-0 Pod)
kubectl exec -it kafka-controller-0 -n bookstore -- bash

kafka-topics.sh --bootstrap-server localhost:9092 --list
kafka-topics.sh --bootstrap-server localhost:9092 
  --create --topic order.confirmed --partitions 3 --replication-factor 1

# Check Consumer Group lag
kafka-consumer-groups.sh --bootstrap-server localhost:9092 
  --describe --group notify-service
# LAG column — number of unread events

# Replay — reset offset and reprocess all events from the beginning
kubectl scale deployment notify-service --replicas=0    # consumer must be down
kafka-consumer-groups.sh --bootstrap-server localhost:9092 
  --group notify-service --topic order.confirmed 
  --reset-offsets --to-earliest --execute
kubectl scale deployment notify-service --replicas=1
```

**Idempotent consumer pattern** (at-least-once → handle duplicates):

```java
@KafkaListener(topics = "order.confirmed", groupId = "notify-service")
@Transactional
public void onOrderConfirmed(OrderConfirmedEvent event) {
    if (repo.existsByOrderIdAndType(event.orderId(), NotificationType.ORDER_CONFIRMED)) {
        return;   // already processed — skip duplicate
    }
    // process and save atomically in one transaction
}
```

---

## 🛡 Security

### RBAC

Controls API access — who can do what on which resources.

- **Role** — permissions within a namespace
- **ClusterRole** — cluster-wide permissions
- **RoleBinding / ClusterRoleBinding** — assigns Role to a user/ServiceAccount

### ServiceAccount

Identity of a Pod within the cluster. Used for pod-to-API authentication.

### SecurityContext

```yaml
securityContext:
  runAsNonRoot: true
  runAsUser: 1000
  readOnlyRootFilesystem: true
  allowPrivilegeEscalation: false
```

---

## 💻 kubectl Reference

```bash
# Context and namespace
kubectl config set-context --current --namespace=bookstore
kubectl config view --minify | grep namespace
kubectl config get-contexts               # list all contexts
kubectl config use-context minikube       # switch context

# Inspect resources
kubectl get pods / services / deployments / configmaps / secrets / pvc / ingress / hpa
kubectl get pods -w                       # live watch
kubectl get pods -o wide                  # show node assignment
kubectl describe pod <name>               # full detail + Events section (diagnose here!)
kubectl logs deployment/<name>
kubectl logs deployment/<name> --since=2m
kubectl logs <pod> --previous             # logs from the previous (crashed) run
kubectl exec -it deployment/<name> -- sh
kubectl exec -it deployment/<name> -- env | grep DB

# Apply — declarative, idempotent, always instead of create/replace
# K8s does a 3-way merge: current state + last applied + new YAML
kubectl apply -f file.yaml
kubectl apply -f k8s/base/              # all YAMLs in directory

# Rolling update
kubectl set image deployment/order-service order-service=bookstore/order-service:1.1.0
kubectl rollout status deployment/order-service
kubectl rollout undo deployment/order-service
kubectl rollout undo deployment/order-service --to-revision=3
kubectl rollout history deployment/order-service
kubectl rollout restart deployment/order-service    # restart with same image

# Scaling
kubectl scale deployment/book-service --replicas=5

# Debug networking — temporary Pod
kubectl run debug --image=curlimages/curl -it --rm -- sh
curl http://book-service/books
curl http://book-service.bookstore.svc.cluster.local/books

# Port forwarding (debug tunnel — not production traffic)
kubectl port-forward deployment/book-service 8081:8081
kubectl port-forward service/order-service 8082:80
kubectl port-forward deployment/book-service 8081:8081 &   # run in background

# Explore YAML schema without docs
kubectl explain deployment.spec.template.spec.containers
kubectl explain deployment.spec.template.spec.containers.envFrom
kubectl explain pod.spec.containers
kubectl explain service.spec
kubectl explain pvc.spec

# Delete
kubectl delete -f file.yaml
kubectl delete pod <name>
kubectl delete pod -l app=postgres      # delete by label

# Minikube
minikube start --driver=docker --cpus=4 --memory=8192
minikube image load bookstore/book-service:1.0.0   # copy image into Minikube
minikube image ls | grep bookstore
minikube addons enable ingress
minikube addons enable metrics-server
minikube ip
echo "$(minikube ip) bookstore.local" | sudo tee -a /etc/hosts
```

### kubectl apply vs create vs replace

| Command              | Problem                                                      |
|----------------------|--------------------------------------------------------------|
| `kubectl create -f`  | Error if resource already exists                             |
| `kubectl replace -f` | Error if resource doesn't exist. Destroys fields not in file |
| `kubectl apply -f`   | Always works. Three-way merge. **Always use this.**          |

### Common diagnostics

```bash
# Pod not starting?
kubectl get pods                           # check STATUS (CrashLoopBackOff?)
kubectl describe pod <name>               # Events section at the bottom!
kubectl logs <name>                        # current run logs
kubectl logs <name> --previous             # previous crash logs

# What image is actually deployed?
kubectl get deployment <name> -o jsonpath='{.spec.template.spec.containers[0].image}'

# Did env vars arrive?
kubectl exec -it deployment/<name> -- env | grep DB
```

### Common errors

| Symptom                | Cause                            | Fix                                         |
|------------------------|----------------------------------|---------------------------------------------|
| `CrashLoopBackOff`     | app crashes on startup           | `kubectl logs <pod> --previous`             |
| `ErrImagePull`         | image not in registry / Minikube | `minikube image load <image>:<tag>`         |
| `Pending`              | no resources or PVC not bound    | `kubectl describe pod` → Events             |
| old code after update  | same tag cached in Minikube      | use new tag (`1.0.1`, `1.1.0`)              |
| config change ignored  | Pods don't restart automatically | `kubectl rollout restart`                   |
| `curl: (7) Failed`     | port-forward tunnel closed       | keep terminal open or use `&`               |
| `Table not found` (H2) | `data.sql` ran before DDL        | add `defer-datasource-initialization: true` |

---

## 🧠 Mental Model

Kubernetes consists of:

- **API Server** as the single interface — everything goes through it
- **etcd** as the source of truth — stores desired state
- **Controllers** synchronizing state — each watches one resource type
- **Scheduler** assigning Pods to Nodes
- **kubelet** executing containers on each Node

Deployment, Service, ConfigMap, and Secret are declarative objects describing the desired
system state. You write YAML, K8s continuously reconciles reality to match it.

```
You write YAML  →  kubectl apply  →  API Server validates + stores in etcd
                                              ↓
                              Controller Manager detects difference
                                              ↓
                              Scheduler picks a Node
                                              ↓
                              kubelet on that Node pulls image + starts container
                                              ↓
                              Readiness Probe passes → Service routes traffic to Pod
```

**Key properties:**
- **Declarative** — describe what you want, not how to get there
- **Self-healing** — controllers constantly reconcile actual ↔ desired state
- **Idempotent** — `kubectl apply` run 10 times produces the same result
- **Composable** — Deployment + Service + ConfigMap + Secret + Ingress = a production service
