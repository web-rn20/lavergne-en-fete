declare namespace NodeJS {
  interface ProcessEnv {
    // Google Sheets API
    GOOGLE_SERVICE_ACCOUNT_EMAIL: string;
    GOOGLE_PRIVATE_KEY: string;
    GOOGLE_SPREADSHEET_ID: string;

    // Resend Email API
    RESEND_API_KEY: string;
    RESEND_FROM_EMAIL: string;

    // Admin
    ADMIN_EMAILS: string;

    // Application
    RSVP_DEADLINE: string;
    MAX_HEBERGEMENT_PLACES: string;
    NEXT_PUBLIC_BASE_URL: string;
  }
}
