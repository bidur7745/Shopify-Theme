/**
 * Featured Footwear Section JavaScript - Fixed Version
 * Handles dynamic image swapping and color selection
 */

class FeaturedFootwear {
  constructor() {
    this.init();
    this.colorMap = this.generateColorMap();
  }

  init() {
    this.bindEvents();
    this.initializeColorSwatches();
  }

  generateColorMap() {
    return {
      'black': '#000000',
      'white': '#FFFFFF',
      'brown': '#8B4513',
      'tan': '#D2B48C',
      'navy': '#000080',
      'red': '#DC143C',
      'blue': '#4169E1',
      'green': '#228B22',
      'gray': '#808080',
      'grey': '#808080',
      'beige': '#F5F5DC',
      'cream': '#FFFDD0',
      'gold': '#FFD700',
      'silver': '#C0C0C0',
      'pink': '#FFC0CB',
      'purple': '#800080',
      'orange': '#FFA500',
      'yellow': '#FFFF00',
      'burgundy': '#800020',
      'nude': '#E8B5A2',
      'camel': '#C19A6B',
      'olive': '#808000',
      'khaki': '#F0E68C',
      'maroon': '#800000',
      'teal': '#008080',
      'mint': '#98FB98',
      'coral': '#FF7F50',
      'lavender': '#E6E6FA'
    };
  }

  bindEvents() {
    // Color swatch click events
    document.addEventListener('click', (e) => {
      if (e.target.closest('.color-swatch')) {
        this.handleColorSwatchClick(e);
      }
    });

    // Add to cart form submission
    document.addEventListener('submit', (e) => {
      if (e.target.closest('.footwear-form')) {
        this.handleAddToCart(e);
      }
    });

    // Keyboard navigation for color swatches
    document.addEventListener('keydown', (e) => {
      if (e.target.closest('.color-swatch')) {
        this.handleKeyboardNavigation(e);
      }
    });
  }

  initializeColorSwatches() {
    const footwearCards = document.querySelectorAll('.footwear-card');
    
    footwearCards.forEach(card => {
      const swatches = card.querySelectorAll('.color-swatch');
      const mainImage = card.querySelector('.footwear-main-image');
      
      if (swatches.length > 0 && mainImage) {
        // Set proper color values and initial active state
        swatches.forEach((swatch, index) => {
          // Set animation delay
          swatch.style.setProperty('--index', index);
          
          // Set proper color value from color name
          const colorName = this.getColorName(swatch);
          const colorValue = this.getColorValue(colorName);
          swatch.style.setProperty('--swatch-color', colorValue);
          swatch.style.backgroundColor = colorValue;
          
          // Set first swatch as active
          if (index === 0) {
            this.setActiveSwatch(swatch);
          }
        });
      }
    });
  }

  getColorValue(colorName) {
    if (!colorName) return '#CDAA7D'; // Default color
    
    const cleanName = colorName.toLowerCase().trim().replace(/[^a-z]/g, '');
    return this.colorMap[cleanName] || '#CDAA7D';
  }

  handleColorSwatchClick(e) {
    e.preventDefault();
    const swatch = e.target.closest('.color-swatch');
    const card = swatch.closest('.footwear-card');
    
    if (!swatch || !card) return;

    const imageUrl = swatch.dataset.imageUrl;
    const variantId = swatch.dataset.variantId;
    const productId = swatch.dataset.productId;
    
    // Update active swatch
    this.setActiveSwatch(swatch);
    
    // Update main image with smooth transition
    this.updateProductImage(card, imageUrl, swatch);
    
    // Update variant in form
    this.updateVariant(card, variantId);
    
    // Update product URL if needed
    this.updateProductUrl(card, variantId);
    
    // Add visual feedback
    this.addClickFeedback(swatch);
  }

  setActiveSwatch(activeSwatch) {
    const card = activeSwatch.closest('.footwear-card');
    const allSwatches = card.querySelectorAll('.color-swatch');
    
    allSwatches.forEach(swatch => {
      swatch.classList.remove('active');
    });
    
    activeSwatch.classList.add('active');
  }

  updateProductImage(card, imageUrl, activeSwatch) {
    const mainImage = card.querySelector('.footwear-main-image');
    const imageContainer = card.querySelector('.footwear-image-container');
    
    if (!mainImage || !imageUrl) {
      console.warn('Missing image element or URL');
      return;
    }

    // Don't update if it's the same image
    if (mainImage.src === imageUrl) {
      return;
    }

    // Create loading overlay
    const loadingOverlay = this.createLoadingOverlay();
    imageContainer.appendChild(loadingOverlay);

    // Preload the new image
    const newImage = new Image();
    newImage.onload = () => {
      // Fade out current image
      mainImage.style.opacity = '0';
      mainImage.style.transform = 'scale(1.1)';
      
      setTimeout(() => {
        // Update image source and alt text
        mainImage.src = imageUrl;
        const colorName = this.getColorName(activeSwatch);
        const baseAlt = mainImage.alt.replace(/\s+in\s+\w+/i, ''); // Remove existing color reference
        mainImage.alt = colorName ? `${baseAlt} in ${colorName}` : baseAlt;
        
        // Fade in new image
        mainImage.style.opacity = '1';
        mainImage.style.transform = 'scale(1)';
        
        // Remove loading overlay
        loadingOverlay.remove();
      }, 200);
    };
    
    newImage.onerror = () => {
      console.warn('Failed to load image:', imageUrl);
      loadingOverlay.remove();
      // Optionally show error state or fallback image
    };
    
    newImage.src = imageUrl;
  }

  createLoadingOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'image-loading-overlay';
    overlay.innerHTML = `
      <div class="loading-spinner">
        <div class="spinner"></div>
      </div>
    `;
    
    // Add styles
    overlay.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.9);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10;
      border-radius: 1rem;
    `;
    
    const spinnerStyle = `
      .loading-spinner .spinner {
        width: 30px;
        height: 30px;
        border: 3px solid #f3f3f3;
        border-top: 3px solid #CDAA7D;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }
      
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    
    // Add spinner styles if not already present
    if (!document.querySelector('#spinner-styles')) {
      const style = document.createElement('style');
      style.id = 'spinner-styles';
      style.textContent = spinnerStyle;
      document.head.appendChild(style);
    }
    
    return overlay;
  }

  updateVariant(card, variantId) {
    const form = card.querySelector('.footwear-form');
    const variantInput = form?.querySelector('input[name="id"]');
    
    if (variantInput && variantId) {
      variantInput.value = variantId;
      console.log('Updated variant ID to:', variantId);
    }
  }

  updateProductUrl(card, variantId) {
    const productLink = card.querySelector('.footwear-image-link');
    const titleLink = card.querySelector('.footwear-title a');
    
    if (variantId && (productLink || titleLink)) {
      // Get current URL and add/update variant parameter
      const currentUrl = productLink?.href || titleLink?.href;
      if (currentUrl) {
        const url = new URL(currentUrl, window.location.origin);
        url.searchParams.set('variant', variantId);
        const newUrl = url.pathname + url.search;
        
        if (productLink) {
          productLink.href = newUrl;
        }
        if (titleLink) {
          titleLink.href = newUrl;
        }
      }
    }
  }

  addClickFeedback(swatch) {
    // Add ripple effect
    const ripple = document.createElement('div');
    ripple.className = 'color-swatch-ripple';
    ripple.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      width: 0;
      height: 0;
      background: rgba(255, 255, 255, 0.6);
      border-radius: 50%;
      transform: translate(-50%, -50%);
      animation: ripple 0.6s ease-out;
      pointer-events: none;
      z-index: 1;
    `;
    
    swatch.style.position = 'relative';
    swatch.appendChild(ripple);
    
    // Add CSS animation if not present
    if (!document.querySelector('#ripple-animation')) {
      const style = document.createElement('style');
      style.id = 'ripple-animation';
      style.textContent = `
        @keyframes ripple {
          to {
            width: 100px;
            height: 100px;
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }
    
    setTimeout(() => {
      if (ripple.parentNode) {
        ripple.remove();
      }
    }, 600);
  }

  handleAddToCart(e) {
    e.preventDefault();
    const form = e.target;
    const button = form.querySelector('.footwear-add-to-cart');
    const originalText = button.textContent;
    
    // Show loading state
    button.disabled = true;
    button.textContent = 'Adding...';
    button.style.opacity = '0.7';
    
    // Get form data
    const formData = new FormData(form);
    
    // Submit to cart
    fetch('/cart/add.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(formData).toString()
    })
    .then(response => {
      if (!response.ok) {
        return response.json().then(err => Promise.reject(err));
      }
      return response.json();
    })
    .then(data => {
      // Success feedback
      this.showAddToCartSuccess(button);
      
      // Update cart count if element exists
      this.updateCartCount();
      
      // Dispatch custom event for cart update
      document.dispatchEvent(new CustomEvent('cart:updated', { detail: data }));
      
    })
    .catch(error => {
      console.error('Add to cart error:', error);
      this.showAddToCartError(button, error.message || error.description || 'Failed to add to cart');
    })
    .finally(() => {
      // Reset button state
      setTimeout(() => {
        if (button) {
          button.disabled = false;
          button.textContent = originalText;
          button.style.opacity = '1';
        }
      }, 2000);
    });
  }

  showAddToCartSuccess(button) {
    const originalText = button.textContent;
    const originalBackground = button.style.background;
    
    button.textContent = 'Added! ✓';
    button.style.background = 'linear-gradient(135deg, #28a745 0%, #20c997 100%)';
    button.style.animation = 'pulse 0.6s ease';
    
    setTimeout(() => {
      if (button) {
        button.textContent = originalText;
        button.style.background = originalBackground;
        button.style.animation = '';
      }
    }, 2000);
  }

  showAddToCartError(button, errorMessage) {
    const originalText = button.textContent;
    const originalBackground = button.style.background;
    
    button.textContent = 'Error';
    button.style.background = 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)';
    
    // Show error tooltip
    this.showTooltip(button, errorMessage, 'error');
    
    setTimeout(() => {
      if (button) {
        button.textContent = originalText;
        button.style.background = originalBackground;
      }
    }, 3000);
  }

  showTooltip(element, message, type = 'info') {
    const existingTooltip = element.querySelector('.tooltip');
    if (existingTooltip) {
      existingTooltip.remove();
    }
    
    const tooltip = document.createElement('div');
    tooltip.className = `tooltip tooltip-${type}`;
    tooltip.textContent = message;
    tooltip.style.cssText = `
      position: absolute;
      top: -40px;
      left: 50%;
      transform: translateX(-50%);
      background: ${type === 'error' ? '#dc3545' : '#333'};
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 0.25rem;
      font-size: 0.875rem;
      white-space: nowrap;
      z-index: 1000;
      animation: tooltipFadeIn 0.3s ease;
      max-width: 200px;
      white-space: normal;
      text-align: center;
    `;
    
    element.style.position = 'relative';
    element.appendChild(tooltip);
    
    // Add CSS animation if not present
    if (!document.querySelector('#tooltip-animation')) {
      const style = document.createElement('style');
      style.id = 'tooltip-animation';
      style.textContent = `
        @keyframes tooltipFadeIn {
          from { opacity: 0; transform: translateX(-50%) translateY(10px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `;
      document.head.appendChild(style);
    }
    
    setTimeout(() => {
      if (tooltip.parentNode) {
        tooltip.remove();
      }
    }, 3000);
  }

  updateCartCount() {
    // Fetch current cart to get accurate count
    fetch('/cart.js')
      .then(response => response.json())
      .then(cart => {
        const cartCountElements = document.querySelectorAll('.cart-count, .cart-count-badge, [data-cart-count]');
        cartCountElements.forEach(element => {
          element.textContent = cart.item_count;
          
          // Add animation
          element.style.animation = 'bounce 0.6s ease';
          setTimeout(() => {
            element.style.animation = '';
          }, 600);
        });
      })
      .catch(error => {
        console.error('Error fetching cart:', error);
      });
  }

  handleKeyboardNavigation(e) {
    const swatch = e.target.closest('.color-swatch');
    const card = swatch.closest('.footwear-card');
    const allSwatches = Array.from(card.querySelectorAll('.color-swatch'));
    const currentIndex = allSwatches.indexOf(swatch);
    
    let newIndex = currentIndex;
    
    switch(e.key) {
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault();
        newIndex = currentIndex > 0 ? currentIndex - 1 : allSwatches.length - 1;
        break;
      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault();
        newIndex = currentIndex < allSwatches.length - 1 ? currentIndex + 1 : 0;
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        this.handleColorSwatchClick({ target: swatch, preventDefault: () => {} });
        return;
      default:
        return;
    }
    
    if (newIndex !== currentIndex && allSwatches[newIndex]) {
      allSwatches[newIndex].focus();
      this.setActiveSwatch(allSwatches[newIndex]);
    }
  }

  getColorName(swatch) {
    const colorName = swatch.querySelector('.color-name');
    return colorName ? colorName.textContent.trim() : '';
  }

  // Debug method to check data attributes
  debugSwatches() {
    const swatches = document.querySelectorAll('.color-swatch');
    console.log('Color swatches debug:');
    swatches.forEach((swatch, index) => {
      console.log(`Swatch ${index}:`, {
        variantId: swatch.dataset.variantId,
        imageUrl: swatch.dataset.imageUrl,
        productId: swatch.dataset.productId,
        colorName: this.getColorName(swatch)
      });
    });
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new FeaturedFootwear();
  });
} else {
  new FeaturedFootwear();
}

// Re-initialize for dynamic content (e.g., theme editor)
document.addEventListener('shopify:section:load', () => {
  new FeaturedFootwear();
});

// Add required CSS animations
if (!document.querySelector('#footwear-animations')) {
  const style = document.createElement('style');
  style.id = 'footwear-animations';
  style.textContent = `
    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.05); }
      100% { transform: scale(1); }
    }
    
    @keyframes bounce {
      0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
      40% { transform: translateY(-10px); }
      60% { transform: translateY(-5px); }
    }
  `;
  document.head.appendChild(style);
}