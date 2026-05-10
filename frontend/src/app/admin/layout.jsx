import Sidebar from "@/Components/AdminComponents/Sidebar";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Toaster } from 'react-hot-toast';
import { AppProvider } from "@/context/AppContext";
import Navbar from "@/Components/Navbar";
import PrivateComponent from "@/Components/privateComponent";

export default function Layout({ children }) {
  return (
    <PrivateComponent>
      <AppProvider>
        <div className="flex h-screen bg-gray-50 overflow-hidden">
          <Sidebar />
          <div className="flex flex-col flex-1 overflow-hidden">
            <Navbar />
            <main className="flex-1 overflow-y-auto">
              {children}
            </main>
          </div>
        </div>
        {/* react-toastify — used by addBlog page */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
          theme="light"
          toastClassName="text-sm"
        />
        {/* react-hot-toast — used by context and table components */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: { fontSize: '14px' },
          }}
        />
      </AppProvider>
    </PrivateComponent>
  );
}
