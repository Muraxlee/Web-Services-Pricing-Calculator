document.addEventListener('DOMContentLoaded', function() {
    // Variables to store selected options
    let selectedPrimaryServices = [];
    let selectedSocialServices = [];
    let selectedAddons = [];
    let additionalPagesPrice = 0;
    let timelinePrice = 0;
    let seoPrice = 0;
    let maintenancePrice = 0;
    
    // Service details
    const serviceDetails = {
        'static-website': {
            name: 'Static Website',
            price: 14999,
            timeline: {
                standard: "2-3 weeks",
                express: "1-2 weeks"
            },
            includedPages: 5,
            isRecurring: false,
            category: 'primary'
        },
        'dynamic-website': {
            name: 'Dynamic Website',
            price: 34999,
            timeline: {
                standard: "2-4 weeks",
                express: "1-2 weeks"
            },
            includedPages: 7,
            isRecurring: false,
            category: 'primary'
        },
        'ecommerce-website': {
            name: 'E-commerce Website',
            price: 24999,
            timeline: {
                standard: "2-3 weeks",
                express: "1-2 weeks"
            },
            includedPages: 10,
            isRecurring: false,
            category: 'primary'
        },
        'web-app': {
            name: 'Web Application Development',
            price: 49999,
            timeline: {
                standard: "4-6 weeks",
                express: "2-3 weeks"
            },
            includedPages: 0, // No included pages for web app
            isRecurring: false,
            category: 'primary'
        },
        'social-media': {
            name: 'Social Media Handling',
            price: 19999,
            timeline: {
                standard: "Monthly service",
                express: "Monthly service"
            },
            includedPages: 0, // No included pages for social media
            isRecurring: true,
            category: 'social'
        },
        'social-ads': {
            name: 'Social Media Ads',
            price: 14999,
            timeline: {
                standard: "Monthly service",
                express: "Monthly service"
            },
            includedPages: 0,
            isRecurring: true,
            category: 'social'
        }
    };
    
    // Additional time for services (in weeks)
    const addonTimeAdditions = {
        'ai-agent': 1,
        '3d-video': 2,
        'ad-videos': 1.5, // 1-2 weeks
        'vfx': 1
    };
    
    // Primary service selection
    const serviceCards = document.querySelectorAll('.service-card');
    const standardTimelineOption = document.getElementById('standard-timeline');
    const timelineNote = document.getElementById('timeline-note');
    
    serviceCards.forEach(card => {
        card.addEventListener('click', function() {
            const serviceId = this.id;
            const serviceCategory = serviceDetails[serviceId].category;
            
            // Toggle selection
            if (this.classList.contains('selected')) {
                // Remove from selected services
                this.classList.remove('selected');
                
                if (serviceCategory === 'primary') {
                    selectedPrimaryServices = selectedPrimaryServices.filter(id => id !== serviceId);
                } else if (serviceCategory === 'social') {
                    selectedSocialServices = selectedSocialServices.filter(id => id !== serviceId);
                }
            } else {
                // Add to selected services
                this.classList.add('selected');
                
                if (serviceCategory === 'primary') {
                    selectedPrimaryServices.push(serviceId);
                } else if (serviceCategory === 'social') {
                    selectedSocialServices.push(serviceId);
                }
            }
            
            // Update timeline options based on selected services
            updateTimelineOptions();
        });
    });
    
    function updateTimelineOptions() {
        // Find the service with the longest timeline for standard option
        let longestStandardTimeline = "Standard Timeline";
        
        if (selectedPrimaryServices.length > 0) {
            // Get the first website type service (if any)
            const websiteServices = selectedPrimaryServices.filter(service => 
                ['static-website', 'dynamic-website', 'ecommerce-website', 'web-app'].includes(service));
            
            if (websiteServices.length > 0) {
                const primaryService = websiteServices[0];
                longestStandardTimeline = `Standard (${serviceDetails[primaryService].timeline.standard})`;
                timelineNote.textContent = `Express: ${serviceDetails[primaryService].timeline.express} (+₹9,999)`;
            } else {
                timelineNote.textContent = "Select a website type to see timeline options";
            }
        } else {
            timelineNote.textContent = "Select a website type to see timeline options";
        }
        
        standardTimelineOption.textContent = longestStandardTimeline;
    }
    
    // Addon selection
    const addonCheckboxes = document.querySelectorAll('.addon-checkbox');
    addonCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                selectedAddons.push(this.id);
            } else {
                selectedAddons = selectedAddons.filter(addon => addon !== this.id);
            }
        });
    });
    
    // Page count controls
    const pageCountInput = document.getElementById('page-count');
    const decreaseBtn = document.getElementById('decrease-pages');
    const increaseBtn = document.getElementById('increase-pages');
    
    decreaseBtn.addEventListener('click', function() {
        if (parseInt(pageCountInput.value) > 1) {
            pageCountInput.value = parseInt(pageCountInput.value) - 1;
        }
    });
    
    increaseBtn.addEventListener('click', function() {
        if (parseInt(pageCountInput.value) < 50) {
            pageCountInput.value = parseInt(pageCountInput.value) + 1;
        }
    });
    
    // Calculate button
    const calculateBtn = document.getElementById('calculate-btn');
    const priceSummary = document.getElementById('price-summary');
    
    calculateBtn.addEventListener('click', function() {
        if (selectedPrimaryServices.length === 0 && selectedSocialServices.length === 0) {
            alert('Please select at least one service.');
            return;
        }
        
        // Calculate primary services price
        const primaryServicesContainer = document.getElementById('primary-services-container');
        primaryServicesContainer.innerHTML = ''; // Clear previous services
        
        const socialServicesContainer = document.getElementById('social-services-container');
        socialServicesContainer.innerHTML = ''; // Clear previous social services
        
        const socialMediaRecurringContainer = document.getElementById('social-media-recurring-container');
        socialMediaRecurringContainer.innerHTML = ''; // Clear previous social media recurring items
        
        let totalOneTimePrice = 0;
        let totalRecurringPrice = 0;
        let includedPages = 0;
        
        // Process primary services
        selectedPrimaryServices.forEach(serviceId => {
            const service = serviceDetails[serviceId];
            
            // Add service to summary
            const serviceItem = document.createElement('div');
            serviceItem.className = 'flex justify-between items-center';
            
            totalOneTimePrice += service.price;
            includedPages += service.includedPages;
            
            serviceItem.innerHTML = `
                <span class="text-gray-700">${service.name}</span>
                <span class="font-semibold text-gray-800">₹${service.price.toLocaleString('en-IN')}</span>
            `;
            
            primaryServicesContainer.appendChild(serviceItem);
        });
        
        // Process social media services
        selectedSocialServices.forEach(serviceId => {
            const service = serviceDetails[serviceId];
            
            // Add service to recurring costs
            const serviceItem = document.createElement('div');
            serviceItem.className = 'flex justify-between items-center';
            serviceItem.innerHTML = `
                <span class="text-gray-700">${service.name}</span>
                <span class="font-semibold text-gray-800">₹${service.price.toLocaleString('en-IN')}/month</span>
            `;
            
            socialMediaRecurringContainer.appendChild(serviceItem);
            
            // Add to total recurring price
            totalRecurringPrice += service.price;
        });
        
        // Calculate additional pages price and time
        const pageCount = parseInt(pageCountInput.value);
        let additionalPagesDays = 0;
        
        // Only charge for additional pages if we have a website service selected
        const hasWebsiteService = selectedPrimaryServices.some(service => 
            ['static-website', 'dynamic-website', 'ecommerce-website'].includes(service));
        
        if (hasWebsiteService) {
            const additionalPages = Math.max(0, pageCount - includedPages);
            additionalPagesPrice = additionalPages * 750; // ₹750 per additional page
            totalOneTimePrice += additionalPagesPrice;
            
            // Calculate additional days for extra pages (1 day per 2 pages)
            additionalPagesDays = Math.ceil(additionalPages / 2);
        } else {
            additionalPagesPrice = 0;
        }
        
        // Calculate timeline adjustment
        const timeline = document.getElementById('timeline').value;
        timelinePrice = 0;
        
        if (timeline === 'express') {
            timelinePrice = 9999; // Express fee
            totalOneTimePrice += timelinePrice;
        }
        
        // Calculate addons price and time
        let addonsPrices = 0;
        let additionalAddonWeeks = 0;
        const addonsContainer = document.getElementById('addons-container');
        addonsContainer.innerHTML = ''; // Clear previous addons
        
        selectedAddons.forEach(addon => {
            let addonPrice = 0;
            let addonName = '';
            let addonTime = 0;
            
            switch(addon) {
                case 'ai-agent':
                    addonPrice = 39999;
                    addonName = 'AI Agent / Chatbot';
                    addonTime = addonTimeAdditions[addon];
                    break;
                case '3d-video':
                    addonPrice = 39999;
                    addonName = '3D CG Video (30 sec)';
                    addonTime = addonTimeAdditions[addon];
                    break;
                case 'ad-videos':
                    addonPrice = 34999;
                    addonName = 'Advertisement Videos';
                    addonTime = addonTimeAdditions[addon];
                    break;
                case 'vfx':
                    addonPrice = 29999;
                    addonName = 'VFX & Motion Graphics';
                    addonTime = addonTimeAdditions[addon];
                    break;
            }
            
            addonsPrices += addonPrice;
            totalOneTimePrice += addonPrice;
            additionalAddonWeeks += addonTime;
            
            // Add addon to summary
            const addonItem = document.createElement('div');
            addonItem.className = 'flex justify-between items-center';
            addonItem.innerHTML = `
                <span class="text-gray-700">${addonName}</span>
                <span class="font-semibold text-gray-800">₹${addonPrice.toLocaleString('en-IN')}</span>
            `;
            addonsContainer.appendChild(addonItem);
        });
        
        // Calculate SEO price and time
        const seoPackage = document.getElementById('seo').value;
        let seoDays = 0;
        
        switch(seoPackage) {
            case 'none':
                seoPrice = 0;
                seoDays = 0;
                break;
            case 'basic':
                seoPrice = 4999;
                seoDays = 3;
                break;
            case 'advanced':
                seoPrice = 9999;
                seoDays = 5;
                break;
        }
        
        totalOneTimePrice += seoPrice;
        
        // Calculate maintenance price
        const maintenancePlan = document.getElementById('maintenance').value;
        switch(maintenancePlan) {
            case 'none':
                maintenancePrice = 0;
                break;
            case 'basic':
                maintenancePrice = 2999;
                break;
            case 'premium':
                maintenancePrice = 4999;
                break;
        }
        
        totalRecurringPrice += maintenancePrice;
        
        // Format prices with Indian number formatting
        const formatPrice = (price) => {
            return '₹' + price.toLocaleString('en-IN');
        };
        
        // Update price summary
        document.getElementById('pages-price').textContent = formatPrice(additionalPagesPrice);
        document.getElementById('timeline-price').textContent = formatPrice(timelinePrice);
        document.getElementById('seo-price').textContent = formatPrice(seoPrice);
        document.getElementById('total-price').textContent = formatPrice(totalOneTimePrice);
        
        // Update maintenance price
        document.getElementById('maintenance-price').textContent = maintenancePrice > 0 ? 
            formatPrice(maintenancePrice) + '/month' : '₹0/month';
        
        // Update recurring total
        const recurringTotalItem = document.getElementById('recurring-total-item');
        document.getElementById('recurring-total').textContent = totalRecurringPrice > 0 ? 
            formatPrice(totalRecurringPrice) + '/month' : '₹0/month';
        
        // Show/hide recurring total based on if there are any recurring costs
        const recurringCosts = document.getElementById('recurring-costs');
        recurringCosts.style.display = totalRecurringPrice > 0 ? 'block' : 'none';
        
        // Update timeline estimate
        const timelineEstimate = document.getElementById('timeline-estimate');
        const timelineBreakdown = document.getElementById('timeline-breakdown');
        
        // Calculate total timeline
        let baseTimelineRange = [0, 0];
        
        // Find the service with the longest timeline
        const websiteServices = selectedPrimaryServices.filter(service => 
            ['static-website', 'dynamic-website', 'ecommerce-website', 'web-app'].includes(service));
        
        if (websiteServices.length > 0) {
            // Get the service with the longest timeline
            let longestService = websiteServices[0];
            let longestTimelineWeeks = 0;
            
            websiteServices.forEach(service => {
                const serviceTimeline = serviceDetails[service].timeline[timeline];
                const timelineWeeks = parseInt(serviceTimeline.split('-')[1] || serviceTimeline.split(' ')[0]);
                
                if (timelineWeeks > longestTimelineWeeks) {
                    longestTimelineWeeks = timelineWeeks;
                    longestService = service;
                }
            });
            
            if (timeline === 'express') {
                const expressRange = serviceDetails[longestService].timeline.express.split('-');
                baseTimelineRange = [parseInt(expressRange[0]), parseInt(expressRange[1] || expressRange[0])];
            } else {
                const standardRange = serviceDetails[longestService].timeline.standard.split('-');
                baseTimelineRange = [parseInt(standardRange[0]), parseInt(standardRange[1] || standardRange[0])];
            }
        }
        
        // Convert additional days to weeks for display
        const additionalWeeks = additionalAddonWeeks;
        const additionalDays = additionalPagesDays + seoDays;
        
        // Calculate new timeline range
        let minWeeks = baseTimelineRange[0] + additionalWeeks;
        let maxWeeks = baseTimelineRange[1] + additionalWeeks;
        
        // Add days to weeks
        minWeeks += Math.floor(additionalDays / 7);
        maxWeeks += Math.ceil(additionalDays / 7);
        
        // Remaining days
        const remainingDays = additionalDays % 7;
        
        // Format the timeline string
        let timelineString = '';
        if (minWeeks === maxWeeks) {
            timelineString = `${minWeeks} weeks`;
            if (remainingDays > 0) {
                timelineString += ` + ${remainingDays} days`;
            }
        } else {
            timelineString = `${minWeeks}-${maxWeeks} weeks`;
        }
        
        // If no website service is selected, show appropriate message
        if (websiteServices.length === 0) {
            if (selectedSocialServices.length > 0) {
                timelineString = "Monthly recurring service";
            } else {
                timelineString = "No timeline (no website services selected)";
            }
        }
        
        timelineEstimate.textContent = timelineString;
        
        // Create timeline breakdown
        timelineBreakdown.innerHTML = '';
        
        // Base timeline for website services
        if (websiteServices.length > 0) {
            websiteServices.forEach(service => {
                const baseTimelineItem = document.createElement('div');
                baseTimelineItem.className = 'flex justify-between';
                baseTimelineItem.innerHTML = `
                    <span>${serviceDetails[service].name}:</span>
                    <span>${serviceDetails[service].timeline[timeline]}</span>
                `;
                timelineBreakdown.appendChild(baseTimelineItem);
            });
            
            // Additional pages
            if (additionalPagesPrice > 0) {
                const pagesTimelineItem = document.createElement('div');
                pagesTimelineItem.className = 'flex justify-between';
                pagesTimelineItem.innerHTML = `
                    <span>Additional pages:</span>
                    <span>+${additionalPagesDays} days</span>
                `;
                timelineBreakdown.appendChild(pagesTimelineItem);
            }
            
            // SEO implementation
            if (seoDays > 0) {
                const seoTimelineItem = document.createElement('div');
                seoTimelineItem.className = 'flex justify-between';
                seoTimelineItem.innerHTML = `
                    <span>SEO implementation:</span>
                    <span>+${seoDays} days</span>
                `;
                timelineBreakdown.appendChild(seoTimelineItem);
            }
            
            // Additional services
            selectedAddons.forEach(addon => {
                let addonTime = addonTimeAdditions[addon];
                let addonName = '';
                
                switch(addon) {
                    case 'ai-agent':
                        addonName = 'AI Chatbot';
                        break;
                    case '3d-video':
                        addonName = '3D Video';
                        break;
                    case 'ad-videos':
                        addonName = 'Ad Videos';
                        break;
                    case 'vfx':
                        addonName = 'VFX & Motion Graphics';
                        break;
                }
                
                const addonTimelineItem = document.createElement('div');
                addonTimelineItem.className = 'flex justify-between';
                addonTimelineItem.innerHTML = `
                    <span>${addonName}:</span>
                    <span>+${addonTime} ${addonTime === 1 ? 'week' : 'weeks'}</span>
                `;
                timelineBreakdown.appendChild(addonTimelineItem);
            });
        } else if (selectedSocialServices.length > 0) {
            selectedSocialServices.forEach(service => {
                const socialMediaTimelineItem = document.createElement('div');
                socialMediaTimelineItem.className = 'flex justify-between';
                socialMediaTimelineItem.innerHTML = `
                    <span>${serviceDetails[service].name}:</span>
                    <span>Monthly recurring service</span>
                `;
                timelineBreakdown.appendChild(socialMediaTimelineItem);
            });
        }
        
        // Show price summary
        priceSummary.classList.remove('hidden');
        
        // Scroll to price summary
        priceSummary.scrollIntoView({ behavior: 'smooth' });
    });
    
    // Share quote functionality
    const shareQuoteBtn = document.getElementById('share-quote-btn');
    const shareModal = document.getElementById('share-modal');
    const closeShareModalBtn = document.getElementById('close-share-modal');
    const sendQuoteBtn = document.getElementById('send-quote-btn');
    const successNotification = document.getElementById('success-notification');
    const notificationMessage = document.getElementById('notification-message');
    
    shareQuoteBtn.addEventListener('click', function() {
        shareModal.classList.remove('hidden');
    });
    
    closeShareModalBtn.addEventListener('click', function() {
        shareModal.classList.add('hidden');
    });
    
    // Close share modal when clicking outside
    shareModal.addEventListener('click', function(e) {
        if (e.target === shareModal) {
            shareModal.classList.add('hidden');
        }
    });
    
    sendQuoteBtn.addEventListener('click', function() {
        const email = document.getElementById('recipient-email').value;
        
        if (!email) {
            alert('Please enter a recipient email address.');
            return;
        }
        
        // In a real application, this would send the quote to the server
        // For this demo, we'll just show a success message
        
        shareModal.classList.add('hidden');
        notificationMessage.textContent = 'Quote sent successfully!';
        successNotification.classList.remove('hidden');
        
        // Hide notification after 3 seconds
        setTimeout(function() {
            successNotification.classList.add('hidden');
        }, 3000);
    });
    
    // Save quote functionality
    const saveQuoteBtn = document.getElementById('save-quote-btn');
    
    saveQuoteBtn.addEventListener('click', function() {
        // In a real application, this would save the quote to the server or generate a PDF
        // For this demo, we'll just show a success message
        
        notificationMessage.textContent = 'Quote saved successfully!';
        successNotification.classList.remove('hidden');
        
        // Hide notification after 3 seconds
        setTimeout(function() {
            successNotification.classList.add('hidden');
        }, 3000);
    });
    
    // Contact button functionality
    const contactBtn = document.getElementById('contact-btn');
    
    contactBtn.addEventListener('click', function() {
        // In a real application, this would open a contact form or redirect to a contact page
        // For this demo, we'll just show a success message
        
        notificationMessage.textContent = 'Contact form would open here!';
        successNotification.classList.remove('hidden');
        
        // Hide notification after 3 seconds
        setTimeout(function() {
            successNotification.classList.add('hidden');
        }, 3000);
    });
}); 