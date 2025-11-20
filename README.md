# Kashflow Kathy - Complete Business Platform

![License](https://img.shields.io/badge/license-Proprietary-red)
![Status](https://img.shields.io/badge/status-Ready%20for%20Deployment-green)

**A comprehensive website, CRM, CMS, and mobile application for cost segregation and R&D tax credit consulting.**

## 🎯 Project Overview

Kashflow Kathy is a full-stack business platform built for Kathy Ferguson, a cost segregation specialist serving the Louisiana and Gulf Coast region. The platform includes:

- **Professional Website** - 10-page Next.js website with calculators and lead capture
- **CRM System** - Complete contact and deal management with 12-stage pipeline
- **CMS** - Content management with role-based permissions
- **Mobile App** - React Native app for iOS and Android
- **Social Media Suite** - AI-powered social posting across 6 platforms
- **Automation Engine** - Email, SMS, and follow-up automations

## 📁 Project Structure

```
kashflowkathy.com/
├── public/             # Static assets
│   └── assets/         # Images, videos, branding
├── src/                # Website source
│   ├── components/     # React components
│   ├── pages/          # Next.js pages (10 total)
│   ├── layouts/        # Page layouts
│   ├── styles/         # Global styles
│   ├── lib/            # Supabase, OpenAI integrations
│   └── utils/          # Helper functions
├── cms/                # CMS application
│   ├── pages/          # Editor, Permissions
│   └── components/     # CMS-specific components
├── crm/                # CRM application
│   ├── pages/          # Dashboard, Contacts, Pipeline, etc.
│   └── services/       # CRM business logic
├── mobile/             # React Native mobile app
│   └── screens/        # 8 mobile screens
├── database/           # Database schema
│   └── schema.sql      # PostgreSQL/Supabase schema
├── scripts/            # Build and migration scripts
└── data/               # Scraped and generated data
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- OpenAI API key
- Telnyx account (for SMS/calling)
- Zoom API credentials

### Installation

1. **Clone and Install**
   ```bash
   cd kashflowkathy.com
   npm install
   ```

2. **Configure Environment**
   ```bash
   cp .env.example .env
   # Edit .env and fill in your API keys
   ```

3. **Run Database Migration**
   ```bash
   npm run db:migrate
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

5. **Open Browser**
   Navigate to `http://localhost:3000`

## 🔑 Default Credentials

**Master Account:**
- Username: `masteracct`
- Password: `Number79-2025`

**Kathy's Account:**
- Username: `admin`
- Password: `Ferguson`

⚠️ **Change these immediately in production!**

## 📦 Features

### Website
- ✅ Cinematic hero section with particle effects
- ✅ Cost segregation calculator
- ✅ R&D tax credit estimator
- ✅ Lead capture forms (integrated with CRM)
- ✅ Content hub (YouTube/TikTok ready)
- ✅ Referral program
- ✅ Partnership pages
- ✅ Zoom meeting scheduler

### CRM
- ✅ Contact management
- ✅ 12-stage drag-and-drop pipeline
- ✅ Email & SMS templates
- ✅ Automation sequences
- ✅ Referral tracking
- ✅ Commission calculations (10% referral, 40% direct)
- ✅ Document vault
- ✅ Call/SMS logging
- ✅ Zoom call integration

### CMS
- ✅ Visual page editor
- ✅ Media library
- ✅ Branding manager
- ✅ Role-based permissions
  - Master: Full access
  - Admin (Kathy): Website editing, CRM, limited settings
  - Employee: Restricted access

### Mobile App
- ✅ Dashboard with key metrics
- ✅ Contact management
- ✅ iPhone contact sync
- ✅ Calling & texting
- ✅ Push notifications
- ✅ Pipeline view
- ✅ AI recommendations

### Social Media
- ✅ Multi-platform posting (LinkedIn, Instagram, Facebook, TikTok, YouTube, Twitter)
- ✅ AI caption generation (OpenAI)
- ✅ Post scheduling
- ✅ Analytics tracking

## 🔧 Configuration

### Supabase Setup

1. Create a new Supabase project
2. Copy your project URL and keys to `.env`
3. Run the migration script to create tables
4. Configure Row Level Security policies

### OpenAI Integration

Add your OpenAI API key to `.env`:
```
OPENAI_API_KEY=sk-...
```

Used for:
- AI-generated email follow-ups
- Social media captions
- Conversation summaries
- R&D eligibility recommendations

### Telnyx (SMS/Calling)

1. Create Telnyx account
2. Get API key
3. Configure phone number
4. Add to `.env`

Until configured, the mobile app uses the personal iPhone number.

### Zoom Integration

1. Create Zoom OAuth app
2. Get API key and secret
3. Add to `.env`
4. Configure redirect URLs

## 📱 Mobile App Setup

### iOS

```bash
cd mobile/ios
pod install
cd ../..
npm run mobile:ios
```

### Android

```bash
npm run mobile:android
```

## 🎨 Theming

Global color scheme:
- **Navy**: `#002d69` (Primary)
- **Gold**: `#f5d787` (Secondary)
- **White**: `#ffffff`
- **Slate**: `#64748b` (Text)

Colors can be customized in `tailwind.config.js`.

## 📊 Database Schema

Key tables:
- `users` - Authentication and permissions
- `contacts` - Lead and customer data
- `pipelines` - Deal stages and tracking
- `communications` - Call, email, SMS logs
- `automations` - Automation rules
- `referrals` - Referral tracking
- `commissions` - Commission calculations
- `social_posts` - Scheduled social content

See `database/schema.sql` for complete schema.

## 🔐 Security

- Row Level Security (RLS) enabled on all tables
- Master account has full access
- Admin (Kathy) has restricted access to master-only features
- Employees see only assigned contacts
- All passwords hashed with bcrypt
- JWT tokens for API authentication

## 🧪 Testing

```bash
npm test              # Run all tests
npm run test:watch    # Watch mode
```

Test coverage includes:
- Contact form submissions
- Calculator accuracy
- Pipeline stage transitions
- Permission enforcement
- API integrations

## 📈 Deployment

### Website (Vercel/Netlify)

```bash
npm run build
# Deploy dist/ folder
```

### Mobile App

Follow standard React Native deployment:
- iOS: Xcode → Archive → Upload to App Store
- Android: Generate signed APK → Upload to Google Play

### Database

Supabase handles database hosting automatically.

## 🤝 Support

For technical support:
- Email: helloworld@pitchmarketing.agency
- Documentation: See `/docs` folder

## 📄 License

**Proprietary License**
Copyright © 2025 Pitch Market Strategies & Public Relations LLC
All rights reserved. Internal use only.

## 🏗️ Built With

- **Next.js 14** - React framework
- **React 18** - UI library
- **Tailwind CSS** - Styling
- **Supabase** - Backend and database
- **OpenAI GPT-4** - AI features
- **Framer Motion** - Animations
- **React Native** - Mobile app
- **Telnyx** - SMS and calling
- **Zoom API** - Video meetings

---

**Built by Pitch Market Strategies & Public Relations LLC**
*Empowering businesses through technology*
