require('dotenv').config();
const bcrypt = require('bcryptjs');

const testCredentials = async () => {
  const testEmail = 'admin@example.com';
  const testPassword = 'securepassword';

  console.log('=== Testing Credentials ===');
  
  // 1. Verify email match
  if (testEmail !== process.env.ADMIN_EMAIL) {
    console.error('❌ Email mismatch');
    console.log(`Configured: ${process.env.ADMIN_EMAIL}`);
    console.log(`Attempting: ${testEmail}`);
    return;
  } else {
    console.log('✅ Email matches');
  }

  // 2. Verify hash exists
  if (!process.env.ADMIN_PASSWORD) {
    console.error('❌ ADMIN_PASSWORD_HASH not set');
    return;
  } else {
    console.log('✅ Hash exists');
  }

  // 3. Test password comparison
  try {
    const isMatch = await bcrypt.compare(testPassword, process.env.ADMIN_PASSWORD);
    console.log(isMatch ? '✅ Password matches' : '❌ Password mismatch');
    
    if (!isMatch) {
      console.log('Try generating a new hash:');
      const salt = await bcrypt.genSalt(10);
      const newHash = await bcrypt.hash(testPassword, salt);
      console.log(`New hash: ${newHash}`);
    }
  } catch (err) {
    console.error('❌ Comparison failed:', err.message);
  }
};

testCredentials();