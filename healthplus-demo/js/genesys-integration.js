/**
 * Genesys Integration for HealthPlus
 * This file handles all Genesys Web Messenger and Journey tracking functionality
 */

// Create a global HealthPlus object if it doesn't exist
window.HealthPlus = window.HealthPlus || {};

// Initialize the Genesys integration
window.HealthPlus.Genesys = (function() {
    // Private variables
    let isReady = false;
    let pendingEvents = [];
    let maxRetries = 10;
    let retryCount = 0;
    
    // Private functions
    function initialize() {
        console.log('Initializing Genesys integration...');
        
        // Check if Genesys is available
        if (typeof window.Genesys !== 'undefined' && typeof window.Genesys.command === 'function') {
            console.log('Genesys SDK found, registering Journey plugin...');
            
            // Register the Journey plugin
            window.Genesys.command('Journey.register')
                .then(function() {
                    console.log('✅ Journey plugin registered successfully');
                    isReady = true;
                    
                    // Process any pending events
                    processPendingEvents();
                })
                .catch(function(error) {
                    console.error('❌ Failed to register Journey plugin:', error);
                });
        } else {
            retryCount++;
            
            if (retryCount <= maxRetries) {
                console.log(`Genesys SDK not found, retrying... (${retryCount}/${maxRetries})`);
                setTimeout(initialize, 1000);
            } else {
                console.error(`❌ Failed to initialize Genesys after ${maxRetries} attempts`);
            }
        }
    }
    
    function processPendingEvents() {
        if (pendingEvents.length > 0) {
            console.log(`Processing ${pendingEvents.length} pending events`);
            
            pendingEvents.forEach(function(event) {
                trackEvent(event.name, event.attributes);
            });
            
            pendingEvents = [];
        }
    }
    
    function trackEvent(eventName, customAttributes) {
        if (!eventName) {
            console.error('❌ Cannot track event: No event name provided');
            return Promise.reject('No event name provided');
        }
        
        // If Genesys is not ready, queue the event
        if (!isReady) {
            console.log(`Queueing event: ${eventName}`);
            pendingEvents.push({
                name: eventName,
                attributes: customAttributes || {}
            });
            return Promise.resolve({ queued: true });
        }
        
        // Add timestamp if not present
        if (customAttributes && !customAttributes.timestamp) {
            customAttributes.timestamp = new Date().toISOString();
        }
        
        console.log(`Tracking event: ${eventName}`, customAttributes);
        
        // Track the event
        return window.Genesys.command('Journey.trackEvent', {
            eventName: eventName,
            customAttributes: customAttributes || {}
        })
        .then(function(response) {
            console.log(`✅ Event ${eventName} tracked successfully`);
            return response;
        })
        .catch(function(error) {
            console.error(`❌ Failed to track event ${eventName}:`, error);
            throw error;
        });
    }
    
    // Initialize when the script loads
    initialize();
    
    // Public API
    return {
        trackEvent: function(eventName, customAttributes) {
            // Use setTimeout to ensure this doesn't block UI operations
            setTimeout(function() {
                trackEvent(eventName, customAttributes);
            }, 0);
        },
        
        isReady: function() {
            return isReady;
        }
    };
})();

// Listen for custom events
document.addEventListener('HealthPlus:TrackEvent', function(e) {
    if (e && e.detail) {
        window.HealthPlus.Genesys.trackEvent(e.detail.eventName, e.detail.customAttributes);
    }
});

console.log('Genesys integration script loaded');
