import React from 'react';
// Import navigation and location hooks from react-router-dom
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
// Import icons for both back and logout
import { BsBoxArrowRight, BsArrowLeft } from 'react-icons/bs';
import logo from '../../logo.png'; // Adjust path as needed
import '../../styles/Dashboard.css'; // Contains .back-btn and .logout-btn styles

const TopBar = () => {
    const { logout, isAuthenticated } = useAuth0();
    const navigate = useNavigate();
    const location = useLocation(); // Get current location object

    // --- Logout Handler ---
    const handleLogout = async () => {
        try {
            await logout({
                logoutParams: {
                    returnTo: window.location.origin
                }
            });
        } catch (error) {
            console.error("Error during logout:", error);
        }
    };

    // --- Logo Click Handler ---
    const handleLogoClick = () => {
         // Navigate to the main dashboard page or home page when logo is clicked
         if (isAuthenticated) {
             navigate('/dashboard'); // Or your main authenticated route
        } else {
             navigate('/'); // Or your public home/login page
        }
    };

    // --- Back Button Handler ---
    const handleGoBack = () => {
        navigate(-1); // Navigates back one step in history
    };

    // --- Determine if Back Button should be shown ---
    // Example: Don't show on the main dashboard or root path
    // Adjust '/dashboard' if your main authenticated landing page is different
    const pathsWithoutBackButton = ['/dashboard', '/']; // Add any other paths where back button isn't needed
    const showBackButton = isAuthenticated && !pathsWithoutBackButton.includes(location.pathname);

    return (
        <header className="dashboard-header">
            <div className="topbar-container">

                {/* Back Button - Conditionally Rendered */}
                {showBackButton && (
                     <button
                         className="back-btn" // Use class from dashboard.css
                         onClick={handleGoBack}
                         aria-label="Go Back" // For accessibility
                     >
                         <BsArrowLeft />
                     </button>
                )}

                {/* Logo */}
                <img
                    src={logo}
                    alt="App Logo"
                    className="top-logo"
                    onClick={handleLogoClick}
                />

                {/* Logout Button - Conditionally Rendered */}
                {isAuthenticated && (
                    <button
                        className="logout-btn" // Use class from dashboard.css
                        onClick={handleLogout}
                        aria-label="Log Out" // For accessibility
                    >
                        <BsBoxArrowRight />
                    </button>
                )}

            </div>
        </header>
    );
};

export default TopBar;

/*
Explanation of Changes:
1.  **Import `useLocation` and `BsArrowLeft`:** Added the hook to detect the current URL path and the icon for the back button.
2.  **`handleGoBack` Function:** Added a simple handler that uses `Maps(-1)` to go back in the browser's history.
3.  **Conditional Logic (`showBackButton`):**
    * Gets the current `location.pathname`.
    * Defines an array `pathsWithoutBackButton` containing routes where the back button typically shouldn't appear (like the main dashboard or login page). **Adjust this array based on your specific routes.**
    * Sets `showBackButton` to true only if the user is authenticated AND the current path is NOT in the `pathsWithoutBackButton` list.
4.  **Back Button JSX:**
    * Added a `<button>` element.
    * Applied the `className="back-btn"` from your CSS.
    * Set its `onClick` to `handleGoBack`.
    * Included the `<BsArrowLeft />` icon inside it.
    * Added an `aria-label` for accessibility.
    * Wrapped the button JSX in `{showBackButton && ( ... )}` so it only renders when the condition is met.
*/