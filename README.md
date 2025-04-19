# Measured-Munch

## 1. Project Goal & Introduction

This app is a **client-side web application** implementing a simple intermittent fasting PWA. Use the app to determine if you are allowed to start eating again by tracking your fasting period.

## 2. Technology Stack

- **Frontend:**  
  - React with TypeScript, Vite
  - Standard browser APIs
  - NVM (use 22), bun 1.2.9+
- **Styling:**  
  - Minimal CSS for a modern, responsive layout

## 3. Core Functionality & User Flow

### Initial State
- User launches the app and is prompted with a clean, modern interface.
- The main view shows an option to start a fast, and if a fast is already active, a countdown timer displaying the remaining time.

### Starting a Fast
- **Action:** User clicks the “Start Fast” button.
- **Data Storage:** The current epoch time is saved in Local Storage.
- **Countdown:** A timer starts that calculates the remaining fasting period based on the preset fasting duration.

### Countdown Timer
- **Display:** The timer shows the remaining hours and minutes until the fasting period ends.
- **Calculation:** Uses the saved epoch time from Local Storage and the duration setting to render a live countdown.

### Finishing a Fast
- When the countdown reaches zero, the UI updates to indicate that the eating window is open.
- The user is prompted or allowed to reset/start a new fasting period.

## 4. UX Design Specifications

### UI/UX Principles
- **Modern & Minimalist:**  
  - Clean layout with ample whitespace.
  - Minimal dependencies to keep the application lightweight.
  - Use of CSS Flexbox/Grid for responsive design.

- **Responsive Design:**  
  - User interface adapts to mobile, tablet, and desktop views.
  - Readable typography and touch-friendly controls.

### Key Components
1. **Hero Section:**
   - Central area with the application title and a brief description of the fasting concept.
   - “Start Fast” button prominently displayed.

2. **Countdown Timer:**
   - When a fast is active, show a large, easy-to-read timer.
   - Timer dynamically updates to show hours and minutes remaining.
   - Clearly indicate when the fasting period is over, potentially with a color change or animation.

3. **Settings Panel:**
   - Accessible either from a dedicated settings icon or on an initial setup screen.
   - **Fasting Duration:**  
     - Input to set the number of fasting hours (or alternatively, the length of the eating window).
     - The duration setting is saved locally and used for initializing the countdown timer.
   - **Data Persistence:**
     - Utilize Local Storage to record the epoch time when the fast was started and the user’s fasting settings.
     - Option to reset or adjust settings if required.

4. **Notifications & Feedback:**
   - Visual cues when the fast starts and ends.
   - Optionally, a simple sound or vibration alert (using browser APIs) to signal the transition.

### Interaction Flow
- **On Load:**  
  - Check Local Storage for any active fast session.
  - If an active session is found, calculate the remaining time and display the countdown.
  - If no active session, display the “Start Fast” prompt with clear instructions.
  
- **On User Action:**  
  - When “Start Fast” is clicked, store the current epoch time and launch the countdown.
  - Allow users to modify fasting settings via the settings panel before starting a fast.
  
- **Post Fast:**  
  - After the countdown ends, update the interface to indicate the fast is complete.
  - Provide an option to restart the fast or go to the settings panel.

## 5. Conclusion

Measured-Munch aims to provide a straightforward, user-friendly interface for managing intermittent fasting, with minimal distractions and dependencies. By leveraging modern web standards, Local Storage for persistence, and a clean React-based UI, the app ensures a delightful and responsive experience.