// Setup sistem proteksi untuk production (30 hari)
// Jalankan dengan: node setup-production-simple.js

console.log('🚀 Setting up production system protection...');

// Reset proteksi lama dan buat yang baru
async function setupProduction() {
  try {
    // 1. Deaktivasi proteksi lama
    console.log('1️⃣ Deactivating old protection...');
    const deactivateResponse = await fetch('http://localhost:3000/api/system-protection', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'deactivate' })
    });
    
    if (deactivateResponse.ok) {
      const result = await deactivateResponse.text();
      console.log('✅ Old protection deactivated:', result);
    }
    
    // 2. Setup proteksi production baru (30 hari)
    console.log('2️⃣ Setting up new 30-day protection...');
    const initResponse = await fetch('http://localhost:3000/api/system-protection', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        action: 'initialize', 
        protectionDays: 30 
      })
    });
    
    if (initResponse.ok) {
      const result = await initResponse.text();
      console.log('✅ Production protection initialized:', result);
    }
    
    // 3. Verifikasi status
    console.log('3️⃣ Verifying new protection status...');
    const statusResponse = await fetch('http://localhost:3000/api/system-protection');
    if (statusResponse.ok) {
      const status = await statusResponse.json();
      console.log('📊 Current Status:');
      console.log('   - Active:', status.isActive);
      console.log('   - Days:', status.protectionDays);
      console.log('   - Started:', new Date(status.migratedAt).toLocaleDateString('id-ID'));
      console.log('   - Expires:', new Date(status.expiredAt).toLocaleDateString('id-ID'));
      console.log('   - Is Expired:', status.status?.isExpired);
    }
    
    console.log('🎉 Production setup complete!');
    
  } catch (error) {
    console.error('❌ Setup failed:', error);
  }
}

setupProduction();
