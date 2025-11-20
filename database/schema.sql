-- Kashflow Kathy Database Schema
-- Supabase PostgreSQL Database
-- Author: Pitch Market Strategies & Public Relations LLC

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users and Authentication
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    phone VARCHAR(20),
    role VARCHAR(50) DEFAULT 'employee', -- masteracct, admin, employee
    permissions JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Roles and Permissions
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    permissions JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Contacts/Leads
CREATE TABLE contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    address TEXT,
    age INTEGER,
    company VARCHAR(255),
    property_type VARCHAR(100),
    property_cost DECIMAL(15, 2),
    payroll DECIMAL(15, 2),
    lead_source VARCHAR(100),
    notes TEXT,
    tags TEXT[],
    status VARCHAR(50) DEFAULT 'new', -- new, warm, hot, cold, converted, lost
    pipeline_stage VARCHAR(100) DEFAULT 'inquiry',
    last_communication TIMESTAMP,
    assigned_to UUID REFERENCES users(id),
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pipeline Stages
CREATE TABLE pipeline_stages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    display_order INTEGER NOT NULL,
    color VARCHAR(7) DEFAULT '#002d69',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default pipeline stages
INSERT INTO pipeline_stages (name, display_order) VALUES
('Inquiry', 1),
('Qualified', 2),
('Analysis Requested', 3),
('Proposal Sent', 4),
('Negotiation', 5),
('Contract Signed', 6),
('Study in Progress', 7),
('Study Complete', 8),
('Delivered', 9),
('Paid', 10),
('Referral Source', 11),
('Follow-up', 12);

-- Pipelines/Deals
CREATE TABLE pipelines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
    stage_id UUID REFERENCES pipeline_stages(id),
    deal_value DECIMAL(15, 2),
    probability INTEGER DEFAULT 50, -- 0-100
    expected_close_date DATE,
    actual_close_date DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Communication Log
CREATE TABLE communications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- call, sms, email, meeting, note
    direction VARCHAR(20), -- inbound, outbound
    subject VARCHAR(255),
    body TEXT,
    duration INTEGER, -- in seconds for calls
    status VARCHAR(50), -- completed, missed, scheduled
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Automations
CREATE TABLE automations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    trigger_type VARCHAR(100) NOT NULL, -- time_based, event_based
    trigger_config JSONB,
    action_type VARCHAR(100) NOT NULL, -- send_email, send_sms, update_stage, assign_to
    action_config JSONB,
    is_active BOOLEAN DEFAULT true,
    last_run TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Email Templates
CREATE TABLE email_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    subject VARCHAR(255),
    body TEXT,
    variables JSONB, -- {{name}}, {{company}}, etc.
    category VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- SMS Templates
CREATE TABLE sms_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    variables JSONB,
    category VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sequences
CREATE TABLE sequences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    steps JSONB, -- Array of steps with delays and actions
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sequence Enrollments
CREATE TABLE sequence_enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sequence_id UUID REFERENCES sequences(id) ON DELETE CASCADE,
    contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
    current_step INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'active', -- active, paused, completed, exited
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

-- Referrals
CREATE TABLE referrals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    referrer_name VARCHAR(255) NOT NULL,
    referrer_email VARCHAR(255),
    referrer_phone VARCHAR(20),
    referred_contact_id UUID REFERENCES contacts(id),
    status VARCHAR(50) DEFAULT 'pending', -- pending, converted, paid
    commission_rate DECIMAL(5, 4) DEFAULT 0.10,
    commission_amount DECIMAL(10, 2),
    paid_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Commissions
CREATE TABLE commissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    referral_id UUID REFERENCES referrals(id),
    contact_id UUID REFERENCES contacts(id),
    deal_value DECIMAL(15, 2),
    commission_rate DECIMAL(5, 4),
    commission_amount DECIMAL(10, 2),
    type VARCHAR(50), -- referral, direct
    status VARCHAR(50) DEFAULT 'pending', -- pending, approved, paid
    payment_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Documents
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
    filename VARCHAR(255) NOT NULL,
    file_path VARCHAR(500),
    file_size INTEGER,
    file_type VARCHAR(100),
    category VARCHAR(100),
    uploaded_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Zoom Call Logs
CREATE TABLE zoom_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contact_id UUID REFERENCES contacts(id),
    meeting_id VARCHAR(255),
    meeting_url TEXT,
    start_time TIMESTAMP,
    duration INTEGER,
    participants JSONB,
    recording_url TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Social Media Posts
CREATE TABLE social_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    platform VARCHAR(50) NOT NULL, -- linkedin, instagram, facebook, tiktok, youtube, twitter
    content TEXT NOT NULL,
    media_urls TEXT[],
    hashtags TEXT[],
    scheduled_for TIMESTAMP,
    posted_at TIMESTAMP,
    status VARCHAR(50) DEFAULT 'draft', -- draft, scheduled, posted, failed
    analytics JSONB, -- likes, shares, comments, views
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Content Hub
CREATE TABLE content_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    type VARCHAR(50), -- video, article, tiktok
    platform VARCHAR(50),
    url TEXT,
    embed_code TEXT,
    description TEXT,
    thumbnail_url TEXT,
    is_published BOOLEAN DEFAULT false,
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Company Settings
CREATE TABLE company_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(100) UNIQUE NOT NULL,
    value JSONB,
    description TEXT,
    updated_by UUID REFERENCES users(id),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- CMS Pages
CREATE TABLE cms_pages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255),
    content JSONB, -- Rich content blocks
    meta_description TEXT,
    is_published BOOLEAN DEFAULT false,
    updated_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Activity Log
CREATE TABLE activity_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(100),
    entity_type VARCHAR(100),
    entity_id UUID,
    details JSONB,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE pipelines ENABLE ROW LEVEL SECURITY;
ALTER TABLE communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE commissions ENABLE ROW LEVEL SECURITY;

-- MasterAcct has full access
CREATE POLICY "masteracct_full_access" ON users
    FOR ALL USING (
        (SELECT role FROM users WHERE id = auth.uid()) = 'masteracct'
    );

CREATE POLICY "masteracct_contacts" ON contacts
    FOR ALL USING (
        (SELECT role FROM users WHERE id = auth.uid()) IN ('masteracct', 'admin')
    );

-- Admin (Kathy) has access except to master permissions
CREATE POLICY "admin_access" ON users
    FOR SELECT USING (
        (SELECT role FROM users WHERE id = auth.uid()) IN ('masteracct', 'admin')
    );

-- Employees can only see their own assigned contacts
CREATE POLICY "employee_contacts" ON contacts
    FOR SELECT USING (
        assigned_to = auth.uid() OR
        (SELECT role FROM users WHERE id = auth.uid()) IN ('masteracct', 'admin')
    );

-- Indexes for performance
CREATE INDEX idx_contacts_email ON contacts(email);
CREATE INDEX idx_contacts_phone ON contacts(phone);
CREATE INDEX idx_contacts_status ON contacts(status);
CREATE INDEX idx_contacts_pipeline_stage ON contacts(pipeline_stage);
CREATE INDEX idx_contacts_assigned_to ON contacts(assigned_to);
CREATE INDEX idx_communications_contact_id ON communications(contact_id);
CREATE INDEX idx_pipelines_contact_id ON pipelines(contact_id);
CREATE INDEX idx_documents_contact_id ON documents(contact_id);

-- Functions
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE ON contacts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pipelines_updated_at BEFORE UPDATE ON pipelines
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
