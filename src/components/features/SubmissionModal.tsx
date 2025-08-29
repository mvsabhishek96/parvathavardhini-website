import { Button } from "@/components/ui/button";
import { Submission, CashSubmission, InKindSubmission } from '@/types/submission';

interface SubmissionModalProps {
  submission: Submission;
  onClose: () => void;
}

const SubmissionModal = ({ submission, onClose }: SubmissionModalProps) => {
  if (!submission) return null;

  const donationDisplay = submission.type === 'amount'
    ? `<strong>Donation:</strong> <span>₹${(submission as CashSubmission).amount.toFixed(2)}</span>`
    : `<strong>Items:</strong> <span>${(submission as InKindSubmission).description}</span>`;

  return (
    <div className="modal-overlay active">
      <div className="modal-content">
        <span className="modal-close-btn" onClick={onClose}>&times;</span>
        <h2><i className="fas fa-file-invoice-dollar"></i> Donation Details</h2>
        <div id="modalBody">
          <p><strong>Name:</strong> <span>{submission.name}</span></p>
          <p><strong>City:</strong> <span>{submission.city}</span></p>
          <p><strong>Gothra:</strong> <span>{submission.gothra || 'N/A'}</span></p>
          <p dangerouslySetInnerHTML={{ __html: donationDisplay }}></p>
          <p><strong>Phone Number:</strong> <span>{submission.phoneNumber}</span></p>
          <p><strong>Date:</strong> <span>{submission.timestamp?.toDate().toLocaleString() || 'N/A'}</span></p>
          <p><strong>Collected By:</strong> <span>{submission.committeeMember}</span></p>
        </div>
        <Button onClick={onClose} className="secondary-btn" style={{ marginTop: '20px' }}>Close</Button>
      </div>
    </div>
  );
};

export default SubmissionModal;
