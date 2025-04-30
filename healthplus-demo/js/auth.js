/**
 * HealthPlus Demo Authentication System
 * This is a client-side authentication system for demo purposes only.
 * In a real application, authentication would be handled server-side.
 */

// Sample Users
const sampleUsers = [
    {
        firstName: 'Demo',
        lastName: 'User',
        email: 'demo@healthplus.com',
        phone: '(555) 123-4567',
        password: 'Demo123!', // In a real app, passwords would be hashed
        plan: 'Complete Care Family Plan',
        memberId: 'HP12345678',
        prescriptions: [
            {
                name: 'Lisinopril 10mg Tablets',
                rxNumber: 'RX12345678',
                doctor: 'Dr. Sarah Johnson',
                lastFilled: 'March 15, 2025',
                refillsRemaining: 3,
                price: 10.00,
                instructions: 'Take one tablet daily'
            },
            {
                name: 'Atorvastatin 20mg Tablets',
                rxNumber: 'RX87654321',
                doctor: 'Dr. Michael Chen',
                lastFilled: 'April 2, 2025',
                refillsRemaining: 2,
                price: 15.00,
                instructions: 'Take one tablet daily in the evening'
            },
            {
                name: 'Metformin 500mg Tablets',
                rxNumber: 'RX23456789',
                doctor: 'Dr. Sarah Johnson',
                lastFilled: 'February 20, 2025',
                refillsRemaining: 5,
                price: 8.50,
                instructions: 'Take one tablet twice daily with meals'
            }
        ]
    },
    {
        firstName: 'John',
        lastName: 'Smith',
        email: 'john@example.com',
        phone: '(555) 987-6543',
        password: 'Password1!',
        plan: 'Essential Care Individual Plan',
        memberId: 'HP87654321',
        prescriptions: [
            {
                name: 'Levothyroxine 75mcg Tablets',
                rxNumber: 'RX34567890',
                doctor: 'Dr. Emily Patel',
                lastFilled: 'March 30, 2025',
                refillsRemaining: 4,
                price: 12.75,
                instructions: 'Take one tablet daily on an empty stomach'
            }
        ]
    }
];

// Initialize users in localStorage if not already present
if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify(sampleUsers));
}

// Initialize current user session
if (!sessionStorage.getItem('currentUser') && localStorage.getItem('rememberedUser')) {
    sessionStorage.setItem('currentUser', localStorage.getItem('rememberedUser'));
}

// Update UI based on authentication state
document.addEventListener('DOMContentLoaded', function() {
    updateAuthUI();
});

/**
 * Register a new user
 * @param {string} firstName - User's first name
 * @param {string} lastName - User's last name
 * @param {string} email - User's email address
 * @param {string} phone - User's phone number
 * @param {string} password - User's password
 */
function register(firstName, lastName, email, phone, password) {
    // Get existing users
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Check if email already exists
    const existingUser = users.find(user => user.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
        document.getElementById('register-error').textContent = 'An account with this email already exists.';
        return;
    }
    
    // Create new user object
    const newUser = {
        firstName,
        lastName,
        email,
        phone,
        password,
        plan: 'No plan selected',
        memberId: generateMemberId(),
        prescriptions: [] // New users start with no prescriptions
    };
    
    // Add user to users array
    users.push(newUser);
    
    // Save users to localStorage
    localStorage.setItem('users', JSON.stringify(users));
    
    // Log in the new user
    sessionStorage.setItem('currentUser', JSON.stringify(newUser));
    
    // Show success message and redirect
    alert('Account created successfully! You are now logged in.');
    window.location.href = 'index.html';
}

/**
 * Log in a user
 * @param {string} email - User's email address
 * @param {string} password - User's password
 * @param {boolean} remember - Whether to remember the user
 */
function login(email, password, remember = false) {
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Find user by email
    const user = users.find(user => user.email.toLowerCase() === email.toLowerCase());
    
    // Check if user exists and password matches
    if (!user || user.password !== password) {
        document.getElementById('login-error').textContent = 'Invalid email or password.';
        return;
    }
    
    // Save current user to sessionStorage
    sessionStorage.setItem('currentUser', JSON.stringify(user));
    
    // If remember me is checked, save to localStorage
    if (remember) {
        localStorage.setItem('rememberedUser', JSON.stringify(user));
    }
    
    // Redirect to home page or intended destination
    const redirectUrl = sessionStorage.getItem('redirectAfterLogin') || 'index.html';
    sessionStorage.removeItem('redirectAfterLogin');
    window.location.href = redirectUrl;
}

/**
 * Log out the current user
 */
function logout() {
    // Clear session storage
    sessionStorage.removeItem('currentUser');
    
    // Clear remembered user
    localStorage.removeItem('rememberedUser');
    
    // Redirect to home page
    window.location.href = 'index.html';
}

/**
 * Check if user is logged in
 * @returns {boolean} Whether a user is logged in
 */
function isLoggedIn() {
    return !!sessionStorage.getItem('currentUser');
}

/**
 * Get the current logged in user
 * @returns {Object|null} The current user or null if not logged in
 */
function getCurrentUser() {
    const userJson = sessionStorage.getItem('currentUser');
    return userJson ? JSON.parse(userJson) : null;
}

/**
 * Update the UI based on authentication state
 */
function updateAuthUI() {
    const authButtons = document.querySelector('header .buttons');
    if (!authButtons) return;
    
    if (isLoggedIn()) {
        // User is logged in, show user menu
        const user = getCurrentUser();
        authButtons.innerHTML = `
            <div class="user-menu">
                <button class="btn btn-outline user-button">
                    <i class="fas fa-user"></i> ${user.firstName} ${user.lastName}
                </button>
                <div class="user-dropdown">
                    <a href="dashboard.html"><i class="fas fa-tachometer-alt"></i> Dashboard</a>
                    <a href="profile.html"><i class="fas fa-user-circle"></i> My Profile</a>
                    <a href="refill.html"><i class="fas fa-prescription-bottle-alt"></i> My Prescriptions</a>
                    <a href="#" onclick="logout(); return false;"><i class="fas fa-sign-out-alt"></i> Sign Out</a>
                </div>
            </div>
            <div class="cart-icon">
                <a href="#" id="cart-button"><i class="fas fa-shopping-cart"></i> <span id="cart-count">0</span></a>
            </div>
        `;
        
        // Add event listener for user dropdown
        const userButton = document.querySelector('.user-button');
        const userDropdown = document.querySelector('.user-dropdown');
        
        if (userButton && userDropdown) {
            userButton.addEventListener('click', function() {
                userDropdown.classList.toggle('active');
            });
            
            // Close dropdown when clicking outside
            document.addEventListener('click', function(event) {
                if (!userButton.contains(event.target) && !userDropdown.contains(event.target)) {
                    userDropdown.classList.remove('active');
                }
            });
        }
    } else {
        // User is not logged in, show login/register buttons
        authButtons.innerHTML = `
            <a href="login.html" class="btn btn-outline">Sign In</a>
            <a href="register.html" class="btn btn-primary">Register</a>
            <div class="cart-icon">
                <a href="#" id="cart-button"><i class="fas fa-shopping-cart"></i> <span id="cart-count">0</span></a>
            </div>
        `;
    }
}

/**
 * Require login to access a page
 * If user is not logged in, redirect to login page
 */
function requireLogin() {
    if (!isLoggedIn()) {
        // Save current page to redirect back after login
        sessionStorage.setItem('redirectAfterLogin', window.location.href);
        // Redirect to login page
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

/**
 * Generate a random member ID
 * @returns {string} A randomly generated member ID
 */
function generateMemberId() {
    return 'HP' + Math.floor(10000000 + Math.random() * 90000000);
}

/**
 * Get user prescriptions
 * @returns {Array} An array of user prescriptions or empty array if not logged in
 */
function getUserPrescriptions() {
    const user = getCurrentUser();
    return user ? user.prescriptions : [];
}

/**
 * Save updated user data
 * @param {Object} userData - Updated user data
 */
function updateUserData(userData) {
    // Update in sessionStorage
    sessionStorage.setItem('currentUser', JSON.stringify(userData));
    
    // Update in localStorage too if user is remembered
    if (localStorage.getItem('rememberedUser')) {
        localStorage.setItem('rememberedUser', JSON.stringify(userData));
    }
    
    // Update in users array
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(user => user.email === userData.email);
    
    if (userIndex !== -1) {
        users[userIndex] = userData;
        localStorage.setItem('users', JSON.stringify(users));
    }
}