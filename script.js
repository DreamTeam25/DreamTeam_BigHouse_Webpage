// Импорт Supabase SDK
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = 'https://lfepnnbirnazqgtzzzbp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmZXBubmJpcm5henFndHp6emJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2NjM3NDUsImV4cCI6MjA4OTIzOTc0NX0.Dazvl17xa41qLwB0xm8JQREsq733kVWHtU65PJLVGaU';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('Supabase client initialized:', supabase);

// Инициализация EmailJS
emailjs.init("aJZthtMOKlDI6Hvhx"); // Ваш public key из EmailJS

// Функция для отправки уведомления в Telegram
function sendTelegramNotification(formData) {
    const token = '8440947721:AAFhbzmrWIliMfCxA6stGJOkFom6hclasEQ';
    const chatId = '1897598560'; // Правильный chat_id
    const message = `Новая заявка!\nФИО: ${formData.name}\nEmail: ${formData.email}\nТелефон: ${formData.phone}\nИнформация: ${formData.info || 'Нет'}`;

    const url = `https://api.telegram.org/bot${token}/sendMessage`;

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            chat_id: chatId,
            text: message,
        }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.ok) {
            console.log('Telegram message sent successfully');
        } else {
            console.error('Failed to send Telegram message:', data);
        }
    })
    .catch(error => {
        console.error('Error sending Telegram message:', error);
    });
}

// Функция для отправки уведомления на email
function sendNotificationEmail(formData) {
    const templateParams = {
        to_email: 'davedi.isme@gmail.com',
        from_name: formData.name,
        from_email: formData.email,
        phone: formData.phone,
        message: formData.info || 'Нет дополнительной информации'
    };

    emailjs.send('service_xotv5qm', 'template_nqnm6wj', templateParams)
        .then(function(response) {
            console.log('Email sent successfully:', response);
        }, function(error) {
            console.error('Failed to send email:', error);
        });
}

// Получаем форму
const form = document.querySelector('.application-form');
console.log('Form found:', form);

// Добавляем обработчик отправки формы
form.addEventListener('submit', async (e) => {
    e.preventDefault(); // Предотвращаем стандартную отправку
    console.log('Form submit prevented');

    // Собираем данные из формы
    const formData = new FormData(form);
    const fullName = formData.get('name').trim();
    const parts = fullName.split(' ');
    if (parts.length < 2) {
        alert('Введите ФИО в формате: Фамилия Имя [Отчество]');
        return;
    }
    const lastName = parts[0];
    const firstName = parts[1];
    const middleName = parts.length > 2 ? parts.slice(2).join(' ') : null; // Если больше 2 слов, объединить остальное как отчество

    const data = {
        name: fullName, // Для leads оставляем полное имя
        email: formData.get('email'),
        phone: formData.get('phone'),
        info: formData.get('info') || null
    };

    console.log('Data to insert:', data);

    try {
        // Проверяем, есть ли пользователь с таким ФИО
        const { data: users, error: userError } = await supabase
            .from('users')
            .select('id')
            .eq('last_name', lastName)
            .eq('first_name', firstName);

        if (userError) {
            throw userError;
        }

        let existingUser = null;
        
        // Если есть отчество, ищем точное совпадение
        if (middleName) {
            existingUser = users.find(u => u.middle_name === middleName);
        } else {
            // Если нет отчества, ищем запись где отчество null/пусто
            existingUser = users.find(u => !u.middle_name);
        }

        if (!existingUser) {
            // Добавляем нового пользователя
            const { error: insertUserError } = await supabase
                .from('users')
                .insert([{
                    last_name: lastName,
                    first_name: firstName,
                    middle_name: middleName,
                    email: data.email,
                    phone: data.phone
                }]);

            if (insertUserError) {
                throw insertUserError;
            }
        }

        // Отправляем данные в Supabase (leads)
        const { data: insertedData, error } = await supabase
            .from('leads')
            .insert([data]);

        console.log('Insert result:', { insertedData, error });

        if (error) {
            throw error;
        }

        // Успешная отправка
        alert('Заявка отправлена успешно!');
        form.reset(); // Очищаем форму

        // Отправляем уведомление на email
        sendNotificationEmail(data);

        // Отправляем уведомление в Telegram
        sendTelegramNotification(data);

    } catch (error) {
        console.error('Ошибка при отправке:', error);
        alert('Произошла ошибка при отправке заявки. Попробуйте еще раз.');
    }
});