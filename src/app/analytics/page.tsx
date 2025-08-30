'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/components/shared/AuthProvider';
import { db } from '@/lib/firebase/client';
import { collection, query, getDocs } from 'firebase/firestore';
import { Submission, CashSubmission, InKindSubmission } from '@/types/submission';
import AnalyticsData from '@/components/features/AnalyticsData';
import { CommitteeMember } from '@/types/committee';

const AnalyticsPage = () => {
  const { user } = useAuth();
  const [allSubmissions, setAllSubmissions] = useState<Submission[]>([]);
  const [committeeMembers, setCommitteeMembers] = useState<CommitteeMember[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAllData = useCallback(async () => {
    if (!user || !user.isMaster) return;

    setLoading(true);
    try {
      const membersQuery = query(collection(db, 'CommitteeMembers'));
      const membersSnapshot = await getDocs(membersQuery);
      const membersData = membersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setCommitteeMembers(membersData as CommitteeMember[]); // Cast to CommitteeMember[]

      let allSubmissions: Submission[] = [];
      for (const member of membersData as CommitteeMember[]) { // Explicitly cast membersData here
        const cashQuery = query(collection(db, "CommitteeMembers", member.id, "Submissions"));
        const inKindQuery = query(collection(db, "CommitteeMembers", member.id, "InKindDonations"));

        const [cashSnapshot, inKindSnapshot] = await Promise.all([getDocs(cashQuery), getDocs(inKindQuery)]);

        const cashData: CashSubmission[] = cashSnapshot.docs.map(doc => ({ id: doc.id, type: 'amount', collectedBy: member.name || 'Unknown Member', ...doc.data() } as CashSubmission));
        const inKindData: InKindSubmission[] = inKindSnapshot.docs.map(doc => ({ id: doc.id, type: 'inKind', collectedBy: member.name || 'Unknown Member', ...doc.data() } as InKindSubmission));

        allSubmissions = [...allSubmissions, ...cashData, ...inKindData];
      }
      setAllSubmissions(allSubmissions);
    } catch (error) {
      console.error('Error fetching data for analytics: ', error);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  if (loading) return <div className="loader"></div>;

  if (!user?.isMaster) {
    return (
      <div className="text-center p-8">
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p>You do not have permission to view this page.</p>
      </div>
    );
  }

  return <AnalyticsData allSubmissions={allSubmissions} committeeMembers={committeeMembers} />;
};

export default AnalyticsPage;
