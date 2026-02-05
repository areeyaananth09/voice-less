# Gesture Detection Logic

## How It Works

The gesture detection system analyzes hand landmarks from MediaPipe to identify specific sign language gestures.

## Hand Landmark Points

MediaPipe Hands provides 21 landmark points:

```
Landmark Index Map:
0  - Wrist
1-4   - Thumb (1: CMC, 2: MCP, 3: IP, 4: Tip)
5-8   - Index (5: MCP, 6: PIP, 7: DIP, 8: Tip)
9-12  - Middle (9: MCP, 10: PIP, 11: DIP, 12: Tip)
13-16 - Ring (13: MCP, 14: PIP, 15: DIP, 16: Tip)
17-20 - Pinky (17: MCP, 18: PIP, 19: DIP, 20: Tip)
```

## Detection Algorithm

### Step 1: Finger State Detection

```javascript
// Check if each finger is open or closed
const thumbOpen = landmarks[4].x < landmarks[3].x;
const indexOpen = landmarks[8].y < landmarks[6].y;
const middleOpen = landmarks[12].y < landmarks[10].y;
const ringOpen = landmarks[16].y < landmarks[14].y;
const pinkyOpen = landmarks[20].y < landmarks[18].y;
```

**Logic**:
- **Thumb**: Open if tip (4) is further left than IP joint (3)
- **Other Fingers**: Open if tip Y-coordinate is above PIP joint

### Step 2: Finger Spacing Detection

```javascript
// Calculate distances between fingertips
const indexMiddleDist = Math.abs(landmarks[8].x - landmarks[12].x);
const middleRingDist = Math.abs(landmarks[12].x - landmarks[16].x);
const ringPinkyDist = Math.abs(landmarks[16].x - landmarks[20].x);

// Determine if fingers are close together or spread apart
const fingersClose = (indexMiddleDist < 0.07) && 
                     (middleRingDist < 0.07) && 
                     (ringPinkyDist < 0.07);

const fingersSpread = (indexMiddleDist > 0.10) && 
                      (middleRingDist > 0.10) && 
                      (ringPinkyDist > 0.10);
```

**Thresholds**:
- **Close**: Distance < 0.07 (normalized coordinates)
- **Spread**: Distance > 0.10 (normalized coordinates)

### Step 3: Gesture Matching

Each gesture is identified by a unique combination of finger states and spacing:

## Gesture Patterns

### 1. Hello
```javascript
thumbOpen && indexOpen && middleOpen && ringOpen && pinkyOpen && fingersSpread
```
**Description**: All fingers open and spread apart (open palm)

### 2. Thank You
```javascript
thumbOpen && indexOpen && middleOpen && ringOpen && pinkyOpen && fingersClose
```
**Description**: All fingers open but close together

### 3. Sorry / Good / Bad / Eat / Drink / Sleep / Sad / Go
```javascript
!thumbOpen && !indexOpen && !middleOpen && !ringOpen && !pinkyOpen
```
**Description**: All fingers closed (fist)
**Note**: These gestures share the same hand shape but differ in motion/context

### 4. Yes / Help
```javascript
!indexOpen && !middleOpen && !ringOpen && !pinkyOpen && thumbOpen
```
**Description**: Only thumb extended (thumbs up)

### 5. No
```javascript
indexOpen && !middleOpen && !ringOpen && !pinkyOpen && !thumbOpen
```
**Description**: Only index finger extended (pointing)

### 6. I Love You
```javascript
thumbOpen && indexOpen && !middleOpen && !ringOpen && pinkyOpen
```
**Description**: Thumb, index, and pinky extended (ILY sign)

### 7. Please
```javascript
thumbOpen && indexOpen && middleOpen && ringOpen && pinkyOpen && 
!fingersSpread && !fingersClose
```
**Description**: All fingers open, medium spacing

### 8. Stop / Happy
```javascript
thumbOpen && indexOpen && middleOpen && ringOpen && pinkyOpen && fingersSpread
```
**Description**: All fingers open and spread (same as Hello)

### 9. Friend
```javascript
thumbOpen && indexOpen && middleOpen && !ringOpen && !pinkyOpen
```
**Description**: Thumb, index, and middle extended

### 10. Love / Play
```javascript
!thumbOpen && indexOpen && middleOpen && !ringOpen && !pinkyOpen
```
**Description**: Index and middle extended (peace sign)

## Coordinate System

MediaPipe uses normalized coordinates:
- **X-axis**: 0 (left) to 1 (right)
- **Y-axis**: 0 (top) to 1 (bottom)
- **Z-axis**: Depth (not used in current implementation)

## Improving Detection Accuracy

### Current Limitations

1. **Static Gestures Only**: No motion detection
2. **Single Hand**: Only tracks one hand at a time
3. **Overlapping Patterns**: Some gestures share the same hand shape
4. **No Context**: Cannot distinguish between similar gestures

### Potential Improvements

#### 1. Add Motion Detection
```javascript
// Track landmark positions over time
const velocity = calculateVelocity(currentLandmarks, previousLandmarks);
const direction = calculateDirection(velocity);

// Detect dynamic gestures
if (direction === "circular" && speed > threshold) {
  return "Please"; // Circular motion over heart
}
```

#### 2. Add Hand Orientation
```javascript
// Calculate palm orientation
const palmNormal = calculatePalmNormal(landmarks);
const palmFacing = palmNormal.z > 0 ? "camera" : "away";

// Use orientation in detection
if (allFingersOpen && palmFacing === "camera") {
  return "Stop";
} else if (allFingersOpen && palmFacing === "away") {
  return "Hello";
}
```

#### 3. Add Temporal Context
```javascript
// Track gesture history
const gestureHistory = [];

// Detect gesture sequences
if (gestureHistory.includes("Hello") && currentGesture === "Fist") {
  return "Goodbye";
}
```

#### 4. Add Distance Thresholds
```javascript
// Calculate hand size (distance from wrist to middle fingertip)
const handSize = calculateDistance(landmarks[0], landmarks[12]);

// Adjust thresholds based on hand size
const closeThreshold = handSize * 0.15;
const spreadThreshold = handSize * 0.25;
```

## Customizing Gestures

### Adding a New Gesture

1. **Identify the hand shape**:
   ```javascript
   // Example: "Peace" sign
   const isPeace = !thumbOpen && indexOpen && middleOpen && 
                   !ringOpen && !pinkyOpen;
   ```

2. **Add to detection function**:
   ```javascript
   if (isPeace) return "Peace";
   ```

3. **Add to supported gestures list**:
   ```javascript
   ["Hello", "Thank You", ..., "Peace"]
   ```

### Adjusting Sensitivity

```javascript
// Make detection more strict (fewer false positives)
const fingersClose = (indexMiddleDist < 0.05) && ...  // Decrease threshold

// Make detection more lenient (more detections)
const fingersSpread = (indexMiddleDist > 0.08) && ...  // Decrease threshold
```

## Performance Optimization

### Current Implementation
- **Frame Rate**: ~30 FPS
- **Processing Time**: ~10-20ms per frame
- **Model Complexity**: 1 (balanced)

### Optimization Tips

1. **Reduce Model Complexity**:
   ```javascript
   hands.setOptions({
     modelComplexity: 0,  // Faster but less accurate
   });
   ```

2. **Lower Detection Confidence**:
   ```javascript
   hands.setOptions({
     minDetectionConfidence: 0.5,  // More detections, more false positives
   });
   ```

3. **Skip Frames**:
   ```javascript
   let frameCount = 0;
   onFrame: async () => {
     if (frameCount++ % 2 === 0) {  // Process every other frame
       await hands.send({ image: videoElement });
     }
   }
   ```

## Testing Gestures

### Best Practices

1. **Lighting**: Ensure good, even lighting
2. **Distance**: Keep hand 1-2 feet from camera
3. **Background**: Use plain background for better detection
4. **Hand Position**: Keep hand centered in frame
5. **Finger Clarity**: Ensure fingers are clearly visible and not overlapping

### Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| No detection | Poor lighting | Improve lighting |
| Wrong gesture | Similar hand shapes | Add more specific conditions |
| Flickering | Threshold too sensitive | Adjust thresholds |
| Slow detection | High model complexity | Reduce complexity |

## Future Enhancements

1. **Two-Hand Gestures**: Support gestures requiring both hands
2. **Dynamic Gestures**: Detect motion-based signs
3. **Custom Training**: Allow users to train custom gestures
4. **Gesture Sequences**: Recognize multi-gesture phrases
5. **Context Awareness**: Use previous gestures to improve accuracy
6. **Confidence Scores**: Show detection confidence percentage
7. **Gesture Feedback**: Visual/audio feedback for detected gestures

---

**Note**: The current implementation provides a solid foundation for static gesture recognition. For production use, consider implementing motion detection and temporal context for more accurate and comprehensive sign language recognition.
