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
import Link from 'next/link';
import { CommitteeMember } from '@/types/committee';

const SubmissionsList = () => {
  const { user } = useAuth();
  const [allSubmissions, setAllSubmissions] = useState<Submission[]>([]);
  const [committeeMembers, setCommitteeMembers] = useState<CommitteeMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [editingSubmission, setEditingSubmission] = useState<Submission | null>(null);
  const [viewMode, setViewMode] = useState('individual'); // 'individual' or 'combined'

  // Filter and sort states
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortOrder, setSortOrder] = useState('date_desc');

  const fetchSubmissions = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    try {
      if (user.isMaster) {
        const membersQuery = query(collection(db, 'CommitteeMembers'));
        const membersSnapshot = await getDocs(membersQuery);
        const membersData = membersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setCommitteeMembers(membersData as CommitteeMember[]);

        let allSubmissionsData: Submission[] = [];
        for (const member of membersData as CommitteeMember[]) {
          const cashQuery = query(collection(db, "CommitteeMembers", member.id, "Submissions"));
          const inKindQuery = query(collection(db, "CommitteeMembers", member.id, "InKindDonations"));

          const [cashSnapshot, inKindSnapshot] = await Promise.all([getDocs(cashQuery), getDocs(inKindQuery)]);

          const cashData: CashSubmission[] = cashSnapshot.docs.map(doc => ({ id: doc.id, type: 'amount', collectedBy: member.name, ...doc.data() } as CashSubmission));
          const inKindData: InKindSubmission[] = inKindSnapshot.docs.map(doc => ({ id: doc.id, type: 'inKind', collectedBy: member.name, ...doc.data() } as InKindSubmission));

          allSubmissionsData = [...allSubmissionsData, ...cashData, ...inKindData];
        }
        setAllSubmissions(allSubmissionsData);
      } else {
        const cashQuery = query(collection(db, "CommitteeMembers", user.email!, "Submissions"));
        const inKindQuery = query(collection(db, "CommitteeMembers", user.email!, "InKindDonations"));

        const [cashSnapshot, inKindSnapshot] = await Promise.all([getDocs(cashQuery), getDocs(inKindQuery)]);

        const cashData: CashSubmission[] = cashSnapshot.docs.map(doc => ({ id: doc.id, type: 'amount', ...doc.data() } as CashSubmission));
        const inKindData: InKindSubmission[] = inKindSnapshot.docs.map(doc => ({ id: doc.id, type: 'inKind', ...doc.data() } as InKindSubmission));

        setAllSubmissions([...cashData, ...inKindData]);
      }
    } catch (error) {
      console.error('Error fetching submissions: ', error);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  const filteredAndSortedSubmissions = useMemo(() => {
    let submissionsToProcess = allSubmissions;

    // In individual mode, a master user sees their own submissions
    if (user?.isMaster && viewMode === 'individual') {
      submissionsToProcess = allSubmissions.filter(s => s.collectedBy === user.name);
    }

    const filtered = submissionsToProcess.filter(item => {
      const name = item.name || '';
      const city = item.city || '';
      const phone = item.phoneNumber || '';
      const collectedBy = item.collectedBy || '';

      const matchesSearch = searchTerm === '' ||
        name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        phone.includes(searchTerm) ||
        (user?.isMaster && viewMode === 'combined' && collectedBy.toLowerCase().includes(searchTerm.toLowerCase()));

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
      case 'amount_desc':
        filtered.sort((a, b) => {
          const amountA = a.type === 'amount' ? a.amount : 0;
          const amountB = b.type === 'amount' ? b.amount : 0;
          return amountB - amountA;
        });
        break;
      case 'date_desc':
      default:
        filtered.sort((a, b) => (b.timestamp?.toDate().getTime() || 0) - (a.timestamp?.toDate().getTime() || 0));
        break;
    }

    return filtered;
  }, [allSubmissions, searchTerm, startDate, endDate, sortOrder, user, viewMode]);

  const totalAmount = useMemo(() => {
    return filteredAndSortedSubmissions
      .filter((item): item is CashSubmission => item.type === 'amount')
      .reduce((sum, item) => sum + (item.amount || 0), 0);
  }, [filteredAndSortedSubmissions]);

  const handleView = (submission: Submission) => setSelectedSubmission(submission);
  const handleCloseModal = () => setSelectedSubmission(null);
  const handleEdit = (submission: Submission) => setEditingSubmission(submission);
  const handleCloseEditForm = () => setEditingSubmission(null);

  const handleDelete = async (submission: Submission) => {
    if (!user) return;
    if (confirm('Are you sure you want to delete this record? This action cannot be undone.')) {
      try {
        const collectionName = submission.type === 'amount' ? "Submissions" : "InKindDonations";
        const memberEmail = user.isMaster ? committeeMembers.find(m => m.name === submission.collectedBy)?.id : user.email!;

        if (!memberEmail) {
          console.error('Error: Could not determine member email for deletion.');
          return;
        }

        const docRef = doc(db, "CommitteeMembers", memberEmail, collectionName, submission.id);
        await deleteDoc(docRef);
        fetchSubmissions();
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
            'Date': item.timestamp?.toDate().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }) || 'N/A',
            'Collected By': item.collectedBy || user?.name || user?.email
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

  const renderSubmissionsTable = (submissions: Submission[], currentView: string) => (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>City</th>
          <th>Donation</th>
          <th>Date</th>
          {user?.isMaster && currentView === 'combined' && <th>Collected By</th>}
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {submissions.map(submission => (
          <tr key={submission.id}>
            <td data-label="Name">{submission.name || 'N/A'}</td>
            <td data-label="City">{submission.city || 'N/A'}</td>
            <td data-label="Donation">
              {submission.type === 'amount'
                ? `₹${(submission as CashSubmission).amount.toFixed(2)}`
                : (submission as InKindSubmission).description}
            </td>
            <td data-label="Date">{submission.timestamp?.toDate().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }) || 'N/A'}</td>
            {user?.isMaster && currentView === 'combined' && <td data-label="Collected By">{submission.collectedBy || 'N/A'}</td>}
            <td className="action-cell">
              <Button className="view-btn" onClick={() => handleView(submission)}><i className="fas fa-eye"></i> View</Button>
              <Button className="edit-btn" onClick={() => handleEdit(submission)}><i className="fas fa-edit"></i></Button>
              <Button className="delete-btn" onClick={() => handleDelete(submission)}><i className="fas fa-trash"></i></Button>
            </td>
          </tr>
        ))}
        <tr className="total-row">
          <td data-label="Total" colSpan={user?.isMaster && currentView === 'combined' ? 3 : 2}>Filtered Total Cash</td>
          <td data-label="Amount">₹{totalAmount.toFixed(2)}</td>
          <td colSpan={2}></td>
        </tr>
      </tbody>
    </table>
  );

  // MASTER USER VIEW
  if (user?.isMaster) {
    return (
      <div className="master-dashboard p-4 md:p-8">
        <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
          <h1 className="text-4xl font-bold">Master Dashboard</h1>
          <div className="flex items-center space-x-4">
            <Link href="/analytics">
              <Button className="analytics-btn bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out">View Analytics</Button>
            </Link>
            <div className="flex items-center space-x-2 bg-gray-200 p-1 rounded-full">
              <Button
                onClick={() => setViewMode('individual')}
                className={viewMode === 'individual' ? 'bg-white text-black shadow' : 'bg-transparent text-gray-600'}
                style={{ borderRadius: '9999px', padding: '8px 16px' }}
              >
                My Submissions
              </Button>
              <Button
                onClick={() => setViewMode('combined')}
                className={viewMode === 'combined' ? 'bg-white text-black shadow' : 'bg-transparent text-gray-600'}
                style={{ borderRadius: '9999px', padding: '8px 16px' }}
              >
                All Submissions
              </Button>
            </div>
          </div>
        </div>

        <div className="submissions-container">
          <h2 className="text-2xl font-bold my-4">
            {viewMode === 'individual' ? 'My Submissions' : 'All Committee Member Submissions'}
          </h2>
          <div className="filters-container">
            <div><Label htmlFor="searchInput">Search</Label><Input type="text" id="searchInput" placeholder="Name, City, Phone..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} /></div>
            <div><Label htmlFor="startDate">Start Date</Label><Input type="date" id="startDate" value={startDate} onChange={e => setStartDate(e.target.value)} /></div>
            <div><Label htmlFor="endDate">End Date</Label><Input type="date" id="endDate" value={endDate} onChange={e => setEndDate(e.target.value)} /></div>
            <div><Label htmlFor="sortOrder">Sort By</Label>
                <select id="sortOrder" value={sortOrder} onChange={e => setSortOrder(e.target.value)} className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md p-2">
                    <option value="date_desc">Date (Newest First)</option>
                    <option value="amount_desc">Amount (High to Low)</option>
                    <option value="amount_asc">Amount (Low to High)</option>
                </select>
            </div>
            <Button onClick={downloadXlsx} className="export-button success-btn"><i className="fas fa-file-excel"></i> Export</Button>
          </div>
          {renderSubmissionsTable(filteredAndSortedSubmissions, viewMode)}
        </div>

        {selectedSubmission && <SubmissionModal submission={selectedSubmission} onClose={handleCloseModal} />}
      </div>
    );
  }

  // REGULAR USER VIEW
  return (
    <>
      <div className="submissions-container">
        <div className="filters-container">
            <div><Label htmlFor="searchInput">Search</Label><Input type="text" id="searchInput" placeholder="Name, City, Phone..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} /></div>
            <div><Label htmlFor="startDate">Start Date</Label><Input type="date" id="startDate" value={startDate} onChange={e => setStartDate(e.target.value)} /></div>
            <div><Label htmlFor="endDate">End Date</Label><Input type="date" id="endDate" value={endDate} onChange={e => setEndDate(e.target.value)} /></div>
            <div><Label htmlFor="sortOrder">Sort By</Label>
                <select id="sortOrder" value={sortOrder} onChange={e => setSortOrder(e.target.value)} className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md p-2">
                    <option value="date_desc">Date (Newest First)</option>
                    <option value="amount_desc">Amount (High to Low)</option>
                    <option value="amount_asc">Amount (Low to High)</option>
                </select>
            </div>
            <Button onClick={downloadXlsx} className="export-button success-btn"><i className="fas fa-file-excel"></i> Export</Button>
        </div>

        {filteredAndSortedSubmissions.length === 0 ? (
          <p>No submissions match your filters.</p>
        ) : (
          renderSubmissionsTable(filteredAndSortedSubmissions, 'individual')
        )}
      </div>
      {selectedSubmission && <SubmissionModal submission={selectedSubmission} onClose={handleCloseModal} />}
    </>
  );
};

export default SubmissionsList;