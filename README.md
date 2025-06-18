# Gradely - College Project Delivery Service

A comprehensive platform that connects college students with professional developers to complete their semester-end projects. Students can submit project requirements, receive quotes, track progress, and get high-quality deliverables before their deadlines.

## 🚀 Features

### For Students (Clients)

- **User Registration & Authentication**: Secure signup/login with email verification
- **Project Submission**: Detailed forms with file uploads for project requirements
- **Quote & Payment**: Transparent pricing with secure payment processing
- **Progress Tracking**: Real-time updates on project status and milestones
- **Communication**: Built-in chat system for direct communication with developers
- **File Management**: Secure upload/download of project files and deliverables
- **Feedback System**: Rate and review completed projects

### For Admin Team

- **Project Management**: Review, approve, and manage all incoming projects
- **Client Management**: View and manage client information and project history
- **Pricing Management**: Set and adjust project quotes based on complexity
- **Analytics Dashboard**: Track revenue, project metrics, and performance
- **Status Updates**: Update project progress and communicate with clients
- **Payment Processing**: Handle payment confirmations and project releases

### Core Features

- **Real-time Updates**: Live notifications and status changes
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Secure Authentication**: Firebase Auth with role-based access control
- **File Storage**: Secure file uploads using Firebase Storage
- **Database**: Firestore for real-time data synchronization
- **Modern UI**: Clean, intuitive interface built with Tailwind CSS

## 🛠 Tech Stack

### Frontend

- **React 18**: Modern React with hooks and functional components
- **React Router**: Client-side routing and navigation
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Lucide React**: Beautiful, customizable icons
- **React Hook Form**: Performant forms with validation
- **React Dropzone**: Drag-and-drop file uploads
- **React Hot Toast**: Elegant toast notifications
- **Date-fns**: Modern date utility library

### Backend & Services

- **Firebase Authentication**: User authentication and authorization
- **Firestore Database**: NoSQL database for real-time data
- **Firebase Storage**: Secure file storage and management
- **Firebase Security Rules**: Database and storage security

### Development Tools

- **Create React App**: React development environment
- **PostCSS**: CSS processing
- **Autoprefixer**: CSS vendor prefixing

## 📦 Installation & Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase project setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd gradely
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Firebase Configuration

Create a `.env` file in the root directory:

```env
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

### 4. Start Development Server

```bash
npm start
```

The application will be available at `http://localhost:3000`

## 🗄 Database Structure

### Collections

#### users

```javascript
{
  uid: "string",
  email: "string",
  name: "string",
  college: "string",
  phone: "string",
  role: "client" | "admin",
  createdAt: "timestamp",
  updatedAt: "timestamp"
}
```

#### projects

```javascript
{
  id: "string",
  clientId: "string",
  title: "string",
  description: "string",
  requirements: "string",
  files: ["string"],
  category: "string",
  deadline: "timestamp",
  budget: "number",
  status: "pending" | "approved" | "in_progress" | "completed" | "delivered",
  price: "number",
  paymentStatus: "pending" | "paid" | "confirmed",
  paymentProof: "string",
  createdAt: "timestamp",
  updatedAt: "timestamp"
}
```

#### messages

```javascript
{
  id: "string",
  projectId: "string",
  senderId: "string",
  senderName: "string",
  content: "string",
  timestamp: "timestamp"
}
```

## 🔐 Authentication

The platform uses Firebase Authentication with the following features:

- Email/password authentication
- Email verification
- Role-based access control (client/admin)
- Protected routes
- Automatic session management

## 📱 Responsive Design

The application is fully responsive and optimized for:

- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🎨 UI Components

### Custom Components

- **Header**: Navigation with user menu and responsive design
- **Layout**: Main application layout with sidebar
- **Forms**: Reusable form components with validation
- **Cards**: Project and dashboard cards
- **Modals**: Confirmation and detail modals
- **Charts**: Analytics and statistics visualization

### Design System

- **Colors**: Primary blue theme with semantic colors
- **Typography**: Inter font family with consistent sizing
- **Spacing**: Tailwind's spacing scale
- **Shadows**: Consistent elevation system
- **Animations**: Smooth transitions and loading states

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

## 📋 Project Workflow

### Client Journey

1. **Registration**: Sign up with email verification
2. **Project Submission**: Fill detailed project form with requirements
3. **Quote Review**: Receive and review project quote
4. **Payment**: Upload payment proof
5. **Progress Tracking**: Monitor project development
6. **Communication**: Chat with development team
7. **Delivery**: Receive completed project files
8. **Feedback**: Rate and review the service

### Admin Workflow

1. **Project Review**: Evaluate incoming project requests
2. **Pricing**: Set appropriate project quotes
3. **Payment Confirmation**: Verify payment proofs
4. **Development**: Execute project requirements
5. **Status Updates**: Keep clients informed of progress
6. **Quality Assurance**: Ensure project meets requirements
7. **Delivery**: Upload completed project files
8. **Support**: Address any post-delivery concerns

## 🔒 Firebase Security Rules

### Firestore Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Projects: clients can read/write their own, admins can read all
    match /projects/{projectId} {
      allow read, write: if request.auth != null &&
        (resource.data.clientId == request.auth.uid ||
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }

    // Messages: project participants can read/write
    match /messages/{messageId} {
      allow read, write: if request.auth != null &&
        (resource.data.senderId == request.auth.uid ||
         get(/databases/$(database)/documents/projects/$(resource.data.projectId)).data.clientId == request.auth.uid ||
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }
  }
}
```

### Storage Rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔮 Future Enhancements

- **Mobile App**: Native iOS and Android applications
- **Advanced Analytics**: Detailed reporting and insights
- **Payment Gateway**: Integrated payment processing
- **Video Calls**: Real-time video communication
- **Project Templates**: Pre-built project templates
- **Referral System**: Client referral rewards
- **Multi-language**: Internationalization support
- **API Integration**: Third-party service integrations

---

**Gradely** - Making college project completion simple, professional, and reliable.
