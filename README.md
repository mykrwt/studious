# Infinite Car Game

An exciting infinite car driving game built with Three.js using your custom low-poly Lada 2107 car and race track models!

## Features

- **Infinite Track Generation**: Drive endlessly on procedurally generated track pieces
- **Realistic Car Physics**: Acceleration, braking, steering with momentum
- **Third-Person Camera**: Smooth camera that follows your car
- **Custom Models**: Uses your actual GLB models for authentic visuals
- **Responsive Controls**: Support for both WASD and arrow keys
- **Real-time UI**: Speed, score, and distance tracking
- **Day/Night Lighting**: Atmospheric fog and dynamic lighting

## How to Play

### Controls
- **W / ↑** - Accelerate
- **S / ↓** - Brake/Reverse
- **A / ←** - Steer Left  
- **D / →** - Steer Right

### Objective
- Drive as far as possible without falling off the track
- Try to beat your high score!
- The speedometer shows your current speed in km/h

## Setup and Running

### Option 1: Python HTTP Server
```bash
# Python 3
python3 -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

Then open your browser and go to: `http://localhost:8000`

### Option 2: Node.js HTTP Server
```bash
# Install a simple server globally
npm install -g http-server

# Run the server
http-server -p 8000
```

Then open your browser and go to: `http://localhost:8000`

### Option 3: Live Server (VS Code)
If you're using VS Code, install the "Live Server" extension and right-click on `index.html` → "Open with Live Server"

### Option 4: Any Local Server
Place the files in any local web server directory and access via HTTP/HTTPS

## Files Structure

```
/home/engine/project/
├── index.html          # Main game interface
├── game.js            # Game logic and Three.js code
├── low_poly_lada_2107.glb  # Your car model
├── low_poly_race_track.glb # Your track model
└── README.md          # This file
```

## Technical Details

- **Built with**: Three.js r128
- **Models**: GLB (GLTF Binary) format
- **Physics**: Custom simple physics engine
- **Lighting**: Ambient + Directional with shadows
- **Performance**: Optimized for smooth 60fps gameplay

## Troubleshooting

### Models not loading?
- Make sure you're running a local server (not opening index.html directly)
- Check browser console for loading errors
- Ensure the .glb files are in the same directory as index.html

### Performance issues?
- Try reducing your browser window size
- Close other browser tabs
- Use a modern browser (Chrome, Firefox, Safari, Edge)

### Controls not working?
- Click on the game area first to ensure it has focus
- Check that JavaScript is enabled in your browser
- Try refreshing the page

## Customization

You can modify the game parameters in `game.js`:

- `maxSpeed` - Maximum car speed
- `acceleration` - How fast the car accelerates
- `turnSpeed` - How quickly the car turns
- `maxTrackPieces` - Number of track pieces to keep in memory
- `trackLength` - Length of each track piece

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

Enjoy your infinite car adventure! 🚗💨