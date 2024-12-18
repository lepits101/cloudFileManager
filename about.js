document.addEventListener('DOMContentLoaded', () => {
    // Get all the steps
    const steps = document.querySelectorAll('.step');
    
    steps.forEach(step => {
        // Add click event listener for each step
        step.addEventListener('click', () => {
            const stepInfo = step.querySelector('.step-info');
            
            // Toggle the open class to animate the dropdown
            if (stepInfo.classList.contains('open')) {
                stepInfo.classList.remove('open'); // Close the step info
            } else {
                stepInfo.classList.add('open'); // Open the step info
            }
        });
    });
});
