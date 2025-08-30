import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from '@/components/shared/AuthProvider';
import { db } from '@/lib/firebase/client';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { pickContact } from '@/lib/contacts';

// Define the type for the submitted data
interface SubmittedData {
  name: string;
  city: string;
  gothra: string;
  phoneNumber: string;
  donationType: 'cash' | 'inKind';
  amount?: string;
  inKindDescription?: string;
}

const DonationForm = () => {
  const { user } = useAuth();
  const [view, setView] = useState('form'); // 'form', 'confirmation', or 'success'
  const [donationType, setDonationType] = useState<'cash' | 'inKind'>('cash');
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [gothra, setGothra] = useState('');
  const [amount, setAmount] = useState('');
  const [inKindDescription, setInKindDescription] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [submittedData, setSubmittedData] = useState<SubmittedData | null>(null);
  const [whatsappLink, setWhatsappLink] = useState('');

  const handlePickContact = async () => {
    const contact = await pickContact();
    if (contact) {
      setPhoneNumber(contact);
    }
  };

  const handleSubmit = () => {
    setMessage('');
    if (!name || !city || !gothra || !phoneNumber) {
      setMessage('Please fill in all fields');
      return;
    }
    if (phoneNumber.length !== 10) {
      setMessage('Please enter a valid 10-digit phone number.');
      return;
    }
    const donationValue = donationType === 'cash' ? amount : inKindDescription;
    if (!donationValue) {
      setMessage('Please enter an amount or item description.');
      return;
    }

    const data: SubmittedData = {
      name,
      city,
      gothra,
      phoneNumber,
      donationType,
    };
    if (donationType === 'cash') {
      data.amount = amount;
    } else {
      data.inKindDescription = inKindDescription;
    }
    setSubmittedData(data);
    setView('confirmation');
  };

  const handleGoBack = () => {
    setView('form');
    setSubmittedData(null);
  };

  const handleSave = async () => {
    if (!user || !submittedData) {
      setMessage('Something went wrong. Please try again.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      let collectionName: string;
      let dataToSave: { amount: number } | { description: string };
      let donationDisplayForWhatsapp: string;

      if (submittedData.donationType === 'cash') {
        collectionName = "Submissions";
        const parsedAmount = parseFloat(submittedData.amount!);
        if (isNaN(parsedAmount)) {
          setMessage('Please enter a valid amount');
          setLoading(false);
          return;
        }
        dataToSave = { amount: parsedAmount };
        donationDisplayForWhatsapp = `💰 *చందా మొత్తము:* ₹${parsedAmount.toFixed(2)}`;
      } else {
        collectionName = "InKindDonations";
        dataToSave = { description: submittedData.inKindDescription! };
        donationDisplayForWhatsapp = `🎁 *వస్తువులు:* ${submittedData.inKindDescription!}`;
      }

      const commonData = {
        name: submittedData.name,
        city: submittedData.city,
        gothra: submittedData.gothra,
        phoneNumber: submittedData.phoneNumber,
        timestamp: serverTimestamp(),
        committeeMember: user.email,
        committeeMemberName: user.name, // Using the name from AuthProvider
      };

      const finalData = { ...commonData, ...dataToSave };

      const docRef = collection(db, "CommitteeMembers", user.email!, collectionName);
      await addDoc(docRef, finalData);

      // --- Prepare WhatsApp Message ---
      const TEMPLE_IMAGE_URL = 'https://photos.app.goo.gl/jpfuv7hbrtG67gsM9';
      const whatsappMessage = `✨ *శ్రీ మత్ పర్వత వర్ధని సమేత శ్రీ రామలింగేశ్వర స్వామి వారి దేవస్థానం* ✨
🏛 *నాగెళ్లముడుపు-523371*

━━━━━━━━━━━━━━━━━━━━━━━━

📋 *చందా వివరములు:*

📛 *పేరు:* ${submittedData.name}
🏙️ *ఊరు:* ${submittedData.city}
🕉️ *గోత్రం:* ${submittedData.gothra}
${donationDisplayForWhatsapp}
📱 *ఫోన్ నెంబర్:* ${submittedData.phoneNumber}
👤 *చందా స్వీకరించిన వారు:* ${user.name} (${user.mobile || ''})

━━━━━━━━━━━━━━━━━━━━━━━━

📸 *దేవస్థానం నందు జరిగిన ఉత్సవాలు, వేడుకలు వీక్షించుటకు:*
${TEMPLE_IMAGE_URL}

🛕 *దేవస్థానం ఉత్సవాల తాజా ఫోటోలు,మరియు అప్డేట్స్ కోసం వాట్సాప్ గ్రూప్‌లో చేరండి:*
https://chat.whatsapp.com/GPoVeARo8FIJDmz08V1oWO

📄 *ఆహ్వాన పత్రిక PDF లింక్:*
https://drive.google.com/file/d/1QmEHulIQZRqumZ-tVAYJ4UjUB9yQJDzG/view?usp=sharing

📍 *దేవస్థానం గూగుల్ మ్యాప్స్ లొకేషన్:*
https://maps.app.goo.gl/5NKoQcKA87QVDXm37

━━━━━━━━━━━━━━━━━━━━━━━━

🙏 *Thank you for your generous donation!* 🙏

📞 *నిత్య పూజల వివరములకు సంప్రదించగలరు:*
*కూనపులి శ్యామల దుర్గా ప్రసాద్* 📱 9949844807

ᵈᵉᵛᵉˡᵒᵖᵉᵈ ᵇʸ ᵐᵛˢᵃᵇʰⁱˢʰᵉᵏ⁹⁶@ᵍᵐᵃⁱˡ.ᶜᵒᵐ`;

      const encodedMessage = encodeURIComponent(whatsappMessage);
      setWhatsappLink(`https://wa.me/91${submittedData.phoneNumber}?text=${encodedMessage}`);
      
      setView('success'); // Move to success view

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

  const resetForm = () => {
      setName('');
      setCity('');
      setGothra('');
      setAmount('');
      setInKindDescription('');
      setPhoneNumber('');
      setView('form');
      setSubmittedData(null);
      setWhatsappLink('');
      setMessage('');
  }

  if (view === 'success') {
    return (
      <div className="form-container active max-w-lg mx-auto border-2 border-amber-400 rounded-2xl bg-white/90 shadow-xl p-10 relative" id="successMessage">
        {/* Decorative gold border top */}
        <div className="absolute left-0 top-0 w-full h-2 rounded-t-2xl" style={{ background: 'linear-gradient(90deg, #b9935a 0%, #f2e1c2 100%)' }} />
        <h2 className="text-3xl font-display font-bold text-center mb-4 text-amber-900 drop-shadow-lg tracking-wide flex flex-col items-center gap-2">
          <span className="inline-block text-4xl text-green-700"><i className="fas fa-check-circle"></i></span>
          Donation Saved!
        </h2>
        <p className="message success">The donation has been recorded successfully.</p>
        <Button onClick={() => window.open(whatsappLink, '_blank')} className="success-btn w-full mt-4">
          <i className="fab fa-whatsapp"></i> Send WhatsApp Receipt
        </Button>
        <Button onClick={resetForm} className="secondary-btn w-full" style={{ marginTop: '10px' }}>
          <i className="fas fa-plus-circle"></i> Make Another Donation
        </Button>
        {/* Decorative gold border bottom */}
        <div className="absolute left-0 bottom-0 w-full h-2 rounded-b-2xl" style={{ background: 'linear-gradient(90deg, #b9935a 0%, #f2e1c2 100%)' }} />
      </div>
    )
  }

  if (view === 'confirmation' && submittedData) {
    return (
      <div className="form-container active max-w-lg mx-auto border-2 border-amber-400 rounded-2xl bg-white/90 shadow-xl p-10 relative" id="confirmation">
        {/* Decorative gold border top */}
        <div className="absolute left-0 top-0 w-full h-2 rounded-t-2xl" style={{ background: 'linear-gradient(90deg, #b9935a 0%, #f2e1c2 100%)' }} />
        <h2 className="text-3xl font-display font-bold text-center mb-4 text-amber-900 drop-shadow-lg tracking-wide flex flex-col items-center gap-2">
          <span className="inline-block text-4xl text-yellow-700"><i className="fas fa-check-circle"></i></span>
          Confirm Your Details
        </h2>
        <div className="confirmation-details bg-amber-50/80 rounded-xl p-4 border border-amber-200 mb-6">
          <p><strong>Committee Member:</strong> <span>{user?.name || user?.email}</span></p>
          <p><strong>Name:</strong> <span>{submittedData.name}</span></p>
          <p><strong>City:</strong> <span>{submittedData.city}</span></p>
          <p><strong>Gothra:</strong> <span>{submittedData.gothra}</span></p>
          {submittedData.donationType === 'cash' ? (
            <p><strong>Amount:</strong> <span>₹{parseFloat(submittedData.amount!).toFixed(2)}</span></p>
          ) : (
            <p><strong>Items:</strong> <span>{submittedData.inKindDescription}</span></p>
          )}
          <p><strong>Phone Number:</strong> <span>{submittedData.phoneNumber}</span></p>
        </div>
        <Button onClick={handleSave} className="success-btn w-full" disabled={loading}>
          <i className="fas fa-save"></i> {loading ? 'Saving...' : 'Save Donation'}
        </Button>
        <Button onClick={handleGoBack} className="secondary-btn w-full" style={{ marginTop: '10px' }}>
          <i className="fas fa-arrow-left"></i> Go Back
        </Button>
        {message && <div className="message error mt-4">{message}</div>}
        {/* Decorative gold border bottom */}
        <div className="absolute left-0 bottom-0 w-full h-2 rounded-b-2xl" style={{ background: 'linear-gradient(90deg, #b9935a 0%, #f2e1c2 100%)' }} />
      </div>
    )
  }

  return (
    <div className="form-container active max-w-lg mx-auto border-2 border-amber-400 rounded-2xl bg-white/90 shadow-xl p-10 relative" id="customForm">
      {/* Decorative gold border top */}
      <div className="absolute left-0 top-0 w-full h-2 rounded-t-2xl" style={{ background: 'linear-gradient(90deg, #b9935a 0%, #f2e1c2 100%)' }} />
      <h2 className="text-3xl font-display font-bold text-center mb-8 text-amber-900 drop-shadow-lg tracking-wide flex flex-col items-center gap-2">
        <span className="inline-block text-4xl text-yellow-700"><i className="fas fa-donate"></i></span>
        Enter Donation Details
      </h2>
      <div className="form-group">
        <Label>Donation Type:</Label>
        <div className="toggle-buttons">
          <input type="radio" id="typeCash" name="donationType" value="cash" checked={donationType === 'cash'} onChange={() => setDonationType('cash')} />
          <Label htmlFor="typeCash">Cash</Label>
          <input type="radio" id="typeInKind" name="donationType" value="inKind" checked={donationType === 'inKind'} onChange={() => setDonationType('inKind')} />
          <Label htmlFor="typeInKind">In-Kind</Label>
        </div>
      </div>
      <div className="form-group">
        <Label htmlFor="name">Name:</Label>
        <Input type="text" id="name" name="name" required value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="form-group">
        <Label htmlFor="city">City:</Label>
        <Input type="text" id="city" name="city" required value={city} onChange={(e) => setCity(e.target.value)} />
      </div>
      <div className="form-group">
        <Label htmlFor="gothra">Gothra:</Label>
        <Input type="text" id="gothra" name="gothra" required value={gothra} onChange={(e) => setGothra(e.target.value)} />
      </div>
      {donationType === 'cash' ? (
        <div className="form-group" id="amountGroup">
          <Label htmlFor="amount">Amount:</Label>
          <Input type="number" id="amount" name="amount" required min="0" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </div>
      ) : (
        <div className="form-group" id="inKindGroup">
          <Label htmlFor="inKindDescription">Item Description (e.g., 10kg Rice):</Label>
          <Input type="text" id="inKindDescription" name="inKindDescription" value={inKindDescription} onChange={(e) => setInKindDescription(e.target.value)} />
        </div>
      )}
      <div className="form-group">
        <Label htmlFor="phoneNumber">Phone Number:</Label>
        <div className="input-with-icon">
          <Input type="tel" id="phoneNumber" name="phoneNumber" required placeholder="9876543210" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
          <i className="fas fa-address-book contact-picker-icon" onClick={handlePickContact} title="Pick from contacts"></i>
        </div>
      </div>
      <Button onClick={handleSubmit} disabled={loading} className="w-full mt-2">
        <span>{loading ? 'Submitting...' : 'Submit'}</span>
        <i className={loading ? 'fas fa-spinner fa-spin' : 'fas fa-paper-plane'}></i>
      </Button>
      {message && <div className={message.startsWith('Error') ? "message error mt-4" : "message success mt-4"}>{message}</div>}
      {/* Decorative gold border bottom */}
      <div className="absolute left-0 bottom-0 w-full h-2 rounded-b-2xl" style={{ background: 'linear-gradient(90deg, #b9935a 0%, #f2e1c2 100%)' }} />
    </div>
  );
};

export default DonationForm;
