
//---------------------preloader----------------
document.addEventListener("DOMContentLoaded", () => {
    const preloaderElement = document.getElementById("preloader");
    
    // 1. Immediately block body scrolls when layout parsing starts
    document.body.classList.add("preloader-lock");

    // 2. Clear window overlay track once assets (css, fonts, sub-images) are compiled
    window.addEventListener("load", () => {
        // Short 500ms safety hold so your loader graphic loop plays at least once cleanly
        setTimeout(() => {
            
            // Initiate the upward sliding animation transition
            preloaderElement.classList.add("slide-up-exit");
            
            // 3. Reinstate page scrollbars as soon as the slide animation concludes
            setTimeout(() => {
                document.body.classList.remove("preloader-lock");
                preloaderElement.remove(); // Unloads layout nodes to preserve browser memory
            }, 800); // Synchronized to match the 0.8s CSS exit transition time precisely
            
        }, 500);
    });
});


// --------Main Nav Javascript---------------
document.addEventListener("DOMContentLoaded", function () {
    const openBtn = document.getElementById("openMobileSearch");
    const closeBtn = document.getElementById("closeMobileSearch");
    const popup = document.getElementById("mobileSearchPopup");
    
    if (openBtn && closeBtn && popup) {
        // Open Popup & immediately focus the text field for fast user entry
        openBtn.addEventListener("click", function () {
            popup.classList.add("active");
            popup.setAttribute("aria-hidden", "false");
            
            // Short timeout gives the transition window time to finish sliding in first
            setTimeout(() => {
                popup.querySelector(".search-input").focus();
            }, 1500); 
        });

        // Close Popup handler
        function closePopup() {
            popup.classList.remove("active");
            popup.setAttribute("aria-hidden", "true");
        }

        closeBtn.addEventListener("click", closePopup);

        // Close popup instantly if user clicks outside the clear container background blur
        popup.addEventListener("click", function (e) {
            if (e.target === popup) closePopup();
        });
    }
});

// ---------------Bottom-nav-----------------
document.addEventListener("DOMContentLoaded", function () {
    const openMenuBtn = document.getElementById("openMobileMenu");
    const closeMenuBtn = document.getElementById("closeMobileMenu");
    const backdropCloseTrigger = document.getElementById("sidebarBackdrop");
    const drawerWrapper = document.getElementById("mobileSidebarDrawer");

    if (openMenuBtn && closeMenuBtn && drawerWrapper && backdropCloseTrigger) {
        
        // Open Navigation Drawer
        openMenuBtn.addEventListener("click", function () {
            drawerWrapper.classList.add("drawer-active");
            drawerWrapper.setAttribute("aria-hidden", "false");
            // Prevent background page body layout from scrolling behind the open drawer panel
            document.body.style.overflow = "hidden"; 
        });

        // Close Navigation Drawer Handler
        function closeDrawerMenu() {
            drawerWrapper.classList.remove("drawer-active");
            drawerWrapper.setAttribute("aria-hidden", "true");
            document.body.style.overflow = ""; // Re-unlock background body page scrolling
        }

        closeMenuBtn.addEventListener("click", closeDrawerMenu);
        backdropCloseTrigger.addEventListener("click", closeDrawerMenu);
    }
});



//-------------------scroll to top button----------------
document.addEventListener("DOMContentLoaded", () => {
    const scrollTopBtn = document.getElementById("scrollTopBtn");
    const progressCircle = document.querySelector(".circle-progress");
    
    // Updated circumference to match new CSS stroke-dasharray properties
    const circumference = 138.23; 

    function updateScrollProgress() {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        
        if (docHeight <= 0) return;

        const scrollPercent = scrollTop / docHeight;
        const offset = circumference - (scrollPercent * circumference);
        progressCircle.style.strokeDashoffset = offset;

        // Reveals the floating action trigger once page moves 180px down
        if (scrollTop > 180) {
            scrollTopBtn.classList.add("is-visible");
        } else {
            scrollTopBtn.classList.remove("is-visible");
        }
    }

    // Standard core window positioning animator click engine 
    scrollTopBtn.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });

    window.addEventListener("scroll", updateScrollProgress, { passive: true });
    updateScrollProgress(); // Initial validation execution kick off
});


//--------Hero section slider----------------
document.addEventListener("DOMContentLoaded", () => {
    const slides = document.querySelectorAll(".slide-img");
    const nextBtn = document.getElementById("heroNextBtn");
    const prevBtn = document.getElementById("heroPrevBtn");
    
    let currentIndex = 0;
    const slideIntervalTime = 3500; // Time per slide in milliseconds (4 seconds)
    let sliderTimer;

    // Changes slide index allocations safely
    function changeSlide(nextIndex) {
        // Remove active state from current image (initiates opacity decrease)
        slides[currentIndex].classList.remove("active");
        
        // Update index pointer
        currentIndex = nextIndex;
        
        // Add active state to next image (initiates opacity increase)
        slides[currentIndex].classList.add("active");
    }

    function nextSlide() {
        // Safe loop boundary check: goes back to 0 if at the end
        const nextIndex = (currentIndex + 1) % slides.length;
        changeSlide(nextIndex);
    }

    function prevSlide() {
        // Safe loop boundary check: goes to last item if at 0
        const nextIndex = (currentIndex - 1 + slides.length) % slides.length;
        changeSlide(nextIndex);
    }

    // Interval controller logic
    function startAutoSlider() {
        sliderTimer = setInterval(nextSlide, slideIntervalTime);
    }

    function resetAutoSlider() {
        clearInterval(sliderTimer);
        startAutoSlider(); // Restarts timer fresh after manual button interaction
    }

    // Attach Event Listeners to Nav Buttons
    nextBtn.addEventListener("click", () => {
        nextSlide();
        resetAutoSlider();
    });

    prevBtn.addEventListener("click", () => {
        prevSlide();
        resetAutoSlider();
    });

    // Initialize Timer Loop on Load
    if (slides.length > 0) {
        startAutoSlider();
    }
});


// -------category section-----------
document.addEventListener("DOMContentLoaded", function () {
    const track = document.querySelector(".slider-track");
    
    if (track) {
        // Event Delegation: Listens for clicks on any category item inside the moving track
        track.addEventListener("click", function (event) {
            // Find the closest parent card with the '.category-item' class
            const selectedItem = event.target.closest(".category-item");
            
            if (selectedItem) {
                // 1. Remove the selection highlight class from all other items
                const allItems = track.querySelectorAll(".category-item");
                allItems.forEach(item => item.classList.remove("active-selection"));
                
                // 2. FIXED: Add the highlight class to the clicked item cleanly
                selectedItem.classList.add("active-selection");
                
                // 3. Log data to the console
                const categoryName = selectedItem.querySelector(".category-name").textContent;
                console.log("User selected item: " + categoryName);
            }
        });
    }
});



// -------flash sale section slider-----------
document.addEventListener("DOMContentLoaded", () => {
    const track = document.querySelector(".flash-track");
    const viewport = document.querySelector(".flash-slider-viewport");
    const prevBtn = document.getElementById("flashPrevBtn");
    const nextBtn = document.getElementById("flashNextBtn");
    
    const originalCards = Array.from(track.children);
    const totalOriginals = originalCards.length;
    
    // 1. Programmatically clone elements to make a flawless infinite track loop
    originalCards.forEach(card => {
        const cloneBefore = card.cloneNode(true);
        const cloneAfter = card.cloneNode(true);
        track.insertBefore(cloneBefore, track.firstChild);
        track.appendChild(cloneAfter);
    });

    // Adjust working pointers following duplication adjustments
    const allCards = Array.from(track.children);
    let currentIndex = totalOriginals; // Begin right at the original set start line
    const autoIntervalTime = 2500; // Step timer (3.5 seconds)
    let autoTimer;
    let isTransitioning = false;

    function getStepSize() {
        const singleCard = document.querySelector(".product-card");
        if (!singleCard) return 269;
        const gap = parseFloat(window.getComputedStyle(track).gap) || 24;
        return singleCard.offsetWidth + gap;
    }

    function updateSlider(animate = true) {
        const stepSize = getStepSize();
        
        if (animate) {
            track.style.transition = "transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)";
        } else {
            track.style.transition = "none";
        }
        
        track.style.transform = `translate3d(${-currentIndex * stepSize}px, 0, 0)`;
        updateHighlights();
    }

    function updateHighlights() {
        allCards.forEach(card => card.classList.remove("is-highlighted"));
        
        // Highlight card 3 relative to layout center focus rows
        const activeCenterTarget = currentIndex + 2;
        if (allCards[activeCenterTarget]) {
            allCards[activeCenterTarget].classList.add("is-highlighted");
        }
    }

    function handleNext() {
        if (isTransitioning) return;
        isTransitioning = true;
        currentIndex++;
        updateSlider(true);
        
        // Wrap checks loop logic
        setTimeout(() => {
            if (currentIndex >= totalOriginals * 2) {
                currentIndex = totalOriginals;
                updateSlider(false); // Seamless snap backwards
            }
            isTransitioning = false;
        }, 600);
    }

    function handlePrev() {
        if (isTransitioning) return;
        isTransitioning = true;
        currentIndex--;
        updateSlider(true);
        
        // Wrap checks loop logic
        setTimeout(() => {
            if (currentIndex < totalOriginals) {
                currentIndex = (totalOriginals * 2) - 1;
                updateSlider(false); // Seamless snap forward
            }
            isTransitioning = false;
        }, 600);
    }

    // Interval timers initialization configurations
    function startLoop() {
        autoTimer = setInterval(handleNext, autoIntervalTime);
    }

    function resetLoop() {
        clearInterval(autoTimer);
        startLoop();
    }

    // Bind navigation listeners to arrows
    nextBtn.addEventListener("click", () => {
        handleNext();
        resetLoop();
    });

    prevBtn.addEventListener("click", () => {
        handlePrev();
        resetLoop();
    });

    viewport.addEventListener("mouseenter", () => clearInterval(autoTimer));
    viewport.addEventListener("mouseleave", startLoop);
    window.addEventListener("resize", () => updateSlider(false));

    // Run layout startup positions
    updateSlider(false);
    startLoop();
});


// --------hot deal sell-------
document.addEventListener("DOMContentLoaded", () => {
    const track = document.querySelector(".hd-track");
    const viewport = document.querySelector(".hd-slider-viewport");
    const prevBtn = document.querySelector(".hd-prev"); // Matches your arrow button classes
    const nextBtn = document.querySelector(".hd-next");
    
    if (!track || !viewport || !prevBtn || !nextBtn) return;

    const originalCards = Array.from(track.children);
    const totalOriginals = originalCards.length;
    
    if (totalOriginals === 0) return;

    // 1. Programmatically clone elements to make a flawless infinite track loop
    // Clones elements to both sides so scrolling backwards from index 0 doesn't show blank space
    originalCards.forEach(card => {
        const cloneBefore = card.cloneNode(true);
        const cloneAfter = card.cloneNode(true);
        track.insertBefore(cloneBefore, track.firstChild);
        track.appendChild(cloneAfter);
    });

    // Adjust working pointers following duplication adjustments
    const allCards = Array.from(track.children);
    let currentIndex = totalOriginals; // Begin right at the start line of the original set
    const autoIntervalTime = 3000; // Step timer matches your CSS transition breathing room
    let autoTimer;
    let isTransitioning = false;

    // 2. Measure dimensions dynamically based on your explicit CSS layout
    function getStepSize() {
        const singleCard = track.querySelector(".hd-product-card");
        if (!singleCard) return 246; // Fallback: 234px width + 12px gap
        
        // Exact measurement including precise sub-pixels
        const cardWidth = singleCard.getBoundingClientRect().width;
        const gap = parseFloat(window.getComputedStyle(track).gap) || 0;
        return cardWidth + gap;
    }

    // 3. Move slider track via hardware-accelerated 3D transforms
    function updateSlider(animate = true) {
        const stepSize = getStepSize();
        if (animate) {
            track.style.transition = "transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)";
        } else {
            track.style.transition = "none";
        }
        track.style.transform = `translate3d(${-currentIndex * stepSize}px, 0, 0)`;
    }

    // 4. Navigation Event Handlers with seamless boundary snapping
    function handleNext() {
        if (isTransitioning) return;
        isTransitioning = true;
        currentIndex++;
        updateSlider(true);

        // Seamless snap backwards once reaching the end of the cloned set
        setTimeout(() => {
            if (currentIndex >= totalOriginals * 2) {
                currentIndex = totalOriginals;
                updateSlider(false); 
            }
            isTransitioning = false;
        }, 500); // Timeline syncs perfectly with 0.5s CSS transition
    }

    function handlePrev() {
        if (isTransitioning) return;
        isTransitioning = true;
        currentIndex--;
        updateSlider(true);

        // Seamless snap forward once dipping below the original set threshold
        setTimeout(() => {
            if (currentIndex < totalOriginals) {
                currentIndex = (totalOriginals * 2) - 1;
                updateSlider(false);
            }
            isTransitioning = false;
        }, 500);
    }

    // 5. Automation loop systems configurations
    function startLoop() {
        autoTimer = setInterval(handleNext, autoIntervalTime);
    }

    function resetLoop() {
        clearInterval(autoTimer);
        startLoop();
    }

    // Bind navigation listeners to structural UI layout arrows
    nextBtn.addEventListener("click", () => {
        handleNext();
        resetLoop();
    });

    prevBtn.addEventListener("click", () => {
        handlePrev();
        resetLoop();
    });

    // Temporary pause on viewport mouse hover entries
    viewport.addEventListener("mouseenter", () => clearInterval(autoTimer));
    viewport.addEventListener("mouseleave", startLoop);

    // Re-initialize tracking metrics seamlessly on responsive window resizing
    window.addEventListener("resize", () => updateSlider(false));

    // Run layout startup placement routines
    updateSlider(false);
    startLoop();
});


// -------dashboard-products-section-----------


// -----Shop By Brands----------
window.onload = function () {
    const track = document.querySelector(".bc-track");
    const nextBtn = document.querySelector(".bc-next");
    const prevBtn = document.querySelector(".bc-prev");
    
    if (!track || !nextBtn || !prevBtn) return;

    // 1. Clone cards to build a seamless infinite loop track structure
    const originalCards = Array.from(track.children);
    originalCards.forEach(card => {
        const clone = card.cloneNode(true);
        track.appendChild(clone);
    });

    let currentIndex = 0;
    let autoPlayTimer = null;
    let isPermanentlyStopped = false;
    let step = 0;
    let maxCardsCount = originalCards.length;

    // Calculate dynamic layout width metrics 
    function calculateMetrics() {
        const firstCard = track.querySelector(".bc-brand-card");
        if (!firstCard) return;
        
        const cardWidth = firstCard.getBoundingClientRect().width;
        const gap = parseInt(window.getComputedStyle(track).gap) || 0;
        step = cardWidth + gap;
    }

    // Move track function
    function moveSlider() {
        track.style.transition = "transform 0.5s ease-in-out";
        const targetX = -(currentIndex * step);
        track.style.transform = `translateX(${targetX}px)`;
    }

    // Handle seamless jumps invisibly in the background
    function handleTransitionEnd() {
        if (currentIndex >= maxCardsCount) {
            track.style.transition = "none";
            currentIndex = 0;
            track.style.transform = `translateX(0px)`;
        } else if (currentIndex < 0) {
            track.style.transition = "none";
            currentIndex = maxCardsCount - 1;
            track.style.transform = `translateX(${-currentIndex * step}px)`;
        }
    }

    track.addEventListener("transitionend", handleTransitionEnd);

    // 2. Start-and-Stop Automatic Loop Logic
    function startAutoLoop() {
        if (isPermanentlyStopped) return;

        autoPlayTimer = setInterval(() => {
            currentIndex++;
            moveSlider();
        }, 3000); // Transitions to next group every 3 seconds
    }

    function killAutoLoop() {
        clearInterval(autoPlayTimer);
        isPermanentlyStopped = true;
    }

    // 3. Arrow Click Handlers (Kills automatic loop permanently)
    nextBtn.addEventListener("click", () => {
        killAutoLoop();
        
        if (currentIndex >= maxCardsCount) {
            track.style.transition = "none";
            currentIndex = 0;
            track.style.transform = `translateX(0px)`;
            track.offsetHeight; // Force layout engines to recalculate metrics
        }
        
        currentIndex++;
        moveSlider();
    });

    prevBtn.addEventListener("click", () => {
        killAutoLoop();
        
        if (currentIndex <= 0) {
            track.style.transition = "none";
            currentIndex = maxCardsCount;
            track.style.transform = `translateX(${-currentIndex * step}px)`;
            track.offsetHeight; // Force layout engines to recalculate metrics
        }
        
        currentIndex--;
        moveSlider();
    });

    // Pause cycling temporarily on cursor focus hover states
    track.addEventListener("mouseenter", () => {
        if (!isPermanentlyStopped) clearInterval(autoPlayTimer);
    });
    track.addEventListener("mouseleave", () => {
        if (!isPermanentlyStopped) startAutoLoop();
    });

    // Handle viewport changes fluidly
    window.addEventListener("resize", () => {
        calculateMetrics();
        track.style.transition = "none";
        track.style.transform = `translateX(${-currentIndex * step}px)`;
    });

    // Initial load system activation entries
    calculateMetrics();
    startAutoLoop();
};

