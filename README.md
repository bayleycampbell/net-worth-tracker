# Net Worth Tracker

A simple mobile app to track your personal net worth. Input your assets and liabilities to automatically calculate your total net worth.

## Features

- 📊 **Dashboard** - View your total net worth at a glance
- 💰 **Assets** - Add and manage all your assets (savings, investments, property, etc.)
- 💳 **Liabilities** - Track all your debts (mortgage, loans, credit cards, etc.)
- 📱 **Cross-platform** - Works on both iOS and Android
- 💾 **Local Storage** - All data is stored securely on your device

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI installed globally: `npm install -g expo-cli`

### Installation

1. Clone the repository:
```bash
git clone https://github.com/bayleycampbell/net-worth-tracker.git
cd net-worth-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Start the app:
```bash
npm start
```

### Running on Your Phone

#### iOS
- Press `i` in the terminal after running `npm start`
- Or scan the QR code with the Camera app

#### Android
- Press `a` in the terminal after running `npm start`
- Or download the Expo Go app and scan the QR code

### Running on Web
```bash
npm run web
```

## How to Use

1. **Add Assets** - Tap the 💰 Assets tab and press the `+` button to add assets like:
   - Savings account
   - Checking account
   - Investments
   - Real estate
   - Vehicles
   - Other valuables

2. **Add Liabilities** - Tap the 💳 Liabilities tab and press the `+` button to add debts like:
   - Mortgage
   - Car loans
   - Student loans
   - Credit card debt
   - Other loans

3. **View Net Worth** - The 📊 Dashboard tab shows:
   - Your total net worth (Assets - Liabilities)
   - Total assets
   - Total liabilities
   - Breakdown of your top items

### Deleting Items

Long press on any asset or liability to delete it.

## Data Storage

All your data is stored locally on your device using AsyncStorage. Your financial information never leaves your phone.

## Tech Stack

- **React Native** - Cross-platform mobile framework
- **Expo** - React Native framework for quick development
- **AsyncStorage** - Local data persistence

## Future Enhancements

- Historical net worth tracking
- Charts and visualizations
- Data export to CSV
- Cloud backup (optional)
- Budget tracking
- Goal setting

## License

MIT License - feel free to use this for your own projects!

## Support

If you have any issues or suggestions, please open an issue on GitHub.
