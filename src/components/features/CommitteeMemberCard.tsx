import { Submission } from '@/types/submission';

interface CommitteeMemberCardProps {
  member: {
    id: string;
    name: string;
    submissions: Submission[];
  };
  onViewSubmissions: (memberId: string) => void;
}

const CommitteeMemberCard = ({ member, onViewSubmissions }: CommitteeMemberCardProps) => {
  const totalSubmissions = member.submissions.length;
  const totalAmount = member.submissions
    .filter((s) => s.type === 'amount')
    .reduce((acc, s) => acc + (s as any).amount, 0);

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 m-4 w-full max-w-sm">
      <div className="flex items-center mb-4">
        <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-xl font-bold text-gray-600 dark:text-gray-300">
          {member.name.charAt(0)}
        </div>
        <div className="ml-4">
          <h2 className="text-2xl font-bold">{member.name}</h2>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 text-center">
        <div>
          <p className="text-gray-500 dark:text-gray-400">Total Submissions</p>
          <p className="text-2xl font-bold">{totalSubmissions}</p>
        </div>
        <div>
          <p className="text-gray-500 dark:text-gray-400">Total Amount</p>
          <p className="text-2xl font-bold">₹{totalAmount.toFixed(2)}</p>
        </div>
      </div>
      <div className="text-center mt-6">
        <button
          onClick={() => onViewSubmissions(member.id)}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out"
        >
          View Submissions
        </button>
      </div>
    </div>
  );
};

export default CommitteeMemberCard;
