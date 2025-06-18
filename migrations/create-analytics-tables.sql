-- Analytics Events Table
-- Stores all user interactions and events
CREATE TABLE IF NOT EXISTS analytics_events (
  id SERIAL PRIMARY KEY,
  event_type VARCHAR(50) NOT NULL, -- view, click, scroll, lead, share, etc.
  event_data JSONB, -- Flexible data storage for event-specific data
  post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
  session_id VARCHAR(100),
  visitor_id VARCHAR(100),
  ip_address INET,
  user_agent TEXT,
  referrer TEXT,
  utm_source VARCHAR(100),
  utm_medium VARCHAR(100),
  utm_campaign VARCHAR(100),
  utm_term VARCHAR(100),
  utm_content VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for analytics_events
CREATE INDEX idx_analytics_events_post_id ON analytics_events(post_id);
CREATE INDEX idx_analytics_events_session_id ON analytics_events(session_id);
CREATE INDEX idx_analytics_events_visitor_id ON analytics_events(visitor_id);
CREATE INDEX idx_analytics_events_created_at ON analytics_events(created_at);
CREATE INDEX idx_analytics_events_event_type ON analytics_events(event_type);

-- Visitor Sessions Table
-- Tracks unique visitor sessions
CREATE TABLE IF NOT EXISTS visitor_sessions (
  id SERIAL PRIMARY KEY,
  session_id VARCHAR(100) UNIQUE NOT NULL,
  visitor_id VARCHAR(100) NOT NULL,
  ip_address INET,
  user_agent TEXT,
  device_type VARCHAR(50), -- desktop, mobile, tablet
  browser VARCHAR(50),
  os VARCHAR(50),
  country VARCHAR(2),
  city VARCHAR(100),
  region VARCHAR(100),
  landing_page TEXT,
  exit_page TEXT,
  page_views INTEGER DEFAULT 0,
  duration INTEGER, -- in seconds
  bounce BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for visitor_sessions
CREATE INDEX idx_visitor_sessions_visitor_id ON visitor_sessions(visitor_id);
CREATE INDEX idx_visitor_sessions_created_at ON visitor_sessions(created_at);
CREATE INDEX idx_visitor_sessions_device_type ON visitor_sessions(device_type);

-- Page Views Table
-- Detailed page view tracking
CREATE TABLE IF NOT EXISTS page_views (
  id SERIAL PRIMARY KEY,
  post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
  session_id VARCHAR(100),
  visitor_id VARCHAR(100),
  time_on_page INTEGER, -- in seconds
  scroll_depth INTEGER, -- percentage
  exit_rate BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for page_views
CREATE INDEX idx_page_views_post_id ON page_views(post_id);
CREATE INDEX idx_page_views_session_id ON page_views(session_id);
CREATE INDEX idx_page_views_created_at ON page_views(created_at);

-- Conversions Table
-- Track conversion events with attribution
CREATE TABLE IF NOT EXISTS conversions (
  id SERIAL PRIMARY KEY,
  conversion_type VARCHAR(50) NOT NULL, -- lead, signup, download, consultation
  post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
  session_id VARCHAR(100),
  visitor_id VARCHAR(100),
  attribution_source VARCHAR(100), -- direct, organic, social, referral
  attribution_data JSONB, -- Additional attribution details
  form_data JSONB, -- Submitted form data (encrypted/anonymized)
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for conversions
CREATE INDEX idx_conversions_post_id ON conversions(post_id);
CREATE INDEX idx_conversions_conversion_type ON conversions(conversion_type);
CREATE INDEX idx_conversions_created_at ON conversions(created_at);

-- Analytics Aggregates Table
-- Pre-computed analytics for performance
CREATE TABLE IF NOT EXISTS analytics_aggregates (
  id SERIAL PRIMARY KEY,
  post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
  period_type VARCHAR(20) NOT NULL, -- hour, day, week, month
  period_start TIMESTAMP NOT NULL,
  views INTEGER DEFAULT 0,
  unique_visitors INTEGER DEFAULT 0,
  avg_time_on_page INTEGER DEFAULT 0,
  avg_scroll_depth INTEGER DEFAULT 0,
  bounce_rate DECIMAL(5,2) DEFAULT 0,
  conversion_rate DECIMAL(5,2) DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for analytics_aggregates
CREATE INDEX idx_analytics_aggregates_post_id ON analytics_aggregates(post_id);
CREATE INDEX idx_analytics_aggregates_period ON analytics_aggregates(period_type, period_start);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_visitor_sessions_updated_at BEFORE UPDATE ON visitor_sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_analytics_aggregates_updated_at BEFORE UPDATE ON analytics_aggregates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();