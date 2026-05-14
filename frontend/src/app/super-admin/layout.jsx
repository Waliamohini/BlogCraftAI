import { assets } from "@/Assets/assets";
import Sidebar from "@/Components/AdminComponents/newSidebar";
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AppProvider } from "@/context/AppContext";
import PrivateComponent from "@/Components/privateComponent";
export default function Layout({ children }) {
    return (
      <PrivateComponent>
        <AppProvider>
<div className="flex flex-col w-full min-h-screen bg-[#0f1117]">
  <div className="flex flex-row w-full flex-1">
    <div className="flex-shrink-0">
      <Sidebar />
    </div>
    <div className="flex flex-col flex-1 overflow-hidden">
      {children}
    </div>
  </div>
</div>
        </AppProvider>
        </PrivateComponent>
    )
}
