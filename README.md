# Scicli Selection — Prodotto Parlante
## Guida al Deploy su Vercel

---

### Struttura del progetto

```
scicli-selection/
├── api/
│   └── chat.js        ← Backend: chiama Anthropic con la tua chiave segreta
├── public/
│   └── index.html     ← Frontend: la chat che vedono i clienti
├── vercel.json        ← Configurazione Vercel
└── README.md
```

---

### Deploy in 5 minuti

#### 1. Crea account Vercel (gratis)
→ https://vercel.com/signup

#### 2. Ottieni la tua chiave API Anthropic
→ https://console.anthropic.com
- Crea account
- Vai su "API Keys" → "Create Key"
- Copia la chiave (inizia con `sk-ant-...`)
- I primi $5 di crediti sono gratuiti (~1.250 conversazioni con Haiku)

#### 3. Installa Vercel CLI
```bash
npm install -g vercel
```

#### 4. Deploy
```bash
cd scicli-selection
vercel
```
Segui le istruzioni nel terminale (conferma il nome progetto, ecc.)

#### 5. Aggiungi la chiave API come variabile d'ambiente
```bash
vercel env add ANTHROPIC_API_KEY
```
→ Incolla la tua chiave quando richiesto
→ Seleziona tutti gli ambienti (Production, Preview, Development)

#### 6. Re-deploy con la variabile
```bash
vercel --prod
```

#### 7. Il tuo sito è online!
Vercel ti darà un URL tipo: `https://scicli-selection.vercel.app`

---

### Come funzionano i QR code

Ogni prodotto ha un URL unico:
- Datterino: `https://tuosito.vercel.app?p=datterino`
- Grappolo: `https://tuosito.vercel.app?p=grappolo`
- Zucchina Equilibrio: `https://tuosito.vercel.app?p=zucchina-eq`
- Zucchina Carattere: `https://tuosito.vercel.app?p=zucchina-car`
- Peperone: `https://tuosito.vercel.app?p=peperone`
- Melanzana: `https://tuosito.vercel.app?p=melanzana`

Quando il cliente scansiona il QR, si apre direttamente la chat del prodotto giusto.

---

### Costi operativi

| Volume | Costo stimato (Claude Haiku) |
|--------|------------------------------|
| 1.000 utenti | ~€4 |
| 5.000 utenti | ~€20 |
| 10.000 utenti | ~€40 |

Basato su: 5 domande medie per utente, ~2.000 token totali a conversazione.

---

### Aggiungere/modificare prodotti

Apri `public/index.html` e modifica l'array `PRODUCTS`:

```javascript
{
  id: "nuovo-prodotto",       // identificatore URL
  emoji: "🥗",               // emoji visualizzato
  name: "Nome del Prodotto",  // nome completo
  linea: "Scicli Dolce — descrizione breve linea",
  tagline: "Slogan breve prodotto.",
  params: [                   // parametri sensoriali (0-100)
    {n:"Dolcezza", v:80},
    {n:"Acidità",  v:40},
    ...
  ],
  qs: [                       // domande suggerite nella chat
    "Prima domanda?",
    "Seconda domanda?",
    ...
  ],
  info: `Descrizione completa del prodotto per l'AI...`
}
```

---

### Sicurezza

- La chiave Anthropic è **solo sul server** (variabile Vercel)
- Il cliente non vede mai la chiave
- Limite: max 20 messaggi per sessione (protezione da abusi)
- Il frontend chiama solo `/api/chat` (il tuo backend)

---

### Supporto

Per modifiche o personalizzazioni aggiuntive, contatta il tuo sviluppatore di riferimento.
