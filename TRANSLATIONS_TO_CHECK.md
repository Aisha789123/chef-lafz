# Translations to check

These words have `"needsCheck": true` in the data. Please ask a family member who cooks (or knows the
Pakistani market words) to check the **Urdu** column. If it is right, delete `"needsCheck":true` from that
line in the JSON file. If it is wrong, change the `urdu` (and `romanUrdu`) text.

| File | Id | English | Urdu now | Why it is unsure |
|---|---|---|---|---|
| data/tools.json | tool-ladle | Ladle | ڈوئی / کرچھی | Families use different words for a deep soup ladle. |
| data/tools.json | tool-spider | Spider (skimmer) | جالی والا کفگیر (پونی) | Not sure "پونی" is the common word everywhere. |
| data/vegetables.json | veg-courgette | Courgette | توری جیسی ہری سبزی (زکینی) | No real Urdu word; "زکینی" is used in shops. |
| data/vegetables.json | veg-celery | Celery | اجوائن کا ساگ (سیلری) | Many people just say "سیلری". |
| data/vegetables.json | veg-rocket | Rocket | راکٹ کے پتے (تارا میرا) | "تارا میرا" is the plant; leaves may not be known by that name. |
| data/vegetables.json | veg-fennel | Fennel (bulb) | سونف کی گانٹھ (فینل) | Fennel bulb is rare in Pakistan. |
| data/vegetables.json | veg-beansprouts | Beansprouts | انکری ہوئی مونگ | Could also be "مونگ کے انکرے". |
| data/spices.json | spice-cayenne | Cayenne pepper | تیز لال مرچ پاؤڈر (کین) | No separate Urdu word. |
| data/spices.json | spice-allspice | Allspice | آل اسپائس (جمیکن مرچ) | No common Urdu word. |
| data/spices.json | spice-basil | Basil | نیازبو (بیسل) | "نیازبو / تلسی" — which word is used in your area? |
| data/spices.json | spice-lemongrass | Lemongrass | لیمن گراس (لیموں گھاس) | Mostly the English word is used. |
| data/fruits.json | fruit-raspberry | Raspberry | ریزبیری (لال بیری) | "رس بھری" in Pakistan usually means cape gooseberry, so it was NOT used. |
| data/fruits.json | fruit-rhubarb | Rhubarb | ریوند چینی (رہوبارب) | "ریوند چینی" is the medicinal root; the vegetable is not common. |
| data/phrases.json | phr-away | Mains away! | اگلا کورس (مین کھانا) شروع کرو! | UK kitchens use "away" slightly differently from place to place. |

## Also worth a quick look
- **englishInUrduScript** (how to say the English word, in Urdu letters) was written for a British accent,
  e.g. oven → اَوَن, salmon → سیمن, lamb → لیم. Change any that look strange to you.
- **Example sentences** are kept very short and simple on purpose.
