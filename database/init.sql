DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'genz_user') THEN
        CREATE ROLE genz_user LOGIN PASSWORD 'password';
    END IF;
END;
$$;

SELECT 'CREATE DATABASE genz_translator OWNER genz_user'
WHERE NOT EXISTS (SELECT 1 FROM pg_database WHERE datname = 'genz_translator')
\gexec

GRANT ALL PRIVILEGES ON DATABASE genz_translator TO genz_user;

\c genz_translator;

-- Grant schema privileges
GRANT ALL ON SCHEMA public TO genz_user;

-- Create tables
CREATE TABLE terms (
    id SERIAL PRIMARY KEY,
    genz_text VARCHAR(255) NOT NULL UNIQUE,
    translation VARCHAR(255) NOT NULL,
    category VARCHAR(50),
    popularity_score INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE translation_history (
    id SERIAL PRIMARY KEY,
    original_text TEXT NOT NULL,
    translated_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE translation_history_terms (
    history_id INTEGER REFERENCES translation_history(id) ON DELETE CASCADE,
    term TEXT NOT NULL,
    PRIMARY KEY (history_id, term)
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(160) NOT NULL UNIQUE,
    handle VARCHAR(64) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    persona_tag VARCHAR(80),
    accent_color VARCHAR(12),
    bio TEXT,
    streak_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP
);

CREATE TABLE user_roles (
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL,
    PRIMARY KEY (user_id, role)
);

CREATE TABLE vibe_posts (
    id SERIAL PRIMARY KEY,
    author_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    original_text TEXT NOT NULL,
    translated_text TEXT NOT NULL,
    insight TEXT,
    persona_tag VARCHAR(80),
    accent_color VARCHAR(12),
    visibility VARCHAR(20) DEFAULT 'PUBLIC',
    remix_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE vibe_tags (
    vibe_id INTEGER REFERENCES vibe_posts(id) ON DELETE CASCADE,
    tag VARCHAR(50) NOT NULL
);

CREATE TABLE vibe_pulses (
    id SERIAL PRIMARY KEY,
    vibe_id INTEGER NOT NULL REFERENCES vibe_posts(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    pulse_type VARCHAR(30) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(vibe_id, user_id, pulse_type)
);

CREATE TABLE remix_threads (
    id SERIAL PRIMARY KEY,
    vibe_id INTEGER NOT NULL REFERENCES vibe_posts(id) ON DELETE CASCADE,
    author_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    remix_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_terms_genz_text ON terms(genz_text);
CREATE INDEX idx_terms_category ON terms(category);
CREATE INDEX idx_terms_popularity ON terms(popularity_score DESC);
CREATE INDEX idx_history_created_at ON translation_history(created_at DESC);

-- Insert initial Gen Z terms data

INSERT INTO terms (genz_text, translation, category, popularity_score) VALUES
-- Slang & Expressions
('no cap', 'no lie', 'slang', 50),
('cap', 'lie', 'slang', 30),
('periodt', 'period (end of discussion)', 'expression', 25),
('slay', 'do something excellently', 'slang', 40),
('bet', 'okay/yes/sounds good', 'agreement', 35),
('say less', 'I understand/agreed', 'agreement', 20),
('vibe check', 'assessing someone''s mood or energy', 'expression', 15),

-- Abbreviations
('fr', 'for real', 'abbreviation', 45),
('ngl', 'not going to lie', 'abbreviation', 40),
('iykyk', 'if you know, you know', 'abbreviation', 25),
('tbh', 'to be honest', 'abbreviation', 30),
('imo', 'in my opinion', 'abbreviation', 20),
('smh', 'shaking my head', 'abbreviation', 25),
('rn', 'right now', 'abbreviation', 35),

-- Descriptive Terms
('bussin', 'really good (usually food)', 'descriptive', 30),
('mid', 'mediocre/average', 'descriptive', 25),
('sus', 'suspicious', 'descriptive', 40),
('lowkey', 'somewhat/kind of', 'descriptive', 35),
('highkey', 'very much/obviously', 'descriptive', 30),
('valid', 'legitimate/acceptable', 'descriptive', 20),

-- Relationships & People
('bestie', 'best friend', 'relationship', 45),
('bestfriend', 'best friend', 'relationship', 20),
('bae', 'romantic partner', 'relationship', 15),
('fam', 'family/close friends', 'relationship', 25),

-- Reactions & Emotions  
('sheesh', 'wow/impressive', 'reaction', 30),
('oop', 'oops/awkward moment', 'reaction', 15),
('periodt bestie', 'period (end of discussion), best friend', 'expression', 10),

-- Modern Expressions
('it''s giving', 'it shows/displays', 'expression', 35),
('main character energy', 'confident, self-assured behavior', 'expression', 20),
('rent free', 'constantly thinking about something', 'expression', 15),
('hits different', 'is uniquely good or special', 'expression', 25),

-- Internet Culture
('based', 'admirable/authentic', 'internet', 20),
('cringe', 'embarrassing/awkward', 'internet', 30),
('toxic', 'harmful/negative behavior', 'internet', 25),
('stan', 'strongly support/admire', 'internet', 15),

-- Intensifiers
('deadass', 'seriously/for real', 'intensifier', 20),
('literally', 'used for emphasis (not literally)', 'intensifier', 40),
('actually', 'genuinely/for real', 'intensifier', 15),

-- Activities & States
('vibing', 'relaxing/enjoying the moment', 'activity', 25),
('ghosted', 'suddenly stopped communicating', 'activity', 30),
('sliding into dms', 'privately messaging someone', 'activity', 15),

-- Approval/Disapproval
('slaps', 'is really good (usually music)', 'approval', 15),
('goes hard', 'is really good/intense', 'approval', 20),
('ain''t it', 'isn''t it/right?', 'agreement', 10),

-- Combinations (common phrases)
('no cap fr', 'no lie, for real', 'combination', 15),
('fr fr', 'for real, for real', 'combination', 25),
('ngl bestie', 'not going to lie, best friend', 'combination', 10),
('periodt slay', 'period (end of discussion), do it excellently', 'combination', 8)
ON CONFLICT (genz_text) DO NOTHING;

-- Create a function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for terms table
CREATE TRIGGER update_terms_updated_at 
    BEFORE UPDATE ON terms 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Grant all privileges to the user
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO genz_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO genz_user;

-- Verify data insertion
SELECT 'Total terms inserted: ' || COUNT(*) as result FROM terms;
SELECT 'Total translation history: ' || COUNT(*) as result FROM translation_history;
SELECT 'Categories available: ' || string_agg(DISTINCT category, ', ') as result FROM terms WHERE category IS NOT NULL;