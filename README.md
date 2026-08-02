<img width="1995" height="1030" alt="DimeBoard Logo" src="https://github.com/user-attachments/assets/afd8e2c9-ab90-4520-b724-f53ee9ab5356" />
DimeBoard is an upcoming AI-powered Stock, Crypto, and Blockchain analytics platform designed to transform complex financial data into actionable insights. The system aggregates real-time and historical market data, applies artificial intelligence for predictive analysis.

**DISCLAIMER (PLEASE READ THOROUGHLY): I am not a Stock, Cryptocurreny, or Blockchain professional or expert. This is only a software project. Please do NOT use this for ANY Stock, Cryptocurreny, or Blockchain decisions. Take this as a fun project**

**Tools being used for this project:**

- `ASP.NET Core` – serves as the backend API layer of the application. It handles business logic, processes incoming HTTP requests from the React frontend, integrates with external services like financial APIs and the HuggingFace API, and communicates with MS SQL Server for persistent data storage. It also manages dependency injection, configuration, authentication (if implemented), and security. This layer acts as the central orchestrator of the entire system.
- `React.js` – powers the frontend user interface of the application. It renders the dashboard, manages application state, handles user interactions, and sends API requests to the ASP.NET Core backend. React does not directly access the database or external services; instead, it consumes structured data returned from the backend and transforms it into visual components such as charts, tables, and sentiment indicators.
- `Microsoft SQL Server` – provides persistent data storage for the application. It stores user accounts, portfolio data, watchlists, transaction history, and any cached AI results. The database is accessed exclusively through the ASP.NET Core backend, ensuring data integrity, validation, and security. This separation ensures that sensitive data is never exposed directly to the frontend.
- `Node.js` –  supports server-side logic through Next.js API routes and server actions. It handles authentication workflows, request validation, data processing, and communication with Firebase and AI services, ensuring scalable and efficient backend operations.
- `Azure` - provides persistent data storage for the application. It stores user accounts, portfolio data, watchlists, transaction history, and any cached AI results. The database is accessed exclusively through the ASP.NET Core backend, ensuring data integrity, validation, and security. This separation ensures that sensitive data is never exposed directly to the frontend.
- `Swagger` - is used for automatic API documentation and endpoint testing. It generates interactive documentation for all ASP.NET Core controllers, allowing developers to test endpoints directly from the browser. Swagger improves development efficiency, simplifies debugging, and provides clear documentation of request and response structures
- `HuggingFace API` – provides AI-powered capabilities within the application. It is used to perform tasks such as sentiment analysis, text classification, or summarization on financial news and market data. The ASP.NET Core backend sends text data to HuggingFace, processes the AI response, and returns structured insights to the frontend for display in the dashboard.

**Landing Page**

This is the landing page that users will enter once starting the platform.
<img width="1918" height="867" alt="DimeBoard Landing" src="https://github.com/user-attachments/assets/2be6650d-0d56-4bcd-9347-a70615d4e9af" />

**Dashboard**

Dashboard where users can see market trends such as Stock, Crypto, and Blockchain charts that contain metrics, summaries, conversations and a quick view of the latest news.
<img width="1901" height="866" alt="DimeBoard Dashboard" src="https://github.com/user-attachments/assets/8c5c7102-77c9-4147-90cc-45e439a45ad7" />

**Markets Page**

Market page Where users will be able to view AI Market Summary, Market Sentiments, Assets and metrics and overall what's going on the market.
<img width="1900" height="871" alt="DimeBoard Markets" src="https://github.com/user-attachments/assets/fb799ff5-eb2c-4aa4-b5e5-28a26591cc35" />

**Crytpo Page**

Crytpo page Where users can view crypto information such as Crypto summaries, tokens and all information and analysis on everything crypto related.
<img width="1895" height="866" alt="DimeBoard Crypto" src="https://github.com/user-attachments/assets/7031b943-24e4-424f-af75-df90563e692d" />

**Blockchain Page**

Blockchain page Where users can get an AI overview of Network Activity, Transaction / SEC data, and Network data and charts that collected from the APIs and analyzed with AI.
<img width="1897" height="871" alt="DimeBoard Blockchain" src="https://github.com/user-attachments/assets/82f45276-4610-4e51-aa7e-31338b44ae72" />

**AI Insights Page**

AI Insights page where users can get insights on the market and outlook all analyzed by AI that provides them with analysis and information. 
<img width="1898" height="871" alt="DimeBoard AI Insights" src="https://github.com/user-attachments/assets/3d6faf18-78c8-490e-ac12-4403d149b3a6" /> 



