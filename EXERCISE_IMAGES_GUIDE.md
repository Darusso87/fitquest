# FITQUEST - Exercise Images Setup Guide

## 🏠 Home Workout App - Image Requirements

FITQUEST is now a **HOME WORKOUT ONLY** app with **40+ bodyweight exercises** - no equipment needed!

---

## 📸 Required Images (40 Total)

All exercises extracted from your provided image. Save these images in:
```
fitquest/public/demos/
```

### CARDIO (6 images):
1. `jumping-jack.jpg` - Arms and legs spread jump
2. `burpee.jpg` - Full burpee sequence
3. `mountain-climber.jpg` - Plank with knee drives
4. `high-knees.jpg` - Running in place with high knees
5. `jump-tuck.jpg` - Jump bringing knees to chest
6. `jump-twist.jpg` - Jump with torso rotation

### LOWER BODY (10 images):
7. `squat.jpg` - Basic bodyweight squat
8. `wall-sit.jpg` - Back against wall, sitting position
9. `alternating-lunge.jpg` - Forward lunge, alternating legs
10. `glute-bridge.jpg` - Lying bridge hip lift
11. `calf-raise.jpg` - Standing on toes
12. `knee-high-dip.jpg` - Single leg knee lift with dip
13. `pistol-squat.jpg` - One-legged squat
14. `donkey-kick.jpg` - On all fours, leg kick back
15. `skater.jpg` - Side-to-side jumps
16. `side-leg-lift.jpg` - Lying on side, leg lift

### UPPER BODY (7 images):
17. `pushup.jpg` - Standard push-up
18. `incline-pushup.jpg` - Hands on elevated surface
19. `knee-pushup.jpg` - Push-up from knees
20. `wide-pushup.jpg` - Hands wider than shoulders
21. `diamond-pushup.jpg` - Hands forming diamond
22. `spiderman-pushup.jpg` - Push-up with knee to elbow
23. `tricep-dip.jpg` - Dips using chair
24. `tricep-extension.jpg` - Overhead tricep extension

### CORE (13 images):
25. `plank.jpg` - Forearm plank hold
26. `side-plank.jpg` - Side forearm plank
27. `superman.jpg` - Lying face down, arms/legs lifted
28. `in-out-crunch.jpg` - Seated knee tucks
29. `scissor.jpg` - Alternating leg lifts
30. `situp.jpg` - Full sit-up
31. `bicycle.jpg` - Bicycle crunch with rotation
32. `reverse-crunch.jpg` - Hips lift, knees to chest
33. `two-point-plank.jpg` - Plank with arm/leg extended
34. `pike-press.jpg` - Downward dog push-up
35. `crab-walk.jpg` - Reverse tabletop position walking

### WARMUP/MOBILITY (4 images):
36. `arm-circles.jpg` - Standing arm circles
37. `leg-swings.jpg` - Standing leg swings
38. `cat-cow.jpg` - Cat-cow stretch
39. `child-pose.jpg` - Child's pose stretch
40. `hamstring-stretch.jpg` - Hamstring stretch

---

## 🎨 Image Specifications

- **Format**: JPG, PNG, or WEBP
- **Dimensions**: 400x300 pixels (or similar 4:3 ratio)
- **Quality**: Medium to high (clear demonstration of form)
- **Background**: Any (will be cropped/covered by UI)
- **Content**: Person demonstrating the exercise in proper form

---

## 📁 Where to Put Images

```
C:\Users\daryl\Desktop\Fitquest\Fitquest Claude 12.01\fitquest\fitquest\
└── public\
    └── demos\  ← CREATE THIS FOLDER
        ├── jumping-jack.jpg
        ├── burpee.jpg
        ├── mountain-climber.jpg
        ├── squat.jpg
        ├── pushup.jpg
        ├── plank.jpg
        └── (etc... all 40 images)
```

**IMPORTANT**: Use exact filenames listed above (lowercase, hyphens, .jpg extension)

---

## 🚀 Quick Image Sources

### Option 1: Extract from Your Image
Your uploaded `exersize_overview.png` shows all exercises! You can:
1. Open the image in any image editor
2. Crop each exercise demonstration
3. Save with the correct filename
4. Place in `/public/demos/`

### Option 2: Free Stock Photos
- **Pexels**: https://www.pexels.com/search/exercise/
- **Unsplash**: https://unsplash.com/s/photos/workout
- **Pixabay**: https://pixabay.com/images/search/fitness/

Search for each exercise name, download, rename, and place in folder.

### Option 3: YouTube Screenshots
1. Search YouTube: "how to do [exercise name]"
2. Pause at good demonstration frame
3. Screenshot (Windows: Win+Shift+S)
4. Save with correct filename

### Option 4: AI Generation
Use ChatGPT/DALL-E with prompts like:
```
"A person doing a squat exercise, side view, fitness demonstration style, white background"
```

---

## ✅ After Adding Images

### Step 1: Verify Files
Check that `/public/demos/` contains all 40 .jpg files with exact names

### Step 2: Restart App
```bash
# Stop app (Ctrl+C)
npm run dev
```

### Step 3: Clear Browser Data
- Press F12 → Application → Local Storage → Clear
- Or: Settings → Reset Data

### Step 4: Test
1. Complete new onboarding
2. Go to workout page
3. **You should see YOUR images!** 🎉

---

## 🔧 Troubleshooting

**Images not showing?**
- Check filenames match exactly (lowercase, hyphens)
- Check files are in `/public/demos/` not `/public/` or `/demos/`
- Hard refresh browser (Ctrl+Shift+R)
- Check file extensions (.jpg not .jpeg)

**Still using placeholder URLs?**
- Clear localStorage (F12 → Application → Local Storage → Clear)
- Start new game (Settings → Reset Data)

**Some images show, others don't?**
- Check those specific filenames
- Make sure all 40 files exist

---

## 📊 Progress Tracking

Track which images you've added:

**CARDIO**
- [ ] jumping-jack.jpg
- [ ] burpee.jpg
- [ ] mountain-climber.jpg
- [ ] high-knees.jpg
- [ ] jump-tuck.jpg
- [ ] jump-twist.jpg

**LOWER BODY**
- [ ] squat.jpg
- [ ] wall-sit.jpg
- [ ] alternating-lunge.jpg
- [ ] glute-bridge.jpg
- [ ] calf-raise.jpg
- [ ] knee-high-dip.jpg
- [ ] pistol-squat.jpg
- [ ] donkey-kick.jpg
- [ ] skater.jpg
- [ ] side-leg-lift.jpg

**UPPER BODY**
- [ ] pushup.jpg
- [ ] incline-pushup.jpg
- [ ] knee-pushup.jpg
- [ ] wide-pushup.jpg
- [ ] diamond-pushup.jpg
- [ ] spiderman-pushup.jpg
- [ ] tricep-dip.jpg
- [ ] tricep-extension.jpg

**CORE**
- [ ] plank.jpg
- [ ] side-plank.jpg
- [ ] superman.jpg
- [ ] in-out-crunch.jpg
- [ ] scissor.jpg
- [ ] situp.jpg
- [ ] bicycle.jpg
- [ ] reverse-crunch.jpg
- [ ] two-point-plank.jpg
- [ ] pike-press.jpg
- [ ] crab-walk.jpg

**WARMUP/COOLDOWN**
- [ ] arm-circles.jpg
- [ ] leg-swings.jpg
- [ ] cat-cow.jpg
- [ ] child-pose.jpg
- [ ] hamstring-stretch.jpg

---

## 💡 Pro Tips

1. **Start with essentials**: Focus on the most common exercises first (squat, pushup, plank, jumping-jack)
2. **Use AI quickly**: ChatGPT can generate all 40 images in minutes
3. **Batch process**: Crop/resize all images at once using batch tools
4. **Test incrementally**: Add 10 images, test, add 10 more

---

## 🎮 What's Changed

✅ **40+ Home Exercises** - All bodyweight, no gym
✅ **No Equipment Section** - Removed from onboarding
✅ **Home Workout Focus** - App message emphasizes bodyweight training
✅ **Household Item Suggestions** - Optional use of chair, wall, water bottles
✅ **Exercise Categories**: Cardio, Lower Body, Upper Body, Core

Your app is now a complete HOME WORKOUT system! 💪🏠
