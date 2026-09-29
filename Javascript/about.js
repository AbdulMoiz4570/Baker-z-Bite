(function liveTreatsCounter() {
      const el = document.getElementById('live-treats-counter');
      if (!el) return;

      let count = 50000 + Math.floor(Math.random() * 400);

      function render() {
        el.textContent = count.toLocaleString('en-US') + '+';
      }

      function scheduleNext() {
        const delay = 2500 + Math.random() * 4500;
        setTimeout(() => {
          count += Math.floor(Math.random() * 3) + 1;
          render();
          scheduleNext();
        }, delay);
      }

      render();
      scheduleNext();
    })();

const products = [
      { id: 'item-special-three-milk-cake', name: 'Three Milk Cake Slice', price: 1100, img: 'Images/Three_Milk_Cake_Slice.png', desc: 'Today only — our beloved three milk cake at a special price, soaked fresh this morning', category: 'special' },
      { id: 'item-special-double-choc-cookie', name: 'Double Chocolate Cookie Duo', price: 550, img: 'Images/Double_Chocolate_Cookie_Duo.png', desc: 'Two fudgy double chocolate cookies, warm from the oven, bundled at today\'s special price', category: 'special' },
      { id: 'item-special-strawberry-mini', name: 'Strawberry Mini Treat', price: 350, img: 'Images/Strawberry_Mini_Treat.png', desc: 'A fresh box of 12 strawberry buttercream minis, baked this morning and priced special for today', category: 'special' },
      { id: 'item-special-hot-chocolate', name: 'Rich Hot Chocolate', price: 380, img: 'Images/Rich_Hot_Chocolate.png', desc: 'Velvety melted chocolate topped with whipped cream — today\'s special sip to pair with your treats', category: 'special' },
      { id: 'item-kitkat-cake', name: 'Kitkat Cake', price: 1200, img: 'Images/KitkatCake.png', desc: 'Chocolate sponge wrapped in crisp Kitkat fingers with a rich chocolate drip', category: 'cupcakes' },
      { id: 'item-cheese-cake', name: 'Cheese Cake', price: 1200, img: 'Images/CheeseCake.png', desc: 'Creamy baked cheesecake on a buttery biscuit base with a smooth vanilla finish', category: 'cupcakes' },
      { id: 'item-three-milk-cake', name: 'Three Milk Cake', price: 1700, img: 'Images/ThreeMilkCake.png', desc: 'Soft sponge soaked in three kinds of milk, finished with a light whipped cream', category: 'cupcakes' },
      { id: 'item-nutella-cake', name: 'Nutella Cake', price: 1550, img: 'Images/NutellaCake.png', desc: 'Chocolate sponge layered with silky Nutella cream and a hazelnut chocolate glaze', category: 'cupcakes' },
      { id: 'item-red-velvet-cake', name: 'Red Velvet Cake', price: 1300, img: 'Images/RedVelvetCake.png', desc: 'Traditional rich red cocoa cake layered with smooth cream cheese frosting', category: 'cupcakes' },
      { id: 'item-chocolate-cake', name: 'Chocolate Cake', price: 1450, img: 'Images/ChocolateCake.png', desc: 'Dark chocolate cake filled with fudge lava and whipped chocolate frosting', category: 'cupcakes' },
      { id: 'item-chocolate-chip-cookie', name: 'Chocolate Chip Cookie', price: 380, img: 'Images/ChocolateChipCookie.png', desc: 'Warm, chewy brown butter cookie loaded with dark chocolate chunks', category: 'cookies' },
      { id: 'item-hazelnut-cookie', name: 'Hazel Nut Cookie', price: 450, img: 'Images/HazelNutCookie.png', desc: 'Buttery cookie packed with toasted hazelnuts and a hint of cocoa', category: 'cookies' },
      { id: 'item-almond-cookie', name: 'Almond Cookie', price: 370, img: 'Images/AlmondCookie.png', desc: 'Crisp cookie studded with sliced almonds and a delicate almond aroma', category: 'cookies' },
      { id: 'item-classic-cookie', name: 'Classic Cookie', price: 300, img: 'Images/Classic Cookie.png', desc: 'A simple, buttery classic cookie baked golden with a soft centre', category: 'cookies' },
      { id: 'item-double-chocolate-cookie', name: 'Double Chocolate Cookie', price: 450, img: 'Images/DoubleChocolateCookie.png', desc: 'Loaded with cocoa and chocolate chunks for a rich, fudgy bite', category: 'cookies' },
      { id: 'item-peanut-cookie', name: 'Peanut Cookie', price: 370, img: 'Images/PeanutCookie.png', desc: 'Crumbly cookie packed with roasted peanuts and a nutty finish', category: 'cookies' },
      { id: 'item-caramel-latte', name: 'Caramel Latte', price: 950, img: 'Images/CaramelLatte.png', desc: 'Smooth espresso and steamed milk finished with house-made caramel', category: 'beverages' },
      { id: 'item-cappuccino', name: 'Cappuccino', price: 880, img: 'Images/Cappuccino.png', desc: 'Bold espresso topped with steamed milk foam and a dusting of cocoa', category: 'beverages' },
      { id: 'item-iced-latte', name: 'Iced Latte', price: 820, img: 'Images/IcedLatte.png', desc: 'Cold-brewed coffee over ice with vanilla bean syrup and cream', category: 'beverages' },
      { id: 'item-latte', name: 'Latte', price: 780, img: 'Images/Latte.png', desc: 'Smooth espresso balanced with steamed milk for a mellow, creamy cup', category: 'beverages' },
      { id: 'item-hot-chocolate', name: 'Hot Chocolate', price: 620, img: 'Images/HotChocolate.png', desc: 'Rich melted chocolate topped with whipped cream and a dusting of cocoa', category: 'beverages' },
      { id: 'item-assorted-mini-box', name: 'Assorted Mini Box', price: 500, img: 'Images/LotusMini.png', desc: 'Box of 12 bite-sized signature cupcakes featuring our top popular flavors', category: 'minis' },
      { id: 'item-red-velvet-mini', name: 'Red Velvet Mini', price: 500, img: 'Images/RedVelvetMini.png', desc: 'Box of 12 miniature red velvet cupcakes topped with cream cheese frosting', category: 'minis' },
      { id: 'item-strawberry-mini', name: 'Strawberry Mini', price: 500, img: 'Images/StrawberryMini.png', desc: 'Box of 12 mini cupcakes topped with fresh strawberry buttercream', category: 'minis' },
      { id: 'item-blueberry-mini', name: 'Blueberry Mini', price: 500, img: 'Images/BlueberryMini.png', desc: 'Box of 12 mini cupcakes swirled with blueberry compote and cream', category: 'minis' },
      { id: 'item-bakerz-mug', name: 'Bakerz Bite Mugs', price: 950, img: 'Images/Mugs.png', desc: 'Ceramic mug printed with the bakery logo, perfect for your morning coffee', category: 'merchandise' },
      { id: 'item-bakerz-bag', name: 'Bakerz Bite Bags', price: 1200, img: 'Images/Purse.png', desc: 'Reusable canvas tote bag with the bakery print, great for gifting', category: 'merchandise' },
      { id: 'item-bakerz-glasses', name: 'Bakerz Bite Glasses', price: 1100, img: 'Images/Jug.png', desc: 'Etched glass set featuring the bakery logo, perfect for iced coffee', category: 'merchandise' },
      { id: 'item-bakerz-tray', name: 'Bakerz Bite Trays', price: 1250, img: 'Images/Trays.png', desc: 'Wooden serving tray branded with the bakery logo', category: 'merchandise' }
    ];

const CART_STORAGE_KEY = 'bakerzBiteCart';

let cart = loadCart();

function loadCart() {
      try {
        const saved = JSON.parse(localStorage.getItem(CART_STORAGE_KEY));
        return Array.isArray(saved) ? saved : [];
      } catch (e) {
        return [];
      }
    }

function saveCart() {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
      } catch (e) {
      }
    }

function updateCartUI() {
      const cartCountEl = document.getElementById('cart-count');
      const cartItemsEl = document.getElementById('cart-items');
      const cartTotalEl = document.getElementById('cart-total-price');

      saveCart();

      const totalQty = cart.reduce((acc, item) => acc + item.qty, 0);

      if (totalQty > 0) {
        cartCountEl.style.display = "flex";
        cartCountEl.innerText = totalQty;
      } else {
        cartCountEl.style.display = "none";
        cartCountEl.innerText = "0";
      }

      if (cart.length === 0) {
        cartItemsEl.innerHTML = `
          <div class="cart-empty-msg">
            <i class="fa-solid fa-cookie-bite"></i>
            <span>Your cart is empty.<br>Treat yourself to something sweet!</span>
          </div>`;
        cartTotalEl.innerText = "Rs. 0";
        return;
      }

      let itemsHTML = '';
      let grandTotal = 0;

      cart.forEach((item, idx) => {
        grandTotal += item.price * item.qty;
        itemsHTML += `
          <div class="cart-item">
            <img src="${item.img}" class="cart-item-img" alt="${item.title}">
            <div class="cart-item-details">
              <div class="cart-item-title">${item.title}</div>
              <div class="cart-item-price">Rs. ${item.price.toLocaleString()}</div>
              <div class="cart-qty-controls">
                <button class="qty-btn" onclick="changeQty(${idx}, -1)">-</button>
                <span class="cart-item-qty">${item.qty}</span>
                <button class="qty-btn" onclick="changeQty(${idx}, 1)">+</button>
              </div>
            </div>
            <i class="fa-solid fa-trash-can remove-cart-item" onclick="removeItem(${idx})"></i>
          </div>
        `;
      });

      cartItemsEl.innerHTML = itemsHTML;
      cartTotalEl.innerText = `Rs. ${grandTotal.toLocaleString()}`;
    }

function changeQty(index, change) {
      cart[index].qty += change;
      if (cart[index].qty <= 0) cart.splice(index, 1);
      updateCartUI();
    }

function removeItem(index) {
      cart.splice(index, 1);
      updateCartUI();
    }

function checkout() {
      if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
      }
      alert("Thank you for your order! Proceeding to payment portal.");
      cart = [];
      updateCartUI();
      toggleCart(false);
    }

const cartBtn = document.getElementById('cart-btn');

const closeCartBtn = document.getElementById('close-cart');

const cartDrawer = document.getElementById('cart-drawer');

const cartOverlay = document.getElementById('cart-overlay');

function toggleCart(open) {
      cartDrawer.classList.toggle('open', open);
      cartOverlay.classList.toggle('open', open);
    }

cartBtn.addEventListener('click', () => toggleCart(true));

closeCartBtn.addEventListener('click', () => toggleCart(false));

cartOverlay.addEventListener('click', () => toggleCart(false));

updateCartUI();

const searchBtn = document.getElementById('search-btn');

const closeSearchBtn = document.getElementById('close-search');

const searchOverlay = document.getElementById('search-overlay');

const searchInput = document.getElementById('search-input');

const searchResults = document.getElementById('search-results');

function toggleSearch(open) {
      if (open) {
        searchOverlay.classList.add('open');
        setTimeout(() => searchInput.focus(), 300);
      } else {
        searchOverlay.classList.remove('open');
        searchInput.value = '';
        searchResults.innerHTML = '';
      }
    }

searchBtn.addEventListener('click', () => toggleSearch(true));

closeSearchBtn.addEventListener('click', () => toggleSearch(false));

function handleSearch() {
      const query = searchInput.value.trim().toLowerCase();
      if (!query) {
        searchResults.innerHTML = '';
        return;
      }

      const filtered = products.filter(p => p.name.toLowerCase().includes(query) || p.desc.toLowerCase().includes(query));

      if (filtered.length === 0) {
        searchResults.innerHTML = `<div style="padding: 15px; text-align: center; color: #6B4E45; font-weight: 600;">No sweet treats found matching "${query}"</div>`;
        return;
      }

      let html = '';
      filtered.forEach(item => {
        html += `
          <div class="search-result-item" onclick="selectSearchResult('${item.id}')">
            <img src="${item.img}" alt="${item.name}">
            <div class="search-result-info">
              <h5>${item.name}</h5>
              <p>${item.desc}</p>
            </div>
            <div class="search-result-price">Rs. ${item.price.toLocaleString()}</div>
          </div>
        `;
      });
      searchResults.innerHTML = html;
    }

function selectSearchResult(elementId) {
      toggleSearch(false);
      window.location.href = `index.html#${elementId}`;
    }

const BAKERY_CONFIG = {
      lat: 24.8607,
      lng: 67.0011,
      deliveryRadiusKm: 8
    };

const AREA_DISTANCES_KM = {
      "Saddar": 3,
      "Clifton": 6,
      "Defence (DHA)": 9,
      "Gulshan-e-Iqbal": 11,
      "North Nazimabad": 13,
      "Malir": 18,
      "Korangi": 15,
      "Gulistan-e-Johar": 14
    };

const locationBtn = document.getElementById('location-btn');

const locationMapIframe = document.getElementById('location-map-iframe');

locationMapIframe.src = `https://www.google.com/maps?q=${BAKERY_CONFIG.lat},${BAKERY_CONFIG.lng}&z=15&output=embed`;

const locationOverlay = document.getElementById('location-overlay');

const locationClose = document.getElementById('location-close');

const locationCheckBtn = document.getElementById('location-check-btn');

const locationSpinner = document.getElementById('location-spinner');

const locationBtnLabel = document.getElementById('location-btn-label');

const locationResult = document.getElementById('location-result');

const areaSelect = document.getElementById('area-select');

const areaCheckBtn = document.getElementById('area-check-btn');

function toggleLocationModal(open) {
      if (open) {
        locationOverlay.classList.add('open');
      } else {
        locationOverlay.classList.remove('open');
        locationResult.className = 'location-result';
        locationResult.innerHTML = '';
        locationBtnLabel.innerHTML = '<i class="fa-solid fa-location-crosshairs"></i> Use My Location';
        areaSelect.selectedIndex = 0;
      }
    }

function haversineKm(lat1, lon1, lat2, lon2) {
      const R = 6371;
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a = Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) ** 2;
      return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }

function setLocationLoading(isLoading) {
      locationCheckBtn.disabled = isLoading;
      locationSpinner.style.display = isLoading ? 'inline-block' : 'none';
      locationBtnLabel.innerHTML = isLoading
        ? 'Locating you…'
        : '<i class="fa-solid fa-location-crosshairs"></i> Use My Location';
    }

function showDeliveryResult(distanceKm, areaLabel) {
      const rounded = distanceKm.toFixed(1);
      const whereText = areaLabel ? `${areaLabel} is` : "You're";

      if (distanceKm <= BAKERY_CONFIG.deliveryRadiusKm) {
        locationResult.className = 'location-result show in-range';
        locationResult.innerHTML = `<strong>Great news!</strong>${whereText} about ${rounded} km away — we deliver there.`;
      } else {
        locationResult.className = 'location-result show out-range';
        locationResult.innerHTML = `<strong>Just outside our zone</strong>${whereText} about ${rounded} km away, a little beyond our ${BAKERY_CONFIG.deliveryRadiusKm} km delivery range. Pickup at the shop is still available!`;
      }
    }

function handleLocationSuccess(position) {
      setLocationLoading(false);
      const { latitude, longitude } = position.coords;
      showDeliveryResult(haversineKm(latitude, longitude, BAKERY_CONFIG.lat, BAKERY_CONFIG.lng));
    }

function handleLocationError(error) {
      setLocationLoading(false);
      let message = "We couldn't get your location — please try again.";
      if (error.code === error.PERMISSION_DENIED) {
        message = "Location access was denied. Please enable location permissions for this site to check delivery.";
      } else if (error.code === error.POSITION_UNAVAILABLE) {
        message = "Your location isn't available right now. Check your device's location settings and try again.";
      } else if (error.code === error.TIMEOUT) {
        message = "That took too long. Please try again.";
      }
      locationResult.className = 'location-result show error';
      locationResult.innerHTML = `<strong>Couldn't check delivery</strong>${message}`;
    }

locationBtn.addEventListener('click', () => toggleLocationModal(true));

locationClose.addEventListener('click', () => toggleLocationModal(false));

locationOverlay.addEventListener('click', (e) => {
      if (e.target === locationOverlay) toggleLocationModal(false);
    });

locationCheckBtn.addEventListener('click', () => {
      if (!navigator.geolocation) {
        locationResult.className = 'location-result show error';
        locationResult.innerHTML = "<strong>Not supported</strong>Your browser doesn't support location detection.";
        return;
      }
      setLocationLoading(true);
      navigator.geolocation.getCurrentPosition(handleLocationSuccess, handleLocationError, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      });
    });

areaCheckBtn.addEventListener('click', () => {
      const selectedArea = areaSelect.value;
      if (!selectedArea) {
        locationResult.className = 'location-result show error';
        locationResult.innerHTML = "<strong>Pick an area</strong>Please select your area from the list first.";
        return;
      }
      showDeliveryResult(AREA_DISTANCES_KM[selectedArea], selectedArea);
    });

document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      toggleSearch(false);
      toggleCart(false);
      toggleLocationModal(false);
    });
