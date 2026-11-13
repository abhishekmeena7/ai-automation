import { useEffect, useState } from "react";
import { PlusIcon } from "lucide-react";
import AccountList from "../components/AccountList";
import PlatformPickerModel from "../components/PlatformPickerModel";
import toast from "react-hot-toast";
import api from "../api/axios";
import { PLATFORMS } from "../assets/assets";

const Accounts = () => {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [connecting, setConnecting] = useState<string | null>(null);
  const [showPlatformPicker, setShowPlatformPicker] = useState(false);


  const fetchAccounts = async (isSync = false, platform?: string | null, successMsg?: string) => {

    try {
      if (isSync) {
        const label = platform ? platform.charAt(0).toUpperCase() + platform.slice(1) : "Social Media"
        toast.loading(`syncing ${label} account...`, { id: "sync" })
        await api.get("/api/oauth/sync")
        toast.success(successMsg || "account synced", { id: "sync" })
      }
      const { data } = await api.get("/api/accounts")
      console.log("Accounts API Response:", data);
      setAccounts(data)
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.message || "failded to load accounts")
    }
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const connectedPlatform = params.get("connected");
    const connectedUsername = params.get("username");
    const syncNeeded = params.get("sync") === "true";
    const errorMsg = params.get("error")

    window.history.replaceState({}, document.title, window.location.pathname)
    if (connectedPlatform) {
      const label = connectedPlatform.charAt(0).toUpperCase() + connectedPlatform.slice(1);
      const handle = connectedPlatform ? `(@${connectedUsername})` : ""
      fetchAccounts(true, connectedPlatform, `${label}${handle} connected!`)
    } else if (errorMsg) {
      toast.error(`connection failed:${decodeURIComponent(errorMsg)}`)
      fetchAccounts();
    } else if (syncNeeded) {
      fetchAccounts(true, null, "account synced")
    } else {
      fetchAccounts()

    }


  }, [])

  const handleConnect = async (platformId: string) => {
    setConnecting(platformId)

    try {
      const { data } = await api.get(`/api/oauth/${platformId}/url`);
      window.location.href = data.url;

    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.message || `failed to connect ${platformId}`)

      setConnecting(null)
    }
  }

  const handleDisconnect = async (accountId: string) => {
    try {
      await api.delete(`/api/accounts/${accountId}`)
      toast.success("account disconnected")
      await fetchAccounts();
    } catch (error:any) {
      toast.error(error?.response?.data?.message || error?.message || `failed to disconnect account`)

      
    }
  };

  const connectedIds = accounts.map((a) => a.platform);

  return (
    <div className="space-y-8 max-w-4xl">
      {/* header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-sm">
        <div>
          <h2 className="text-xl text-slate-900">connected accounts</h2>
          <p className="text-slate-500 text-sm mt-0.5">
            {accounts.length} of {PLATFORMS.length} platforms connnected
          </p>
        </div>
        <button
          onClick={() => {
            setShowPlatformPicker(true);
          }}
          className="flex items-center gap-2 px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-full font-medium transition-all w-full sm:w-auto justify-center"
        >
          <PlusIcon className="size-4" /> connect account
        </button>
      </div>

      {/* platfomr picker model */}
      {showPlatformPicker && <PlatformPickerModel connectedIds={connectedIds} connecting={connecting} onClose={() => setShowPlatformPicker(false)} onConnect={handleConnect} />}
      {/* connnected accounts lists */}

      <AccountList accounts={accounts} onDisconnect={handleDisconnect} />
    </div>
  );
};

export default Accounts;
