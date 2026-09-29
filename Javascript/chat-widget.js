(function bakerzBiteAssistant() {
      const chatToggleBtn = document.getElementById('chat-toggle-btn');
      const chatPanel = document.getElementById('chat-panel');
      const chatPanelClose = document.getElementById('chat-panel-close');
      const chatPanelReset = document.getElementById('chat-panel-reset');
      const chatMessages = document.getElementById('chat-panel-messages');
      const chatInput = document.getElementById('chat-panel-input');
      const chatSendBtn = document.getElementById('chat-panel-send');
      const chatSubtitle = document.getElementById('chat-subtitle');

      const SHOP_NAME = "Baker'z Bite";

      function readContactInfo() {
        const info = { email: '', phone: '', address: '', hours: '' };
        document.querySelectorAll('.footer-contact li').forEach((li) => {
          const icon = li.querySelector('i');
          const text = (li.querySelector('span')?.textContent || '').trim();
          if (!icon || !text) return;
          if (icon.classList.contains('fa-envelope')) info.email = text;
          else if (icon.classList.contains('fa-location-dot')) info.address = text;
          else if (icon.classList.contains('fa-phone')) info.phone = text;
          else if (icon.classList.contains('fa-clock')) info.hours = text;
        });
        return info;
      }

      const TODAYS_SPECIAL_ITEMS = [
        { name: "Three Milk Cake Slice", price: 1100, priceText: "Rs. 1100", desc: "Today only — our beloved three milk cake at a special price, soaked fresh this morning.", badge: "Today's Special", category: 'special' },
        { name: "Double Chocolate Cookie Duo", price: 550, priceText: "Rs. 550", desc: "Two fudgy double chocolate cookies, warm from the oven, bundled at today's special price.", badge: "Today's Special", category: 'special' },
        { name: "Strawberry Mini Treat", price: 350, priceText: "Rs. 350", desc: "A fresh box of 12 strawberry buttercream minis, baked this morning and priced special for today.", badge: "Today's Special", category: 'special' },
        { name: "Rich Hot Chocolate", price: 380, priceText: "Rs. 380", desc: "Velvety melted chocolate topped with whipped cream — today's special sip to pair with your treats.", badge: "Today's Special", category: 'special' },
      ];

      function readMenu() {
        const items = [];
        document.querySelectorAll('.menu-category').forEach((cat) => {
          const category = cat.getAttribute('data-category') || '';
          cat.querySelectorAll('.card').forEach((card) => {
            const name = card.querySelector('.item-title')?.textContent.trim() || '';
            const priceText = card.querySelector('.item-price')?.textContent.trim() || '';
            const price = parseInt(priceText.replace(/[^\d]/g, ''), 10) || null;
            const desc = card.querySelector('.item-desc')?.textContent.trim() || '';
            const badge = card.querySelector('.badge')?.textContent.trim() || '';
            if (name) items.push({ name, price, priceText, desc, badge, category, el: card });
          });
        });
        if (!items.some((i) => i.category === 'special')) {
          items.push(...TODAYS_SPECIAL_ITEMS);
        }
        return items;
      }

      let CONTACT = null;
      let MENU = null;

      function ensureKnowledgeLoaded() {
        if (!CONTACT) CONTACT = readContactInfo();
        if (!MENU) MENU = readMenu();
      }

      const STOPWORDS = new Set(['a', 'an', 'the', 'is', 'are', 'do', 'does', 'you', 'your', 'i', 'my', 'me',
        'to', 'for', 'of', 'on', 'in', 'at', 'it', 'this', 'that', 'can', 'please', 'and', 'or', 'have', 'has',
        'what', 'whats', "what's", 'how', 'about', 'there', 'be', 'with', 'im', "i'm", 'want', 'would', 'like']);

      function normalize(str) {
        return str.toLowerCase().replace(/[^\w\s'-]/g, ' ').replace(/\s+/g, ' ').trim();
      }

      function tokenize(str) {
        return normalize(str).split(' ').filter(Boolean);
      }

      function meaningfulTokens(tokens) {
        const out = tokens.filter((t) => !STOPWORDS.has(t) && t.length > 1);
        return out.length ? out : tokens;
      }

      function editDistance(a, b) {
        if (a === b) return 0;
        const m = a.length, n = b.length;
        if (!m) return n;
        if (!n) return m;
        const dp = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)]);
        for (let j = 0; j <= n; j++) dp[0][j] = j;
        for (let i = 1; i <= m; i++) {
          for (let j = 1; j <= n; j++) {
            dp[i][j] = a[i - 1] === b[j - 1]
              ? dp[i - 1][j - 1]
              : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
          }
        }
        return dp[m][n];
      }

      function fuzzyMatches(token, keyword) {
        if (token === keyword) return true;
        if (token.length > 3 && (token.startsWith(keyword) || keyword.startsWith(token))) return true;
        const tolerance = keyword.length >= 7 ? 2 : keyword.length >= 5 ? 1 : 0;
        return editDistance(token, keyword) <= tolerance;
      }

      const INTENTS = [
        {
          name: 'greeting',
          weight: 1,
          keywords: ['hi', 'hello', 'hey', 'yo', 'salam', 'assalamualaikum', 'morning', 'evening', 'afternoon'],
        },
        {
          name: 'thanks',
          weight: 1,
          keywords: ['thank', 'thanks', 'thankyou', 'appreciate', 'cool', 'great', 'awesome', 'nice', 'perfect'],
        },
        {
          name: 'farewell',
          weight: 1,
          keywords: ['bye', 'goodbye', 'seeya', 'later', 'cya'],
        },
        {
          name: 'hours',
          weight: 2,
          keywords: ['hour', 'hours', 'open', 'opening', 'close', 'closing', 'timing', 'timings', 'time', 'today',
            'weekend', 'sunday', 'saturday', 'schedule'],
        },
        {
          name: 'delivery_area',
          weight: 3,
          keywords: ['deliver', 'delivery', 'delivers', 'delivering', 'ship', 'reach', 'zone', 'radius', 'area',
            'karachi', 'clifton', 'saddar', 'malir', 'korangi', 'defence', 'dha', 'nazimabad', 'gulshan', 'johar'],
        },
        {
          name: 'location',
          weight: 2,
          keywords: ['address', 'location', 'located', 'shop', 'store', 'where', 'map', 'directions', 'visit'],
        },
        {
          name: 'contact',
          weight: 2,
          keywords: ['contact', 'phone', 'call', 'number', 'whatsapp', 'email', 'reach', 'talk', 'human', 'agent',
            'representative', 'someone'],
        },
        {
          name: 'order_help',
          weight: 2,
          keywords: ['order', 'ordering', 'checkout', 'pickup', 'pick', 'cart', 'buy', 'purchase', 'payment', 'pay'],
        },
        {
          name: 'custom_cake',
          weight: 3,
          keywords: ['custom', 'birthday', 'wedding', 'bulk', 'party', 'event', 'celebration', 'theme', 'personalized',
            'engagement', 'anniversary'],
        },
        {
          name: 'ingredients',
          weight: 3,
          keywords: ['ingredient', 'ingredients', 'allerg', 'allergic', 'gluten', 'nut', 'egg', 'vegan', 'preservative',
            'fresh', 'quality', 'halal'],
        },
        {
          name: 'offers',
          weight: 2,
          keywords: ['offer', 'offers', 'discount', 'deal', 'deals', 'promo', 'promotion', 'coupon', 'sale'],
        },
        {
          name: 'recommend',
          weight: 3,
          keywords: ['recommend', 'suggestion', 'suggest', 'best', 'popular', 'bestseller', 'favorite', 'favourite',
            'top', 'special'],
        },
        {
          name: 'complaint',
          weight: 4,
          keywords: ['bad', 'worst', 'terrible', 'awful', 'stale', 'cold', 'late', 'rude', 'disappointed', 'refund',
            'complaint', 'complain', 'wrong', 'missing', 'problem', 'issue', 'unhappy', 'never', 'suck', 'sucks',
            'sucked', 'hate', 'hated', 'horrible', 'disgusting'],
        },
        {
          name: 'menu_general',
          weight: 1,
          keywords: ['menu', 'items', 'options', 'flavors', 'flavours', 'selection', 'range', 'catalog',
            'cupcake', 'cupcakes', 'cookie', 'cookies', 'beverage', 'beverages', 'drink', 'drinks', 'mini', 'minis',
            'price', 'prices', 'cost', 'rate', 'rates'],
        },
      ];

      function scoreIntents(tokens) {
        const scores = {};
        INTENTS.forEach((intent) => {
          let score = 0;
          intent.keywords.forEach((kw) => {
            tokens.forEach((tok) => {
              if (fuzzyMatches(tok, kw)) score += intent.weight;
            });
          });
          if (score > 0) scores[intent.name] = score;
        });
        return scores;
      }

      function findMenuItem(tokens) {
        const meaningful = meaningfulTokens(tokens);
        let best = null;
        let bestScore = 0;
        MENU.forEach((item) => {
          const nameTokens = tokenize(item.name);
          let score = 0;
          nameTokens.forEach((nt) => {
            meaningful.forEach((tok) => {
              if (fuzzyMatches(tok, nt)) score += nt.length > 3 ? 2 : 1;
            });
          });
          if (score > bestScore) {
            bestScore = score;
            best = item;
          }
        });
        return bestScore >= 2 ? best : null;
      }

      function findCategoryMention(tokens) {
        const map = {
          special: ['special', 'specials'],
          cupcakes: ['cupcake', 'cupcakes'],
          cookies: ['cookie', 'cookies'],
          beverages: ['beverage', 'beverages', 'drink', 'drinks', 'coffee', 'tea', 'latte'],
          minis: ['mini', 'minis', 'bite', 'bites'],
        };
        for (const [cat, words] of Object.entries(map)) {
          if (tokens.some((t) => words.some((w) => fuzzyMatches(t, w)))) return cat;
        }
        return null;
      }

      const BLOCKED_TERMS = [
        'fuck', 'shit', 'bitch', 'asshole', 'bastard', 'cunt', 'dick', 'piss',
        'slut', 'whore', 'douchebag', 'motherfucker', 'nigger', 'nigga',
        'faggot', 'fag', 'retard', 'chink', 'spic', 'kike', 'paki', 'tranny',
        'coon', 'gook',
      ];

      const LEET_MAP = { '0': 'o', '1': 'i', '3': 'e', '4': 'a', '5': 's', '7': 't', '@': 'a', '$': 's' };

      function normalizeForModeration(raw) {
        return raw
          .toLowerCase()
          .split('')
          .map((ch) => LEET_MAP[ch] || ch)
          .join('')
          .replace(/[^a-z\s]/g, ' ');
      }

      function collapseRepeats(s) {
        return s.replace(/(.)\1+/g, '$1');
      }

      function containsBlockedTerm(raw) {
        const normalized = normalizeForModeration(raw);
        const collapsedSpaced = collapseRepeats(normalized);
        const collapsedTight = collapsedSpaced.replace(/\s+/g, '');
        return BLOCKED_TERMS.some((term) => {
          const t = collapseRepeats(term);
          return collapsedSpaced.includes(t) || collapsedTight.includes(t);
        });
      }

      const state = {
        started: false,
        turns: 0,
        fallbacks: 0,
        lastIntent: null,
        lastItem: null,
        lastCategory: null,
        awaitingComplaintDetail: false,
        moderationWarnings: 0,
      };

      function detectWellbeingQuestion(text) {
        return /\bhow\s+(are|r)\s+(you|u)\b/.test(text)
          || /\bhow('?s| is| are) (it going|things|everything)\b/.test(text)
          || /\byou (doing|feeling) (ok|okay|good|alright|well)\b/.test(text);
      }

      function detectReputationQuestion(text) {
        const asksIfGood = /\b(is|are)\b[^?]*\b(good|great|worth it|legit|any good|the best|nice|reliable)\b/.test(text);
        const mentionsPlace = /\b(bakery|place|shop|store|food|cake|cakes|cupcake|cupcakes|you guys|here)\b/.test(text);
        return asksIfGood && mentionsPlace;
      }

      function detectNegativeExperiencePhrase(text) {
        return /\b(didn'?t|did not|don'?t|do not|doesn'?t|does not|wasn'?t|was not|isn'?t|is not)\b[^.!]{0,25}\b(like|enjoy|love|good|great|fresh|worth it)\b/.test(text);
      }

      function timeGreeting() {
        const h = new Date().getHours();
        if (h < 12) return 'Good morning';
        if (h < 17) return 'Good afternoon';
        return 'Good evening';
      }

      function replyHours() {
        state.lastIntent = 'hours';
        const hours = CONTACT.hours || 'Mon – Sun: 9:00 AM – 9:00 PM';
        return {
          text: `We're open ${hours}. Same-day delivery is available for orders placed before 12 PM.`,
          chips: ['Do you deliver to me?', 'Show me the menu', 'Talk to a human'],
        };
      }

      function replyContact() {
        state.lastIntent = 'contact';
        const bits = [];
        if (CONTACT.phone) bits.push(`call/WhatsApp us at ${CONTACT.phone}`);
        if (CONTACT.email) bits.push(`email ${CONTACT.email}`);
        const line = bits.length ? `You can ${bits.join(' or ')}.` : 'You can reach our team through the contact form in the footer.';
        return {
          text: `${line} You can also use the "Send Us a Message" form at the bottom of the page and we'll get back to you.`,
          chips: ['Where are you located?', 'What are your hours?'],
        };
      }

      function replyLocation() {
        state.lastIntent = 'location';
        const addr = CONTACT.address ? `We're at ${CONTACT.address}.` : "You'll find our shop address in the footer.";
        return {
          text: `${addr} Want to check if we deliver to your area? Click the location pin icon in the header and use "Use My Location," or ask me your neighborhood directly.`,
          chips: ['Do you deliver to Clifton?', 'What are your hours?'],
        };
      }

      function replyDeliveryArea(tokens) {
        state.lastIntent = 'delivery_area';
        const config = (typeof BAKERY_CONFIG !== 'undefined') ? BAKERY_CONFIG : null;
        const areas = (typeof AREA_DISTANCES_KM !== 'undefined') ? AREA_DISTANCES_KM : null;

        if (areas) {
          const matchArea = Object.keys(areas).find((area) =>
            tokenize(area).some((areaTok) => tokens.some((t) => fuzzyMatches(t, areaTok))));

          if (matchArea) {
            const dist = areas[matchArea];
            const radius = config ? config.deliveryRadiusKm : 8;
            if (dist <= radius) {
              return {
                text: `Good news — ${matchArea} is about ${dist} km from our shop, well within our ${radius} km delivery zone. We can deliver there!`,
                chips: ['What are your hours?', 'Show me the menu'],
              };
            }
            return {
              text: `${matchArea} is roughly ${dist} km away, just outside our current ${radius} km delivery zone. Pickup at the shop is still available, or you're welcome to check again if you're closer to us.`,
              chips: ['Where is the shop?', 'Talk to a human'],
            };
          }
        }

        return {
          text: `We currently deliver within about ${config ? config.deliveryRadiusKm : 8} km of our shop, with same-day delivery for orders placed before 12 PM. Tell me your neighborhood and I'll check, or use the location pin icon in the header for an exact check.`,
          chips: ['Do you deliver to Clifton?', 'Do you deliver to Malir?', 'Where is the shop?'],
        };
      }

      function formatItem(item) {
        const badge = item.badge ? ` (${item.badge})` : '';
        return `${item.name}${badge} — ${item.priceText || 'price on request'}. ${item.desc}`;
      }

      function replyMenuItem(item) {
        state.lastIntent = 'menu_item';
        state.lastItem = item;
        return {
          text: formatItem(item),
          chips: ['Add it to my cart', `More ${item.category}`, 'Anything you recommend?'],
        };
      }

      function replyCategory(cat) {
        state.lastIntent = 'menu_category';
        state.lastCategory = cat;
        const items = MENU.filter((m) => m.category === cat);
        if (!items.length) {
          return { text: "I couldn't find that category right now — check the Our Menu section for the full list.", chips: ['Show me the menu'] };
        }
        const list = items.slice(0, 5).map((i) => `• ${i.name} — ${i.priceText}`).join('\n');
        return {
          text: `Here's what we have in ${cat}:\n${list}${items.length > 5 ? `\n...and ${items.length - 5} more in the Menu section.` : ''}`,
          chips: [`Cheapest ${cat}`, 'Anything you recommend?', 'How do I order?'],
        };
      }

      function replyTodaysSpecial() {
        state.lastIntent = 'menu_category';
        state.lastCategory = 'special';
        const items = MENU.filter((m) => m.category === 'special');
        if (!items.length) {
          return { text: "We don't have any specials listed right now — check the Menu section for our full lineup.", chips: ['Show me the menu'] };
        }
        const list = items.map((i) => `• ${i.name} — ${i.priceText || 'price on request'}\n  ${i.desc}`).join('\n\n');
        return {
          text: `Here's everything on Today's Special:\n\n${list}`,
          chips: ['Add it to my cart', 'How do I order?', 'Anything else you recommend?'],
        };
      }

      function replyMenuGeneral() {
        state.lastIntent = 'menu_general';
        const cats = [...new Set(MENU.map((m) => m.category))];
        const prices = MENU.map((m) => m.price).filter(Boolean);
        const range = prices.length ? `from Rs. ${Math.min(...prices)} to Rs. ${Math.max(...prices)}` : '';
        return {
          text: `Our menu spans ${cats.join(', ')} — ${MENU.length} items ${range ? 'ranging ' + range : ''}. Ask me about a specific treat, or tell me a category you're curious about.`,
          chips: ['Cupcakes', 'Cookies', 'Beverages', 'Anything you recommend?'],
        };
      }

      function replyRecommend(cat) {
        if (cat === 'special') return replyTodaysSpecial();
        state.lastIntent = 'recommend';
        let pool = MENU.filter((m) => m.badge);
        if (cat) pool = pool.filter((m) => m.category === cat).length ? pool.filter((m) => m.category === cat) : pool;
        if (!pool.length) pool = MENU;
        const pick = pool[Math.floor(Math.random() * Math.min(pool.length, 3))];
        if (!pick) return { text: 'Take a look at our Menu section — everything is baked fresh daily!', chips: ['Show me the menu'] };
        return {
          text: `I'd point you toward our ${pick.name}${pick.badge ? ` — it's one of our ${pick.badge.toLowerCase()} picks` : ''}: ${pick.desc} (${pick.priceText}).`,
          chips: ['Tell me more', 'Show me the full menu', 'How do I order?'],
        };
      }

      function replyCheapest(cat) {
        const pool = cat ? MENU.filter((m) => m.category === cat) : MENU;
        const priced = pool.filter((m) => m.price);
        if (!priced.length) return { text: "I don't have pricing on that category yet — check the Menu section.", chips: ['Show me the menu'] };
        const cheapest = priced.reduce((a, b) => (a.price < b.price ? a : b));
        return { text: `Our most budget-friendly ${cat || 'item'} is ${cheapest.name} at ${cheapest.priceText}.`, chips: ['Anything you recommend?', 'How do I order?'] };
      }

      function replyOrderHelp() {
        state.lastIntent = 'order_help';
        return {
          text: 'Browse the Our Menu section, tap "Add" on anything you like, then open the cart icon in the header to review and check out. Orders placed before 12 PM qualify for same-day delivery.',
          chips: ['Open my cart', 'Do you deliver to me?', 'Show me the menu'],
        };
      }

      function replyCustomCake() {
        state.lastIntent = 'custom_cake';
        const line = CONTACT.phone
          ? `For custom or bulk orders (birthdays, weddings, events), it's best to message us directly at ${CONTACT.phone} or ${CONTACT.email || 'via the contact form'} with your date, size, and theme.`
          : 'For custom or bulk orders, reach out through the contact form in the footer with your date, size, and theme.';
        return { text: line, chips: ['What are your hours?', 'Do you deliver to me?'] };
      }

      function replyIngredients() {
        state.lastIntent = 'ingredients';
        return {
          text: 'Everything is baked fresh with real butter, cream, and premium chocolate — no artificial preservatives. If you have a specific allergy or dietary need, let us know when ordering so the team can advise on that item.',
          chips: ['Talk to a human', 'Show me the menu'],
        };
      }

      function replyOffers() {
        state.lastIntent = 'offers';
        return {
          text: "Offers rotate around holidays and weekends — the ticker at the top of the page and our social pages are the best place to catch current deals.",
          chips: ['Show me the menu', 'What are your hours?'],
        };
      }

      function replyComplaintAsk() {
        state.lastIntent = 'complaint';
        state.awaitingComplaintDetail = true;
        return {
          text: "I'm really sorry to hear that — that's not the experience we want you to have. What happened, exactly? Was it the food, the order, or something else?",
          chips: ['Talk to a human'],
        };
      }

      function replyComplaintFollowup() {
        state.lastIntent = 'complaint_followup';
        state.awaitingComplaintDetail = false;
        const contactBit = CONTACT.phone
          ? ` You can also reach our team directly at ${CONTACT.phone}${CONTACT.email ? ` or ${CONTACT.email}` : ''}.`
          : '';
        return {
          text: `Thanks for telling me — I'm sorry that happened. You can give us feedback and we'll definitely look into it.${contactBit}`,
          chips: ['Leave feedback', 'Talk to a human'],
        };
      }

      function replyWellbeing() {
        state.lastIntent = 'smalltalk';
        return {
          text: "I'm doing great, thanks for asking! I'm an AI, so I don't get tired of talking about cupcakes 😄 How can I help — menu, delivery, hours, or something else?",
          chips: ['Show me the menu', 'Anything you recommend?', 'Do you deliver to me?'],
        };
      }

      function replyReputation() {
        state.lastIntent = 'reputation';
        return {
          text: `Honestly, yes — ${SHOP_NAME} is known for fresh-baked cupcakes, cookies, and treats made daily, and plenty of customers come back for the custom cakes too. Don't just take my word for it though — check out the menu and see for yourself!`,
          chips: ['Show me the menu', 'Anything you recommend?', 'Where are you located?'],
        };
      }

      function replyGreeting() {
        state.lastIntent = 'greeting';
        return {
          text: `${timeGreeting()}! I'm the ${SHOP_NAME} assistant — ask me about the menu, delivery to your area, hours, or custom orders.`,
          chips: ['Show me the menu', 'Do you deliver to me?', 'What are your hours?'],
        };
      }

      function replyThanks() {
        state.lastIntent = 'thanks';
        return { text: "You're very welcome! Anything else I can help you find? 🍪", chips: ['Show me the menu', 'Anything you recommend?'] };
      }

      function replyFarewell() {
        state.lastIntent = 'farewell';
        return { text: 'Thanks for stopping by — have a sweet day! 👋', chips: [] };
      }

      function replyModeration() {
        state.moderationWarnings += 1;
        state.lastIntent = 'moderation';
        if (state.moderationWarnings === 1) {
          return {
            text: "Let's keep things friendly — I won't respond to offensive language or slurs. Happy to help with the menu, delivery, hours, or anything else once we keep it respectful.",
            chips: ['Show me the menu', 'What are your hours?'],
          };
        }
        return {
          text: "I still can't engage with language like that. If there's something I can genuinely help with, I'm here — otherwise our team is reachable directly through the contact form in the footer.",
          chips: [],
        };
      }

      function replyFallback(raw) {
        state.fallbacks += 1;
        if (state.fallbacks >= 2) {
          const contactBit = CONTACT.phone || CONTACT.email
            ? `${CONTACT.phone || ''}${CONTACT.phone && CONTACT.email ? ' or ' : ''}${CONTACT.email || ''}`
            : 'the contact form in the footer';
          return {
            text: `I don't want to guess wrong on this one — our team can help directly via ${contactBit}.`,
            chips: ['Show me the menu', 'What are your hours?'],
          };
        }
        return {
          text: "I'm not fully sure I follow — I can help with the menu, prices, delivery areas, hours, custom orders, or ordering. Could you rephrase, or pick something below?",
          chips: ['Show me the menu', 'Do you deliver to me?', 'What are your hours?'],
        };
      }

      function resolveReply(userText) {
        const normalizedText = normalize(userText);

        if (containsBlockedTerm(userText)) {
          return replyModeration();
        }

        if (state.awaitingComplaintDetail) {
          return replyComplaintFollowup();
        }

        if (detectWellbeingQuestion(normalizedText)) return replyWellbeing();
        if (detectReputationQuestion(normalizedText)) return replyReputation();

        const tokens = tokenize(userText);
        const meaningful = meaningfulTokens(tokens);
        const scores = scoreIntents(tokens);
        const category = findCategoryMention(tokens);

        if (detectNegativeExperiencePhrase(normalizedText)) {
          scores.complaint = (scores.complaint || 0) + 6;
        }

        const referencesContext = /\b(it|that|this|those|them)\b/.test(normalize(userText));
        if (referencesContext && state.lastItem && (scores.menu_general || /much|price|cost/.test(normalize(userText)))) {
          return replyMenuItem(state.lastItem);
        }

        const item = findMenuItem(tokens);
        if (item && (scores.menu_general || item)) {
          return replyMenuItem(item);
        }

        if (category === 'special') {
          return replyTodaysSpecial();
        }

        const ranked = Object.entries(scores).sort((a, b) => b[1] - a[1]);
        const top = ranked[0];

        if (!top) {
          if (meaningful.length === 0) return replyFallback(userText);
          return replyFallback(userText);
        }

        const [topIntent] = top;

        switch (topIntent) {
          case 'greeting': return replyGreeting();
          case 'thanks': return replyThanks();
          case 'farewell': return replyFarewell();
          case 'hours': return replyHours();
          case 'delivery_area': return replyDeliveryArea(tokens);
          case 'location': return replyLocation();
          case 'contact': return replyContact();
          case 'order_help': return replyOrderHelp();
          case 'custom_cake': return replyCustomCake();
          case 'ingredients': return replyIngredients();
          case 'offers': return replyOffers();
          case 'complaint': return replyComplaintAsk();
          case 'recommend': return replyRecommend(category || state.lastCategory);
          case 'menu_general': {
            if (/cheap|afford|budget|less/.test(normalize(userText))) return replyCheapest(category);
            if (category) return replyCategory(category);
            return replyMenuGeneral();
          }
          default: return replyFallback(userText);
        }
      }

      function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }

      function timeNow() {
        return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }

      function clearSuggestions() {
        const existing = chatMessages.querySelector('.chat-suggestions');
        if (existing) existing.remove();
      }

      function renderSuggestions(chips) {
        clearSuggestions();
        if (!chips || !chips.length) return;
        const wrap = document.createElement('div');
        wrap.className = 'chat-suggestions';
        chips.forEach((label) => {
          const btn = document.createElement('button');
          btn.className = 'chat-suggestion-chip';
          btn.type = 'button';
          btn.textContent = label;
          btn.addEventListener('click', () => {
            if (btn.disabled) return;
            if (label === 'Leave feedback') {
              window.location.href = 'Feedback.html';
              return;
            }
            wrap.querySelectorAll('button').forEach((b) => (b.disabled = true));
            sendChatMessage(label);
          });
          wrap.appendChild(btn);
        });
        chatMessages.appendChild(wrap);
        scrollToBottom();
      }

      function addMessage(text, sender) {
        clearSuggestions();
        const row = document.createElement('div');
        row.className = `chat-msg-row ${sender}`;

        if (sender === 'bot') {
          const avatar = document.createElement('div');
          avatar.className = 'chat-msg-avatar';
          avatar.innerHTML = '<i class="fa-solid fa-cookie-bite"></i>';
          row.appendChild(avatar);
        }

        const col = document.createElement('div');
        col.className = 'chat-msg-col';

        const bubble = document.createElement('div');
        bubble.className = `chat-msg ${sender}`;
        bubble.textContent = text;

        const time = document.createElement('div');
        time.className = 'chat-msg-time';
        time.textContent = timeNow();

        col.appendChild(bubble);
        col.appendChild(time);
        row.appendChild(col);
        chatMessages.appendChild(row);
        scrollToBottom();
      }

      let typingRow = null;

      function showTyping() {
        typingRow = document.createElement('div');
        typingRow.className = 'chat-typing-row';
        typingRow.innerHTML = `
          <div class="chat-msg-avatar"><i class="fa-solid fa-cookie-bite"></i></div>
          <div class="chat-typing-bubble"><span></span><span></span><span></span></div>
        `;
        chatMessages.appendChild(typingRow);
        scrollToBottom();
      }

      function hideTyping() {
        if (typingRow) {
          typingRow.remove();
          typingRow = null;
        }
      }

      function sendChatMessage(rawText) {
        const trimmed = (rawText || '').trim();
        if (!trimmed) return;
        ensureKnowledgeLoaded();

        addMessage(trimmed, 'user');
        chatInput.value = '';
        chatSendBtn.disabled = true;
        state.turns += 1;

        showTyping();
        const thinkTime = 480 + Math.min(700, trimmed.length * 12) + Math.random() * 250;

        setTimeout(() => {
          let result;
          try {
            result = resolveReply(trimmed);
          } catch (err) {
            result = { text: "Sorry, I hit a snag processing that — could you try rephrasing?", chips: ['Show me the menu', 'Talk to a human'] };
          }
          hideTyping();
          addMessage(result.text, 'bot');
          renderSuggestions(result.chips);
          chatSendBtn.disabled = false;
          chatInput.focus();
        }, thinkTime);
      }

      function resetConversation() {
        state.started = false;
        state.turns = 0;
        state.fallbacks = 0;
        state.lastIntent = null;
        state.lastItem = null;
        state.lastCategory = null;
        state.awaitingComplaintDetail = false;
        chatMessages.innerHTML = '';
        startConversation();
      }

      function startConversation() {
        if (state.started) return;
        state.started = true;
        ensureKnowledgeLoaded();
        showTyping();
        setTimeout(() => {
          hideTyping();
          addMessage(`${timeGreeting()}! Welcome to ${SHOP_NAME} 👋 I'm your AI assistant — ask me anything about the menu, prices, delivery to your area, hours, or custom orders.`, 'bot');
          renderSuggestions(['Show me the menu', 'Do you deliver to me?', 'What are your hours?', 'Anything you recommend?']);
        }, 550);
      }

      function toggleChatPanel(open) {
        chatPanel.classList.toggle('open', open);
        chatToggleBtn.classList.toggle('is-active', open);
        if (open) {
          startConversation();
          setTimeout(() => chatInput.focus(), 300);
        }
      }

      chatToggleBtn.addEventListener('click', () => toggleChatPanel(!chatPanel.classList.contains('open')));
      chatPanelClose.addEventListener('click', () => toggleChatPanel(false));
      chatPanelReset.addEventListener('click', resetConversation);

      chatSendBtn.addEventListener('click', () => sendChatMessage(chatInput.value));
      chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') sendChatMessage(chatInput.value);
      });
      chatInput.addEventListener('input', () => {
        if (chatSubtitle) chatSubtitle.textContent = 'Online now · ask me anything';
      });
    })();
