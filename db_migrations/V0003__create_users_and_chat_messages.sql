CREATE TABLE IF NOT EXISTS t_p31046477_project_zenith_2023_.users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS t_p31046477_project_zenith_2023_.chat_messages (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES t_p31046477_project_zenith_2023_.users(id),
  text TEXT NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON t_p31046477_project_zenith_2023_.chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON t_p31046477_project_zenith_2023_.chat_messages(created_at);
