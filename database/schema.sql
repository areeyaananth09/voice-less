-- ============================================
-- VoiceLess Database Schema
-- Neon PostgreSQL Database
-- ============================================

-- Drop existing table if you want to start fresh (CAREFUL!)
-- DROP TABLE IF EXISTS gestures CASCADE;

-- ============================================
-- 1. GESTURES TABLE
-- Stores word-to-video mappings for sign language
-- ============================================

CREATE TABLE IF NOT EXISTS gestures (
  id SERIAL PRIMARY KEY,
  word TEXT UNIQUE NOT NULL,
  video_path TEXT NOT NULL,
  category TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster word lookups
CREATE INDEX IF NOT EXISTS idx_gestures_word ON gestures(word);
CREATE INDEX IF NOT EXISTS idx_gestures_category ON gestures(category);

-- ============================================
-- 2. SEED DATA - Common Sign Language Words
-- ============================================

INSERT INTO gestures (word, video_path, category) VALUES 
-- Greetings
('hello', '/gestures/hello.mp4', 'Greeting'),
('hi', '/gestures/hi.mp4', 'Greeting'),
('goodbye', '/gestures/goodbye.mp4', 'Greeting'),
('bye', '/gestures/bye.mp4', 'Greeting'),
('welcome', '/gestures/welcome.mp4', 'Greeting'),
('good morning', '/gestures/good-morning.mp4', 'Greeting'),
('good night', '/gestures/good-night.mp4', 'Greeting'),

-- Polite Expressions
('please', '/gestures/please.mp4', 'Polite'),
('thank you', '/gestures/thank-you.mp4', 'Polite'),
('thanks', '/gestures/thanks.mp4', 'Polite'),
('sorry', '/gestures/sorry.mp4', 'Polite'),
('excuse me', '/gestures/excuse-me.mp4', 'Polite'),

-- Questions
('how', '/gestures/how.mp4', 'Question'),
('what', '/gestures/what.mp4', 'Question'),
('where', '/gestures/where.mp4', 'Question'),
('when', '/gestures/when.mp4', 'Question'),
('why', '/gestures/why.mp4', 'Question'),
('who', '/gestures/who.mp4', 'Question'),

-- Common Verbs
('are', '/gestures/are.mp4', 'Verb'),
('is', '/gestures/is.mp4', 'Verb'),
('do', '/gestures/do.mp4', 'Verb'),
('go', '/gestures/go.mp4', 'Verb'),
('come', '/gestures/come.mp4', 'Verb'),
('want', '/gestures/want.mp4', 'Verb'),
('need', '/gestures/need.mp4', 'Verb'),
('help', '/gestures/help.mp4', 'Verb'),

-- Pronouns
('i', '/gestures/i.mp4', 'Pronoun'),
('you', '/gestures/you.mp4', 'Pronoun'),
('he', '/gestures/he.mp4', 'Pronoun'),
('she', '/gestures/she.mp4', 'Pronoun'),
('we', '/gestures/we.mp4', 'Pronoun'),
('they', '/gestures/they.mp4', 'Pronoun'),

-- Responses
('yes', '/gestures/yes.mp4', 'Response'),
('no', '/gestures/no.mp4', 'Response'),
('ok', '/gestures/ok.mp4', 'Response'),
('okay', '/gestures/okay.mp4', 'Response'),

-- Adjectives
('good', '/gestures/good.mp4', 'Adjective'),
('bad', '/gestures/bad.mp4', 'Adjective'),
('happy', '/gestures/happy.mp4', 'Adjective'),
('sad', '/gestures/sad.mp4', 'Adjective'),
('big', '/gestures/big.mp4', 'Adjective'),
('small', '/gestures/small.mp4', 'Adjective'),

-- Time
('today', '/gestures/today.mp4', 'Time'),
('tomorrow', '/gestures/tomorrow.mp4', 'Time'),
('yesterday', '/gestures/yesterday.mp4', 'Time'),
('now', '/gestures/now.mp4', 'Time'),
('later', '/gestures/later.mp4', 'Time'),

-- Common Nouns
('water', '/gestures/water.mp4', 'Noun'),
('food', '/gestures/food.mp4', 'Noun'),
('home', '/gestures/home.mp4', 'Noun'),
('work', '/gestures/work.mp4', 'Noun'),
('school', '/gestures/school.mp4', 'Noun'),
('friend', '/gestures/friend.mp4', 'Noun'),
('family', '/gestures/family.mp4', 'Noun')

ON CONFLICT (word) 
DO UPDATE SET 
  video_path = EXCLUDED.video_path,
  category = EXCLUDED.category,
  updated_at = CURRENT_TIMESTAMP;

-- ============================================
-- 3. VERIFICATION QUERIES
-- ============================================

-- Count total gestures
SELECT COUNT(*) as total_gestures FROM gestures;

-- View all gestures by category
SELECT category, COUNT(*) as count 
FROM gestures 
GROUP BY category 
ORDER BY count DESC;

-- View all gestures
SELECT id, word, video_path, category 
FROM gestures 
ORDER BY category, word;

-- ============================================
-- 4. USEFUL QUERIES FOR MAINTENANCE
-- ============================================

-- Find gestures without videos (if you want to check)
-- SELECT word FROM gestures WHERE video_path IS NULL;

-- Update a specific gesture
-- UPDATE gestures SET video_path = '/gestures/new-path.mp4' WHERE word = 'hello';

-- Delete a gesture
-- DELETE FROM gestures WHERE word = 'example';

-- Add a new gesture
-- INSERT INTO gestures (word, video_path, category) 
-- VALUES ('new_word', '/gestures/new_word.mp4', 'Category');
