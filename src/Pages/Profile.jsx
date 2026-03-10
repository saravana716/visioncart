import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase.config';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Components/Navbar/Navbar';
import Footers from '../Components/Footer/Footers';
import './Profile.css';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                // Fetch additional data from Firestore
                try {
                    const docRef = doc(db, "users", currentUser.uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        setUserData(docSnap.data());
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            } else {
                navigate('/login');
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [navigate]);

    if (loading) {
        return (
            <div className="profile-loading">
                <div className="loader"></div>
            </div>
        );
    }

    return (
        <div className="profile-page">
            <Navbar />
            <div className="profile-container">
                <div className="profile-header">
                    <h1>My Profile</h1>
                    <p>Manage your account settings and information.</p>
                </div>
                
                <div className="profile-card">
                    <div className="profile-sidebar">
                        <div className="profile-avatar">
                            {userData?.firstName?.[0] || user?.email?.[0] || 'U'}
                        </div>
                        <h3>{userData ? `${userData.firstName} ${userData.lastName || ''}` : 'User'}</h3>
                        <p className="profile-email">{user?.email || user?.phoneNumber || 'No identifier'}</p>
                        
                        <div className="profile-menu">
                            <button className="active">Personal Information</button>
                            <button onClick={() => navigate('/orders')}>My Orders</button>
                            <button>Addresses</button>
                            <button>Payment Methods</button>
                            <button className="logout-btn" onClick={() => auth.signOut()}>Logout</button>
                        </div>
                    </div>
                    
                    <div className="profile-main">
                        <div className="info-section">
                            <h2>Personal Information</h2>
                            <div className="info-grid">
                                <div className="info-item">
                                    <label>First Name</label>
                                    <p>{userData?.firstName || 'Not set'}</p>
                                </div>
                                <div className="info-item">
                                    <label>Last Name</label>
                                    <p>{userData?.lastName || 'Not set'}</p>
                                </div>
                                <div className="info-item">
                                    <label>Email Address</label>
                                    <p>{user?.email || 'Not set'}</p>
                                </div>
                                <div className="info-item">
                                    <label>Phone Number</label>
                                    <p>{user?.phoneNumber || userData?.phone || 'Not set'}</p>
                                </div>
                            </div>
                        </div>

                        <div className="info-section">
                            <h2>Account Security</h2>
                            <div className="security-item">
                                <div>
                                    <label>Password</label>
                                    <p>••••••••••••</p>
                                </div>
                                <button className="edit-btn">Change Password</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footers />
        </div>
    );
};

export default Profile;
