[Back to interview](../interview.md)

# 🚀 Kubernetes

<!-- TOC -->
* [🚀 Kubernetes](#-kubernetes)
  * [📘 What is Kubernetes?](#-what-is-kubernetes)
  * [🏗 Cluster Architecture](#-cluster-architecture)
    * [control Plane](#control-plane)
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
  * [🌐 Networking](#-networking)
    * [Flat Network Model](#flat-network-model)
    * [CNI](#cni)
  * [⚙️ Configuration and Secrets](#-configuration-and-secrets)
    * [ConfigMap](#configmap)
    * [Secret](#secret)
  * [📄 YAML and Resource Structure](#-yaml-and-resource-structure)
  * [💻 Resource Management](#-resource-management)
    * [Requests and Limits](#requests-and-limits)
  * [🗂 Namespace](#-namespace)
  * [💾 Storage](#-storage)
    * [PersistentVolume (PV)](#persistentvolume-pv)
    * [PersistentVolumeClaim (PVC)](#persistentvolumeclaim-pvc)
    * [StorageClass](#storageclass)
  * [🛡 Security](#-security)
    * [RBAC](#rbac)
    * [ServiceAccount](#serviceaccount)
    * [SecurityContext](#securitycontext)
  * [📈 Scaling](#-scaling)
    * [Manual](#manual)
    * [Automatic](#automatic)
  * [🔄 Updates](#-updates)
  * [🧠 Mental Model](#-mental-model)
<!-- TOC -->

## 📘 What is Kubernetes?

Kubernetes (K8s) is a container orchestration platform that enables:

-   Running containerized applications\
-   Horizontal scaling\
-   Zero-downtime updates\
-   Automatic restarts\
-   Network management\
-   Storage management\
-   Separation of configuration from code

Kubernetes operates using a **declarative model**.

Instead of issuing commands like:

> Run this container

you declare:

> I want 3 instances of this application

The system continuously ensures that the actual state matches the
declared state.

---

## 🏗 Cluster Architecture

A Kubernetes cluster consists of:

-   Control Plane
-   Worker Nodes

### control Plane

The Control Plane manages the entire cluster.

#### kube-apiserver

-   Central entry point into the system\
-   Exposes REST API\
-   Validates and persists resources in etcd

#### etcd

-   Distributed key--value store\
-   Stores cluster state\
-   Acts as the single source of truth

#### kube-scheduler

-   Decides which Node a Pod runs on\
-   Considers available resources and constraints

#### kube-controller-manager

-   Contains multiple controllers\
-   Responsible for maintaining state consistency

---

### Worker Node

A Node is a machine (VM or physical) that runs containers.

It consists of:

#### kubelet

-   Agent communicating with the API\
-   Starts and manages containers

#### kube-proxy

-   Implements network routing\
-   Handles Services

#### container runtime

-   e.g., containerd\
-   Runs container images

---

## 🔄 Reconciliation Loop (Core Concept)

Every controller operates according to this pattern:

1.  Read desired state (from API)\
2.  Read actual state\
3.  If they differ --- take corrective action\
4.  Repeat indefinitely

If a Deployment declares 3 replicas and one crashes, the system creates
a new one.

Kubernetes continuously reconciles the system state.

---

## 🧱 Core Objects

### Pod

A Pod is the smallest deployable unit.

It contains: - One or more containers\
- Shared networking\
- Shared volumes

Characteristics: - Has its own IP address\
- Is ephemeral\
- May be recreated at any time

---

### Deployment

A Deployment defines how an application should run.

It specifies: - Container image\
- Number of replicas\
- Update strategy

Deployment manages: - ReplicaSets\
- Rolling updates\
- Rollbacks

---

### ReplicaSet

Maintains a specified number of Pods.

If the number drops below the declared value, it creates new ones.

---

### StatefulSet

Used for stateful applications (e.g., databases).

Provides: - Stable DNS names\
- Persistent identity\
- Durable storage

---

### Service

A Service defines a stable access point to a group of Pods.

Pods: - Have dynamic IP addresses\
- May disappear\
- May be recreated

A Service:

-   Provides a stable virtual IP\
-   Routes traffic to Pods with matching labels\
-   Load-balances traffic

Types: - ClusterIP (internal)\
- NodePort\
- LoadBalancer\
- Headless

---

### Ingress

Ingress exposes applications outside the cluster.

Enables: - HTTP routing by domain\
- Path-based routing\
- TLS termination

Requires an Ingress Controller (e.g., NGINX).

---

## 🌐 Networking

### Flat Network Model

A flat network means:

-   Every Pod has a unique IP\
-   Every Pod can communicate with every other Pod\
-   No default segmentation

Isolation can be introduced using NetworkPolicy.

---

### CNI

CNI (Container Network Interface):

-   Assigns IP addresses\
-   Configures routing\
-   Enforces network policies

---

## ⚙️ Configuration and Secrets

### ConfigMap

Stores configuration data.

Can be used as: - Environment variables\
- Files mounted into volumes

---

### Secret

Stores: - Passwords\
- Tokens\
- Certificates

Stored as base64 in etcd by default.

---

## 📄 YAML and Resource Structure

Kubernetes resources are defined in YAML files.

Basic structure:

``` yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: example
spec:
  replicas: 3
```

YAML is just the format.\
The structure is defined by the Kubernetes API.

---

## 💻 Resource Management

### Requests and Limits

Each Pod can declare resource usage:

``` yaml
resources:
  requests:
    cpu: "200m"
    memory: "512Mi"
  limits:
    cpu: "500m"
    memory: "1Gi"
```

Requests: - Minimum required resources\
- Used by the scheduler

Limits: - Maximum allowed resources\
- Exceeding memory limit results in OOMKilled

---

## 🗂 Namespace

A Namespace is a logical partition within a cluster.

Used for:

-   Environment separation\
-   Organizing resources\
-   Access control\
-   Applying quotas

---

## 💾 Storage

### PersistentVolume (PV)

Represents an actual storage resource.

### PersistentVolumeClaim (PVC)

An application's request for storage.

### StorageClass

Defines how volumes are provisioned.

Access modes: - ReadWriteOnce\
- ReadWriteMany

---

## 🛡 Security

### RBAC

Controls API access:

-   Role\
-   ClusterRole\
-   RoleBinding

### ServiceAccount

Identity of a Pod within the cluster.

### SecurityContext

Defines: - System user\
- Dropped capabilities\
- Read-only filesystem

---

## 📈 Scaling

### Manual

``` bash
kubectl scale deployment app --replicas=5
```

### Automatic

HPA (Horizontal Pod Autoscaler): - Scales based on CPU\
- Or custom metrics

---

## 🔄 Updates

Rolling update: - Zero-downtime updates\
- Controlled parallel restarts

Rollback:

``` bash
kubectl rollout undo deployment app
```

---

## 🧠 Mental Model

Kubernetes consists of:

-   API Server as interface\
-   etcd as source of truth\
-   Controllers synchronizing state\
-   Scheduler assigning workloads\
-   kubelet executing containers

Deployment, Service, ConfigMap, and Secret are declarative objects
describing the desired system state.

Kubernetes is a distributed system that manages containerized
applications through continuous state reconciliation.
