## getblink.fun

getblink.fun is a no-code platform designed to make decentralized finance (DeFi) on Solana accessible to everyone. It allows users to create and share "Blinks"-simple, shareable links that trigger on-chain DeFi actions directly from platforms like Twitter.
> At getblink.fun you can create BLINKS that can power transactions on Solana from Twitter itself!

Here's a Demo video of how to create an LP Blink on [getblink.fun](https://getblink.fun), check out the [demo video](https://app.supademo.com/demo/cmanvljkp0eyeho3rh0tv7ixw?step=1).

---

## Features

- **No-Code DeFi:** Create and share links that execute Solana DeFi actions-no coding required.
- **Social Integration:** Trigger blockchain transactions directly from social platforms like Twitter.
- **User-Friendly:** Designed to lower the barrier for creating blinks, boosting crypto adoption by making blockchain interactions simple and intuitive for everyone.

---

## How It Works

1. **Create a Blink:** Users generate a unique link (Blink) on getblink.fun that encodes a specific Solana transaction or DeFi action.
2. **Share the Blink:** The link can be shared anywhere-social media, chat apps, or directly with friends.
3. **Trigger On-Chain Actions:** When someone clicks the Blink, it initiates the specified Solana transaction, all from their browser.

---

## Running getblink.fun Locally

Follow these steps to set up and run the project on your local machine:

### **Prerequisites**

- Node.js v18.18.0 or higher

### **Installation Steps**

1. **Clone the Repository**

   ```bash
   git clone https://github.com/shubhiscoding/getblink.fun.git
   cd getblink.fun
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Configure Environment Variables**

   Create a `.env` file in the project root with the following content:

   ```
   SOLANA_RPC=
   WALLET=
   METEORA_IMAGE=
   MONGODB_URI=
   ```

4. **Start the Web App**

   ```bash
   npm run dev
   ```

   This will launch the React-based web application in development mode.

---

## Available Commands

| Command         | Description                     |
|-----------------|---------------------------------|
| npm run dev     | Start the web app (development) |
| npm run build   | Build the web app for production|

---

## Tech Stack

- **Frontend:** Next
- **Blockchain:** Solana
- **Backend:** MongoDB (for data storage)

---

## Contributing

Feel free to fork the repository and submit pull requests to help improve the platform.

---

<!-- GitAds-Verify: YCAQEQWID1YFA1XOYQ41YMZRLSRFHMW2 -->
