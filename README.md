🍇 BlueberryStats

Aplikacja webowa do zarządzania pracownikami plantacji borówek oraz ich zbiorami.

🛠️ Technologie

Backend:
- NestJS (TypeScript) – architektura modułowa,
- MongoDB + Mongoose – schematy i walidacja danych,
- JWT + bcrypt – autoryzacja i bezpieczne logowanie,
- dotenv – zarządzanie zmiennymi środowiskowymi.

Frontend:
- React + React Router v7 – UI i routing,
- Axios – komunikacja z API,
- Bootstrap 5 + React-Icons – stylowanie i UI,
- tryb dark-mode w CSS.

⚙️ Funkcjonalności
- Logowanie i rejestracja (z JWT, role: EMPLOYER/EMPLOYEE),
- Panel statystyk – pracownik widzi swoje wyniki i wypłaty, pracodawca całą grupę,
- Zarządzanie grupą – dodawanie pracowników, zmiana stawek, usuwanie z grupy,
- Wpisy zbiorów – pracodawca dodaje zbiory, historia zebranych kg i status płatności,
- Wypłaty – pracodawca zatwierdza płatności, pracownik widzi historię wypłat,
- Responsywność

🚀 Uruchomienie projektu

Backend:
- cd backend
- npm install
- npm run start:dev

Frontend:
- cd frontend
- npm install
- npm start

📸 Screenshoty

Panel logowania:
<img width="1909" height="945" alt="Zrzut ekranu 2025-06-09 141249" src="https://github.com/user-attachments/assets/af67cca4-eddd-40dc-868c-3c8ca5195a1c" />

Panel rejestracji:
<img width="1911" height="944" alt="Zrzut ekranu 2025-06-09 141330" src="https://github.com/user-attachments/assets/0355c6af-5c59-407d-a0f0-d58f056cd8da" />

Statystyki i wypłaty widok pracownika:
<img width="1897" height="942" alt="Zrzut ekranu 2025-06-09 141404" src="https://github.com/user-attachments/assets/cdc1523b-c62a-4ba2-9127-d6a646694c53" />
<img width="1911" height="934" alt="Zrzut ekranu 2025-06-09 141427" src="https://github.com/user-attachments/assets/396d4892-d57b-40e2-964b-eefba394fda8" />

Statystyki i wypłaty widok pracodawcy:
<img width="1897" height="947" alt="Zrzut ekranu 2025-06-09 141459" src="https://github.com/user-attachments/assets/c93fdb6a-35cd-4a56-9b19-3356bd919c65" />

Administracja grupą, zapisy wyników zbiorów, kontrola wypłat (funkcjonalności pracodawcy):
<img width="748" height="370" alt="Zrzut ekranu 2025-06-16 165409" src="https://github.com/user-attachments/assets/c6af4771-ba3e-4ac9-95a0-47523b97e85d" />
<img width="1918" height="939" alt="Zrzut ekranu 2025-06-09 141730" src="https://github.com/user-attachments/assets/212d7514-ec23-4a33-a3ee-5350adba44e6" />
<img width="1903" height="947" alt="Zrzut ekranu 2025-06-09 141759" src="https://github.com/user-attachments/assets/1b314ab4-ad19-433c-bd59-5c0f1859c583" />
<img width="752" height="401" alt="Zrzut ekranu 2025-06-16 165956" src="https://github.com/user-attachments/assets/5763db75-9dcf-432f-8bfc-f5b4946d7e1c" />

