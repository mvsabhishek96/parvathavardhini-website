import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '@/components/shared/AuthProvider';
import { db } from '@/lib/firebase/client';
import { collection, query, getDocs, doc, deleteDoc } from 'firebase/firestore';
import SubmissionModal from './SubmissionModal';
import EditForm from './EditForm';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import * as XLSX from 'xlsx';
import { Submission, CashSubmission, InKindSubmission } from '@/types/submission';

const SubmissionsList = () => {
  const { user } = useAuth();
  const [allSubmissions, setAllSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [editingSubmission, setEditingSubmission] = useState<Submission | null>(null);

  // Filter and sort states
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortOrder, setSortOrder] = useState('amount_desc');

  const fetchSubmissions = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    try {
      const cashQuery = query(collection(db, "CommitteeMembers", user.email!, "Submissions"));
      const inKindQuery = query(collection(db, "CommitteeMembers", user.email!, "InKindDonations"));

      const [cashSnapshot, inKindSnapshot] = await Promise.all([getDocs(cashQuery), getDocs(inKindQuery)]);

      const cashData: CashSubmission[] = cashSnapshot.docs.map(doc => ({ id: doc.id, type: 'amount', ...doc.data() } as CashSubmission));
      const inKindData: InKindSubmission[] = inKindSnapshot.docs.map(doc => ({ id: doc.id, type: 'inKind', ...doc.data() } as InKindSubmission));

      setAllSubmissions([...cashData, ...inKindData]);
    } catch (error) {
      console.error('Error fetching submissions: ', error);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  const filteredAndSortedSubmissions = useMemo(() => {
    const filtered = allSubmissions.filter(item => {
      const name = item.name || '';
      const city = item.city || '';
      const phone = item.phoneNumber || '';
      const matchesSearch = searchTerm === '' ||
        name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        phone.includes(searchTerm);

      if (!matchesSearch) return false;
      if (!item.timestamp) return true;

      const itemDate = item.timestamp.toDate();
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;
      if (start) start.setHours(0, 0, 0, 0);
      if (end) end.setHours(23, 59, 59, 999);

      const matchesDate = (!start || itemDate >= start) && (!end || itemDate <= end);
      return matchesDate;
    });

    switch (sortOrder) {
      case 'amount_asc':
        filtered.sort((a, b) => {
          const amountA = a.type === 'amount' ? a.amount : 0;
          const amountB = b.type === 'amount' ? b.amount : 0;
          return amountA - amountB;
        });
        break;
      case 'date_desc':
        filtered.sort((a, b) => (b.timestamp?.toDate().getTime() || 0) - (a.timestamp?.toDate().getTime() || 0));
        break;
      case 'amount_desc':
      default:
        filtered.sort((a, b) => {
          const amountA = a.type === 'amount' ? a.amount : 0;
          const amountB = b.type === 'amount' ? b.amount : 0;
          return amountB - amountA;
        });
        break;
    }

    return filtered;
  }, [allSubmissions, searchTerm, startDate, endDate, sortOrder]);

  const totalAmount = useMemo(() => {
    return filteredAndSortedSubmissions
      .filter((item): item is CashSubmission => item.type === 'amount')
      .reduce((sum, item) => sum + (item.amount || 0), 0);
  }, [filteredAndSortedSubmissions]);

  const handleView = (submission: Submission) => setSelectedSubmission(submission);
  const handleCloseModal = () => setSelectedSubmission(null);
  const handleEdit = (submission: Submission) => setEditingSubmission(submission);
  const handleCloseEditForm = () => setEditingSubmission(null);

  const handleDelete = async (submissionId: string, submissionType: string) => {
    if (!user) return;
    if (confirm('Are you sure you want to delete this record? This action cannot be undone.')) {
      try {
        const collectionName = submissionType === 'amount' ? "Submissions" : "InKindDonations";
        const docRef = doc(db, "CommitteeMembers", user.email!, collectionName, submissionId);
        await deleteDoc(docRef);
        fetchSubmissions(); // Refetch submissions after deleting
      } catch (error) {
        console.error('Error deleting submission: ', error);
      }
    }
  };

  const downloadXlsx = () => {
    if (confirm("This will download an Excel sheet with the data exactly as you see it now (with current filters and sorting). Proceed?")) {
        const dataForExport = filteredAndSortedSubmissions.map(item => ({
            'Name': item.name,
            'City': item.city,
            'Donation Type': item.type,
            'Amount': item.type === 'amount' ? item.amount : '',
            'Items': item.type === 'inKind' ? (item as InKindSubmission).description : '',
            'Phone Number': item.phoneNumber,
            'Date': item.timestamp?.toDate().toLocaleString() || 'N/A',
            'Collected By': user?.name || user?.email
        }));

        const ws = XLSX.utils.json_to_sheet(dataForExport);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Donations');
        XLSX.writeFile(wb, 'donations_export.xlsx');
    }
  }

  if (loading) return <div className="loader"></div>;

  if (editingSubmission) {
    return <EditForm submission={editingSubmission} onClose={handleCloseEditForm} onUpdate={fetchSubmissions} />;
  }

  return (
    <>
      <div className="submissions-container">
        <div className="filters-container">
            <div><Label htmlFor="searchInput">Search</Label><Input type="text" id="searchInput" placeholder="Name, City, Phone..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} /></div>
            <div><Label htmlFor="startDate">Start Date</Label><Input type="date" id="startDate" value={startDate} onChange={e => setStartDate(e.target.value)} /></div>
            <div><Label htmlFor="endDate">End Date</Label><Input type="date" id="endDate" value={endDate} onChange={e => setEndDate(e.target.value)} /></div>
            <div><Label htmlFor="sortOrder">Sort By</Label>
                <select id="sortOrder" value={sortOrder} onChange={e => setSortOrder(e.target.value)} className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md p-2">
                    <option value="amount_desc">Amount (High to Low)</option>
                    <option value="amount_asc">Amount (Low to High)</option>
                    <option value="date_desc">Date (Newest First)</option>
                </select>
            </div>
            <Button onClick={downloadXlsx} className="export-button success-btn"><i className="fas fa-file-excel"></i> Export</Button>
        </div>

        {filteredAndSortedSubmissions.length === 0 ? (
          <p>No submissions match your filters.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>City</th>
                <th>Donation</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedSubmissions.map(submission => (
                <tr key={submission.id}>
                  <td data-label="Name">{submission.name || 'N/A'}</td>
                  <td data-label="City">{submission.city || 'N/A'}</td>
                  <td data-label="Donation">
                    {submission.type === 'amount'
                      ? `₹${(submission as CashSubmission).amount.toFixed(2)}`
                      : (submission as InKindSubmission).description}
                  </td>
                  <td data-label="Date">{submission.timestamp?.toDate().toLocaleDateString() || 'N/A'}</td>
                  <td className="action-cell">
                    <Button className="view-btn" onClick={() => handleView(submission)}><i className="fas fa-eye"></i> View</Button>
                    <Button className="edit-btn" onClick={() => handleEdit(submission)}><i className="fas fa-edit"></i></Button>
                    <Button className="delete-btn" onClick={() => handleDelete(submission.id, submission.type)}><i className="fas fa-trash"></i></Button>
                  </td>
                </tr>
              ))}
               <tr className="total-row">
                  <td data-label="Total" colSpan={2}>Filtered Total Cash</td>
                  <td data-label="Amount">₹{totalAmount.toFixed(2)}</td>
                  <td colSpan={2}></td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
      {selectedSubmission && <SubmissionModal submission={selectedSubmission} onClose={handleCloseModal} />}
    </>
  );
};

export default SubmissionsList;
