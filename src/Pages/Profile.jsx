import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase.config';
import { 
    updateUserProfile, 
    addUserAddress, 
    getUserAddresses, 
    updateUserAddress, 
    deleteUserAddress 
} from '../services/firestoreService';
import toast from 'react-hot-toast';
import Navbar from '../Components/Navbar/Navbar';
import Footers from '../Components/Footer/Footers';
import { 
    FaUser, FaShoppingBag, FaMapMarkerAlt, FaCreditCard, 
    FaShieldAlt, FaChevronRight, FaSignOutAlt, FaEnvelope, 
    FaPhoneAlt, FaEdit 
} from 'react-icons/fa';
import "./Profile.css";
import Loader from '../Components/Loader/Loader';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('personal');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [addresses, setAddresses] = useState([]);
    const [editingAddress, setEditingAddress] = useState(null);
    
    // Form States
    const [profileForm, setProfileForm] = useState({ firstName: '', lastName: '', phone: '', location: '' });
    const [addressForm, setAddressForm] = useState({ name: '', phone: '', address: '', landmark: '', city: '', state: '', pincode: '', type: 'Home' });

    const navigate = useNavigate();

    const fetchAddresses = async (uid) => {
        const data = await getUserAddresses(uid);
        setAddresses(data);
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                try {
                    const docRef = doc(db, "users", currentUser.uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        setUserData(data);
                        setProfileForm({
                            firstName: data.firstName || '',
                            lastName: data.lastName || '',
                            phone: data.phone || '',
                            location: data.location || ''
                        });
                    }
                    await fetchAddresses(currentUser.uid);
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            } else {
                navigate('/login');
            }
            
            // Artificial delay for premium feel if loading happens too fast
            setTimeout(() => {
                setLoading(false);
            }, 800);
        });
        return () => unsubscribe();
    }, [navigate]);

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        const result = await updateUserProfile(user.uid, profileForm);
        if (result.success) {
            setUserData(prev => ({ ...prev, ...profileForm }));
            setIsEditModalOpen(false);
            toast.success("Profile updated successfully!");
        }
    };

    const handleAddressSubmit = async (e) => {
        e.preventDefault();
        let result;
        if (editingAddress) {
            result = await updateUserAddress(user.uid, editingAddress.id, addressForm);
        } else {
            result = await addUserAddress(user.uid, addressForm);
        }

        if (result.success) {
            toast.success(editingAddress ? "Address updated!" : "Address added!");
            setIsAddressModalOpen(false);
            setEditingAddress(null);
            setAddressForm({ name: '', phone: '', address: '', landmark: '', city: '', state: '', pincode: '', type: 'Home' });
            await fetchAddresses(user.uid);
        }
    };

    const handleDeleteAddress = async (id) => {
        if (window.confirm("Are you sure you want to delete this address?")) {
            const result = await deleteUserAddress(user.uid, id);
            if (result.success) {
                toast.success("Address deleted");
                await fetchAddresses(user.uid);
            }
        }
    };

    if (loading) {
        return <Loader fullPage={true} />;
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
        <div className="profile-page reveal-in">
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
                    <aside className="profile-navigation reveal-up">
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

                    <main className="profile-content-area reveal-up stagger-1">
                        {activeTab === 'personal' && (
                            <section className="content-section fade-in">
                                <div className="section-header">
                                    <h2>Personal Information</h2>
                                    <button className="btn-text" onClick={() => setIsEditModalOpen(true)}>Edit Details</button>
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
                                            <p>{userData?.phone || user?.phoneNumber || 'Not connected'}</p>
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

                        {activeTab === 'addresses' && (
                            <section className="content-section fade-in">
                                <div className="section-header">
                                    <h2>My Addresses</h2>
                                    <button className="btn-primary-small" onClick={() => {
                                        setEditingAddress(null);
                                        setAddressForm({ name: '', phone: '', address: '', landmark: '', city: '', state: '', pincode: '', type: 'Home' });
                                        setIsAddressModalOpen(true);
                                    }}>+ Add New</button>
                                </div>
                                
                                {addresses.length === 0 ? (
                                    <div className="empty-state">
                                        <FaMapMarkerAlt />
                                        <p>No addresses added yet.</p>
                                    </div>
                                ) : (
                                    <div className="address-list-grid">
                                        {addresses.map(addr => (
                                            <div key={addr.id} className="address-card-v2">
                                                <div className="addr-type-tag">{addr.type}</div>
                                                <h4>{addr.name}</h4>
                                                <p>{addr.address}</p>
                                                <p>{addr.city}, {addr.state} - {addr.pincode}</p>
                                                <p className="addr-phone">Phone: {addr.phone}</p>
                                                <div className="addr-actions">
                                                    <button onClick={() => {
                                                        setEditingAddress(addr);
                                                        setAddressForm({ ...addr });
                                                        setIsAddressModalOpen(true);
                                                    }}>Edit</button>
                                                    <button className="delete-btn" onClick={() => handleDeleteAddress(addr.id)}>Delete</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
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

            {/* Edit Profile Modal */}
            {isEditModalOpen && (
                <div className="modal-overlay-v2">
                    <div className="modal-content-v2 animate-pop">
                        <div className="modal-header">
                            <h3>Edit Personal Details</h3>
                            <button className="close-btn" onClick={() => setIsEditModalOpen(false)}>✕</button>
                        </div>
                        <form onSubmit={handleProfileUpdate}>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>First Name</label>
                                    <input type="text" value={profileForm.firstName} onChange={e => setProfileForm({...profileForm, firstName: e.target.value})} required />
                                </div>
                                <div className="form-group">
                                    <label>Last Name</label>
                                    <input type="text" value={profileForm.lastName} onChange={e => setProfileForm({...profileForm, lastName: e.target.value})} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Phone Number</label>
                                <input type="tel" value={profileForm.phone} onChange={e => setProfileForm({...profileForm, phone: e.target.value})} required />
                            </div>
                            <div className="form-group">
                                <label>Location</label>
                                <input type="text" value={profileForm.location} onChange={e => setProfileForm({...profileForm, location: e.target.value})} />
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn-cancel" onClick={() => setIsEditModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn-submit">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Address Modal */}
            {isAddressModalOpen && (
                <div className="modal-overlay-v2">
                    <div className="modal-content-v2 animate-pop wide">
                        <div className="modal-header">
                            <h3>{editingAddress ? 'Edit Address' : 'Add New Address'}</h3>
                            <button className="close-btn" onClick={() => setIsAddressModalOpen(false)}>✕</button>
                        </div>
                        <form onSubmit={handleAddressSubmit}>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Full Name</label>
                                    <input type="text" value={addressForm.name} onChange={e => setAddressForm({...addressForm, name: e.target.value})} required />
                                </div>
                                <div className="form-group">
                                    <label>Phone Number</label>
                                    <input type="tel" value={addressForm.phone} onChange={e => setAddressForm({...addressForm, phone: e.target.value})} required />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Full Address</label>
                                <textarea value={addressForm.address} onChange={e => setAddressForm({...addressForm, address: e.target.value})} required />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>City</label>
                                    <input type="text" value={addressForm.city} onChange={e => setAddressForm({...addressForm, city: e.target.value})} required />
                                </div>
                                <div className="form-group">
                                    <label>State</label>
                                    <input type="text" value={addressForm.state} onChange={e => setAddressForm({...addressForm, state: e.target.value})} required />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Pincode</label>
                                    <input type="text" value={addressForm.pincode} onChange={e => setAddressForm({...addressForm, pincode: e.target.value})} required />
                                </div>
                                <div className="form-group">
                                    <label>Address Type</label>
                                    <select value={addressForm.type} onChange={e => setAddressForm({...addressForm, type: e.target.value})}>
                                        <option>Home</option>
                                        <option>Office</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn-cancel" onClick={() => setIsAddressModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn-submit">{editingAddress ? 'Update Address' : 'Save Address'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            <Footers />
        </div>
    );
};

export default Profile;
