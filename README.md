# ProLance

> Deliver college projects with confidence: fast quotes, transparent progress, and reliable final delivery.

## Why ProLance
ProLance connects students with a managed delivery workflow for semester projects, reports, and assignments. From request to handover, the platform keeps everything in one place: requirements, files, communication, approvals, and status updates.

## Highlights
- Student onboarding with secure authentication and email verification
- Project submission with detailed requirements
- Admin review and quote workflow
- Live status tracking and notifications
- Built-in chat between client and admin team
- Payment proof submission flow
- Clean, responsive UI for desktop and mobile

## Tech Stack
- Frontend: React 18, React Router, Tailwind CSS
- State and UX: React Hot Toast, Lucide Icons, Framer Motion
- Backend: Firebase Auth, Firestore, Firebase Storage
- Tooling: Create React App, PostCSS, Autoprefixer

## Quick Start
1. Clone the repository
   ```bash
   git clone https://github.com/Avisav24/ProLance.git
   cd ProLance
   ```
2. Install dependencies
   ```bash
   npm install
   ```
3. Create a `.env` file in the project root
   ```env
   REACT_APP_FIREBASE_API_KEY=your_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   REACT_APP_FIREBASE_APP_ID=your_app_id
   ```
4. Run the app
   ```bash
   npm start
   ```

## Scripts
- `npm start` - Start development server
- `npm run build` - Create production build
- `npm test` - Run tests

## Deployment
For Firebase Hosting:
```bash
npm run build
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

## Product Flow
1. Student signs up and submits project details
2. Admin reviews and provides quote/timeline
3. Student confirms and uploads payment proof
4. Team executes project with progress updates
5. Final delivery and closure

## Repository Structure
```text
public/        Static assets
src/           Application source code
src/components UI modules (Auth, Dashboard, Admin, Layout, etc.)
src/contexts   Auth and notification providers
src/firebase   Firebase setup
```

## Contributing
1. Create a feature branch
2. Commit focused changes
3. Push and open a pull request

## License
MIT

---
Built with focus on clarity, speed, and dependable project delivery.
