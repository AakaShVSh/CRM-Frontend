```markdown
# CRM Frontend

## Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/your-username/crm-frontend.git
cd crm-frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure backend URL
Open `src/apis/customerApi.js` and set your backend URL:
```js
const baseUrl = "http://localhost:8080/api"; // local
// const baseUrl = "https://crm-frontend-grjk.onrender.com"; // production
```

### 4. Start the development server
```bash
npm run dev
```

App runs at `http://localhost:5173`
```