const SUPABASE_URL = 'https://lfepnnbirnazqgtzzzbp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmZXBubmJpcm5henFndHp6emJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2NjM3NDUsImV4cCI6MjA4OTIzOTc0NX0.Dazvl17xa41qLwB0xm8JQREsq733kVWHtU65PJLVGaU';

const emailjsLib = window.emailjs || null;

if (emailjsLib) {
    emailjsLib.init('aJZthtMOKlDI6Hvhx');
} else {
    console.warn('EmailJS не найден');
}

// =========================
// POPUP
// =========================
function closePopup() {
    const overlay = document.getElementById('form-popup-overlay');
    if (!overlay) return;

    overlay.classList.remove('active');
    document.body.classList.remove('popup-open');
}

function createPopup() {
    let overlay = document.getElementById('form-popup-overlay');

    if (overlay) return overlay;

    overlay = document.createElement('div');
    overlay.id = 'form-popup-overlay';
    overlay.className = 'form-popup-overlay';

    overlay.innerHTML = `
        <div class="form-popup" role="dialog" aria-modal="true" aria-labelledby="form-popup-title">
            <button class="form-popup-close" type="button" aria-label="Закрыть окно">&times;</button>
            <div class="form-popup-icon">✓</div>
            <h3 id="form-popup-title" class="form-popup-title">Заявка отправлена</h3>
            <p class="form-popup-text">Спасибо! Мы получили вашу заявку и скоро с вами свяжемся.</p>
            <button class="form-popup-button" type="button">Хорошо</button>
        </div>
    `;

    document.body.appendChild(overlay);

    overlay.addEventListener('click', (e) => {
        if (
            e.target === overlay ||
            e.target.classList.contains('form-popup-close') ||
            e.target.classList.contains('form-popup-button')
        ) {
            closePopup();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.classList.contains('active')) {
            closePopup();
        }
    });

    return overlay;
}

function showPopup(title, text, isError = false) {
    const overlay = createPopup();
    const popup = overlay.querySelector('.form-popup');
    const icon = overlay.querySelector('.form-popup-icon');
    const titleEl = overlay.querySelector('.form-popup-title');
    const textEl = overlay.querySelector('.form-popup-text');

    titleEl.textContent = title;
    textEl.textContent = text;
    icon.textContent = isError ? '!' : '✓';

    popup.classList.toggle('error', isError);
    overlay.classList.add('active');
    document.body.classList.add('popup-open');
}

// =========================
// VALIDATION
// =========================
function normalizePhone(phone) {
    return String(phone || '').replace(/\D/g, '');
}

function formatPhoneInput(value) {
    return value.replace(/[^\d+\-()\s]/g, '');
}

function isValidPhone(phone) {
    const digits = normalizePhone(phone);
    return digits.length >= 10 && digits.length <= 15;
}

function isValidFullName(fullName) {
    const parts = String(fullName || '').trim().split(/\s+/).filter(Boolean);
    return parts.length >= 2;
}

// =========================
// SUPABASE HELPERS
// =========================
function getSupabaseHeaders(preferReturn = false) {
    const headers = {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
    };

    if (preferReturn) {
        headers.Prefer = 'return=representation';
    }

    return headers;
}

async function getUsersByName(lastName, firstName) {
    const url = new URL(`${SUPABASE_URL}/rest/v1/users`);
    url.searchParams.set('select', 'id,middle_name');
    url.searchParams.set('last_name', `eq.${lastName}`);
    url.searchParams.set('first_name', `eq.${firstName}`);

    const response = await fetch(url.toString(), {
        method: 'GET',
        headers: getSupabaseHeaders()
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Ошибка чтения users: ${errorText}`);
    }

    return response.json();
}

async function insertUser(userData) {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/users`, {
        method: 'POST',
        headers: getSupabaseHeaders(true),
        body: JSON.stringify([userData])
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Ошибка добавления user: ${errorText}`);
    }

    return response.json();
}

async function insertLead(leadData) {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/leads`, {
        method: 'POST',
        headers: getSupabaseHeaders(true),
        body: JSON.stringify([leadData])
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Ошибка добавления lead: ${errorText}`);
    }

    return response.json();
}

// =========================
// NOTIFICATIONS
// =========================
function sendTelegramNotification(formData) {
    const token = '8440947721:AAFhbzmrWIliMfCxA6stGJOkFom6hclasEQ';
    const chatId = '1897598560';

    const message = `Новая заявка!
ФИО: ${formData.name}
Email: ${formData.email}
Телефон: ${formData.phone}
Информация: ${formData.info || 'Нет'}`;

    return fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chat_id: chatId,
            text: message
        })
    })
        .then((response) => response.json())
        .then((data) => {
            if (!data.ok) {
                console.error('Ошибка Telegram:', data);
            }
            return data;
        })
        .catch((error) => {
            console.error('Ошибка отправки в Telegram:', error);
        });
}

function sendNotificationEmail(formData) {
    if (!emailjsLib) return Promise.resolve();

    const templateParams = {
        to_email: 'davedi.isme@gmail.com',
        from_name: formData.name,
        from_email: formData.email,
        phone: formData.phone,
        message: formData.info || 'Нет дополнительной информации'
    };

    return emailjsLib
        .send('service_xotv5qm', 'template_nqnm6wj', templateParams)
        .then((response) => {
            console.log('Email отправлен:', response);
            return response;
        })
        .catch((error) => {
            console.error('Ошибка отправки email:', error);
        });
}

// =========================
// FORM LOGIC
// =========================
async function handleFormSubmit(form) {
    const nameInput = form.querySelector('[name="name"]');
    const emailInput = form.querySelector('[name="email"]');
    const phoneInput = form.querySelector('[name="phone"]');
    const infoInput = form.querySelector('[name="info"]');

    const fullName = nameInput ? nameInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    const phoneRaw = phoneInput ? phoneInput.value.trim() : '';
    const info = infoInput ? infoInput.value.trim() : null;

    if (!isValidFullName(fullName)) {
        showPopup('Проверьте форму', 'Введите ФИО в формате: Фамилия Имя [Отчество]', true);
        return;
    }

    if (!email) {
        showPopup('Проверьте форму', 'Введите корректный email.', true);
        return;
    }

    if (!isValidPhone(phoneRaw)) {
        showPopup('Неверный телефон', 'Введите номер телефона цифрами. Буквы недопустимы.', true);
        return;
    }

    const parts = fullName.split(/\s+/).filter(Boolean);
    const lastName = parts[0];
    const firstName = parts[1];
    const middleName = parts.length > 2 ? parts.slice(2).join(' ') : null;
    const cleanPhone = normalizePhone(phoneRaw);

    const leadData = {
        name: fullName,
        email: email,
        phone: cleanPhone,
        info: info || null
    };

    const users = await getUsersByName(lastName, firstName);

    let existingUser = null;

    if (middleName) {
        existingUser = users.find((user) => user.middle_name === middleName);
    } else {
        existingUser = users.find((user) => !user.middle_name);
    }

    if (!existingUser) {
        await insertUser({
            last_name: lastName,
            first_name: firstName,
            middle_name: middleName,
            email: email,
            phone: cleanPhone
        });
    }

    await insertLead(leadData);

    showPopup(
        'Заявка отправлена',
        'Спасибо! Мы получили вашу заявку и скоро с вами свяжемся.'
    );

    form.reset();

    Promise.allSettled([
        sendNotificationEmail(leadData),
        sendTelegramNotification(leadData)
    ]);
}

// =========================
// INIT
// =========================
document.addEventListener('DOMContentLoaded', () => {
    const forms = document.querySelectorAll('.application-form');

    if (!forms.length) {
        console.error('Форма .application-form не найдена');
        return;
    }

    forms.forEach((form) => {
        const phoneInput = form.querySelector('input[name="phone"]');

        if (phoneInput) {
            phoneInput.addEventListener('input', () => {
                phoneInput.value = formatPhoneInput(phoneInput.value);
            });
        }

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            try {
                await handleFormSubmit(form);
            } catch (error) {
                console.error('Ошибка при отправке формы:', error);
                showPopup(
                    'Ошибка отправки',
                    'Произошла ошибка при отправке заявки. Попробуйте ещё раз.',
                    true
                );
            }
        });
    });
});