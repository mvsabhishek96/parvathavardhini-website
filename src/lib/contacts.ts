interface ContactsManager {
  select(properties: string[], options?: ContactsSelectOptions): Promise<Contact[]>;
}

interface ContactsSelectOptions {
  multiple?: boolean;
}

interface Contact {
  tel: string[];
  // Add other properties if needed
}

export const pickContact = async (): Promise<string | null> => {
  if ('contacts' in navigator && navigator.contacts) {
    const contactsManager = navigator.contacts as ContactsManager;
    if ('select' in contactsManager) {
      try {
        const contacts = await contactsManager.select(['tel'], { multiple: false });
        if (contacts.length > 0 && contacts[0].tel.length > 0) {
          const selectedPhone = contacts[0].tel[0];
          return sanitizePhoneNumber(selectedPhone);
        }
      } catch (error) {
        console.error('Contact Picker API error:', error);
        return null;
      }
    }
  }
  return null;
};

const sanitizePhoneNumber = (phone: string) => {
  if (!phone) return '';
  // Remove all non-digit characters
  let sanitized = phone.replace(/\D/g, '');

  // If the number starts with '91' and is 12 digits long, remove the '91'
  if (sanitized.length === 12 && sanitized.startsWith('91')) {
    sanitized = sanitized.substring(2);
  }
  // If the number starts with '0' and is 11 digits long, remove the '0'
  else if (sanitized.length === 11 && sanitized.startsWith('0')) {
    sanitized = sanitized.substring(1);
  }

  return sanitized;
};