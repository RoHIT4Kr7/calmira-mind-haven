# Mental Wellness App

A React-based AI-powered mental wellness application that creates personalized manga stories based on user input. The app features a calming, minimalist design that adapts to your existing theme.

## Features

### 🎨 **Thematic Integration**

- Uses your existing Tailwind CSS configuration and color scheme
- Automatically inherits fonts, colors, and styling from your base theme
- Responsive design that works on all devices

### 📱 **Component Structure**

#### 1. **OnboardingScreen**

- Collects user information through a clean form interface
- Three input fields: nickname, challenge, and hobby
- Form validation ensures all fields are completed before submission
- Uses shadcn/ui components for consistent theming

#### 2. **LoadingScreen**

- Elegant animated SVG (pulsating ink drop)
- Cycling messages that update every 3 seconds
- Calming visual feedback during AI generation
- Progress indicators for user engagement

#### 3. **MangaViewer**

- Displays generated manga panels with navigation
- Desktop: Arrow key navigation
- Mobile: Swipe gestures and touch-friendly controls
- Automatic audio playback for each panel
- Progress tracking and "Read Again" functionality

## Usage

### Access the App

Navigate to `/mental-wellness` in your application to access the mental wellness app.

### App Flow

1. **Onboarding**: User fills out the form with their information
2. **Loading**: 5-second simulated AI generation with animated feedback
3. **Viewing**: Interactive manga story with navigation and audio

### Navigation

- **Desktop**: Use left/right arrow buttons or keyboard arrows
- **Mobile**: Swipe left/right on the manga panel or use navigation buttons
- **Progress**: Dots indicator shows current position in the story

## Technical Details

### State Management

- Uses React hooks for local state management
- App state transitions: `onboarding` → `loading` → `viewing`
- Form validation and data persistence

### Audio Integration

- Automatic audio playback for each panel
- Audio stops when navigating to a new panel
- Graceful error handling for audio failures

### Responsive Design

- Mobile-first approach with touch gestures
- Adaptive navigation controls
- Optimized for all screen sizes

## Customization

### Theming

The app automatically uses your existing theme variables:

- `--primary`: Primary accent color for buttons and highlights
- `--background`: Main background color
- `--card`: Container background color
- `--foreground`: Primary text color
- `--muted-foreground`: Secondary text color

### Mock Data

Currently uses placeholder images and audio. Replace the `mockStoryData` in `App.tsx` with your actual API integration.

### Styling

All components use semantic class names that integrate with your existing design system. Modify the CSS variables in `src/index.css` to customize the appearance.

## File Structure

```
src/
├── components/
│   ├── OnboardingScreen.tsx    # User input form
│   ├── LoadingScreen.tsx       # Loading animation
│   └── MangaViewer.tsx         # Story viewer
├── App.tsx                     # Main app with routing
└── index.css                   # Theme variables
```

## Integration Notes

- The app is designed to work alongside your existing landing page
- All styling uses your established design tokens
- Components are modular and can be easily modified
- Audio URLs should be replaced with actual narration files
- Image URLs should be replaced with generated manga panels

## Future Enhancements

- Real AI integration for story generation
- User authentication and story history
- Multiple story themes and styles
- Social sharing features
- Accessibility improvements
