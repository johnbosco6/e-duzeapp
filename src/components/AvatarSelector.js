
export default function AvatarSelector(currentAvatar, currentGender, onSelect) {
    const avatars = {
        male: ['👨', '👱‍♂️', '👨‍🦱', '🧔', '👴', '👮‍♂️', '👷‍♂️'],
        female: ['👩', '👱‍♀️', '👩‍🦱', '👩‍🦰', '👵', '👮‍♀️', '👷‍♀️'],
        diverse: ['🧑', '👱', '🧑‍🦱', '🧑‍🦰', '🧓', '👮', '👷', '🏳️‍🌈', '🏳️‍⚧️']
    };

    const genders = [
        { id: 'male', label: 'Male' },
        { id: 'female', label: 'Female' },
        { id: 'non-binary', label: 'Non-Binary' },
        { id: 'trans', label: 'Transgender' },
        { id: 'bi', label: 'Bigender/Fluid' },
        { id: 'prefer-not', label: 'Prefer not to say' }
    ];

    setTimeout(() => {
        // Gender selection logic
        const genderSelect = document.getElementById('gender-select');
        if (genderSelect) {
            genderSelect.value = currentGender || '';
            genderSelect.addEventListener('change', (e) => {
                const newGender = e.target.value;
                updateAvatarList(newGender);
                onSelect({ gender: newGender });
            });
        }

        // Initial avatar list update
        updateAvatarList(currentGender || 'male');

        function updateAvatarList(gender) {
            const container = document.getElementById('avatar-options');
            if (!container) return;

            let category = 'diverse';
            if (gender === 'male') category = 'male';
            if (gender === 'female') category = 'female';

            // Show all for non-binary/trans/bi/diverse
            const genderAvatars = (category === 'male' || category === 'female')
                ? avatars[category]
                : [...avatars.male, ...avatars.female, ...avatars.diverse];

            container.innerHTML = genderAvatars.map(av => `
                <div class="avatar-option ${av === currentAvatar ? 'selected' : ''}" data-avatar="${av}">
                    ${av}
                </div>
            `).join('');

            // Avatar click events
            container.querySelectorAll('.avatar-option').forEach(opt => {
                opt.addEventListener('click', () => {
                    container.querySelectorAll('.avatar-option').forEach(o => o.classList.remove('selected'));
                    opt.classList.add('selected');
                    onSelect({ avatar: opt.dataset.avatar });
                });
            });
        }
    }, 0);

    return `
        <div class="avatar-selector-container">
            <div class="form-group">
                <label>Identity / Gender</label>
                <select id="gender-select" class="form-input">
                    <option value="" disabled selected>Select identity</option>
                    ${genders.map(g => `<option value="${g.id}">${g.label}</option>`).join('')}
                </select>
            </div>
            
            <div class="form-group">
                <label>Choose Avatar</label>
                <div id="avatar-options" class="avatar-grid">
                    <!-- Avatars injected here -->
                </div>
            </div>
        </div>
    `;
}
