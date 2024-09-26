# SecureLog

**SecureLog** is a template login and signup service designed for web applications. This project offers foundational infrastructure for managing user authentication using **MongoDB**, with static HTML and dynamic **EJS** web pages for the front end.

## Features

- **User Authentication**: Signup and login functionality.
- **Asynchronous Credential Storage**: Credentials stored securely in a MongoDB database.
- **Session Management**: Token-based authentication system for maintaining user sessions.

## Getting Started

### Prerequisites

- **Node.js**: Ensure you have Node.js installed. You can download it from [Node.js official website](https://nodejs.org/).
- **MongoDB**: Install MongoDB or use a hosted solution like [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/BnjmnZmmrmn/SecureLog.git
   cd SecureLog
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up configs**:
   Create a config for your MongoDB credentials:
   ```yaml
   mongodb:
     uri: // your api key
     db:  // your db name
   ```
   Create a config for you token secrets:
   ```yaml
   tokens:
     secret_key: // secret server key
     header_key: // header key
   ```

5. **Run the server**:
   ```bash
   npm run start
   ```

6. **Access the application**:
   Open your browser and go to `http://localhost:3000`.

7. **Make your changes**
   Customize the landing pages with your website name and image. Build your website from the auth/landing page, and amend stylesheet as fit.

## Contributing

TBD

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
