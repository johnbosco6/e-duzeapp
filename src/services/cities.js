// Major Polish cities with voivodeships
export const POLISH_CITIES = [
    // Lubelskie
    { name: 'Lublin', voivodeship: 'Lubelskie' },
    { name: 'Chełm', voivodeship: 'Lubelskie' },
    { name: 'Zamość', voivodeship: 'Lubelskie' },
    { name: 'Biała Podlaska', voivodeship: 'Lubelskie' },
    { name: 'Puławy', voivodeship: 'Lubelskie' },

    // Mazowieckie
    { name: 'Warszawa', voivodeship: 'Mazowieckie' },
    { name: 'Radom', voivodeship: 'Mazowieckie' },
    { name: 'Płock', voivodeship: 'Mazowieckie' },
    { name: 'Siedlce', voivodeship: 'Mazowieckie' },
    { name: 'Ostrołęka', voivodeship: 'Mazowieckie' },

    // Małopolskie
    { name: 'Kraków', voivodeship: 'Małopolskie' },
    { name: 'Tarnów', voivodeship: 'Małopolskie' },
    { name: 'Nowy Sącz', voivodeship: 'Małopolskie' },

    // Śląskie
    { name: 'Katowice', voivodeship: 'Śląskie' },
    { name: 'Częstochowa', voivodeship: 'Śląskie' },
    { name: 'Sosnowiec', voivodeship: 'Śląskie' },
    { name: 'Gliwice', voivodeship: 'Śląskie' },
    { name: 'Zabrze', voivodeship: 'Śląskie' },
    { name: 'Bielsko-Biała', voivodeship: 'Śląskie' },
    { name: 'Bytom', voivodeship: 'Śląskie' },
    { name: 'Rybnik', voivodeship: 'Śląskie' },
    { name: 'Tychy', voivodeship: 'Śląskie' },

    // Wielkopolskie
    { name: 'Poznań', voivodeship: 'Wielkopolskie' },
    { name: 'Kalisz', voivodeship: 'Wielkopolskie' },
    { name: 'Konin', voivodeship: 'Wielkopolskie' },
    { name: 'Piła', voivodeship: 'Wielkopolskie' },

    // Dolnośląskie
    { name: 'Wrocław', voivodeship: 'Dolnośląskie' },
    { name: 'Wałbrzych', voivodeship: 'Dolnośląskie' },
    { name: 'Legnica', voivodeship: 'Dolnośląskie' },
    { name: 'Jelenia Góra', voivodeship: 'Dolnośląskie' },

    // Pomorskie
    { name: 'Gdańsk', voivodeship: 'Pomorskie' },
    { name: 'Gdynia', voivodeship: 'Pomorskie' },
    { name: 'Sopot', voivodeship: 'Pomorskie' },
    { name: 'Słupsk', voivodeship: 'Pomorskie' },

    // Zachodniopomorskie
    { name: 'Szczecin', voivodeship: 'Zachodniopomorskie' },
    { name: 'Koszalin', voivodeship: 'Zachodniopomorskie' },

    // Łódzkie
    { name: 'Łódź', voivodeship: 'Łódzkie' },
    { name: 'Piotrków Trybunalski', voivodeship: 'Łódzkie' },

    // Podkarpackie
    { name: 'Rzeszów', voivodeship: 'Podkarpackie' },
    { name: 'Przemyśl', voivodeship: 'Podkarpackie' },
    { name: 'Stalowa Wola', voivodeship: 'Podkarpackie' },

    // Kujawsko-Pomorskie
    { name: 'Bydgoszcz', voivodeship: 'Kujawsko-Pomorskie' },
    { name: 'Toruń', voivodeship: 'Kujawsko-Pomorskie' },
    { name: 'Włocławek', voivodeship: 'Kujawsko-Pomorskie' },

    // Warmińsko-Mazurskie
    { name: 'Olsztyn', voivodeship: 'Warmińsko-Mazurskie' },
    { name: 'Elbląg', voivodeship: 'Warmińsko-Mazurskie' },

    // Podlaskie
    { name: 'Białystok', voivodeship: 'Podlaskie' },
    { name: 'Suwałki', voivodeship: 'Podlaskie' },

    // Świętokrzyskie
    { name: 'Kielce', voivodeship: 'Świętokrzyskie' },

    // Opolskie
    { name: 'Opole', voivodeship: 'Opolskie' },

    // Lubuskie
    { name: 'Gorzów Wielkopolski', voivodeship: 'Lubuskie' },
    { name: 'Zielona Góra', voivodeship: 'Lubuskie' }
];

export function getCitiesByVoivodeship(voivodeship) {
    return POLISH_CITIES.filter(city => city.voivodeship === voivodeship);
}

export function getAllVoivodeships() {
    return [...new Set(POLISH_CITIES.map(city => city.voivodeship))].sort();
}
