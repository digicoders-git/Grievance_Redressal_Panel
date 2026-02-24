import { useState, useEffect, useCallback } from "react";
import PageMeta from "../components/common/PageMeta";
import {
  fetchAllGrievances,
  claimGrievance,
  fetchOfficerDashboardStats,
} from "../apis/officer";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { Link } from "react-router";

export default function Dashboard() {
  const { user } = useAuth();
  const [grievances, setGrievances] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pendingAvailable: 0,
    inProgress: 0,
    resolved: 0,
    rejected: 0,
  });
  const [loading, setLoading] = useState(false);

  const loadDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const [grievancesData, statsData] = await Promise.all([
        fetchAllGrievances(),
        fetchOfficerDashboardStats(),
      ]);
      setGrievances(grievancesData || []);
      if (statsData?.success) {
        setStats({
          total: statsData.stats.grievances.total,
          pendingAvailable: statsData.stats.grievances.pendingAvailable,
          inProgress: statsData.stats.grievances.inProgress,
          resolved: statsData.stats.grievances.resolved,
          rejected: statsData.stats.grievances.rejected,
        });
      }
    } catch (error) {
      toast.error("Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const handleClaim = async (id) => {
    try {
      await claimGrievance(id);
      toast.success("Grievance claimed successfully");
      loadDashboardData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to claim grievance");
    }
  };

  return (
    <>
      <PageMeta
        title="Dashboard | Officer Portal"
        description="Officer Grievance Dashboard"
      />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Officer Dashboard
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Welcome, {user?.name}! Manage incoming grievances from here.
            </p>
          </div>
          <Link
            to="/grievances"
            className="text-sm font-semibold text-brand-600 hover:text-brand-700 underline underline-offset-4 transition-all"
          >
            View All Grievances →
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="My Total"
            value={stats.total}
            color="brand"
            icon={
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
            }
          />
          <StatCard
            title="Pending (Unclaimed)"
            value={stats.pendingAvailable}
            color="warning"
            icon={
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            }
          />
          <StatCard
            title="My In Progress"
            value={stats.inProgress}
            color="blue"
            icon={
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              </svg>
            }
          />
          <StatCard
            title="My Resolved"
            value={stats.resolved}
            color="success"
            icon={
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            }
          />
        </div>

        {/* Recent Grievances */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Grievances
            </h2>
            <Link
              to="/grievances"
              className="text-xs font-semibold text-gray-400 hover:text-brand-500 transition-colors"
            >
              View All →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 dark:bg-gray-900/50">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Subject
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {loading ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-6 py-10 text-center text-gray-400 italic text-sm"
                    >
                      Loading...
                    </td>
                  </tr>
                ) : grievances.length === 0 ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-6 py-10 text-center text-gray-400 text-sm"
                    >
                      No grievances found.
                    </td>
                  </tr>
                ) : (
                  grievances.slice(0, 5).map((g) => (
                    <tr
                      key={g._id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/10 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          {g.studentId?.name || "—"}
                        </p>
                        <p className="text-[11px] text-gray-400">
                          {g.studentId?.enrollmentNumber}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 max-w-[200px] truncate">
                        {g.subject}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={g.status} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        {g.status === "Pending" && (
                          <button
                            onClick={() => handleClaim(g._id)}
                            className="px-3 py-1.5 text-xs font-bold bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 rounded-lg hover:bg-brand-100 transition-all"
                          >
                            Claim
                          </button>
                        )}
                        {g.status !== "Pending" && (
                          <Link
                            to={`/grievance/${g._id}`}
                            className="text-xs font-semibold text-brand-600 hover:text-brand-700"
                          >
                            Details →
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

function StatCard({ title, value, icon, color, loading }) {
  const theme = {
    brand:
      "bg-brand-50 text-brand-600 border-brand-100 dark:bg-brand-500/10 dark:text-brand-400 dark:border-brand-500/20",
    warning:
      "bg-orange-50 text-orange-600 border-orange-100 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20",
    blue: "bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20",
    success:
      "bg-success-50 text-success-600 border-success-100 dark:bg-success-500/10 dark:text-success-400 dark:border-success-500/20",
  };
  return (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center gap-4 hover:shadow-md transition-all">
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center border ${theme[color]}`}
      >
        {icon}
      </div>
      <div>
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
          {title}
        </p>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-0.5">
          {loading ? (
            <Loader size="h-6 w-6" className="justify-start mt-1" />
          ) : (
            value
          )}
        </h3>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const config = {
    Pending:
      "bg-orange-50 text-orange-600 border-orange-100 dark:bg-orange-500/10 dark:text-orange-400",
    "In Progress":
      "bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-500/10 dark:text-blue-400",
    Resolved:
      "bg-success-50 text-success-600 border-success-100 dark:bg-success-500/10 dark:text-success-400",
    Rejected:
      "bg-red-50 text-red-600 border-red-100 dark:bg-red-500/10 dark:text-red-400",
  };
  return (
    <span
      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${config[status] || config["Pending"]}`}
    >
      {status}
    </span>
  );
}
