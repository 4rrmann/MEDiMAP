# **MEDI-MAP (NAMASTE ↔ ICD-11 Integration Platform)**
### ***FHIR, FastAPI, NLP, OAuth2, PostgreSQL, Next.js***
 *2025 | Smart India Hackathon (SIH)*<br>
- Designed a standards-compliant interoperability microservice translating NAMASTE (AYUSH) terms to ICD-11 codes using FHIR R4; enabled EMR/EHR integration.
- Built a hybrid search + scoring engine combining ICD-11 API scores, fuzzy matching, semantic embeddings and definition similarity.
- Trained a logistic-regression weight generator on a curated golden-dataset to compute mapping confidence and implemented threshold-based decisioning (auto-accept/manual review/reject).
- Integrated ABHA OAuth2 authentication, logged FHIR AuditEvent/Provenance for traceability and compliance.
---
***website: https://namaste-prototype.vercel.app/***
