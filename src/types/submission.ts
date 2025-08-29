interface BaseSubmission {
  id: string;
  name: string;
  city: string;
  gothra: string;
  phoneNumber: string;
  timestamp: {
    toDate(): Date;
  };
  committeeMember: string;
  committeeMemberName: string;
}

interface CashSubmission extends BaseSubmission {
  type: 'amount';
  amount: number; // Stored as number in Firestore
}

interface InKindSubmission extends BaseSubmission {
  type: 'inKind';
  description: string; // Stored as description in Firestore
}

type Submission = CashSubmission | InKindSubmission;

export type { Submission, CashSubmission, InKindSubmission, BaseSubmission };
