import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase.config';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Components/Navbar/Navbar';
import Footers from '../Components/Footer/Footers';
import { 
    FaUser, 
    FaShoppingBag, 
    FaMapMarkerAlt, 
    FaCreditCard, 
    FaSignOutAlt, 
    FaChevronRight,
    FaEnvelope,
    FaPhoneAlt,
    FaShieldAlt,
    FaEdit
} from 'react-icons/fa';
import './Profile.css';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('personal');
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
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

    const navigationItems = [
        { id: 'personal', label: 'Personal Info', icon: <FaUser /> },
        { id: 'orders', label: 'My Orders', icon: <FaShoppingBag /> },
        { id: 'addresses', label: 'Addresses', icon: <FaMapMarkerAlt /> },
        { id: 'payment', label: 'Payment Methods', icon: <FaCreditCard /> },
        { id: 'security', label: 'Security', icon: <FaShieldAlt /> },
    ];

    const handleLogout = async () => {
        await auth.signOut();
        navigate('/');
    };

    return (
        <div className="profile-page">
            <Navbar />
            <div className="profile-hero">
                <div className="hero-content">
                    <div className="profile-avatar-large">
                        {userData?.firstName?.[0] || user?.email?.[0] || 'U'}
                        <button className="edit-avatar"><FaEdit /></button>
                    </div>
                    <div className="hero-text">
                        <h1>{userData ? `${userData.firstName} ${userData.lastName || ''}` : 'VisionCart User'}</h1>
                        <p>{user?.email || user?.phoneNumber}</p>
                        <span className="member-badge">VisionCart Member</span>
                    </div>
                </div>
            </div>

            <div className="profile-main-container">
                <div className="profile-grid">
                    <aside className="profile-navigation">
                        <div className="nav-group">
                            {navigationItems.map(item => (
                                <button 
                                    key={item.id}
                                    className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                                    onClick={() => item.id === 'orders' ? navigate('/orders') : setActiveTab(item.id)}
                                >
                                    <span className="nav-icon">{item.icon}</span>
                                    <span className="nav-label">{item.label}</span>
                                    <FaChevronRight className="nav-arrow" />
                                </button>
                            ))}
                        </div>
                        <button className="nav-item logout-nav" onClick={handleLogout}>
                            <span className="nav-icon"><FaSignOutAlt /></span>
                            <span className="nav-label">Logout</span>
                        </button>
                    </aside>

                    <main className="profile-content-area">
                        {activeTab === 'personal' && (
                            <section className="content-section fade-in">
                                <div className="section-header">
                                    <h2>Personal Information</h2>
                                    <button className="btn-text">Edit Details</button>
                                </div>
                                <div className="details-grid">
                                    <div className="detail-card">
                                        <div className="detail-icon"><FaUser /></div>
                                        <div className="detail-info">
                                            <label>Full Name</label>
                                            <p>{userData ? `${userData.firstName} ${userData.lastName || ''}` : 'Not provided'}</p>
                                        </div>
                                    </div>
                                    <div className="detail-card">
                                        <div className="detail-icon"><FaEnvelope /></div>
                                        <div className="detail-info">
                                            <label>Email Address</label>
                                            <p>{user?.email || 'Not connected'}</p>
                                        </div>
                                    </div>
                                    <div className="detail-card">
                                        <div className="detail-icon"><FaPhoneAlt /></div>
                                        <div className="detail-info">
                                            <label>Phone Number</label>
                                            <p>{user?.phoneNumber || userData?.phone || 'Not connected'}</p>
                                        </div>
                                    </div>
                                    <div className="detail-card">
                                        <div className="detail-icon"><FaMapMarkerAlt /></div>
                                        <div className="detail-info">
                                            <label>Primary Location</label>
                                            <p>{userData?.location || 'India'}</p>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        )}

                        {activeTab === 'security' && (
                            <section className="content-section fade-in">
                                <div className="section-header">
                                    <h2>Security & Privacy</h2>
                                </div>
                                <div className="security-list">
                                    <div className="security-row">
                                        <div className="security-info">
                                            <h4>Update Password</h4>
                                            <p>Change your password periodically to keep your account secure.</p>
                                        </div>
                                        <button className="btn-outline">Change</button>
                                    </div>
                                    <div className="security-row">
                                        <div className="security-info">
                                            <h4>Two-Factor Authentication</h4>
                                            <p>Add an extra layer of security to your account.</p>
                                        </div>
                                        <button className="btn-outline">Enable</button>
                                    </div>
                                    <div className="security-row">
                                        <div className="security-info">
                                            <h4>Deactivate Account</h4>
                                            <p>Temporarily disable your account. This can be undone.</p>
                                        </div>
                                        <button className="btn-text danger">Deactivate</button>
                                    </div>
                                </div>
                            </section>
                        )}

                        {activeTab === 'addresses' && (
                            <section className="content-section fade-in">
                                <div className="section-header">
                                    <h2>My Addresses</h2>
                                    <button className="btn-primary-small">+ Add New</button>
                                </div>
                                <div className="empty-state">
                                    <FaMapMarkerAlt />
                                    <p>No addresses added yet.</p>
                                </div>
                            </section>
                        )}
                        
                        {activeTab === 'payment' && (
                            <section className="content-section fade-in">
                                <div className="section-header">
                                    <h2>Payment Methods</h2>
                                    <button className="btn-primary-small">+ Add Card</button>
                                </div>
                                <div className="empty-state">
                                    <FaCreditCard />
                                    <p>No saved cards or accounts.</p>
                                </div>
                            </section>
                        )}
                    </main>
                </div>
            </div>
            <Footers />
        </div>
    );
};

export default Profile;
