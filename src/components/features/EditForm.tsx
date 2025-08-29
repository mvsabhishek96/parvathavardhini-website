import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from '@/components/shared/AuthProvider';
import { db } from '@/lib/firebase/client';
import { doc, updateDoc } from 'firebase/firestore';
import { pickContact } from '@/lib/contacts';
import { Submission, CashSubmission, InKindSubmission } from '@/types/submission';

interface EditFormProps {
  submission: Submission;
  onClose: () => void;
  onUpdate: () => void;
}

const EditForm = ({ submission, onClose, onUpdate }: EditFormProps) => {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [gothra, setGothra] = useState('');
  const [amount, setAmount] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (submission) {
      setName(submission.name || '');
      setCity(submission.city || '');
      setGothra(submission.gothra || '');
      setPhoneNumber(submission.phoneNumber || '');
      if (submission.type === 'amount') {
        setAmount(submission.amount?.toString() || '');
      } else {
        // For in-kind donations, we might want to display description or handle differently
        // For now, setting amount to empty string
        setAmount('');
      }
    }
  }, [submission]);

  const handlePickContact = async () => {
    const contact = await pickContact();
    if (contact) {
      setPhoneNumber(contact);
    }
  };

  const handleUpdate = async () => {
    if (!user || !submission) return;

    setLoading(true);
    setMessage('');

    try {
      const collectionName = submission.type === 'amount' ? "Submissions" : "InKindDonations";
      const docRef = doc(db, "CommitteeMembers", user.email!, collectionName, submission.id);

      const updateData: Partial<Submission> = {
        name,
        city,
        gothra,
        phoneNumber,
      };

      if (submission.type === 'amount') {
        (updateData as Partial<CashSubmission>).amount = parseFloat(amount);
      } else {
        // For in-kind, we might update description, but current form only has amount field
        // If description needs to be updated, a separate input field is needed
      }

      await updateDoc(docRef, updateData);

      setMessage('Submission updated successfully!');
      onUpdate();
      onClose();
    } catch (error) {
      if (error instanceof Error) {
        setMessage(`Error: ${error.message}`);
      } else {
        setMessage('An unknown error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container active" id="editForm">
      <h2><i className="fas fa-edit"></i> Edit Submission</h2>
      <div className="form-group">
        <Label htmlFor="editName">Name:</Label>
        <Input type="text" id="editName" name="editName" required value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="form-group">
        <Label htmlFor="editCity">City:</Label>
        <Input type="text" id="editCity" name="editCity" required value={city} onChange={(e) => setCity(e.target.value)} />
      </div>
      <div className="form-group">
        <Label htmlFor="editGothra">Gothra:</Label>
        <Input type="text" id="editGothra" name="editGothra" required value={gothra} onChange={(e) => setGothra(e.target.value)} />
      </div>
      <div className="form-group">
        <Label htmlFor="editAmount">Amount:</Label>
        <Input type="number" id="editAmount" name="editAmount" required min="0" value={amount} onChange={(e) => setAmount(e.target.value)} />
      </div>
      <div className="form-group">
        <Label htmlFor="editPhoneNumber">Phone Number:</Label>
        <div className="input-with-icon">
          <Input type="tel" id="editPhoneNumber" name="editPhoneNumber" required placeholder="9876543210" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
          <i className="fas fa-address-book contact-picker-icon" onClick={handlePickContact} title="Pick from contacts"></i>
        </div>
      </div>
      <div className="action-buttons">
        <Button onClick={handleUpdate} className="success-btn" disabled={loading}>
          <i className="fas fa-save"></i> {loading ? 'Saving...' : 'Save'}
        </Button>
        <Button onClick={onClose} className="secondary-btn">
          <i className="fas fa-times"></i> Cancel
        </Button>
      </div>
      {message && <div className="message error">{message}</div>}
    </div>
  );
};

export default EditForm;
