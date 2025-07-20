# Mascot Directory

Place your app mascot images here.

## Recommended Files

- `mascot-happy.png` - Happy mascot for positive feedback
- `mascot-sad.png` - Sad mascot for areas of improvement
- `mascot-neutral.png` - Neutral mascot for general use
- `mascot-celebrating.gif` - Animated mascot for celebrations

## Usage in Code

```jsx
import Image from "next/image";

// In your components
<Image
  src="/images/mascot/mascot-happy.png"
  alt="Happy Mascot"
  width={100}
  height={100}
/>;
```

## Mascot Guidelines

- Keep file sizes under 500KB for web performance
- Use PNG for static images, GIF for animations
- Consider WebP format for better compression
- Maintain consistent style across all mascot variations
