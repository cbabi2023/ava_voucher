# AVA Voucher

A modern, responsive voucher management system built with Next.js. Create, manage, and print vouchers with ease.

## Features

- ✅ Create vouchers with all required fields
- ✅ Fixed "AVA" title with customizable suffix
- ✅ Payment type selection (Cash/Bank Transfer)
- ✅ Automatic date fetching with manual override
- ✅ Four signature fields (Prepared By, Checked By, Approved By, Received By)
- ✅ Print functionality - 2 vouchers per A4 sheet
- ✅ Local storage for data persistence
- ✅ Fully responsive and mobile-friendly design
- ✅ Edit and delete vouchers
- ✅ Select multiple vouchers for batch printing

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment to Vercel

### Option 1: Deploy via Vercel CLI

1. Install Vercel CLI globally:
```bash
npm i -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy to production:
```bash
vercel --prod
```

### Option 2: Deploy via GitHub

1. Push your code to a GitHub repository:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-github-repo-url>
git push -u origin main
```

2. Go to [vercel.com](https://vercel.com) and sign in
3. Click "New Project"
4. Import your GitHub repository
5. Vercel will automatically detect Next.js and configure the project
6. Click "Deploy"

### Option 3: Deploy via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Click "Browse" and select your project folder
4. Vercel will automatically detect Next.js
5. Click "Deploy"

## Project Structure

```
ava_voucher/
├── app/
│   ├── components/
│   │   ├── VoucherForm.tsx      # Form for creating/editing vouchers
│   │   └── VoucherDisplay.tsx    # Component to display voucher
│   ├── types/
│   │   └── voucher.ts            # TypeScript types
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Main page
├── next.config.js                # Next.js configuration
├── tailwind.config.js            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript configuration
└── package.json                  # Dependencies
```

## Usage

1. **Create a Voucher:**
   - Fill in all required fields in the form
   - Click "Create Voucher"

2. **Edit a Voucher:**
   - Click "Edit" on any saved voucher
   - Modify the fields
   - Click "Update Voucher"

3. **Print Vouchers:**
   - Select vouchers using the checkboxes
   - Click "Print Selected"
   - The print dialog will open with 2 vouchers per A4 page

4. **Delete Vouchers:**
   - Click "Delete" on any voucher
   - Or use "Clear All" to remove all vouchers

## Voucher Fields

- **Title Suffix**: Text after "AVA" (e.g., "Payment Voucher")
- **Payment Type**: Cash or Bank Transfer
- **Voucher Heading**: Main heading for the voucher
- **Voucher Number**: Unique identifier
- **Date**: Automatically set to today (editable)
- **Account Head**: Account classification
- **Pay To**: Recipient name
- **Sum of Rs**: Amount in words
- **Towards**: Payment purpose
- **Amount (Rs)**: Numeric amount
- **Signature Fields**: Prepared By, Checked By, Approved By, Received By

## Data Storage

Vouchers are stored in the browser's localStorage, so they persist across sessions on the same device and browser.

## Technologies Used

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **LocalStorage** - Data persistence

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT

## Support

For issues or questions, please open an issue on the repository.

