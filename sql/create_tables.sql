--
-- Database : 'proverby'
-- PostgreSQL
--

-- --------------------------------------------------------

--
-- Table structure for table 'users'
--

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  uid VARCHAR(255) NOT NULL UNIQUE,
  display_name VARCHAR(255) NOT NULL UNIQUE,
  username VARCHAR(50) UNIQUE,
  email VARCHAR(255) NOT NULL,
  foto_profilo VARCHAR(255) NOT NULL,
  is_admin INT DEFAULT 0 NOT NULL,
  is_moderator INT DEFAULT 0 NOT NULL
);

--
-- Table structure for table 'places'
--

CREATE TABLE IF NOT EXISTS places (
  id SERIAL PRIMARY KEY,
  place_name VARCHAR(255) NOT NULL,
  place_description TEXT,
  place_lat DOUBLE PRECISION NOT NULL,
  place_long DOUBLE PRECISION NOT NULL,
  uid VARCHAR(50) NOT NULL,
  stato INT DEFAULT 0 NOT NULL,
  data_accettazione DATE NOT NULL DEFAULT CURRENT_DATE,
  opening_hours JSONB NOT NULL,
  entry_mode INT DEFAULT 0 NOT NULL,
  has_free_wifi BOOLEAN NOT NULL DEFAULT false,
  has_power_sockets BOOLEAN NOT NULL DEFAULT false,
  has_air BOOLEAN NOT NULL DEFAULT false,
  has_heating BOOLEAN NOT NULL DEFAULT false,
  has_smart BOOLEAN NOT NULL DEFAULT false,
  has_silence BOOLEAN NOT NULL DEFAULT false,
  has_disabled_access BOOLEAN NOT NULL DEFAULT false
);