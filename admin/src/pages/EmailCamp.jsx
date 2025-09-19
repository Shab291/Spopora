import { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { backend_url } from "../App";
import Subscribers from "../components/Subscribers";
import CreateCampaign from "../components/CreateCampaigns";
import { useAdminContext } from "../context/adminContext";

// Main Admin Dashboard Component
const EmailCampaignAdmin = () => {
  const { token } = useAdminContext();

  const [activeTab, setActiveTab] = useState("dashboard");
  const [campaigns, setCampaigns] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchDashBoardStats = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        backend_url + "/api/campaigns/getStats",
        { headers: { token } }
      );

      setCampaigns(response.data.stats.recentCampaigns || []);
      setStats(response.data.stats || {});
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Error fetching data");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashBoardStats();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 pt-2">
      <ToastContainer />
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Email Campaign</h1>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-2 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`inline-flex items-center py-2 border-b-2 text-sm font-medium ${
                  activeTab === "dashboard"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab("campaigns")}
                className={`inline-flex items-center px-4 py-2 border-b-2 text-sm font-medium ${
                  activeTab === "campaigns"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Campaigns
              </button>
              <button
                onClick={() => setActiveTab("subscribers")}
                className={`inline-flex items-center px-4 py-2 border-b-2 text-sm font-medium ${
                  activeTab === "subscribers"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Subscribers
              </button>
              <button
                onClick={() => setActiveTab("create")}
                className={`inline-flex items-center px-4 py-2 border-b-2 text-sm font-medium ${
                  activeTab === "create"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Create Campaign
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {activeTab === "dashboard" && (
              <Dashboard stats={stats} campaigns={campaigns} />
            )}
            {activeTab === "campaigns" && (
              <Campaigns
                campaigns={campaigns}
                fetchData={fetchDashBoardStats}
              />
            )}
            {activeTab === "subscribers" && <Subscribers />}
            {activeTab === "create" && <CreateCampaign />}
          </>
        )}
      </main>
    </div>
  );
};

// Dashboard Component
const Dashboard = ({ stats, campaigns }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Dashboard Overview</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-5">
          <h3 className="text-lg font-medium text-gray-900">
            Total Subscribers
          </h3>
          <p className="text-3xl font-bold text-blue-600">
            {stats.totalSubscribers || 0}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-5">
          <h3 className="text-lg font-medium text-gray-900">Total Campaigns</h3>
          <p className="text-3xl font-bold text-blue-600">
            {stats.totalCampaigns || 0}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-5">
          <h3 className="text-lg font-medium text-gray-900">Sent Campaigns</h3>
          <p className="text-3xl font-bold text-blue-600">
            {stats.sentCampaigns || 0}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-5">
          <h3 className="text-lg font-medium text-gray-900">
            Campaign With Images
          </h3>
          <p className="text-3xl font-bold text-blue-600">
            {stats.campaignsWithImages || 0}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-5">
          <h3 className="text-lg font-medium text-gray-900">
            Total Emails Sent
          </h3>
          <p className="text-3xl font-bold text-blue-600">
            {stats.totalEmailsSent || 0}
          </p>
        </div>
      </div>

      {/* Recent Campaigns */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Recent Campaigns
          </h3>
        </div>
        <div className="divide-y divide-gray-200">
          {campaigns.slice(0, 5).map((campaign) => (
            <div key={campaign._id} className="px-6 py-4">
              <div className="flex justify-between items-center">
                <h4 className="text-md font-medium text-gray-900">
                  {campaign.subject}
                </h4>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    campaign.status === "sent"
                      ? "bg-green-100 text-green-800"
                      : campaign.status === "scheduled"
                      ? "bg-yellow-100 text-yellow-800"
                      : campaign.status === "failed"
                      ? "bg-red-100 text-red-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {campaign.status}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {campaign.sentAt &&
                  `Sent: ${new Date(campaign.sentAt).toLocaleDateString()} | `}
                Recipients: {campaign.recipients}
                {campaign.opens !== undefined &&
                  campaign.opens > 0 &&
                  ` | Opens: ${campaign.opens}`}
              </p>
              {campaign.images && campaign.images.length > 0 && (
                <p className="text-sm text-gray-500">
                  Images: {campaign.images.length}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Campaigns List Component with Tabs
const Campaigns = ({ campaigns, fetchData }) => {
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [activeStatusTab, setActiveStatusTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const { token } = useAdminContext();

  // Filter campaigns based on active tab and search term
  const filteredCampaigns = campaigns.filter((campaign) => {
    // Filter by status tab
    if (activeStatusTab !== "all") {
      if (activeStatusTab === "active") {
        if (!(campaign.status === "draft" || campaign.status === "scheduled")) {
          return false;
        }
      } else if (campaign.status !== activeStatusTab) {
        return false;
      }
    }

    // Filter by search term
    if (
      searchTerm &&
      !campaign.subject.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }

    return true;
  });

  const deleteCampaign = async (id) => {
    if (!window.confirm("Are you sure you want to delete this campaign?"))
      return;

    try {
      const config = {
        headers: { token },
      };

      await axios.delete(`${backend_url}/api/campaigns/${id}`, config);
      toast.success("Campaign deleted successfully");
      fetchData();
    } catch (error) {
      toast.error("Error deleting campaign");
      console.error(error);
    }
  };

  const sendCampaign = async (id) => {
    try {
      const config = {
        headers: { token },
      };

      await axios.post(`${backend_url}/api/campaigns/${id}/send`, {}, config);
      toast.success("Campaign sent successfully");
      fetchData();
    } catch (error) {
      toast.error("Error sending campaign");
      console.error(error);
    }
  };

  const duplicateCampaign = async (campaign) => {
    try {
      const config = {
        headers: { token },
      };

      const { _id, sentAt, sent, failed, status, ...campaignData } = campaign;

      await axios.post(
        `${backend_url}/api/campaigns/create`,
        {
          ...campaignData,
          subject: `Copy of ${campaignData.subject}`,
        },
        config
      );

      toast.success("Campaign duplicated successfully");
      fetchData();
    } catch (error) {
      toast.error("Error duplicating campaign");
      console.error(error);
    }
  };

  const getStatusCount = (status) => {
    if (status === "active") {
      return campaigns.filter(
        (c) => c.status === "draft" || c.status === "scheduled"
      ).length;
    }
    if (status === "all") return campaigns.length;
    return campaigns.filter((c) => c.status === status).length;
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Email Campaigns</h2>

      {/* Status Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {["all", "active", "draft", "scheduled", "sent", "failed"].map(
            (tab) => (
              <button
                key={tab}
                onClick={() => setActiveStatusTab(tab)}
                className={`py-4 px-1 text-sm font-medium whitespace-nowrap ${
                  activeStatusTab === tab
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                <span className="ml-2 bg-gray-200 text-gray-800 text-xs px-2 py-0.5 rounded-full">
                  {getStatusCount(tab)}
                </span>
              </button>
            )
          )}
        </nav>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search campaigns..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {filteredCampaigns.length === 0 ? (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No campaigns found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {activeStatusTab !== "all"
                ? `No ${activeStatusTab} campaigns found.`
                : "Get started by creating a new campaign."}
            </p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subject
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Recipients
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Scheduled/Sent
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCampaigns.map((campaign) => (
                <tr key={campaign._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {campaign.subject}
                    </div>
                    <div className="text-sm text-gray-500">
                      {campaign.templateType}
                      {campaign.images && campaign.images.length > 0 && (
                        <span className="ml-2">
                          ({campaign.images.length} images)
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        campaign.status === "sent"
                          ? "bg-green-100 text-green-800"
                          : campaign.status === "scheduled"
                          ? "bg-yellow-100 text-yellow-800"
                          : campaign.status === "failed"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {campaign.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {campaign.recipients}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {campaign.createdAt
                      ? new Date(campaign.createdAt).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {campaign.scheduledFor
                      ? new Date(campaign.scheduledFor).toLocaleDateString()
                      : campaign.sentAt
                      ? new Date(campaign.sentAt).toLocaleDateString()
                      : "Not sent"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => setSelectedCampaign(campaign)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        View
                      </button>
                      {campaign.status === "draft" && (
                        <button
                          onClick={() => duplicateCampaign(campaign)}
                          className="text-purple-600 hover:text-purple-900 mr-3"
                        >
                          Duplicate
                        </button>
                      )}
                      {(campaign.status === "draft" ||
                        campaign.status === "scheduled") && (
                        <button
                          onClick={() => sendCampaign(campaign._id)}
                          className="text-green-600 hover:text-green-900 mr-3"
                        >
                          Send
                        </button>
                      )}
                      <button
                        onClick={() => deleteCampaign(campaign._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Campaign Detail Modal */}
      {selectedCampaign && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">
                {selectedCampaign.subject}
              </h3>
              <button
                onClick={() => setSelectedCampaign(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>
            <div className="mb-4">
              <h4 className="font-medium text-gray-700">Status</h4>
              <p>{selectedCampaign.status}</p>
            </div>
            <div className="mb-4">
              <h4 className="font-medium text-gray-700">Recipients</h4>
              <p>{selectedCampaign.recipients || 0}</p>
            </div>
            <div className="mb-4">
              <h4 className="font-medium text-gray-700">Created</h4>
              <p>
                {selectedCampaign.createdAt
                  ? new Date(selectedCampaign.createdAt).toLocaleString()
                  : "N/A"}
              </p>
            </div>
            <div className="mb-4">
              <h4 className="font-medium text-gray-700">
                {selectedCampaign.scheduledFor ? "Scheduled For" : "Sent"}
              </h4>
              <p>
                {selectedCampaign.scheduledFor
                  ? new Date(selectedCampaign.scheduledFor).toLocaleString()
                  : selectedCampaign.sentAt
                  ? new Date(selectedCampaign.sentAt).toLocaleString()
                  : "Not sent yet"}
              </p>
            </div>
            {selectedCampaign.images && selectedCampaign.images.length > 0 && (
              <div className="mb-4">
                <h4 className="font-medium text-gray-700">Images</h4>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {selectedCampaign.images.map((image, index) => (
                    <div key={index} className="border rounded p-2">
                      <img
                        src={image.secure_url}
                        alt={image.alt || `Image ${index + 1}`}
                        className="w-full h-32 object-cover"
                      />
                      <p className="text-sm text-gray-500 mt-1 truncate">
                        {image.alt}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="mb-4">
              <h4 className="font-medium text-gray-700">Content Preview</h4>
              <div
                className="border p-4 mt-2 max-h-64 overflow-y-auto"
                dangerouslySetInnerHTML={{ __html: selectedCampaign.content }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailCampaignAdmin;
