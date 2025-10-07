// Temporary script to add icons to service pages
const fs = require('fs');
const path = require('path');

const iconCode = `            <!-- Contact Icons -->
            <div style="text-align: center; margin-bottom: 3rem;">
                <div style="display: inline-flex; gap: 2rem; align-items: center; justify-content: center;">
                    <a href="https://www.instagram.com/naisy_prostejov/" target="_blank" style="color: var(--accent-gold); font-size: 1.5rem; transition: color 0.3s;" onmouseover="this.style.color='#9b7c3f'" onmouseout="this.style.color='var(--accent-gold)'">
                        <i class="fab fa-instagram"></i>
                    </a>
                    <a href="https://www.facebook.com/profile.php?id=100034744496776" target="_blank" style="color: var(--accent-gold); font-size: 1.5rem; transition: color 0.3s;" onmouseover="this.style.color='#9b7c3f'" onmouseout="this.style.color='var(--accent-gold)'">
                        <i class="fab fa-facebook-f"></i>
                    </a>
                    <a href="tel:+420582346071" style="color: var(--accent-gold); font-size: 1.5rem; transition: color 0.3s;" onmouseover="this.style.color='#9b7c3f'" onmouseout="this.style.color='var(--accent-gold)'">
                        <i class="fas fa-phone"></i>
                    </a>
                </div>
            </div>
            
`;

const filesToUpdate = [
    'C:\\Users\\Admin\\Desktop\\Naisy\\sluzby\\kadernictvi-kosmetika\\manikura.html',
    'C:\\Users\\Admin\\Desktop\\Naisy\\sluzby\\kadernictvi-kosmetika\\pedikura.html',
    'C:\\Users\\Admin\\Desktop\\Naisy\\sluzby\\kadernictvi-kosmetika\\epilace.html',
    'C:\\Users\\Admin\\Desktop\\Naisy\\sluzby\\kadernictvi-kosmetika\\masaze.html',
    'C:\\Users\\Admin\\Desktop\\Naisy\\sluzby\\kadernictvi-kosmetika\\oboci-rasy-liceni.html'
];

filesToUpdate.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    const searchString = '    <!-- Service Content -->\n    <section class="service-content">\n        <div class="container">\n            <div class="service-intro">';
    const replaceString = `    <!-- Service Content -->\n    <section class="service-content">\n        <div class="container">\n${iconCode}            <div class="service-intro">`;
    
    content = content.replace(searchString, replaceString);
    fs.writeFileSync(file, content);
    console.log(`Updated: ${file}`);
});