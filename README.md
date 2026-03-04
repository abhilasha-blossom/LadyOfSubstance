<div align="center">
  <br />
  <h1>✨ LadyOfSubstance ✨</h1>
  <p>
    <strong>A luxurious, modern e-commerce platform curated for premium jewelry.</strong>
  </p>
  <br />
</div>

## 🤍 About The Project

Welcome to **LadyOfSubstance**, a fully functional, breathtaking e-commerce experience designed for high-end fashion and jewelry. From the deep champagne and soft cream aesthetic to the robust, secure backend architecture, every layer is crafted to deliver a flawless shopping journey. 

This platform seamlessly integrates elegant Frontend UI with a powerful Node.js Backend, complete with Razorpay's secure payment gateway, global Cart state, and a protected Administrative Dashboard.

### 🌟 Vibe & Aesthetic
- High-end minimalist design
- Colors: Champagne, Cream, Beige, and Rich Gold
- Typography: *Playfair Display* (Headings) & *Raleway* (Body)
- Subtle, delicate micro-animations for an interactive feel.

---

## 🛠️ Tech Stack

### Frontend (Client)
- **Framework:** React 18 + Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS (v3) & shadcn/ui
- **State Management:** React Context API (Cart & Auth persistence)
- **Routing:** React Router v6

### Backend (Server)
- **Runtime & Framework:** Node.js + Express
- **Language:** TypeScript
- **Database:** PostgreSQL (Supabase)
- **ORM:** Prisma
- **Authentication:** JWT (JSON Web Tokens) & bcrypt
- **Payments:** Razorpay Gateway API

---

## 💎 Key Features

- **Shop & Product Catalog:** Browse dynamically fueled catalogs fetched from the Postgres schema.
- **Cart System:** Global context cart, fully persisted in LocalStorage.
- **Secure Authentication:** Full Login/Register flows protected via JWT verification.
- **Checkout Flow:** Elegant shipping forms integrated with Razorpay for instant, safe transactions.
- **Admin Dashboard:** A protected portal reserved for the `ADMIN` role. Manage total revenue, stock updates, active products, and order statuses natively.

---

## 🚀 Getting Started

To spin up the repository locally, check out our [Deployment Guide](DEPLOYMENT.md) for full `.env` variable setup commands. 

In a nutshell:
1. Provide your Supabase `DATABASE_URL` in `server/.env`.
2. Generate the Prisma Client and push the schema.
3. Run both Vite and Node environments.

## 💌 Acknowledgments
Crafted with elegance and precision. Enjoy the luxury of **LadyOfSubstance**.
