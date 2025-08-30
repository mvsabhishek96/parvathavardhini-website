import { Submission } from '@/types/submission';

interface AnalyticsDataProps {
  allSubmissions: Submission[];
  committeeMembers: any[];
}

const AnalyticsData = ({ allSubmissions, committeeMembers }: AnalyticsDataProps) => {
  const totalAmount = allSubmissions
    .filter((s) => s.type === 'amount')
    .reduce((acc, s) => acc + (s as any).amount, 0);

  const totalSubmissions = allSubmissions.length;

  const memberStats = committeeMembers.map(member => {
    const memberSubmissions = allSubmissions.filter(s => (s as any).collectedBy === member.name);
    const memberTotalAmount = memberSubmissions
      .filter(s => s.type === 'amount')
      .reduce((acc, s) => acc + (s as any).amount, 0);
    return {
      ...member,
      totalSubmissions: memberSubmissions.length,
      totalAmount: memberTotalAmount,
    };
  }).sort((a, b) => b.totalAmount - a.totalAmount);

  const recentSubmissions = allSubmissions
    .sort((a, b) => (b.timestamp?.toDate().getTime() || 0) - (a.timestamp?.toDate().getTime() || 0))
    .slice(0, 10);

  return (
    <div className="analytics-container p-4 md:p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Submissions Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 text-center">
          <h2 className="text-xl font-bold text-gray-500 dark:text-gray-400">Total Amount Collected</h2>
          <p className="text-4xl font-bold mt-2">₹{totalAmount.toFixed(2)}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 text-center">
          <h2 className="text-xl font-bold text-gray-500 dark:text-gray-400">Total Submissions</h2>
          <p className="text-4xl font-bold mt-2">{totalSubmissions}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 text-center">
          <h2 className="text-xl font-bold text-gray-500 dark:text-gray-400">Active Members</h2>
          <p className="text-4xl font-bold mt-2">{committeeMembers.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 text-center">
          <h2 className="text-xl font-bold text-gray-500 dark:text-gray-400">Average Donation</h2>
          <p className="text-4xl font-bold mt-2">₹{(totalAmount / totalSubmissions || 0).toFixed(2)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <h2 className="text-3xl font-bold mb-6">Top Performing Members</h2>
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
            <ul>
              {memberStats.map((member, index) => (
                <li key={member.id} className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-lg font-bold text-gray-600 dark:text-gray-300 mr-4">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-lg">{member.name}</p>
                        <p className="text-gray-500 dark:text-gray-400">{member.totalSubmissions} submissions</p>
                      </div>
                    </div>
                    <p className="font-bold text-xl">₹{member.totalAmount.toFixed(2)}</p>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mt-2">
                    <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${(member.totalAmount / (memberStats[0].totalAmount || 1)) * 100}%` }}></div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-bold mb-6">Live Submissions Feed</h2>
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
            <ul>
              {recentSubmissions.map(submission => (
                <li key={submission.id} className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-bold">{submission.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">by {(submission as any).collectedBy}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{submission.type === 'amount' ? `₹${(submission as any).amount.toFixed(2)}` : (submission as any).description}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{submission.timestamp?.toDate().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsData;
