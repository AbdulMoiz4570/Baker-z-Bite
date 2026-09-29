const contactForm = document.getElementById('contact-form');

const contactName = document.getElementById('contact-name');

const contactEmail = document.getElementById('contact-email');

const contactMessage = document.getElementById('contact-message');

const contactEmailError = document.getElementById('contact-email-error');

const contactMessageError = document.getElementById('contact-message-error');

const footerFormConfirmation = document.getElementById('footer-form-confirmation');

function isValidEmail(value) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }

contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      footerFormConfirmation.classList.remove('show');

      let isValid = true;

      if (!isValidEmail(contactEmail.value.trim())) {
        contactEmail.classList.add('invalid');
        contactEmailError.classList.add('show');
        isValid = false;
      } else {
        contactEmail.classList.remove('invalid');
        contactEmailError.classList.remove('show');
      }

      if (contactMessage.value.trim() === '') {
        contactMessage.classList.add('invalid');
        contactMessageError.classList.add('show');
        isValid = false;
      } else {
        contactMessage.classList.remove('invalid');
        contactMessageError.classList.remove('show');
      }

      if (!isValid) return;

      const contactData = {
        name: contactName.value.trim(),
        email: contactEmail.value.trim(),
        message: contactMessage.value.trim()
      };
      console.log('Contact form submitted:', contactData);

      footerFormConfirmation.classList.add('show');
      contactForm.reset();

      setTimeout(() => {
        footerFormConfirmation.classList.remove('show');
      }, 5000);
    });
