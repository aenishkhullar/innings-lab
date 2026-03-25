// Wait for DOM to load
document.addEventListener("DOMContentLoaded", () => {
    
    // Register ScrollTrigger if needed later, but we mostly use simple timeline for hero
    // gsap.registerPlugin(ScrollTrigger);

    const tl = gsap.timeline();

    // 1. Initial Intro Animation for Navbar and Hero Text
    tl.from(".navbar .logo, .nav-links li, .nav-buttons", {
        y: -30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out"
    })
    .from(".hero-title", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
    }, "-=0.4")
    .from(".hero-subtitle", {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out"
    }, "-=0.6")
    .from(".btn-primary", {
        scale: 0.9,
        opacity: 0,
        duration: 0.5,
        ease: "back.out(1.5)"
    }, "-=0.4")
    // 2. Laptop Mockup Entrance Animation
    .from(".laptop-wrapper", {
        y: 80,
        opacity: 0,
        rotateX: 15, // slight 3D rotate entrance
        transformPerspective: 1000,
        duration: 1.2,
        ease: "power3.out"
    }, "-=0.2")
    // 3. UI elements inside the laptop entrance
    .from(".ui-sidebar", {
        x: -30,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out"
    }, "-=0.6")
    .from(".ui-header, .ui-welcome", {
        y: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.2,
        ease: "power2.out"
    }, "-=0.4")
    .from(".feature-card", {
        y: 40,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: "back.out(1.2)"
    }, "-=0.2")
    .from(".ui-footer", {
        opacity: 0,
        y: 10,
        duration: 0.4
    }, "-=0.2");

    // 4. Floating Laptop Effect (Continuous)
    // Run this independently from the main timeline so it loops nicely
    gsap.to(".laptop-wrapper", {
        y: -15,   // Move up 15px
        duration: 2.5,
        repeat: -1, // Infinite loop
        yoyo: true, // Go back and forth
        ease: "sine.inOut",
        delay: 2 // Start after intro animation completely finishes
    });

    // 5. Glow Pulse Effect
    gsap.to(".glow-bg", {
        opacity: 0.7,
        scale: 1.05,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });
});
