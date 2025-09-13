# 🚨 CRITICAL SLIDESHOW DEBUGGING GUIDE

## 🔍 **Issues Fixed**

### **1. ✅ Removed `appState` Dependency Bug**

**Problem**: Subsequent panels were only added if `appState === "viewing"`, but this check failed during state transitions.
**Fix**: Removed the `appState` check from panel update handlers.

### **2. ✅ Fixed Socket Dependency Loop**

**Problem**: `useEffect` dependency on `[storyId]` caused socket to re-initialize when storyId changed.
**Fix**: Changed to `[]` dependency to only initialize once.

### **3. ✅ Fixed Audio Circular Dependency**

**Problem**: `handleAudioEnded` called `goToPanel` which had missing dependencies.
**Fix**: Inlined the navigation logic to avoid circular dependencies.

### **4. ✅ Added Audio Source Management**

**Problem**: Audio element wasn't properly updating when panels changed.
**Fix**: Added `key` prop to force re-render and `useEffect` to manage audio source.

---

## 🧪 **Debugging Protocol**

### **Step 1: Check Console Logs**

Open your browser's **Developer Tools > Console** and look for these specific logs:

#### **Expected Socket Connection Logs:**

```
🔌 Initializing Socket.IO connection...
✅ Connected to backend Socket.IO
🔗 Auto-joining story room: story_xxxxx
✅ Successfully joined story generation room: {story_id: "story_xxxxx"}
```

#### **Expected Panel Loading Logs:**

```
🎯 PANEL COMPLETED: {panel_number: 1, ...}
🎬 Starting slideshow with first panel!
📱 Adding panel 2 to existing story
📱 Adding panel 3 to existing story
...
```

#### **Expected MangaViewer Logs:**

```
📚 MangaViewer updated with 1 panels
🔍 Current panel: 1, Total panels: 1
🖼️ Panel 1 data: {id: "1", hasImage: true, hasAudio: true, ...}
🎧 Loading audio for panel 1: https://...
🎵 Audio loaded for panel 1: 8.5s
▶️ Audio playing for panel 1
🔚 Audio ended for panel 1
⏭️ Auto-advancing to panel 2
📍 Navigating to panel 2
```

### **Step 2: Check Network Tab**

1. Open **Developer Tools > Network**
2. Look for:
   - ✅ **Socket.IO Connection**: `socket.io/?EIO=4&transport=polling`
   - ✅ **Image Requests**: `https://storage.googleapis.com/.../panel_01.png`
   - ✅ **Audio Requests**: `https://storage.googleapis.com/.../tts_01.mp3`

### **Step 3: Manual Testing**

Try these manual actions in the console:

```javascript
// Check if panels are loaded
console.log("Story panels:", window.mangaPanels);

// Check current audio state
console.log("Audio element:", document.querySelector("audio"));
console.log("Audio src:", document.querySelector("audio")?.src);

// Try manual panel navigation
// (Click the panel indicator dots at the top)
```

---

## 🔧 **Specific Issues to Check**

### **Issue A: Only First Panel Shows**

**Symptoms**: Only panel 1 visible, panel indicators show only 1 dot
**Debug**: Look for these console logs:

```
📱 Adding panel 2 to existing story
📱 Adding panel 3 to existing story
```

**If Missing**: Backend isn't sending `panel_processing_complete` events for panels 2-6
**Solution**: Check backend logs for panel generation failures

### **Issue B: Audio Not Auto-Advancing**

**Symptoms**: Audio plays but doesn't advance to next panel
**Debug**: Look for these console logs:

```
🔚 Audio ended for panel 1
⏭️ Auto-advancing to panel 2
📍 Navigating to panel 2
```

**If Missing**: Audio `onEnded` event not firing
**Check**:

1. Audio duration > 0
2. Audio actually plays to completion
3. Auto-advance toggle is ON (green)

### **Issue C: Manual Navigation Not Working**

**Symptoms**: Clicking panel dots or prev/next buttons doesn't work
**Debug**: Check if buttons are disabled:

```javascript
// Check button states
console.log(
  "Previous disabled:",
  document.querySelector('[title="Previous Panel"]')?.disabled
);
console.log(
  "Next disabled:",
  document.querySelector('[title="Next Panel"]')?.disabled
);
```

**If Disabled**: Not enough panels loaded or navigation logic broken

---

## 🎯 **Expected File Structure**

Your frontend should have:

```
src/
├── services/
│   └── manga/
│       ├── MangaService.tsx ✅
│       └── MangaViewer.tsx ✅
└── components/
    ├── OnboardingScreen.tsx ✅
    └── LoadingScreen.tsx ✅
```

---

## 🚀 **Testing Steps**

### **Test 1: Complete Flow**

1. Fill out onboarding form
2. Submit and watch loading screen
3. **Wait for Panel 1** (should appear in ~30 seconds)
4. **Verify audio starts** automatically
5. **Wait for audio to end** (~8-10 seconds)
6. **Verify auto-advance** to Panel 2

### **Test 2: Manual Navigation**

1. After Panel 1 loads, **click Panel 2 dot** at top
2. Verify it switches to Panel 2
3. Try **Previous/Next buttons**
4. Verify they work correctly

### **Test 3: Audio Controls**

1. Click **Play/Pause button**
2. Verify audio starts/stops
3. Watch **progress bar** during playback
4. Verify **auto-advance toggle** works

---

## ❌ **If Still Not Working**

### **Backend Issue**:

- Check backend logs for panel generation errors
- Verify all 6 panels are actually being generated
- Check Socket.IO room joining in backend logs

### **Frontend Issue**:

- Clear browser cache and hard refresh (Ctrl+Shift+R)
- Try different browser or incognito mode
- Check for JavaScript errors in console

### **Network Issue**:

- Verify backend is running on `http://localhost:8000`
- Check if images/audio URLs are accessible
- Try accessing panel URLs directly in browser

---

## 🎌 **Success Criteria**

You should see:

1. ✅ **6 panel dots** at the top (showing all panels loaded)
2. ✅ **Panel 1 auto-starts** with audio
3. ✅ **Auto-advance** to Panel 2 after ~8-10 seconds
4. ✅ **Manual navigation** works (clicking dots, prev/next buttons)
5. ✅ **Audio controls** work (play/pause, progress bar)
6. ✅ **All 6 panels** eventually accessible

**Follow this guide step-by-step and report back which specific step fails!** 🔍
