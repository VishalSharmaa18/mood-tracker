document.addEventListener('DOMContentLoaded', () => {
    // 1. Find all the HTML elements we need to interact with
    const moodBtns = document.querySelectorAll('.mood-btn');
    const timelineContainer = document.getElementById('timeline-container');
    const calendarContainer = document.getElementById('calendar-container');
    const timelineBtn = document.getElementById('timeline-view-btn');
    const calendarBtn = document.getElementById('calendar-view-btn');

    // 2. Load moods saved from last time from the browser's local storage
    let moods = JSON.parse(localStorage.getItem('moodTracker')) || [];

    // 3. This function saves a mood to our list and local storage
    function saveMood(mood) {
        const today = new Date().toISOString().slice(0, 10);
        const existingEntryIndex = moods.findIndex(entry => entry.date === today);

        if (existingEntryIndex > -1) {
            moods[existingEntryIndex].mood = mood;
        } else {
            moods.push({ date: today, mood: mood });
        }
        
        localStorage.setItem('moodTracker', JSON.stringify(moods));
        renderMoods(); // Update the display
    }

    // 4. Listen for clicks on the mood buttons
    moodBtns.forEach(button => {
        button.addEventListener('click', () => {
            saveMood(button.dataset.mood);
        });
    });

    // 5. This function updates both the timeline and calendar displays
    function renderMoods() {
        renderTimeline();
        renderCalendar();
    }

    // 6. This function builds the timeline view
    function renderTimeline() {
        timelineContainer.innerHTML = ''; // Clear old content
        moods.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        if (moods.length === 0) {
            timelineContainer.innerHTML = '<p>No moods logged yet.</p>';
            return;
        }

        moods.forEach(entry => {
            const moodEntryDiv = document.createElement('div');
            moodEntryDiv.classList.add('mood-entry');
            const date = new Date(entry.date).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric'
            });
            moodEntryDiv.innerHTML = `<span>${date}</span> <span>${entry.mood}</span>`;
            timelineContainer.appendChild(moodEntryDiv);
        });
    }

    // 7. This function builds the calendar view
    function renderCalendar() {
        calendarContainer.innerHTML = '';
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();

        const calendarDiv = document.createElement('div');
        calendarDiv.classList.add('calendar');

        for (let i = 0; i < firstDay.getDay(); i++) {
            const blankDay = document.createElement('div');
            blankDay.classList.add('calendar-day');
            calendarDiv.appendChild(blankDay);
        }

        for (let i = 1; i <= daysInMonth; i++) {
            const dayDiv = document.createElement('div');
            dayDiv.classList.add('calendar-day');
            dayDiv.textContent = i;
            const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
            const moodEntry = moods.find(entry => entry.date === dateString);

            if (moodEntry) {
                dayDiv.classList.add(`mood-${moodEntry.mood}`);
            }
            calendarDiv.appendChild(dayDiv);
        }
        calendarContainer.appendChild(calendarDiv);
    }

    // 8. Listen for clicks on the view-toggle buttons to show/hide sections
    timelineBtn.addEventListener('click', () => {
        timelineContainer.classList.remove('hidden');
        calendarContainer.classList.add('hidden');
    });

    calendarBtn.addEventListener('click', () => {
        calendarContainer.classList.remove('hidden');
        timelineContainer.classList.add('hidden');
    });

    // 9. Run this when the page first loads
    renderMoods();
});