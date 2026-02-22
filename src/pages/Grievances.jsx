import { useState, useEffect, useCallback } from "react";
import PageMeta from "../components/common/PageMeta";
import {
  fetchAllGrievances,
  claimGrievance,
  resolveGrievance,
} from "../apis/officer";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import Loader from "../components/common/Loader";

export default function Grievances() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("All");
  const [resolveModal, setResolveModal] = useState(null); // holds grievance being resolved
  const [remarks, setRemarks] = useState("");
  const [resolveStatus, setResolveStatus] = useState("Resolved");
  const [submitting, setSubmitting] = useState(false);

  const loadGrievances = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchAllGrievances();
      setGrievances(data || []);
    } catch (error) {
      toast.error("Failed to fetch grievances");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGrievances();
  }, [loadGrievances]);

  const handleClaim = async (id) => {
    try {
      await claimGrievance(id);
      toast.success("Grievance claimed! You are now handling it.");
      loadGrievances();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to claim");
    }
  };

  const handleResolve = async () => {
    if (!remarks.trim()) {
      toast.error("Please enter remarks before submitting");
      return;
    }
    setSubmitting(true);
    try {
      await resolveGrievance(resolveModal._id, remarks, resolveStatus);
      toast.success(`Grievance marked as ${resolveStatus}`);
      setResolveModal(null);
      setRemarks("");
      loadGrievances();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update grievance",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const filtered =
    filter === "All"
      ? grievances
      : grievances.filter((g) => g.status === filter);

  const isMine = (g) =>
    g.handledBy?._id === user?._id || g.handledBy === user?._id;

  return (
    <>
      <PageMeta
        title="Grievances | Officer Portal"
        description="Manage grievances"
      />

      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            All Grievances
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Claim pending grievances or resolve the ones assigned to you.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          {["All", "Pending", "In Progress", "Resolved", "Rejected"].map(
            (s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all ${
                  filter === s
                    ? "bg-brand-600 text-white border-brand-600 shadow-sm"
                    : "bg-white dark:bg-gray-800 text-gray-500 border-gray-200 dark:border-gray-700 hover:border-brand-400 hover:text-brand-600"
                }`}
              >
                {s}
              </button>
            ),
          )}
        </div>

        {/* Table Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
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
                    Submitted
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Handled By
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {loading ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-12 text-center text-gray-400 italic text-sm"
                    >
                      Loading grievances...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-12 text-center text-gray-400 text-sm"
                    >
                      No grievances found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((g) => (
                    <tr
                      key={g._id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/10 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          {g.studentId?.name || "—"}
                        </p>
                        <p className="text-[11px] text-gray-400 mt-0.5">
                          {g.studentId?.enrollmentNumber}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p
                          className="text-sm text-gray-700 dark:text-gray-300 max-w-[120px] truncate"
                          title={g.subject}
                        >
                          {g.subject}
                        </p>
                        <p className="text-[10px] text-gray-400">
                          #{g._id.slice(-6).toUpperCase()}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {new Date(g.createdAt).toLocaleDateString("en-GB")}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={g.status} />
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {g.handledBy?.name || (
                          <span className="text-gray-300 italic">
                            Unassigned
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* Claim: only for Pending grievances */}
                          {g.status === "Pending" && (
                            <button
                              onClick={() => handleClaim(g._id)}
                              className="px-3 py-1.5 text-xs font-bold bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 rounded-lg hover:bg-brand-100 transition-all border border-brand-100 dark:border-brand-500/20"
                            >
                              Claim
                            </button>
                          )}
                          {/* Resolve/Reject: only officer who claimed it */}
                          {g.status === "In Progress" && isMine(g) && (
                            <button
                              onClick={() => {
                                setResolveModal(g);
                                setRemarks("");
                                setResolveStatus("Resolved");
                              }}
                              className="px-3 py-1.5 text-xs font-bold bg-success-50 dark:bg-success-500/10 text-success-600 dark:text-success-400 rounded-lg hover:bg-success-100 transition-all border border-success-100 dark:border-success-500/20"
                            >
                              Resolve
                            </button>
                          )}
                          {/* View details */}
                          <button
                            onClick={() => navigate(`/grievance/${g._id}`)}
                            className="text-xs font-semibold text-gray-400 hover:text-brand-600 transition-colors"
                          >
                            Details
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Resolve Modal */}
      {resolveModal && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 w-full max-w-md p-6 space-y-5">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Resolve Grievance
              </h3>
              <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                {resolveModal.subject}
              </p>
            </div>

            {/* Status Select */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                Final Status
              </label>
              <div className="flex gap-3">
                {["Resolved", "Rejected"].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setResolveStatus(s)}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                      resolveStatus === s
                        ? s === "Resolved"
                          ? "bg-success-50 text-success-600 border-success-200 dark:bg-success-500/10 dark:text-success-400"
                          : "bg-red-50 text-red-600 border-red-200 dark:bg-red-500/10 dark:text-red-400"
                        : "bg-gray-50 dark:bg-gray-900 text-gray-400 border-gray-200 dark:border-gray-700"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Remarks */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                Remarks <span className="text-red-400">*</span>
              </label>
              <textarea
                rows={4}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Enter your remarks or resolution notes..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-300 outline-none transition-all resize-none"
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setResolveModal(null)}
                className="px-5 py-2.5 text-sm font-medium text-gray-500 hover:text-gray-700 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleResolve}
                disabled={submitting}
                className="px-6 py-2.5 text-sm font-semibold bg-brand-600 hover:bg-brand-700 text-white rounded-xl shadow-sm transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
              >
                {submitting && (
                  <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
                )}
                {submitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
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
