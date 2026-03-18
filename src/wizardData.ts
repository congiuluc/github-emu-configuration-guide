export type IdpType = 'entra-id' | 'okta';
export type SsoProtocol = 'saml' | 'oidc';

export interface WizardConfig {
  dataResidency: boolean;
  idpType: IdpType;
  ssoProtocol: SsoProtocol;
  manageCopilot: boolean;
  manageOrgs: boolean;
  manageGHAS: boolean;
}

export const defaultConfig: WizardConfig = {
  dataResidency: true,
  idpType: 'entra-id',
  ssoProtocol: 'saml',
  manageCopilot: true,
  manageOrgs: false,
  manageGHAS: false,
};

export interface DocLink {
  title: string;
  url: string;
  description?: string;
}

export interface EmailTemplateSection {
  heading: string;
  lines: string[];
}

export interface EmailTemplate {
  subject: string;
  greeting: string;
  intro: string;
  sections: EmailTemplateSection[];
  closing: string[];
}

export interface SubStep {
  action: string;
  details?: string[];
  emailTemplate?: EmailTemplate;
  verification: string;
  docLinks?: DocLink[];
}

export interface WizardStep {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  substeps: SubStep[];
  prerequisites?: string[];
  notes?: string[];
  warnings?: string[];
  tips?: string[];
  links: DocLink[];
  /** If set, this step only applies to that data-residency mode */
  dataResidencyOnly?: boolean;
  noDataResidencyOnly?: boolean;
}

/* ------------------------------------------------------------------ */
/*  Steps WITH Data Residency (GHE.com)                               */
/* ------------------------------------------------------------------ */
const drSteps: WizardStep[] = [
  {
    id: 'dr-prerequisites',
    title: 'Prerequisites & Planning',
    shortTitle: 'Prerequisites',
    description:
      'Review requirements before starting your EMU enterprise with data residency on GHE.com.',
    prerequisites: [
      'An active Azure subscription with billing configured (required for Entra ID and GitHub licensing).',
      'Admin access to a Microsoft Entra ID tenant (or Okta/PingFederate tenant).',
      'A GitHub Enterprise Cloud subscription or Enterprise agreement — contact GitHub Sales if needed.',
      'An Entra ID user account with at least the Cloud Application Administrator role (required to create enterprise applications).',
    ],
    substeps: [
      {
        action: 'Choose a supported Identity Provider (IdP): Microsoft Entra ID (recommended), Okta, or PingFederate.',
        details: [
          'Entra ID offers the deepest integration with OIDC + SCIM support.',
          'Okta and PingFederate are supported via SAML + SCIM.',
        ],
        verification: 'Confirm you have admin access to your IdP tenant and can create enterprise applications.',
        docLinks: [
          {
            title: 'About EMU identity providers',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/concepts/identity-and-access-management/enterprise-managed-users#how-does-emus-integrate-with-identity-management-systems',
            description: 'List of supported IdPs for EMU',
          },
        ],
      },
      {
        action: 'Decide on the data residency region (e.g., EU).',
        details: [
          'Data residency determines where your code, issues, PRs, and metadata are stored.',
          'Once set, the region CANNOT be changed — choose carefully.',
        ],
        verification: 'Document the chosen region and confirm it meets your compliance requirements.',
        docLinks: [
          {
            title: 'About data residency',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/data-residency/about-github-enterprise-cloud-with-data-residency',
            description: 'Available regions and what data is covered',
          },
        ],
      },
      {
        action: 'Confirm your organization has an Enterprise agreement or GitHub Enterprise Cloud subscription.',
        verification: 'Open your GitHub billing page or contact your account manager to verify the subscription is active.',
        docLinks: [
          {
            title: 'GitHub Enterprise Cloud plans',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/get-started/learning-about-github/githubs-plans#github-enterprise',
            description: 'Overview of Enterprise Cloud plans',
          },
        ],
      },
      {
        action: 'Identify the person who will act as the setup user.',
        details: [
          'The setup user receives the initial credentials from GitHub.',
          'This becomes the break-glass admin account for the enterprise.',
        ],
        verification: 'Confirm the setup user has been notified and has a secure channel to receive credentials.',
        docLinks: [
          {
            title: 'Getting started with data residency',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/data-residency/getting-started-with-data-residency-for-github-enterprise-cloud',
            description: 'Step-by-step onboarding checklist including setup user details',
          },
        ],
      },
      {
        action: 'Plan the enterprise short code / namespace.',
        details: [
          'The short code becomes part of all managed user handles (e.g., user_SHORTCODE).',
          'It also becomes the GHE.com subdomain: https://SHORTCODE.ghe.com',
        ],
        verification: 'Document the desired short code and confirm it is unique and appropriate for your organization.',
        docLinks: [
          {
            title: 'Getting started with data residency',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/data-residency/getting-started-with-data-residency-for-github-enterprise-cloud',
            description: 'Step-by-step onboarding checklist',
          },
        ],
      },
    ],
    warnings: [
      'Data residency enterprises use GHE.com (e.g., https://YOUR-ENTERPRISE.ghe.com) instead of github.com.',
      'Once a data residency region is selected, it CANNOT be changed later.',
    ],
    tips: [
      'Plan your namespace carefully — the enterprise short code becomes part of all managed user handles.',
    ],
    links: [
      {
        title: 'About Enterprise Managed Users',
        url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/concepts/identity-and-access-management/enterprise-managed-users',
        description: 'Official overview of EMU features and constraints',
      },
      {
        title: 'About data residency for GitHub Enterprise Cloud',
        url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/data-residency/about-github-enterprise-cloud-with-data-residency',
        description: 'Learn how data residency works and what regions are available',
      },
      {
        title: 'Getting started with data residency',
        url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/data-residency/getting-started-with-data-residency-for-github-enterprise-cloud',
        description: 'Step-by-step onboarding checklist from GitHub',
      },
    ],
  },
  {
    id: 'dr-create-enterprise',
    title: 'Create a New EMU Enterprise',
    shortTitle: 'Create Enterprise',
    description:
      'Create a new GitHub Enterprise Managed Users enterprise with data residency on GHE.com. You can start a trial via self-service or contact GitHub Sales for a full agreement.',
    prerequisites: [
      'All prerequisites from Step 0 are satisfied.',
      'Enterprise short code / namespace has been decided.',
      'A GitHub.com personal account to initiate the trial (if using self-service).',
    ],
    substeps: [
      {
        action: 'Option A — Start a trial via self-service setup.',
        details: [
          'Navigate to https://github.com/account/enterprises/new?users_type=enterprise_managed to start a GitHub Enterprise Managed Users trial.',
          'Sign in with your personal GitHub.com account (this account will become the initial enterprise owner).',
          'Choose your enterprise name (short code / slug) — this will be used in all managed usernames (e.g., user_SHORTCODE).',
          'Select "Enterprise with data residency" and choose the desired region (e.g., EU).',
          'Complete the signup form and submit.',
          'The trial includes 50 seats and lasts 30 days — you can upgrade to a paid plan at any time.',
        ],
        verification: 'The form has been submitted successfully and you see a confirmation page.',
        docLinks: [
          {
            title: 'Setting up a trial of GitHub Enterprise Cloud',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/overview/setting-up-a-trial-of-github-enterprise-cloud',
            description: 'How to start and manage a GitHub Enterprise Cloud trial',
          },
          {
            title: 'Getting started with data residency',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/data-residency/getting-started-with-data-residency-for-github-enterprise-cloud',
            description: 'Step-by-step onboarding checklist from GitHub',
          },
        ],
      },
      {
        action: 'Wait for the enterprise creation confirmation email from GitHub.',
        details: [
          'After submitting the form, GitHub will begin provisioning the enterprise. This is NOT instant.',
          'Check the inbox of the email address associated with the personal GitHub.com account used during signup.',
          'You will receive an email from GitHub confirming that the enterprise has been created and is ready to use.',
          'The email will contain a link to your new enterprise at https://YOUR-ENTERPRISE.ghe.com.',
          'Provisioning typically takes a few minutes but may take longer during peak times.',
        ],
        verification: 'You have received the email from GitHub confirming the enterprise creation is complete.',
        docLinks: [
          {
            title: 'Setting up a trial of GitHub Enterprise Cloud',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/overview/setting-up-a-trial-of-github-enterprise-cloud',
            description: 'Trial provisioning process and expected timelines',
          },
        ],
      },
      {
        action: 'Option B — Contact GitHub Sales for a full Enterprise agreement.',
        details: [
          'If you need more than 50 seats, require an invoice/PO-based agreement, or your organization has specific procurement requirements, contact GitHub Sales.',
          'Provide the following information: company name, desired enterprise short code, data residency region (e.g., EU), and the email address for the setup user.',
          'If you have an existing Enterprise agreement, reference it in the request.',
          'Processing time varies — typically a few business days. You will receive an email when the enterprise is ready.',
        ],
        verification: 'You have received the provisioning confirmation email from GitHub with the enterprise URL.',
        docLinks: [
          {
            title: 'GitHub Enterprise Sales',
            url: 'https://github.com/enterprise/contact',
            description: 'Contact GitHub Sales for an enterprise agreement',
          },
        ],
      },
      {
        action: 'Verify the enterprise URL is accessible.',
        details: [
          'Open a browser and navigate to https://YOUR-ENTERPRISE.ghe.com.',
          'You should see the enterprise dashboard or a sign-in page.',
          'If you used the trial self-service, you are already signed in as the enterprise owner.',
        ],
        verification: 'The enterprise URL loads successfully and you can access the enterprise settings.',
        docLinks: [
          {
            title: 'Getting started with data residency',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/data-residency/getting-started-with-data-residency-for-github-enterprise-cloud',
            description: 'Step-by-step onboarding checklist from GitHub',
          },
        ],
      },
    ],
    warnings: [
      'Data residency enterprises use GHE.com — this CANNOT be changed after provisioning.',
      'The enterprise short code becomes permanent and part of all user handles.',
      'Trial enterprises expire after 30 days if not upgraded to a paid plan.',
    ],
    tips: [
      'Double-check the short code before submitting — it cannot be changed later.',
      'The trial is a great way to test the EMU setup before committing to a paid plan.',
      'If you need multiple enterprises (e.g., for dev/prod separation), request them via GitHub Sales.',
    ],
    links: [
      {
        title: 'Start an EMU trial',
        url: 'https://github.com/account/enterprises/new?users_type=enterprise_managed',
        description: 'Self-service link to create a new EMU enterprise trial',
      },
      {
        title: 'About data residency for GitHub Enterprise Cloud',
        url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/data-residency/about-github-enterprise-cloud-with-data-residency',
        description: 'Learn how data residency works and what regions are available',
      },
      {
        title: 'Getting started with data residency',
        url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/data-residency/getting-started-with-data-residency-for-github-enterprise-cloud',
        description: 'Step-by-step onboarding checklist from GitHub',
      },
    ],
  },
  {
    id: 'dr-billing',
    title: 'Configure Billing via Azure Subscription',
    shortTitle: 'Billing',
    description:
      'Link an Azure subscription to your GitHub Enterprise for billing. All GitHub Enterprise charges (seats, Copilot, Actions, Packages, etc.) will be billed through the linked Azure subscription.',
    prerequisites: [
      'An Azure subscription with Owner or Contributor role.',
      'Billing admin or enterprise owner access in your GitHub Enterprise.',
      'Knowledge of your organization\'s procurement/purchasing process for software licenses.',
      'The Azure subscription must be active and not in a suspended or cancelled state.',
    ],
    substeps: [
      {
        action: 'Verify your GitHub Enterprise Cloud subscription is active.',
        details: [
          'Contact your GitHub account manager or check your Enterprise agreement to confirm the subscription.',
          'Ensure the subscription covers the expected number of seats (users).',
        ],
        verification: 'You have confirmation from GitHub or your procurement team that the Enterprise Cloud subscription is active.',
        docLinks: [
          {
            title: 'About billing for GitHub',
            url: 'https://docs.github.com/en/billing/get-started/how-billing-works',
            description: 'Overview of GitHub billing and plans',
          },
        ],
      },
      {
        action: 'Link the Azure subscription to your GitHub enterprise.',
        details: [
          'Go to your GitHub Enterprise settings → Billing → Payment information.',
          'Click "Add Azure subscription" and sign in to Azure with an account that has Owner or Contributor role on the target subscription.',
          'Select the Azure subscription and confirm the link.',
          'Requires: Azure subscription ID, and the ability to create resource providers in the subscription.',
          'Azure billing allows you to use your existing Azure commitment (MACC) and see GitHub costs in Azure Cost Management.',
          'All GitHub charges — Enterprise seats, Copilot seats, Actions minutes, Packages storage, and premium requests — will appear on your Azure invoice.',
        ],
        verification: 'The Azure subscription appears as the payment method in your GitHub enterprise billing settings.',
        docLinks: [
          {
            title: 'Connecting an Azure subscription',
            url: 'https://docs.github.com/en/billing/how-tos/set-up-payment/connect-azure-sub',
            description: 'Step-by-step guide for linking Azure subscriptions',
          },
        ],
      },
      {
        action: 'Plan Copilot licensing costs.',
        details: [
          'GitHub Copilot Business: $19/user/month (billed per assigned seat) — this is the default plan assigned at the enterprise level.',
          'GitHub Copilot Enterprise: $39/user/month (includes knowledge bases, PR summaries, and docset indexing) — requires creating an organization and assigning the Enterprise plan to that specific organization (see Copilot steps for details).',
          'Seats are charged when assigned — unassigned users do not incur cost.',
          'Estimate total monthly cost: number of Copilot users × per-seat price.',
          'Note: assigning users to an organization with Copilot Enterprise may also incur a GitHub Enterprise license cost per user in that organization.',
        ],
        verification: 'Document the expected number of Copilot seats and estimated monthly cost. Confirm budget approval.',
        docLinks: [
          {
            title: 'About billing for GitHub Copilot',
            url: 'https://docs.github.com/en/billing/concepts/product-billing/github-copilot-licenses',
            description: 'Copilot pricing and billing details',
          },
        ],
      },
      {
        action: 'Set up billing alerts and spending limits in Azure Cost Management.',
        details: [
          'Go to Azure portal → Cost Management → Budgets → Create a budget for the linked subscription.',
          'Set monthly budget thresholds and alert recipients (e.g., notify at 50%, 75%, 90% of budget).',
          'In GitHub: go to Enterprise settings → Billing → configure spending limits for Actions, Packages, and Codespaces.',
        ],
        verification: 'Azure budget alerts are configured and GitHub spending limits are set. Test or confirm the alert rules exist.',
        docLinks: [
          {
            title: 'Setting up budgets and alerts',
            url: 'https://docs.github.com/en/billing/how-tos/set-up-budgets',
            description: 'How to set spending limits for GitHub products',
          },
          {
            title: 'Azure Cost Management budgets',
            url: 'https://learn.microsoft.com/en-us/azure/cost-management-billing/costs/tutorial-acm-create-budgets',
            description: 'Create and manage Azure budgets',
          },
        ],
      },
    ],
    warnings: [
      'An Azure subscription is required for billing — GitHub direct billing (credit card/invoice) is not used in this configuration.',
    ],
    tips: [
      'If your organization has a Microsoft Azure commitment (MACC), linking your Azure subscription helps consume that commitment with GitHub charges.',
      'Review GitHub pricing regularly — seat counts and plan changes affect monthly costs.',
      'Use Azure Cost Management tags and cost analysis to break down GitHub spending by service (Copilot, Actions, etc.).',
    ],
    links: [
      {
        title: 'About billing on GitHub',
        url: 'https://docs.github.com/en/billing/get-started/how-billing-works',
        description: 'Overview of billing, plans, and payment methods',
      },
      {
        title: 'Connecting an Azure subscription',
        url: 'https://docs.github.com/en/billing/how-tos/set-up-payment/connect-azure-sub',
        description: 'Link your Azure subscription for consolidated billing',
      },
      {
        title: 'About billing for GitHub Copilot',
        url: 'https://docs.github.com/en/billing/concepts/product-billing/github-copilot-licenses',
        description: 'Copilot seat pricing and billing details',
      },
    ],
  },
  {
    id: 'dr-setup-enterprise',
    title: 'Receive Credentials & Sign In',
    shortTitle: 'Setup User',
    description:
      'GitHub will provision your GHE.com enterprise and send credentials to the setup user.',
    prerequisites: [
      'The data residency request has been submitted and approved by GitHub.',
      'Access to the email inbox designated to receive the setup user invitation.',
      'A password manager or secure vault ready to store the setup user credentials and 2FA recovery codes.',
    ],
    substeps: [
      {
        action: 'Check email for the setup user invitation sent by GitHub.',
        details: [
          'After GitHub processes your data residency request, the setup user receives an email.',
          'The email invites you to choose a password for the setup user account.',
          'The setup user handle is your enterprise short code + "_admin" (e.g., contoso_admin).',
        ],
        verification: 'Confirm the email has been received and you can access the setup link.',
        docLinks: [
          {
            title: 'Getting started with data residency',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/data-residency/getting-started-with-data-residency-for-github-enterprise-cloud#2-sign-in-to-your-enterprise',
            description: 'Setup user sign-in and initial configuration',
          },
        ],
      },
      {
        action: 'Set a password for the setup user account.',
        details: [
          'Use an incognito or private browsing window.',
          'Follow the link in the invitation email to set your password.',
          'Choose a strong, unique password and store it in a secure password manager.',
        ],
        verification: 'Password is set — you can sign in with the new password.',
        docLinks: [
          {
            title: 'Getting started with data residency',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/data-residency/getting-started-with-data-residency-for-github-enterprise-cloud#2-sign-in-to-your-enterprise',
            description: 'Setup user sign-in and initial configuration',
          },
        ],
      },
      {
        action: 'Sign in at https://YOUR-ENTERPRISE.ghe.com using the setup user account.',
        details: [
          'The setup user handle is your enterprise short code + "_admin" (e.g., contoso_admin).',
        ],
        verification: 'You are redirected to the GHE.com enterprise dashboard after sign-in.',
        docLinks: [
          {
            title: 'Sign in to your enterprise',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/data-residency/getting-started-with-data-residency-for-github-enterprise-cloud#2-sign-in-to-your-enterprise',
            description: 'How to sign in and secure the setup user account',
          },
        ],
      },
      {
        action: 'Enable two-factor authentication (2FA) on the setup user account.',
        details: [
          'Go to Settings → Password and authentication → Enable two-factor authentication.',
          'Save the recovery codes in a secure location (e.g., a password manager).',
        ],
        verification: 'The 2FA badge appears on the account, and recovery codes are stored securely.',
        docLinks: [
          {
            title: 'Configuring two-factor authentication',
            url: 'https://docs.github.com/en/authentication/securing-your-account-with-two-factor-authentication-2fa/configuring-two-factor-authentication',
            description: 'How to enable and configure 2FA',
          },
        ],
      },
      {
        action: 'Navigate to Enterprise settings to begin configuring authentication.',
        details: [
          'Go to https://YOUR-ENTERPRISE.ghe.com → Enterprise settings (top-right avatar).',
        ],
        verification: 'The Enterprise settings page loads and you can see Authentication security in the sidebar.',
        docLinks: [
          {
            title: 'Getting started with data residency',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/data-residency/getting-started-with-data-residency-for-github-enterprise-cloud#3-configure-authentication',
            description: 'Configure authentication for data residency enterprise',
          },
        ],
      },
      {
        action: 'Review and document your enterprise URLs for IdP configuration.',
        details: [
          'Enterprise URL: https://YOUR-ENTERPRISE.ghe.com',
          'SSO URL: https://YOUR-ENTERPRISE.ghe.com/enterprises/YOUR-ENTERPRISE/sso',
          'SAML ACS URL (Reply URL): https://YOUR-ENTERPRISE.ghe.com/saml/consume',
          'Entity ID / Audience: https://YOUR-ENTERPRISE.ghe.com',
          'SCIM Endpoint: https://api.YOUR-ENTERPRISE.ghe.com/scim/v2/enterprises/YOUR-ENTERPRISE',
        ],
        verification: 'All five enterprise URLs are documented and ready to paste into your IdP configuration.',
        docLinks: [
          {
            title: 'SAML configuration for data residency',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/data-residency/getting-started-with-data-residency-for-github-enterprise-cloud#3-configure-authentication',
            description: 'Data residency specific SAML endpoints',
          },
          {
            title: 'SCIM provisioning for data residency',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/data-residency/getting-started-with-data-residency-for-github-enterprise-cloud#4-configure-provisioning',
            description: 'Data residency specific SCIM endpoints',
          },
        ],
      },
    ],
    warnings: [
      'Store the setup user credentials securely — this account is the break-glass admin for your enterprise.',
      'Do NOT skip 2FA — the setup user will lose access if recovery codes are not saved.',
    ],
    links: [
      {
        title: 'Configuring the setup user',
        url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/data-residency/getting-started-with-data-residency-for-github-enterprise-cloud#2-sign-in-to-your-enterprise',
        description: 'How to sign in and secure the setup user account',
      },
    ],
  },
  {
    id: 'dr-configure-sso',
    title: 'Configure SAML SSO',
    shortTitle: 'SAML SSO',
    description:
      'Set up SAML single sign-on between your Identity Provider and GHE.com enterprise.',
    prerequisites: [
      'An Entra ID user with at least the Cloud Application Administrator role to create and configure enterprise applications.',
      'For Okta: admin access to your Okta org. For PingFederate: admin access to the PingFederate server.',
      'The setup user account credentials (you will need to sign in to GHE.com enterprise settings).',
      'The enterprise URLs from the previous step (ACS URL, Entity ID) ready to copy into the IdP.',
    ],
    substeps: [
      {
        action: 'In your IdP, create a new Enterprise Application for GitHub EMU.',
        details: [
          'Entra ID: search for "GitHub Enterprise Managed User" in the Azure AD Gallery.',
          'Okta: search for "GitHub Enterprise Managed User" in the OIN catalog.',
          'PingFederate: create a new SAML connection manually.',
        ],
        verification: 'The application is created and visible in your IdP application list.',
        docLinks: [
          {
            title: 'Entra ID gallery app for EMU',
            url: 'https://learn.microsoft.com/en-us/entra/identity/saas-apps/github-enterprise-managed-user-tutorial',
            description: 'Microsoft tutorial: Entra ID + GitHub EMU integration',
          },
        ],
      },
      {
        action: 'Copy the ACS URL and Entity ID from GitHub enterprise settings into your IdP.',
        details: [
          'Navigate to your enterprise → click "Identity provider" → "Single sign-on configuration".',
          'ACS URL: https://YOUR-ENTERPRISE.ghe.com/saml/consume',
          'Entity ID / Audience: https://YOUR-ENTERPRISE.ghe.com',
        ],
        verification: 'The ACS URL and Entity ID fields are populated in your IdP SAML configuration.',
        docLinks: [
          {
            title: 'SAML configuration for data residency',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/data-residency/getting-started-with-data-residency-for-github-enterprise-cloud#3-configure-authentication',
            description: 'Data residency specific SAML endpoints',
          },
        ],
      },
      {
        action: 'Configure the SAML attributes/claims.',
        details: [
          'NameID (required): unique, persistent identifier for the user. Ensure the format is "Persistent" — NOT "transient".',
          'emails (optional): user\'s email address — SCIM provisioning handles this, so it is not strictly required in SAML.',
          'full_name (optional): user\'s display name — also provisioned via SCIM.',
          'For Entra ID: the default claims from the gallery app are sufficient — the default NameID source (user.userprincipalname) is a human-readable, persistent identifier that meets GitHub requirements. No Attributes & Claims changes are strictly necessary.',
        ],
        verification: 'NameID is configured with a persistent format. Optional claims (emails, full_name) added if desired.',
        docLinks: [
          {
            title: 'GitHub SAML configuration reference',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/managing-iam/iam-configuration-reference/saml-configuration-reference',
            description: 'SAML attributes: NameID (required — human-readable, persistent identifier), emails and full_name (optional)',
          },
        ],
      },
      {
        action: 'In GitHub enterprise settings, paste the IdP metadata into the SAML configuration.',
        details: [
          'Navigate to your enterprise → click "Identity provider" at the top.',
          'Under Identity Provider, click "Single sign-on configuration".',
          'Under "SAML single sign-on", select "Add SAML configuration".',
          'Paste the IdP Sign-on URL (SSO URL).',
          'Paste the Issuer (Entity ID from the IdP).',
          'Paste or upload the Public Certificate (Base64 encoded).',
          'Under Public Certificate, select the Signature Method and Digest Method matching your IdP.',
        ],
        verification: 'All fields (Sign-on URL, Issuer, Certificate, Signature/Digest Method) are populated in GitHub.',
        docLinks: [
          {
            title: 'Configuring SAML single sign-on for EMU',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/managing-iam/configuring-authentication-for-enterprise-managed-users/configuring-saml-single-sign-on-for-enterprise-managed-users',
            description: 'Steps to configure SAML SSO',
          },
        ],
      },
      {
        action: 'Click "Test SAML configuration" to validate the connection.',
        details: [
          'This test uses Service Provider initiated (SP-initiated) authentication.',
          'You must have at least one user assigned to the IdP application to test.',
        ],
        verification: 'The test completes successfully — you see a green "SAML SSO test successful" message.',
        docLinks: [
          {
            title: 'Configuring SAML SSO for EMU',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/managing-iam/configuring-authentication-for-enterprise-managed-users/configuring-saml-single-sign-on-for-enterprise-managed-users',
            description: 'Testing and enabling SAML SSO',
          },
        ],
      },
      {
        action: 'Click "Save SAML settings" to enable SAML SSO for the enterprise.',
        verification: 'The SAML SSO status shows "Enabled" in the Authentication security settings.',
        docLinks: [
          {
            title: 'Configuring SAML SSO for EMU',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/managing-iam/configuring-authentication-for-enterprise-managed-users/configuring-saml-single-sign-on-for-enterprise-managed-users',
            description: 'Enable SAML SSO for your enterprise',
          },
        ],
      },
      {
        action: 'Download the enterprise SSO recovery codes.',
        details: [
          'Click "Download", "Print", or "Copy" to save your recovery codes.',
          'Store recovery codes in a secure location (e.g., a password manager or vault).',
          'These codes allow access to the enterprise if your IdP is unavailable.',
        ],
        verification: 'Recovery codes are downloaded and stored securely.',
        docLinks: [{
          title: 'Downloading SSO recovery codes',
          url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/managing-iam/managing-recovery-codes-for-your-enterprise/downloading-your-enterprise-accounts-single-sign-on-recovery-codes',
          description: 'How to download and store SSO recovery codes',
        }],
      },
    ],
    notes: [
      'For Entra ID: use the "GitHub Enterprise Managed User" gallery application.',
      'For Okta: use the "GitHub Enterprise Managed User" OIN application.',
      'For PingFederate: follow GitHub\'s PingFederate-specific integration guide.',
    ],
    warnings: [
      'Ensure the NameID format is "persistent" — transient NameIDs will cause user matching failures.',
    ],
    links: [
      {
        title: 'Configure SAML for EMU',
        url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/managing-iam/configuring-authentication-for-enterprise-managed-users/configuring-saml-single-sign-on-for-enterprise-managed-users',
        description: 'Complete SAML configuration guide',
      },
      {
        title: 'Entra ID tutorial for EMU',
        url: 'https://learn.microsoft.com/en-us/entra/identity/saas-apps/github-enterprise-managed-user-tutorial',
        description: 'Microsoft docs: Entra ID + GitHub EMU SAML setup',
      },
      {
        title: 'SAML reference for GHE.com',
        url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/data-residency/getting-started-with-data-residency-for-github-enterprise-cloud#3-configure-authentication',
        description: 'Data residency specific SAML configuration',
      },
    ],
  },
  {
    id: 'dr-configure-scim',
    title: 'Configure SCIM Provisioning',
    shortTitle: 'SCIM',
    description:
      'Set up SCIM to automatically provision and deprovision managed user accounts from your IdP.',
    prerequisites: [
      'SAML SSO is fully configured and tested (previous step completed).',
      'An Entra ID user with at least the Cloud Application Administrator role to configure provisioning on the enterprise application.',
      'The setup user credentials to generate a Personal Access Token (PAT) on GHE.com.',
      'Entra ID groups created: "GitHub Enterprise Administrators" and "GitHub Copilot Business User".',
    ],
    substeps: [
      {
        action: 'Generate a personal access token (classic) for SCIM provisioning.',
        details: [
          'Sign in as the setup user to https://YOUR-ENTERPRISE.ghe.com.',
          'Go to Settings → Developer settings → Personal access tokens → Tokens (classic).',
          'Create a token with at least the "scim:enterprise" scope.',
          'The token must have no expiration — GitHub requires this for SCIM provisioning.',
          'Store the token securely and set a calendar reminder to rotate it periodically.',
        ],
        verification: 'The PAT is generated with scim:enterprise scope, no expiration, and copied to a secure location.',
        docLinks: [
          {
            title: 'Creating a personal access token',
            url: 'https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens',
            description: 'How to create and manage PATs',
          },
        ],
      },
      {
        action: 'Configure the SCIM endpoint in your IdP provisioning settings.',
        details: [
          'Entra ID: go to the Enterprise Application → Provisioning tab.',
          'Okta: go to the application → Provisioning → Settings → "To App".',
          'Set the Tenant URL / SCIM endpoint to: https://api.YOUR-ENTERPRISE.ghe.com/scim/v2/enterprises/YOUR-ENTERPRISE',
        ],
        verification: 'The SCIM Tenant URL is correctly populated in your IdP.',
        docLinks: [
          {
            title: 'Configuring SCIM for data residency',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/data-residency/getting-started-with-data-residency-for-github-enterprise-cloud#4-configure-provisioning',
            description: 'Data residency specific SCIM endpoints',
          },
        ],
      },
      {
        action: 'Paste the personal access token as the Secret / Bearer Token in your IdP.',
        verification: 'The token field is populated (usually shows as masked).',
        docLinks: [
          {
            title: 'Configuring SCIM provisioning for EMU',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/managing-iam/provisioning-user-accounts-with-scim/configuring-scim-provisioning-for-users',
            description: 'SCIM token and provisioning setup',
          },
        ],
      },
      {
        action: 'Test the provisioning connection from your IdP.',
        details: [
          'Entra ID: click "Test Connection" in the Provisioning tab.',
          'Okta: click "Test API Credentials".',
        ],
        verification: 'The test shows a success message confirming the connection to the SCIM endpoint.',
        docLinks: [
          {
            title: 'Configuring SCIM provisioning for EMU',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/managing-iam/provisioning-user-accounts-with-scim/configuring-scim-provisioning-for-users',
            description: 'Testing the SCIM provisioning connection',
          },
        ],
      },
      {
        action: 'Configure attribute mappings for user provisioning.',
        details: [
          'Map userName → GitHub username (will get _SHORTCODE suffix).',
          'Map displayName → GitHub profile display name.',
          'Map emails → GitHub email address.',
          'Map externalId → unique identifier from your IdP.',
        ],
        verification: 'All four attributes (userName, displayName, emails, externalId) are mapped.',
        docLinks: [
          {
            title: 'Configuring SCIM provisioning for EMU',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/managing-iam/provisioning-user-accounts-with-scim/configuring-scim-provisioning-for-users',
            description: 'Complete SCIM provisioning guide with attribute mapping',
          },
        ],
      },
      {
        action: 'In Microsoft Entra ID, create the "GitHub Copilot Business User" security group.',
        details: [
          'Go to Azure Portal → Microsoft Entra ID → Groups → New group.',
          'Group type: Security.',
          'Group name: GitHub Copilot Business User.',
          'Group description: Members of this group will be provisioned as GitHub users and receive a Copilot Business seat.',
          'Add the users who need GitHub access and a Copilot license as members.',
        ],
        verification: 'The "GitHub Copilot Business User" group appears in Entra ID → Groups with the correct members.',
        docLinks: [
          {
            title: 'Create a group in Entra ID',
            url: 'https://learn.microsoft.com/en-us/entra/fundamentals/how-to-manage-groups',
            description: 'How to create and manage groups in Microsoft Entra ID',
          },
        ],
      },
      {
        action: 'In Microsoft Entra ID, create the "GitHub Enterprise Administrators" security group.',
        details: [
          'Go to Azure Portal → Microsoft Entra ID → Groups → New group.',
          'Group type: Security.',
          'Group name: GitHub Enterprise Administrators.',
          'Group description: Members of this group will be provisioned as GitHub Enterprise owners.',
          'Add only the users who need enterprise owner privileges.',
        ],
        verification: 'The "GitHub Enterprise Administrators" group appears in Entra ID → Groups with the correct members.',
        docLinks: [
          {
            title: 'Create a group in Entra ID',
            url: 'https://learn.microsoft.com/en-us/entra/fundamentals/how-to-manage-groups',
            description: 'How to create and manage Security groups in Microsoft Entra ID',
          },
        ],
      },
      {
        action: 'Assign both Entra groups to the GitHub EMU Enterprise Application.',
        details: [
          'Go to Azure Portal → Enterprise Applications → GitHub Enterprise Managed User.',
          'Click "Users and groups" → "Add user/group".',
          'Select "GitHub Copilot Business User" group → Assign.',
          'Repeat: select "GitHub Enterprise Administrators" group → Assign.',
          'For "GitHub Enterprise Administrators", set the role to "Enterprise Owner" if role-based assignment is available.',
        ],
        verification: 'Both groups appear in the Enterprise Application → Users and groups list with their assigned roles.',
        docLinks: [
          {
            title: 'Assign users and groups to an app',
            url: 'https://learn.microsoft.com/en-us/entra/identity/enterprise-apps/assign-user-or-group-access-portal',
            description: 'How to assign groups to an Enterprise Application',
          },
        ],
      },
      {
        action: 'Enable provisioning and wait for the initial sync cycle.',
        details: [
          'Entra ID: set Provisioning Status to "On" and click Save.',
          'The first cycle can take 20-40 minutes depending on user count.',
          'Both groups and their members will be provisioned to GitHub.',
        ],
        verification:
          'Navigate to your GHE.com enterprise → People and confirm users from both groups appear with username_SHORTCODE handles.',
        docLinks: [
          {
            title: 'Managing team memberships with IdP groups',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/managing-iam/provisioning-user-accounts-with-scim/managing-team-memberships-with-identity-provider-groups',
            description: 'How IdP groups map to GitHub teams',
          },
        ],
      },
    ],
    notes: [
      'For Entra ID: the SCIM endpoint and token go into the "Provisioning" tab of the Enterprise Application.',
      'Group provisioning will automatically create teams within your GitHub enterprise.',
      'The "GitHub Enterprise Administrators" Entra group maps to enterprise owners; the "GitHub Copilot Business User" group maps to regular users who receive Copilot seats.',
    ],
    warnings: [
      'The SCIM token has an expiration — set a calendar reminder to rotate it before it expires.',
      'Deprovisioning a user in the IdP will suspend them in GitHub — their data is retained but they lose access.',
    ],
    tips: [
      'Start by assigning a small test group to validate provisioning before rolling out to all users.',
    ],
    links: [
      {
        title: 'Configuring SCIM provisioning for EMU',
        url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/managing-iam/provisioning-user-accounts-with-scim/configuring-scim-provisioning-for-users',
        description: 'Complete SCIM provisioning guide',
      },
      {
        title: 'SCIM for data residency',
        url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/data-residency/getting-started-with-data-residency-for-github-enterprise-cloud#4-configure-provisioning',
        description: 'Data residency specific SCIM endpoints and configuration',
      },
      {
        title: 'Managing team memberships with IdP groups',
        url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/managing-iam/provisioning-user-accounts-with-scim/managing-team-memberships-with-identity-provider-groups',
        description: 'How IdP groups map to GitHub teams',
      },
    ],
  },
  {
    id: 'dr-enterprise-teams',
    title: 'Create IdP Groups & Enterprise Teams',
    shortTitle: 'Teams & Groups',
    description:
      'Create groups in your Identity Provider and connect them to GitHub Enterprise teams via SCIM. Groups provisioned through SCIM automatically become teams inside your organizations. You can also create enterprise-level teams and sync them with IdP groups for centralized license and role management.',
    prerequisites: [
      'SCIM provisioning is configured and active (previous step completed).',
      'At least one test user has been successfully provisioned via SCIM.',
      'Organization(s) have been planned or already exist in the enterprise.',
    ],
    substeps: [
      {
        action: 'Plan your group and team structure.',
        details: [
          'Decide which IdP groups will map to GitHub teams (e.g., by department, project, or role).',
          'Each IdP group will become a GitHub team inside an organization.',
          'Common groups: "Developers", "DevOps", "Security", "Copilot Users", "Enterprise Admins".',
          'Consider a naming convention — GitHub recommends prefixing groups with "GitHub-" for clarity (e.g., "GitHub-Developers", "GitHub-Copilot-Users").',
          'Plan which organization(s) each team should belong to — a group can be mapped to teams in multiple organizations if needed.',
        ],
        verification: 'You have a documented list of IdP groups, their intended GitHub team names, and target organizations.',
        docLinks: [
          {
            title: 'About teams',
            url: 'https://docs.github.com/en/organizations/organizing-members-into-teams/about-teams',
            description: 'Overview of how teams work in GitHub organizations',
          },
        ],
      },
      {
        action: 'Create the required groups in your Identity Provider.',
        details: [
          'In your IdP admin console, create the groups you planned.',
          'For Microsoft Entra ID: Go to Groups → New group. Choose the group type — use "Security" groups for access control (recommended for GitHub team sync). "Microsoft 365" groups add email/calendar features that are unnecessary for GitHub.',
          'For Entra ID — Dynamic membership: You can use dynamic membership rules to auto-assign users based on attributes (e.g., department = "Engineering", jobTitle contains "Developer"). This automates group membership as users change roles.',
          'For Entra ID — Assigned membership: Manually add users to the group. Best for small or stable teams.',
          'For Okta: Go to Directory → Groups → Add Group.',
          'Add the appropriate users to each group.',
        ],
        verification: 'All planned groups exist in your IdP and have the correct members assigned.',
        docLinks: [
          {
            title: 'Managing team memberships with IdP groups',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/managing-iam/provisioning-user-accounts-with-scim/managing-team-memberships-with-identity-provider-groups',
            description: 'How to connect IdP groups to GitHub teams',
          },
          {
            title: 'Entra ID dynamic group membership rules',
            url: 'https://learn.microsoft.com/en-us/entra/identity/users/groups-dynamic-membership',
            description: 'How to create dynamic membership rules for Entra ID groups',
          },
        ],
      },
      {
        action: 'Assign the IdP groups to the GitHub Enterprise Application in your IdP.',
        details: [
          'For Entra ID: Go to Enterprise Applications → your GitHub EMU app → Users and groups → Add user/group. Select each group and assign it.',
          'For Entra ID — Important: when assigning a group, you may be asked to select a role. Choose the appropriate role (e.g., "Enterprise Owner", "Organization Member", "Organization Owner") based on the group\'s purpose.',
          'For Okta: Go to Applications → your GitHub EMU app → Assignments → Assign → Assign to Groups.',
          'This tells SCIM to provision these groups as teams in GitHub.',
          'Only groups assigned to the Enterprise Application will be synced — unassigned groups are ignored by SCIM.',
        ],
        verification: 'All groups appear in the "Users and groups" (Entra) or "Assignments" (Okta) list of the Enterprise Application.',
        docLinks: [
          {
            title: 'Assign users and groups to an app',
            url: 'https://learn.microsoft.com/en-us/entra/identity/enterprise-apps/assign-user-or-group-access-portal',
            description: 'How to assign IdP groups to the GitHub Enterprise Application',
          },
        ],
      },
      {
        action: 'Configure attribute mappings for group provisioning (Entra ID).',
        details: [
          'Go to Enterprise Applications → your GitHub EMU app → Provisioning → Mappings → Provision Azure Active Directory Groups.',
          'Verify the attribute mappings: displayName → displayName, members → members, externalId → externalId.',
          'Ensure "Enabled" is set to Yes for group provisioning.',
          'For Okta: Group push mappings are configured in the Push Groups settings of the application.',
          'Attribute mappings control how group names and memberships are synced — incorrect mappings can cause sync failures.',
        ],
        verification: 'Group attribute mappings are correctly configured and group provisioning is enabled.',
        docLinks: [
          {
            title: 'Configuring SCIM provisioning for EMU',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/managing-iam/provisioning-user-accounts-with-scim/configuring-scim-provisioning-for-users',
            description: 'SCIM attribute mapping for users and groups',
          },
        ],
      },
      {
        action: 'Configure provisioning scope (Entra ID).',
        details: [
          'Go to Enterprise Applications → your GitHub EMU app → Provisioning → Settings.',
          'Set "Scope" to "Sync only assigned users and groups" (recommended) — this ensures only explicitly assigned groups and users are provisioned to GitHub.',
          'Alternative: "Sync all users and groups" provisions everyone in Entra ID — use this only if every user should have GitHub access.',
          'Under "Mappings", ensure both user and group provisioning are enabled.',
        ],
        verification: 'Provisioning scope is set to "Sync only assigned users and groups" and both user/group mappings are enabled.',
        docLinks: [
          {
            title: 'Configuring SCIM provisioning for EMU',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/managing-iam/provisioning-user-accounts-with-scim/configuring-scim-provisioning-for-users',
            description: 'SCIM provisioning scope and settings',
          },
        ],
      },
      {
        action: 'Trigger a SCIM provisioning cycle to sync the groups.',
        details: [
          'For Entra ID: Go to Enterprise Applications → your GitHub EMU app → Provisioning → Provision on demand, or wait for the automatic cycle (up to 40 minutes).',
          'For Entra ID — Provision on demand: select a specific group to provision immediately. This is useful for testing individual group sync.',
          'For Entra ID — Full sync: click "Restart provisioning" to trigger a full sync cycle. This provisions all assigned users and groups.',
          'For Okta: Go to Applications → your GitHub EMU app → Provisioning → Push Groups → select the groups to push.',
          'Monitor the provisioning logs for any errors.',
        ],
        verification: 'The SCIM provisioning log shows successful group sync events with no errors.',
        docLinks: [
          {
            title: 'Troubleshooting team membership with identity provider groups',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/managing-iam/provisioning-user-accounts-with-scim/configuring-scim-provisioning-for-users',
            description: 'Troubleshooting team membership sync with your identity provider',
          },
        ],
      },
      {
        action: 'Verify the teams were created in GitHub.',
        details: [
          'Navigate to your enterprise on GHE.com → select an organization → Teams.',
          'Each IdP group should appear as a team with synced membership.',
          'Team names are derived from the IdP group names.',
          'Members of the IdP group should automatically appear as team members.',
          'Check that the team shows the "Synced" badge, indicating it is managed by SCIM.',
        ],
        verification: 'All expected teams exist in your GitHub organizations with the correct synced members and the "Synced" badge.',
        docLinks: [
          {
            title: 'Managing team memberships with IdP groups',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/managing-iam/provisioning-user-accounts-with-scim/managing-team-memberships-with-identity-provider-groups',
            description: 'Verifying IdP group to GitHub team synchronization',
          },
        ],
      },
      {
        action: 'Assign repository access to teams.',
        details: [
          'Go to each repository → Settings → Collaborators and teams → Add teams.',
          'Select the appropriate team and set the permission level (Read, Write, Maintain, Admin).',
          'Use "Read" for viewers, "Write" for contributors, "Maintain" for team leads, "Admin" for repo owners.',
        ],
        verification: 'Team members can access the assigned repositories with the correct permissions.',
        docLinks: [
          {
            title: 'Managing team access to repositories',
            url: 'https://docs.github.com/en/organizations/managing-user-access-to-your-organizations-repositories/managing-repository-roles/managing-team-access-to-an-organization-repository',
            description: 'How to grant teams access to repositories',
          },
        ],
      },
      {
        action: 'Test group membership changes (add/remove a user).',
        details: [
          'Add a test user to an IdP group and wait for the next SCIM sync cycle (or trigger a manual sync).',
          'Verify the user appears as a member of the corresponding GitHub team.',
          'Remove the test user from the IdP group and wait for the next SCIM sync cycle.',
          'Verify the user is removed from the GitHub team.',
          'For Entra ID: provisioning cycles run every 20–40 minutes. Use "Provision on demand" for immediate testing.',
          'For Okta: group membership changes are pushed on the next push cycle or can be triggered manually.',
        ],
        verification: 'Adding a user to the IdP group adds them to the GitHub team; removing them from the IdP group removes them from the GitHub team.',
        docLinks: [
          {
            title: 'Managing team memberships with IdP groups',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/managing-iam/provisioning-user-accounts-with-scim/managing-team-memberships-with-identity-provider-groups',
            description: 'How IdP group membership changes propagate to GitHub teams',
          },
        ],
      },
      {
        action: 'Troubleshoot sync issues (if any).',
        details: [
          'For Entra ID: Go to Enterprise Applications → your EMU app → Provisioning → Provisioning logs. Look for errors related to group operations (Create Group, Update Group, Add Member).',
          'Common errors: "Group already exists" (duplicate group name), "User not found" (user not yet provisioned), "Attribute value is invalid" (check attribute mappings).',
          'For Entra ID: check the "Insights" tab for a summary of successful vs. failed operations.',
          'For Okta: check the Push Groups log for failed pushes. Common issue: group name conflicts.',
          'If a team does not appear in GitHub, verify: 1) the group is assigned to the Enterprise Application, 2) group provisioning is enabled in attribute mappings, 3) no provisioning errors in the logs.',
        ],
        verification: 'All provisioning errors are resolved and all expected groups are synced to GitHub as teams.',
        docLinks: [
          {
            title: 'Troubleshooting team membership with identity provider groups',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/managing-iam/provisioning-user-accounts-with-scim/troubleshooting-team-membership-with-identity-provider-groups',
            description: 'Troubleshooting team membership sync with your identity provider',
          },
          {
            title: 'Entra ID provisioning logs',
            url: 'https://learn.microsoft.com/en-us/entra/identity/app-provisioning/check-status-user-account-provisioning',
            description: 'How to review Entra ID provisioning logs',
          },
        ],
      },
      {
        action: 'Create enterprise teams and sync with IdP groups (optional).',
        details: [
          'Enterprise teams are a newer feature (public preview) that lets you manage users at the enterprise level, independent of organizations.',
          'Enterprise teams can receive Copilot licenses directly, be assigned enterprise roles, and be added to organizations.',
          'Navigate to your enterprise → People → Enterprise teams → New enterprise team.',
          'Enter a team name, optional description, and select which organizations the team should have access to.',
          'Add members manually or sync with an IdP group.',
          'To sync with an IdP group: click the team name → Edit (pencil icon) → under "Manage members" select "Identity provider group" → choose the external IdP group → click "Update team".',
          'Important: before enabling IdP sync, remove any manually assigned users from the team — a team can be either manual or IdP-synced, not both.',
          'Once synced, any changes to the IdP group (adding/removing users) will automatically propagate to the enterprise team via SCIM.',
          'You can assign Copilot licenses to the enterprise team via Enterprise → Settings → Copilot → assign to team.',
          'You can assign predefined or custom enterprise roles to the team for delegated administration.',
        ],
        verification: 'Enterprise team is created, synced with the IdP group, and members reflect the IdP group membership.',
        docLinks: [
          {
            title: 'Creating enterprise teams',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/managing-accounts-and-repositories/managing-users-in-your-enterprise/create-enterprise-teams',
            description: 'Step-by-step guide to creating and managing enterprise teams',
          },
          {
            title: 'Syncing enterprise teams with an IdP group',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/managing-accounts-and-repositories/managing-users-in-your-enterprise/create-enterprise-teams#syncing-with-an-idp-group',
            description: 'Sync enterprise team membership with your identity provider',
          },
        ],
      },
    ],
    warnings: [
      'Team membership in EMU is managed exclusively via SCIM from your IdP — you cannot manually add or remove members from synced teams in GitHub.',
      'Removing a user from an IdP group will remove them from the corresponding GitHub team on the next SCIM cycle.',
      'For Entra ID: use "Security" group type, not "Microsoft 365". M365 groups add unnecessary overhead (mailbox, calendar) and may cause provisioning issues.',
      'If you rename an IdP group after it has been synced, the corresponding GitHub team will also be renamed on the next SCIM cycle — this may break references to the old team name in code or configurations.',
      'Enterprise teams have limits: max 2,500 teams per enterprise, max 5,000 users per team, max 1,000 organizations per team.',
      'If an IdP group exceeds 5,000 users, syncing will stop until the group size is reduced back to the limit.',
    ],
    tips: [
      'Start with a small number of groups and expand as needed.',
      'Use a consistent naming convention (e.g., "GitHub-TeamName") to easily identify GitHub-related groups in your IdP.',
      'You can nest teams in GitHub for hierarchical access control after the initial sync.',
      'For Entra ID: you can use dynamic membership rules on Security groups to auto-assign users based on attributes (e.g., department, job title).',
      'Use "Provision on demand" in Entra ID to test individual group/user provisioning before running a full sync.',
      'Review the provisioning logs regularly during initial setup — errors are common with attribute mapping misconfigurations.',
      'Use enterprise teams to assign Copilot licenses and enterprise roles centrally, independent of organization membership.',
    ],
    links: [
      {
        title: 'Managing team memberships with IdP groups',
        url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/managing-iam/provisioning-user-accounts-with-scim/managing-team-memberships-with-identity-provider-groups',
        description: 'How IdP groups map to GitHub teams via SCIM',
      },
      {
        title: 'Creating enterprise teams',
        url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/managing-accounts-and-repositories/managing-users-in-your-enterprise/create-enterprise-teams',
        description: 'Create enterprise-level teams for license and role management',
      },
      {
        title: 'Syncing enterprise teams with an IdP group',
        url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/managing-accounts-and-repositories/managing-users-in-your-enterprise/create-enterprise-teams#syncing-with-an-idp-group',
        description: 'Sync enterprise team membership with your identity provider',
      },
      {
        title: 'About teams',
        url: 'https://docs.github.com/en/organizations/organizing-members-into-teams/about-teams',
        description: 'Overview of how teams work in GitHub organizations',
      },
    ],
  },
  {
    id: 'dr-orgs-repos',
    title: 'Create Organizations & Repositories',
    shortTitle: 'Orgs & Repos',
    description:
      'Set up organizations, repositories, and team structures within your enterprise.',
    prerequisites: [
      'SCIM provisioning is active and at least one test user has been provisioned (previous step completed).',
      'Enterprise owner access on GHE.com (setup user or a provisioned enterprise owner).',
      'A plan for organization names and team structure (e.g., by department, product, or project).',
    ],
    substeps: [
      {
        action: 'Navigate to your enterprise and create organizations.',
        details: [
          'Go to https://YOUR-ENTERPRISE.ghe.com → Enterprise settings → Organizations.',
          'Click "New organization" and name it (e.g., by department or product team).',
        ],
        verification: 'Each planned organization appears in the Enterprise → Organizations list.',
        docLinks: [
          {
            title: 'Managing organizations',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/managing-accounts-and-repositories/managing-organizations-in-your-enterprise',
            description: 'How to manage organizations in your enterprise',
          },
        ],
      },
      {
        action: 'Set repository visibility policies at the enterprise level.',
        details: [
          'Go to Enterprise settings → Policies → Repositories.',
          'Choose which visibility types are allowed: private, internal, or public within the enterprise.',
          '"Internal" allows all enterprise members to see the repo.',
        ],
        verification: 'The repository visibility policy is set, and trying to create a repo shows only the allowed types.',
        docLinks: [
          {
            title: 'Repository policies for enterprises',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/enforcing-policies/enforcing-policies-for-your-enterprise/enforcing-repository-management-policies-in-your-enterprise',
            description: 'Enforce repository policies across your enterprise',
          },
        ],
      },
      {
        action: 'Create the "GitHub Copilot Business User" team and connect it to the Entra group.',
        details: [
          'In your organization, go to Teams → New team.',
          'Team name: GitHub Copilot Business User.',
          'Connect the team to the "GitHub Copilot Business User" Entra security group.',
          'Members of the Entra group will be automatically synced to this GitHub team.',
          'This team will be used to assign Copilot Business seats.',
        ],
        verification: 'The "GitHub Copilot Business User" team appears in the organization with synced members matching the Entra group.',
        docLinks: [
          {
            title: 'Managing team memberships with IdP groups',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/managing-iam/provisioning-user-accounts-with-scim/managing-team-memberships-with-identity-provider-groups',
            description: 'How to connect IdP groups to GitHub teams',
          },
        ],
      },
      {
        action: 'Create the "GitHub Enterprise Administrators" team and connect it to the Entra group.',
        details: [
          'In your organization, go to Teams → New team.',
          'Team name: GitHub Enterprise Administrators.',
          'Connect the team to the "GitHub Enterprise Administrators" Entra security group.',
          'Members will have enterprise owner privileges and can manage enterprise settings.',
        ],
        verification: 'The "GitHub Enterprise Administrators" team appears in the organization with synced members matching the Entra group.',
        docLinks: [
          {
            title: 'Managing team memberships with IdP groups',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/managing-iam/provisioning-user-accounts-with-scim/managing-team-memberships-with-identity-provider-groups',
            description: 'Connect IdP groups to GitHub teams',
          },
        ],
      },
      {
        action: 'Create initial repositories within organizations.',
        details: [
          'Navigate into an organization and click "New repository".',
          'Set the visibility according to your enterprise policy.',
          'Add teams with appropriate permissions (Read, Write, Maintain, Admin).',
        ],
        verification: 'Repositories are created and accessible by the correct teams with the right permission level.',
        docLinks: [
          {
            title: 'Creating a new repository',
            url: 'https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-new-repository',
            description: 'How to create repositories in your organization',
          },
        ],
      },
    ],
    tips: [
      'Use "internal" visibility for repositories that should be accessible to all enterprise members.',
      'Define a naming convention for organizations and repositories before creating them.',
    ],
    links: [
      {
        title: 'Managing organizations',
        url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/managing-accounts-and-repositories/managing-organizations-in-your-enterprise',
        description: 'How to manage organizations in your enterprise',
      },
      {
        title: 'Repository policies for enterprises',
        url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/enforcing-policies/enforcing-policies-for-your-enterprise/enforcing-repository-management-policies-in-your-enterprise',
        description: 'Enforce repository policies across your enterprise',
      },
    ],
  },
  {
    id: 'dr-policies',
    title: 'Configure Enterprise Policies',
    shortTitle: 'Policies',
    description:
      'Set enterprise-level policies for security, access, and compliance. Apply the principle of least privilege and enforce consistent governance across all organizations.',
    prerequisites: [
      'Enterprise owner access on GHE.com.',
      'At least one organization has been created (previous step completed).',
      'If configuring IP allow lists: a list of your corporate CIDR ranges / VPN exit IPs.',
      'If configuring audit log streaming: access to your SIEM or log destination (Azure Event Hubs, S3, Splunk, Datadog).',
    ],
    substeps: [
      {
        action: 'Configure repository creation policies.',
        details: [
          'Go to Enterprise Settings \u2192 Policies \u2192 Repositories.',
          'Choose who can create repos: all members, owners only, or disabled.',
          'Best practice: restrict to "Owners only" or specific roles to prevent sprawl.',
          'Set allowed repository visibility types: private and internal only (disable public for EMU enterprises).',
          'Configure repository forking policy: disable forking or restrict to internal forks only.',
        ],
        verification: 'Try creating a repo as a non-owner to confirm the policy is enforced.',
        docLinks: [
          {
            title: 'Enforcing repository policies',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/enforcing-policies/enforcing-policies-for-your-enterprise/enforcing-repository-management-policies-in-your-enterprise',
            description: 'Repository creation, forking, and visibility policies',
          },
        ],
      },
      {
        action: 'Set base permissions for organization members.',
        details: [
          'Go to each organization \u2192 Settings \u2192 Member privileges.',
          'Set the base permission to "No permission" (recommended) \u2014 grant access explicitly via teams.',
          'This follows the principle of least privilege and prevents accidental access to repositories.',
          'Review and set: who can create teams, who can create repositories within the org.',
        ],
        verification: 'A test member with no team assignment has no repository access.',
        docLinks: [
          {
            title: 'Setting base permissions for an organization',
            url: 'https://docs.github.com/en/organizations/managing-user-access-to-your-organizations-repositories/managing-repository-roles/setting-base-permissions-for-an-organization',
            description: 'How to set default permissions for organization members',
          },
        ],
      },
      {
        action: 'Configure branch protection and rulesets.',
        details: [
          'Go to each organization \u2192 Settings \u2192 Repository \u2192 Rulesets (recommended) or branch protection rules.',
          'Create rulesets for default branches (main/master): require pull request reviews, require status checks, restrict force pushes, restrict deletions.',
          'Best practice: require at least 1 code review approval before merging.',
          'Best practice: require conversation resolution and up-to-date branches before merge.',
          'For enterprise-wide rules, use Enterprise settings \u2192 Repository \u2192 Rulesets to push rules to all orgs.',
          'Consider requiring signed commits for sensitive repositories.',
        ],
        verification: 'Try pushing directly to a protected branch \u2014 it should be rejected.',
        docLinks: [
          {
            title: 'About rulesets',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets',
            description: 'Modern branch and tag protection with rulesets',
          },
          {
            title: 'Managing rulesets for an organization',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/organizations/managing-organization-settings/managing-rulesets-for-repositories-in-your-organization',
            description: 'Organization-level rulesets for consistent branch protection',
          },
        ],
      },
      {
        action: 'Configure personal access token (PAT) policies.',
        details: [
          'Go to Enterprise settings \u2192 Policies \u2192 Personal access tokens.',
          'Best practice: restrict classic PATs \u2014 allow only fine-grained tokens.',
          'Fine-grained tokens are scoped to specific repositories and have expiration dates, improving security.',
          'Require admin approval for fine-grained token access to organizations.',
          'Set maximum token lifetime to enforce regular rotation.',
        ],
        verification: 'Try creating a classic PAT and confirm it cannot access enterprise resources if restricted.',
        docLinks: [
          {
            title: 'Enforcing policies for PATs',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/enforcing-policies/enforcing-policies-for-your-enterprise/enforcing-policies-for-personal-access-tokens-in-your-enterprise',
            description: 'Control PAT usage and enforce fine-grained tokens',
          },
        ],
      },
      {
        action: 'Configure IP allow lists if required for compliance.',
        details: [
          'Go to Enterprise settings \u2192 Settings \u2192 Authentication security \u2192 IP allow list.',
          'Add your corporate CIDR ranges / VPN exit IPs.',
          'Enable the allow list enforcement.',
          'Important: also add IP ranges for CI/CD runners and any third-party integrations that need API access.',
          'Test thoroughly before enforcement \u2014 blocking legitimate IPs can lock out users.',
        ],
        verification: 'Accessing GHE.com from outside the allowed IP ranges is blocked.',
        docLinks: [
          {
            title: 'Managing allowed IP addresses',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/enforcing-policies/enforcing-policies-for-your-enterprise/enforcing-policies-for-security-settings-in-your-enterprise#managing-allowed-ip-addresses-for-organizations-in-your-enterprise',
            description: 'How to configure IP allow lists',
          },
        ],
      },
      {
        action: 'Configure GitHub Actions policies.',
        details: [
          'Go to Enterprise settings \u2192 Policies \u2192 Actions.',
          'Best practice: restrict to "Allow select actions" and allow only verified or enterprise-owned actions.',
          'Add trusted action patterns: "actions/*", "github/*", and your organization\'s internal actions.',
          'Configure runner groups to control which organizations can use which runners.',
          'Set default workflow permissions to "Read repository contents" (principle of least privilege).',
          'Require approval for all outside collaborators to run workflows.',
        ],
        verification: 'Create a test workflow using a non-allowed action and confirm it is blocked.',
        docLinks: [
          {
            title: 'Enforcing GitHub Actions policies',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/enforcing-policies/enforcing-policies-for-your-enterprise/enforcing-policies-for-github-actions-in-your-enterprise',
            description: 'Actions policies for enterprises',
          },
        ],
      },
      {
        action: 'Enable and configure security features: secret scanning, Dependabot, and code scanning.',
        details: [
          'Go to Enterprise settings \u2192 Settings \u2192 Code security and analysis.',
          'Enable: Dependency graph, Dependabot alerts, Dependabot security updates.',
          'Enable: Secret scanning, Secret scanning push protection (blocks commits with detected secrets).',
          'Enable: Code scanning default setup (CodeQL) for automatic vulnerability detection.',
          'Best practice: enable "Automatically enable for new repositories" for all security features.',
          'Consider enabling security advisories for private vulnerability reporting.',
          'Review and configure custom secret scanning patterns for internal secrets (API keys, connection strings).',
        ],
        verification: 'Navigate to a repository\'s Security tab and confirm all features are active. Test push protection by committing a test secret.',
        docLinks: [
          {
            title: 'GitHub security features',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/code-security/getting-started/github-security-features',
            description: 'Overview of all available security features',
          },
          {
            title: 'Configuring secret scanning',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/code-security/secret-scanning/introduction/about-secret-scanning',
            description: 'Secret scanning and push protection configuration',
          },
        ],
      },
      {
        action: 'Configure outside collaborator and fork policies (EMU-specific).',
        details: [
          'Note: EMU enterprises restrict outside collaborators by default \u2014 only managed users can be members.',
          'Go to Enterprise Settings \u2192 Policies \u2192 Repositories \u2192 Fork policy.',
          'Since EMU users cannot fork to personal accounts, ensure forking is restricted to within the enterprise only.',
          'Review the deploy key policy: restrict deploy keys at the enterprise level if not needed.',
          'Consider enabling repository archiving policies for inactive repositories.',
        ],
        verification: 'Confirm that only managed users appear in organization membership. Verify fork and deploy key restrictions are enforced.',
        docLinks: [
          {
            title: 'EMU abilities and restrictions',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/managing-iam/understanding-iam-for-enterprises/abilities-and-restrictions-of-managed-user-accounts',
            description: 'What managed users can and cannot do',
          },
        ],
      },
      {
        action: 'Set up audit log streaming if required.',
        details: [
          'Go to Enterprise settings \u2192 Settings \u2192 Audit log.',
          'Click "Set up a stream" and choose your target (Azure Event Hubs, S3, Splunk, Datadog, Google Cloud Storage).',
          'Configure the streaming endpoint and authentication.',
          'Best practice: stream to at least one destination for compliance and incident response.',
          'Configure audit log retention period based on your compliance requirements.',
        ],
        verification: 'Perform a test action (e.g., repo creation) and confirm the event appears in your SIEM within minutes.',
        docLinks: [
          {
            title: 'Streaming the audit log',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/monitoring-activity-in-your-enterprise/reviewing-audit-logs-for-your-enterprise/streaming-the-audit-log-for-your-enterprise',
            description: 'How to configure audit log streaming',
          },
        ],
      },
    ],
    tips: [
      'Use rulesets instead of legacy branch protection rules \u2014 they support enterprise-wide enforcement and are more flexible.',
      'Regularly review the audit log to detect policy violations and unusual activity.',
      'Start with restrictive policies and relax them as needed, rather than starting permissive.',
    ],
    links: [
      {
        title: 'Enforcing policies for your enterprise',
        url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/enforcing-policies/enforcing-policies-for-your-enterprise',
        description: 'Full reference for enterprise policies',
      },
      {
        title: 'Audit log for enterprises',
        url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/monitoring-activity-in-your-enterprise/reviewing-audit-logs-for-your-enterprise',
        description: 'How to review and stream audit logs',
      },
      {
        title: 'Security features for EMU',
        url: 'https://docs.github.com/en/enterprise-cloud@latest/code-security/getting-started/github-security-features',
        description: 'Overview of available security features',
      },
      {
        title: 'About rulesets',
        url: 'https://docs.github.com/en/enterprise-cloud@latest/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets',
        description: 'Modern, enterprise-wide branch protection',
      },
    ],
  },
  {
    id: 'dr-copilot-enable',
    title: 'Step 1 — Enable Copilot on the Enterprise',
    shortTitle: 'Enable Copilot',
    description:
      'Turn on GitHub Copilot at the enterprise level and select the plan.',
    prerequisites: [
      'Enterprise owner access on GHE.com.',
      'A GitHub Copilot Business or Enterprise license purchased — verify in your GitHub billing settings or Azure subscription.',
      'If billing through Azure: an active Azure subscription linked to the GitHub enterprise for Copilot seat billing.',
    ],
    substeps: [
      {
        action: 'Sign in to https://YOUR-ENTERPRISE.ghe.com with an enterprise owner account.',
        verification: 'You are on the enterprise dashboard and see the enterprise name in the header.',
        docLinks: [
          {
            title: 'Managing your enterprise account',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/managing-your-enterprise-account',
            description: 'How to access and manage your enterprise',
          },
        ],
      },
      {
        action: 'Navigate to the Copilot policy settings.',
        details: [
          'Go to Enterprise settings → Policies → Copilot.',
        ],
        verification: 'The Copilot policies page loads with access configuration options.',
        docLinks: [
          {
            title: 'Enforcing Copilot policies',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/enforcing-policies/enforcing-policies-for-your-enterprise/enforcing-policies-for-github-copilot-in-your-enterprise',
            description: 'Official docs for Copilot enterprise policies',
          },
        ],
      },
      {
        action: 'Set the Copilot access policy.',
        details: [
          'Choose "Enabled for all organizations" or "Enabled for specific organizations".',
          'If choosing specific, select the organizations that should have Copilot access.',
        ],
        verification: 'The access policy shows as either "Enabled" or lists the selected organizations.',
        docLinks: [
          {
            title: 'Enforcing Copilot policies',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/enforcing-policies/enforcing-policies-for-your-enterprise/enforcing-policies-for-github-copilot-in-your-enterprise',
            description: 'Configure Copilot access policies',
          },
        ],
      },
      {
        action: 'The default Copilot plan at the enterprise level is GitHub Copilot Business.',
        details: [
          'Copilot Business ($19/user/month): code completion, chat in IDE, chat on the web. This is the default plan for all organizations in the enterprise.',
          'Copilot Enterprise ($39/user/month): adds PR summaries, knowledge bases, docset indexing, and code review on top of Business.',
          'Important: Copilot Enterprise CANNOT be assigned at the enterprise level — it must be assigned per organization.',
          'To use Copilot Enterprise: create a dedicated organization, navigate to that organization\'s Copilot settings, and change the plan from Business to Enterprise.',
          'Users assigned to an organization with Copilot Enterprise may also incur a GitHub Enterprise license cost for that organization.',
        ],
        verification: 'The enterprise-level plan shows "Copilot Business" as the default. If Enterprise is needed, verify the target organization has its plan set to Enterprise.',
        docLinks: [
          {
            title: 'About GitHub Copilot plans',
            url: 'https://docs.github.com/en/copilot/get-started/plans',
            description: 'Compare Copilot Business vs Enterprise features',
          },
        ],
      },
      {
        action: '(Optional) Set up Copilot Enterprise for a specific organization.',
        details: [
          'If you need Copilot Enterprise features (PR summaries, knowledge bases, code review), you must configure it at the organization level.',
          'Create a new organization (or use an existing one) within the enterprise.',
          'Navigate to the organization → Settings → Copilot → change the plan from "Business" to "Enterprise".',
          'Assign users or teams to this organization who need Copilot Enterprise features.',
          'Note: each user added to this organization may consume an additional GitHub Enterprise license seat — plan for this cost.',
          'Users in other organizations will continue using Copilot Business at $19/user/month.',
        ],
        verification: 'The organization\'s Copilot settings show "Enterprise" as the active plan. Test users in that org can access Enterprise features (e.g., PR summaries).',
        docLinks: [
          {
            title: 'About GitHub Copilot plans',
            url: 'https://docs.github.com/en/copilot/get-started/plans',
            description: 'Compare Copilot Business vs Enterprise features',
          },
          {
            title: 'Managing Copilot for your organization',
            url: 'https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-organization/manage-plan',
            description: 'How to change the Copilot plan at the organization level',
          },
        ],
      },
    ],
    notes: [
      'The default plan at the enterprise level is Copilot Business. Copilot Enterprise must be configured per organization.',
      'Currently, upgrading to Copilot Enterprise requires creating an organization and assigning the Enterprise plan to it — this may also incur additional GitHub Enterprise license costs for users in that organization.',
    ],
    links: [
      {
        title: 'Enforcing Copilot policies in your enterprise',
        url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/enforcing-policies/enforcing-policies-for-your-enterprise/enforcing-policies-for-github-copilot-in-your-enterprise',
        description: 'Official docs for enabling Copilot at the enterprise level',
      },
      {
        title: 'Managing Copilot for your organization',
        url: 'https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-organization/manage-plan',
        description: 'Organization-level Copilot plan management',
      },
    ],
  },
  {
    id: 'dr-copilot-policies',
    title: 'Step 2 — Configure Copilot Policies',
    shortTitle: 'Copilot Policies',
    description:
      'Set enterprise-wide policies that control how Copilot behaves for all users.',
    prerequisites: [
      'Copilot is enabled at the enterprise level (previous step completed).',
      'Enterprise owner access on GHE.com.',
    ],
    substeps: [
      {
        action: 'Configure the "Suggestions matching public code" policy.',
        details: [
          'In Enterprise settings → Policies → Copilot.',
          'Choose to allow or block suggestions that match publicly available code.',
          'Blocking reduces intellectual property risk.',
        ],
        verification: 'The policy value (Allow/Block) is saved and shows the correct setting.',
        docLinks: [
          {
            title: 'Copilot policies reference',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/enforcing-policies/enforcing-policies-for-your-enterprise/enforcing-policies-for-github-copilot-in-your-enterprise',
            description: 'All available Copilot policies',
          },
        ],
      },
      {
        action: 'Configure Copilot Chat in IDEs policy.',
        details: ['Enable or disable Copilot Chat for IDE users enterprise-wide.'],
        verification: 'The Chat in IDEs policy shows the correct enabled/disabled state.',
        docLinks: [
          {
            title: 'Enforcing Copilot policies',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/enforcing-policies/enforcing-policies-for-your-enterprise/enforcing-policies-for-github-copilot-in-your-enterprise',
            description: 'Configure Copilot Chat in IDEs policy',
          },
        ],
      },
      {
        action: 'Configure Copilot Chat on the web policy.',
        details: ['Enable or disable Copilot Chat on the GHE.com web interface.'],
        verification: 'The Chat on web policy shows the correct enabled/disabled state.',
        docLinks: [
          {
            title: 'Enforcing Copilot policies',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/enforcing-policies/enforcing-policies-for-your-enterprise/enforcing-policies-for-github-copilot-in-your-enterprise',
            description: 'Configure Copilot Chat on web policy',
          },
        ],
      },
      {
        action: 'Configure Copilot pull request summaries (Enterprise plan only).',
        details: ['Enable or disable AI-generated pull request summaries.'],
        verification: 'The PR summaries policy is set. If enabled, create a test PR to verify summaries appear.',
        docLinks: [
          {
            title: 'Enforcing Copilot policies',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/enforcing-policies/enforcing-policies-for-your-enterprise/enforcing-policies-for-github-copilot-in-your-enterprise',
            description: 'Configure Copilot pull request summaries policy',
          },
        ],
      },
      {
        action: 'Configure content exclusion rules if needed.',
        details: [
          'Exclude specific repositories or file paths from Copilot suggestions.',
          'Go to Enterprise settings → Copilot → Content exclusion.',
          'Add patterns like "*.env", "secrets/**", or specific repo names.',
        ],
        verification: 'Open one of the excluded file patterns in an IDE — Copilot should not provide suggestions.',
        docLinks: [
          {
            title: 'Copilot content exclusion',
            url: 'https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-organization/manage-plan',
            description: 'How to exclude files or repos from Copilot',
          },
        ],
      },
    ],
    links: [
      {
        title: 'Copilot content exclusion',
        url: 'https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-organization/manage-plan',
        description: 'How to exclude files or repos from Copilot suggestions',
      },
    ],
  },
  {
    id: 'dr-copilot-models',
    title: 'Step 3 — Configure Copilot Models',
    shortTitle: 'Copilot Models',
    description:
      'Choose which AI models are available for Copilot users in your enterprise. You can enable or disable specific models and control which ones are offered by default.',
    prerequisites: [
      'Copilot is enabled at the enterprise level (previous steps completed).',
      'Enterprise owner access on GHE.com.',
    ],
    substeps: [
      {
        action: 'Navigate to the Copilot models settings page.',
        details: [
          'Go to https://YOUR-ENTERPRISE.ghe.com/enterprises/YOUR-ENTERPRISE/settings/copilot/models.',
        ],
        verification: 'The Copilot models configuration page loads and lists available AI models.',
        docLinks: [
          {
            title: 'Managing Copilot policies',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/enforcing-policies/enforcing-policies-for-your-enterprise/enforcing-policies-for-github-copilot-in-your-enterprise',
            description: 'Enterprise Copilot policy management',
          },
        ],
      },
      {
        action: 'Review the list of available AI models.',
        details: [
          'GitHub Copilot supports multiple AI models (e.g., GPT-4o, Claude, Gemini, and others).',
          'Each model has different capabilities, latency, and cost characteristics.',
          'Some models may consume premium requests depending on your plan.',
        ],
        verification: 'You can see the full list of models with their descriptions and availability status.',
        docLinks: [
          {
            title: 'About GitHub Copilot models',
            url: 'https://docs.github.com/en/copilot/how-tos/use-ai-models/change-the-chat-model',
            description: 'Learn about the AI models available for Copilot',
          },
        ],
      },
      {
        action: 'Enable or disable specific models for your enterprise.',
        details: [
          'Toggle each model on or off based on your organization\'s requirements.',
          'Consider enabling only approved models to control cost and comply with internal policies.',
          'Disabling a model prevents all users in the enterprise from selecting it.',
        ],
        verification: 'Only the desired models show as enabled. Disabled models are grayed out or hidden from users.',
        docLinks: [
          {
            title: 'Managing Copilot policies',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/enforcing-policies/enforcing-policies-for-your-enterprise/enforcing-policies-for-github-copilot-in-your-enterprise',
            description: 'Configure Copilot model policies',
          },
        ],
      },
      {
        action: 'Set the default model for your enterprise (if applicable).',
        details: [
          'If multiple models are enabled, choose which one is the default for new chat sessions.',
          'Users can still switch to other enabled models during a session.',
        ],
        verification: 'The selected default model is displayed as the active default on the models settings page.',
        docLinks: [
          {
            title: 'Using different LLMs with Copilot Chat',
            url: 'https://docs.github.com/en/copilot/how-tos/use-ai-models/change-the-chat-model',
            description: 'How users switch between available models',
          },
        ],
      },
    ],
    tips: [
      'Start with a limited set of models and expand based on user feedback and cost monitoring.',
      'Some models consume premium requests — review the premium request implications before enabling them.',
    ],
    links: [
      {
        title: 'Using different LLMs with Copilot Chat',
        url: 'https://docs.github.com/en/copilot/how-tos/use-ai-models/change-the-chat-model',
        description: 'Learn about the AI models available for Copilot',
      },
      {
        title: 'Enforcing Copilot policies',
        url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/enforcing-policies/enforcing-policies-for-your-enterprise/enforcing-policies-for-github-copilot-in-your-enterprise',
        description: 'Enterprise-level Copilot policy management',
      },
    ],
  },
  {
    id: 'dr-copilot-features',
    title: 'Step 4 — Configure Copilot Features & AI Controls',
    shortTitle: 'Copilot Features',
    description:
      'Enable or disable specific Copilot features and AI-powered capabilities at the enterprise level using the AI Controls panel.',
    prerequisites: [
      'Copilot is enabled at the enterprise level (previous steps completed).',
      'Enterprise owner access on GHE.com.',
    ],
    substeps: [
      {
        action: 'Navigate to the Copilot AI Controls page.',
        details: [
          'Go to https://YOUR-ENTERPRISE.ghe.com/enterprises/YOUR-ENTERPRISE/ai-controls/copilot.',
        ],
        verification: 'The AI Controls page loads and displays a list of Copilot features with toggle switches.',
        docLinks: [
          {
            title: 'Enforcing Copilot policies',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/enforcing-policies/enforcing-policies-for-your-enterprise/enforcing-policies-for-github-copilot-in-your-enterprise',
            description: 'Enterprise Copilot policy management',
          },
        ],
      },
      {
        action: 'Review and configure each Copilot feature.',
        details: [
          'The AI Controls panel lists all available Copilot features (e.g., code completions, chat, PR summaries, code review, Copilot Extensions, etc.).',
          'For each feature, choose: Enabled, Disabled, or No policy (let organizations decide).',
          'Disabling a feature at the enterprise level overrides organization settings — no org can re-enable it.',
          'Setting "No policy" delegates the decision to individual organizations.',
        ],
        verification: 'Each feature shows the desired state (Enabled / Disabled / No policy).',
        docLinks: [
          {
            title: 'Enforcing Copilot policies',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/enforcing-policies/enforcing-policies-for-your-enterprise/enforcing-policies-for-github-copilot-in-your-enterprise',
            description: 'Configure per-feature Copilot policies',
          },
        ],
      },
      {
        action: 'Configure Copilot Extensions policy (if applicable).',
        details: [
          'Decide whether to allow third-party Copilot Extensions in your enterprise.',
          'You can allow all extensions, allow only specific approved extensions, or disable extensions entirely.',
          'Extensions can access repository context — review security implications before enabling.',
        ],
        verification: 'The Copilot Extensions policy shows the correct setting.',
        docLinks: [
          {
            title: 'About Model Context Protocol (MCP)',
            url: 'https://docs.github.com/en/copilot/how-tos/use-copilot-extensions',
            description: 'Learn about MCP and extending Copilot capabilities',
          },
        ],
      },
      {
        action: 'Configure Copilot code review settings (if applicable).',
        details: [
          'Enable or disable AI-powered code review suggestions on pull requests.',
          'When enabled, Copilot can provide automated review comments and suggestions.',
        ],
        verification: 'The code review setting shows the desired state.',
        docLinks: [
          {
            title: 'Using Copilot code review',
            url: 'https://docs.github.com/en/copilot/how-tos/use-copilot-agents/request-a-code-review',
            description: 'AI-powered code review with Copilot',
          },
        ],
      },
    ],
    tips: [
      'Use "No policy" for features where you want organizations to make their own decisions.',
      'Review the AI Controls page periodically — GitHub may add new features over time.',
    ],
    warnings: [
      'Disabling a feature at the enterprise level cannot be overridden by organizations.',
    ],
    links: [
      {
        title: 'Enforcing Copilot policies in your enterprise',
        url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/enforcing-policies/enforcing-policies-for-your-enterprise/enforcing-policies-for-github-copilot-in-your-enterprise',
        description: 'Official docs for Copilot enterprise feature policies',
      },
      {
        title: 'About Model Context Protocol (MCP)',
        url: 'https://docs.github.com/en/copilot/how-tos/use-copilot-extensions',
        description: 'Learn about MCP and extending Copilot capabilities',
      },
    ],
  },
  {
    id: 'dr-copilot-premium',
    title: 'Step 5 — Manage Premium Requests & Budgets',
    shortTitle: 'Premium Requests',
    description:
      'Enable or disable paid premium request usage for Copilot, and optionally create budgets to control spending on premium model requests.',
    prerequisites: [
      'Copilot is enabled at the enterprise level (previous steps completed).',
      'Enterprise owner or billing manager access on GHE.com.',
      'Billing is configured (Azure subscription linked or GitHub direct billing active).',
    ],
    substeps: [
      {
        action: 'Navigate to the Copilot billing / premium requests settings.',
        details: [
          'Go to Enterprise settings → Billing → Copilot, or navigate to the Copilot policies page.',
          'Locate the "Premium requests" or "Paid usage" section.',
        ],
        verification: 'The premium requests configuration section is visible with the current status (enabled/disabled).',
        docLinks: [
          {
            title: 'About billing for GitHub Copilot',
            url: 'https://docs.github.com/en/billing/concepts/product-billing/github-copilot-licenses',
            description: 'Copilot billing and premium request details',
          },
        ],
      },
      {
        action: 'Enable or disable premium request paid usage.',
        details: [
          'Premium requests are consumed when users interact with advanced models beyond the included quota.',
          'Enable: users can exceed the included premium request quota — additional requests are billed at the per-request rate.',
          'Disable: users are limited to the included premium request quota — once exhausted, they must wait for the next billing cycle or switch to a non-premium model.',
          'Consider your budget and user needs before enabling paid usage.',
        ],
        verification: 'The premium request paid usage toggle shows the desired state (Enabled / Disabled).',
        docLinks: [
          {
            title: 'Managing Copilot premium requests',
            url: 'https://docs.github.com/en/copilot/how-tos/manage-and-track-spending/manage-request-allowances',
            description: 'How premium requests work and how to manage them',
          },
        ],
      },
      {
        action: 'Create a budget for premium requests (optional but recommended).',
        details: [
          'Navigate to Enterprise settings → Billing → Budgets & alerts.',
          'Click "New budget" or "Create budget".',
          'Set the budget scope to Copilot premium requests.',
          'Define a monthly spending limit (e.g., $500/month, $1000/month).',
          'Configure alert thresholds (e.g., notify at 50%, 75%, 90% of budget).',
          'Assign notification recipients (enterprise owners, billing managers).',
        ],
        verification: 'The budget appears in the Budgets list with the correct amount and alert thresholds.',
        docLinks: [
          {
            title: 'Setting up budgets and alerts',
            url: 'https://docs.github.com/en/billing/how-tos/set-up-budgets',
            description: 'How to create spending budgets and alerts for GitHub products',
          },
        ],
      },
      {
        action: 'Configure per-organization premium request budgets (optional).',
        details: [
          'If you have multiple organizations, you can set individual budgets per organization to distribute spending.',
          'Navigate to each organization\'s billing settings or use enterprise-level budget allocation.',
          'This prevents a single organization from consuming the entire enterprise budget.',
        ],
        verification: 'Each organization has its own budget limit displayed in the billing settings.',
        docLinks: [
          {
            title: 'Setting up budgets and alerts',
            url: 'https://docs.github.com/en/billing/how-tos/set-up-budgets',
            description: 'Create per-organization budgets',
          },
        ],
      },
      {
        action: 'Monitor premium request usage.',
        details: [
          'Go to Enterprise settings → Billing → Usage to review current premium request consumption.',
          'Check usage by organization and by user to identify heavy consumers.',
          'Review billing invoices to track actual spend vs. budget.',
        ],
        verification: 'You can see premium request usage data and it aligns with the budget you set.',
        docLinks: [
          {
            title: 'Viewing product license use',
            url: 'https://docs.github.com/en/billing/how-tos/products/view-productlicense-use',
            description: 'View detailed product usage and billing information',
          },
        ],
      },
    ],
    tips: [
      'Start with premium requests disabled and a conservative budget, then increase as you understand usage patterns.',
      'Set alert thresholds at 50% and 90% to get early warnings before budget exhaustion.',
      'Review premium request usage weekly during the first month to calibrate budgets.',
    ],
    warnings: [
      'Without a budget, enabling premium request paid usage could result in unexpected charges.',
      'Budget alerts are notifications only — they do NOT automatically block usage when exceeded. Monitor actively.',
    ],
    links: [
      {
        title: 'About billing for GitHub Copilot',
        url: 'https://docs.github.com/en/billing/concepts/product-billing/github-copilot-licenses',
        description: 'Copilot billing and premium request pricing',
      },
      {
        title: 'Setting up budgets and alerts',
        url: 'https://docs.github.com/en/billing/how-tos/set-up-budgets',
        description: 'Create and manage spending budgets',
      },
      {
        title: 'Managing Copilot premium requests',
        url: 'https://docs.github.com/en/copilot/how-tos/manage-and-track-spending/manage-request-allowances',
        description: 'How to manage premium request quotas and paid usage',
      },
    ],
  },
  {
    id: 'dr-copilot-seats',
    title: 'Step 6 — Assign Copilot Seats',
    shortTitle: 'Copilot Seats',
    description:
      'Grant Copilot Business access to users. You can assign seats via IdP-synced teams (recommended), to individual users, or to an entire organization.',
    prerequisites: [
      'Copilot is enabled and policies are configured (previous steps completed).',
      'Organization owner or enterprise owner access on GHE.com.',
      'Sufficient Copilot licenses purchased to cover the expected users.',
    ],
    substeps: [
      {
        action: 'Navigate to each organization\'s Copilot access settings.',
        details: [
          'Go to the organization → Settings → Copilot → Access.',
        ],
        verification: 'The Copilot access page loads and shows seat configuration options.',
        docLinks: [
          {
            title: 'Managing Copilot access in your organization',
            url: 'https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-organization/manage-access',
            description: 'How to assign Copilot seats',
          },
        ],
      },
      {
        action: 'Choose your seat assignment method.',
        details: [
          'You have three options for assigning Copilot seats:',
          'Option A — Assign via Teams (recommended): Select "Enable for specific members/teams", then add IdP-synced teams. This automates seat management — adding/removing a user in the IdP group automatically grants/revokes the Copilot seat.',
          'Option B — Assign to individual users: Select "Enable for specific members/teams", then search for and add individual managed users by name or username.',
          'Option C — Assign to the entire organization: Select "Enable for all current and future members" to grant Copilot to everyone in the organization. Every user in the org will consume a license.',
        ],
        verification: 'The desired assignment method is selected.',
        docLinks: [
          {
            title: 'Managing Copilot access in your organization',
            url: 'https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-organization/manage-access',
            description: 'Seat assignment methods for Copilot',
          },
        ],
      },
      {
        action: 'Option A — Assign seats to a team (synced from an IdP group).',
        details: [
          'On the Copilot Access page, click "Add teams" or search for a team.',
          'Select the team synced from your IdP (e.g., "GitHub Copilot Business User" synced from the Entra Security group or Okta group).',
          'Confirm the assignment — all current members of the team will receive a Copilot seat.',
          'When new users are added to the IdP group, they are provisioned via SCIM, synced to the team, and automatically receive a Copilot seat.',
          'When users are removed from the IdP group, their seat is revoked on the next SCIM cycle.',
        ],
        verification: 'The team appears in the Copilot seat assignment list with the correct member count.',
        docLinks: [
          {
            title: 'Managing Copilot access in your organization',
            url: 'https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-organization/manage-access',
            description: 'How to assign Copilot seats to teams',
          },
        ],
      },
      {
        action: 'Option B — Assign seats to individual users.',
        details: [
          'On the Copilot Access page, click "Add members" or search for a user.',
          'Search by the managed user\'s display name or short handle (e.g., "jdoe_SHORTCODE").',
          'Select the user and confirm — they will receive a Copilot Business seat.',
          'Repeat for each individual user you want to grant Copilot access.',
          'Note: Individual assignments are NOT managed via SCIM — you must manually add/remove users.',
        ],
        verification: 'Each assigned user appears as "Active" in the Copilot seat list.',
        docLinks: [
          {
            title: 'Managing Copilot access in your organization',
            url: 'https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-organization/manage-access',
            description: 'Assign Copilot seats to individual users',
          },
        ],
      },
      {
        action: 'Option C — Enable Copilot for the entire organization.',
        details: [
          'On the Copilot Access page, select "Enable for all current and future members".',
          'All existing members of the organization will immediately receive a Copilot seat.',
          'Any new member added to the organization in the future will automatically get a seat.',
          'This is the simplest option but uses the most licenses — every org member consumes a Copilot seat.',
        ],
        verification: 'The access setting shows "Enabled for all members" and the seat count matches the org membership.',
        docLinks: [
          {
            title: 'Managing Copilot access in your organization',
            url: 'https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-organization/manage-access',
            description: 'Enable Copilot for the entire organization',
          },
        ],
      },
      {
        action: 'Verify a test user has received a Copilot seat.',
        details: [
          'Check the Copilot access page — the user should show as "Active".',
          'Have the test user sign in to their IDE to confirm Copilot activates.',
          'Copilot should appear in the IDE status bar with code completion suggestions.',
        ],
        verification: 'The test user sees Copilot as "Active" in their IDE status bar and can generate completions.',
        docLinks: [
          {
            title: 'Installing Copilot in your environment',
            url: 'https://docs.github.com/en/copilot/how-tos/set-up/install-copilot-extension',
            description: 'Verify Copilot is active in the IDE',
          },
        ],
      },
    ],
    tips: [
      'Option A (teams) is recommended — it fully automates seat lifecycle via your IdP group membership.',
      'You can mix methods: assign some seats via teams and others to individual users.',
      'Enterprise Administrators do NOT automatically receive Copilot seats unless explicitly assigned or added to a Copilot team.',
      'You can review seat usage in the organization Settings → Copilot → Access page at any time.',
    ],
    warnings: [
      'Seat changes may take a few minutes. Users should sign out and back in to their IDE if Copilot does not activate.',
      'Option C (entire organization) will consume one license per org member — ensure you have enough licenses.',
      'Removing a user from the IdP group (Option A) revokes their seat, but individual assignments (Option B) must be removed manually.',
    ],
    links: [
      {
        title: 'Managing access to Copilot in your organization',
        url: 'https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-organization/manage-access',
        description: 'How to assign Copilot seats to org members and teams',
      },
    ],
  },
  {
    id: 'dr-copilot-web',
    title: 'Step 7 — Use Copilot on the Web',
    shortTitle: 'Copilot Web',
    description:
      'Access Copilot Chat directly in the browser on your GHE.com instance — no IDE required.',
    prerequisites: [
      'A managed user account with an assigned Copilot seat (previous step completed).',
      'SSO is working and the user can sign in to GHE.com.',
    ],
    substeps: [
      {
        action: 'Sign in to https://YOUR-ENTERPRISE.ghe.com with a managed user account via SSO.',
        verification: 'You are signed in and see the GHE.com dashboard.',
        docLinks: [
          {
            title: 'Using Copilot Chat on GitHub',
            url: 'https://docs.github.com/en/copilot/how-tos/chat-with-copilot/chat-in-github',
            description: 'Access Copilot Chat from the web',
          },
        ],
      },
      {
        action: 'Open Copilot Chat from the top navigation bar.',
        details: [
          'Click the Copilot icon (sparkle ✨) in the top-right area of the navigation bar.',
          'A chat panel appears on the right side.',
        ],
        verification: 'The Copilot Chat panel opens and shows a text input field ready for prompts.',
        docLinks: [
          {
            title: 'Using Copilot Chat on GitHub',
            url: 'https://docs.github.com/en/copilot/how-tos/chat-with-copilot/chat-in-github',
            description: 'How to use Copilot Chat in the browser',
          },
        ],
      },
      {
        action: 'Test a prompt in Copilot Chat.',
        details: [
          'Try asking: "How do I set up a GitHub Actions workflow for CI?"',
          'You can also open Chat from a repository page, PR, or issue for context-aware responses.',
        ],
        verification: 'Copilot responds with a relevant answer. Response is generated within a few seconds.',
        docLinks: [
          {
            title: 'Using Copilot Chat on GitHub',
            url: 'https://docs.github.com/en/copilot/how-tos/chat-with-copilot/chat-in-github',
            description: 'Test Copilot Chat prompts and responses',
          },
        ],
      },
    ],
    links: [
      {
        title: 'Using Copilot Chat on GitHub',
        url: 'https://docs.github.com/en/copilot/how-tos/chat-with-copilot/chat-in-github',
        description: 'How to use Copilot Chat in the browser',
      },
    ],
  },
  {
    id: 'dr-copilot-ide',
    title: 'Step 8 \u2014 Set Up Copilot in IDEs',
    shortTitle: 'Copilot IDEs',
    description:
      'Install and sign in to Copilot in VS Code, JetBrains, or Visual Studio. For GHE.com you must configure the enterprise URL so the IDE authenticates against GHE.com SSO instead of the default github.com.',
    prerequisites: [
      'A managed user account with an assigned Copilot seat.',
      'VS Code (1.80+), JetBrains IDE (2025.1+), or Visual Studio 2026 (18.0+) installed.',
      'Network access to https://YOUR-ENTERPRISE.ghe.com from developer machines (firewall/proxy rules configured).',
    ],
    substeps: [
      {
        action: 'VS Code: Install GitHub Copilot extensions.',
        details: [
          'Open VS Code \u2192 Extensions panel (Ctrl+Shift+X).',
          'Search and install "GitHub Copilot" (ID: GitHub.copilot).',
          'Search and install "GitHub Copilot Chat" (ID: GitHub.copilot-chat).',
        ],
        verification: 'Both extensions appear in the Installed list and the Copilot icon shows in the status bar.',
        docLinks: [
          {
            title: 'Installing Copilot in VS Code',
            url: 'https://docs.github.com/en/copilot/how-tos/set-up/install-copilot-extension',
            description: 'Official guide for VS Code extension setup',
          },
        ],
      },
      {
        action: 'VS Code: Configure the GitHub Enterprise URL and Copilot auth provider for GHE.com.',
        details: [
          'CRITICAL: Without these settings, VS Code defaults to authenticating against github.com — which will fail for GHE.com managed users.',
          'Step 1 — Set the enterprise URL: Open VS Code Settings (Ctrl+, or Cmd+,) → search "enterprise" → set "Github-enterprise: Uri" to https://YOUR-ENTERPRISE.ghe.com',
          'Step 2 — Set the Copilot auth provider: In VS Code Settings, search "copilot" → under "GitHub > Copilot: Advanced" click "Edit in settings.json".',
          'Inside the "github.copilot.advanced" property, add: "authProvider": "github-enterprise"',
          'Your settings.json should include both settings: { "github-enterprise.uri": "https://YOUR-ENTERPRISE.ghe.com", "github.copilot.advanced": { "authProvider": "github-enterprise" } }',
          'Save settings.json. You will be shown a prompt asking you to sign in to use GitHub Copilot.',
          'For teams: distribute these settings via a shared .vscode/settings.json or VS Code Settings Sync profile.',
          'To switch back to a github.com account later, remove the "authProvider" setting from settings.json.',
        ],
        verification: 'Both settings are saved in settings.json. Restart VS Code if the sign-in prompt does not appear automatically.',
        docLinks: [
          {
            title: 'Using GitHub Copilot with an account on GHE.com',
            url: 'https://docs.github.com/en/copilot/how-tos/configure-personal-settings/authenticate-to-ghecom',
            description: 'Official guide to configure IDE authentication for GHE.com (data residency)',
          },
          {
            title: 'Configuring GitHub Copilot in your environment',
            url: 'https://docs.github.com/en/copilot/how-tos/configure-personal-settings/configure-in-ide',
            description: 'IDE-specific configuration for GitHub Enterprise',
          },
        ],
      },
      {
        action: 'VS Code: Sign in via GHE.com SSO.',
        details: [
          'After saving settings.json, VS Code will show a prompt: "Sign in to GitHub". Click it to start the flow.',
          'If the prompt does not appear, restart VS Code or click the Copilot icon in the status bar → "Sign in to GitHub".',
          'Because you configured both "github-enterprise.uri" and "authProvider": "github-enterprise", VS Code will redirect to https://YOUR-ENTERPRISE.ghe.com for authentication.',
          'Sign in with your managed user account — this will trigger your IdP SSO flow (Entra ID or Okta).',
          'Complete the SSO authentication and authorize the GitHub Copilot extension.',
          'If you see a github.com login page instead of your GHE.com SSO page, verify both settings are configured: "github-enterprise.uri" AND "github.copilot.advanced.authProvider".',
        ],
        verification: 'The Copilot icon in the status bar shows as active (no warning indicator). Check the Output panel → "GitHub Copilot" for connection details.',
        docLinks: [
          {
            title: 'Using GitHub Copilot with an account on GHE.com',
            url: 'https://docs.github.com/en/copilot/how-tos/configure-personal-settings/authenticate-to-ghecom',
            description: 'Official GHE.com authentication steps for all IDEs',
          },
        ],
      },
      {
        action: 'JetBrains: Install plugin and configure GHE.com authentication.',
        details: [
          'Go to Settings \u2192 Plugins \u2192 Marketplace \u2192 search "GitHub Copilot" \u2192 Install \u2192 Restart IDE.',
          'Go to Settings \u2192 Languages & Frameworks \u2192 GitHub Copilot.',
          'Set Auth Provider to "GitHub Enterprise" (NOT "GitHub" \u2014 "GitHub" defaults to github.com).',
          'Enter enterprise URL: https://YOUR-ENTERPRISE.ghe.com',
          'Click "Sign in" \u2014 a browser window opens to your GHE.com SSO page.',
          'Complete the IdP SSO authentication and authorize the plugin.',
          'If authentication fails, verify the Auth Provider is set to "GitHub Enterprise" and the URL is correct.',
        ],
        verification: 'The Copilot status shows as active in the IDE bottom bar. Check Tools \u2192 GitHub Copilot \u2192 Status for details.',
        docLinks: [
          {
            title: 'Installing Copilot in JetBrains',
            url: 'https://docs.github.com/en/copilot/how-tos/set-up/install-copilot-extension',
            description: 'JetBrains plugin setup guide',
          },
        ],
      },
      {
        action: 'Visual Studio 2026: Configure GHE.com enterprise account for SSO.',
        details: [
          'Ensure GitHub Copilot is enabled: Tools \u2192 Options \u2192 GitHub \u2192 Copilot.',
          'Go to File \u2192 Account Settings \u2192 Add \u2192 "Add GitHub Enterprise account".',
          'IMPORTANT: Do NOT use "Add GitHub account" \u2014 that authenticates against github.com.',
          'Enter your enterprise URL: https://YOUR-ENTERPRISE.ghe.com',
          'A browser window opens to your GHE.com SSO page \u2014 sign in with your managed user via IdP SSO.',
          'Authorize Visual Studio when prompted.',
          'If you previously signed in with a personal github.com account, go to File \u2192 Account Settings and remove it to avoid conflicts.',
        ],
        verification: 'The Copilot icon is active in the bottom status bar. Account Settings shows a GitHub Enterprise account (not a github.com account).',
        docLinks: [
          {
            title: 'Installing Copilot in Visual Studio',
            url: 'https://docs.github.com/en/copilot/how-tos/set-up/install-copilot-extension',
            description: 'Visual Studio Copilot setup guide',
          },
        ],
      },
      {
        action: 'Verify Copilot is working by generating a code completion.',
        details: [
          'Open any source file and start typing a code comment or function.',
          'Copilot should show inline ghost-text suggestions.',
          'Also test Copilot Chat: open the chat panel and ask a coding question.',
        ],
        verification: 'Inline suggestions appear and can be accepted with Tab. Copilot Chat responds to queries.',
        docLinks: [
          {
            title: 'Getting code suggestions in your IDE',
            url: 'https://docs.github.com/en/copilot/how-tos/get-code-suggestions/get-ide-code-suggestions',
            description: 'How to use Copilot code completions',
          },
        ],
      },
      {
        action: 'Troubleshooting SSO authentication issues.',
        details: [
          'Problem: "Sign in to GitHub" opens github.com instead of GHE.com → Solution: verify both settings are configured — "github-enterprise.uri" AND "github.copilot.advanced": { "authProvider": "github-enterprise" } — then restart the IDE.',
          'Problem: SSO authentication loop or failure → Solution: clear browser cookies for GHE.com, check IdP session is active, verify the user has a Copilot seat.',
          'Problem: "No access" after sign-in → Solution: verify the user is assigned a Copilot seat in the organization and is provisioned via SCIM.',
          'For VS Code: check the Output panel → "GitHub Authentication" for detailed error messages.',
          'For network issues: ensure firewall allows access to *.ghe.com, copilot-proxy.githubusercontent.com, and api.github.com.',
        ],
        verification: 'Copilot works end-to-end: code completions, chat, and no authentication warnings.',
        docLinks: [
          {
            title: 'Troubleshooting Copilot',
            url: 'https://docs.github.com/en/copilot/how-tos/troubleshoot-copilot',
            description: 'Common issues and solutions',
          },
          {
            title: 'Firewall settings for Copilot',
            url: 'https://docs.github.com/en/copilot/how-tos/troubleshoot-copilot/troubleshoot-firewall-settings',
            description: 'Required domains and ports for Copilot connectivity',
          },
        ],
      },
    ],
    warnings: [
      'For GHE.com (data residency), you MUST configure TWO settings in VS Code: "github-enterprise.uri" AND "github.copilot.advanced": { "authProvider": "github-enterprise" }. Without both, the IDE defaults to github.com authentication.',
      'If Copilot shows "No access", verify the user has a seat assigned in the organization.',
      'Do not mix github.com and GHE.com accounts in the same IDE — remove any personal github.com accounts before adding the enterprise account.',
    ],
    tips: [
      'Share this VS Code snippet with your team: { "github-enterprise.uri": "https://YOUR-ENTERPRISE.ghe.com", "github.copilot.advanced": { "authProvider": "github-enterprise" } }',
      'For large teams, use a shared VS Code workspace settings file (.vscode/settings.json) in your repos to auto-configure both the enterprise URI and auth provider.',
      'To switch back to a github.com account, remove the "authProvider" setting from settings.json and clear the "github-enterprise.uri" value.',
    ],
    links: [
      {
        title: 'Using GitHub Copilot with an account on GHE.com',
        url: 'https://docs.github.com/en/copilot/how-tos/configure-personal-settings/authenticate-to-ghecom',
        description: 'Official guide to authenticate IDEs for GHE.com data residency enterprises',
      },
      {
        title: 'Installing Copilot in your environment',
        url: 'https://docs.github.com/en/copilot/how-tos/set-up/install-copilot-extension',
        description: 'Official guide for VS Code, JetBrains, and Visual Studio',
      },
      {
        title: 'Troubleshooting Copilot',
        url: 'https://docs.github.com/en/copilot/how-tos/troubleshoot-copilot',
        description: 'Common issues and solutions',
      },
      {
        title: 'Firewall settings for Copilot',
        url: 'https://docs.github.com/en/copilot/how-tos/troubleshoot-copilot/troubleshoot-firewall-settings',
        description: 'Required domains and ports for Copilot connectivity',
      },
    ],
  },
  /* ---- GitHub Advanced Security (GHAS) steps ---- */
  {
    id: 'dr-ghas-enable',
    title: 'Enable GitHub Advanced Security',
    shortTitle: 'Enable GHAS',
    description:
      'Enable GitHub Advanced Security features at the enterprise and organization level on GHE.com.',
    prerequisites: [
      'A GitHub Advanced Security license is included in your enterprise agreement.',
      'Enterprise owner permissions on your GHE.com enterprise.',
      'At least one organization created under the enterprise.',
    ],
    substeps: [
      {
        action: 'Navigate to your enterprise security settings and enable GHAS.',
        details: [
          'Go to https://ENTERPRISE-NAME.ghe.com → Enterprise settings → Code security.',
          'Under "GitHub Advanced Security", select "Enable for all organizations" or enable per-organization.',
          'Enabling at the enterprise level sets the default policy; organizations can still be configured individually.',
        ],
        verification: 'Confirm the "GitHub Advanced Security" status shows as enabled for your target organizations.',
        docLinks: [
          {
            title: 'Enforcing policies for code security in your enterprise',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/enforcing-policies/enforcing-policies-for-your-enterprise/enforcing-policies-for-code-security-and-analysis-for-your-enterprise',
            description: 'Enable or disable GHAS features across your enterprise',
          },
        ],
      },
      {
        action: 'Configure the GHAS enablement policy for organizations.',
        details: [
          'Choose whether organizations can enable GHAS for all repositories or only selected ones.',
          'Consider a phased rollout: start with critical repositories, then expand.',
          'GHAS is licensed per unique active committer — monitor usage to manage costs.',
        ],
        verification: 'Verify the policy is set as intended in Enterprise → Settings → Code security.',
        docLinks: [
          {
            title: 'About billing for GitHub Advanced Security',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/billing/managing-billing-for-your-products/managing-billing-for-github-advanced-security/about-billing-for-github-advanced-security',
            description: 'Understand GHAS licensing and committer-based billing',
          },
        ],
      },
    ],
    tips: [
      'Start with a pilot group of repositories to measure the impact on committer count before a full rollout.',
      'Use the security overview dashboard to track GHAS adoption across organizations.',
    ],
    links: [
      {
        title: 'About GitHub Advanced Security',
        url: 'https://docs.github.com/en/enterprise-cloud@latest/get-started/learning-about-github/about-github-advanced-security',
        description: 'Overview of all GHAS features and capabilities',
      },
      {
        title: 'Enforcing policies for code security in your enterprise',
        url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/enforcing-policies/enforcing-policies-for-your-enterprise/enforcing-policies-for-code-security-and-analysis-for-your-enterprise',
        description: 'Enterprise-level GHAS management',
      },
    ],
  },
  {
    id: 'dr-ghas-code-scanning',
    title: 'Configure Code Scanning with CodeQL',
    shortTitle: 'Code Scanning',
    description:
      'Set up code scanning using CodeQL to automatically find vulnerabilities and coding errors in your repositories.',
    prerequisites: [
      'GitHub Advanced Security is enabled for the target organizations.',
      'Repositories contain supported languages (JavaScript, TypeScript, Python, Java, C#, C/C++, Go, Ruby, Swift, Kotlin).',
    ],
    substeps: [
      {
        action: 'Enable default setup for CodeQL code scanning at the organization level.',
        details: [
          'Go to Organization → Settings → Code security and analysis.',
          'Under "Code scanning", click "Enable all" to use the default CodeQL setup.',
          'Default setup automatically detects languages and runs CodeQL on push and pull request events.',
          'For repositories that need custom configurations, you can override with an advanced setup later.',
        ],
        verification: 'Confirm code scanning is shown as "Configured" for repositories in the organization\'s security overview.',
        docLinks: [
          {
            title: 'Configuring default setup for code scanning',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/code-security/code-scanning/enabling-code-scanning/configuring-default-setup-for-code-scanning',
            description: 'Enable CodeQL with default setup for your organization',
          },
        ],
      },
      {
        action: 'Review and triage code scanning alerts.',
        details: [
          'Navigate to a repository → Security tab → Code scanning alerts.',
          'Review each alert: dismiss false positives, fix true positives, and document decisions.',
          'Set up alert severity thresholds in branch protection rules to block merging of PRs with critical/high alerts.',
        ],
        verification: 'Confirm alerts are visible in the Security tab and that branch protection rules enforce scanning checks.',
        docLinks: [
          {
            title: 'Managing code scanning alerts',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/code-security/code-scanning/managing-code-scanning-alerts/managing-code-scanning-alerts-for-your-repository',
            description: 'Triage and manage code scanning results',
          },
        ],
      },
      {
        action: 'Configure CodeQL query suites and custom queries (optional).',
        details: [
          'Default setup uses the "default" query suite which covers the most impactful security queries.',
          'Switch to the "security-extended" or "security-and-quality" suite for broader coverage.',
          'For advanced needs, create custom CodeQL query packs and reference them in a code-scanning workflow.',
        ],
        verification: 'Verify the desired query suite is active by checking the code scanning configuration page.',
        docLinks: [
          {
            title: 'CodeQL query suites',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/code-security/code-scanning/managing-your-code-scanning-configuration/codeql-query-suites',
            description: 'Choose and customize CodeQL query suites',
          },
        ],
      },
    ],
    tips: [
      'Use default setup for most repositories — it automatically configures CodeQL with zero YAML files.',
      'For mono-repos or complex build systems, switch to advanced setup with a custom workflow file.',
      'Enable "Copilot Autofix" on code scanning alerts to get AI-generated fix suggestions.',
    ],
    links: [
      {
        title: 'About code scanning with CodeQL',
        url: 'https://docs.github.com/en/enterprise-cloud@latest/code-security/code-scanning/introduction-to-code-scanning/about-code-scanning-with-codeql',
        description: 'How CodeQL finds vulnerabilities in your code',
      },
      {
        title: 'Configuring default setup for code scanning at scale',
        url: 'https://docs.github.com/en/enterprise-cloud@latest/code-security/code-scanning/enabling-code-scanning/configuring-default-setup-for-code-scanning-at-scale',
        description: 'Roll out code scanning across all repositories in an organization',
      },
    ],
  },
  {
    id: 'dr-ghas-secret-scanning',
    title: 'Configure Secret Scanning & Push Protection',
    shortTitle: 'Secret Scanning',
    description:
      'Enable secret scanning to detect leaked credentials and push protection to prevent secrets from being committed.',
    prerequisites: [
      'GitHub Advanced Security is enabled for the target organizations.',
    ],
    substeps: [
      {
        action: 'Enable secret scanning at the organization or enterprise level.',
        details: [
          'Go to Organization → Settings → Code security and analysis.',
          'Enable "Secret scanning" for all repositories (existing and new).',
          'Secret scanning automatically checks for known secret patterns from 200+ service providers.',
        ],
        verification: 'Confirm "Secret scanning" shows as enabled in the organization security settings.',
        docLinks: [
          {
            title: 'Configuring secret scanning for your repositories',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/code-security/secret-scanning/enabling-secret-scanning-features/enabling-secret-scanning-for-your-repository',
            description: 'Enable and configure secret scanning',
          },
        ],
      },
      {
        action: 'Enable push protection to block commits containing secrets.',
        details: [
          'In the same Code security settings, enable "Push protection".',
          'Push protection prevents contributors from pushing code that contains detected secrets.',
          'Contributors can bypass push protection with a justification (which is logged for audit).',
          'Best practice: Require admin review for bypass requests in high-security repositories.',
        ],
        verification: 'Test push protection by attempting to push a test secret (use a revoked/test token). Confirm the push is blocked.',
        docLinks: [
          {
            title: 'Push protection for repositories and organizations',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/code-security/secret-scanning/introduction/about-push-protection',
            description: 'Prevent secrets from being pushed to repositories',
          },
        ],
      },
      {
        action: 'Configure custom secret scanning patterns (optional).',
        details: [
          'Define custom patterns to detect organization-specific secrets (internal API keys, tokens, etc.).',
          'Go to Organization → Settings → Code security → Secret scanning → Custom patterns.',
          'Use regex patterns and test them against sample data before enabling.',
          'Custom patterns can also be defined at the enterprise level to apply across all organizations.',
        ],
        verification: 'Verify custom patterns appear in the secret scanning settings and produce expected alerts on test data.',
        docLinks: [
          {
            title: 'Defining custom patterns for secret scanning',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/code-security/secret-scanning/using-advanced-secret-scanning-and-push-protection-features/custom-patterns/defining-custom-patterns-for-secret-scanning',
            description: 'Create regex-based patterns for organization-specific secrets',
          },
        ],
      },
      {
        action: 'Set up secret scanning alert notifications.',
        details: [
          'Configure who receives notifications when secrets are detected.',
          'By default, repository admins and the committer are notified.',
          'Consider adding a security team distribution list to receive all secret scanning alerts.',
        ],
        verification: 'Confirm notification recipients are configured in the organization code security settings.',
        docLinks: [
          {
            title: 'Evaluating alerts from secret scanning',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/code-security/secret-scanning/managing-alerts-from-secret-scanning/evaluating-alerts',
            description: 'How to evaluate and resolve secret scanning alerts',
          },
        ],
      },
    ],
    warnings: [
      'Always rotate any secrets that have been exposed — even if push protection blocks the commit, the secret may exist in local history.',
      'Review bypass requests regularly to ensure push protection is not being circumvented without justification.',
    ],
    tips: [
      'Enable "Validity checks" to automatically verify whether detected secrets are still active with the provider.',
      'Use the audit log to track push protection bypass events across the enterprise.',
    ],
    links: [
      {
        title: 'About secret scanning',
        url: 'https://docs.github.com/en/enterprise-cloud@latest/code-security/secret-scanning/introduction/about-secret-scanning',
        description: 'Overview of secret scanning capabilities',
      },
      {
        title: 'Secret scanning patterns',
        url: 'https://docs.github.com/en/enterprise-cloud@latest/code-security/secret-scanning/introduction/supported-secret-scanning-patterns',
        description: 'Full list of supported secret types and providers',
      },
    ],
  },
  {
    id: 'dr-ghas-dependabot',
    title: 'Configure Dependabot (Alerts, Updates & Security)',
    shortTitle: 'Dependabot',
    description:
      'Enable Dependabot to automatically detect vulnerable dependencies and create pull requests to update them.',
    prerequisites: [
      'Repositories contain supported package ecosystems (npm, Maven, NuGet, pip, etc.).',
    ],
    substeps: [
      {
        action: 'Enable Dependabot alerts at the organization level.',
        details: [
          'Go to Organization → Settings → Code security and analysis.',
          'Enable "Dependabot alerts" for all repositories.',
          'Dependabot alerts notify you when your dependencies have known vulnerabilities from the GitHub Advisory Database.',
        ],
        verification: 'Confirm Dependabot alerts are enabled and visible in the organization security overview.',
        docLinks: [
          {
            title: 'Configuring Dependabot alerts',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/code-security/dependabot/dependabot-alerts/configuring-dependabot-alerts',
            description: 'Enable and configure Dependabot vulnerability alerts',
          },
        ],
      },
      {
        action: 'Enable Dependabot security updates.',
        details: [
          'In the same settings, enable "Dependabot security updates".',
          'This automatically creates pull requests to update vulnerable dependencies to the minimum patched version.',
          'Security updates are prioritized by severity and focus only on fixing the vulnerability.',
        ],
        verification: 'Verify that Dependabot creates PRs for known vulnerabilities in a test repository.',
        docLinks: [
          {
            title: 'Configuring Dependabot security updates',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/code-security/dependabot/dependabot-security-updates/configuring-dependabot-security-updates',
            description: 'Automatically fix vulnerable dependencies',
          },
        ],
      },
      {
        action: 'Enable Dependabot version updates (optional but recommended).',
        details: [
          'Create a .github/dependabot.yml configuration file in each repository (or use a central config).',
          'Specify package ecosystems, directories, and update schedules.',
          'Version updates keep all dependencies up to date, not just vulnerable ones.',
          'Example config: package-ecosystem: "npm", directory: "/", schedule: { interval: "weekly" }.',
        ],
        verification: 'Confirm Dependabot version update PRs are created on the configured schedule.',
        docLinks: [
          {
            title: 'Configuring Dependabot version updates',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/code-security/dependabot/dependabot-version-updates/configuring-dependabot-version-updates',
            description: 'Keep dependencies current with automated version update PRs',
          },
        ],
      },
      {
        action: 'Configure dependency review for pull requests.',
        details: [
          'Dependency review shows the impact of dependency changes in pull requests before merging.',
          'Install the "Dependency Review" GitHub Action in your CI workflows to enforce policies.',
          'Use the action to block PRs that introduce known-vulnerable or restrictively-licensed dependencies.',
        ],
        verification: 'Submit a test PR that changes a dependency and confirm the dependency review summary appears.',
        docLinks: [
          {
            title: 'About dependency review',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/code-security/supply-chain-security/understanding-your-software-supply-chain/about-dependency-review',
            description: 'Review dependency changes and their security impact in PRs',
          },
        ],
      },
    ],
    tips: [
      'Group Dependabot PRs by ecosystem or dependency type to reduce PR noise.',
      'Use auto-merge with required status checks to automatically merge low-risk dependency updates.',
      'Configure Dependabot to ignore specific dependencies or versions using the ignore option in dependabot.yml.',
    ],
    links: [
      {
        title: 'About Dependabot',
        url: 'https://docs.github.com/en/enterprise-cloud@latest/code-security/dependabot/working-with-dependabot',
        description: 'Overview of all Dependabot features',
      },
      {
        title: 'Dependabot configuration options',
        url: 'https://docs.github.com/en/enterprise-cloud@latest/code-security/dependabot/dependabot-version-updates/configuration-options-for-the-dependabot.yml-file',
        description: 'Full reference for dependabot.yml configuration',
      },
    ],
  },
  {
    id: 'dr-ghas-security-overview',
    title: 'Security Overview & Policies',
    shortTitle: 'Security Overview',
    description:
      'Use the security overview dashboard to monitor your security posture and define security policies across the enterprise.',
    prerequisites: [
      'GitHub Advanced Security is enabled with code scanning, secret scanning, or Dependabot configured.',
    ],
    substeps: [
      {
        action: 'Review the enterprise security overview dashboard.',
        details: [
          'Navigate to Enterprise → Code Security → Overview.',
          'The dashboard shows a summary of open alerts across all organizations and repositories.',
          'Filter by severity, tool, organization, or repository to focus on critical issues.',
          'Use the "Coverage" tab to see which repositories have security features enabled.',
        ],
        verification: 'Confirm you can view alert counts, coverage metrics, and filter by organization.',
        docLinks: [
          {
            title: 'About the security overview',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/code-security/security-overview/about-security-overview',
            description: 'Enterprise-wide visibility into your security posture',
          },
        ],
      },
      {
        action: 'Create a SECURITY.md security policy for your organizations.',
        details: [
          'Add a SECURITY.md file to the .github repository in each organization.',
          'Include: supported versions, how to report vulnerabilities, expected response times, and disclosure policy.',
          'This file is automatically displayed when users navigate to the repository\'s "Security" tab.',
        ],
        verification: 'Confirm the security policy is visible on the Security tab of repositories in the organization.',
        docLinks: [
          {
            title: 'Adding a security policy to your repository',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/code-security/getting-started/adding-a-security-policy-to-your-repository',
            description: 'Define how vulnerabilities should be reported',
          },
        ],
      },
      {
        action: 'Configure security alert notifications and webhooks.',
        details: [
          'Set up organization-level notification routing for security alerts.',
          'Consider integrating with SIEM tools using webhooks for code scanning, secret scanning, and Dependabot events.',
          'Use the GitHub API to programmatically query and manage security alerts at scale.',
        ],
        verification: 'Confirm security team members receive notifications for new alerts and that webhook events are delivered.',
        docLinks: [
          {
            title: 'About security alerts',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/code-security/getting-started/auditing-security-alerts',
            description: 'Auditing and monitoring security alerts',
          },
        ],
      },
      {
        action: 'Set up enterprise-level security configurations (optional).',
        details: [
          'Use enterprise-level security configurations to apply consistent settings across all organizations.',
          'Define which security features should be enabled by default for new repositories.',
          'Configure required workflows and rulesets that enforce security checks across the enterprise.',
        ],
        verification: 'Verify that new repositories automatically inherit the enterprise security configuration.',
        docLinks: [
          {
            title: 'Applying security configurations at enterprise scale',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/code-security/securing-your-organization/enabling-security-features-in-your-organization',
            description: 'Apply security configurations across your organization',
          },
        ],
      },
    ],
    tips: [
      'Schedule regular security review meetings using the security overview as the agenda.',
      'Set up Slack or Teams notifications for critical/high severity alerts using webhooks.',
      'Use the "Risk" tab to prioritize repositories with the most open alerts.',
    ],
    links: [
      {
        title: 'Security overview dashboard',
        url: 'https://docs.github.com/en/enterprise-cloud@latest/code-security/security-overview/about-security-overview',
        description: 'Centralized view of security alerts and coverage',
      },
      {
        title: 'Securing your organization',
        url: 'https://docs.github.com/en/enterprise-cloud@latest/code-security/securing-your-organization',
        description: 'Best practices for securing your GitHub organization',
      },
    ],
  },
  {
    id: 'dr-verify',
    title: 'Verify & Go Live',
    shortTitle: 'Verify',
    description:
      'Validate the entire setup end-to-end and prepare for production rollout.',
    prerequisites: [
      'All previous steps are completed and verified.',
      'At least one test managed user account provisioned via SCIM (not the setup user).',
      'The test user has been added to a team with repository access and a Copilot seat.',
    ],
    substeps: [
      {
        action: 'Sign in as a provisioned managed user (not the setup user).',
        details: [
          'Open a private/incognito browser window.',
          'Navigate to https://YOUR-ENTERPRISE.ghe.com.',
          'Sign in with a test managed user account via SSO.',
        ],
        verification: 'The managed user can sign in successfully and sees the enterprise dashboard.',
        docLinks: [
          {
            title: 'About EMU abilities and restrictions',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/managing-iam/understanding-iam-for-enterprises/abilities-and-restrictions-of-managed-user-accounts',
            description: 'What managed users can and cannot do',
          },
        ],
      },
      {
        action: 'Verify organization and repository access.',
        details: [
          'Confirm the user can see the correct organizations.',
          'Confirm the user can access repositories their team has access to.',
          'Confirm the user CANNOT see repos they should not have access to.',
        ],
        verification: 'Organization membership and repo visibility match the expected access.',
        docLinks: [
          {
            title: 'Managing repository access',
            url: 'https://docs.github.com/en/organizations/managing-user-access-to-your-organizations-repositories/managing-repository-roles/managing-team-access-to-an-organization-repository',
            description: 'Verify team-based repository access control',
          },
        ],
      },
      {
        action: 'Test Git operations: clone, push, and pull request creation.',
        details: [
          'Clone a test repo: git clone https://YOUR-ENTERPRISE.ghe.com/org/repo.git',
          'Make a change, commit, and push to a new branch.',
          'Create a pull request from the web UI.',
        ],
        verification: 'Clone, push, and PR creation all succeed without errors.',
        docLinks: [
          {
            title: 'Cloning a repository',
            url: 'https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository',
            description: 'How to clone, push, and create pull requests',
          },
        ],
      },
      {
        action: 'Verify IdP group → team synchronization.',
        details: [
          'Check that IdP group members appear in the corresponding GitHub team.',
          'Add a user to an IdP group and verify they appear in the GitHub team within minutes.',
        ],
        verification: 'Team membership matches the IdP group membership.',
        docLinks: [
          {
            title: 'Managing team memberships with IdP groups',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/managing-iam/provisioning-user-accounts-with-scim/managing-team-memberships-with-identity-provider-groups',
            description: 'Verify IdP group to GitHub team synchronization',
          },
        ],
      },
      {
        action: 'Test deprovisioning and reprovisioning.',
        details: [
          'Remove a test user from the IdP application assignment.',
          'Wait for the SCIM sync cycle (or trigger a manual sync).',
          'Then re-assign the user and verify they regain access.',
        ],
        verification: 'Deprovisioned user is suspended in GitHub; after reprovisioning, their access is restored.',
        docLinks: [
          {
            title: 'Configuring SCIM provisioning for EMU',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/managing-iam/provisioning-user-accounts-with-scim/configuring-scim-provisioning-for-users',
            description: 'How deprovisioning and reprovisioning works with SCIM',
          },
        ],
      },
      {
        action: 'Roll out to remaining users and communicate.',
        details: [
          'Assign all remaining users/groups in the IdP application.',
          'Send an email/Slack to all users with: GHE.com URL, sign-in instructions, IDE setup guide.',
        ],
        verification: 'All users can sign in to GHE.com and access their assigned repos.',
        docLinks: [
          {
            title: 'About EMU limitations',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/managing-iam/understanding-iam-for-enterprises/abilities-and-restrictions-of-managed-user-accounts',
            description: 'What managed users can and cannot do — share this with users',
          },
        ],
      },
    ],
    warnings: [
      'Managed users cannot create personal repositories — all work happens in organization repositories.',
      'Managed users cannot interact with public repositories outside the enterprise.',
    ],
    links: [
      {
        title: 'About EMU limitations',
        url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/managing-iam/understanding-iam-for-enterprises/abilities-and-restrictions-of-managed-user-accounts',
        description: 'What managed users can and cannot do',
      },
    ],
  },
  {
    id: 'dr-notify-users',
    title: 'Notify Users & Roll Out',
    shortTitle: 'Notify Users',
    description:
      'Send a welcome email to your users with sign-in instructions, IDE setup guides, and important information about managed user accounts on GHE.com.',
    substeps: [
      {
        action: 'Prepare the welcome email for your users.',
        details: [
          'Use the pre-configured email template below. Customize it with your enterprise name, organization details, and any internal resources.',
          'Review the email content with your IT and security teams before sending.',
          'Consider sending to a pilot group first, then rolling out to all users.',
        ],
        verification: 'The email has been reviewed and approved by stakeholders.',
        docLinks: [
          {
            title: 'About EMU abilities and restrictions',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/managing-iam/understanding-iam-for-enterprises/abilities-and-restrictions-of-managed-user-accounts',
            description: 'Share this link with your users',
          },
        ],
      },
      {
        action: 'Review and send the welcome email template.',
        // emailTemplate is injected dynamically by getSteps() based on config
        verification: 'The email has been sent to all users. Verify with a test recipient that links work and instructions are clear.',
        docLinks: [
          {
            title: 'Getting started with Copilot',
            url: 'https://docs.github.com/en/copilot/get-started',
            description: 'Share this quickstart guide with your users',
          },
        ],
      },
      {
        action: 'Monitor user onboarding and provide support.',
        // details, verification, and docLinks are injected dynamically by getSteps() based on config
        details: [],
        verification: 'All target users have signed in successfully.',
        docLinks: [],
      },
    ],
    tips: [
      'Send the email in waves: start with a pilot group of 10\u201320 users, gather feedback, then roll out company-wide.',
      'Include your IT helpdesk contact in the email for first-line support.',
    ],
    links: [
      {
        title: 'EMU abilities and restrictions',
        url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/managing-iam/understanding-iam-for-enterprises/abilities-and-restrictions-of-managed-user-accounts',
        description: 'What managed users can and cannot do',
      },
      {
        title: 'Getting started with Copilot',
        url: 'https://docs.github.com/en/copilot/get-started',
        description: 'Copilot quickstart for users',
      },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Steps WITHOUT Data Residency (github.com)                         */
/* ------------------------------------------------------------------ */
const noDrSteps: WizardStep[] = [
  {
    id: 'nodr-prerequisites',
    title: 'Prerequisites & Planning',
    shortTitle: 'Prerequisites',
    description:
      'Review requirements before starting your EMU enterprise on github.com.',
    prerequisites: [
      'An active Azure subscription with billing configured (required for Entra ID and GitHub licensing).',
      'Admin access to a Microsoft Entra ID tenant (or Okta/PingFederate tenant).',
      'A GitHub Enterprise Cloud subscription or Enterprise agreement — contact GitHub Sales if needed.',
      'An Entra ID user account with at least the Cloud Application Administrator role (required to create enterprise applications).',
    ],
    substeps: [
      {
        action: 'Choose a supported Identity Provider (IdP): Microsoft Entra ID (recommended), Okta, or PingFederate.',
        verification: 'Confirm you have admin access to your IdP tenant and can create enterprise applications.',
        docLinks: [
          {
            title: 'About EMU identity providers',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/concepts/identity-and-access-management/enterprise-managed-users#how-does-emus-integrate-with-identity-management-systems',
            description: 'List of supported IdPs for EMU',
          },
        ],
      },
      {
        action: 'Confirm your organization has a GitHub Enterprise Cloud subscription.',
        verification: 'Open your GitHub billing page or contact your account manager to verify the subscription.',
        docLinks: [
          {
            title: 'GitHub Enterprise Cloud plans',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/get-started/learning-about-github/githubs-plans#github-enterprise',
            description: 'Overview of Enterprise Cloud plans',
          },
        ],
      },
      {
        action: 'Contact GitHub Sales or your account manager to request an EMU enterprise.',
        details: [
          'EMU cannot be self-enabled on an existing enterprise — it must be provisioned by GitHub.',
          'Provide: company name, desired short code, contact email for the setup user.',
        ],
        verification: 'You have received confirmation from GitHub that the EMU enterprise request has been submitted.',
        docLinks: [
          {
            title: 'GitHub Enterprise Sales',
            url: 'https://github.com/enterprise/contact',
            description: 'Contact GitHub Sales for an EMU enterprise',
          },
        ],
      },
      {
        action: 'Identify the person who will act as the setup user.',
        details: [
          'The setup user receives the initial credentials from GitHub.',
          'This becomes the break-glass admin account for the enterprise.',
        ],
        verification: 'The setup user has been notified and has a secure channel to receive credentials.',
        docLinks: [
          {
            title: 'Getting started with EMU',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/managing-iam/understanding-iam-for-enterprises/getting-started-with-enterprise-managed-users',
            description: 'Setup user role and responsibilities',
          },
        ],
      },
      {
        action: 'Plan the enterprise short code / namespace.',
        details: [
          'The short code becomes part of all managed user handles (e.g., user_SHORTCODE).',
        ],
        verification: 'The desired short code is documented and confirmed to be unique.',
        docLinks: [
          {
            title: 'Getting started with EMU',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/managing-iam/understanding-iam-for-enterprises/getting-started-with-enterprise-managed-users',
            description: 'Official getting started guide',
          },
        ],
      },
    ],
    warnings: [
      'EMU enterprises CANNOT be converted back to regular enterprises.',
      'Managed users have restrictions: no personal repos, no interactions outside the enterprise on github.com.',
    ],
    tips: [
      'If you are unsure whether EMU is right for you, compare EMU with regular SAML at the link below.',
    ],
    links: [
      {
        title: 'About Enterprise Managed Users',
        url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/concepts/identity-and-access-management/enterprise-managed-users',
        description: 'Official overview of EMU features and constraints',
      },
      {
        title: 'Choosing between EMU and regular SAML',
        url: 'https://docs.github.com/en/enterprise-cloud@latest/enterprise-onboarding/getting-started-with-your-enterprise/choose-an-enterprise-type',
        description: 'Compare EMU vs. regular SAML enterprise',
      },
    ],
  },
  {
    id: 'nodr-create-enterprise',
    title: 'Create a New EMU Enterprise',
    shortTitle: 'Create Enterprise',
    description:
      'Create a new GitHub Enterprise Managed Users enterprise on github.com. You can start a trial via self-service or contact GitHub Sales for a full agreement.',
    prerequisites: [
      'All prerequisites from Step 0 are satisfied.',
      'Enterprise short code / namespace has been decided.',
      'A GitHub.com personal account to initiate the trial (if using self-service).',
    ],
    substeps: [
      {
        action: 'Option A — Start a trial via self-service setup.',
        details: [
          'Navigate to https://github.com/account/enterprises/new?users_type=enterprise_managed to start a GitHub Enterprise Managed Users trial.',
          'Sign in with your personal GitHub.com account (this account will become the initial enterprise owner).',
          'Choose your enterprise name (short code / slug) — this will be used in all managed usernames (e.g., user_SHORTCODE).',
          'Select "Enterprise Managed Users" as the enterprise type.',
          'Complete the signup form and submit.',
          'The trial includes 50 seats and lasts 30 days — you can upgrade to a paid plan at any time.',
        ],
        verification: 'The form has been submitted successfully and you see a confirmation page.',
        docLinks: [
          {
            title: 'Setting up a trial of GitHub Enterprise Cloud',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/overview/setting-up-a-trial-of-github-enterprise-cloud',
            description: 'How to start and manage a GitHub Enterprise Cloud trial',
          },
          {
            title: 'About Enterprise Managed Users',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/concepts/identity-and-access-management/enterprise-managed-users',
            description: 'Overview of the EMU model and how it differs from standard accounts',
          },
        ],
      },
      {
        action: 'Wait for the enterprise creation confirmation email from GitHub.',
        details: [
          'After submitting the form, GitHub will begin provisioning the enterprise. This is NOT instant.',
          'Check the inbox of the email address associated with the personal GitHub.com account used during signup.',
          'You will receive an email from GitHub confirming that the enterprise has been created and is ready to use.',
          'The email will contain a link to your new enterprise at https://github.com/enterprises/YOUR-ENTERPRISE.',
          'Provisioning typically takes a few minutes but may take longer during peak times.',
        ],
        verification: 'You have received the email from GitHub confirming the enterprise creation is complete.',
        docLinks: [
          {
            title: 'Setting up a trial of GitHub Enterprise Cloud',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/overview/setting-up-a-trial-of-github-enterprise-cloud',
            description: 'Trial provisioning process and expected timelines',
          },
        ],
      },
      {
        action: 'Option B — Contact GitHub Sales for a full Enterprise agreement.',
        details: [
          'If you need more than 50 seats, require an invoice/PO-based agreement, or your organization has specific procurement requirements, contact GitHub Sales.',
          'Provide the following information: company name, desired enterprise short code, and the email address for the setup user.',
          'If you have an existing Enterprise agreement, reference it in the request.',
          'Specify that you need an Enterprise Managed Users (EMU) enterprise on github.com.',
          'Processing time varies — typically a few business days. You will receive an email when the enterprise is ready.',
        ],
        verification: 'You have received the provisioning confirmation email from GitHub with the enterprise URL.',
        docLinks: [
          {
            title: 'GitHub Enterprise Sales',
            url: 'https://github.com/enterprise/contact',
            description: 'Contact GitHub Sales for an enterprise agreement',
          },
        ],
      },
      {
        action: 'Verify the enterprise URL is accessible.',
        details: [
          'Open a browser and navigate to https://github.com/enterprises/YOUR-ENTERPRISE.',
          'You should see the enterprise dashboard or a sign-in page.',
          'If you used the trial self-service, you are already signed in as the enterprise owner.',
        ],
        verification: 'The enterprise URL loads successfully and you can access the enterprise settings.',
        docLinks: [
          {
            title: 'Getting started with Enterprise Managed Users',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/managing-iam/understanding-iam-for-enterprises/getting-started-with-enterprise-managed-users',
            description: 'Verify your new enterprise is accessible',
          },
        ],
      },
    ],
    warnings: [
      'EMU enterprises are separate from standard GitHub.com enterprises — users cannot interact with resources outside the enterprise unless explicitly allowed.',
      'The enterprise short code becomes permanent and part of all managed user handles.',
      'Trial enterprises expire after 30 days if not upgraded to a paid plan.',
    ],
    tips: [
      'Double-check the short code before submitting — it cannot be changed later.',
      'The trial is a great way to test the EMU setup before committing to a paid plan.',
      'The short code/namespace will appear in all managed usernames (e.g., user_SHORTCODE).',
    ],
    links: [
      {
        title: 'Start an EMU trial',
        url: 'https://github.com/account/enterprises/new?users_type=enterprise_managed',
        description: 'Self-service link to create a new EMU enterprise trial',
      },
      {
        title: 'About Enterprise Managed Users',
        url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/concepts/identity-and-access-management/enterprise-managed-users',
        description: 'Overview of the EMU model',
      },
      {
        title: 'Getting started with Enterprise Managed Users',
        url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/managing-iam/understanding-iam-for-enterprises/getting-started-with-enterprise-managed-users',
        description: 'Step-by-step guide to setting up EMU',
      },
    ],
  },
  {
    id: 'nodr-billing',
    title: 'Configure Billing via Azure Subscription',
    shortTitle: 'Billing',
    description:
      'Link an Azure subscription to your GitHub Enterprise for billing. All GitHub Enterprise charges (seats, Copilot, Actions, Packages, etc.) will be billed through the linked Azure subscription.',
    prerequisites: [
      'An Azure subscription with Owner or Contributor role.',
      'Billing admin or enterprise owner access in your GitHub Enterprise.',
      'Knowledge of your organization\'s procurement/purchasing process for software licenses.',
      'The Azure subscription must be active and not in a suspended or cancelled state.',
    ],
    substeps: [
      {
        action: 'Verify your GitHub Enterprise Cloud subscription is active.',
        details: [
          'Contact your GitHub account manager or check your Enterprise agreement to confirm the subscription.',
          'Ensure the subscription covers the expected number of seats (users).',
        ],
        verification: 'You have confirmation from GitHub or your procurement team that the Enterprise Cloud subscription is active.',
        docLinks: [
          {
            title: 'About billing for GitHub',
            url: 'https://docs.github.com/en/billing/get-started/how-billing-works',
            description: 'Overview of GitHub billing and plans',
          },
        ],
      },
      {
        action: 'Link the Azure subscription to your GitHub enterprise.',
        details: [
          'Go to https://github.com/enterprises/YOUR-ENTERPRISE → Settings → Billing → Payment information.',
          'Click "Add Azure subscription" and sign in to Azure with an account that has Owner or Contributor role on the target subscription.',
          'Select the Azure subscription and confirm the link.',
          'Requires: Azure subscription ID, and the ability to create resource providers in the subscription.',
          'Azure billing allows you to use your existing Azure commitment (MACC) and see GitHub costs in Azure Cost Management.',
          'All GitHub charges — Enterprise seats, Copilot seats, Actions minutes, Packages storage, and premium requests — will appear on your Azure invoice.',
        ],
        verification: 'The Azure subscription appears as the payment method in your GitHub enterprise billing settings.',
        docLinks: [
          {
            title: 'Connecting an Azure subscription',
            url: 'https://docs.github.com/en/billing/how-tos/set-up-payment/connect-azure-sub',
            description: 'Step-by-step guide for linking Azure subscriptions',
          },
        ],
      },
      {
        action: 'Plan Copilot licensing costs.',
        details: [
          'GitHub Copilot Business: $19/user/month (billed per assigned seat) — this is the default plan assigned at the enterprise level.',
          'GitHub Copilot Enterprise: $39/user/month (includes knowledge bases, PR summaries, and docset indexing) — requires creating an organization and assigning the Enterprise plan to that specific organization (see Copilot steps for details).',
          'Seats are charged when assigned — unassigned users do not incur cost.',
          'Estimate total monthly cost: number of Copilot users × per-seat price.',
          'Note: assigning users to an organization with Copilot Enterprise may also incur a GitHub Enterprise license cost per user in that organization.',
        ],
        verification: 'Document the expected number of Copilot seats and estimated monthly cost. Confirm budget approval.',
        docLinks: [
          {
            title: 'About billing for GitHub Copilot',
            url: 'https://docs.github.com/en/billing/concepts/product-billing/github-copilot-licenses',
            description: 'Copilot pricing and billing details',
          },
        ],
      },
      {
        action: 'Set up billing alerts and spending limits in Azure Cost Management.',
        details: [
          'Go to Azure portal → Cost Management → Budgets → Create a budget for the linked subscription.',
          'Set monthly budget thresholds and alert recipients (e.g., notify at 50%, 75%, 90% of budget).',
          'In GitHub: go to Enterprise settings → Billing → configure spending limits for Actions, Packages, and Codespaces.',
        ],
        verification: 'Azure budget alerts are configured and GitHub spending limits are set. Test or confirm the alert rules exist.',
        docLinks: [
          {
            title: 'Setting up budgets and alerts',
            url: 'https://docs.github.com/en/billing/how-tos/set-up-budgets',
            description: 'How to set spending limits for GitHub products',
          },
          {
            title: 'Azure Cost Management budgets',
            url: 'https://learn.microsoft.com/en-us/azure/cost-management-billing/costs/tutorial-acm-create-budgets',
            description: 'Create and manage Azure budgets',
          },
        ],
      },
    ],
    warnings: [
      'An Azure subscription is required for billing — GitHub direct billing (credit card/invoice) is not used in this configuration.',
    ],
    tips: [
      'If your organization has a Microsoft Azure commitment (MACC), linking your Azure subscription helps consume that commitment with GitHub charges.',
      'Review GitHub pricing regularly — seat counts and plan changes affect monthly costs.',
      'Use Azure Cost Management tags and cost analysis to break down GitHub spending by service (Copilot, Actions, etc.).',
    ],
    links: [
      {
        title: 'About billing on GitHub',
        url: 'https://docs.github.com/en/billing/get-started/how-billing-works',
        description: 'Overview of billing, plans, and payment methods',
      },
      {
        title: 'Connecting an Azure subscription',
        url: 'https://docs.github.com/en/billing/how-tos/set-up-payment/connect-azure-sub',
        description: 'Link your Azure subscription for consolidated billing',
      },
      {
        title: 'About billing for GitHub Copilot',
        url: 'https://docs.github.com/en/billing/concepts/product-billing/github-copilot-licenses',
        description: 'Copilot seat pricing and billing details',
      },
    ],
  },
  {
    id: 'nodr-setup-user',
    title: 'Receive Credentials & Sign In',
    shortTitle: 'Setup User',
    description:
      'GitHub will provision your EMU enterprise on github.com and send credentials to the setup user.',
    prerequisites: [
      'The EMU enterprise request has been submitted and approved by GitHub.',
      'Access to the email inbox designated to receive the setup user invitation.',
      'A password manager or secure vault ready to store the setup user credentials and 2FA recovery codes.',
    ],
    substeps: [
      {
        action: 'Check email for the setup user invitation sent by GitHub.',
        details: [
          'After GitHub creates your EMU enterprise, the setup user receives an email.',
          'The email invites you to choose a password for the setup user account.',
          'The setup user handle is your enterprise short code + "_admin" (e.g., contoso_admin).',
        ],
        verification: 'Confirm the email has been received and you can access the setup link.',
        docLinks: [
          {
            title: 'Getting started with EMU',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/managing-iam/understanding-iam-for-enterprises/getting-started-with-enterprise-managed-users',
            description: 'Setup user credentials and initial sign-in',
          },
        ],
      },
      {
        action: 'Set a password for the setup user account.',
        details: [
          'Use an incognito or private browsing window.',
          'Follow the link in the invitation email to set your password.',
          'Choose a strong, unique password and store it in a secure password manager.',
        ],
        verification: 'Password is set — you can sign in with the new password.',
        docLinks: [
          {
            title: 'Getting started with EMU',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/managing-iam/understanding-iam-for-enterprises/getting-started-with-enterprise-managed-users',
            description: 'Official getting started guide',
          },
        ],
      },
      {
        action: 'Sign in at https://github.com using the setup user account.',
        details: [
          'The setup user handle is your enterprise short code + "_admin" (e.g., contoso_admin).',
        ],
        verification: 'You are signed in and see the GitHub dashboard.',
        docLinks: [
          {
            title: 'Getting started with EMU',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/managing-iam/understanding-iam-for-enterprises/getting-started-with-enterprise-managed-users',
            description: 'Official getting started guide',
          },
        ],
      },
      {
        action: 'Enable two-factor authentication (2FA) on the setup user account.',
        details: [
          'Go to Settings → Password and authentication → Enable two-factor authentication.',
          'Save the recovery codes in a secure location (e.g., a password manager).',
        ],
        verification: 'The 2FA badge appears on the account, and recovery codes are stored securely.',
        docLinks: [
          {
            title: 'Configuring two-factor authentication',
            url: 'https://docs.github.com/en/authentication/securing-your-account-with-two-factor-authentication-2fa/configuring-two-factor-authentication',
            description: 'How to enable and configure 2FA',
          },
        ],
      },
      {
        action: 'Navigate to Enterprise settings to begin configuring authentication.',
        details: [
          'Go to https://github.com/enterprises/YOUR-ENTERPRISE → Settings.',
        ],
        verification: 'The Enterprise settings page loads with Authentication security in the sidebar.',
        docLinks: [
          {
            title: 'Managing your enterprise account',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/managing-your-enterprise-account',
            description: 'Navigating enterprise settings',
          },
        ],
      },
      {
        action: 'Review and document your enterprise URLs for IdP configuration.',
        details: [
          'Enterprise URL: https://github.com/enterprises/YOUR-ENTERPRISE',
          'SSO URL: https://github.com/enterprises/YOUR-ENTERPRISE/sso',
          'SAML ACS URL (Reply URL): https://github.com/enterprises/YOUR-ENTERPRISE/saml/consume',
          'Entity ID / Audience: https://github.com/enterprises/YOUR-ENTERPRISE',
          'SCIM Endpoint: https://api.github.com/scim/v2/enterprises/YOUR-ENTERPRISE',
        ],
        verification: 'All five enterprise URLs are documented and ready to paste into your IdP configuration.',
        docLinks: [
          {
            title: 'Configuring SAML for EMU',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/managing-iam/configuring-authentication-for-enterprise-managed-users/configuring-saml-single-sign-on-for-enterprise-managed-users',
            description: 'SAML SSO configuration guide',
          },
          {
            title: 'Configuring SCIM for EMU',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/managing-iam/provisioning-user-accounts-with-scim/configuring-scim-provisioning-for-users',
            description: 'SCIM provisioning endpoints',
          },
        ],
      },
    ],
    warnings: [
      'Store the setup user credentials securely — this is your break-glass admin account.',
    ],
    links: [
      {
        title: 'Getting started with EMU',
        url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/managing-iam/understanding-iam-for-enterprises/getting-started-with-enterprise-managed-users',
        description: 'Official getting started guide',
      },
    ],
  },
  {
    id: 'nodr-sso',
    title: 'Configure SAML SSO',
    shortTitle: 'SAML SSO',
    description:
      'Set up SAML single sign-on between your Identity Provider and your github.com EMU enterprise.',
    prerequisites: [
      'An Entra ID user with at least the Cloud Application Administrator role to create and configure enterprise applications.',
      'For Okta: admin access to your Okta org. For PingFederate: admin access to the PingFederate server.',
      'The setup user account credentials (you will need to sign in to github.com enterprise settings).',
      'The enterprise URLs from the previous step (ACS URL, Entity ID) ready to copy into the IdP.',
    ],
    substeps: [
      {
        action: 'In your IdP, create a new Enterprise Application for GitHub EMU.',
        details: [
          'Entra ID: search for "GitHub Enterprise Managed User" in the Azure AD Gallery.',
          'Okta: search for "GitHub Enterprise Managed User" in the OIN catalog.',
          'PingFederate: create a new SAML connection manually.',
        ],
        verification: 'The application is created and visible in your IdP application list.',
        docLinks: [
          {
            title: 'Entra ID tutorial for EMU',
            url: 'https://learn.microsoft.com/en-us/entra/identity/saas-apps/github-enterprise-managed-user-tutorial',
            description: 'Microsoft tutorial: Entra ID + GitHub EMU integration',
          },
        ],
      },
      {
        action: 'Copy the ACS URL and Entity ID from GitHub enterprise settings into your IdP.',
        details: [
          'Navigate to your enterprise → click "Identity provider" → "Single sign-on configuration".',
          'ACS URL: https://github.com/enterprises/YOUR-ENTERPRISE/saml/consume',
          'Entity ID / Audience: https://github.com/enterprises/YOUR-ENTERPRISE',
        ],
        verification: 'The ACS URL and Entity ID fields are populated in your IdP SAML configuration.',
        docLinks: [
          {
            title: 'Configuring SAML SSO for EMU',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/managing-iam/configuring-authentication-for-enterprise-managed-users/configuring-saml-single-sign-on-for-enterprise-managed-users',
            description: 'SAML ACS URL and Entity ID configuration',
          },
        ],
      },
      {
        action: 'Configure the SAML attributes/claims.',
        details: [
          'NameID (required): unique, persistent identifier for the user. Ensure the format is "Persistent" — NOT "transient".',
          'emails (optional): user\'s email address — SCIM provisioning handles this, so it is not strictly required in SAML.',
          'full_name (optional): user\'s display name — also provisioned via SCIM.',
          'For Entra ID: the default claims from the gallery app are sufficient — the default NameID source (user.userprincipalname) is a human-readable, persistent identifier that meets GitHub requirements. No Attributes & Claims changes are strictly necessary.',
        ],
        verification: 'NameID is configured with a persistent format. Optional claims (emails, full_name) added if desired.',
        docLinks: [
          {
            title: 'GitHub SAML configuration reference',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/managing-iam/iam-configuration-reference/saml-configuration-reference',
            description: 'SAML attributes: NameID (required — human-readable, persistent identifier), emails and full_name (optional)',
          },
        ],
      },
      {
        action: 'In GitHub enterprise settings, paste the IdP metadata into the SAML configuration.',
        details: [
          'Navigate to your enterprise → click "Identity provider" at the top.',
          'Under Identity Provider, click "Single sign-on configuration".',
          'Under "SAML single sign-on", select "Add SAML configuration".',
          'Paste the IdP Sign-on URL (SSO URL).',
          'Paste the Issuer (Entity ID from the IdP).',
          'Paste or upload the Public Certificate (Base64 encoded).',
          'Under Public Certificate, select the Signature Method and Digest Method matching your IdP.',
        ],
        verification: 'All fields (Sign-on URL, Issuer, Certificate, Signature/Digest Method) are populated in GitHub.',
        docLinks: [
          {
            title: 'Configuring SAML for EMU',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/managing-iam/configuring-authentication-for-enterprise-managed-users/configuring-saml-single-sign-on-for-enterprise-managed-users',
            description: 'Complete SAML configuration guide for EMU',
          },
        ],
      },
      {
        action: 'Click "Test SAML configuration" to validate the connection.',
        details: [
          'This test uses Service Provider initiated (SP-initiated) authentication.',
          'You must have at least one user assigned to the IdP application to test.',
        ],
        verification: 'The test completes successfully — you see a green "SAML SSO test successful" message.',
        docLinks: [
          {
            title: 'Configuring SAML SSO for EMU',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/managing-iam/configuring-authentication-for-enterprise-managed-users/configuring-saml-single-sign-on-for-enterprise-managed-users',
            description: 'Testing and enabling SAML SSO',
          },
        ],
      },
      {
        action: 'Click "Save SAML settings" to enable SAML SSO for the enterprise.',
        verification: 'The SAML SSO status shows "Enabled" in the Authentication security settings.',
        docLinks: [
          {
            title: 'Configuring SAML SSO for EMU',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/managing-iam/configuring-authentication-for-enterprise-managed-users/configuring-saml-single-sign-on-for-enterprise-managed-users',
            description: 'Enable SAML SSO for your enterprise',
          },
        ],
      },
      {
        action: 'Download the enterprise SSO recovery codes.',
        details: [
          'Click "Download", "Print", or "Copy" to save your recovery codes.',
          'Store recovery codes in a secure location (e.g., a password manager or vault).',
          'These codes allow access to the enterprise if your IdP is unavailable.',
        ],
        verification: 'Recovery codes are downloaded and stored securely.',
        docLinks: [{
          title: 'Downloading SSO recovery codes',
          url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/managing-iam/managing-recovery-codes-for-your-enterprise/downloading-your-enterprise-accounts-single-sign-on-recovery-codes',
          description: 'How to download and store SSO recovery codes',
        }],
      },
    ],
    notes: [
      'For Entra ID: use the "GitHub Enterprise Managed User" gallery application in Azure AD.',
      'For Okta: use the "GitHub Enterprise Managed User" OIN application.',
      'For PingFederate: follow the PingFederate-specific guide linked below.',
    ],
    warnings: [
      'Ensure the NameID format is "persistent" — transient NameIDs will cause user matching failures.',
    ],
    links: [
      {
        title: 'Configuring SAML for EMU',
        url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/managing-iam/configuring-authentication-for-enterprise-managed-users/configuring-saml-single-sign-on-for-enterprise-managed-users',
        description: 'Complete SAML configuration guide for EMU',
      },
      {
        title: 'Entra ID tutorial for EMU',
        url: 'https://learn.microsoft.com/en-us/entra/identity/saas-apps/github-enterprise-managed-user-tutorial',
        description: 'Microsoft docs: Entra ID + GitHub EMU integration',
      },
    ],
  },
  {
    id: 'nodr-scim',
    title: 'Configure SCIM Provisioning',
    shortTitle: 'SCIM',
    description:
      'Set up SCIM to automatically provision and deprovision managed user accounts from your IdP.',
    prerequisites: [
      'SAML SSO is fully configured and tested (previous step completed).',
      'An Entra ID user with at least the Cloud Application Administrator role to configure provisioning on the enterprise application.',
      'The setup user credentials to generate a Personal Access Token (PAT) on github.com.',
      'Entra ID groups created: "GitHub Enterprise Administrators" and "GitHub Copilot Business User".',
    ],
    substeps: [
      {
        action: 'Generate a personal access token (classic) for SCIM provisioning.',
        details: [
          'Sign in as the setup user to https://github.com.',
          'Go to Settings → Developer settings → Personal access tokens → Tokens (classic).',
          'Create a token with at least the "scim:enterprise" scope.',
          'The token must have no expiration — GitHub requires this for SCIM provisioning.',
          'Store the token securely and set a calendar reminder to rotate it periodically.',
        ],
        verification: 'The PAT is generated with scim:enterprise scope, no expiration, and copied to a secure location.',
        docLinks: [
          {
            title: 'Creating a personal access token',
            url: 'https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens',
            description: 'How to create and manage PATs',
          },
        ],
      },
      {
        action: 'Configure the SCIM endpoint in your IdP provisioning settings.',
        details: [
          'Entra ID: go to the Enterprise Application → Provisioning tab.',
          'Okta: go to the application → Provisioning → Settings → "To App".',
          'Set the Tenant URL / SCIM endpoint to: https://api.github.com/scim/v2/enterprises/YOUR-ENTERPRISE',
        ],
        verification: 'The SCIM Tenant URL is correctly populated in your IdP.',
        docLinks: [
          {
            title: 'Configuring SCIM for EMU',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/managing-iam/provisioning-user-accounts-with-scim/configuring-scim-provisioning-for-users',
            description: 'Complete SCIM provisioning guide',
          },
        ],
      },
      {
        action: 'Paste the personal access token as the Secret / Bearer Token in your IdP.',
        verification: 'The token field is populated (usually shows as masked).',
        docLinks: [
          {
            title: 'Configuring SCIM provisioning for EMU',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/managing-iam/provisioning-user-accounts-with-scim/configuring-scim-provisioning-for-users',
            description: 'SCIM token and provisioning setup',
          },
        ],
      },
      {
        action: 'Test the provisioning connection from your IdP.',
        details: [
          'Entra ID: click "Test Connection" in the Provisioning tab.',
          'Okta: click "Test API Credentials".',
        ],
        verification: 'The test shows a success message confirming the connection to the SCIM endpoint.',
        docLinks: [
          {
            title: 'Configuring SCIM provisioning for EMU',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/managing-iam/provisioning-user-accounts-with-scim/configuring-scim-provisioning-for-users',
            description: 'Testing the SCIM provisioning connection',
          },
        ],
      },
      {
        action: 'Configure attribute mappings for user provisioning.',
        details: [
          'Map userName → GitHub username (will get _SHORTCODE suffix).',
          'Map displayName → GitHub profile display name.',
          'Map emails → GitHub email address.',
          'Map externalId → unique identifier from your IdP.',
        ],
        verification: 'All four attributes (userName, displayName, emails, externalId) are mapped.',
        docLinks: [
          {
            title: 'Configuring SCIM provisioning for EMU',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/managing-iam/provisioning-user-accounts-with-scim/configuring-scim-provisioning-for-users',
            description: 'SCIM attribute mapping reference',
          },
        ],
      },
      {
        action: 'In Microsoft Entra ID, create the "GitHub Copilot Business User" security group.',
        details: [
          'Go to Azure Portal → Microsoft Entra ID → Groups → New group.',
          'Group type: Security.',
          'Group name: GitHub Copilot Business User.',
          'Group description: Members of this group will be provisioned as GitHub users and receive a Copilot Business seat.',
          'Add the users who need GitHub access and a Copilot license as members.',
        ],
        verification: 'The "GitHub Copilot Business User" group appears in Entra ID → Groups with the correct members.',
        docLinks: [
          {
            title: 'Create a group in Entra ID',
            url: 'https://learn.microsoft.com/en-us/entra/fundamentals/how-to-manage-groups',
            description: 'How to create and manage groups in Microsoft Entra ID',
          },
        ],
      },
      {
        action: 'In Microsoft Entra ID, create the "GitHub Enterprise Administrators" security group.',
        details: [
          'Go to Azure Portal → Microsoft Entra ID → Groups → New group.',
          'Group type: Security.',
          'Group name: GitHub Enterprise Administrators.',
          'Group description: Members of this group will be provisioned as GitHub Enterprise owners.',
          'Add only the users who need enterprise owner privileges.',
        ],
        verification: 'The "GitHub Enterprise Administrators" group appears in Entra ID → Groups with the correct members.',
        docLinks: [
          {
            title: 'Create a group in Entra ID',
            url: 'https://learn.microsoft.com/en-us/entra/fundamentals/how-to-manage-groups',
            description: 'How to create and manage Security groups in Microsoft Entra ID',
          },
        ],
      },
      {
        action: 'Assign both Entra groups to the GitHub EMU Enterprise Application.',
        details: [
          'Go to Azure Portal → Enterprise Applications → GitHub Enterprise Managed User.',
          'Click "Users and groups" → "Add user/group".',
          'Select "GitHub Copilot Business User" group → Assign.',
          'Repeat: select "GitHub Enterprise Administrators" group → Assign.',
          'For "GitHub Enterprise Administrators", set the role to "Enterprise Owner" if role-based assignment is available.',
        ],
        verification: 'Both groups appear in the Enterprise Application → Users and groups list with their assigned roles.',
        docLinks: [
          {
            title: 'Assign users and groups to an app',
            url: 'https://learn.microsoft.com/en-us/entra/identity/enterprise-apps/assign-user-or-group-access-portal',
            description: 'How to assign groups to an Enterprise Application',
          },
        ],
      },
      {
        action: 'Enable provisioning and wait for the initial sync cycle.',
        details: [
          'Entra ID: set Provisioning Status to "On" and click Save.',
          'The first cycle can take 20-40 minutes depending on user count.',
          'Both groups and their members will be provisioned to GitHub.',
        ],
        verification:
          'Navigate to your enterprise → People and confirm users from both groups appear with username_SHORTCODE handles.',
        docLinks: [
          {
            title: 'Managing team memberships with IdP groups',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/managing-iam/provisioning-user-accounts-with-scim/managing-team-memberships-with-identity-provider-groups',
            description: 'How IdP groups map to GitHub teams',
          },
        ],
      },
    ],
    warnings: [
      'The SCIM token has an expiration — set a reminder to rotate it.',
      'Deprovisioning a user in the IdP suspends them in GitHub but retains their data.',
    ],
    tips: [
      'Start with a small test group before assigning all users.',
      'The "GitHub Enterprise Administrators" Entra group maps to enterprise owners; the "GitHub Copilot Business User" group maps to regular users who receive Copilot seats.',
    ],
    links: [
      {
        title: 'Configuring SCIM for EMU',
        url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/managing-iam/provisioning-user-accounts-with-scim/configuring-scim-provisioning-for-users',
        description: 'Complete SCIM provisioning guide',
      },
      {
        title: 'Managing team memberships with IdP groups',
        url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/managing-iam/provisioning-user-accounts-with-scim/managing-team-memberships-with-identity-provider-groups',
        description: 'How IdP groups map to GitHub teams',
      },
    ],
  },
  {
    id: 'nodr-enterprise-teams',
    title: 'Create IdP Groups & Enterprise Teams',
    shortTitle: 'Teams & Groups',
    description:
      'Create groups in your Identity Provider and connect them to GitHub Enterprise teams via SCIM. Groups provisioned through SCIM automatically become teams inside your organizations. You can also create enterprise-level teams and sync them with IdP groups for centralized license and role management.',
    prerequisites: [
      'SCIM provisioning is configured and active (previous step completed).',
      'At least one test user has been successfully provisioned via SCIM.',
      'Organization(s) have been planned or already exist in the enterprise.',
    ],
    substeps: [
      {
        action: 'Plan your group and team structure.',
        details: [
          'Decide which IdP groups will map to GitHub teams (e.g., by department, project, or role).',
          'Each IdP group will become a GitHub team inside an organization.',
          'Common groups: "Developers", "DevOps", "Security", "Copilot Users", "Enterprise Admins".',
          'Consider a naming convention — GitHub recommends prefixing groups with "GitHub-" for clarity (e.g., "GitHub-Developers", "GitHub-Copilot-Users").',
          'Plan which organization(s) each team should belong to — a group can be mapped to teams in multiple organizations if needed.',
        ],
        verification: 'You have a documented list of IdP groups, their intended GitHub team names, and target organizations.',
        docLinks: [
          {
            title: 'About teams',
            url: 'https://docs.github.com/en/organizations/organizing-members-into-teams/about-teams',
            description: 'Overview of how teams work in GitHub organizations',
          },
        ],
      },
      {
        action: 'Create the required groups in your Identity Provider.',
        details: [
          'In your IdP admin console, create the groups you planned.',
          'For Microsoft Entra ID: Go to Groups → New group. Choose the group type — use "Security" groups for access control (recommended for GitHub team sync). "Microsoft 365" groups add email/calendar features that are unnecessary for GitHub.',
          'For Entra ID — Dynamic membership: You can use dynamic membership rules to auto-assign users based on attributes (e.g., department = "Engineering", jobTitle contains "Developer"). This automates group membership as users change roles.',
          'For Entra ID — Assigned membership: Manually add users to the group. Best for small or stable teams.',
          'For Okta: Go to Directory → Groups → Add Group.',
          'Add the appropriate users to each group.',
        ],
        verification: 'All planned groups exist in your IdP and have the correct members assigned.',
        docLinks: [
          {
            title: 'Managing team memberships with IdP groups',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/managing-iam/provisioning-user-accounts-with-scim/managing-team-memberships-with-identity-provider-groups',
            description: 'How to connect IdP groups to GitHub teams',
          },
          {
            title: 'Entra ID dynamic group membership rules',
            url: 'https://learn.microsoft.com/en-us/entra/identity/users/groups-dynamic-membership',
            description: 'How to create dynamic membership rules for Entra ID groups',
          },
        ],
      },
      {
        action: 'Assign the IdP groups to the GitHub Enterprise Application in your IdP.',
        details: [
          'For Entra ID: Go to Enterprise Applications → your GitHub EMU app → Users and groups → Add user/group. Select each group and assign it.',
          'For Entra ID — Important: when assigning a group, you may be asked to select a role. Choose the appropriate role (e.g., "Enterprise Owner", "Organization Member", "Organization Owner") based on the group\'s purpose.',
          'For Okta: Go to Applications → your GitHub EMU app → Assignments → Assign → Assign to Groups.',
          'This tells SCIM to provision these groups as teams in GitHub.',
          'Only groups assigned to the Enterprise Application will be synced — unassigned groups are ignored by SCIM.',
        ],
        verification: 'All groups appear in the "Users and groups" (Entra) or "Assignments" (Okta) list of the Enterprise Application.',
        docLinks: [
          {
            title: 'Assign users and groups to an app',
            url: 'https://learn.microsoft.com/en-us/entra/identity/enterprise-apps/assign-user-or-group-access-portal',
            description: 'How to assign IdP groups to the GitHub Enterprise Application',
          },
        ],
      },
      {
        action: 'Configure attribute mappings for group provisioning (Entra ID).',
        details: [
          'Go to Enterprise Applications → your GitHub EMU app → Provisioning → Mappings → Provision Azure Active Directory Groups.',
          'Verify the attribute mappings: displayName → displayName, members → members, externalId → externalId.',
          'Ensure "Enabled" is set to Yes for group provisioning.',
          'For Okta: Group push mappings are configured in the Push Groups settings of the application.',
          'Attribute mappings control how group names and memberships are synced — incorrect mappings can cause sync failures.',
        ],
        verification: 'Group attribute mappings are correctly configured and group provisioning is enabled.',
        docLinks: [
          {
            title: 'Configuring SCIM provisioning for EMU',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/managing-iam/provisioning-user-accounts-with-scim/configuring-scim-provisioning-for-users',
            description: 'SCIM attribute mapping for users and groups',
          },
        ],
      },
      {
        action: 'Configure provisioning scope (Entra ID).',
        details: [
          'Go to Enterprise Applications → your GitHub EMU app → Provisioning → Settings.',
          'Set "Scope" to "Sync only assigned users and groups" (recommended) — this ensures only explicitly assigned groups and users are provisioned to GitHub.',
          'Alternative: "Sync all users and groups" provisions everyone in Entra ID — use this only if every user should have GitHub access.',
          'Under "Mappings", ensure both user and group provisioning are enabled.',
        ],
        verification: 'Provisioning scope is set to "Sync only assigned users and groups" and both user/group mappings are enabled.',
        docLinks: [
          {
            title: 'Configuring SCIM provisioning for EMU',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/managing-iam/provisioning-user-accounts-with-scim/configuring-scim-provisioning-for-users',
            description: 'SCIM provisioning scope and settings',
          },
        ],
      },
      {
        action: 'Trigger a SCIM provisioning cycle to sync the groups.',
        details: [
          'For Entra ID: Go to Enterprise Applications → your GitHub EMU app → Provisioning → Provision on demand, or wait for the automatic cycle (up to 40 minutes).',
          'For Entra ID — Provision on demand: select a specific group to provision immediately. This is useful for testing individual group sync.',
          'For Entra ID — Full sync: click "Restart provisioning" to trigger a full sync cycle. This provisions all assigned users and groups.',
          'For Okta: Go to Applications → your GitHub EMU app → Provisioning → Push Groups → select the groups to push.',
          'Monitor the provisioning logs for any errors.',
        ],
        verification: 'The SCIM provisioning log shows successful group sync events with no errors.',
        docLinks: [
          {
            title: 'Troubleshooting team membership with identity provider groups',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/managing-iam/provisioning-user-accounts-with-scim/configuring-scim-provisioning-for-users',
            description: 'Troubleshooting team membership sync with your identity provider',
          },
        ],
      },
      {
        action: 'Verify the teams were created in GitHub.',
        details: [
          'Navigate to https://github.com/enterprises/YOUR-ENTERPRISE → select an organization → Teams.',
          'Each IdP group should appear as a team with synced membership.',
          'Team names are derived from the IdP group names.',
          'Members of the IdP group should automatically appear as team members.',
          'Check that the team shows the "Synced" badge, indicating it is managed by SCIM.',
        ],
        verification: 'All expected teams exist in your GitHub organizations with the correct synced members and the "Synced" badge.',
        docLinks: [
          {
            title: 'Managing team memberships with IdP groups',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/managing-iam/provisioning-user-accounts-with-scim/managing-team-memberships-with-identity-provider-groups',
            description: 'Verifying IdP group to GitHub team synchronization',
          },
        ],
      },
      {
        action: 'Assign repository access to teams.',
        details: [
          'Go to each repository → Settings → Collaborators and teams → Add teams.',
          'Select the appropriate team and set the permission level (Read, Write, Maintain, Admin).',
          'Use "Read" for viewers, "Write" for contributors, "Maintain" for team leads, "Admin" for repo owners.',
        ],
        verification: 'Team members can access the assigned repositories with the correct permissions.',
        docLinks: [
          {
            title: 'Managing team access to repositories',
            url: 'https://docs.github.com/en/organizations/managing-user-access-to-your-organizations-repositories/managing-repository-roles/managing-team-access-to-an-organization-repository',
            description: 'How to grant teams access to repositories',
          },
        ],
      },
      {
        action: 'Test group membership changes (add/remove a user).',
        details: [
          'Add a test user to an IdP group and wait for the next SCIM sync cycle (or trigger a manual sync).',
          'Verify the user appears as a member of the corresponding GitHub team.',
          'Remove the test user from the IdP group and wait for the next SCIM sync cycle.',
          'Verify the user is removed from the GitHub team.',
          'For Entra ID: provisioning cycles run every 20–40 minutes. Use "Provision on demand" for immediate testing.',
          'For Okta: group membership changes are pushed on the next push cycle or can be triggered manually.',
        ],
        verification: 'Adding a user to the IdP group adds them to the GitHub team; removing them from the IdP group removes them from the GitHub team.',
        docLinks: [
          {
            title: 'Managing team memberships with IdP groups',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/managing-iam/provisioning-user-accounts-with-scim/managing-team-memberships-with-identity-provider-groups',
            description: 'How IdP group membership changes propagate to GitHub teams',
          },
        ],
      },
      {
        action: 'Troubleshoot sync issues (if any).',
        details: [
          'For Entra ID: Go to Enterprise Applications → your EMU app → Provisioning → Provisioning logs. Look for errors related to group operations (Create Group, Update Group, Add Member).',
          'Common errors: "Group already exists" (duplicate group name), "User not found" (user not yet provisioned), "Attribute value is invalid" (check attribute mappings).',
          'For Entra ID: check the "Insights" tab for a summary of successful vs. failed operations.',
          'For Okta: check the Push Groups log for failed pushes. Common issue: group name conflicts.',
          'If a team does not appear in GitHub, verify: 1) the group is assigned to the Enterprise Application, 2) group provisioning is enabled in attribute mappings, 3) no provisioning errors in the logs.',
        ],
        verification: 'All provisioning errors are resolved and all expected groups are synced to GitHub as teams.',
        docLinks: [
          {
            title: 'Troubleshooting team membership with identity provider groups',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/managing-iam/provisioning-user-accounts-with-scim/troubleshooting-team-membership-with-identity-provider-groups',
            description: 'Troubleshooting team membership sync with your identity provider',
          },
          {
            title: 'Entra ID provisioning logs',
            url: 'https://learn.microsoft.com/en-us/entra/identity/app-provisioning/check-status-user-account-provisioning',
            description: 'How to review Entra ID provisioning logs',
          },
        ],
      },
      {
        action: 'Create enterprise teams and sync with IdP groups (optional).',
        details: [
          'Enterprise teams are a newer feature (public preview) that lets you manage users at the enterprise level, independent of organizations.',
          'Enterprise teams can receive Copilot licenses directly, be assigned enterprise roles, and be added to organizations.',
          'Navigate to your enterprise → People → Enterprise teams → New enterprise team.',
          'Enter a team name, optional description, and select which organizations the team should have access to.',
          'Add members manually or sync with an IdP group.',
          'To sync with an IdP group: click the team name → Edit (pencil icon) → under "Manage members" select "Identity provider group" → choose the external IdP group → click "Update team".',
          'Important: before enabling IdP sync, remove any manually assigned users from the team — a team can be either manual or IdP-synced, not both.',
          'Once synced, any changes to the IdP group (adding/removing users) will automatically propagate to the enterprise team via SCIM.',
          'You can assign Copilot licenses to the enterprise team via Enterprise → Settings → Copilot → assign to team.',
          'You can assign predefined or custom enterprise roles to the team for delegated administration.',
        ],
        verification: 'Enterprise team is created, synced with the IdP group, and members reflect the IdP group membership.',
        docLinks: [
          {
            title: 'Creating enterprise teams',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/managing-accounts-and-repositories/managing-users-in-your-enterprise/create-enterprise-teams',
            description: 'Step-by-step guide to creating and managing enterprise teams',
          },
          {
            title: 'Syncing enterprise teams with an IdP group',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/managing-accounts-and-repositories/managing-users-in-your-enterprise/create-enterprise-teams#syncing-with-an-idp-group',
            description: 'Sync enterprise team membership with your identity provider',
          },
        ],
      },
    ],
    warnings: [
      'Team membership in EMU is managed exclusively via SCIM from your IdP — you cannot manually add or remove members from synced teams in GitHub.',
      'Removing a user from an IdP group will remove them from the corresponding GitHub team on the next SCIM cycle.',
      'For Entra ID: use "Security" group type, not "Microsoft 365". M365 groups add unnecessary overhead (mailbox, calendar) and may cause provisioning issues.',
      'If you rename an IdP group after it has been synced, the corresponding GitHub team will also be renamed on the next SCIM cycle — this may break references to the old team name in code or configurations.',
      'Enterprise teams have limits: max 2,500 teams per enterprise, max 5,000 users per team, max 1,000 organizations per team.',
      'If an IdP group exceeds 5,000 users, syncing will stop until the group size is reduced back to the limit.',
    ],
    tips: [
      'Start with a small number of groups and expand as needed.',
      'Use a consistent naming convention (e.g., "GitHub-TeamName") to easily identify GitHub-related groups in your IdP.',
      'You can nest teams in GitHub for hierarchical access control after the initial sync.',
      'For Entra ID: you can use dynamic membership rules on Security groups to auto-assign users based on attributes (e.g., department, job title).',
      'Use "Provision on demand" in Entra ID to test individual group/user provisioning before running a full sync.',
      'Review the provisioning logs regularly during initial setup — errors are common with attribute mapping misconfigurations.',
      'Use enterprise teams to assign Copilot licenses and enterprise roles centrally, independent of organization membership.',
    ],
    links: [
      {
        title: 'Managing team memberships with IdP groups',
        url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/managing-iam/provisioning-user-accounts-with-scim/managing-team-memberships-with-identity-provider-groups',
        description: 'How IdP groups map to GitHub teams via SCIM',
      },
      {
        title: 'Creating enterprise teams',
        url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/managing-accounts-and-repositories/managing-users-in-your-enterprise/create-enterprise-teams',
        description: 'Create enterprise-level teams for license and role management',
      },
      {
        title: 'Syncing enterprise teams with an IdP group',
        url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/managing-accounts-and-repositories/managing-users-in-your-enterprise/create-enterprise-teams#syncing-with-an-idp-group',
        description: 'Sync enterprise team membership with your identity provider',
      },
      {
        title: 'About teams',
        url: 'https://docs.github.com/en/organizations/organizing-members-into-teams/about-teams',
        description: 'Overview of how teams work in GitHub organizations',
      },
    ],
  },
  {
    id: 'nodr-orgs',
    title: 'Create Organizations & Repositories',
    shortTitle: 'Orgs & Repos',
    description:
      'Set up organizations, repositories, and team structures within your enterprise.',
    prerequisites: [
      'SCIM provisioning is active and at least one test user has been provisioned (previous step completed).',
      'Enterprise owner access on github.com (setup user or a provisioned enterprise owner).',
      'A plan for organization names and team structure (e.g., by department, product, or project).',
    ],
    substeps: [
      {
        action: 'Navigate to your enterprise and create organizations.',
        details: [
          'Go to https://github.com/enterprises/YOUR-ENTERPRISE → Organizations.',
          'Click "New organization" and name it (e.g., by department or product team).',
        ],
        verification: 'Each planned organization appears in the Enterprise → Organizations list.',
        docLinks: [
          {
            title: 'Managing organizations',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/managing-accounts-and-repositories/managing-organizations-in-your-enterprise',
            description: 'How to manage organizations in your enterprise',
          },
        ],
      },
      {
        action: 'Set repository visibility policies at the enterprise level.',
        details: [
          'Go to Enterprise settings → Policies → Repositories.',
          'Choose which visibility types are allowed: private, internal, or public.',
          '"Internal" allows all enterprise members to see the repo.',
        ],
        verification: 'The repository visibility policy is set, and trying to create a repo shows only allowed types.',
        docLinks: [
          {
            title: 'Repository policies for enterprises',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/enforcing-policies/enforcing-policies-for-your-enterprise/enforcing-repository-management-policies-in-your-enterprise',
            description: 'Enforce repository policies across your enterprise',
          },
        ],
      },
      {
        action: 'Create the "GitHub Copilot Business User" team and connect it to the Entra group.',
        details: [
          'In your organization, go to Teams → New team.',
          'Team name: GitHub Copilot Business User.',
          'Connect the team to the "GitHub Copilot Business User" Entra security group.',
          'Members of the Entra group will be automatically synced to this GitHub team.',
          'This team will be used to assign Copilot Business seats.',
        ],
        verification: 'The "GitHub Copilot Business User" team appears in the organization with synced members matching the Entra group.',
        docLinks: [
          {
            title: 'Managing team memberships with IdP groups',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/managing-iam/provisioning-user-accounts-with-scim/managing-team-memberships-with-identity-provider-groups',
            description: 'How to connect IdP groups to GitHub teams',
          },
        ],
      },
      {
        action: 'Create the "GitHub Enterprise Administrators" team and connect it to the Entra group.',
        details: [
          'In your organization, go to Teams → New team.',
          'Team name: GitHub Enterprise Administrators.',
          'Connect the team to the "GitHub Enterprise Administrators" Entra security group.',
          'Members will have enterprise owner privileges and can manage enterprise settings.',
        ],
        verification: 'The "GitHub Enterprise Administrators" team appears in the organization with synced members matching the Entra group.',
        docLinks: [
          {
            title: 'Managing team memberships with IdP groups',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/managing-iam/provisioning-user-accounts-with-scim/managing-team-memberships-with-identity-provider-groups',
            description: 'Connect IdP groups to GitHub teams',
          },
        ],
      },
      {
        action: 'Create initial repositories within organizations.',
        details: [
          'Navigate into an organization and click "New repository".',
          'Set the visibility according to your enterprise policy.',
          'Add teams with appropriate permissions (Read, Write, Maintain, Admin).',
        ],
        verification: 'Repositories are created and accessible by the correct teams with the right permission level.',
        docLinks: [
          {
            title: 'Creating a new repository',
            url: 'https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-new-repository',
            description: 'How to create repositories in your organization',
          },
        ],
      },
    ],
    links: [
      {
        title: 'Managing organizations',
        url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/managing-accounts-and-repositories/managing-organizations-in-your-enterprise',
        description: 'How to manage organizations in your enterprise',
      },
    ],
  },
  {
    id: 'nodr-policies',
    title: 'Configure Enterprise Policies',
    shortTitle: 'Policies',
    description:
      'Set enterprise-level policies for security, access, and compliance. Apply the principle of least privilege and enforce consistent governance across all organizations.',
    prerequisites: [
      'Enterprise owner access on github.com.',
      'At least one organization has been created (previous step completed).',
      'If configuring IP allow lists: a list of your corporate CIDR ranges / VPN exit IPs.',
      'If configuring audit log streaming: access to your SIEM or log destination (Azure Event Hubs, S3, Splunk, Datadog).',
    ],
    substeps: [
      {
        action: 'Configure repository creation policies.',
        details: [
          'Go to Enterprise Settings \u2192 Policies \u2192 Repositories.',
          'Choose who can create repos: all members, owners only, or disabled.',
          'Best practice: restrict to "Owners only" or specific roles to prevent sprawl.',
          'Set allowed repository visibility types: private and internal only (disable public for EMU enterprises).',
          'Configure repository forking policy: disable forking or restrict to internal forks only.',
        ],
        verification: 'Try creating a repo as a non-owner to confirm the policy is enforced.',
        docLinks: [
          {
            title: 'Enforcing repository policies',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/enforcing-policies/enforcing-policies-for-your-enterprise/enforcing-repository-management-policies-in-your-enterprise',
            description: 'Repository creation, forking, and visibility policies',
          },
        ],
      },
      {
        action: 'Set base permissions for organization members.',
        details: [
          'Go to each organization \u2192 Settings \u2192 Member privileges.',
          'Set the base permission to "No permission" (recommended) \u2014 grant access explicitly via teams.',
          'This follows the principle of least privilege and prevents accidental access to repositories.',
          'Review and set: who can create teams, who can create repositories within the org.',
        ],
        verification: 'A test member with no team assignment has no repository access.',
        docLinks: [
          {
            title: 'Setting base permissions for an organization',
            url: 'https://docs.github.com/en/organizations/managing-user-access-to-your-organizations-repositories/managing-repository-roles/setting-base-permissions-for-an-organization',
            description: 'How to set default permissions for organization members',
          },
        ],
      },
      {
        action: 'Configure branch protection and rulesets.',
        details: [
          'Go to each organization \u2192 Settings \u2192 Repository \u2192 Rulesets (recommended) or branch protection rules.',
          'Create rulesets for default branches (main/master): require pull request reviews, require status checks, restrict force pushes, restrict deletions.',
          'Best practice: require at least 1 code review approval before merging.',
          'Best practice: require conversation resolution and up-to-date branches before merge.',
          'For enterprise-wide rules, use Enterprise settings \u2192 Repository \u2192 Rulesets to push rules to all orgs.',
          'Consider requiring signed commits for sensitive repositories.',
        ],
        verification: 'Try pushing directly to a protected branch \u2014 it should be rejected.',
        docLinks: [
          {
            title: 'About rulesets',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets',
            description: 'Modern branch and tag protection with rulesets',
          },
          {
            title: 'Managing rulesets for an organization',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/organizations/managing-organization-settings/managing-rulesets-for-repositories-in-your-organization',
            description: 'Organization-level rulesets for consistent branch protection',
          },
        ],
      },
      {
        action: 'Configure personal access token (PAT) policies.',
        details: [
          'Go to Enterprise settings \u2192 Policies \u2192 Personal access tokens.',
          'Best practice: restrict classic PATs \u2014 allow only fine-grained tokens.',
          'Fine-grained tokens are scoped to specific repositories and have expiration dates, improving security.',
          'Require admin approval for fine-grained token access to organizations.',
          'Set maximum token lifetime to enforce regular rotation.',
        ],
        verification: 'Try creating a classic PAT and confirm it cannot access enterprise resources if restricted.',
        docLinks: [
          {
            title: 'Enforcing policies for PATs',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/enforcing-policies/enforcing-policies-for-your-enterprise/enforcing-policies-for-personal-access-tokens-in-your-enterprise',
            description: 'Control PAT usage and enforce fine-grained tokens',
          },
        ],
      },
      {
        action: 'Configure IP allow lists if required.',
        details: [
          'Go to Enterprise settings \u2192 Settings \u2192 Authentication security \u2192 IP allow list.',
          'Add your corporate CIDR ranges and enable enforcement.',
          'Important: also add IP ranges for CI/CD runners and any third-party integrations that need API access.',
          'Test thoroughly before enforcement \u2014 blocking legitimate IPs can lock out users.',
        ],
        verification: 'Accessing github.com enterprise from outside the allowed IP ranges is blocked.',
        docLinks: [
          {
            title: 'Managing allowed IP addresses',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/enforcing-policies/enforcing-policies-for-your-enterprise/enforcing-policies-for-security-settings-in-your-enterprise#managing-allowed-ip-addresses-for-organizations-in-your-enterprise',
            description: 'How to configure IP allow lists',
          },
        ],
      },
      {
        action: 'Configure GitHub Actions policies.',
        details: [
          'Go to Enterprise settings \u2192 Policies \u2192 Actions.',
          'Best practice: restrict to "Allow select actions" and allow only verified or enterprise-owned actions.',
          'Add trusted action patterns: "actions/*", "github/*", and your organization\'s internal actions.',
          'Configure runner groups to control which organizations can use which runners.',
          'Set default workflow permissions to "Read repository contents" (principle of least privilege).',
        ],
        verification: 'Create a test workflow using a non-allowed action and confirm it is blocked.',
        docLinks: [
          {
            title: 'Enforcing GitHub Actions policies',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/enforcing-policies/enforcing-policies-for-your-enterprise/enforcing-policies-for-github-actions-in-your-enterprise',
            description: 'Actions policies for enterprises',
          },
        ],
      },
      {
        action: 'Enable and configure security features: secret scanning, Dependabot, and code scanning.',
        details: [
          'Go to Enterprise settings \u2192 Settings \u2192 Code security and analysis.',
          'Enable: Dependency graph, Dependabot alerts, Dependabot security updates.',
          'Enable: Secret scanning, Secret scanning push protection (blocks commits with detected secrets).',
          'Enable: Code scanning default setup (CodeQL) for automatic vulnerability detection.',
          'Best practice: enable "Automatically enable for new repositories" for all security features.',
          'Consider enabling security advisories for private vulnerability reporting.',
        ],
        verification: 'Navigate to a repository\'s Security tab and confirm all features are active.',
        docLinks: [
          {
            title: 'GitHub security features',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/code-security/getting-started/github-security-features',
            description: 'Overview of all available security features',
          },
          {
            title: 'Configuring secret scanning',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/code-security/secret-scanning/introduction/about-secret-scanning',
            description: 'Secret scanning and push protection configuration',
          },
        ],
      },
      {
        action: 'Configure outside collaborator and fork policies (EMU-specific).',
        details: [
          'Note: EMU enterprises restrict outside collaborators by default \u2014 only managed users can be members.',
          'Go to Enterprise Settings \u2192 Policies \u2192 Repositories \u2192 Fork policy.',
          'Since EMU users cannot fork to personal accounts, ensure forking is restricted to within the enterprise only.',
          'Review the deploy key policy: restrict deploy keys at the enterprise level if not needed.',
        ],
        verification: 'Confirm that only managed users appear in organization membership. Verify fork and deploy key restrictions are enforced.',
        docLinks: [
          {
            title: 'EMU abilities and restrictions',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/managing-iam/understanding-iam-for-enterprises/abilities-and-restrictions-of-managed-user-accounts',
            description: 'What managed users can and cannot do',
          },
        ],
      },
      {
        action: 'Set up audit log streaming if required.',
        details: [
          'Go to Enterprise settings \u2192 Settings \u2192 Audit log.',
          'Click "Set up a stream" and choose your target (Azure Event Hubs, S3, Splunk, Datadog, Google Cloud Storage).',
          'Configure the streaming endpoint and authentication.',
          'Best practice: stream to at least one destination for compliance and incident response.',
        ],
        verification: 'Perform a test action and confirm the event appears in your SIEM within minutes.',
        docLinks: [
          {
            title: 'Streaming the audit log',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/monitoring-activity-in-your-enterprise/reviewing-audit-logs-for-your-enterprise/streaming-the-audit-log-for-your-enterprise',
            description: 'How to configure audit log streaming',
          },
        ],
      },
    ],
    tips: [
      'Use rulesets instead of legacy branch protection rules \u2014 they support enterprise-wide enforcement and are more flexible.',
      'Regularly review the audit log to detect policy violations and unusual activity.',
      'Start with restrictive policies and relax them as needed, rather than starting permissive.',
    ],
    links: [
      {
        title: 'Enforcing policies for your enterprise',
        url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/enforcing-policies/enforcing-policies-for-your-enterprise',
        description: 'Full reference for enterprise policies',
      },
      {
        title: 'About rulesets',
        url: 'https://docs.github.com/en/enterprise-cloud@latest/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets',
        description: 'Modern, enterprise-wide branch protection',
      },
    ],
  },
  {
    id: 'nodr-copilot-enable',
    title: 'Step 1 — Enable Copilot on the Enterprise',
    shortTitle: 'Enable Copilot',
    description:
      'Turn on GitHub Copilot at the enterprise level and select the plan.',
    prerequisites: [
      'Enterprise owner access on github.com.',
      'A GitHub Copilot Business or Enterprise license purchased — verify in your GitHub billing settings or Azure subscription.',
      'If billing through Azure: an active Azure subscription linked to the GitHub enterprise for Copilot seat billing.',
    ],
    substeps: [
      {
        action: 'Sign in to https://github.com with an enterprise owner account.',
        verification: 'You are on the GitHub dashboard.',
        docLinks: [
          {
            title: 'Managing your enterprise account',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/managing-your-enterprise-account',
            description: 'How to access and manage your enterprise',
          },
        ],
      },
      {
        action: 'Navigate to the Copilot policy settings.',
        details: [
          'Go to https://github.com/enterprises/YOUR-ENTERPRISE → Settings → Policies → Copilot.',
        ],
        verification: 'The Copilot policies page loads with access configuration options.',
        docLinks: [
          {
            title: 'Enforcing Copilot policies',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/enforcing-policies/enforcing-policies-for-your-enterprise/enforcing-policies-for-github-copilot-in-your-enterprise',
            description: 'Official docs for Copilot enterprise policies',
          },
        ],
      },
      {
        action: 'Set the Copilot access policy.',
        details: [
          'Choose "Enabled for all organizations" or "Enabled for specific organizations".',
          'If choosing specific, select the organizations that should have Copilot access.',
        ],
        verification: 'The access policy shows as either "Enabled" or lists the selected organizations.',
        docLinks: [
          {
            title: 'Enforcing Copilot policies',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/enforcing-policies/enforcing-policies-for-your-enterprise/enforcing-policies-for-github-copilot-in-your-enterprise',
            description: 'Configure Copilot access policies',
          },
        ],
      },
      {
        action: 'The default Copilot plan at the enterprise level is GitHub Copilot Business.',
        details: [
          'Copilot Business ($19/user/month): code completion, chat in IDE, chat on the web. This is the default plan for all organizations in the enterprise.',
          'Copilot Enterprise ($39/user/month): adds PR summaries, knowledge bases, docset indexing, and code review on top of Business.',
          'Important: Copilot Enterprise CANNOT be assigned at the enterprise level — it must be assigned per organization.',
          'To use Copilot Enterprise: create a dedicated organization, navigate to that organization\'s Copilot settings, and change the plan from Business to Enterprise.',
          'Users assigned to an organization with Copilot Enterprise may also incur a GitHub Enterprise license cost for that organization.',
        ],
        verification: 'The enterprise-level plan shows "Copilot Business" as the default. If Enterprise is needed, verify the target organization has its plan set to Enterprise.',
        docLinks: [
          {
            title: 'About GitHub Copilot plans',
            url: 'https://docs.github.com/en/copilot/get-started/plans',
            description: 'Compare Copilot Business vs Enterprise features',
          },
        ],
      },
      {
        action: '(Optional) Set up Copilot Enterprise for a specific organization.',
        details: [
          'If you need Copilot Enterprise features (PR summaries, knowledge bases, code review), you must configure it at the organization level.',
          'Create a new organization (or use an existing one) within the enterprise.',
          'Navigate to the organization → Settings → Copilot → change the plan from "Business" to "Enterprise".',
          'Assign users or teams to this organization who need Copilot Enterprise features.',
          'Note: each user added to this organization may consume an additional GitHub Enterprise license seat — plan for this cost.',
          'Users in other organizations will continue using Copilot Business at $19/user/month.',
        ],
        verification: 'The organization\'s Copilot settings show "Enterprise" as the active plan. Test users in that org can access Enterprise features (e.g., PR summaries).',
        docLinks: [
          {
            title: 'About GitHub Copilot plans',
            url: 'https://docs.github.com/en/copilot/get-started/plans',
            description: 'Compare Copilot Business vs Enterprise features',
          },
          {
            title: 'Managing Copilot for your organization',
            url: 'https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-organization/manage-plan',
            description: 'How to change the Copilot plan at the organization level',
          },
        ],
      },
    ],
    notes: [
      'The default plan at the enterprise level is Copilot Business. Copilot Enterprise must be configured per organization.',
      'Currently, upgrading to Copilot Enterprise requires creating an organization and assigning the Enterprise plan to it — this may also incur additional GitHub Enterprise license costs for users in that organization.',
    ],
    links: [
      {
        title: 'Enforcing Copilot policies in your enterprise',
        url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/enforcing-policies/enforcing-policies-for-your-enterprise/enforcing-policies-for-github-copilot-in-your-enterprise',
        description: 'Official docs for enabling Copilot at the enterprise level',
      },
      {
        title: 'Managing Copilot for your organization',
        url: 'https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-organization/manage-plan',
        description: 'Organization-level Copilot plan management',
      },
    ],
  },
  {
    id: 'nodr-copilot-policies',
    title: 'Step 2 — Configure Copilot Policies',
    shortTitle: 'Copilot Policies',
    description:
      'Set enterprise-wide policies that control how Copilot behaves for all users.',
    prerequisites: [
      'Copilot is enabled at the enterprise level (previous step completed).',
      'Enterprise owner access on github.com.',
    ],
    substeps: [
      {
        action: 'Configure the "Suggestions matching public code" policy.',
        details: [
          'In Enterprise settings → Policies → Copilot.',
          'Choose to allow or block suggestions that match publicly available code.',
        ],
        verification: 'The policy value (Allow/Block) is saved and shows the correct setting.',
        docLinks: [
          {
            title: 'Copilot policies reference',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/enforcing-policies/enforcing-policies-for-your-enterprise/enforcing-policies-for-github-copilot-in-your-enterprise',
            description: 'All available Copilot policies',
          },
        ],
      },
      {
        action: 'Configure Copilot Chat in IDEs policy.',
        details: ['Enable or disable Copilot Chat for IDE users enterprise-wide.'],
        verification: 'The Chat in IDEs policy shows the correct enabled/disabled state.',
        docLinks: [
          {
            title: 'Enforcing Copilot policies',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/enforcing-policies/enforcing-policies-for-your-enterprise/enforcing-policies-for-github-copilot-in-your-enterprise',
            description: 'Configure Copilot Chat in IDEs policy',
          },
        ],
      },
      {
        action: 'Configure Copilot Chat on github.com policy.',
        details: ['Enable or disable Copilot Chat on the github.com web interface.'],
        verification: 'The Chat on web policy shows the correct enabled/disabled state.',
        docLinks: [
          {
            title: 'Enforcing Copilot policies',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/enforcing-policies/enforcing-policies-for-your-enterprise/enforcing-policies-for-github-copilot-in-your-enterprise',
            description: 'Configure Copilot Chat on web policy',
          },
        ],
      },
      {
        action: 'Configure Copilot pull request summaries (Enterprise plan only).',
        details: ['Enable or disable AI-generated pull request summaries.'],
        verification: 'The PR summaries policy is set. If enabled, create a test PR to verify summaries appear.',
        docLinks: [
          {
            title: 'Enforcing Copilot policies',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/enforcing-policies/enforcing-policies-for-your-enterprise/enforcing-policies-for-github-copilot-in-your-enterprise',
            description: 'Configure Copilot pull request summaries policy',
          },
        ],
      },
      {
        action: 'Configure content exclusion rules if needed.',
        details: [
          'Exclude specific repositories or file paths from Copilot suggestions.',
          'Add patterns like "*.env", "secrets/**", or specific repo names.',
        ],
        verification: 'Open one of the excluded file patterns in an IDE — Copilot should not provide suggestions.',
        docLinks: [
          {
            title: 'Copilot content exclusion',
            url: 'https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-organization/manage-plan',
            description: 'How to exclude files or repos from Copilot',
          },
        ],
      },
    ],
    links: [
      {
        title: 'Copilot content exclusion',
        url: 'https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-organization/manage-plan',
        description: 'How to exclude files or repos from Copilot suggestions',
      },
    ],
  },
  {
    id: 'nodr-copilot-models',
    title: 'Step 3 — Configure Copilot Models',
    shortTitle: 'Copilot Models',
    description:
      'Choose which AI models are available for Copilot users in your enterprise. You can enable or disable specific models and control which ones are offered by default.',
    prerequisites: [
      'Copilot is enabled at the enterprise level (previous steps completed).',
      'Enterprise owner access on github.com.',
    ],
    substeps: [
      {
        action: 'Navigate to the Copilot models settings page.',
        details: [
          'Go to https://github.com/enterprises/YOUR-ENTERPRISE/settings/copilot/models.',
        ],
        verification: 'The Copilot models configuration page loads and lists available AI models.',
        docLinks: [
          {
            title: 'Managing Copilot policies',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/enforcing-policies/enforcing-policies-for-your-enterprise/enforcing-policies-for-github-copilot-in-your-enterprise',
            description: 'Enterprise Copilot policy management',
          },
        ],
      },
      {
        action: 'Review the list of available AI models.',
        details: [
          'GitHub Copilot supports multiple AI models (e.g., GPT-4o, Claude, Gemini, and others).',
          'Each model has different capabilities, latency, and cost characteristics.',
          'Some models may consume premium requests depending on your plan.',
        ],
        verification: 'You can see the full list of models with their descriptions and availability status.',
        docLinks: [
          {
            title: 'About GitHub Copilot models',
            url: 'https://docs.github.com/en/copilot/how-tos/use-ai-models/change-the-chat-model',
            description: 'Learn about the AI models available for Copilot',
          },
        ],
      },
      {
        action: 'Enable or disable specific models for your enterprise.',
        details: [
          'Toggle each model on or off based on your organization\'s requirements.',
          'Consider enabling only approved models to control cost and comply with internal policies.',
          'Disabling a model prevents all users in the enterprise from selecting it.',
        ],
        verification: 'Only the desired models show as enabled. Disabled models are grayed out or hidden from users.',
        docLinks: [
          {
            title: 'Managing Copilot policies',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/enforcing-policies/enforcing-policies-for-your-enterprise/enforcing-policies-for-github-copilot-in-your-enterprise',
            description: 'Configure Copilot model policies',
          },
        ],
      },
      {
        action: 'Set the default model for your enterprise (if applicable).',
        details: [
          'If multiple models are enabled, choose which one is the default for new chat sessions.',
          'Users can still switch to other enabled models during a session.',
        ],
        verification: 'The selected default model is displayed as the active default on the models settings page.',
        docLinks: [
          {
            title: 'Using different LLMs with Copilot Chat',
            url: 'https://docs.github.com/en/copilot/how-tos/use-ai-models/change-the-chat-model',
            description: 'How users switch between available models',
          },
        ],
      },
    ],
    tips: [
      'Start with a limited set of models and expand based on user feedback and cost monitoring.',
      'Some models consume premium requests — review the premium request implications before enabling them.',
    ],
    links: [
      {
        title: 'Using different LLMs with Copilot Chat',
        url: 'https://docs.github.com/en/copilot/how-tos/use-ai-models/change-the-chat-model',
        description: 'Learn about the AI models available for Copilot',
      },
      {
        title: 'Enforcing Copilot policies',
        url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/enforcing-policies/enforcing-policies-for-your-enterprise/enforcing-policies-for-github-copilot-in-your-enterprise',
        description: 'Enterprise-level Copilot policy management',
      },
    ],
  },
  {
    id: 'nodr-copilot-features',
    title: 'Step 4 — Configure Copilot Features & AI Controls',
    shortTitle: 'Copilot Features',
    description:
      'Enable or disable specific Copilot features and AI-powered capabilities at the enterprise level using the AI Controls panel.',
    prerequisites: [
      'Copilot is enabled at the enterprise level (previous steps completed).',
      'Enterprise owner access on github.com.',
    ],
    substeps: [
      {
        action: 'Navigate to the Copilot AI Controls page.',
        details: [
          'Go to https://github.com/enterprises/YOUR-ENTERPRISE/ai-controls/copilot.',
        ],
        verification: 'The AI Controls page loads and displays a list of Copilot features with toggle switches.',
        docLinks: [
          {
            title: 'Enforcing Copilot policies',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/enforcing-policies/enforcing-policies-for-your-enterprise/enforcing-policies-for-github-copilot-in-your-enterprise',
            description: 'Enterprise Copilot policy management',
          },
        ],
      },
      {
        action: 'Review and configure each Copilot feature.',
        details: [
          'The AI Controls panel lists all available Copilot features (e.g., code completions, chat, PR summaries, code review, Copilot Extensions, etc.).',
          'For each feature, choose: Enabled, Disabled, or No policy (let organizations decide).',
          'Disabling a feature at the enterprise level overrides organization settings — no org can re-enable it.',
          'Setting "No policy" delegates the decision to individual organizations.',
        ],
        verification: 'Each feature shows the desired state (Enabled / Disabled / No policy).',
        docLinks: [
          {
            title: 'Enforcing Copilot policies',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/enforcing-policies/enforcing-policies-for-your-enterprise/enforcing-policies-for-github-copilot-in-your-enterprise',
            description: 'Configure per-feature Copilot policies',
          },
        ],
      },
      {
        action: 'Configure Copilot Extensions policy (if applicable).',
        details: [
          'Decide whether to allow third-party Copilot Extensions in your enterprise.',
          'You can allow all extensions, allow only specific approved extensions, or disable extensions entirely.',
          'Extensions can access repository context — review security implications before enabling.',
        ],
        verification: 'The Copilot Extensions policy shows the correct setting.',
        docLinks: [
          {
            title: 'About Model Context Protocol (MCP)',
            url: 'https://docs.github.com/en/copilot/how-tos/use-copilot-extensions',
            description: 'Learn about MCP and extending Copilot capabilities',
          },
        ],
      },
      {
        action: 'Configure Copilot code review settings (if applicable).',
        details: [
          'Enable or disable AI-powered code review suggestions on pull requests.',
          'When enabled, Copilot can provide automated review comments and suggestions.',
        ],
        verification: 'The code review setting shows the desired state.',
        docLinks: [
          {
            title: 'Using Copilot code review',
            url: 'https://docs.github.com/en/copilot/how-tos/use-copilot-agents/request-a-code-review',
            description: 'AI-powered code review with Copilot',
          },
        ],
      },
    ],
    tips: [
      'Use "No policy" for features where you want organizations to make their own decisions.',
      'Review the AI Controls page periodically — GitHub may add new features over time.',
    ],
    warnings: [
      'Disabling a feature at the enterprise level cannot be overridden by organizations.',
    ],
    links: [
      {
        title: 'Enforcing Copilot policies in your enterprise',
        url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/enforcing-policies/enforcing-policies-for-your-enterprise/enforcing-policies-for-github-copilot-in-your-enterprise',
        description: 'Official docs for Copilot enterprise feature policies',
      },
      {
        title: 'About Model Context Protocol (MCP)',
        url: 'https://docs.github.com/en/copilot/how-tos/use-copilot-extensions',
        description: 'Learn about MCP and extending Copilot capabilities',
      },
    ],
  },
  {
    id: 'nodr-copilot-premium',
    title: 'Step 5 — Manage Premium Requests & Budgets',
    shortTitle: 'Premium Requests',
    description:
      'Enable or disable paid premium request usage for Copilot, and optionally create budgets to control spending on premium model requests.',
    prerequisites: [
      'Copilot is enabled at the enterprise level (previous steps completed).',
      'Enterprise owner or billing manager access on github.com.',
      'Billing is configured (Azure subscription linked or GitHub direct billing active).',
    ],
    substeps: [
      {
        action: 'Navigate to the Copilot billing / premium requests settings.',
        details: [
          'Go to Enterprise settings → Billing → Copilot, or navigate to the Copilot policies page.',
          'Locate the "Premium requests" or "Paid usage" section.',
        ],
        verification: 'The premium requests configuration section is visible with the current status (enabled/disabled).',
        docLinks: [
          {
            title: 'About billing for GitHub Copilot',
            url: 'https://docs.github.com/en/billing/concepts/product-billing/github-copilot-licenses',
            description: 'Copilot billing and premium request details',
          },
        ],
      },
      {
        action: 'Enable or disable premium request paid usage.',
        details: [
          'Premium requests are consumed when users interact with advanced models beyond the included quota.',
          'Enable: users can exceed the included premium request quota — additional requests are billed at the per-request rate.',
          'Disable: users are limited to the included premium request quota — once exhausted, they must wait for the next billing cycle or switch to a non-premium model.',
          'Consider your budget and user needs before enabling paid usage.',
        ],
        verification: 'The premium request paid usage toggle shows the desired state (Enabled / Disabled).',
        docLinks: [
          {
            title: 'Managing Copilot premium requests',
            url: 'https://docs.github.com/en/copilot/how-tos/manage-and-track-spending/manage-request-allowances',
            description: 'How premium requests work and how to manage them',
          },
        ],
      },
      {
        action: 'Create a budget for premium requests (optional but recommended).',
        details: [
          'Navigate to Enterprise settings → Billing → Budgets & alerts.',
          'Click "New budget" or "Create budget".',
          'Set the budget scope to Copilot premium requests.',
          'Define a monthly spending limit (e.g., $500/month, $1000/month).',
          'Configure alert thresholds (e.g., notify at 50%, 75%, 90% of budget).',
          'Assign notification recipients (enterprise owners, billing managers).',
        ],
        verification: 'The budget appears in the Budgets list with the correct amount and alert thresholds.',
        docLinks: [
          {
            title: 'Setting up budgets and alerts',
            url: 'https://docs.github.com/en/billing/how-tos/set-up-budgets',
            description: 'How to create spending budgets and alerts for GitHub products',
          },
        ],
      },
      {
        action: 'Configure per-organization premium request budgets (optional).',
        details: [
          'If you have multiple organizations, you can set individual budgets per organization to distribute spending.',
          'Navigate to each organization\'s billing settings or use enterprise-level budget allocation.',
          'This prevents a single organization from consuming the entire enterprise budget.',
        ],
        verification: 'Each organization has its own budget limit displayed in the billing settings.',
        docLinks: [
          {
            title: 'Setting up budgets and alerts',
            url: 'https://docs.github.com/en/billing/how-tos/set-up-budgets',
            description: 'Create per-organization budgets',
          },
        ],
      },
      {
        action: 'Monitor premium request usage.',
        details: [
          'Go to Enterprise settings → Billing → Usage to review current premium request consumption.',
          'Check usage by organization and by user to identify heavy consumers.',
          'Review billing invoices to track actual spend vs. budget.',
        ],
        verification: 'You can see premium request usage data and it aligns with the budget you set.',
        docLinks: [
          {
            title: 'Viewing product license use',
            url: 'https://docs.github.com/en/billing/how-tos/products/view-productlicense-use',
            description: 'View detailed product usage and billing information',
          },
        ],
      },
    ],
    tips: [
      'Start with premium requests disabled and a conservative budget, then increase as you understand usage patterns.',
      'Set alert thresholds at 50% and 90% to get early warnings before budget exhaustion.',
      'Review premium request usage weekly during the first month to calibrate budgets.',
    ],
    warnings: [
      'Without a budget, enabling premium request paid usage could result in unexpected charges.',
      'Budget alerts are notifications only — they do NOT automatically block usage when exceeded. Monitor actively.',
    ],
    links: [
      {
        title: 'About billing for GitHub Copilot',
        url: 'https://docs.github.com/en/billing/concepts/product-billing/github-copilot-licenses',
        description: 'Copilot billing and premium request pricing',
      },
      {
        title: 'Setting up budgets and alerts',
        url: 'https://docs.github.com/en/billing/how-tos/set-up-budgets',
        description: 'Create and manage spending budgets',
      },
      {
        title: 'Managing Copilot premium requests',
        url: 'https://docs.github.com/en/copilot/how-tos/manage-and-track-spending/manage-request-allowances',
        description: 'How to manage premium request quotas and paid usage',
      },
    ],
  },
  {
    id: 'nodr-copilot-seats',
    title: 'Step 6 — Assign Copilot Seats',
    shortTitle: 'Copilot Seats',
    description:
      'Grant Copilot Business access to users. You can assign seats via IdP-synced teams (recommended), to individual users, or to an entire organization.',
    prerequisites: [
      'Copilot is enabled and policies are configured (previous steps completed).',
      'Organization owner or enterprise owner access on github.com.',
      'Sufficient Copilot licenses purchased to cover the expected users.',
    ],
    substeps: [
      {
        action: 'Navigate to each organization\'s Copilot access settings.',
        details: [
          'Go to the organization → Settings → Copilot → Access.',
        ],
        verification: 'The Copilot access page loads and shows seat configuration options.',
        docLinks: [
          {
            title: 'Managing Copilot access in your organization',
            url: 'https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-organization/manage-access',
            description: 'How to assign Copilot seats',
          },
        ],
      },
      {
        action: 'Choose your seat assignment method.',
        details: [
          'You have three options for assigning Copilot seats:',
          'Option A — Assign via Teams (recommended): Select "Enable for specific members/teams", then add IdP-synced teams. This automates seat management — adding/removing a user in the IdP group automatically grants/revokes the Copilot seat.',
          'Option B — Assign to individual users: Select "Enable for specific members/teams", then search for and add individual managed users by name or username.',
          'Option C — Assign to the entire organization: Select "Enable for all current and future members" to grant Copilot to everyone in the organization. Every user in the org will consume a license.',
        ],
        verification: 'The desired assignment method is selected.',
        docLinks: [
          {
            title: 'Managing Copilot access in your organization',
            url: 'https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-organization/manage-access',
            description: 'Seat assignment methods for Copilot',
          },
        ],
      },
      {
        action: 'Option A — Assign seats to a team (synced from an IdP group).',
        details: [
          'On the Copilot Access page, click "Add teams" or search for a team.',
          'Select the team synced from your IdP (e.g., "GitHub Copilot Business User" synced from the Entra Security group or Okta group).',
          'Confirm the assignment — all current members of the team will receive a Copilot seat.',
          'When new users are added to the IdP group, they are provisioned via SCIM, synced to the team, and automatically receive a Copilot seat.',
          'When users are removed from the IdP group, their seat is revoked on the next SCIM cycle.',
        ],
        verification: 'The team appears in the Copilot seat assignment list with the correct member count.',
        docLinks: [
          {
            title: 'Managing Copilot access in your organization',
            url: 'https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-organization/manage-access',
            description: 'How to assign Copilot seats to teams',
          },
        ],
      },
      {
        action: 'Option B — Assign seats to individual users.',
        details: [
          'On the Copilot Access page, click "Add members" or search for a user.',
          'Search by the managed user\'s display name or short handle (e.g., "jdoe_SHORTCODE").',
          'Select the user and confirm — they will receive a Copilot Business seat.',
          'Repeat for each individual user you want to grant Copilot access.',
          'Note: Individual assignments are NOT managed via SCIM — you must manually add/remove users.',
        ],
        verification: 'Each assigned user appears as "Active" in the Copilot seat list.',
        docLinks: [
          {
            title: 'Managing Copilot access in your organization',
            url: 'https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-organization/manage-access',
            description: 'Assign Copilot seats to individual users',
          },
        ],
      },
      {
        action: 'Option C — Enable Copilot for the entire organization.',
        details: [
          'On the Copilot Access page, select "Enable for all current and future members".',
          'All existing members of the organization will immediately receive a Copilot seat.',
          'Any new member added to the organization in the future will automatically get a seat.',
          'This is the simplest option but uses the most licenses — every org member consumes a Copilot seat.',
        ],
        verification: 'The access setting shows "Enabled for all members" and the seat count matches the org membership.',
        docLinks: [
          {
            title: 'Managing Copilot access in your organization',
            url: 'https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-organization/manage-access',
            description: 'Enable Copilot for the entire organization',
          },
        ],
      },
      {
        action: 'Verify a test user has received a Copilot seat.',
        details: [
          'Check the Copilot access page — the user should show as "Active".',
          'Have the test user sign in to their IDE to confirm Copilot activates.',
          'Copilot should appear in the IDE status bar with code completion suggestions.',
        ],
        verification: 'The test user sees Copilot as "Active" in their IDE status bar and can generate completions.',
        docLinks: [
          {
            title: 'Installing Copilot in your environment',
            url: 'https://docs.github.com/en/copilot/how-tos/set-up/install-copilot-extension',
            description: 'Verify Copilot is active in the IDE',
          },
        ],
      },
    ],
    tips: [
      'Option A (teams) is recommended — it fully automates seat lifecycle via your IdP group membership.',
      'You can mix methods: assign some seats via teams and others to individual users.',
      'Enterprise Administrators do NOT automatically receive Copilot seats unless explicitly assigned or added to a Copilot team.',
      'You can review seat usage in the organization Settings → Copilot → Access page at any time.',
    ],
    warnings: [
      'Seat changes may take a few minutes. Users should sign out and back in to their IDE if Copilot does not activate.',
      'Option C (entire organization) will consume one license per org member — ensure you have enough licenses.',
      'Removing a user from the IdP group (Option A) revokes their seat, but individual assignments (Option B) must be removed manually.',
    ],
    links: [
      {
        title: 'Managing access to Copilot in your organization',
        url: 'https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-organization/manage-access',
        description: 'How to assign Copilot seats to org members and teams',
      },
    ],
  },
  {
    id: 'nodr-copilot-web',
    title: 'Step 7 — Use Copilot on the Web',
    shortTitle: 'Copilot Web',
    description:
      'Access Copilot Chat directly in the browser on github.com — no IDE required.',
    prerequisites: [
      'A managed user account with an assigned Copilot seat (previous step completed).',
      'SSO is working and the user can sign in to github.com.',
    ],
    substeps: [
      {
        action: 'Sign in to https://github.com with a managed user account via SSO.',
        verification: 'You are signed in and see the GitHub dashboard.',
        docLinks: [
          {
            title: 'Using Copilot Chat on GitHub',
            url: 'https://docs.github.com/en/copilot/how-tos/chat-with-copilot/chat-in-github',
            description: 'Access Copilot Chat from the web',
          },
        ],
      },
      {
        action: 'Open Copilot Chat from the top navigation bar.',
        details: [
          'Click the Copilot icon (sparkle) in the top-right area of the navigation bar.',
          'A chat panel appears on the right side.',
        ],
        verification: 'The Copilot Chat panel opens and shows a text input field ready for prompts.',
        docLinks: [
          {
            title: 'Using Copilot Chat on GitHub',
            url: 'https://docs.github.com/en/copilot/how-tos/chat-with-copilot/chat-in-github',
            description: 'How to use Copilot Chat in the browser',
          },
        ],
      },
      {
        action: 'Test a prompt in Copilot Chat.',
        details: [
          'Try asking: "How do I set up a GitHub Actions workflow for CI?"',
          'You can also open Chat from a repository page, PR, or issue for context-aware responses.',
        ],
        verification: 'Copilot responds with a relevant answer. Response is generated within a few seconds.',
        docLinks: [
          {
            title: 'Using Copilot Chat on GitHub',
            url: 'https://docs.github.com/en/copilot/how-tos/chat-with-copilot/chat-in-github',
            description: 'Test Copilot Chat prompts and responses',
          },
        ],
      },
    ],
    links: [
      {
        title: 'Using Copilot Chat on GitHub',
        url: 'https://docs.github.com/en/copilot/how-tos/chat-with-copilot/chat-in-github',
        description: 'How to use Copilot Chat in the browser',
      },
    ],
  },
  {
    id: 'nodr-copilot-ide',
    title: 'Step 8 — Set Up Copilot in IDEs',
    shortTitle: 'Copilot IDEs',
    description:
      'Install and sign in to Copilot in VS Code, JetBrains, or Visual Studio.',
    prerequisites: [
      'A managed user account with an assigned Copilot seat.',
      'VS Code (1.80+), JetBrains IDE (2025.1+), or Visual Studio 2026 (18.0+) installed.',
      'Network access to github.com from developer machines (firewall/proxy rules configured).',
    ],
    substeps: [
      {
        action: 'VS Code: Install GitHub Copilot extensions.',
        details: [
          'Open VS Code → Extensions panel (Ctrl+Shift+X).',
          'Search and install "GitHub Copilot" (ID: GitHub.copilot).',
          'Search and install "GitHub Copilot Chat" (ID: GitHub.copilot-chat).',
        ],
        verification: 'Both extensions appear in the Installed list and the Copilot icon shows in the status bar.',
        docLinks: [
          {
            title: 'Installing Copilot in VS Code',
            url: 'https://docs.github.com/en/copilot/how-tos/set-up/install-copilot-extension',
            description: 'Official guide for VS Code extension setup',
          },
        ],
      },
      {
        action: 'VS Code: Sign in to GitHub Copilot.',
        details: [
          'Click the Copilot icon in the status bar → "Sign in to GitHub".',
          'A browser window opens to github.com — sign in with your managed user account (username_SHORTCODE).',
          'Complete SSO authentication and authorize the extension.',
        ],
        verification: 'The Copilot icon in the status bar shows as active (no warning indicator).',
        docLinks: [
          {
            title: 'Installing Copilot in your environment',
            url: 'https://docs.github.com/en/copilot/how-tos/set-up/install-copilot-extension',
            description: 'Sign in and activate Copilot in VS Code',
          },
        ],
      },
      {
        action: 'JetBrains: Install GitHub Copilot plugin.',
        details: [
          'Go to Settings → Plugins → Marketplace → search "GitHub Copilot" → Install → Restart IDE.',
          'Click "Sign in to GitHub" when prompted.',
          'Complete SSO authentication in the browser with your managed user account.',
        ],
        verification: 'The Copilot status shows as active in the IDE bottom bar.',
        docLinks: [
          {
            title: 'Installing Copilot in JetBrains',
            url: 'https://docs.github.com/en/copilot/how-tos/set-up/install-copilot-extension',
            description: 'JetBrains plugin setup guide',
          },
        ],
      },
      {
        action: 'Visual Studio 2026: Set up GitHub Copilot.',
        details: [
          'Go to Tools → Options → GitHub → Copilot → ensure enabled.',
          'Go to File → Account Settings → sign in with your GitHub managed user account.',
          'Complete SSO sign-in in the browser.',
        ],
        verification: 'The Copilot icon is active in the bottom status bar and inline suggestions appear.',
        docLinks: [
          {
            title: 'Installing Copilot in Visual Studio',
            url: 'https://docs.github.com/en/copilot/how-tos/set-up/install-copilot-extension',
            description: 'Visual Studio Copilot setup guide',
          },
        ],
      },
      {
        action: 'Verify Copilot is working by generating a code completion.',
        details: [
          'Open any source file and start typing a code comment or function.',
          'Copilot should show inline ghost-text suggestions.',
        ],
        verification: 'Inline suggestions appear and can be accepted with Tab.',
        docLinks: [
          {
            title: 'Getting code suggestions in your IDE',
            url: 'https://docs.github.com/en/copilot/how-tos/get-code-suggestions/get-ide-code-suggestions',
            description: 'How to use Copilot code completions',
          },
        ],
      },
    ],
    warnings: [
      'EMU users must sign in with their managed user handle (username_SHORTCODE). Personal accounts will NOT work.',
      'If Copilot shows "No access", verify the user has a seat assigned in the organization.',
    ],
    links: [
      {
        title: 'Installing Copilot in your environment',
        url: 'https://docs.github.com/en/copilot/how-tos/set-up/install-copilot-extension',
        description: 'Official guide for VS Code, JetBrains, and Visual Studio',
      },
      {
        title: 'Troubleshooting Copilot',
        url: 'https://docs.github.com/en/copilot/how-tos/troubleshoot-copilot',
        description: 'Common issues and solutions',
      },
      {
        title: 'Firewall settings for Copilot',
        url: 'https://docs.github.com/en/copilot/how-tos/troubleshoot-copilot/troubleshoot-firewall-settings',
        description: 'Required domains and ports for Copilot connectivity',
      },
    ],
  },
  /* ---- GitHub Advanced Security (GHAS) steps ---- */
  {
    id: 'nodr-ghas-enable',
    title: 'Enable GitHub Advanced Security',
    shortTitle: 'Enable GHAS',
    description:
      'Enable GitHub Advanced Security features at the enterprise and organization level on github.com.',
    prerequisites: [
      'A GitHub Advanced Security license is included in your enterprise agreement.',
      'Enterprise owner permissions on your github.com enterprise.',
      'At least one organization created under the enterprise.',
    ],
    substeps: [
      {
        action: 'Navigate to your enterprise security settings and enable GHAS.',
        details: [
          'Go to https://github.com/enterprises/YOUR-ENTERPRISE → Settings → Code security.',
          'Under "GitHub Advanced Security", select "Enable for all organizations" or enable per-organization.',
          'Enabling at the enterprise level sets the default policy; organizations can still be configured individually.',
        ],
        verification: 'Confirm the "GitHub Advanced Security" status shows as enabled for your target organizations.',
        docLinks: [
          {
            title: 'Enforcing policies for code security in your enterprise',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/enforcing-policies/enforcing-policies-for-your-enterprise/enforcing-policies-for-code-security-and-analysis-for-your-enterprise',
            description: 'Enable or disable GHAS features across your enterprise',
          },
        ],
      },
      {
        action: 'Configure the GHAS enablement policy for organizations.',
        details: [
          'Choose whether organizations can enable GHAS for all repositories or only selected ones.',
          'Consider a phased rollout: start with critical repositories, then expand.',
          'GHAS is licensed per unique active committer — monitor usage to manage costs.',
        ],
        verification: 'Verify the policy is set as intended in Enterprise → Settings → Code security.',
        docLinks: [
          {
            title: 'About billing for GitHub Advanced Security',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/billing/managing-billing-for-your-products/managing-billing-for-github-advanced-security/about-billing-for-github-advanced-security',
            description: 'Understand GHAS licensing and committer-based billing',
          },
        ],
      },
    ],
    tips: [
      'Start with a pilot group of repositories to measure the impact on committer count before a full rollout.',
      'Use the security overview dashboard to track GHAS adoption across organizations.',
    ],
    links: [
      {
        title: 'About GitHub Advanced Security',
        url: 'https://docs.github.com/en/enterprise-cloud@latest/get-started/learning-about-github/about-github-advanced-security',
        description: 'Overview of all GHAS features and capabilities',
      },
      {
        title: 'Enforcing policies for code security in your enterprise',
        url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/enforcing-policies/enforcing-policies-for-your-enterprise/enforcing-policies-for-code-security-and-analysis-for-your-enterprise',
        description: 'Enterprise-level GHAS management',
      },
    ],
  },
  {
    id: 'nodr-ghas-code-scanning',
    title: 'Configure Code Scanning with CodeQL',
    shortTitle: 'Code Scanning',
    description:
      'Set up code scanning using CodeQL to automatically find vulnerabilities and coding errors in your repositories.',
    prerequisites: [
      'GitHub Advanced Security is enabled for the target organizations.',
      'Repositories contain supported languages (JavaScript, TypeScript, Python, Java, C#, C/C++, Go, Ruby, Swift, Kotlin).',
    ],
    substeps: [
      {
        action: 'Enable default setup for CodeQL code scanning at the organization level.',
        details: [
          'Go to Organization → Settings → Code security and analysis.',
          'Under "Code scanning", click "Enable all" to use the default CodeQL setup.',
          'Default setup automatically detects languages and runs CodeQL on push and pull request events.',
          'For repositories that need custom configurations, you can override with an advanced setup later.',
        ],
        verification: 'Confirm code scanning is shown as "Configured" for repositories in the organization\'s security overview.',
        docLinks: [
          {
            title: 'Configuring default setup for code scanning',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/code-security/code-scanning/enabling-code-scanning/configuring-default-setup-for-code-scanning',
            description: 'Enable CodeQL with default setup for your organization',
          },
        ],
      },
      {
        action: 'Review and triage code scanning alerts.',
        details: [
          'Navigate to a repository → Security tab → Code scanning alerts.',
          'Review each alert: dismiss false positives, fix true positives, and document decisions.',
          'Set up alert severity thresholds in branch protection rules to block merging of PRs with critical/high alerts.',
        ],
        verification: 'Confirm alerts are visible in the Security tab and that branch protection rules enforce scanning checks.',
        docLinks: [
          {
            title: 'Managing code scanning alerts',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/code-security/code-scanning/managing-code-scanning-alerts/managing-code-scanning-alerts-for-your-repository',
            description: 'Triage and manage code scanning results',
          },
        ],
      },
      {
        action: 'Configure CodeQL query suites and custom queries (optional).',
        details: [
          'Default setup uses the "default" query suite which covers the most impactful security queries.',
          'Switch to the "security-extended" or "security-and-quality" suite for broader coverage.',
          'For advanced needs, create custom CodeQL query packs and reference them in a code-scanning workflow.',
        ],
        verification: 'Verify the desired query suite is active by checking the code scanning configuration page.',
        docLinks: [
          {
            title: 'CodeQL query suites',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/code-security/code-scanning/managing-your-code-scanning-configuration/codeql-query-suites',
            description: 'Choose and customize CodeQL query suites',
          },
        ],
      },
    ],
    tips: [
      'Use default setup for most repositories — it automatically configures CodeQL with zero YAML files.',
      'For mono-repos or complex build systems, switch to advanced setup with a custom workflow file.',
      'Enable "Copilot Autofix" on code scanning alerts to get AI-generated fix suggestions.',
    ],
    links: [
      {
        title: 'About code scanning with CodeQL',
        url: 'https://docs.github.com/en/enterprise-cloud@latest/code-security/code-scanning/introduction-to-code-scanning/about-code-scanning-with-codeql',
        description: 'How CodeQL finds vulnerabilities in your code',
      },
      {
        title: 'Configuring default setup for code scanning at scale',
        url: 'https://docs.github.com/en/enterprise-cloud@latest/code-security/code-scanning/enabling-code-scanning/configuring-default-setup-for-code-scanning-at-scale',
        description: 'Roll out code scanning across all repositories in an organization',
      },
    ],
  },
  {
    id: 'nodr-ghas-secret-scanning',
    title: 'Configure Secret Scanning & Push Protection',
    shortTitle: 'Secret Scanning',
    description:
      'Enable secret scanning to detect leaked credentials and push protection to prevent secrets from being committed.',
    prerequisites: [
      'GitHub Advanced Security is enabled for the target organizations.',
    ],
    substeps: [
      {
        action: 'Enable secret scanning at the organization or enterprise level.',
        details: [
          'Go to Organization → Settings → Code security and analysis.',
          'Enable "Secret scanning" for all repositories (existing and new).',
          'Secret scanning automatically checks for known secret patterns from 200+ service providers.',
        ],
        verification: 'Confirm "Secret scanning" shows as enabled in the organization security settings.',
        docLinks: [
          {
            title: 'Configuring secret scanning for your repositories',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/code-security/secret-scanning/enabling-secret-scanning-features/enabling-secret-scanning-for-your-repository',
            description: 'Enable and configure secret scanning',
          },
        ],
      },
      {
        action: 'Enable push protection to block commits containing secrets.',
        details: [
          'In the same Code security settings, enable "Push protection".',
          'Push protection prevents contributors from pushing code that contains detected secrets.',
          'Contributors can bypass push protection with a justification (which is logged for audit).',
          'Best practice: Require admin review for bypass requests in high-security repositories.',
        ],
        verification: 'Test push protection by attempting to push a test secret (use a revoked/test token). Confirm the push is blocked.',
        docLinks: [
          {
            title: 'Push protection for repositories and organizations',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/code-security/secret-scanning/introduction/about-push-protection',
            description: 'Prevent secrets from being pushed to repositories',
          },
        ],
      },
      {
        action: 'Configure custom secret scanning patterns (optional).',
        details: [
          'Define custom patterns to detect organization-specific secrets (internal API keys, tokens, etc.).',
          'Go to Organization → Settings → Code security → Secret scanning → Custom patterns.',
          'Use regex patterns and test them against sample data before enabling.',
          'Custom patterns can also be defined at the enterprise level to apply across all organizations.',
        ],
        verification: 'Verify custom patterns appear in the secret scanning settings and produce expected alerts on test data.',
        docLinks: [
          {
            title: 'Defining custom patterns for secret scanning',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/code-security/secret-scanning/using-advanced-secret-scanning-and-push-protection-features/custom-patterns/defining-custom-patterns-for-secret-scanning',
            description: 'Create regex-based patterns for organization-specific secrets',
          },
        ],
      },
      {
        action: 'Set up secret scanning alert notifications.',
        details: [
          'Configure who receives notifications when secrets are detected.',
          'By default, repository admins and the committer are notified.',
          'Consider adding a security team distribution list to receive all secret scanning alerts.',
        ],
        verification: 'Confirm notification recipients are configured in the organization code security settings.',
        docLinks: [
          {
            title: 'Evaluating alerts from secret scanning',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/code-security/secret-scanning/managing-alerts-from-secret-scanning/evaluating-alerts',
            description: 'How to evaluate and resolve secret scanning alerts',
          },
        ],
      },
    ],
    warnings: [
      'Always rotate any secrets that have been exposed — even if push protection blocks the commit, the secret may exist in local history.',
      'Review bypass requests regularly to ensure push protection is not being circumvented without justification.',
    ],
    tips: [
      'Enable "Validity checks" to automatically verify whether detected secrets are still active with the provider.',
      'Use the audit log to track push protection bypass events across the enterprise.',
    ],
    links: [
      {
        title: 'About secret scanning',
        url: 'https://docs.github.com/en/enterprise-cloud@latest/code-security/secret-scanning/introduction/about-secret-scanning',
        description: 'Overview of secret scanning capabilities',
      },
      {
        title: 'Secret scanning patterns',
        url: 'https://docs.github.com/en/enterprise-cloud@latest/code-security/secret-scanning/introduction/supported-secret-scanning-patterns',
        description: 'Full list of supported secret types and providers',
      },
    ],
  },
  {
    id: 'nodr-ghas-dependabot',
    title: 'Configure Dependabot (Alerts, Updates & Security)',
    shortTitle: 'Dependabot',
    description:
      'Enable Dependabot to automatically detect vulnerable dependencies and create pull requests to update them.',
    prerequisites: [
      'Repositories contain supported package ecosystems (npm, Maven, NuGet, pip, etc.).',
    ],
    substeps: [
      {
        action: 'Enable Dependabot alerts at the organization level.',
        details: [
          'Go to Organization → Settings → Code security and analysis.',
          'Enable "Dependabot alerts" for all repositories.',
          'Dependabot alerts notify you when your dependencies have known vulnerabilities from the GitHub Advisory Database.',
        ],
        verification: 'Confirm Dependabot alerts are enabled and visible in the organization security overview.',
        docLinks: [
          {
            title: 'Configuring Dependabot alerts',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/code-security/dependabot/dependabot-alerts/configuring-dependabot-alerts',
            description: 'Enable and configure Dependabot vulnerability alerts',
          },
        ],
      },
      {
        action: 'Enable Dependabot security updates.',
        details: [
          'In the same settings, enable "Dependabot security updates".',
          'This automatically creates pull requests to update vulnerable dependencies to the minimum patched version.',
          'Security updates are prioritized by severity and focus only on fixing the vulnerability.',
        ],
        verification: 'Verify that Dependabot creates PRs for known vulnerabilities in a test repository.',
        docLinks: [
          {
            title: 'Configuring Dependabot security updates',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/code-security/dependabot/dependabot-security-updates/configuring-dependabot-security-updates',
            description: 'Automatically fix vulnerable dependencies',
          },
        ],
      },
      {
        action: 'Enable Dependabot version updates (optional but recommended).',
        details: [
          'Create a .github/dependabot.yml configuration file in each repository (or use a central config).',
          'Specify package ecosystems, directories, and update schedules.',
          'Version updates keep all dependencies up to date, not just vulnerable ones.',
          'Example config: package-ecosystem: "npm", directory: "/", schedule: { interval: "weekly" }.',
        ],
        verification: 'Confirm Dependabot version update PRs are created on the configured schedule.',
        docLinks: [
          {
            title: 'Configuring Dependabot version updates',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/code-security/dependabot/dependabot-version-updates/configuring-dependabot-version-updates',
            description: 'Keep dependencies current with automated version update PRs',
          },
        ],
      },
      {
        action: 'Configure dependency review for pull requests.',
        details: [
          'Dependency review shows the impact of dependency changes in pull requests before merging.',
          'Install the "Dependency Review" GitHub Action in your CI workflows to enforce policies.',
          'Use the action to block PRs that introduce known-vulnerable or restrictively-licensed dependencies.',
        ],
        verification: 'Submit a test PR that changes a dependency and confirm the dependency review summary appears.',
        docLinks: [
          {
            title: 'About dependency review',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/code-security/supply-chain-security/understanding-your-software-supply-chain/about-dependency-review',
            description: 'Review dependency changes and their security impact in PRs',
          },
        ],
      },
    ],
    tips: [
      'Group Dependabot PRs by ecosystem or dependency type to reduce PR noise.',
      'Use auto-merge with required status checks to automatically merge low-risk dependency updates.',
      'Configure Dependabot to ignore specific dependencies or versions using the ignore option in dependabot.yml.',
    ],
    links: [
      {
        title: 'About Dependabot',
        url: 'https://docs.github.com/en/enterprise-cloud@latest/code-security/dependabot/working-with-dependabot',
        description: 'Overview of all Dependabot features',
      },
      {
        title: 'Dependabot configuration options',
        url: 'https://docs.github.com/en/enterprise-cloud@latest/code-security/dependabot/dependabot-version-updates/configuration-options-for-the-dependabot.yml-file',
        description: 'Full reference for dependabot.yml configuration',
      },
    ],
  },
  {
    id: 'nodr-ghas-security-overview',
    title: 'Security Overview & Policies',
    shortTitle: 'Security Overview',
    description:
      'Use the security overview dashboard to monitor your security posture and define security policies across the enterprise.',
    prerequisites: [
      'GitHub Advanced Security is enabled with code scanning, secret scanning, or Dependabot configured.',
    ],
    substeps: [
      {
        action: 'Review the enterprise security overview dashboard.',
        details: [
          'Navigate to https://github.com/enterprises/YOUR-ENTERPRISE → Code Security → Overview.',
          'The dashboard shows a summary of open alerts across all organizations and repositories.',
          'Filter by severity, tool, organization, or repository to focus on critical issues.',
          'Use the "Coverage" tab to see which repositories have security features enabled.',
        ],
        verification: 'Confirm you can view alert counts, coverage metrics, and filter by organization.',
        docLinks: [
          {
            title: 'About the security overview',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/code-security/security-overview/about-security-overview',
            description: 'Enterprise-wide visibility into your security posture',
          },
        ],
      },
      {
        action: 'Create a SECURITY.md security policy for your organizations.',
        details: [
          'Add a SECURITY.md file to the .github repository in each organization.',
          'Include: supported versions, how to report vulnerabilities, expected response times, and disclosure policy.',
          'This file is automatically displayed when users navigate to the repository\'s "Security" tab.',
        ],
        verification: 'Confirm the security policy is visible on the Security tab of repositories in the organization.',
        docLinks: [
          {
            title: 'Adding a security policy to your repository',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/code-security/getting-started/adding-a-security-policy-to-your-repository',
            description: 'Define how vulnerabilities should be reported',
          },
        ],
      },
      {
        action: 'Configure security alert notifications and webhooks.',
        details: [
          'Set up organization-level notification routing for security alerts.',
          'Consider integrating with SIEM tools using webhooks for code scanning, secret scanning, and Dependabot events.',
          'Use the GitHub API to programmatically query and manage security alerts at scale.',
        ],
        verification: 'Confirm security team members receive notifications for new alerts and that webhook events are delivered.',
        docLinks: [
          {
            title: 'About security alerts',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/code-security/getting-started/auditing-security-alerts',
            description: 'Auditing and monitoring security alerts',
          },
        ],
      },
      {
        action: 'Set up enterprise-level security configurations (optional).',
        details: [
          'Use enterprise-level security configurations to apply consistent settings across all organizations.',
          'Define which security features should be enabled by default for new repositories.',
          'Configure required workflows and rulesets that enforce security checks across the enterprise.',
        ],
        verification: 'Verify that new repositories automatically inherit the enterprise security configuration.',
        docLinks: [
          {
            title: 'Applying security configurations at enterprise scale',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/code-security/securing-your-organization/enabling-security-features-in-your-organization',
            description: 'Apply security configurations across your organization',
          },
        ],
      },
    ],
    tips: [
      'Schedule regular security review meetings using the security overview as the agenda.',
      'Set up Slack or Teams notifications for critical/high severity alerts using webhooks.',
      'Use the "Risk" tab to prioritize repositories with the most open alerts.',
    ],
    links: [
      {
        title: 'Security overview dashboard',
        url: 'https://docs.github.com/en/enterprise-cloud@latest/code-security/security-overview/about-security-overview',
        description: 'Centralized view of security alerts and coverage',
      },
      {
        title: 'Securing your organization',
        url: 'https://docs.github.com/en/enterprise-cloud@latest/code-security/securing-your-organization',
        description: 'Best practices for securing your GitHub organization',
      },
    ],
  },
  {
    id: 'nodr-verify',
    title: 'Verify & Go Live',
    shortTitle: 'Verify',
    description:
      'Validate the entire setup end-to-end and prepare for production rollout.',
    prerequisites: [
      'All previous steps are completed and verified.',
      'At least one test managed user account provisioned via SCIM (not the setup user).',
      'The test user has been added to a team with repository access and a Copilot seat.',
    ],
    substeps: [
      {
        action: 'Sign in as a provisioned managed user (not the setup user).',
        details: [
          'Open a private/incognito browser window.',
          'Navigate to https://github.com.',
          'Sign in with a test managed user account via SSO.',
        ],
        verification: 'The managed user can sign in successfully and sees the GitHub dashboard.',
        docLinks: [
          {
            title: 'About EMU abilities and restrictions',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/managing-iam/understanding-iam-for-enterprises/abilities-and-restrictions-of-managed-user-accounts',
            description: 'What managed users can and cannot do',
          },
        ],
      },
      {
        action: 'Verify organization and repository access.',
        details: [
          'Confirm the user can see the correct organizations.',
          'Confirm the user can access repositories their team has access to.',
          'Confirm the user CANNOT see repos they should not have access to.',
        ],
        verification: 'Organization membership and repo visibility match the expected access.',
        docLinks: [
          {
            title: 'Managing repository access',
            url: 'https://docs.github.com/en/organizations/managing-user-access-to-your-organizations-repositories/managing-repository-roles/managing-team-access-to-an-organization-repository',
            description: 'Verify team-based repository access control',
          },
        ],
      },
      {
        action: 'Test Git operations: clone, push, and pull request creation.',
        details: [
          'Clone a test repo: git clone https://github.com/org/repo.git',
          'Make a change, commit, and push to a new branch.',
          'Create a pull request from the web UI.',
        ],
        verification: 'Clone, push, and PR creation all succeed without errors.',
        docLinks: [
          {
            title: 'Cloning a repository',
            url: 'https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository',
            description: 'How to clone, push, and create pull requests',
          },
        ],
      },
      {
        action: 'Verify IdP group → team synchronization.',
        details: [
          'Check that IdP group members appear in the corresponding GitHub team.',
          'Add a user to an IdP group and verify they appear in the GitHub team within minutes.',
        ],
        verification: 'Team membership matches the IdP group membership.',
        docLinks: [
          {
            title: 'Managing team memberships with IdP groups',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/managing-iam/provisioning-user-accounts-with-scim/managing-team-memberships-with-identity-provider-groups',
            description: 'Verify IdP group to GitHub team synchronization',
          },
        ],
      },
      {
        action: 'Test deprovisioning and reprovisioning.',
        details: [
          'Remove a test user from the IdP application assignment.',
          'Wait for the SCIM sync cycle (or trigger a manual sync).',
          'Then re-assign the user and verify they regain access.',
        ],
        verification: 'Deprovisioned user is suspended in GitHub; after reprovisioning, their access is restored.',
        docLinks: [
          {
            title: 'Configuring SCIM provisioning for EMU',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/managing-iam/provisioning-user-accounts-with-scim/configuring-scim-provisioning-for-users',
            description: 'How deprovisioning and reprovisioning works with SCIM',
          },
        ],
      },
      {
        action: 'Roll out to remaining users and communicate.',
        details: [
          'Assign all remaining users/groups in the IdP application.',
          'Send an email/Slack to all users with: sign-in instructions and IDE setup guide.',
        ],
        verification: 'All users can sign in to github.com and access their assigned repos.',
        docLinks: [
          {
            title: 'About EMU limitations',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/managing-iam/understanding-iam-for-enterprises/abilities-and-restrictions-of-managed-user-accounts',
            description: 'What managed users can and cannot do — share this with users',
          },
        ],
      },
    ],
    warnings: [
      'Managed users cannot create personal repositories.',
      'Managed users cannot interact with resources outside the enterprise on github.com.',
    ],
    links: [
      {
        title: 'EMU abilities and restrictions',
        url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/managing-iam/understanding-iam-for-enterprises/abilities-and-restrictions-of-managed-user-accounts',
        description: 'What managed users can and cannot do',
      },
    ],
  },
  {
    id: 'nodr-notify-users',
    title: 'Notify Users & Roll Out',
    shortTitle: 'Notify Users',
    description:
      'Send a welcome email to your users with sign-in instructions, IDE setup guides, and important information about managed user accounts.',
    substeps: [
      {
        action: 'Prepare the welcome email for your users.',
        details: [
          'Use the pre-configured email template below. Customize it with your enterprise name, organization details, and any internal resources.',
          'Review the email content with your IT and security teams before sending.',
          'Consider sending to a pilot group first, then rolling out to all users.',
        ],
        verification: 'The email has been reviewed and approved by stakeholders.',
        docLinks: [
          {
            title: 'About EMU abilities and restrictions',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/managing-iam/understanding-iam-for-enterprises/abilities-and-restrictions-of-managed-user-accounts',
            description: 'Share this link with your users',
          },
        ],
      },
      {
        action: 'Review and send the welcome email template.',
        // emailTemplate is injected dynamically by getSteps() based on config
        verification: 'The email has been sent to all users. Verify with a test recipient that links work and instructions are clear.',
        docLinks: [
          {
            title: 'Getting started with Copilot',
            url: 'https://docs.github.com/en/copilot/get-started',
            description: 'Share this quickstart guide with your users',
          },
        ],
      },
      {
        action: 'Monitor user onboarding and provide support.',
        // details, verification, and docLinks are injected dynamically by getSteps() based on config
        details: [],
        verification: 'All target users have signed in successfully.',
        docLinks: [],
      },
    ],
    tips: [
      'Send the email in waves: start with a pilot group of 10\u201320 users, gather feedback, then roll out company-wide.',
      'Include your IT helpdesk contact in the email for first-line support.',
    ],
    links: [
      {
        title: 'EMU abilities and restrictions',
        url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/managing-iam/understanding-iam-for-enterprises/abilities-and-restrictions-of-managed-user-accounts',
        description: 'What managed users can and cannot do',
      },
      {
        title: 'Getting started with Copilot',
        url: 'https://docs.github.com/en/copilot/get-started',
        description: 'Copilot quickstart for users',
      },
    ],
  },
];

function buildMonitorSubstep(config: WizardConfig): SubStep {
  const { dataResidency, manageCopilot, manageOrgs, manageGHAS } = config

  const details: string[] = [
    dataResidency
      ? 'Track how many users have successfully signed in to GHE.com (check Enterprise > People).'
      : 'Track how many users have successfully signed in (check Enterprise > People).',
    'Set up a support channel (Slack/Teams) for users to report issues.',
  ]

  const commonIssues: string[] = ['SSO login loops (clear browser cookies)']
  const verificationParts: string[] = ['All target users have signed in successfully']
  const docLinks: DocLink[] = []

  if (manageCopilot) {
    details.push('Monitor **Copilot** seat usage in Enterprise > Settings > Copilot > Usage.')
    if (dataResidency) {
      commonIssues.push('IDE not connecting (check enterprise URI setting)')
    }
    commonIssues.push('"No access" errors (verify Copilot seat assignment)')
    verificationParts.push('Copilot is active for assigned users')
    docLinks.push({
      title: 'Viewing Copilot usage',
      url: 'https://docs.github.com/en/enterprise-cloud@latest/copilot/managing-copilot/managing-github-copilot-in-your-organization/reviewing-usage-data-for-github-copilot-in-your-organization',
      description: 'Monitor Copilot adoption and usage',
    })
  }

  if (manageOrgs) {
    details.push('Verify **organization** membership: check that users appear in the correct organizations and teams.')
    verificationParts.push('organization memberships are correct')
  }

  if (manageGHAS) {
    details.push('Check **GitHub Advanced Security** enablement: verify GHAS features (code scanning, secret scanning, Dependabot) are active on target repositories.')
    verificationParts.push('GHAS is enabled on target repositories')
    docLinks.push({
      title: 'About GitHub Advanced Security',
      url: 'https://docs.github.com/en/enterprise-cloud@latest/get-started/learning-about-github/about-github-advanced-security',
      description: 'GHAS features overview',
    })
  }

  commonIssues.push('wrong account (must use username_SHORTCODE handle)')
  details.push(`Common issues: ${commonIssues.join(', ')}.`)

  return {
    action: 'Monitor user onboarding and provide support.',
    details,
    verification: `${verificationParts.join(', ')}.`,
    docLinks,
  }
}

function buildEmailTemplate(config: WizardConfig): EmailTemplate {
  const { dataResidency, idpType, manageCopilot } = config
  const isEntra = idpType === 'entra-id'
  const idpLabel = isEntra ? 'Microsoft Entra ID' : 'Okta'

  const enterpriseUrl = dataResidency
    ? 'https://YOUR-ENTERPRISE.ghe.com'
    : 'https://github.com/enterprises/YOUR-ENTERPRISE'

  const subject = dataResidency
    ? 'Welcome to GitHub Enterprise - YOUR-ENTERPRISE on GHE.com'
    : 'Welcome to GitHub Enterprise - YOUR-ENTERPRISE'

  // --- Access section ---
  const accessLines: string[] = [
    `**Enterprise URL:** ${enterpriseUrl}`,
    `Navigate to the URL above. You will be redirected to **${idpLabel}** for single sign-on. Sign in with your **corporate credentials**. Your GitHub username will be in the format **username_SHORTCODE**, automatically provisioned from your ${idpLabel} account.`,
  ]

  // --- Copilot / IDE section (only if manageCopilot is enabled) ---
  const copilotSection: EmailTemplateSection[] = []
  if (manageCopilot) {
    const ideLines: string[] = []
    if (dataResidency) {
      ideLines.push(
        '**GitHub Copilot** is available for code completions and chat. Because our enterprise uses **GHE.com** (data residency), you must configure the enterprise URL in your IDE before signing in.',
      )
      ideLines.push(
        '**VS Code** (latest: v1.100+): Open Settings (Ctrl+, / Cmd+,), search "enterprise", set "Github-enterprise: Uri" to https://YOUR-ENTERPRISE.ghe.com. Then search "copilot", under "GitHub > Copilot: Advanced" click "Edit in settings.json" and add "authProvider": "github-enterprise". Save and sign in when prompted.',
      )
      ideLines.push(
        '**Visual Studio 2026** (latest: v18.0+): Go to File > Account Settings > Add > "Add GitHub Enterprise account" (NOT "Add GitHub account"). Enter https://YOUR-ENTERPRISE.ghe.com and complete SSO sign-in.',
      )
      ideLines.push(
        '**JetBrains IDEs** (2025.1+, e.g. IntelliJ IDEA, Rider, WebStorm): Install "GitHub Copilot" plugin. Go to Settings > Languages & Frameworks > GitHub Copilot, set Auth Provider to "GitHub Enterprise", enter https://YOUR-ENTERPRISE.ghe.com, and sign in.',
      )
    } else {
      ideLines.push(
        '**GitHub Copilot** is available for code completions and chat in your IDE.',
      )
      ideLines.push(
        '**VS Code** (latest: v1.100+): Install "GitHub Copilot" and "GitHub Copilot Chat" extensions. Click the Copilot icon in the status bar, click "Sign in to GitHub" and complete SSO with your managed user account (**username_SHORTCODE**).',
      )
      ideLines.push(
        '**Visual Studio 2026** (latest: v18.0+): Go to File > Account Settings, sign in with your GitHub managed user account and complete SSO.',
      )
      ideLines.push(
        '**JetBrains IDEs** (2025.1+, e.g. IntelliJ IDEA, Rider, WebStorm): Install "GitHub Copilot" plugin, click "Sign in to GitHub" when prompted, and complete SSO.',
      )
    }
    copilotSection.push({
      heading: '\uD83D\uDCBB IDE SETUP - GitHub Copilot',
      lines: ideLines,
    })
  }

  // --- Important section ---
  const importantLines: string[] = [
    `This is a **managed user account**, separate from any personal GitHub.com account. You cannot create personal repositories or contribute to public open-source projects outside the enterprise. Your account is **provisioned and deprovisioned automatically** via ${idpLabel}.`,
  ]

  // --- Resources section ---
  const resourceLines: string[] = [
    'Managed user info: https://docs.github.com/en/enterprise-cloud@latest/admin/managing-iam/understanding-iam-for-enterprises/abilities-and-restrictions-of-managed-user-accounts',
  ]
  if (manageCopilot) {
    resourceLines.push(
      'Copilot quickstart: https://docs.github.com/en/copilot/get-started',
    )
    if (dataResidency) {
      resourceLines.push(
        'GHE.com auth guide: https://docs.github.com/en/copilot/how-tos/configure-personal-settings/authenticate-to-ghecom',
      )
    }
  }

  return {
    subject,
    greeting: 'Hello,',
    intro: 'You now have access to our **GitHub Enterprise** environment. Here is everything you need to get started.',
    sections: [
      { heading: '\uD83C\uDFE2 ENTERPRISE ACCESS', lines: accessLines },
      ...copilotSection,
      { heading: '\u26A0\uFE0F IMPORTANT', lines: importantLines },
      { heading: '\uD83D\uDCDA RESOURCES', lines: resourceLines },
    ],
    closing: [
      'Questions or sign-in issues? Contact **[YOUR IT SUPPORT CHANNEL]**.',
      '',
      'Best regards,',
      '[YOUR NAME / TEAM]',
    ],
  }
}

function replaceEnterprise(steps: WizardStep[], name: string): WizardStep[] {
  const r = (s: string) => s.replaceAll('YOUR-ENTERPRISE', name || 'YOUR-ENTERPRISE')
  return steps.map(step => ({
    ...step,
    substeps: step.substeps.map(sub => ({
      ...sub,
      action: r(sub.action),
      details: sub.details?.map(r),
      verification: r(sub.verification),
      emailTemplate: sub.emailTemplate ? {
        ...sub.emailTemplate,
        subject: r(sub.emailTemplate.subject),
        intro: r(sub.emailTemplate.intro),
        sections: sub.emailTemplate.sections.map(sec => ({
          ...sec,
          lines: sec.lines.map(r),
        })),
        closing: sub.emailTemplate.closing.map(r),
      } : undefined,
    })),
    notes: step.notes?.map(r),
    warnings: step.warnings?.map(r),
    tips: step.tips?.map(r),
    description: r(step.description),
  }))
}

/* ------------------------------------------------------------------ */
/*  IdP + protocol-specific SSO step generator                        */
/* ------------------------------------------------------------------ */

function buildSsoStep(
  dr: boolean,
  idp: IdpType,
  protocol: SsoProtocol
): WizardStep {
  const idPrefix = dr ? 'dr-' : 'nodr-'
  const isSaml = protocol === 'saml'
  const isEntra = idp === 'entra-id'
  const idpLabel = isEntra ? 'Microsoft Entra ID' : 'Okta'

  const acsUrl = dr
    ? 'https://YOUR-ENTERPRISE.ghe.com/saml/consume'
    : 'https://github.com/enterprises/YOUR-ENTERPRISE/saml/consume'
  const entityId = dr
    ? 'https://YOUR-ENTERPRISE.ghe.com'
    : 'https://github.com/enterprises/YOUR-ENTERPRISE'
  const loginUrl = dr
    ? 'https://YOUR-ENTERPRISE.ghe.com/enterprises/YOUR-ENTERPRISE/sso'
    : 'https://github.com/enterprises/YOUR-ENTERPRISE/sso'

  /* ---------- SAML + Entra ID ---------- */
  if (isSaml && isEntra) {
    return {
      id: `${idPrefix}configure-sso`,
      title: 'Configure SAML SSO (Entra ID)',
      shortTitle: 'SAML SSO',
      description: `Set up SAML single sign-on using ${idpLabel} for your ${dr ? 'GHE.com' : 'github.com'} EMU enterprise.`,
      prerequisites: [
        'An Entra ID user with at least the Cloud Application Administrator role.',
        'The setup user account credentials (sign in to enterprise settings).',
        'Enterprise URLs from the previous step (ACS URL, Entity ID).',
      ],
      substeps: [
        {
          action: 'In the Azure Portal, go to Entra ID → Enterprise Applications → New application.',
          details: [
            'Search the gallery for "GitHub Enterprise Managed User".',
            'Select the application and click Create.',
          ],
          verification: 'The "GitHub Enterprise Managed User" application appears in your Enterprise Applications list.',
          docLinks: [{
            title: 'Entra ID gallery app for EMU',
            url: 'https://learn.microsoft.com/en-us/entra/identity/saas-apps/github-enterprise-managed-user-tutorial',
            description: 'Microsoft tutorial: Entra ID + GitHub EMU SAML integration',
          }],
        },
        {
          action: 'Open the app → Single sign-on → select SAML.',
          details: [
            'In "Basic SAML Configuration", set:',
            `Identifier (Entity ID): ${entityId}`,
            `Reply URL (ACS URL): ${acsUrl}`,
            `Sign on URL: ${loginUrl}`,
          ],
          verification: 'The Entity ID, Reply URL, and Sign on URL are saved in the Basic SAML Configuration.',
          docLinks: [{
            title: 'Entra ID SAML tutorial for EMU',
            url: 'https://learn.microsoft.com/en-us/entra/identity/saas-apps/github-enterprise-managed-user-tutorial',
            description: 'Basic SAML Configuration for GitHub EMU',
          }],
        },
        {
          action: 'Configure Attributes & Claims.',
          details: [
            'Click Edit on "Unique User Identifier (NameID)" to modify the claim.',
            'Change the NameID format from the default ("Email address") to "Persistent" — GitHub requires persistent NameIDs.',
            'The default NameID source is user.userprincipalname (UPN) — this is the recommended value per Microsoft and GitHub official documentation. UPN is a human-readable, persistent identifier that meets GitHub requirements.',
            'The remaining default claims (givenname, surname, emailaddress, name) do not need to be modified.',
            'Optional: add claim "emails" → user.mail and "full_name" → user.displayname (SCIM provisioning handles these attributes, so they are not strictly required in SAML).',
          ],
          verification: 'NameID format is changed to "Persistent". NameID source remains user.userprincipalname (default).',
          docLinks: [
            {
              title: 'Entra ID SAML tutorial for EMU',
              url: 'https://learn.microsoft.com/en-us/entra/identity/saas-apps/github-enterprise-managed-user-tutorial',
              description: 'Microsoft tutorial (does not require Attributes & Claims changes)',
            },
            {
              title: 'GitHub SAML configuration reference',
              url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/managing-iam/iam-configuration-reference/saml-configuration-reference',
              description: 'NameID (required), emails and full_name (optional SAML attributes)',
            },
          ],
        },
        {
          action: 'Download the signing certificate and copy SSO values.',
          details: [
            'From section "SAML Signing Certificate", download the Certificate (PEM) — this is the format recommended by the MS tutorial.',
            'From section "Set up GitHub Enterprise Managed User", copy:',
            'Login URL (paste as IdP Sign-on URL in GitHub)',
            'Microsoft Entra Identifier (paste as Issuer in GitHub)',
          ],
          verification: 'You have the PEM certificate file and the Login URL / Microsoft Entra Identifier ready.',
          docLinks: [{
            title: 'Entra ID SAML tutorial for EMU',
            url: 'https://learn.microsoft.com/en-us/entra/identity/saas-apps/github-enterprise-managed-user-tutorial',
            description: 'Download SAML signing certificate and metadata',
          }],
        },
        {
          action: 'In GitHub Enterprise → Identity provider → SSO config, paste the IdP values.',
          details: [
            'Navigate to your enterprise → click "Identity provider" at the top.',
            'Under Identity Provider, click "Single sign-on configuration".',
            'Under "SAML single sign-on", select "Add SAML configuration".',
            'Sign-on URL: paste the Login URL from Entra ID.',
            'Issuer: paste the Microsoft Entra Identifier.',
            'Public certificate: upload or paste the Base64 certificate.',
            'Under Public Certificate, select the Signature Method and Digest Method matching your IdP.',
          ],
          verification: 'All fields (Sign-on URL, Issuer, Certificate, Signature/Digest Method) are populated in GitHub.',
          docLinks: [{
            title: 'Configuring SAML SSO for EMU',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/managing-iam/configuring-authentication-for-enterprise-managed-users/configuring-saml-single-sign-on-for-enterprise-managed-users',
            description: 'GitHub docs: SAML SSO configuration for EMU',
          }],
        },
        {
          action: 'Click "Test SAML configuration" to validate the connection.',
          details: [
            'This test uses Service Provider initiated (SP-initiated) authentication.',
            'You must have at least one user assigned to the IdP application to test.',
          ],
          verification: 'The test completes successfully — green "SAML SSO test successful" message.',
        docLinks: [
          {
            title: 'Configuring SAML SSO for EMU',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/managing-iam/configuring-authentication-for-enterprise-managed-users/configuring-saml-single-sign-on-for-enterprise-managed-users',
            description: 'Testing and enabling SAML SSO',
          },
        ],
        },
        {
          action: 'Click "Save SAML settings" to enable SAML SSO for the enterprise.',
          verification: 'SAML SSO status shows "Enabled" in Authentication security settings.',
        docLinks: [
          {
            title: 'Configuring SAML SSO for EMU',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/managing-iam/configuring-authentication-for-enterprise-managed-users/configuring-saml-single-sign-on-for-enterprise-managed-users',
            description: 'Enable SAML SSO for your enterprise',
          },
        ],
        },
        {
          action: 'Download the enterprise SSO recovery codes.',
          details: [
            'Click "Download", "Print", or "Copy" to save your recovery codes.',
            'Store recovery codes in a secure location (e.g., a password manager or vault).',
            'These codes allow access to the enterprise if your IdP is unavailable.',
          ],
          verification: 'Recovery codes are downloaded and stored securely.',
          docLinks: [{
            title: 'Downloading SSO recovery codes',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/managing-iam/managing-recovery-codes-for-your-enterprise/downloading-your-enterprise-accounts-single-sign-on-recovery-codes',
            description: 'How to download and store SSO recovery codes',
          }],
        },
      ],
      warnings: [
        'Ensure the NameID format is "persistent" — transient NameIDs will cause user matching failures.',
      ],
      notes: [
        'Entra ID is the recommended IdP for GitHub EMU — it supports both SAML and OIDC with deep integration.',
      ],
      links: [
        {
          title: 'Entra ID + EMU SAML tutorial',
          url: 'https://learn.microsoft.com/en-us/entra/identity/saas-apps/github-enterprise-managed-user-tutorial',
          description: 'Microsoft Learn: complete Entra ID SAML setup',
        },
        {
          title: 'Configuring SAML for EMU',
          url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/managing-iam/configuring-authentication-for-enterprise-managed-users/configuring-saml-single-sign-on-for-enterprise-managed-users',
          description: 'GitHub docs: SAML SSO for EMU',
        },
      ],
    }
  }

  /* ---------- OIDC + Entra ID ---------- */
  if (!isSaml && isEntra) {
    return {
      id: `${idPrefix}configure-sso`,
      title: 'Configure OIDC SSO (Entra ID)',
      shortTitle: 'OIDC SSO',
      description: `Set up OpenID Connect (OIDC) single sign-on using ${idpLabel} for your ${dr ? 'GHE.com' : 'github.com'} EMU enterprise. OIDC enables Conditional Access Policy (CAP) enforcement.`,
      prerequisites: [
        'An Entra ID user with the Global Administrator role (required for OIDC consent).',
        'The setup user account credentials (sign in to enterprise settings).',
        'An Entra ID P1 or P2 license if you plan to use Conditional Access Policies.',
      ],
      substeps: [
        {
          action: 'Sign in to GitHub as the setup user (SHORTCODE_admin).',
          details: [
            `Navigate to your enterprise on ${dr ? 'GHE.com' : 'github.com'}.`,
            'Ensure you see the "Viewing as SHORTCODE_admin" header bar at the top of the screen.',
          ],
          verification: 'You are signed in as the setup user and can see the enterprise dashboard.',
          docLinks: [{
            title: 'Getting started with EMU',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/managing-iam/understanding-iam-for-enterprises/getting-started-with-enterprise-managed-users',
            description: 'Setup user sign-in instructions',
          }],
        },
        {
          action: 'Navigate to enterprise → Identity provider → Single sign-on configuration.',
          details: [
            'At the top of the enterprise page, click "Identity provider".',
            'Under Identity Provider, click "Single sign-on configuration".',
          ],
          verification: 'You see the SSO configuration page with OIDC and SAML options.',
          docLinks: [{
            title: 'Configuring OIDC for EMU',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/managing-iam/configuring-authentication-for-enterprise-managed-users/configuring-oidc-for-enterprise-managed-users',
            description: 'GitHub docs: OIDC SSO configuration for EMU',
          }],
        },
        {
          action: 'Under "OIDC single sign-on", select "Enable OIDC configuration" and click Save.',
          details: [
            'GitHub will redirect you to Microsoft Entra ID to complete the setup.',
            'You must sign in to Entra ID as a user with Global Administrator rights.',
            'This is required to consent to the installation of the GitHub EMU OIDC application.',
          ],
          verification: 'You are redirected to the Entra ID consent page.',
          docLinks: [{
            title: 'Configuring OIDC for EMU',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/managing-iam/configuring-authentication-for-enterprise-managed-users/configuring-oidc-for-enterprise-managed-users',
            description: 'Enable OIDC and redirect to Entra ID',
          }],
        },
        {
          action: 'In Entra ID, consent and install the GitHub Enterprise Managed User (OIDC) application.',
          details: [
            'After GitHub redirects you, sign in to Entra ID as a Global Administrator.',
            'Review the permissions requested by the GitHub Enterprise Managed User (OIDC) app.',
            'Enable "Consent on behalf of your organization".',
            'Click "Accept" to install the application and grant permissions.',
          ],
          verification: 'The GitHub Enterprise Managed User (OIDC) app appears in Entra ID → Enterprise Applications.',
          docLinks: [{
            title: 'Entra ID OIDC provisioning for EMU',
            url: 'https://learn.microsoft.com/en-us/entra/identity/saas-apps/github-enterprise-managed-user-oidc-provisioning-tutorial',
            description: 'Microsoft tutorial: Entra ID + GitHub EMU OIDC integration',
          }],
        },
        {
          action: 'Download the enterprise SSO recovery codes.',
          details: [
            'Back on GitHub, click "Download", "Print", or "Copy" to save your recovery codes.',
            'Store recovery codes in a secure location (e.g., a password manager or vault).',
            'These codes allow access to the enterprise if Entra ID is unavailable.',
          ],
          verification: 'Recovery codes are downloaded and stored securely.',
          docLinks: [{
            title: 'Downloading SSO recovery codes',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/managing-iam/managing-recovery-codes-for-your-enterprise/downloading-your-enterprise-accounts-single-sign-on-recovery-codes',
            description: 'How to download and store SSO recovery codes',
          }],
        },
        {
          action: 'Click "Enable OIDC Authentication" to activate OIDC SSO.',
          verification: 'OIDC SSO status shows "Enabled" in the enterprise settings.',
          docLinks: [{
            title: 'Configuring OIDC for EMU',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/managing-iam/configuring-authentication-for-enterprise-managed-users/configuring-oidc-for-enterprise-managed-users',
            description: 'Enable OIDC SSO for your enterprise',
          }],
        },
        {
          action: '(Optional) Configure Conditional Access Policies in Entra ID.',
          details: [
            'Go to Entra ID → Security → Conditional Access → New Policy.',
            'Target the GitHub EMU OIDC enterprise application.',
            'Common policies: require MFA, block legacy authentication, restrict by location/IP range.',
            'CAP policies are evaluated on each sign-in — providing real-time access control.',
          ],
          verification: 'The Conditional Access policy is created, enabled, and tested with a pilot user.',
          docLinks: [{
            title: 'About Conditional Access with EMU OIDC',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/managing-iam/configuring-authentication-for-enterprise-managed-users/about-support-for-your-idps-conditional-access-policy',
            description: 'How OIDC CAP works with GitHub EMU',
          }],
        },
      ],
      warnings: [
        'OIDC for EMU is only supported with Microsoft Entra ID — Okta uses SAML only.',
        'You must sign in to Entra ID as a Global Administrator to consent to the OIDC app installation.',
        'Each Entra ID tenant can support only one OIDC integration with EMU. For additional enterprises, use SAML.',
        'If you switch from SAML to OIDC, existing sessions will be invalidated.',
      ],
      tips: [
        'OIDC enables Conditional Access Policy (CAP) enforcement — ideal if you require location/IP/MFA policies.',
        'With OIDC, session tokens are validated against Entra on every request for real-time revocation.',
      ],
      notes: [
        'OIDC provides tighter security integration through Conditional Access Policies.',
        'OIDC is only available with Entra ID — Okta does not support OIDC for GitHub EMU.',
      ],
      links: [
        {
          title: 'Entra ID + EMU OIDC tutorial',
          url: 'https://learn.microsoft.com/en-us/entra/identity/saas-apps/github-enterprise-managed-user-oidc-provisioning-tutorial',
          description: 'Microsoft Learn: complete Entra ID OIDC setup for EMU',
        },
        {
          title: 'Configuring OIDC for EMU',
          url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/managing-iam/configuring-authentication-for-enterprise-managed-users/configuring-oidc-for-enterprise-managed-users',
          description: 'GitHub docs: OIDC SSO for EMU',
        },
        {
          title: 'About CAP support for EMU',
          url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/managing-iam/configuring-authentication-for-enterprise-managed-users/about-support-for-your-idps-conditional-access-policy',
          description: 'Conditional Access Policy support details',
        },
      ],
    }
  }

  /* ---------- SAML + Okta ---------- */
  if (isSaml && !isEntra) {
    return {
      id: `${idPrefix}configure-sso`,
      title: 'Configure SAML SSO (Okta)',
      shortTitle: 'SAML SSO',
      description: `Set up SAML single sign-on using ${idpLabel} for your ${dr ? 'GHE.com' : 'github.com'} EMU enterprise.`,
      prerequisites: [
        'Admin access to your Okta organization.',
        'The setup user account credentials (sign in to enterprise settings).',
        'Enterprise URLs from the previous step (ACS URL, Entity ID).',
      ],
      substeps: [
        {
          action: 'In the Okta Admin Console, go to Applications → Browse App Catalog.',
          details: [
            'Search for "GitHub Enterprise Managed User".',
            'Click "Add Integration".',
            'Choose a label name (e.g., "GitHub EMU - YOUR-ENTERPRISE").',
          ],
          verification: 'The "GitHub Enterprise Managed User" OIN application appears in your Okta applications list.',
          docLinks: [{
            title: 'Okta + GitHub EMU integration',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/managing-iam/configuring-authentication-for-enterprise-managed-users/configuring-saml-single-sign-on-for-enterprise-managed-users',
            description: 'GitHub docs: configuring authentication for EMU (includes Okta)',
          }],
        },
        {
          action: 'In the Okta app → Sign-On tab, configure SAML settings.',
          details: [
            `Single Sign-On URL (ACS URL): ${acsUrl}`,
            `Audience URI (Entity ID): ${entityId}`,
            'Name ID format: Persistent.',
            'Application username: Okta username or email.',
          ],
          verification: 'The ACS URL, Entity ID, and Name ID format are saved in Okta.',
          docLinks: [{
            title: 'Okta SAML setup for EMU',
            url: 'https://saml-doc.okta.com/SAML_Docs/How-to-Configure-SAML-2.0-for-GitHub-Enterprise-Managed-User.html',
            description: 'Configure SAML settings in Okta',
          }],
        },
        {
          action: 'Configure attribute statements in Okta (optional — SCIM handles provisioning).',
          details: [
            'Optional: add attribute "emails" → user.email (SCIM provisions this attribute).',
            'Optional: add attribute "full_name" → user.firstName + " " + user.lastName (or user.displayName).',
            'Ensure the NameID format is "Persistent".',
          ],
          verification: 'NameID format is Persistent. Attribute statements for emails and full_name added if desired.',
          docLinks: [{
            title: 'Okta SAML setup for EMU',
            url: 'https://saml-doc.okta.com/SAML_Docs/How-to-Configure-SAML-2.0-for-GitHub-Enterprise-Managed-User.html',
            description: 'Configure SAML attribute statements in Okta',
          }],
        },
        {
          action: 'From Okta Sign-On tab, copy the IdP metadata to GitHub.',
          details: [
            'Copy the Identity Provider Single Sign-On URL.',
            'Copy the Identity Provider Issuer.',
            'Download the X.509 Signing Certificate.',
          ],
          verification: 'You have the SSO URL, Issuer, and certificate downloaded from Okta.',
          docLinks: [{
            title: 'Okta SAML setup for EMU',
            url: 'https://saml-doc.okta.com/SAML_Docs/How-to-Configure-SAML-2.0-for-GitHub-Enterprise-Managed-User.html',
            description: 'Export SAML metadata from Okta',
          }],
        },
        {
          action: 'In GitHub, paste the Okta values into the SAML configuration.',
          details: [
            'Navigate to your enterprise → click "Identity provider" at the top.',
            'Under Identity Provider, click "Single sign-on configuration".',
            'Under "SAML single sign-on", select "Add SAML configuration".',
            'Sign-on URL: paste the Okta Identity Provider SSO URL.',
            'Issuer: paste the Okta Identity Provider Issuer.',
            'Public certificate: upload the Okta X.509 certificate.',
            'Under Public Certificate, select the Signature Method and Digest Method matching your IdP.',
          ],
          verification: 'All fields (Sign-on URL, Issuer, Certificate, Signature/Digest Method) are populated in GitHub.',
          docLinks: [{
            title: 'Configuring SAML SSO for EMU',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/managing-iam/configuring-authentication-for-enterprise-managed-users/configuring-saml-single-sign-on-for-enterprise-managed-users',
            description: 'Paste IdP metadata into GitHub SAML settings',
          }],
        },
        {
          action: 'Click "Test SAML configuration" to validate the connection.',
          details: [
            'This test uses Service Provider initiated (SP-initiated) authentication.',
            'You must have at least one user assigned to the Okta application to test.',
          ],
          verification: 'The test completes successfully — green "SAML SSO test successful" message.',
        docLinks: [
          {
            title: 'Configuring SAML SSO for EMU',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/managing-iam/configuring-authentication-for-enterprise-managed-users/configuring-saml-single-sign-on-for-enterprise-managed-users',
            description: 'Testing and enabling SAML SSO',
          },
        ],
        },
        {
          action: 'Click "Save SAML settings" to enable SAML SSO for the enterprise.',
          verification: 'SAML SSO status shows "Enabled" in Authentication security settings.',
        docLinks: [
          {
            title: 'Configuring SAML SSO for EMU',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/managing-iam/configuring-authentication-for-enterprise-managed-users/configuring-saml-single-sign-on-for-enterprise-managed-users',
            description: 'Enable SAML SSO for your enterprise',
          },
        ],
        },
        {
          action: 'Download the enterprise SSO recovery codes.',
          details: [
            'Click "Download", "Print", or "Copy" to save your recovery codes.',
            'Store recovery codes in a secure location (e.g., a password manager or vault).',
            'These codes allow access to the enterprise if your IdP is unavailable.',
          ],
          verification: 'Recovery codes are downloaded and stored securely.',
          docLinks: [{
            title: 'Downloading SSO recovery codes',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/managing-iam/managing-recovery-codes-for-your-enterprise/downloading-your-enterprise-accounts-single-sign-on-recovery-codes',
            description: 'How to download and store SSO recovery codes',
          }],
        },
      ],
      warnings: [
        'Ensure the NameID format is "Persistent" — transient NameIDs will cause user matching failures.',
        'Okta only supports SAML for GitHub EMU — OIDC is not available with Okta.',
      ],
      notes: [
        'Okta uses the OIN (Okta Integration Network) catalog app for GitHub EMU.',
      ],
      links: [
        {
          title: 'Configuring SAML for EMU',
          url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/managing-iam/configuring-authentication-for-enterprise-managed-users/configuring-saml-single-sign-on-for-enterprise-managed-users',
          description: 'GitHub docs: SAML SSO for EMU',
        },
        {
          title: 'Okta SAML setup for EMU',
          url: 'https://saml-doc.okta.com/SAML_Docs/How-to-Configure-SAML-2.0-for-GitHub-Enterprise-Managed-User.html',
          description: 'Okta documentation: SAML configuration for GitHub EMU',
        },
      ],
    }
  }

  /* ---------- OIDC + Okta → falls back to SAML (not supported) ---------- */
  return {
    id: `${idPrefix}configure-sso`,
    title: 'Configure SAML SSO (Okta)',
    shortTitle: 'SAML SSO',
    description: `OIDC is not supported with Okta for GitHub EMU. Falling back to SAML configuration using ${idpLabel}.`,
    prerequisites: [
      'Admin access to your Okta organization.',
      'The setup user account credentials.',
    ],
    substeps: [
      {
        action: 'Note: OIDC is only supported with Microsoft Entra ID. Okta uses SAML.',
        details: [
          'GitHub EMU only supports OIDC with Microsoft Entra ID.',
          'For Okta, SAML is the required protocol — follow the SAML steps below.',
          'If you need OIDC features (Conditional Access Policies), consider switching to Entra ID.',
        ],
        verification: 'You understand that Okta will use SAML, not OIDC.',
        docLinks: [
          {
            title: 'About EMU identity providers',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/concepts/identity-and-access-management/enterprise-managed-users#how-does-emus-integrate-with-identity-management-systems',
            description: 'Supported identity providers and protocols for EMU',
          },
        ],
      },
    ],
    warnings: [
      'OIDC is NOT supported with Okta for GitHub EMU. The guide will walk you through SAML setup instead.',
      'If you need Conditional Access Policy support, switch to Entra ID with OIDC.',
    ],
    links: [
      {
        title: 'About EMU identity providers',
        url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/concepts/identity-and-access-management/enterprise-managed-users#how-does-emus-integrate-with-identity-management-systems',
        description: 'Supported IdPs and protocols for EMU',
      },
    ],
  }
}

/* ------------------------------------------------------------------ */
/*  IdP-specific Prerequisites step adjustments                       */
/* ------------------------------------------------------------------ */

function adjustPrerequisitesForIdp(
  step: WizardStep,
  idp: IdpType,
  sso: SsoProtocol,
): WizardStep {
  const isEntra = idp === 'entra-id'
  const idpLabel = isEntra ? 'Microsoft Entra ID' : 'Okta'
  const ssoLabel = sso === 'oidc' ? 'OIDC' : 'SAML'

  const prerequisites = isEntra
    ? [
        'An active Azure subscription with billing configured (required for Entra ID and GitHub licensing).',
        'Admin access to a Microsoft Entra ID tenant with at least the Cloud Application Administrator role.',
        'A GitHub Enterprise Cloud subscription or Enterprise agreement — contact GitHub Sales if needed.',
      ]
    : [
        'An active Azure subscription with billing configured (required for GitHub licensing via Azure) — optional if billing through another channel.',
        'Admin access to an Okta organization with permissions to create and configure applications.',
        'A GitHub Enterprise Cloud subscription or Enterprise agreement — contact GitHub Sales if needed.',
      ]

  const idpSubstep: SubStep = isEntra
    ? {
        action: `Prepare your ${idpLabel} tenant for EMU with ${ssoLabel} SSO.`,
        details: [
          `You have selected ${idpLabel} as your Identity Provider with ${ssoLabel} single sign-on.`,
          sso === 'oidc'
            ? 'Entra ID with OIDC is the recommended configuration — it provides the deepest integration, including Conditional Access Policy (CAP) support.'
            : 'Entra ID with SAML is supported but does not include Conditional Access Policy (CAP) support. Consider OIDC if CAP is needed.',
          'You will need to create an Enterprise Application in Entra ID for SSO and a separate one for SCIM provisioning.',
        ],
        verification: 'Confirm you have admin access to your Entra ID tenant and can create enterprise applications.',
        docLinks: [
          {
            title: 'Configuring authentication for EMU',
            url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/managing-iam/understanding-iam-for-enterprises/getting-started-with-enterprise-managed-users',
            description: `EMU setup guide for ${idpLabel}`,
          },
        ],
      }
    : {
        action: `Prepare your ${idpLabel} organization for EMU with SAML SSO.`,
        details: [
          `You have selected ${idpLabel} as your Identity Provider with SAML single sign-on.`,
          'Okta supports SAML SSO + SCIM provisioning for EMU enterprises.',
          'You will need to add the "GitHub Enterprise Managed User" application from the Okta Integration Network (OIN).',
        ],
        verification: 'Confirm you have admin access to your Okta organization and can add applications from the OIN catalog.',
        docLinks: [
          {
            title: 'Configuring SAML for EMU with Okta',
            url: 'https://saml-doc.okta.com/SAML_Docs/How-to-Configure-SAML-2.0-for-GitHub-Enterprise-Managed-User.html',
            description: 'Okta SAML configuration guide for GitHub EMU',
          },
        ],
      }

  const substeps = step.substeps.map((sub, i) =>
    i === 0 ? idpSubstep : sub
  )

  return {
    ...step,
    prerequisites,
    substeps,
    notes: [
      ...(step.notes || []),
      `Identity Provider: ${idpLabel} | SSO Protocol: ${ssoLabel}`,
    ],
  }
}

/* ------------------------------------------------------------------ */
/*  IdP-specific SCIM step adjustments                                */
/* ------------------------------------------------------------------ */

function adjustScimForIdp(step: WizardStep, idp: IdpType): WizardStep {
  const isEntra = idp === 'entra-id'
  const idpLabel = isEntra ? 'Microsoft Entra ID' : 'Okta'
  return {
    ...step,
    description: step.description.replace(
      'from your IdP',
      `from ${idpLabel}`
    ),
    notes: [
      ...(step.notes || []),
      isEntra
        ? 'Use the Provisioning tab on the Entra ID Enterprise Application to configure SCIM.'
        : 'Use the Provisioning → "To App" settings in Okta to configure SCIM.',
    ],
  }
}

/* ------------------------------------------------------------------ */
/*  IdP-specific Teams step adjustments                               */
/* ------------------------------------------------------------------ */

function adjustTeamsForIdp(step: WizardStep, idp: IdpType): WizardStep {
  const isEntra = idp === 'entra-id'

  // Replace the generic "Create groups in IdP" substep details with IdP-specific instructions
  const substeps = step.substeps.map(sub => {
    if (!sub.action.includes('Create the required groups')) return sub

    if (isEntra) {
      return {
        ...sub,
        action: 'Create Security groups in Microsoft Entra ID.',
        details: [
          'Go to the Azure portal → Microsoft Entra ID → Groups → New group.',
          'Group type: Select "Security". Do NOT use "Microsoft 365" — M365 groups create a shared mailbox, calendar, and SharePoint site which are unnecessary for GitHub team sync and may cause provisioning issues.',
          'Group name: Use a clear naming convention (e.g., "GitHub-Developers", "GitHub-Copilot-Users").',
          'Membership type: Choose "Assigned" for manual control, or "Dynamic User" to auto-populate based on user attributes (e.g., department = "Engineering").',
          'Add the appropriate users as members.',
          'Repeat for each planned group.',
        ],
      }
    } else {
      return {
        ...sub,
        action: 'Create groups in Okta.',
        details: [
          'Go to the Okta Admin Console → Directory → Groups → Add Group.',
          'Name: Use a clear naming convention (e.g., "GitHub-Developers", "GitHub-Copilot-Users").',
          'Add the appropriate users as members of each group.',
          'Repeat for each planned group.',
        ],
      }
    }
  }).map(sub => {
    if (!sub.action.includes('Assign the IdP groups')) return sub

    if (isEntra) {
      return {
        ...sub,
        action: 'Assign the Entra Security groups to the GitHub Enterprise Application.',
        details: [
          'Go to Azure portal → Microsoft Entra ID → Enterprise Applications → select your GitHub EMU app.',
          'Click "Users and groups" → Add user/group.',
          'Select each Security group and assign it to the application.',
          'Ensure all groups that should sync to GitHub teams are assigned here.',
        ],
      }
    } else {
      return {
        ...sub,
        action: 'Assign the Okta groups to the GitHub Enterprise Application.',
        details: [
          'Go to Okta Admin Console → Applications → select your GitHub EMU app.',
          'Click Assignments → Assign → Assign to Groups.',
          'Select each group and confirm the assignment.',
        ],
      }
    }
  }).map(sub => {
    if (!sub.action.includes('Trigger a SCIM provisioning cycle')) return sub

    if (isEntra) {
      return {
        ...sub,
        action: 'Trigger an Entra ID provisioning cycle to sync the groups.',
        details: [
          'Go to Azure portal → Enterprise Applications → your GitHub EMU app → Provisioning.',
          'Click "Provision on demand" to sync a specific group immediately, or wait for the automatic cycle (runs every 20-40 minutes).',
          'Check the Provisioning logs for any errors — look for "Create Group" and "Update Group" events.',
        ],
      }
    } else {
      return {
        ...sub,
        action: 'Push the Okta groups to GitHub via SCIM.',
        details: [
          'Go to Okta Admin Console → Applications → your GitHub EMU app → Provisioning → Push Groups.',
          'Click "Push Groups" → "Find groups by name" and select each group to push.',
          'Choose "Push group memberships immediately".',
          'Monitor the Push Groups log for successful sync.',
        ],
      }
    }
  })

  return {
    ...step,
    substeps,
    notes: [
      ...(step.notes || []),
      isEntra
        ? 'Entra ID Security groups are the recommended group type for GitHub team sync. They provide access control without the overhead of Microsoft 365 features.'
        : 'In Okta, use the "Push Groups" feature to sync group memberships to GitHub as teams.',
    ],
  }
}

export function getSteps(config: WizardConfig, enterpriseName: string): WizardStep[] {
  const { dataResidency, idpType, ssoProtocol, manageCopilot, manageOrgs, manageGHAS } = config
  const base = dataResidency ? drSteps : noDrSteps
  const idPrefix = dataResidency ? 'dr-' : 'nodr-'
  const ssoStepId = `${idPrefix}configure-sso`
  const scimStepId = dataResidency ? 'dr-configure-scim' : 'nodr-scim'
  const teamsStepId = dataResidency ? 'dr-enterprise-teams' : 'nodr-enterprise-teams'
  const prereqStepId = `${idPrefix}prerequisites`

  const orgsId = dataResidency ? 'dr-orgs-repos' : 'nodr-orgs'
  const policiesId = dataResidency ? 'dr-policies' : 'nodr-policies'

  let steps = base.map(step => {
    if (step.id === prereqStepId) {
      return adjustPrerequisitesForIdp(step, idpType, ssoProtocol)
    }
    if (step.id === ssoStepId) {
      return buildSsoStep(dataResidency, idpType, ssoProtocol)
    }
    if (step.id === scimStepId) {
      return adjustScimForIdp(step, idpType)
    }
    if (step.id === teamsStepId) {
      return adjustTeamsForIdp(step, idpType)
    }
    return step
  })

  // Move billing step after SCIM
  const billingId = dataResidency ? 'dr-billing' : 'nodr-billing'
  const billingIdx = steps.findIndex(s => s.id === billingId)
  if (billingIdx !== -1) {
    const [billing] = steps.splice(billingIdx, 1)
    const scimIdx = steps.findIndex(s => s.id === scimStepId)
    steps.splice(scimIdx + 1, 0, billing)
  }

  if (!manageOrgs) {
    steps = steps.filter(s => s.id !== orgsId && s.id !== policiesId)
  }

  if (!manageCopilot) {
    steps = steps.filter(s => !s.id.startsWith(`${idPrefix}copilot`))
  }

  if (!manageGHAS) {
    steps = steps.filter(s => !s.id.startsWith(`${idPrefix}ghas`))
  }

  // Inject dynamic email template and monitor substep into the notify-users step
  const notifyId = dataResidency ? 'dr-notify-users' : 'nodr-notify-users'
  const emailTpl = buildEmailTemplate(config)
  const monitorSub = buildMonitorSubstep(config)
  steps = steps.map(step => {
    if (step.id !== notifyId) return step
    return {
      ...step,
      substeps: step.substeps.map(sub => {
        if (sub.action === 'Review and send the welcome email template.') {
          return { ...sub, emailTemplate: emailTpl }
        }
        if (sub.action === 'Monitor user onboarding and provide support.') {
          return monitorSub
        }
        return sub
      }),
    }
  })

  return enterpriseName ? replaceEnterprise(steps, enterpriseName) : steps
}
