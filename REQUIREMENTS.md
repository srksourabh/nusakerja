# REQUIREMENTS.md — NusaKerja Build Requirements

## 1. Functional Requirements

### M1: Employee Onboarding
- **ONB-1**: Self-service onboarding via one-time token link.
- **ONB-2**: Capture Indonesian identity fields: NIK/KTP (16 digits), NPWP (15/16 digits), BPJS Ketenagakerjaan & Kesehatan numbers.
- **ONB-3**: PTKP status selection (TK/0–3, K/0–3) with automatic TER Category assignment.

### M2: Core HR
- **HR-1**: Employee 360 profile, document storage, and org hierarchy.
- **HR-2**: Indonesian public holidays and *cuti bersama* leave tracking.

### M3: Payroll & Statutory Engine
- **PAY-1**: PPh 21 TER (Categories A, B, C) monthly tax deduction engine.
- **PAY-2**: PPh 21 Article 17 annual reconciliation and December true-up.
- **PAY-3**: BPJS Ketenagakerjaan contributions (JKK, JKM, JHT, JP with March 2026 cap of Rp11,086,300).
- **PAY-4**: BPJS Kesehatan contributions (5% split, cap Rp12,000,000).
- **PAY-5**: THR (Tunjangan Hari Raya) statutory bonus calculator.
- **PAY-6**: PP 35/2021 overtime rates (1.5x first hour, 2x subsequent hours).

### M4: Field Location Tracking
- **GPS-1**: Mobile GPS punch in/out with precision verification and geofence enforcement.
- **GPS-2**: Offline punch queue with automatic sync on reconnect.

### M5: TKA Foreign Employee Management
- **TKA-1**: Tracking for KITAS expiry dates, RPTKA reference numbers, and DKPTKA levy schedules.

---

## 2. Non-Functional Requirements (NFRs)

- **NFR-1 (Performance)**: Payroll run for 100 employees completes in under 5 seconds.
- **NFR-2 (Security)**: Full RBAC enforcement, session rotation, and audit logging.
- **NFR-3 (Availability)**: 99.9% service availability target.
