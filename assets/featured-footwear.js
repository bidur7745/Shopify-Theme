/**
 * Featured Footwear Section JavaScript
 * Handles dynamic image swapping and color selection
 */

class FeaturedFootwear {
  constructor() {
    this.init();
  }

  init() {
    this.bindEvents();
    this.initializeColorSwatches();
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
      const form = card.querySelector('.footwear-form');
      const variantInput = form?.querySelector('input[name="id"]');
      
      if (swatches.length > 0 && mainImage) {
        // Set initial active state
        this.setActiveSwatch(swatches[0]);
        
        // Add index for animation delay
        swatches.forEach((swatch, index) => {
          swatch.style.setProperty('--index', index);
        });
      }
    });
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
    this.updateProductImage(card, imageUrl);
    
    // Update variant in form
    this.updateVariant(card, variantId);
    
    // Update product URL if needed
    this.updateProductUrl(card, productId, variantId);
    
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

  updateProductImage(card, imageUrl) {
    const mainImage = card.querySelector('.footwear-main-image');
    const imageContainer = card.querySelector('.footwear-image-container');
    
    if (!mainImage || !imageUrl) return;

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
        // Update image source
        mainImage.src = imageUrl;
        mainImage.alt = mainImage.alt.replace(/color\s+\w+/i, '') + ' ' + this.getColorName(activeSwatch);
        
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
    `;
    
    return overlay;
  }

  updateVariant(card, variantId) {
    const form = card.querySelector('.footwear-form');
    const variantInput = form?.querySelector('input[name="id"]');
    
    if (variantInput && variantId) {
      variantInput.value = variantId;
    }
  }

  updateProductUrl(card, productId, variantId) {
    const productLink = card.querySelector('.footwear-image-link');
    const titleLink = card.querySelector('.footwear-title a');
    
    if (productId && variantId) {
      const newUrl = `/products/${productId}?variant=${variantId}`;
      
      if (productLink) {
        productLink.href = newUrl;
      }
      if (titleLink) {
        titleLink.href = newUrl;
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
    `;
    
    swatch.style.position = 'relative';
    swatch.appendChild(ripple);
    
    // Add CSS animation
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
      ripple.remove();
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
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      if (data.status === 422) {
        throw new Error(data.description || 'Failed to add to cart');
      }
      
      // Success feedback
      this.showAddToCartSuccess(button);
      
      // Update cart count if element exists
      this.updateCartCount();
      
    })
    .catch(error => {
      console.error('Add to cart error:', error);
      this.showAddToCartError(button, error.message);
    })
    .finally(() => {
      // Reset button state
      setTimeout(() => {
        button.disabled = false;
        button.textContent = originalText;
        button.style.opacity = '1';
      }, 2000);
    });
  }

  showAddToCartSuccess(button) {
    const originalText = button.textContent;
    button.textContent = 'Added! ✓';
    button.style.background = 'linear-gradient(135deg, #28a745 0%, #20c997 100%)';
    
    // Add success animation
    button.style.animation = 'pulse 0.6s ease';
    
    setTimeout(() => {
      button.textContent = originalText;
      button.style.background = '';
      button.style.animation = '';
    }, 2000);
  }

  showAddToCartError(button, errorMessage) {
    const originalText = button.textContent;
    button.textContent = 'Error';
    button.style.background = 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)';
    
    // Show error tooltip
    this.showTooltip(button, errorMessage, 'error');
    
    setTimeout(() => {
      button.textContent = originalText;
      button.style.background = '';
    }, 3000);
  }

  showTooltip(element, message, type = 'info') {
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
    `;
    
    element.style.position = 'relative';
    element.appendChild(tooltip);
    
    // Add CSS animation
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
      tooltip.remove();
    }, 3000);
  }

  updateCartCount() {
    // Update cart count in header if it exists
    const cartCountElements = document.querySelectorAll('.cart-count, .cart-count-badge');
    cartCountElements.forEach(element => {
      const currentCount = parseInt(element.textContent) || 0;
      element.textContent = currentCount + 1;
      
      // Add animation
      element.style.animation = 'bounce 0.6s ease';
      setTimeout(() => {
        element.style.animation = '';
      }, 600);
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
        swatch.click();
        return;
    }
    
    if (newIndex !== currentIndex) {
      allSwatches[newIndex].focus();
      this.setActiveSwatch(allSwatches[newIndex]);
    }
  }

  getColorName(swatch) {
    const colorName = swatch.querySelector('.color-name');
    return colorName ? colorName.textContent : '';
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new FeaturedFootwear();
});

// Re-initialize for dynamic content (e.g., theme editor)
document.addEventListener('shopify:section:load', () => {
  new FeaturedFootwear();
});

// Add pulse animation for success feedback
if (!document.querySelector('#pulse-animation')) {
  const style = document.createElement('style');
  style.id = 'pulse-animation';
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
