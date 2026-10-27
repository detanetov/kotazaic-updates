# Kotazaic and Stars — обновления

Отсюда игра (PC и Android) сама скачивает новые версии при запуске.

Текущая версия: **1.4.0** (сборка 98) — 1.4.0: лимитированная коллекция «Котики» — 50 милых кошачьих вещей

Не удаляйте и не переименовывайте `game.html` и `version.json`.

Игры лаунчера: `kotoio.html` (koto.io), `lazy.html` (Ленивая жизнь), `space.html` (Котозайцы в космосе), `fat.html` (Котозайцы-обжоры), `click.html` (Kotozaic Clicker). `pcext.js` — дополнения для ПК-лаунчера, он скачивает их при запуске.


Лаунчер для iPhone/iPad: открой в Safari https://raw.githack.com/detanetov/kotazaic-updates/main/ilauncher.html и добавь на экран «Домой» (или установи профиль `KotazaicLauncher.mobileconfig`).

### iPhone-лаунчер обновляется сам — для всех чатов
- `ilauncher.html` при каждом запуске берёт свежий `mlauncher.html` из этого репозитория (если в `version.json` у `mlauncher` версия выше), сам переделывает его под iPhone и хранит на телефоне. Пересобирать `ilauncher.html` после обновления телефонного лаунчера **не нужно**.
- Новая игра появится на iPhone сама, если добавить её в `version.json` отдельным ключом с полем `file` на `.html` (например `"fat": {"version":1,"name":"Название 1.0: описание","file":"fat.html",...}`). Название берётся из `name` до двоеточия, можно задать `title`, `desc`, `icon`. Лучше всё равно добавить игру и в `GAMES` в `mlauncher.html` — тогда будет красивая обложка.
- Исходники iPhone-обёртки: `tools/ilauncher/` (`shim.js`, `mk.py`).
