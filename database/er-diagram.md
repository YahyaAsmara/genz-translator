┌─────────────────────┐
│      TERMS          │
├─────────────────────┤
│ id (PK)             │ SERIAL
│ genz_text           │ VARCHAR(255) UNIQUE
│ translation         │ VARCHAR(255)
│ category            │ VARCHAR(50)
│ popularity_score    │ INTEGER DEFAULT 0
│ created_at          │ TIMESTAMP
│ updated_at          │ TIMESTAMP
└─────────────────────┘
            │
            │ (One term can be used in many translations)
            │
            ▼
┌─────────────────────┐
│ TRANSLATION_HISTORY │
├─────────────────────┤
│ id (PK)             │ SERIAL
│ original_text       │ TEXT
│ translated_text     │ TEXT  
│ terms_found         │ TEXT[] (Array)
│ created_at          │ TIMESTAMP
└─────────────────────┘

RELATIONSHIP:
- One TERM can appear in many TRANSLATION_HISTORY records (1:N)
- TRANSLATION_HISTORY.terms_found contains array of term names that were used
- No foreign key constraint (denormalized for performance)