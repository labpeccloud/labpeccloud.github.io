// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle functionality (for responsive design)
    setupMobileMenu();
    
    // Plan finder form submission
    setupPlanFinder();
    
    // Smooth scrolling for anchor links
    setupSmoothScrolling();
    
    // Add active class to current page in navigation
    highlightCurrentPage();
});

// Function to set up mobile menu toggle
function setupMobileMenu() {
    // This would be implemented with actual mobile menu elements
    // For the demo, we're just adding a placeholder function
    console.log('Mobile menu functionality would be implemented here');
}

// Function to handle plan finder form submission
function setupPlanFinder() {
    const planFinderForm = document.querySelector('.finder-form form');
    
    if (planFinderForm) {
        planFinderForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Get form values
            const planType = document.getElementById('plan-type').value;
            const zipCode = document.getElementById('zip-code').value;
            
            // Validate zip code (simple 5-digit check)
            if (!/^\d{5}$/.test(zipCode)) {
                alert('Please enter a valid 5-digit ZIP code.');
                return;
            }
            
            // In a real application, this would send the data to a server
            // For the demo, we'll just show an alert
            alert(`Searching for ${planType} plans in ZIP code ${zipCode}. In a real application, this would show search results.`);
            
            // You could redirect to a results page like this:
            // window.location.href = `plans-results.html?type=${planType}&zip=${zipCode}`;
        });
    }
}

// Function to implement smooth scrolling for anchor links
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Function to highlight the current page in navigation
function highlightCurrentPage() {
    const currentPage = window.location.pathname.split('/').pop();
    
    document.querySelectorAll('nav ul li a').forEach(link => {
        const linkHref = link.getAttribute('href');
        
        if (linkHref === currentPage || 
            (currentPage === '' && linkHref === 'index.html')) {
            link.classList.add('active');
        }
    });
}

// Functions for a more complete site (these would be implemented in a real application)

// Function to handle user login
function handleLogin(email, password) {
    // This would authenticate with a server in a real application
    console.log(`Login attempt with email: ${email}`);
    return false; // Demo always fails login
}

// Function to handle user registration
function handleRegistration(userData) {
    // This would send registration data to a server in a real application
    console.log('Registration attempt with data:', userData);
    return false; // Demo always fails registration
}

// Function to load plan details
function loadPlanDetails(planId) {
    // This would fetch plan details from a server in a real application
    console.log(`Loading details for plan ID: ${planId}`);
    
    // Mock data for demo purposes
    return {
        name: 'Complete Care',
        price: 299,
        coverage: 'Comprehensive',
        deductible: 1000,
        features: [
            'Primary & specialist visits',
            'Enhanced preventive care',
            'Full emergency coverage',
            'Comprehensive prescription plan',
            'Mental health services'
        ]
    };
}

// Function to display a modal dialog
function showModal(title, content) {
    // Create modal elements
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    
    const modalContainer = document.createElement('div');
    modalContainer.className = 'modal-container';
    
    const modalHeader = document.createElement('div');
    modalHeader.className = 'modal-header';
    
    const modalTitle = document.createElement('h3');
    modalTitle.textContent = title;
    
    const closeButton = document.createElement('button');
    closeButton.className = 'modal-close';
    closeButton.innerHTML = '&times;';
    
    // Close modal when the button is clicked
    closeButton.addEventListener('click', function() {
        document.body.removeChild(modalOverlay);
    });
    
    // Assemble modal elements
    modalHeader.appendChild(modalTitle);
    modalHeader.appendChild(closeButton);
    
    const modalBody = document.createElement('div');
    modalBody.className = 'modal-body';
    modalBody.innerHTML = content;
    
    modalContainer.appendChild(modalHeader);
    modalContainer.appendChild(modalBody);
    modalOverlay.appendChild(modalContainer);
    
    // Add modal to the body
    document.body.appendChild(modalOverlay);
    
    // Also close when clicking outside the modal
    modalOverlay.addEventListener('click', function(event) {
        if (event.target === modalOverlay) {
            document.body.removeChild(modalOverlay);
        }
    });
}

// Function to set up dropdown menu functionality
function setupDropdownMenus() {
    const dropdowns = document.querySelectorAll('nav ul li.dropdown');
    
    // Add click event to each dropdown toggle
    dropdowns.forEach(dropdown => {
        const dropdownToggle = dropdown.querySelector('.dropdown-toggle');
        
        // Toggle dropdown on click
        dropdownToggle.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent navigating to the main category page
            
            // Close all other dropdowns
            dropdowns.forEach(item => {
                if (item !== dropdown && item.classList.contains('active')) {
                    item.classList.remove('active');
                }
            });
            
            // Toggle current dropdown
            dropdown.classList.toggle('active');
        });
    });
    
    // Close dropdown when clicking outside of nav
    document.addEventListener('click', function(e) {
        if (!e.target.closest('nav')) {
            dropdowns.forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        }
    });
    
    // For desktop, add optional hover functionality (activate if needed)
    if (window.innerWidth >= 768) {
        dropdowns.forEach(dropdown => {
            // Uncomment these lines if you want hover behavior instead of click on desktop
            /*
            dropdown.addEventListener('mouseenter', function() {
                this.classList.add('active');
            });
            
            dropdown.addEventListener('mouseleave', function() {
                this.classList.remove('active');
            });
            */
        });
    }
}

// Update the DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle functionality (for responsive design)
    setupMobileMenu();
    
    // Plan finder form submission
    setupPlanFinder();
    
    // Smooth scrolling for anchor links
    setupSmoothScrolling();
    
    // Add active class to current page in navigation
    highlightCurrentPage();
    
    // Add dropdown menu functionality
    setupDropdownMenus();
});
