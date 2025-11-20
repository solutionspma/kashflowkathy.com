const { createClient } = require('@supabase/supabase-js')
const fs = require('fs').promises
const path = require('path')

// Manually load .env file
async function loadEnv() {
  try {
    const envPath = path.join(__dirname, '..', '.env')
    const envContent = await fs.readFile(envPath, 'utf8')
    
    envContent.split('\n').forEach(line => {
      const trimmed = line.trim()
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=')
        if (key && valueParts.length) {
          const value = valueParts.join('=').replace(/^["']|["']$/g, '')
          process.env[key] = value
        }
      }
    })
  } catch (error) {
    console.error('Error loading .env file:', error.message)
  }
}

async function main() {
  await loadEnv()

  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Error: SUPABASE_URL and SUPABASE_ANON_KEY must be set in .env file')
    console.error('   Current SUPABASE_URL:', supabaseUrl)
    console.error('   Current SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Set' : 'Not set')
    process.exit(1)
  }

  console.log('✓ Environment variables loaded')
  console.log('  Supabase URL:', supabaseUrl)

  const supabase = createClient(supabaseUrl, supabaseAnonKey)

  async function migrateDatabase() {
    console.log('🔄 Starting database migration...')
    console.log('')

    try {
      // Read schema file
      const schemaPath = path.join(__dirname, '..', 'database', 'schema.sql')
      const schema = await fs.readFile(schemaPath, 'utf8')    console.log('✓ Schema file loaded successfully')
    console.log(`  File: ${schemaPath}`)
    console.log(`  Size: ${schema.length} characters`)
    console.log('')
    
    // Test Supabase connection
    const { data, error } = await supabase.from('users').select('count').limit(1)
    
    if (error && (error.code === '42P01' || error.code === 'PGRST205')) {
      // Table doesn't exist yet - this is expected
      console.log('⚠️  Database tables not yet created')
      console.log('')
      console.log('📋 MANUAL MIGRATION REQUIRED:')
      console.log('   Supabase does not allow direct SQL execution via API for security.')
      console.log('')
      console.log('   Please follow these steps:')
      console.log('   1. Go to https://supabase.com/dashboard')
      console.log('   2. Select your project: jcyehwievnazbclfbyhi')
      console.log('   3. Click "SQL Editor" in the left sidebar')
      console.log('   4. Click "New Query"')
      console.log('   5. Copy the contents of: database/schema.sql')
      console.log('   6. Paste into the SQL Editor')
      console.log('   7. Click "Run" to execute')
      console.log('')
      console.log('✓ After running the schema, your database will be ready!')
      
      // Write a helper script
      console.log('')
      console.log('📄 Schema file location:')
      console.log(`   ${schemaPath}`)
      
    } else if (error) {
      throw error
    } else {
      console.log('✓ Database connection successful!')
      console.log('✓ Tables appear to be created')
    }
    
    // Insert default data
    await seedDefaultData()
    
    console.log('✓ Migration completed successfully')
  } catch (error) {
    console.error('✗ Migration failed:', error)
    process.exit(1)
  }
}

async function seedDefaultData() {
  // Create master account
  await supabase.from('users').insert([
    {
      email: 'master@pitchmarketing.agency',
      username: 'masteracct',
      password_hash: '$2b$10$...', // Should be hashed
      full_name: 'Master Account',
      role: 'masteracct',
      permissions: { full_access: true },
    },
  ])

  // Create Kathy's account
  await supabase.from('users').insert([
    {
      email: 'kathy@costseg.tax',
      username: 'admin',
      password_hash: '$2b$10$...', // Should be hashed
      full_name: 'Kathy Ferguson',
      phone: '225-247-2890',
      role: 'admin',
      permissions: {
        websiteEditor: true,
        crmEditor: true,
        socialSuite: true,
        employeeManagement: true,
      },
    },
  ])

  console.log('✓ Default users created')
}

migrateDatabase()
