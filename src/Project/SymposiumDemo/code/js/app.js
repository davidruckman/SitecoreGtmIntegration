// Home Slider
App.homeSlider = el => {
  const slider = new Swiper(el, {
    loop: true,
    pagination: {
      el: '.swiper-pagination',
      clickable: true
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    autoplay: {
      delay: 3000,
      disableOnInteraction: false
    },
    on: {
      init: () => {
        setTimeout(() => {
          for (const elem of document.querySelectorAll(`${el} .swiper-slide-active .animated`)) {
            elem.classList.add('visible', elem.getAttribute('data-animate'))
          }
        }, 100)
      }
    }
  })
  slider.on('slideChange', () => {
    for (const elem of document.querySelectorAll(`${el} .animated`)) {
      elem.classList.remove('visible', elem.getAttribute('data-animate'))
    }
    for (const elem of slider.slides[slider.activeIndex].querySelectorAll('.animated')) {
      elem.classList.add('visible', elem.getAttribute('data-animate'))
    }
  })
}

// Deal Slider
App.dealSlider = el => {
  new Swiper(el, {
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    slidesPerView: 2,
    breakpoints: {
      575: { // xs
        slidesPerView: 1,
      }
    }
  })
}

// Deal Slider 2
App.dealSlider2 = el => {
  new Swiper(el, {
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    slidesPerView: 4,
    spaceBetween: 15,
    breakpoints: {
      575: { // xs
        slidesPerView: 1,
        spaceBetween: 0,
      },
      767: { // sm
        slidesPerView: 2,
        spaceBetween: 15,
      },
      991: { // md
        slidesPerView: 3,
        spaceBetween: 15,
      }
    }
  })
}

// Brand Slider
App.brandSlider = el => {
  new Swiper(el, {
    pagination: {
      el: '.swiper-pagination',
      clickable: true
    },
    autoplay: {
      delay: 3000,
      disableOnInteraction: false
    },
    slidesPerView: 5,
    spaceBetween: 15,
    slidesPerColumn: 2,
    breakpoints: {
      575: { // xs
        slidesPerView: 2,
        spaceBetween: 8,
      },
      767: {
        // sm
        slidesPerView: 2,
        spaceBetween: 15,
      },
      991: {
        // md
        slidesPerView: 3,
        spaceBetween: 15,
      },
      1199: {
        // lg
        slidesPerView: 4,
        spaceBetween: 15,
      }
    }
  })
}

// Add to Cart Demo
App.atcDemo = () => {
  for (const el of document.querySelectorAll('.atc-demo')) {
    el.addEventListener('click', () => {
      const product = el.getAttribute('data-title') ? el.getAttribute('data-title') : el.closest('.card').querySelector('.card-title').innerText
      new Noty({
        type: 'success',
        text: `<div class="media">
                <i class="material-icons">check_circle</i>
                <div class="media-body ml-3">
                  <strong>${product}</strong><br/>Successfully added to cart!.
                </div>
              </div>`,
        timeout: 2000
      }).show()
    })
  }
}

// Add to Wishlist Demo
App.atwDemo = () => {
  for (const el of document.querySelectorAll('.atw-demo')) {
    el.addEventListener('click', () => {
      const product = el.getAttribute('data-title') ? el.getAttribute('data-title') : el.closest('.card').querySelector('.card-title').innerText
      const caption = el.classList.contains('active') ? 'removed from' : 'added to'
      new Noty({
        type: 'pink',
        text: `<div class="media">
                  <i class="material-icons">favorite</i>
                  <div class="media-body ml-3">
                    <strong>${product}</strong><br/>Successfully ${caption} wishlist!.
                  </div>
                </div>`,
        timeout: 2000
      }).show()
      el.classList.contains('active') ? el.setAttribute('title', 'Add to wishlist') : el.setAttribute('title', 'Added to wishlist')
    })
  }
}

// Quick view Demo
App.quickviewDemo = () => {
  var quickviewSlider = new Swiper('#quickviewSlider', {
    loop: true,
    pagination: {
      el: '.swiper-pagination',
      clickable: true
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    }
  })
  $('#quickviewModal').on('shown.bs.modal', () => {
    quickviewSlider.update()
  })
  for (const el of document.querySelectorAll('.quickview-demo')) {
    el.addEventListener('click', () => {
      $('#quickviewModal').modal('show')
    })
  }
}

// Apply color option
App.colorOption = () => {
  for (const el of document.querySelectorAll('.card-product .custom-color input')) {
    el.addEventListener('change', () => {
      el.closest('.card').querySelector('.card-img-top').src = el.value
    })
  }
}

// Star Rating
App.rating = () => {
  for (const el of document.querySelectorAll('.rating')) {
    const value = el.getAttribute('data-value')
    if (typeof value !== 'undefined') {
      for (var i = 0; i < Math.floor(value); i++) {
        // Star full
        el.insertAdjacentHTML('beforeend', '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 32 32"><path d="M32 12.408l-11.056-1.607-4.944-10.018-4.944 10.018-11.056 1.607 8 7.798-1.889 11.011 9.889-5.199 9.889 5.199-1.889-11.011 8-7.798z"></path></svg>\n')
      }
      if (value % 1 != 0) {
        // Star half
        el.insertAdjacentHTML('beforeend', '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 32 32"><path d="M32 12.408l-11.056-1.607-4.944-10.018-4.944 10.018-11.056 1.607 8 7.798-1.889 11.011 9.889-5.199 9.889 5.199-1.889-11.011 8-7.798zM16 23.547l-0.029 0.015 0.029-17.837 3.492 7.075 7.807 1.134-5.65 5.507 1.334 7.776-6.983-3.671z"></path></svg>\n')
      }
      var total = el.querySelectorAll('svg').length
      if (total < 5) {
        for (var x = 0; x < (5 - total); x++) {
          // Star empty
          el.insertAdjacentHTML('beforeend', '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 32 32"><path d="M32 12.408l-11.056-1.607-4.944-10.018-4.944 10.018-11.056 1.607 8 7.798-1.889 11.011 9.889-5.199 9.889 5.199-1.889-11.011 8-7.798zM16 23.547l-6.983 3.671 1.334-7.776-5.65-5.507 7.808-1.134 3.492-7.075 3.492 7.075 7.807 1.134-5.65 5.507 1.334 7.776-6.983-3.671z"></path></svg>\n')
        }
      }
    }
  }
}

// Custom Icon
App.customIcon = () => {
  const iconFacebook = (width, height) =>
    `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="${width || '32'}" height="${height || '32'}" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17 3v2h-2c-0.552 0-1.053 0.225-1.414 0.586s-0.586 0.862-0.586 1.414v3c0 0.552 0.448 1 1 1h2.719l-0.5 2h-2.219c-0.552 0-1 0.448-1 1v7h-2v-7c0-0.552-0.448-1-1-1h-2v-2h2c0.552 0 1-0.448 1-1v-3c0-1.105 0.447-2.103 1.172-2.828s1.723-1.172 2.828-1.172zM18 1h-3c-1.657 0-3.158 0.673-4.243 1.757s-1.757 2.586-1.757 4.243v2h-2c-0.552 0-1 0.448-1 1v4c0 0.552 0.448 1 1 1h2v7c0 0.552 0.448 1 1 1h4c0.552 0 1-0.448 1-1v-7h2c0.466 0 0.858-0.319 0.97-0.757l1-4c0.134-0.536-0.192-1.079-0.728-1.213-0.083-0.021-0.167-0.031-0.242-0.030h-3v-2h3c0.552 0 1-0.448 1-1v-4c0-0.552-0.448-1-1-1z"></path>
    </svg>`

  const iconTwitter = (width, height) =>
    `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="${width || '32'}" height="${height || '32'}" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.833 5.262c-0.186 0.242-0.391 0.475-0.616 0.696-0.233 0.232-0.347 0.567-0.278 0.908 0.037 0.182 0.060 0.404 0.061 0.634 0 5.256-2.429 8.971-5.81 10.898-2.647 1.509-5.938 1.955-9.222 1.12 1.245-0.361 2.46-0.921 3.593-1.69 0.147-0.099 0.273-0.243 0.352-0.421 0.224-0.505-0.003-1.096-0.508-1.32-2.774-1.233-4.13-2.931-4.769-4.593-0.417-1.084-0.546-2.198-0.52-3.227 0.021-0.811 0.138-1.56 0.278-2.182 0.395 0.342 0.804 0.705 1.236 1.037 2.051 1.577 4.624 2.48 7.396 2.408 0.541-0.015 0.974-0.457 0.974-1v-1.011c-0.002-0.179 0.009-0.357 0.034-0.534 0.113-0.806 0.504-1.569 1.162-2.141 0.725-0.631 1.636-0.908 2.526-0.846s1.753 0.463 2.384 1.188c0.252 0.286 0.649 0.416 1.033 0.304 0.231-0.067 0.463-0.143 0.695-0.228zM22.424 2.183c-0.74 0.522-1.523 0.926-2.287 1.205-0.931-0.836-2.091-1.302-3.276-1.385-1.398-0.097-2.836 0.339-3.977 1.332-1.036 0.901-1.652 2.107-1.83 3.372-0.037 0.265-0.055 0.533-0.054 0.8-1.922-0.142-3.694-0.85-5.151-1.971-0.775-0.596-1.461-1.309-2.034-2.115-0.32-0.45-0.944-0.557-1.394-0.237-0.154 0.109-0.267 0.253-0.335 0.409 0 0-0.132 0.299-0.285 0.76-0.112 0.337-0.241 0.775-0.357 1.29-0.163 0.722-0.302 1.602-0.326 2.571-0.031 1.227 0.12 2.612 0.652 3.996 0.683 1.775 1.966 3.478 4.147 4.823-1.569 0.726-3.245 1.039-4.873 0.967-0.552-0.024-1.019 0.403-1.043 0.955-0.017 0.389 0.19 0.736 0.513 0.918 4.905 2.725 10.426 2.678 14.666 0.261 4.041-2.301 6.82-6.7 6.82-12.634-0.001-0.167-0.008-0.33-0.023-0.489 1.006-1.115 1.676-2.429 1.996-3.781 0.127-0.537-0.206-1.076-0.743-1.203-0.29-0.069-0.58-0.003-0.807 0.156z"></path>
    </svg>`

  const iconInstagram = (width, height) =>
    `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="${width || '32'}" height="${height || '32'}" viewBox="0 0 24 24" fill="currentColor">
      <path d="M7 1c-1.657 0-3.158 0.673-4.243 1.757s-1.757 2.586-1.757 4.243v10c0 1.657 0.673 3.158 1.757 4.243s2.586 1.757 4.243 1.757h10c1.657 0 3.158-0.673 4.243-1.757s1.757-2.586 1.757-4.243v-10c0-1.657-0.673-3.158-1.757-4.243s-2.586-1.757-4.243-1.757zM7 3h10c1.105 0 2.103 0.447 2.828 1.172s1.172 1.723 1.172 2.828v10c0 1.105-0.447 2.103-1.172 2.828s-1.723 1.172-2.828 1.172h-10c-1.105 0-2.103-0.447-2.828-1.172s-1.172-1.723-1.172-2.828v-10c0-1.105 0.447-2.103 1.172-2.828s1.723-1.172 2.828-1.172zM16.989 11.223c-0.15-0.972-0.571-1.857-1.194-2.567-0.754-0.861-1.804-1.465-3.009-1.644-0.464-0.074-0.97-0.077-1.477-0.002-1.366 0.202-2.521 0.941-3.282 1.967s-1.133 2.347-0.93 3.712 0.941 2.521 1.967 3.282 2.347 1.133 3.712 0.93 2.521-0.941 3.282-1.967 1.133-2.347 0.93-3.712zM15.011 11.517c0.122 0.82-0.1 1.609-0.558 2.227s-1.15 1.059-1.969 1.18-1.609-0.1-2.227-0.558-1.059-1.15-1.18-1.969 0.1-1.609 0.558-2.227 1.15-1.059 1.969-1.18c0.313-0.046 0.615-0.042 0.87-0.002 0.74 0.11 1.366 0.47 1.818 0.986 0.375 0.428 0.63 0.963 0.72 1.543zM18.5 6.5c0-0.552-0.448-1-1-1s-1 0.448-1 1 0.448 1 1 1 1-0.448 1-1z"></path>
    </svg>`

  const iconGplus = (width, height) =>
    `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="${width || '32'}" height="${height || '32'}" viewBox="0 0 32 32" fill="currentColor">
      <path d="M10.181 14.294v3.494h5.775c-0.231 1.5-1.744 4.394-5.775 4.394-3.475 0-6.313-2.881-6.313-6.431s2.838-6.431 6.313-6.431c1.981 0 3.3 0.844 4.056 1.569l2.762-2.662c-1.775-1.656-4.075-2.662-6.819-2.662-5.631 0.006-10.181 4.556-10.181 10.188s4.55 10.181 10.181 10.181c5.875 0 9.775-4.131 9.775-9.95 0-0.669-0.075-1.181-0.163-1.688h-9.613z"></path>
      <path d="M32 14h-3v-3h-3v3h-3v3h3v3h3v-3h3z"></path>
    </svg>`

  const iconPaypal = (width, height) =>
    `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="${width || '32'}" height="${height || '32'}" viewBox="0 0 32 32" fill="currentColor">
      <path d="M29.063 9.644c-1.494 6.631-6.106 10.131-13.375 10.131h-2.419l-1.681 10.675h-2.025l-0.106 0.688c-0.069 0.456 0.281 0.863 0.738 0.863h5.175c0.613 0 1.131-0.444 1.231-1.050l0.050-0.262 0.975-6.181 0.063-0.337c0.094-0.606 0.619-1.050 1.231-1.050h0.769c5.012 0 8.938-2.038 10.088-7.925 0.431-2.238 0.269-4.137-0.712-5.55z"></path>
      <path d="M25.969 2.413c-1.481-1.688-4.163-2.413-7.587-2.413h-9.944c-0.7 0-1.3 0.506-1.406 1.2l-4.144 26.262c-0.081 0.519 0.319 0.988 0.844 0.988h6.144l1.544-9.781-0.050 0.306c0.106-0.694 0.7-1.2 1.4-1.2h2.919c5.731 0 10.219-2.325 11.531-9.063 0.038-0.2 0.075-0.394 0.1-0.581 0.387-2.487 0-4.188-1.35-5.719z"></path>
    </svg>`

  for (const el of document.querySelectorAll('.custom-icon')) {
    const width  = el.dataset.size.split('x')[0]
    const height = el.dataset.size.split('x')[1]
    let icon
    switch (el.dataset.icon) {
      case 'facebook':
        icon = iconFacebook(width, height)
        break;
      case 'twitter':
        icon = iconTwitter(width, height)
        break;
      case 'instagram':
        icon = iconInstagram(width, height)
        break;
      case 'gplus':
        icon = iconGplus(width, height)
        break;
      case 'paypal':
        icon = iconPaypal(width, height)
        break;
    }
    el.innerHTML = icon
  }
}

// Search demo
App.searchDemo = () => {
  const substringMatcher = function (strs) {
    return function findMatches(q, cb) {
      let matches = []
      // regex used to determine if a string contains the substring `q`
      var substrRegex = new RegExp(q, 'i')
      // iterate through the pool of strings and for any string that
      // contains the substring `q`, add it to the `matches` array
      $.each(strs, function (i, str) {
        if (substrRegex.test(str)) {
          matches.push(str)
        }
      })
      cb(matches)
    }
  }
  let products = [
    'Hanes Hooded Sweatshirt',
    'The Flash Logo T-Shirt',
    'Men\'s Buck Camp Flannel Shirt',
    'Jurassic Park Logo Men\'s T-Shirt',
    'Short-Sleeve Crewneck T-Shirt',
    'Slim-Fit Short-Sleeve Printed Shirt',
    'Legendary Whitetails Heavyweight Hoodie',
    'Casual Floral Print 3/4 Sleeve Shirt',
    'Open Front Cropped Cardigans',
    'Cotton Fleece Long Hoodie'
  ]

  $('#searchInput').typeahead({
    hint: true,
    highlight: true,
    minLength: 1
  },
  {
    name: 'search',
    source: substringMatcher(products)
  })
}

// Example show hide sign-in form, sign-up form, reset-form, reset-done
if (document.getElementById('signinModal')) {
  // Show sign-in content
  for (const el of document.querySelectorAll('.showSigninContent')) {
    el.addEventListener('click', (e) => {
      for (const el of signinModal.querySelectorAll('.modal-content')) {
        el.setAttribute('hidden', '')
      }
      signinContent.removeAttribute('hidden')
      signInEmailInput.focus()
      e.preventDefault()
    })
  }
  // Show sign-up content
  showSignupContent.addEventListener('click', (e) => {
    for (const el of signinModal.querySelectorAll('.modal-content')) {
      el.setAttribute('hidden', '')
    }
    signupContent.removeAttribute('hidden')
    signUpNameInput.focus()
    e.preventDefault()
  })
  // Show reset form content
  showResetContent.addEventListener('click', (e) => {
    for (const el of signinModal.querySelectorAll('.modal-content')) {
      el.setAttribute('hidden', '')
    }
    resetContent.removeAttribute('hidden')
    resetEmailInput.focus()
    e.preventDefault()
  })
  // Show reset done content
  formReset.addEventListener('submit', (e) => {
    for (const el of signinModal.querySelectorAll('.modal-content')) {
      el.setAttribute('hidden', '')
    }
    resetDoneContent.removeAttribute('hidden')
    e.preventDefault()
  })
}


$(() => {

  // Init template
  App.init()

  // Init apps
  App.searchDemo()
  App.customIcon()

  // Disable dropdown dynamic positioning, so that it's easy to add animation
  $('.dropdown-toggle').dropdown({
    display: 'static'
  })

  // Run tooltip & popover
  $('[data-toggle="tooltip"]').tooltip()
  $('[data-toggle="popover"]').popover()

  // Focus to email input when signin modal shown
  $('#signinModal').on('shown.bs.modal', () => {
    document.querySelector('.showSigninContent').click()
    signInEmailInput.focus()
  })

  // Focus to search input when search modal shown
  $('#searchModal').on('shown.bs.modal', () => {
    searchInput.focus()
  })

  // Metis Menu
  const menu = $('#menu').metisMenu()
  menu.on('show.metisMenu', () => {
    $('.no-sub').removeClass('mm-active')
  })

  // Close menu on large devices
  App.resize(function () {
    if (App.lgUp()) {
      $('#menuModal').modal('hide')
    }
  })()

})