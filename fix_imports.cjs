const fs = require('fs');
const path = require('path');

// Recursively get all .jsx files in a directory
const getFiles = (dir) => {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach((file) => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(getFiles(file));
        } else if (file.endsWith('.jsx')) {
            results.push(file);
        }
    });
    return results;
};

const allFiles = getFiles(path.join(__dirname, 'src'));

const componentsMap = {
    // admin
    'AdminNotifications': 'admin/AdminNotifications',
    // shared
    'ProtectedRoute': 'shared/ProtectedRoute',
    'MusicCursor': 'shared/MusicCursor',
    // user
    'Sidebar': 'user/Sidebar',
    'TopBarUser': 'user/TopBarUser',
    'ProfileVinylWidget': 'user/ProfileVinylWidget',
    'CatalogCard': 'user/CatalogCard',
    'VinylDetailsModal': 'user/VinylDetailsModal',
    'TracklistModal': 'user/TracklistModal',
    'cart/CartItem': 'user/cart/CartItem',
    'cart/CartSummary': 'user/cart/CartSummary'
};

allFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let originalContent = content;

    // 1. Adjust relative paths depth for files that moved down one dir
    // Files that moved from src/pages/ to src/pages/user/
    // Files that moved from src/components/ to src/components/(user|admin|shared)/
    // This means any original `import ... from '../...'` needs an extra `../`
    const movedDirs = ['/pages/user/', '/components/user/', '/components/admin/', '/components/shared/'];
    const moved = movedDirs.some(d => file.includes(d.replace(/\//g, path.sep)));

    // Note: files in /pages/admin/ were already in /pages/Admin/ (depth 2), so their depth to root remains the same (../../x).
    const isDepthUnchanged = file.includes(path.sep + 'pages' + path.sep + 'admin' + path.sep);

    if (moved && !isDepthUnchanged) {
        // We only bump up depth for imports pointing to typical root sibling dirs like components, pages, context, hooks
        // Regex matches instances of `from '../` and replaces with `from '../../`
        content = content.replace(/from\s+['"]\.\.\/((?:components|pages|context|hooks|Styles).*?)['"]/g, "from '../../$1'");
        // Also internal sibling imports. If I moved Home.jsx to user/Home.jsx and it imported Sidebar via `../components/Sidebar`,
        // it was already caught by the regex above.

        // Catch cases like `import foo from '../context'`
        content = content.replace(/from\s+['"]\.\.\/context['"]/g, "from '../../context'");
        content = content.replace(/from\s+['"]\.\.\/Styles['"]/g, "from '../../Styles'");
    }

    // 2. Re-map specific component names to their new categorized subfolders
    Object.keys(componentsMap).forEach(comp => {
        // E.g. replace /components/Sidebar with /components/user/Sidebar
        // Regex looks for `components/${comp}`
        const regex = new RegExp(`components/${comp}(['"])`, 'g');
        content = content.replace(regex, `components/${componentsMap[comp]}$1`);
    });

    if (content !== originalContent) {
        fs.writeFileSync(file, content, 'utf8');
        console.log('Fixed imports in', file);
    }
});
