interface CommitteeMember {
  id: string;
  name?: string; // Make name optional for now, as Firebase data might not always have it
  // Add other properties as needed based on the data in Firebase
}

export type { CommitteeMember };
