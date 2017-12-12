/** 
* check project is ready
* @param name the project you wanto check
**/
const path = require('path');
const fs = require('fs');

module.exports = function(name, type) {
    const projectRoot = path.join(__dirname, '..', 'source');
    if (!type) {
        const hasHtml =fs.existsSync(path.join(projectRoot, name.toLowerCase() + '.html'));
        if (hasHtml) {
            return true;
        }
        return false;    
    }
    if (type === 'js') {
        
    }
    
};
