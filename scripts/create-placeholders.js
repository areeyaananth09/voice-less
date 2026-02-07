const fs = require('fs');
const path = require('path');

// Create gestures directory if it doesn't exist
const gesturesDir = path.join(__dirname, '../public/gestures');

if (!fs.existsSync(gesturesDir)) {
    fs.mkdirSync(gesturesDir, { recursive: true });
    console.log('✅ Created public/gestures directory');
}

// List of gesture words that need video files
const gestures = [
    'hello',
    'how',
    'are',
    'you',
    'thank-you',
    'help',
    'please',
    'sorry'
];

console.log('\n📝 Creating placeholder video files...\n');

// Create placeholder text files (you'll replace these with actual videos)
gestures.forEach(word => {
    const filePath = path.join(gesturesDir, `${word}.mp4`);

    if (!fs.existsSync(filePath)) {
        // Create a small placeholder file
        const placeholderContent = `Placeholder for ${word} sign language video.\n\nReplace this file with an actual .mp4 video showing the sign for "${word}".`;
        fs.writeFileSync(filePath, placeholderContent);
        console.log(`✅ Created placeholder: ${word}.mp4`);
    } else {
        console.log(`ℹ️  Already exists: ${word}.mp4`);
    }
});

console.log('\n✅ Placeholder files created!');
console.log('\n💡 Next steps:');
console.log('   1. Record or obtain actual sign language videos');
console.log('   2. Replace the placeholder files in public/gestures/');
console.log('   3. Ensure videos are in .mp4 format');
console.log('   4. Test the feature at http://localhost:3000/live-transcribe\n');
