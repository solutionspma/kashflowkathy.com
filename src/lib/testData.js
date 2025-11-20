// Centralized test data for all CRM modules
// This data will be used until database is fully configured

export const TEST_CONTACTS = [
  {
    id: 1,
    name: 'Kathy Ferguson',
    email: 'kathy@costseg.tax',
    phone: '(555) 123-4567',
    company: 'Kashflow Kathy Tax Services',
    status: 'active',
    tags: ['VIP', 'Tax Services'],
    notes: 'Primary business owner - specializes in R&D tax credits and tax planning',
    created_at: '2025-11-01T10:00:00Z'
  },
  {
    id: 2,
    name: 'Jason Harris',
    email: 'jason@pitchmarketingagency.com',
    phone: '(225) 418-8858',
    company: 'Pitch Marketing Agency',
    status: 'active',
    tags: ['Partner', 'Marketing'],
    notes: 'Marketing agency owner - collaboration on digital strategies and lead generation',
    created_at: '2025-11-05T14:30:00Z'
  },
  {
    id: 3,
    name: 'Sarah Mitchell',
    email: 'sarah.mitchell@techstartup.com',
    phone: '(555) 234-5678',
    company: 'Tech Startup Inc',
    status: 'lead',
    tags: ['R&D Credit', 'Startup'],
    notes: 'Tech startup founder - interested in R&D tax credit program for software development',
    created_at: '2025-11-10T09:15:00Z'
  },
  {
    id: 4,
    name: 'Michael Chen',
    email: 'm.chen@manufacturingco.com',
    phone: '(555) 345-6789',
    company: 'Manufacturing Co LLC',
    status: 'active',
    tags: ['Manufacturing', 'Tax Planning'],
    notes: 'Manufacturing business - quarterly tax planning and compliance services',
    created_at: '2025-11-12T11:45:00Z'
  },
  {
    id: 5,
    name: 'Emily Rodriguez',
    email: 'emily.r@consultinggroup.com',
    phone: '(555) 456-7890',
    company: 'Consulting Group',
    status: 'inactive',
    tags: ['Consulting', 'Referral'],
    notes: 'Consulting firm - referred 3 clients last quarter, potential partnership',
    created_at: '2025-10-28T16:20:00Z'
  }
]

export const TEST_DEALS = [
  {
    id: 1,
    contact_id: 1,
    stage: 'qualified',
    title: 'Q4 Tax Planning - Kashflow Kathy',
    deal_value: 15000,
    probability: 90,
    expected_close_date: '2025-12-15',
    notes: 'Year-end tax strategy and R&D credit filing',
    created_at: '2025-11-01T10:00:00Z'
  },
  {
    id: 2,
    contact_id: 2,
    stage: 'proposal',
    title: 'Marketing Services - Pitch Agency',
    deal_value: 25000,
    probability: 75,
    expected_close_date: '2025-12-01',
    notes: 'Annual marketing retainer and SEO services',
    created_at: '2025-11-05T14:30:00Z'
  },
  {
    id: 3,
    contact_id: 3,
    stage: 'discovery',
    title: 'R&D Credit Analysis - Tech Startup',
    deal_value: 8500,
    probability: 60,
    expected_close_date: '2025-12-20',
    notes: 'Initial R&D tax credit assessment for software development',
    created_at: '2025-11-10T09:15:00Z'
  },
  {
    id: 4,
    contact_id: 4,
    stage: 'won',
    title: 'Quarterly Tax Services - Manufacturing Co',
    deal_value: 12000,
    probability: 100,
    expected_close_date: '2025-11-30',
    notes: 'Q4 tax filing and planning - CLOSED WON',
    created_at: '2025-11-12T11:45:00Z'
  },
  {
    id: 5,
    contact_id: 3,
    stage: 'qualified',
    title: 'Business Tax Return - Tech Startup',
    deal_value: 5000,
    probability: 85,
    expected_close_date: '2025-12-10',
    notes: 'Annual business tax return filing',
    created_at: '2025-11-15T10:00:00Z'
  },
  {
    id: 6,
    contact_id: 1,
    stage: 'discovery',
    title: 'Estate Planning Consultation',
    deal_value: 3500,
    probability: 50,
    expected_close_date: '2026-01-15',
    notes: 'Personal estate planning and trust setup',
    created_at: '2025-11-18T14:00:00Z'
  }
]

export const TEST_STAGES = [
  { id: 'discovery', name: 'Discovery', color: '#3b82f6', order: 1 },
  { id: 'qualified', name: 'Qualified', color: '#8b5cf6', order: 2 },
  { id: 'proposal', name: 'Proposal', color: '#f59e0b', order: 3 },
  { id: 'won', name: 'Won', color: '#10b981', order: 4 }
]

// Generate comprehensive template library (100 email + 100 SMS)
const generateEmailTemplates = () => {
  const categories = [
    { name: 'onboarding', count: 15 },
    { name: 'cost-segregation', count: 20 },
    { name: 'rd-credit', count: 15 },
    { name: 'sales', count: 15 },
    { name: 'follow-up', count: 10 },
    { name: 'reminder', count: 8 },
    { name: 'referral', count: 7 },
    { name: 'closing', count: 10 }
  ]
  
  const templates = []
  let id = 1
  
  categories.forEach(cat => {
    for (let i = 1; i <= cat.count; i++) {
      templates.push({
        id: id++,
        name: `${cat.name.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} Email ${i}`,
        type: 'email',
        subject: `[${cat.name.toUpperCase()}] Template ${i} - [VARIABLE]`,
        content: `Hi [NAME],\n\n[Template content for ${cat.name} email ${i}]\n\nBest regards,\nKathy Ferguson\nKashflow Kathy\nkathy@costseg.tax`,
        category: cat.name,
        is_active: true,
        styling: { fontFamily: 'Arial', fontSize: 14, color: '#333333', bold: false, italic: false }
      })
    }
  })
  
  return templates
}

const generateSMSTemplates = () => {
  const categories = [
    { name: 'appointment', count: 15 },
    { name: 'reminder', count: 20 },
    { name: 'follow-up', count: 15 },
    { name: 'confirmation', count: 12 },
    { name: 'thank-you', count: 10 },
    { name: 'urgent', count: 10 },
    { name: 'info', count: 10 },
    { name: 'referral', count: 8 }
  ]
  
  const templates = []
  let id = 101
  
  categories.forEach(cat => {
    for (let i = 1; i <= cat.count; i++) {
      templates.push({
        id: id++,
        name: `${cat.name.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} SMS ${i}`,
        type: 'sms',
        subject: '',
        content: `[${cat.name.toUpperCase()}] SMS ${i}: [NAME], [MESSAGE]. Reply or call (555) 123-4567. -Kashflow Kathy`,
        category: cat.name,
        is_active: true,
        styling: { fontFamily: 'system', fontSize: 12, color: '#000000', bold: false, italic: false }
      })
    }
  })
  
  return templates
}

export const TEST_TEMPLATES = [
  // Premium handcrafted templates
  {
    id: 1,
    name: 'Welcome Email - New Client',
    type: 'email',
    subject: 'Welcome to Kashflow Kathy Tax Services!',
    content: `Hi [NAME],

Welcome to Kashflow Kathy! We're thrilled to have you as a client.

Your dedicated tax specialist will reach out within 24 hours to schedule your initial consultation. In the meantime, please feel free to reply to this email with any questions.

We look forward to helping you maximize your tax savings!

Best regards,
Kathy Ferguson
Kashflow Kathy Tax Services
kathy@costseg.tax`,
    category: 'onboarding',
    is_active: true,
    styling: { fontFamily: 'Georgia', fontSize: 14, color: '#002d69', bold: false, italic: false }
  },
  {
    id: 2,
    name: 'Cost Segregation Introduction',
    type: 'email',
    subject: 'Unlock Hidden Tax Savings with Cost Segregation',
    content: `Hi [NAME],

Did you know that commercial property owners are missing out on $50K-$500K in tax deductions?

Cost segregation is an IRS-approved strategy that accelerates depreciation on your property, putting cash back in your pocket THIS year.

For a property valued at [PROPERTY_VALUE], you could be eligible for:
✓ $[ESTIMATED_SAVINGS] in first-year tax savings
✓ Increased cash flow for reinvestment
✓ 100% bonus depreciation on qualifying assets

Let's schedule a 15-minute call to see if this strategy makes sense for you.

Best regards,
Kathy Ferguson
kathy@costseg.tax
(555) 123-4567`,
    category: 'cost-segregation',
    is_active: true,
    styling: { fontFamily: 'Arial', fontSize: 14, color: '#333333', bold: false, italic: false }
  },
  {
    id: 3,
    name: 'R&D Credit Qualification',
    type: 'email',
    subject: 'You May Qualify for R&D Tax Credits - [COMPANY]',
    content: `Hi [NAME],

Most businesses don't realize they're doing "research and development" in the IRS's eyes.

If your company:
- Develops or improves products/processes
- Employs engineers, developers, or designers
- Spends money solving technical challenges

You likely qualify for R&D tax credits!

Average credit for companies like yours: $[ESTIMATED_CREDIT]

This isn't a loan - it's money the government owes you for innovation.

Ready to claim what's yours? Let's talk.

Best,
Kathy Ferguson`,
    category: 'rd-credit',
    is_active: true,
    styling: { fontFamily: 'Helvetica', fontSize: 14, color: '#1a1a1a', bold: false, italic: false }
  },
  {
    id: 4,
    name: 'Proposal Follow-Up',
    type: 'email',
    subject: 'Quick Question About Your Proposal',
    content: `Hi [NAME],

I wanted to follow up on the proposal I sent last week for [SERVICE].

Do you have any questions? I'm happy to jump on a quick call to walk through the details.

The potential savings we identified: $[SAVINGS_AMOUNT]
Our fee: $[FEE_AMOUNT]
Your net benefit: $[NET_BENEFIT]

This is a no-brainer ROI, and I'd love to help you capture these savings before year-end.

When works for a 10-minute call?

Best,
Kathy`,
    category: 'follow-up',
    is_active: true,
    styling: { fontFamily: 'Arial', fontSize: 14, color: '#333333', bold: false, italic: false }
  },
  {
    id: 5,
    name: 'Appointment Reminder',
    type: 'sms',
    subject: '',
    content: `Hi [NAME]! Reminder: Your consultation with Kathy is tomorrow at [TIME]. Reply CONFIRM or call (555) 123-4567. -Kashflow Kathy`,
    category: 'appointment',
    is_active: true,
    styling: { fontFamily: 'system', fontSize: 12, color: '#000000', bold: false, italic: false }
  },
  {
    id: 6,
    name: 'Document Request',
    type: 'sms',
    subject: '',
    content: `[NAME], we need [DOCUMENT_TYPE] to proceed with your cost seg study. Upload at [LINK] or reply with questions. Thanks! -Kathy`,
    category: 'reminder',
    is_active: true,
    styling: { fontFamily: 'system', fontSize: 12, color: '#000000', bold: false, italic: false }
  },
  ...generateEmailTemplates(),
  ...generateSMSTemplates()
]

export const TEST_SOCIAL_POSTS = [
  {
    id: 1,
    platform: 'LinkedIn',
    content: '🎯 Did you know? Small businesses can claim up to $250K in R&D tax credits! Most don\'t even know they qualify. If you\'re developing software, improving processes, or creating new products - you might be eligible. DM me to learn more! #TaxTips #SmallBusiness #RDCredit',
    hashtags: ['TaxTips', 'SmallBusiness', 'RDCredit', 'TaxSavings'],
    scheduled_for: '2025-11-25T10:00:00Z',
    status: 'scheduled'
  },
  {
    id: 2,
    platform: 'Facebook',
    content: '💰 Year-End Tax Planning Tip: Don\'t wait until December 31st! Smart tax moves to make NOW:\n\n✓ Review your deductions\n✓ Check retirement contributions\n✓ Plan equipment purchases\n✓ Consider income timing\n\nNeed help? Book a FREE consultation! Link in bio.',
    hashtags: ['TaxPlanning', 'YearEnd', 'SmallBusiness'],
    scheduled_for: '2025-11-26T14:00:00Z',
    status: 'scheduled'
  },
  {
    id: 3,
    platform: 'Instagram',
    content: '📊 Q4 Tax Checklist for Business Owners!\n\nSwipe to see what you should be doing RIGHT NOW to maximize your tax savings.\n\nSave this post and share with a fellow business owner! 💼\n\n#BusinessTips #TaxSeason #Entrepreneur',
    hashtags: ['BusinessTips', 'TaxSeason', 'Entrepreneur', 'SmallBizOwner'],
    scheduled_for: '2025-11-27T09:00:00Z',
    status: 'draft'
  },
  {
    id: 4,
    platform: 'Twitter',
    content: '🚨 Tax Deadline Alert! \n\nQ4 estimated tax payments due January 15th.\n\nDon\'t get caught with penalties! \n\nNeed help calculating? Reply or DM 📧\n\n#TaxDeadline #SmallBusiness #Taxes',
    hashtags: ['TaxDeadline', 'SmallBusiness', 'Taxes'],
    scheduled_for: '2025-12-01T11:00:00Z',
    status: 'scheduled'
  },
  {
    id: 5,
    platform: 'LinkedIn',
    content: '💡 Client Success Story:\n\nHelped a manufacturing client claim $180K in R&D tax credits they didn\'t know existed!\n\nResult: Reinvested in new equipment and hired 3 new employees.\n\nThat\'s the power of smart tax strategy. What\'s possible for YOUR business?\n\n#ClientSuccess #TaxCredits #Manufacturing',
    hashtags: ['ClientSuccess', 'TaxCredits', 'Manufacturing', 'BusinessGrowth'],
    scheduled_for: '2025-11-28T15:00:00Z',
    status: 'posted',
    posted_at: '2025-11-28T15:00:00Z'
  }
]

export const TEST_AUTOMATIONS = [
  {
    id: 1,
    name: 'New Lead Welcome Sequence',
    trigger_type: 'contact_created',
    trigger_conditions: { status: 'lead' },
    is_active: true,
    actions: [
      { type: 'send_email', template_id: 1, delay_minutes: 0 },
      { type: 'create_task', task_description: 'Follow up with new lead', delay_minutes: 1440 },
      { type: 'send_sms', template_id: 3, delay_minutes: 2880 }
    ]
  },
  {
    id: 2,
    name: 'Deal Won - Onboarding Flow',
    trigger_type: 'deal_stage_changed',
    trigger_conditions: { new_stage: 'won' },
    is_active: true,
    actions: [
      { type: 'send_email', template_id: 1, delay_minutes: 0 },
      { type: 'update_contact_status', new_status: 'active', delay_minutes: 0 },
      { type: 'create_task', task_description: 'Send welcome package', delay_minutes: 60 },
      { type: 'assign_to_user', user_id: 1, delay_minutes: 0 }
    ]
  },
  {
    id: 3,
    name: 'Quarterly Tax Reminder',
    trigger_type: 'scheduled',
    trigger_conditions: { schedule: 'quarterly', day: 1 },
    is_active: true,
    actions: [
      { type: 'send_email', template_id: 5, delay_minutes: 0 },
      { type: 'create_task', task_description: 'Review quarterly tax obligations', delay_minutes: 0 }
    ]
  },
  {
    id: 4,
    name: 'Inactive Contact Re-engagement',
    trigger_type: 'time_based',
    trigger_conditions: { days_inactive: 90 },
    is_active: true,
    actions: [
      { type: 'send_email', template_id: 2, delay_minutes: 0 },
      { type: 'update_contact_tag', tag: 'Re-engagement', delay_minutes: 0 }
    ]
  },
  {
    id: 5,
    name: 'Proposal Follow-Up',
    trigger_type: 'deal_stage_changed',
    trigger_conditions: { new_stage: 'proposal' },
    is_active: true,
    actions: [
      { type: 'send_email', template_id: 4, delay_minutes: 0 },
      { type: 'create_task', task_description: 'Follow up on proposal in 3 days', delay_minutes: 4320 },
      { type: 'send_email', template_id: 4, delay_minutes: 10080 }
    ]
  }
]

export const TEST_DOCUMENTS = [
  {
    id: 1,
    contact_id: 1,
    filename: 'Q4_2025_Tax_Strategy.pdf',
    file_path: '/documents/kathy-ferguson/Q4_2025_Tax_Strategy.pdf',
    file_size: 2458624,
    file_type: 'application/pdf',
    category: 'report',
    uploaded_at: '2025-11-15T10:30:00Z'
  },
  {
    id: 2,
    contact_id: 2,
    filename: 'Service_Agreement_2025.pdf',
    file_path: '/documents/pitch-marketing/Service_Agreement_2025.pdf',
    file_size: 1234567,
    file_type: 'application/pdf',
    category: 'contract',
    uploaded_at: '2025-11-05T15:20:00Z'
  },
  {
    id: 3,
    contact_id: 3,
    filename: 'RD_Credit_Analysis.xlsx',
    file_path: '/documents/tech-startup/RD_Credit_Analysis.xlsx',
    file_size: 987654,
    file_type: 'application/vnd.ms-excel',
    category: 'report',
    uploaded_at: '2025-11-10T11:00:00Z'
  },
  {
    id: 4,
    contact_id: 4,
    filename: 'Invoice_2025_Q4.pdf',
    file_path: '/documents/manufacturing-co/Invoice_2025_Q4.pdf',
    file_size: 456789,
    file_type: 'application/pdf',
    category: 'invoice',
    uploaded_at: '2025-11-20T09:15:00Z'
  },
  {
    id: 5,
    contact_id: 1,
    filename: 'Tax_Return_Draft_2025.pdf',
    file_path: '/documents/kathy-ferguson/Tax_Return_Draft_2025.pdf',
    file_size: 3456789,
    file_type: 'application/pdf',
    category: 'report',
    uploaded_at: '2025-11-18T14:00:00Z'
  },
  {
    id: 6,
    contact_id: 2,
    filename: 'Marketing_Proposal_Nov2025.docx',
    file_path: '/documents/pitch-marketing/Marketing_Proposal_Nov2025.docx',
    file_size: 234567,
    file_type: 'application/msword',
    category: 'proposal',
    uploaded_at: '2025-11-06T10:45:00Z'
  },
  {
    id: 7,
    contact_id: 3,
    filename: 'Business_Plan_2026.pdf',
    file_path: '/documents/tech-startup/Business_Plan_2026.pdf',
    file_size: 5678901,
    file_type: 'application/pdf',
    category: 'other',
    uploaded_at: '2025-11-12T16:30:00Z'
  }
]

export const TEST_ZOOM_CALLS = [
  {
    id: 1,
    contact_id: 1,
    meeting_id: '123-456-7890',
    meeting_url: 'https://zoom.us/j/1234567890',
    start_time: '2025-11-25T14:00:00Z',
    duration: 60,
    notes: 'Q4 tax planning strategy session',
    recording_url: null
  },
  {
    id: 2,
    contact_id: 2,
    meeting_id: '234-567-8901',
    meeting_url: 'https://zoom.us/j/2345678901',
    start_time: '2025-11-26T10:00:00Z',
    duration: 30,
    notes: 'Marketing collaboration kickoff call',
    recording_url: null
  },
  {
    id: 3,
    contact_id: 3,
    meeting_id: '345-678-9012',
    meeting_url: 'https://zoom.us/j/3456789012',
    start_time: '2025-11-20T15:00:00Z',
    duration: 45,
    notes: 'R&D credit initial consultation - COMPLETED',
    recording_url: 'https://zoom.us/rec/share/abc123xyz'
  },
  {
    id: 4,
    contact_id: 4,
    meeting_id: '456-789-0123',
    meeting_url: 'https://zoom.us/j/4567890123',
    start_time: '2025-11-18T11:00:00Z',
    duration: 60,
    notes: 'Quarterly review and tax planning - COMPLETED',
    recording_url: 'https://zoom.us/rec/share/def456uvw'
  },
  {
    id: 5,
    contact_id: 1,
    meeting_id: '567-890-1234',
    meeting_url: 'https://zoom.us/j/5678901234',
    start_time: '2025-12-01T13:00:00Z',
    duration: 90,
    notes: 'Year-end tax strategy deep dive',
    recording_url: null
  }
]

export const TEST_SEQUENCES = [
  {
    id: 1,
    name: 'New Lead Nurture',
    description: 'Automated follow-up sequence for new leads interested in R&D tax credits',
    steps: 3,
    active_enrollments: 12,
    is_active: true,
    created_at: '2025-10-15T10:00:00Z'
  },
  {
    id: 2,
    name: 'Tax Season Reminder',
    description: 'Quarterly reminders for estimated tax payments and filing deadlines',
    steps: 4,
    active_enrollments: 48,
    is_active: true,
    created_at: '2025-09-01T14:00:00Z'
  },
  {
    id: 3,
    name: 'Referral Partner Outreach',
    description: 'Engage potential referral partners with value-driven content',
    steps: 5,
    active_enrollments: 8,
    is_active: true,
    created_at: '2025-10-20T09:30:00Z'
  },
  {
    id: 4,
    name: 'Cold Prospect Warming',
    description: 'Convert cold prospects into warm leads with educational content',
    steps: 6,
    active_enrollments: 0,
    is_active: false,
    created_at: '2025-08-10T11:15:00Z'
  }
]

export const TEST_REFERRALS = [
  {
    id: 1,
    referrer_contact_id: 5,
    referrer_name: 'Emily Rodriguez',
    referred_contact_id: 3,
    referred_name: 'Sarah Mitchell',
    status: 'converted',
    commission_percentage: 15,
    commission_amount: 1275,
    deal_value: 8500,
    converted_date: '2025-11-15T10:00:00Z',
    created_at: '2025-11-01T09:00:00Z'
  },
  {
    id: 2,
    referrer_contact_id: 2,
    referrer_name: 'Jason Harris',
    referred_contact_id: 4,
    referred_name: 'Michael Chen',
    status: 'converted',
    commission_percentage: 10,
    commission_amount: 350,
    deal_value: 3500,
    converted_date: '2025-11-10T14:30:00Z',
    created_at: '2025-10-28T11:20:00Z'
  },
  {
    id: 3,
    referrer_contact_id: 1,
    referrer_name: 'Kathy Ferguson',
    referred_contact_id: null,
    referred_name: 'David Thompson',
    status: 'pending',
    commission_percentage: 15,
    commission_amount: 0,
    deal_value: 0,
    converted_date: null,
    created_at: '2025-11-18T16:00:00Z'
  }
]

export const TEST_COMMISSIONS = [
  {
    id: 1,
    contact_id: 5,
    contact_name: 'Emily Rodriguez',
    deal_id: 3,
    deal_title: 'R&D Credit Analysis - Tech Startup',
    commission_percentage: 15,
    deal_value: 8500,
    commission_amount: 1275,
    status: 'paid',
    paid_date: '2025-11-20T10:00:00Z',
    created_at: '2025-11-15T10:00:00Z'
  },
  {
    id: 2,
    contact_id: 2,
    contact_name: 'Jason Harris',
    deal_id: 4,
    deal_title: 'Quarterly Tax Services - Manufacturing Co',
    commission_percentage: 10,
    deal_value: 3500,
    commission_amount: 350,
    status: 'paid',
    paid_date: '2025-11-18T14:00:00Z',
    created_at: '2025-11-10T14:30:00Z'
  },
  {
    id: 3,
    contact_id: 1,
    contact_name: 'Kathy Ferguson',
    deal_id: 1,
    deal_title: 'Q4 Tax Planning - Kashflow Kathy',
    commission_percentage: 20,
    deal_value: 15000,
    commission_amount: 3000,
    status: 'pending',
    paid_date: null,
    created_at: '2025-11-22T09:00:00Z'
  },
  {
    id: 4,
    contact_id: 5,
    contact_name: 'Emily Rodriguez',
    deal_id: 6,
    deal_title: 'Annual Bookkeeping - Retail Store',
    commission_percentage: 12,
    deal_value: 4200,
    commission_amount: 504,
    status: 'approved',
    paid_date: null,
    created_at: '2025-11-23T11:30:00Z'
  }
]

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

export const formatDateTime = (dateString) => {
  return new Date(dateString).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  })
}
