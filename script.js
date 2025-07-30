const hours = [
    "09:00", "10:00", "11:00", "12:00",
    "13:00", "14:00", "15:00", "16:00", "17:00"
  ];
  
  document.getElementById('date').addEventListener('change', generateSlots);

  window.addEventListener('DOMContentLoaded', () => {
    const dateInput = document.getElementById('date');
    if (dateInput.value) {
      generateSlots();
    }
  });

  let selectedHour = null;
  let selectedDate = null;
  let lastBookedName = '';

  function openNameModal(hour, date) {
    selectedHour = hour;
    selectedDate = date;
    document.getElementById('modalNameInput').value = lastBookedName;
    document.getElementById('nameModal').style.display = 'flex';
    setTimeout(() => {
      document.getElementById('modalNameInput').focus();
    }, 100);
  }
  function closeNameModal() {
    document.getElementById('nameModal').style.display = 'none';
    selectedHour = null;
    selectedDate = null;
  }

  document.getElementById('modalCancel').onclick = closeNameModal;
  document.getElementById('modalConfirm').onclick = function() {
    const name = document.getElementById('modalNameInput').value.trim();
    if (!name) {
      alert('Adınızı daxil edin!');
      return;
    }
    lastBookedName = name;
    const bookings = JSON.parse(localStorage.getItem('bookings') || '{}');
    if (!bookings[selectedDate]) bookings[selectedDate] = {};
    bookings[selectedDate][selectedHour] = name;
    localStorage.setItem('bookings', JSON.stringify(bookings));
    closeNameModal();
    generateSlots();
    const msg = document.getElementById('message');
    msg.textContent = `${selectedHour} üçün qeydiyyat tamamlandı!`;
    setTimeout(() => { msg.textContent = ''; }, 3000);
  };

  document.getElementById('modalNameInput').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      document.getElementById('modalConfirm').click();
    }
  });

  function generateSlots() {
    const date = document.getElementById('date').value;
    const slotContainer = document.getElementById('slots');
    slotContainer.innerHTML = '';
  
    const bookings = JSON.parse(localStorage.getItem('bookings') || '{}');
    const dayBookings = bookings[date] || {};

    hours.forEach(hour => {
      const div = document.createElement('div');
      const isBooked = !!dayBookings[hour];
      div.className = 'slot ' + (isBooked ? 'booked' : 'free');
      div.innerHTML = `<span>${hour}</span><span>${dayBookings[hour] || 'Boş'}</span>`;

      if (!isBooked) {
        div.addEventListener('click', () => {
          openNameModal(hour, date);
        });
      } else if (dayBookings[hour] === lastBookedName && lastBookedName) {
        // Show cancel button for the user's own booking
        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = 'Ləğv et';
        cancelBtn.style.marginLeft = '12px';
        cancelBtn.style.background = '#bfa14a';
        cancelBtn.style.color = '#232526';
        cancelBtn.style.border = 'none';
        cancelBtn.style.borderRadius = '6px';
        cancelBtn.style.padding = '6px 14px';
        cancelBtn.style.fontWeight = 'bold';
        cancelBtn.style.cursor = 'pointer';
        cancelBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          delete bookings[date][hour];
          if (Object.keys(bookings[date]).length === 0) delete bookings[date];
          localStorage.setItem('bookings', JSON.stringify(bookings));
          generateSlots();
          const msg = document.getElementById('message');
          msg.textContent = `${hour} üçün qeydiyyat ləğv edildi!`;
          setTimeout(() => { msg.textContent = ''; }, 3000);
        });
        div.appendChild(cancelBtn);
      }
      slotContainer.appendChild(div);
    });
  }
  