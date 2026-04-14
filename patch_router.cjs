const fs = require('fs');

let content = fs.readFileSync('src/router/index.ts', 'utf8');

// First, let's remove the types related to nav
content = content.replace(/export type NavTarget[\s\S]*?\}\n/g, '');
content = content.replace(/\s*nav\?:\s*NavMeta;/g, '');

// Now we need to remove `nav: { ... }` from meta objects.
// Since meta can contain other fields, we need a regex that matches `nav: { ... }` properly.
// The `nav` object can have nested properties and functions.
// To do this safely, let's use a simple approach:
// Find `nav: {` and find the matching closing `}`.
function removeNavProperty(text) {
    let index = text.indexOf('nav: {');
    while (index !== -1) {
        let openBraces = 0;
        let closeIndex = -1;
        for (let i = index + 5; i < text.length; i++) {
            if (text[i] === '{') openBraces++;
            else if (text[i] === '}') {
                if (openBraces === 0) {
                    closeIndex = i;
                    break;
                }
                openBraces--;
            }
        }
        
        if (closeIndex !== -1) {
            // Find the start of the nav property to remove trailing commas if necessary
            let startToRemove = index;
            // Also look backwards to remove trailing spaces and possibly comma
            while (startToRemove > 0 && /\s/.test(text[startToRemove - 1])) {
                startToRemove--;
            }
            if (text[startToRemove - 1] === ',') {
                startToRemove--;
            }
            
            let endToRemove = closeIndex + 1;
            // Also look forwards to remove trailing comma
            let i = endToRemove;
            while (i < text.length && /\s/.test(text[i])) i++;
            if (text[i] === ',') {
                endToRemove = i + 1;
            }

            text = text.substring(0, startToRemove) + text.substring(endToRemove);
        } else {
            break;
        }
        index = text.indexOf('nav: {');
    }
    return text;
}

content = removeNavProperty(content);

// Clean up empty meta objects
content = content.replace(/,\s*meta:\s*\{\s*\}/g, '');
content = content.replace(/meta:\s*\{\s*\}/g, '');

fs.writeFileSync('src/router/index.ts', content);
