// import express from 'express';
// import admin from 'firebase-admin';

// const router = express.Router();
// const db = admin.firestore();

// // Register new user
// router.post('/register', async (req, res) => {
//   try {
//     const { email, password, username } = req.body;

//     // Check if user already exists
//     const userRecord = await admin.auth().getUserByEmail(email).catch(() => null);
//     if (userRecord) {
//       return res.status(400).json({ message: 'User already exists' });
//     }

//     // Create user in Firebase Auth
//     const user = await admin.auth().createUser({
//       email,
//       password,
//       displayName: username
//     });

//     // Store additional user data in Firestore
//     await db.collection('users').doc(user.uid).set({
//       username,
//       email,
//       createdAt: admin.firestore.FieldValue.serverTimestamp(),
//       isActive: true
//     });

//     // Generate custom token
//     const token = await admin.auth().createCustomToken(user.uid);

//     res.status(201).json({
//       message: 'User registered successfully',
//       token,
//       user: {
//         id: user.uid,
//         username,
//         email
//       }
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Error registering user', error: error.message });
//   }
// });

// // Login user
// router.post('/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Note: Firebase Authentication is handled on the client side
//     // This endpoint should be used to verify the token from client
//     const idToken = req.headers.authorization?.split('Bearer ')[1];
//     if (!idToken) {
//       return res.status(401).json({ message: 'No token provided' });
//     }

//     // Verify the Firebase ID token
//     const decodedToken = await admin.auth().verifyIdToken(idToken);
//     const user = await admin.auth().getUser(decodedToken.uid);
//     const userData = await db.collection('users').doc(user.uid).get();

//     res.json({
//       message: 'Login successful',
//       user: {
//         id: user.uid,
//         username: userData.data().username,
//         email: user.email
//       }
//     });
//   } catch (error) {
//     res.status(401).json({ message: 'Invalid credentials' });
//   }
// });

// // Get user profile
// router.get('/profile', async (req, res) => {
//   try {
//     const idToken = req.headers.authorization?.split('Bearer ')[1];
//     if (!idToken) {
//       return res.status(401).json({ message: 'No token provided' });
//     }

//     // Verify the Firebase ID token
//     const decodedToken = await admin.auth().verifyIdToken(idToken);
//     const userData = await db.collection('users').doc(decodedToken.uid).get();

//     if (!userData.exists) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     res.json(userData.data());
//   } catch (error) {
//     res.status(401).json({ message: 'Invalid token' });
//   }
// });

// export default router; 