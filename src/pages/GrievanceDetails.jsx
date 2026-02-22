import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import PageMeta from "../components/common/PageMeta";
import {
  fetchAllGrievances,
  claimGrievance,
  resolveGrievance,
} from "../apis/officer";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import Loader from "../components/common/Loader";

export default function GrievanceDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [grievance, setGrievance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [remarks, setRemarks] = useState("");
  const [resolveStatus, setResolveStatus] = useState("Resolved");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const all = await fetchAllGrievances();
        const found = all.find((g) => g._id === id);
        if (!found) {
          toast.error("Grievance not found");
          navigate("/grievances");
          return;
        }
        setGrievance(found);
        if (found.remarks) setRemarks(found.remarks);
      } catch {
        toast.error("Failed to load grievance");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, navigate]);

  const handleClaim = async () => {
    try {
      await claimGrievance(id);
      toast.success("Grievance claimed successfully");
      const all = await fetchAllGrievances();
      setGrievance(all.find((g) => g._id === id));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to claim");
    }
  };

  const handleResolve = async () => {
    if (!remarks.trim()) {
      toast.error("Please enter remarks");
      return;
    }
    setSubmitting(true);
    try {
      await resolveGrievance(id, remarks, resolveStatus);
      toast.success(`Grievance marked as ${resolveStatus}`);
      const all = await fetchAllGrievances();
      setGrievance(all.find((g) => g._id === id));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update");
    } finally {
      setSubmitting(false);
    }
  };

  const isMine =
    grievance?.handledBy?._id === user?._id ||
    grievance?.handledBy === user?._id;

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="w-8 h-8 border-4 border-brand-500/20 border-t-brand-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!grievance) return null;

  return (
    <>
      <PageMeta
        title="Grievance Details | Officer Portal"
        description="Grievance details"
      />

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Grievance Details
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Full information about this grievance.
            </p>
          </div>
          <button
            onClick={() => navigate("/grievances")}
            className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-brand-600 transition-all"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to List
          </button>
        </div>

        <div className="space-y-6">
          {/* Meta + Status Row */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
            <div className="flex flex-col md:flex-row gap-6 pb-6 mb-6 border-b border-gray-100 dark:border-gray-700">
              <div className="flex-1">
                <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">
                  Grievance ID
                </p>
                <p className="text-sm font-bold text-gray-900 dark:text-white">
                  #{grievance._id.slice(-8).toUpperCase()}
                </p>
              </div>
              <div className="flex-1">
                <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">
                  Submitted
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {new Date(grievance.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="flex-1">
                <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">
                  Deadline
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {new Date(grievance.deadline).toLocaleDateString()}
                </p>
              </div>
              <div>
                <StatusBadge status={grievance.status} />
              </div>
            </div>

            {/* Subject */}
            <div className="space-y-1 mb-5">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-tight">
                Subject
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {grievance.subject}
              </p>
            </div>

            {/* Description */}
            <div className="space-y-1 mb-5">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-tight">
                Description
              </p>
              <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">
                  {grievance.description}
                </p>
              </div>
            </div>

            {/* Attachment */}
            {grievance.attachment && (
              <div className="space-y-1">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-tight">
                  Attachment
                </p>
                <a
                  href={grievance.attachment}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 rounded-lg text-sm font-semibold hover:bg-brand-100 transition-all border border-brand-100 dark:border-brand-500/20"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                  </svg>
                  View Attachment
                </a>
              </div>
            )}
          </div>

          {/* Student Info */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-tight mb-4">
              Student Information
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <DetailItem label="Name" value={grievance.studentId?.name} />
              <DetailItem
                label="Enrollment No"
                value={grievance.studentId?.enrollmentNumber}
              />
              <DetailItem label="Mobile" value={grievance.studentId?.mobile} />
              <DetailItem label="Branch" value={grievance.studentId?.branch} />
              <DetailItem label="Year" value={grievance.studentId?.year} />
              <DetailItem
                label="College"
                value={grievance.studentId?.college}
              />
            </div>
          </div>

          {/* Officer Action Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-tight mb-4">
              Officer Actions
            </p>

            {/* Unassigned — show Claim button */}
            {grievance.status === "Pending" && (
              <div className="flex items-start gap-4 p-4 bg-orange-50 dark:bg-orange-500/5 rounded-xl border border-orange-100 dark:border-orange-500/10">
                <svg
                  className="text-orange-500 mt-0.5 shrink-0"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-orange-800 dark:text-orange-200">
                    Not yet assigned
                  </p>
                  <p className="text-xs text-orange-600/70 mt-0.5">
                    Claim this grievance to start working on it.
                  </p>
                </div>
                <button
                  onClick={handleClaim}
                  className="px-5 py-2.5 text-sm font-bold bg-brand-600 hover:bg-brand-700 text-white rounded-xl shadow-sm transition-all active:scale-95"
                >
                  Claim
                </button>
              </div>
            )}

            {/* In Progress — show resolve/reject form if mine */}
            {grievance.status === "In Progress" && (
              <div>
                <div className="mb-4 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-brand-500 flex items-center justify-center text-white font-bold uppercase text-sm">
                    {grievance.handledBy?.name?.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                      {grievance.handledBy?.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {grievance.handledBy?.designation} ·{" "}
                      {grievance.handledBy?.department}
                    </p>
                  </div>
                </div>

                {isMine ? (
                  <div className="space-y-4 mt-4">
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
                          Mark as {s}
                        </button>
                      ))}
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Remarks <span className="text-red-400">*</span>
                      </label>
                      <textarea
                        rows={4}
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                        placeholder="Enter your resolution remarks..."
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-300 outline-none transition-all resize-none"
                      />
                    </div>
                    <div className="flex justify-end">
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
                ) : (
                  <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-500">
                      This grievance is being handled by another officer.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Resolved/Rejected — show final remarks */}
            {(grievance.status === "Resolved" ||
              grievance.status === "Rejected") && (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-brand-500 flex items-center justify-center text-white font-bold uppercase text-sm">
                    {grievance.handledBy?.name?.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                      {grievance.handledBy?.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {grievance.handledBy?.designation} ·{" "}
                      {grievance.handledBy?.department}
                    </p>
                  </div>
                </div>
                {grievance.remarks && (
                  <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-700">
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">
                      Remarks
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                      {grievance.remarks}
                    </p>
                  </div>
                )}
                {grievance.resolvedAt && (
                  <p className="text-xs text-gray-400">
                    Resolved on:{" "}
                    {new Date(grievance.resolvedAt).toLocaleString()}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function DetailItem({ label, value }) {
  return (
    <div className="space-y-1">
      <span className="text-xs font-medium text-gray-400 uppercase tracking-tight">
        {label}
      </span>
      <p className="text-sm font-medium text-gray-900 dark:text-white">
        {value || "N/A"}
      </p>
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
