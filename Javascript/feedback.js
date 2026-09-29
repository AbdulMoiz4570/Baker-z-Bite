(function feedbackForm() {
      const form = document.getElementById('feedback-form');
      const submitBtn = document.getElementById('fb-submit');
      const progressLine = document.getElementById('form-progress');
      const successPanel = document.getElementById('feedback-success');
      const successName = document.getElementById('success-name');
      const successRef = document.getElementById('success-ref');
      const successCategory = document.getElementById('success-category');
      const successRating = document.getElementById('success-rating');

      const fields = {
        name: document.getElementById('fb-name'),
        email: document.getElementById('fb-email'),
        phone: document.getElementById('fb-phone'),
        order: document.getElementById('fb-order'),
        category: document.getElementById('fb-category'),
        message: document.getElementById('fb-message'),
      };

      const helpEls = {
        name: document.getElementById('fb-name-help'),
        email: document.getElementById('fb-email-help'),
        phone: document.getElementById('fb-phone-help'),
        order: document.getElementById('fb-order-help'),
        category: document.getElementById('fb-category-help'),
        rating: document.getElementById('fb-rating-help'),
        message: document.getElementById('fb-message-help'),
      };

      const groupEls = {
        name: fields.name.closest('.field-group'),
        email: fields.email.closest('.field-group'),
        phone: fields.phone.closest('.field-group'),
        order: fields.order.closest('.field-group'),
        category: fields.category.closest('.field-group'),
        rating: document.querySelector('.field-group[data-field="rating"]'),
        message: fields.message.closest('.field-group'),
      };

      const messageCounter = document.getElementById('fb-message-counter');
      const ratingCaption = document.getElementById('rating-caption');
      const starInputs = Array.from(document.querySelectorAll('input[name="rating"]'));

      const DEFAULT_HELP = {
        name: 'Let us know who to thank.',
        email: "We'll only use this to follow up if needed.",
        phone: "In case we'd like to talk it through.",
        order: 'Helps us find your order faster.',
        category: 'Pick the option that fits best.',
        rating: 'Tap a star to rate your experience.',
        message: 'Minimum 15 characters.',
      };

      const RATING_LABELS = { 1: 'Not great', 2: 'Could be better', 3: 'It was okay', 4: 'Really good', 5: 'Loved it!' };

      function debounce(fn, delay) {
        let t;
        return (...args) => {
          clearTimeout(t);
          t = setTimeout(() => fn(...args), delay);
        };
      }

      function collapseSpaces(str) {
        return str.replace(/\s+/g, ' ');
      }

      function generateReference() {
        const stamp = Date.now().toString(36).toUpperCase().slice(-4);
        const rand = Math.random().toString(36).toUpperCase().slice(2, 5);
        return `FB-${stamp}${rand}`;
      }

      function renderStarSummary(rating) {
        const filled = '★'.repeat(rating);
        const empty = '☆'.repeat(5 - rating);
        return `<span class="stars-display">${filled}${empty}</span> (${rating}/5)`;
      }

      function editDistance(a, b) {
        const m = a.length, n = b.length;
        const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
        for (let i = 0; i <= m; i++) dp[i][0] = i;
        for (let j = 0; j <= n; j++) dp[0][j] = j;
        for (let i = 1; i <= m; i++) {
          for (let j = 1; j <= n; j++) {
            dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
          }
        }
        return dp[m][n];
      }

      const COMMON_DOMAINS = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com', 'live.com'];

      function suggestDomain(domain) {
        let best = null, bestDist = Infinity;
        COMMON_DOMAINS.forEach((d) => {
          const dist = editDistance(domain.toLowerCase(), d);
          if (dist < bestDist) { bestDist = dist; best = d; }
        });
        return bestDist > 0 && bestDist <= 2 && best !== domain.toLowerCase() ? best : null;
      }

      function hasRepeatedCharSpam(str) {
        return /(.)\1{4,}/.test(str);
      }

      function uniqueCharRatio(str) {
        const letters = str.replace(/[^a-zA-Z]/g, '').toLowerCase();
        if (!letters.length) return 1;
        return new Set(letters).size / letters.length;
      }

      function isRepeatedWordSpam(str) {
        const words = str.trim().toLowerCase().split(/\s+/).filter(Boolean);
        if (words.length < 5) return false;
        const unique = new Set(words);
        return unique.size / words.length < 0.3;
      }

      function validateName() {
        const raw = fields.name.value;
        const value = collapseSpaces(raw.trim());
        if (!value) return { valid: false, message: 'Please tell us your name.' };
        if (value.length < 2) return { valid: false, message: 'That name looks a little short.' };
        if (value.length > 60) return { valid: false, message: 'Name is too long — try a shorter version.' };
        if (!/^[A-Za-z\u00C0-\u017F][A-Za-z\u00C0-\u017F' -]*$/.test(value)) {
          return { valid: false, message: 'Letters, spaces, apostrophes and hyphens only, please.' };
        }
        if (hasRepeatedCharSpam(value)) return { valid: false, message: "That doesn't look like a real name." };
        const letters = value.replace(/[^A-Za-z]/g, '');
        if (letters.length >= 3 && uniqueCharRatio(value) < 0.4) {
          return { valid: false, message: "That doesn't look like a real name." };
        }
        return { valid: true, message: `Thanks, ${value.split(' ')[0]}!` };
      }

      function validateEmail() {
        const value = fields.email.value.trim();
        if (!value) return { valid: false, message: 'An email helps us follow up with you.' };
        if (/\s/.test(value)) return { valid: false, message: 'Email addresses can\'t contain spaces.' };
        if (/\.\./.test(value)) return { valid: false, message: 'Check that email — it has two dots in a row.' };
        const structural = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}$/;
        if (!structural.test(value)) return { valid: false, message: 'That email address doesn\'t look complete.' };
        const [local, domain] = value.split('@');
        if (local.startsWith('.') || local.endsWith('.')) {
          return { valid: false, message: 'Email can\'t start or end with a dot before the @.' };
        }
        const domainSuggestion = suggestDomain(domain);
        if (domainSuggestion) {
          return { valid: true, message: `Looks valid. Did you mean ${local}@${domainSuggestion}?`, suggestion: `${local}@${domainSuggestion}` };
        }
        return { valid: true, message: 'Looks good.' };
      }

      function validatePhone() {
        const value = fields.phone.value.trim();
        if (!value) return { valid: true, message: DEFAULT_HELP.phone };
        if (!/^[0-9+\-\s()]+$/.test(value)) {
          return { valid: false, message: 'Only digits, spaces, +, -, and ( ) are allowed.' };
        }
        const digits = value.replace(/[^0-9]/g, '');
        if (digits.length < 7 || digits.length > 15) {
          return { valid: false, message: 'Enter a valid phone number (7–15 digits).' };
        }
        return { valid: true, message: 'Looks good.' };
      }

      function validateOrder() {
        const value = fields.order.value.trim();
        if (!value) return { valid: true, message: DEFAULT_HELP.order };
        if (!/^[A-Za-z0-9#-]{3,20}$/.test(value)) {
          return { valid: false, message: 'Order numbers are usually short — letters, numbers, # and - only.' };
        }
        return { valid: true, message: 'Got it.' };
      }

      function validateCategory() {
        const value = fields.category.value;
        if (!value) return { valid: false, message: 'Please choose what this feedback is about.' };
        return { valid: true, message: 'Thanks for letting us know.' };
      }

      function validateRating() {
        const checked = starInputs.find((r) => r.checked);
        if (!checked) return { valid: false, message: 'Please pick a star rating.' };
        return { valid: true, message: RATING_LABELS[checked.value] || 'Thanks!' };
      }

      function validateMessage() {
        const raw = fields.message.value;
        const value = raw.trim();
        if (!value) return { valid: false, message: `Minimum 15 characters. (${DEFAULT_HELP.message})` };
        if (value.length < 15) return { valid: false, message: `A little more detail helps — ${15 - value.length} more character(s) needed.` };
        if (value.length > 600) return { valid: false, message: 'Please keep it under 600 characters.' };
        if (!/[A-Za-z]/.test(value)) return { valid: false, message: 'Please write your feedback using words.' };
        if (hasRepeatedCharSpam(value)) return { valid: false, message: 'That looks like accidental repeated characters — mind rewriting it?' };
        if (isRepeatedWordSpam(value)) return { valid: false, message: 'Try describing your experience rather than repeating the same word.' };
        return { valid: true, message: 'Thanks for the detail!' };
      }

      const VALIDATORS = {
        name: validateName,
        email: validateEmail,
        phone: validatePhone,
        order: validateOrder,
        category: validateCategory,
        rating: validateRating,
        message: validateMessage,
      };

      const fieldState = { name: false, email: false, phone: true, order: true, category: false, rating: false, message: false };

      function applyResult(key, result) {
        const group = groupEls[key];
        const help = helpEls[key];
        group.classList.add('touched');
        group.classList.toggle('valid', result.valid);
        group.classList.toggle('invalid', !result.valid);

        if (result.suggestion) {
          help.innerHTML = `Looks valid. Did you mean <span class="field-help suggestion" id="email-suggest-link" style="display:inline">${result.suggestion}</span>?`;
          const link = help.querySelector('#email-suggest-link');
          if (link) {
            link.addEventListener('click', () => {
              fields.email.value = result.suggestion;
              runValidation('email');
              fields.email.focus();
            });
          }
        } else {
          help.textContent = result.message || DEFAULT_HELP[key];
        }

        fieldState[key] = result.valid;
        updateSubmitState();
      }

      function runValidation(key) {
        const result = VALIDATORS[key]();
        applyResult(key, result);
        return result.valid;
      }

      function updateSubmitState() {
        const allValid = Object.values(fieldState).every(Boolean);
        submitBtn.disabled = !allValid;
        const remaining = Object.entries(fieldState).filter(([, v]) => !v).map(([k]) => k);
        progressLine.textContent = allValid
          ? "You're all set — ready to send!"
          : `Fill in the required fields to enable submission.`;
      }

      const debouncedValidators = {};
      ['name', 'email', 'phone', 'order', 'message'].forEach((key) => {
        debouncedValidators[key] = debounce(() => runValidation(key), 220);
        fields[key].addEventListener('input', () => {
          if (key === 'message') updateCounter();
          debouncedValidators[key]();
        });
        fields[key].addEventListener('blur', () => runValidation(key));
      });

      fields.category.addEventListener('change', () => runValidation('category'));

      starInputs.forEach((input) => {
        input.addEventListener('change', () => {
          ratingCaption.textContent = RATING_LABELS[input.value] || 'Rated';
          runValidation('rating');
        });
      });

      function updateCounter() {
        const len = fields.message.value.length;
        messageCounter.textContent = `${len} / 600`;
        messageCounter.classList.toggle('warn', len > 480 && len <= 600);
        messageCounter.classList.toggle('danger', len > 600);
      }

      form.addEventListener('submit', (e) => {
        e.preventDefault();

        const keys = ['name', 'email', 'phone', 'order', 'category', 'rating', 'message'];
        let firstInvalid = null;
        keys.forEach((key) => {
          const ok = runValidation(key);
          if (!ok && !firstInvalid) firstInvalid = key;
        });

        if (firstInvalid) {
          const el = groupEls[firstInvalid].querySelector('input, select, textarea') || groupEls[firstInvalid];
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          if (el.focus) el.focus();
          return;
        }

        const payload = {
          name: collapseSpaces(fields.name.value.trim()),
          email: fields.email.value.trim(),
          phone: fields.phone.value.trim(),
          order: fields.order.value.trim(),
          category: fields.category.value,
          rating: (starInputs.find((r) => r.checked) || {}).value || null,
          message: fields.message.value.trim(),
        };

        console.log('Feedback submitted:', payload);

        successName.textContent = payload.name.split(' ')[0] || 'friend';
        successRef.textContent = generateReference();
        successCategory.textContent = fields.category.options[fields.category.selectedIndex]?.text || '—';
        successRating.innerHTML = payload.rating ? renderStarSummary(Number(payload.rating)) : '—';
        form.classList.add('hide');
        successPanel.classList.add('show');
      });

      document.getElementById('submit-another').addEventListener('click', () => {
        form.reset();
        Object.values(groupEls).forEach((g) => g.classList.remove('touched', 'valid', 'invalid'));
        Object.keys(helpEls).forEach((k) => { helpEls[k].textContent = DEFAULT_HELP[k]; });
        ratingCaption.textContent = 'Not yet rated';
        updateCounter();
        fieldState.name = false;
        fieldState.email = false;
        fieldState.phone = true;
        fieldState.order = true;
        fieldState.category = false;
        fieldState.rating = false;
        fieldState.message = false;
        updateSubmitState();
        successPanel.classList.remove('show');
        form.classList.remove('hide');
        fields.name.focus();
      });

      updateCounter();
      updateSubmitState();
    })();
