# ⚽ FIFA World Cup 2026 Smart Stadium Assistant - Testing Checklist

This document details the comprehensive testing checklist for manual quality assurance, accessibility compliance, API validation, and responsive design verification.

---

## 📋 1. Navigation & Seat Wayfinding Tests

| Test ID | Test Scenario | Procedure | Expected Result | Pass/Fail |
| :--- | :--- | :--- | :--- | :---: |
| **NAV-01** | Interactive Canvas Map Render | Load Navigation Page | HTML5 canvas renders stadium oval, seating rings, grass pitch, and pins | ✅ PASS |
| **NAV-02** | Seat Route Calculation | Enter Section 104, Row 12, Seat 8 & click "Calculate Seat Route" | Step-by-step gate and portal directions are displayed in route container | ✅ PASS |
| **NAV-03** | Amenity Wayfinding | Change destination dropdown to "Nearest Restroom" / "Concession" | Canvas map draws animated dashed route line to target amenity pin | ✅ PASS |
| **NAV-04** | Stadium Selector Change | Change host stadium from MetLife to Estadio Azteca | Map re-renders gate configurations for selected venue | ✅ PASS |

---

## ♿ 2. Accessibility & Screen Reader Compliance Tests

| Test ID | Test Scenario | Procedure | Expected Result | Pass/Fail |
| :--- | :--- | :--- | :--- | :---: |
| **A11Y-01** | Skip to Main Content Link | Press `Tab` on initial page load | "Skip to Main Content" link appears at top left; pressing `Enter` focuses `#main-content` | ✅ PASS |
| **A11Y-02** | ARIA Landmarks | Inspect DOM elements | `<header role="banner">`, `<nav role="navigation">`, `<main role="main">`, `<footer role="contentinfo">`, `<div role="dialog">` present | ✅ PASS |
| **A11Y-03** | High Contrast Mode | Toggle "Enable High Contrast" switch | Page converts to pitch black background (`#000000`) with high-visibility yellow text (`#FFFF00`) | ✅ PASS |
| **A11Y-04** | Dynamic Font Resizing | Click `A+` / `A-` / `Reset` font control buttons | Root font size scales (80% to 140%) and setting persists in `localStorage` | ✅ PASS |
| **A11Y-05** | Keyboard Navigation | Tab through feature cards and press `Enter` / `Space` | Cards trigger action click and navigate smoothly without mouse | ✅ PASS |
| **A11Y-06** | Screen Reader Live Region | Perform tab switch or cart add | `#sr-announcement-region` updates with dynamic voice announcement | ✅ PASS |
| **A11Y-07** | Color Blind Safe Mode | Toggle "Color Blind Mode" switch | Status badges convert to Deuteranopia/Protanopia safe blue, amber, and red indicators | ✅ PASS |

---

## 📱 3. Responsive Design & Layout Tests

| Test ID | Test Viewport | Breakpoint | Target Behavior | Pass/Fail |
| :--- | :--- | :--- | :--- | :---: |
| **RESP-01** | Mobile Smartphone | 360px - 576px | Header nav links collapse; Mobile bottom nav bar displays with 5 tab buttons | ✅ PASS |
| **RESP-02** | Tablet Portrait | 768px - 992px | Grid layouts stack to single column; chatbot sidebar collapses cleanly | ✅ PASS |
| **RESP-03** | Laptop / Desktop | 1024px - 1440px | Full horizontal navigation bar displays with badge indicators and quick controls | ✅ PASS |
| **RESP-04** | Ultra-Wide Monitor | 1920px+ | App wrapper stays centered with max-width 1380px without layout distortion | ✅ PASS |

---

## 🚨 4. API Error & Input Validation Tests

| Test ID | Test Endpoint | Input Payload | Expected Status Code & Response | Pass/Fail |
| :--- | :--- | :--- | :--- | :---: |
| **ERR-01** | `GET /api/invalid-route` | N/A | `404 Not Found` with `{ success: false, error: "API endpoint not found" }` | ✅ PASS |
| **ERR-02** | `POST /api/chat/query` | `{ message: "" }` | `400 Bad Request` with `{ success: false, error: "Please enter a valid message" }` | ✅ PASS |
| **ERR-03** | `POST /api/services/order` | `{ cart: [] }` | `400 Bad Request` with `{ success: false, error: "Cart cannot be empty" }` | ✅ PASS |
| **ERR-04** | `POST /api/emergency/lost-found` | `{ description: "" }` | `400 Bad Request` with `{ success: false, error: "Please provide a detailed description" }` | ✅ PASS |

---

## 🤖 5. Goalie AI Chatbot Knowledge Tests

| Test ID | User Question | Verified Response Content | Pass/Fail |
| :--- | :--- | :--- | :---: |
| **BOT-01** | "Where is Gate A?" | Gate A North-East Plaza location, Section 100 access, 4-min wait | ✅ PASS |
| **BOT-02** | "Nearest parking?" | Lot A & B North Deck, Lot E Rideshare & ADA parking, FIFA Shuttles | ✅ PASS |
| **BOT-03** | "Food recommendations?" | Champion Burger ($14.99), Azteca Tacos ($12.50), Loaded Fries | ✅ PASS |
| **BOT-04** | "Seat guidance for section 104" | Portal directions for Lower Deck 101-140, Club Level 201-230 | ✅ PASS |
| **BOT-05** | "Where are emergency exits?" | GREEN illuminated exit doors above Gates A, B, C, D | ✅ PASS |
| **BOT-06** | "Wheelchair entrances" | Gate A & B barrier-free entrances, Elevators 1-8 | ✅ PASS |
| **BOT-07** | "Translate announcement into Spanish" | Multilingual PA translation into 🇲🇽 Spanish and 🇫🇷 French | ✅ PASS |
| **BOT-08** | "Crowd updates" | Gate A (Low 4m), Gate B (Mod 12m), Gate C (Busy 20m) | ✅ PASS |
