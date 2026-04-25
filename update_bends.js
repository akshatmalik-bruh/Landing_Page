const fs = require('fs');
let content = fs.readFileSync('src/App.jsx', 'utf8');

// Remove all ColorBends wrapper divs
content = content.replace(/\{\/\* .*? Neon Background \*\/\}\s*<div style=\{\{ position: "absolute", inset: 0, zIndex: 0 \}\}>\s*<ColorBends[\s\S]*?style=\{\{ width: "100%", height: "100%" \}\}\s*\/>\s*<\/div>/g, '');

// Remove ColorBends from Hero specifically since its comment is slightly different
content = content.replace(/\{\/\* ColorBends background \*\/\}\s*<div style=\{\{ position: "absolute", inset: 0, zIndex: 0 \}\}>\s*<ColorBends[\s\S]*?style=\{\{ width: "100%", height: "100%" \}\}\s*\/>\s*<\/div>/g, '');

// Insert ColorBends at the root of the App
const rootColorBends = `
        {/* Global ColorBends Background */}
        <div style={{ position: "fixed", inset: 0, zIndex: 0 }}>
          <ColorBends
            colors={["#000000", "#020008", "#0d001a", "#261336", "#28004d", "#000000"]}
            rotation={90}
            speed={0.12}
            scale={1.5}
            frequency={0.5}
            warpStrength={0.9}
            mouseInfluence={0.5}
            noise={0.04}
            parallax={0.3}
            iterations={3}
            intensity={1.8}
            bandWidth={3}
            transparent={false}
            style={{ width: "100%", height: "100%" }}
          />
        </div>
`;

content = content.replace('<Nav />', rootColorBends + '\n        <Nav />');

fs.writeFileSync('src/App.jsx', content);
console.log("Updated App.jsx successfully");
