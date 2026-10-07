<div align="center">

# MediMeet 🏥💬

**A full-stack doctor-patient appointment scheduling and real-time P2P video consultation platform built with Next.js 14, Clerk, Prisma, MongoDB, and PeerJS.**

[![Live Demo](https://img.shields.io/badge/Demo-Live_App-0070f3?style=flat-square&logo=vercel)](https://medimeet-eta.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Clerk](https://img.shields.io/badge/Auth-Clerk-6C47FF?style=flat-square&logo=clerk)](https://clerk.com/)
[![Prisma](https://img.shields.io/badge/ORM-Prisma-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
[![WebRTC](https://img.shields.io/badge/Video-PeerJS_%2F_WebRTC-FF6B6B?style=flat-square&logo=webrtc)](https://peerjs.com/)

</div>

---

## 📸 System Architecture

![MediMeet System Architecture](./public/Medimeet_architecture.png)

---

## ✨ Core Features

* **Multi-Role Authentication & Webhook Sync:** Secure identity management powered by **Clerk** with role-based workflows (**Doctor** vs. **Patient**) synchronized to MongoDB via cryptographically verified **Svix webhooks**.
* **Dynamic Doctor Search & Parallel Pagination:** Server-side filtering across doctor names, specializations, consultation fees, experience, and gender using dynamic Prisma query builders and parallelized `Promise.all` execution.
* **Atomic Appointment & Room Provisioning:** Interactive calendar scheduling (`@mui/x-date-pickers` & `date-fns`) backed by **Next.js 14 Server Actions** and **Prisma `$transaction`** to atomically provision appointments and dedicated consultation rooms.
* **1-on-1 P2P Video Consultation:** Low-latency peer-to-peer audio/video calls built with **PeerJS (WebRTC)**, database-backed peer signaling, and reliable tab-close cleanup via the browser **`navigator.sendBeacon` API**.
* **Profile & Medical Document Storage:** Cloud-based profile avatar and digital prescription uploads via **Next-Cloudinary**.

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Framework** | Next.js 14 (App Router, Server Components, Server Actions) |
| **Authentication** | Clerk Auth (`publicMetadata` Roles) + Svix (Webhook Verification) |
| **Database & ORM** | MongoDB Atlas + Prisma ORM (`$transaction`, Cascading Relations) |
| **Media & WebRTC** | PeerJS (WebRTC + STUN), React Player, Next-Cloudinary |
| **UI & Styling** | Tailwind CSS, Radix UI Primitives, MUI Date Pickers, Sonner Toasts |
| **State & Validation** | Zustand, Zod, Date-fns, Lodash |

---

## ⚡ Engineering Challenges & Solutions

### 1. Reliable WebRTC Signaling & Abrupt Tab-Close Cleanup
* **Challenge:** Establishing peer-to-peer WebRTC connections requires exchanging ephemeral PeerJS IDs between the doctor and patient, while abrupt browser tab closures leave stale Peer IDs in the database (causing remote peers to connect to dead sessions) because standard asynchronous `fetch`/`axios` calls are canceled during `beforeunload`.
* **Solution:** Built a database-backed signaling flow that registers and polls active `doctorPeerId` and `patientPeerId` states per consultation room, paired with **`navigator.sendBeacon("/api/resetPeerId")`** on the `beforeunload` lifecycle event to guarantee synchronous background cleanup even when a browser tab is abruptly closed.

### 2. High-Performance Multi-Filter Search & Pagination
* **Challenge:** Filtering doctors across multiple optional parameters (multi-word names, specialization arrays, fee brackets, and experience thresholds) while calculating total pagination counts can cause query waterfalls and slow Server Component renders.
* **Solution:** Engineered a dynamic Prisma `AND`/`OR` condition builder that sanitizes empty query parameters and executes `db.doctor.findMany()` and `db.doctor.count()` concurrently via **`Promise.all`**, cutting database round-trip latency in half and forwarding unhandled failures to Next.js `error.tsx` boundaries.

### 3. Atomic Booking & Webhook Identity Synchronization
* **Challenge:** Syncing Clerk authentication records with MongoDB without race conditions, and ensuring every booked appointment is guaranteed to have a linked video room.
* **Solution:** Verified incoming Clerk lifecycle webhooks using **Svix** signatures before updating MongoDB records, and wrapped appointment + consultation room creation inside a **Prisma `$transaction`** block inside a custom `safeAction` Server Action wrapper with automatic cache invalidation (`revalidatePath`).

---

## 🚀 Getting Started Locally

### 1. Prerequisites
* **Node.js:** `v18.x` or higher
* **MongoDB:** Local instance or MongoDB Atlas Connection String
* **Clerk Account:** Publishable Key, Secret Key, and Webhook Signing Secret

### 2. Installation & Setup

```bash
# Clone the repository
git clone [https://github.com/harsh-1214/Medimeet.git](https://github.com/harsh-1214/Medimeet.git)
cd medimeet

# Install dependencies
npm install

# Generate Prisma Client
npx prisma generate

# Run the development server
npm run dev