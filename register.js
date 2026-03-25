document.addEventListener('DOMContentLoaded', () => {
    
    // --- Role Card Selection ---
    const roleCards = document.querySelectorAll('.role-card');
    let selectedRole = 'bowler'; // Default selection based on HTML active class
    
    roleCards.forEach(card => {
        card.addEventListener('click', () => {
            // Remove active class from all
            roleCards.forEach(c => c.classList.remove('active'));
            // Add active class to clicked
            card.classList.add('active');
            // Update selected role state
            selectedRole = card.getAttribute('data-role');
            // Hide error if shown
            document.getElementById('roleError').style.display = 'none';
        });
    });

    // --- Password Visibility Toggle ---
    const toggleBtns = document.querySelectorAll('.toggle-password');
    
    toggleBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.previousElementSibling;
            
            if (input.type === 'password') {
                input.type = 'text';
                // Change icon to eye-off
                this.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`;
            } else {
                input.type = 'password';
                // Change icon to eye
                this.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
            }
        });
    });

    // --- Form Submission & Validation ---
    const registerForm = document.getElementById('registerForm');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const formError = document.getElementById('formError');

    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Reset errors
        formError.style.display = 'none';
        formError.textContent = '';
        
        // 1. Check if role is selected (it always is by default, but just in case)
        if (!selectedRole) {
            document.getElementById('roleError').style.display = 'block';
            return;
        }

        // 2. Validate password match
        const pwd = passwordInput.value;
        const confirmPwd = confirmPasswordInput.value;
        
        if (pwd !== confirmPwd) {
            formError.textContent = "Passwords do not match.";
            formError.style.display = 'block';
            return;
        }

        // 3. Validation passed - redirect to respective dashboard
        const submitBtn = document.getElementById('submitBtn');
        submitBtn.textContent = "Creating Account...";
        submitBtn.disabled = true;

        // Simulate network request before redirecting
        setTimeout(() => {
            // Re-direct to something like dashboard_batsman.html
            // Or if we just use dashboard.html with query parameter: dashboard.html?role=batsman
            
            // Following the user prompt: "according to the player role... will build 3 dashboards"
            // We'll assume the 3 dashboards are named: 
            // - dashboard_batsman.html
            // - dashboard_bowler.html
            // - dashboard_allrounder.html
            
            let dashboardURL = `dashboard_${selectedRole}.html`;
            if (selectedRole === 'batsman') {
                dashboardURL = 'dashboard.html';
            }
            
            // Redirecting user
            window.location.href = dashboardURL;
        }, 1000); // 1 second fake delay
        
    });
});
