import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import api from '../api';
import TopBar from './shared/TopBar';
import { BiPencil, BiTrash, BiCheckCircle } from 'react-icons/bi';
import '../styles/style.css'; // Ensure this path is correct relative to ProfilePage.js

// *** 1. Import the local image ***
// Adjust the path '../components/llama.jpg' if ProfilePage.js is not directly in 'components'
// For example, if ProfilePage.js is in 'src/pages' and llama.jpg is in 'src/components',
// the path might be '../components/llama.jpg'
// If ProfilePage.js is in 'src/components' alongside llama.jpg, use './llama.jpg'
import llamaFallbackImage from './llama.jpg'; // <<< IMPORT LOCAL IMAGE

function ProfilePage() {
    const navigate = useNavigate();
    const { user: auth0Profile, getAccessTokenSilently, logout } = useAuth0();
    const [appUser, setAppUser] = useState(null);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({ displayName: '', email: '', picture: '' });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

     // --- Get Auth Config ---
     const getAuthConfig = useCallback(async () => {
        // Add console log to check if this function reference changes unexpectedly
        // console.log('getAuthConfig reference created/changed');
        try {
            const token = await getAccessTokenSilently();
            return {
                headers: { Authorization: `Bearer ${token}` }
            };
        } catch (err) {
            console.error("Error getting access token:", err);
            setError("Authentication error. Please refresh or log in again.");
            throw err;
        }
    }, [getAccessTokenSilently]);

    // Fetch profile details on mount
    useEffect(() => {
        // *** Add console log to debug potential loops ***
        console.log('ProfilePage useEffect running. Dependencies:', { auth0ProfileExists: !!auth0Profile });
        // You could try logging JSON.stringify(auth0Profile) but it might be large/complex

        const fetchProfile = async () => {
             setIsLoading(true);
             setError(null);
            try {
                 const config = await getAuthConfig();
                const response = await api.get('/Account', config);
                setAppUser(response.data);
                setFormData({
                    displayName: response.data.displayName || auth0Profile?.nickname || auth0Profile?.name || '',
                    email: response.data.email || auth0Profile?.email || '',
                    // Use picture from response, fallback to auth0, OR empty string if none
                    picture: response.data.picture || auth0Profile?.picture || ''
                });
            } catch (error) {
                console.error("Error fetching profile:", error.response || error);
                 setError(error.response?.data?.detail || "Failed to load profile.");
                 setFormData({ // Still set form data with fallbacks on error
                     displayName: auth0Profile?.nickname || auth0Profile?.name || '',
                     email: auth0Profile?.email || '',
                     picture: auth0Profile?.picture || ''
                 });
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
        // Note: Including getAuthConfig is correct because it's used.
        // Including auth0Profile *can* sometimes cause loops if its reference isn't stable,
        // but it's needed here for the fallbacks. If looping persists, this is the area to investigate.
    }, [getAuthConfig, auth0Profile]);


    // --- handleUpdate (No changes needed for image logic) ---
    const handleUpdate = async () => {
        // ... (keep existing logic) ...
        if (!appUser) {
             alert("User data not loaded yet.");
             return;
         }

         if (editing) {
              setIsLoading(true);
              setError(null);
             try {
                 const config = await getAuthConfig();
                 const payload = {
                      ...appUser,
                      displayName: formData.displayName,
                      email: formData.email,
                      picture: formData.picture
                  };
                 delete payload.userId;
                 delete payload.userName;

                 await api.put('/Account', payload, config);
                 // Important: Update appUser AND formData after successful save
                 const updatedUser = { ...appUser, ...payload };
                 setAppUser(updatedUser);
                 setFormData({ // Keep formData in sync too
                      displayName: updatedUser.displayName,
                      email: updatedUser.email,
                      picture: updatedUser.picture
                 });

                 alert("Profile updated successfully.");
                 setEditing(false);
             } catch (error) {
                 console.error("Error updating profile:", error.response || error);
                 setError(error.response?.data?.detail || "Failed to update profile.");
                  alert("Failed to update profile.");
             } finally {
                 setIsLoading(false);
             }
         } else {
              // Ensure form is populated correctly when entering edit mode
              setFormData({
                  displayName: appUser?.displayName || auth0Profile?.nickname || auth0Profile?.name || '',
                  email: appUser?.email || auth0Profile?.email || '',
                  picture: appUser?.picture || auth0Profile?.picture || ''
              });
              setEditing(true);
         }
    };

    // --- handleDelete (No changes needed for image logic) ---
    const handleDelete = async () => {
        // ... (keep existing logic) ...
         if (window.confirm("Are you sure you want to delete your account? This action will log you out and cannot be undone.")) {
              setIsLoading(true);
              setError(null);
             try {
                  const config = await getAuthConfig();
                 await api.delete('/Account', config);
                 console.log("Account deleted from backend. Logging out from Auth0...");
                 logout({ logoutParams: { returnTo: window.location.origin } });
             } catch (error) {
                 console.error("Error deleting account:", error.response || error);
                 setError(error.response?.data?.detail || "Failed to delete account.");
                  alert("Failed to delete account.");
                  setIsLoading(false);
             }
         }
    };

    // --- handleInputChange (No changes needed) ---
    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // --- Render Logic ---
    if (isLoading && !appUser && !error) {
        return (
            <div className="loading-container">
                <p>Loading profile...</p>
            </div>
        );
    }
    if (error && !appUser) {
         return (
            <div className="error-container">
                <p>Error: {error}</p>
            </div>
         );
     }


    return (
        <div>
            <TopBar />
            <main className="profile-main">
                {error && <p className="error-msg" style={{ textAlign: 'center', marginBottom: '1rem' }}>{error}</p>}

                <div className="profile-card">
                    <div className="profile-content">
                        <div className="profile-image-container">
                            <img
                                // *** 2. Use imported image as fallback ***
                                // When editing, show form picture. If empty, show llama.
                                // When viewing, show appUser picture. If empty, show llama.
                                src={
                                    editing
                                      ? (formData.picture || llamaFallbackImage)
                                      : (appUser?.picture || llamaFallbackImage)
                                }
                                alt="Profile"
                                className="profile-pic" // <<< Class for styling
                                // *** 3. Update onError to use imported image ***
                                onError={(e) => { e.target.onerror = null; e.target.src = llamaFallbackImage; }}
                            />
                        </div>
                        <div className="profile-details">
                           {/* ... Rest of the rendering logic (editing/viewing inputs/text) ... */}
                           {editing ? (
                                <>
                                     <label htmlFor="displayName">Display Name</label>
                                     <input id="displayName" type="text" name="displayName" value={formData.displayName} onChange={handleInputChange} placeholder="Your display name" />
                                     <label htmlFor="email">Email</label>
                                     <input id="email" type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="your.email@example.com"/>
                                     <label htmlFor="picture">Profile Picture URL</label>
                                     <input id="picture" type="text" name="picture" value={formData.picture} onChange={handleInputChange} placeholder="http://example.com/image.png" />
                                </>
                            ) : (
                                <>
                                     <h3 className="display-name">{appUser?.displayName || '(No display name)'}</h3>
                                     <p className="username">{appUser?.email || 'Loading...'}</p>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </main>
            <footer className="profile-footer">
                {/* ... Footer buttons ... */}
                <div className="footer-btns">
                     <button className="menu-btn" onClick={handleUpdate} disabled={isLoading}>
                         {editing ? ( <> <BiCheckCircle /> <span>Save Changes</span> </> ) : ( <> <BiPencil /> <span>Update Profile</span> </> )}
                     </button>
                     <button className="menu-btn delete-btn" onClick={handleDelete} disabled={isLoading}>
                         <BiTrash />
                         <span>Delete Account</span>
                     </button>
                 </div>
            </footer>
        </div>
    );
}

export default ProfilePage;