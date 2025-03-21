function initButtonCharacterStagger() {
  const offsetIncrement = 0.01; // Transition offset increment in seconds
  const buttons = document.querySelectorAll('[data-button-animate-chars]');

  buttons.forEach(button => {
    const text = button.textContent; // Get the button's text content
    button.innerHTML = ''; // Clear the original content

    [...text].forEach((char, index) => {
      const span = document.createElement('span');
      span.textContent = char;
      span.style.transitionDelay = `${index * offsetIncrement}s`;

      // Handle spaces explicitly
      if (char === ' ') {
        span.style.whiteSpace = 'pre'; // Preserve space width
      }

      button.appendChild(span);
    });
  });
}

// Initialize Button Character Stagger Animation
document.addEventListener('DOMContentLoaded', () => {
  initButtonCharacterStagger();
});



document.addEventListener("DOMContentLoaded", () =>{

  gsap.registerPlugin(CustomEase)
  CustomEase.create("button-ease", "0.5, 0.05, 0.05, 0.99")
  
  initMenuButton()
  
})

function initMenuButton() {
  // Select elements
  const menuButton = document.querySelector("[data-menu-button]");
  const lines = document.querySelectorAll(".menu-button-line");
  const [line1, line2, line3] = lines;
  
  // Define one global timeline
  let menuButtonTl = gsap.timeline({
    defaults:{
      overwrite:"auto",
      ease: "button-ease",
      duration: 0.3
    }
  })

  const menuOpen = () => {
    menuButtonTl.clear() // Stop any previous tweens, if any
    .to(line2, { scaleX: 0, opacity: 0 }) // Step 1: Hide middle line
    .to(line1, { x: "-1.3em", opacity: 0 }, "<") // Step 1: Movetop line
    .to(line3, { x: "1.3em", opacity: 0 }, "<") // Step 1: Move bottom line
    .to([line1,line3],{opacity:0, duration: 0.1},"<+=0.2") // Step 2: Quickly fade top and bottom lines
    .set(line1, { rotate: -135, y: "-1.3em", scaleX: 0.9 }) // Step 3: Instantly rotate and scale top line
    .set(line3, { rotate: 135, y: "-1.4em", scaleX: 0.9 }, "<") // Step 3: Instantly rotate and scale bottom line
    .to(line1, { opacity: 1, x: "0em", y: "0.5em"}) // Step 4: Move top line to final position
    .to(line3, { opacity: 1, x: "0em", y: "-0.25em" }, "<+=0.1"); // Step 4: Move bottom line to final position
  }

  const menuClose = () => {
    menuButtonTl.clear() // Stop any previous tweens, if any
    .to([line1, line2, line3], { // Move all lines back in a different animation
      scaleX: 1,
      rotate: 0,
      x: "0em",
      y: "0em",
      opacity: 1,
      duration: 0.45,
      overwrite: "auto",
    })
  }

  // Toggle Animation
  menuButton.addEventListener("click", () => {
    const currentState = menuButton.getAttribute("data-menu-button");

    if (currentState === "burger") {
      menuOpen()
      menuButton.setAttribute("data-menu-button", "close");
    } else {
      menuClose()
      menuButton.setAttribute("data-menu-button", "burger");
    }
  });
}


function initFilterBasic() {
  // Find all filter groups on the page
  const groups = document.querySelectorAll('[data-filter-group]');

  groups.forEach((group) => {
    const buttons = group.querySelectorAll('[data-filter-target]');
    const items = group.querySelectorAll('[data-filter-name]');
    const transitionDelay = 300; // Delay for transition effect (in milliseconds)

    // Function to update the status and accessibility attributes of items
    const updateStatus = (element, shouldBeActive) => {
      // If the item should be active, set it to "active", otherwise "not-active"
      element.setAttribute('data-filter-status', shouldBeActive ? 'active' : 'not-active');
      element.setAttribute('aria-hidden', shouldBeActive ? 'false' : 'true');
    };

    // Function to handle filtering logic when a button is clicked
    const handleFilter = (target) => {
      // Loop through all items and ensure every item transitions out first
      items.forEach((item) => {
        const shouldBeActive = target === 'all' || item.getAttribute('data-filter-name') === target;
        const currentStatus = item.getAttribute('data-filter-status');

        // Only transition items currently visible (status: active)
        if (currentStatus === 'active') {
          item.setAttribute('data-filter-status', 'transition-out');
          // After the transition delay, set the final status
          setTimeout(() => updateStatus(item, shouldBeActive), transitionDelay);
        } else {
          // For items not currently visible, simply update their status after the delay
          setTimeout(() => updateStatus(item, shouldBeActive), transitionDelay);
        }
      });

      // Update the active status for all buttons
      buttons.forEach((button) => {
        const isActive = button.getAttribute('data-filter-target') === target;
        button.setAttribute('data-filter-status', isActive ? 'active' : 'not-active');
        button.setAttribute('aria-pressed', isActive ? 'true' : 'false'); // Accessibility: indicate active state
      });
    };

    // Attach click event listeners to each button
    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        const target = button.getAttribute('data-filter-target');

        // If the button is already active, do nothing
        if (button.getAttribute('data-filter-status') === 'active') return;

        // Trigger the filter logic with the selected target
        handleFilter(target);
      });
    });
  });
}

// Initialize Basic Filter Setup
document.addEventListener('DOMContentLoaded', () => {
  initFilterBasic();
});