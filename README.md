# Liberty Express Package Delivery Status Checker

This is a Node.js application that checks the status of a series of package deliveries from Liberty Express (https://libertyexpress.com/es-ve/). It utilizes Puppeteer for web scraping and email notifications to alert you when there are changes in the package statuses.

## Prerequisites

Before running the application, make sure you have the following installed:

- Node.js (v12 or higher)
- NPM (Node Package Manager)

## Installation

1. Clone this repository to your local machine:

   ```bash
   git clone https://github.com/camilo-mujica/liberty-express-package-checker.git

   ```

2. Navigate to the project directory:

   ```bash
   cd liberty-express-package-checker
   ```

3. Install the project dependencies:

   ```bash
   yarn install
   ```

4. Create a `.env` file in the root directory of the project and add the following environment variables:

   - TIMER: Timer in milliseconds
   - PACKAGES: Tracking numbers, a comma-separated list of tracking numbers
   - RECIPIENT_EMAILS: Email address to send notifications to, a comma-separated list of email addresses
   - EMAIL_FROM: Email address to send notifications from
   - EMAIL_FROM_NAME: Email address from name
   - EMAIL_HOST: Email address host
   - EMAIL_PORT: Email address port
   - EMAIL_PASSWORD: Email address password

## Usage

To run the application:

```bash
yarn build && yarn start
```

The application will check the status of the packages immediately upon starting, and then at the specified interval according to the TIMER environment variable.

## Email Notifications

The application supports email notifications to alert you when there are changes in the package statuses. To enable this feature, make sure to configure the email service in the `mailService.ts` file. Replace the `sendEmail` function with your own implementation or integrate with an email service provider of your choice.

## License

This project is licensed under the MIT License. Feel free to modify and distribute it as per your requirements.

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, please open an issue or submit a pull request.

## Acknowledgments

- This project utilizes the Puppeteer library for web scraping.
- The project README.md file was made with the help of the OpenAI GPT-3 Playground.

## Disclaimer

**DISCLAIMER: This project is intended for educational purposes only. The code provided is for learning and demonstration purposes, and it is not intended for any commercial or production use. By using this project, you understand and agree that the author and contributors of this project are not responsible for any legal repercussions that may arise from the use of this code.**

Please use this application responsibly and in accordance with the terms and conditions of the website you are scraping. Be mindful of any legal and ethical considerations when utilizing web scraping techniques. The author and contributors of this project do not endorse or encourage any unauthorized or unethical use of web scraping methods. Use at your own risk.
